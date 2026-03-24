# Setup Guide

## Quick Start

### 1. Fork and Star Endee Repository

Before starting, you must:
1. Visit https://github.com/endee-io/endee
2. Click the "Star" button
3. Click "Fork" to fork the repository to your account
4. Clone your forked repository:

```bash
cd contract-validator
git clone https://github.com/YOUR_USERNAME/endee.git
```

### 2. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Run backend
python -m app.main
```

Backend will be available at: http://localhost:8000

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Run development server
npm run dev
```

Frontend will be available at: http://localhost:5173

### 4. Start Endee

Follow the instructions in the Endee repository to start the vector database.

Typically:
```bash
cd endee
# Follow Endee's README for setup
```

Endee should be running on: http://localhost:8001

## Testing the Application

1. Open http://localhost:5173 in your browser
2. Upload a sample contract (PDF, DOCX, or TXT)
3. Wait for analysis to complete
4. Review the validation report

## Sample Contract

Create a test file `sample_contract.txt`:

```
SERVICE AGREEMENT

1. Payment Terms
The Client agrees to pay the Service Provider $10,000 upon signing this agreement.
All payments are non-refundable.

2. Liability
The Service Provider shall have unlimited liability for any damages or losses.

3. Confidentiality
All information shared shall remain confidential indefinitely.

4. Termination
This agreement cannot be terminated by either party under any circumstances.
```

## Troubleshooting

### Backend Issues
- Ensure Python 3.10+ is installed
- Check that all dependencies are installed
- Verify .env configuration

### Frontend Issues
- Ensure Node.js 18+ is installed
- Clear node_modules and reinstall: `rm -rf node_modules && npm install`
- Check that backend is running

### Endee Issues
- Verify Endee is running on port 8001
- Check Endee logs for errors
- Ensure collection is created

## Production Deployment

For production deployment:
1. Use environment variables for sensitive data
2. Enable HTTPS
3. Use a production-grade database
4. Implement authentication
5. Add rate limiting
6. Set up monitoring and logging
