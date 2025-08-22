from datetime import datetime
from bson import ObjectId
import hashlib
import json

class SimulationSchemas:
    """Complete MongoDB schema definitions for simulation data"""
    
    def upload_data_schema(self):
        """Schema for uploadData collection"""
        return {
            "uploadDataID": None,  # Auto generated objectId
            "fileName": "",  # e.g T-20-100-150.npz"
            "fileType": ".npz",
            "contentType": "application/octet-stream",
            "fileSize": 0,  # in bytes, can convert to mb for users?
            "uploadDate": datetime(),
            "filePath": "",  # e.g  "./uploads/T-20-100-150.npz" (given file)
            "fileMetadata": {
                "arrays": [],  # taken from .npz file ["positions", "particle_types", "strains"]
                "detected_type": "",  # "2D_strain", "3D_with_metadata", "3D_dynamic_loading" - .npz file
                "dimensions": 0,  # 2 or 3
                "particle_count": 0,
                "timesteps": 0
            }
        }
    
    def simulation_parameters_schema(self):
        """Schema for simulationParameters collection"""
        return {
            "paramsID": None,  # Auto generated ObjectId
            "uploadDataID": None,  # Foreign key to uploadData
            "uploadDate": datetime(),
            "simulationType": "",  # "2D_strain", "3D_with_metadata", "3D_dynamic_loading"
            "parameterHash": "",  # hash for duplicate detection
            "parameters": {
                # Common fields for all simulations
                "timesteps": 0,
                "particleCount": 0,
                "dimensions": 0,  # 2 or 3
                "boundaryConditions": {},
                
                # Array structure info
                "arrays_info": {
                    # Example: "positions": {"shape": [152, 8004, 2], "dtype": "float64"}
                },
                
                # Type-specific fields (only present when applicable)
                "meta_features": None,  # For 3D_with_metadata type only
                "loading_conditions": None,  # For 3D_dynamic_loading type only
                "particle_types_dynamic": False,  # True if particle_types change over time
                
                # Raw simulation parameters (flexible)
                "raw_params": {}
            }
        }
    
    def simulation_results_schema(self):
        """Schema for simulationResults collection"""
        return {
            "resultsID": None,  # Auto generated object id
            "paramsID": None,  # Foreign key to simulationParameters
            "resultType": "GNN_Model",  # "GNN Model" or "LS DYNA"
            "startTime": datetime(),
            "endTime": None,
            "executionTime": None,  # milliseconds
            "status": "pending",  # "pending"/"running"/"completed"/"failed"
            "outputFile": None,  # "./results/sim_001_results.npz"
            "resultsSummary": {
                "maxStress": 0.0,
                "maxStrain": 0.0,
                "maxDisplacement": 0.0,
                "particleStats": {
                    "total_particles": 0,
                    "affected_particles": 0
                }
            }
        }
    
    def log_entry_schema(self):
        """Schema for logs collection"""
        return {
            "logsID": None,  # Auto-generated object id
            "paramsID": None,  # Optional foreign key to simulationParameters
            "timestamp": datetime(),
            "level": "info",  # "debug", "info", "warning", "error"
            "message": "",
            "rootComponent": "",  # "database", "fastapi", "frontend", "model"
            "stackTrace": None,  # For errors only
            "additionalData": {}  # Flexible field for more info
        }
    
    def gallery_schema(self):
        return {
            "_id": "",  # "demo-1", "demo-2", etc.
            "title": "",  # "2D Copper Bar (sample)"
            "description": "",  # "Frame-by-frame sample"
            "preview_gif": "",  # "/static/samples/copper_demo.gif"
            "preview_mp4": None,
            "data_csv": None,
            "tags": [],  # ["2D", "cpu"]
            "frames": 0,  # 60
            "created_at": datetime(),
            "filePath" : ""

        }

class SimulationTypeDetector:
    """Detect simulation type from .npz file arrays"""
    
    def detect_type(self, arrays):
        """
        Detect simulation type based on array names
        
        Args:
            arrays: List of array names from .npz file
            
        Returns:
            str: Simulation type identifier
        """
        arrays = [arr.lower() for arr in arrays] 
        
        if "meta_feature" in arrays:
            return "3D_with_metadata"
        elif "loading" in arrays and "particle_trajectories" in arrays:
            return "3D_dynamic_loading"
        elif "positions" in arrays:
            return "2D_strain"  # Will be updated to 3D_strain if positions are 3D
        else:
            return "unknown"
    
    def detect_dimensions(self, positions_shape):
        """
        Detect if simulation is 2D or 3D from positions array shape
        
        Args:
            positions_shape: Tuple like (152, 8004, 2) or (101, 246248, 3)
            
        Returns:
            int: 2 or 3 for dimensions
        """
        if len(positions_shape) >= 3:
            return positions_shape[2]  # Last dimension is spatial dimensions
        return 2  # Default is 2D


if __name__ == "__main__":
    schemas = SimulationSchemas()
    detector = SimulationTypeDetector()
    
    # Placeholder test .npz arrays for different sim types
    test_files = [
        (['positions', 'particle_types', 'strains'], "T-20-100-150.npz"),
        (['positions', 'particle_type', 'strains', 'meta_feature'], "120_6_0.5C50.npz"),
        (['particle_trajectories', 'particle_strains', 'particle_types', 'loading'], "B_C20_V5_5_D18.npz")
    ]
    
    print("\nSimulation Type Detection:")
    for arrays, filename in test_files:
        detected_type = detector.detect_type(arrays)
        print(f"  {filename}: {detected_type}")
    
    print("\nSchema structures available:")
    print("uploadData schema created")
    print("simulationParameters schema created") 
    print("simulationResults schema created")
    print("logs schema created")