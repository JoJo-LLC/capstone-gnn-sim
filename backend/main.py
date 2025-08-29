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









# Joe's Updated FGN inference endpoint for Docker gns-fragment with 0.4_6 workflow
@app.post("/run-fgn-inference/")
async def run_fgn_inference(nsteps: int, data_path: str, detonation_xy: str = "0,0", expanded_search: bool = False):
    """Execute FGN inference using Docker gns-fragment with the proven 0.4_6 workflow"""
    try:
        import subprocess
        import time
        
        # Docker container paths (when running inside container)
        gns_path = "/app/gns-fragment"
        data_source_path = f"/app/src/{data_path}"  # e.g., /app/src/0.4_6
        
        # Validate data path exists
        if not os.path.exists(data_source_path):
            raise HTTPException(status_code=404, detail=f"Data path not found: {data_source_path}")
        
        # Check for required d3plot files
        d3plot_files = [f for f in os.listdir(data_source_path) if f.startswith('d3plot')]
        if not d3plot_files:
            raise HTTPException(status_code=400, detail=f"No d3plot files found in {data_source_path}")
        
        inference_start_time = time.time()
        
        # Step 1: Convert d3plot to NPZ (if not already exists)
        npz_file = f"{data_path}.npz" 
        npz_path = os.path.join(data_source_path, npz_file)
        
        if not os.path.exists(npz_path):
            print(f"Converting d3plot to NPZ for {data_path}...")
            conversion_cmd = [
                "python", f"{gns_path}/lsdyna/d3plot_to_npz.py", 
                f"--data_path={data_source_path}"
            ]
            
            try:
                conversion_result = subprocess.run(
                    conversion_cmd, 
                    capture_output=True, 
                    text=True, 
                    cwd=gns_path,
                    timeout=300  # 5 minute timeout
                )
                if conversion_result.returncode != 0:
                    raise Exception(f"d3plot conversion failed: {conversion_result.stderr}")
                    
                conversion_success = True
                conversion_output = conversion_result.stdout
            except subprocess.TimeoutExpired:
                raise HTTPException(status_code=408, detail="d3plot conversion timed out")
            except Exception as e:
                conversion_success = False
                conversion_output = str(e)
        else:
            conversion_success = True
            conversion_output = f"NPZ file already exists: {npz_path}"
        
        if not conversion_success:
            raise HTTPException(status_code=500, detail=f"d3plot to NPZ conversion failed: {conversion_output}")
        
        # Step 2: Run FGN inference using the exact working command
        print(f"Running FGN inference for {nsteps} steps...")
        inference_cmd = [
            "python", "-m", "gns.inference",
            f"--data_path={data_source_path}",
            f"--nsteps={nsteps}",
            f"--detonation_xy={detonation_xy}",
            f"--expanded_search={str(expanded_search).lower()}"
        ]
        
        try:
            rollout_start_time = time.time()
            
            inference_result = subprocess.run(
                inference_cmd,
                capture_output=True,
                text=True,
                cwd=gns_path,
                timeout=600  # 10 minute timeout for inference
            )
            
            rollout_time = time.time() - rollout_start_time
            
            if inference_result.returncode != 0:
                raise Exception(f"FGN inference failed: {inference_result.stderr}")
            
            inference_success = True
            inference_output = inference_result.stdout
            
        except subprocess.TimeoutExpired:
            raise HTTPException(status_code=408, detail="FGN inference timed out")
        except Exception as e:
            inference_success = False
            inference_error = str(e)
        
        if not inference_success:
            raise HTTPException(status_code=500, detail=f"FGN inference failed: {inference_error}")
        
        # Check for generated outputs
        output_base_dir = f"/app/src/output"
        case_output_dir = os.path.join(output_base_dir, data_path)
        output_exists = os.path.exists(case_output_dir)
        
        if output_exists:
            # Count generated files
            output_files = {}
            for subdir in ['eps', 'fragment', 'mass', 'property']:
                subdir_path = os.path.join(case_output_dir, subdir)
                if os.path.exists(subdir_path):
                    files = os.listdir(subdir_path)
                    output_files[subdir] = len(files)
                else:
                    output_files[subdir] = 0
        else:
            output_files = {"eps": 0, "fragment": 0, "mass": 0, "property": 0}
        
        total_time = time.time() - inference_start_time
        
        return {
            "status": "success",
            "message": f"FGN inference completed successfully with {nsteps} steps",
            "execution_details": {
                "data_path": data_path,
                "conversion": {
                    "success": conversion_success,
                    "output": conversion_output,
                    "npz_file": npz_file
                },
                "inference": {
                    "success": inference_success,
                    "nsteps": nsteps,
                    "detonation_xy": detonation_xy,
                    "expanded_search": expanded_search,
                    "output": inference_output
                },
                "outputs": {
                    "directory_exists": output_exists,
                    "output_directory": case_output_dir,
                    "generated_files": output_files
                },
                "timing": {
                    "rollout_time_seconds": rollout_time,
                    "total_time_seconds": total_time
                },
                "docker_paths": {
                    "gns_fragment": gns_path,
                    "data_source": data_source_path,
                    "npz_path": npz_path
                }
            }
        }
        
    except Exception as e:
        return {
            "status": "error",
            "message": f"FGN inference execution failed: {str(e)}",
            "error_type": type(e).__name__,
            "troubleshooting": {
                "common_issues": [
                    "Data path not found or missing d3plot files",
                    "Docker container gns-fragment not properly cloned", 
                    "Subprocess timeout during inference",
                    "Missing dependencies in Docker container"
                ],
                "docker_requirements": [
                    "Ensure Docker container is built with gns-fragment at /app/gns-fragment",
                    "Verify PYTHONPATH includes /app/gns-fragment",
                    "Check that data is mounted to /app/src"
                ]
            }
        }


