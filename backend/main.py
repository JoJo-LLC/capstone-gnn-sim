from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import psutil
import sys
import json
import numpy as np
from pathlib import Path

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "FastAPI backend is running"}

# Mustefa's file upload endpoint
@app.post("/uploadfile/")
async def upload_file(file: UploadFile = File(...)):
    if not file.filename.endswith('.npz'):
        raise HTTPException(status_code=400, detail="Only .npz files are allowed")
   
    file_location = f"uploaded_files/{file.filename}"
   
    # Ensure the directory exists
    os.makedirs(os.path.dirname(file_location), exist_ok=True)
   
    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
   
    return {"filename": file.filename, "location": file_location}

# Mustefa's simulation endpoint
@app.post("/run_simulation/")
async def run_simulation(body: BaseModel):
    # Implement your simulation logic here
    return {"message": "Simulation started", "data": body}

# Mustefa's status endpoint
@app.get("/status/")
async def get_status():
    # Implement your status logic here
    return {"status": "Simulation is running"}

# Mustefa's export endpoint
@app.get("/export/{filename}")
async def export_file(filename: str):
    file_location = f"uploaded_files/{filename}"
    if not os.path.exists(file_location):
        raise HTTPException(status_code=404, detail="File not found")
    return {"filename": filename, "location": file_location}

# Mustefa's resource usage endpoint
@app.get("/system/resource_usage")
async def get_resource_usage():
    cpu_usage = psutil.cpu_percent(interval=1)
    memory_info = psutil.virtual_memory()
    return {
        "cpu_usage": cpu_usage,
        "memory_total": memory_info.total,
        "memory_used": memory_info.used,
        "memory_free": memory_info.free
    }

# GNS test endpoint
@app.get("/test-gns")
def test_gns():
    """Test endpoint to verify GNS fragment integration"""
    try:
        # Add GNS fragment to Python path
        gns_path = "/app/gns-fragment"
        if gns_path not in sys.path:
            sys.path.append(gns_path)
       
        # Test imports
        import torch
        import torch_geometric
       
        # Try to import GNS modules
        import gns
       
        return {
            "status": "success",
            "message": "GNS fragment integration working",
            "torch_version": torch.__version__,
            "gns_path_exists": os.path.exists("/app/gns-fragment"),
            "gns_files": os.listdir("/app/gns-fragment") if os.path.exists("/app/gns-fragment") else []
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"GNS integration failed: {str(e)}",
            "error_type": type(e).__name__
        }

# Jordan's MongoDB test endpoint  
@app.get("/test-db")
def test_database():
    """Test endpoint to verify MongoDB connection"""
    try:
        # Import the database connection
        from database_connection import DatabaseConnection
        
        # Test connection
        db = DatabaseConnection()
        connection_success = db.connection_test()
        
        return {
            "status": "success" if connection_success else "error",
            "message": "MongoDB connection working" if connection_success else "MongoDB connection failed",
            "database_name": db.db.name if connection_success else None
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Database test failed: {str(e)}",
            "error_type": type(e).__name__
        }

# Joe's d3plot to NPZ conversion endpoint
@app.post("/convert-d3plot-to-npz/")
async def convert_d3plot_to_npz(d3plot_path: str = None):
    """Convert LS-DYNA d3plot files to NPZ format using GNS Fragment conversion tools"""
    try:
        # Add GNS fragment to Python path
        gns_path = "/app/gns-fragment"
        if gns_path not in sys.path:
            sys.path.append(gns_path)
        
        # Import GNS conversion modules
        from lsdyna.read_d3plot import extract_trajectory_type_strain, D3plot
        from lsdyna.check_data_integrity import check_data_integrity
        from lsdyna.data_processing import enforce_eps_non_decreasing, timestep_downsample
        
        # Use provided path or default to example data
        if d3plot_path is None:
            d3plot_path = "/app/src/lsdyna-output2/d3plot"
        
        # Check if d3plot file exists
        if not os.path.exists(d3plot_path):
            raise HTTPException(status_code=404, detail=f"d3plot file not found at: {d3plot_path}")
        
        # Load d3plot file with error handling for SPH compatibility issues
        try:
            d3plot = D3plot(d3plot_path)
        except RuntimeError as re:
            if "isphfg" in str(re) and "must be 11" in str(re):
                return {
                    "status": "error",
                    "message": "d3plot file has SPH element compatibility issue with lasso-python",
                    "error_type": "SPH_Compatibility_Error",
                    "detailed_error": str(re),
                    "possible_solutions": [
                        "Use LS-PrePost to export d3plot in a compatible format",
                        "Convert d3plot to ASCII format first",
                        "Update LS-DYNA d3plot file generation settings",
                        "Use alternative file formats like binout or ASCII results"
                    ],
                    "file_info": {
                        "path": d3plot_path,
                        "size_mb": round(os.path.getsize(d3plot_path) / (1024*1024), 2) if os.path.exists(d3plot_path) else 0
                    }
                }
            else:
                raise re
        
        # Extract data from d3plot
        particle_trajectories, particle_type, particle_strains = extract_trajectory_type_strain(d3plot)
        
        # Data processing (same as in original GNS script)
        particle_strains = enforce_eps_non_decreasing(particle_strains)
        particle_trajectories, particle_strains = timestep_downsample(particle_trajectories, particle_strains)
        
        # Perform integrity check
        try:
            check_data_integrity(particle_trajectories, particle_strains, particle_type)
        except ValueError as e:
            raise HTTPException(status_code=400, detail=f"Data integrity check failed: {str(e)}")
        
        # Create output directory and filename
        output_dir = "/app/src/converted_npz"
        os.makedirs(output_dir, exist_ok=True)
        
        # Generate output filename based on input path
        input_path = Path(d3plot_path)
        output_filename = f"{input_path.parent.name}_converted.npz"
        output_path = os.path.join(output_dir, output_filename)
        
        # Save data as NPZ file
        np.savez(output_path,
                 particle_trajectories=particle_trajectories,
                 particle_strains=particle_strains,
                 particle_type=particle_type)
        
        return {
            "status": "success",
            "message": "d3plot successfully converted to NPZ format",
            "input_path": d3plot_path,
            "output_path": output_path,
            "output_filename": output_filename,
            "data_shapes": {
                "particle_trajectories": particle_trajectories.shape,
                "particle_strains": particle_strains.shape,
                "particle_type": particle_type.shape
            }
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"d3plot conversion failed: {str(e)}",
            "error_type": type(e).__name__
        }

