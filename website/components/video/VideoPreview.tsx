import React, { useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { Button } from '../ui/Button';
import { CAPTION_STYLES } from '@/lib/constants/captionStyles';

interface VideoPreviewProps {
  videoUrl: string;
  captions?: Array<{ start: number; end: number; text: string; words?: Array<{ word: string; start: number; end: number; confidence: number }> }>;
  currentTime: number;
  onTimeUpdate: (time: number) => void;
  isPlaying: boolean;
  onPlayPause: (playing: boolean) => void;
  captionStyle?: 'bottom-centered' | 'top-bar' | 'karaoke';
  className?: string;
}

export const VideoPreview: React.FC<VideoPreviewProps> = ({
  videoUrl,
  captions = [],
  currentTime,
  onTimeUpdate,
  isPlaying,
  onPlayPause,
  captionStyle = 'bottom-centered',
  className = '',
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const timelineRef = React.useRef<HTMLDivElement>(null);
  const activeCaptionRef = React.useRef<HTMLDivElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      onPlayPause(!isPlaying);
    }
  };

  const handleReset = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      onTimeUpdate(0);
      onPlayPause(false);
    }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      onTimeUpdate(videoRef.current.currentTime);
    }
  };

  const currentCaption = React.useMemo(() => {
    if (!captions || captions.length === 0) return undefined;
    
    let found = captions.find(
      caption => currentTime >= caption.start && currentTime <= caption.end
    );
    
    if (!found && captions.length > 0) {
      found = captions.reduce((closest, caption) => {
        if (!closest) return caption;
        const closestDist = Math.abs(currentTime - (closest.start + closest.end) / 2);
        const captionDist = Math.abs(currentTime - (caption.start + caption.end) / 2);
        return captionDist < closestDist ? caption : closest;
      });
    }
    
    return found;
  }, [captions, currentTime]);

  const styleConfig = React.useMemo(() => {
    const config = CAPTION_STYLES.find(s => s.id === captionStyle)?.config;
    if (!config) {
      console.warn(`Caption style "${captionStyle}" not found, using default`);
      return CAPTION_STYLES[0]?.config;
    }
    return config;
  }, [captionStyle]);

  const prevActiveIndex = React.useRef<number | null>(null);

  const activeCaptionIndex = React.useMemo(() => {
    if (!currentCaption) return null;
    return captions.findIndex(
      c => c.start === currentCaption.start && c.end === currentCaption.end
    );
  }, [currentCaption, captions]);

  useEffect(() => {
    if (activeCaptionIndex !== null && timelineRef.current) {
      const shouldScroll = activeCaptionIndex !== prevActiveIndex.current;
      if (shouldScroll) {
        prevActiveIndex.current = activeCaptionIndex;
      }
      const timeoutId = setTimeout(() => {
        const timeline = timelineRef.current;
        if (!timeline) return;
        const captionElements = timeline.querySelectorAll('[data-caption-index]');
        const activeElement = captionElements[activeCaptionIndex] as HTMLElement;
        
        if (activeElement) {
          const timelineRect = timeline.getBoundingClientRect();
          const elementRect = activeElement.getBoundingClientRect();
          
          const isFullyVisible = elementRect.top >= timelineRect.top && 
                                 elementRect.bottom <= timelineRect.bottom;
          
          if (!isFullyVisible || shouldScroll) {
            const relativeTop = elementRect.top - timelineRect.top + timeline.scrollTop;
            timeline.scrollTo({
              top: Math.max(0, relativeTop),
              behavior: shouldScroll ? 'smooth' : 'auto'
            });
          }
        }
      }, shouldScroll ? 150 : 50);
      
      return () => clearTimeout(timeoutId);
    }
  }, [activeCaptionIndex, currentTime]);

  const renderCaption = () => {
    if (!currentCaption || !styleConfig) {
      if (!currentCaption) console.debug('No current caption found');
      if (!styleConfig) console.warn('No style config found');
      return null;
    }

    if (captionStyle === 'karaoke' && currentCaption.words && currentCaption.words.length > 0) {
      return (
        <div
          className="absolute left-0 right-0 flex justify-center z-20"
          style={{
            [styleConfig.position === 'top' ? 'top' : 'bottom']: styleConfig.position === 'top' ? '20px' : '100px',
            pointerEvents: 'none',
          }}
        >
          <div
            className="hinglish-text"
            style={{
              backgroundColor: styleConfig.backgroundColor,
              color: styleConfig.textColor,
              fontSize: `${styleConfig.fontSize}px`,
              fontFamily: styleConfig.fontFamily,
              padding: `${styleConfig.padding}px`,
              borderRadius: `${styleConfig.borderRadius}px`,
              maxWidth: `${styleConfig.maxWidth}px`,
              textAlign: styleConfig.textAlign,
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            }}
          >
            {currentCaption.words.map((word, index) => {
              const isActive = currentTime >= word.start && currentTime < word.end;
              const isPast = currentTime >= word.end;
              return (
                <span
                  key={index}
                  style={{
                    color: isActive ? '#FFD700' : isPast ? styleConfig.textColor : '#888',
                    fontWeight: isActive ? 'bold' : 'normal',
                    transition: 'all 0.1s ease',
                    marginRight: '0.3em',
                  }}
                >
                  {word.word}
                </span>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div
        className="absolute left-0 right-0 flex justify-center z-20"
        style={{
          [styleConfig.position === 'top' ? 'top' : 'bottom']: styleConfig.position === 'top' ? '20px' : '100px',
          pointerEvents: 'none',
        }}
      >
        <div
          className="hinglish-text"
          style={{
            backgroundColor: styleConfig.backgroundColor,
            color: styleConfig.textColor,
            fontSize: `${styleConfig.fontSize}px`,
            fontFamily: styleConfig.fontFamily,
            padding: `${styleConfig.padding}px`,
            borderRadius: `${styleConfig.borderRadius}px`,
            maxWidth: `${styleConfig.maxWidth}px`,
            width: styleConfig.position === 'top' ? '100%' : 'auto',
            textAlign: styleConfig.textAlign,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
            margin: '0 auto',
            wordWrap: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {currentCaption.text}
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-black rounded-lg overflow-hidden ${className}`}>
      <div className="relative">
        <video
          ref={videoRef}
          src={videoUrl}
          className="w-full h-auto max-h-96"
          onTimeUpdate={handleTimeUpdate}
          onClick={handlePlayPause}
        />
        
        {renderCaption()}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center space-x-4 z-30">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleReset}
            icon={RotateCcw}
          >
            Reset
          </Button>
          <Button
            variant="primary"
            size="lg"
            onClick={handlePlayPause}
            icon={isPlaying ? Pause : Play}
          >
            {isPlaying ? 'Pause' : 'Play'}
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 bg-gray-600 h-1 z-30">
          <div
            className="bg-blue-500 h-1 transition-all duration-100"
            style={{
              width: videoRef.current
                ? `${(currentTime / videoRef.current.duration) * 100}%`
                : '0%',
            }}
          />
        </div>
      </div>

      {captions.length > 0 && (
        <div className="p-4 bg-gray-900">
          <h3 className="text-white font-medium mb-2">Captions Timeline</h3>
          <div 
            ref={timelineRef}
            className="space-y-2 max-h-32 overflow-y-auto scroll-smooth"
          >
            {captions.map((caption, index) => {
              const isActive = currentTime >= caption.start && currentTime <= caption.end;
              return (
                <div
                  key={index}
                  data-caption-index={index}
                  ref={isActive ? activeCaptionRef : null}
                  className={`p-2 rounded text-sm cursor-pointer transition-colors ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-lg ring-2 ring-blue-400'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = caption.start;
                      onTimeUpdate(caption.start);
                    }
                  }}
                >
                  <div className="flex justify-between items-start">
                    <span className="flex-1 hinglish-text">{caption.text}</span>
                    <span className="text-xs ml-2 whitespace-nowrap">
                      {formatTime(caption.start)} - {formatTime(caption.end)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};