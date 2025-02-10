PharmaDirect Backend
Project Overview
A NestJS-based backend application for pharmacy management with CI/CD pipeline integration.

Prerequisites
Node.js 18
Docker
AWS EC2 Instance
MongoDB Atlas account
Installation
git clone <repository-url>
cd pharmadirect
npm install
Environment Setup
Create a .env file with:

DATABASE_URL: MongoDB Atlas connection string
JWT_SECRET: JWT authentication secret
PORT: Application port (default: 3000)
JWT_EXPIRES_IN: Token expiration time
Deployment Steps (EC2 with Docker)
SSH into EC2 instance
Install Docker
Pull Docker image
sudo docker pull cherkaoui97/pharmadirectbuild:latest
Run Docker container
sudo docker run -d -p 3000:3000 --env-file .env --name pharmadirectbuild-container cherkaoui97/pharmadirectbuild
Set up Nginx as reverse proxy (optional)
sudo apt install nginx
sudo nano /etc/nginx/sites-available/default
sudo systemctl restart nginx
Troubleshooting
Ensure MongoDB Atlas IP whitelist includes EC2 instance IP
Check Docker container logs:
sudo docker logs pharmadirectbuild-container
CI/CD Pipeline
Automated testing
Docker image build
Automatic deployment to EC2