# Joe's d3plot file analysis endpoint
@app.get("/analyze-d3plot/")
async def analyze_d3plot(d3plot_path: str = None):
    """Analyze d3plot file structure and provide file information"""
    try:
        # Use provided path or default to example data
        if d3plot_path is None:
            d3plot_path = "/app/src/lsdyna-output2/d3plot"
        
        # Check if d3plot file exists
        if not os.path.exists(d3plot_path):
            raise HTTPException(status_code=404, detail=f"d3plot file not found at: {d3plot_path}")
        
        # Get file information
        file_stats = os.stat(d3plot_path)
        file_size_mb = round(file_stats.st_size / (1024*1024), 2)
        
        # Check for related files in the same directory
        d3plot_dir = os.path.dirname(d3plot_path)
        d3plot_files = [f for f in os.listdir(d3plot_dir) if f.startswith('d3plot')]
        
        # Try to read basic header information (without full loading)
        try:
            from lasso.dyna import D3plot
            
            # Try to read just basic info without full parsing
            with open(d3plot_path, 'rb') as f:
                # Read first few bytes to get basic info
                header_data = f.read(1024)
            
            file_info = {
                "status": "readable",
                "header_size": len(header_data),
                "can_analyze": True
            }
        except Exception as e:
            file_info = {
                "status": "analysis_failed", 
                "error": str(e),
                "can_analyze": False
            }
        
        return {
            "status": "success",
            "file_path": d3plot_path,
            "file_size_mb": file_size_mb,
            "related_files": d3plot_files,
            "file_info": file_info,
            "recommendations": [
                "Ensure d3plot was generated with SPH element flag isphfg=11",
                "Check LS-DYNA version compatibility",
                "Consider exporting to ASCII format for debugging",
                "Verify all d3plot sequence files (d3plot01, d3plot02, etc.) are present"
            ]
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"d3plot analysis failed: {str(e)}",
            "error_type": type(e).__name__
        }

# Joe's FGN inference endpoint - preparation phase
@app.post("/fgn-inference/prepare/")
async def prepare_fgn_inference():
    """Prepare for FGN inference by locating required files and validating setup"""
    try:
        # File paths to locate
        npz_file = "T-20-100-150.npz"
        model_dir = "gns-fragment-reference/model_4_inference/NS5e-4_1e-2_R14_L5N64_PosNsx10"
        model_file = "model-066000.pt"
        gns_inference_script = "gns-fragment-reference/gns/inference.py"
        metadata_file = "gns-fragment-reference/metadata.json"
        
        # Check if all required files exist
        file_checks = {}
        
        # Check NPZ input file
        npz_path = os.path.join(os.getcwd(), npz_file)
        file_checks["input_npz"] = {
            "path": npz_path,
            "exists": os.path.exists(npz_path),
            "purpose": "Input data for FGN inference"
        }
        
        # Check model file
        model_path = os.path.join(os.getcwd(), model_dir, model_file)
        file_checks["model"] = {
            "path": model_path,
            "exists": os.path.exists(model_path),
            "purpose": "Pre-trained FGN model weights",
            "size_mb": round(os.path.getsize(model_path) / (1024*1024), 2) if os.path.exists(model_path) else 0
        }
        
        # Check GNS inference script
        inference_script_path = os.path.join(os.getcwd(), gns_inference_script)
        file_checks["inference_script"] = {
            "path": inference_script_path,
            "exists": os.path.exists(inference_script_path),
            "purpose": "FGN inference execution script"
        }
        
        # Check metadata file
        metadata_path = os.path.join(os.getcwd(), metadata_file)
        file_checks["metadata"] = {
            "path": metadata_path,
            "exists": os.path.exists(metadata_path),
            "purpose": "Model normalization parameters"
        }
        
        # Check GNN output directory
        gnn_output_dir = os.path.join(os.getcwd(), "GNN-output-REAL")
        file_checks["output_dir"] = {
            "path": gnn_output_dir,
            "exists": os.path.exists(gnn_output_dir),
            "purpose": "Directory for inference outputs"
        }
        
        # Examine NPZ file contents if it exists
        npz_content = {}
        if file_checks["input_npz"]["exists"]:
            try:
                data = np.load(npz_path)
                npz_content = {
                    "keys": list(data.keys()),
                    "shapes": {key: list(data[key].shape) for key in data.keys()},
                    "dtypes": {key: str(data[key].dtype) for key in data.keys()}
                }
            except Exception as e:
                npz_content = {"error": f"Failed to read NPZ file: {str(e)}"}
        
        # Check if all critical files exist
        all_files_exist = all(check["exists"] for key, check in file_checks.items() 
                             if key in ["input_npz", "model", "inference_script", "metadata"])
        
        # Provide setup status
        setup_status = {
            "ready_for_inference": all_files_exist,
            "missing_files": [key for key, check in file_checks.items() if not check["exists"]],
            "next_steps": []
        }
        
        if not all_files_exist:
            setup_status["next_steps"].append("Ensure all required files are present")
        else:
            setup_status["next_steps"].append("Ready to run FGN inference")
        
        return {
            "status": "success",
            "message": "FGN inference preparation completed",
            "file_checks": file_checks,
            "npz_content": npz_content,
            "setup_status": setup_status,
            "inference_parameters": {
                "input_file": npz_file,
                "model_path": model_dir,
                "expected_output_types": ["figures", "csvs", "fragment trajectories"],
                "simulation_time_per_step": "0.06 milliseconds"
            }
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"FGN inference preparation failed: {str(e)}",
            "error_type": type(e).__name__
        }

