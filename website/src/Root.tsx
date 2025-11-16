import React from 'react';
import { Composition } from 'remotion';
import { VideoWithCaptions } from './compositions/VideoWithCaptions';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VideoWithCaptions"
        component={VideoWithCaptions as unknown as React.ComponentType<Record<string, unknown>>}
        durationInFrames={3000}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{
          videoUrl: '',
          captions: [],
          style: 'bottom-centered',
        }}
      />
    </>
  );
};

