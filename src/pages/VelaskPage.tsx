'use client';

import React, { useState, useEffect } from 'react';
import { Container } from '../components/Container';
import { Section } from '../components/Section';
import { motion } from 'motion/react';
import { useInView } from '../components/useInView';
import { designSystem } from '../components/design-system';
import {
  MapPin, Phone, Mail, MessageCircle, Download, ArrowRight,
  CheckCircle, Home, Building, Ruler, Calendar, Star,
  ChevronDown, Send, Eye, ExternalLink,
} from '../components/icons';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../components/ui/accordion';

// ─── Shorthand refs ──────────────────────────────────────────────────────────
const ds = designSystem;
const c = ds.colors;
const t = ds.typography;
const sp = ds.spacing;

// ─── Data ────────────────────────────────────────────────────────────────────
const counters = [
  { value: '333,89', suffix: 'm²', label: 'Área bruta total (3 unidades)' },
  { value: '3', suffix: '', label: 'Pisos' },
  { value: '3', suffix: '', label: 'Apartamentos' },
];

const highlights = [
  { icon: '🌿', text: 'Jardins privados até 27,80 m²' },
  { icon: '☀️', text: 'Exterior total (pátio + jardim) até 34,06 m²' },
  { icon: '🚗', text: 'Garagem privativa (R/C)' },
  { icon: '🏠', text: 'Sótão 33,11 m² (Duplex)' },
];

const benefits = [
  'Apenas 3 unidades: mais privacidade, menos ruído de "condomínio grande"',
  'Áreas exteriores reais (não "varandinhas")',
  'Tipologias complementares: dá para escolher por estilo de vida (não por "o que sobrou")',
];

const interiorFeatures = [
  { title: 'Cozinha', desc: 'Linguagem contemporânea, bancada escura e integração com a sala' },
  { title: 'Sala', desc: 'Possibilidade de separação visual com elementos envidraçados (conceito)' },
  { title: 'Quartos', desc: 'Ambientes simples com boa arrumação' },
  { title: 'Casas de banho', desc: 'Revestimentos claros tipo pedra e móveis suspensos (conceito)' },
  { title: 'Duplex', desc: 'Escada com integração estética e área extra no piso superior (conceito)' },
];

const units = [
  {
    id: 'rc',
    tab: 'R/C — T1',
    title: 'T1 Garden Garage',
    area: '118,44 m²',
    summary: 'Jardim amplo + garagem privativa: a solução "casa" dentro da cidade.',
    specs: [
      { label: 'Área bruta', value: '118,44 m²' },
      { label: 'Interior', value: '69,60 m²' },
      { label: 'Pátio', value: '6,26 m²' },
      { label: 'Jardim', value: '27,80 m²' },
      { label: 'Garagem', value: '14,78 m²' },
      { label: 'Casas de banho', value: '2' },
    ],
    copy: [
      'No rés-do-chão, o T1 foi desenhado para maximizar a ligação à zona exterior. A área social integra sala e cozinha e abre caminho para um exterior pensado para refeições e lazer.',
      'A garagem privativa é um diferencial raro na zona — e resolve o "assunto" do estacionamento logo à partida.',
    ],
    cta: 'Quero visitar este T1',
    color: c.brand.primary,
  },
  {
    id: 'p1',
    tab: 'Piso 1 — T2',
    title: 'T2 Garden Annex',
    area: '106,78 m²',
    summary: 'Dois quartos, exterior completo e um anexo que dá flexibilidade (arrumos/office/…).',
    specs: [
      { label: 'Área bruta', value: '106,78 m²' },
      { label: 'Interior', value: '66,30 m²' },
      { label: 'Pátio', value: '6,26 m²' },
      { label: 'Varanda frente', value: '3,00 m²' },
      { label: 'Jardim', value: '23,85 m²' },
      { label: 'Anexo', value: '7,37 m²' },
      { label: 'Casas de banho', value: '2' },
    ],
    copy: [
      'O Piso 1 combina uma zona social aberta com dois quartos e circulação simples. O jardim funciona como extensão real da casa — para quem quer exterior, mas prefere mais privacidade do que o rés-do-chão.',
      'O anexo é a carta na manga: pode servir como arrumo, lavandaria organizada ou um pequeno escritório — aquilo que normalmente falta num T2.',
    ],
    cta: 'Quero visitar este T2',
    color: c.brand.secondary,
  },
  {
    id: 'p2',
    tab: 'Piso 2 — T3 Duplex',
    title: 'T3 Duplex Attic',
    area: '108,67 m²',
    summary: 'Duplex com piso extra no sótão: espaço para família + trabalho + lazer.',
    specs: [
      { label: 'Área bruta', value: '108,67 m²' },
      { label: 'Interior (piso base)', value: '66,30 m²' },
      { label: 'Varanda frente', value: '3,00 m²' },
      { label: 'Pátio', value: '6,26 m²' },
      { label: 'Sótão', value: '33,11 m²' },
      { label: 'Casas de banho', value: '3' },
    ],
    copy: [
      'O duplex distribui a vida em dois níveis: no piso principal, zona social e quartos; no piso superior, uma área extra que pode virar sala íntima, escritório sério ou zona multiusos, com mais privacidade.',
      'Se queres um T3 mas não queres monotonia, esta é a unidade com personalidade: o sótão muda completamente o jogo do espaço.',
    ],
    cta: 'Quero visitar este Duplex',
    color: '#0891b2',
  },
];

