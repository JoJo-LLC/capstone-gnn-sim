from pymongo import AsyncMongoClient
from datetime import datetime
import os

#Currently implementing async connection
#Need to not hardcode the login variables - env variables?
#Need to add some form of logging
# To use with FastAPI, call 'await db.get_gallery_items'
#Example response (will be in json format):

"""{
  "items": [
    {
      "id": "demo-1",
      "title": "2D Copper Bar Sample",
      "preview_gif": "/static/samples/placeholder_2d.gif",
      "tags": ["2D", "demo"]
    }
  ]
}"""


class DatabaseConnection:
    def __init__(self):
        #Start MongoDB connection
        db_url = "mongodb://admin:password123@mongodb:27017"
        self.client = AsyncMongoClient(db_url)
        self.db = self.client["structural_sim_database"]

        #Collection references for the collections defined in schema
        self.collections = {

            'params': self.db['simulationParameters'],
            'results': self.db['simulationResults'],
            'uploads': self.db['uploadData'],
            'logs': self.db['logs'],
            'gallery': self.db['gallery'],
            'fgn_simulations': self.db['fgnSimulations'] 
        }

    async def connection_test(self):
        try:
            #ping Mongo server to check connection
            await self.client.admin.command("ping")
            print("Mongo Connection Success")
            return True
        except Exception as e:
            print(f"Mongo Connection Failed: {e}")
            return False

    async def setup_collections(self):
        """Create indexes for better performance"""
        try:
            await self.collections['params'].create_index("parameterHash", unique=True)
            await self.collections['params'].create_index("uploadDate")
            await self.collections['results'].create_index("paramsID") 
            await self.collections['results'].create_index("status")
            await self.collections['uploads'].create_index("uploadDate")
            await self.collections['uploads'].create_index("fileName")
            await self.collections['logs'].create_index("timestamp")
            await self.collections['logs'].create_index("level")
            
            
            print("Collections and indexes created")
            return True
        except Exception as e:
            print(f"Error with collection setup: {e}")
            return False

    async def store_fgn_simulation(self, data_path, d3plot_files, ls_dyna_path, total_size):
        """
        Creates initial FGN simulation record in database
        usage:
        - called at start of inference pipeline to create tracking record
        - used by: /run-fgn-inference/ endpoint
        - parameters:
          - data_path: Unique identifier (e.g., "0.4_6")
          - d3plot_files: List of LS-DYNA file names
          - ls_dyna_path: Full path to source files
          - total_size: Combined size of all d3plot files in bytes
        - returns: String ID of created record, or None if failed
        """
        try:
            #Check for existing simulation to prevent duplicates
            existing = await self.collections['fgn_simulations'].find_one({"data_path": data_path})
            if existing:
                print(f"FGN simulation {data_path} already exists")
                return str(existing["_id"])
            
            #import schema template and populate with actual data
            from database_schema import SimulationSchemas
            schemas = SimulationSchemas()
            fgn_doc = schemas.fgn_simulation_schema()
            
            # Fills in the actual data from params
            fgn_doc['data_path'] = data_path
            fgn_doc['ls_dyna_files']['d3plot_files'] = d3plot_files
            fgn_doc['ls_dyna_files']['ls_dyna_file_path'] = ls_dyna_path
            fgn_doc['ls_dyna_files']['total_size_bytes'] = total_size
            fgn_doc['ls_dyna_files']['file_count'] = len(d3plot_files)
            
            #Insert into MongoDB and return the generated ID
            result = await self.collections['fgn_simulations'].insert_one(fgn_doc)
            print(f"Stored FGN simulation {data_path} with ID: {result.inserted_id}")
            return str(result.inserted_id)
            
        except Exception as e:
            print(f"Error storing FGN simulation: {e}")
            return None

    async def update_npz_conversion_status(self, data_path, npz_file_path, size_bytes, conversion_time):
        """
        Update database record after successful d3plot to NPZ conversion
        usage:
        -called after d3plot conversion completes successfully
        -used by: /run-fgn-inference/ and /convert-d3plot-to-npz/ endpoints
        -parameters:
          -data_path: Simulation identifier to update
          -npz_file_path: Full path to created NPZ file
          -size_bytes: Size of NPZ file in bytes
          -conversion_time: Time taken for conversion in seconds
        - returns: boolean showing success or failure
        """
        try:
            #prepare update data for npz_conversion subdocument
            update_data = {
                "npz_conversion.status": "completed",
                "npz_conversion.npz_file_path": npz_file_path,
                "npz_conversion.npz_size_bytes": size_bytes,
                "npz_conversion.conversion_time_seconds": conversion_time,
                "npz_conversion.conversion_date": datetime.now(timezone.utc)
            }
            
            #updates the specific simulation record
            result = await self.collections['fgn_simulations'].update_one(
                {"data_path": data_path},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                print(f"Updated NPZ conversion status for {data_path}")
                return True
            else:
                print(f"No FGN simulation found with data_path: {data_path}")
                return False
                
        except Exception as e:
            print(f"Error updating NPZ conversion status: {e}")
            return False

    async def update_fgn_execution_results(self, data_path, parameters, results, execution_time, rollout_time):
        """
        uppdates database record after successful FGN inference execution
        usage:
        -called after inference pipeline completes successfully
        -used by: /run-fgn-inference/ and /run-npz-inference/ endpoints
        -parameters:
          -data_path: Simulation identifier to update
          -parameters: Dict of simulation parameters (nsteps, detonation_xy, etc.)
          -results: Dict with output_directory and generated_files counts
          -execution_time: Total time including conversion (seconds)
          -rollout_time: Time for inference only (seconds)
        - returns: Boolean indicating success
        """
        try:
            #prepare update for fgn_execution subdocument
            update_data = {
                "fgn_execution.status": "completed",
                "fgn_execution.parameters": parameters,
                "fgn_execution.results.output_directory": results.get("output_directory", ""),
                "fgn_execution.results.generated_files": results.get("generated_files", {}),
                "fgn_execution.results.execution_time_seconds": execution_time,
                "fgn_execution.results.rollout_time_seconds": rollout_time,
                "fgn_execution.execution_date": datetime.now(timezone.utc)
            }
            
            #update the simulation record with execution results
            result = await self.collections['fgn_simulations'].update_one(
                {"data_path": data_path},
                {"$set": update_data}
            )
            
            if result.modified_count > 0:
                print(f"Updated FGN execution results for {data_path}")
                return True
            else:
                print(f"No FGN simulation found with data_path: {data_path}")
                return False
                
        except Exception as e:
            print(f"Error updating FGN execution results: {e}")
            return False

    async def get_fgn_simulation_by_data_path(self, data_path):
        """
        retrieves complete FGN simulation record by data_path identifier
        usage:
        - Used by: GET /fgn-simulation/{data_path} endpoint
        - parameters: data_path (string like "0.4_6")
        - returns: Full simulation document dict, or None if not found
        - use this to: check simulation status, get timing info, file locations
        returned MongoDB document structure:
        - _id: MongoDB document ID
        - data_path: original identifier
        - npz_conversion: {status, file_path, size_bytes, conversion_time, date}
        - fgn_execution: {status, parameters, results, execution_time, date}
        - ls_dyna_files: {d3plot_files, file_path, total_size_bytes, file_count}
        """
        try:
            simulation = await self.collections['fgn_simulations'].find_one({"data_path": data_path})
            
            #convert MongoDB ObjectId to string for JSON serialization
            if simulation:
                simulation["_id"] = str(simulation["_id"])
                print(f"Retrieved FGN simulation: {data_path}")
                return simulation
            else:
                print(f"No FGN simulation found with data_path: {data_path}")
                return None
                
        except Exception as e:
            print(f"Error retrieving FGN simulation: {e}")
            return None

    async def list_all_fgn_simulations(self):
        """
        Get summary list of all FGN simulations for display/data management
        usage:
        -used by: GET /fgn-simulations/ endpoint
        -returns: List of simulation summaries (not full documents)
        -use this for sim management/overview in UI        
        returned fields per simulation:
        - _id, data_path, upload_date
        - npz_conversion.status, fgn_execution.status  
        - ls_dyna_files.file_count, ls_dyna_files.total_size_bytes
        """

        #use projection to limit returned fields for performance
        try:
            cursor = self.collections['fgn_simulations'].find({}, {
                "data_path": 1,
                "upload_date": 1,
                "npz_conversion.status": 1,
                "fgn_execution.status": 1,
                "ls_dyna_files.file_count": 1,
                "ls_dyna_files.total_size_bytes": 1
            })
            
            simulations = await cursor.to_list(length=None)
            
            #convert ObjectIds to strings for JSON serialization
            for sim in simulations:
                sim["_id"] = str(sim["_id"])
                
            print(f"Retrieved {len(simulations)} FGN simulations")
            return simulations
            
        except Exception as e:
            print(f"Error listing FGN simulations: {e}")
            return []

    async def get_gallery_items(self):
        """Get all gallery items for API response"""
        try:
            cursor = self.db.gallery.find({}, {
                "_id": 1, "title": 1, "description": 1,
                "preview_gif": 1, "preview_mp4": 1, "data_csv": 1,
                "tags": 1, "frames": 1
            })
            items = await cursor.to_list(length=None)
            
            # Convert _id to id for API response
            for item in items:
                item["id"] = item.pop("_id")
                
            return items
        except Exception as e:
            print(f"Error fetching gallery items: {e}")
            return []
        

    async def seed_gallery_data(self, items):
        """Insert/update gallery items from seed data"""
        try:
            for item in items:
                await self.collections['gallery'].update_one(
                    {"_id": item["_id"]},
                    {"$set": item},
                    upsert=True
                )
            print(f"Seeded {len(items)} gallery items")
            return True
        except Exception as e:
            print(f"Error seeding gallery data: {e}")
            return False  

        
    async def setup_gallery_indexes(self):
        """Create indexes specifically for the gallery collection"""
        try:
            await self.collections['gallery'].create_index([("title", "text")])
            await self.collections['gallery'].create_index("tags")
            print("Gallery indexes created")
            return True
        except Exception as e:
            print(f"Error creating gallery indexes: {e}")
            return False
        
    async def close_connection(self):
        """Close the MongoDB connection"""
        await self.client.close()
        

if __name__ == "__main__":
    import asyncio
    
    async def test():
        db = DatabaseConnection()
        
        # Connection test
        connection_result = await db.connection_test()
        print(f"Connection result: {connection_result}")
        
        # collections test
        if connection_result:
            setup_result = await db.setup_collections()
            print(f"Setup result: {setup_result}")
    
    asyncio.run(test())
