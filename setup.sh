#!/bin/bash
# Survey App Quick Setup Script
# This script sets up the project for development and deployment

echo "======================================"
echo "Survey App - Setup Script"
echo "======================================"
echo ""

# Check Node.js installation
echo "Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

echo "✓ Node.js version: $(node -v)"
echo "✓ npm version: $(npm -v)"
echo ""

# Navigate to frontend
cd frontend || exit

# Install dependencies
echo "Installing dependencies..."
npm install

if [ $? -eq 0 ]; then
    echo "✓ Dependencies installed successfully"
else
    echo "❌ Dependency installation failed"
    exit 1
fi

echo ""
echo "======================================"
echo "Setup Complete!"
echo "======================================"
echo ""
echo "To start development server:"
echo "  cd frontend"
echo "  npm run dev"
echo ""
echo "To build for production:"
echo "  cd frontend"
echo "  npm run build"
echo ""
echo "For deployment information, see: DEPLOYMENT.md"
echo ""