# Joe's NPZ data transformation function for FGN compatibility
def transform_npz_for_fgn_inference(input_npz_path, output_npz_path):
    """
    Transform NPZ file from current format to GNS-compatible format based on notebook analysis.
    Handles different input key variations automatically.
    
    Returns: dict with transformation results
    """
    try:
        # Load original data
        data = np.load(input_npz_path)
        current_keys = list(data.keys())
        
        # Map input keys to GNS format
        key_mappings = {
            'positions': 'particle_trajectories',
            'particle_types': 'particle_type', 
            'particle_type': 'particle_type',  # Already correct
            'strains': 'particle_strains',
            'particle_strains': 'particle_strains'  # Already correct
        }
        
        transformations = {}
        original_shapes = {}
        transformed_shapes = {}
        
        # Find and transform position data
        pos_key = None
        for key in ['particle_trajectories', 'positions']:
            if key in current_keys:
                pos_key = key
                break
        
        if pos_key is None:
            raise ValueError("No position data found (expected 'positions' or 'particle_trajectories')")
            
        positions = data[pos_key]
        original_shapes[pos_key] = positions.shape
        
        # Handle dimensions - ensure 3D
        if len(positions.shape) == 3:
            timesteps, n_particles, dims = positions.shape
            if dims == 2:
                # Add Z-dimension with zeros for 2D data
                z_coords = np.zeros((timesteps, n_particles, 1))
                particle_trajectories = np.concatenate([positions, z_coords], axis=2)
                transformations[pos_key] = f"{positions.shape} -> particle_trajectories {particle_trajectories.shape} (added Z-dimension)"
            elif dims == 3:
                particle_trajectories = positions.copy()
                transformations[pos_key] = f"{positions.shape} -> particle_trajectories {particle_trajectories.shape} (renamed key)"
            else:
                raise ValueError(f"Unexpected position dimensions: {dims} (expected 2 or 3)")
        else:
            raise ValueError(f"Unexpected position shape: {positions.shape} (expected 3D array)")
        
        transformed_shapes['particle_trajectories'] = particle_trajectories.shape
        
        # Find and transform particle type data
        type_key = None
        for key in ['particle_type', 'particle_types']:
            if key in current_keys:
                type_key = key
                break
        
        if type_key is None:
            raise ValueError("No particle type data found (expected 'particle_type' or 'particle_types')")
        
        particle_types_raw = data[type_key]
        original_shapes[type_key] = particle_types_raw.shape
        
        # Handle particle type shape - should be 1D array of particle types
        if len(particle_types_raw.shape) == 1:
            particle_type = particle_types_raw.copy()
        elif len(particle_types_raw.shape) == 2:
            # Take first timestep if it's duplicated across time
            particle_type = particle_types_raw[0, :]
            transformations[type_key] = f"{particle_types_raw.shape} -> particle_type {particle_type.shape} (took first timestep)"
        else:
            raise ValueError(f"Unexpected particle type shape: {particle_types_raw.shape}")
            
        transformed_shapes['particle_type'] = particle_type.shape
        
        # Find and transform strain data  
        strain_key = None
        for key in ['particle_strains', 'strains']:
            if key in current_keys:
                strain_key = key
                break
        
        if strain_key is None:
            raise ValueError("No strain data found (expected 'strains' or 'particle_strains')")
        
        strains = data[strain_key]
        original_shapes[strain_key] = strains.shape
        particle_strains = strains.copy()
        transformations[strain_key] = f"{strains.shape} -> particle_strains {particle_strains.shape} (renamed key)"
        transformed_shapes['particle_strains'] = particle_strains.shape
        
        # Save transformed data with GNS-compatible keys
        np.savez(output_npz_path,
                 particle_trajectories=particle_trajectories,
                 particle_type=particle_type, 
                 particle_strains=particle_strains)
        
        return {
            "status": "success",
            "message": "NPZ file successfully transformed for FGN inference",
            "transformations": transformations,
            "input_path": input_npz_path,
            "output_path": output_npz_path,
            "original_shapes": original_shapes,
            "transformed_shapes": transformed_shapes,
            "detected_format": {
                "input_keys": current_keys,
                "position_key_used": pos_key,
                "type_key_used": type_key,
                "strain_key_used": strain_key
            }
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"NPZ transformation failed: {str(e)}",
            "error_type": type(e).__name__
        }

# Joe's FGN inference data preparation endpoint with configurable input file
@app.post("/fgn-inference/transform-data/")
async def transform_data_for_fgn(input_filename: str = "T-20-100-150.npz"):
    """Transform NPZ file to FGN-compatible format based on notebook analysis"""
    try:
        # File paths
        output_npz = f"{input_filename.replace('.npz', '')}-fgn-compatible.npz"
        
        input_path = os.path.join(os.getcwd(), input_filename)
        output_path = os.path.join(os.getcwd(), output_npz)
        
        # Check if input file exists
        if not os.path.exists(input_path):
            raise HTTPException(status_code=404, detail=f"Input NPZ file not found: {input_path}")
        
        # Perform transformation
        result = transform_npz_for_fgn_inference(input_path, output_path)
        
        if result["status"] == "error":
            raise HTTPException(status_code=500, detail=result["message"])
        
        # Verify the transformed file can be loaded by GNS inference format
        try:
            transformed_data = np.load(output_path)
            required_keys = ['particle_trajectories', 'particle_type', 'particle_strains']
            missing_keys = [key for key in required_keys if key not in transformed_data.keys()]
            
            if missing_keys:
                result["verification"] = {
                    "status": "warning",
                    "message": f"Missing required keys: {missing_keys}"
                }
            else:
                result["verification"] = {
                    "status": "success", 
                    "message": "All required keys present for FGN inference",
                    "available_keys": list(transformed_data.keys())
                }
                
        except Exception as e:
            result["verification"] = {
                "status": "error",
                "message": f"Failed to verify transformed file: {str(e)}"
            }
        
        return result
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Data transformation failed: {str(e)}",
            "error_type": type(e).__name__
        }

