# Deployment Guide

This guide covers deploying the Video Caption Generator application to production.

## Prerequisites

- GitHub account
- Vercel account (for frontend)
- Render/Railway account (for backend)
- AssemblyAI API key (free tier available)

## Frontend Deployment (Vercel)

### Step 1: Prepare Repository

1. Push your code to GitHub
2. Ensure all environment variables are documented

### Step 2: Deploy to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js
   - **Root Directory**: `website`
   - **Build Command**: `npm run build` (or `yarn build`)
   - **Output Directory**: `.next`

### Step 3: Set Environment Variables

In Vercel project settings, add:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com/api
```

### Step 4: Deploy

Click "Deploy" and wait for the build to complete.

## Backend Deployment (Render)

### Step 1: Prepare Backend

1. Ensure `package.json` has correct build and start scripts
2. Create a `render.yaml` or use Render dashboard

### Step 2: Deploy to Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: video-caption-backend
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install && npm run build`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: `backend`

### Step 3: Set Environment Variables

Add in Render dashboard:
```
PORT=10000
ASSEMBLYAI_API_KEY=your_assemblyai_api_key
FRONTEND_URL=https://your-frontend-url.vercel.app
```

### Step 4: Deploy

Click "Create Web Service" and wait for deployment.

## Alternative: Railway Deployment

### Backend on Railway

1. Go to [Railway](https://railway.app)
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your repository
4. Add service:
   - **Root Directory**: `backend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
5. Add environment variables (same as Render)
6. Deploy

## Important Notes

### File Storage

For production, consider using cloud storage:
- **AWS S3**
- **Cloudinary**
- **Google Cloud Storage**

Update `videoService.ts` to use cloud storage instead of local filesystem.

### FFmpeg Installation

Render and Railway may require custom buildpacks or Docker images with FFmpeg pre-installed.

**Option 1: Docker**
Create a `Dockerfile` in backend:
```dockerfile
FROM node:18

# Install FFmpeg
RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

CMD ["npm", "start"]
```

**Option 2: Buildpack**
Use a buildpack that includes FFmpeg.

### CORS Configuration

Update `backend/src/server.ts`:
```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-frontend.vercel.app',
  credentials: true,
}));
```

### Remotion Rendering

Remotion rendering requires:
- Sufficient memory (at least 2GB)
- Node.js environment
- FFmpeg installed

For serverless environments, consider:
- Using a separate rendering service
- Queue-based rendering (Redis + Bull)
- External rendering API

## Monitoring

### Health Checks

The backend includes a health check endpoint:
```
GET /health
```

### Logging

Set up logging:
- **Vercel**: Built-in logging
- **Render**: View logs in dashboard
- **Railway**: View logs in dashboard

## Scaling Considerations

1. **File Upload Limits**: Adjust based on platform limits
2. **Rendering Queue**: Implement queue for multiple renders
3. **Database**: Add database for job tracking (PostgreSQL, MongoDB)
4. **Caching**: Cache transcription results
5. **CDN**: Use CDN for video delivery

## Troubleshooting

### Build Failures

- Check Node.js version (18+)
- Verify all dependencies are in package.json
- Check build logs for errors

### Runtime Errors

- Verify environment variables
- Check FFmpeg installation
- Review application logs

### CORS Issues

- Verify FRONTEND_URL matches actual frontend URL
- Check CORS middleware configuration

## Cost Optimization

1. **AssemblyAI API**: Monitor usage (free tier includes $50 in credits)
2. **Storage**: Use cloud storage with lifecycle policies
3. **Compute**: Right-size instances based on usage
4. **CDN**: Use CDN for static assets

## Security

1. **API Keys**: Never commit API keys to repository
2. **Rate Limiting**: Already implemented in backend
3. **File Validation**: Validate file types and sizes
4. **HTTPS**: Always use HTTPS in production

