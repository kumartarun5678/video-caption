# 🔧 Render Deployment Fix - Step by Step Guide

## Problem
Render is running `yarn` (which only installs dependencies) instead of `yarn install && yarn build` (which also compiles TypeScript). This means `dist/server.js` is never created.

## ✅ Solution: Update Render Dashboard Settings

### Step 1: Go to Your Render Service
1. Log in to [Render Dashboard](https://dashboard.render.com)
2. Click on your `video-caption-backend` service

### Step 2: Open Settings
1. Click on **"Settings"** tab (in the left sidebar)
2. Scroll down to **"Build & Deploy"** section

### Step 3: Update These Settings

**IMPORTANT: Set these EXACT values:**

1. **Root Directory**: 
   ```
   backend
   ```
   ⚠️ This is the MOST IMPORTANT setting! Without this, all commands run from the wrong directory.

2. **Build Command**:
   ```
   yarn install && yarn build
   ```
   This installs dependencies AND compiles TypeScript to create the `dist` folder.

3. **Start Command**:
   ```
   node dist/server.js
   ```
   This runs the compiled JavaScript file.

### Step 4: Save and Redeploy
1. Click **"Save Changes"** at the bottom
2. Go to **"Manual Deploy"** tab
3. Click **"Deploy latest commit"** or push a new commit to trigger deployment

## 📋 Complete Settings Checklist

Make sure these are set in your Render dashboard:

- ✅ **Root Directory**: `backend`
- ✅ **Build Command**: `yarn install && yarn build`
- ✅ **Start Command**: `node dist/server.js`
- ✅ **Environment**: `Node`
- ✅ **Node Version**: `22.16.0` (or latest LTS)

## 🔍 Environment Variables

Also verify these environment variables are set (in **Environment** tab):

- `PORT=10000`
- `ASSEMBLYAI_API_KEY=your_actual_key`
- `FRONTEND_URL=https://your-frontend-url.vercel.app`
- `NODE_ENV=production`

## ✅ Verification

After deployment, check the build logs. You should see:
1. ✅ `yarn install` running
2. ✅ `yarn build` running (TypeScript compilation)
3. ✅ Files being created in `dist/` folder
4. ✅ `node dist/server.js` starting successfully

## 🐛 If It Still Fails

If you still see errors:

1. **Check Build Logs**: Look for TypeScript compilation errors
2. **Verify Root Directory**: Make absolutely sure it's set to `backend` (not `/backend` or `./backend`)
3. **Clear Build Cache**: In Settings → Advanced → "Clear build cache" → Save
4. **Check Node Version**: Ensure it matches your local development version

## 📝 What Changed in the Code

The following files were updated:
- ✅ `backend/package.json` - Start script now just runs the compiled file
- ✅ `render.yaml` - Added rootDir and correct build commands

But you **MUST** update the Render dashboard settings manually for the changes to take effect!

