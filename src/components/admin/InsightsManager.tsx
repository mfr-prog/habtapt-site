// InsightsManager - Editor Completo de Insights com Conteúdo Estruturado
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Plus,
  Edit,
  Trash2,
  Save,
  X,
  BookOpen,
  TrendingUp,
  Building2,
  Leaf,
  Clock,
  ArrowUp,
  ArrowDown,
  MessageSquare,
  CheckCircle,
  Type,
  List,
} from '../icons';
import { toast } from 'sonner';
import { colors as utilColors, spacing, radius, shadows, typography } from '../../utils/styles';

// Helper: remap colors.neutral to colors.gray for consistency
const colors = {
  ...utilColors,
  neutral: {
    white: utilColors.white,
    black: utilColors.black,
    50: utilColors.gray[50],
    100: utilColors.gray[100],
    200: utilColors.gray[200],
    300: utilColors.gray[300],
    400: utilColors.gray[400],
    500: utilColors.gray[500],
    600: utilColors.gray[600],
    700: utilColors.gray[700],
    800: utilColors.gray[800],
    900: utilColors.gray[900],
  },
};
import { designSystem } from '../design-system';
import { AnimatedButton } from '../primitives/AnimatedButton';
import { supabaseFetch } from '../../utils/supabase/client';
import { ImageUpload } from './ImageUpload';
import { createPortal } from 'react-dom';

type InsightCategory = 'Investimento' | 'Regulamentação' | 'Sustentabilidade' | 'Mercado';
type ContentBlockType = 'heading2' | 'heading3' | 'paragraph' | 'list' | 'callout';

interface ContentBlock {
  id: string;
  type: ContentBlockType;
  content: string | string[];
}

interface Insight {
  id: string;
  title: string;
  description: string;
  category: InsightCategory;
  readTime: string;
  icon: 'TrendingUp' | 'Building2' | 'Leaf' | 'BookOpen';
  iconColor: string;
  gradient: string;
  author?: string;
  authorRole?: string;
  date?: string;
  excerpt?: string;
  image?: string;
  tags?: string[];
  contentBlocks?: ContentBlock[];
  relatedInsights?: string[];
  createdAt?: string;
  updatedAt?: string;
  timestamp?: number;
}

interface InsightsManagerProps {
  insights: Insight[];
  onRefresh: () => void;
  isLoading: boolean;
}

