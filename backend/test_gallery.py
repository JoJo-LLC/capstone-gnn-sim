import asyncio
from database_connection import DatabaseConnection


TEST_GALLERY_DATA = [
    {
        "_id": "demo-1",
        "title": "Rollout Simulation Sample", 
        "description": "Real simulation rollout demonstration",
        "preview_gif": "/static/samples/rollout_2.gif",
        "preview_mp4": None,
        "data_csv": None,
        "tags": ["rollout", "demo", "real"],
        "frames": None,
        "created_at": "2025-08-19T10:00:00Z"
    }
]


async def retrieve_test_data():
    """Populate database with test gallery items"""
    db = DatabaseConnection()
    
    # test connection
    if not await db.connection_test():
        print("Database connection failed")
        return
       
    # Set up index
    await db.setup_gallery_indexes()
    
    # populate with test data
    successful_test = await db.seed_gallery_data(TEST_GALLERY_DATA)
    
    if successful_test:
        print(f"Seeded {len(TEST_GALLERY_DATA)} test gallery items")
        
        # Verify data was inserted
        items = await db.get_gallery_items()
        print(f"Retrieved {len(items)} items from database")
        
        # Show what the API will return
        print("\nAPI response Preview:")
        for item in items:
            print(f"  {item['id']}: {item['title']}")
    else:
        print("Failed to retrieve test data")
    
    await db.close_connection()

if __name__ == "__main__":
    asyncio.run(retrieve_test_data())