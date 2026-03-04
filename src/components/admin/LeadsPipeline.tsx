'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner';
import { Mail, Phone, Calendar, MessageSquare, Edit, Save, X, Plus, Trash2, Clock, CheckCircle, AlertCircle } from '../icons';
import { colors, spacing, radius, typography, shadows } from '../../utils/styles';
import { designSystem } from '../design-system';
import { supabaseFetch } from '../../utils/supabase/client';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  interest: string;
  message: string;
  createdAt: string;
  timestamp: number;
  pipelineStage?: PipelineStageId;
  leadNumber?: number;
  // Preferências
  desiredLocations?: string[];
  maxBudget?: string;
  typology?: string;
  notes?: string;
  classifications?: string[];
  origin?: string;
  // Projecto de controlo
  projectId?: string;
  unitId?: string;
  proposalValue?: number;
}

type FollowupType = 'call' | 'email' | 'whatsapp' | 'meeting' | 'task';
type FollowupPriority = 'low' | 'medium' | 'high' | 'urgent';
type FollowupStatus = 'pending' | 'completed' | 'skipped' | 'cancelled';
type FollowupOutcome = 'answered' | 'no_answer' | 'voicemail' | 'interested' | 'not_interested' | 'meeting_booked' | 'sent' | 'replied' | 'rescheduled';

interface Followup {
  id: string;
  contactId: string;
  title: string;
  type: FollowupType;
  dueDate: string;
  dueTime?: string | null;
  priority: FollowupPriority;
  notes?: string;
  status: FollowupStatus;
  outcome?: FollowupOutcome | null;
  outcomeNotes?: string | null;
  completedAt?: string | null;
  isOverdue?: boolean;
  sequenceEnrollmentId?: string | null;
  sequenceStepId?: string | null;
  isAutomated?: boolean;
  createdAt: string;
  timestamp: number;
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

const FOLLOWUP_OUTCOMES: { value: FollowupOutcome; label: string }[] = [
  { value: 'answered', label: 'Atendeu' },
  { value: 'no_answer', label: 'Sem resposta' },
  { value: 'voicemail', label: 'Voicemail' },
  { value: 'interested', label: 'Interessado' },
  { value: 'not_interested', label: 'Sem interesse' },
  { value: 'meeting_booked', label: 'Reunião marcada' },
  { value: 'sent', label: 'Enviado' },
  { value: 'replied', label: 'Respondeu' },
  { value: 'rescheduled', label: 'Reagendado' },
];

interface Activity {
  id: string;
  contactId: string;
  date: string;
  channel: string;
  type: string;
  content: string;
  timestamp: number;
}

const CHANNELS = ['Telefone', 'Email', 'WhatsApp', 'Mensagem'] as const;
const ORIGINS = ['Grupos WhatsApp', 'Idealista Habta', 'Idealista Portela', 'Landing Velask', 'Site Habta'] as const;

interface ControloProjectOption {
  id: string;
  label: string;
}

interface ControloUnitOption {
  id: string;
  code: string;
}

type PipelineStageId =
  | 'novo'
  | 'contato'
  | 'qualificado'
  | 'visita'
  | 'proposta'
  | 'negociacao'
  | 'ganho'
  | 'perdido';

const STAGES: { id: PipelineStageId; label: string; color: string }[] = [
  { id: 'novo', label: 'Novo Lead', color: colors.gray[400] },
  { id: 'contato', label: 'Contato Inicial', color: colors.primary },
  { id: 'qualificado', label: 'Qualificado', color: colors.secondary },
  { id: 'visita', label: 'Visita Agendada', color: colors.warning },
  { id: 'proposta', label: 'Proposta Enviada', color: colors.info },
  { id: 'negociacao', label: 'Negociação', color: colors.warning },
  { id: 'ganho', label: 'Fechado • Ganho', color: colors.success },
  { id: 'perdido', label: 'Fechado • Perdido', color: colors.error },
];

interface LeadsPipelineProps {
  contacts: Contact[];
  onRefresh?: () => void;
}

export function LeadsPipeline({ contacts, onRefresh }: LeadsPipelineProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [form, setForm] = useState<{
    name: string;
    email: string;
    phone: string;
    interest: string;
    desiredLocations: string;
    maxBudget: string;
    typology: string;
    notes: string;
    classifications: string[];
    origin: string;
    projectId: string;
    unitId: string;
    proposalValue: string;
  }>({
    name: '',
    email: '',
    phone: '',
    interest: '',
    desiredLocations: '',
    maxBudget: '',
    typology: '',
    notes: '',
    classifications: [],
    origin: '',
    projectId: '',
    unitId: '',
    proposalValue: '',
  });
  const [controloProjects, setControloProjects] = useState<ControloProjectOption[]>([]);
  const [controloUnits, setControloUnits] = useState<ControloUnitOption[]>([]);

  // Activity log state
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loadingActivities, setLoadingActivities] = useState(false);
  const [newActivity, setNewActivity] = useState({
    date: new Date().toISOString().slice(0, 10),
    channel: '',
    type: '',
    content: '',
  });

  // Follow-up state
  const [followups, setFollowups] = useState<Followup[]>([]);
  const [loadingFollowups, setLoadingFollowups] = useState(false);
  const [allPendingFollowups, setAllPendingFollowups] = useState<Followup[]>([]);
  const [newFollowup, setNewFollowup] = useState({
    title: '',
    type: 'call' as FollowupType,
    dueDate: new Date().toISOString().slice(0, 10),
    dueTime: '',
    priority: 'medium' as FollowupPriority,
    notes: '',
  });
  const [completingFollowupId, setCompletingFollowupId] = useState<string | null>(null);
  const [selectedOutcome, setSelectedOutcome] = useState<FollowupOutcome | ''>('');

  // Fetch all pending follow-ups for card badges
  const fetchAllPendingFollowups = React.useCallback(async () => {
    try {
      const res = await supabaseFetch('followups/pending', {}, 1, true);
      const data = await res.json();
      if (res.ok && data.followups) {
        setAllPendingFollowups(data.followups);
      }
    } catch {
      setAllPendingFollowups([]);
    }
  }, []);

  React.useEffect(() => {
    fetchAllPendingFollowups();
  }, [fetchAllPendingFollowups]);

