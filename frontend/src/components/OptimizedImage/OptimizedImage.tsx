'use client';

import Image from 'next/image';
import { useState } from 'react';
import styles from './OptimizedImage.module.css';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  objectFit?: 'cover' | 'contain' | 'fill' | 'scale-down';
  priority?: boolean;
  onError?: () => void;
}

/**
 * OptimizedImage Component
 * Handles image loading with fallback, error states, and proper optimization
 */
const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width = 400,
  height = 400,
  className = '',
  objectFit = 'cover',
  priority = false,
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  // Placeholder for loading/error states
  if (hasError) {
    return (
      <div className={`${styles.imagePlaceholder} ${className}`}>
        <div className={styles.placeholderContent}>
          <span>Image not available</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.imageContainer} ${className}`}>
      {isLoading && <div className={styles.skeleton} />}
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        className={`${styles.image} ${isLoading ? styles.loading : ''}`}
        onError={handleError}
        onLoadingComplete={handleLoadingComplete}
        priority={priority}
        quality={85}
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        style={{
          objectFit: objectFit,
          objectPosition: 'center',
        }}
      />
    </div>
  );
};

export default OptimizedImage;