# Joe's FGN inference validation endpoint (validates setup without running)
@app.post("/fgn-inference/validate-setup/")
async def validate_fgn_setup():
    """Validate that all components are ready for FGN inference execution"""
    try:
        # Add GNS fragment to Python path
        gns_path = "/app/gns-fragment"
        if gns_path not in sys.path:
            sys.path.append(gns_path)
        
        # File paths
        transformed_npz = "T-20-100-150-fgn-compatible.npz"
        model_dir = "gns-fragment-reference/model_4_inference/NS5e-4_1e-2_R14_L5N64_PosNsx10"
        model_file = "model-066000.pt"
        metadata_file = "gns-fragment-reference/metadata.json"
        
        validation_results = {}
        
        # 1. Validate transformed NPZ file exists and has correct structure
        transformed_path = os.path.join(os.getcwd(), transformed_npz)
        if os.path.exists(transformed_path):
            try:
                data = np.load(transformed_path)
                required_keys = ['particle_trajectories', 'particle_type', 'particle_strains']
                missing_keys = [key for key in required_keys if key not in data.keys()]
                
                validation_results["transformed_npz"] = {
                    "status": "success" if not missing_keys else "error",
                    "path": transformed_path,
                    "keys": list(data.keys()),
                    "missing_keys": missing_keys,
                    "shapes": {key: list(data[key].shape) for key in data.keys()}
                }
            except Exception as e:
                validation_results["transformed_npz"] = {
                    "status": "error",
                    "message": f"Failed to load transformed NPZ: {str(e)}"
                }
        else:
            validation_results["transformed_npz"] = {
                "status": "error",
                "message": "Transformed NPZ file not found. Run /fgn-inference/transform-data/ first"
            }
        
        # 2. Validate model and metadata files
        model_path = os.path.join(os.getcwd(), model_dir, model_file)
        metadata_path = os.path.join(os.getcwd(), metadata_file)
        
        validation_results["model_files"] = {
            "model": {
                "path": model_path,
                "exists": os.path.exists(model_path),
                "size_mb": round(os.path.getsize(model_path) / (1024*1024), 2) if os.path.exists(model_path) else 0
            },
            "metadata": {
                "path": metadata_path,
                "exists": os.path.exists(metadata_path)
            }
        }
        
        # 3. Validate GNS imports
        try:
            # Test critical GNS imports
            from gns import learned_simulator
            from gns import reading_utils
            from gns import post_processing
            import torch
            
            validation_results["gns_imports"] = {
                "status": "success",
                "message": "All GNS modules imported successfully",
                "torch_version": torch.__version__
            }
        except Exception as e:
            validation_results["gns_imports"] = {
                "status": "error",
                "message": f"GNS import failed: {str(e)}"
            }
        
        # 4. Validate metadata compatibility
        if validation_results["model_files"]["metadata"]["exists"]:
            try:
                with open(metadata_path, 'r') as f:
                    metadata = json.load(f)
                    
                validation_results["metadata_check"] = {
                    "status": "success",
                    "required_keys": ["pos_mean", "pos_std", "vel_mean", "vel_std", "acc_mean", "acc_std", "bounds"],
                    "available_keys": list(metadata.keys()),
                    "dimensions": metadata.get("dim", "unknown")
                }
            except Exception as e:
                validation_results["metadata_check"] = {
                    "status": "error", 
                    "message": f"Failed to read metadata: {str(e)}"
                }
        
        # 5. Overall readiness assessment
        all_checks = [
            validation_results["transformed_npz"]["status"] == "success",
            validation_results["model_files"]["model"]["exists"],
            validation_results["model_files"]["metadata"]["exists"],
            validation_results["gns_imports"]["status"] == "success"
        ]
        
        overall_status = {
            "ready_for_inference": all(all_checks),
            "passed_checks": sum(all_checks),
            "total_checks": len(all_checks),
            "next_steps": []
        }
        
        if not all(all_checks):
            if validation_results["transformed_npz"]["status"] != "success":
                overall_status["next_steps"].append("Run data transformation endpoint first")
            if not validation_results["model_files"]["model"]["exists"]:
                overall_status["next_steps"].append("Ensure model file is available")
            if not validation_results["model_files"]["metadata"]["exists"]:
                overall_status["next_steps"].append("Ensure metadata.json is available")
            if validation_results["gns_imports"]["status"] != "success":
                overall_status["next_steps"].append("Fix GNS module import issues")
        else:
            overall_status["next_steps"].append("All validation checks passed - ready for FGN inference!")
        
        return {
            "status": "success",
            "message": "FGN inference setup validation completed",
            "validation_results": validation_results,
            "overall_status": overall_status
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"FGN setup validation failed: {str(e)}",
            "error_type": type(e).__name__
        }

