# Render Deployment Fix

## Problem
The backend deployment was failing because:
1. Render was running `yarn` at the repository root instead of in the `backend` directory
2. The start command was trying to rebuild, which should happen in the build step
3. The path to `dist/server.js` was incorrect

## Solution

### Option 1: Using Render Dashboard (Recommended)

1. Go to your Render service settings
2. **Set Root Directory**: `backend` (This is the most important step!)
3. **Build Command**: `yarn install && yarn build`
4. **Start Command**: `node dist/server.js`
5. **Environment Variables**:
   - `PORT=10000`
   - `ASSEMBLYAI_API_KEY=your_key`
   - `FRONTEND_URL=https://your-frontend-url.vercel.app`
   - `NODE_ENV=production`

### Option 2: Using render.yaml

The `render.yaml` file has been created at the root. If you're creating a new service:
1. Render will automatically detect and use `render.yaml`
2. Make sure the service name matches: `video-caption-backend`

If you have an existing service:
1. You may need to delete and recreate it, OR
2. Manually set the Root Directory to `backend` in the dashboard

## Changes Made

1. ✅ Updated `backend/package.json`:
   - Changed `start` script from `yarn build && node dist/server.js` to `node dist/server.js`
   - Added `start:build` script for local development if needed

2. ✅ Created `render.yaml` at root with proper configuration

3. ✅ Updated `DEPLOYMENT.md` with correct instructions

## Next Steps

1. **In Render Dashboard**:
   - Go to your service → Settings
   - Set **Root Directory** to: `backend`
   - Update **Build Command** to: `yarn install && yarn build`
   - Update **Start Command** to: `node dist/server.js`
   - Save changes

2. **Redeploy**:
   - Trigger a new deployment
   - The build should now succeed

## Verification

After deployment, check:
- Build logs show TypeScript compilation succeeding
- Start command finds `dist/server.js`
- Health check endpoint `/health` responds

