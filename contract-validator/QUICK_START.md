# Quick Start Guide

Get the Business Contract Validator running in 5 minutes!

## Prerequisites

- Python 3.10+
- Node.js 18+
- Git

## Step 1: Fork and Clone Endee (MANDATORY)

```bash
# 1. Visit https://github.com/endee-io/endee
# 2. Click "Star" ⭐
# 3. Click "Fork" to fork to your account
# 4. Clone your fork:

cd contract-validator
git clone https://github.com/YOUR_USERNAME/endee.git
```

## Step 2: Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate it
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Setup environment
cp .env.example .env

# Start backend
python -m app.main
```

Backend running at: http://localhost:8000

## Step 3: Setup Frontend

Open a new terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend running at: http://localhost:5173

## Step 4: Start Endee

Open a new terminal:

```bash
cd endee
# Follow Endee's README for setup
```

Endee should run on: http://localhost:8001

## Step 5: Test It!

1. Open http://localhost:5173 in your browser
2. Upload `samples/sample_contract.txt`
3. Wait for analysis
4. Review the validation report!

## Quick Commands

### Backend
```bash
# Activate environment
source venv/bin/activate  # or venv\Scripts\activate

# Run server
python -m app.main

# Test API
curl http://localhost:8000/api/health
```

### Frontend
```bash
# Install
npm install

# Dev server
npm run dev

# Build
npm run build
```

### Docker (Alternative)
```bash
# Start everything
docker-compose up

# Stop everything
docker-compose down
```

## Troubleshooting

### "Module not found"
```bash
# Backend
pip install -r requirements.txt

# Frontend
npm install
```

### "Port already in use"
```bash
# Find and kill process
# Windows:
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:8000 | xargs kill -9
```

### "Endee connection failed"
- Make sure Endee is running on port 8001
- Check ENDEE_HOST and ENDEE_PORT in .env
- Test: `curl http://localhost:8001/health`

## Next Steps

- Read [ARCHITECTURE.md](ARCHITECTURE.md) to understand the system
- Check [FEATURES.md](FEATURES.md) for all capabilities
- See [TESTING.md](TESTING.md) for testing guide
- Review [DEPLOYMENT.md](DEPLOYMENT.md) for production setup

## Need Help?

- Check the documentation files
- Review error messages carefully
- Ensure all prerequisites are installed
- Verify ports are not in use

## Success Checklist

- [ ] Backend responds at http://localhost:8000
- [ ] Frontend loads at http://localhost:5173
- [ ] Endee is running on http://localhost:8001
- [ ] Can upload a contract
- [ ] Validation report displays
- [ ] No errors in console

You're ready to go! 🚀