# Joe's Split endpoints for testing individual pipeline steps

@app.post("/convert-d3plot-to-npz/")
async def convert_d3plot_to_npz(data_path: str):
    """Convert d3plot files to NPZ format using Docker gns-fragment"""
    try:
        import subprocess
        import time
        
        # Docker container paths 
        gns_path = "/app/gns-fragment"
        data_source_path = f"/app/src/{data_path}"
        
        # Validate data path exists
        if not os.path.exists(data_source_path):
            raise HTTPException(status_code=404, detail=f"Data path not found: {data_source_path}")
        
        # Check for required d3plot files
        d3plot_files = [f for f in os.listdir(data_source_path) if f.startswith('d3plot')]
        if not d3plot_files:
            raise HTTPException(status_code=400, detail=f"No d3plot files found in {data_source_path}")
        
        # Check if NPZ already exists
        npz_file = f"{data_path}.npz"
        npz_path = os.path.join(data_source_path, npz_file)
        
        conversion_start_time = time.time()
        
        if os.path.exists(npz_path):
            return {
                "status": "already_exists",
                "message": f"NPZ file already exists: {npz_file}",
                "data_path": data_path,
                "npz_path": npz_path,
                "d3plot_files": d3plot_files,
                "timing": {"conversion_time_seconds": 0}
            }
        
        print(f"Converting d3plot to NPZ for {data_path}...")
        conversion_cmd = [
            "python", f"{gns_path}/lsdyna/d3plot_to_npz.py", 
            f"--data_path={data_source_path}"
        ]
        
        try:
            conversion_result = subprocess.run(
                conversion_cmd, 
                capture_output=True, 
                text=True, 
                cwd=gns_path,
                timeout=300  # 5 minute timeout
            )
            
            conversion_time = time.time() - conversion_start_time
            
            if conversion_result.returncode != 0:
                return {
                    "status": "error",
                    "message": f"d3plot conversion failed",
                    "error_details": conversion_result.stderr,
                    "stdout": conversion_result.stdout,
                    "data_path": data_path,
                    "d3plot_files": d3plot_files,
                    "timing": {"conversion_time_seconds": conversion_time}
                }
            
            # Verify NPZ was created
            npz_created = os.path.exists(npz_path)
            npz_size = os.path.getsize(npz_path) if npz_created else 0
            
            return {
                "status": "success",
                "message": f"Successfully converted d3plot to NPZ",
                "data_path": data_path,
                "d3plot_files": d3plot_files,
                "conversion": {
                    "npz_file": npz_file,
                    "npz_path": npz_path,
                    "npz_created": npz_created,
                    "npz_size_bytes": npz_size,
                    "stdout": conversion_result.stdout
                },
                "timing": {"conversion_time_seconds": conversion_time}
            }
            
        except subprocess.TimeoutExpired:
            raise HTTPException(status_code=408, detail="d3plot conversion timed out (5 minutes)")
        except Exception as e:
            conversion_time = time.time() - conversion_start_time
            return {
                "status": "error",
                "message": f"d3plot conversion exception: {str(e)}",
                "error_type": type(e).__name__,
                "data_path": data_path,
                "d3plot_files": d3plot_files,
                "timing": {"conversion_time_seconds": conversion_time}
            }
            
    except Exception as e:
        return {
            "status": "error",
            "message": f"d3plot conversion setup failed: {str(e)}",
            "error_type": type(e).__name__,
            "data_path": data_path
        }


