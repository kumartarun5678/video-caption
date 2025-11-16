'use client';

import React, { useState, useCallback } from 'react';
import { VideoUpload } from '@/components/video/VideoUpload';
import { CaptionStyles } from '@/components/video/CaptionStyles';
import { VideoPreview } from '@/components/video/VideoPreview';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { Sparkles, Download, Play } from 'lucide-react';
import axios from 'axios';
import type { Caption } from '@/types/captions';
import type { AxiosProgressEvent } from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export default function Home() {
  const [videoId, setVideoId] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string>('bottom-centered');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('auto');
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isRendering, setIsRendering] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [renderProgress, setRenderProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [renderId, setRenderId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleVideoUpload = useCallback(async (file: File) => {
    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('video', file);

      const response = await axios.post(`${API_URL}/video/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent: AxiosProgressEvent) => {
          if (progressEvent.total) {
            const progress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(progress);
          }
        },
      });

      if (response.data.success) {
        const { video } = response.data.data;
        setVideoId(video.id);
        setVideoUrl(`${API_URL.replace('/api', '')}${video.url}`);
      } else {
        throw new Error(response.data.error || 'Upload failed');
      }
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      setError(error.response?.data?.error || error.message || 'Upload failed');
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  }, []);

  const handleGenerateCaptions = useCallback(async () => {
    if (!videoId) {
      setError('Please upload a video first');
      return;
    }

    setIsTranscribing(true);
    setError(null);

    try {
      await axios.post(`${API_URL}/video/${videoId}/extract-audio`);
      const response = await axios.post(`${API_URL}/captions/transcribe`, {
        videoId,
        language: selectedLanguage,
      });

      if (response.data.success) {
        setCaptions(response.data.data.captions);
        if (response.data.data.language && selectedLanguage === 'auto') {
          setDetectedLanguage(response.data.data.language);
        }
      } else {
        throw new Error(response.data.error || 'Transcription failed');
      }
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      setError(error.response?.data?.error || error.message || 'Transcription failed');
      console.error('Transcription error:', err);
    } finally {
      setIsTranscribing(false);
    }
  }, [videoId, selectedLanguage]);

  const handleRender = useCallback(async () => {
    if (!videoId || captions.length === 0) {
      setError('Please generate captions first');
      return;
    }

    setIsRendering(true);
    setError(null);
    setRenderProgress(0);

    try {
      const response = await axios.post(`${API_URL}/render/video`, {
        videoId,
        captions,
        style: selectedStyle,
        outputFormat: 'mp4',
      });

      if (response.data.success) {
        const { id } = response.data.data;
        setRenderId(id);
        const pollInterval = setInterval(async () => {
          try {
            const statusResponse = await axios.get(
              `${API_URL}/render/status/${id}`
            );
            const { status, progress } = statusResponse.data.data;

            setRenderProgress(progress || 0);

            if (status === 'completed') {
              clearInterval(pollInterval);
              setIsRendering(false);
            } else if (status === 'failed') {
              clearInterval(pollInterval);
              setIsRendering(false);
              setError('Rendering failed');
            }
          } catch (err) {
            clearInterval(pollInterval);
            setIsRendering(false);
            setError('Failed to check render status');
          }
        }, 2000);
      } else {
        throw new Error(response.data.error || 'Render failed');
      }
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      setError(error.response?.data?.error || error.message || 'Render failed');
      console.error('Render error:', err);
      setIsRendering(false);
    }
  }, [videoId, captions, selectedStyle]);

  const handleDownload = useCallback(async () => {
    if (!renderId) {
      setError('No rendered video available');
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/render/download/${renderId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `captioned-video-${renderId}.mp4`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      setError(error.response?.data?.error || error.message || 'Download failed');
      console.error('Download error:', err);
    }
  }, [renderId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Video Caption Generator
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Upload your video, generate captions, and render with beautiful styles
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="space-y-6">
            <VideoUpload
              onVideoUpload={handleVideoUpload}
              isUploading={isUploading}
              uploadProgress={uploadProgress}
            />

            {videoId && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Generate Captions
                </h2>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    disabled={isTranscribing}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="auto">Auto-detect</option>
                    <option value="en">English</option>
                    <option value="hi">Hindi (हिंदी)</option>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Select language for transcription. Auto-detect will identify the language automatically.
                  </p>
                  {detectedLanguage && selectedLanguage === 'auto' && (
                    <p className="mt-1 text-xs text-green-600 font-medium">
                      ✓ Detected language: {detectedLanguage === 'hi' ? 'Hindi (हिंदी)' : detectedLanguage === 'en' ? 'English' : detectedLanguage}
                    </p>
                  )}
                </div>
                <Button
                  onClick={handleGenerateCaptions}
                  disabled={isTranscribing || !videoId}
                  loading={isTranscribing}
                  icon={Sparkles}
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  {isTranscribing ? 'Generating Captions...' : 'Auto-generate Captions'}
                </Button>
                {captions.length > 0 && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-green-800">
                      ✓ Generated {captions.length} captions
                    </p>
                  </div>
                )}
              </div>
            )}

            {captions.length > 0 && (
              <CaptionStyles
                selectedStyle={selectedStyle}
                onStyleChange={setSelectedStyle}
                onPreview={(styleId) => setSelectedStyle(styleId)}
              />
            )}
          </div>
          <div className="space-y-6">
            {videoUrl && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Video Preview
                </h2>
                <VideoPreview
                  videoUrl={videoUrl}
                  captions={captions}
                  currentTime={currentTime}
                  onTimeUpdate={setCurrentTime}
                  isPlaying={isPlaying}
                  onPlayPause={setIsPlaying}
                  // captionStyle={selectedStyle}
                />
              </div>
            )}

            {captions.length > 0 && (
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Render & Export
                </h2>
                <div className="space-y-4">
                  <Button
                    onClick={handleRender}
                    disabled={isRendering || !videoId || captions.length === 0}
                    loading={isRendering}
                    icon={Play}
                    variant="primary"
                    size="lg"
                    className="w-full"
                  >
                    {isRendering ? 'Rendering...' : 'Render Video with Captions'}
                  </Button>

                  {isRendering && (
                    <ProgressBar
                      progress={renderProgress}
                      label="Rendering video..."
                      showPercentage
                    />
                  )}

                  {renderId && !isRendering && (
                    <Button
                      onClick={handleDownload}
                      icon={Download}
                      variant="secondary"
                      size="lg"
                      className="w-full"
                    >
                      Download Rendered Video
                    </Button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
