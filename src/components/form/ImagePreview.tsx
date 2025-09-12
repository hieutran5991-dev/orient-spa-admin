'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImagePreviewProps {
  imageUrl: string;
  fileName?: string;
  fileSize?: number;
  isNewImage?: boolean;
  onRemove?: () => void;
  className?: string;
}

export default function ImagePreview({
  imageUrl,
  fileName,
  fileSize,
  isNewImage = false,
  onRemove,
  className = ''
}: ImagePreviewProps) {
  const [isZoomed, setIsZoomed] = useState(true);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.2, 0.5));
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleReset = () => {
    setScale(1);
    setRotation(0);
    setIsZoomed(false);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName || 'image';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isNewImage ? 'New Image Preview' : 'Current Image'}
          </span>
          {fileName && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              ({fileName})
            </span>
          )}
          {fileSize && (
            <span className="text-xs text-gray-500 dark:text-gray-400">
              - {formatFileSize(fileSize)}
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-1">
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            title="Zoom Out"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            title="Zoom In"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.35-4.35"/>
              <line x1="11" y1="8" x2="11" y2="14"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={handleRotate}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            title="Rotate"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/>
              <path d="M21 3v5h-5"/>
              <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/>
              <path d="M3 21v-5h5"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            title="Reset"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6 6 18"/>
              <path d="M6 6l12 12"/>
            </svg>
          </button>
          <button
            type="button"
            onClick={handleDownload}
            className="p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-700 rounded"
            title="Download"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
          {onRemove && (
            <button
              type="button"
              onClick={onRemove}
              className="p-1.5 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
              title="Remove Image"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3,6 5,6 21,6"/>
                <path d="m19,6v14a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6m3,0V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2v2"/>
                <line x1="10" y1="11" x2="10" y2="17"/>
                <line x1="14" y1="11" x2="14" y2="17"/>
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Image container */}
      <div 
        className={`relative border border-gray-300 dark:border-gray-700 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 ${
          isZoomed ? 'cursor-move' : 'cursor-pointer'
        }`}
        onClick={() => setIsZoomed(!isZoomed)}
        style={{ 
          width: isZoomed ? '100%' : '200px', 
          height: isZoomed ? '400px' : '200px',
          transition: 'all 0.3s ease'
        }}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            transform: `scale(${scale}) rotate(${rotation}deg)`,
            transition: 'transform 0.3s ease'
          }}
        >
          <Image
            src={imageUrl}
            alt={isNewImage ? 'New product preview' : 'Current product image'}
            width={isZoomed ? 600 : 200}
            height={isZoomed ? 600 : 200}
            className="w-full h-full object-contain"
            unoptimized
          />
        </div>
        
        {/* Zoom indicator */}
        {isZoomed && (
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            {Math.round(scale * 100)}%
          </div>
        )}
      </div>

      {/* Image info */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex justify-between">
          <span>Click to {isZoomed ? 'minimize' : 'zoom'}</span>
          <span>Scale: {Math.round(scale * 100)}% | Rotation: {rotation}°</span>
        </div>
      </div>
    </div>
  );
}
