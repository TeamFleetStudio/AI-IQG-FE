# Environment Variables for Deployment

## Required Environment Variables

**None required** - The application is configured to work out of the box with the deployed backend.

## Optional Environment Variables

### For Production Deployment

Currently, **no environment variables are required** for deployment. The application uses the deployed backend at `https://iqg-api.fsgarage.in` by default.

### If You Want to Make API URL Configurable (Future)

If you want to make the backend API URL configurable via environment variables, you can add:

| Variable | Description | Default Value | Required |
|----------|------------|---------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | `https://iqg-api.fsgarage.in` | No |

**Note:** Currently, the API URL is hardcoded in the application. To use this environment variable, you would need to update `app/page.tsx` to read from `process.env.NEXT_PUBLIC_API_URL`.

## Platform-Specific Environment Variables

### Automatically Set by Deployment Platforms

These are usually set automatically by the platform - you don't need to configure them:

| Variable | Description | Auto-Set By | Recommended Value |
|----------|-------------|-------------|-------------------|
| `NODE_ENV` | Node environment (`production` or `development`) | Most platforms | `production` |
| `PORT` | Port number for the application | Most platforms (default: 3000) | `3000` |
| `HOSTNAME` | Hostname to bind to (important for containerized deployments) | Some platforms | `0.0.0.0` |

### Easypanel / Railway / Render

**No environment variables needed** - These platforms will:
- Automatically set `NODE_ENV=production`
- Automatically set `PORT` (usually 3000)
- Use Nixpacks to auto-detect and build

### Vercel

**No environment variables needed** - Vercel will:
- Automatically set `NODE_ENV=production`
- Handle port configuration automatically

### Netlify

**No environment variables needed** - Netlify will:
- Automatically set `NODE_ENV=production`
- Handle port configuration automatically

### EC2 / Manual Deployment

**No environment variables needed** - The application will:
- Use the hardcoded backend URL: `https://iqg-api.fsgarage.in`
- Run on port 3000 by default

## Environment Variables Summary for Deployment

### Minimum Configuration (Current Setup)

```
No environment variables required!
```

The application is ready to deploy without any environment variables.

### If You Want to Override Backend URL (Future Enhancement)

If you modify the code to support environment variables, you would add:

```bash
NEXT_PUBLIC_API_URL=https://iqg-api.fsgarage.in
```

## How to Set Environment Variables

### Easypanel
1. Go to your service settings
2. Navigate to "Environment Variables" or "Variables" section
3. Add variables as key-value pairs

### Railway
1. Go to your project
2. Click on your service
3. Go to "Variables" tab
4. Add new variables

### Render
1. Go to your service
2. Navigate to "Environment" section
3. Add environment variables

### Vercel
1. Go to your project
2. Navigate to "Settings" → "Environment Variables"
3. Add variables for Production, Preview, and Development

### Netlify
1. Go to your site
2. Navigate to "Site settings" → "Environment variables"
3. Add variables

### EC2 / Manual
Create a `.env.production` file or set environment variables in your process manager (PM2, systemd, etc.)

## Current Status

✅ **Ready to deploy without any environment variables**

The application is configured to:
- Use the deployed backend at `https://iqg-api.fsgarage.in`
- Work in production mode automatically
- Handle all configuration internally

## Quick Reference

```bash
# No environment variables needed for deployment
# The app is ready to deploy as-is!

# Optional: If you want to make it configurable in the future
NEXT_PUBLIC_API_URL=https://iqg-api.fsgarage.in
```

