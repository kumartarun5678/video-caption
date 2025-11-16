import React, { useMemo } from 'react';
import { AbsoluteFill, interpolate } from 'remotion';
import type { Caption, Word } from '@/types/captions';
import { CAPTION_STYLES } from '@/lib/constants/captionStyles';

interface KaraokeCaptionProps {
  caption: Caption;
  currentTime: number;
}

export const KaraokeCaption: React.FC<KaraokeCaptionProps> = ({
  caption,
  currentTime,
}) => {
  const style = CAPTION_STYLES.find((s) => s.id === 'karaoke')?.config;

  if (!style) return null;

  const words = useMemo(() => {
    if (caption.words && caption.words.length > 0) {
      return caption.words;
    }
    // Fallback: split text into words with estimated timing
    const textWords = caption.text.split(' ');
    const duration = caption.end - caption.start;
    const wordDuration = duration / textWords.length;
    return textWords.map((word, index) => ({
      word,
      start: caption.start + index * wordDuration,
      end: caption.start + (index + 1) * wordDuration,
      confidence: 1,
    }));
  }, [caption]);

  const renderWord = (word: Word, index: number) => {
    const isActive = currentTime >= word.start && currentTime < word.end;
    const isPast = currentTime >= word.end;

    return (
      <span
        key={index}
        style={{
          color: isActive ? '#FFD700' : isPast ? style.textColor : '#888',
          fontWeight: isActive ? 'bold' : 'normal',
          transition: 'all 0.1s ease',
          marginRight: '0.3em',
        }}
        className="hinglish-text"
      >
        {word.word}
      </span>
    );
  };

  const captionOpacity = interpolate(
    currentTime,
    [caption.start, caption.start + 0.3, caption.end - 0.3, caption.end],
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
          opacity: captionOpacity,
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
        }}
        className="hinglish-text"
      >
        {words.map((word, index) => renderWord(word, index))}
      </div>
    </AbsoluteFill>
  );
};