# Joe's FULL FGN inference execution endpoint with complete rollout and post-processing
@app.post("/fgn-inference/execute-full/")
async def execute_full_fgn_inference(nsteps: int = 81, detonation_xy: str = "0,0", input_filename: str = "T-20-100-150-fgn-compatible.npz"):
    """Execute COMPLETE FGN inference with full rollout, post-processing, and output generation"""
    try:
        # Add GNS fragment to Python path
        gns_path = "/app/gns-fragment"
        if gns_path not in sys.path:
            sys.path.append(gns_path)
        
        # Import required modules
        from gns import learned_simulator
        from gns import reading_utils
        from gns import post_processing
        import torch
        import time
        import collections
        import pickle
        
        # File paths
        transformed_npz = input_filename
        model_dir = "gns-fragment-reference/model_4_inference/NS5e-4_1e-2_R14_L5N64_PosNsx10"
        model_file = "model-066000.pt"
        metadata_file = "gns-fragment-reference/metadata.json"
        
        transformed_path = os.path.join(os.getcwd(), transformed_npz)
        model_path = os.path.join(os.getcwd(), model_dir, model_file)
        metadata_path = os.path.join(os.getcwd(), metadata_file)
        
        # Validate all files exist
        missing_files = []
        for file_path, name in [(transformed_path, "transformed NPZ"), (model_path, "model"), (metadata_path, "metadata")]:
            if not os.path.exists(file_path):
                missing_files.append(name)
                
        if missing_files:
            raise HTTPException(status_code=404, detail=f"Missing files: {', '.join(missing_files)}")
        
        inference_start_time = time.time()
        
        # Load metadata
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        
        # Initialize device and model parameters
        device = 'cpu'
        
        # Create simulator (based on inference.py _get_simulator)
        acc_noise_std = torch.FloatTensor([0.0005, 0.0005, 0.01])
        vel_noise_std = torch.FloatTensor([0.0005, 0.0005, 0.01])
        pos_noise_std = torch.FloatTensor([0.005, 0.005, 0.05])
        
        acc_mean = torch.FloatTensor(metadata['acc_mean']).to(device)
        acc_std = torch.sqrt(torch.FloatTensor(metadata['acc_std']) ** 2 + acc_noise_std ** 2).to(device)
        vel_mean = torch.FloatTensor(metadata['vel_mean']).to(device)
        vel_std = torch.sqrt(torch.FloatTensor(metadata['vel_std']) ** 2 + vel_noise_std ** 2).to(device)
        pos_mean = torch.FloatTensor(metadata['pos_mean']).to(device)
        pos_std = torch.sqrt(torch.FloatTensor(metadata['pos_std']) ** 2 + pos_noise_std ** 2).to(device)
        
        normalization_stats = {
            'acceleration': {'mean': acc_mean, 'std': acc_std},
            'velocity': {'mean': vel_mean, 'std': vel_std},
            'position': {'mean': pos_mean, 'std': pos_std}
        }
        
        # Create and load simulator
        simulator = learned_simulator.LearnedSimulator(
            particle_dimensions=3,  # 3D
            nnode_in=9 * 3 + 16 + 8,  # Based on INPUT_SEQUENCE_LENGTH=10
            nedge_in=3 + 1,
            latent_dim=64,
            nmessage_passing_steps=5,
            nmlp_layers=1,
            mlp_hidden_dim=64,
            connectivity_radius=14,
            boundaries=np.array(metadata['bounds']),
            normalization_stats=normalization_stats,
            nparticle_types=3,  # concrete=0, rebar=1, boundary=2
            particle_type_embedding_size=16,
            device=device
        )
        
        simulator.load(model_path)
        simulator.to(device)
        simulator.eval()
        
        # Load and prepare sample data (exactly matching load_sample from inference.py)
        data = np.load(transformed_path)
        positions = data['particle_trajectories'].transpose((1, 0, 2))  # (particles, timesteps, dims)
        particle_type = data['particle_type'] 
        particle_strains = data['particle_strains']
        
        charge_weight = 5.0
        meta_feature = np.array([0, 0, 400, 0, 0, 5, 30])
        meta_feature[-2] = charge_weight
        meta_feature = (meta_feature - metadata['meta_mean']) / metadata['meta_std']
        
        # Create sample data following exact inference.py pattern
        SampleData = collections.namedtuple('SampleData', ['positions', 
                                                           'particle_type', 
                                                           'n_particles_per_example',
                                                           'particle_strains',
                                                           'meta_feature'])
        
        sample_data = SampleData(
            positions=torch.tensor(positions, dtype=torch.float32).contiguous().to(device),
            particle_type=torch.tensor(particle_type, dtype=torch.int32).contiguous().to(device),
            n_particles_per_example=torch.tensor(positions.shape[0], dtype=torch.int32).to(device),
            particle_strains=torch.tensor(particle_strains, dtype=torch.float32).contiguous().to(device),
            meta_feature=torch.tensor(meta_feature, dtype=torch.float32).to(device)
        )
        
        # Extract tensors for processing
        initial_positions = sample_data.positions
        particle_type_tensor = sample_data.particle_type
        initial_strains = sample_data.particle_strains
        meta_feature_tensor = sample_data.meta_feature
        n_particles_per_example = sample_data.n_particles_per_example
        
        print(f"Starting FULL FGN inference rollout with {nsteps} steps...")
        rollout_start_time = time.time()
        
        # Import and use the exact rollout function from inference.py
        from gns.inference import rollout
        
        # Adjust rollout steps, assuming initialization takes 10 steps (from original inference.py)
        adjusted_nsteps = nsteps - 10
        
        # Execute rollout using original function
        output_dict = rollout(
            simulator,
            initial_positions,      # (particles, timesteps, dims)
            particle_type_tensor,   # (particles,)
            n_particles_per_example,
            initial_strains,        # (timesteps, particles)
            meta_feature_tensor,    # (features,)
            adjusted_nsteps,
            3,  # particle_dim
            device
        )
        
        # Extract results
        pred_trajs_np = output_dict['pred_trajs']      # (time, particles, dims)
        pred_strains_np = output_dict['pred_strains']  # (time, particles)
        particle_type_np = output_dict['particle_type'] # (particles,)
        
        rollout_time = time.time() - rollout_start_time
        
        # Results are already in numpy format from rollout function
        # pred_trajs_np, pred_strains_np, particle_type_np are already set above
        
        # Create comprehensive output directory structure
        timestamp = int(time.time())
        case_name = f"fgn_inference_{timestamp}"
        base_output_dir = "GNN-output-REAL"
        case_output_dir = os.path.join(base_output_dir, case_name)
        
        # Create subdirectories
        for subdir in ['property', 'mass', 'eps', 'fragment', 'rollouts']:
            os.makedirs(os.path.join(case_output_dir, subdir), exist_ok=True)
        
        # Save rollout data as pickle (following notebook pattern)
        rollout_data = {
            'pred_trajs': pred_trajs_np,
            'pred_strains': pred_strains_np, 
            'particle_type': particle_type_np,
            'run_time': rollout_time,
            'meta_info': {
                'nsteps': nsteps,
                'detonation_xy': [float(x.strip()) for x in detonation_xy.split(',')],
                'charge_weight': charge_weight,
                'device': device
            }
        }
        
        rollout_pickle_path = os.path.join(case_output_dir, 'rollouts', f'{case_name}.pkl')
        with open(rollout_pickle_path, 'wb') as f:
            pickle.dump(rollout_data, f)
        
        # Run post-processing (simplified version - following notebook patterns)
        print("Running post-processing...")
        post_processing_start = time.time()
        
        try:
            # Call GNS post-processing 
            detonation_xy_list = [float(x.strip()) for x in detonation_xy.split(',')]
            post_processing.main(
                transformed_path,
                charge_weight,
                detonation_xy_list, 
                False,  # expanded_search
                pred_trajs_np,
                pred_strains_np,
                particle_type_np,
                nsteps + 10  # total steps including initial
            )
            post_processing_success = True
            post_processing_error = None
        except Exception as e:
            post_processing_success = False
            post_processing_error = str(e)
        
        post_processing_time = time.time() - post_processing_start
        total_time = time.time() - inference_start_time
        
        # Generate summary
        result = {
            "status": "success",
            "message": f"Full FGN inference completed with {nsteps} rollout steps",
            "execution_details": {
                "case_name": case_name,
                "device": device,
                "input_data": {
                    "particles": positions.shape[0],
                    "initial_timesteps": positions.shape[1], 
                    "dimensions": positions.shape[2]
                },
                "rollout_results": {
                    "predicted_steps": nsteps,
                    "total_trajectory_steps": pred_trajs_np.shape[0],
                    "final_trajectory_shape": list(pred_trajs_np.shape),
                    "final_strains_shape": list(pred_strains_np.shape)
                },
                "parameters": {
                    "charge_weight": charge_weight,
                    "detonation_xy": [float(x.strip()) for x in detonation_xy.split(',')],
                    "connection_radius": 14,
                    "dimensions": 3
                },
                "post_processing": {
                    "success": post_processing_success,
                    "error": post_processing_error
                },
                "timing": {
                    "rollout_seconds": rollout_time,
                    "post_processing_seconds": post_processing_time,
                    "total_seconds": total_time
                },
                "outputs": {
                    "base_directory": base_output_dir,
                    "case_directory": case_output_dir,
                    "rollout_pickle": rollout_pickle_path,
                    "subdirectories": ['property', 'mass', 'eps', 'fragment', 'rollouts']
                }
            }
        }
        
        return result
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Full FGN inference failed: {str(e)}",
            "error_type": type(e).__name__,
            "troubleshooting": {
                "common_issues": [
                    "Memory constraints for full rollout", 
                    "Model prediction errors during rollout",
                    "Post-processing module compatibility",
                    "Output directory permissions"
                ]
            }
        }

