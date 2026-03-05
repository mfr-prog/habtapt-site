// UnitsManager - Gestão de Unidades (Imóveis)
'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  BedDouble,
  Bath,
  Maximize,
  Building2,
  Filter,
} from '../icons';
import { toast } from 'sonner';
import { colors, spacing, radius, shadows, typography } from '../../utils/styles';
import { designSystem } from '../design-system';
import { AnimatedButton } from '../primitives/AnimatedButton';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ImageUpload } from './ImageUpload';
import { supabaseFetch } from '../../utils/supabase/client';
import { logError } from '../../utils/error-logger';

type UnitStatus = 'available' | 'reserved' | 'sold';

interface Unit {
  id: string;
  projectId: string | null;
  title: string;
  slug: string;
  unitRef: string;
  description: string;
  typology: string;
  grossArea: number | null;
  usefulArea: number | null;
  outdoorArea: number | null;
  floor: string;
  orientation: string;
  energyCert: string;
  bedrooms: number;
  bathrooms: number;
  price: number | null;
  priceLabel: string;
  status: UnitStatus;
  portalUrl: string | null;
  brochureUrl: string | null;
  deliveryDate: string;
  imageUrl: string;
  images: string[];
  floorPlanUrl: string;
  specs: Record<string, string>;
  highlights: string[];
  published: boolean;
  displayOrder: number;
  createdAt?: string;
  updatedAt?: string;
}

interface ProjectOption {
  id: string;
  title: string;
}

interface UnitsManagerProps {
  onRefresh?: () => void;
}

const statusOptions: { value: UnitStatus; label: string }[] = [
  { value: 'available', label: 'Disponível' },
  { value: 'reserved', label: 'Reservado' },
  { value: 'sold', label: 'Vendido' },
];

const typologyOptions = ['T0', 'T1', 'T2', 'T3', 'T4', 'T5+'];

const orientationOptions = ['Norte', 'Sul', 'Nascente', 'Poente', 'Norte/Sul', 'Nascente/Poente'];

const energyCertOptions = ['A+', 'A', 'B', 'B-', 'C', 'D', 'E', 'F'];

const floorOptions = ['Cave', 'R/C', 'Piso 1', 'Piso 2', 'Piso 3', 'Piso 4', 'Piso 5', 'Duplex', 'Penthouse'];

const getStatusColor = (status: UnitStatus) => {
  const map: Record<UnitStatus, string> = {
    available: colors.success,
    reserved: colors.warning,
    sold: colors.gray[500],
  };
  return map[status] || colors.gray[500];
};

const getStatusLabel = (status: UnitStatus) => {
  return statusOptions.find(o => o.value === status)?.label || status;
};

const emptyForm: Partial<Unit> = {
  projectId: null,
  title: '',
  slug: '',
  unitRef: '',
  description: '',
  typology: '',
  grossArea: null,
  usefulArea: null,
  outdoorArea: null,
  floor: '',
  orientation: '',
  energyCert: '',
  bedrooms: 0,
  bathrooms: 0,
  price: null,
  priceLabel: '',
  status: 'available',
  portalUrl: null,
  brochureUrl: null,
  deliveryDate: '',
  imageUrl: '',
  images: [],
  floorPlanUrl: '',
  specs: {},
  highlights: [],
  published: true,
  displayOrder: 0,
};

// Shared input style
const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: `${spacing[3]} ${spacing[4]}`,
  border: `1px solid ${colors.gray[300]}`,
  borderRadius: radius.md,
  fontSize: typography.fontSize.base,
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: typography.fontSize.sm,
  fontWeight: typography.fontWeight.medium,
  color: colors.gray[700],
  marginBottom: spacing[2],
};