@app.post("/run-npz-inference/")
async def run_npz_inference(data_path: str, nsteps: int, detonation_xy: str = "0,0", expanded_search: bool = False):
    """Run FGN inference on existing NPZ file using Docker gns-fragment"""
    try:
        import subprocess
        import time
        
        # Docker container paths
        gns_path = "/app/gns-fragment"
        data_source_path = f"/app/src/{data_path}"
        
        # Validate data path exists
        if not os.path.exists(data_source_path):
            raise HTTPException(status_code=404, detail=f"Data path not found: {data_source_path}")
        
        # Check for required NPZ file
        npz_file = f"{data_path}.npz"
        npz_path = os.path.join(data_source_path, npz_file)
        
        if not os.path.exists(npz_path):
            raise HTTPException(status_code=400, detail=f"NPZ file not found: {npz_file}. Use /convert-d3plot-to-npz/ first.")
        
        npz_size = os.path.getsize(npz_path)
        
        print(f"Running FGN inference for {nsteps} steps on {npz_file}...")
        inference_start_time = time.time()
        
        # Run FGN inference
        inference_cmd = [
            "python", "-m", "gns.inference",
            f"--data_path={data_source_path}",
            f"--nsteps={nsteps}",
            f"--detonation_xy={detonation_xy}",
            f"--expanded_search={str(expanded_search).lower()}"
        ]
        
        try:
            inference_result = subprocess.run(
                inference_cmd,
                capture_output=True,
                text=True,
                cwd=gns_path,
                timeout=600  # 10 minute timeout for inference
            )
            
            inference_time = time.time() - inference_start_time
            
            if inference_result.returncode != 0:
                return {
                    "status": "error",
                    "message": f"FGN inference failed",
                    "error_details": inference_result.stderr,
                    "stdout": inference_result.stdout,
                    "data_path": data_path,
                    "npz_file": npz_file,
                    "npz_size_bytes": npz_size,
                    "parameters": {
                        "nsteps": nsteps,
                        "detonation_xy": detonation_xy,
                        "expanded_search": expanded_search
                    },
                    "timing": {"inference_time_seconds": inference_time}
                }
            
            # Check for generated outputs
            output_base_dir = f"/app/src/output"
            case_output_dir = os.path.join(output_base_dir, data_path)
            output_exists = os.path.exists(case_output_dir)
            
            if output_exists:
                # Count generated files
                output_files = {}
                for subdir in ['eps', 'fragment', 'mass', 'property']:
                    subdir_path = os.path.join(case_output_dir, subdir)
                    if os.path.exists(subdir_path):
                        files = os.listdir(subdir_path)
                        output_files[subdir] = len(files)
                    else:
                        output_files[subdir] = 0
            else:
                output_files = {"eps": 0, "fragment": 0, "mass": 0, "property": 0}
            
            return {
                "status": "success",
                "message": f"FGN inference completed successfully with {nsteps} steps",
                "data_path": data_path,
                "npz_file": npz_file,
                "npz_size_bytes": npz_size,
                "parameters": {
                    "nsteps": nsteps,
                    "detonation_xy": detonation_xy,
                    "expanded_search": expanded_search
                },
                "inference": {
                    "stdout": inference_result.stdout
                },
                "outputs": {
                    "directory_exists": output_exists,
                    "output_directory": case_output_dir,
                    "generated_files": output_files
                },
                "timing": {"inference_time_seconds": inference_time}
            }
            
        except subprocess.TimeoutExpired:
            raise HTTPException(status_code=408, detail="FGN inference timed out (10 minutes)")
        except Exception as e:
            inference_time = time.time() - inference_start_time
            return {
                "status": "error",
                "message": f"FGN inference exception: {str(e)}",
                "error_type": type(e).__name__,
                "data_path": data_path,
                "npz_file": npz_file,
                "parameters": {
                    "nsteps": nsteps,
                    "detonation_xy": detonation_xy,
                    "expanded_search": expanded_search
                },
                "timing": {"inference_time_seconds": inference_time}
            }
            
    except Exception as e:
        return {
            "status": "error",
            "message": f"NPZ inference setup failed: {str(e)}",
            "error_type": type(e).__name__,
            "data_path": data_path
        }
