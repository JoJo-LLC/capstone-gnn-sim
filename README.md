# 🏗️ Structural Response Simulation System

A cross-platform desktop simulation app built using **Tauri**, **React**, **FastAPI**, and **Docker** to enable fast, local-first structural response prediction powered by Graph Neural Networks (GNN).

---

## ✅ Requirements

### Software

- Docker (for backend simulation environment)

### Hardware

- 8 GB RAM minimum
- 50 GB free storage recommended

---

## 🚀 How to Use

### 1. Clone the repository

```bash
git clone https://bitbucket.org/curtincomputingprojects/2025-19-ai-powered-structural-response-simulator.git
cd 2025-19-ai-powered-structural-response-simulator/frontend/tauri-app
```

### 2. Install frontend dependencies

```bash
npm or cargo install
```

### 3. Start in development mode

```bash
npm run cargo tauri dev
```

### 4. Build the final application (cross-platform)

```bash
npm or cargo run tauri build
```

> ⚠️ Note: You must have Docker Desktop installed and running in the background.

---

## 🧪 Usage Flow (UI)

1. **Select Role:** Choose from Researcher, Visitor, or Admin.
2. **Upload Simulation Files:** Provide `.npz` files for GNN inference and LS-DYNA comparison.
3. **Customize Visualisation:** Choose between CPU/GPU mode, GIF/MP4/Frame navigation.
4. **Export Results:** Download visualisation or data as `.csv`, `.gif`, or `.mp4`.

---

## 📁 Important Files & Folders

### Frontend (Tauri + React)

- `/frontend/tauri-app/src/components/` — UI component files
- `/frontend/tauri-app/src/views/` — Home, Admin, Visitor, and Researcher pages
- `/frontend/tauri-app/src-tauri/` — Tauri config and Rust bridge backend
- `tauri.conf.json` — App configuration

### Backend (GNN Service)

- `/backend/main.py` — Entry point for Docker container
- `gns_inference_with_progress.py` — GNN prediction logic
- `Dockerfile.cpu` and `Dockerfile.gpu` — Docker setup

### Simulation Data

- Input folder: `~/Documents/StructuralResponseSimulator/data/`
- Model folder: `~/Documents/StructuralResponseSimulator/models/`
- Output folder: `~/Documents/StructuralResponseSimulator/data/output/`

---

## 🛠️ Tech Stack & Developer Guide

### Core Technologies Used

| Layer            | Tech Stack                                  |
| ---------------- | ------------------------------------------- |
| Frontend         | **React (Vite)** + Tailwind CSS             |
| Desktop Shell    | **Tauri v2** (Rust-based cross-platform UI) |
| Backend          | **FastAPI** + PyTorch + NumPy (GNN serving) |
| Containerization | Docker + Docker Compose (CPU/GPU profiles)  |
| Data Format      | `.npz` for simulation input/output          |

### 💡 Developer Setup & Customization

This project is modular, open-source, and built to be extended. Here’s how you can work with and expand it:

- **Frontend UI (React + Tauri):**

  - Found in `/frontend/tauri-app/src`
  - Split into `views/` for top-level pages and `components/` for reusable widgets
  - Uses state-based routing for different user modes (Researcher, Visitor, Admin)
  - Built with Tailwind classes for theming and responsiveness

- **Tauri Backend (Rust):**

  - Found in `/frontend/tauri-app/src-tauri`
  - Configured via `tauri.conf.json`
  - Handles filesystem access, secure mode switching, and Docker integration
  - Compile using `cargo tauri build` or run with `npm run tauri dev`

- **GNN Serving Backend (Python):**

  - Found in `/backend/`
  - Core script: `gns_inference_with_progress.py` (handles .npz inference and live progress reporting)
  - Containerized with `Dockerfile.cpu` and `Dockerfile.gpu`
  - Managed by `docker-compose.cpu.yml` or `docker-compose.gpu.yml`

- **Simulation I/O:**
  - Input data folders are dropped into `~/Documents/StructuralResponseSimulator/data`
  - Models are placed in `~/Documents/StructuralResponseSimulator/models`
  - Output is saved to `~/Documents/StructuralResponseSimulator/data/output`

### 🔧 Extendability

- 🧩 Modular project layout for adding new features easily
- 🌐 Local-first privacy model
- 🔌 Easily swap in new GNN models, data pipelines, or UIs

---

## 📎 Related Project Repositories

- 🔗 GNN Fragment Model: [github.com/qilinli/gns-fragment](https://github.com/qilinli/gns-fragment)