export function UnitsManager({ onRefresh }: UnitsManagerProps) {
  const [units, setUnits] = useState<Unit[]>([]);
  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUnit, setEditingUnit] = useState<Unit | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState<Partial<Unit>>({ ...emptyForm });

  // Filters
  const [filterProject, setFilterProject] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [filterTypology, setFilterTypology] = useState<string>('');

  // Specs key-value editor state
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  // Highlights editor state
  const [newHighlight, setNewHighlight] = useState('');

  const fetchUnits = async () => {
    try {
      setIsLoading(true);
      const response = await supabaseFetch('units', {}, 2, true);
      const data = await response.json();
      if (data.success && data.units) {
        setUnits(data.units);
      }
    } catch (error) {
      logError(error, { component: 'UnitsManager', action: 'fetchUnits' });
      toast.error('Erro ao carregar unidades');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await supabaseFetch('projects', {}, 2, true);
      const data = await response.json();
      if (data.success && data.projects) {
        setProjects(data.projects.map((p: { id: string; title: string }) => ({ id: p.id, title: p.title })));
      }
    } catch (error) {
      logError(error, { component: 'UnitsManager', action: 'fetchProjects' });
    }
  };

  useEffect(() => {
    fetchUnits();
    fetchProjects();
  }, []);

  const filteredUnits = units.filter(u => {
    if (filterProject && u.projectId !== filterProject) return false;
    if (filterStatus && u.status !== filterStatus) return false;
    if (filterTypology && u.typology !== filterTypology) return false;
    return true;
  });

  const handleOpenModal = (unit?: Unit) => {
    if (unit) {
      setEditingUnit(unit);
      setFormData({ ...unit });
    } else {
      setEditingUnit(null);
      setFormData({ ...emptyForm });
    }
    setNewSpecKey('');
    setNewSpecValue('');
    setNewHighlight('');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUnit(null);
    setFormData({ ...emptyForm });
  };

  const handleSave = async () => {
    if (!formData.title) {
      toast.error('Título é obrigatório');
      return;
    }

    setIsSaving(true);

    try {
      const endpoint = editingUnit ? `units/${editingUnit.id}` : 'units';
      const method = editingUnit ? 'PUT' : 'POST';

      const cleanedData = {
        ...formData,
        portalUrl: formData.portalUrl?.trim() || null,
        brochureUrl: formData.brochureUrl?.trim() || null,
      };

      const response = await supabaseFetch(endpoint, {
        method,
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar unidade');
      }

      toast.success(data.message);
      handleCloseModal();
      fetchUnits();
      onRefresh?.();
    } catch (error) {
      logError(error, { component: 'UnitsManager', action: 'saveUnit' });
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar unidade');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja eliminar esta unidade?')) return;

    setIsDeleting(true);

    try {
      const response = await supabaseFetch(`units/${id}`, { method: 'DELETE' });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao eliminar unidade');
      }

      toast.success(data.message);
      fetchUnits();
      onRefresh?.();
    } catch (error) {
      logError(error, { component: 'UnitsManager', action: 'deleteUnit' });
      toast.error(error instanceof Error ? error.message : 'Erro ao eliminar unidade');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSeedVelask = async () => {
    if (!confirm('Isto vai criar as 3 unidades do Velask (T1, T2, T3). Continuar?')) return;

    try {
      const response = await supabaseFetch('units/seed', {
        method: 'POST',
        body: JSON.stringify({}),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      toast.success(data.message);
      fetchUnits();
    } catch (error) {
      logError(error, { component: 'UnitsManager', action: 'seedVelask' });
      toast.error('Erro ao popular unidades Velask');
    }
  };

  const addSpec = () => {
    if (!newSpecKey.trim() || !newSpecValue.trim()) return;
    setFormData({
      ...formData,
      specs: { ...(formData.specs || {}), [newSpecKey.trim()]: newSpecValue.trim() },
    });
    setNewSpecKey('');
    setNewSpecValue('');
  };

  const removeSpec = (key: string) => {
    const updated = { ...(formData.specs || {}) };
    delete updated[key];
    setFormData({ ...formData, specs: updated });
  };

  const addHighlight = () => {
    if (!newHighlight.trim()) return;
    setFormData({
      ...formData,
      highlights: [...(formData.highlights || []), newHighlight.trim()],
    });
    setNewHighlight('');
  };

  const removeHighlight = (index: number) => {
    const updated = [...(formData.highlights || [])];
    updated.splice(index, 1);
    setFormData({ ...formData, highlights: updated });
  };

  const getProjectTitle = (projectId: string | null) => {
    if (!projectId) return 'Independente';
    return projects.find(p => p.id === projectId)?.title || projectId;
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing[6],
          flexWrap: 'wrap',
          gap: spacing[3],
        }}
      >
        <div>
          <h2
            style={{
              fontSize: typography.fontSize['2xl'],
              fontWeight: typography.fontWeight.bold,
              color: colors.gray[900],
              marginBottom: spacing[1],
            }}
          >
            Gestão de Unidades
          </h2>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[500] }}>
            {filteredUnits.length} unidade{filteredUnits.length !== 1 ? 's' : ''}
            {units.length !== filteredUnits.length && ` (de ${units.length} total)`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: spacing[2] }}>
          {units.length === 0 && (
            <AnimatedButton
              onClick={handleSeedVelask}
              variant="secondary"
              icon={Building2}
            >
              Seed Velask
            </AnimatedButton>
          )}
          <AnimatedButton
            onClick={() => handleOpenModal()}
            disabled={isLoading}
            variant="primary"
            icon={Plus}
            aria-label="Adicionar nova unidade"
          >
            Nova Unidade
          </AnimatedButton>
        </div>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: spacing[3],
          marginBottom: spacing[6],
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Filter size={16} style={{ color: colors.gray[400] }} />
        <select
          value={filterProject}
          onChange={(e) => setFilterProject(e.target.value)}
          style={{
            ...inputStyle,
            width: 'auto',
            minWidth: '160px',
            padding: `${spacing[2]} ${spacing[3]}`,
            fontSize: typography.fontSize.sm,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = colors.primary;
            e.currentTarget.style.boxShadow = '0 0 0 3px ' + designSystem.helpers.hexToRgba(colors.primary, 0.1);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = colors.gray[300];
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <option value="">Todos os projetos</option>
          <option value="__none__">Independentes</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.title}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          style={{
            ...inputStyle,
            width: 'auto',
            minWidth: '140px',
            padding: `${spacing[2]} ${spacing[3]}`,
            fontSize: typography.fontSize.sm,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = colors.primary;
            e.currentTarget.style.boxShadow = '0 0 0 3px ' + designSystem.helpers.hexToRgba(colors.primary, 0.1);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = colors.gray[300];
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <option value="">Todos os status</option>
          {statusOptions.map(o => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        <select
          value={filterTypology}
          onChange={(e) => setFilterTypology(e.target.value)}
          style={{
            ...inputStyle,
            width: 'auto',
            minWidth: '120px',
            padding: `${spacing[2]} ${spacing[3]}`,
            fontSize: typography.fontSize.sm,
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = colors.primary;
            e.currentTarget.style.boxShadow = '0 0 0 3px ' + designSystem.helpers.hexToRgba(colors.primary, 0.1);
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = colors.gray[300];
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          <option value="">Todas tipologias</option>
          {typologyOptions.map(t => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>

      {/* Units Grid */}
      {isLoading ? (
        <div style={{ textAlign: 'center', padding: spacing[12], color: colors.gray[500] }}>
          Carregando unidades...
        </div>
      ) : filteredUnits.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: `${spacing[16]} ${spacing[8]}`,
            color: colors.gray[400],
          }}
        >
          <Building2 size={48} style={{ margin: '0 auto', marginBottom: spacing[4], opacity: 0.4 }} />
          <p
            style={{
              fontSize: typography.fontSize.lg,
              fontWeight: typography.fontWeight.semibold,
              color: colors.gray[500],
              marginBottom: spacing[2],
            }}
          >
            Nenhuma unidade encontrada
          </p>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[400], marginBottom: spacing[6] }}>
            {units.length === 0
              ? 'Comece adicionando unidades ou use o Seed Velask'
              : 'Ajuste os filtros para ver mais resultados'}
          </p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: spacing[6],
          }}
        >
          {filteredUnits.map((unit) => (
            <motion.article
              key={unit.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: colors.white,
                borderRadius: radius.lg,
                overflow: 'hidden',
                border: `1px solid ${colors.gray[200]}`,
                transition: 'all 0.2s ease',
                boxShadow: 'none',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = shadows.md;
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.borderColor = colors.gray[300];
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.borderColor = colors.gray[200];
              }}
            >
              {/* Image */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '180px',
                  overflow: 'hidden',
                  background: colors.gray[100],
                }}
              >
                {unit.imageUrl ? (
                  <ImageWithFallback
                    src={unit.imageUrl}
                    alt={unit.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Building2 size={48} style={{ color: colors.gray[300] }} />
                  </div>
                )}

                {/* Status Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: spacing[2],
                    left: spacing[2],
                    padding: `${spacing[1]} ${spacing[3]}`,
                    background: designSystem.helpers.hexToRgba(getStatusColor(unit.status), 0.95),
                    color: colors.white,
                    borderRadius: radius.full,
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.semibold,
                  }}
                >
                  {getStatusLabel(unit.status)}
                </div>

                {/* Typology Badge */}
                {unit.typology && (
                  <div
                    style={{
                      position: 'absolute',
                      top: spacing[2],
                      right: spacing[2],
                      padding: `${spacing[1]} ${spacing[3]}`,
                      background: designSystem.helpers.hexToRgba(colors.primary, 0.95),
                      color: colors.white,
                      borderRadius: radius.full,
                      fontSize: typography.fontSize.xs,
                      fontWeight: typography.fontWeight.semibold,
                    }}
                  >
                    {unit.typology}
                  </div>
                )}

                {/* Unpublished indicator */}
                {!unit.published && (
                  <div
                    style={{
                      position: 'absolute',
                      bottom: spacing[2],
                      left: spacing[2],
                      padding: `${spacing[1]} ${spacing[2]}`,
                      background: designSystem.helpers.hexToRgba(colors.error, 0.9),
                      color: colors.white,
                      borderRadius: radius.sm,
                      fontSize: '10px',
                      fontWeight: typography.fontWeight.bold,
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Rascunho
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: spacing[4] }}>
                <h3
                  style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.gray[900],
                    marginBottom: spacing[1],
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {unit.title}
                </h3>

                {unit.unitRef && (
                  <p style={{ fontSize: typography.fontSize.xs, color: colors.gray[500], marginBottom: spacing[2] }}>
                    {unit.unitRef} | {unit.floor}
                  </p>
                )}

                <p style={{
                  fontSize: typography.fontSize.xs,
                  color: colors.secondary,
                  marginBottom: spacing[3],
                }}>
                  {getProjectTitle(unit.projectId)}
                </p>

                {/* Metrics */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: spacing[2],
                    marginBottom: spacing[3],
                    padding: spacing[3],
                    background: colors.gray[50],
                    borderRadius: radius.md,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1] }}>
                    <Maximize size={14} style={{ color: colors.gray[400] }} />
                    <span style={{ fontSize: typography.fontSize.xs, color: colors.gray[600] }}>
                      {unit.grossArea ? `${unit.grossArea} m²` : '-'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1] }}>
                    <BedDouble size={14} style={{ color: colors.gray[400] }} />
                    <span style={{ fontSize: typography.fontSize.xs, color: colors.gray[600] }}>
                      {unit.bedrooms}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1] }}>
                    <Bath size={14} style={{ color: colors.gray[400] }} />
                    <span style={{ fontSize: typography.fontSize.xs, color: colors.gray[600] }}>
                      {unit.bathrooms}
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div style={{ marginBottom: spacing[3] }}>
                  <p style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.primary,
                  }}>
                    {unit.priceLabel || (unit.price ? `€${unit.price.toLocaleString('pt-PT')}` : '-')}
                  </p>
                </div>

                {/* Highlights */}
                {unit.highlights && unit.highlights.length > 0 && (
                  <div style={{ display: 'flex', gap: spacing[1], flexWrap: 'wrap', marginBottom: spacing[3] }}>
                    {unit.highlights.map((h, i) => (
                      <span
                        key={i}
                        style={{
                          padding: `${spacing[1]} ${spacing[2]}`,
                          background: designSystem.helpers.hexToRgba(colors.primary, 0.08),
                          color: colors.primary,
                          borderRadius: radius.sm,
                          fontSize: '10px',
                          fontWeight: typography.fontWeight.semibold,
                        }}
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', gap: spacing[2] }}>
                  <button
                    onClick={() => handleOpenModal(unit)}
                    aria-label={`Editar unidade ${unit.title}`}
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: spacing[2],
                      padding: `${spacing[2]} ${spacing[3]}`,
                      background: colors.gray[100],
                      border: 'none',
                      borderRadius: radius.md,
                      fontSize: typography.fontSize.sm,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.gray[700],
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = colors.gray[200]; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = colors.gray[100]; }}
                  >
                    <Edit size={16} />
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(unit.id)}
                    disabled={isDeleting}
                    aria-label={`Eliminar unidade ${unit.title}`}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: `${spacing[2]} ${spacing[3]}`,
                      background: designSystem.helpers.hexToRgba(colors.error, 0.1),
                      border: 'none',
                      borderRadius: radius.md,
                      color: colors.error,
                      cursor: isDeleting ? 'not-allowed' : 'pointer',
                      opacity: isDeleting ? 0.6 : 1,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isDeleting) e.currentTarget.style.background = designSystem.helpers.hexToRgba(colors.error, 0.2);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = designSystem.helpers.hexToRgba(colors.error, 0.1);
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(15,23,42,0.6)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 9999,
              padding: spacing[4],
              backdropFilter: 'blur(4px)',
            }}
            onClick={handleCloseModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              role="dialog"
              aria-labelledby="unit-modal-title"
              aria-modal="true"
              style={{
                background: colors.white,
                borderRadius: radius.xl,
                maxWidth: '900px',
                width: '100%',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: shadows['2xl'],
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: spacing[6],
                  borderBottom: `1px solid ${colors.gray[200]}`,
                  position: 'sticky',
                  top: 0,
                  background: colors.white,
                  zIndex: 1,
                }}
              >
                <h2
                  id="unit-modal-title"
                  style={{
                    fontSize: typography.fontSize['2xl'],
                    fontWeight: typography.fontWeight.bold,
                    color: colors.gray[900],
                  }}
                >
                  {editingUnit ? 'Editar Unidade' : 'Nova Unidade'}
                </h2>

                <button
                  onClick={handleCloseModal}
                  aria-label="Fechar modal"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '36px',
                    height: '36px',
                    border: 'none',
                    background: colors.gray[100],
                    borderRadius: radius.full,
                    color: colors.gray[600],
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = colors.gray[200]; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = colors.gray[100]; }}
                >
                  <X size={20} />
                </button>
              </div>

              {/* Modal Body */}
              <form
                onSubmit={(e) => { e.preventDefault(); handleSave(); }}
                style={{ padding: spacing[6] }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[5] }}>

                  {/* Section: Identificação */}
                  <SectionTitle>Identificação</SectionTitle>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4] }}>
                    <FormField label="Título" required>
                      <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Ex: T1 Garden Garage"
                        style={inputStyle}
                        required
                      />
                    </FormField>

                    <FormField label="Referência">
                      <input
                        type="text"
                        value={formData.unitRef || ''}
                        onChange={(e) => setFormData({ ...formData, unitRef: e.target.value })}
                        placeholder="Ex: Fracção A"
                        style={inputStyle}
                      />
                    </FormField>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4] }}>
                    <FormField label="Projeto (opcional)">
                      <select
                        value={formData.projectId || ''}
                        onChange={(e) => setFormData({ ...formData, projectId: e.target.value || null })}
                        style={inputStyle}
                      >
                        <option value="">Sem projeto (independente)</option>
                        {projects.map(p => (
                          <option key={p.id} value={p.id}>{p.title}</option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label="Slug">
                      <input
                        type="text"
                        value={formData.slug || ''}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        placeholder="Auto-gerado do título"
                        style={inputStyle}
                      />
                    </FormField>
                  </div>

                  <FormField label="Descrição">
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descrição da unidade..."
                      rows={3}
                      style={{ ...inputStyle, resize: 'vertical' }}
                    />
                  </FormField>

                  {/* Section: Características Imobiliárias */}
                  <SectionTitle>Características</SectionTitle>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing[4] }}>
                    <FormField label="Tipologia">
                      <select
                        value={formData.typology || ''}
                        onChange={(e) => setFormData({ ...formData, typology: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="">Selecionar</option>
                        {typologyOptions.map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label="Piso">
                      <select
                        value={formData.floor || ''}
                        onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="">Selecionar</option>
                        {floorOptions.map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </FormField>

                    <FormField label="Orientação">
                      <select
                        value={formData.orientation || ''}
                        onChange={(e) => setFormData({ ...formData, orientation: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="">Selecionar</option>
                        {orientationOptions.map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing[4] }}>
                    <FormField label="Área Bruta (m²)">
                      <input
                        type="number"
                        step="0.01"
                        value={formData.grossArea ?? ''}
                        onChange={(e) => setFormData({ ...formData, grossArea: e.target.value ? parseFloat(e.target.value) : null })}
                        placeholder="118.44"
                        style={inputStyle}
                      />
                    </FormField>

                    <FormField label="Área Útil (m²)">
                      <input
                        type="number"
                        step="0.01"
                        value={formData.usefulArea ?? ''}
                        onChange={(e) => setFormData({ ...formData, usefulArea: e.target.value ? parseFloat(e.target.value) : null })}
                        placeholder="69.60"
                        style={inputStyle}
                      />
                    </FormField>

                    <FormField label="Área Exterior (m²)">
                      <input
                        type="number"
                        step="0.01"
                        value={formData.outdoorArea ?? ''}
                        onChange={(e) => setFormData({ ...formData, outdoorArea: e.target.value ? parseFloat(e.target.value) : null })}
                        placeholder="34.06"
                        style={inputStyle}
                      />
                    </FormField>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing[4] }}>
                    <FormField label="Quartos">
                      <input
                        type="number"
                        min="0"
                        value={formData.bedrooms ?? 0}
                        onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                        style={inputStyle}
                      />
                    </FormField>

                    <FormField label="Casas de Banho">
                      <input
                        type="number"
                        min="0"
                        value={formData.bathrooms ?? 0}
                        onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })}
                        style={inputStyle}
                      />
                    </FormField>

                    <FormField label="Cert. Energético">
                      <select
                        value={formData.energyCert || ''}
                        onChange={(e) => setFormData({ ...formData, energyCert: e.target.value })}
                        style={inputStyle}
                      >
                        <option value="">Selecionar</option>
                        {energyCertOptions.map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  {/* Section: Comercial */}
                  <SectionTitle>Comercial / Venda</SectionTitle>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: spacing[4] }}>
                    <FormField label="Preço (EUR)">
                      <input
                        type="number"
                        step="1"
                        value={formData.price ?? ''}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : null })}
                        placeholder="399000"
                        style={inputStyle}
                      />
                    </FormField>

                    <FormField label="Label de Preço">
                      <input
                        type="text"
                        value={formData.priceLabel || ''}
                        onChange={(e) => setFormData({ ...formData, priceLabel: e.target.value })}
                        placeholder="Desde €399.000"
                        style={inputStyle}
                      />
                    </FormField>

                    <FormField label="Status">
                      <select
                        value={formData.status || 'available'}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as UnitStatus })}
                        style={inputStyle}
                      >
                        {statusOptions.map(o => (
                          <option key={o.value} value={o.value}>{o.label}</option>
                        ))}
                      </select>
                    </FormField>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4] }}>
                    <FormField label="Data de Entrega">
                      <input
                        type="text"
                        value={formData.deliveryDate || ''}
                        onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
                        placeholder="Abril 2026"
                        style={inputStyle}
                      />
                    </FormField>

                    <FormField label="Ordem de exibição">
                      <input
                        type="number"
                        min="0"
                        value={formData.displayOrder ?? 0}
                        onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
                        style={inputStyle}
                      />
                    </FormField>
                  </div>

                  {/* Section: Links */}
                  <SectionTitle>Links</SectionTitle>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4] }}>
                    <FormField label="Link Portal (Idealista)">
                      <input
                        type="url"
                        value={formData.portalUrl || ''}
                        onChange={(e) => setFormData({ ...formData, portalUrl: e.target.value })}
                        placeholder="https://idealista.pt/..."
                        style={inputStyle}
                      />
                    </FormField>

                    <FormField label="Link Brochura">
                      <input
                        type="url"
                        value={formData.brochureUrl || ''}
                        onChange={(e) => setFormData({ ...formData, brochureUrl: e.target.value })}
                        placeholder="https://..."
                        style={inputStyle}
                      />
                    </FormField>
                  </div>

                  {/* Section: Media */}
                  <SectionTitle>Media</SectionTitle>

                  <ImageUpload
                    value={formData.imageUrl}
                    onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                    bucket="units"
                    label="Imagem Principal"
                  />

                  <FormField label="URL da Planta">
                    <input
                      type="url"
                      value={formData.floorPlanUrl || ''}
                      onChange={(e) => setFormData({ ...formData, floorPlanUrl: e.target.value })}
                      placeholder="https://..."
                      style={inputStyle}
                    />
                  </FormField>

                  {/* Section: Specs (Key-Value) */}
                  <SectionTitle>Especificações</SectionTitle>

                  {Object.entries(formData.specs || {}).length > 0 && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[2] }}>
                      {Object.entries(formData.specs || {}).map(([key, value]) => (
                        <div
                          key={key}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing[2],
                            padding: `${spacing[2]} ${spacing[3]}`,
                            background: colors.gray[50],
                            borderRadius: radius.md,
                          }}
                        >
                          <span style={{ fontWeight: typography.fontWeight.semibold, fontSize: typography.fontSize.sm, color: colors.gray[700], minWidth: '120px' }}>
                            {key}
                          </span>
                          <span style={{ fontSize: typography.fontSize.sm, color: colors.gray[600], flex: 1 }}>
                            {value}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeSpec(key)}
                            style={{
                              background: 'none',
                              border: 'none',
                              color: colors.error,
                              cursor: 'pointer',
                              padding: spacing[1],
                            }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: spacing[2], alignItems: 'flex-end' }}>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Chave</label>
                      <input
                        type="text"
                        value={newSpecKey}
                        onChange={(e) => setNewSpecKey(e.target.value)}
                        placeholder="Ex: Garagem"
                        style={inputStyle}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSpec(); } }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <label style={labelStyle}>Valor</label>
                      <input
                        type="text"
                        value={newSpecValue}
                        onChange={(e) => setNewSpecValue(e.target.value)}
                        placeholder="Ex: 14,78 m²"
                        style={inputStyle}
                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSpec(); } }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={addSpec}
                      style={{
                        padding: `${spacing[3]} ${spacing[4]}`,
                        background: colors.primary,
                        color: colors.white,
                        border: 'none',
                        borderRadius: radius.md,
                        cursor: 'pointer',
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        whiteSpace: 'nowrap',
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Section: Highlights */}
                  <SectionTitle>Destaques</SectionTitle>

                  {(formData.highlights || []).length > 0 && (
                    <div style={{ display: 'flex', gap: spacing[2], flexWrap: 'wrap' }}>
                      {(formData.highlights || []).map((h, i) => (
                        <span
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing[1],
                            padding: `${spacing[1]} ${spacing[3]}`,
                            background: designSystem.helpers.hexToRgba(colors.primary, 0.1),
                            color: colors.primary,
                            borderRadius: radius.full,
                            fontSize: typography.fontSize.sm,
                            fontWeight: typography.fontWeight.medium,
                          }}
                        >
                          {h}
                          <button
                            type="button"
                            onClick={() => removeHighlight(i)}
                            style={{ background: 'none', border: 'none', color: colors.primary, cursor: 'pointer', padding: 0, display: 'flex' }}
                          >
                            <X size={14} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}

                  <div style={{ display: 'flex', gap: spacing[2] }}>
                    <input
                      type="text"
                      value={newHighlight}
                      onChange={(e) => setNewHighlight(e.target.value)}
                      placeholder="Ex: Jardim privativo"
                      style={{ ...inputStyle, flex: 1 }}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHighlight(); } }}
                    />
                    <button
                      type="button"
                      onClick={addHighlight}
                      style={{
                        padding: `${spacing[3]} ${spacing[4]}`,
                        background: colors.primary,
                        color: colors.white,
                        border: 'none',
                        borderRadius: radius.md,
                        cursor: 'pointer',
                      }}
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  {/* Published toggle */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[3] }}>
                    <label style={{ ...labelStyle, marginBottom: 0, cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        checked={formData.published !== false}
                        onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                        style={{ marginRight: spacing[2] }}
                      />
                      Publicado (visível no site)
                    </label>
                  </div>

                </div>

                {/* Modal Footer */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: spacing[3],
                    marginTop: spacing[6],
                    paddingTop: spacing[6],
                    borderTop: `1px solid ${colors.gray[200]}`,
                  }}
                >
                  <AnimatedButton
                    onClick={handleCloseModal}
                    variant="secondary"
                    icon={X}
                    type="button"
                  >
                    Cancelar
                  </AnimatedButton>

                  <AnimatedButton
                    onClick={handleSave}
                    disabled={isSaving}
                    variant="primary"
                    icon={Save}
                    type="submit"
                  >
                    {isSaving ? 'Salvando...' : editingUnit ? 'Atualizar' : 'Criar Unidade'}
                  </AnimatedButton>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper components
function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3
      style={{
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        color: colors.gray[900],
        paddingBottom: spacing[2],
        borderBottom: `1px solid ${colors.gray[200]}`,
        marginTop: spacing[2],
        marginBottom: spacing[4],
      }}
    >
      {children}
    </h3>
  );
}

function FormField({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>
        {label}
        {required && <span style={{ color: colors.error }}> *</span>}
      </label>
      {children}
    </div>
  );
}
