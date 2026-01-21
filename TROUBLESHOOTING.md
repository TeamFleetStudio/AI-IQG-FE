# Troubleshooting Deployment Issues

## Service Not Reachable

If you see "Service is not reachable" after deployment, try these solutions:

### Issue 1: Next.js Not Binding to 0.0.0.0

**Problem:** Next.js by default binds to `localhost` which is not accessible from outside the container.

**Solution:** The application now uses a custom `server.js` that binds to `0.0.0.0` by default.

**Check:**
- Verify the service is using `npm start` (which runs `node server.js`)
- Check logs to see if it says "Ready on http://0.0.0.0:3000"

### Issue 2: Port Configuration

**Problem:** The service might be running on a different port than expected.

**Solution:** 
- The application uses `PORT` environment variable (default: 3000)
- Ensure your platform is configured to use port 3000
- Check if your platform sets `PORT` automatically

### Issue 3: Build Not Completed

**Problem:** The build might have failed silently.

**Solution:**
- Check build logs in your deployment platform
- Verify `npm run build` completed successfully
- Ensure `.next` directory was created

### Issue 4: Health Check Failing

**Problem:** Platform health checks might be failing.

**Solution:**
- Ensure the service responds to HTTP requests on the root path `/`
- Check if health check endpoint is configured correctly
- Verify the service is actually running (check logs)

## Common Fixes

### For Easypanel

1. **Check Service Logs:**
   - Go to your service → Logs tab
   - Look for "Ready on http://0.0.0.0:3000"
   - Check for any error messages

2. **Verify Port Configuration:**
   - Service should be configured to use port 3000
   - Check service settings → Port configuration

3. **Check Build Status:**
   - Go to Deployments tab
   - Verify build completed successfully
   - Check for any build errors

4. **Restart Service:**
   - Try restarting the service
   - Sometimes a restart fixes connectivity issues

### For Railway / Render

1. **Environment Variables:**
   ```bash
   PORT=3000
   HOSTNAME=0.0.0.0
   NODE_ENV=production
   ```

2. **Check Logs:**
   - Look for startup messages
   - Verify the service is listening on the correct port

### For EC2 / Manual Deployment

1. **Verify Service is Running:**
   ```bash
   pm2 status
   pm2 logs ai-iqg-fe
   ```

2. **Check Port Binding:**
   ```bash
   netstat -tulpn | grep 3000
   # Should show 0.0.0.0:3000, not 127.0.0.1:3000
   ```

3. **Test Locally:**
   ```bash
   curl http://localhost:3000
   ```

## Debugging Steps

1. **Check Build Logs:**
   - Look for "Compiled successfully" message
   - Verify no TypeScript or build errors

2. **Check Runtime Logs:**
   - Look for "Ready on http://0.0.0.0:3000"
   - Check for any runtime errors

3. **Test Connectivity:**
   - Try accessing the service URL
   - Check if port is open and accessible

4. **Verify Configuration:**
   - Ensure `package.json` has correct start script
   - Verify `server.js` exists and is correct
   - Check `next.config.js` is valid

## Quick Fixes

### Fix 1: Update Start Command

If using `next start` directly, ensure it binds to 0.0.0.0:

```json
"start": "next start -H 0.0.0.0 -p ${PORT:-3000}"
```

### Fix 2: Use Custom Server

The application now includes `server.js` which handles binding correctly.

### Fix 3: Set Environment Variables

In your platform, set:
```
HOSTNAME=0.0.0.0
PORT=3000
NODE_ENV=production
```

## Still Not Working?

1. **Check Platform Documentation:**
   - Each platform has specific requirements
   - Check their Next.js deployment guides

2. **Review Logs:**
   - Look for specific error messages
   - Check both build and runtime logs

3. **Test Locally:**
   ```bash
   npm run build
   npm start
   # Then test http://localhost:3000
   ```

4. **Contact Support:**
   - Provide deployment logs
   - Include error messages
   - Share platform-specific details

