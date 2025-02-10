# PharmaDirect Backend

## Project Overview
A NestJS-based backend application for pharmacy management with CI/CD pipeline integration.

## Prerequisites
- Node.js 20
- Docker
- AWS EC2 Instance
- MongoDB Atlas account

## Installation
```bash
git clone <repository-url>
cd pharmadirect
npm install
```

## Environment Setup
Create a `.env` file with:
- `DATABASE_URL`: MongoDB Atlas connection string
- `JWT_SECRET`: JWT authentication secret
- `PORT`: Application port (default: 3000)
- `JWT_EXPIRES_IN`: Token expiration time

## Deployment Steps (EC2 with Docker)
1. SSH into EC2 instance
2. Install Docker
3. Pull Docker image
```bash
sudo docker pull cherkaoui97/pharmadirectbuild:latest
```

4. Run Docker container
```bash
sudo docker run -d -p 3000:3000 --env-file .env --name pharmadirectbuild-container cherkaoui97/pharmadirectbuild
```

5. Set up Nginx as reverse proxy (optional)
```bash
sudo apt install nginx
sudo nano /etc/nginx/sites-available/default
sudo systemctl restart nginx
```

## Troubleshooting
- Ensure MongoDB Atlas IP whitelist includes EC2 instance IP
- Check Docker container logs: 
```bash
sudo docker logs pharmadirectbuild-container
```

## CI/CD Pipeline
- Automated testing
- Docker image build
- Automatic deployment to EC2
