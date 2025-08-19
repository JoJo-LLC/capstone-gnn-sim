from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import shutil
import os
import psutil
import sys
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
    
