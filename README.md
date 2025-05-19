# Capstone GNN Simulation App - Developer Setup Guide

Repository: https://github.com/JoJo-LLC/capstone-gnn-sim

This guide walks you through cloning the repository and setting up both the backend (FastAPI + Docker) and frontend (Tauri desktop app with vanilla JS). This setup works on both macOS and Windows.

1. Prerequisites

---

You must have the following installed:

General:

- Git
- Node.js (v18 or higher recommended)
- npm
- Docker Desktop (ensure Docker is running)

macOS-specific:

- Rust (install from https://rustup.rs)
- Homebrew (for other dependencies)

Windows-specific:

- Rust (install from https://rustup.rs)
- Windows Subsystem for Linux (optional, but can help for some builds)

Tauri dependencies:

- cargo
- tauri-cli

Install tauri-cli:
cargo install tauri-cli --version '^2.0.0' --locked

2. Clone the Repository

---

git clone https://github.com/JoJo-LLC/capstone-gnn-sim.git
cd capstone-gnn-sim

3. Run the Backend (FastAPI + Docker)

---

The backend is in /backend and uses Docker.

To start the backend:
docker-compose up --build

This will:

- Build the backend container
- Start the FastAPI server at http://localhost:8000

Test the backend is running by visiting:
http://localhost:8000/ – should return {"message":"FastAPI backend is running"}

To stop it:
Press Ctrl+C or use `docker-compose down`

4. Run the Frontend (Tauri Desktop App)

---

The frontend is inside the /tauri-app directory.

Steps to run:

cd tauri-app
cargo tauri dev

This will launch the desktop application locally.

5. File Structure Overview (Summary)

---

/backend
FastAPI backend, Dockerfile, requirements.txt
/tauri-app
Tauri frontend (vanilla JS)
/frontend/public
Mockup HTML, JS, and CSS used in the UI prototype
/docker-compose.yml
Combines and runs backend services in Docker

6. Notes

---

- The project is containerized for consistency. If you use Docker, you do not need to manually create virtual environments.
- Tauri and cargo must be installed globally on your machine to run the frontend.
- Use `cargo tauri dev` whenever you make frontend changes to see the results.

Optional: If you're having Docker issues, make sure your Docker Desktop is running and has sufficient permissions (especially on macOS).
