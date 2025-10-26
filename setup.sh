#!/bin/bash

# E-Learning Platform Setup Script
echo "🎓 E-Learning Platform Setup"
echo "=============================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed. Please install MySQL first."
    exit 1
fi

echo "✅ Node.js and MySQL are installed"

# Create .env file if it doesn't exist
if [ ! -f "backend/.env" ]; then
    echo "📝 Creating .env file..."
    cp config.example backend/.env
    echo "⚠️  Please edit backend/.env file with your database credentials"
    echo "   - Update DB_PASSWORD with your MySQL password"
    echo "   - Update other settings as needed"
else
    echo "✅ .env file already exists"
fi

# Install dependencies
echo "📦 Installing dependencies..."
cd backend
npm install
cd ..

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with your database credentials"
echo "2. Set up your MySQL database (see README.md)"
echo "3. Run: cd backend && npm start"
echo ""
echo "Default test accounts:"
echo "  Username: john_doe, jane_smith, bob_wilson"
echo "  Password: password123"
