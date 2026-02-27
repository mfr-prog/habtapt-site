'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit, Trash2, Save, X } from '../../icons';
import { toast } from 'sonner';
import { supabaseFetch } from '../../../utils/supabase/client';
import { colors, spacing, radius, typography, shadows } from '../../../utils/styles';
import { designSystem } from '../../design-system';
import { AnimatedButton } from '../../primitives/AnimatedButton';
import type { ControloUnit, ControloTargets, ControloReviewDate } from '../ControloManager';

interface SetupViewProps {
  projectId: string;
  units: ControloUnit[];
  targets: ControloTargets | null;
  reviews: ControloReviewDate[];
  onRefresh: () => void;
}

// === MODAL WRAPPER ===
function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing[4],
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: colors.white,
          borderRadius: radius.xl,
          width: '100%',
          maxWidth: '600px',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: shadows.xl,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// === SECTION HEADER ===
function SectionHeader({ title, onAdd }: { title: string; onAdd?: () => void }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: spacing[3],
    }}>
      <h3 style={{
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.gray[900],
      }}>
        {title}
      </h3>
      {onAdd && (
        <AnimatedButton variant="primary" size="sm" icon={Plus} onClick={onAdd}>
          Adicionar
        </AnimatedButton>
      )}
    </div>
  );
}

