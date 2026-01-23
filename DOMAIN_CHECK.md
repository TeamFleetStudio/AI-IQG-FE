# How to Check if UI is Running on hiredeck.fsgarage.in

## Quick Checks

### 1. Open in Browser
Simply visit: **https://hiredeck.fsgarage.in**

**What to look for:**
- ✅ **200 OK** - Service is running, you should see the UI
- ❌ **502 Bad Gateway** - Service is not running or not reachable
- ❌ **503 Service Unavailable** - Service is starting up
- ❌ **404 Not Found** - Domain not configured correctly
- ❌ **Connection Refused** - Service not running

### 2. Check HTTP Status Code
```bash
curl -I https://hiredeck.fsgarage.in
```

**Expected response:**
```
HTTP/2 200
```

**Current issue (502):**
```
HTTP/2 502
```
This means the domain is configured but the service isn't responding.

## Troubleshooting 502 Error

### Step 1: Check Service Status in Easypanel

1. **Go to Easypanel Dashboard**
2. **Navigate to your service** (`ai-iqg-fe`)
3. **Check the status:**
   - Is it "Running" or "Stopped"?
   - Check CPU/Memory usage
   - Look at recent deployments

### Step 2: Check Service Logs

1. **Go to your service in Easypanel**
2. **Click on "Logs" tab**
3. **Look for:**
   - `> Ready on http://0.0.0.0:3000` - Service is running ✅
   - Error messages - Service failed to start ❌
   - No recent logs - Service might be stopped ❌

### Step 3: Check Deployment Status

1. **Go to "Deployments" tab**
2. **Check the latest deployment:**
   - ✅ **Success** - Deployment completed
   - ⏳ **In Progress** - Still deploying
   - ❌ **Failed** - Deployment failed

### Step 4: Verify Environment Variables

1. **Go to Settings → Environment Variables**
2. **Verify these are set:**
   ```
   HOSTNAME=0.0.0.0
   PORT=3000
   NODE_ENV=production
   NEXT_PUBLIC_API_URL=https://iqg-api.fsgarage.in
   ```

### Step 5: Check Domain Configuration

1. **Verify domain is connected:**
   - In Easypanel, check if `hiredeck.fsgarage.in` is linked to your service
   - Check DNS settings (should point to Easypanel's server)
   - Verify SSL certificate is configured

## Common Fixes

### Fix 1: Restart Service
1. Go to service in Easypanel
2. Click "Restart" or "Redeploy"
3. Wait for service to start
4. Check logs for "Ready on http://0.0.0.0:3000"

### Fix 2: Check Port Configuration
- Ensure service is configured to use port 3000
- Verify PORT environment variable is set to 3000

### Fix 3: Verify Service is Running
- Check service status shows "Running"
- Check CPU/Memory - should show activity
- If stopped, start the service

### Fix 4: Check Build Status
- Ensure latest deployment completed successfully
- If build failed, check build logs
- Redeploy if needed

## Testing the UI

### 1. Basic Access Test
```bash
# Check if domain responds
curl https://hiredeck.fsgarage.in

# Check HTTP status
curl -I https://hiredeck.fsgarage.in
```

### 2. Browser Test
1. Open browser
2. Go to: `https://hiredeck.fsgarage.in`
3. You should see:
   - ✅ **Interview Question Generator** page
   - ✅ File upload form
   - ✅ "Generate Interview Questions" button

### 3. Functionality Test
1. Upload a resume (PDF or DOCX)
2. Optionally add job description
3. Click "Generate Interview Questions"
4. Should connect to backend API and generate questions

### 4. Check Browser Console
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for:
   - ✅ No errors
   - ❌ CORS errors
   - ❌ Network errors
   - ❌ API connection errors

## Expected Behavior

### When Service is Running ✅
- Domain loads the UI
- You see the interview question generator interface
- Can upload files
- Can generate questions (connects to backend)

### When Service is Not Running ❌
- 502 Bad Gateway error
- "Service is not reachable" message
- Blank page or error page

## Quick Diagnostic Commands

### Check Domain DNS
```bash
nslookup hiredeck.fsgarage.in
```

### Check SSL Certificate
```bash
openssl s_client -connect hiredeck.fsgarage.in:443 -servername hiredeck.fsgarage.in
```

### Test API Connection
```bash
curl https://hiredeck.fsgarage.in/api/health
# (if you have a health endpoint)
```

## Next Steps if 502 Persists

1. **Check Easypanel Logs** - Look for startup errors
2. **Verify Environment Variables** - Ensure all are set correctly
3. **Check Service Status** - Ensure service is running
4. **Review Deployment Logs** - Check if build succeeded
5. **Restart Service** - Try restarting in Easypanel
6. **Check Domain Configuration** - Verify domain is properly linked

## Summary

**To check if UI is running:**
1. Visit: https://hiredeck.fsgarage.in
2. Check Easypanel service status
3. Review service logs
4. Verify deployment completed

**Current Status:** 502 error indicates service needs to be started or fixed.



