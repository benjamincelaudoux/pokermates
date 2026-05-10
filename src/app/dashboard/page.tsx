import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
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

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: participations } = await supabase
    .from('participations')
    .select('*, festival:festivals(name, city, date_start, circuit)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

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
        <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
          <a href="/festivals" style={{ color: '#8888a4', textDecoration: 'none', fontSize: '0.82rem' }}>Festivals</a>
          <a href="/dashboard" style={{ color: '#c4983a', textDecoration: 'none', fontSize: '0.82rem', fontWeight: 700 }}>Dashboard</a>
        </div>
      </nav>

      <div style={{ padding: '80px 40px 60px', maxWidth: 900, margin: '0 auto' }}>

        <div style={{
          background: '#141418', border: '1px solid #2e2e3a',
          borderRadius: 12, padding: 28, marginBottom: 28,
          display: 'flex', alignItems: 'center', gap: 20,
        }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, flexShrink: 0,
          }}>🎰</div>
          <div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8f4ee', marginBottom: 4 }}>
              Bonjour, {profile?.pseudo ?? 'Joueur'} 👋
            </div>
            <div style={{ fontSize: '0.82rem', color: '#8888a4' }}>
              Niveau : <span style={{ color: '#c4983a', fontWeight: 700 }}>{profile?.level ?? 'regulier'}</span>
            </div>
          </div>
        </div>

        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 16, marginBottom: 28,
        }}>
          {[
            { num: participations?.length ?? 0, label: 'Festivals', icon: '🏆' },
            { num: 0, label: 'Connexions', icon: '🤝' },
            { num: 0, label: 'Messages', icon: '💬' },
          ].map(s => (
            <div key={s.label} style={{
              background: '#141418', border: '1px solid #2e2e3a',
              borderRadius: 12, padding: '20px 24px',
            }}>
              <div style={{ fontSize: '2rem', marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8f4ee', lineHeight: 1, marginBottom: 4 }}>
                {s.num}
              </div>
              <div style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#5a5a72' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8f4ee' }}>Mes festivals</h2>
            <a href="/festivals" style={{ fontSize: '0.78rem', color: '#c4983a', textDecoration: 'none' }}>
              + Rejoindre un festival
            </a>
          </div>

          {participations && participations.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {participations.map((p: any) => (
                <div key={p.id} style={{
                  background: '#141418', border: '1px solid #2e2e3a',
                  borderRadius: 10, padding: '14px 18px',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#f8f4ee' }}>
                      {p.festival?.name}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: '#8888a4' }}>
                      📍 {p.festival?.city}
                    </div>
                  </div>
                  <span style={{
                    padding: '4px 10px', borderRadius: 999,
                    fontSize: '0.65rem', fontWeight: 700,
                    background: 'rgba(196,154,60,0.1)',
                    color: '#c4983a', border: '1px solid rgba(196,154,60,0.2)',
                  }}>
                    {p.status === 'confirmed' ? '✓ Confirmé' : 'Intéressé'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div style={{
              background: '#141418', border: '1px dashed #2e2e3a',
              borderRadius: 10, padding: 32, textAlign: 'center',
            }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🃏</div>
              <div style={{ fontSize: '0.85rem', color: '#8888a4', marginBottom: 16 }}>
                Tu n'as encore rejoint aucun festival
              </div>
              <a href="/festivals" style={{
                padding: '9px 20px', background: '#c4983a',
                color: '#060608', borderRadius: 4, fontSize: '0.78rem',
                fontWeight: 800, textDecoration: 'none',
              }}>Voir les festivals →</a>
            </div>
          )}
        </div>

      </div>
    </main>
  )
}
