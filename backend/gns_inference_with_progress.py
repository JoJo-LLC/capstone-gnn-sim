#!/usr/bin/env python3
"""
Standalone GNS inference script with real step-by-step progress tracking.
This is a separate implementation that provides true progress updates during rollout.
"""
import collections
import json
import numpy as np
import os
import os.path as osp
import sys
import torch
import glob
import time
from absl import flags
from absl import app

# Add GNS fragment to path
sys.path.append("/app/gns-fragment")

from gns import learned_simulator
from gns import reading_utils
from gns import post_processing

# Path
flags.DEFINE_string('data_path', r'/app/src/0.4_6', help='The dataset directory.')
flags.DEFINE_string('model_path', './model_4_inference/NS5e-4_1e-2_R14_L5N64_PosNsx10/', help=(
    'The path for saving checkpoints of the model.'))
flags.DEFINE_string('model_file', 'model-066000.pt', help=('Model filename (.pt) to resume from.'))

# Model parameters
flags.DEFINE_float('connection_radius', 14, help='connectivity radius for graph.')
flags.DEFINE_integer('layers', 5, help='Number of GNN layers.')
flags.DEFINE_integer('hidden_dim', 64, help='Number of neurons in hidden layers.')
flags.DEFINE_integer('dim', 3, help='The dimension of concrete simulation.')
flags.DEFINE_float('noise_std', 5e-4, help='The std deviation of the noise.')
flags.DEFINE_list('detonation_xy', '0, 0', 'A comma-separated values for xy coordinates of detonation point')

# Inference parameters
flags.DEFINE_integer('nsteps', 81, help='The total number of rollout steps. Each step is 0.06 ms.')

# Post-processing parameters
flags.DEFINE_bool('expanded_search', False, help='If to serch fragments in expanded area. Takes long.')

FLAGS = flags.FLAGS

SampleData = collections.namedtuple('SampleData', ['positions', 
                                                   'particle_type', 
                                                   'n_particles_per_example',
                                                   'particle_strains',
                                                   'meta_feature'])

INPUT_SEQUENCE_LENGTH = 10
NUM_PARTICLE_TYPES = 3
REBAR_PARTICLE_ID = 1
BOUNDARY_PARTICLE_ID = 2

def _get_simulator(metadata, acc_noise_std, vel_noise_std, device):
    """Instantiates the simulator."""
    acc_noise_std = torch.FloatTensor([0.0005, 0.0005, 0.01])
    vel_noise_std = torch.FloatTensor([0.0005, 0.0005, 0.01])
    pos_noise_std = torch.FloatTensor([0.005, 0.005, 0.05])
    
    acc_mean = torch.FloatTensor(metadata['acc_mean']).to(device)
    acc_std = torch.sqrt(torch.FloatTensor(metadata['acc_std']) ** 2 + acc_noise_std ** 2).to(device)
    
    vel_mean = torch.FloatTensor(metadata['vel_mean']).to(device)
    vel_std = torch.sqrt(torch.FloatTensor(metadata['vel_std']) ** 2 + vel_noise_std ** 2).to(device)

    pos_mean = torch.FloatTensor(metadata['pos_mean']).to(device)
    pos_std = torch.sqrt(torch.FloatTensor(metadata['pos_std']) ** 2 + pos_noise_std ** 2).to(device)
    
    # Normalization stats
    normalization_stats = {
        'acceleration': {'mean': acc_mean, 'std': acc_std},
        'velocity':    {'mean': vel_mean, 'std': vel_std},
        'position':     {'mean': pos_mean, 'std': pos_std}
    }
    
    simulator = learned_simulator.LearnedSimulator(
        particle_dimensions=FLAGS.dim,
        nnode_in=(INPUT_SEQUENCE_LENGTH - 1) * FLAGS.dim + 16 + 8,
        nedge_in=FLAGS.dim + 1,
        latent_dim=FLAGS.hidden_dim,
        nmessage_passing_steps=FLAGS.layers,
        nmlp_layers=1,
        mlp_hidden_dim=FLAGS.hidden_dim,
        connectivity_radius=FLAGS.connection_radius,
        boundaries=np.array(metadata['bounds']),
        normalization_stats=normalization_stats,
        nparticle_types=NUM_PARTICLE_TYPES,
        particle_type_embedding_size=16,
        device=device)

    return simulator

