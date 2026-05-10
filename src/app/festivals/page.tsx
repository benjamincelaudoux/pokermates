import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export default async function FestivalsPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: festivals } = await supabase
    .from('festivals')
    .select('*')
    .eq('is_active', true)
    .order('date_start', { ascending: true })

  const circuitColors = {
    EPT: '#cc1f1f', WSOP: '#b8900a', WSOPE: '#b8900a',
    WPT: '#0f4c81', Winamax: '#e05c00', Other: '#2e2e3a',
  }

  return (
    <main style={{
      minHeight: '100vh', background: '#060608',
      color: '#b8b8cc', fontFamily: 'system-ui, sans-serif',
      padding: '80px 40px 60px',
    }}>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        height: 56, display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', padding: '0 40px',
        background: 'rgba(6,6,8,0.95)', borderBottom: '1px solid #2e2e3a',
      }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 30, height: 30, background: '#c4983a', borderRadius: 5,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 15, fontWeight: 900, color: '#060608',
          }}>♠</div>
          <span style={{ color: '#f8f4ee', fontWeight: 700, fontSize: '1.1rem' }}>
            Poker<span style={{ color: '#c4983a' }}>Mates</span>
          </span>
        </a>
        <div style={{ display: 'flex', gap: 12 }}>
          <a href="/auth/login" style={{
            padding: '7px 16px', background: 'transparent',
            border: '1px solid #2e2e3a', borderRadius: 4,
            color: '#b8b8cc', fontSize: '0.78rem', fontWeight: 600,
            textDecoration: 'none',
          }}>Connexion</a>
          <a href="/auth/register" style={{
            padding: '7px 16px', background: '#c4983a',
            borderRadius: 4, color: '#060608',
            fontSize: '0.78rem', fontWeight: 800, textDecoration: 'none',
          }}>Rejoindre</a>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto 48px' }}>
        <div style={{
          fontFamily: 'monospace', fontSize: '0.6rem', letterSpacing: '0.2em',
          textTransform: 'uppercase', color: '#c4983a', marginBottom: 10,
        }}>Calendrier 2026</div>
        <h1 style={{
          fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 800,
          color: '#f8f4ee', letterSpacing: '-0.02em', marginBottom: 8,
        }}>Festivals à venir</h1>
        <p style={{ color: '#8888a4', fontSize: '0.9rem' }}>
          {festivals?.length ?? 0} festivals disponibles
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: 20, maxWidth: 900, margin: '0 auto',
      }}>
        {festivals?.map((f: any) => (
          <div key={f.id} style={{
            background: '#141418', border: '1px solid #2e2e3a',
            borderRadius: 12, overflow: 'hidden',
          }}>
            <div style={{
              height: 140, background: 'linear-gradient(135deg, #0d0d11, #1a1a20)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 48, position: 'relative',
            }}>
              {f.image_url
                ? <img src={f.image_url} alt={f.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.6, position: 'absolute', inset: 0 }} />
                : '🎰'}
              <div style={{
                position: 'absolute', top: 10, left: 10,
                background: (circuitColors as any)[f.circuit] ?? '#2e2e3a',
                color: 'white', fontSize: '0.58rem', fontWeight: 800,
                letterSpacing: '0.1em', padding: '3px 9px', borderRadius: 3,
              }}>{f.circuit}</div>
            </div>
            <div style={{ padding: '18px 20px' }}>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8f4ee', marginBottom: 4 }}>
                {f.name}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#8888a4', marginBottom: 14 }}>
                📍 {f.city} · {f.country}
              </div>
              <div style={{
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10,
                padding: '12px 0', borderTop: '1px solid #2e2e3a',
                borderBottom: '1px solid #2e2e3a', marginBottom: 14,
              }}>
                <div>
                  <div style={{ fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5a5a72', marginBottom: 2 }}>Dates</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8f4ee' }}>
                    {new Date(f.date_start).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} – {new Date(f.date_end).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#5a5a72', marginBottom: 2 }}>Main Event</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f8f4ee' }}>
                    {f.buyin_main ? `${(f.buyin_main / 100).toLocaleString('fr-FR')}€` : 'N/A'}
                  </div>
                </div>
              </div>
              <a href={`/festivals/${f.slug}`} style={{
                display: 'block', width: '100%', padding: '10px',
                background: '#c4983a', color: '#060608', borderRadius: 4,
                fontSize: '0.75rem', fontWeight: 800, letterSpacing: '0.04em',
                textTransform: 'uppercase', textDecoration: 'none', textAlign: 'center',
              }}>♠ Je participe</a>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
