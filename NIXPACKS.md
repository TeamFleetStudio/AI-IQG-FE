# Nixpacks Deployment Guide

## What is Nixpacks?

Nixpacks is an automatic buildpack system that detects and builds your application without needing a Dockerfile. It's perfect for Next.js applications and works seamlessly with platforms like Railway and Render.

## Why Use Nixpacks?

✅ **Automatic Detection** - Detects Next.js automatically  
✅ **No Dockerfile Required** - Simpler than Docker  
✅ **Works with Docker Backend** - Frontend uses Nixpacks, backend uses Docker  
✅ **Easy Deployment** - Just push to Git and deploy  
✅ **Optimized Builds** - Handles caching and optimization automatically  

## How It Works

1. **Auto-Detection**: Nixpacks reads your `package.json` and detects Next.js
2. **Installation**: Installs Node.js 20.x and dependencies
3. **Build**: Runs `npm run build`
4. **Start**: Runs `npm start` on port 3000

## Configuration File

The `nixpacks.toml` file provides explicit configuration (optional):

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

## Deployment Platforms

### Railway (Recommended)

Railway uses Nixpacks by default and auto-detects Next.js.

**Steps:**
1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select `TeamFleetStudio/AI-IQG-FE`
5. Railway automatically:
   - Detects Next.js
   - Installs dependencies
   - Builds the application
   - Deploys it

**No configuration needed!**

### Render

Render supports Nixpacks buildpack.

**Steps:**
1. Go to [render.com](https://render.com)
2. Sign in with GitHub
3. Click "New +" → "Web Service"
4. Connect `TeamFleetStudio/AI-IQG-FE`
5. Select "Nixpacks" as buildpack (or let it auto-detect)
6. Deploy

## Environment Variables

If you need environment variables, add them in your platform's dashboard:

- **Railway**: Project Settings → Variables
- **Render**: Environment → Environment Variables

Currently, no environment variables are required as the app uses the deployed backend at `https://iqg-api.fsgarage.in`.

## Build Process

Nixpacks will automatically:

1. **Setup Phase**: Install Node.js 20.x
2. **Install Phase**: Run `npm ci` (or `npm install`)
3. **Build Phase**: Run `npm run build`
4. **Start**: Run `npm start` on port 3000

## Troubleshooting

### Build Fails

Check that:
- `package.json` has correct `build` and `start` scripts
- Node.js version is compatible (20.x recommended)
- All dependencies are listed in `package.json`

### Port Issues

Nixpacks automatically uses port 3000. If your platform requires a different port:

1. Check platform documentation for port configuration
2. Some platforms set `PORT` environment variable automatically

### Custom Build Commands

If you need custom build commands, update `nixpacks.toml`:

```toml
[phases.build]
cmds = ["npm run build", "npm run custom-command"]
```

## Comparison: Nixpacks vs Docker

| Feature | Nixpacks | Docker |
|---------|----------|--------|
| Configuration | Minimal (auto-detect) | Requires Dockerfile |
| Build Time | Fast (cached) | Can be slower |
| Complexity | Simple | More complex |
| Portability | Platform-specific | Universal |
| Best For | Simple deployments | Complex setups |

## Your Setup

- **Backend**: Running with Docker ✅
- **Frontend**: Can use Nixpacks ✅
- **Result**: Best of both worlds!

## Quick Deploy Commands

### Railway
```bash
# Just connect your GitHub repo - that's it!
# Railway handles everything automatically
```

### Render
```bash
# Connect repo → Select Nixpacks → Deploy
# Render auto-detects Next.js
```

## Next Steps

1. Choose a platform (Railway or Render recommended)
2. Connect your GitHub repository
3. Deploy - Nixpacks handles the rest!

No Dockerfile needed for the frontend! 🎉

