import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade da HABTA — como recolhemos, utilizamos e protegemos os seus dados pessoais em conformidade com o RGPD.',
  alternates: { canonical: 'https://habta.eu/privacidade' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Política de Privacidade | HABTA',
    description: 'Como recolhemos, utilizamos e protegemos os seus dados pessoais em conformidade com o RGPD.',
    url: 'https://habta.eu/privacidade',
    type: 'website',
    locale: 'pt_PT',
    siteName: 'HABTA',
  },
};

export default function PrivacidadePage() {
  return (
    <Section background="white" style={{ paddingTop: '7.5rem' }}>
      <Container>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0F1729' }}>
            Política de Privacidade
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6B7C93', marginBottom: '2.5rem' }}>
            Última atualização: fevereiro de 2026
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: 1.8, color: '#374151' }}>
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                1. Responsável pelo Tratamento
              </h2>
              <p>
                <strong>Jornada Prometida LDA</strong> (doravante &ldquo;HABTA&rdquo;), com sede na Rua Fernão Lopes, n.º 23,
                2765-088 Cascais, Portugal, NIF 518493644, é a entidade responsável pelo tratamento dos dados pessoais
                recolhidos através do site <strong>habta.eu</strong>.
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                Contacto para questões de privacidade: <strong>contato@habta.eu</strong>
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                2. Dados Pessoais que Recolhemos
              </h2>
              <p>Recolhemos os seguintes dados pessoais quando interage connosco:</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc' }}>
                <li><strong>Dados de identificação:</strong> nome completo</li>
                <li><strong>Dados de contacto:</strong> endereço de email, número de telefone/WhatsApp</li>
                <li><strong>Dados de interesse:</strong> tipo de interesse imobiliário, tipologia pretendida, mensagem livre</li>
                <li><strong>Dados técnicos:</strong> endereço IP, tipo de navegador, páginas visitadas, data e hora de acesso</li>
                <li><strong>Dados de newsletter:</strong> endereço de email para subscrição</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                3. Finalidades do Tratamento
              </h2>
              <p>Os seus dados pessoais são tratados para as seguintes finalidades:</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc' }}>
                <li>Responder a pedidos de contacto e informação sobre projetos imobiliários</li>
                <li>Agendar visitas e reuniões</li>
                <li>Enviar newsletters e comunicações sobre novos projetos (mediante consentimento)</li>
                <li>Gestão interna de leads e pipeline comercial</li>
                <li>Melhoria contínua do site e da experiência do utilizador</li>
                <li>Cumprimento de obrigações legais e regulamentares</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                4. Base Legal do Tratamento
              </h2>
              <p>O tratamento dos seus dados pessoais baseia-se nas seguintes bases legais (artigo 6.º do RGPD):</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc' }}>
                <li><strong>Consentimento</strong> — para o envio de newsletters e comunicações de marketing</li>
                <li><strong>Execução de contrato ou diligências pré-contratuais</strong> — para responder a pedidos de informação sobre imóveis</li>
                <li><strong>Interesse legítimo</strong> — para melhoria dos nossos serviços e análise de navegação no site</li>
                <li><strong>Obrigação legal</strong> — para cumprimento de obrigações fiscais e regulamentares</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                5. Prazo de Conservação
              </h2>
              <p>
                Os dados pessoais são conservados pelo período necessário para a finalidade que motivou a sua recolha:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc' }}>
                <li><strong>Dados de contacto/leads:</strong> até 24 meses após o último contacto</li>
                <li><strong>Dados de newsletter:</strong> até ao cancelamento da subscrição</li>
                <li><strong>Dados contratuais:</strong> pelo período exigido por lei (até 10 anos para obrigações fiscais)</li>
                <li><strong>Dados de navegação:</strong> até 26 meses</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                6. Partilha de Dados
              </h2>
              <p>
                Os seus dados pessoais não são vendidos a terceiros. Podem ser partilhados com:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc' }}>
                <li><strong>Prestadores de serviços:</strong> alojamento web (Cloudflare), base de dados (Supabase), ferramentas de automação</li>
                <li><strong>Autoridades públicas:</strong> quando exigido por lei</li>
              </ul>
              <p style={{ marginTop: '0.5rem' }}>
                Todos os prestadores de serviços estão sujeitos a obrigações de confidencialidade e proteção de dados.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                7. Transferências Internacionais
              </h2>
              <p>
                Alguns dos nossos prestadores de serviços podem estar sediados fora do Espaço Económico Europeu (EEE).
                Nesses casos, garantimos que existem salvaguardas adequadas, como cláusulas contratuais-tipo aprovadas
                pela Comissão Europeia ou decisões de adequação.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                8. Os Seus Direitos
              </h2>
              <p>Nos termos do RGPD, tem direito a:</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc' }}>
                <li><strong>Acesso</strong> — obter confirmação e cópia dos seus dados pessoais</li>
                <li><strong>Retificação</strong> — corrigir dados inexatos ou incompletos</li>
                <li><strong>Apagamento</strong> — solicitar a eliminação dos seus dados (&ldquo;direito ao esquecimento&rdquo;)</li>
                <li><strong>Limitação</strong> — restringir o tratamento dos seus dados</li>
                <li><strong>Portabilidade</strong> — receber os seus dados em formato estruturado</li>
                <li><strong>Oposição</strong> — opor-se ao tratamento dos seus dados</li>
                <li><strong>Retirada de consentimento</strong> — retirar o consentimento a qualquer momento</li>
              </ul>
              <p style={{ marginTop: '0.75rem' }}>
                Para exercer os seus direitos, contacte-nos através de <strong>contato@habta.eu</strong>.
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                Tem igualmente o direito de apresentar reclamação junto da <strong>Comissão Nacional de Proteção de Dados (CNPD)</strong> — <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer" style={{ color: '#1A3E5C', textDecoration: 'underline' }}>www.cnpd.pt</a>.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                9. Segurança dos Dados
              </h2>
              <p>
                Implementamos medidas técnicas e organizativas adequadas para proteger os seus dados pessoais contra
                acesso não autorizado, perda, destruição ou alteração, incluindo encriptação SSL/TLS, controlo de
                acessos e auditorias regulares.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                10. Cookies
              </h2>
              <p>
                O nosso site utiliza cookies para melhorar a sua experiência de navegação. Para informação detalhada
                sobre os cookies que utilizamos, consulte a nossa{' '}
                <a href="/cookies" style={{ color: '#1A3E5C', textDecoration: 'underline' }}>Política de Cookies</a>.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                11. Alterações a esta Política
              </h2>
              <p>
                Reservamo-nos o direito de atualizar esta política de privacidade a qualquer momento.
                Quaisquer alterações significativas serão comunicadas através do site. Recomendamos a consulta
                periódica desta página.
              </p>
            </section>

            <section style={{ padding: '1.5rem', background: '#F3F4F6', borderRadius: '1rem', marginTop: '1rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.5rem' }}>
                Contactos
              </h2>
              <p style={{ margin: 0 }}>
                <strong>Jornada Prometida LDA</strong> (HABTA)<br />
                Rua Fernão Lopes, n.º 23, 2765-088 Cascais, Portugal<br />
                NIF: 518493644<br />
                Email: contato@habta.eu<br />
                Telefone: +351 963 290 394
              </p>
            </section>
          </div>
        </div>
      </Container>
    </Section>
  );
}
