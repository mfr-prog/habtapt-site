'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import { Mail, Phone, Calendar, MessageSquare, Edit, Save, X } from '../icons';
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
  // Preferências
  desiredLocations?: string[];
  maxBudget?: string;
  typology?: string;
  notes?: string;
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
    desiredLocations: string;
    maxBudget: string;
    typology: string;
    notes: string;
  }>({
    desiredLocations: '',
    maxBudget: '',
    typology: '',
    notes: '',
  });
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
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2], marginBottom: spacing[2], justifyContent: 'space-between' }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: radius.full,
            background: designSystem.helpers.hexToRgba(colors.primary, 0.1),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <Mail size={16} style={{ color: colors.primary }} />
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: spacing[2] }}>
            <div
              style={{
                fontWeight: typography.fontWeight.semibold,
                color: colors.gray[900],
                fontSize: typography.fontSize.sm,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {c.name}
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setEditingContact(c);
                setForm({
                  desiredLocations: (c.desiredLocations || []).join(', '),
                  maxBudget: c.maxBudget || '',
                  typology: c.typology || '',
                  notes: c.notes || '',
                });
                setIsEditing(true);
              }}
              aria-label="Editar preferências do lead"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: `1px solid ${colors.gray[300]}`,
                background: colors.white,
                borderRadius: radius.md,
                padding: `${spacing[1]} ${spacing[2]}`,
                cursor: 'pointer',
              }}
            >
              <Edit size={14} style={{ color: colors.gray[700] }} />
            </button>
          </div>
          <div style={{ color: colors.gray[500], fontSize: typography.fontSize.xs, overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {c.email}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: spacing[2], flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1], color: colors.gray[600], fontSize: typography.fontSize.xs }}>
          <Phone size={14} aria-hidden="true" />
          {c.phone}
        </div>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: spacing[1],
            padding: `${spacing[1]} ${spacing[2]}`,
            background: designSystem.helpers.hexToRgba(colors.secondary, 0.1),
            color: colors.secondary,
            borderRadius: radius.full,
            fontSize: typography.fontSize.xs,
            fontWeight: typography.fontWeight.semibold,
          }}
        >
          <MessageSquare size={12} aria-hidden="true" />
          {c.interest}
        </div>
      </div>

      {/* Chips de preferências */}
      {(c.desiredLocations?.length || c.maxBudget || c.typology) && (
        <div style={{ marginTop: spacing[2], display: 'flex', gap: spacing[1], flexWrap: 'wrap' }}>
          {c.typology && (
            <span
              style={{
                padding: `${spacing[1]} ${spacing[2]}`,
                background: designSystem.helpers.hexToRgba(colors.primary, 0.08),
                color: colors.primary,
                borderRadius: radius.full,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              Tipologia: {c.typology}
            </span>
          )}
          {c.maxBudget && (
            <span
              style={{
                padding: `${spacing[1]} ${spacing[2]}`,
                background: designSystem.helpers.hexToRgba(colors.success, 0.08),
                color: colors.success,
                borderRadius: radius.full,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.semibold,
              }}
            >
              Máx: {c.maxBudget}
            </span>
          )}
          {(c.desiredLocations || []).slice(0, 2).map((loc, i) => (
            <span
              key={`${c.id}-loc-${i}`}
              style={{
                padding: `${spacing[1]} ${spacing[2]}`,
                background: colors.gray[100],
                color: colors.gray[700],
                borderRadius: radius.full,
                fontSize: typography.fontSize.xs,
                fontWeight: typography.fontWeight.medium,
              }}
            >
              {loc}
            </span>
          ))}
          {c.desiredLocations && c.desiredLocations.length > 2 && (
            <span style={{ color: colors.gray[500], fontSize: typography.fontSize.xs }}>
              +{c.desiredLocations.length - 2}
            </span>
          )}
        </div>
      )}

      <div style={{ marginTop: spacing[2], display: 'flex', alignItems: 'center', gap: spacing[1], color: colors.gray[500], fontSize: typography.fontSize.xs }}>
        <Calendar size={12} aria-hidden="true" />
        {new Date(c.createdAt).toLocaleDateString('pt-PT')}
      </div>
    </div>
      );
    })()
  );

  return (
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
          onClick={() => setIsEditing(false)}
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
                Preferências do Lead
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.gray[700],
                    marginBottom: spacing[1],
                  }}
                >
                  Localizações desejadas
                </label>
                <input
                  type="text"
                  value={form.desiredLocations}
                  onChange={(e) => setForm({ ...form, desiredLocations: e.target.value })}
                  placeholder="Ex: Lisboa, Cascais, Porto"
                  style={{
                    width: '100%',
                    padding: spacing[3],
                    border: `1px solid ${colors.gray[300]}`,
                    borderRadius: radius.md,
                    fontSize: typography.fontSize.base,
                    outline: 'none',
                  }}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[3] }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.gray[700],
                      marginBottom: spacing[1],
                    }}
                  >
                    Valor máximo
                  </label>
                  <input
                    type="text"
                    value={form.maxBudget}
                    onChange={(e) => setForm({ ...form, maxBudget: e.target.value })}
                    placeholder="Ex: €500.000"
                    style={{
                      width: '100%',
                      padding: spacing[3],
                      border: `1px solid ${colors.gray[300]}`,
                      borderRadius: radius.md,
                      fontSize: typography.fontSize.base,
                      outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.gray[700],
                      marginBottom: spacing[1],
                    }}
                  >
                    Tipologia
                  </label>
                  <input
                    type="text"
                    value={form.typology}
                    onChange={(e) => setForm({ ...form, typology: e.target.value })}
                    placeholder="Ex: T1, T2, T3"
                    style={{
                      width: '100%',
                      padding: spacing[3],
                      border: `1px solid ${colors.gray[300]}`,
                      borderRadius: radius.md,
                      fontSize: typography.fontSize.base,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: typography.fontSize.sm,
                    fontWeight: typography.fontWeight.medium,
                    color: colors.gray[700],
                    marginBottom: spacing[1],
                  }}
                >
                  Observações
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  placeholder="Observações importantes sobre o perfil do lead"
                  rows={4}
                  style={{
                    width: '100%',
                    padding: spacing[3],
                    border: `1px solid ${colors.gray[300]}`,
                    borderRadius: radius.md,
                    fontSize: typography.fontSize.base,
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

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
                        desiredLocations: form.desiredLocations
                          .split(',')
                          .map((s) => s.trim())
                          .filter(Boolean),
                        maxBudget: form.maxBudget.trim(),
                        typology: form.typology.trim(),
                        notes: form.notes.trim(),
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
                        throw new Error(data?.error || `Falha ao salvar preferências (HTTP ${response.status})`);
                      }
                      toast.success('Preferências salvas');
                      // persistir localmente também
                      try {
                        const next = { ...localPrefs, [editingContact.id]: payload };
                        setLocalPrefs(next);
                        localStorage.setItem('habta_lead_prefs', JSON.stringify(next));
                      } catch {}
                      setIsEditing(false);
                      onRefresh?.();
                    } catch (err) {
                      // Salvar localmente mesmo em erro para não perder dados
                      try {
                        const payloadLocal = {
                          desiredLocations: form.desiredLocations
                            .split(',')
                            .map((s) => s.trim())
                            .filter(Boolean),
                          maxBudget: form.maxBudget.trim(),
                          typology: form.typology.trim(),
                          notes: form.notes.trim(),
                        };
                        const next = { ...localPrefs, [editingContact!.id]: payloadLocal };
                        setLocalPrefs(next);
                        localStorage.setItem('habta_lead_prefs', JSON.stringify(next));
                        toast.warning('Preferências salvas localmente. Sincronização pendente.');
                        setIsEditing(false);
                      } catch {
                        toast.error(err instanceof Error ? err.message : 'Erro ao salvar preferências');
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
  );
}


