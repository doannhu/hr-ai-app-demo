#!/bin/bash

# HR AI App Backend Deployment Script
# VPS IP: 14.225.192.42
# Python Version: 3.12

set -e  # Exit on any error

# Configuration
VPS_IP="14.225.192.42"
VPS_USER="root"  # Change if using different user
REMOTE_DIR="/var/www/hr-ai-app"
BACKEND_DIR="$REMOTE_DIR/backend"
SERVICE_NAME="hr-ai-app"

echo "🚀 Starting HR AI App Backend Deployment..."
echo "📍 Target VPS: $VPS_IP"
echo "📁 Remote Directory: $REMOTE_DIR"

# Create local deployment package
echo "📦 Creating deployment package..."

# Create temporary deployment directory
TEMP_DIR="deployment_temp"
rm -rf $TEMP_DIR
mkdir -p $TEMP_DIR

# Copy backend files
echo "📁 Copying backend files..."
# Copy Python files from ai_app_backend directory
cp ai_app_backend/background_tasks.py $TEMP_DIR/
cp ai_app_backend/database.py $TEMP_DIR/
cp ai_app_backend/evaluation.py $TEMP_DIR/
cp ai_app_backend/ideal_answers.py $TEMP_DIR/
cp ai_app_backend/main.py $TEMP_DIR/
cp ai_app_backend/models.py $TEMP_DIR/
cp ai_app_backend/schemas.py $TEMP_DIR/

cp ai_app_backend/requirements.txt $TEMP_DIR/
cp ai_app_backend/README.md $TEMP_DIR/

# Verify files were copied
echo "✅ Files copied to deployment package:"
ls -la $TEMP_DIR/

# Create production .env file
cat > $TEMP_DIR/.env << EOF
# Production Environment Variables
OPENAI_API_KEY=your_openai_api_key_here
EMPLOYER_USERNAME=admin
EMPLOYER_PASSWORD=password
EMPLOYER_TOKEN=your_custom_token_here

# Database Configuration
DATABASE_URL=sqlite:///./database.db

# Server Configuration
HOST=0.0.0.0
PORT=8000
WORKERS=4
EOF

# Create systemd service file
cat > $TEMP_DIR/hr-ai-app.service << EOF
[Unit]
Description=HR AI App Backend
After=network.target

[Service]
Type=exec
User=www-data
Group=www-data
WorkingDirectory=$BACKEND_DIR
Environment=PATH=$BACKEND_DIR/venv/bin
ExecStart=$BACKEND_DIR/venv/bin/gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker --bind 0.0.0.0:8000
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Create Nginx configuration
cat > $TEMP_DIR/nginx-hr-ai-app << EOF
server {
    listen 80;
    server_name 14.225.192.42;  # Change to your domain if available

    # Frontend static files
    location / {
        root $REMOTE_DIR/frontend/build;
        try_files \$uri \$uri/ /index.html;
    }

    # Backend API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8000/;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # CORS headers
    add_header Access-Control-Allow-Origin *;
    add_header Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS";
    add_header Access-Control-Allow-Headers "Content-Type, Authorization";
}
EOF

# Create setup script for VPS
cat > $TEMP_DIR/setup_vps.sh << 'EOF'
#!/bin/bash

# VPS Setup Script for HR AI App Backend

set -e

echo "🔧 Setting up HR AI App Backend on VPS..."

# Update system
echo "📦 Updating system packages..."
apt update && apt upgrade -y

# Install required packages
echo "📦 Installing required packages..."
apt install -y software-properties-common

# Try to install Python 3.12, fallback to available version
echo "🐍 Installing Python..."
if apt install -y python3.12 python3.12-venv python3.12-dev 2>/dev/null; then
    PYTHON_VERSION="python3.12"
    echo "✅ Python 3.12 installed successfully"
else
    echo "⚠️ Python 3.12 not available, trying to add deadsnakes PPA..."
    add-apt-repository ppa:deadsnakes/ppa -y
    apt update
    if apt install -y python3.12 python3.12-venv python3.12-dev 2>/dev/null; then
        PYTHON_VERSION="python3.12"
        echo "✅ Python 3.12 installed successfully"
    else
        echo "⚠️ Python 3.12 still not available, using system Python..."
        # Check available Python versions
        if command -v python3.11 &> /dev/null; then
            PYTHON_VERSION="python3.11"
            apt install -y python3.11-venv python3.11-dev
        elif command -v python3.10 &> /dev/null; then
            PYTHON_VERSION="python3.10"
            apt install -y python3.10-venv python3.10-dev
        elif command -v python3.9 &> /dev/null; then
            PYTHON_VERSION="python3.9"
            apt install -y python3.9-venv python3.9-dev
        else
            PYTHON_VERSION="python3"
            apt install -y python3-venv python3-dev
        fi
        echo "✅ Using $PYTHON_VERSION"
    fi
