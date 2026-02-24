'use client';

import { Container } from '@/components/Container';
import { Section } from '@/components/Section';
import { motion } from 'motion/react';
import { useInView } from '@/components/useInView';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { faqItems } from '../_data/velask-data';
import { c, t, sp, sectionBadge, sectionTitle } from './velask-styles';

export function VelaskFAQ() {
  const faqInView = useInView({ threshold: 0.1 });

  return (
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
  );
}
