import os
import shutil
import pytest
import httpx

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