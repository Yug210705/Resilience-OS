#!/bin/bash
echo "===================================================="
echo "Starting RESILIENCE OS (Hackathon Demo Environment)"
echo "===================================================="

echo "[1/3] Starting Backend (Impact Engine) on Port 8000..."
cd backend/impact-engine
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 8000 &
BACKEND_PID=$!
cd ../..

echo "[2/3] Waiting for backend to initialize..."
sleep 3

echo "[3/3] Starting Frontend (Next.js) on Port 3000..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "===================================================="
echo "Services started!"
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:8000/docs"
echo "Press Ctrl+C to stop all services."
echo "===================================================="

# Trap SIGINT and kill background processes
trap "kill $BACKEND_PID $FRONTEND_PID" SIGINT
wait
