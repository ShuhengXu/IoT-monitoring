# IoT-monitoring

## Overview

This project implements an IoT monitoring system consisting of multiple services including backend APIs, a temperature service, and a frontend web interface.

## Prerequisites

- If you want to use AI features, you need to apply for an API key at [OpenRouter](https://openrouter.ai) (or the relevant AI provider).
- Create a `.env` file in the `backend/API` directory with the following content:

DEEPSEEK_API_KEY=your_api_key_here


- For Docker and Kubernetes usage, make sure you have installed the following tools:
- Docker (tested with version 24.0+)
- kubectl (version v1.28+)
- Minikube (version v1.32+)

## Setup Instructions


### 1. Local debugging setup
Install Python dependencies for backend services:
```bash
pip install -r API/requirements.txt
pip install -r TemperatureService/requirements.txt
```

Run the backend services in separate terminals (keep them running):
```bash
python API/api.py
python TemperatureService/TemperatureService.py
```
```bash
In the frontend directory, install and start the frontend:
npm install
npm start
```
The frontend web page should open automatically in your browser.

### 2. Docker deployment  
*(Step 1 debugging can be skipped if only the deployment is necessary.)*
Build and run the services with Docker Compose:
docker-compose up --build

### 3. Start Minikube cluster and Kubernetes 
*(optional for Kubernetes deployment)*
```bash
minikube start --cpus=4 --memory=7000 --driver=docker
```
For Kubernetes deployment, load local Docker images into Minikube:
```bash
minikube image load iot-monitoring-temperatureservice:latest
minikube image load iot-monitoring-frontend:latest
minikube image load iot-monitoring-api:latest
```
Apply Kubernetes manifests in the correct order:
```bash
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/postgres/
kubectl apply -f k8s/pgadmin/
kubectl apply -f k8s/tempsvc/
kubectl apply -f k8s/api/
kubectl apply -f k8s/frontend/
```