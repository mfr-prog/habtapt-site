import type { Metadata } from 'next';
import { Container } from '@/components/Container';
import { Section } from '@/components/Section';

export const metadata: Metadata = {
  title: 'Política de Privacidade',
  description: 'Política de privacidade da HABTA — como recolhemos, utilizamos e protegemos os seus dados pessoais em conformidade com o RGPD.',
  alternates: { canonical: 'https://habta.eu/privacidade' },
  robots: { index: true, follow: true },
};

export default function PrivacidadePage() {
  return (
    <Section background="white" style={{ paddingTop: '7.5rem' }}>
      <Container>
        <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0F1729' }}>
            Politica de Privacidade
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#6B7C93', marginBottom: '2.5rem' }}>
            Ultima atualizacao: fevereiro de 2026
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', lineHeight: 1.8, color: '#374151' }}>
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                1. Responsavel pelo Tratamento
              </h2>
              <p>
                <strong>Jornada Prometida LDA</strong> (doravante &ldquo;HABTA&rdquo;), com sede na Rua Fernao Lopes, n.o 23,
                2765-088 Cascais, Portugal, NIF 518493644, e a entidade responsavel pelo tratamento dos dados pessoais
                recolhidos atraves do site <strong>habta.eu</strong>.
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                Contacto para questoes de privacidade: <strong>contato@habta.eu</strong>
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                2. Dados Pessoais que Recolhemos
              </h2>
              <p>Recolhemos os seguintes dados pessoais quando interage connosco:</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc' }}>
                <li><strong>Dados de identificacao:</strong> nome completo</li>
                <li><strong>Dados de contacto:</strong> endereco de email, numero de telefone/WhatsApp</li>
                <li><strong>Dados de interesse:</strong> tipo de interesse imobiliario, tipologia pretendida, mensagem livre</li>
                <li><strong>Dados tecnicos:</strong> endereco IP, tipo de navegador, paginas visitadas, data e hora de acesso</li>
                <li><strong>Dados de newsletter:</strong> endereco de email para subscricao</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                3. Finalidades do Tratamento
              </h2>
              <p>Os seus dados pessoais sao tratados para as seguintes finalidades:</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc' }}>
                <li>Responder a pedidos de contacto e informacao sobre projetos imobiliarios</li>
                <li>Agendar visitas e reunioes</li>
                <li>Enviar newsletters e comunicacoes sobre novos projetos (mediante consentimento)</li>
                <li>Gestao interna de leads e pipeline comercial</li>
                <li>Melhoria continua do site e da experiencia do utilizador</li>
                <li>Cumprimento de obrigacoes legais e regulamentares</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                4. Base Legal do Tratamento
              </h2>
              <p>O tratamento dos seus dados pessoais baseia-se nas seguintes bases legais (artigo 6.o do RGPD):</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc' }}>
                <li><strong>Consentimento</strong> — para o envio de newsletters e comunicacoes de marketing</li>
                <li><strong>Execucao de contrato ou diligencias pre-contratuais</strong> — para responder a pedidos de informacao sobre imoveis</li>
                <li><strong>Interesse legitimo</strong> — para melhoria dos nossos servicos e analise de navegacao no site</li>
                <li><strong>Obrigacao legal</strong> — para cumprimento de obrigacoes fiscais e regulamentares</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                5. Prazo de Conservacao
              </h2>
              <p>
                Os dados pessoais sao conservados pelo periodo necessario para a finalidade que motivou a sua recolha:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc' }}>
                <li><strong>Dados de contacto/leads:</strong> ate 24 meses apos o ultimo contacto</li>
                <li><strong>Dados de newsletter:</strong> ate ao cancelamento da subscricao</li>
                <li><strong>Dados contratuais:</strong> pelo periodo exigido por lei (ate 10 anos para obrigacoes fiscais)</li>
                <li><strong>Dados de navegacao:</strong> ate 26 meses</li>
              </ul>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                6. Partilha de Dados
              </h2>
              <p>
                Os seus dados pessoais nao sao vendidos a terceiros. Podem ser partilhados com:
              </p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc' }}>
                <li><strong>Prestadores de servicos:</strong> alojamento web (Cloudflare), base de dados (Supabase), ferramentas de automacao</li>
                <li><strong>Autoridades publicas:</strong> quando exigido por lei</li>
              </ul>
              <p style={{ marginTop: '0.5rem' }}>
                Todos os prestadores de servicos estao sujeitos a obrigacoes de confidencialidade e protecao de dados.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                7. Transferencias Internacionais
              </h2>
              <p>
                Alguns dos nossos prestadores de servicos podem estar sediados fora do Espaco Economico Europeu (EEE).
                Nesses casos, garantimos que existem salvaguardas adequadas, como clausulas contratuais-tipo aprovadas
                pela Comissao Europeia ou decisoes de adequacao.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                8. Os Seus Direitos
              </h2>
              <p>Nos termos do RGPD, tem direito a:</p>
              <ul style={{ paddingLeft: '1.5rem', marginTop: '0.5rem', listStyleType: 'disc' }}>
                <li><strong>Acesso</strong> — obter confirmacao e copia dos seus dados pessoais</li>
                <li><strong>Retificacao</strong> — corrigir dados inexatos ou incompletos</li>
                <li><strong>Apagamento</strong> — solicitar a eliminacao dos seus dados (&ldquo;direito ao esquecimento&rdquo;)</li>
                <li><strong>Limitacao</strong> — restringir o tratamento dos seus dados</li>
                <li><strong>Portabilidade</strong> — receber os seus dados em formato estruturado</li>
                <li><strong>Oposicao</strong> — opor-se ao tratamento dos seus dados</li>
                <li><strong>Retirada de consentimento</strong> — retirar o consentimento a qualquer momento</li>
              </ul>
              <p style={{ marginTop: '0.75rem' }}>
                Para exercer os seus direitos, contacte-nos atraves de <strong>contato@habta.eu</strong>.
              </p>
              <p style={{ marginTop: '0.5rem' }}>
                Tem igualmente o direito de apresentar reclamacao junto da <strong>Comissao Nacional de Protecao de Dados (CNPD)</strong> — <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer" style={{ color: '#1A3E5C', textDecoration: 'underline' }}>www.cnpd.pt</a>.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                9. Seguranca dos Dados
              </h2>
              <p>
                Implementamos medidas tecnicas e organizativas adequadas para proteger os seus dados pessoais contra
                acesso nao autorizado, perda, destruicao ou alteracao, incluindo encriptacao SSL/TLS, controlo de
                acessos e auditorias regulares.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                10. Cookies
              </h2>
              <p>
                O nosso site utiliza cookies para melhorar a sua experiencia de navegacao. Para informacao detalhada
                sobre os cookies que utilizamos, consulte a nossa{' '}
                <a href="/cookies" style={{ color: '#1A3E5C', textDecoration: 'underline' }}>Politica de Cookies</a>.
              </p>
            </section>

            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.75rem' }}>
                11. Alteracoes a esta Politica
              </h2>
              <p>
                Reservamo-nos o direito de atualizar esta politica de privacidade a qualquer momento.
                Quaisquer alteracoes significativas serao comunicadas atraves do site. Recomendamos a consulta
                periodica desta pagina.
              </p>
            </section>

            <section style={{ padding: '1.5rem', background: '#F3F4F6', borderRadius: '1rem', marginTop: '1rem' }}>
              <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1A3E5C', marginBottom: '0.5rem' }}>
                Contactos
              </h2>
              <p style={{ margin: 0 }}>
                <strong>Jornada Prometida LDA</strong> (HABTA)<br />
                Rua Fernao Lopes, n.o 23, 2765-088 Cascais, Portugal<br />
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
