from pymongo import MongoClient
from datetime import datetime
import os

#Currently implementing non-async to test mongodb connection
#TODO Change to async connection (sprint 2)

class DatabaseConnection:
    def __init__(self):
        #Start MongoDB connection
        db_url = "mongodb://mongodb:27017"
        self.client = MongoClient(db_url)
        self.db = self.client["structural_sim_database"]

    def connection_test(self):
        try:
            self.client.admin.command("ping")
            print("Mongo Connection Success")
            return True
        except Exception as e:
            print(f"Mongo Connection Failed: {e}")
            return False

if __name__ == "__main__":
    db = DatabaseConnection()
    db.connection_test()
