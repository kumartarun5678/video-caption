import React, { useMemo } from 'react';
import {
  AbsoluteFill,
  useVideoConfig,
  useCurrentFrame,
  OffthreadVideo,
} from 'remotion';
import { BottomCenteredCaption } from '../components/captions/BottomCenteredCaption';
import { TopBarCaption } from '../components/captions/TopBarCaption';
import { KaraokeCaption } from '../components/captions/KaraokeCaption';
import type { Caption } from '@/types/captions';

interface VideoWithCaptionsProps {
  videoUrl: string;
  captions: Caption[];
  style: 'bottom-centered' | 'top-bar' | 'karaoke';
}

export const VideoWithCaptions: React.FC<VideoWithCaptionsProps> = ({
  videoUrl,
  captions,
  style,
}) => {
  const { fps } = useVideoConfig();
  const frame = useCurrentFrame();
  const currentTime = frame / fps;
  const normalizedVideoUrl = useMemo(() => {
    if (videoUrl.startsWith('file://')) {
      const cleaned = videoUrl.replace('file://', '');
      console.warn('WARNING: Received file:// URL, removing protocol');
      return cleaned;
    } else if (videoUrl.startsWith('http://') || videoUrl.startsWith('https://')) {
      return videoUrl;
    } else {
      console.error('ERROR: Received non-HTTP URL');
      return videoUrl;
    }
  }, [videoUrl]);
  const currentCaption = useMemo(() => {
    if (!captions || captions.length === 0) return null;
    
    const buffer = 0.1;
    let found = captions.find(
      (caption) => currentTime >= (caption.start - buffer) && currentTime <= (caption.end + buffer)
    );
  
    if (!found && captions.length > 0) {
      found = captions.reduce((closest, caption) => {
        if (!closest) return caption;
        const closestDist = Math.abs(currentTime - (closest.start + closest.end) / 2);
        const captionDist = Math.abs(currentTime - (caption.start + caption.end) / 2);
        return captionDist < closestDist ? caption : closest;
      });
    }
    
    return found || undefined;
  }, [captions, currentTime]);

  const renderCaption = () => {
    if (!currentCaption) return null;

    switch (style) {
      case 'top-bar':
        return <TopBarCaption caption={currentCaption} />;
      case 'karaoke':
        return (
          <KaraokeCaption
            caption={currentCaption}
            currentTime={currentTime}
          />
        );
      case 'bottom-centered':
      default:
        return <BottomCenteredCaption caption={currentCaption} />;
    }
  };

  return (
    <AbsoluteFill>
      <OffthreadVideo 
        src={normalizedVideoUrl}
      />
      {renderCaption()}
    </AbsoluteFill>
  );
};