  // Fetch follow-ups for a contact
  const fetchFollowups = React.useCallback(async (contactId: string) => {
    setLoadingFollowups(true);
    try {
      const normalizedId = contactId.startsWith('contact:') ? contactId.slice('contact:'.length) : contactId;
      const res = await supabaseFetch(`contacts/${encodeURIComponent(normalizedId)}/followups`, {}, 1, true);
      const data = await res.json();
      if (res.ok && data.followups) {
        setFollowups(data.followups);
      }
    } catch {
      setFollowups([]);
    } finally {
      setLoadingFollowups(false);
    }
  }, []);

  React.useEffect(() => {
    if (isEditing && editingContact) {
      fetchFollowups(editingContact.id);
      setNewFollowup({ title: '', type: 'call', dueDate: new Date().toISOString().slice(0, 10), dueTime: '', priority: 'medium', notes: '' });
      setCompletingFollowupId(null);
      setSelectedOutcome('');
    }
  }, [isEditing, editingContact, fetchFollowups]);

  const handleAddFollowup = async () => {
    if (!editingContact || !newFollowup.title.trim() || !newFollowup.dueDate) {
      toast.error('Título e data são obrigatórios');
      return;
    }
    try {
      const normalizedId = editingContact.id.startsWith('contact:') ? editingContact.id.slice('contact:'.length) : editingContact.id;
      const res = await supabaseFetch(`contacts/${encodeURIComponent(normalizedId)}/followups`, {
        method: 'POST',
        body: JSON.stringify({
          title: newFollowup.title.trim(),
          type: newFollowup.type,
          dueDate: newFollowup.dueDate,
          dueTime: newFollowup.dueTime || undefined,
          priority: newFollowup.priority,
          notes: newFollowup.notes.trim() || undefined,
        }),
      });
      if (!res.ok) throw new Error('Erro ao criar follow-up');
      toast.success('Follow-up criado');
      setNewFollowup({ title: '', type: 'call', dueDate: new Date().toISOString().slice(0, 10), dueTime: '', priority: 'medium', notes: '' });
      fetchFollowups(editingContact.id);
      fetchAllPendingFollowups();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar follow-up');
    }
  };

  const handleCompleteFollowup = async (followupId: string) => {
    if (!editingContact || !selectedOutcome) {
      toast.error('Selecione um resultado');
      return;
    }
    try {
      const normalizedId = editingContact.id.startsWith('contact:') ? editingContact.id.slice('contact:'.length) : editingContact.id;
      const res = await supabaseFetch(`contacts/${encodeURIComponent(normalizedId)}/followups/${followupId}`, {
        method: 'PUT',
        body: JSON.stringify({ status: 'completed', outcome: selectedOutcome }),
      });
      if (!res.ok) throw new Error('Erro ao concluir follow-up');
      toast.success('Follow-up concluído');
      setCompletingFollowupId(null);
      setSelectedOutcome('');
      fetchFollowups(editingContact.id);
      fetchAllPendingFollowups();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao concluir follow-up');
    }
  };

