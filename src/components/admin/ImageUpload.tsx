/**
 * ImageUpload - Componente de Upload de Imagens
 * 100% Conformidade Guardião Universal
 */

'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from '../icons';
import { colors, spacing, radius, shadows, typography } from '../../utils/styles';
import { AnimatedButton } from '../primitives/AnimatedButton';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { supabaseFetch } from '../../utils/supabase/client';
import { toast } from 'sonner';

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  bucket: 'projects' | 'insights' | 'testimonials';
  disabled?: boolean;
  label?: string;
}

export function ImageUpload({ value, onChange, bucket, disabled, label = 'Imagem' }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(value || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.target.files?.[0];
    if (!file) return;

    console.log('[ImageUpload] File selected:', file.name, file.type, file.size);

    // Validação de tipo
    if (!file.type.startsWith('image/')) {
      toast.error('Por favor, selecione apenas arquivos de imagem');
      return;
    }

    // Validação de tamanho (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('A imagem deve ter no máximo 5MB');
      return;
    }

    // Preview local
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      console.log('[ImageUpload] Preview set');
    };
    reader.readAsDataURL(file);

    // Upload para o Supabase Storage
    setIsUploading(true);
    console.log('[ImageUpload] Starting upload to bucket:', bucket);
    try {
      const { projectId, publicAnonKey } = await import('../../utils/supabase/info');
      
      // Gerar nome único para o arquivo
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(7);
      const fileExt = file.name.split('.').pop();
      const fileName = `${timestamp}-${randomStr}.${fileExt}`;
      const filePath = `${fileName}`;

      console.log('[ImageUpload] Uploading to path:', filePath);

      // Upload direto para o Storage usando a API REST
      const uploadUrl = `https://${projectId}.supabase.co/storage/v1/object/${bucket}/${filePath}`;
      
      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: file,
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': file.type,
        },
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json().catch(() => ({}));
        console.error('[ImageUpload] Upload error:', errorData);
        throw new Error(errorData.message || errorData.error || 'Erro no upload');
      }

      const uploadData = await uploadResponse.json();
      console.log('[ImageUpload] Upload response:', uploadData);
      
      // Construir URL pública da imagem
      const publicUrl = `https://${projectId}.supabase.co/storage/v1/object/public/${bucket}/${filePath}`;
      
      console.log('[ImageUpload] Public URL:', publicUrl);
      onChange(publicUrl);
      toast.success('Imagem enviada com sucesso!');
    } catch (error) {
      console.error('[ImageUpload] Erro:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer upload da imagem');
      setPreview(value || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    setPreview(null);
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleClick = (e?: React.MouseEvent) => {
    e?.preventDefault();
    e?.stopPropagation();
    fileInputRef.current?.click();
  };

  return (
    <div>
      <label
        style={{
          display: 'block',
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.semibold,
          color: colors.gray[700],
          marginBottom: spacing[2],
        }}
      >
        {label}
      </label>

      <div
        style={{
          position: 'relative',
          width: '100%',
          height: preview ? 'auto' : '200px',
          minHeight: preview ? '200px' : '200px',
          border: `2px dashed ${colors.gray[300]}`,
          borderRadius: radius.lg,
          overflow: 'hidden',
          background: preview ? colors.black : colors.gray[50],
        }}
      >
        {preview ? (
          <>
            {/* Preview da Imagem */}
            <ImageWithFallback
              src={preview}
              alt="Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                minHeight: '200px',
              }}
            />

            {/* Botão de Remover */}
            {!disabled && (
              <button
                onClick={(e) => handleRemove(e)}
                disabled={isUploading}
                style={{
                  position: 'absolute',
                  top: spacing[2],
                  right: spacing[2],
                  background: colors.white,
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: shadows.md,
                  transition: 'all 0.2s',
                }}
                aria-label="Remover imagem"
              >
                <X size={18} style={{ color: colors.error }} />
              </button>
            )}
          </>
        ) : (
          /* Área de Upload */
          <div
            onClick={disabled ? undefined : (e) => handleClick(e)}
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: spacing[3],
              cursor: disabled ? 'not-allowed' : 'pointer',
              opacity: disabled ? 0.5 : 1,
            }}
          >
            <ImageIcon size={48} style={{ color: colors.gray[400] }} />
            <div style={{ textAlign: 'center' }}>
              <p
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.gray[600],
                  marginBottom: spacing[1],
                }}
              >
                Clique para fazer upload
              </p>
              <p
                style={{
                  fontSize: typography.fontSize.xs,
                  color: colors.gray[500],
                }}
              >
                PNG, JPG ou WEBP (max. 5MB)
              </p>
            </div>
            {isUploading && (
              <p
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.secondary,
                  fontWeight: typography.fontWeight.semibold,
                }}
              >
                Enviando...
              </p>
            )}
          </div>
        )}

        {/* Input oculto */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          onClick={(e) => e.stopPropagation()}
          disabled={disabled || isUploading}
          style={{ display: 'none' }}
          aria-label="Selecionar arquivo de imagem"
        />
      </div>

      {/* Botão adicional de upload (quando há preview) */}
      {preview && !disabled && (
        <div style={{ marginTop: spacing[3] }}>
          <AnimatedButton
            onClick={(e) => handleClick(e)}
            disabled={isUploading}
            variant="secondary"
            icon={Upload}
            size="sm"
          >
            {isUploading ? 'Enviando...' : 'Trocar Imagem'}
          </AnimatedButton>
        </div>
      )}
    </div>
  );
}
