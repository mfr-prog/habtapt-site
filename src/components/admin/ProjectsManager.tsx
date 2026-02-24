// ProjectsManager - 100% Conformidade Guardião Universal
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  TrendingUp,
  Building2,
  Image,
  AlertCircle,
  RefreshCw,
} from '../icons';
import { toast } from 'sonner';
import { colors, spacing, radius, shadows, typography } from '../../utils/styles';
import { designSystem } from '../design-system';
import { AnimatedButton } from '../primitives/AnimatedButton';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ImageUpload } from './ImageUpload';
import { supabaseFetch } from '../../utils/supabase/client';

type ProjectStatus = 'analysis' | 'in-progress' | 'available' | 'sold';
type InvestmentStrategy = 'buy-hold' | 'fix-flip' | 'alojamento-local' | 'rent-to-rent' | 'desenvolvimento' | 'co-investimento';

interface Project {
  id: string;
  title: string;
  location: string;
  status: ProjectStatus;
  statusLabel: string;
  strategy: InvestmentStrategy;
  image: string;
  roi: string;
  area: string;
  bedrooms: number;
  bathrooms: number;
  price: string;
  investment: string;
  timeline: string; // Prazo total (ex: "9 meses")
  timelinePhases?: string; // Fases do projeto separadas por linha: "Aquisição|1 mês|completed"
  description: string;
  highlights?: string; // Destaques separados por linha
  portalLink?: string | null; // Link do portal (Idealista)
  brochureLink?: string | null; // Link da brochura
  createdAt?: string;
  updatedAt?: string;
  timestamp?: number;
}

interface ProjectsManagerProps {
  projects: Project[];
  onRefresh: () => void;
  isLoading: boolean;
}

