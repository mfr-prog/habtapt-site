import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Política de Cookies',
  description: 'Política de cookies da HABTA — informação sobre os cookies utilizados no site habta.eu e como pode geri-los.',
  alternates: { canonical: 'https://habta.eu/cookies' },
  robots: { index: true, follow: true },
};

export default function CookiesPage() {
  return (
    <Section background="white" style={{ paddingTop: '7.5rem' }}>
      <Container>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0F1729' }}>
            Politica de Cookies
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6B7C93', marginBottom: '2.5rem' }}>
            Ultima atualizacao: fevereiro de 2026
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: 1.8, color: '#374151' }}>
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                1. O que sao Cookies?
              </h2>
              <p>
                Cookies sao pequenos ficheiros de texto armazenados no seu dispositivo (computador, tablet ou
                telemovel) quando visita um site. Sao amplamente utilizados para fazer os sites funcionarem de
                forma mais eficiente e fornecer informacao aos proprietarios do site.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                2. Cookies que Utilizamos
              </h2>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#374151', marginTop: '1rem', marginBottom: '0.5rem' }}>
                2.1 Cookies Estritamente Necessarios
              </h3>
              <p>
                Estes cookies sao essenciais para o funcionamento do site e nao podem ser desativados.
                Sao definidos em resposta a acoes suas, como definir preferencias de privacidade,
                iniciar sessao ou preencher formularios.
              </p>
              <div style={{ overflowX: 'auto', marginTop: '0.75rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ background: '#F3F4F6' }}>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Cookie</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Finalidade</th>
                      <th style={{ padding: '0.5rem 0.75rem', textAlign: 'left', borderBottom: '1px solid #E5E7EB' }}>Duracao</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #F3F4F6' }}><code>habta_cookie_consent</code></td>
                      <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #F3F4F6' }}>Armazena as preferencias de cookies do utilizador</td>
                      <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #F3F4F6' }}>365 dias</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #F3F4F6' }}><code>sb-*-auth-token</code></td>
                      <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #F3F4F6' }}>Autenticacao de sessao (area de administracao)</td>
                      <td style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #F3F4F6' }}>Sessao</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#374151', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                2.2 Cookies de Desempenho/Analiticos
              </h3>
              <p>
                Estes cookies permitem-nos contar visitas e fontes de trafego para medir e melhorar o desempenho
                do site. Toda a informacao recolhida por estes cookies e agregada e anonimizada.
              </p>
              <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#6B7C93' }}>
                Atualmente nao utilizamos cookies analiticos de terceiros. Esta secao sera atualizada caso
                venham a ser implementados.
              </p>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#374151', marginTop: '1.5rem', marginBottom: '0.5rem' }}>
                2.3 Cookies de Marketing
              </h3>
              <p>
                Estes cookies podem ser definidos por parceiros de publicidade para construir um perfil dos
                seus interesses e mostrar anuncios relevantes noutros sites.
              </p>
              <p style={{ marginTop: '0.5rem', fontStyle: 'italic', color: '#6B7C93' }}>
                Atualmente nao utilizamos cookies de marketing. Esta secao sera atualizada caso
                venham a ser implementados.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                3. Armazenamento Local (LocalStorage)
              </h2>
              <p>
                Alem dos cookies, utilizamos armazenamento local do navegador para guardar preferencias de
                utilizacao do site, nomeadamente:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc' }}>
                <li>Preferencias de visualizacao na area de administracao</li>
                <li>Estado de formularios em progresso (para evitar perda de dados)</li>
              </ul>
              <p style={{ marginTop: '0.5rem' }}>
                Estes dados sao armazenados localmente no seu dispositivo e nao sao transmitidos aos nossos servidores.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                4. Como Gerir os Cookies
              </h2>
              <p>
                Pode controlar e gerir os cookies atraves das definicoes do seu navegador.
                Tenha em atencao que a desativacao de cookies pode afetar o funcionamento do site.
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc' }}>
                <li><strong>Chrome:</strong> Definicoes &gt; Privacidade e seguranca &gt; Cookies</li>
                <li><strong>Firefox:</strong> Definicoes &gt; Privacidade e Seguranca &gt; Cookies</li>
                <li><strong>Safari:</strong> Preferencias &gt; Privacidade &gt; Cookies</li>
                <li><strong>Edge:</strong> Definicoes &gt; Privacidade &gt; Cookies</li>
              </ul>
              <p style={{ marginTop: '0.75rem' }}>
                Pode tambem utilizar o banner de consentimento de cookies apresentado na sua primeira visita ao
                site para definir as suas preferencias.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                5. Alteracoes a esta Politica
              </h2>
              <p>
                Esta politica de cookies pode ser atualizada periodicamente para refletir alteracoes nos cookies
                que utilizamos ou por outras razoes operacionais, legais ou regulamentares.
                Recomendamos a consulta regular desta pagina.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                6. Mais Informacao
              </h2>
              <p>
                Para mais informacao sobre como tratamos os seus dados pessoais, consulte a nossa{' '}
                <a href="/privacidade" style={{ color: '#1A3E5C', textDecoration: 'underline' }}>Politica de Privacidade</a>.
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                Para questoes sobre cookies, contacte-nos atraves de <strong>contato@habta.eu</strong>.
              </p>
            </section>
          </div>
        </div>
      </Container>
    </Section>
  );
}
