# 🚀 HR AI App - VPS Deployment Guide

This guide will help you deploy the HR AI App to your VPS at `14.225.192.42`.

## 📋 Prerequisites

- VPS with Ubuntu/Debian OS
- SSH access to VPS
- OpenAI API key
- Domain name (optional, for SSL)

## 🎯 Deployment Overview

1. **Backend Deployment** - Deploy FastAPI backend first
2. **Frontend Deployment** - Build and deploy React frontend
3. **Configuration** - Set up environment variables
4. **Testing** - Verify everything works

## 🔧 Step 1: Backend Deployment

### 1.1 Prepare Backend Files
```bash
# Navigate to backend directory
cd ai_app_backend

# Make deployment script executable
chmod +x deploy.sh
```

### 1.2 Update Configuration
Edit `deploy.sh` if needed:
- Change `VPS_USER` if not using `root`
- Update `VPS_IP` if different
- Modify any other settings

### 1.3 Run Backend Deployment
```bash
./deploy.sh
```

This script will:
- ✅ Install Python 3.12 and dependencies
- ✅ Set up virtual environment
- ✅ Configure systemd service
- ✅ Set up Nginx reverse proxy
- ✅ Create database
- ✅ Start the backend service

### 1.4 Post-Backend Deployment
```bash
# SSH to VPS
ssh root@14.225.192.42

# Update OpenAI API key
nano /var/www/hr-ai-app/backend/.env

# Restart service
systemctl restart hr-ai-app

# Check status
systemctl status hr-ai-app

# Test API
curl http://14.225.192.42/api/docs
```

## 🌐 Step 2: Frontend Deployment

### 2.1 Prepare Frontend Files
```bash
# Navigate to frontend directory
cd ai_app_frontend

# Make deployment script executable
chmod +x deploy_frontend.sh
```

### 2.2 Configure Environment
The script will create a `.env` file. Edit it:
```bash
# Development (comment out for production)
# REACT_APP_API_URL=http://localhost:8000

# Production (uncomment for production)
REACT_APP_API_URL=http://14.225.192.42/api
```

### 2.3 Run Frontend Deployment
```bash
./deploy_frontend.sh
```

This script will:
- ✅ Build React application
- ✅ Copy build files to VPS
- ✅ Set proper permissions
- ✅ Restart Nginx

## 🔍 Step 3: Testing

### 3.1 Test Backend API
```bash
# Test API documentation
curl http://14.225.192.42/api/docs

# Test candidate submission
curl -X POST http://14.225.192.42/api/candidates \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","phone":"123456789","answers":[]}'
```

### 3.2 Test Frontend
- Visit `http://14.225.192.42/` in your browser
- Test candidate form submission
- Test employer login
- Verify all functionality works

## 🛠️ VPS Directory Structure

After deployment, your VPS will have:
```
/var/www/hr-ai-app/
├── backend/
│   ├── *.py                    # Python source files
│   ├── requirements.txt        # Python dependencies
│   ├── .env                   # Environment variables
│   ├── database.db            # SQLite database
│   └── venv/                  # Python virtual environment
├── frontend/
│   └── build/                 # React build files
└── nginx/
    └── sites-available/
        └── hr-ai-app          # Nginx configuration
```

## 🔧 Management Commands

### Service Management
```bash
# Check service status
systemctl status hr-ai-app

# Restart service
systemctl restart hr-ai-app

# View logs
journalctl -u hr-ai-app -f

# Stop service
systemctl stop hr-ai-app

# Start service
systemctl start hr-ai-app
```

### Nginx Management
```bash
# Check Nginx status
systemctl status nginx

# Restart Nginx
systemctl restart nginx

# Test Nginx configuration
nginx -t

# View Nginx logs
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### Database Management
```bash
# Backup database
cp /var/www/hr-ai-app/backend/database.db /backup/database_$(date +%Y%m%d).db

# View database (if SQLite)
sqlite3 /var/www/hr-ai-app/backend/database.db
```

## 🔄 Updating the Application

### Backend Updates
```bash
# On your local machine
cd ai_app_backend
./deploy.sh
```

### Frontend Updates
```bash
# On your local machine
cd ai_app_frontend
./deploy_frontend.sh
```

## 🔒 Security Considerations

### 1. Firewall Setup
```bash
# Allow SSH, HTTP, HTTPS
ufw allow ssh
ufw allow 80
ufw allow 443
ufw enable
```

### 2. SSL Certificate (Optional)
```bash
# Install Certbot
apt install certbot python3-certbot-nginx

# Get SSL certificate
certbot --nginx -d yourdomain.com
```

### 3. Environment Variables
- Keep `.env` file secure
- Use strong passwords
- Rotate API keys regularly

## 🐛 Troubleshooting

### Common Issues

#### 1. Service Won't Start
```bash
# Check logs
journalctl -u hr-ai-app -f

# Check permissions
ls -la /var/www/hr-ai-app/backend/

# Check Python environment
/var/www/hr-ai-app/backend/venv/bin/python --version
```

#### 2. Nginx Issues
```bash
# Check configuration
nginx -t

# Check logs
tail -f /var/log/nginx/error.log

# Check permissions
ls -la /var/www/hr-ai-app/frontend/build/
```

#### 3. API Connection Issues
```bash
# Test backend directly
curl http://127.0.0.1:8000/api/docs

# Check if service is running
netstat -tlnp | grep 8000

# Check firewall
ufw status
```

### Performance Monitoring
```bash
# Check system resources
htop

# Check disk usage
df -h

# Check memory usage
free -h

# Check CPU usage
top
```

## 📞 Support

If you encounter issues:
1. Check the logs: `journalctl -u hr-ai-app -f`
2. Verify configuration files
3. Test individual components
4. Check system resources

## 🎉 Success!

Your HR AI App is now deployed and running at:
- **Frontend**: `http://14.225.192.42/`
- **Backend API**: `http://14.225.192.42/api/`
- **API Docs**: `http://14.225.192.42/api/docs` 