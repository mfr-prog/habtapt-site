/**
 * Testimonials Manager - 100% Conformidade Guardião Universal
 */

'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Edit, Trash2, Save, X, Star, User } from '../icons';
import { toast } from 'sonner';
import { colors, spacing, radius, shadows, typography } from '../../utils/styles';
import { AnimatedButton } from '../primitives/AnimatedButton';
import { ImageWithFallback } from '../figma/ImageWithFallback';
import { ImageUpload } from './ImageUpload';
import { supabaseFetch } from '../../utils/supabase/client';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
  project: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
  timestamp?: number;
}

interface TestimonialsManagerProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

export function TestimonialsManager({ onRefresh, isLoading: parentLoading }: TestimonialsManagerProps = {}) {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    role: '',
    company: '',
    image: '',
    content: '',
    rating: 5,
    project: '',
  });

  // Fetch testimonials
  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setIsLoading(true);
    try {
      const response = await supabaseFetch('testimonials', {
        method: 'GET',
      }, 1, true); // isAdmin = true

      if (response.ok) {
        const data = await response.json();
        console.log('[TestimonialsManager] ✅ Depoimentos carregados:', data);
        
        if (data.testimonials && Array.isArray(data.testimonials)) {
          setTestimonials(data.testimonials);
        }
      } else {
        console.warn('[TestimonialsManager] ⚠️ Erro ao carregar depoimentos');
        toast.error('Erro ao carregar depoimentos');
      }
    } catch (error) {
      console.error('[TestimonialsManager] ❌ Erro:', error);
      toast.error('Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (testimonial?: Testimonial) => {
    if (testimonial) {
      setEditingTestimonial(testimonial);
      setFormData(testimonial);
    } else {
      setEditingTestimonial(null);
      setFormData({
        name: '',
        role: '',
        company: '',
        image: '',
        content: '',
        rating: 5,
        project: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    console.log('[TestimonialsManager] Closing modal');
    setIsModalOpen(false);
    setEditingTestimonial(null);
    setFormData({
      name: '',
      role: '',
      company: '',
      image: '',
      content: '',
      rating: 5,
      project: '',
    });
  };

  const handleSave = async () => {
    // Validação
    if (!formData.name || !formData.role || !formData.content) {
      toast.error('Por favor, preencha os campos obrigatórios (Nome, Cargo, Depoimento)');
      return;
    }

    setIsSaving(true);

    try {
      if (editingTestimonial) {
        // Atualizar depoimento existente
        const response = await supabaseFetch(`testimonials/${editingTestimonial.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData),
        }, 1, true); // isAdmin = true

        if (response.ok) {
          toast.success('Depoimento atualizado com sucesso!');
          await fetchTestimonials();
          handleCloseModal();
        } else {
          const error = await response.json();
          toast.error(error.error || 'Erro ao atualizar depoimento');
        }
      } else {
        // Criar novo depoimento
        const response = await supabaseFetch('testimonials', {
          method: 'POST',
          body: JSON.stringify(formData),
        }, 1, true); // isAdmin = true

        if (response.ok) {
          const result = await response.json();
          console.log('[TestimonialsManager] ✅ Depoimento criado:', result);
          toast.success('Depoimento criado com sucesso!');
          await fetchTestimonials();
          handleCloseModal();
        } else {
          const error = await response.json();
          console.error('[TestimonialsManager] ❌ Erro ao criar:', error);
          toast.error(error.error || 'Erro ao criar depoimento');
        }
      }
    } catch (error) {
      console.error('[TestimonialsManager] ❌ Erro ao salvar:', error);
      toast.error('Erro ao salvar depoimento');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este depoimento?')) {
      return;
    }

    try {
      const response = await supabaseFetch(`testimonials/${id}`, {
        method: 'DELETE',
      }, 1, true); // isAdmin = true

      if (response.ok) {
        toast.success('Depoimento excluído com sucesso!');
        await fetchTestimonials();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Erro ao excluir depoimento');
      }
    } catch (error) {
      console.error('[TestimonialsManager] ❌ Erro ao excluir:', error);
      toast.error('Erro ao excluir depoimento');
    }
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
            Depoimentos
          </h2>
          <p style={{ fontSize: typography.fontSize.sm, color: colors.gray[500] }}>
            Gerencie os depoimentos exibidos no site
          </p>
        </div>

        <AnimatedButton
          onClick={() => handleOpenModal()}
          disabled={isLoading || parentLoading}
          variant="secondary"
          icon={Plus}
          aria-label="Adicionar novo depoimento"
        >
          Novo Depoimento
        </AnimatedButton>
      </div>

      {/* Testimonials Grid */}
      {isLoading ? (
        <div
          style={{
            textAlign: 'center',
            padding: spacing[12],
            color: colors.gray[500],
          }}
        >
          <p>Carregando depoimentos...</p>
        </div>
      ) : testimonials.length === 0 ? (
        <div
          role="status"
          aria-live="polite"
          style={{
            textAlign: 'center',
            padding: spacing[12],
            color: colors.gray[500],
          }}
        >
          <User size={64} style={{ margin: '0 auto', marginBottom: spacing[4], opacity: 0.3 }} aria-hidden="true" />
          <h3
            style={{
              fontSize: typography.fontSize.xl,
              fontWeight: typography.fontWeight.semibold,
              marginBottom: spacing[2],
            }}
          >
            Nenhum depoimento cadastrado
          </h3>
          <p style={{ fontSize: typography.fontSize.base, marginBottom: spacing[6] }}>
            Comece adicionando um novo depoimento
          </p>
          <AnimatedButton onClick={() => handleOpenModal()} variant="secondary" icon={Plus}>
            Adicionar Depoimento
          </AnimatedButton>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
            gap: spacing[6],
          }}
        >
          {testimonials.map((testimonial) => (
            <motion.article
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                background: colors.white,
                borderRadius: radius.lg,
                padding: spacing[6],
                border: `1px solid ${colors.gray[200]}`,
                position: 'relative',
                transition: 'all 0.3s',
              }}
              whileHover={{ boxShadow: shadows.lg }}
            >
              {/* Action Buttons */}
              <div
                style={{
                  position: 'absolute',
                  top: spacing[4],
                  right: spacing[4],
                  display: 'flex',
                  gap: spacing[2],
                }}
              >
                <button
                  onClick={() => handleOpenModal(testimonial)}
                  style={{
                    background: colors.white,
                    border: `1px solid ${colors.gray[300]}`,
                    borderRadius: radius.md,
                    padding: spacing[2],
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  title="Editar"
                  aria-label="Editar depoimento"
                >
                  <Edit size={16} style={{ color: colors.primary }} />
                </button>
                <button
                  onClick={() => handleDelete(testimonial.id)}
                  style={{
                    background: colors.white,
                    border: `1px solid ${colors.gray[300]}`,
                    borderRadius: radius.md,
                    padding: spacing[2],
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transition: 'all 0.2s',
                  }}
                  title="Excluir"
                  aria-label="Excluir depoimento"
                >
                  <Trash2 size={16} style={{ color: colors.error }} />
                </button>
              </div>

              {/* Author Info */}
              <div style={{ display: 'flex', gap: spacing[4], marginBottom: spacing[4] }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    flexShrink: 0,
                    background: colors.gray[200],
                  }}
                >
                  {testimonial.image ? (
                    <ImageWithFallback
                      src={testimonial.image}
                      alt={testimonial.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: colors.gray[300],
                      }}
                    >
                      <User size={32} style={{ color: colors.gray[500] }} />
                    </div>
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h3
                    style={{
                      fontSize: typography.fontSize.lg,
                      fontWeight: typography.fontWeight.semibold,
                      color: colors.gray[900],
                      marginBottom: spacing[1],
                    }}
                  >
                    {testimonial.name}
                  </h3>
                  <p
                    style={{
                      fontSize: typography.fontSize.sm,
                      color: colors.gray[600],
                      marginBottom: spacing[1],
                    }}
                  >
                    {testimonial.role}
                    {testimonial.company && ` • ${testimonial.company}`}
                  </p>
                  {/* Rating */}
                  <div
                    style={{
                      display: 'flex',
                      gap: spacing[1],
                    }}
                    role="img"
                    aria-label={`Avaliação: ${testimonial.rating} de 5 estrelas`}
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < testimonial.rating ? colors.secondary : 'none'}
                        style={{ color: i < testimonial.rating ? colors.secondary : colors.gray[300] }}
                        aria-hidden="true"
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Content */}
              <p
                style={{
                  fontSize: typography.fontSize.sm,
                  color: colors.gray[600],
                  lineHeight: typography.lineHeight.relaxed,
                  marginBottom: spacing[4],
                }}
              >
                {testimonial.content}
              </p>

              {/* Project Info */}
              {testimonial.project && (
                <p
                  style={{
                    fontSize: typography.fontSize.xs,
                    color: colors.gray[500],
                    fontStyle: 'italic',
                  }}
                >
                  {testimonial.project}
                </p>
              )}
            </motion.article>
          ))}
        </div>
      )}

      {/* Modal - Create/Edit Form - Renderizado via Portal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {isModalOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleCloseModal}
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.5)',
                  zIndex: 999998,
                  backdropFilter: 'blur(4px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: spacing[4],
                  overflowY: 'auto',
                }}
              >
                {/* Modal */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  onClick={(e) => e.stopPropagation()}
                  style={{
                    width: '100%',
                    maxWidth: '600px',
                    maxHeight: '90vh',
                    overflow: 'auto',
                    background: colors.white,
                    borderRadius: radius.xl,
                    padding: spacing[8],
                    boxShadow: shadows['2xl'],
                    position: 'relative',
                  }}
                >
                  {/* Header */}
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: spacing[6],
                    }}
                  >
                    <h3
                      style={{
                        fontSize: typography.fontSize['2xl'],
                        fontWeight: typography.fontWeight.bold,
                        color: colors.gray[900],
                      }}
                    >
                      {editingTestimonial ? 'Editar Depoimento' : 'Novo Depoimento'}
                    </h3>
                    <button
                      onClick={handleCloseModal}
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: spacing[2],
                        color: colors.gray[500],
                      }}
                      aria-label="Fechar"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  {/* Form */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: spacing[4] }}>
                    {/* Nome */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.gray[700],
                          marginBottom: spacing[2],
                        }}
                      >
                        Nome *
                      </label>
                      <input
                        type="text"
                        value={formData.name || ''}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Dr. Miguel Santos"
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

                    {/* Cargo */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.gray[700],
                          marginBottom: spacing[2],
                        }}
                      >
                        Cargo *
                      </label>
                      <input
                        type="text"
                        value={formData.role || ''}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        placeholder="Ex: Investidor"
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

                    {/* Empresa */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.gray[700],
                          marginBottom: spacing[2],
                        }}
                      >
                        Empresa
                      </label>
                      <input
                        type="text"
                        value={formData.company || ''}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Ex: Portfolio Privado"
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

                    {/* Imagem Upload */}
                    <ImageUpload
                      value={formData.image || ''}
                      onChange={(url) => {
                        console.log('[TestimonialsManager] Image uploaded, URL:', url);
                        setFormData({ ...formData, image: url });
                      }}
                      bucket="testimonials"
                      label="Foto do Cliente"
                    />

                    {/* Avaliação */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.gray[700],
                          marginBottom: spacing[2],
                        }}
                      >
                        Avaliação
                      </label>
                      <div style={{ display: 'flex', gap: spacing[2] }}>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() => setFormData({ ...formData, rating })}
                            style={{
                              background: 'none',
                              border: 'none',
                              cursor: 'pointer',
                              padding: spacing[1],
                            }}
                          >
                            <Star
                              size={24}
                              fill={rating <= (formData.rating || 0) ? colors.secondary : 'none'}
                              style={{ color: rating <= (formData.rating || 0) ? colors.secondary : colors.gray[300] }}
                            />
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Depoimento */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.gray[700],
                          marginBottom: spacing[2],
                        }}
                      >
                        Depoimento *
                      </label>
                      <textarea
                        value={formData.content || ''}
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        placeholder="Escreva o depoimento aqui..."
                        rows={4}
                        style={{
                          width: '100%',
                          padding: spacing[3],
                          border: `1px solid ${colors.gray[300]}`,
                          borderRadius: radius.md,
                          fontSize: typography.fontSize.base,
                          outline: 'none',
                          fontFamily: 'inherit',
                          resize: 'vertical',
                        }}
                      />
                    </div>

                    {/* Projeto */}
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: typography.fontSize.sm,
                          fontWeight: typography.fontWeight.semibold,
                          color: colors.gray[700],
                          marginBottom: spacing[2],
                        }}
                      >
                        Projeto/Info
                      </label>
                      <input
                        type="text"
                        value={formData.project || ''}
                        onChange={(e) => setFormData({ ...formData, project: e.target.value })}
                        placeholder="Ex: 2 projetos | ROI médio 32%"
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

                    {/* Actions */}
                    <div
                      style={{
                        display: 'flex',
                        gap: spacing[3],
                        marginTop: spacing[4],
                      }}
                    >
                      <AnimatedButton
                        onClick={handleCloseModal}
                        variant="secondary"
                        style={{ flex: 1 }}
                        disabled={isSaving}
                      >
                        Cancelar
                      </AnimatedButton>
                      <AnimatedButton
                        onClick={handleSave}
                        variant="primary"
                        icon={Save}
                        style={{ flex: 1 }}
                        disabled={isSaving}
                      >
                        {isSaving ? 'Salvando...' : 'Salvar'}
                      </AnimatedButton>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  );
}