// Admin: Clean layout focused on data - 100% Conformidade Guardião
import React, { ReactNode } from 'react';
import { Home, LogOut } from 'lucide-react';
import { colors, shadows, spacing, radius, typography } from '../../utils/styles';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success('Sessão encerrada');
    router.push('/login');
    router.refresh();
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.gray[50] }}>
      {/* Clean Minimal Header */}
      <header
        role="banner"
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          background: colors.white,
          borderBottom: `1px solid ${colors.gray[200]}`,
          boxShadow: shadows.sm,
        }}
      >
        <div
          style={{
            maxWidth: '1600px',
            margin: '0 auto',
            padding: `${spacing[3]} ${spacing[6]}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: spacing[4],
          }}
        >
          {/* Simple Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
            <h1
              style={{
                fontSize: typography.fontSize.lg,
                fontWeight: typography.fontWeight.bold,
                color: colors.gray[900],
                letterSpacing: typography.letterSpacing.tight,
              }}
            >
              HABTA
            </h1>
            <span
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.gray[500],
                padding: `${spacing[1]} ${spacing[2]}`,
                background: colors.gray[100],
                borderRadius: radius.md,
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              Admin
            </span>
          </div>

          {/* Compact Actions */}
          <nav aria-label="Ações do painel administrativo">
            <div style={{ display: 'flex', gap: spacing[2] }}>
              <button
                onClick={() => router.push('/')}
                aria-label="Voltar para o site principal"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                  padding: `${spacing[2]} ${spacing[3]}`,
                  background: 'transparent',
                  border: 'none',
                  borderRadius: radius.md,
                  color: colors.gray[600],
                  fontWeight: typography.fontWeight.medium,
                  fontSize: typography.fontSize.sm,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.gray[100];
                  e.currentTarget.style.color = colors.gray[900];
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = colors.gray[600];
                }}
              >
                <Home size={16} aria-hidden="true" />
                <span className="hidden md:inline">
                  Site
                </span>
              </button>

              <button
                onClick={handleLogout}
                aria-label="Sair do painel administrativo"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: spacing[2],
                  padding: `${spacing[2]} ${spacing[3]}`,
                  background: 'transparent',
                  border: 'none',
                  borderRadius: radius.md,
                  color: colors.gray[600],
                  fontWeight: typography.fontWeight.medium,
                  fontSize: typography.fontSize.sm,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = colors.error + '10';
                  e.currentTarget.style.color = colors.error;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = colors.gray[600];
                }}
              >
                <LogOut size={16} aria-hidden="true" />
                <span className="hidden md:inline">
                  Sair
                </span>
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Main Content - Maximized Space */}
      <main
        role="main"
        style={{
          maxWidth: '1600px',
          margin: '0 auto',
          padding: `${spacing[6]} ${spacing[6]} ${spacing[12]}`,
        }}
      >
        {children}
      </main>

      {/* Minimal Footer */}
      <footer
        role="contentinfo"
        style={{
          borderTop: `1px solid ${colors.gray[200]}`,
          background: colors.white,
          marginTop: 'auto',
        }}
      >
        <div
          style={{
            maxWidth: '1600px',
            margin: '0 auto',
            padding: `${spacing[4]} ${spacing[6]}`,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: spacing[3],
          }}
        >
          <p style={{ color: colors.gray[500], fontSize: typography.fontSize.sm }}>
            HABTA © {new Date().getFullYear()}
          </p>
          <p style={{ color: colors.gray[400], fontSize: typography.fontSize.xs }}>
            Admin Panel v2.6
          </p>
        </div>
      </footer>
    </div>
  );
}