fi

apt install -y python3-pip nginx git curl

# Create application directory
echo "📁 Creating application directory..."
mkdir -p /var/www/hr-ai-app/backend
mkdir -p /var/www/hr-ai-app/frontend
chown -R www-data:www-data /var/www/hr-ai-app

# Copy files to final location
echo "📁 Copying files to final location..."
cp /tmp/hr-ai-app-deployment/*.py /var/www/hr-ai-app/backend/
cp /tmp/hr-ai-app-deployment/requirements.txt /var/www/hr-ai-app/backend/
cp /tmp/hr-ai-app-deployment/README.md /var/www/hr-ai-app/backend/

# Copy .env file if it exists
if [ -f "/tmp/hr-ai-app-deployment/.env" ]; then
    cp /tmp/hr-ai-app-deployment/.env /var/www/hr-ai-app/backend/
else
    echo "⚠️ .env file not found, creating default one..."
    cat > /var/www/hr-ai-app/backend/.env << 'ENVEOF'
# Production Environment Variables
OPENAI_API_KEY=your_openai_api_key_here
EMPLOYER_USERNAME=admin
EMPLOYER_PASSWORD=password
EMPLOYER_TOKEN=your_custom_token_here

# Database Configuration
DATABASE_URL=sqlite:///./database.db

# Server Configuration
HOST=0.0.0.0
PORT=8000
WORKERS=4
ENVEOF
fi

# Copy configuration files
cp /tmp/hr-ai-app-deployment/hr-ai-app.service /var/www/hr-ai-app/backend/
cp /tmp/hr-ai-app-deployment/nginx-hr-ai-app /var/www/hr-ai-app/backend/
cp /tmp/hr-ai-app-deployment/setup_vps.sh /var/www/hr-ai-app/backend/

# Set up Python virtual environment
echo "🐍 Setting up Python virtual environment..."
cd /var/www/hr-ai-app/backend
$PYTHON_VERSION -m venv venv
source venv/bin/activate

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install --upgrade pip

# Debug: Check what files are available
echo "📁 Files in current directory:"
ls -la

echo "📦 Installing from requirements.txt..."
pip install -r requirements.txt
pip install gunicorn

# Set up systemd service
echo "⚙️ Setting up systemd service..."
cp hr-ai-app.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable hr-ai-app

# Set up Nginx
echo "🌐 Setting up Nginx..."
cp nginx-hr-ai-app /etc/nginx/sites-available/hr-ai-app
ln -sf /etc/nginx/sites-available/hr-ai-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default  # Remove default site
systemctl restart nginx

# Set proper permissions
echo "🔐 Setting proper permissions..."
chown -R www-data:www-data /var/www/hr-ai-app
chmod +x /var/www/hr-ai-app/backend/venv/bin/*

# Create database directory
echo "🗄️ Setting up database..."
touch /var/www/hr-ai-app/backend/database.db
chown www-data:www-data /var/www/hr-ai-app/backend/database.db

echo "✅ VPS setup completed!"
echo "🚀 Starting services..."
systemctl start hr-ai-app
systemctl status hr-ai-app

echo "📋 Next steps:"
echo "1. Update .env file with your OpenAI API key"
echo "2. Test the API: curl http://14.225.192.42/api/docs"
echo "3. Deploy frontend build files to /var/www/hr-ai-app/frontend/build/"
EOF

chmod +x $TEMP_DIR/setup_vps.sh

# Copy files to VPS
echo "📤 Copying files to VPS..."
echo "🔑 You will be prompted for your VPS password..."
scp -r $TEMP_DIR/* $VPS_USER@$VPS_IP:/tmp/hr-ai-app-deployment/

# Execute setup on VPS
echo "🔧 Running setup on VPS..."
echo "🔑 You will be prompted for your VPS password again..."
ssh $VPS_USER@$VPS_IP << 'EOF'
cd /tmp/hr-ai-app-deployment
chmod +x setup_vps.sh
export PYTHON_VERSION="python3.12"  # Will be overridden by setup script
./setup_vps.sh
EOF

# Clean up
echo "🧹 Cleaning up temporary files..."
rm -rf $TEMP_DIR

echo "✅ Deployment completed!"
echo ""
echo "📋 Post-deployment checklist:"
echo "1. SSH to VPS: ssh $VPS_USER@$VPS_IP"
echo "2. Update API key: nano $BACKEND_DIR/.env"
echo "3. Restart service: systemctl restart hr-ai-app"
echo "4. Check status: systemctl status hr-ai-app"
echo "5. Test API: curl http://$VPS_IP/api/docs"
echo "6. Deploy frontend build files to $REMOTE_DIR/frontend/build/"
echo ""
echo "🌐 Your backend API will be available at:"
echo "   http://$VPS_IP/api/"
echo "   http://$VPS_IP/api/docs (Swagger UI)" 