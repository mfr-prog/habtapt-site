export const runtime = 'edge';

export default async function PropertyDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Imóvel: {slug}</h1>
      <p>Teste mínimo de edge runtime.</p>
    </div>
  );
}
