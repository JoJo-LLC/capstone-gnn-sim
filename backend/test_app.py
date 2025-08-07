import os
import shutil
import pytest
import httpx
import psutil

from unittest import mock
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_upload_file():
    # Create a temporary file to upload
    with open("test_file.npz", "wb") as f:
        f.write(os.urandom(1024))  # Write 1KB of random data

    with open("test_file.npz", "rb") as f:
        response = client.post("/uploadfile/", files={"file": ("test_file.npz", f, "application/npz")})
    
    assert response.status_code == 200
    assert response.json()["filename"] == "test_file.npz"
    assert os.path.exists(response.json()["location"])

    # Clean up
    os.remove("test_file.npz")
    os.remove(response.json()["location"])

   
def test_get_status():
    response = client.get("/status/")
    
    assert response.status_code == 200
    assert response.json() == {"status": "Simulation is running"}
  
    


def test_get_resource_usage():
    with mock.patch('psutil.cpu_percent', return_value=50):
        with mock.patch('psutil.virtual_memory') as mock_memory:
            # Create a mock object with the attributes of virtual_memory
            mock_memory.return_value = mock.Mock(
                total=8000000000,  # 8 GB total memory
                available=4000000000,  # 4 GB available
                percent=50,  # 50% used
                used=4000000000,  # 4 GB used
                free=4000000000   # 4 GB free
            )
            
            # Send GET request to /system/resource_usage
            response = client.get("/system/resource_usage")
            
            # Assert the status code and response content
            assert response.status_code == 200
            assert response.json() == {
                "cpu_usage": 50,  # Mocked CPU usage
                "memory_total": 8000000000,  # 8 GB total
                "memory_used": 4000000000,   # 4 GB used
                "memory_free": 4000000000    # 4 GB free
            }

