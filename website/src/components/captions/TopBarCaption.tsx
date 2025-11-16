import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import type { Caption } from '@/types/captions';
import { CAPTION_STYLES } from '@/lib/constants/captionStyles';

interface TopBarCaptionProps {
  caption: Caption;
}

export const TopBarCaption: React.FC<TopBarCaptionProps> = ({
  caption,
}) => {
  const frame = useCurrentFrame();
  const style = CAPTION_STYLES.find((s) => s.id === 'top-bar')?.config;

  if (!style) return null;
  const opacity = interpolate(
    frame,
    [0, 10, (caption.end - caption.start) * 30 - 10, (caption.end - caption.start) * 30],
    [0, 1, 1, 0],
    {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    }
  );

  return (
    <AbsoluteFill
      style={{
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 20,
      }}
    >
      <div
        style={{
          backgroundColor: style.backgroundColor,
          color: style.textColor,
          fontSize: style.fontSize,
          fontFamily: style.fontFamily,
          padding: style.padding,
          borderRadius: style.borderRadius,
          width: '100%',
          maxWidth: style.maxWidth,
          textAlign: style.textAlign as 'left' | 'center' | 'right',
          opacity,
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
        }}
        className="hinglish-text"
      >
        {caption.text}
      </div>
    </AbsoluteFill>
  );
};

