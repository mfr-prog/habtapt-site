'use client';

import React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { Instagram, Linkedin, ArrowUp } from './icons';
import { Logo } from './Logo';
import { motion } from 'motion/react';
import { designSystem } from './design-system';
import { LogoPattern } from './LogoPatterns';

const links = {
  menu: [
    { label: 'Home', href: '/' },
    { label: 'Servicos', href: '/servicos' },
    { label: 'Processo', href: '/processo' },
    { label: 'Projetos', href: '/portfolio' },
    { label: 'Contato', href: '/contacto' },
  ],
  recursos: [
    { label: 'Insights', href: '/blog' },
    { label: 'Depoimentos', href: '/#depoimentos' },
    { label: 'Painel Admin', href: '/login' },
  ],
  legal: [
    { label: 'Politica de Privacidade', href: '/privacidade' },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-700' },
  { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const allSections = [
    { title: 'Menu', links: links.menu },
    { title: 'Recursos', links: links.recursos },
    { title: 'Legal', links: links.legal },
  ];

  return (
    <footer
      className="relative text-white overflow-hidden"
      role="contentinfo"
      aria-label="Rodape do site"
      style={{
        background: designSystem.colors.gradients.heroLuxury,
      }}
    >
      {/* Background Pattern */}
      <LogoPattern
        pattern="arrows-tiny"
        opacity={0.09}
        color={designSystem.colors.neutral.white}
      />

      <Container className="relative z-10">
        <div className="py-12 md:py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
            {/* Brand Column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-2"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.3 }}
                className="mb-6 flex items-center gap-3"
              >
                <Logo variant="white" size={48} />
                <span
                  style={{
                    fontWeight: designSystem.typography.fontWeight.black,
                    letterSpacing: designSystem.typography.letterSpacing.tight,
                    fontSize: designSystem.typography.fontSize['3xl'],
                    color: designSystem.colors.neutral.white,
                  }}
                >
                  HABTA
                </span>
              </motion.div>
              <p
                style={{
                  color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.8),
                  lineHeight: designSystem.typography.lineHeight.relaxed,
                  marginBottom: designSystem.spacing[6],
                  maxWidth: '24rem'
                }}
              >
                Reabilitacao Inteligente e Investimento Sustentavel.
              </p>
              <div
                className="flex"
                style={{ gap: designSystem.spacing[3] }}
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileHover={{ scale: 1.15, y: -3 }}
                    whileTap={{ scale: 0.95 }}
                    className={`bg-white/10 backdrop-blur-sm p-2.5 rounded-lg transition-all duration-300 ${social.color}`}
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Links Columns */}
            {allSections.map((section, sectionIndex) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 + sectionIndex * 0.1 }}
              >
                <h4 className="text-white mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, index) => (
                    <motion.li
                      key={link.label}
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: 0.2 + sectionIndex * 0.1 + index * 0.05 }}
                    >
                      <Link
                        href={link.href}
                        className="text-white/70 hover:text-white transition-colors duration-200 inline-block"
                        aria-label={`Navegar para ${link.label}`}
                        style={{ textDecoration: 'none', font: 'inherit' }}
                      >
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>

          {/* Bottom Bar */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="border-t md:flex-row justify-between items-center"
            style={{
              borderColor: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.2),
              paddingTop: designSystem.spacing[8],
              display: 'flex',
              flexDirection: 'column',
              gap: designSystem.spacing[4]
            }}
          >
            <div className="flex flex-col md:flex-row justify-between items-center" style={{ gap: designSystem.spacing[4], width: '100%' }}>
              <div className="text-center md:text-left">
                <p
                  style={{
                    color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.7),
                    fontSize: designSystem.typography.fontSize.sm,
                    marginBottom: designSystem.spacing[2]
                  }}
                >
                  HABTA &copy; {currentYear} — Reabilitacao Inteligente e Investimento Sustentavel.
                </p>
                <p
                  style={{
                    color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.6),
                    fontSize: designSystem.typography.fontSize.xs
                  }}
                >
                  &copy; {currentYear} Jornada Prometida LDA. NIF: 518493644
                </p>
                <p
                  style={{
                    color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.6),
                    fontSize: designSystem.typography.fontSize.xs
                  }}
                >
                  Sede Rua Fernao Lopes, n 23, Cascais 2765 088, Portugal
                </p>
              </div>
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
                aria-label="Voltar ao topo da pagina"
              >
                <ArrowUp size={20} />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </Container>

      {/* Decorative Gradient Orb */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"
        style={{ opacity: 0.1 }}
      />
    </footer>
  );
}
