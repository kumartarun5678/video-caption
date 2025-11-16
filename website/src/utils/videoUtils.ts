export const getVideoMetadata = async (videoUrl: string) => {
  return new Promise<{ duration: number; width: number; height: number }>(
    (resolve, reject) => {
      const video = document.createElement('video');
      video.src = videoUrl;
      video.onloadedmetadata = () => {
        resolve({
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight,
        });
      };
      video.onerror = (error) => {
        reject(error);
      };
    }
  );
};