  const handleDeleteFollowup = async (followupId: string) => {
    if (!editingContact) return;
    try {
      const normalizedId = editingContact.id.startsWith('contact:') ? editingContact.id.slice('contact:'.length) : editingContact.id;
      const res = await supabaseFetch(`contacts/${encodeURIComponent(normalizedId)}/followups/${followupId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erro ao eliminar');
      toast.success('Follow-up eliminado');
      fetchFollowups(editingContact.id);
      fetchAllPendingFollowups();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao eliminar follow-up');
    }
  };

  // Create lead modal state
  const [isCreating, setIsCreating] = useState(false);
  const [newLead, setNewLead] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
    projectId: '',
    origin: '',
  });

  // Fetch controlo projects on mount
  React.useEffect(() => {
    (async () => {
      try {
        const res = await supabaseFetch('controlo/projects', {}, 1, true);
        const data = await res.json();
        if (res.ok && data.projects) {
          setControloProjects(data.projects);
        }
      } catch {}
    })();
  }, []);

  // Fetch units when projectId changes
  React.useEffect(() => {
    if (!form.projectId) {
      setControloUnits([]);
      return;
    }
    (async () => {
      try {
        const res = await supabaseFetch(`controlo/units?projectId=${form.projectId}`, {}, 1, true);
        const data = await res.json();
        if (res.ok && data.units) {
          setControloUnits(data.units);
        }
      } catch {}
    })();
  }, [form.projectId]);

  // Fetch activities when editing a contact
  const fetchActivities = React.useCallback(async (contactId: string) => {
    setLoadingActivities(true);
    try {
      const normalizedId = contactId.startsWith('contact:') ? contactId.slice('contact:'.length) : contactId;
      const res = await supabaseFetch(`contacts/${encodeURIComponent(normalizedId)}/activities`, {}, 1, true);
      const data = await res.json();
      if (res.ok && data.activities) {
        setActivities(data.activities);
      }
    } catch {
      setActivities([]);
    } finally {
      setLoadingActivities(false);
    }
  }, []);

  React.useEffect(() => {
    if (isEditing && editingContact) {
      fetchActivities(editingContact.id);
      setNewActivity({ date: new Date().toISOString().slice(0, 10), channel: '', type: '', content: '' });
    }
  }, [isEditing, editingContact, fetchActivities]);

  const handleAddActivity = async () => {
    if (!editingContact || !newActivity.channel || !newActivity.content.trim()) {
      toast.error('Canal e conteúdo são obrigatórios');
      return;
    }
    try {
      const normalizedId = editingContact.id.startsWith('contact:') ? editingContact.id.slice('contact:'.length) : editingContact.id;
      const res = await supabaseFetch(`contacts/${encodeURIComponent(normalizedId)}/activities`, {
        method: 'POST',
        body: JSON.stringify(newActivity),
      });
      if (!res.ok) throw new Error('Erro ao criar atividade');
      toast.success('Atividade registada');
      setNewActivity({ date: new Date().toISOString().slice(0, 10), channel: '', type: '', content: '' });
      fetchActivities(editingContact.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar atividade');
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!editingContact) return;
    try {
      const normalizedId = editingContact.id.startsWith('contact:') ? editingContact.id.slice('contact:'.length) : editingContact.id;
      const res = await supabaseFetch(`contacts/${encodeURIComponent(normalizedId)}/activities/${activityId}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Erro ao eliminar');
      toast.success('Atividade eliminada');
      fetchActivities(editingContact.id);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao eliminar atividade');
    }
  };

  const [localPrefs, setLocalPrefs] = useState<Record<string, Partial<Contact>>>(() => {
    try {
      const raw = localStorage.getItem('habta_lead_prefs');
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  const [localStages, setLocalStages] = useState<Record<string, PipelineStageId>>(() => {
    let persisted: Record<string, PipelineStageId> = {};
    try {
      const raw = localStorage.getItem('habta_pipeline_stages');
      if (raw) persisted = JSON.parse(raw);
    } catch {}
    const map: Record<string, PipelineStageId> = {};
    contacts.forEach((c) => {
      map[c.id] =
        persisted[c.id] ||
        (c.pipelineStage as PipelineStageId) ||
        'novo';
    });
    return map;
  });

  // Sync local state if contacts list changes
  React.useEffect(() => {
    setLocalStages((prev) => {
      const next = { ...prev };
      contacts.forEach((c) => {
        next[c.id] = (c.pipelineStage as PipelineStageId) || 'novo';
      });
      return next;
    });
  }, [contacts]);

  const columns = useMemo(() => {
    const grouped: Record<PipelineStageId, Contact[]> = {
      novo: [],
      contato: [],
      qualificado: [],
      visita: [],
      proposta: [],
      negociacao: [],
      ganho: [],
      perdido: [],
    };
    contacts.forEach((c) => {
      const stage = (localStages[c.id] || c.pipelineStage || 'novo') as PipelineStageId;
      grouped[stage].push(c);
    });
    return grouped;
  }, [contacts, localStages]);

  const normalizeContactId = (id: string) => (id.startsWith('contact:') ? id.slice('contact:'.length) : id);

  const handleDropOn = async (stageId: PipelineStageId, contactId?: string) => {
    if (!draggingId) return;
    const id = draggingId;
    setDraggingId(null);

    // Otimismo local
    setLocalStages((prev) => ({ ...prev, [id]: stageId }));

    try {
      setIsSaving(true);
      const response = await supabaseFetch(`contacts/${encodeURIComponent(normalizeContactId(id))}`, {
        method: 'PUT',
        body: JSON.stringify({ pipelineStage: stageId }),
      });
      let data: any = null;
      try {
        data = await response.json();
      } catch {}
      if (!response.ok) {
        throw new Error(data?.error || `Falha ao atualizar estágio (HTTP ${response.status})`);
      }
      toast.success('Estágio do lead atualizado');
      onRefresh?.();
      // persistir localmente também
      try {
        const currentRaw = localStorage.getItem('habta_pipeline_stages');
        const current = currentRaw ? JSON.parse(currentRaw) : {};
        current[id] = stageId;
        localStorage.setItem('habta_pipeline_stages', JSON.stringify(current));
      } catch {}
    } catch (err) {
      // Manter mudança local para produtividade e persistir localmente
      try {
        const currentRaw = localStorage.getItem('habta_pipeline_stages');
        const current = currentRaw ? JSON.parse(currentRaw) : {};
        current[id] = stageId;
        localStorage.setItem('habta_pipeline_stages', JSON.stringify(current));
      } catch {}
      toast.warning('Mudança salva localmente. Sincronização com servidor pendente.');
    } finally {
      setIsSaving(false);
    }
  };

  const card = (c: Contact) => (
    // Derivar preferências locais (fallback)
    // Preferências do contato priorizam servidor; se ausentes, aplica cache local
    (() => {
      const lp = localPrefs[c.id] || {};
      const desiredLocations = c.desiredLocations ?? (lp.desiredLocations as string[] | undefined);
      const maxBudget = c.maxBudget ?? (lp.maxBudget as string | undefined);
      const typology = c.typology ?? (lp.typology as string | undefined);
      const notes = c.notes ?? (lp.notes as string | undefined);
      const contactWithPrefs = { ...c, desiredLocations, maxBudget, typology, notes };
      c = contactWithPrefs;
      return (
    <div
      key={c.id}
      draggable
      onDragStart={() => setDraggingId(c.id)}
      onDragEnd={() => setDraggingId(null)}
      style={{
        background: colors.white,
        border: `1px solid ${colors.gray[200]}`,
        borderRadius: radius.lg,
        padding: spacing[3],
        boxShadow: draggingId === c.id ? shadows.md : 'none',
        cursor: 'grab',
        display: 'flex',
        flexDirection: 'column',
        gap: spacing[2],
      }}
    >
      {/* Header: nome + classificações + editar */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: spacing[1] }}>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontWeight: typography.fontWeight.bold, color: colors.gray[900], fontSize: typography.fontSize.sm, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
            {c.leadNumber && (
              <span style={{ color: colors.gray[400], fontWeight: typography.fontWeight.semibold, fontSize: '11px', flexShrink: 0 }}>
                #{String(c.leadNumber).padStart(3, '0')}
              </span>
            )}
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.name}</span>
          </div>
          {c.classifications && c.classifications.length > 0 && (
            <div style={{ display: 'flex', gap: '3px', flexWrap: 'wrap', marginTop: '3px' }}>
              {c.classifications.map((cls) => (
                <span key={`${c.id}-cls-${cls}`} style={{ padding: '1px 6px', background: designSystem.helpers.hexToRgba(colors.primary, 0.08), color: colors.primary, borderRadius: radius.full, fontSize: '10px', fontWeight: typography.fontWeight.bold, lineHeight: '16px' }}>
                  {cls}
                </span>
              ))}
            </div>
          )}
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setEditingContact(c);
            setForm({
              name: c.name || '',
              email: c.email || '',
              phone: c.phone || '',
              interest: c.interest || '',
              desiredLocations: (c.desiredLocations || []).join(', '),
              maxBudget: c.maxBudget || '',
              typology: c.typology || '',
              notes: c.notes || '',
              classifications: c.classifications || [],
              origin: c.origin || '',
              projectId: c.projectId || '',
              unitId: c.unitId || '',
              proposalValue: c.proposalValue ? String(c.proposalValue) : '',
            });
            setIsEditing(true);
          }}
          aria-label="Editar lead"
          style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', border: 'none', background: colors.gray[100], borderRadius: radius.md, padding: '4px', cursor: 'pointer', flexShrink: 0 }}
        >
          <Edit size={13} style={{ color: colors.gray[500] }} />
        </button>
      </div>

      {/* Contacto: telefone + email */}
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], fontSize: typography.fontSize.xs, color: colors.gray[600] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
          <Phone size={12} aria-hidden="true" />
          {c.phone}
        </div>
        {c.email && !c.email.includes('@manual.habta.eu') && (
          <>
            <span style={{ color: colors.gray[300] }}>|</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              <Mail size={12} aria-hidden="true" />
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.email}</span>
            </div>
          </>
        )}
      </div>

      {/* Interesse */}
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: `2px ${spacing[2]}`, background: designSystem.helpers.hexToRgba(colors.secondary, 0.08), color: colors.secondary, borderRadius: radius.md, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, alignSelf: 'flex-start' }}>
        <MessageSquare size={11} aria-hidden="true" />
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>{c.interest}</span>
      </div>

