// Admin: Clean layout focused on data - 100% Conformidade Guardião
import React, { ReactNode, useState, useRef, useEffect } from 'react';
import { Home, LogOut, Bell, Clock } from 'lucide-react';
import { colors, shadows, spacing, radius, typography } from '../../utils/styles';
import { designSystem } from '../design-system';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { createClient } from '@/lib/supabase/client';

interface FollowupItem {
  id: string;
  contactId: string;
  title: string;
  type: string;
  dueDate: string;
  priority: string;
}

interface ContactItem {
  id: string;
  name: string;
}

interface AdminLayoutProps {
  children: ReactNode;
  notificationCount?: number;
  urgentFollowups?: FollowupItem[];
  contacts?: ContactItem[];
  onNotificationClick?: () => void;
}

const PRIORITY_STYLES: Record<string, { bg: string; color: string; label: string }> = {
  low: { bg: '#F3F4F6', color: '#6B7280', label: 'Baixa' },
  medium: { bg: '#FEF3C7', color: '#92400E', label: 'Média' },
  high: { bg: '#FFEDD5', color: '#9A3412', label: 'Alta' },
  urgent: { bg: '#FEE2E2', color: '#991B1B', label: 'Urgente' },
};

export function AdminLayout({ children, notificationCount, urgentFollowups = [], contacts = [], onNotificationClick }: AdminLayoutProps) {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const bellRef = useRef<HTMLDivElement>(null);

  // Click-outside handler
  useEffect(() => {
    if (!dropdownOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    toast.success('Sessão encerrada');
    router.push('/login');
    router.refresh();
  };

  const contactMap = new Map<string, string>();
  contacts.forEach((c) => {
    const rawId = c.id.startsWith('contact:') ? c.id.slice('contact:'.length) : c.id;
    contactMap.set(rawId, c.name);
    contactMap.set(c.id, c.name);
  });

  const today = new Date().toISOString().slice(0, 10);

  const getDateColor = (dueDate: string) => {
    if (dueDate < today) return colors.error;
    if (dueDate === today) return colors.warning;
    return colors.gray[500];
  };

  const getDateLabel = (dueDate: string) => {
    if (dueDate < today) return 'Atrasado';
    if (dueDate === today) return 'Hoje';
    return dueDate;
  };

  return (
    <div style={{ minHeight: '100vh', background: colors.gray[50] }}>
      {/* Brand Gradient Bar */}
      <div
        aria-hidden="true"
        style={{
          height: '3px',
          background: `linear-gradient(90deg, ${colors.primary} 0%, ${colors.secondary} 100%)`,
          position: 'sticky',
          top: 0,
          zIndex: 51,
        }}
      />

      {/* Clean Minimal Header */}
      <header
        role="banner"
        style={{
          position: 'sticky',
          top: '3px',
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
                color: colors.primary,
                letterSpacing: typography.letterSpacing.tight,
              }}
            >
              HABTA
            </h1>
            <span
              style={{
                fontSize: typography.fontSize.sm,
                color: colors.primary,
                padding: `${spacing[1]} ${spacing[2]}`,
                background: designSystem.helpers.hexToRgba(colors.primary, 0.08),
                borderRadius: radius.md,
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              Admin
            </span>
          </div>

          {/* Compact Actions */}
          <nav aria-label="Ações do painel administrativo">
            <div style={{ display: 'flex', gap: spacing[2], alignItems: 'center' }}>
              {/* Notification Bell + Dropdown */}
              <div ref={bellRef} style={{ position: 'relative' }}>
                <button
                  onClick={() => setDropdownOpen((prev) => !prev)}
                  aria-label={`${notificationCount || 0} follow-ups pendentes`}
                  aria-expanded={dropdownOpen}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: spacing[2],
                    background: dropdownOpen ? colors.gray[100] : 'transparent',
                    border: 'none',
                    borderRadius: radius.md,
                    color: notificationCount && notificationCount > 0 ? colors.gray[900] : colors.gray[600],
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    if (!dropdownOpen) e.currentTarget.style.background = colors.gray[100];
                  }}
                  onMouseLeave={(e) => {
                    if (!dropdownOpen) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <Bell size={18} aria-hidden="true" />
                  {notificationCount != null && notificationCount > 0 && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '2px',
                        right: '2px',
                        minWidth: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: colors.error,
                        color: '#fff',
                        borderRadius: '999px',
                        fontSize: '10px',
                        fontWeight: typography.fontWeight.bold,
                        lineHeight: 1,
                        padding: '0 3px',
                      }}
                    >
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </button>

                {/* Dropdown */}
                {dropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      right: 0,
                      width: '340px',
                      background: colors.white,
                      border: `1px solid ${colors.gray[200]}`,
                      borderRadius: radius.lg,
                      boxShadow: shadows.lg,
                      zIndex: 100,
                      overflow: 'hidden',
                    }}
                  >
                    <div style={{
                      padding: `${spacing[3]} ${spacing[4]}`,
                      borderBottom: `1px solid ${colors.gray[100]}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                      <span style={{
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.bold,
                        color: colors.gray[900],
                      }}>
                        Follow-ups pendentes
                      </span>
                      {notificationCount != null && notificationCount > 0 && (
                        <span style={{
                          padding: '1px 8px',
                          background: designSystem.helpers.hexToRgba(colors.error, 0.1),
                          color: colors.error,
                          borderRadius: radius.full,
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.bold,
                        }}>
                          {notificationCount}
                        </span>
                      )}
                    </div>

                    {urgentFollowups.length === 0 ? (
                      <div style={{ padding: `${spacing[6]} ${spacing[4]}`, textAlign: 'center' }}>
                        <Clock size={24} style={{ color: colors.gray[300], marginBottom: spacing[2] }} />
                        <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[400], margin: 0 }}>
                          Sem follow-ups pendentes
                        </p>
                      </div>
                    ) : (
                      <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                        {urgentFollowups.map((fu) => {
                          const contactName = contactMap.get(fu.contactId) || 'Desconhecido';
                          const priority = PRIORITY_STYLES[fu.priority] || PRIORITY_STYLES.medium;
                          const dateColor = getDateColor(fu.dueDate);
                          const dateLabel = getDateLabel(fu.dueDate);

                          return (
                            <button
                              key={fu.id}
                              type="button"
                              onClick={() => {
                                setDropdownOpen(false);
                                onNotificationClick?.();
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = colors.gray[50]; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '3px',
                                width: '100%',
                                padding: `${spacing[3]} ${spacing[4]}`,
                                border: 'none',
                                borderBottom: `1px solid ${colors.gray[50]}`,
                                background: 'transparent',
                                cursor: 'pointer',
                                textAlign: 'left',
                                transition: 'background 0.15s',
                              }}
                            >
                              <span style={{
                                fontSize: typography.fontSize.sm,
                                fontWeight: typography.fontWeight.medium,
                                color: colors.gray[800],
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}>
                                {fu.title}
                              </span>
                              <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1], flexWrap: 'wrap' }}>
                                <span style={{
                                  fontSize: '10px',
                                  color: colors.gray[500],
                                  fontWeight: typography.fontWeight.medium,
                                }}>
                                  {contactName}
                                </span>
                                <span style={{
                                  fontSize: '10px',
                                  color: dateColor,
                                  fontWeight: typography.fontWeight.bold,
                                }}>
                                  {dateLabel}
                                </span>
                                <span style={{
                                  padding: '0 5px',
                                  background: priority.bg,
                                  color: priority.color,
                                  borderRadius: radius.full,
                                  fontSize: '9px',
                                  fontWeight: typography.fontWeight.bold,
                                  lineHeight: '16px',
                                }}>
                                  {priority.label}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setDropdownOpen(false);
                        onNotificationClick?.();
                      }}
                      onMouseEnter={(e) => { e.currentTarget.style.background = designSystem.helpers.hexToRgba(colors.primary, 0.05); }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = colors.gray[50]; }}
                      style={{
                        display: 'block',
                        width: '100%',
                        padding: `${spacing[3]} ${spacing[4]}`,
                        border: 'none',
                        borderTop: `1px solid ${colors.gray[100]}`,
                        background: colors.gray[50],
                        color: colors.primary,
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.bold,
                        cursor: 'pointer',
                        textAlign: 'center',
                        transition: 'background 0.15s',
                      }}
                    >
                      Ver todos os follow-ups
                    </button>
                  </div>
                )}
              </div>

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
