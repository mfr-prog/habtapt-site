import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Política de cookies da HABTA — informação sobre os cookies utilizados no site habta.eu e como pode geri-los.',
  alternates: { canonical: 'https://habta.eu/cookies' },
  robots: { index: true, follow: true },
  openGraph: {
    title: 'Política de Cookies | HABTA',
    description: 'Informação sobre os cookies utilizados no site habta.eu e como pode geri-los.',
    url: 'https://habta.eu/cookies',
    type: 'website',
    locale: 'pt_PT',
    siteName: 'HABTA',
  },
};

export default function CookiesPage() {
  return (
    <Section background="white" style={{ paddingTop: '7.5rem' }}>
      <Container>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0F1729' }}>
            Política de Cookies
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6B7C93', marginBottom: '2.5rem' }}>
            Última atualização: fevereiro de 2026
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: 1.8, color: '#374151' }}>
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                1. O que são Cookies?
              </h2>
              <p>
                Cookies são pequenos ficheiros de texto armazenados no seu dispositivo (computador, tablet ou
                telemóvel) quando visita um site. São amplamente utilizados para fazer os sites funcionarem de
                forma mais eficiente e fornecer informação aos proprietários do site.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                2. Cookies que Utilizamos
              </h2>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#374151', marginTop: '1rem', marginBottom: '0.5rem' }}>
                2.1 Cookies Estritamente Necessários
              </h3>
              <p>
                Estes cookies são essenciais para o funcionamento do site e não podem ser desativados.
                São definidos em resposta a ações suas, como definir preferências de privacidade,
                iniciar sessão ou preencher formulários.
              </p>
              <div style={{ overflowX: 'auto', marginTop: '0.75rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ background: '#F3F4F6' }}>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Cookie</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Finalidade</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Duração</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #F3F4F6' }}><code>habta_cookie_consent</code></td>
                      <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #F3F4F6' }}>Armazena as preferências de cookies do utilizador</td>
                      <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #F3F4F6' }}>Armazenamento local (sem expiração)</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #F3F4F6' }}><code>sb-*-auth-token</code></td>
                      <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #F3F4F6' }}>Autenticação de sessão (área de administração)</td>
                      <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #F3F4F6' }}>Sessão</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#374151', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                2.2 Cookies de Desempenho/Analíticos
              </h3>
              <p>
                Estes cookies permitem-nos contar visitas e fontes de tráfego para medir e melhorar o desempenho
                do site. Toda a informação recolhida por estes cookies é agregada e anonimizada.
              </p>
              <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#6B7C93' }}>
                Atualmente não utilizamos cookies analíticos de terceiros. Esta secção será atualizada caso
                venham a ser implementados.
              </p>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#374151', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                2.3 Cookies de Marketing
              </h3>
              <p>
                Estes cookies podem ser definidos por parceiros de publicidade para construir um perfil dos
                seus interesses e mostrar anúncios relevantes noutros sites.
              </p>
              <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#6B7C93' }}>
                Atualmente não utilizamos cookies de marketing. Esta secção será atualizada caso
                venham a ser implementados.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                3. Armazenamento Local (LocalStorage)
              </h2>
              <p>
                Além dos cookies, utilizamos armazenamento local do navegador para guardar preferências de
                utilização do site, nomeadamente:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc' }}>
                <li>Preferências de visualização na área de administração</li>
                <li>Estado de formulários em progresso (para evitar perda de dados)</li>
              </ul>
              <p style={{ marginTop: '0.5rem' }}>
                Estes dados são armazenados localmente no seu dispositivo e não são transmitidos aos nossos servidores.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                4. Como Gerir os Cookies
              </h2>
              <p>
                Pode controlar e gerir os cookies através das definições do seu navegador.
                Tenha em atenção que a desativação de cookies pode afetar o funcionamento do site.
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc' }}>
                <li><strong>Chrome:</strong> Definições &gt; Privacidade e segurança &gt; Cookies</li>
                <li><strong>Firefox:</strong> Definições &gt; Privacidade e Segurança &gt; Cookies</li>
                <li><strong>Safari:</strong> Preferências &gt; Privacidade &gt; Cookies</li>
                <li><strong>Edge:</strong> Definições &gt; Privacidade &gt; Cookies</li>
              </ul>
              <p style={{ marginTop: '0.75rem' }}>
                Pode também utilizar o banner de consentimento de cookies apresentado na sua primeira visita ao
                site para definir as suas preferências.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                5. Alterações a esta Política
              </h2>
              <p>
                Esta política de cookies pode ser atualizada periodicamente para refletir alterações nos cookies
                que utilizamos ou por outras razões operacionais, legais ou regulamentares.
                Recomendamos a consulta regular desta página.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                6. Mais Informação
              </h2>
              <p>
                Para mais informação sobre como tratamos os seus dados pessoais, consulte a nossa{' '}
                <a href="/privacidade" style={{ color: '#1A3E5C', textDecoration: 'underline' }}>Política de Privacidade</a>.
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                Para questões sobre cookies, contacte-nos através de <strong>contato@habta.eu</strong>.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </Section>
  );
}
