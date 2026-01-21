# Deployment Guide - Interview Question Generator Frontend

## Repository Information
- **Owner**: TeamFleetStudio
- **Repository**: AI-IQG-FE
- **Branch**: main
- **Build Path**: /
- **Framework**: Next.js 14 (App Router)

## Deployment Steps

### Option 1: Vercel (Recommended for Next.js)

1. **Go to Vercel Dashboard**
   - Visit [vercel.com](https://vercel.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add New Project"
   - Select "Import Git Repository"
   - Choose `TeamFleetStudio/AI-IQG-FE`

3. **Configure Project Settings**
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `/` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)
   - **Install Command**: `npm install`
   - **Node.js Version**: 18.x or 20.x (recommended)

4. **Environment Variables** (if needed)
   - Add any required environment variables in the Vercel dashboard
   - Currently, no environment variables are required for this project

5. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your app will be live at `https://ai-iqg-fe.vercel.app` (or custom domain)

### Option 2: Netlify

1. **Go to Netlify Dashboard**
   - Visit [netlify.com](https://netlify.com)
   - Sign in with your GitHub account

2. **Import Project**
   - Click "Add new site" → "Import an existing project"
   - Choose "Deploy with GitHub"
   - Select `TeamFleetStudio/AI-IQG-FE`

3. **Configure Build Settings**
   - **Branch to deploy**: `main`
   - **Base directory**: `/` (leave empty)
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Node version**: 18 or 20

4. **Advanced Build Settings** (if needed)
   - Go to Site settings → Build & deploy
   - Set environment variables if required

5. **Deploy**
   - Click "Deploy site"
   - Your app will be live at `https://random-name.netlify.app`

### Option 3: Railway

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `TeamFleetStudio/AI-IQG-FE`

3. **Configure Settings**
   - **Branch**: `main`
   - **Root Directory**: `/`
   - Railway will auto-detect Next.js

4. **Deploy**
   - Railway will automatically build and deploy
   - Your app will be live at `https://your-app.up.railway.app`

### Option 4: Render (with Nixpacks)

1. **Go to Render Dashboard**
   - Visit [render.com](https://render.com)
   - Sign in with GitHub

2. **Create New Web Service**
   - Click "New +" → "Web Service"
   - Connect `TeamFleetStudio/AI-IQG-FE`

3. **Configure Settings**
   - **Name**: `ai-iqg-fe`
   - **Environment**: Node (or Nixpacks will auto-detect)
   - **Build Command**: `npm install && npm run build` (auto-detected by Nixpacks)
   - **Start Command**: `npm start` (auto-detected by Nixpacks)
   - **Branch**: `main`
   - **Buildpack**: Nixpacks (auto-detects Next.js)

4. **Deploy**
   - Click "Create Web Service"
   - Nixpacks will automatically detect Next.js and build
   - Your app will be live at `https://ai-iqg-fe.onrender.com`

### Option 4b: Railway (with Nixpacks)

Railway uses Nixpacks by default and will auto-detect your Next.js application.

1. **Go to Railway Dashboard**
   - Visit [railway.app](https://railway.app)
   - Sign in with GitHub

2. **Create New Project**
   - Click "New Project"
   - Select "Deploy from GitHub repo"
   - Choose `TeamFleetStudio/AI-IQG-FE`

3. **Nixpacks Auto-Detection**
   - Railway/Nixpacks will automatically:
     - Detect Next.js framework
     - Install Node.js 20
     - Run `npm install`
     - Run `npm run build`
     - Start with `npm start`

4. **Configure (Optional)**
   - **Branch**: `main` (default)
   - **Root Directory**: `/` (default)
   - **Port**: `3000` (auto-detected)

5. **Deploy**
   - Railway will automatically build and deploy using Nixpacks
   - Your app will be live at `https://your-app.up.railway.app`

### Option 5: AWS EC2 (Manual Deployment)

#### Prerequisites
- AWS account with EC2 access
- EC2 instance running (Ubuntu 20.04/22.04 recommended)
- SSH access to the instance
- Security group configured to allow HTTP (80), HTTPS (443), and SSH (22)

#### Step 1: Connect to EC2 Instance
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip-address
```

#### Step 2: Update System and Install Node.js
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x (LTS)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version

# Install PM2 for process management
sudo npm install -g pm2
```

#### Step 3: Install Git and Clone Repository
```bash
# Install Git if not already installed
sudo apt install -y git

# Clone your repository
cd /home/ubuntu
git clone https://github.com/TeamFleetStudio/AI-IQG-FE.git
cd AI-IQG-FE

# Switch to main branch (if not already on it)
git checkout main
```

#### Step 4: Install Dependencies and Build
```bash
# Install project dependencies
npm install

# Build the Next.js application
npm run build
```

#### Step 5: Start the Application with PM2
```bash
# Start the application with PM2
pm2 start npm --name "ai-iqg-fe" -- start

# Save PM2 configuration to restart on reboot
pm2 save
pm2 startup

# Check application status
pm2 status
pm2 logs ai-iqg-fe
```

#### Step 6: Install and Configure Nginx (Reverse Proxy)
```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/ai-iqg-fe
```

Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;  # Replace with your domain or EC2 public IP

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
# Create symbolic link
sudo ln -s /etc/nginx/sites-available/ai-iqg-fe /etc/nginx/sites-enabled/

# Remove default site (optional)
sudo rm /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
sudo systemctl enable nginx
```

#### Step 7: Configure Security Group
In AWS Console:
1. Go to EC2 → Security Groups
2. Select your instance's security group
3. Add inbound rules:
   - **Type**: HTTP, **Port**: 80, **Source**: 0.0.0.0/0
   - **Type**: HTTPS, **Port**: 443, **Source**: 0.0.0.0/0
   - **Type**: SSH, **Port**: 22, **Source**: Your IP (for security)

#### Step 8: (Optional) Set Up SSL with Let's Encrypt
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Obtain SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com

# Certbot will automatically configure Nginx and renew certificates
```

#### Step 9: Verify Deployment
- Visit `http://your-ec2-public-ip` or `http://your-domain.com`
- Check PM2 logs: `pm2 logs ai-iqg-fe`
- Check Nginx logs: `sudo tail -f /var/log/nginx/error.log`

#### Useful PM2 Commands
```bash
# View application status
pm2 status

# View logs
pm2 logs ai-iqg-fe

# Restart application
pm2 restart ai-iqg-fe

# Stop application
pm2 stop ai-iqg-fe

# Monitor resources
pm2 monit
```

#### EC2 Deployment Form Values (for Hackathon Platform)
If using an automated EC2 deployment form:
- **Owner**: `TeamFleetStudio`
- **Repository**: `AI-IQG-FE`
- **Branch**: `main`
- **Build Path**: `/`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start` or `pm2 start npm --name "ai-iqg-fe" -- start`
- **Port**: `3000`
- **Node Version**: `20.x`

### Option 6: Nixpacks Deployment (Recommended for Buildpacks)

Nixpacks is an automatic buildpack system that can detect and build your Next.js application without needing a Dockerfile. It's used by platforms like Railway, Render, and others.

#### How Nixpacks Works

1. **Auto-Detection**: Nixpacks automatically detects Next.js from your `package.json`
2. **Node.js Installation**: Installs the appropriate Node.js version (20.x)
3. **Dependency Installation**: Runs `npm install` or `npm ci`
4. **Build**: Runs `npm run build`
5. **Start**: Runs `npm start` on port 3000

#### Nixpacks Configuration

The `nixpacks.toml` file in the repository provides explicit configuration:

```toml
[phases.setup]
nixPkgs = ["nodejs-20_x", "npm-10_x"]

[phases.install]
cmds = ["npm ci"]

[phases.build]
cmds = ["npm run build"]

[start]
cmd = "npm start"
```

#### Platforms Using Nixpacks

**Railway:**
- Automatically uses Nixpacks
- No configuration needed - just connect your GitHub repo
- Auto-detects Next.js and builds

**Render:**
- Supports Nixpacks buildpack
- Select "Nixpacks" as the buildpack or let it auto-detect

**Other Platforms:**
- Any platform supporting Nixpacks will work automatically

#### Advantages of Nixpacks

✅ **No Dockerfile needed** - Automatic detection and build  
✅ **Simpler deployment** - Just push to Git  
✅ **Automatic optimization** - Handles caching and builds efficiently  
✅ **Works with your backend Docker setup** - Frontend uses Nixpacks, backend uses Docker  

#### Deployment Steps with Nixpacks

1. **Push your code to GitHub** (already done)
2. **Connect to a Nixpacks-supported platform** (Railway, Render, etc.)
3. **Select your repository** - `TeamFleetStudio/AI-IQG-FE`
4. **Deploy** - Nixpacks handles everything automatically

No additional configuration needed! The `nixpacks.toml` file is optional but provides explicit control if needed.

### Option 7: Docker Deployment

#### Prerequisites
- Docker installed on your system
- Docker Compose (optional, for easier management)

#### Local Development with Docker

1. **Build the Docker image:**
   ```bash
   docker build -t ai-iqg-fe .
   ```

2. **Run the container:**
   ```bash
   docker run -p 3000:3000 ai-iqg-fe
   ```

3. **Or use Docker Compose:**
   ```bash
   docker-compose up -d
   ```

4. **View logs:**
   ```bash
   docker-compose logs -f
   ```

5. **Stop the container:**
   ```bash
   docker-compose down
   ```

#### Production Deployment with Docker

1. **Build for production:**
   ```bash
   docker build -t ai-iqg-fe:latest .
   ```

2. **Run in production:**
   ```bash
   docker run -d \
     --name ai-iqg-fe \
     -p 3000:3000 \
     --restart unless-stopped \
     ai-iqg-fe:latest
   ```

#### Docker on EC2

1. **Install Docker on EC2:**
   ```bash
   sudo apt update
   sudo apt install -y docker.io docker-compose
   sudo systemctl start docker
   sudo systemctl enable docker
   sudo usermod -aG docker $USER
   # Log out and back in for group changes to take effect
   ```

2. **Clone and deploy:**
   ```bash
   git clone https://github.com/TeamFleetStudio/AI-IQG-FE.git
   cd AI-IQG-FE
   docker-compose up -d
   ```

3. **Update the application:**
   ```bash
   git pull
   docker-compose down
   docker-compose build --no-cache
   docker-compose up -d
   ```

#### Docker Image Optimization
- Uses multi-stage build for smaller image size
- Alpine Linux base for minimal footprint
- Standalone Next.js output for optimal performance
- Non-root user for security

## Build Configuration

### Build Commands
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start production server (for testing)
npm start
```

### Build Output
- Next.js will create a `.next` directory with the optimized production build
- The build includes static assets and server-side rendering setup

## Environment Variables

### Backend API Configuration

The application is configured to use the deployed backend at `https://iqg-api.fsgarage.in` by default.

**For Production (Default):**
- No environment variable needed - uses `https://iqg-api.fsgarage.in` automatically

**For Local Development:**
1. Create a `.env.local` file in the root directory:
   ```
   NEXT_PUBLIC_API_URL=http://localhost:5000
   ```

**For Custom Backend:**
1. Create a `.env.local` file for local development:
   ```
   NEXT_PUBLIC_API_URL=https://your-api-url.com
   ```

2. For deployment platforms, add the environment variable in the platform's dashboard:
   - **Vercel**: Project Settings → Environment Variables
   - **Netlify**: Site settings → Environment variables
   - **EC2/Railway/Render**: Add in their respective environment variable sections

## Post-Deployment Checklist

- [ ] Verify the site is accessible
- [ ] Test all functionality
- [ ] Check console for errors
- [ ] Verify responsive design on mobile
- [ ] Set up custom domain (if needed)
- [ ] Configure SSL certificate (usually automatic)
- [ ] Set up monitoring/analytics (optional)

## Troubleshooting

### Build Fails
- Check Node.js version (should be 18.x or 20.x)
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

### Runtime Errors
- Check browser console for client-side errors
- Review server logs in deployment platform
- Verify environment variables are set correctly

### Performance Issues
- Enable Next.js Image Optimization
- Check bundle size with `npm run build`
- Consider code splitting if needed

## Support

For issues specific to:
- **Vercel**: [vercel.com/docs](https://vercel.com/docs)
- **Netlify**: [docs.netlify.com](https://docs.netlify.com)
- **Next.js**: [nextjs.org/docs](https://nextjs.org/docs)