const galleryItems = [
  'Cozinha integrada com bancada e zona de refeições',
  'Sala com linhas limpas e soluções de arrumação',
  'Quarto com linguagem contemporânea e luz natural',
  'Zona social com escada e arrumação integrada (conceito)',
  'Sótão: espaço extra com múltiplos usos (conceito)',
  'Casa de banho: revestimentos claros e móvel suspenso (conceito)',
  'Exterior: jardim com zona de lazer e apoio (conceito)',
];

const locationCards = [
  { num: '01', title: 'Transportes', desc: 'Paragens de autocarro como S. Crispim e Monte Aventino a cerca de 5 minutos a pé e estação de metro Combatentes a ~15 minutos a pé.' },
  { num: '02', title: 'Zona das Antas', desc: 'Uma envolvente residencial consolidada, com vida de bairro e acessos rápidos ao resto do Porto.' },
  { num: '03', title: 'Parque de S. Roque', desc: 'Perto do portão principal do Parque de S. Roque — opção verde para caminhar e desligar do ritmo da cidade.' },
  { num: '04', title: 'Serviços do dia a dia', desc: 'Supermercados, escolas, farmácias, ginásios e restauração a curta distância — conveniência sem depender do carro.' },
  { num: '05', title: 'Mobilidade e acessos', desc: 'Localização prática para circular entre centro, zona oriental e principais vias.' },
];

const pricingRows = [
  { unit: 'A', floor: 'R/C', type: 'T1', area: '118,44', price: 'Sob consulta', status: 'Disponível' },
  { unit: 'B', floor: 'Piso 1', type: 'T2', area: '106,78', price: 'Sob consulta', status: 'Disponível' },
  { unit: 'C', floor: 'Piso 2 (Duplex)', type: 'T3', area: '108,67', price: 'Sob consulta', status: 'Disponível' },
];

const faqItems = [
  { q: 'As áreas exteriores são privativas?', a: 'Confirme na documentação da propriedade horizontal. Na brochura indicamos o detalhe por unidade.' },
  { q: 'O que inclui a "área bruta" de cada unidade?', a: 'Cada unidade integra componentes diferentes (ex.: garagem, anexo, sótão). Por isso mostramos a decomposição completa na brochura.' },
  { q: 'O sótão do duplex conta como área habitacional?', a: 'Depende do licenciamento e do pé-direito/condições. Esclarecemos isso no processo (e deve estar refletido no CPCV).' },
  { q: 'Há garagem?', a: 'A unidade do R/C inclui garagem privativa.' },
  { q: 'Como posso agendar visita?', a: 'Clique em "Agendar visita" e indique o melhor dia/horário. Respondemos no próprio dia útil.' },
];

// ─── Styles (inline, matching HABTA identity) ────────────────────────────────
const sectionBadge = (gold = false) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: sp[2],
  padding: `${sp[3]} ${sp[5]}`,
  borderRadius: ds.borderRadius.full,
  background: gold ? 'rgba(184,149,106,0.08)' : 'rgba(26,62,92,0.08)',
  border: `1px solid ${gold ? 'rgba(184,149,106,0.15)' : 'rgba(26,62,92,0.15)'}`,
  fontSize: t.fontSize.sm,
  fontWeight: t.fontWeight.semibold,
  color: gold ? c.brand.secondary : c.brand.primary,
  textTransform: 'uppercase' as const,
  letterSpacing: t.letterSpacing.wider,
  marginBottom: sp[6],
});

const sectionTitle: React.CSSProperties = {
  fontSize: t.fontSize['4xl'],
  fontWeight: t.fontWeight.black,
  color: c.brand.primary,
  letterSpacing: t.letterSpacing.tight,
  lineHeight: t.lineHeight.tight,
  marginBottom: sp[4],
};

const bodyText: React.CSSProperties = {
  fontSize: t.fontSize.lg,
  fontWeight: t.fontWeight.normal,
  color: c.neutral[600],
  lineHeight: t.lineHeight.relaxed,
};

const cardBase: React.CSSProperties = {
  background: c.neutral.white,
  borderRadius: ds.borderRadius['3xl'],
  border: `1px solid rgba(26,62,92,0.12)`,
  boxShadow: ds.shadows.md,
  transition: ds.animations.transition.base,
};

const ctaButtonPrimary: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: sp[2],
  padding: `${sp[5]} ${sp[10]}`,
  borderRadius: ds.borderRadius.full,
  background: c.gradients.secondary,
  color: c.neutral.white,
  fontWeight: t.fontWeight.semibold,
  fontSize: t.fontSize.base,
  boxShadow: '0 10px 40px rgba(184,149,106,0.3)',
  cursor: 'pointer',
  border: 'none',
};

const ctaButtonOutline: React.CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: sp[2],
  padding: `${sp[5]} ${sp[10]}`,
  borderRadius: ds.borderRadius.full,
  background: 'rgba(255,255,255,0.1)',
  color: c.neutral.white,
  fontWeight: t.fontWeight.semibold,
  fontSize: t.fontSize.base,
  border: '2px solid rgba(255,255,255,0.3)',
  backdropFilter: 'blur(12px)',
  cursor: 'pointer',
};

