@echo off
echo ====================================================
echo Starting RESILIENCE OS (Hackathon Demo Environment)
echo ====================================================

echo [1/3] Starting Backend (Impact Engine) on Port 8000...
cd backend\impact-engine
start cmd /k "python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload"
cd ..\..

echo [2/3] Waiting for backend to initialize...
timeout /t 5 /nobreak > NUL

echo [3/3] Starting Frontend (Next.js) on Port 3000...
cd frontend
start cmd /k "npm run dev"
cd ..

echo ====================================================
echo Services started!
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8000/docs
echo ====================================================
