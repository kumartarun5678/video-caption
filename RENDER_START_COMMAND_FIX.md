# 🚨 CRITICAL: Start Command is Wrong!

## The Problem

Your Render service is running `yarn dev` (development mode) instead of the production start command. This causes:
1. ❌ Running in development mode (nodemon, tsx) instead of production
2. ❌ Missing React dependencies (Remotion requires React)
3. ❌ Server crashes immediately

## ✅ Fix Required in Render Dashboard

### Step 1: Go to Render Dashboard
1. Log in at https://dashboard.render.com
2. Click on your `video-caption-backend` service
3. Go to **Settings** tab

### Step 2: Update Start Command

**Current (WRONG):**
```
yarn dev
```

**Change to (CORRECT):**
```
node dist/server.js
```

OR

```
yarn start
```

Both will work, but `node dist/server.js` is more explicit.

### Step 3: Verify All Settings

Make sure these are ALL correct:

- ✅ **Root Directory**: `backend`
- ✅ **Build Command**: `yarn install && yarn build`
- ✅ **Start Command**: `node dist/server.js` (NOT `yarn dev`)
- ✅ **Environment**: `Node`
- ✅ **Node Version**: `22.16.0`

### Step 4: Save and Redeploy

1. Click **"Save Changes"**
2. Go to **"Manual Deploy"** tab
3. Click **"Deploy latest commit"**

## What I Fixed in Code

1. ✅ Added `react` and `react-dom` to dependencies (required by Remotion)
2. ✅ Start script in `package.json` is already correct: `node dist/server.js`

## Why This Happened

The start command in Render was set to `yarn dev` which:
- Uses `nodemon` (development tool)
- Uses `tsx` to run TypeScript directly (not compiled)
- Tries to import Remotion which requires React (not installed)

For production, you need:
- Compiled JavaScript (`dist/server.js`)
- All dependencies installed (including React)
- Production start command

## After Fixing

After updating the start command and redeploying, you should see:

```
==> Running 'node dist/server.js'
Server running on port 10000
Uploads directory: /opt/render/project/src/backend/uploads
Outputs directory: /opt/render/project/src/backend/outputs
```

The server should start successfully! 🎉

