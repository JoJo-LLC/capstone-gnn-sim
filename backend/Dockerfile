# Use a base image with Python 3.7 and Conda
FROM continuumio/miniconda3:4.9.2

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    ffmpeg \
    gfortran \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Create separate directories
RUN mkdir /gns-fragment /app

# Clone the repository (shallow clone to save space)
WORKDIR /gns-fragment
RUN git clone --depth 1 https://github.com/qilinli/gns-fragment.git .

# Create Conda environment from repository's YAML
RUN conda env create -f environment.yml

# Make download scripts executable
RUN chmod +x download_model.sh download_data.sh

# Set environment PATH to include Conda environment
ENV PATH /opt/conda/envs/gns/bin:$PATH

# Set up the FastAPI app
WORKDIR /app
COPY . .

# Install backend dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Entrypoint script to handle model/data downloads
RUN echo "#!/bin/bash" > /entrypoint.sh && \
    echo "set -e" >> /entrypoint.sh && \
    echo "cd /gns-fragment" >> /entrypoint.sh && \
    echo "if [ ! -d \"model\" ]; then ./download_model.sh; fi" >> /entrypoint.sh && \
    echo "if [ ! -d \"data\" ]; then ./download_data.sh; fi" >> /entrypoint.sh && \
    echo "cd /app" >> /entrypoint.sh && \
    echo "exec \"$@\"" >> /entrypoint.sh && \
    chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
