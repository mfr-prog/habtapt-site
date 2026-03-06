'use client';

import React, { useState } from 'react';
import { Container } from './Container';
import { Section } from './Section';
import { Mail, Phone, MapPin, Send, Clock, MessageSquare, ChevronDown, HelpCircle } from './icons';
import { useInView } from './useInView';
import { designSystem } from './design-system';
import { submitContact } from '../lib/actions/contact';

export function Contact() {
  const { ref, isInView } = useInView({ threshold: 0.1 });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
  });
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    phone: '',
    interest: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Reset errors
    setFormErrors({
      name: '',
      email: '',
      phone: '',
      interest: '',
      message: '',
    });
    
    // Custom validation
    let hasErrors = false;
    const newErrors = {
      name: '',
      email: '',
      phone: '',
      interest: '',
      message: '',
    };
    
    if (!formData.name) {
      newErrors.name = 'O nome é obrigatório.';
      hasErrors = true;
    }
    
    if (!formData.email) {
      newErrors.email = 'O email é obrigatório.';
      hasErrors = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Por favor, insira um email válido.';
      hasErrors = true;
    }
    
    if (!formData.phone) {
      newErrors.phone = 'O telefone é obrigatório.';
      hasErrors = true;
    }
    
    if (!formData.interest) {
      newErrors.interest = 'Selecione um tipo de interesse.';
      hasErrors = true;
    }
    
    if (!formData.message) {
      newErrors.message = 'A mensagem é obrigatória.';
      hasErrors = true;
    }
    
    if (hasErrors) {
      setFormErrors(newErrors);
      import('sonner').then(({ toast }) => toast.error('Por favor, corrija os campos destacados.'));
      return;
    }
    
    setIsSubmitting(true);

    try {
      const result = await submitContact({
        ...formData,
        sourceUrl: typeof window !== 'undefined' ? window.location.href : undefined,
      });

      if (!result.success) {
        console.error('Contact form submission error:', result.error);
        const { toast } = await import('sonner');
        toast.error(result.error || 'Erro ao enviar mensagem. Tente novamente.');
        setIsSubmitting(false);
        return;
      }

      const { toast } = await import('sonner');
      toast.success(result.message || 'Mensagem enviada com sucesso! Entraremos em contato em breve.');
      
      setFormData({
        name: '',
        email: '',
        phone: '',
        interest: '',
        message: '',
      });
    } catch (error) {
      console.error('Contact form network error:', error);
      import('sonner').then(({ toast }) => toast.error('Erro de conexão. Verifique a sua internet e tente novamente.'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (formErrors[name as keyof typeof formErrors]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'contato@habta.eu',
      href: 'mailto:contato@habta.eu',
    },
    {
      icon: Phone,
      label: 'WhatsApp',
      value: 'Fale conosco no WhatsApp',
      href: 'https://wa.me/351963290394?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20investimentos%20imobiliários%20com%20a%20HABTA.',
    },
    {
      icon: MapPin,
      label: 'Localização',
      value: 'Lisboa / Cascais',
      href: 'https://maps.google.com/?q=Rua+Fernão+Lopes+23,+Cascais,+Portugal',
    },
    {
      icon: Clock,
      label: 'Horário',
      value: 'Segunda a Sexta, 9h–18h',
      href: null,
    },
  ];

  const faqs = [
    {
      question: 'Como funciona o processo de investimento?',
      answer: 'O nosso processo é estruturado em 7 etapas: prospecção, avaliação técnica e jurídica, negociação, reforma com gestão controlada, marketing 360°, venda e fecho do projeto. Cada fase é transparente e acompanhada de perto pelos nossos parceiros.',
    },
    {
      question: 'Qual o prazo médio de um projeto?',
      answer: 'O ciclo completo varia entre 3 a 12 meses, dependendo da complexidade da obra e das condições do mercado. Fornecemos cronograma detalhado desde o início e atualizações semanais do progresso.',
    },
    {
      question: 'Qual o retorno esperado de investimento?',
      answer: 'Cada projeto é avaliado individualmente com base em análise de mercado rigorosa e due diligence completa. Apresentamos projeções financeiras detalhadas e transparentes para cada oportunidade, permitindo uma decisão informada. Os resultados variam conforme o projeto, localização e condições de mercado.',
    },
    {
      question: 'Preciso ter conhecimento técnico para investir?',
      answer: 'Não. A nossa equipa cuida de todo o processo técnico, jurídico e operacional. Recebe relatórios simplificados e tem acesso a consultoria especializada sempre que necessário.',
    },
    {
      question: 'Como acompanho o andamento do projeto?',
      answer: 'Disponibilizamos acompanhamento online 24/7 com fotos, vídeos e relatórios semanais. Além disso, pode visitar a obra presencialmente mediante agendamento e tem acesso direto à equipa de gestão.',
    },
  ];

  return (
    <Section id="contact" background="muted">
      <style>{`
        .habta-input:focus-visible {
          border-color: ${designSystem.colors.brand.primary} !important;
          box-shadow: 0 0 0 3px rgba(26,62,92,0.15) !important;
          outline: none;
        }
      `}</style>
      <Container>
        <div
          ref={ref}
          className={`text-center mb-16 ${isInView ? 'anim-fade-in-up' : ''}`}
          style={isInView ? undefined : { opacity: 0 }}
        >
          <div
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${isInView ? 'anim-fade-in anim-delay-1' : ''}`}
            style={{
              background: designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.08),
              border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.15)}`,
              ...(isInView ? {} : { opacity: 0 }),
            }}
          >
            <MessageSquare size={16} style={{ color: designSystem.colors.brand.primary }} />
            <span
              style={{
                fontSize: designSystem.typography.fontSize.sm,
                fontWeight: designSystem.typography.fontWeight.semibold,
                color: designSystem.colors.brand.primary,
                textTransform: 'uppercase',
                letterSpacing: designSystem.typography.letterSpacing.wider,
              }}
            >
              Contacto
            </span>
          </div>

          <h1
            id="contact-title"
            style={{
              fontSize: designSystem.typography.fontSize['4xl'],
              fontWeight: designSystem.typography.fontWeight.black,
              color: designSystem.colors.brand.primary,
              marginBottom: designSystem.spacing[4],
              letterSpacing: designSystem.typography.letterSpacing.tight,
            }}
          >
            Vamos conversar?
          </h1>

          <p
            id="contact-description"
            className="max-w-3xl mx-auto"
            style={{
              fontSize: designSystem.typography.fontSize.lg,
              color: designSystem.colors.neutral[600],
              lineHeight: designSystem.typography.lineHeight.relaxed,
            }}
          >
            Fale com a nossa equipa e descubra como podemos colaborar no seu próximo projeto.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Form */}
          <div
            className={isInView ? 'anim-fade-in-up anim-delay-2' : ''}
            style={isInView ? undefined : { opacity: 0 }}
          >
            <form 
              onSubmit={handleSubmit} 
              className="space-y-6" 
              noValidate
              aria-labelledby="contact-title"
              aria-describedby="contact-description"
            >
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  style={{
                    display: 'block',
                    fontSize: designSystem.typography.fontSize.sm,
                    fontWeight: designSystem.typography.fontWeight.semibold,
                    color: designSystem.colors.brand.primary,
                    marginBottom: designSystem.spacing[2],
                  }}
                >
                  Nome completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={formErrors.name ? 'true' : 'false'}
                  aria-describedby={formErrors.name ? 'name-error' : undefined}
                  className="habta-input w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: formErrors.name
                      ? designSystem.colors.semantic.error
                      : designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.2),
                    background: designSystem.colors.neutral.white,
                    color: designSystem.colors.brand.primary,
                  }}
                  placeholder="O seu nome"
                />
                {formErrors.name && (
                  <p
                    id="name-error"
                    role="alert"
                    style={{
                      fontSize: designSystem.typography.fontSize.sm,
                      color: designSystem.colors.semantic.error,
                      marginTop: designSystem.spacing[1],
                    }}
                  >
                    {formErrors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: 'block',
                    fontSize: designSystem.typography.fontSize.sm,
                    fontWeight: designSystem.typography.fontWeight.semibold,
                    color: designSystem.colors.brand.primary,
                    marginBottom: designSystem.spacing[2],
                  }}
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={formErrors.email ? 'true' : 'false'}
                  aria-describedby={formErrors.email ? 'email-error' : undefined}
                  className="habta-input w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: formErrors.email
                      ? designSystem.colors.semantic.error
                      : designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.2),
                    background: designSystem.colors.neutral.white,
                    color: designSystem.colors.brand.primary,
                  }}
                  placeholder="seuemail@exemplo.com"
                />
                {formErrors.email && (
                  <p
                    id="email-error"
                    role="alert"
                    style={{
                      fontSize: designSystem.typography.fontSize.sm,
                      color: designSystem.colors.semantic.error,
                      marginTop: designSystem.spacing[1],
                    }}
                  >
                    {formErrors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  style={{
                    display: 'block',
                    fontSize: designSystem.typography.fontSize.sm,
                    fontWeight: designSystem.typography.fontWeight.semibold,
                    color: designSystem.colors.brand.primary,
                    marginBottom: designSystem.spacing[2],
                  }}
                >
                  Telefone *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={formErrors.phone ? 'true' : 'false'}
                  aria-describedby={formErrors.phone ? 'phone-error' : undefined}
                  className="habta-input w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none"
                  style={{
                    borderColor: formErrors.phone
                      ? designSystem.colors.semantic.error
                      : designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.2),
                    background: designSystem.colors.neutral.white,
                    color: designSystem.colors.brand.primary,
                  }}
                  placeholder="+351 963 290 394"
                />
                {formErrors.phone && (
                  <p
                    id="phone-error"
                    role="alert"
                    style={{
                      fontSize: designSystem.typography.fontSize.sm,
                      color: designSystem.colors.semantic.error,
                      marginTop: designSystem.spacing[1],
                    }}
                  >
                    {formErrors.phone}
                  </p>
                )}
              </div>

              {/* Interest */}
              <div>
                <label
                  htmlFor="interest"
                  style={{
                    display: 'block',
                    fontSize: designSystem.typography.fontSize.sm,
                    fontWeight: designSystem.typography.fontWeight.semibold,
                    color: designSystem.colors.brand.primary,
                    marginBottom: designSystem.spacing[2],
                  }}
                >
                  Tipo de Interesse *
                </label>
                <select
                  id="interest"
                  name="interest"
                  value={formData.interest}
                  onChange={handleChange}
                  aria-required="true"
                  aria-invalid={formErrors.interest ? 'true' : 'false'}
                  aria-describedby={formErrors.interest ? 'interest-error' : undefined}
                  className="habta-input w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none appearance-none bg-white"
                  style={{
                    borderColor: formErrors.interest
                      ? designSystem.colors.semantic.error
                      : designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.2),
                    color: formData.interest ? designSystem.colors.brand.primary : designSystem.colors.neutral[500],
                    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236B7C93' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                    backgroundPosition: 'right 0.5rem center',
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: '1.5em 1.5em',
                  }}
                >
                  <option value="" disabled>Selecione uma opção</option>
                  <option value="morar">Quero Morar</option>
                  <option value="investir">Quero Investir</option>
                  <option value="vender">Vender Propriedade</option>
                  <option value="parceria">Parceria Estratégica</option>
                  <option value="outro">Outro</option>
                </select>
                {formErrors.interest && (
                  <p
                    id="interest-error"
                    role="alert"
                    style={{
                      fontSize: designSystem.typography.fontSize.sm,
                      color: designSystem.colors.semantic.error,
                      marginTop: designSystem.spacing[1],
                    }}
                  >
                    {formErrors.interest}
                  </p>
                )}
              </div>

              {/* Message */}
              <div>
                <label
                  htmlFor="message"
                  style={{
                    display: 'block',
                    fontSize: designSystem.typography.fontSize.sm,
                    fontWeight: designSystem.typography.fontWeight.semibold,
                    color: designSystem.colors.brand.primary,
                    marginBottom: designSystem.spacing[2],
                  }}
                >
                  Mensagem *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  aria-required="true"
                  aria-invalid={formErrors.message ? 'true' : 'false'}
                  aria-describedby={formErrors.message ? 'message-error' : undefined}
                  className="habta-input w-full px-4 py-3 rounded-xl border transition-all duration-300 focus:outline-none resize-none"
                  style={{
                    borderColor: formErrors.message
                      ? designSystem.colors.semantic.error
                      : designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.2),
                    background: designSystem.colors.neutral.white,
                    color: designSystem.colors.brand.primary,
                  }}
                  placeholder="Conte-nos mais sobre o seu interesse..."
                />
                {formErrors.message && (
                  <p
                    id="message-error"
                    role="alert"
                    style={{
                      fontSize: designSystem.typography.fontSize.sm,
                      color: designSystem.colors.semantic.error,
                      marginTop: designSystem.spacing[1],
                    }}
                  >
                    {formErrors.message}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-8 py-4 rounded-xl transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: isSubmitting
                    ? designSystem.colors.neutral[500]
                    : designSystem.colors.gradients.secondary,
                  color: isSubmitting ? designSystem.colors.neutral.white : designSystem.colors.brand.primary,
                  fontWeight: designSystem.typography.fontWeight.semibold,
                  boxShadow: isSubmitting
                    ? 'none'
                    : designSystem.shadows.secondaryHover,
                  cursor: isSubmitting ? 'not-allowed' : 'pointer',
                }}
              >
                {isSubmitting ? (
                  <>
                    <div
                      className="anim-spin w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    Enviando...
                  </>
                ) : (
                  <>
                    Enviar mensagem
                    <Send size={18} />
                  </>
                )}
              </button>

              <p
                className="text-center"
                style={{
                  fontSize: designSystem.typography.fontSize.sm,
                  color: designSystem.colors.neutral[600],
                }}
              >
                Respondemos em até 24 horas úteis
              </p>
            </form>
          </div>

          {/* Contact Info */}
          <div
            className={`space-y-8 ${isInView ? 'anim-fade-in-up anim-delay-3' : ''}`}
            style={isInView ? undefined : { opacity: 0 }}
          >
            {/* Contact Cards */}
            <div className="space-y-4">
              {contactInfo.map((info, index) => (
                <div
                  key={info.label}
                  className={`bg-white rounded-2xl p-6 border transition-transform duration-300 hover:scale-[1.02] hover:translate-x-1 ${isInView ? 'anim-fade-in-up' : ''}`}
                  style={{
                    borderColor: designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.1),
                    boxShadow: designSystem.shadows.md,
                    ...(isInView ? {} : { opacity: 0 }),
                  }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="flex-shrink-0 p-3 rounded-xl"
                      style={{
                        background: designSystem.colors.gradients.secondary,
                      }}
                    >
                      <info.icon size={24} className="text-white" />
                    </div>
                    
                    <div className="flex-1">
                      <div
                        style={{
                          fontSize: designSystem.typography.fontSize.sm,
                          fontWeight: designSystem.typography.fontWeight.semibold,
                          color: designSystem.colors.neutral[600],
                          marginBottom: designSystem.spacing[1],
                          textTransform: 'uppercase',
                          letterSpacing: designSystem.typography.letterSpacing.wider,
                        }}
                      >
                        {info.label}
                      </div>
                      {info.href ? (
                        <a
                          href={info.href}
                          target={info.href.startsWith('http') ? '_blank' : undefined}
                          rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          style={{
                            fontSize: designSystem.typography.fontSize.lg,
                            fontWeight: designSystem.typography.fontWeight.semibold,
                            color: designSystem.colors.brand.primary,
                            textDecoration: 'none',
                          }}
                          className="transition-colors hover:text-[#8f7350]"
                        >
                          {info.value}
                        </a>
                      ) : (
                        <div
                          style={{
                            fontSize: designSystem.typography.fontSize.lg,
                            fontWeight: designSystem.typography.fontWeight.semibold,
                            color: designSystem.colors.brand.primary,
                          }}
                        >
                          {info.value}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* CTA Card */}
            <div
              className={`rounded-3xl p-8 text-white ${isInView ? 'anim-fade-in-up anim-delay-5' : ''}`}
              style={{
                background: designSystem.colors.gradients.heroLuxury,
                ...(isInView ? {} : { opacity: 0 }),
              }}
            >
              <h2
                className="mb-4"
                style={{
                  fontSize: designSystem.typography.fontSize['2xl'],
                  fontWeight: designSystem.typography.fontWeight.bold,
                  color: designSystem.colors.neutral.white,
                }}
              >
                Pronto para dar o próximo passo?
              </h2>
              <p
                className="mb-6"
                style={{
                  fontSize: designSystem.typography.fontSize.base,
                  color: 'rgba(255, 255, 255, 0.9)',
                  lineHeight: designSystem.typography.lineHeight.relaxed,
                }}
              >
                A nossa equipa está pronta para ajudá-lo a encontrar o imóvel certo para si.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                  <span style={{ fontSize: designSystem.typography.fontSize['15.2'], color: 'rgba(255, 255, 255, 0.9)' }}>
                    Análise gratuita de potencial de investimento
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                  <span style={{ fontSize: designSystem.typography.fontSize['15.2'], color: 'rgba(255, 255, 255, 0.9)' }}>
                    Consultoria especializada sem compromisso
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/80" />
                  <span style={{ fontSize: designSystem.typography.fontSize['15.2'], color: 'rgba(255, 255, 255, 0.9)' }}>
                    Acesso a oportunidades exclusivas
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div
          className={isInView ? 'anim-fade-in-up' : ''}
          style={{
            marginTop: designSystem.spacing[20],
            maxWidth: '900px',
            marginLeft: 'auto',
            marginRight: 'auto',
            ...(isInView ? {} : { opacity: 0 }),
          }}
        >
          {/* FAQ Header */}
          <div
            className="text-center"
            style={{
              marginBottom: designSystem.spacing[12],
            }}
          >
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
              style={{
                background: designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.08),
                border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.secondary, 0.15)}`,
              }}
            >
              <HelpCircle size={18} style={{ color: designSystem.colors.brand.secondary }} />
              <span
                style={{
                  fontSize: designSystem.typography.fontSize.sm,
                  fontWeight: designSystem.typography.fontWeight.semibold,
                  color: designSystem.colors.brand.secondary,
                  textTransform: 'uppercase',
                  letterSpacing: designSystem.typography.letterSpacing.wider,
                }}
              >
                Perguntas Frequentes
              </span>
            </div>

            <h2
              style={{
                fontSize: designSystem.typography.fontSize['3xl'],
                fontWeight: designSystem.typography.fontWeight.black,
                color: designSystem.colors.brand.primary,
                marginBottom: designSystem.spacing[4],
              }}
            >
              Ainda tem dúvidas?
            </h2>
            <p
              style={{
                fontSize: designSystem.typography.fontSize.base,
                color: designSystem.colors.neutral[600],
                lineHeight: designSystem.typography.lineHeight.relaxed,
              }}
            >
              Reunimos as perguntas mais comuns para ajudá-lo a entender melhor como trabalhamos.
            </p>
          </div>

          {/* FAQ Items */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: designSystem.spacing[4],
            }}
          >
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;

              return (
                <div
                  key={index}
                  className={isInView ? 'anim-fade-in-up' : ''}
                  style={{
                    background: designSystem.colors.neutral.white,
                    borderRadius: designSystem.borderRadius.xl,
                    border: `2px solid ${isOpen ? designSystem.colors.brand.secondary : designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.1)}`,
                    overflow: 'hidden',
                    transition: 'all 0.3s ease',
                    ...(isInView ? {} : { opacity: 0 }),
                  }}
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full text-left"
                    style={{
                      padding: designSystem.spacing[6],
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: designSystem.spacing[4],
                    }}
                    aria-expanded={isOpen}
                    aria-controls={`faq-answer-${index}`}
                  >
                    <span
                      style={{
                        fontSize: designSystem.typography.fontSize.lg,
                        fontWeight: designSystem.typography.fontWeight.semibold,
                        color: isOpen ? designSystem.colors.brand.secondary : designSystem.colors.brand.primary,
                        transition: 'color 0.3s ease',
                      }}
                    >
                      {faq.question}
                    </span>
                    <div
                      className={`chevron-rotate ${isOpen ? 'chevron-rotate-open' : ''}`}
                      style={{
                        flexShrink: 0,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <ChevronDown
                        size={24}
                        style={{
                          color: isOpen ? designSystem.colors.brand.secondary : designSystem.colors.neutral[500],
                          transition: 'color 0.3s ease',
                        }}
                      />
                    </div>
                  </button>

                  <div
                    id={`faq-answer-${index}`}
                    className={`faq-answer ${isOpen ? 'faq-answer-open' : ''}`}
                  >
                    <div
                      style={{
                        padding: `0 ${designSystem.spacing[6]} ${designSystem.spacing[6]} ${designSystem.spacing[6]}`,
                        fontSize: designSystem.typography.fontSize.base,
                        color: designSystem.colors.neutral[700],
                        lineHeight: designSystem.typography.lineHeight.relaxed,
                        borderTop: `1px solid ${designSystem.colors.neutral[200]}`,
                        paddingTop: designSystem.spacing[4],
                        marginTop: designSystem.spacing[2],
                      }}
                    >
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* FAQ CTA */}
          <div
            className={`text-center ${isInView ? 'anim-fade-in-up' : ''}`}
            style={{
              marginTop: designSystem.spacing[10],
              padding: designSystem.spacing[8],
              background: designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.03),
              borderRadius: designSystem.borderRadius['2xl'],
              border: `1px solid ${designSystem.helpers.hexToRgba(designSystem.colors.brand.primary, 0.1)}`,
              ...(isInView ? {} : { opacity: 0 }),
            }}
          >
            <p
              style={{
                fontSize: designSystem.typography.fontSize.lg,
                color: designSystem.colors.neutral[700],
                marginBottom: designSystem.spacing[4],
              }}
            >
              Não encontrou a resposta que procurava?
            </p>
            <p
              style={{
                fontSize: designSystem.typography.fontSize.base,
                color: designSystem.colors.neutral[600],
              }}
            >
              Entre em contacto diretamente com a nossa equipa através do{' '}
              <a
                href="#contact-title"
                onClick={(e) => {
                  e.preventDefault();
                  const titleElement = document.getElementById('contact-title');
                  if (titleElement) {
                    titleElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                style={{
                  color: designSystem.colors.brand.secondary,
                  fontWeight: designSystem.typography.fontWeight.semibold,
                  textDecoration: 'underline',
                  cursor: 'pointer',
                }}
              >
                formulário acima
              </a>{' '}
              ou pelo{' '}
              <a
                href="https://wa.me/351963290394?text=Olá!%20Gostaria%20de%20saber%20mais%20sobre%20investimentos%20imobiliários%20com%20a%20HABTA."
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: designSystem.colors.brand.secondary,
                  fontWeight: designSystem.typography.fontWeight.semibold,
                  textDecoration: 'underline',
                }}
              >
                WhatsApp
              </a>
              .
            </p>
          </div>
        </div>
      </Container>
    </Section>
  );
}