import { useState, type CSSProperties } from 'react';

interface Props {
  src: string;
  alt: string;
  aspect?: string;
  surface?: string;
  fit?: 'cover' | 'contain';
  eager?: boolean;
  className?: string;
  sizes?: string;
  style?: CSSProperties;
}

/** Image with a consistent aspect-ratio frame, lazy loading and a graceful fallback. */
export function SmartImage({ src, alt, aspect, surface, fit = 'cover', eager, className = '', style }: Props) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`frame ${className}`} style={{ aspectRatio: aspect, background: surface, ...style }}>
      {failed ? (
        <div className="img-fallback" role="img" aria-label={alt}>{alt}</div>
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={eager ? 'high' : undefined}
          onError={() => setFailed(true)}
          style={{ objectFit: fit, padding: fit === 'contain' ? '8%' : undefined }}
        />
      )}
    </div>
  );
}