# Joe's NPZ file diagnostic endpoint
@app.get("/fgn-inference/examine-npz/{filename}")
async def examine_npz_file(filename: str):
    """Examine structure and content of NPZ files for FGN compatibility"""
    try:
        # Check if file exists
        file_path = os.path.join(os.getcwd(), filename)
        if not os.path.exists(file_path):
            raise HTTPException(status_code=404, detail=f"NPZ file not found: {filename}")
        
        # Load and analyze the NPZ file
        data = np.load(file_path)
        
        file_info = {
            "filename": filename,
            "file_path": file_path,
            "file_size_mb": round(os.path.getsize(file_path) / (1024*1024), 2),
            "keys": list(data.keys()),
            "analysis": {}
        }
        
        # Analyze each key in the NPZ file
        for key in data.keys():
            array = data[key]
            file_info["analysis"][key] = {
                "shape": list(array.shape),
                "dtype": str(array.dtype),
                "min_value": float(np.min(array)) if array.size > 0 else None,
                "max_value": float(np.max(array)) if array.size > 0 else None,
                "memory_mb": round(array.nbytes / (1024*1024), 2),
                "unique_values_count": int(len(np.unique(array))) if array.size <= 10000 else "too_large_to_compute"
            }
            
            # Sample data for small arrays
            if array.size <= 20:
                file_info["analysis"][key]["sample_data"] = array.tolist()
            elif array.ndim == 1 and array.size <= 100:
                file_info["analysis"][key]["sample_data"] = array[:10].tolist()
            elif array.ndim >= 2:
                if array.shape[0] <= 5 and array.shape[1] <= 10:
                    file_info["analysis"][key]["sample_data"] = array.tolist()
                else:
                    file_info["analysis"][key]["sample_data"] = f"Shape too large: {array.shape}"
        
        # Compatibility assessment with GNS format
        compatibility = assess_gns_compatibility(data)
        
        return {
            "status": "success",
            "message": f"Successfully examined {filename}",
            "file_info": file_info,
            "gns_compatibility": compatibility
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"Failed to examine NPZ file: {str(e)}",
            "error_type": type(e).__name__
        }