      {/* Origem */}
      {c.origin && (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 8px', background: designSystem.helpers.hexToRgba(colors.info, 0.08), color: colors.info, borderRadius: radius.md, fontSize: '10px', fontWeight: typography.fontWeight.bold, alignSelf: 'flex-start' }}>
          {c.origin}
        </div>
      )}

      {/* Preferências compactas */}
      {(c.desiredLocations?.length || c.maxBudget || c.typology) && (
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {c.typology && (
            <span style={{ padding: '1px 6px', background: designSystem.helpers.hexToRgba(colors.primary, 0.06), color: colors.primary, borderRadius: radius.full, fontSize: '10px', fontWeight: typography.fontWeight.semibold, lineHeight: '16px' }}>
              {c.typology}
            </span>
          )}
          {c.maxBudget && (
            <span style={{ padding: '1px 6px', background: designSystem.helpers.hexToRgba(colors.success, 0.08), color: colors.success, borderRadius: radius.full, fontSize: '10px', fontWeight: typography.fontWeight.bold, lineHeight: '16px' }}>
              {c.maxBudget}
            </span>
          )}
          {(c.desiredLocations || []).slice(0, 2).map((loc, i) => (
            <span key={`${c.id}-loc-${i}`} style={{ padding: '1px 6px', background: colors.gray[100], color: colors.gray[600], borderRadius: radius.full, fontSize: '10px', lineHeight: '16px' }}>
              {loc}
            </span>
          ))}
          {c.desiredLocations && c.desiredLocations.length > 2 && (
            <span style={{ color: colors.gray[400], fontSize: '10px', lineHeight: '16px' }}>+{c.desiredLocations.length - 2}</span>
          )}
        </div>
      )}