@torch.no_grad()
def rollout_with_progress(simulator, initial_positions, particle_type, n_particles_per_example, 
                         initial_strains, meta_feature, nsteps, particle_dim, device):
    """Rolls out a trajectory with step-by-step progress output."""
    
    current_positions = initial_positions
    pred_positions = []
    pred_strains = []
    
    boundary_mask = (particle_type == BOUNDARY_PARTICLE_ID).clone().detach().to(device)
    boundary_mask = boundary_mask.bool()[:, None].expand(-1, particle_dim)
    
    start_time = time.time()
    
    print("ROLLOUT_START: Beginning step-by-step inference...", flush=True)
    
    for step in range(nsteps):
        step_start_time = time.time()
        
        # Get next position with shape (nnodes, dim)
        next_position, pred_strain = simulator.predict_positions(
            current_positions,
            nparticles_per_example=[n_particles_per_example],
            particle_types=particle_type,
            meta_feature=meta_feature
        )
        
        next_position = torch.where(boundary_mask, initial_positions[:, 0], next_position)
        pred_strain = torch.where(boundary_mask[:, 0], initial_strains[0], pred_strain)

        # Shift positions
        current_positions = torch.cat([current_positions[:, 1:], next_position[:, None, :]], dim=1)
        
        pred_positions.append(next_position)
        pred_strains.append(pred_strain)
        
        # Calculate progress metrics
        step_time = time.time() - step_start_time
        elapsed_time = time.time() - start_time
        avg_step_time = elapsed_time / (step + 1)
        remaining_steps = nsteps - (step + 1)
        eta_seconds = remaining_steps * avg_step_time
        simulated_time = (step + 1) * 0.06
        
        # Output real progress - THIS IS THE KEY DIFFERENCE
        print(f"PROGRESS: Step {step + 1}/{nsteps} completed in {step_time:.2f}s | "
              f"Avg: {avg_step_time:.2f}s/step | ETA: {eta_seconds:.0f}s | "
              f"Time: {simulated_time:.2f}ms simulated", flush=True)
        
    run_time = time.time() - start_time
    print(f"ROLLOUT_COMPLETE: Finished rollout in {run_time:.0f}s", flush=True)
    
    # Predictions with shape (time, nnodes, dim)
    pred_positions = torch.stack(pred_positions)
    pred_strains = torch.stack(pred_strains)   
    
    initial_positions = initial_positions.permute(1, 0, 2)
    pred_trajs = torch.concatenate((initial_positions, pred_positions), axis=0)
    
    pred_strains[pred_strains < 0] = 0
    pred_strains = torch.concatenate((initial_strains, pred_strains), axis=0).cumsum(axis=0)
    pred_strains[pred_strains > 2] = 2
    
    output_dict = {
        'pred_trajs': pred_trajs.cpu().numpy(),
        'pred_strains': pred_strains.cpu().numpy(),
        'particle_type': particle_type.cpu().numpy(),
        'run_time': run_time
    }
            
    return output_dict

def load_sample(sample_path, charge_weight, metadata, device):
    data = np.load(sample_path)
    positions = data['particle_trajectories'].transpose((1, 0, 2))
    particle_type = data['particle_type']
    particle_strains = data['particle_strains']    

    meta_feature = np.array([0, 0, 400, 0, 0, 5, 30])
    meta_feature[-2] = float(charge_weight)
    meta_feature = (meta_feature - metadata['meta_mean']) / metadata['meta_std']
    
    sample_data = SampleData(
        positions=torch.tensor(positions, dtype=torch.float32).contiguous().to(device),
        particle_type=torch.tensor(particle_type, dtype=torch.int32).contiguous().to(device),
        n_particles_per_example=torch.tensor(positions.shape[0], dtype=torch.int32).to(device),
        particle_strains=torch.tensor(particle_strains, dtype=torch.float32).contiguous().to(device),
        meta_feature=torch.tensor(meta_feature, dtype=torch.float32).to(device)
    )
    
    return sample_data
    
def main(_):
    # Initialisation
    device = 'cpu'
    metadata = reading_utils.read_metadata(FLAGS.data_path)
    simulator = _get_simulator(metadata, FLAGS.noise_std, FLAGS.noise_std, device)
    
    # Load weights
    try:
        simulator.load(FLAGS.model_path + FLAGS.model_file)
    except:
        print("Failed to load model weights!")
        sys.exit(1)
        
    simulator.to(device)
    simulator.eval()
    
    # Create output directory
    output_path = osp.join(FLAGS.data_path, 'output')
    os.makedirs(output_path, exist_ok=True)
    
    # Adjust rollout steps
    nsteps = FLAGS.nsteps - 10
    
    # Find NPZ files
    dataset = glob.glob(osp.join(FLAGS.data_path, '**', '*.npz'), recursive=True)
    
    # Define detonation coordinates
    detonation_xy = [float(x) for x in FLAGS.detonation_xy]
    
    print(f"INITIALIZATION: Starting FGN inference with {nsteps} rollout steps", flush=True)
    
    # Inference for each case
    for idx, sample_path in enumerate(dataset):
        case_start_time = time.time()
        print(f"CASE_START: {idx+1}/{len(dataset)} FGN Inference on {osp.basename(sample_path)}...", flush=True)
        
        case_name = osp.basename(osp.dirname(sample_path))
        charge_weight = float(case_name.split('_')[-1])
        sample_data = load_sample(sample_path, charge_weight, metadata, device)
        
        # Predict with progress tracking
        sample_output = rollout_with_progress(simulator, *sample_data, nsteps, FLAGS.dim, device)
        
        case_rollout_time = time.time() - case_start_time
        
        # Post-processing
        print("POSTPROCESS_START: Beginning post-processing...", flush=True)
        post_processing_start_time = time.time()
        
        post_processing.main(sample_path, charge_weight, detonation_xy, FLAGS.expanded_search,
                           sample_output['pred_trajs'], sample_output['pred_strains'], 
                           sample_output['particle_type'], nsteps + 10)
        
        postprocessing_time = time.time() - post_processing_start_time
        print(f"POSTPROCESS_COMPLETE: Post-processing finished in {postprocessing_time:.0f}s", flush=True)
        print(f"CASE_COMPLETE: Total time {case_rollout_time:.0f}s "
              f"({case_rollout_time - postprocessing_time:.0f}s rollout + {postprocessing_time:.0f}s post-processing)", flush=True)
        
if __name__ == '__main__':
    app.run(main)