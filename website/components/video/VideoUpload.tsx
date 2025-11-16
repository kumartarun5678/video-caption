
import React, { useState } from 'react';
import { FileUpload } from '../ui/FileUpload';
import { Button } from '../ui/Button';
import { ProgressBar } from '../ui/ProgressBar';
import { Upload, Video } from 'lucide-react';

interface VideoUploadProps {
  onVideoUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  uploadProgress: number;
}

export const VideoUpload: React.FC<VideoUploadProps> = ({
  onVideoUpload,
  isUploading,
  uploadProgress,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (selectedFile) {
      await onVideoUpload(selectedFile);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <Video className="h-6 w-6 text-blue-600" />
        <h2 className="text-xl font-semibold text-gray-900">Upload Video</h2>
      </div>

      <FileUpload
        onFileSelect={handleFileSelect}
        className="mb-6"
      />

      {selectedFile && !isUploading && (
        <div className="flex justify-end">
          <Button
            onClick={handleUpload}
            icon={Upload}
            variant="primary"
            size="lg"
          >
            Upload Video
          </Button>
        </div>
      )}

      {isUploading && (
        <div className="space-y-4">
          <ProgressBar
            progress={uploadProgress}
            label="Uploading video..."
            showPercentage
          />
          <p className="text-sm text-gray-600 text-center">
            Please wait while your video is being uploaded...
          </p>
        </div>
      )}
    </div>
  );
};