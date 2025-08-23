from fastapi import FastAPI, UploadFile, File, HTTPException, Depends,Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import AsyncGenerator,Optional,List, Any
from database_connection import DatabaseConnection
import shutil
import os
import psutil
import sys

from fastapi.responses import FileResponse
app = FastAPI()
# Allow React to call the Api
origins = [
    "https://localhost:3000",
    "https://localhost:5173",
]

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
@app.get("/predict")
def predict():
    return {"message": "Prediction endpoint"}



async def get_db() -> AsyncGenerator[DatabaseConnection, None]:
    db = DatabaseConnection()
    try:
        yield db
    finally:
        await db.close_connection()

class GalleryItem(BaseModel):
    id: str
    title: str
    description: Optional[str] = None
    preview_gif: Optional[str] = None
    preview_mp4: Optional[str] = None
    data_csv: Optional[str] = None
    tags: Optional[List[str]] = None
    frames: Optional[Any] = None
    created_at: Optional[str] = None
   

def _normalize_gallery_doc(doc: dict) -> GalleryItem:
    return GalleryItem(
        id=str(doc.get("_id", "")),
        title=doc.get("title", ""),
        description=doc.get("description"),
        preview_gif=doc.get("preview_gif"),
        preview_mp4=doc.get("preview_mp4"),
        data_csv=doc.get("data_csv"),
        tags=doc.get("tags"),
        frames=doc.get("frames"),
        created_at=doc.get("created_at"),
    )



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
# Mustefa's Visitor page gif passing test endpoint
@app.get("/gif/{gif_name}")
async def get_gif(gif_name: str):
    return FileResponse(f"gifs/{gif_name}", media_type="image/gif")
#Mustefa's visitor gif passing test endpoint
@app.get("/gif/{gif_name}")
async def get_gif(gif_name: str):
    path = f"gifs/{gif_name}"
    if not os.path.exists(path):
        raise HTTPException(status_code=404, detail="GIF not found")
    return FileResponse(path, media_type="image/gif")

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

# Your GNS test endpoint
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

# Your MongoDB test endpoint  
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
#testing db to be async

    

#App Gallery Endpoints
@app.get("/gallery")
async def list_gallery(db: DatabaseConnection = Depends(get_db)):
    docs = await db.get_gallery_items()
    return [_normalize_gallery_doc(d) for d in docs]

@app.get("/gallery/{item_id}")
async def get_gallery_item(item_id: str, db: DatabaseConnection = Depends(get_db)):
    doc = await db.get_gallery_item(item_id)
    if not doc:
        raise HTTPException(status_code=404, detail="Item not found")
    return _normalize_gallery_doc(doc)
