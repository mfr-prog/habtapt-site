'use client';

import { useEffect, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X, ChevronLeft, ChevronRight } from '@/components/icons';

interface VelaskLightboxProps {
  images: { src: string; alt: string }[];
  selectedIndex: number;
  open: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

export function VelaskLightbox({ images, selectedIndex, open, onClose, onNext, onPrev }: VelaskLightboxProps) {
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'ArrowRight') onNext();
    else if (e.key === 'ArrowLeft') onPrev();
    else if (e.key === 'Escape') onClose();
  }, [onNext, onPrev, onClose]);

  useEffect(() => {
    if (open) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [open, handleKeyDown]);

  if (!images.length) return null;

  const current = images[selectedIndex];

  return (
    <Dialog.Root open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.92)',
            zIndex: 9998,
            animation: 'fadeIn 200ms ease',
          }}
        />
        <Dialog.Content
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 'none',
          }}
          aria-describedby={undefined}
        >
          <Dialog.Title className="sr-only">Galeria de imagens</Dialog.Title>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Fechar"
            style={{
              position: 'absolute',
              top: 16,
              right: 16,
              width: 44,
              height: 44,
              borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10,
            }}
          >
            <X style={{ width: 24, height: 24 }} />
          </button>

          {/* Prev button */}
          {images.length > 1 && (
            <button
              onClick={onPrev}
              aria-label="Imagem anterior"
              style={{
                position: 'absolute',
                left: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <ChevronLeft style={{ width: 28, height: 28 }} />
            </button>
          )}

          {/* Image */}
          <img
            src={current?.src}
            alt={current?.alt}
            style={{
              maxWidth: '90vw',
              maxHeight: '85vh',
              objectFit: 'contain',
              borderRadius: 8,
              userSelect: 'none',
            }}
            draggable={false}
          />

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={onNext}
              aria-label="Proxima imagem"
              style={{
                position: 'absolute',
                right: 16,
                top: '50%',
                transform: 'translateY(-50%)',
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 10,
              }}
            >
              <ChevronRight style={{ width: 28, height: 28 }} />
            </button>
          )}

          {/* Counter */}
          <div
            style={{
              position: 'absolute',
              bottom: 20,
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: 14,
              color: 'rgba(255,255,255,0.6)',
              background: 'rgba(0,0,0,0.5)',
              padding: '4px 16px',
              borderRadius: 999,
            }}
          >
            {selectedIndex + 1} / {images.length}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
