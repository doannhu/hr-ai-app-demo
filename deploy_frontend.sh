#!/bin/bash

# HR AI App Frontend Deployment Script
# VPS IP: 14.225.192.42

set -e  # Exit on any error

# Configuration
VPS_IP="14.225.192.42"
VPS_USER="root"  # Change if using different user
REMOTE_DIR="/var/www/hr-ai-app"
FRONTEND_DIR="$REMOTE_DIR/frontend"

echo "🚀 Starting HR AI App Frontend Deployment..."
echo "📍 Target VPS: $VPS_IP"
echo "📁 Remote Directory: $FRONTEND_DIR"

# Check if we're in the project root directory
if [ ! -d "ai_app_frontend" ]; then
    echo "❌ Error: Please run this script from the project root directory (where ai_app_frontend/ is located)"
    exit 1
fi

# Navigate to frontend directory
cd ai_app_frontend

# Check if package.json exists in frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found in ai_app_frontend directory"
    exit 1
fi

# Create .env file for production
echo "📝 Creating production environment file..."
cat > .env << EOF
# Production Environment Variables
# Uncomment the production URL and comment out development URL

# Development (comment out for production)
# REACT_APP_API_URL=http://localhost:8000

# Production (uncomment for production)
REACT_APP_API_URL=http://14.225.192.42/api
EOF

echo "✅ Environment file created with production API URL"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the application
echo "🔨 Building React application..."
npm run build

# Check if build was successful
if [ ! -d "build" ]; then
    echo "❌ Error: Build failed. Please check for errors above."
    exit 1
fi

echo "✅ Build completed successfully!"

# Create build directory structure on VPS
echo "📁 Creating build directory structure on VPS..."
ssh $VPS_USER@$VPS_IP "mkdir -p $FRONTEND_DIR/build"

# Copy build files to VPS
echo "📤 Copying build files to VPS..."
echo "🔑 You will be prompted for your VPS password..."
scp -r build/* $VPS_USER@$VPS_IP:$FRONTEND_DIR/build/

# Set proper permissions on VPS
echo "🔐 Setting proper permissions..."
ssh $VPS_USER@$VPS_IP "chown -R www-data:www-data $FRONTEND_DIR"

# Restart Nginx to serve new files
echo "🔄 Restarting Nginx..."
ssh $VPS_USER@$VPS_IP "systemctl restart nginx"

echo "✅ Frontend deployment completed!"
echo ""
echo "🌐 Your application is now available at:"
echo "   http://$VPS_IP/"
echo ""
echo "📋 To test the deployment:"
echo "1. Visit http://$VPS_IP/ in your browser"
echo "2. Test the candidate form"
echo "3. Test the employer login"
echo "4. Check that API calls work correctly"
echo ""
echo "🔧 If you need to make changes:"
echo "1. Edit your code locally"
echo "2. Run this script again"
echo "3. The new build will be deployed automatically" 