'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit, Trash2, Save, X, ChevronLeft, ChevronRight } from '../../icons';
import { toast } from 'sonner';
import { supabaseFetch } from '../../../utils/supabase/client';
import { colors, spacing, radius, typography, shadows } from '../../../utils/styles';
import { AnimatedButton } from '../../primitives/AnimatedButton';
import type { ControloUnit, ControloWeeklyLog } from '../ControloManager';

interface WeeklyLogViewProps {
  projectId: string;
  units: ControloUnit[];
  weeklyLogs: ControloWeeklyLog[];
  onRefresh: () => void;
}

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  date.setDate(diff);
  date.setHours(0, 0, 0, 0);
  return date;
}

function getSunday(monday: Date): Date {
  const sun = new Date(monday);
  sun.setDate(sun.getDate() + 6);
  return sun;
}

function formatDate(d: Date): string {
  return d.toISOString().split('T')[0];
}

function formatDatePT(iso: string): string {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

// Modal wrapper
function ModalOverlay({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: spacing[4],
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          background: colors.white, borderRadius: radius.xl,
          width: '100%', maxWidth: '640px', maxHeight: '90vh', overflow: 'auto',
          boxShadow: shadows.xl,
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function FieldInput({ label, value, onChange, type = 'text', placeholder }: {
  label: string; value: string | number; onChange: (v: string) => void; type?: string; placeholder?: string;
}) {
  return (
    <div style={{ marginBottom: spacing[3] }}>
      <label style={{ display: 'block', marginBottom: spacing[1], fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: colors.gray[600] }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: `${spacing[2]} ${spacing[3]}`,
          border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md,
          fontSize: typography.fontSize.sm, color: colors.gray[900], outline: 'none',
          boxSizing: 'border-box',
        }}
      />
    </div>
  );
}

const thStyle: React.CSSProperties = {
  padding: `${spacing[2]} ${spacing[3]}`, textAlign: 'left',
  fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold,
  color: colors.gray[500], textTransform: 'uppercase', letterSpacing: typography.letterSpacing.wide,
  borderBottom: `1px solid ${colors.gray[200]}`, whiteSpace: 'nowrap',
};

const tdStyle: React.CSSProperties = {
  padding: `${spacing[2]} ${spacing[3]}`, fontSize: typography.fontSize.sm,
  color: colors.gray[800], borderBottom: `1px solid ${colors.gray[100]}`,
};

const iconBtnStyle: React.CSSProperties = {
  background: 'none', border: 'none', cursor: 'pointer', padding: spacing[1],
  borderRadius: radius.sm, display: 'inline-flex', alignItems: 'center',
};

export function WeeklyLogView({ projectId, units, weeklyLogs, onRefresh }: WeeklyLogViewProps) {
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [currentMonday, setCurrentMonday] = useState(() => getMonday(new Date()));
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLog, setEditingLog] = useState<ControloWeeklyLog | null>(null);
  const [form, setForm] = useState<Partial<ControloWeeklyLog>>({});
  const [isSaving, setIsSaving] = useState(false);

  const weekStart = formatDate(currentMonday);
  const weekEnd = formatDate(getSunday(currentMonday));

  const filteredLogs = useMemo(() => {
    return weeklyLogs.filter((log) => {
      const matchUnit = selectedUnit === 'all' || log.unitId === selectedUnit;
      const matchWeek = log.weekStart === weekStart;
      return matchUnit && matchWeek;
    });
  }, [weeklyLogs, selectedUnit, weekStart]);

  const prevWeek = () => {
    const d = new Date(currentMonday);
    d.setDate(d.getDate() - 7);
    setCurrentMonday(d);
  };

  const nextWeek = () => {
    const d = new Date(currentMonday);
    d.setDate(d.getDate() + 7);
    setCurrentMonday(d);
  };

  const openModal = (log?: ControloWeeklyLog) => {
    if (log) {
      setEditingLog(log);
      setForm(log);
    } else {
      setEditingLog(null);
      setForm({
        projectId,
        unitId: selectedUnit !== 'all' ? selectedUnit : (units[0]?.id || ''),
        weekStart,
        weekEnd,
        askPrice: 0,
        totalLeads: 0,
        qualifiedLeads: 0,
        contacts: 0,
        visitRequests: 0,
        visitsDone: 0,
        proposalsCount: 0,
        bestProposal: 0,
        avgProposals: 0,
        mainObjection: '',
        decisionNextStep: '',
      });
    }
    setModalOpen(true);
  };

  const saveLog = async () => {
    if (!form.unitId) {
      toast.error('Selecione uma unidade');
      return;
    }
    setIsSaving(true);
    try {
      const payload = { ...form, projectId, weekStart, weekEnd };
      if (editingLog) {
        await supabaseFetch(`controlo/weeklylogs/${editingLog.id}?projectId=${projectId}`, {
          method: 'PUT', body: JSON.stringify(payload),
        }, 1, true);
        toast.success('Registo atualizado');
      } else {
        await supabaseFetch('controlo/weeklylogs', {
          method: 'POST', body: JSON.stringify(payload),
        }, 1, true);
        toast.success('Registo criado');
      }
      setModalOpen(false);
      onRefresh();
    } catch {
      toast.error('Erro ao guardar registo');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteLog = async (log: ControloWeeklyLog) => {
    if (!confirm('Eliminar este registo semanal?')) return;
    try {
      await supabaseFetch(`controlo/weeklylogs/${log.id}?projectId=${projectId}`, { method: 'DELETE' }, 1, true);
      toast.success('Registo eliminado');
      onRefresh();
    } catch {
      toast.error('Erro ao eliminar registo');
    }
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

  const getUnitCode = (unitId: string) => units.find((u) => u.id === unitId)?.code || unitId;

  return (
    <div>
      {/* Filters */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: spacing[3], marginBottom: spacing[4],
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
          <label style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.gray[700] }}>
            Unidade:
          </label>
          <select
            value={selectedUnit}
            onChange={(e) => setSelectedUnit(e.target.value)}
            style={{
              padding: `${spacing[2]} ${spacing[3]}`, borderRadius: radius.md,
              border: `1px solid ${colors.gray[300]}`, fontSize: typography.fontSize.sm,
              color: colors.gray[900], background: colors.white, cursor: 'pointer',
            }}
          >
            <option value="all">Todas</option>
            {units.map((u) => (
              <option key={u.id} value={u.id}>{u.code} - {u.typology}</option>
            ))}
          </select>
        </div>

        {/* Week nav */}
        <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
          <button onClick={prevWeek} style={iconBtnStyle} aria-label="Semana anterior">
            <ChevronLeft size={20} style={{ color: colors.gray[600] }} />
          </button>
          <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.gray[800], minWidth: '200px', textAlign: 'center' }}>
            {formatDatePT(weekStart)} — {formatDatePT(weekEnd)}
          </span>
          <button onClick={nextWeek} style={iconBtnStyle} aria-label="Semana seguinte">
            <ChevronRight size={20} style={{ color: colors.gray[600] }} />
          </button>
        </div>

        <AnimatedButton variant="primary" size="sm" icon={Plus} onClick={() => openModal()}>
          Novo Registo
        </AnimatedButton>
      </div>

      {/* Table */}
      {filteredLogs.length === 0 ? (
        <p style={{ color: colors.gray[500], fontSize: typography.fontSize.sm, padding: spacing[4] }}>
          Sem registos para esta semana{selectedUnit !== 'all' ? ' e unidade' : ''}.
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Unid.</th>
                <th style={thStyle}>Preço ASK</th>
                <th style={thStyle}>Leads</th>
                <th style={thStyle}>Qualif.</th>
                <th style={thStyle}>Visitas</th>
                <th style={thStyle}>Propostas</th>
                <th style={thStyle}>Melhor</th>
                <th style={thStyle}>Objeção</th>
                <th style={thStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log) => (
                <tr key={log.id}>
                  <td style={{ ...tdStyle, fontWeight: typography.fontWeight.bold }}>{getUnitCode(log.unitId)}</td>
                  <td style={tdStyle}>{formatCurrency(log.askPrice)}</td>
                  <td style={tdStyle}>{log.totalLeads}</td>
                  <td style={tdStyle}>{log.qualifiedLeads}</td>
                  <td style={tdStyle}>{log.visitsDone}</td>
                  <td style={tdStyle}>{log.proposalsCount}</td>
                  <td style={tdStyle}>{log.bestProposal > 0 ? formatCurrency(log.bestProposal) : '—'}</td>
                  <td style={{ ...tdStyle, maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.mainObjection || '—'}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: spacing[1] }}>
                      <button onClick={() => openModal(log)} style={iconBtnStyle} aria-label="Editar">
                        <Edit size={16} style={{ color: colors.primary }} />
                      </button>
                      <button onClick={() => deleteLog(log)} style={iconBtnStyle} aria-label="Eliminar">
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

      {/* Modal */}
      <AnimatePresence>
        {modalOpen && (
          <ModalOverlay onClose={() => setModalOpen(false)}>
            <div style={{ padding: `${spacing[5]} ${spacing[6]}`, borderBottom: `1px solid ${colors.gray[200]}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.gray[900] }}>
                {editingLog ? 'Editar Registo Semanal' : 'Novo Registo Semanal'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ ...iconBtnStyle, color: colors.gray[400] }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: `${spacing[4]} ${spacing[6]}` }}>
              <div style={{ marginBottom: spacing[3] }}>
                <label style={{ display: 'block', marginBottom: spacing[1], fontSize: typography.fontSize.xs, fontWeight: typography.fontWeight.semibold, color: colors.gray[600] }}>
                  Unidade
                </label>
                <select
                  value={form.unitId || ''}
                  onChange={(e) => setForm({ ...form, unitId: e.target.value })}
                  style={{
                    width: '100%', padding: `${spacing[2]} ${spacing[3]}`,
                    border: `1px solid ${colors.gray[300]}`, borderRadius: radius.md,
                    fontSize: typography.fontSize.sm, color: colors.gray[900], boxSizing: 'border-box',
                  }}
                >
                  <option value="">Selecionar...</option>
                  {units.map((u) => (
                    <option key={u.id} value={u.id}>{u.code} - {u.typology}</option>
                  ))}
                </select>
              </div>

              <div style={{ padding: `${spacing[2]} ${spacing[3]}`, background: colors.gray[50], borderRadius: radius.md, marginBottom: spacing[3], fontSize: typography.fontSize.sm, color: colors.gray[600] }}>
                Semana: {formatDatePT(weekStart)} — {formatDatePT(weekEnd)}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[3] }}>
                <FieldInput label="Preço ASK (€)" value={form.askPrice || 0} type="number" onChange={(v) => setForm({ ...form, askPrice: Number(v) })} />
                <FieldInput label="Total Leads" value={form.totalLeads || 0} type="number" onChange={(v) => setForm({ ...form, totalLeads: Number(v) })} />
                <FieldInput label="Leads Qualificados" value={form.qualifiedLeads || 0} type="number" onChange={(v) => setForm({ ...form, qualifiedLeads: Number(v) })} />
                <FieldInput label="Contactos" value={form.contacts || 0} type="number" onChange={(v) => setForm({ ...form, contacts: Number(v) })} />
                <FieldInput label="Pedidos de Visita" value={form.visitRequests || 0} type="number" onChange={(v) => setForm({ ...form, visitRequests: Number(v) })} />
                <FieldInput label="Visitas Realizadas" value={form.visitsDone || 0} type="number" onChange={(v) => setForm({ ...form, visitsDone: Number(v) })} />
                <FieldInput label="N.º Propostas" value={form.proposalsCount || 0} type="number" onChange={(v) => setForm({ ...form, proposalsCount: Number(v) })} />
                <FieldInput label="Melhor Proposta (€)" value={form.bestProposal || 0} type="number" onChange={(v) => setForm({ ...form, bestProposal: Number(v) })} />
                <FieldInput label="Média Propostas (€)" value={form.avgProposals || 0} type="number" onChange={(v) => setForm({ ...form, avgProposals: Number(v) })} />
              </div>
              <FieldInput label="Principal Objeção" value={form.mainObjection || ''} onChange={(v) => setForm({ ...form, mainObjection: v })} placeholder="Ex: Preço alto, localização..." />
              <FieldInput label="Decisão / Próximo Passo" value={form.decisionNextStep || ''} onChange={(v) => setForm({ ...form, decisionNextStep: v })} placeholder="Ex: Manter preço, ajustar -2%..." />
            </div>
            <div style={{ padding: `${spacing[4]} ${spacing[6]}`, borderTop: `1px solid ${colors.gray[200]}`, display: 'flex', justifyContent: 'flex-end', gap: spacing[3] }}>
              <AnimatedButton variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancelar</AnimatedButton>
              <AnimatedButton variant="primary" size="sm" icon={Save} onClick={saveLog} isLoading={isSaving}>Guardar</AnimatedButton>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </div>
  );
}
