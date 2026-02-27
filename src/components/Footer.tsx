import React from 'react';
import Link from 'next/link';
import { Container } from './Container';
import { Instagram, Linkedin } from './icons';
import { Logo } from './Logo';
import { designSystem } from './design-system';
import { LogoPattern } from './LogoPatterns';

const links = {
  menu: [
    { label: 'Home', href: '/' },
    { label: 'Serviços', href: '/servicos' },
    { label: 'Processo', href: '/processo' },
    { label: 'Projetos', href: '/portfolio' },
    { label: 'Contacto', href: '/contacto' },
  ],
  recursos: [
    { label: 'Insights', href: '/blog' },
    { label: 'Depoimentos', href: '/#depoimentos' },
    { label: 'Painel Admin', href: '/login' },
  ],
  legal: [
    { label: 'Política de Privacidade', href: '/privacidade' },
    { label: 'Política de Cookies', href: '/cookies' },
  ],
};

const socialLinks = [
  { icon: Linkedin, href: 'https://www.linkedin.com/company/habta', label: 'LinkedIn' },
  { icon: Instagram, href: 'https://www.instagram.com/habta.eu', label: 'Instagram' },
];

export function Footer() {
  const currentYear = new Date().getFullYear();

  const allSections = [
    { title: 'Menu', links: links.menu },
    { title: 'Recursos', links: links.recursos },
    { title: 'Legal', links: links.legal },
  ];

  return (
    <footer
      className="relative text-white overflow-hidden"
      role="contentinfo"
      aria-label="Rodapé do site"
      style={{
        background: designSystem.colors.gradients.heroLuxury,
      }}
    >
      <LogoPattern
        pattern="arrows-tiny"
        opacity={0.09}
        color={designSystem.colors.neutral.white}
      />

      <Container className="relative z-10">
        <div className="py-12 md:py-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12 mb-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <div className="mb-6 flex items-center gap-3">
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
              </div>
              <p
                style={{
                  color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.8),
                  lineHeight: designSystem.typography.lineHeight.relaxed,
                  marginBottom: designSystem.spacing[6],
                  maxWidth: '24rem'
                }}
              >
                Reabilitação Inteligente e Investimento Sustentável.
              </p>
              <div className="flex" style={{ gap: designSystem.spacing[3] }}>
                {socialLinks.map((social) => (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="bg-white/10 backdrop-blur-sm p-2.5 rounded-lg transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
                  >
                    <social.icon size={20} />
                  </a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            {allSections.map((section) => (
              <div key={section.title}>
                <h4 className="text-white mb-4">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-white/70 hover:text-white transition-colors duration-200 inline-flex items-center"
                        aria-label={`Navegar para ${link.label}`}
                        style={{ textDecoration: 'none', font: 'inherit', minHeight: '44px' }}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom Bar */}
          <div
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
                <p style={{ color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.7), fontSize: designSystem.typography.fontSize.sm, marginBottom: designSystem.spacing[2] }}>
                  HABTA &copy; {currentYear} — Reabilitação Inteligente e Investimento Sustentável.
                </p>
                <p style={{ color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.6), fontSize: designSystem.typography.fontSize.xs }}>
                  &copy; {currentYear} Jornada Prometida LDA. NIF: 518493644
                </p>
                <p style={{ color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.6), fontSize: designSystem.typography.fontSize.xs }}>
                  Sede: Rua Fernão Lopes, n.º 23, Cascais 2765-088, Portugal
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
