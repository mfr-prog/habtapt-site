'use client';

import React, { useState } from 'react';
import { Container } from '../components/Container';
import { Section } from '../components/Section';
import { motion } from 'motion/react';
import { useInView } from '../components/useInView';
import { designSystem } from '../components/design-system';
import {
  MapPin, Phone, Mail, MessageCircle, Download, ArrowRight,
  CheckCircle, Home, Building, Maximize, Square, ChevronRight,
  ExternalLink, Bath, BedDouble, Ruler, Calendar, Shield, Star,
  HelpCircle, ChevronDown, Send, Eye,
} from '../components/icons';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../components/ui/accordion';

// ─── Animation helpers ───────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] },
  }),
};

const fadeIn = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] },
  }),
};

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
  {
    title: 'Cozinha',
    desc: 'Linguagem contemporânea, bancada escura e integração com a sala',
  },
  {
    title: 'Sala',
    desc: 'Possibilidade de separação visual com elementos envidraçados (conceito)',
  },
  {
    title: 'Quartos',
    desc: 'Ambientes simples com boa arrumação',
  },
  {
    title: 'Casas de banho',
    desc: 'Revestimentos claros tipo pedra e móveis suspensos (conceito)',
  },
  {
    title: 'Duplex',
    desc: 'Escada com integração estética e área extra no piso superior (conceito)',
  },
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
    color: designSystem.colors.brand.primary,
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
    color: designSystem.colors.brand.secondary,
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
  {
    num: '01',
    title: 'Transportes',
    desc: 'Paragens de autocarro como S. Crispim e Monte Aventino a cerca de 5 minutos a pé e estação de metro Combatentes a ~15 minutos a pé.',
  },
  {
    num: '02',
    title: 'Zona das Antas',
    desc: 'Uma envolvente residencial consolidada, com vida de bairro e acessos rápidos ao resto do Porto.',
  },
  {
    num: '03',
    title: 'Parque de S. Roque',
    desc: 'Perto do portão principal do Parque de S. Roque — opção verde para caminhar e desligar do ritmo da cidade.',
  },
  {
    num: '04',
    title: 'Serviços do dia a dia',
    desc: 'Supermercados, escolas, farmácias, ginásios e restauração a curta distância — conveniência sem depender do carro.',
  },
  {
    num: '05',
    title: 'Mobilidade e acessos',
    desc: 'Localização prática para circular entre centro, zona oriental e principais vias.',
  },
];

const pricingRows = [
  { unit: 'A', floor: 'R/C', type: 'T1', area: '118,44', price: 'Sob consulta', status: 'Disponível' },
  { unit: 'B', floor: 'Piso 1', type: 'T2', area: '106,78', price: 'Sob consulta', status: 'Disponível' },
  { unit: 'C', floor: 'Piso 2 (Duplex)', type: 'T3', area: '108,67', price: 'Sob consulta', status: 'Disponível' },
];

const faqItems = [
  {
    q: 'As áreas exteriores são privativas?',
    a: 'Confirme na documentação da propriedade horizontal. Na brochura indicamos o detalhe por unidade.',
  },
  {
    q: 'O que inclui a "área bruta" de cada unidade?',
    a: 'Cada unidade integra componentes diferentes (ex.: garagem, anexo, sótão). Por isso mostramos a decomposição completa na brochura.',
  },
  {
    q: 'O sótão do duplex conta como área habitacional?',
    a: 'Depende do licenciamento e do pé-direito/condições. Esclarecemos isso no processo (e deve estar refletido no CPCV).',
  },
  {
    q: 'Há garagem?',
    a: 'A unidade do R/C inclui garagem privativa.',
  },
  {
    q: 'Como posso agendar visita?',
    a: 'Clique em "Agendar visita" e indique o melhor dia/horário. Respondemos no próprio dia útil.',
  },
];

