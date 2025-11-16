# Video Caption Generator

A full-stack web application that allows users to upload MP4 videos, automatically generate captions using AssemblyAI API, and render those captions onto videos using Remotion with support for Hinglish (Hindi + English) text.

## 🚀 Features

- **Video Upload**: Clean UI for uploading MP4 videos (up to 100MB)
- **Auto-Captioning**: One-click caption generation using AssemblyAI API
- **Hinglish Support**: Full support for mixed Hindi (Devanagari) and English text with proper fonts
- **Caption Styles**: 3 predefined styles:
  - Bottom-centered subtitles (standard)
  - Top-bar captions (news-style)
  - Karaoke-style highlighting with word-by-word timing
- **Real-time Preview**: Preview videos with captions before rendering
- **Video Export**: Export final captioned videos as MP4

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **Remotion** - Video rendering and composition
- **Tailwind CSS** - Styling
- **TypeScript** - Type safety
- **Axios** - HTTP client

### Backend
- **Express.js** - Node.js web framework
- **AssemblyAI API** - Speech-to-text transcription
- **FFmpeg** - Video processing
- **Multer** - File upload handling
- **TypeScript** - Type safety

## 📋 Prerequisites

- **Node.js** 18.x or higher
- **npm** or **yarn**
- **FFmpeg** installed on your system
- **AssemblyAI API Key** (for caption generation - free tier available)

## 🔧 Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd video-caption-app
```

### 2. Install Frontend Dependencies

```bash
cd website
npm install
# or
yarn install
```

### 3. Install Backend Dependencies

```bash
cd ../backend
npm install
# or
yarn install
```

### 4. Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=5000
ASSEMBLYAI_API_KEY=your_assemblyai_api_key_here
FRONTEND_URL=https://video-caption-gilt.vercel.app
```

Create a `.env.local` file in the `website` directory:

```env
NEXT_PUBLIC_API_URL=https://video-caption-0i4u.onrender.com/api
```

### 5. Install FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**Windows:**
Download from [FFmpeg official website](https://ffmpeg.org/download.html) and add to PATH.

## 🚀 Running Locally

### Start Backend Server

```bash
cd backend
npm run dev
# or
yarn dev
```

The backend server will run on `https://video-caption-0i4u.onrender.com`

### Start Frontend Development Server

```bash
cd website
npm run dev
# or
yarn dev
```

The frontend will run on `https://video-caption-gilt.vercel.app`

## 📁 Project Structure

```
video-caption-app/
├── backend/
│   ├── src/
│   │   ├── controllers/     # Request handlers
│   │   ├── middleware/      # Express middleware
│   │   ├── routes/          # API routes
│   │   ├── services/        # Business logic
│   │   └── utils/           # Utility functions
│   ├── uploads/             # Uploaded videos
│   ├── outputs/             # Rendered videos
│   └── server.ts            # Express server
├── website/
│   ├── app/                 # Next.js app directory
│   ├── components/          # React components
│   ├── lib/                  # Utilities and constants
│   ├── src/                 # Remotion compositions
│   └── types/               # TypeScript types
├── shared/                  # Shared types
└── scripts/                 # Utility scripts
```

## 🎬 Usage

1. **Upload Video**: Click "Upload Video" and select an MP4 file
2. **Generate Captions**: Click "Auto-generate Captions" button
3. **Select Style**: Choose from 3 caption styles
4. **Preview**: Watch the preview with captions
5. **Render**: Click "Render Video with Captions"
6. **Download**: Download the final captioned video

## 🎨 Caption Styles

### Bottom Centered
- Standard subtitle style
- Centered at the bottom
- Semi-transparent black background

### Top Bar
- News-style captions
- Full-width top bar
- High contrast for readability

### Karaoke Style
- Word-by-word highlighting
- Active word highlighted in gold
- Smooth transitions between words

## 🌐 Deployment

### Vercel (Frontend)

1. Push your code to GitHub
2. Import project in Vercel
3. Set environment variables:
   - `NEXT_PUBLIC_API_URL` - Your backend API URL
4. Deploy

### Render / Railway (Backend)

1. Create a new Web Service
2. Connect your GitHub repository
3. Set build command: `cd backend && npm install && npm run build`
4. Set start command: `cd backend && npm start`
5. Add environment variables:
   - `ASSEMBLYAI_API_KEY`
   - `FRONTEND_URL`
   - `PORT`
6. Deploy

### Important Notes for Deployment

- **File Storage**: For production, consider using cloud storage (S3, Cloudinary) instead of local filesystem
- **FFmpeg**: Ensure FFmpeg is installed on your deployment platform
- **Remotion**: Remotion rendering requires Node.js environment with sufficient resources
- **CORS**: Update CORS settings to allow your frontend domain

## 🔑 API Endpoints

### Video
- `POST /api/video/upload` - Upload a video file
- `GET /api/video/:videoId` - Get video metadata
- `POST /api/video/:videoId/extract-audio` - Extract audio from video

### Captions
- `POST /api/captions/transcribe` - Transcribe video audio
- `POST /api/captions/generate` - Generate captions with style
- `PUT /api/captions/update` - Update captions

### Render
- `POST /api/render/video` - Start video rendering
- `GET /api/render/status/:renderId` - Get render status
- `GET /api/render/download/:renderId` - Download rendered video

## 🧪 Testing

### Test Caption Generation

```bash
# Upload a test video and generate captions
curl -X POST https://video-caption-0i4u.onrender.com/api/video/upload \
  -F "video=@test-video.mp4"
```

## 📝 Caption Generation Method

This application uses **AssemblyAI API** for speech-to-text transcription:

- **Service**: AssemblyAI Transcription API
- **Language Detection**: Automatic
- **Format**: Verbose JSON with word-level timestamps
- **Support**: Multi-language including Hindi and English (Hinglish)

The transcription process:
1. Extract audio from video using FFmpeg
2. Convert to WAV format (16kHz, mono)
3. Upload audio to AssemblyAI and create transcript
4. Poll for completion and retrieve word-level timestamps
5. Process response to create caption segments
6. Group words into readable caption chunks

## 🎯 Hinglish Support

The application fully supports Hinglish (mixed Hindi and English):

- **Fonts**: Noto Sans + Noto Sans Devanagari
- **Encoding**: UTF-8
- **Rendering**: Proper text alignment and display
- **Testing**: Test with mixed language content

## 🐛 Troubleshooting

### FFmpeg not found
- Ensure FFmpeg is installed and in PATH
- Check installation: `ffmpeg -version`

### AssemblyAI API errors
- Verify API key is correct
- Check API quota and billing

### Rendering fails
- Ensure sufficient disk space
- Check video file format (MP4 required)
- Verify Remotion dependencies are installed

### CORS errors
- Update `FRONTEND_URL` in backend `.env`
- Check CORS configuration in `server.ts`

## 📄 License

MIT License

## 🙏 Acknowledgments

- [Remotion](https://www.remotion.dev/) - Video rendering framework
- [AssemblyAI](https://www.assemblyai.com/) - Speech recognition API
- [Noto Fonts](https://fonts.google.com/noto) - Multi-language font support

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Note**: This application uses AssemblyAI API for caption generation. Sign up for a free account at [AssemblyAI](https://www.assemblyai.com/) to get $50 in free credits (approximately 185 hours of audio transcription).

# video-caption
