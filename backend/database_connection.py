from pymongo import AsyncMongoClient
from datetime import datetime
import os

#Currently implementing async connection
#Need to not hardcode the login variables - env variables?
#Need to add some form of logging

class DatabaseConnection:
    def __init__(self):
        #Start MongoDB connection
        db_url = "mongodb://admin:password123@mongodb:27017"
        self.client = AsyncMongoClient(db_url)
        self.db = self.client["structural_sim_database"]

        self.collections = {

            'params': self.db['simulationParameters'],
            'results': self.db['simulationResults'],
            'uploads': self.db['uploadData'],
            'logs': self.db['logs']
        }

    async def connection_test(self):
        try:
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
