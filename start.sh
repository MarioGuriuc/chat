#!/bin/bash

echo "🛸 Starting Conspiracy Theory Forum 👁️"
echo "========================================"

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "⚠️  Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Start PostgreSQL
echo ""
echo "📦 Starting PostgreSQL database..."
docker-compose up -d

# Wait for PostgreSQL to be ready
echo "⏳ Waiting for database to be ready..."
sleep 5

# Check if Maven is available
if ! command -v mvn &> /dev/null; then
    echo "⚠️  Maven is not installed. Please install Maven first."
    exit 1
fi

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Start backend in background
echo ""
echo "🚀 Starting backend server..."
cd backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

# Wait for backend to start
echo "⏳ Waiting for backend to start..."
sleep 15

# Start frontend
echo ""
echo "🌐 Starting frontend..."
cd frontend
npm start

# Cleanup function
cleanup() {
    echo ""
    echo "🛑 Shutting down..."
    kill $BACKEND_PID 2>/dev/null
    docker-compose down
    exit 0
}

trap cleanup INT TERM
