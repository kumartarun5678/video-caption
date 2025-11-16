# Quick Start Guide

Get the Video Caption Generator up and running in 5 minutes.

## Prerequisites

- Node.js 18+ installed
- AssemblyAI API key (free tier available)
- FFmpeg installed

## Installation

```bash
# Clone the repository
git clone <repository-url>
cd video-caption-app

# Install frontend dependencies
cd website
npm install

# Install backend dependencies
cd ../backend
npm install
```

## Configuration

### Backend

Create `backend/.env`:
```env
PORT=5000
ASSEMBLYAI_API_KEY=your-assemblyai-api-key-here
FRONTEND_URL=http://localhost:3000
```

### Frontend

Create `website/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Running

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd website
npm run dev
```

## Usage

1. Open http://localhost:3000
2. Upload an MP4 video
3. Click "Auto-generate Captions"
4. Select a caption style
5. Click "Render Video with Captions"
6. Download your captioned video!

## Testing with Sample Video

1. Use any MP4 video file (under 100MB)
2. For Hinglish testing, use a video with mixed Hindi/English audio
3. Wait for transcription (may take 30 seconds to 2 minutes)
4. Preview and adjust caption style
5. Render and download

## Troubleshooting

**FFmpeg not found:**
```bash
# macOS
brew install ffmpeg

# Ubuntu
sudo apt-get install ffmpeg
```

**Port already in use:**
- Change PORT in backend/.env
- Update NEXT_PUBLIC_API_URL in frontend/.env.local

**AssemblyAI API errors:**
- Verify API key is correct
- Check API quota (free tier includes $50 in credits)
- Sign up at https://www.assemblyai.com/ if you don't have an account

## Next Steps

- See [README.md](./README.md) for detailed documentation
- See [DEPLOYMENT.md](./DEPLOYMENT.md) for production deployment

