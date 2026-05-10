import Link from 'next/link'

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#060608',
      color: '#b8b8cc',
      fontFamily: 'system-ui, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '40px 20px',
      textAlign: 'center',
    }}>

      {/* Logo */}
      <div style={{
        width: 60, height: 60,
        background: '#c4983a',
        borderRadius: 10,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 28, fontWeight: 900,
        color: '#060608',
        marginBottom: 24,
        boxShadow: '0 0 40px rgba(196,152,58,0.3)',
      }}>♠</div>

      {/* Titre */}
      <h1 style={{
        fontSize: 'clamp(2.5rem, 6vw, 5rem)',
        fontWeight: 800,
        color: '#f8f4ee',
        lineHeight: 1.05,
        letterSpacing: '-0.03em',
        marginBottom: 16,
        maxWidth: 700,
      }}>
        Le festival est meilleur<br />
        <span style={{ color: '#c4983a', fontStyle: 'italic', fontWeight: 400 }}>
          avec ta bande
        </span>
      </h1>

      {/* Sous-titre */}
      <p style={{
        fontSize: '1.1rem',
        color: '#8888a4',
        maxWidth: 520,
        lineHeight: 1.75,
        marginBottom: 40,
        fontWeight: 400,
      }}>
        PokerMates connecte les joueurs de poker qui participent aux mêmes festivals.
        EPT, WSOP, WPT — trouve tes coéquipiers avant d'arriver à la table.
      </p>

      {/* Boutons */}
      <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 64 }}>
        <a href="/auth/register" style={{
          padding: '14px 32px',
          background: '#c4983a',
          color: '#060608',
          borderRadius: 4,
          fontWeight: 800,
          fontSize: '0.9rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          textDecoration: 'none',
          boxShadow: '0 4px 24px rgba(196,152,58,0.3)',
          transition: 'all 0.2s',
        }}>
          Créer mon profil · Gratuit
        </a>
        <a href="/festivals" style={{
          padding: '14px 32px',
          background: 'transparent',
          color: '#b8b8cc',
          border: '1px solid #2e2e3a',
          borderRadius: 4,
          fontWeight: 700,
          fontSize: '0.9rem',
          letterSpacing: '0.04em',
          textTransform: 'uppercase',
          textDecoration: 'none',
        }}>
          Voir les festivals →
        </a>
      </div>

      {/* Stats */}
      <div style={{
        display: 'flex',
        gap: 48,
        paddingTop: 40,
        borderTop: '1px solid #2e2e3a',
        flexWrap: 'wrap',
        justifyContent: 'center',
      }}>
        {[
          { num: '2k+', label: 'Joueurs' },
          { num: '24', label: 'Festivals' },
          { num: '8', label: 'Pays' },
          { num: '94%', label: 'Satisfaction' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8f4ee', lineHeight: 1 }}>
              <span style={{ color: '#c4983a' }}>{s.num}</span>
            </div>
            <div style={{ fontSize: '0.7rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#5a5a72', marginTop: 6 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Festivals en avant */}
      <div style={{
        marginTop: 80,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 16,
        width: '100%',
        maxWidth: 900,
      }}>
        {[
          { name: 'EPT Paris 2026', date: '18 fév – 1 mars', city: 'Paris 🇫🇷', circuit: 'EPT', color: '#cc1f1f', players: 47 },
          { name: 'WSOP Circuit Paris', date: '1 – 13 sept', city: 'Paris 🇫🇷', circuit: 'WSOP', color: '#b8900a', players: 31 },
          { name: 'WSOP Europe 2026', date: '17 sept – 8 oct', city: 'Rozvadov 🇨🇿', circuit: 'WSOP', color: '#b8900a', players: 47 },
        ].map(f => (
          <div key={f.name} style={{
            background: '#141418',
            border: '1px solid #2e2e3a',
            borderRadius: 12,
            padding: 20,
            textAlign: 'left',
            transition: 'all 0.3s',
            cursor: 'pointer',
          }}>
            <div style={{
              display: 'inline-block',
              background: f.color,
              color: 'white',
              fontSize: '0.6rem',
              fontWeight: 800,
              letterSpacing: '0.1em',
              padding: '3px 10px',
              borderRadius: 3,
              marginBottom: 10,
            }}>{f.circuit}</div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8f4ee', marginBottom: 4 }}>{f.name}</div>
            <div style={{ fontSize: '0.78rem', color: '#8888a4', marginBottom: 12 }}>📍 {f.city} · {f.date}</div>
            <div style={{ fontSize: '0.78rem', color: '#5a5a72' }}>
              <span style={{ color: '#2dba6a', fontWeight: 700 }}>●</span> {f.players} PokerMates inscrits
            </div>
          </div>
        ))}
      </div>

      {/* Footer mini */}
      <div style={{ marginTop: 80, fontSize: '0.72rem', color: '#5a5a72', letterSpacing: '0.06em' }}>
        © 2026 PokerMates · Fait en France · 18+ · Jeu responsable
      </div>

    </main>
  )
}
