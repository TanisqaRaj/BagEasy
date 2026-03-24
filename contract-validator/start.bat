@echo off
echo Starting Business Contract Validator
echo ========================================

REM Check if Endee is cloned
if not exist "endee" (
    echo Endee not found!
    echo Please fork and clone Endee:
    echo 1. Star: https://github.com/endee-io/endee
    echo 2. Fork the repository
    echo 3. Clone: git clone https://github.com/YOUR_USERNAME/endee.git
    exit /b 1
)

REM Start backend
echo Starting Backend...
cd backend
if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

call venv\Scripts\activate
pip install -r requirements.txt >nul 2>&1
start /B python -m app.main
cd ..

REM Start frontend
echo Starting Frontend...
cd frontend
if not exist "node_modules" (
    echo Installing dependencies...
    npm install >nul 2>&1
)
start /B npm run dev
cd ..

echo.
echo Services started!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo.
echo Make sure Endee is running on port 8001
echo.
echo Press Ctrl+C to stop
pause