// === INPUT HELPER ===
function FieldInput({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (val: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: spacing[3] }}>
      <label style={{
        display: 'block',
        marginBottom: spacing[1],
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        color: colors.gray[700],
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: `${spacing[2]} ${spacing[3]}`,
          border: `1px solid ${colors.gray[300]}`,
          borderRadius: radius.md,
          fontSize: typography.fontSize.sm,
          color: colors.gray[900],
          outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

// === TABLE STYLE HELPERS ===
const thStyle: React.CSSProperties = {
  padding: `${spacing[2]} ${spacing[3]}`,
  textAlign: 'left',
  fontSize: typography.fontSize.xs,
  fontWeight: typography.fontWeight.semibold,
  color: colors.gray[500],
  textTransform: 'uppercase',
  letterSpacing: typography.letterSpacing.wide,
  borderBottom: `1px solid ${colors.gray[200]}`,
  whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: `${spacing[2]} ${spacing[3]}`,
  fontSize: typography.fontSize.sm,
  color: colors.gray[800],
  borderBottom: `1px solid ${colors.gray[100]}`,
};

const iconBtnStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: spacing[1],
  borderRadius: radius.sm,
  display: 'inline-flex',
  alignItems: 'center',
  transition: 'background 0.15s',
};

// ============================
// MAIN COMPONENT
// ============================
export function SetupView({ projectId, units, targets, reviews, onRefresh }: SetupViewProps) {
  // Unit modal state
  const [unitModal, setUnitModal] = useState(false);
  const [editingUnit, setEditingUnit] = useState<ControloUnit | null>(null);
  const [unitForm, setUnitForm] = useState<Partial<ControloUnit>>({});
  const [isSaving, setIsSaving] = useState(false);

  // Review modal state
  const [reviewModal, setReviewModal] = useState(false);
  const [editingReview, setEditingReview] = useState<ControloReviewDate | null>(null);
  const [reviewForm, setReviewForm] = useState<Partial<ControloReviewDate>>({});

  // Targets state
  const [targetsForm, setTargetsForm] = useState({
    qualifiedLeads14d: targets?.qualifiedLeads14d || 0,
    visits14d: targets?.visits14d || 0,
    proposals30d: targets?.proposals30d || 0,
  });
  const [targetsSaving, setTargetsSaving] = useState(false);

  // Sync targets form when props change
  React.useEffect(() => {
    if (targets) {
      setTargetsForm({
        qualifiedLeads14d: targets.qualifiedLeads14d || 0,
        visits14d: targets.visits14d || 0,
        proposals30d: targets.proposals30d || 0,
      });
    }
  }, [targets]);

  // === UNIT HANDLERS ===
  const openUnitModal = (unit?: ControloUnit) => {
    if (unit) {
      setEditingUnit(unit);
      setUnitForm(unit);
    } else {
      setEditingUnit(null);
      setUnitForm({
        projectId,
        code: '',
        floor: '',
        typology: '',
        areaGross: 0,
        areaInterior: 0,
        areaExterior: 0,
        areaExtras: 0,
        salesNotes: '',
        askPrice: 0,
        minimumPrice: 0,
        adjustmentStep: 0,
        pricingNotes: '',
      });
    }
    setUnitModal(true);
  };

  const saveUnit = async () => {
    if (!unitForm.code) {
      toast.error('Código da unidade é obrigatório');
      return;
    }
    setIsSaving(true);
    try {
      const payload = { ...unitForm, projectId };
      if (editingUnit) {
        await supabaseFetch(`controlo/units/${editingUnit.id}?projectId=${projectId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        }, 1, true);
        toast.success('Unidade atualizada');
      } else {
        await supabaseFetch('controlo/units', {
          method: 'POST',
          body: JSON.stringify(payload),
        }, 1, true);
        toast.success('Unidade criada');
      }
      setUnitModal(false);
      onRefresh();
    } catch {
      toast.error('Erro ao guardar unidade');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteUnit = async (unit: ControloUnit) => {
    if (!confirm(`Eliminar unidade ${unit.code}?`)) return;
    try {
      await supabaseFetch(`controlo/units/${unit.id}?projectId=${projectId}`, { method: 'DELETE' }, 1, true);
      toast.success('Unidade eliminada');
      onRefresh();
    } catch {
      toast.error('Erro ao eliminar unidade');
    }
  };

  // === TARGETS HANDLER ===
  const saveTargets = async () => {
    setTargetsSaving(true);
    try {
      await supabaseFetch(`controlo/targets?projectId=${projectId}`, {
        method: 'PUT',
        body: JSON.stringify(targetsForm),
      }, 1, true);
      toast.success('Metas atualizadas');
      onRefresh();
    } catch {
      toast.error('Erro ao guardar metas');
    } finally {
      setTargetsSaving(false);
    }
  };

  // === REVIEW HANDLERS ===
  const openReviewModal = (review?: ControloReviewDate) => {
    if (review) {
      setEditingReview(review);
      setReviewForm(review);
    } else {
      setEditingReview(null);
      setReviewForm({
        projectId,
        date: '',
        type: 'weekly',
        label: '',
        notes: '',
      });
    }
    setReviewModal(true);
  };

  const saveReview = async () => {
    if (!reviewForm.date || !reviewForm.label) {
      toast.error('Data e label são obrigatórios');
      return;
    }
    setIsSaving(true);
    try {
      const payload = { ...reviewForm, projectId };
      if (editingReview) {
        await supabaseFetch(`controlo/reviews/${editingReview.id}?projectId=${projectId}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        }, 1, true);
        toast.success('Data de revisão atualizada');
      } else {
        await supabaseFetch('controlo/reviews', {
          method: 'POST',
          body: JSON.stringify(payload),
        }, 1, true);
        toast.success('Data de revisão criada');
      }
      setReviewModal(false);
      onRefresh();
    } catch {
      toast.error('Erro ao guardar data de revisão');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteReview = async (review: ControloReviewDate) => {
    if (!confirm(`Eliminar data "${review.label}"?`)) return;
    try {
      await supabaseFetch(`controlo/reviews/${review.id}?projectId=${projectId}`, { method: 'DELETE' }, 1, true);
      toast.success('Data de revisão eliminada');
      onRefresh();
    } catch {
      toast.error('Erro ao eliminar data de revisão');
    }
  };

  const reviewTypeLabels: Record<string, string> = {
    weekly: 'Semanal',
    decision: 'Decisão',
    milestone: 'Marco',
  };

  const reviewTypeColors: Record<string, string> = {
    weekly: colors.info,
    decision: colors.warning,
    milestone: colors.success,
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[8] }}>
      {/* ===== UNITS TABLE ===== */}
      <section>
        <SectionHeader title="Unidades" onAdd={() => openUnitModal()} />
        {units.length === 0 ? (
          <p style={{ color: colors.gray[500], fontSize: typography.fontSize.sm }}>
            Nenhuma unidade registada. Clique em &quot;Adicionar&quot; para começar.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Código</th>
                  <th style={thStyle}>Piso</th>
                  <th style={thStyle}>Tipologia</th>
                  <th style={thStyle}>Área Bruta</th>
                  <th style={thStyle}>Preço ASK</th>
                  <th style={thStyle}>Preço Mín.</th>
                  <th style={thStyle}>Degrau %</th>
                  <th style={thStyle}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {units.map((u) => (
                  <tr key={u.id}>
                    <td style={{ ...tdStyle, fontWeight: typography.fontWeight.bold }}>{u.code}</td>
                    <td style={tdStyle}>{u.floor}</td>
                    <td style={tdStyle}>{u.typology}</td>
                    <td style={tdStyle}>{u.areaGross} m²</td>
                    <td style={tdStyle}>{formatCurrency(u.askPrice)}</td>
                    <td style={tdStyle}>{formatCurrency(u.minimumPrice)}</td>
                    <td style={tdStyle}>{u.adjustmentStep}%</td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: spacing[1] }}>
                        <button
                          onClick={() => openUnitModal(u)}
                          style={iconBtnStyle}
                          aria-label="Editar unidade"
                        >
                          <Edit size={16} style={{ color: colors.primary }} />
                        </button>
                        <button
                          onClick={() => deleteUnit(u)}
                          style={iconBtnStyle}
                          aria-label="Eliminar unidade"
                        >
                          <Trash2 size={16} style={{ color: colors.error }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ===== TARGETS ===== */}
      <section>
        <SectionHeader title="Metas Mínimas (14 dias / 30 dias)" />
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: spacing[4],
          padding: spacing[4],
          background: colors.gray[50],
          borderRadius: radius.lg,
          border: `1px solid ${colors.gray[200]}`,
        }}>
          <div>
            <label style={{ display: 'block', marginBottom: spacing[1], fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: colors.gray[600] }}>
              Leads Qualificados (14d)
            </label>
            <input
              type="number"
              min={0}
              value={targetsForm.qualifiedLeads14d}
              onChange={(e) => setTargetsForm({ ...targetsForm, qualifiedLeads14d: Number(e.target.value) })}
              style={{
                width: '100%',
                padding: `${spacing[2]} ${spacing[3]}`,
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: radius.md,
                fontSize: typography.fontSize.sm,
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: spacing[1], fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: colors.gray[600] }}>
              Visitas (14d)
            </label>
            <input
              type="number"
              min={0}
              value={targetsForm.visits14d}
              onChange={(e) => setTargetsForm({ ...targetsForm, visits14d: Number(e.target.value) })}
              style={{
                width: '100%',
                padding: `${spacing[2]} ${spacing[3]}`,
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: radius.md,
                fontSize: typography.fontSize.sm,
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: spacing[1], fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: colors.gray[600] }}>
              Propostas (30d)
            </label>
            <input
              type="number"
              min={0}
              value={targetsForm.proposals30d}
              onChange={(e) => setTargetsForm({ ...targetsForm, proposals30d: Number(e.target.value) })}
              style={{
                width: '100%',
                padding: `${spacing[2]} ${spacing[3]}`,
                border: `1px solid ${colors.gray[300]}`,
                borderRadius: radius.md,
                fontSize: typography.fontSize.sm,
                boxSizing: 'border-box',
              }}
            />
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <AnimatedButton variant="primary" size="sm" icon={Save} onClick={saveTargets} isLoading={targetsSaving}>
              Guardar Metas
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* ===== REVIEW DATES ===== */}
      <section>
        <SectionHeader title="Calendário de Revisão" onAdd={() => openReviewModal()} />
        {reviews.length === 0 ? (
          <p style={{ color: colors.gray[500], fontSize: typography.fontSize.sm }}>
            Nenhuma data de revisão agendada.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={thStyle}>Data</th>
                  <th style={thStyle}>Tipo</th>
                  <th style={thStyle}>Label</th>
                  <th style={thStyle}>Notas</th>
                  <th style={thStyle}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((r) => (
                  <tr key={r.id}>
                    <td style={tdStyle}>{r.date}</td>
                    <td style={tdStyle}>
                      <span style={{
                        display: 'inline-block',
                        padding: `${spacing[1]} ${spacing[2]}`,
                        borderRadius: radius.md,
                        fontSize: typography.fontSize.xs,
                        fontWeight: typography.fontWeight.semibold,
                        background: designSystem.helpers.hexToRgba(reviewTypeColors[r.type] || colors.gray[400], 0.1),
                        color: reviewTypeColors[r.type] || colors.gray[600],
                      }}>
                        {reviewTypeLabels[r.type] || r.type}
                      </span>
                    </td>
                    <td style={tdStyle}>{r.label}</td>
                    <td style={{ ...tdStyle, maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.notes}
                    </td>
                    <td style={tdStyle}>
                      <div style={{ display: 'flex', gap: spacing[1] }}>
                        <button onClick={() => openReviewModal(r)} style={iconBtnStyle} aria-label="Editar">
                          <Edit size={16} style={{ color: colors.primary }} />
                        </button>
                        <button onClick={() => deleteReview(r)} style={iconBtnStyle} aria-label="Eliminar">
                          <Trash2 size={16} style={{ color: colors.error }} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ===== UNIT MODAL ===== */}
      <AnimatePresence>
        {unitModal && (
          <ModalOverlay onClose={() => setUnitModal(false)}>
            <div style={{ padding: `${spacing[5]} ${spacing[6]}`, borderBottom: `1px solid ${colors.gray[200]}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.gray[900] }}>
                {editingUnit ? 'Editar Unidade' : 'Nova Unidade'}
              </h3>
              <button onClick={() => setUnitModal(false)} style={{ ...iconBtnStyle, color: colors.gray[400] }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: `${spacing[4]} ${spacing[6]}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[3] }}>
                <FieldInput label="Código" value={unitForm.code || ''} onChange={(v) => setUnitForm({ ...unitForm, code: v })} placeholder="Ex: A" />
                <FieldInput label="Piso" value={unitForm.floor || ''} onChange={(v) => setUnitForm({ ...unitForm, floor: v })} placeholder="Ex: 1º" />
                <FieldInput label="Tipologia" value={unitForm.typology || ''} onChange={(v) => setUnitForm({ ...unitForm, typology: v })} placeholder="Ex: T2" />
                <FieldInput label="Área Bruta (m²)" value={unitForm.areaGross || 0} type="number" onChange={(v) => setUnitForm({ ...unitForm, areaGross: Number(v) })} />
                <FieldInput label="Área Interior (m²)" value={unitForm.areaInterior || 0} type="number" onChange={(v) => setUnitForm({ ...unitForm, areaInterior: Number(v) })} />
                <FieldInput label="Área Exterior (m²)" value={unitForm.areaExterior || 0} type="number" onChange={(v) => setUnitForm({ ...unitForm, areaExterior: Number(v) })} />
                <FieldInput label="Área Extras (m²)" value={unitForm.areaExtras || 0} type="number" onChange={(v) => setUnitForm({ ...unitForm, areaExtras: Number(v) })} />
                <FieldInput label="Preço ASK (€)" value={unitForm.askPrice || 0} type="number" onChange={(v) => setUnitForm({ ...unitForm, askPrice: Number(v) })} />
                <FieldInput label="Preço Mínimo (€)" value={unitForm.minimumPrice || 0} type="number" onChange={(v) => setUnitForm({ ...unitForm, minimumPrice: Number(v) })} />
                <FieldInput label="Degrau Ajuste (%)" value={unitForm.adjustmentStep || 0} type="number" onChange={(v) => setUnitForm({ ...unitForm, adjustmentStep: Number(v) })} />
              </div>
              <FieldInput label="Notas de Venda" value={unitForm.salesNotes || ''} onChange={(v) => setUnitForm({ ...unitForm, salesNotes: v })} />
              <FieldInput label="Notas de Preço" value={unitForm.pricingNotes || ''} onChange={(v) => setUnitForm({ ...unitForm, pricingNotes: v })} />
            </div>
            <div style={{ padding: `${spacing[4]} ${spacing[6]}`, borderTop: `1px solid ${colors.gray[200]}`, display: 'flex', justifyContent: 'flex-end', gap: spacing[3] }}>
              <AnimatedButton variant="ghost" size="sm" onClick={() => setUnitModal(false)}>Cancelar</AnimatedButton>
              <AnimatedButton variant="primary" size="sm" icon={Save} onClick={saveUnit} isLoading={isSaving}>Guardar</AnimatedButton>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>

      {/* ===== REVIEW MODAL ===== */}
      <AnimatePresence>
        {reviewModal && (
          <ModalOverlay onClose={() => setReviewModal(false)}>
            <div style={{ padding: `${spacing[5]} ${spacing[6]}`, borderBottom: `1px solid ${colors.gray[200]}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.gray[900] }}>
                {editingReview ? 'Editar Data de Revisão' : 'Nova Data de Revisão'}
              </h3>
              <button onClick={() => setReviewModal(false)} style={{ ...iconBtnStyle, color: colors.gray[400] }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: `${spacing[4]} ${spacing[6]}` }}>
              <FieldInput label="Data" value={reviewForm.date || ''} type="date" onChange={(v) => setReviewForm({ ...reviewForm, date: v })} />
              <div style={{ marginBottom: spacing[3] }}>
                <label style={{ display: 'block', marginBottom: spacing[1], fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.gray[700] }}>
                  Tipo
                </label>
                <select
                  value={reviewForm.type || 'weekly'}
                  onChange={(e) => setReviewForm({ ...reviewForm, type: e.target.value as ControloReviewDate['type'] })}
                  style={{
                    width: '100%',
                    padding: `${spacing[2]} ${spacing[3]}`,
                    border: `1px solid ${colors.gray[300]}`,
                    borderRadius: radius.md,
                    fontSize: typography.fontSize.sm,
                    color: colors.gray[900],
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="weekly">Semanal</option>
                  <option value="decision">Decisão</option>
                  <option value="milestone">Marco</option>
                </select>
              </div>
              <FieldInput label="Label" value={reviewForm.label || ''} onChange={(v) => setReviewForm({ ...reviewForm, label: v })} placeholder="Ex: Revisão de preços" />
              <FieldInput label="Notas" value={reviewForm.notes || ''} onChange={(v) => setReviewForm({ ...reviewForm, notes: v })} />
            </div>
            <div style={{ padding: `${spacing[4]} ${spacing[6]}`, borderTop: `1px solid ${colors.gray[200]}`, display: 'flex', justifyContent: 'flex-end', gap: spacing[3] }}>
              <AnimatedButton variant="ghost" size="sm" onClick={() => setReviewModal(false)}>Cancelar</AnimatedButton>
              <AnimatedButton variant="primary" size="sm" icon={Save} onClick={saveReview} isLoading={isSaving}>Guardar</AnimatedButton>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </div>
  );
}
