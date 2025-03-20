#!/bin/bash

# Exit on error
set -e

echo "Setting up Playwright with Report Portal integration..."

# Check if Node.js is installed
if ! command -v node &> /dev/null
then
    echo "Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null
then
    echo "npm is not installed. Please install npm."
    exit 1
fi

# Install dependencies
echo "Installing dependencies..."
npm install

# Install Playwright browsers
echo "Installing Playwright browsers..."
npx playwright install

# Create .env file from example if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
fi

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "Warning: Docker is not installed. Please install Docker Desktop from https://www.docker.com/products/docker-desktop/"
    echo "Docker is required to run Report Portal locally."
else
    echo "Docker is installed."
    
    # Check if Report Portal is already running
    if docker ps | grep -q "reportportal"; then
        echo "Report Portal containers are already running."
    else
        echo "Would you like to start Report Portal containers? (y/n)"
        read -r start_containers
        
        if [ "$start_containers" = "y" ]; then
            cd ../reportportal
            docker-compose up -d
            
            echo "Report Portal is starting up. You can access it at http://localhost:8080"
            echo "Default credentials: superadmin / erebus"
        fi
    fi
fi

echo ""
echo "Setup complete! You can now run tests with: npm test"
echo "For more information, see README.md" 