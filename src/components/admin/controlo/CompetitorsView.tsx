'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit, Trash2, Save, X, ExternalLink } from '../../icons';
import { toast } from 'sonner';
import { supabaseFetch } from '../../../utils/supabase/client';
import { colors, spacing, radius, typography, shadows } from '../../../utils/styles';
import { AnimatedButton } from '../../primitives/AnimatedButton';
import type { ControloCompetitor } from '../ControloManager';

interface CompetitorsViewProps {
  projectId: string;
  competitors: ControloCompetitor[];
  onRefresh: () => void;
}

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

export function CompetitorsView({ projectId, competitors, onRefresh }: CompetitorsViewProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<ControloCompetitor | null>(null);
  const [form, setForm] = useState<Partial<ControloCompetitor>>({});
  const [isSaving, setIsSaving] = useState(false);

  const openModal = (comp?: ControloCompetitor) => {
    if (comp) {
      setEditing(comp);
      setForm(comp);
    } else {
      setEditing(null);
      setForm({
        projectId,
        date: new Date().toISOString().split('T')[0],
        portal: '',
        development: '',
        address: '',
        typology: '',
        area: 0,
        price: 0,
        hasGarage: false,
        hasExterior: false,
        daysOnMarket: 0,
        url: '',
        notes: '',
      });
    }
    setModalOpen(true);
  };

  const saveComp = async () => {
    setIsSaving(true);
    try {
      const payload = { ...form, projectId };
      if (editing) {
        await supabaseFetch(`controlo/competitors/${editing.id}?projectId=${projectId}`, {
          method: 'PUT', body: JSON.stringify(payload),
        }, 1, true);
        toast.success('Concorrente atualizado');
      } else {
        await supabaseFetch('controlo/competitors', {
          method: 'POST', body: JSON.stringify(payload),
        }, 1, true);
        toast.success('Concorrente adicionado');
      }
      setModalOpen(false);
      onRefresh();
    } catch {
      toast.error('Erro ao guardar concorrente');
    } finally {
      setIsSaving(false);
    }
  };

  const deleteComp = async (comp: ControloCompetitor) => {
    if (!confirm(`Eliminar concorrente "${comp.development}"?`)) return;
    try {
      await supabaseFetch(`controlo/competitors/${comp.id}?projectId=${projectId}`, { method: 'DELETE' }, 1, true);
      toast.success('Concorrente eliminado');
      onRefresh();
    } catch {
      toast.error('Erro ao eliminar concorrente');
    }
  };

  const formatCurrency = (v: number) => new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(v);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing[4] }}>
        <h3 style={{ fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.gray[900] }}>
          Concorrência ({competitors.length})
        </h3>
        <AnimatedButton variant="primary" size="sm" icon={Plus} onClick={() => openModal()}>
          Adicionar
        </AnimatedButton>
      </div>

      {competitors.length === 0 ? (
        <p style={{ color: colors.gray[500], fontSize: typography.fontSize.sm }}>
          Nenhum comparável registado.
        </p>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={thStyle}>Data</th>
                <th style={thStyle}>Portal</th>
                <th style={thStyle}>Empreendimento</th>
                <th style={thStyle}>Tipologia</th>
                <th style={thStyle}>Área</th>
                <th style={thStyle}>Preço</th>
                <th style={thStyle}>€/m²</th>
                <th style={thStyle}>Garage</th>
                <th style={thStyle}>Ext.</th>
                <th style={thStyle}>Dias</th>
                <th style={thStyle}>Link</th>
                <th style={thStyle}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {competitors.map((comp) => (
                <tr key={comp.id}>
                  <td style={tdStyle}>{comp.date}</td>
                  <td style={tdStyle}>{comp.portal}</td>
                  <td style={{ ...tdStyle, fontWeight: typography.fontWeight.semibold, maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {comp.development}
                  </td>
                  <td style={tdStyle}>{comp.typology}</td>
                  <td style={tdStyle}>{comp.area} m²</td>
                  <td style={tdStyle}>{formatCurrency(comp.price)}</td>
                  <td style={{ ...tdStyle, fontWeight: typography.fontWeight.bold }}>
                    {comp.pricePerM2 > 0 ? `${formatCurrency(comp.pricePerM2)}` : '—'}
                  </td>
                  <td style={tdStyle}>{comp.hasGarage ? 'Sim' : 'Não'}</td>
                  <td style={tdStyle}>{comp.hasExterior ? 'Sim' : 'Não'}</td>
                  <td style={tdStyle}>{comp.daysOnMarket}</td>
                  <td style={tdStyle}>
                    {comp.url ? (
                      <a href={comp.url} target="_blank" rel="noopener noreferrer" style={{ color: colors.primary, display: 'inline-flex', alignItems: 'center' }}>
                        <ExternalLink size={14} />
                      </a>
                    ) : '—'}
                  </td>
                  <td style={tdStyle}>
                    <div style={{ display: 'flex', gap: spacing[1] }}>
                      <button onClick={() => openModal(comp)} style={iconBtnStyle} aria-label="Editar">
                        <Edit size={16} style={{ color: colors.primary }} />
                      </button>
                      <button onClick={() => deleteComp(comp)} style={iconBtnStyle} aria-label="Eliminar">
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
                {editing ? 'Editar Concorrente' : 'Novo Concorrente'}
              </h3>
              <button onClick={() => setModalOpen(false)} style={{ ...iconBtnStyle, color: colors.gray[400] }}>
                <X size={20} />
              </button>
            </div>
            <div style={{ padding: `${spacing[4]} ${spacing[6]}` }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[3] }}>
                <FieldInput label="Data" value={form.date || ''} type="date" onChange={(v) => setForm({ ...form, date: v })} />
                <FieldInput label="Portal" value={form.portal || ''} onChange={(v) => setForm({ ...form, portal: v })} placeholder="Idealista, Imovirtual..." />
                <FieldInput label="Empreendimento" value={form.development || ''} onChange={(v) => setForm({ ...form, development: v })} />
                <FieldInput label="Morada" value={form.address || ''} onChange={(v) => setForm({ ...form, address: v })} />
                <FieldInput label="Tipologia" value={form.typology || ''} onChange={(v) => setForm({ ...form, typology: v })} placeholder="T2, T3..." />
                <FieldInput label="Área (m²)" value={form.area || 0} type="number" onChange={(v) => setForm({ ...form, area: Number(v) })} />
                <FieldInput label="Preço (€)" value={form.price || 0} type="number" onChange={(v) => setForm({ ...form, price: Number(v) })} />
                <FieldInput label="Dias no Mercado" value={form.daysOnMarket || 0} type="number" onChange={(v) => setForm({ ...form, daysOnMarket: Number(v) })} />
              </div>

              {/* Auto-calculated €/m² preview */}
              {(form.area || 0) > 0 && (form.price || 0) > 0 && (
                <div style={{
                  padding: spacing[2], marginBottom: spacing[3],
                  background: colors.gray[50], borderRadius: radius.md,
                  fontSize: typography.fontSize.sm, color: colors.gray[700],
                }}>
                  €/m² calculado: <strong>{new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(Math.round((form.price || 0) / (form.area || 1)))}</strong>
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[3], marginBottom: spacing[3] }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: spacing[2], fontSize: typography.fontSize.sm, color: colors.gray[700], cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.hasGarage || false}
                    onChange={(e) => setForm({ ...form, hasGarage: e.target.checked })}
                  />
                  Garagem
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: spacing[2], fontSize: typography.fontSize.sm, color: colors.gray[700], cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={form.hasExterior || false}
                    onChange={(e) => setForm({ ...form, hasExterior: e.target.checked })}
                  />
                  Exterior
                </label>
              </div>

              <FieldInput label="URL do Anúncio" value={form.url || ''} onChange={(v) => setForm({ ...form, url: v })} placeholder="https://..." />
              <FieldInput label="Notas" value={form.notes || ''} onChange={(v) => setForm({ ...form, notes: v })} />
            </div>
            <div style={{ padding: `${spacing[4]} ${spacing[6]}`, borderTop: `1px solid ${colors.gray[200]}`, display: 'flex', justifyContent: 'flex-end', gap: spacing[3] }}>
              <AnimatedButton variant="ghost" size="sm" onClick={() => setModalOpen(false)}>Cancelar</AnimatedButton>
              <AnimatedButton variant="primary" size="sm" icon={Save} onClick={saveComp} isLoading={isSaving}>Guardar</AnimatedButton>
            </div>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </div>
  );
}
