import React from 'react';
import { CaptionStyle } from '@/types/captions';
import { CAPTION_STYLES } from '@/lib/constants/captionStyles';
import { Check, Eye } from 'lucide-react';
import { Button } from '../ui/Button';

interface CaptionStylesProps {
  selectedStyle: string;
  onStyleChange: (styleId: string) => void;
  onPreview: (styleId: string) => void;
}

export const CaptionStyles: React.FC<CaptionStylesProps> = ({
  selectedStyle,
  onStyleChange,
  onPreview,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">
        Caption Styles
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {CAPTION_STYLES.map((style) => (
          <div
            key={style.id}
            className={`border-2 rounded-lg p-4 cursor-pointer transition-all duration-200 ${
              selectedStyle === style.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
            onClick={() => onStyleChange(style.id)}
          >
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-medium text-gray-900">{style.name}</h3>
              {selectedStyle === style.id && (
                <Check className="h-5 w-5 text-blue-600" />
              )}
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              {style.description}
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex-1">
                {/* <div
                  className="h-2 rounded-full mb-1"
                  style={{ backgroundColor: style.config.backgroundColor }}
                /> */}
                {/* <div
                  className="h-8 rounded flex items-center justify-center text-sm font-medium"
                  style={{
                    backgroundColor: style.config.backgroundColor,
                    color: style.config.textColor,
                    fontSize: `${style.config.fontSize * 0.6}px`,
                    borderRadius: `${style.config.borderRadius}px`,
                    padding: `${style.config.padding * 0.5}px`,
                  }}
                >
                  <span className="hinglish-text">Sample Caption / नमूना</span>
                </div> */}
              </div>
              
              {/* <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onPreview(style.id);
                }}
                icon={Eye}
              >
                Preview
              </Button> */}
            </div>
          </div>
        ))}
      </div>

      {/* Style Configuration */}
      {selectedStyle && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-gray-900 mb-3">Style Configuration</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Position:</span>
              <span className="ml-2 font-medium">
                {CAPTION_STYLES.find(s => s.id === selectedStyle)?.config.position}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Font Size:</span>
              <span className="ml-2 font-medium">
                {CAPTION_STYLES.find(s => s.id === selectedStyle)?.config.fontSize}px
              </span>
            </div>
            <div>
              <span className="text-gray-600">Text Color:</span>
              <span className="ml-2 font-medium">
                {CAPTION_STYLES.find(s => s.id === selectedStyle)?.config.textColor}
              </span>
            </div>
            <div>
              <span className="text-gray-600">Alignment:</span>
              <span className="ml-2 font-medium">
                {CAPTION_STYLES.find(s => s.id === selectedStyle)?.config.textAlign}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};