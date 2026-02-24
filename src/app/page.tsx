import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HABTA | Reabilitacao Inteligente e Investimento Sustentavel',
  description:
    'Patrimonio de alta performance. Decisoes baseadas em dados. Reabilitacao urbana, investimento imobiliario e co-investimento em Portugal.',
};

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center"
      style={{ padding: '6rem 1.5rem 4rem' }}
    >
      <h1
        className="text-4xl font-black mb-4"
        style={{ color: 'var(--primary)', letterSpacing: '-0.025em' }}
      >
        HABTA
      </h1>
      <p
        className="text-lg max-w-lg mb-8"
        style={{ color: 'var(--muted-foreground)', lineHeight: 1.7 }}
      >
        Patrimonio de alta performance. Decisoes baseadas em dados.
        Reabilitacao urbana, investimento imobiliario e co-investimento em Portugal.
      </p>
      <a
        href="/velask"
        className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-semibold transition-transform hover:scale-105"
        style={{
          background: 'linear-gradient(135deg, var(--secondary) 0%, var(--secondary-light) 100%)',
          color: '#ffffff',
          boxShadow: '0 10px 40px rgba(184,149,106,0.3)',
          textDecoration: 'none',
        }}
      >
        Conhecer VELASK Residence
      </a>
    </div>
  );
}