      {/* Data + follow-up badge */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[1] }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3px', color: colors.gray[400], fontSize: '10px' }}>
          <Calendar size={10} aria-hidden="true" />
          {new Date(c.createdAt).toLocaleDateString('pt-PT')}
        </div>
        {(() => {
          const contactNormId = c.id.startsWith('contact:') ? c.id.slice('contact:'.length) : c.id;
          const pendingFu = allPendingFollowups.filter((f) => f.contactId === contactNormId);
          if (pendingFu.length === 0) return null;
          const today = new Date().toISOString().slice(0, 10);
          const hasOverdue = pendingFu.some((f) => f.dueDate < today);
          const nextDate = pendingFu[0]?.dueDate;
          return (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                padding: '1px 6px',
                background: hasOverdue ? designSystem.helpers.hexToRgba(colors.error, 0.1) : designSystem.helpers.hexToRgba(colors.warning, 0.1),
                color: hasOverdue ? colors.error : colors.warning,
                borderRadius: radius.full,
                fontSize: '10px',
                fontWeight: typography.fontWeight.bold,
                lineHeight: '16px',
              }}
            >
              <Clock size={10} />
              {nextDate ? new Date(nextDate + 'T00:00:00').toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit' }) : ''}
            </div>
          );
        })()}
      </div>
    </div>
      );
    })()
  );

  const handleCreateLead = async () => {
    if (!newLead.name.trim() || !newLead.phone.trim()) {
      toast.error('Nome e telefone são obrigatórios');
      return;
    }
    setIsSaving(true);
    try {
      const response = await supabaseFetch('contact', {
        method: 'POST',
        body: JSON.stringify({
          name: newLead.name.trim(),
          email: newLead.email.trim() || `lead-${Date.now()}@manual.habta.eu`,
          phone: newLead.phone.trim(),
          interest: newLead.interest.trim() || 'Lead manual',
          message: newLead.message.trim() || 'Criado manualmente no admin',
          projectId: newLead.projectId,
          origin: newLead.origin,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data?.error || 'Erro ao criar lead');
      }
      toast.success('Lead criado com sucesso');
      setIsCreating(false);
      setNewLead({ name: '', email: '', phone: '', interest: '', message: '', projectId: '', origin: '' });
      onRefresh?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao criar lead');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
    {/* Header with create button */}
    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: spacing[4] }}>
      <button
        onClick={() => setIsCreating(true)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: spacing[2],
          padding: `${spacing[2]} ${spacing[4]}`,
          background: colors.primary,
          color: colors.white,
          border: 'none',
          borderRadius: radius.md,
          fontSize: typography.fontSize.sm,
          fontWeight: typography.fontWeight.semibold,
          cursor: 'pointer',
        }}
      >
        <Plus size={16} />
        Novo Lead
      </button>
    </div>

    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, minmax(260px, 1fr))', gap: spacing[4], overflowX: 'auto' }}>
      {STAGES.map((stage) => {
        const items = columns[stage.id];
        return (
          <div key={stage.id} style={{ display: 'flex', flexDirection: 'column', minWidth: 260 }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: spacing[2],
                marginBottom: spacing[2],
                borderBottom: `2px solid ${designSystem.helpers.hexToRgba(stage.color, 0.6)}`,
              }}
            >
              <span style={{ fontWeight: typography.fontWeight.bold, color: colors.gray[800], fontSize: typography.fontSize.sm }}>
                {stage.label}
              </span>
              <span
                style={{
                  padding: `${spacing[1]} ${spacing[2]}`,
                  background: designSystem.helpers.hexToRgba(stage.color, 0.12),
                  color: stage.color,
                  borderRadius: radius.full,
                  fontSize: typography.fontSize.xs,
                  fontWeight: typography.fontWeight.bold,
                  minWidth: 24,
                  textAlign: 'center',
                }}
                aria-label={`${items.length} leads`}
              >
                {items.length}
              </span>
            </div>

            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDropOn(stage.id)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: spacing[2],
                padding: spacing[2],
                background: colors.gray[50],
                borderRadius: radius.md,
                minHeight: 160,
                border: `1px dashed ${designSystem.helpers.hexToRgba(stage.color, 0.35)}`,
                transition: 'background 0.2s',
              }}
            >
              {items.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    color: colors.gray[400],
                    fontSize: typography.fontSize.xs,
                    padding: spacing[4],
                  }}
                >
                  Arraste leads para esta etapa
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                  {items.map((c) => (
                    <motion.div key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                      {card(c)}
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}

      {isSaving && (
        <div style={{ position: 'fixed', bottom: spacing[4], right: spacing[4], background: colors.gray[900], color: colors.white, padding: `${spacing[2]} ${spacing[3]}`, borderRadius: radius.md }}>
          Salvando alterações...
        </div>
      )}

      {/* Modal de edição de preferências */}
      {isEditing && editingContact && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: spacing[4],
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: colors.white,
              borderRadius: radius.xl,
              width: '100%',
              maxWidth: 560,
              padding: spacing[6],
              boxShadow: shadows['2xl'],
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] }}>
              <h3
                style={{
                  fontSize: typography.fontSize['xl'],
                  fontWeight: typography.fontWeight.bold,
                  color: colors.gray[900],
                }}
              >
                Editar Lead
              </h3>
              <button
                onClick={() => setIsEditing(false)}
                aria-label="Fechar"
                style={{
                  border: 'none',
                  background: colors.gray[100],
                  color: colors.gray[600],
                  width: 36,
                  height: 36,
                  borderRadius: radius.full,
                  cursor: 'pointer',
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3], maxHeight: '70vh', overflowY: 'auto', paddingRight: spacing[1] }}>
              {/* --- Dados do contacto --- */}
              <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.gray[500], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Dados do contacto
              </div>
              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                  Nome
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nome completo"
                  style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.base, outline: 'none' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[3] }}>
                <div>
                  <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="email@exemplo.com"
                    style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.base, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                    Telefone
                  </label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    placeholder="+351 000 000 000"
                    style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.base, outline: 'none' }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                  Interesse
                </label>
                <input
                  type="text"
                  value={form.interest}
                  onChange={(e) => setForm({ ...form, interest: e.target.value })}
                  placeholder="Ex: Velask Residence, Investimento..."
                  style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.base, outline: 'none' }}
                />
              </div>

              {/* Mensagem original do lead (somente leitura) */}
              {editingContact.message && (
                <div>
                  <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                    Mensagem original
                  </label>
                  <div
                    style={{
                      width: '100%',
                      padding: spacing[3],
                      border: `1px solid ${colors.gray[200]}`,
                      borderRadius: radius.md,
                      fontSize: typography.fontSize.sm,
                      color: colors.gray[600],
                      background: colors.gray[50],
                      maxHeight: '100px',
                      overflowY: 'auto',
                      lineHeight: typography.lineHeight.relaxed,
                    }}
                  >
                    {editingContact.message}
                  </div>
                </div>
              )}

              {/* --- Separador --- */}
              <div style={{ borderTop: `1px solid ${colors.gray[200]}`, marginTop: spacing[1], paddingTop: spacing[3] }}>
                <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.gray[500], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Preferências e classificação
                </div>
              </div>

              {/* Classificações do lead */}
              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[2] }}>
                  Classificação
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing[2] }}>
                  {['Comprador', 'Vendedor', 'Inquilino', 'Arrendatário', 'Consultor'].map((classification) => (
                    <label
                      key={classification}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: spacing[2],
                        padding: `${spacing[2]} ${spacing[3]}`,
                        border: `2px solid ${form.classifications.includes(classification) ? colors.primary : colors.gray[300]}`,
                        borderRadius: radius.md,
                        cursor: 'pointer',
                        background: form.classifications.includes(classification) ? designSystem.helpers.hexToRgba(colors.primary, 0.05) : colors.white,
                        transition: 'all 0.2s',
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: form.classifications.includes(classification) ? colors.primary : colors.gray[700],
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={form.classifications.includes(classification)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({ ...form, classifications: [...form.classifications, classification] });
                          } else {
                            setForm({ ...form, classifications: form.classifications.filter(c => c !== classification) });
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                      />
                      {classification}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                  Origem
                </label>
                <select
                  value={form.origin}
                  onChange={(e) => setForm({ ...form, origin: e.target.value })}
                  style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.base, outline: 'none', background: colors.white }}
                >
                  <option value="">— Selecionar —</option>
                  {ORIGINS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                  Localizações desejadas
                </label>
                <input
                  type="text"
                  value={form.desiredLocations}
                  onChange={(e) => setForm({ ...form, desiredLocations: e.target.value })}
                  placeholder="Ex: Lisboa, Cascais, Porto"
                  style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.base, outline: 'none' }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[3] }}>
                <div>
                  <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                    Valor máximo
                  </label>
                  <input
                    type="text"
                    value={form.maxBudget}
                    onChange={(e) => setForm({ ...form, maxBudget: e.target.value })}
                    placeholder="Ex: €500.000"
                    style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.base, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                    Tipologia
                  </label>
                  <input
                    type="text"
                    value={form.typology}
                    onChange={(e) => setForm({ ...form, typology: e.target.value })}
                    placeholder="Ex: T1, T2, T3"
                    style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.base, outline: 'none' }}
                  />
                </div>
              </div>

              {/* --- Separador --- */}
              <div style={{ borderTop: `1px solid ${colors.gray[200]}`, marginTop: spacing[1], paddingTop: spacing[3] }}>
                <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.gray[500], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Projeto e pipeline
                </div>
              </div>

              {/* Projecto de controlo */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[3] }}>
                <div>
                  <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                    Projeto (Controlo)
                  </label>
                  <select
                    value={form.projectId}
                    onChange={(e) => setForm({ ...form, projectId: e.target.value, unitId: '' })}
                    style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.base, outline: 'none', background: colors.white }}
                  >
                    <option value="">— Nenhum —</option>
                    {controloProjects.map((p) => (
                      <option key={p.id} value={p.id}>{p.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                    Unidade
                  </label>
                  <select
                    value={form.unitId}
                    onChange={(e) => setForm({ ...form, unitId: e.target.value })}
                    disabled={!form.projectId || controloUnits.length === 0}
                    style={{
                      width: '100%',
                      padding: spacing[3],
                      border: `1px solid ${colors.gray[300]}`,
                      borderRadius: radius.md,
                      fontSize: typography.fontSize.base,
                      outline: 'none',
                      background: !form.projectId ? colors.gray[100] : colors.white,
                      cursor: !form.projectId ? 'not-allowed' : 'pointer',
                    }}
                  >
                    <option value="">— Geral —</option>
                    {controloUnits.map((u) => (
                      <option key={u.id} value={u.id}>{u.code}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Valor da proposta — visível quando estágio >= proposta */}
              {editingContact && ['proposta', 'negociacao', 'ganho'].includes(
                localStages[editingContact.id] || editingContact.pipelineStage || 'novo'
              ) && (
                <div>
                  <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                    Valor da proposta (€)
                  </label>
                  <input
                    type="number"
                    value={form.proposalValue}
                    onChange={(e) => setForm({ ...form, proposalValue: e.target.value })}
                    placeholder="Ex: 350000"
                    style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.base, outline: 'none' }}
                  />
                </div>
              )}

              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                  Observações
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Observações importantes sobre o perfil do lead"
                  rows={3}
                  style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.base, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>

              {/* --- Registo de atividades --- */}
              <div style={{ borderTop: `1px solid ${colors.gray[200]}`, marginTop: spacing[1], paddingTop: spacing[3] }}>
                <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.gray[500], textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: spacing[3] }}>
                  Registo de atividades
                </div>
              </div>

              {/* Formulário nova atividade */}
              <div style={{ background: colors.gray[50], border: `1px solid ${colors.gray[200]}`, borderRadius: radius.md, padding: spacing[3], display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[2] }}>
                  <div>
                    <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.gray[600], marginBottom: '2px' }}>Data</label>
                    <input
                      type="date"
                      value={newActivity.date}
                      onChange={(e) => setNewActivity({ ...newActivity, date: e.target.value })}
                      style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.gray[600], marginBottom: '2px' }}>Canal</label>
                    <select
                      value={newActivity.channel}
                      onChange={(e) => setNewActivity({ ...newActivity, channel: e.target.value })}
                      style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, outline: 'none', background: colors.white }}
                    >
                      <option value="">— Selecionar —</option>
                      {CHANNELS.map((ch) => (
                        <option key={ch} value={ch}>{ch}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.gray[600], marginBottom: '2px' }}>Tipo</label>
                  <input
                    type="text"
                    value={newActivity.type}
                    onChange={(e) => setNewActivity({ ...newActivity, type: e.target.value })}
                    placeholder="Ex: Follow-up, Qualificação, Visita..."
                    style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.gray[600], marginBottom: '2px' }}>Resumo</label>
                  <textarea
                    value={newActivity.content}
                    onChange={(e) => setNewActivity({ ...newActivity, content: e.target.value })}
                    placeholder="Descreva a interação..."
                    rows={2}
                    style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
                  />
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleAddActivity}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: spacing[1],
                      padding: `${spacing[1]} ${spacing[3]}`,
                      border: 'none', background: colors.primary, color: colors.white,
                      borderRadius: radius.md, cursor: 'pointer', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold,
                    }}
                  >
                    <Plus size={14} />
                    Adicionar
                  </button>
                </div>
              </div>

              {/* Lista de atividades */}
              {loadingActivities ? (
                <div style={{ textAlign: 'center', color: colors.gray[400], fontSize: typography.fontSize.sm, padding: spacing[3] }}>A carregar...</div>
              ) : activities.length === 0 ? (
                <div style={{ textAlign: 'center', color: colors.gray[400], fontSize: typography.fontSize.sm, padding: spacing[3] }}>Nenhuma atividade registada</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                  {activities.map((act) => (
                    <div
                      key={act.id}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: spacing[2],
                        padding: spacing[2], border: `1px solid ${colors.gray[200]}`, borderRadius: radius.md, background: colors.white,
                      }}
                    >
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: '2px', flexWrap: 'wrap' }}>
                          <span style={{ fontSize: typography.fontSize.xs, color: colors.gray[500] }}>{act.date}</span>
                          <span style={{
                            padding: `1px ${spacing[2]}`, background: designSystem.helpers.hexToRgba(colors.primary, 0.1),
                            color: colors.primary, borderRadius: radius.full, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold,
                          }}>
                            {act.channel}
                          </span>
                          {act.type && (
                            <span style={{
                              padding: `1px ${spacing[2]}`, background: designSystem.helpers.hexToRgba(colors.secondary, 0.1),
                              color: colors.secondary, borderRadius: radius.full, fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold,
                            }}>
                              {act.type}
                            </span>
                          )}
                        </div>
                        <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[700], lineHeight: typography.lineHeight.relaxed, whiteSpace: 'pre-wrap' }}>{act.content}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleDeleteActivity(act.id)}
                        aria-label="Eliminar atividade"
                        style={{ flexShrink: 0, border: 'none', background: 'none', color: colors.gray[400], cursor: 'pointer', padding: '2px' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* --- Follow-ups --- */}
              <div style={{ borderTop: `1px solid ${colors.gray[200]}`, marginTop: spacing[1], paddingTop: spacing[3] }}>
                <div style={{ fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold, color: colors.gray[500], textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: spacing[3] }}>
                  Follow-ups
                </div>
              </div>

              {/* Formulário novo follow-up */}
              <div style={{ background: colors.gray[50], border: `1px solid ${colors.gray[200]}`, borderRadius: radius.md, padding: spacing[3], display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                <div>
                  <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.gray[600], marginBottom: '2px' }}>Título</label>
                  <input
                    type="text"
                    value={newFollowup.title}
                    onChange={(e) => setNewFollowup({ ...newFollowup, title: e.target.value })}
                    placeholder="Ex: Ligar para confirmar interesse"
                    style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[2] }}>
                  <div>
                    <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.gray[600], marginBottom: '2px' }}>Tipo</label>
                    <select
                      value={newFollowup.type}
                      onChange={(e) => setNewFollowup({ ...newFollowup, type: e.target.value as FollowupType })}
                      style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, outline: 'none', background: colors.white }}
                    >
                      {FOLLOWUP_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>{t.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.gray[600], marginBottom: '2px' }}>Prioridade</label>
                    <select
                      value={newFollowup.priority}
                      onChange={(e) => setNewFollowup({ ...newFollowup, priority: e.target.value as FollowupPriority })}
                      style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, outline: 'none', background: colors.white }}
                    >
                      {FOLLOWUP_PRIORITIES.map((p) => (
                        <option key={p.value} value={p.value}>{p.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[2] }}>
                  <div>
                    <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.gray[600], marginBottom: '2px' }}>Data</label>
                    <input
                      type="date"
                      value={newFollowup.dueDate}
                      onChange={(e) => setNewFollowup({ ...newFollowup, dueDate: e.target.value })}
                      style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.medium, color: colors.gray[600], marginBottom: '2px' }}>Hora (opcional)</label>
                    <input
                      type="time"
                      value={newFollowup.dueTime}
                      onChange={(e) => setNewFollowup({ ...newFollowup, dueTime: e.target.value })}
                      style={{ width: '100%', padding: spacing[2], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.sm, outline: 'none' }}
                    />
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="button"
                    onClick={handleAddFollowup}
                    style={{
                      display: 'inline-flex', alignItems: 'center', gap: spacing[1],
                      padding: `${spacing[1]} ${spacing[3]}`,
                      border: 'none', background: colors.primary, color: colors.white,
                      borderRadius: radius.md, cursor: 'pointer', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold,
                    }}
                  >
                    <Plus size={14} />
                    Criar follow-up
                  </button>
                </div>
              </div>

              {/* Lista de follow-ups */}
              {loadingFollowups ? (
                <div style={{ textAlign: 'center', color: colors.gray[400], fontSize: typography.fontSize.sm, padding: spacing[3] }}>A carregar...</div>
              ) : followups.length === 0 ? (
                <div style={{ textAlign: 'center', color: colors.gray[400], fontSize: typography.fontSize.sm, padding: spacing[3] }}>Nenhum follow-up registado</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                  {followups.map((fu) => {
                    const today = new Date().toISOString().slice(0, 10);
                    const isOverdue = fu.status === 'pending' && fu.dueDate < today;
                    const isPending = fu.status === 'pending';
                    const priorityInfo = FOLLOWUP_PRIORITIES.find((p) => p.value === fu.priority);
                    const typeInfo = FOLLOWUP_TYPES.find((t) => t.value === fu.type);
                    return (
                      <div
                        key={fu.id}
                        style={{
                          display: 'flex', flexDirection: 'column', gap: spacing[1],
                          padding: spacing[2], border: `1px solid ${isOverdue ? colors.error : colors.gray[200]}`, borderRadius: radius.md,
                          background: isOverdue ? designSystem.helpers.hexToRgba(colors.error, 0.03) : colors.white,
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[1] }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1], flex: 1, minWidth: 0 }}>
                            {fu.status === 'completed' ? (
                              <CheckCircle size={14} style={{ color: colors.success, flexShrink: 0 }} />
                            ) : isOverdue ? (
                              <AlertCircle size={14} style={{ color: colors.error, flexShrink: 0 }} />
                            ) : (
                              <Clock size={14} style={{ color: colors.warning, flexShrink: 0 }} />
                            )}
                            <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: fu.status === 'completed' ? colors.gray[400] : colors.gray[800], textDecoration: fu.status === 'completed' ? 'line-through' : 'none', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {fu.title}
                            </span>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', flexShrink: 0 }}>
                            {isPending && completingFollowupId !== fu.id && (
                              <button
                                type="button"
                                onClick={() => { setCompletingFollowupId(fu.id); setSelectedOutcome(''); }}
                                style={{ border: 'none', background: designSystem.helpers.hexToRgba(colors.success, 0.1), color: colors.success, borderRadius: radius.md, padding: '2px 6px', cursor: 'pointer', fontSize: '10px', fontWeight: typography.fontWeight.bold }}
                              >
                                Concluir
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => handleDeleteFollowup(fu.id)}
                              aria-label="Eliminar follow-up"
                              style={{ flexShrink: 0, border: 'none', background: 'none', color: colors.gray[400], cursor: 'pointer', padding: '2px' }}
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1], flexWrap: 'wrap' }}>
                          <span style={{ padding: '1px 6px', background: designSystem.helpers.hexToRgba(colors.primary, 0.08), color: colors.primary, borderRadius: radius.full, fontSize: '10px', fontWeight: typography.fontWeight.semibold }}>
                            {typeInfo?.label || fu.type}
                          </span>
                          <span style={{ padding: '1px 6px', background: designSystem.helpers.hexToRgba(priorityInfo?.color || '#6B7280', 0.1), color: priorityInfo?.color || '#6B7280', borderRadius: radius.full, fontSize: '10px', fontWeight: typography.fontWeight.bold }}>
                            {priorityInfo?.label || fu.priority}
                          </span>
                          <span style={{ fontSize: '10px', color: isOverdue ? colors.error : colors.gray[500], fontWeight: isOverdue ? typography.fontWeight.bold : typography.fontWeight.medium }}>
                            {fu.dueDate}{fu.dueTime ? ` ${fu.dueTime}` : ''}
                          </span>
                          {fu.outcome && (
                            <span style={{ padding: '1px 6px', background: colors.gray[100], color: colors.gray[600], borderRadius: radius.full, fontSize: '10px' }}>
                              {FOLLOWUP_OUTCOMES.find((o) => o.value === fu.outcome)?.label || fu.outcome}
                            </span>
                          )}
                        </div>
                        {/* Completion panel */}
                        {completingFollowupId === fu.id && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1], marginTop: spacing[1], padding: spacing[2], background: colors.gray[50], borderRadius: radius.md }}>
                            <select
                              value={selectedOutcome}
                              onChange={(e) => setSelectedOutcome(e.target.value as FollowupOutcome)}
                              style={{ flex: 1, padding: spacing[1], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.xs, outline: 'none', background: colors.white }}
                            >
                              <option value="">— Resultado —</option>
                              {FOLLOWUP_OUTCOMES.map((o) => (
                                <option key={o.value} value={o.value}>{o.label}</option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => handleCompleteFollowup(fu.id)}
                              style={{ border: 'none', background: colors.success, color: colors.white, borderRadius: radius.md, padding: `${spacing[1]} ${spacing[2]}`, cursor: 'pointer', fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.bold }}
                            >
                              OK
                            </button>
                            <button
                              type="button"
                              onClick={() => { setCompletingFollowupId(null); setSelectedOutcome(''); }}
                              style={{ border: 'none', background: 'none', color: colors.gray[400], cursor: 'pointer', padding: '2px' }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing[2], marginTop: spacing[2] }}>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: `${spacing[2]} ${spacing[4]}`,
                    border: `1px solid ${colors.gray[300]}`,
                    background: colors.white,
                    color: colors.gray[700],
                    borderRadius: radius.md,
                    cursor: 'pointer',
                  }}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (!editingContact) return;
                    setIsSaving(true);
                    try {
                      const payload = {
                        name: form.name.trim(),
                        email: form.email.trim(),
                        phone: form.phone.trim(),
                        interest: form.interest.trim(),
                        desiredLocations: form.desiredLocations
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                        maxBudget: form.maxBudget.trim(),
                        typology: form.typology.trim(),
                        notes: form.notes.trim(),
                        classifications: form.classifications,
                        origin: form.origin,
                        projectId: form.projectId,
                        unitId: form.unitId,
                        proposalValue: form.proposalValue ? Number(form.proposalValue) : 0,
                      };
                      const response = await supabaseFetch(`contacts/${encodeURIComponent(normalizeContactId(editingContact.id))}`, {
                        method: 'PUT',
                        body: JSON.stringify(payload),
                      });
                      let data: any = null;
                      try {
                        data = await response.json();
                      } catch {}
                      if (!response.ok) {
                        throw new Error(data?.error || `Falha ao salvar (HTTP ${response.status})`);
                      }
                      toast.success('Lead atualizado');
                      try {
                        const next = { ...localPrefs, [editingContact.id]: payload };
                        setLocalPrefs(next);
                        localStorage.setItem('habta_lead_prefs', JSON.stringify(next));
                      } catch {}
                      setIsEditing(false);
                      onRefresh?.();
                    } catch (err) {
                      try {
                        const payloadLocal = {
                          name: form.name.trim(),
                          email: form.email.trim(),
                          phone: form.phone.trim(),
                          interest: form.interest.trim(),
                          desiredLocations: form.desiredLocations
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                          maxBudget: form.maxBudget.trim(),
                          typology: form.typology.trim(),
                          notes: form.notes.trim(),
                          classifications: form.classifications,
                          projectId: form.projectId,
                          unitId: form.unitId,
                          proposalValue: form.proposalValue ? Number(form.proposalValue) : 0,
                        };
                        const next = { ...localPrefs, [editingContact!.id]: payloadLocal };
                        setLocalPrefs(next);
                        localStorage.setItem('habta_lead_prefs', JSON.stringify(next));
                        toast.warning('Salvo localmente. Sincronização pendente.');
                        setIsEditing(false);
                      } catch {
                        toast.error(err instanceof Error ? err.message : 'Erro ao salvar');
                      }
                    } finally {
                      setIsSaving(false);
                    }
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: spacing[1],
                    padding: `${spacing[2]} ${spacing[4]}`,
                    border: 'none',
                    background: colors.primary,
                    color: colors.white,
                    borderRadius: radius.md,
                    cursor: 'pointer',
                    fontWeight: typography.fontWeight.semibold,
                  }}
                >
                  <Save size={16} />
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    {/* Modal de criação de lead */}
    {isCreating && (
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: spacing[4],
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            background: colors.white,
            borderRadius: radius.xl,
            width: '100%',
            maxWidth: 520,
            padding: spacing[6],
            boxShadow: shadows['2xl'],
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] }}>
            <h3 style={{ fontSize: typography.fontSize['xl'], fontWeight: typography.fontWeight.bold, color: colors.gray[900] }}>
              Novo Lead
            </h3>
            <button
              onClick={() => setIsCreating(false)}
              aria-label="Fechar"
              style={{ border: 'none', background: colors.gray[100], color: colors.gray[600], width: 36, height: 36, borderRadius: radius.full, cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
            <div>
              <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                Nome <span style={{ color: colors.error }}>*</span>
              </label>
              <input
                type="text"
                value={newLead.name}
                onChange={(e) => setNewLead({ ...newLead, name: e.target.value })}
                placeholder="Nome completo"
                style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.base, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[3] }}>
              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                  Email
                </label>
                <input
                  type="email"
                  value={newLead.email}
                  onChange={(e) => setNewLead({ ...newLead, email: e.target.value })}
                  placeholder="email@exemplo.com"
                  style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.base, outline: 'none' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                  Telefone <span style={{ color: colors.error }}>*</span>
                </label>
                <input
                  type="tel"
                  value={newLead.phone}
                  onChange={(e) => setNewLead({ ...newLead, phone: e.target.value })}
                  placeholder="+351 000 000 000"
                  style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.base, outline: 'none' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                Interesse
              </label>
              <input
                type="text"
                value={newLead.interest}
                onChange={(e) => setNewLead({ ...newLead, interest: e.target.value })}
                placeholder="Ex: Velask Residence, Investimento, Compra..."
                style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.base, outline: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[3] }}>
              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                  Origem
                </label>
                <select
                  value={newLead.origin}
                  onChange={(e) => setNewLead({ ...newLead, origin: e.target.value })}
                  style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.base, outline: 'none', background: colors.white }}
                >
                  <option value="">— Selecionar —</option>
                  {ORIGINS.map((o) => (
                    <option key={o} value={o}>{o}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                  Projeto (Controlo)
                </label>
                <select
                  value={newLead.projectId}
                  onChange={(e) => setNewLead({ ...newLead, projectId: e.target.value })}
                  style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.base, outline: 'none', background: colors.white }}
                >
                  <option value="">— Nenhum —</option>
                  {controloProjects.map((p) => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.gray[700], marginBottom: spacing[1] }}>
                Observações
              </label>
              <textarea
                value={newLead.message}
                onChange={(e) => setNewLead({ ...newLead, message: e.target.value })}
                placeholder="Notas sobre o lead"
                rows={3}
                style={{ width: '100%', padding: spacing[3], border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md, fontSize: typography.fontSize.base, outline: 'none', resize: 'vertical', fontFamily: 'inherit' }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: spacing[2], marginTop: spacing[2] }}>
              <button
                type="button"
                onClick={() => setIsCreating(false)}
                style={{ padding: `${spacing[2]} ${spacing[4]}`, border: `1px solid ${colors.gray[300]}`, background: colors.white, color: colors.gray[700], borderRadius: radius.md, cursor: 'pointer' }}
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleCreateLead}
                disabled={isSaving}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: spacing[1],
                  padding: `${spacing[2]} ${spacing[4]}`,
                  border: 'none',
                  background: colors.primary,
                  color: colors.white,
                  borderRadius: radius.md,
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontWeight: typography.fontWeight.semibold,
                  opacity: isSaving ? 0.6 : 1,
                }}
              >
                <Plus size={16} />
                {isSaving ? 'A criar...' : 'Criar Lead'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )}
    </div>
  );
}