export function ProjectsManager({ projects, onRefresh, isLoading }: ProjectsManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    location: '',
    status: 'analysis',
    statusLabel: 'Em Análise',
    strategy: 'fix-flip',
    image: '',
    roi: '+0%',
    area: '0 m²',
    bedrooms: 0,
    bathrooms: 0,
    price: '€0',
    investment: '€0',
    timeline: '0 meses',
    timelinePhases: '',
    description: '',
    highlights: '',
    portalLink: null,
    brochureLink: null,
  });

  const handleOpenModal = (project?: Project) => {
    if (project) {
      setEditingProject(project);
      setFormData(project);
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        location: '',
        status: 'analysis',
        statusLabel: 'Em Análise',
        strategy: 'fix-flip',
        image: '',
        roi: '+0%',
        area: '0 m²',
        bedrooms: 0,
        bathrooms: 0,
        price: '€0',
        investment: '€0',
        timeline: '0 meses',
        description: '',
        highlights: '',
        portalLink: null,
        brochureLink: null,
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProject(null);
    // Limpar completamente o estado do formulário para evitar valores residuais
    setFormData({
      title: '',
      location: '',
      status: 'analysis',
      statusLabel: 'Em Análise',
      strategy: 'fix-flip',
      image: '',
      roi: '+0%',
      area: '0 m²',
      bedrooms: 0,
      bathrooms: 0,
      price: '€0',
      investment: '€0',
      timeline: '0 meses',
      timelinePhases: '',
      description: '',
      highlights: '',
      portalLink: null,
      brochureLink: null,
    });
  };

  const handleSave = async () => {
    // Validation
    if (!formData.title || !formData.location || !formData.statusLabel || !formData.image) {
      toast.error('Preencha todos os campos obrigatórios');
      return;
    }

    setIsSaving(true);

    try {
      const endpoint = editingProject
        ? `projects/${editingProject.id}`
        : 'projects';

      const method = editingProject ? 'PUT' : 'POST';

      // Clean up empty strings to null for links
      const cleanedFormData = {
        ...formData,
        portalLink: formData.portalLink?.trim() || null,
        brochureLink: formData.brochureLink?.trim() || null,
      };

      const response = await supabaseFetch(endpoint, {
        method,
        body: JSON.stringify(cleanedFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao salvar projeto');
      }

      toast.success(data.message);
      handleCloseModal();
      onRefresh();
    } catch (error) {
      console.error('Error saving project:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar projeto');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await supabaseFetch(`projects/${id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao excluir projeto');
      }

      toast.success(data.message);
      onRefresh();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir projeto');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSeedProjects = async () => {
    if (projects.length > 0) {
      const confirmSync = confirm(
        '📋 Sincronizar Projetos do Site\n\n' +
        'Você já tem ' + projects.length + ' projeto(s) cadastrado(s).\n\n' +
        'Esta ação irá:\n' +
        '• Verificar os projetos padrão do código\n' +
        '• Adicionar apenas os que ainda não existem no banco\n' +
        '• NÃO modificar ou deletar projetos existentes\n\n' +
        'Deseja continuar?'
      );
      
      if (!confirmSync) {
        toast.info('Sincronização cancelada.');
        return;
      }
    }

    setIsSaving(true);

    try {
      const response = await supabaseFetch('projects/seed', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao popular projetos');
      }

      toast.success(data.message);
      onRefresh();
    } catch (error) {
      console.error('Error seeding projects:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao popular projetos');
    } finally {
      setIsSaving(false);
    }
  };

  const handleMigrateStatus = async () => {
    const confirm1 = confirm(
      '🔄 Migração de Status\n\n' +
      'Esta ação irá converter todos os status antigos para os novos padrões:\n\n' +
      '• "analysis" → "in-progress" (Em Andamento)\n' +
      '• "renovation" → "in-progress" (Em Andamento)\n' +
      '• "completed" → "available" (Disponível)\n\n' +
      'Esta ação não pode ser desfeita.\n\n' +
      'Deseja continuar?'
    );
    
    if (!confirm1) {
      toast.info('Migração cancelada.');
      return;
    }

    setIsSaving(true);

    try {
      const response = await supabaseFetch('projects/migrate-status', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro na migração');
      }

      toast.success(data.message);
      onRefresh();
    } catch (error) {
      console.error('Error migrating status:', error);
      toast.error(error instanceof Error ? error.message : 'Erro na migração');
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetDatabase = async () => {
    // Primeira confirmação com aviso claro
    const firstConfirm = confirm(
      '⚠️⚠️⚠️ ATENÇÃO - AÇÃO DESTRUTIVA ⚠️⚠️⚠️\n\n' +
      'Esta ação irá DELETAR PERMANENTEMENTE todos os projetos do banco de dados!\n\n' +
      'Atualmente você tem ' + projects.length + ' projeto(s) cadastrado(s).\n\n' +
      'Deseja realmente continuar?'
    );
    
    if (!firstConfirm) {
      return;
    }

    // Segunda confirmação com instruções de recuperação
    const secondConfirm = confirm(
      '⚠️ ÚLTIMA CONFIRMAÇÃO ⚠️\n\n' +
      'Confirma que deseja DELETAR TODOS os projetos?\n\n' +
      'Após deletar, você pode:\n' +
      '1. Clicar em "Sincronizar Site" para recriar os projetos padrão\n' +
      '2. Ou adicionar projetos manualmente\n\n' +
      'Prosseguir com a exclusão?'
    );
    
    if (!secondConfirm) {
      toast.info('Operação cancelada. Seus projetos estão seguros.');
      return;
    }

    setIsSaving(true);

    try {
      const response = await supabaseFetch('projects/reset', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao resetar banco');
      }

      toast.success(data.message);
      onRefresh();
    } catch (error) {
      console.error('Error resetting database:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao resetar banco');
    } finally {
      setIsSaving(false);
    }
  };

  const statusOptions = [
    { value: 'analysis', label: 'Em Análise' },
    { value: 'in-progress', label: 'Em Andamento' },
    { value: 'available', label: 'Disponível' },
    { value: 'sold', label: 'Vendido' },
  ];

  const strategyOptions = [
    { value: 'fix-flip', label: 'Fix & Flip' },
    { value: 'buy-hold', label: 'Buy & Hold' },
    { value: 'alojamento-local', label: 'Alojamento Local' },
    { value: 'rent-to-rent', label: 'Rent-to-Rent' },
    { value: 'desenvolvimento', label: 'Desenvolvimento' },
    { value: 'co-investimento', label: 'Co-Investimento' },
  ];

  const getStatusColor = (status: ProjectStatus) => {
    const colorMap: Record<string, string> = {
      'in-progress': colors.warning,
      available: colors.secondary,
      sold: colors.success,
    };
    return colorMap[status] || colors.gray[500];
  };

  const getStrategyColor = (strategy: InvestmentStrategy) => {
    return strategy === 'fix-flip' ? colors.primary : colors.secondary;
  };

  return (
    <div>
      {/* Header with Add Button */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing[6],
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
            Gestão de Projetos
          </h2>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[500] }}>
            {projects.length} projeto{projects.length !== 1 ? 's' : ''} no portfólio
          </p>
        </div>

        <div style={{ display: 'flex', gap: spacing[3], flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Botão perigoso - Resetar DB */}
          <div style={{ position: 'relative' }}>
            <AnimatedButton
              onClick={handleResetDatabase}
              disabled={isLoading || isSaving}
              variant="danger"
              icon={AlertCircle}
              size="sm"
              aria-label="Resetar banco de dados - ATENÇÃO: Ação destrutiva!"
              title="⚠️ PERIGO: Deleta TODOS os projetos do banco de dados!"
            >
              ⚠️ Resetar DB
            </AnimatedButton>
          </div>
          
          <div style={{ width: '1px', height: '32px', background: colors.gray[300] }} />
          
          {/* Funções de manutenção */}
          <AnimatedButton
            onClick={handleMigrateStatus}
            disabled={isLoading || isSaving}
            variant="secondary"
            icon={RefreshCw}
            aria-label="Migrar status dos projetos para novos padrões"
            title="Converte status antigos (analysis, renovation) para os novos padrões (in-progress, available, sold)"
          >
            Migrar Status
          </AnimatedButton>
          <AnimatedButton
            onClick={handleSeedProjects}
            disabled={isLoading || isSaving}
            variant="secondary"
            icon={Building2}
            aria-label="Sincronizar projetos do site"
            title="Importa projetos padrão do código para o banco de dados"
          >
            Sincronizar Site
          </AnimatedButton>
          
          <div style={{ width: '1px', height: '32px', background: colors.gray[300] }} />
          
          {/* Ação principal */}
          <AnimatedButton
            onClick={() => handleOpenModal()}
            disabled={isLoading}
            variant="primary"
            icon={Plus}
            aria-label="Adicionar novo projeto"
          >
            Novo Projeto
          </AnimatedButton>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            textAlign: 'center',
            padding: spacing[12],
            color: colors.gray[500],
          }}
        >
          <Building2 size={64} style={{ margin: '0 auto', marginBottom: spacing[4], opacity: 0.3 }} aria-hidden="true" />
          <h3
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[2],
            }}
          >
            Nenhum projeto cadastrado
          </h3>
          <p style={{ fontSize: typography.fontSize.base, marginBottom: spacing[6] }}>
            Comece sincronizando os projetos do site ou adicione um novo projeto manualmente
          </p>
          <div style={{ display: 'flex', gap: spacing[3], justifyContent: 'center' }}>
            <AnimatedButton onClick={handleSeedProjects} variant="secondary" icon={Building2} disabled={isSaving}>
              Sincronizar do Site
            </AnimatedButton>
            <AnimatedButton onClick={() => handleOpenModal()} variant="primary" icon={Plus}>
              Adicionar Projeto
            </AnimatedButton>
          </div>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
            gap: spacing[6],
          }}
        >
          {projects.map((project) => (
            <motion.article
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: colors.white,
                borderRadius: radius.lg,
                overflow: 'hidden',
                border: `1px solid ${colors.gray[200]}`,
                transition: 'all 0.3s',
              }}
              whileHover={{ boxShadow: shadows.lg }}
            >
              {/* Image */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '220px',
                  overflow: 'hidden',
                }}
              >
                <ImageWithFallback
                  src={project.image}
                  alt={project.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />

                {/* Status Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: spacing[3],
                    left: spacing[3],
                    padding: `${spacing[1]} ${spacing[3]}`,
                    background: designSystem.helpers.hexToRgba(getStatusColor(project.status), 0.95),
                    color: colors.white,
                    borderRadius: radius.full,
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.semibold,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {project.statusLabel}
                </div>

                {/* Strategy Badge */}
                <div
                  style={{
                    position: 'absolute',
                    top: spacing[3],
                    right: spacing[3],
                    padding: `${spacing[1]} ${spacing[3]}`,
                    background: designSystem.helpers.hexToRgba(getStrategyColor(project.strategy), 0.95),
                    color: colors.white,
                    borderRadius: radius.full,
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.semibold,
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  {strategyOptions.find(opt => opt.value === project.strategy)?.label || project.strategy}
                </div>
              </div>

              {/* Content */}
              <div style={{ padding: spacing[4] }}>
                <h3
                  style={{
                    fontSize: typography.fontSize.lg,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.gray[900],
                    marginBottom: spacing[2],
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {project.title}
                </h3>

                <div style={{ display: 'flex', alignItems: 'center', gap: spacing[1], marginBottom: spacing[3] }}>
                  <MapPin size={14} style={{ color: colors.gray[400] }} aria-hidden="true" />
                  <span style={{ fontSize: typography.fontSize.sm, color: colors.gray[600] }}>
                    {project.location}
                  </span>
                </div>

                {/* Metrics */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(2, 1fr)',
                    gap: spacing[2],
                    marginBottom: spacing[3],
                    padding: spacing[3],
                    background: colors.gray[50],
                    borderRadius: radius.md,
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                    <TrendingUp size={16} style={{ color: colors.success }} aria-hidden="true" />
                    <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.gray[900] }}>
                      {project.roi}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                    <Maximize size={16} style={{ color: colors.gray[400] }} aria-hidden="true" />
                    <span style={{ fontSize: typography.fontSize.sm, color: colors.gray[600] }}>
                      {project.area}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                    <BedDouble size={16} style={{ color: colors.gray[400] }} aria-hidden="true" />
                    <span style={{ fontSize: typography.fontSize.sm, color: colors.gray[600] }}>
                      {project.bedrooms}
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing[2] }}>
                    <Bath size={16} style={{ color: colors.gray[400] }} aria-hidden="true" />
                    <span style={{ fontSize: typography.fontSize.sm, color: colors.gray[600] }}>
                      {project.bathrooms}
                    </span>
                  </div>
                </div>

                {/* Additional Info */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: spacing[2],
                    marginBottom: spacing[3],
                    padding: spacing[3],
                    background: designSystem.helpers.hexToRgba(colors.primary, 0.05),
                    borderRadius: radius.md,
                    borderLeft: `3px solid ${colors.primary}`,
                  }}
                >
                  {project.timeline && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: typography.fontSize.xs, color: colors.gray[600], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Prazo
                      </span>
                      <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.primary }}>
                        {project.timeline}
                      </span>
                    </div>
                  )}
                  {project.investment && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: typography.fontSize.xs, color: colors.gray[600], textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Investimento
                      </span>
                      <span style={{ fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold, color: colors.gray[900] }}>
                        {project.investment}
                      </span>
                    </div>
                  )}
                </div>

                {/* Price */}
                <div style={{ marginBottom: spacing[4] }}>
                  <p style={{ fontSize: typography.fontSize.xs, color: colors.gray[500], marginBottom: spacing[1] }}>
                    Preço de Venda
                  </p>
                  <p style={{ fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.primary }}>
                    {project.price}
                  </p>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: spacing[2] }}>
                  <button
                    onClick={() => handleOpenModal(project)}
                    aria-label={`Editar projeto ${project.title}`}
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
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.gray[200];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = colors.gray[100];
                    }}
                  >
                    <Edit size={16} aria-hidden="true" />
                    Editar
                  </button>

                  <button
                    onClick={() => handleDelete(project.id)}
                    disabled={isDeleting}
                    aria-label={`Excluir projeto ${project.title}`}
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
                      if (!isDeleting) {
                        e.currentTarget.style.background = designSystem.helpers.hexToRgba(colors.error, 0.2);
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = designSystem.helpers.hexToRgba(colors.error, 0.1);
                    }}
                  >
                    <Trash2 size={16} aria-hidden="true" />
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
              background: designSystem.helpers.hexToRgba('#000', 0.5),
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
              aria-labelledby="modal-title"
              aria-modal="true"
              style={{
                background: colors.white,
                borderRadius: radius.xl,
                maxWidth: '800px',
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
                }}
              >
                <h2
                  id="modal-title"
                  style={{
                    fontSize: typography.fontSize['2xl'],
                    fontWeight: typography.fontWeight.bold,
                    color: colors.gray[900],
                  }}
                >
                  {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
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
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = colors.gray[200];
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = colors.gray[100];
                  }}
                >
                  <X size={20} aria-hidden="true" />
                </button>
              </div>

              {/* Modal Body */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSave();
                }}
                style={{ padding: spacing[6] }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                  {/* Title */}
                  <div>
                    <label
                      htmlFor="project-title"
                      style={{
                        display: 'block',
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.gray[700],
                        marginBottom: spacing[2],
                      }}
                    >
                      Título do Projeto <span style={{ color: colors.error }}>*</span>
                    </label>
                    <input
                      id="project-title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      placeholder="Ex: Apartamento Premium Centro Lisboa"
                      style={{
                        width: '100%',
                        padding: `${spacing[3]} ${spacing[4]}`,
                        border: `1px solid ${colors.gray[300]}`,
                        borderRadius: radius.md,
                        fontSize: typography.fontSize.base,
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.gray[300];
                      }}
                    />
                  </div>

                  {/* Location */}
                  <div>
                    <label
                      htmlFor="project-location"
                      style={{
                        display: 'block',
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.gray[700],
                        marginBottom: spacing[2],
                      }}
                    >
                      Localização <span style={{ color: colors.error }}>*</span>
                    </label>
                    <input
                      id="project-location"
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                      placeholder="Ex: Chiado, Lisboa"
                      style={{
                        width: '100%',
                        padding: `${spacing[3]} ${spacing[4]}`,
                        border: `1px solid ${colors.gray[300]}`,
                        borderRadius: radius.md,
                        fontSize: typography.fontSize.base,
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.gray[300];
                      }}
                    />
                  </div>

                  {/* Status and Strategy Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4] }}>
                    {/* Status */}
                    <div>
                      <label
                        htmlFor="project-status"
                        style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.gray[700],
                          marginBottom: spacing[2],
                        }}
                      >
                        Status <span style={{ color: colors.error }}>*</span>
                      </label>
                      <select
                        id="project-status"
                        value={formData.status}
                        onChange={(e) => {
                          const selectedStatus = e.target.value as ProjectStatus;
                          const selectedOption = statusOptions.find(opt => opt.value === selectedStatus);
                          setFormData({ 
                            ...formData, 
                            status: selectedStatus,
                            statusLabel: selectedOption?.label || selectedStatus
                          });
                        }}
                        required
                        style={{
                          width: '100%',
                          padding: `${spacing[3]} ${spacing[4]}`,
                          border: `1px solid ${colors.gray[300]}`,
                          borderRadius: radius.md,
                          fontSize: typography.fontSize.base,
                          outline: 'none',
                          cursor: 'pointer',
                          background: colors.white,
                        }}
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Strategy */}
                    <div>
                      <label
                        htmlFor="project-strategy"
                        style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.gray[700],
                          marginBottom: spacing[2],
                        }}
                      >
                        Estratégia <span style={{ color: colors.error }}>*</span>
                      </label>
                      <select
                        id="project-strategy"
                        value={formData.strategy}
                        onChange={(e) => setFormData({ ...formData, strategy: e.target.value as InvestmentStrategy })}
                        required
                        style={{
                          width: '100%',
                          padding: `${spacing[3]} ${spacing[4]}`,
                          border: `1px solid ${colors.gray[300]}`,
                          borderRadius: radius.md,
                          fontSize: typography.fontSize.base,
                          outline: 'none',
                          cursor: 'pointer',
                          background: colors.white,
                        }}
                      >
                        {strategyOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Status Label */}
                  <div>
                    <label
                      htmlFor="project-status-label"
                      style={{
                        display: 'block',
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.gray[700],
                        marginBottom: spacing[2],
                      }}
                    >
                      Label do Status <span style={{ color: colors.error }}>*</span>
                    </label>
                    <input
                      id="project-status-label"
                      type="text"
                      value={formData.statusLabel}
                      onChange={(e) => setFormData({ ...formData, statusLabel: e.target.value })}
                      required
                      placeholder="Ex: Vendido, Em Obra, Disponível"
                      style={{
                        width: '100%',
                        padding: `${spacing[3]} ${spacing[4]}`,
                        border: `1px solid ${colors.gray[300]}`,
                        borderRadius: radius.md,
                        fontSize: typography.fontSize.base,
                        outline: 'none',
                        transition: 'border-color 0.2s',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.gray[300];
                      }}
                    />
                  </div>

                  {/* Image Upload */}
                  <ImageUpload
                    value={formData.image}
                    onChange={(url) => setFormData({ ...formData, image: url })}
                    bucket="projects"
                    label="Imagem do Projeto"
                  />

                  {/* Metrics Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: spacing[3] }}>
                    {/* ROI */}
                    <div>
                      <label
                        htmlFor="project-roi"
                        style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.gray[700],
                          marginBottom: spacing[2],
                        }}
                      >
                        ROI
                      </label>
                      <input
                        id="project-roi"
                        type="text"
                        value={formData.roi}
                        onChange={(e) => setFormData({ ...formData, roi: e.target.value })}
                        placeholder="+32%"
                        style={{
                          width: '100%',
                          padding: `${spacing[2]} ${spacing[3]}`,
                          border: `1px solid ${colors.gray[300]}`,
                          borderRadius: radius.md,
                          fontSize: typography.fontSize.sm,
                          outline: 'none',
                        }}
                      />
                    </div>

                    {/* Area */}
                    <div>
                      <label
                        htmlFor="project-area"
                        style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.gray[700],
                          marginBottom: spacing[2],
                        }}
                      >
                        Área
                      </label>
                      <input
                        id="project-area"
                        type="text"
                        value={formData.area}
                        onChange={(e) => setFormData({ ...formData, area: e.target.value })}
                        placeholder="95 m²"
                        style={{
                          width: '100%',
                          padding: `${spacing[2]} ${spacing[3]}`,
                          border: `1px solid ${colors.gray[300]}`,
                          borderRadius: radius.md,
                          fontSize: typography.fontSize.sm,
                          outline: 'none',
                        }}
                      />
                    </div>

                    {/* Bedrooms */}
                    <div>
                      <label
                        htmlFor="project-bedrooms"
                        style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.gray[700],
                          marginBottom: spacing[2],
                        }}
                      >
                        Quartos
                      </label>
                      <input
                        id="project-bedrooms"
                        type="number"
                        min="0"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                        style={{
                          width: '100%',
                          padding: `${spacing[2]} ${spacing[3]}`,
                          border: `1px solid ${colors.gray[300]}`,
                          borderRadius: radius.md,
                          fontSize: typography.fontSize.sm,
                          outline: 'none',
                        }}
                      />
                    </div>

                    {/* Bathrooms */}
                    <div>
                      <label
                        htmlFor="project-bathrooms"
                        style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.gray[700],
                          marginBottom: spacing[2],
                        }}
                      >
                        Casas de Banho
                      </label>
                      <input
                        id="project-bathrooms"
                        type="number"
                        min="0"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({ ...formData, bathrooms: parseInt(e.target.value) || 0 })}
                        style={{
                          width: '100%',
                          padding: `${spacing[2]} ${spacing[3]}`,
                          border: `1px solid ${colors.gray[300]}`,
                          borderRadius: radius.md,
                          fontSize: typography.fontSize.sm,
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Financial Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing[3] }}>
                    {/* Price */}
                    <div>
                      <label
                        htmlFor="project-price"
                        style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.gray[700],
                          marginBottom: spacing[2],
                        }}
                      >
                        Preço de Venda
                      </label>
                      <input
                        id="project-price"
                        type="text"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        placeholder="€420.000"
                        style={{
                          width: '100%',
                          padding: `${spacing[2]} ${spacing[3]}`,
                          border: `1px solid ${colors.gray[300]}`,
                          borderRadius: radius.md,
                          fontSize: typography.fontSize.sm,
                          outline: 'none',
                        }}
                      />
                    </div>

                    {/* Investment */}
                    <div>
                      <label
                        htmlFor="project-investment"
                        style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.gray[700],
                          marginBottom: spacing[2],
                        }}
                      >
                        Investimento
                      </label>
                      <input
                        id="project-investment"
                        type="text"
                        value={formData.investment}
                        onChange={(e) => setFormData({ ...formData, investment: e.target.value })}
                        placeholder="€318.000"
                        style={{
                          width: '100%',
                          padding: `${spacing[2]} ${spacing[3]}`,
                          border: `1px solid ${colors.gray[300]}`,
                          borderRadius: radius.md,
                          fontSize: typography.fontSize.sm,
                          outline: 'none',
                        }}
                      />
                    </div>

                    {/* Timeline */}
                    <div>
                      <label
                        htmlFor="project-timeline"
                        style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.gray[700],
                          marginBottom: spacing[2],
                        }}
                      >
                        Prazo
                      </label>
                      <input
                        id="project-timeline"
                        type="text"
                        value={formData.timeline}
                        onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                        placeholder="9 meses"
                        style={{
                          width: '100%',
                          padding: `${spacing[2]} ${spacing[3]}`,
                          border: `1px solid ${colors.gray[300]}`,
                          borderRadius: radius.md,
                          fontSize: typography.fontSize.sm,
                          outline: 'none',
                        }}
                      />
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label
                      htmlFor="project-description"
                      style={{
                        display: 'block',
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.gray[700],
                        marginBottom: spacing[2],
                      }}
                    >
                      Descrição
                    </label>
                    <textarea
                      id="project-description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Descrição detalhada do projeto..."
                      rows={4}
                      style={{
                        width: '100%',
                        padding: `${spacing[3]} ${spacing[4]}`,
                        border: `1px solid ${colors.gray[300]}`,
                        borderRadius: radius.md,
                        fontSize: typography.fontSize.base,
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.gray[300];
                      }}
                    />
                  </div>

                  {/* Highlights */}
                  <div>
                    <label
                      htmlFor="project-highlights"
                      style={{
                        display: 'block',
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.gray[700],
                        marginBottom: spacing[2],
                      }}
                    >
                      Destaques do Projeto
                    </label>
                    <textarea
                      id="project-highlights"
                      value={formData.highlights}
                      onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                      placeholder="Um destaque por linha. Ex:&#10;Restauro de fachada histórica&#10;Certificação energética A&#10;Localização premium"
                      rows={6}
                      style={{
                        width: '100%',
                        padding: `${spacing[3]} ${spacing[4]}`,
                        border: `1px solid ${colors.gray[300]}`,
                        borderRadius: radius.md,
                        fontSize: typography.fontSize.base,
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.gray[300];
                      }}
                    />
                    <p style={{ fontSize: typography.fontSize.xs, color: colors.gray[500], marginTop: spacing[1] }}>
                      Digite um destaque por linha. Serão exibidos como lista com ícones de check na página de detalhes.
                    </p>
                  </div>

                  {/* Timeline Phases */}
                  <div>
                    <label
                      htmlFor="project-timeline-phases"
                      style={{
                        display: 'block',
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.gray[700],
                        marginBottom: spacing[2],
                      }}
                    >
                      Timeline do Projeto (Fases)
                    </label>
                    <textarea
                      id="project-timeline-phases"
                      value={formData.timelinePhases || ''}
                      onChange={(e) => setFormData({ ...formData, timelinePhases: e.target.value })}
                      placeholder="Uma fase por linha no formato: Fase|Duração|Status&#10;Ex:&#10;Aquisição|1 mês|completed&#10;Licenciamento|2 meses|completed&#10;Obra Estrutural|3 meses|in-progress&#10;Acabamentos|1.5 meses|pending&#10;Comercialização|0.5 meses|pending"
                      rows={7}
                      style={{
                        width: '100%',
                        padding: `${spacing[3]} ${spacing[4]}`,
                        border: `1px solid ${colors.gray[300]}`,
                        borderRadius: radius.md,
                        fontSize: typography.fontSize.sm,
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'monospace',
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.borderColor = colors.primary;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.borderColor = colors.gray[300];
                      }}
                    />
                    <p style={{ fontSize: typography.fontSize.xs, color: colors.gray[500], marginTop: spacing[1] }}>
                      <strong>Formato:</strong> Fase|Duração|Status (separados por |)<br />
                      <strong>Status possíveis:</strong> completed (verde), in-progress (amarelo), pending (cinza)
                    </p>
                  </div>

                  {/* Links Section */}
                  <div style={{ 
                    marginTop: spacing[4], 
                    paddingTop: spacing[4], 
                    borderTop: `2px solid ${colors.gray[200]}` 
                  }}>
                    <h3 style={{ 
                      fontSize: typography.fontSize.lg, 
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.gray[900],
                      marginBottom: spacing[4]
                    }}>
                      Links Externos
                    </h3>

                    {/* Portal Link (Idealista) */}
                    <div style={{ marginBottom: spacing[4] }}>
                      <label
                        htmlFor="project-portal-link"
                        style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.gray[700],
                          marginBottom: spacing[2],
                        }}
                      >
                        Link do Portal (Idealista, etc.)
                      </label>
                      <input
                        id="project-portal-link"
                        type="url"
                        value={formData.portalLink || ''}
                        onChange={(e) => setFormData({ ...formData, portalLink: e.target.value })}
                        placeholder="https://www.idealista.pt/imovel/..."
                        style={{
                          width: '100%',
                          padding: `${spacing[3]} ${spacing[4]}`,
                          border: `1px solid ${colors.gray[300]}`,
                          borderRadius: radius.md,
                          fontSize: typography.fontSize.base,
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = colors.primary;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = colors.gray[300];
                        }}
                      />
                      <p style={{ fontSize: typography.fontSize.xs, color: colors.gray[500], marginTop: spacing[1] }}>
                        Link completo do anúncio no Idealista ou outro portal imobiliário
                      </p>
                    </div>

                    {/* Brochure Link */}
                    <div>
                      <label
                        htmlFor="project-brochure-link"
                        style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.gray[700],
                          marginBottom: spacing[2],
                        }}
                      >
                        Link da Brochura (PDF)
                      </label>
                      <input
                        id="project-brochure-link"
                        type="url"
                        value={formData.brochureLink || ''}
                        onChange={(e) => setFormData({ ...formData, brochureLink: e.target.value })}
                        placeholder="https://exemplo.com/brochura.pdf"
                        style={{
                          width: '100%',
                          padding: `${spacing[3]} ${spacing[4]}`,
                          border: `1px solid ${colors.gray[300]}`,
                          borderRadius: radius.md,
                          fontSize: typography.fontSize.base,
                          outline: 'none',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = colors.primary;
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = colors.gray[300];
                        }}
                      />
                      <p style={{ fontSize: typography.fontSize.xs, color: colors.gray[500], marginTop: spacing[1] }}>
                        Link para download da brochura do projeto (opcional)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div
                  style={{
                    display: 'flex',
                    gap: spacing[3],
                    justifyContent: 'flex-end',
                    marginTop: spacing[6],
                    paddingTop: spacing[6],
                    borderTop: `1px solid ${colors.gray[200]}`,
                  }}
                >
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    style={{
                      padding: `${spacing[3]} ${spacing[6]}`,
                      border: `1px solid ${colors.gray[300]}`,
                      borderRadius: radius.md,
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.medium,
                      color: colors.gray[700],
                      background: colors.white,
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = colors.gray[50];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = colors.white;
                    }}
                  >
                    Cancelar
                  </button>

                  <button
                    type="submit"
                    disabled={isSaving}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[2],
                      padding: `${spacing[3]} ${spacing[6]}`,
                      border: 'none',
                      borderRadius: radius.md,
                      fontSize: typography.fontSize.base,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.white,
                      background: colors.primary,
                      cursor: isSaving ? 'not-allowed' : 'pointer',
                      opacity: isSaving ? 0.7 : 1,
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={(e) => {
                      if (!isSaving) {
                        e.currentTarget.style.background = colors.primaryHover;
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = colors.primary;
                    }}
                  >
                    {isSaving ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: 'linear' }}
                        >
                          <AlertCircle size={18} aria-hidden="true" />
                        </motion.div>
                        Salvando...
                      </>
                    ) : (
                      <>
                        <Save size={18} aria-hidden="true" />
                        {editingProject ? 'Atualizar Projeto' : 'Criar Projeto'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
