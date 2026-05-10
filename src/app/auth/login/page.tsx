'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError('Email ou mot de passe incorrect')
    } else {
      router.push('/dashboard')
    }

    setLoading(false)
  }

  const inputStyle = {
    width: '100%', padding: '12px 16px',
    background: '#1a1a20', border: '1px solid #2e2e3a',
    borderRadius: 8, color: '#f8f4ee', fontSize: '0.9rem',
    outline: 'none', fontFamily: 'system-ui, sans-serif',
  }

  const labelStyle = {
    display: 'block', fontSize: '0.7rem', fontWeight: 700,
    letterSpacing: '0.1em', textTransform: 'uppercase' as const,
    color: '#8888a4', marginBottom: 8,
  }

  return (
    <main style={{
      minHeight: '100vh', background: '#060608',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 24, fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        width: '100%', maxWidth: 420,
        background: '#0d0d11', border: '1px solid #2e2e3a',
        borderRadius: 16, padding: 40,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48, background: '#c4983a',
            borderRadius: 8, display: 'flex', alignItems: 'center',
            justifyContent: 'center', fontSize: 22, fontWeight: 900,
            color: '#060608', margin: '0 auto 16px',
          }}>♠</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8f4ee', marginBottom: 4 }}>
            Bon retour 👋
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#5a5a72' }}>
            Connecte-toi pour accéder à ta bande
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email</label>
            <input style={inputStyle} type="email" placeholder="ton@email.com"
              value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Mot de passe</label>
            <input style={inputStyle} type="password" placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)} required />
          </div>

          {error && (
            <div style={{
              padding: '10px 14px', background: 'rgba(196,48,48,0.1)',
              border: '1px solid rgba(196,48,48,0.3)', borderRadius: 8,
              color: '#ff8080', fontSize: '0.8rem', marginBottom: 16,
            }}>{error}</div>
          )}

          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '13px',
            background: loading ? '#8a6a1e' : '#c4983a',
            color: '#060608', border: 'none', borderRadius: 6,
            fontSize: '0.85rem', fontWeight: 800, letterSpacing: '0.04em',
            textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
            fontFamily: 'system-ui, sans-serif',
          }}>
            {loading ? 'Connexion...' : '♠ Se connecter'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.8rem', color: '#5a5a72' }}>
          Pas encore membre ?{' '}
          <a href="/auth/register" style={{ color: '#c4983a', textDecoration: 'none' }}>
            Créer un compte
          </a>
        </div>
      </div>
    </main>
  )
}
