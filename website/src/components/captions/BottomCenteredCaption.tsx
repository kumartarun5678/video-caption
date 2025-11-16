import React from 'react';
import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import type { Caption } from '@/types/captions';
import { CAPTION_STYLES } from '@/lib/constants/captionStyles';

interface BottomCenteredCaptionProps {
  caption: Caption;
}

export const BottomCenteredCaption: React.FC<BottomCenteredCaptionProps> = ({
  caption,
}) => {
  const frame = useCurrentFrame();
  const style = CAPTION_STYLES.find((s) => s.id === 'bottom-centered')?.config;

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
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 80,
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
          maxWidth: style.maxWidth,
          textAlign: style.textAlign as 'left' | 'center' | 'right',
          opacity,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        }}
        className="hinglish-text"
      >
        {caption.text}
      </div>
    </AbsoluteFill>
  );
};

