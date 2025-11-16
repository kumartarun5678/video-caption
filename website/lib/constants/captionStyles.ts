import { CaptionStyle } from '@/types/captions';

export const CAPTION_STYLES: CaptionStyle[] = [
  {
    id: 'bottom-centered',
    name: 'Bottom Centered',
    description: 'Standard subtitles centered at the bottom',
    component: 'BottomCentered',
    config: {
      position: 'bottom',
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      textColor: '#ffffff',
      fontSize: 28,
      fontFamily: 'Noto Sans, Noto Sans Devanagari, sans-serif',
      padding: 16,
      borderRadius: 8,
      maxWidth: 800,
      textAlign: 'center',
    },
  },
  {
    id: 'top-bar',
    name: 'Top Bar',
    description: 'News-style captions in a top bar',
    component: 'TopBar',
    config: {
      position: 'top',
      backgroundColor: 'rgba(0, 0, 0, 0.9)',
      textColor: '#ffffff',
      fontSize: 24,
      fontFamily: 'Noto Sans, Noto Sans Devanagari, sans-serif',
      padding: 12,
      borderRadius: 0,
      maxWidth: 1000,
      textAlign: 'center',
    },
  },
  {
    id: 'karaoke',
    name: 'Karaoke Style',
    description: 'Word-by-word highlighting with timing',
    component: 'Karaoke',
    config: {
      position: 'bottom',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      textColor: '#ffffff',
      fontSize: 32,
      fontFamily: 'Noto Sans, Noto Sans Devanagari, sans-serif',
      padding: 20,
      borderRadius: 12,
      maxWidth: 900,
      textAlign: 'center',
    },
  },
];

export const DEFAULT_CAPTION_STYLE = CAPTION_STYLES[0];