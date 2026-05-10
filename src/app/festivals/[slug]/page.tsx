import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { notFound } from 'next/navigation'

export default async function FestivalPage({ params }: { params: { slug: string } }) {
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

  const { data: festival } = await supabase
    .from('festivals')
    .select('*')
    .eq('slug', params.slug)
    .single()

  if (!festival) notFound()

  const { data: tournaments } = await supabase
    .from('tournaments')
    .select('*')
    .eq('festival_id', festival.id)
    .order('start_date')

  const { data: participations } = await supabase
    .from('participations')
    .select('*, profile:profiles(pseudo, city, level)')
    .eq('festival_id', festival.id)
    .limit(20)

  const circuitColors: Record<string, string> = {
    EPT: '#cc1f1f', WSOP: '#b8900a', WSOPE: '#b8900a',
    WPT: '#0f4c81', Winamax: '#e05c00', Other: '#2e2e3a',
  }

  const color = circuitColors[festival.circuit] ?? '#2e2e3a'

  return (
    <main style={{
      minHeight: '100vh', background: '#060608',
      color: '#b8b8cc', fontFamily: 'system-ui, sans-serif',
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
          <a href="/festivals" style={{ color: '#8888a4', textDecoration: 'none', fontSize: '0.82rem' }}>← Festivals</a>
          <a href="/auth/register" style={{
            padding: '7px 16px', background: '#c4983a',
            borderRadius: 4, color: '#060608',
            fontSize: '0.78rem', fontWeight: 800, textDecoration: 'none',
          }}>Je participe</a>
        </div>
      </nav>

      <div style={{ height: 280, position: 'relative', overflow: 'hidden', marginTop: 56 }}>
        {festival.image_url && (
          <img src={festival.image_url} alt={festival.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5 }} />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(180deg, transparent 20%, #060608 100%)',
        }} />
        <div style={{ position: 'absolute', bottom: 32, left: 40 }}>
          <div style={{
            display: 'inline-block', background: color,
            color: 'white', fontSize: '0.6rem', fontWeight: 800,
            letterSpacing: '0.1em', padding: '4px 12px', borderRadius: 3, marginBottom: 12,
          }}>{festival.circuit}</div>
          <h1 style={{
            fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800,
            color: '#f8f4ee', letterSpacing: '-0.02em', marginBottom: 8,
          }}>{festival.name}</h1>
          <div style={{ display: 'flex', gap: 20, fontSize: '0.82rem', color: '#8888a4', flexWrap: 'wrap' }}>
            <span>📍 {festival.venue}, {festival.city}</span>
            <span>📅 {new Date(festival.date_start).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })} – {new Date(festival.date_end).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
            <span>👥 {participations?.length ?? 0} PokerMates</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '40px', maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 340px', gap: 32 }}>

        <div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8f4ee', marginBottom: 20 }}>
            Programme des tournois
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {tournaments?.map((t: any) => (
              <div key={t.id} style={{
                background: '#141418', border: `1px solid ${t.is_main_event ? color : '#2e2e3a'}`,
                borderRadius: 10, padding: '16px 20px',
                display: 'flex', alignItems: 'center', gap: 16,
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8f4ee' }}>{t.name}</span>
                    {t.is_main_event && <span style={{ fontSize: '0.6rem', background: color, color: 'white', padding: '2px 7px', borderRadius: 3, fontWeight: 800 }}>MAIN</span>}
                    {t.is_high_roller && <span style={{ fontSize: '0.6rem', background: '#b8900a', color: '#060608', padding: '2px 7px', borderRadius: 3, fontWeight: 800 }}>HR</span>}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#8888a4' }}>
                    {new Date(t.start_date).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}
                  </div>
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#c4983a', textAlign: 'right', flexShrink: 0 }}>
                  {(t.buyin_cents / 100).toLocaleString('fr-FR')}€
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40 }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8f4ee', marginBottom: 20 }}>
              PokerMates inscrits ({participations?.length ?? 0})
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
              {participations?.map((p: any) => (
                <div key={p.id} style={{
                  background: '#141418', border: '1px solid #2e2e3a',
                  borderRadius: 10, padding: '16px', textAlign: 'center',
                }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 18, margin: '0 auto 10px',
                  }}>🎰</div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8f4ee', marginBottom: 2 }}>
                    {p.profile?.pseudo}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#8888a4' }}>{p.profile?.city}</div>
                  <div style={{
                    marginTop: 8, fontSize: '0.62rem', fontWeight: 700,
                    color: '#c4983a', background: 'rgba(196,154,60,0.1)',
                    padding: '3px 8px', borderRadius: 999, display: 'inline-block',
                  }}>{p.profile?.level}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div style={{
            background: '#141418', border: '1px solid #2e2e3a',
            borderRadius: 12, padding: 24, marginBottom: 16,
          }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#f8f4ee', marginBottom: 16 }}>
              Infos clés
            </h3>
            {[
              { k: 'Dates', v: `${new Date(festival.date_start).toLocaleDateString('fr-FR')} – ${new Date(festival.date_end).toLocaleDateString('fr-FR')}` },
              { k: 'Lieu', v: `${festival.venue}, ${festival.city}` },
              { k: 'Circuit', v: festival.circuit },
              { k: 'Main Event', v: festival.buyin_main ? `${(festival.buyin_main / 100).toLocaleString('fr-FR')}€` : 'N/A' },
              { k: 'Buy-in min', v: festival.buyin_min ? `${(festival.buyin_min / 100).toLocaleString('fr-FR')}€` : 'N/A' },
            ].map(item => (
              <div key={item.k} style={{
                display: 'flex', justifyContent: 'space-between',
                padding: '10px 0', borderBottom: '1px solid #2e2e3a',
              }}>
                <span style={{ fontSize: '0.78rem', color: '#5a5a72' }}>{item.k}</span>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#f8f4ee' }}>{item.v}</span>
              </div>
            ))}
            <a href="/auth/register" style={{
              display: 'block', width: '100%', padding: '12px',
              background: '#c4983a', color: '#060608', borderRadius: 4,
              fontSize: '0.82rem', fontWeight: 800, letterSpacing: '0.04em',
              textTransform: 'uppercase', textDecoration: 'none',
              textAlign: 'center', marginTop: 20,
            }}>♠ Je participe à ce festival</a>
          </div>

          {festival.website_url && (
            <a href={festival.website_url} target="_blank" style={{
              display: 'block', width: '100%', padding: '11px',
              background: 'transparent', border: '1px solid #2e2e3a',
              borderRadius: 4, color: '#b8b8cc', fontSize: '0.78rem',
              fontWeight: 600, textDecoration: 'none', textAlign: 'center',
            }}>Site officiel →</a>
          )}
        </div>

      </div>
    </main>
  )
}
