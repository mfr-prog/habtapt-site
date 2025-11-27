'use client';

/**
 * ErrorBoundary Component
 * Captura erros de renderização e fornece UI de fallback
 */

import React from 'react';
import { designSystem } from './design-system';
import { Button } from './ui/button';
import { AlertCircle } from './icons';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[ErrorBoundary] Error caught:', error);
    console.error('[ErrorBoundary] Error info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          style={{
            minHeight: '60vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: designSystem.spacing[8],
          }}
        >
          <div
            style={{
              maxWidth: '32rem',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: designSystem.spacing[6],
              }}
            >
              <div
                style={{
                  width: '4rem',
                  height: '4rem',
                  borderRadius: '50%',
                  background: designSystem.helpers.hexToRgba(
                    designSystem.colors.semantic.error,
                    0.1
                  ),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <AlertCircle
                  size={32}
                  style={{ color: designSystem.colors.semantic.error }}
                />
              </div>
            </div>

            <h1
              style={{
                fontSize: '1.875rem',
                fontWeight: designSystem.typography.fontWeight.bold,
                color: designSystem.colors.neutral[900],
                marginBottom: designSystem.spacing[4],
              }}
            >
              Algo deu errado
            </h1>

            <p
              style={{
                fontSize: designSystem.typography.fontSize.base,
                color: designSystem.colors.neutral[600],
                marginBottom: designSystem.spacing[6],
                lineHeight: '1.6',
              }}
            >
              Ocorreu um erro ao carregar esta página. Por favor, tente
              recarregar ou volte para a página inicial.
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details
                style={{
                  marginBottom: designSystem.spacing[6],
                  padding: designSystem.spacing[4],
                  background: designSystem.colors.neutral[50],
                  borderRadius: designSystem.borderRadius.lg,
                  textAlign: 'left',
                  fontSize: designSystem.typography.fontSize.sm,
                  color: designSystem.colors.neutral[700],
                  overflow: 'auto',
                  maxHeight: '200px',
                }}
              >
                <summary
                  style={{
                    cursor: 'pointer',
                    fontWeight: designSystem.typography.fontWeight.medium,
                    marginBottom: designSystem.spacing[2],
                  }}
                >
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre
                  style={{
                    fontSize: designSystem.typography.fontSize.xs,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {this.state.error.message}
                  {'\n\n'}
                  {this.state.error.stack}
                </pre>
              </details>
            )}

            <div
              style={{
                display: 'flex',
                gap: designSystem.spacing[3],
                justifyContent: 'center',
                flexWrap: 'wrap',
              }}
            >
              <Button
                onClick={() => window.location.reload()}
                style={{
                  background: designSystem.colors.gradients.primary,
                }}
              >
                Recarregar Página
              </Button>
              <Button
                onClick={() => (window.location.hash = 'home')}
                variant="outline"
              >
                Voltar para Home
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
