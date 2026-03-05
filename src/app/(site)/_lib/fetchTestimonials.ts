export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image: string;
  content: string;
  rating: number;
  project: string;
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || `https://${process.env.SUPABASE_PROJECT_ID || 'xrgcrvhmzoxfduhytzhk'}.supabase.co`;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || '';

export async function fetchTestimonials(): Promise<Testimonial[]> {
  try {
    const url = `${SUPABASE_URL}/functions/v1/make-server-4b2936bc/testimonials`;

    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      console.error(`[fetchTestimonials] Server returned ${response.status}`);
      return [];
    }

    const data = await response.json();

    if (data.testimonials && Array.isArray(data.testimonials) && data.testimonials.length > 0) {
      return data.testimonials as Testimonial[];
    }

    return [];
  } catch (error) {
    console.error('[fetchTestimonials] Error:', error);
    return [];
  }
}
