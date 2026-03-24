#!/bin/bash

echo "🚀 Starting Business Contract Validator"
echo "========================================"

# Check if Endee is cloned
if [ ! -d "endee" ]; then
    echo "❌ Endee not found!"
    echo "Please fork and clone Endee:"
    echo "1. Star: https://github.com/endee-io/endee"
    echo "2. Fork the repository"
    echo "3. Clone: git clone https://github.com/YOUR_USERNAME/endee.git"
    exit 1
fi

# Start backend
echo "📦 Starting Backend..."
cd backend
if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python -m venv venv
fi

source venv/bin/activate
pip install -r requirements.txt > /dev/null 2>&1
python -m app.main &
BACKEND_PID=$!
cd ..

# Start frontend
echo "🎨 Starting Frontend..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "Installing dependencies..."
    npm install > /dev/null 2>&1
fi
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Services started!"
echo "Frontend: http://localhost:5173"
echo "Backend:  http://localhost:8000"
echo ""
echo "⚠️  Make sure Endee is running on port 8001"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