// ─── Component ───────────────────────────────────────────────────────────────
export function VelaskPage() {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', typology: '', message: '',
    consentContact: false, consentPrivacy: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < parseInt(ds.breakpoints.lg));
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const heroInView = useInView({ threshold: 0.1 });
  const empInView = useInView({ threshold: 0.1 });
  const intInView = useInView({ threshold: 0.1 });
  const planInView = useInView({ threshold: 0.05 });
  const galInView = useInView({ threshold: 0.1 });
  const locInView = useInView({ threshold: 0.1 });
  const priceInView = useInView({ threshold: 0.1 });
  const contactInView = useInView({ threshold: 0.1 });
  const formInView = useInView({ threshold: 0.1 });
  const faqInView = useInView({ threshold: 0.1 });

  const scrollToForm = () => {
    document.getElementById('velask-form')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/351000000000?text=Olá! Gostaria de saber mais sobre o VELASK Residence.', '_blank');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  const anim = (i: number) => ({
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  });

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: `${sp[3]} ${sp[4]}`,
    borderRadius: ds.borderRadius.xl,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#fff',
    fontSize: t.fontSize.base,
    outline: 'none',
  };

  return (
    <>
      {/* ═══ HERO ═══ */}
      <section
        ref={heroInView.ref}
        className="relative overflow-hidden"
        style={{
          background: c.gradients.hero,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Decorative */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(184,149,106,0.12) 0%, transparent 70%)' }} />

        <Container>
          <div style={{ position: 'relative', zIndex: 10, paddingTop: sp[32], paddingBottom: sp[32] }}>
            <div style={{ maxWidth: '48rem' }}>
              {/* Badge */}
              <motion.div {...anim(0)}>
                <span style={{ ...sectionBadge(true), color: c.brand.secondaryLight, background: 'rgba(184,149,106,0.15)', border: '1px solid rgba(184,149,106,0.25)' }}>
                  <Star style={{ width: 16, height: 16 }} />
                  Novo Empreendimento
                </span>
              </motion.div>

              {/* H1 */}
              <motion.h1 {...anim(1)} style={{ fontSize: 'clamp(2rem, 6vw, 3.5rem)', fontWeight: t.fontWeight.black, letterSpacing: t.letterSpacing.tight, lineHeight: t.lineHeight.tight, color: '#fff', marginBottom: sp[6] }}>
                T1, T2 e T3 Duplex<br />
                <span style={{ color: c.brand.secondaryLight }}>nas Antas (Campanhã), Porto</span>
              </motion.h1>

              {/* Subheadline */}
              <motion.p {...anim(2)} style={{ fontSize: t.fontSize.xl, lineHeight: t.lineHeight.relaxed, color: 'rgba(255,255,255,0.8)', marginBottom: sp[6] }}>
                Três apartamentos a estrear, com jardins privados e um duplex com sótão — numa rua residencial com acessos e transportes por perto.
              </motion.p>

              {/* Location */}
              <motion.div {...anim(3)} className="flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.6)', marginBottom: sp[8] }}>
                <MapPin style={{ width: 16, height: 16, flexShrink: 0 }} />
                <span style={{ fontSize: t.fontSize.sm }}>Rua Manuel Carqueja, 259 — Porto (Campanhã)</span>
              </motion.div>

              {/* Price */}
              <motion.div {...anim(4)} style={{ marginBottom: sp[10] }}>
                <p style={{ fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, letterSpacing: t.letterSpacing.widest, textTransform: 'uppercase', color: c.brand.secondaryLight, marginBottom: sp[1] }}>
                  Tabela de Preços Sob Consulta
                </p>
                <p style={{ fontSize: t.fontSize.sm, color: 'rgba(255,255,255,0.5)' }}>
                  Receba a brochura com plantas, áreas e valores.
                </p>
              </motion.div>

              {/* CTAs */}
              <motion.div {...anim(5)} className="flex flex-wrap gap-4 items-center">
                <motion.button onClick={scrollToForm} style={ctaButtonPrimary} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Calendar style={{ width: 20, height: 20 }} /> AGENDAR VISITA
                </motion.button>
                <motion.button onClick={scrollToForm} style={ctaButtonOutline} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Download style={{ width: 20, height: 20 }} /> DOWNLOAD PLANTAS (PDF)
                </motion.button>
                <motion.button onClick={handleWhatsApp} style={{ display: 'inline-flex', alignItems: 'center', gap: sp[2], padding: sp[3], fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium, color: 'rgba(255,255,255,0.7)', background: 'none', border: 'none', cursor: 'pointer' }} whileHover={{ color: '#fff' }}>
                  <MessageCircle style={{ width: 16, height: 16 }} /> Falar por WhatsApp
                </motion.button>
              </motion.div>
            </div>

            {/* Counters */}
            <motion.div {...anim(6)} className="grid grid-cols-3 gap-6" style={{ marginTop: sp[20], maxWidth: '40rem' }}>
              {counters.map((ct, i) => (
                <div key={i}>
                  <p style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: t.fontWeight.black, color: '#fff', lineHeight: 1 }}>
                    {ct.value}
                    <span style={{ fontSize: t.fontSize['2xl'], color: c.brand.secondaryLight, marginLeft: sp[1] }}>{ct.suffix}</span>
                  </p>
                  <p style={{ fontSize: t.fontSize.sm, color: 'rgba(255,255,255,0.5)', marginTop: sp[2], lineHeight: t.lineHeight.snug }}>{ct.label}</p>
                </div>
              ))}
            </motion.div>

            {/* Highlights */}
            <motion.div {...anim(7)} className="grid grid-cols-2 gap-4" style={{ marginTop: sp[12] }}>
              {highlights.map((h, i) => (
                <motion.div key={i} className="flex items-start gap-3 p-4 rounded-3xl" style={{ background: 'linear-gradient(135deg, rgba(26,62,92,0.35), rgba(15,39,56,0.45))', border: '2px solid rgba(255,255,255,0.15)', boxShadow: '0 8px 32px rgba(0,0,0,0.2)' }} whileHover={isMobile ? {} : { y: -4, scale: 1.01 }}>
                  <span style={{ fontSize: t.fontSize.xl, flexShrink: 0, marginTop: 2 }}>{h.icon}</span>
                  <p style={{ fontSize: t.fontSize.sm, color: 'rgba(255,255,255,0.85)', lineHeight: t.lineHeight.snug }}>{h.text}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Container>

        {/* Scroll indicator */}
        <motion.div className="absolute" style={{ bottom: sp[8], left: '50%', transform: 'translateX(-50%)' }} animate={{ y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronDown style={{ width: 24, height: 24, color: 'rgba(255,255,255,0.4)' }} />
        </motion.div>
      </section>

      {/* ═══ O EMPREENDIMENTO ═══ */}
      <Section background="white">
        <Container>
          <div ref={empInView.ref} className="text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={empInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
              <span style={sectionBadge()}>O Empreendimento</span>
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={empInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={sectionTitle}>
              VELASK Residence
            </motion.h2>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={empInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ maxWidth: '48rem', margin: '0 auto', marginBottom: sp[12] }}>
              <p style={{ ...bodyText, marginBottom: sp[5] }}>
                O VELASK Residence foi pensado para quem quer viver o Porto com mais espaço exterior — sem abdicar de um interior contemporâneo e funcional. São apenas três apartamentos, cada um com um diferencial claro: jardim + garagem, jardim + anexo, ou duplex com sótão.
              </p>
              <p style={bodyText}>
                As plantas privilegiam zonas sociais integradas e arrumação, com áreas exteriores desenhadas para refeições ao ar livre e momentos de descanso. <em style={{ fontSize: t.fontSize.sm, color: c.neutral[500] }}>(Imagens 3D ilustrativas.)</em>
              </p>
            </motion.div>

            <div className="grid gap-6" style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', maxWidth: '64rem', margin: '0 auto' }}>
              {benefits.map((b, i) => (
                <motion.div key={i} className="flex items-start gap-3" style={{ ...cardBase, padding: sp[8], textAlign: 'left' }} initial={{ opacity: 0, y: 20 }} animate={empInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }} whileHover={isMobile ? {} : { y: -8, scale: 1.02 }}>
                  <CheckCircle style={{ width: 20, height: 20, flexShrink: 0, marginTop: 2, color: c.brand.secondary }} />
                  <p style={{ fontSize: t.fontSize.base, lineHeight: t.lineHeight.relaxed, color: c.neutral[700] }}>{b}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ INTERIORES ═══ */}
      <Section background="muted">
        <Container>
          <div ref={intInView.ref} className="text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={intInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
              <span style={sectionBadge(true)}>Conceito de Interiores</span>
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={intInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={sectionTitle}>
              Interiores contemporâneos, luz e funcionalidade
            </motion.h2>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={intInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ ...bodyText, maxWidth: '48rem', margin: `0 auto ${sp[12]}` }}>
              Um conceito de interiores minimalista e quente, com tons claros, detalhes em madeira e linhas limpas. Cozinha integrada com bancada escura e zonas pensadas para viver e receber.
            </motion.p>

            <div className="grid gap-6" style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', maxWidth: '64rem', margin: '0 auto' }}>
              {interiorFeatures.map((f, i) => (
                <motion.div key={i} style={{ ...cardBase, padding: sp[8], textAlign: 'left' }} initial={{ opacity: 0, y: 20 }} animate={intInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }} whileHover={isMobile ? {} : { y: -8, scale: 1.02 }}>
                  <div style={{ width: 40, height: 40, borderRadius: ds.borderRadius.lg, background: 'rgba(26,62,92,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: sp[4] }}>
                    <Home style={{ width: 20, height: 20, color: c.brand.primary }} />
                  </div>
                  <h3 style={{ fontSize: t.fontSize.lg, fontWeight: t.fontWeight.bold, color: c.neutral[900], marginBottom: sp[2], lineHeight: t.lineHeight.snug }}>{f.title}</h3>
                  <p style={{ fontSize: t.fontSize.sm, lineHeight: t.lineHeight.relaxed, color: c.neutral[600] }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>

            <motion.p initial={{ opacity: 0 }} animate={intInView.isInView ? { opacity: 1 } : {}} transition={{ duration: 0.5, delay: 0.8 }} style={{ fontSize: t.fontSize.xs, fontStyle: 'italic', color: c.neutral[500], marginTop: sp[10] }}>
              As imagens e renders são meramente ilustrativos. Mobiliário e decoração não incluídos. Soluções finais dependem de projeto de acabamentos.
            </motion.p>
          </div>
        </Container>
      </Section>

      {/* ═══ PLANTAS E TIPOLOGIAS ═══ */}
      <Section background="white">
        <Container>
          <div ref={planInView.ref} className="text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={planInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
              <span style={sectionBadge()}>Plantas e Tipologias</span>
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={planInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={sectionTitle}>
              Compare as 3 unidades
            </motion.h2>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={planInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ ...bodyText, maxWidth: '42rem', margin: `0 auto ${sp[6]}` }}>
              Compare as três unidades lado a lado. Aqui as áreas estão detalhadas (interior + exterior + extras) para evitar confusão com "área bruta".
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={planInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }} style={{ marginBottom: sp[12] }}>
              <motion.button onClick={scrollToForm} style={{ ...ctaButtonPrimary, background: c.gradients.primary, boxShadow: ds.shadows.primaryHover }} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                <Download style={{ width: 18, height: 18 }} /> DOWNLOAD PLANTAS (PDF)
              </motion.button>
            </motion.div>

            <Tabs defaultValue="rc" className="flex flex-col gap-2">
              <TabsList className="inline-flex items-center justify-center rounded-xl p-0 gap-2 flex-wrap" style={{ background: 'transparent', height: 'auto', marginBottom: sp[8] }}>
                {units.map((u) => (
                  <TabsTrigger key={u.id} value={u.id} style={{ padding: `${sp[3]} ${sp[6]}`, borderRadius: ds.borderRadius.full, fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold }}>
                    {u.tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              {units.map((unit) => (
                <TabsContent key={unit.id} value={unit.id}>
                  <div className="rounded-3xl overflow-hidden" style={{ background: c.neutral[50], border: `1px solid ${c.neutral[200]}` }}>
                    <div className="grid" style={{ gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr' }}>
                      {/* Plan placeholder */}
                      <div className="flex items-center justify-center" style={{ padding: sp[12], minHeight: isMobile ? 200 : 400, background: `linear-gradient(135deg, ${c.neutral[100]} 0%, ${c.neutral[200]} 100%)` }}>
                        <div className="text-center">
                          <Building style={{ width: 48, height: 48, margin: '0 auto', marginBottom: sp[4], color: c.neutral[400] }} />
                          <p style={{ fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium, color: c.neutral[500] }}>Planta do {unit.title}</p>
                          <p style={{ fontSize: t.fontSize.xs, color: c.neutral[400], marginTop: sp[1] }}>Imagem ilustrativa</p>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex flex-col justify-center" style={{ padding: isMobile ? sp[8] : sp[12] }}>
                        <div className="flex items-center gap-3" style={{ marginBottom: sp[2] }}>
                          <h3 style={{ fontSize: t.fontSize['2xl'], fontWeight: t.fontWeight.bold, color: c.neutral[900] }}>{unit.title}</h3>
                          <span style={{ fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, padding: `${sp[1]} ${sp[3]}`, borderRadius: ds.borderRadius.full, background: `${unit.color}15`, color: unit.color }}>{unit.area}</span>
                        </div>

                        <p style={{ ...bodyText, fontSize: t.fontSize.base, marginBottom: sp[6] }}>{unit.summary}</p>

                        <div className="grid grid-cols-2 gap-3" style={{ marginBottom: sp[8] }}>
                          {unit.specs.map((s, i) => (
                            <div key={i} className="flex items-center gap-2 p-3 rounded-xl" style={{ background: '#fff', border: `1px solid ${c.neutral[200]}` }}>
                              <Ruler style={{ width: 16, height: 16, flexShrink: 0, color: unit.color }} />
                              <div>
                                <p style={{ fontSize: t.fontSize.xs, color: c.neutral[500] }}>{s.label}</p>
                                <p style={{ fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: c.neutral[800] }}>{s.value}</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        <div style={{ marginBottom: sp[8] }}>
                          {unit.copy.map((p, i) => (
                            <p key={i} style={{ fontSize: t.fontSize.sm, lineHeight: t.lineHeight.relaxed, color: c.neutral[600], marginBottom: i === 0 ? sp[4] : 0 }}>{p}</p>
                          ))}
                        </div>

                        <motion.button onClick={scrollToForm} style={{ display: 'inline-flex', alignItems: 'center', gap: sp[2], padding: `${sp[3]} ${sp[6]}`, borderRadius: ds.borderRadius.full, background: unit.color, color: '#fff', fontWeight: t.fontWeight.semibold, fontSize: t.fontSize.sm, border: 'none', cursor: 'pointer', boxShadow: `0 4px 14px ${unit.color}40`, width: 'fit-content' }} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                          {unit.cta} <ArrowRight style={{ width: 16, height: 16 }} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </Container>
      </Section>

      {/* ═══ GALERIA ═══ */}
      <Section background="muted">
        <Container>
          <div ref={galInView.ref} className="text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={galInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
              <span style={sectionBadge(true)}>Galeria</span>
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={galInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={{ ...sectionTitle, marginBottom: sp[4] }}>
              Ambientes e inspiração
            </motion.h2>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={galInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ ...bodyText, maxWidth: '42rem', margin: `0 auto ${sp[12]}` }}>
              Explore o conceito de interiores e exteriores. <em>(Imagens 3D ilustrativas.)</em>
            </motion.p>

            <div className="grid grid-cols-2 gap-4" style={{ gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)' }}>
              {galleryItems.map((item, i) => (
                <motion.div key={i} className="group relative overflow-hidden cursor-pointer rounded-3xl" initial={{ opacity: 0, scale: 0.9 }} animate={galInView.isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }} style={{
                  background: `linear-gradient(135deg, ${c.neutral[200]} 0%, ${c.neutral[300]} 100%)`,
                  minHeight: i === 0 && !isMobile ? 320 : 180,
                  gridColumn: i === 0 && !isMobile ? 'span 2' : undefined,
                  gridRow: i === 0 && !isMobile ? 'span 2' : undefined,
                }} whileHover={isMobile ? {} : { scale: 1.02 }}>
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <Eye style={{ width: 32, height: 32, color: c.neutral[400] }} />
                  </div>
                  <div className="absolute" style={{ inset: '0', top: 'auto', padding: sp[4], background: 'linear-gradient(to top, rgba(26,62,92,0.75), transparent)' }}>
                    <p style={{ color: '#fff', fontSize: t.fontSize.xs, fontWeight: t.fontWeight.medium, lineHeight: t.lineHeight.snug }}>{item}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ LOCALIZAÇÃO ═══ */}
      <Section background="white">
        <Container>
          <div ref={locInView.ref} className="text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={locInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
              <span style={sectionBadge()}>Localização</span>
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={locInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={sectionTitle}>
              Tudo ao seu alcance
            </motion.h2>

            <motion.p initial={{ opacity: 0, y: 30 }} animate={locInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.15 }} style={{ fontSize: t.fontSize.base, color: c.neutral[600], marginBottom: sp[4] }}>
              Rua Manuel Carqueja, 259 — Porto (Campanhã)
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={locInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ marginBottom: sp[12] }}>
              <motion.a href="https://www.google.com/maps/search/Rua+Manuel+Carqueja+259+Porto" target="_blank" rel="noopener noreferrer" style={{ ...ctaButtonPrimary, background: c.gradients.primary, boxShadow: ds.shadows.primaryHover, textDecoration: 'none' }} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }}>
                <MapPin style={{ width: 18, height: 18 }} /> VER NO MAPA <ExternalLink style={{ width: 14, height: 14 }} />
              </motion.a>
            </motion.div>

            <div className="grid gap-6" style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)' }}>
              {locationCards.map((card, i) => (
                <motion.div key={i} style={{ ...cardBase, padding: sp[8], textAlign: 'left' }} initial={{ opacity: 0, y: 20 }} animate={locInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }} whileHover={isMobile ? {} : { y: -8, scale: 1.02 }}>
                  <div style={{ width: 40, height: 40, borderRadius: ds.borderRadius.full, background: c.gradients.primary, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: t.fontSize.sm, fontWeight: t.fontWeight.bold, marginBottom: sp[4] }}>
                    {card.num}
                  </div>
                  <h3 style={{ fontSize: t.fontSize.lg, fontWeight: t.fontWeight.bold, color: c.neutral[900], marginBottom: sp[2], lineHeight: t.lineHeight.snug }}>{card.title}</h3>
                  <p style={{ fontSize: t.fontSize.sm, lineHeight: t.lineHeight.relaxed, color: c.neutral[600] }}>{card.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══ PREÇOS ═══ */}
      <Section background="muted">
        <Container>
          <div ref={priceInView.ref} className="text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={priceInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
              <span style={sectionBadge(true)}>Investimento</span>
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={priceInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={{ ...sectionTitle, marginBottom: sp[12] }}>
              Preços e Disponibilidade
            </motion.h2>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={priceInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ maxWidth: '56rem', margin: '0 auto' }}>
              {/* Desktop table */}
              {!isMobile && (
                <div className="rounded-3xl overflow-hidden" style={{ background: '#fff', border: `1px solid ${c.neutral[200]}` }}>
                  <table style={{ width: '100%' }}>
                    <thead>
                      <tr style={{ background: c.brand.primary }}>
                        {['Unidade', 'Piso', 'Tipologia', 'Área bruta (m²)', 'Preço', 'Estado'].map(h => (
                          <th key={h} style={{ textAlign: 'left', fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: '#fff', padding: `${sp[4]} ${sp[6]}` }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {pricingRows.map((row, i) => (
                        <tr key={i} style={{ borderBottom: i < pricingRows.length - 1 ? `1px solid ${c.neutral[200]}` : 'none' }}>
                          <td style={{ padding: `${sp[5]} ${sp[6]}`, fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: c.neutral[900] }}>{row.unit}</td>
                          <td style={{ padding: `${sp[5]} ${sp[6]}`, fontSize: t.fontSize.sm, color: c.neutral[700] }}>{row.floor}</td>
                          <td style={{ padding: `${sp[5]} ${sp[6]}`, fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium, color: c.brand.primary }}>{row.type}</td>
                          <td style={{ padding: `${sp[5]} ${sp[6]}`, fontSize: t.fontSize.sm, color: c.neutral[700] }}>{row.area}</td>
                          <td style={{ padding: `${sp[5]} ${sp[6]}`, fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: c.brand.secondary }}>{row.price}</td>
                          <td style={{ padding: `${sp[5]} ${sp[6]}` }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: sp[1], fontSize: t.fontSize.xs, fontWeight: t.fontWeight.semibold, padding: `${sp[1]} ${sp[3]}`, borderRadius: ds.borderRadius.full, background: 'rgba(16,185,129,0.1)', color: c.semantic.success }}>
                              <span style={{ width: 6, height: 6, borderRadius: '50%', background: c.semantic.success }} />{row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Mobile cards */}
              {isMobile && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: sp[4] }}>
                  {pricingRows.map((row, i) => (
                    <div key={i} className="rounded-3xl" style={{ ...cardBase, padding: sp[6] }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: sp[3] }}>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: t.fontSize.lg, fontWeight: t.fontWeight.bold, color: c.brand.primary }}>Unidade {row.unit}</span>
                          <span style={{ fontSize: t.fontSize.sm, fontWeight: t.fontWeight.medium, color: c.neutral[600] }}>{row.type}</span>
                        </div>
                        <span style={{ fontSize: t.fontSize.xs, fontWeight: t.fontWeight.semibold, padding: `${sp[1]} ${sp[3]}`, borderRadius: ds.borderRadius.full, background: 'rgba(16,185,129,0.1)', color: c.semantic.success }}>{row.status}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2" style={{ fontSize: t.fontSize.sm }}>
                        <div><span style={{ color: c.neutral[500] }}>Piso: </span><span style={{ fontWeight: t.fontWeight.medium, color: c.neutral[800] }}>{row.floor}</span></div>
                        <div><span style={{ color: c.neutral[500] }}>Área: </span><span style={{ fontWeight: t.fontWeight.medium, color: c.neutral[800] }}>{row.area} m²</span></div>
                      </div>
                      <div style={{ marginTop: sp[3], paddingTop: sp[3], borderTop: `1px solid ${c.neutral[200]}` }}>
                        <p style={{ fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: c.brand.secondary }}>{row.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <p style={{ fontSize: t.fontSize.xs, color: c.neutral[500], marginTop: sp[6], lineHeight: t.lineHeight.relaxed }}>
                Áreas brutas incluem componentes como jardim/pátio/varanda/garagem/anexo/sótão conforme unidade. Solicite a brochura para detalhe completo.
              </p>

              <div style={{ marginTop: sp[8] }}>
                <motion.button onClick={scrollToForm} style={ctaButtonPrimary} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  PEDIR TABELA DE PREÇOS <ArrowRight style={{ width: 20, height: 20 }} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* ═══ GESTOR DE VENDAS ═══ */}
      <Section background="white">
        <Container>
          <div ref={contactInView.ref} style={{ maxWidth: '48rem', margin: '0 auto' }}>
            <motion.div className="text-center" initial={{ opacity: 0, y: 30 }} animate={contactInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
              <span style={sectionBadge()}>Contactos</span>
              <h2 style={{ ...sectionTitle, marginBottom: sp[6] }}>Gestor de Vendas</h2>
              <p style={{ ...bodyText, marginBottom: sp[10] }}>
                Acompanhamo-lo(a) em todo o processo: esclarecimento de áreas, mapa de acabamentos, simulações de financiamento e agendamento de visita.
              </p>

              <div className="grid gap-4" style={{ gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', marginBottom: sp[8] }}>
                {[
                  { icon: Phone, label: '+351 000 000 000', sub: 'Telefone', href: 'tel:+351000000000', iconColor: c.brand.primary, bgColor: 'rgba(26,62,92,0.08)' },
                  { icon: Mail, label: 'info@velaskresidence.pt', sub: 'Email', href: 'mailto:info@velaskresidence.pt', iconColor: c.brand.secondary, bgColor: 'rgba(184,149,106,0.1)' },
                  { icon: MessageCircle, label: 'WhatsApp', sub: 'Mensagem', onClick: handleWhatsApp, iconColor: c.external.whatsappPrimary, bgColor: 'rgba(37,211,102,0.08)' },
                ].map((item, i) => (
                  <motion.a key={i} href={item.href} onClick={item.onClick} className="flex flex-col items-center gap-3 p-6 rounded-3xl" style={{ ...cardBase, textDecoration: 'none', cursor: 'pointer' }} whileHover={isMobile ? {} : { scale: 1.02, x: 4 }}>
                    <div className="flex items-center justify-center rounded-full" style={{ width: 48, height: 48, background: item.bgColor }}>
                      <item.icon style={{ width: 20, height: 20, color: item.iconColor }} />
                    </div>
                    <p style={{ fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: c.neutral[800] }}>{item.label}</p>
                    <p style={{ fontSize: t.fontSize.xs, color: c.neutral[500] }}>{item.sub}</p>
                  </motion.a>
                ))}
              </div>

              <div className="flex gap-4 justify-center" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
                <motion.a href="tel:+351000000000" style={{ ...ctaButtonPrimary, background: c.gradients.primary, boxShadow: ds.shadows.primaryHover, textDecoration: 'none', justifyContent: 'center' }} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <Phone style={{ width: 20, height: 20 }} /> LIGAR AGORA
                </motion.a>
                <motion.button onClick={handleWhatsApp} style={{ ...ctaButtonPrimary, background: c.external.whatsappPrimary, boxShadow: '0 4px 14px rgba(37,211,102,0.3)', justifyContent: 'center' }} whileHover={isMobile ? {} : { scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
                  <MessageCircle style={{ width: 20, height: 20 }} /> ENVIAR WHATSAPP
                </motion.button>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* ═══ FORMULÁRIO ═══ */}
      <section id="velask-form" style={{ background: c.gradients.heroLuxury, padding: `${sp[24]} 0` }}>
        <Container>
          <div ref={formInView.ref} style={{ maxWidth: '42rem', margin: '0 auto' }}>
            <motion.div className="text-center" initial={{ opacity: 0, y: 30 }} animate={formInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
              <span style={{ ...sectionBadge(true), color: c.brand.secondaryLight, background: 'rgba(184,149,106,0.15)', border: '1px solid rgba(184,149,106,0.25)' }}>Contacte-nos</span>
              <h2 style={{ ...sectionTitle, color: '#fff', marginBottom: sp[4] }}>Receba a brochura completa</h2>
              <p style={{ fontSize: t.fontSize.base, color: 'rgba(255,255,255,0.7)', marginBottom: sp[10] }}>
                Plantas, áreas detalhadas e disponibilidade. Envio por email.
              </p>

              {formSubmitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center rounded-3xl" style={{ padding: sp[12], background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)' }}>
                  <div className="flex items-center justify-center rounded-full" style={{ width: 64, height: 64, background: 'rgba(16,185,129,0.2)', margin: `0 auto ${sp[6]}` }}>
                    <CheckCircle style={{ width: 32, height: 32, color: c.semantic.success }} />
                  </div>
                  <h3 style={{ fontSize: t.fontSize['2xl'], fontWeight: t.fontWeight.bold, color: '#fff', marginBottom: sp[3] }}>Obrigado!</h3>
                  <p style={{ fontSize: t.fontSize.base, color: 'rgba(255,255,255,0.7)' }}>Vamos enviar a brochura e entrar em contacto para agendar visita.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleFormSubmit} className="rounded-3xl" style={{ padding: isMobile ? sp[8] : sp[10], background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(12px)', textAlign: 'left' }}>
                  <div className="grid gap-5" style={{ gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', marginBottom: sp[5] }}>
                    <div>
                      <label style={{ display: 'block', fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: 'rgba(255,255,255,0.8)', marginBottom: sp[2] }}>Nome <span style={{ color: c.brand.secondaryLight }}>*</span></label>
                      <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={inputStyle} placeholder="O seu nome" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: 'rgba(255,255,255,0.8)', marginBottom: sp[2] }}>Email <span style={{ color: c.brand.secondaryLight }}>*</span></label>
                      <input type="email" required value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={inputStyle} placeholder="email@exemplo.com" />
                    </div>
                  </div>
                  <div className="grid gap-5" style={{ gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', marginBottom: sp[5] }}>
                    <div>
                      <label style={{ display: 'block', fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: 'rgba(255,255,255,0.8)', marginBottom: sp[2] }}>Telefone <span style={{ color: c.brand.secondaryLight }}>*</span></label>
                      <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={inputStyle} placeholder="+351 000 000 000" />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: 'rgba(255,255,255,0.8)', marginBottom: sp[2] }}>Tipologia de interesse</label>
                      <select value={formData.typology} onChange={(e) => setFormData({ ...formData, typology: e.target.value })} style={inputStyle}>
                        <option value="" style={{ color: '#333' }}>Selecione...</option>
                        <option value="t1" style={{ color: '#333' }}>T1 com Jardim + Garagem</option>
                        <option value="t2" style={{ color: '#333' }}>T2 com Jardim + Anexo</option>
                        <option value="t3" style={{ color: '#333' }}>T3 Duplex com Sótão</option>
                        <option value="unsure" style={{ color: '#333' }}>Ainda não sei</option>
                      </select>
                    </div>
                  </div>
                  <div style={{ marginBottom: sp[5] }}>
                    <label style={{ display: 'block', fontSize: t.fontSize.sm, fontWeight: t.fontWeight.semibold, color: 'rgba(255,255,255,0.8)', marginBottom: sp[2] }}>Mensagem <span style={{ fontSize: t.fontSize.xs, fontWeight: t.fontWeight.normal, color: 'rgba(255,255,255,0.5)' }}>(opcional)</span></label>
                    <textarea rows={4} value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} style={{ ...inputStyle, resize: 'none' }} placeholder="Alguma questão ou pedido?" />
                  </div>

                  <div style={{ marginBottom: sp[6] }}>
                    {[
                      { key: 'consentContact', text: 'Autorizo o contacto para efeitos de informação comercial sobre este imóvel.' },
                      { key: 'consentPrivacy', text: 'Li e aceito a Política de Privacidade.' },
                    ].map((cb) => (
                      <label key={cb.key} className="flex items-start gap-3 cursor-pointer" style={{ marginBottom: sp[3] }}>
                        <input type="checkbox" required checked={(formData as Record<string, unknown>)[cb.key] as boolean} onChange={(e) => setFormData({ ...formData, [cb.key]: e.target.checked })} style={{ marginTop: 4, width: 16, height: 16 }} />
                        <span style={{ fontSize: t.fontSize.xs, lineHeight: t.lineHeight.relaxed, color: 'rgba(255,255,255,0.6)' }}>
                          {cb.text} <span style={{ color: c.brand.secondaryLight }}>*</span>
                        </span>
                      </label>
                    ))}
                  </div>

                  <motion.button type="submit" className="flex items-center justify-center gap-2" style={{ ...ctaButtonPrimary, width: '100%', justifyContent: 'center' }} whileHover={isMobile ? {} : { scale: 1.02 }} whileTap={{ scale: 0.95 }}>
                    <Send style={{ width: 20, height: 20 }} /> QUERO RECEBER A BROCHURA
                  </motion.button>
                </form>
              )}
            </motion.div>
          </div>
        </Container>
      </section>

      {/* ═══ FAQ ═══ */}
      <Section background="white">
        <Container>
          <div ref={faqInView.ref} className="text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={faqInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}>
              <span style={sectionBadge()}>FAQ</span>
            </motion.div>

            <motion.h2 initial={{ opacity: 0, y: 30 }} animate={faqInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} style={{ ...sectionTitle, marginBottom: sp[12] }}>
              Perguntas frequentes
            </motion.h2>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={faqInView.isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} style={{ maxWidth: '48rem', margin: '0 auto', textAlign: 'left' }}>
              <Accordion type="single" collapsible>
                {faqItems.map((item, i) => (
                  <AccordionItem key={i} value={`faq-${i}`} style={{ borderColor: c.neutral[200] }}>
                    <AccordionTrigger style={{ padding: `${sp[5]} 0`, fontSize: t.fontSize.base, fontWeight: t.fontWeight.semibold, color: c.neutral[800] }}>
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p style={{ fontSize: t.fontSize.sm, lineHeight: t.lineHeight.relaxed, color: c.neutral[600], paddingBottom: sp[2] }}>{item.a}</p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* ═══ LEGAL FOOTER ═══ */}
      <section style={{ background: c.neutral[950], borderTop: `1px solid ${c.neutral[800]}`, padding: `${sp[8]} 0` }}>
        <Container>
          <div className="flex items-center justify-between gap-4" style={{ flexDirection: isMobile ? 'column' : 'row' }}>
            <p style={{ fontSize: t.fontSize.xs, lineHeight: t.lineHeight.relaxed, color: c.neutral[500], textAlign: isMobile ? 'center' : 'left' }}>
              As imagens e renders 3D são ilustrativos e não vinculativos. As áreas são aproximadas e devem ser confirmadas com documentação oficial. Esta informação não constitui proposta contratual e pode ser alterada sem aviso.
            </p>
            <p style={{ fontSize: t.fontSize.xs, color: c.neutral[600], whiteSpace: 'nowrap' }}>
              VELASK Residence &copy; {new Date().getFullYear()}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
