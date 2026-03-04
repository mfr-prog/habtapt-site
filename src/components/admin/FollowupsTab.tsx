'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Clock, CheckCircle, AlertCircle, Trash2, X } from '../icons';
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

  const { overdue, todayItems, upcoming } = useMemo(() => {
    const overdue: Followup[] = [];
    const todayItems: Followup[] = [];
    const upcoming: Followup[] = [];

    followups.forEach((fu) => {
      if (fu.dueDate < today) overdue.push(fu);
      else if (fu.dueDate === today) todayItems.push(fu);
      else upcoming.push(fu);
    });

    overdue.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
    upcoming.sort((a, b) => a.dueDate.localeCompare(b.dueDate));

    return { overdue, todayItems, upcoming };
  }, [followups, today]);

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

  const renderSection = (title: string, items: Followup[], borderColor: string, bgColor: string) => {
    if (items.length === 0) return null;
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
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: spacing[1],
                  padding: spacing[3],
                  border: `1px solid ${designSystem.helpers.hexToRgba(borderColor, 0.3)}`,
                  borderRadius: radius.md,
                  background: bgColor,
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
                      aria-label="Eliminar follow-up"
                      style={{ flexShrink: 0, border: 'none', background: 'none', color: colors.gray[400], cursor: 'pointer', padding: '2px' }}
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
                    background: designSystem.helpers.hexToRgba(priorityInfo?.color || '#6B7280', 0.1),
                    color: priorityInfo?.color || '#6B7280',
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
      <div style={{ textAlign: 'center', padding: spacing[12], color: colors.gray[500] }}>
        <CheckCircle size={48} style={{ margin: '0 auto', marginBottom: spacing[4], opacity: 0.3 }} />
        <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.semibold, marginBottom: spacing[2] }}>
          Tudo em dia
        </h3>
        <p style={{ fontSize: typography.fontSize.sm }}>Não existem follow-ups pendentes</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px' }}>
      {renderSection('Atrasados', overdue, colors.error, designSystem.helpers.hexToRgba(colors.error, 0.03))}
      {renderSection('Hoje', todayItems, colors.warning, designSystem.helpers.hexToRgba(colors.warning, 0.03))}
      {renderSection('Próximos', upcoming, colors.primary, colors.white)}
    </div>
  );
}