export function InsightsManager({ insights, onRefresh, isLoading }: InsightsManagerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingInsight, setEditingInsight] = useState<Insight | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Insight>>({
    title: '',
    description: '',
    category: 'Investimento',
    readTime: '5 min',
    icon: 'TrendingUp',
    iconColor: designSystem.colors.brand.primary,
    gradient: designSystem.colors.gradients.primary,
    author: '',
    authorRole: '',
    date: new Date().toLocaleDateString('pt-PT'),
    excerpt: '',
    image: '',
    tags: [],
    contentBlocks: [],
    relatedInsights: [],
  });

  const handleOpenModal = (insight?: Insight) => {
    if (insight) {
      setEditingInsight(insight);
      setFormData({
        ...insight,
        contentBlocks: insight.contentBlocks || [],
        relatedInsights: insight.relatedInsights || [],
      });
    } else {
      setEditingInsight(null);
      setFormData({
        title: '',
        description: '',
        category: 'Investimento',
        readTime: '5 min',
        icon: 'TrendingUp',
        iconColor: designSystem.colors.brand.primary,
        gradient: designSystem.colors.gradients.primary,
        author: '',
        authorRole: '',
        date: new Date().toLocaleDateString('pt-PT'),
        excerpt: '',
        image: '',
        tags: [],
        contentBlocks: [],
        relatedInsights: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingInsight(null);
  };

  const handleSave = async () => {
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setIsSaving(true);

    try {
      const insightData = {
        ...formData,
        timestamp: Date.now(),
        updatedAt: new Date().toISOString(),
      };

      if (editingInsight) {
        const response = await supabaseFetch(`insights/${editingInsight.id}`, {
          method: 'PUT',
          body: JSON.stringify(insightData),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Erro ao atualizar insight');
        }
        toast.success('Insight atualizado com sucesso!');
      } else {
        const response = await supabaseFetch('insights', {
          method: 'POST',
          body: JSON.stringify({
            ...insightData,
            id: `insight-${Date.now()}`,
            createdAt: new Date().toISOString(),
          }),
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || 'Erro ao criar insight');
        }
        toast.success('Insight criado com sucesso!');
      }

      handleCloseModal();
      onRefresh();
    } catch (error) {
      console.error('[InsightsManager] Erro ao salvar insight:', error);
      toast.error('Erro ao salvar insight. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (insightId: string) => {
    if (!confirm('Tem certeza que deseja excluir este insight?')) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await supabaseFetch(`insights/${insightId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erro ao excluir insight');
      }
      toast.success('Insight excluído com sucesso!');
      onRefresh();
    } catch (error) {
      console.error('Erro ao excluir insight:', error);
      toast.error('Erro ao excluir insight. Tente novamente.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCategoryChange = (category: InsightCategory) => {
    let icon: 'TrendingUp' | 'Building2' | 'Leaf' | 'BookOpen' = 'TrendingUp';
    let iconColor = designSystem.colors.brand.primary;
    let gradient = designSystem.colors.gradients.primary;

    switch (category) {
      case 'Investimento':
        icon = 'TrendingUp';
        iconColor = designSystem.colors.brand.primary;
        gradient = designSystem.colors.gradients.primary;
        break;
      case 'Regulamentação':
        icon = 'Building2';
        iconColor = designSystem.colors.brand.secondary;
        gradient = designSystem.colors.gradients.secondary;
        break;
      case 'Sustentabilidade':
        icon = 'Leaf';
        iconColor = designSystem.colors.brand.accent;
        gradient = designSystem.colors.gradients.accent;
        break;
      case 'Mercado':
        icon = 'BookOpen';
        iconColor = designSystem.colors.brand.primary;
        gradient = designSystem.colors.gradients.primary;
        break;
    }

    setFormData({
      ...formData,
      category,
      icon,
      iconColor,
      gradient,
    });
  };

  // Funções para gerenciar blocos de conteúdo
  const addContentBlock = (type: ContentBlockType) => {
    const newBlock: ContentBlock = {
      id: `block-${Date.now()}`,
      type,
      content: type === 'list' ? [''] : '',
    };
    setFormData({
      ...formData,
      contentBlocks: [...(formData.contentBlocks || []), newBlock],
    });
  };

  const updateContentBlock = (blockId: string, content: string | string[]) => {
    setFormData({
      ...formData,
      contentBlocks: formData.contentBlocks?.map(block =>
        block.id === blockId ? { ...block, content } : block
      ),
    });
  };

  const deleteContentBlock = (blockId: string) => {
    setFormData({
      ...formData,
      contentBlocks: formData.contentBlocks?.filter(block => block.id !== blockId),
    });
  };

  const moveContentBlock = (blockId: string, direction: 'up' | 'down') => {
    const blocks = formData.contentBlocks || [];
    const index = blocks.findIndex(b => b.id === blockId);
    if (index === -1) return;

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= blocks.length) return;

    const newBlocks = [...blocks];
    [newBlocks[index], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[index]];
    
    setFormData({
      ...formData,
      contentBlocks: newBlocks,
    });
  };

  const addListItem = (blockId: string) => {
    setFormData({
      ...formData,
      contentBlocks: formData.contentBlocks?.map(block => {
        if (block.id === blockId && Array.isArray(block.content)) {
          return { ...block, content: [...block.content, ''] };
        }
        return block;
      }),
    });
  };

  const updateListItem = (blockId: string, itemIndex: number, value: string) => {
    setFormData({
      ...formData,
      contentBlocks: formData.contentBlocks?.map(block => {
        if (block.id === blockId && Array.isArray(block.content)) {
          const newContent = [...block.content];
          newContent[itemIndex] = value;
          return { ...block, content: newContent };
        }
        return block;
      }),
    });
  };

  const removeListItem = (blockId: string, itemIndex: number) => {
    setFormData({
      ...formData,
      contentBlocks: formData.contentBlocks?.map(block => {
        if (block.id === blockId && Array.isArray(block.content)) {
          return { ...block, content: block.content.filter((_, i) => i !== itemIndex) };
        }
        return block;
      }),
    });
  };

  // Renderizar preview de bloco
  const renderBlockPreview = (block: ContentBlock) => {
    const category = formData.category || 'Investimento';
    const categoryColors = {
      'Investimento': designSystem.colors.brand.primary,
      'Regulamentação': designSystem.colors.brand.secondary,
      'Sustentabilidade': designSystem.colors.brand.accent,
      'Mercado': designSystem.colors.brand.primary,
    };
    const categoryColor = categoryColors[category];

    switch (block.type) {
      case 'heading2':
        return (
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: typography.fontWeight.black,
            color: categoryColor,
            marginBottom: spacing[2],
          }}>
            {block.content as string || 'Título da seção...'}
          </h2>
        );
      case 'heading3':
        return (
          <h3 style={{ 
            fontSize: '1.25rem', 
            fontWeight: typography.fontWeight.bold,
            color: categoryColor,
            marginBottom: spacing[2],
          }}>
            {block.content as string || 'Subtítulo...'}
          </h3>
        );
      case 'paragraph':
        return (
          <p style={{ 
            fontSize: typography.fontSize.base,
            color: colors.neutral[700],
            lineHeight: 1.6,
          }}>
            {block.content as string || 'Parágrafo de texto...'}
          </p>
        );
      case 'list':
        return (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {(block.content as string[]).map((item, i) => (
              <li key={i} style={{ 
                display: 'flex', 
                gap: spacing[2], 
                marginBottom: spacing[2],
                padding: spacing[2],
                background: colors.neutral[50],
                borderRadius: radius.md,
              }}>
                <CheckCircle size={18} style={{ color: categoryColor, flexShrink: 0 }} />
                <span style={{ color: colors.neutral[700] }}>{item || `Item ${i + 1}...`}</span>
              </li>
            ))}
          </ul>
        );
      case 'callout':
        return (
          <div style={{
            padding: spacing[4],
            background: designSystem.helpers.hexToRgba(categoryColor, 0.08),
            border: `2px solid ${categoryColor}`,
            borderRadius: radius.lg,
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute',
              top: '-10px',
              left: spacing[4],
              padding: `${spacing[1]} ${spacing[2]}`,
              background: categoryColor,
              color: colors.neutral.white,
              borderRadius: radius.full,
              fontSize: typography.fontSize.xs,
              fontWeight: typography.fontWeight.bold,
              textTransform: 'uppercase',
            }}>
              Destaque
            </div>
            <p style={{ 
              color: categoryColor, 
              fontStyle: 'italic',
              fontWeight: typography.fontWeight.medium,
            }}>
              {block.content as string || 'Texto em destaque...'}
            </p>
          </div>
        );
    }
  };

  return (
    <div>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing[6],
      }}>
        <div>
          <h2 style={{
            fontSize: typography.fontSize['2xl'],
            fontWeight: typography.fontWeight.bold,
            color: colors.neutral[900],
            marginBottom: spacing[1],
          }}>
            Insights & Artigos
          </h2>
          <p style={{ color: colors.neutral[600], fontSize: typography.fontSize.sm }}>
            Gerencie os artigos completos com conteúdo estruturado
          </p>
        </div>

        <AnimatedButton
          onClick={() => handleOpenModal()}
          style={{
            background: designSystem.colors.brand.secondary,
            color: designSystem.colors.neutral.white,
            display: 'flex',
            alignItems: 'center',
            gap: spacing[2],
          }}
        >
          <Plus size={18} />
          Novo Insight
        </AnimatedButton>
      </div>

      {/* Lista de Insights */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: spacing[6],
      }}>
        {insights.map((insight) => {
          const IconComponent = 
            insight.icon === 'TrendingUp' ? TrendingUp :
            insight.icon === 'Building2' ? Building2 :
            insight.icon === 'Leaf' ? Leaf : BookOpen;

          return (
            <motion.div
              key={insight.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                background: colors.neutral.white,
                borderRadius: radius['2xl'],
                border: `1px solid ${colors.neutral[200]}`,
                boxShadow: shadows.sm,
                overflow: 'hidden',
                transition: 'all 0.3s',
              }}
            >
              <div style={{
                padding: spacing[6],
                background: designSystem.helpers.hexToRgba(insight.iconColor, 0.05),
              }}>
                <div style={{
                  display: 'inline-flex',
                  padding: spacing[4],
                  borderRadius: radius.xl,
                  background: insight.gradient,
                  marginBottom: spacing[4],
                  boxShadow: `0 8px 20px ${designSystem.helpers.hexToRgba(insight.iconColor, 0.3)}`,
                }}>
                  <IconComponent size={28} style={{ color: colors.neutral.white }} />
                </div>

                <div style={{ display: 'flex', gap: spacing[2], marginBottom: spacing[3] }}>
                  <span style={{
                    padding: `${spacing[1]} ${spacing[3]}`,
                    borderRadius: radius.full,
                    background: designSystem.helpers.hexToRgba(insight.iconColor, 0.12),
                    color: insight.iconColor,
                    border: `1.5px solid ${designSystem.helpers.hexToRgba(insight.iconColor, 0.25)}`,
                    fontSize: typography.fontSize.xs,
                    fontWeight: typography.fontWeight.bold,
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}>
                    {insight.category}
                  </span>
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: spacing[1],
                    fontSize: typography.fontSize.sm,
                    color: colors.neutral[600],
                  }}>
                    <Clock size={14} />
                    {insight.readTime}
                  </span>
                </div>
              </div>

              <div style={{ padding: spacing[6], paddingTop: spacing[4] }}>
                <h3 style={{
                  fontSize: typography.fontSize.lg,
                  fontWeight: typography.fontWeight.bold,
                  color: colors.neutral[900],
                  marginBottom: spacing[3],
                  lineHeight: 1.4,
                }}>
                  {insight.title}
                </h3>

                <p style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.neutral[600],
                  lineHeight: 1.6,
                  marginBottom: spacing[4],
                }}>
                  {insight.description}
                </p>

                <div style={{ display: 'flex', gap: spacing[2] }}>
                  <AnimatedButton
                    onClick={() => handleOpenModal(insight)}
                    variant="outline"
                    style={{
                      flex: 1,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: spacing[2],
                    }}
                  >
                    <Edit size={16} />
                    Editar
                  </AnimatedButton>

                  <AnimatedButton
                    onClick={() => handleDelete(insight.id)}
                    disabled={isDeleting}
                    variant="outline"
                    style={{
                      color: designSystem.colors.semantic.error,
                      borderColor: designSystem.colors.semantic.error,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: spacing[2],
                    }}
                  >
                    <Trash2 size={16} />
                    Excluir
                  </AnimatedButton>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Empty State */}
      {insights.length === 0 && !isLoading && (
        <div style={{
          textAlign: 'center',
          padding: spacing[16],
          color: colors.neutral[500],
        }}>
          <BookOpen size={48} style={{ margin: '0 auto', marginBottom: spacing[4], opacity: 0.5 }} />
          <p style={{ fontSize: typography.fontSize.lg, marginBottom: spacing[2] }}>
            Nenhum insight cadastrado
          </p>
          <p style={{ fontSize: typography.fontSize.sm }}>
            Clique em "Novo Insight" para começar
          </p>
        </div>
      )}

      {/* Modal de Edição - Renderizado via Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
                style={{
                  position: 'fixed',
                  inset: 0,
                  background: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 999998,
                  backdropFilter: 'blur(4px)',
                }}
              />

            <div
              style={{
                position: 'fixed',
                top: '5vh',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '95%',
                maxWidth: '1200px',
                height: '90vh',
                zIndex: 999999,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                style={{
                  width: '100%',
                  height: '100%',
                  background: colors.neutral.white,
                  borderRadius: radius['2xl'],
                  boxShadow: shadows['2xl'],
                  overflow: 'hidden',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Header */}
                <div style={{
                  padding: spacing[6],
                  borderBottom: `1px solid ${colors.neutral[200]}`,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.05),
                }}>
                  <h3 style={{
                    fontSize: typography.fontSize.xl,
                    fontWeight: typography.fontWeight.bold,
                    color: colors.neutral[900],
                  }}>
                    {editingInsight ? 'Editar Insight' : 'Novo Insight'}
                  </h3>
                  <button
                    onClick={handleCloseModal}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      padding: spacing[2],
                      borderRadius: radius.md,
                    }}
                  >
                    <X size={20} style={{ color: colors.neutral[600] }} />
                  </button>
                </div>

                {/* Content - 2 colunas */}
                <div style={{
                  flex: 1,
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: spacing[6],
                  padding: spacing[6],
                  overflowY: 'auto',
                  minHeight: 0,
                }}>
                  {/* COLUNA ESQUERDA - Form */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                    <h4 style={{ 
                      fontSize: typography.fontSize.lg, 
                      fontWeight: typography.fontWeight.bold,
                      color: colors.neutral[800],
                      marginBottom: spacing[2],
                    }}>
                      Informações Básicas
                    </h4>

                    {/* Título */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.neutral[700],
                        marginBottom: spacing[2],
                      }}>
                        Título *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Título do insight..."
                        style={{
                          width: '100%',
                          padding: spacing[3],
                          border: `1px solid ${colors.neutral[300]}`,
                          borderRadius: radius.lg,
                          fontSize: typography.fontSize.sm,
                        }}
                      />
                    </div>

                    {/* Descrição Curta */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.neutral[700],
                        marginBottom: spacing[2],
                      }}>
                        Descrição Curta *
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Breve descrição (aparece nos cards)"
                        rows={2}
                        style={{
                          width: '100%',
                          padding: spacing[3],
                          border: `1px solid ${colors.neutral[300]}`,
                          borderRadius: radius.lg,
                          fontSize: typography.fontSize.sm,
                          resize: 'vertical',
                        }}
                      />
                    </div>

                    {/* Resumo Estendido */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.neutral[700],
                        marginBottom: spacing[2],
                      }}>
                        Resumo Estendido
                      </label>
                      <textarea
                        value={formData.excerpt || ''}
                        onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                        placeholder="Resumo que aparece no topo do artigo"
                        rows={3}
                        style={{
                          width: '100%',
                          padding: spacing[3],
                          border: `1px solid ${colors.neutral[300]}`,
                          borderRadius: radius.lg,
                          fontSize: typography.fontSize.sm,
                          resize: 'vertical',
                        }}
                      />
                    </div>

                    {/* Grid 2 colunas */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: spacing[4] }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.neutral[700],
                          marginBottom: spacing[2],
                        }}>
                          Autor
                        </label>
                        <input
                          type="text"
                          value={formData.author || ''}
                          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                          placeholder="Nome do autor"
                          style={{
                            width: '100%',
                            padding: spacing[3],
                            border: `1px solid ${colors.neutral[300]}`,
                            borderRadius: radius.lg,
                            fontSize: typography.fontSize.sm,
                          }}
                        />
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.neutral[700],
                          marginBottom: spacing[2],
                        }}>
                          Cargo/Especialidade
                        </label>
                        <input
                          type="text"
                          value={formData.authorRole || ''}
                          onChange={(e) => setFormData({ ...formData, authorRole: e.target.value })}
                          placeholder="Ex: Especialista em..."
                          style={{
                            width: '100%',
                            padding: spacing[3],
                            border: `1px solid ${colors.neutral[300]}`,
                            borderRadius: radius.lg,
                            fontSize: typography.fontSize.sm,
                          }}
                        />
                      </div>
                    </div>

                    {/* Grid 3 colunas */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: spacing[3] }}>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.neutral[700],
                          marginBottom: spacing[2],
                        }}>
                          Categoria *
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => handleCategoryChange(e.target.value as InsightCategory)}
                          style={{
                            width: '100%',
                            padding: spacing[3],
                            border: `1px solid ${colors.neutral[300]}`,
                            borderRadius: radius.lg,
                            fontSize: typography.fontSize.sm,
                            background: colors.neutral.white,
                          }}
                        >
                          <option value="Investimento">Investimento</option>
                          <option value="Regulamentação">Regulamentação</option>
                          <option value="Sustentabilidade">Sustentabilidade</option>
                          <option value="Mercado">Mercado</option>
                        </select>
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.neutral[700],
                          marginBottom: spacing[2],
                        }}>
                          Data
                        </label>
                        <input
                          type="text"
                          value={formData.date || ''}
                          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                          placeholder="Ex: 15 Jan 2024"
                          style={{
                            width: '100%',
                            padding: spacing[3],
                            border: `1px solid ${colors.neutral[300]}`,
                            borderRadius: radius.lg,
                            fontSize: typography.fontSize.sm,
                          }}
                        />
                      </div>

                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.medium,
                          color: colors.neutral[700],
                          marginBottom: spacing[2],
                        }}>
                          Tempo
                        </label>
                        <input
                          type="text"
                          value={formData.readTime}
                          onChange={(e) => setFormData({ ...formData, readTime: e.target.value })}
                          placeholder="Ex: 7 min"
                          style={{
                            width: '100%',
                            padding: spacing[3],
                            border: `1px solid ${colors.neutral[300]}`,
                            borderRadius: radius.lg,
                            fontSize: typography.fontSize.sm,
                          }}
                        />
                      </div>
                    </div>

                    {/* Imagem Hero - Upload */}
                    <ImageUpload
                      value={formData.image || ''}
                      onChange={(url) => setFormData({ ...formData, image: url })}
                      bucket="insights"
                      label="Imagem Hero do Insight"
                    />

                    {/* Tags */}
                    <div>
                      <label style={{
                        display: 'block',
                        fontSize: typography.fontSize.sm,
                        fontWeight: typography.fontWeight.medium,
                        color: colors.neutral[700],
                        marginBottom: spacing[2],
                      }}>
                        Tags (separadas por vírgula)
                      </label>
                      <input
                        type="text"
                        value={formData.tags?.join(', ') || ''}
                        onChange={(e) => setFormData({ 
                          ...formData, 
                          tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean) 
                        })}
                        placeholder="Sustentabilidade, Eficiência Energética, ROI"
                        style={{
                          width: '100%',
                          padding: spacing[3],
                          border: `1px solid ${colors.neutral[300]}`,
                          borderRadius: radius.lg,
                          fontSize: typography.fontSize.sm,
                        }}
                      />
                    </div>

                    <hr style={{ border: 'none', borderTop: `1px solid ${colors.neutral[200]}`, margin: `${spacing[4]} 0` }} />

                    {/* Editor de Conteúdo */}
                    <div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center',
                        marginBottom: spacing[4],
                      }}>
                        <h4 style={{ 
                          fontSize: typography.fontSize.lg, 
                          fontWeight: typography.fontWeight.bold,
                          color: colors.neutral[800],
                        }}>
                          Conteúdo do Artigo
                        </h4>
                      </div>

                      {/* Botões para adicionar blocos */}
                      <div style={{ 
                        display: 'flex', 
                        gap: spacing[2], 
                        marginBottom: spacing[4],
                        flexWrap: 'wrap',
                      }}>
                        <button
                          onClick={() => addContentBlock('heading2')}
                          style={{
                            padding: `${spacing[2]} ${spacing[3]}`,
                            background: colors.neutral[100],
                            border: `1px solid ${colors.neutral[300]}`,
                            borderRadius: radius.md,
                            fontSize: typography.fontSize.sm,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing[2],
                          }}
                        >
                          <Type size={16} />
                          Título H2
                        </button>
                        <button
                          onClick={() => addContentBlock('heading3')}
                          style={{
                            padding: `${spacing[2]} ${spacing[3]}`,
                            background: colors.neutral[100],
                            border: `1px solid ${colors.neutral[300]}`,
                            borderRadius: radius.md,
                            fontSize: typography.fontSize.sm,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing[2],
                          }}
                        >
                          <Type size={14} />
                          Subtítulo H3
                        </button>
                        <button
                          onClick={() => addContentBlock('paragraph')}
                          style={{
                            padding: `${spacing[2]} ${spacing[3]}`,
                            background: colors.neutral[100],
                            border: `1px solid ${colors.neutral[300]}`,
                            borderRadius: radius.md,
                            fontSize: typography.fontSize.sm,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing[2],
                          }}
                        >
                          <Type size={12} />
                          Parágrafo
                        </button>
                        <button
                          onClick={() => addContentBlock('list')}
                          style={{
                            padding: `${spacing[2]} ${spacing[3]}`,
                            background: colors.neutral[100],
                            border: `1px solid ${colors.neutral[300]}`,
                            borderRadius: radius.md,
                            fontSize: typography.fontSize.sm,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing[2],
                          }}
                        >
                          <List size={16} />
                          Lista
                        </button>
                        <button
                          onClick={() => addContentBlock('callout')}
                          style={{
                            padding: `${spacing[2]} ${spacing[3]}`,
                            background: colors.neutral[100],
                            border: `1px solid ${colors.neutral[300]}`,
                            borderRadius: radius.md,
                            fontSize: typography.fontSize.sm,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: spacing[2],
                          }}
                        >
                          <MessageSquare size={16} />
                          Destaque
                        </button>
                      </div>

                      {/* Blocos de conteúdo */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[3] }}>
                        {(formData.contentBlocks || []).map((block, index) => (
                          <div
                            key={block.id}
                            style={{
                              padding: spacing[4],
                              background: colors.neutral[50],
                              border: `1px solid ${colors.neutral[200]}`,
                              borderRadius: radius.lg,
                            }}
                          >
                            {/* Header do bloco */}
                            <div style={{ 
                              display: 'flex', 
                              justifyContent: 'space-between', 
                              marginBottom: spacing[3],
                            }}>
                              <span style={{ 
                                fontSize: typography.fontSize.xs,
                                fontWeight: typography.fontWeight.bold,
                                color: colors.neutral[600],
                                textTransform: 'uppercase',
                              }}>
                                {block.type === 'heading2' ? 'Título H2' :
                                 block.type === 'heading3' ? 'Subtítulo H3' :
                                 block.type === 'paragraph' ? 'Parágrafo' :
                                 block.type === 'list' ? 'Lista' : 'Destaque'}
                              </span>
                              <div style={{ display: 'flex', gap: spacing[2] }}>
                                {index > 0 && (
                                  <button
                                    onClick={() => moveContentBlock(block.id, 'up')}
                                    style={{
                                      padding: spacing[1],
                                      background: 'transparent',
                                      border: 'none',
                                      cursor: 'pointer',
                                      color: colors.neutral[600],
                                    }}
                                  >
                                    <ArrowUp size={16} />
                                  </button>
                                )}
                                {index < (formData.contentBlocks || []).length - 1 && (
                                  <button
                                    onClick={() => moveContentBlock(block.id, 'down')}
                                    style={{
                                      padding: spacing[1],
                                      background: 'transparent',
                                      border: 'none',
                                      cursor: 'pointer',
                                      color: colors.neutral[600],
                                    }}
                                  >
                                    <ArrowDown size={16} />
                                  </button>
                                )}
                                <button
                                  onClick={() => deleteContentBlock(block.id)}
                                  style={{
                                    padding: spacing[1],
                                    background: 'transparent',
                                    border: 'none',
                                    cursor: 'pointer',
                                    color: colors.error,
                                  }}
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>

                            {/* Input do bloco */}
                            {block.type === 'list' ? (
                              <div>
                                {(block.content as string[]).map((item, itemIndex) => (
                                  <div key={itemIndex} style={{ 
                                    display: 'flex', 
                                    gap: spacing[2], 
                                    marginBottom: spacing[2],
                                  }}>
                                    <input
                                      type="text"
                                      value={item}
                                      onChange={(e) => updateListItem(block.id, itemIndex, e.target.value)}
                                      placeholder={`Item ${itemIndex + 1}`}
                                      style={{
                                        flex: 1,
                                        padding: spacing[2],
                                        border: `1px solid ${colors.neutral[300]}`,
                                        borderRadius: radius.md,
                                        fontSize: typography.fontSize.sm,
                                      }}
                                    />
                                    <button
                                      onClick={() => removeListItem(block.id, itemIndex)}
                                      style={{
                                        padding: spacing[2],
                                        background: 'transparent',
                                        border: 'none',
                                        cursor: 'pointer',
                                        color: colors.error,
                                      }}
                                    >
                                      <X size={16} />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => addListItem(block.id)}
                                  style={{
                                    padding: `${spacing[1]} ${spacing[3]}`,
                                    background: colors.neutral.white,
                                    border: `1px solid ${colors.neutral[300]}`,
                                    borderRadius: radius.md,
                                    fontSize: typography.fontSize.sm,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: spacing[1],
                                  }}
                                >
                                  <Plus size={14} />
                                  Adicionar item
                                </button>
                              </div>
                            ) : (
                              <textarea
                                value={block.content as string}
                                onChange={(e) => updateContentBlock(block.id, e.target.value)}
                                placeholder={
                                  block.type === 'heading2' ? 'Título da seção...' :
                                  block.type === 'heading3' ? 'Subtítulo...' :
                                  block.type === 'callout' ? 'Texto em destaque...' :
                                  'Parágrafo de texto...'
                                }
                                rows={block.type === 'paragraph' ? 4 : block.type === 'callout' ? 3 : 1}
                                style={{
                                  width: '100%',
                                  padding: spacing[3],
                                  border: `1px solid ${colors.neutral[300]}`,
                                  borderRadius: radius.md,
                                  fontSize: typography.fontSize.sm,
                                  resize: 'vertical',
                                }}
                              />
                            )}
                          </div>
                        ))}
                      </div>

                      {(formData.contentBlocks || []).length === 0 && (
                        <p style={{ 
                          textAlign: 'center', 
                          color: colors.neutral[500],
                          fontSize: typography.fontSize.sm,
                          padding: spacing[8],
                        }}>
                          Nenhum bloco de conteúdo adicionado. Clique nos botões acima para começar.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* COLUNA DIREITA - Preview */}
                  <div style={{
                    background: colors.neutral[50],
                    padding: spacing[6],
                    borderRadius: radius.xl,
                    border: `1px solid ${colors.neutral[200]}`,
                    overflow: 'auto',
                  }}>
                    <h4 style={{ 
                      fontSize: typography.fontSize.lg, 
                      fontWeight: typography.fontWeight.bold,
                      color: colors.neutral[800],
                      marginBottom: spacing[4],
                    }}>
                      Preview do Artigo
                    </h4>

                    {/* Preview da imagem */}
                    {formData.image && (
                      <div style={{
                        width: '100%',
                        height: '200px',
                        borderRadius: radius.lg,
                        overflow: 'hidden',
                        marginBottom: spacing[6],
                        background: colors.neutral[200],
                      }}>
                        <img 
                          src={formData.image} 
                          alt="Preview" 
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="200" height="200"%3E%3Crect fill="%23ddd" width="200" height="200"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%23999"%3EImagem%3C/text%3E%3C/svg%3E';
                          }}
                        />
                      </div>
                    )}

                    {/* Preview badge e meta */}
                    {formData.category && (
                      <div style={{ marginBottom: spacing[4] }}>
                        <span style={{
                          padding: `${spacing[1]} ${spacing[3]}`,
                          borderRadius: radius.full,
                          background: designSystem.helpers.hexToRgba(formData.iconColor || designSystem.colors.brand.primary, 0.12),
                          color: formData.iconColor,
                          fontSize: typography.fontSize.xs,
                          fontWeight: typography.fontWeight.bold,
                          textTransform: 'uppercase',
                        }}>
                          {formData.category}
                        </span>
                      </div>
                    )}

                    {/* Preview título */}
                    <h1 style={{
                      fontSize: '1.75rem',
                      fontWeight: typography.fontWeight.black,
                      color: formData.iconColor || designSystem.colors.brand.primary,
                      marginBottom: spacing[3],
                      lineHeight: 1.2,
                    }}>
                      {formData.title || 'Título do insight...'}
                    </h1>

                    {/* Preview excerpt */}
                    {formData.excerpt && (
                      <p style={{
                        fontSize: typography.fontSize.base,
                        color: colors.neutral[600],
                        lineHeight: 1.6,
                        marginBottom: spacing[4],
                      }}>
                        {formData.excerpt}
                      </p>
                    )}

                    {/* Preview meta */}
                    <div style={{ 
                      display: 'flex', 
                      gap: spacing[4], 
                      marginBottom: spacing[6],
                      flexWrap: 'wrap',
                      fontSize: typography.fontSize.sm,
                      color: colors.neutral[600],
                    }}>
                      {formData.author && <span>Por {formData.author}</span>}
                      {formData.date && <span>{formData.date}</span>}
                      {formData.readTime && <span>{formData.readTime}</span>}
                    </div>

                    <hr style={{ 
                      border: 'none', 
                      borderTop: `1px solid ${colors.neutral[300]}`, 
                      margin: `${spacing[6]} 0`,
                    }} />

                    {/* Preview dos blocos de conteúdo */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[6] }}>
                      {(formData.contentBlocks || []).map(block => (
                        <div key={block.id}>
                          {renderBlockPreview(block)}
                        </div>
                      ))}
                    </div>

                    {(formData.contentBlocks || []).length === 0 && (
                      <p style={{ 
                        textAlign: 'center', 
                        color: colors.neutral[400],
                        fontSize: typography.fontSize.sm,
                        fontStyle: 'italic',
                        padding: spacing[8],
                      }}>
                        O conteúdo do artigo aparecerá aqui...
                      </p>
                    )}

                    {/* Preview tags */}
                    {formData.tags && formData.tags.length > 0 && (
                      <>
                        <hr style={{ 
                          border: 'none', 
                          borderTop: `1px solid ${colors.neutral[300]}`, 
                          margin: `${spacing[6]} 0`,
                        }} />
                        <div style={{ display: 'flex', gap: spacing[2], flexWrap: 'wrap' }}>
                          {formData.tags.map((tag, i) => (
                            <span
                              key={i}
                              style={{
                                padding: `${spacing[1]} ${spacing[3]}`,
                                background: colors.neutral.white,
                                border: `1px solid ${colors.neutral[300]}`,
                                borderRadius: radius.full,
                                fontSize: typography.fontSize.xs,
                                color: colors.neutral[700],
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div style={{
                  padding: spacing[6],
                  borderTop: `1px solid ${colors.neutral[200]}`,
                  display: 'flex',
                  justifyContent: 'flex-end',
                  gap: spacing[3],
                  background: colors.neutral[50],
                }}>
                  <AnimatedButton
                    onClick={handleCloseModal}
                    variant="outline"
                    style={{
                      padding: `${spacing[3]} ${spacing[6]}`,
                    }}
                  >
                    Cancelar
                  </AnimatedButton>

                  <AnimatedButton
                    onClick={handleSave}
                    disabled={isSaving}
                    style={{
                      background: designSystem.colors.brand.secondary,
                      color: colors.neutral.white,
                      padding: `${spacing[3]} ${spacing[6]}`,
                      display: 'flex',
                      alignItems: 'center',
                      gap: spacing[2],
                    }}
                  >
                    <Save size={18} />
                    {isSaving ? 'Salvando...' : 'Salvar Insight'}
                  </AnimatedButton>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>,
      document.body
    )}
    </div>
  );
}
