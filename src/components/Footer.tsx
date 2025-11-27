import React from 'react';
import { Container } from './Container';
import { Instagram, Linkedin, ArrowUp } from './icons';
import { Logo } from './Logo';
import { motion } from 'motion/react';
import { designSystem } from './design-system';
import { LogoPattern } from './LogoPatterns';
import { useRouter, Route } from './Router';

export function Footer() {
  const currentYear = new Date().getFullYear();
  const { navigate } = useRouter();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const links = {
    menu: [
      { label: 'Home', route: 'home' as Route },
      { label: 'Serviços', route: 'services' as Route },
      { label: 'Processo', route: 'process' as Route },
      { label: 'Projetos', route: 'portfolio' as Route },
      { label: 'Contato', route: 'contact' as Route },
    ],
    recursos: [
      { label: 'Insights', route: 'insights' as Route },
      { label: 'Depoimentos', route: 'testimonials' as Route },
      { label: 'Painel Admin', route: 'login' as Route },
    ],
    legal: [
      { label: 'Política de Privacidade', route: null },
    ],
  };

  const socialLinks = [
    { icon: Linkedin, href: '#', label: 'LinkedIn', color: 'hover:bg-blue-700' },
    { icon: Instagram, href: '#', label: 'Instagram', color: 'hover:bg-pink-600' },
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
      {/* Background Pattern - Padrão com Logo HABTA */}
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
                Reabilitação Inteligente e Investimento Sustentável.
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
            {[
              { title: 'Menu', links: links.menu },
              { title: 'Recursos', links: links.recursos },
              { title: 'Legal', links: links.legal },
            ].map((section, sectionIndex) => (
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
                      {link.route ? (
                        <motion.button
                          onClick={() => navigate(link.route!)}
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                          className="text-white/70 hover:text-white transition-colors duration-200 inline-block bg-transparent border-none cursor-pointer p-0"
                          style={{ font: 'inherit' }}
                          aria-label={`Navegar para ${link.label}`}
                        >
                          {link.label}
                        </motion.button>
                      ) : (
                        <motion.span
                          whileHover={{ x: 5 }}
                          transition={{ duration: 0.2 }}
                          className="text-white/70 hover:text-white transition-colors duration-200 inline-block cursor-pointer"
                        >
                          {link.label}
                        </motion.span>
                      )}
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
              <p 
                className="text-center md:text-left"
                style={{
                  color: designSystem.helpers.hexToRgba(designSystem.colors.neutral.white, 0.7),
                  fontSize: designSystem.typography.fontSize.sm
                }}
              >
                HABTA © {currentYear} — Reabilitação Inteligente e Investimento Sustentável.
              </p>
              <motion.button
                onClick={scrollToTop}
                whileHover={{ scale: 1.1, y: -3 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 rounded-lg bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all duration-300"
                aria-label="Voltar ao topo da página"
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