def assess_gns_compatibility(data):
    """Assess compatibility of NPZ data with GNS inference requirements"""
    required_keys = ['particle_trajectories', 'particle_type', 'particle_strains']
    current_keys = list(data.keys())
    
    compatibility = {
        "required_keys": required_keys,
        "current_keys": current_keys,
        "missing_keys": [key for key in required_keys if key not in current_keys],
        "extra_keys": [key for key in current_keys if key not in required_keys],
        "key_mapping_needed": {},
        "format_issues": [],
        "compatibility_score": 0
    }
    
    # Check for common key variations
    key_mappings = {
        'positions': 'particle_trajectories',
        'particle_types': 'particle_type',
        'strains': 'particle_strains'
    }
    
    for old_key, new_key in key_mappings.items():
        if old_key in current_keys and new_key not in current_keys:
            compatibility["key_mapping_needed"][old_key] = new_key
    
    # Analyze data shapes and formats
    if 'particle_trajectories' in data or 'positions' in data:
        pos_key = 'particle_trajectories' if 'particle_trajectories' in data else 'positions'
        positions = data[pos_key]
        
        if len(positions.shape) == 3:
            timesteps, particles, dims = positions.shape
            compatibility["data_analysis"] = {
                "position_shape": list(positions.shape),
                "timesteps": timesteps,
                "particles": particles,
                "dimensions": dims,
                "expected_format": "(timesteps, particles, 3) for 3D data"
            }
            
            # Check if dimensions are reasonable for GNS model
            if particles > 10000:
                compatibility["format_issues"].append(f"High particle count ({particles}) may cause memory issues")
            if dims != 3:
                compatibility["format_issues"].append(f"Expected 3D coordinates, got {dims}D")
            if timesteps < 10:
                compatibility["format_issues"].append(f"Too few timesteps ({timesteps}) for sequence modeling")
        else:
            compatibility["format_issues"].append(f"Position data has unexpected shape: {positions.shape}")
    
    # Calculate compatibility score
    score = 0
    if len(compatibility["missing_keys"]) == 0:
        score += 40
    elif len(compatibility["key_mapping_needed"]) > 0:
        score += 30
    
    if len(compatibility["format_issues"]) == 0:
        score += 60
    elif len(compatibility["format_issues"]) <= 2:
        score += 30
    
    compatibility["compatibility_score"] = min(score, 100)
    
    if score >= 80:
        compatibility["assessment"] = "High compatibility - ready for inference"
    elif score >= 60:
        compatibility["assessment"] = "Good compatibility - minor transformations needed"
    elif score >= 40:
        compatibility["assessment"] = "Moderate compatibility - significant transformations required"
    else:
        compatibility["assessment"] = "Low compatibility - major format changes needed"
    
    return compatibility

