'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Clock, CheckCircle, AlertCircle, Trash2, X, Search } from '../icons';
import { colors, spacing, radius, typography, shadows } from '../../utils/styles';
import { designSystem } from '../design-system';
import { supabaseFetch } from '../../utils/supabase/client';
import { toast } from 'sonner';

type FollowupType = 'call' | 'email' | 'whatsapp' | 'meeting' | 'task';
type FollowupPriority = 'low' | 'medium' | 'high' | 'urgent';

interface Followup {
  id: string;
  contactId: string;
  title: string;
  type: FollowupType;
  dueDate: string;
  dueTime?: string | null;
  priority: FollowupPriority;
  notes?: string;
  status: string;
  outcome?: string | null;
  outcomeNotes?: string | null;
  completedAt?: string | null;
  createdAt: string;
  timestamp: number;
}

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  createdAt: string;
  timestamp: number;
  leadNumber?: number;
}

interface FollowupsTabProps {
  contacts: Contact[];
  onRefresh?: () => void;
}

const FOLLOWUP_TYPES: { value: FollowupType; label: string }[] = [
  { value: 'call', label: 'Chamada' },
  { value: 'email', label: 'Email' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'meeting', label: 'Reunião' },
  { value: 'task', label: 'Tarefa' },
];

const FOLLOWUP_PRIORITIES: { value: FollowupPriority; label: string; color: string }[] = [
  { value: 'low', label: 'Baixa', color: '#6B7280' },
  { value: 'medium', label: 'Média', color: '#F59E0B' },
  { value: 'high', label: 'Alta', color: '#F97316' },
  { value: 'urgent', label: 'Urgente', color: '#EF4444' },
];

const TYPE_TO_CHANNEL: Record<FollowupType, string> = {
  call: 'Telefone',
  email: 'Email',
  whatsapp: 'WhatsApp',
  meeting: 'Telefone',
  task: 'Mensagem',
};

