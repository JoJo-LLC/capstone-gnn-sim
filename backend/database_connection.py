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
            'gallery': self.db['gallery']
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

    async def store_upload_data(self, file_info):
        """TODO: To be implemented"""
        pass
        
    async def store_simulation_parameters(self, params_data):
        """TODO: To be implemented"""
        pass
        
    async def get_simulation_by_id(self, sim_id):
        """TODO: To be implemented"""
        pass

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
