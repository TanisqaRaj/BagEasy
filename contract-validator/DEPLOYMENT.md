# Deployment Guide

## Local Development

See [SETUP.md](SETUP.md) for local development setup.

## Docker Deployment

### Prerequisites
- Docker
- Docker Compose

### Steps

1. **Clone and Setup**
```bash
git clone https://github.com/YOUR_USERNAME/contract-validator.git
cd contract-validator
```

2. **Configure Environment**
```bash
cp backend/.env.example backend/.env
# Edit backend/.env with your settings
```

3. **Build and Run**
```bash
docker-compose up --build
```

Services will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Endee: http://localhost:8001

### Stop Services
```bash
docker-compose down
```

## Production Deployment

### Option 1: Cloud Platform (AWS/GCP/Azure)

#### Backend (FastAPI)
1. **Containerize**
   - Use provided Dockerfile
   - Push to container registry

2. **Deploy**
   - AWS: ECS or App Runner
   - GCP: Cloud Run
   - Azure: Container Instances

3. **Environment Variables**
   - Set via platform's secrets manager
   - Never commit .env files

#### Frontend (React)
1. **Build**
```bash
cd frontend
npm run build
```

2. **Deploy Static Files**
   - AWS: S3 + CloudFront
   - Netlify
   - Vercel
   - GCP: Cloud Storage + CDN

#### Endee
1. **Deploy as Service**
   - Use managed Kubernetes
   - Or dedicated VM
   - Ensure persistent storage

### Option 2: VPS (DigitalOcean, Linode)

1. **Setup Server**
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y
```

2. **Clone Repository**
```bash
git clone https://github.com/YOUR_USERNAME/contract-validator.git
cd contract-validator
```

3. **Configure**
```bash
cp backend/.env.example backend/.env
nano backend/.env
```

4. **Run with Docker Compose**
```bash
docker-compose up -d
```

5. **Setup Nginx Reverse Proxy**
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:5173;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

6. **Setup SSL with Let's Encrypt**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com
```

## Environment Variables

### Backend (.env)
```bash
# API Configuration
API_HOST=0.0.0.0
API_PORT=8000

# Endee Configuration
ENDEE_HOST=localhost
ENDEE_PORT=8001
ENDEE_COLLECTION=contract_clauses

# OpenAI (Optional)
OPENAI_API_KEY=sk-...

# File Upload
MAX_FILE_SIZE=10485760
ALLOWED_EXTENSIONS=pdf,docx,txt
UPLOAD_DIR=./uploads

# Database
DATABASE_URL=sqlite+aiosqlite:///./contracts.db
```

### Frontend
Update API base URL in production:
```javascript
// src/services/api.js
const API_BASE_URL = process.env.VITE_API_URL || '/api';
```

## Monitoring

### Health Checks
```bash
# Backend
curl https://yourdomain.com/api/health

# Endee
curl http://localhost:8001/health
```

### Logging
```bash
# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f endee
```

### Metrics
- Response times
- Error rates
- Upload success rate
- Validation completion time

## Backup

### Database Backup
```bash
# Backup SQLite
cp backend/contracts.db backups/contracts_$(date +%Y%m%d).db

# Backup Endee data
docker-compose exec endee /backup.sh
```

### Automated Backups
```bash
# Add to crontab
0 2 * * * /path/to/backup.sh
```

## Scaling

### Horizontal Scaling
1. Load balancer (Nginx/HAProxy)
2. Multiple backend instances
3. Shared storage for uploads
4. Centralized database

### Vertical Scaling
- Increase CPU/RAM
- Optimize Endee configuration
- Use faster storage (SSD)

## Security Checklist

- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] File upload validation
- [ ] Rate limiting enabled
- [ ] CORS properly configured
- [ ] Input sanitization
- [ ] Regular security updates
- [ ] Firewall configured
- [ ] Backup strategy in place
- [ ] Monitoring and alerts set up

## Troubleshooting

### Backend won't start
- Check Python version (3.10+)
- Verify all dependencies installed
- Check .env configuration
- Review logs: `docker-compose logs backend`

### Frontend won't build
- Check Node version (18+)
- Clear node_modules: `rm -rf node_modules && npm install`
- Check for syntax errors

### Endee connection failed
- Verify Endee is running
- Check ENDEE_HOST and ENDEE_PORT
- Test connection: `curl http://localhost:8001/health`

### Upload fails
- Check file size limits
- Verify upload directory permissions
- Check disk space

## Performance Optimization

1. **Backend**
   - Enable caching
   - Use async operations
   - Optimize database queries

2. **Frontend**
   - Code splitting
   - Lazy loading
   - CDN for static assets

3. **Endee**
   - Tune vector dimensions
   - Optimize index settings
   - Use appropriate hardware

## Cost Estimation

### AWS Example
- EC2 t3.medium: $30/month
- S3 + CloudFront: $5/month
- RDS (if used): $15/month
- Total: ~$50/month

### VPS Example
- DigitalOcean Droplet (4GB): $24/month
- Backups: $5/month
- Total: ~$29/month