export function FollowupsTab({ contacts, onRefresh }: FollowupsTabProps) {
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [completionText, setCompletionText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [filterType, setFilterType] = useState<'all' | FollowupType>('all');
  const [filterPriority, setFilterPriority] = useState<'all' | FollowupPriority>('all');

  const contactMap = useMemo(() => {
    const map = new Map<string, Contact>();
    contacts.forEach((c) => {
      const rawId = c.id.startsWith('contact:') ? c.id.slice('contact:'.length) : c.id;
      map.set(rawId, c);
      map.set(c.id, c);
    });
    return map;
  }, [contacts]);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await supabaseFetch('followups/pending', {}, 1, true);
      const data = await res.json();
      if (res.ok && data.followups) {
        setFollowups(data.followups);
      }
    } catch {
      setFollowups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPending();
  }, [fetchPending]);

  const today = new Date().toISOString().slice(0, 10);

  const hasActiveFilters = searchText !== '' || filterType !== 'all' || filterPriority !== 'all';

  const { overdue, todayItems, upcoming, totalFiltered } = useMemo(() => {
    const overdue: Followup[] = [];
    const todayItems: Followup[] = [];
    const upcoming: Followup[] = [];
    const search = searchText.toLowerCase();

    const filtered = followups.filter((fu) => {
      if (filterType !== 'all' && fu.type !== filterType) return false;
      if (filterPriority !== 'all' && fu.priority !== filterPriority) return false;
      if (search) {
        const contact = contactMap.get(fu.contactId) || contactMap.get(normalizeId(fu.contactId));
        const matchTitle = fu.title.toLowerCase().includes(search);
        const matchContact = contact?.name.toLowerCase().includes(search);
        if (!matchTitle && !matchContact) return false;
      }
      return true;
    });

    filtered.forEach((fu) => {
      if (fu.dueDate < today) overdue.push(fu);
      else if (fu.dueDate === today) todayItems.push(fu);
      else upcoming.push(fu);
    });

    overdue.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    upcoming.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    return { overdue, todayItems, upcoming, totalFiltered: filtered.length };
  }, [followups, today, searchText, filterType, filterPriority, contactMap]);

  const normalizeId = (id: string) => id.startsWith('contact:') ? id.slice('contact:'.length) : id;

  const handleComplete = async (fu: Followup) => {
    if (!completionText.trim()) {
      toast.error('Descreva o resultado');
      return;
    }
    try {
      const contactId = normalizeId(fu.contactId);
      // 1. Complete follow-up
      const res = await supabaseFetch(`contacts/${encodeURIComponent(contactId)}/followups/${fu.id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'completed', outcomeNotes: completionText.trim() }),
      });
      if (!res.ok) throw new Error('Erro ao concluir follow-up');

      // 2. Auto-create activity
      const channel = TYPE_TO_CHANNEL[fu.type] || 'Mensagem';
      await supabaseFetch(`contacts/${encodeURIComponent(contactId)}/activities`, {
        method: 'POST',
        body: JSON.stringify({
          date: new Date().toISOString().slice(0, 10),
          channel,
          type: 'Follow-up',
          content: `FU: ${fu.title} — ${completionText.trim()}`,
        }),
      });

      toast.success('Follow-up concluído + atividade registada');
      setCompletingId(null);
      setCompletionText('');
      fetchPending();
      onRefresh?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro');
    }
  };

  const handleDelete = async (fu: Followup) => {
    try {
      const contactId = normalizeId(fu.contactId);
      const res = await supabaseFetch(`contacts/${encodeURIComponent(contactId)}/followups/${fu.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Erro ao eliminar');
      toast.success('Follow-up eliminado');
      fetchPending();
      onRefresh?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro');
    }
  };

  const priorityBadgeStyles: Record<string, { bg: string; color: string }> = {
    low: { bg: colors.gray[100], color: colors.gray[600] },
    medium: { bg: '#FEF3C7', color: '#92400E' },
    high: { bg: '#FFEDD5', color: '#9A3412' },
    urgent: { bg: '#FEE2E2', color: '#991B1B' },
  };

  const renderSection = (title: string, items: Followup[], borderColor: string, bgColor: string) => {
    if (items.length === 0) return null;
    const isOverdueSection = borderColor === colors.error;
    return (
      <div style={{ marginBottom: spacing[6] }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: spacing[2],
          marginBottom: spacing[3],
        }}>
          <div style={{
            width: '4px',
            height: '20px',
            borderRadius: '2px',
            background: borderColor,
          }} />
          <h3 style={{
            fontSize: typography.fontSize.base,
            fontWeight: typography.fontWeight.bold,
            color: borderColor,
            margin: 0,
          }}>
            {title}
          </h3>
          <span style={{
            padding: `1px ${spacing[2]}`,
            background: designSystem.helpers.hexToRgba(borderColor, 0.1),
            color: borderColor,
            borderRadius: radius.full,
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeight.bold,
          }}>
            {items.length}
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
          {items.map((fu) => {
            const contact = contactMap.get(fu.contactId) || contactMap.get(normalizeId(fu.contactId));
            const priorityInfo = FOLLOWUP_PRIORITIES.find((p) => p.value === fu.priority);
            const typeInfo = FOLLOWUP_TYPES.find((t) => t.value === fu.type);
            const isCompleting = completingId === fu.id;

            return (
              <div
                key={fu.id}
                onMouseEnter={(e) => { e.currentTarget.style.boxShadow = shadows.md; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.borderColor = colors.gray[300]; }}
                onMouseLeave={(e) => { e.currentTarget.style.boxShadow = 'none'; e.currentTarget.style.transform = 'none'; e.currentTarget.style.borderColor = designSystem.helpers.hexToRgba(borderColor, 0.3); }}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing[1],
                  padding: spacing[3],
                  border: `1px solid ${designSystem.helpers.hexToRgba(borderColor, 0.3)}`,
                  borderLeft: isOverdueSection ? `3px solid ${colors.error}` : `1px solid ${designSystem.helpers.hexToRgba(borderColor, 0.3)}`,
                  borderRadius: radius.md,
                  background: bgColor,
                  transition: 'all 0.2s ease',
                }}
              >
                {/* Header row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[2] }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], flex: 1, minWidth: 0 }}>
                    <Clock size={14} style={{ color: borderColor, flexShrink: 0 }} />
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
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                    {!isCompleting && (
                      <button
                        type="button"
                        onClick={() => { setCompletingId(fu.id); setCompletionText(''); }}
                        style={{
                          border: 'none',
                          background: designSystem.helpers.hexToRgba(colors.success, 0.1),
                          color: colors.success,
                          borderRadius: radius.md,
                          padding: '2px 8px',
                          cursor: 'pointer',
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.bold,
                        }}
                      >
                        Concluir
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleDelete(fu)}
                      onMouseEnter={(e) => { e.currentTarget.style.background = designSystem.helpers.hexToRgba(colors.error, 0.1); e.currentTarget.style.color = colors.error; }}
                      onMouseLeave={(e) => { e.currentTarget.style.background = 'none'; e.currentTarget.style.color = colors.gray[400]; }}
                      aria-label="Eliminar follow-up"
                      style={{ flexShrink: 0, border: 'none', background: 'none', color: colors.gray[400], cursor: 'pointer', padding: '4px', borderRadius: radius.sm, transition: 'all 0.2s ease' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Info badges */}
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1], flexWrap: 'wrap' }}>
                  <span style={{
                    padding: '1px 6px',
                    background: designSystem.helpers.hexToRgba(colors.primary, 0.08),
                    color: colors.primary,
                    borderRadius: radius.full,
                    fontSize: '10px',
                    fontWeight: typography.fontWeight.semibold,
                  }}>
                    {typeInfo?.label || fu.type}
                  </span>
                  <span style={{
                    padding: '1px 6px',
                    background: priorityBadgeStyles[fu.priority]?.bg || colors.gray[100],
                    color: priorityBadgeStyles[fu.priority]?.color || colors.gray[600],
                    borderRadius: radius.full,
                    fontSize: '10px',
                    fontWeight: typography.fontWeight.bold,
                  }}>
                    {priorityInfo?.label || fu.priority}
                  </span>
                  <span style={{
                    fontSize: '10px',
                    color: colors.gray[500],
                    fontWeight: typography.fontWeight.medium,
                  }}>
                    {fu.dueDate}{fu.dueTime ? ` ${fu.dueTime}` : ''}
                  </span>
                  {contact && (
                    <span style={{
                      padding: '1px 6px',
                      background: designSystem.helpers.hexToRgba(colors.secondary, 0.1),
                      color: colors.secondary,
                      borderRadius: radius.full,
                      fontSize: '10px',
                      fontWeight: typography.fontWeight.semibold,
                    }}>
                      {contact.leadNumber ? `#${contact.leadNumber} ` : ''}{contact.name}
                    </span>
                  )}
                </div>

                {/* Completion textarea */}
                {isCompleting && (
                  <div style={{
                    marginTop: spacing[1],
                    padding: spacing[2],
                    background: colors.gray[50],
                    borderRadius: radius.md,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing[2],
                  }}>
                    <textarea
                      value={completionText}
                      onChange={(e) => setCompletionText(e.target.value)}
                      onFocus={(e) => { e.currentTarget.style.borderColor = colors.primary; e.currentTarget.style.boxShadow = '0 0 0 3px ' + designSystem.helpers.hexToRgba(colors.primary, 0.1); }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = colors.gray[300]; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder="Descreva o resultado..."
                      rows={2}
                      style={{
                        width: '100%',
                        padding: spacing[2],
                        border: `1px solid ${colors.gray[300]}`,
                        borderRadius: radius.md,
                        fontSize: typography.fontSize.sm,
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s ease',
                      }}
                      autoFocus
                    />
                    <div style={{ display: 'flex', gap: spacing[1], justifyContent: 'flex-end' }}>
                      <button
                        type="button"
                        onClick={() => handleComplete(fu)}
                        style={{
                          border: 'none',
                          background: colors.success,
                          color: colors.white,
                          borderRadius: radius.md,
                          padding: `${spacing[1]} ${spacing[3]}`,
                          cursor: 'pointer',
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.bold,
                        }}
                      >
                        OK
                      </button>
                      <button
                        type="button"
                        onClick={() => { setCompletingId(null); setCompletionText(''); }}
                        style={{ border: 'none', background: 'none', color: colors.gray[400], cursor: 'pointer', padding: '2px' }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', color: colors.gray[400], fontSize: typography.fontSize.sm, padding: spacing[8] }}>
        A carregar follow-ups...
      </div>
    );
  }

  if (followups.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: `${spacing[16]} ${spacing[8]}`, color: colors.gray[400] }}>
        <CheckCircle size={48} style={{ marginBottom: spacing[4], opacity: 0.4 }} />
        <p style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, color: colors.gray[500], marginBottom: spacing[2] }}>
          Tudo em dia
        </p>
        <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[400] }}>Nao existem follow-ups pendentes</p>
      </div>
    );
  }

  const selectStyle: React.CSSProperties = {
    padding: `${spacing[2]} ${spacing[3]}`,
    border: `1px solid ${colors.gray[300]}`,
    borderRadius: radius.md,
    fontSize: typography.fontSize.sm,
    outline: 'none',
    background: colors.white,
    color: colors.gray[700],
    cursor: 'pointer',
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      {/* Filter bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacing[2],
        marginBottom: spacing[4],
        alignItems: 'center',
      }}>
        <div style={{ position: 'relative', flex: '1 1 200px', minWidth: '160px' }}>
          <Search size={14} style={{ position: 'absolute', left: spacing[2], top: '50%', transform: 'translateY(-50%)', color: colors.gray[400], pointerEvents: 'none' }} />
          <input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Pesquisar follow-ups..."
            style={{
              width: '100%',
              padding: `${spacing[2]} ${spacing[3]}`,
              paddingLeft: spacing[8],
              border: `1px solid ${colors.gray[300]}`,
              borderRadius: radius.md,
              fontSize: typography.fontSize.sm,
              outline: 'none',
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = colors.primary; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = colors.gray[300]; }}
          />
        </div>
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as 'all' | FollowupType)}
          style={selectStyle}
        >
          <option value="all">Todos os tipos</option>
          {FOLLOWUP_TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>
        <select
          value={filterPriority}
          onChange={(e) => setFilterPriority(e.target.value as 'all' | FollowupPriority)}
          style={selectStyle}
        >
          <option value="all">Todas as prioridades</option>
          {FOLLOWUP_PRIORITIES.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
        {hasActiveFilters && (
          <button
            type="button"
            onClick={() => { setSearchText(''); setFilterType('all'); setFilterPriority('all'); }}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              border: 'none',
              background: designSystem.helpers.hexToRgba(colors.error, 0.08),
              color: colors.error,
              borderRadius: radius.md,
              padding: `${spacing[2]} ${spacing[3]}`,
              cursor: 'pointer',
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.bold,
            }}
          >
            <X size={12} />
            Limpar
          </button>
        )}
      </div>

      {/* Filter results count */}
      {hasActiveFilters && (
        <p style={{ fontSize: typography.fontSize.xs, color: colors.gray[500], marginBottom: spacing[3] }}>
          {totalFiltered} {totalFiltered === 1 ? 'resultado' : 'resultados'} encontrado{totalFiltered === 1 ? '' : 's'}
        </p>
      )}

      {/* Empty state for filters */}
      {hasActiveFilters && totalFiltered === 0 ? (
        <div style={{ textAlign: 'center', padding: `${spacing[8]} ${spacing[4]}`, color: colors.gray[400] }}>
          <Search size={36} style={{ marginBottom: spacing[3], opacity: 0.3 }} />
          <p style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[500], marginBottom: spacing[1] }}>
            Nenhum follow-up encontrado
          </p>
          <p style={{ fontSize: typography.fontSize.xs, color: colors.gray[400] }}>
            Tente ajustar os filtros de pesquisa
          </p>
        </div>
      ) : (
        <>
          {renderSection('Atrasados', overdue, colors.error, designSystem.helpers.hexToRgba(colors.error, 0.03))}
          {renderSection('Hoje', todayItems, colors.warning, designSystem.helpers.hexToRgba(colors.warning, 0.03))}
          {renderSection('Próximos', upcoming, colors.primary, colors.white)}
        </>
      )}
    </div>
  );
}