# Joe's FGN inference execution endpoint (original simple test)
@app.post("/fgn-inference/execute/")
async def execute_fgn_inference(nsteps: int = 81, detonation_xy: str = "0,0", input_filename: str = "T-20-100-150-fgn-compatible.npz"):
    """Execute FGN inference based on notebook patterns and GNS framework"""
    try:
        # Add GNS fragment to Python path
        gns_path = "/app/gns-fragment"
        if gns_path not in sys.path:
            sys.path.append(gns_path)
        
        # Import required modules
        from gns import learned_simulator
        from gns import reading_utils
        from gns import post_processing
        import torch
        import time
        import collections
        
        # File paths
        transformed_npz = input_filename
        model_dir = "gns-fragment-reference/model_4_inference/NS5e-4_1e-2_R14_L5N64_PosNsx10"
        model_file = "model-066000.pt"
        metadata_file = "gns-fragment-reference/metadata.json"
        
        transformed_path = os.path.join(os.getcwd(), transformed_npz)
        model_path = os.path.join(os.getcwd(), model_dir, model_file)
        metadata_path = os.path.join(os.getcwd(), metadata_file)
        
        # Validate all files exist
        missing_files = []
        if not os.path.exists(transformed_path):
            missing_files.append("transformed NPZ file")
        if not os.path.exists(model_path):
            missing_files.append("model file")
        if not os.path.exists(metadata_path):
            missing_files.append("metadata file")
            
        if missing_files:
            raise HTTPException(status_code=404, detail=f"Missing files: {', '.join(missing_files)}")
        
        # Initialize inference parameters (based on inference.py)
        device = 'cpu'
        FLAGS = collections.namedtuple('FLAGS', [
            'dim', 'connection_radius', 'layers', 'hidden_dim', 'noise_std',
            'nsteps', 'detonation_xy'
        ])
        
        flags = FLAGS(
            dim=3,
            connection_radius=14,
            layers=5,
            hidden_dim=64,
            noise_std=5e-4,
            nsteps=nsteps,
            detonation_xy=[float(x.strip()) for x in detonation_xy.split(',')]
        )
        
        inference_start_time = time.time()
        
        # Load metadata
        with open(metadata_path, 'r') as f:
            metadata = json.load(f)
        
        # Initialize simulator (based on _get_simulator from inference.py)
        acc_noise_std = torch.FloatTensor([0.0005, 0.0005, 0.01])
        vel_noise_std = torch.FloatTensor([0.0005, 0.0005, 0.01])
        pos_noise_std = torch.FloatTensor([0.005, 0.005, 0.05])
        
        acc_mean = torch.FloatTensor(metadata['acc_mean']).to(device)
        acc_std = torch.sqrt(torch.FloatTensor(metadata['acc_std']) ** 2 + acc_noise_std ** 2).to(device)
        vel_mean = torch.FloatTensor(metadata['vel_mean']).to(device)
        vel_std = torch.sqrt(torch.FloatTensor(metadata['vel_std']) ** 2 + vel_noise_std ** 2).to(device)
        pos_mean = torch.FloatTensor(metadata['pos_mean']).to(device)
        pos_std = torch.sqrt(torch.FloatTensor(metadata['pos_std']) ** 2 + pos_noise_std ** 2).to(device)
        
        normalization_stats = {
            'acceleration': {'mean': acc_mean, 'std': acc_std},
            'velocity': {'mean': vel_mean, 'std': vel_std},
            'position': {'mean': pos_mean, 'std': pos_std}
        }
        
        # Create simulator
        simulator = learned_simulator.LearnedSimulator(
            particle_dimensions=flags.dim,
            nnode_in=9 * flags.dim + 16 + 8,  # Based on INPUT_SEQUENCE_LENGTH=10
            nedge_in=flags.dim + 1,
            latent_dim=flags.hidden_dim,
            nmessage_passing_steps=flags.layers,
            nmlp_layers=1,
            mlp_hidden_dim=flags.hidden_dim,
            connectivity_radius=flags.connection_radius,
            boundaries=np.array(metadata['bounds']),
            normalization_stats=normalization_stats,
            nparticle_types=3,  # concrete=0, rebar=1, boundary=2
            particle_type_embedding_size=16,
            device=device
        )
        
        # Load model weights
        simulator.load(model_path)
        simulator.to(device)
        simulator.eval()
        
        # Load sample data (based on load_sample from inference.py)
        data = np.load(transformed_path)
        positions = data['particle_trajectories'].transpose((1, 0, 2))  # (particles, timesteps, dims)
        particle_type = data['particle_type']
        particle_strains = data['particle_strains']
        
        # Set meta feature (based on notebook patterns)
        charge_weight = 5.0  # Default charge weight
        meta_feature = np.array([0, 0, 400, 0, 0, 5, 30])
        meta_feature[-2] = charge_weight
        meta_feature = (meta_feature - metadata['meta_mean']) / metadata['meta_std']
        
        # Convert to tensors
        positions_tensor = torch.tensor(positions, dtype=torch.float32).contiguous().to(device)
        particle_type_tensor = torch.tensor(particle_type, dtype=torch.int32).contiguous().to(device)
        particle_strains_tensor = torch.tensor(particle_strains, dtype=torch.float32).contiguous().to(device)
        meta_feature_tensor = torch.tensor(meta_feature, dtype=torch.float32).to(device)
        n_particles = torch.tensor(positions.shape[0], dtype=torch.int32).to(device)
        
        # Execute rollout inference (simplified version of rollout function)
        print(f"Starting FGN inference with {flags.nsteps} steps...")
        
        rollout_start_time = time.time()
        
        # For demonstration, let's do a simple prediction without full rollout
        # This validates the model loads and can make predictions
        with torch.no_grad():
            # Take first 10 timesteps as input (INPUT_SEQUENCE_LENGTH=10)
            input_positions = positions_tensor[:, :10, :]
            
            try:
                # Test prediction on one timestep
                next_position, pred_strain = simulator.predict_positions(
                    input_positions,
                    nparticles_per_example=[n_particles],
                    particle_types=particle_type_tensor,
                    meta_feature=meta_feature_tensor
                )
                
                prediction_success = True
                prediction_shape = next_position.shape
                strain_shape = pred_strain.shape
                
            except Exception as pred_error:
                prediction_success = False
                prediction_error = str(pred_error)
                prediction_shape = None
                strain_shape = None
        
        rollout_time = time.time() - rollout_start_time
        total_time = time.time() - inference_start_time
        
        # Create output directory for results
        output_dir = "GNN-output-REAL"
        os.makedirs(output_dir, exist_ok=True)
        
        result = {
            "status": "success" if prediction_success else "partial_success",
            "message": "FGN inference executed successfully" if prediction_success else "FGN inference setup successful, prediction encountered issues",
            "execution_details": {
                "device": device,
                "model_loaded": True,
                "input_data_shape": {
                    "particle_trajectories": list(positions.shape),
                    "particle_type": list(particle_type.shape),
                    "particle_strains": list(particle_strains.shape)
                },
                "inference_parameters": {
                    "nsteps_requested": flags.nsteps,
                    "dimensions": flags.dim,
                    "connection_radius": flags.connection_radius,
                    "detonation_xy": flags.detonation_xy,
                    "charge_weight": charge_weight
                },
                "prediction_test": {
                    "success": prediction_success,
                    "next_position_shape": list(prediction_shape) if prediction_shape else None,
                    "predicted_strain_shape": list(strain_shape) if strain_shape else None,
                    "error": prediction_error if not prediction_success else None
                },
                "timing": {
                    "rollout_time_seconds": rollout_time,
                    "total_time_seconds": total_time
                },
                "output_directory": output_dir
            }
        }
        
        if not prediction_success:
            result["troubleshooting"] = {
                "likely_causes": [
                    "Input tensor shapes may not match model expectations",
                    "Meta feature normalization may need adjustment",
                    "Sequence length requirements may differ"
                ],
                "next_steps": [
                    "Check input data dimensions against training data format",
                    "Verify meta feature calculation matches training setup",
                    "Consider running with different sequence length"
                ]
            }
        
        return result
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"FGN inference execution failed: {str(e)}",
            "error_type": type(e).__name__,
            "troubleshooting": {
                "common_issues": [
                    "Missing dependencies (torch, torch-geometric)",
                    "Model file corruption or incompatibility",
                    "Incorrect data format or tensor shapes",
                    "Memory constraints for large models"
                ]
            }
        }
