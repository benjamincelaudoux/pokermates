'use client'

import { useState } from 'react'
import { createBrowserClient } from '@supabase/ssr'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [pseudo, setPseudo] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setMessage('')

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { pseudo },
      },
    })

    if (error) {
      setError(error.message)
    } else {
      setMessage('Compte créé ! Vérifie ton email pour confirmer ton inscription.')
    }

    setLoading(false)
  }

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    background: '#1a1a20',
    border: '1px solid #2e2e3a',
    borderRadius: 8,
    color: '#f8f4ee',
    fontSize: '0.9rem',
    outline: 'none',
    fontFamily: 'system-ui, sans-serif',
  }

  const labelStyle = {
    display: 'block',
    fontSize: '0.7rem',
    fontWeight: 700,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    color: '#8888a4',
    marginBottom: 8,
  }

  return (
    <main style={{
      minHeight: '100vh',
      background: '#060608',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      fontFamily: 'system-ui, sans-serif',
    }}>
      <div style={{
        width: '100%',
        maxWidth: 420,
        background: '#0d0d11',
        border: '1px solid #2e2e3a',
        borderRadius: 16,
        padding: 40,
      }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 48, height: 48,
            background: '#c4983a',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 22, fontWeight: 900, color: '#060608',
            margin: '0 auto 16px',
          }}>♠</div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8f4ee', marginBottom: 4 }}>
            Rejoindre PokerMates
          </h1>
          <p style={{ fontSize: '0.82rem', color: '#5a5a72' }}>
            Crée ton profil en 2 minutes · Gratuit
          </p>
        </div>

        <form onSubmit={handleRegister}>

          {/* Pseudo */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Pseudo *</label>
            <input
              style={inputStyle}
              type="text"
              placeholder="TonPseudo"
              value={pseudo}
              onChange={e => setPseudo(e.target.value)}
              required
              minLength={4}
              maxLength={30}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: 16 }}>
            <label style={labelStyle}>Email *</label>
            <input
              style={inputStyle}
              type="email"
              placeholder="ton@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Mot de passe */}
          <div style={{ marginBottom: 24 }}>
            <label style={labelStyle}>Mot de passe *</label>
            <input
              style={inputStyle}
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <div style={{ fontSize: '0.7rem', color: '#5a5a72', marginTop: 6 }}>
              6 caractères minimum
            </div>
          </div>

          {/* Messages */}
          {error && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(196,48,48,0.1)',
              border: '1px solid rgba(196,48,48,0.3)',
              borderRadius: 8,
              color: '#ff8080',
              fontSize: '0.8rem',
              marginBottom: 16,
            }}>
              {error}
            </div>
          )}

          {message && (
            <div style={{
              padding: '10px 14px',
              background: 'rgba(37,184,101,0.1)',
              border: '1px solid rgba(37,184,101,0.3)',
              borderRadius: 8,
              color: '#5effa0',
              fontSize: '0.8rem',
              marginBottom: 16,
            }}>
              {message}
            </div>
          )}

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '13px',
              background: loading ? '#8a6a1e' : '#c4983a',
              color: '#060608',
              border: 'none',
              borderRadius: 6,
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontFamily: 'system-ui, sans-serif',
            }}
          >
            {loading ? 'Création en cours...' : '♠ Créer mon compte'}
          </button>

        </form>

        {/* Lien login */}
        <div style={{ textAlign: 'center', marginTop: 20, fontSize: '0.8rem', color: '#5a5a72' }}>
          Déjà membre ?{' '}
          <a href="/auth/login" style={{ color: '#c4983a', textDecoration: 'none' }}>
            Se connecter
          </a>
        </div>

      </div>
    </main>
  )
}