// ─── Component ───────────────────────────────────────────────────────────────
export function VelaskPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    typology: '',
    message: '',
    consentContact: false,
    consentPrivacy: false,
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

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
    window.open(
      'https://wa.me/351000000000?text=Olá! Gostaria de saber mais sobre o VELASK Residence.',
      '_blank'
    );
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: integrate with Supabase / n8n
    setFormSubmitted(true);
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        ref={heroInView.ref}
        className="relative overflow-hidden"
        style={{
          background: designSystem.colors.gradients.hero,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Decorative elements */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 70% 40%, rgba(184,149,106,0.12) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-0 right-0 w-1/2 h-full pointer-events-none opacity-[0.04]"
          style={{
            backgroundImage: `repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 1px, transparent 40px)`,
          }}
        />

        <Container className="relative z-10 py-32 lg:py-40">
          <div className="max-w-3xl">
            {/* Badge */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={heroInView.isInView ? 'visible' : 'hidden'}
              custom={0}
            >
              <span
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold tracking-wider uppercase mb-8"
                style={{
                  background: 'rgba(184,149,106,0.15)',
                  color: designSystem.colors.brand.secondaryLight,
                  border: '1px solid rgba(184,149,106,0.25)',
                }}
              >
                <Star className="w-4 h-4" />
                Novo Empreendimento
              </span>
            </motion.div>

            {/* H1 */}
            <motion.h1
              variants={fadeUp}
              initial="hidden"
              animate={heroInView.isInView ? 'visible' : 'hidden'}
              custom={1}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white mb-6"
              style={{ letterSpacing: designSystem.typography.letterSpacing.tight }}
            >
              T1, T2 e T3 Duplex
              <br />
              <span style={{ color: designSystem.colors.brand.secondaryLight }}>
                nas Antas (Campanhã), Porto
              </span>
            </motion.h1>

            {/* Subheadline */}
            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={heroInView.isInView ? 'visible' : 'hidden'}
              custom={2}
              className="text-lg sm:text-xl leading-relaxed mb-6"
              style={{ color: 'rgba(255,255,255,0.8)' }}
            >
              Três apartamentos a estrear, com jardins privados e um duplex com sótão
              — numa rua residencial com acessos e transportes por perto.
            </motion.p>

            {/* Location line */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={heroInView.isInView ? 'visible' : 'hidden'}
              custom={3}
              className="flex items-center gap-2 mb-8"
              style={{ color: 'rgba(255,255,255,0.6)' }}
            >
              <MapPin className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm">Rua Manuel Carqueja, 259 — Porto (Campanhã)</span>
            </motion.div>

            {/* Price */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={heroInView.isInView ? 'visible' : 'hidden'}
              custom={4}
              className="mb-10"
            >
              <p
                className="text-sm font-semibold tracking-widest uppercase mb-1"
                style={{ color: designSystem.colors.brand.secondaryLight }}
              >
                Tabela de Preços Sob Consulta
              </p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Receba a brochura com plantas, áreas e valores.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={heroInView.isInView ? 'visible' : 'hidden'}
              custom={5}
              className="flex flex-wrap gap-4 items-center"
            >
              <button
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                style={{
                  background: designSystem.colors.gradients.secondary,
                  color: '#fff',
                  boxShadow: designSystem.shadows.secondaryHover,
                }}
              >
                <Calendar className="w-5 h-5" />
                AGENDAR VISITA
              </button>

              <button
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.2)',
                  backdropFilter: 'blur(8px)',
                }}
              >
                <Download className="w-5 h-5" />
                DOWNLOAD PLANTAS (PDF)
              </button>

              <button
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all duration-300 hover:underline"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                <MessageCircle className="w-4 h-4" />
                Falar por WhatsApp
              </button>
            </motion.div>
          </div>

          {/* Counters */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={heroInView.isInView ? 'visible' : 'hidden'}
            custom={6}
            className="grid grid-cols-3 gap-6 mt-16 lg:mt-20 max-w-2xl"
          >
            {counters.map((c, i) => (
              <div key={i} className="text-center sm:text-left">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-none">
                  {c.value}
                  <span
                    className="text-xl sm:text-2xl ml-1"
                    style={{ color: designSystem.colors.brand.secondaryLight }}
                  >
                    {c.suffix}
                  </span>
                </p>
                <p
                  className="text-xs sm:text-sm mt-2 leading-snug"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {c.label}
                </p>
              </div>
            ))}
          </motion.div>

          {/* Highlights */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate={heroInView.isInView ? 'visible' : 'hidden'}
            custom={7}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12"
          >
            {highlights.map((h, i) => (
              <div
                key={i}
                className="flex items-start gap-3 p-4 rounded-xl"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              >
                <span className="text-xl flex-shrink-0 mt-0.5">{h.icon}</span>
                <p className="text-sm text-white/80 leading-snug">{h.text}</p>
              </div>
            ))}
          </motion.div>
        </Container>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <ChevronDown className="w-6 h-6 text-white/40" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════════════
          O EMPREENDIMENTO
      ═══════════════════════════════════════════════════════════════════════ */}
      <Section background="white" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <Container>
          <div ref={empInView.ref}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={empInView.isInView ? 'visible' : 'hidden'}
              custom={0}
              className="text-center mb-4"
            >
              <span
                className="inline-block text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
                style={{
                  background: `rgba(26,62,92,0.06)`,
                  color: designSystem.colors.brand.primary,
                }}
              >
                O Empreendimento
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              animate={empInView.isInView ? 'visible' : 'hidden'}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-8"
              style={{
                color: designSystem.colors.brand.primary,
                letterSpacing: designSystem.typography.letterSpacing.tight,
              }}
            >
              VELASK Residence
            </motion.h2>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={empInView.isInView ? 'visible' : 'hidden'}
              custom={2}
              className="max-w-3xl mx-auto space-y-5 mb-12"
            >
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: designSystem.colors.neutral[700] }}>
                O VELASK Residence foi pensado para quem quer viver o Porto com mais espaço exterior — sem abdicar de um interior contemporâneo e funcional. São apenas três apartamentos, cada um com um diferencial claro: jardim + garagem, jardim + anexo, ou duplex com sótão.
              </p>
              <p className="text-base sm:text-lg leading-relaxed" style={{ color: designSystem.colors.neutral[700] }}>
                As plantas privilegiam zonas sociais integradas e arrumação, com áreas exteriores desenhadas para refeições ao ar livre e momentos de descanso. <em className="text-sm" style={{ color: designSystem.colors.neutral[500] }}>(Imagens 3D ilustrativas.)</em>
              </p>
            </motion.div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {benefits.map((b, i) => (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  initial="hidden"
                  animate={empInView.isInView ? 'visible' : 'hidden'}
                  custom={i + 3}
                  className="flex items-start gap-3 p-6 rounded-2xl transition-all duration-300 hover:shadow-lg"
                  style={{
                    background: designSystem.colors.neutral[50],
                    border: `1px solid ${designSystem.colors.neutral[200]}`,
                  }}
                >
                  <CheckCircle
                    className="w-5 h-5 flex-shrink-0 mt-0.5"
                    style={{ color: designSystem.colors.brand.secondary }}
                  />
                  <p className="text-sm sm:text-base leading-relaxed" style={{ color: designSystem.colors.neutral[700] }}>
                    {b}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          INTERIORES
      ═══════════════════════════════════════════════════════════════════════ */}
      <Section background="muted" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <Container>
          <div ref={intInView.ref}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={intInView.isInView ? 'visible' : 'hidden'}
              custom={0}
              className="text-center mb-4"
            >
              <span
                className="inline-block text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
                style={{
                  background: 'rgba(184,149,106,0.1)',
                  color: designSystem.colors.brand.secondary,
                }}
              >
                Conceito de Interiores
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              animate={intInView.isInView ? 'visible' : 'hidden'}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-6"
              style={{
                color: designSystem.colors.brand.primary,
                letterSpacing: designSystem.typography.letterSpacing.tight,
              }}
            >
              Interiores contemporâneos, luz e funcionalidade
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={intInView.isInView ? 'visible' : 'hidden'}
              custom={2}
              className="text-base sm:text-lg leading-relaxed text-center max-w-3xl mx-auto mb-14"
              style={{ color: designSystem.colors.neutral[700] }}
            >
              Um conceito de interiores minimalista e quente, com tons claros, detalhes em madeira e linhas limpas. Cozinha integrada com bancada escura e zonas pensadas para viver e receber.
            </motion.p>

            {/* Features grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {interiorFeatures.map((f, i) => (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  initial="hidden"
                  animate={intInView.isInView ? 'visible' : 'hidden'}
                  custom={i + 3}
                  className="p-6 rounded-2xl bg-white transition-all duration-300 hover:shadow-lg"
                  style={{
                    border: `1px solid ${designSystem.colors.neutral[200]}`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                    style={{
                      background: `rgba(26,62,92,0.06)`,
                    }}
                  >
                    <Home className="w-5 h-5" style={{ color: designSystem.colors.brand.primary }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: designSystem.colors.neutral[900] }}>
                    {f.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: designSystem.colors.neutral[600] }}>
                    {f.desc}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Disclaimer */}
            <motion.p
              variants={fadeIn}
              initial="hidden"
              animate={intInView.isInView ? 'visible' : 'hidden'}
              custom={8}
              className="text-center text-xs italic mt-10"
              style={{ color: designSystem.colors.neutral[500] }}
            >
              As imagens e renders são meramente ilustrativos. Mobiliário e decoração não incluídos. Soluções finais dependem de projeto de acabamentos.
            </motion.p>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PLANTAS E TIPOLOGIAS
      ═══════════════════════════════════════════════════════════════════════ */}
      <Section background="white" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <Container>
          <div ref={planInView.ref}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={planInView.isInView ? 'visible' : 'hidden'}
              custom={0}
              className="text-center mb-4"
            >
              <span
                className="inline-block text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
                style={{
                  background: `rgba(26,62,92,0.06)`,
                  color: designSystem.colors.brand.primary,
                }}
              >
                Plantas e Tipologias
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              animate={planInView.isInView ? 'visible' : 'hidden'}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4"
              style={{
                color: designSystem.colors.brand.primary,
                letterSpacing: designSystem.typography.letterSpacing.tight,
              }}
            >
              Compare as 3 unidades
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={planInView.isInView ? 'visible' : 'hidden'}
              custom={2}
              className="text-base sm:text-lg text-center max-w-2xl mx-auto mb-6"
              style={{ color: designSystem.colors.neutral[600] }}
            >
              Compare as três unidades lado a lado. Aqui as áreas estão detalhadas (interior + exterior + extras) para evitar confusão com "área bruta".
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={planInView.isInView ? 'visible' : 'hidden'}
              custom={3}
              className="text-center mb-12"
            >
              <button
                onClick={scrollToForm}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: designSystem.colors.gradients.primary,
                  color: '#fff',
                  boxShadow: designSystem.shadows.md,
                }}
              >
                <Download className="w-4 h-4" />
                DOWNLOAD PLANTAS (PDF)
              </button>
            </motion.div>

            {/* Tabs */}
            <motion.div
              variants={fadeIn}
              initial="hidden"
              animate={planInView.isInView ? 'visible' : 'hidden'}
              custom={4}
            >
              <Tabs defaultValue="rc" className="w-full">
                <TabsList className="w-full justify-center mb-8 bg-transparent gap-2 flex-wrap h-auto p-0">
                  {units.map((u) => (
                    <TabsTrigger
                      key={u.id}
                      value={u.id}
                      className="px-6 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all duration-300 data-[state=active]:shadow-lg"
                      style={{
                        '--active-bg': u.color,
                      } as React.CSSProperties}
                    >
                      {u.tab}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {units.map((unit) => (
                  <TabsContent key={unit.id} value={unit.id}>
                    <div
                      className="rounded-3xl overflow-hidden"
                      style={{
                        background: designSystem.colors.neutral[50],
                        border: `1px solid ${designSystem.colors.neutral[200]}`,
                      }}
                    >
                      <div className="grid lg:grid-cols-2">
                        {/* Plan placeholder */}
                        <div
                          className="flex items-center justify-center p-12 min-h-[300px] lg:min-h-[500px]"
                          style={{
                            background: `linear-gradient(135deg, ${designSystem.colors.neutral[100]} 0%, ${designSystem.colors.neutral[200]} 100%)`,
                          }}
                        >
                          <div className="text-center">
                            <Building
                              className="w-16 h-16 mx-auto mb-4"
                              style={{ color: designSystem.colors.neutral[400] }}
                            />
                            <p
                              className="text-sm font-medium"
                              style={{ color: designSystem.colors.neutral[500] }}
                            >
                              Planta do {unit.title}
                            </p>
                            <p
                              className="text-xs mt-1"
                              style={{ color: designSystem.colors.neutral[400] }}
                            >
                              Imagem ilustrativa
                            </p>
                          </div>
                        </div>

                        {/* Info */}
                        <div className="p-8 lg:p-12 flex flex-col justify-center">
                          <div className="flex items-center gap-3 mb-2">
                            <h3
                              className="text-2xl sm:text-3xl font-bold"
                              style={{ color: designSystem.colors.neutral[900] }}
                            >
                              {unit.title}
                            </h3>
                            <span
                              className="text-sm font-semibold px-3 py-1 rounded-full"
                              style={{
                                background: `${unit.color}15`,
                                color: unit.color,
                              }}
                            >
                              {unit.area}
                            </span>
                          </div>

                          <p
                            className="text-base mb-6 leading-relaxed"
                            style={{ color: designSystem.colors.neutral[600] }}
                          >
                            {unit.summary}
                          </p>

                          {/* Specs grid */}
                          <div className="grid grid-cols-2 gap-3 mb-8">
                            {unit.specs.map((s, i) => (
                              <div
                                key={i}
                                className="flex items-center gap-2 p-3 rounded-lg"
                                style={{
                                  background: 'white',
                                  border: `1px solid ${designSystem.colors.neutral[200]}`,
                                }}
                              >
                                <Ruler
                                  className="w-4 h-4 flex-shrink-0"
                                  style={{ color: unit.color }}
                                />
                                <div>
                                  <p className="text-xs" style={{ color: designSystem.colors.neutral[500] }}>
                                    {s.label}
                                  </p>
                                  <p className="text-sm font-semibold" style={{ color: designSystem.colors.neutral[800] }}>
                                    {s.value}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Copy */}
                          <div className="space-y-4 mb-8">
                            {unit.copy.map((p, i) => (
                              <p
                                key={i}
                                className="text-sm leading-relaxed"
                                style={{ color: designSystem.colors.neutral[600] }}
                              >
                                {p}
                              </p>
                            ))}
                          </div>

                          {/* CTA */}
                          <button
                            onClick={scrollToForm}
                            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105 w-fit"
                            style={{
                              background: unit.color,
                              color: '#fff',
                              boxShadow: `0 4px 14px ${unit.color}40`,
                            }}
                          >
                            {unit.cta}
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          GALERIA / MOODBOARD
      ═══════════════════════════════════════════════════════════════════════ */}
      <Section background="muted" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <Container>
          <div ref={galInView.ref}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={galInView.isInView ? 'visible' : 'hidden'}
              custom={0}
              className="text-center mb-4"
            >
              <span
                className="inline-block text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
                style={{
                  background: 'rgba(184,149,106,0.1)',
                  color: designSystem.colors.brand.secondary,
                }}
              >
                Galeria
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              animate={galInView.isInView ? 'visible' : 'hidden'}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4"
              style={{
                color: designSystem.colors.brand.primary,
                letterSpacing: designSystem.typography.letterSpacing.tight,
              }}
            >
              Ambientes e inspiração
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={galInView.isInView ? 'visible' : 'hidden'}
              custom={2}
              className="text-base sm:text-lg text-center max-w-2xl mx-auto mb-14"
              style={{ color: designSystem.colors.neutral[600] }}
            >
              Explore o conceito de interiores e exteriores. <em>(Imagens 3D ilustrativas.)</em>
            </motion.p>

            {/* Gallery grid */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {galleryItems.map((item, i) => (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  initial="hidden"
                  animate={galInView.isInView ? 'visible' : 'hidden'}
                  custom={i + 3}
                  className={`rounded-2xl overflow-hidden group cursor-pointer relative ${
                    i === 0 ? 'col-span-2 row-span-2' : ''
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${designSystem.colors.neutral[200]} 0%, ${designSystem.colors.neutral[300]} 100%)`,
                    minHeight: i === 0 ? '400px' : '200px',
                  }}
                >
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    <Eye
                      className="w-10 h-10"
                      style={{ color: designSystem.colors.neutral[400] }}
                    />
                  </div>
                  <div
                    className="absolute inset-x-0 bottom-0 p-4 transition-all duration-300 opacity-0 group-hover:opacity-100"
                    style={{
                      background: 'linear-gradient(to top, rgba(26,62,92,0.85), transparent)',
                    }}
                  >
                    <p className="text-white text-sm font-medium leading-snug">{item}</p>
                  </div>
                  {/* Always-visible label on mobile */}
                  <div
                    className="absolute inset-x-0 bottom-0 p-3 lg:hidden"
                    style={{
                      background: 'linear-gradient(to top, rgba(26,62,92,0.7), transparent)',
                    }}
                  >
                    <p className="text-white text-xs font-medium leading-snug">{item}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          LOCALIZAÇÃO
      ═══════════════════════════════════════════════════════════════════════ */}
      <Section background="white" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <Container>
          <div ref={locInView.ref}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={locInView.isInView ? 'visible' : 'hidden'}
              custom={0}
              className="text-center mb-4"
            >
              <span
                className="inline-block text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
                style={{
                  background: `rgba(26,62,92,0.06)`,
                  color: designSystem.colors.brand.primary,
                }}
              >
                Localização
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              animate={locInView.isInView ? 'visible' : 'hidden'}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-4"
              style={{
                color: designSystem.colors.brand.primary,
                letterSpacing: designSystem.typography.letterSpacing.tight,
              }}
            >
              Tudo ao seu alcance
            </motion.h2>

            <motion.p
              variants={fadeUp}
              initial="hidden"
              animate={locInView.isInView ? 'visible' : 'hidden'}
              custom={2}
              className="text-base text-center mb-4"
              style={{ color: designSystem.colors.neutral[600] }}
            >
              Rua Manuel Carqueja, 259 — Porto (Campanhã)
            </motion.p>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={locInView.isInView ? 'visible' : 'hidden'}
              custom={3}
              className="text-center mb-14"
            >
              <a
                href="https://www.google.com/maps/search/Rua+Manuel+Carqueja+259+Porto"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 hover:scale-105"
                style={{
                  background: designSystem.colors.gradients.primary,
                  color: '#fff',
                  boxShadow: designSystem.shadows.md,
                }}
              >
                <MapPin className="w-4 h-4" />
                VER NO MAPA
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </motion.div>

            {/* Location cards */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {locationCards.map((card, i) => (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  initial="hidden"
                  animate={locInView.isInView ? 'visible' : 'hidden'}
                  custom={i + 4}
                  className="p-6 rounded-2xl transition-all duration-300 hover:shadow-lg"
                  style={{
                    background: designSystem.colors.neutral[50],
                    border: `1px solid ${designSystem.colors.neutral[200]}`,
                  }}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center mb-4 text-sm font-bold"
                    style={{
                      background: designSystem.colors.gradients.primary,
                      color: '#fff',
                    }}
                  >
                    {card.num}
                  </div>
                  <h3
                    className="text-lg font-semibold mb-2"
                    style={{ color: designSystem.colors.neutral[900] }}
                  >
                    {card.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: designSystem.colors.neutral[600] }}>
                    {card.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          PREÇOS E DISPONIBILIDADE
      ═══════════════════════════════════════════════════════════════════════ */}
      <Section background="muted" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <Container>
          <div ref={priceInView.ref}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={priceInView.isInView ? 'visible' : 'hidden'}
              custom={0}
              className="text-center mb-4"
            >
              <span
                className="inline-block text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
                style={{
                  background: 'rgba(184,149,106,0.1)',
                  color: designSystem.colors.brand.secondary,
                }}
              >
                Investimento
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              animate={priceInView.isInView ? 'visible' : 'hidden'}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-14"
              style={{
                color: designSystem.colors.brand.primary,
                letterSpacing: designSystem.typography.letterSpacing.tight,
              }}
            >
              Preços e Disponibilidade
            </motion.h2>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={priceInView.isInView ? 'visible' : 'hidden'}
              custom={2}
              className="max-w-4xl mx-auto"
            >
              {/* Table - Desktop */}
              <div className="hidden md:block rounded-2xl overflow-hidden bg-white" style={{ border: `1px solid ${designSystem.colors.neutral[200]}` }}>
                <table className="w-full">
                  <thead>
                    <tr style={{ background: designSystem.colors.brand.primary }}>
                      <th className="text-left text-sm font-semibold text-white px-6 py-4">Unidade</th>
                      <th className="text-left text-sm font-semibold text-white px-6 py-4">Piso</th>
                      <th className="text-left text-sm font-semibold text-white px-6 py-4">Tipologia</th>
                      <th className="text-left text-sm font-semibold text-white px-6 py-4">Área bruta (m²)</th>
                      <th className="text-left text-sm font-semibold text-white px-6 py-4">Preço</th>
                      <th className="text-left text-sm font-semibold text-white px-6 py-4">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pricingRows.map((row, i) => (
                      <tr
                        key={i}
                        className="transition-colors duration-200"
                        style={{
                          borderBottom: i < pricingRows.length - 1 ? `1px solid ${designSystem.colors.neutral[200]}` : 'none',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = designSystem.colors.neutral[50])}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                      >
                        <td className="px-6 py-5 text-sm font-semibold" style={{ color: designSystem.colors.neutral[900] }}>{row.unit}</td>
                        <td className="px-6 py-5 text-sm" style={{ color: designSystem.colors.neutral[700] }}>{row.floor}</td>
                        <td className="px-6 py-5 text-sm font-medium" style={{ color: designSystem.colors.brand.primary }}>{row.type}</td>
                        <td className="px-6 py-5 text-sm" style={{ color: designSystem.colors.neutral[700] }}>{row.area}</td>
                        <td className="px-6 py-5 text-sm font-semibold" style={{ color: designSystem.colors.brand.secondary }}>{row.price}</td>
                        <td className="px-6 py-5">
                          <span
                            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full"
                            style={{
                              background: 'rgba(16,185,129,0.1)',
                              color: designSystem.colors.semantic.success,
                            }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: designSystem.colors.semantic.success }} />
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Table - Mobile cards */}
              <div className="md:hidden space-y-4">
                {pricingRows.map((row, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-white"
                    style={{ border: `1px solid ${designSystem.colors.neutral[200]}` }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold" style={{ color: designSystem.colors.brand.primary }}>
                          Unidade {row.unit}
                        </span>
                        <span className="text-sm font-medium" style={{ color: designSystem.colors.neutral[600] }}>
                          {row.type}
                        </span>
                      </div>
                      <span
                        className="text-xs font-semibold px-3 py-1 rounded-full"
                        style={{
                          background: 'rgba(16,185,129,0.1)',
                          color: designSystem.colors.semantic.success,
                        }}
                      >
                        {row.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span style={{ color: designSystem.colors.neutral[500] }}>Piso: </span>
                        <span className="font-medium" style={{ color: designSystem.colors.neutral[800] }}>{row.floor}</span>
                      </div>
                      <div>
                        <span style={{ color: designSystem.colors.neutral[500] }}>Área: </span>
                        <span className="font-medium" style={{ color: designSystem.colors.neutral[800] }}>{row.area} m²</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-3" style={{ borderTop: `1px solid ${designSystem.colors.neutral[200]}` }}>
                      <p className="text-sm font-semibold" style={{ color: designSystem.colors.brand.secondary }}>
                        {row.price}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Footnote */}
              <p
                className="text-xs text-center mt-6 leading-relaxed"
                style={{ color: designSystem.colors.neutral[500] }}
              >
                Áreas brutas incluem componentes como jardim/pátio/varanda/garagem/anexo/sótão conforme unidade. Solicite a brochura para detalhe completo.
              </p>

              {/* CTA */}
              <div className="text-center mt-8">
                <button
                  onClick={scrollToForm}
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    background: designSystem.colors.gradients.secondary,
                    color: '#fff',
                    boxShadow: designSystem.shadows.secondaryHover,
                  }}
                >
                  PEDIR TABELA DE PREÇOS
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          GESTOR DE VENDAS
      ═══════════════════════════════════════════════════════════════════════ */}
      <Section background="white" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <Container>
          <div ref={contactInView.ref}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={contactInView.isInView ? 'visible' : 'hidden'}
              custom={0}
              className="max-w-3xl mx-auto"
            >
              <div className="text-center mb-4">
                <span
                  className="inline-block text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
                  style={{
                    background: `rgba(26,62,92,0.06)`,
                    color: designSystem.colors.brand.primary,
                  }}
                >
                  Contactos
                </span>
              </div>

              <h2
                className="text-3xl sm:text-4xl font-bold text-center mb-6"
                style={{
                  color: designSystem.colors.brand.primary,
                  letterSpacing: designSystem.typography.letterSpacing.tight,
                }}
              >
                Gestor de Vendas
              </h2>

              <p
                className="text-base sm:text-lg leading-relaxed text-center mb-10"
                style={{ color: designSystem.colors.neutral[600] }}
              >
                Acompanhamo-lo(a) em todo o processo: esclarecimento de áreas, mapa de acabamentos, simulações de financiamento e agendamento de visita.
              </p>

              {/* Contact cards */}
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <a
                  href="tel:+351000000000"
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-300 hover:shadow-lg group"
                  style={{
                    background: designSystem.colors.neutral[50],
                    border: `1px solid ${designSystem.colors.neutral[200]}`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ background: `rgba(26,62,92,0.08)` }}
                  >
                    <Phone className="w-5 h-5" style={{ color: designSystem.colors.brand.primary }} />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: designSystem.colors.neutral[800] }}>
                    +351 000 000 000
                  </p>
                  <p className="text-xs" style={{ color: designSystem.colors.neutral[500] }}>Telefone</p>
                </a>

                <a
                  href="mailto:info@velaskresidence.pt"
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-300 hover:shadow-lg group"
                  style={{
                    background: designSystem.colors.neutral[50],
                    border: `1px solid ${designSystem.colors.neutral[200]}`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ background: `rgba(184,149,106,0.1)` }}
                  >
                    <Mail className="w-5 h-5" style={{ color: designSystem.colors.brand.secondary }} />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: designSystem.colors.neutral[800] }}>
                    info@velaskresidence.pt
                  </p>
                  <p className="text-xs" style={{ color: designSystem.colors.neutral[500] }}>Email</p>
                </a>

                <button
                  onClick={handleWhatsApp}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl transition-all duration-300 hover:shadow-lg group"
                  style={{
                    background: designSystem.colors.neutral[50],
                    border: `1px solid ${designSystem.colors.neutral[200]}`,
                  }}
                >
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
                    style={{ background: 'rgba(37,211,102,0.08)' }}
                  >
                    <MessageCircle className="w-5 h-5" style={{ color: designSystem.colors.external.whatsappPrimary }} />
                  </div>
                  <p className="text-sm font-semibold" style={{ color: designSystem.colors.neutral[800] }}>
                    WhatsApp
                  </p>
                  <p className="text-xs" style={{ color: designSystem.colors.neutral[500] }}>Mensagem</p>
                </button>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="tel:+351000000000"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    background: designSystem.colors.gradients.primary,
                    color: '#fff',
                    boxShadow: designSystem.shadows.md,
                  }}
                >
                  <Phone className="w-5 h-5" />
                  LIGAR AGORA
                </a>
                <button
                  onClick={handleWhatsApp}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-105"
                  style={{
                    background: designSystem.colors.external.whatsappPrimary,
                    color: '#fff',
                    boxShadow: '0 4px 14px rgba(37,211,102,0.3)',
                  }}
                >
                  <MessageCircle className="w-5 h-5" />
                  ENVIAR WHATSAPP
                </button>
              </div>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FORMULÁRIO
      ═══════════════════════════════════════════════════════════════════════ */}
      <Section
        id="velask-form"
        background="default"
        style={{
          paddingTop: '6rem',
          paddingBottom: '6rem',
          background: designSystem.colors.gradients.hero,
        }}
      >
        <Container>
          <div ref={formInView.ref}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={formInView.isInView ? 'visible' : 'hidden'}
              custom={0}
              className="max-w-2xl mx-auto"
            >
              <div className="text-center mb-4">
                <span
                  className="inline-block text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
                  style={{
                    background: 'rgba(184,149,106,0.15)',
                    color: designSystem.colors.brand.secondaryLight,
                    border: '1px solid rgba(184,149,106,0.25)',
                  }}
                >
                  Contacte-nos
                </span>
              </div>

              <h2
                className="text-3xl sm:text-4xl font-bold text-center mb-4 text-white"
                style={{ letterSpacing: designSystem.typography.letterSpacing.tight }}
              >
                Receba a brochura completa
              </h2>

              <p className="text-base text-center mb-10" style={{ color: 'rgba(255,255,255,0.7)' }}>
                Plantas, áreas detalhadas e disponibilidade. Envio por email.
              </p>

              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center p-12 rounded-3xl"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'rgba(16,185,129,0.2)' }}
                  >
                    <CheckCircle className="w-8 h-8" style={{ color: designSystem.colors.semantic.success }} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">Obrigado!</h3>
                  <p className="text-base" style={{ color: 'rgba(255,255,255,0.7)' }}>
                    Vamos enviar a brochura e entrar em contacto para agendar visita.
                  </p>
                </motion.div>
              ) : (
                <form
                  onSubmit={handleFormSubmit}
                  className="p-8 sm:p-10 rounded-3xl space-y-6"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    backdropFilter: 'blur(12px)',
                  }}
                >
                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Nome <span style={{ color: designSystem.colors.brand.secondaryLight }}>*</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 focus:ring-2"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#fff',
                        }}
                        placeholder="O seu nome"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Email <span style={{ color: designSystem.colors.brand.secondaryLight }}>*</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 focus:ring-2"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#fff',
                        }}
                        placeholder="email@exemplo.com"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Telefone <span style={{ color: designSystem.colors.brand.secondaryLight }}>*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 focus:ring-2"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#fff',
                        }}
                        placeholder="+351 000 000 000"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Tipologia de interesse
                      </label>
                      <select
                        value={formData.typology}
                        onChange={(e) => setFormData({ ...formData, typology: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 focus:ring-2"
                        style={{
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          color: '#fff',
                        }}
                      >
                        <option value="" style={{ color: '#333' }}>Selecione...</option>
                        <option value="t1" style={{ color: '#333' }}>T1 com Jardim + Garagem</option>
                        <option value="t2" style={{ color: '#333' }}>T2 com Jardim + Anexo</option>
                        <option value="t3" style={{ color: '#333' }}>T3 Duplex com Sótão</option>
                        <option value="unsure" style={{ color: '#333' }}>Ainda não sei</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white/80 mb-2">
                      Mensagem <span className="text-xs font-normal text-white/50">(opcional)</span>
                    </label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all duration-300 focus:ring-2 resize-none"
                      style={{
                        background: 'rgba(255,255,255,0.08)',
                        border: '1px solid rgba(255,255,255,0.15)',
                        color: '#fff',
                      }}
                      placeholder="Alguma questão ou pedido?"
                    />
                  </div>

                  {/* RGPD checkboxes */}
                  <div className="space-y-3">
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.consentContact}
                        onChange={(e) => setFormData({ ...formData, consentContact: e.target.checked })}
                        className="mt-1 w-4 h-4 rounded accent-amber-600"
                      />
                      <span className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Autorizo o contacto para efeitos de informação comercial sobre este imóvel. <span style={{ color: designSystem.colors.brand.secondaryLight }}>*</span>
                      </span>
                    </label>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        required
                        checked={formData.consentPrivacy}
                        onChange={(e) => setFormData({ ...formData, consentPrivacy: e.target.checked })}
                        className="mt-1 w-4 h-4 rounded accent-amber-600"
                      />
                      <span className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                        Li e aceito a Política de Privacidade. <span style={{ color: designSystem.colors.brand.secondaryLight }}>*</span>
                      </span>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-semibold transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                    style={{
                      background: designSystem.colors.gradients.secondary,
                      color: '#fff',
                      boxShadow: designSystem.shadows.secondaryHover,
                    }}
                  >
                    <Send className="w-5 h-5" />
                    QUERO RECEBER A BROCHURA
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          FAQ
      ═══════════════════════════════════════════════════════════════════════ */}
      <Section background="white" style={{ paddingTop: '6rem', paddingBottom: '6rem' }}>
        <Container>
          <div ref={faqInView.ref}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={faqInView.isInView ? 'visible' : 'hidden'}
              custom={0}
              className="text-center mb-4"
            >
              <span
                className="inline-block text-sm font-semibold tracking-widest uppercase px-4 py-1.5 rounded-full mb-6"
                style={{
                  background: `rgba(26,62,92,0.06)`,
                  color: designSystem.colors.brand.primary,
                }}
              >
                FAQ
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              initial="hidden"
              animate={faqInView.isInView ? 'visible' : 'hidden'}
              custom={1}
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-center mb-14"
              style={{
                color: designSystem.colors.brand.primary,
                letterSpacing: designSystem.typography.letterSpacing.tight,
              }}
            >
              Perguntas frequentes
            </motion.h2>

            <motion.div
              variants={fadeUp}
              initial="hidden"
              animate={faqInView.isInView ? 'visible' : 'hidden'}
              custom={2}
              className="max-w-3xl mx-auto"
            >
              <Accordion type="single" collapsible className="w-full">
                {faqItems.map((item, i) => (
                  <AccordionItem
                    key={i}
                    value={`faq-${i}`}
                    className="border-b"
                    style={{ borderColor: designSystem.colors.neutral[200] }}
                  >
                    <AccordionTrigger
                      className="py-5 text-left text-base font-semibold hover:no-underline"
                      style={{ color: designSystem.colors.neutral[800] }}
                    >
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent>
                      <p
                        className="text-sm leading-relaxed pb-2"
                        style={{ color: designSystem.colors.neutral[600] }}
                      >
                        {item.a}
                      </p>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </motion.div>
          </div>
        </Container>
      </Section>

      {/* ═══════════════════════════════════════════════════════════════════════
          LEGAL FOOTER
      ═══════════════════════════════════════════════════════════════════════ */}
      <section
        className="py-8"
        style={{
          background: designSystem.colors.neutral[950],
          borderTop: `1px solid ${designSystem.colors.neutral[800]}`,
        }}
      >
        <Container>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs leading-relaxed text-center sm:text-left" style={{ color: designSystem.colors.neutral[500] }}>
              As imagens e renders 3D são ilustrativos e não vinculativos. As áreas são aproximadas e devem ser confirmadas com documentação oficial. Esta informação não constitui proposta contratual e pode ser alterada sem aviso.
            </p>
            <p className="text-xs whitespace-nowrap" style={{ color: designSystem.colors.neutral[600] }}>
              VELASK Residence &copy; {new Date().getFullYear()}
            </p>
          </div>
        </Container>
      </section>
    </>
  );
}
