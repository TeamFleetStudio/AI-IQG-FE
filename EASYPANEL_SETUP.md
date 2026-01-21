# Easypanel Deployment Setup Guide

## Environment Variables for Easypanel

### Required Environment Variables

**None required** - The application will work with defaults, but for best results, add these:

### Recommended Environment Variables

Add these in Easypanel to ensure the service is reachable:

| Variable | Value | Description | Required |
|----------|-------|-------------|----------|
| `HOSTNAME` | `0.0.0.0` | Binds server to all interfaces (makes it reachable) | **Recommended** |
| `PORT` | `3000` | Port number (usually auto-set, but specify if needed) | Optional |
| `NODE_ENV` | `production` | Production mode (usually auto-set) | Optional |

### Minimum Setup (Recommended)

Add this ONE environment variable in Easypanel:

```
HOSTNAME=0.0.0.0
```

This ensures the service binds to `0.0.0.0` instead of `localhost`, making it accessible from outside the container.

## How to Set Environment Variables in Easypanel

1. **Go to your service** in Easypanel dashboard
2. **Click on "Settings"** or find "Environment Variables" section
3. **Add the variable:**
   - **Key:** `HOSTNAME`
   - **Value:** `0.0.0.0`
4. **Save** the changes
5. **Redeploy** the service (or it may auto-redeploy)

## Deployment Process

### Source Code vs Environment Variables

**IMPORTANT:** These are separate:

1. **Source Code** - Deployed automatically from GitHub
   - ✅ Already connected to your GitHub repo
   - ✅ Automatically deploys on every push to `main` branch
   - ✅ No manual action needed

2. **Environment Variables** - Set in Easypanel UI
   - ⚙️ Configured in Easypanel dashboard
   - ⚙️ NOT stored in Git (for security)
   - ⚙️ Set once, persists across deployments

### Step-by-Step Deployment

#### Step 1: Source Code (Already Done ✅)
- Your GitHub repo is connected
- Code is automatically deployed on push
- **No action needed** - this is automatic

#### Step 2: Environment Variables (Do This Now ⚙️)
1. Open your service in Easypanel
2. Go to Settings → Environment Variables
3. Add: `HOSTNAME=0.0.0.0`
4. Save

#### Step 3: Verify Deployment
1. Check service logs for: `> Ready on http://0.0.0.0:3000`
2. Test the service URL
3. Service should now be reachable

## Complete Environment Variables List

### For Easypanel (Recommended)

```bash
HOSTNAME=0.0.0.0
PORT=3000
NODE_ENV=production
```

**Note:** `PORT` and `NODE_ENV` are usually auto-set by Easypanel, but you can add them explicitly if needed.

### Minimal Setup (Minimum Required)

```bash
HOSTNAME=0.0.0.0
```

This is the **only one you really need** to add manually.

## Why HOSTNAME is Important

- **Without it:** Service binds to `localhost` → Not reachable from outside
- **With it:** Service binds to `0.0.0.0` → Reachable from anywhere
- **Default:** The `server.js` defaults to `0.0.0.0`, but setting it explicitly ensures it works

## Troubleshooting

### Service Still Not Reachable?

1. **Check Environment Variables:**
   - Verify `HOSTNAME=0.0.0.0` is set
   - Check for typos

2. **Check Logs:**
   - Look for: `> Ready on http://0.0.0.0:3000`
   - If you see `localhost`, the env var isn't being read

3. **Redeploy:**
   - After adding env vars, redeploy the service
   - Environment variables are applied on service start

4. **Check Port:**
   - Verify port 3000 is configured in Easypanel
   - Check service settings for port configuration

## Summary

✅ **Deploy Source Code:** Automatic from GitHub (already set up)  
⚙️ **Set Environment Variables:** Add `HOSTNAME=0.0.0.0` in Easypanel UI  
✅ **That's it!** Service should be reachable

### Quick Checklist

- [ ] Source code connected to GitHub ✅ (Already done)
- [ ] Add `HOSTNAME=0.0.0.0` in Easypanel environment variables
- [ ] Save and redeploy
- [ ] Check logs for "Ready on http://0.0.0.0:3000"
- [ ] Test service URL

