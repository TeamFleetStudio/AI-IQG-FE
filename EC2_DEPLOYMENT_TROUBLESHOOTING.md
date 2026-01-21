# EC2 Deployment Form - Validation Error Troubleshooting

## Repository Information (Verified)
- **Owner**: `TeamFleetStudio`
- **Repository**: `AI-IQG-FE`
- **Branch**: `main` ✅ (exists and verified)
- **Remote URL**: `https://github.com/TeamFleetStudio/AI-IQG-FE.git`

## Common Validation Errors & Solutions

### Error: "This has to be a valid branch in your repo"

#### Solution 1: Use HTTPS URL Format
If the form asks for repository URL, use:
```
https://github.com/TeamFleetStudio/AI-IQG-FE.git
```
NOT:
```
git@github.com:TeamFleetStudio/AI-IQG-FE.git
```

#### Solution 2: Verify Repository Access
1. Make sure the deployment platform has access to your GitHub account
2. If the repository is private, grant the deployment platform access:
   - Go to GitHub → Settings → Applications → Authorized OAuth Apps
   - Ensure the deployment platform has access

#### Solution 3: Try Alternative Branch Names
If `main` doesn't work, try:
- `master` (some platforms default to this)
- Check if the form auto-detects branches after entering the repository

### Error: "Build Path" Validation

#### Solution 1: Try Empty Build Path
Instead of `/`, try:
- Leave it **empty** (blank)
- Or use `.` (current directory)

#### Solution 2: Verify Build Path Format
Some platforms expect:
- Empty field (auto-detects root)
- `.` (current directory)
- `/` (root - might cause issues)
- `./` (current directory with slash)

## Recommended Form Values

### Option A: Standard Format
```
Owner: TeamFleetStudio
Repository: AI-IQG-FE
Repository URL: https://github.com/TeamFleetStudio/AI-IQG-FE.git
Branch: main
Build Path: (leave empty or use ".")
```

### Option B: Alternative Format
```
Owner: TeamFleetStudio
Repository: AI-IQG-FE
Branch: main
Build Path: .
Root Directory: /
```

### Option C: Full URL Format
```
Repository URL: https://github.com/TeamFleetStudio/AI-IQG-FE.git
Branch: main
Build Path: (leave empty)
```

## Step-by-Step Troubleshooting

1. **Verify Repository is Accessible**
   ```bash
   # Test if repository is accessible
   curl -I https://github.com/TeamFleetStudio/AI-IQG-FE
   ```

2. **Check Branch Exists**
   - Visit: https://github.com/TeamFleetStudio/AI-IQG-FE/tree/main
   - Verify the branch is visible

3. **Repository Visibility**
   - If private: Ensure deployment platform has GitHub access
   - Consider making it public temporarily for testing

4. **Try Different Build Path Values**
   - First try: Leave empty
   - Second try: `.`
   - Third try: `./`
   - Last resort: `/`

5. **Check Form Requirements**
   - Some forms require the repository to be connected via OAuth first
   - Look for a "Connect GitHub" or "Authorize" button

## Alternative: Manual Deployment Commands

If the form continues to fail, you can deploy manually via SSH:

```bash
# Connect to EC2
ssh -i your-key.pem ubuntu@your-ec2-ip

# Clone repository
git clone https://github.com/TeamFleetStudio/AI-IQG-FE.git
cd AI-IQG-FE
git checkout main

# Install and build
npm install
npm run build

# Start with PM2
pm2 start npm --name "ai-iqg-fe" -- start
```

## Contact Support

If validation errors persist:
1. Check the deployment platform's documentation
2. Verify your GitHub account permissions
3. Try creating a test public repository to verify the form works
4. Contact the hackathon platform support with:
   - Repository URL
   - Error message screenshot
   - Branch verification (screenshot of GitHub showing main branch)

