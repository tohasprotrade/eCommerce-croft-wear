'use client';

import { useState, useEffect } from 'react';
import styles from './APIImage.module.css';

interface APIImageProps {
  src: string;
  alt: string;
  className?: string;
  onError?: () => void;
}

/**
 * APIImage Component
 * Handles images from API with proper fallback and error handling
 * Used for dynamically uploaded images from the backend
 */
const APIImage: React.FC<APIImageProps> = ({
  src,
  alt,
  className = '',
  onError,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  useEffect(() => {
    setImageSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
    console.warn(`Failed to load image: ${src}`);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div className={`${styles.imagePlaceholder} ${className}`}>
        <svg className={styles.placeholderIcon} viewBox="0 0 24 24" fill="none">
          <path
            d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
            fill="currentColor"
          />
        </svg>
        <span className={styles.placeholderText}>Image unavailable</span>
      </div>
    );
  }

  return (
    <div className={`${styles.imageWrapper} ${className}`}>
      {isLoading && <div className={styles.skeleton} />}
      <img
        src={imageSrc}
        alt={alt}
        className={`${styles.image} ${isLoading ? styles.loading : ''}`}
        onError={handleError}
        onLoad={handleLoad}
        loading="lazy"
      />
    </div>
  );
};

export default APIImage;
