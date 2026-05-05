import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Alert } from '@/components/Alert'
import { Shield, Lock, ShieldCheck, Eye, EyeOff, ArrowLeft } from 'lucide-react'

export function AdminLoginPage() {
  const navigate = useNavigate()
  const { login, logout, isLoading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [focused, setFocused] = useState(null)
  const [localError, setLocalError] = useState('')

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) clearError()
    if (localError) setLocalError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLocalError('')
    try {
      const response = await login(formData.email, formData.password)
      if (response.authority === 'ROLE_ADMIN') {
        navigate('/admin/dashboard')
      } else {
        logout()
        setLocalError('Access Denied: Administrator privileges required.')
      }
    } catch (err) {
      console.error('Admin Login failed:', err)
    }
  }

  const displayError = localError || error

  return (
    <>
      <style>{CSS}</style>

      <div className={`alp-root ${mounted ? 'alp-mounted' : ''}`}>
        {/* Back Button */}
        <button
          onClick={() => navigate('/')}
          className="alp-back-btn alp-anim-1"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
          <span>Back to Home</span>
        </button>

        {/* Orbs */}
        <div className="alp-orb alp-orb-1" aria-hidden />
        <div className="alp-orb alp-orb-2" aria-hidden />

        {/* Grid lines decoration */}
        <div className="alp-grid" aria-hidden />

        <div className="alp-center">
          {/* Brand */}
          <div className="alp-brand alp-anim-1">
            <div className="alp-brand-icon">
              <ShieldCheck size={18} strokeWidth={2} />
            </div>
            <span className="alp-brand-name">Admin Portal</span>
          </div>

          {/* Card */}
          <div className="alp-card alp-anim-2">
            {/* Card top accent line */}
            <div className="alp-card-accent" aria-hidden />

            {/* Header */}
            <div className="alp-card-header">
              <div className="alp-icon-wrap">
                <Shield size={26} strokeWidth={1.8} />
              </div>
              <h1 className="alp-title">System Access</h1>
              <p className="alp-subtitle">Enter your administrative credentials</p>
            </div>

            {/* Error */}
            {displayError && (
              <div className="alp-alert-wrap">
                <Alert type="error" message={displayError} onClose={() => { clearError(); setLocalError(''); }} autoClose={false} />
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="alp-form">
              {/* Email */}
              <div className={`alp-field ${focused === 'email' ? 'alp-field-focused' : ''} ${formData.email ? 'alp-field-filled' : ''}`}>
                <label className="alp-label" htmlFor="alp-email">Admin Email</label>
                <div className="alp-input-wrap">
                  <ShieldCheck className="alp-input-icon" size={16} strokeWidth={2} />
                  <input
                    id="alp-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    className="alp-input"
                    placeholder="admin@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className={`alp-field ${focused === 'password' ? 'alp-field-focused' : ''} ${formData.password ? 'alp-field-filled' : ''}`}>
                <div className="alp-label-row">
                  <label className="alp-label" htmlFor="alp-password">Security Key</label>
                </div>
                <div className="alp-input-wrap">
                  <Lock className="alp-input-icon" size={16} strokeWidth={2} />
                  <input
                    id="alp-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    className="alp-input"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="alp-eye"
                    onClick={() => setShowPassword(v => !v)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword
                      ? <EyeOff size={15} strokeWidth={2} />
                      : <Eye size={15} strokeWidth={2} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`alp-submit ${isLoading ? 'alp-submit-loading' : ''}`}
              >
                {isLoading ? (
                  <>
                    <span className="alp-spinner" aria-hidden />
                    <span>Authenticating…</span>
                  </>
                ) : (
                  <>
                    <span>Authenticate</span>
                    <ShieldCheck size={15} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════════
   Styles
   ════════════════════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --navy-950: #030712;
    --navy-900: #0f172a;
    --navy-800: #1e293b;
    --teal:     #14b8a6;
    --teal-lt:  #2dd4bf;
    --gold:     #fbbf24;
    --rose:     #f43f5e;
    --white:    #ffffff;
    --gray-100: #f1f5f9;
    --gray-200: #cbd5e1;
    --gray-400: #94a3b8;
    --gray-600: #475569;
    --surface:  rgba(255,255,255,0.03);
    --surface2: rgba(255,255,255,0.06);
    --border:   rgba(255,255,255,0.08);
    --border2:  rgba(255,255,255,0.15);
    --ff-display:'Playfair Display', Georgia, serif;
    --ff-body:   'DM Sans', system-ui, sans-serif;
  }

  @keyframes alp-fade-up {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes alp-pulse {
    0%,100% { opacity:0.35; transform:scale(1);    }
    50%      { opacity:0.55; transform:scale(1.05); }
  }
  @keyframes alp-spin {
    to { transform: rotate(360deg); }
  }

  .alp-root {
    font-family: var(--ff-body);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    background:
      radial-gradient(ellipse 60% 60% at 20% 0%,  rgba(20, 184, 166, 0.15) 0%, transparent 65%),
      radial-gradient(ellipse 60% 50% at 80% 100%, rgba(251, 191, 36, 0.08) 0%, transparent 65%),
      linear-gradient(160deg, var(--navy-900) 0%, var(--navy-950) 100%);
    overflow: hidden;
    position: relative;
  }

  /* Back Button */
  .alp-back-btn {
    position: absolute;
    top: 32px;
    left: 32px;
    display: flex;
    align-items: center;
    gap: 8px;
    background: transparent;
    border: none;
    color: var(--gray-400);
    font-family: var(--ff-body);
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    z-index: 10;
    transition: color 0.2s;
  }
  .alp-back-btn:hover {
    color: var(--white);
  }

  /* Orbs */
  .alp-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    animation: alp-pulse 8s ease-in-out infinite;
  }
  .alp-orb-1 {
    width: 600px; height: 600px;
    top: -250px; left: -200px;
    background: radial-gradient(circle, rgba(20, 184, 166, 0.1) 0%, transparent 70%);
  }
  .alp-orb-2 {
    width: 450px; height: 450px;
    bottom: -200px; right: -150px;
    background: radial-gradient(circle, rgba(251, 191, 36, 0.08) 0%, transparent 70%);
    animation-delay: -4s;
  }

  /* Grid lines */
  .alp-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
  }

  /* Center column */
  .alp-center {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 420px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;
  }

  /* Animations */
  .alp-root .alp-anim-1,
  .alp-root .alp-anim-2 { opacity: 0; }
  .alp-mounted .alp-anim-1 { animation: alp-fade-up 0.50s ease forwards 0.05s; }
  .alp-mounted .alp-anim-2 { animation: alp-fade-up 0.55s ease forwards 0.18s; }

  /* Brand */
  .alp-brand {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .alp-brand-icon {
    width: 40px; height: 40px;
    border-radius: 12px;
    background: linear-gradient(135deg, var(--teal) 0%, #0f766e 100%);
    display: flex; align-items: center; justify-content: center;
    color: var(--white);
    box-shadow: 0 4px 16px rgba(20, 184, 166, 0.3);
  }
  .alp-brand-name {
    font-family: var(--ff-display);
    font-size: 24px;
    font-weight: 800;
    color: var(--white);
    letter-spacing: -0.02em;
    text-transform: uppercase;
  }

  /* Card */
  .alp-card {
    width: 100%;
    background: rgba(30, 41, 59, 0.6);
    backdrop-filter: blur(28px);
    -webkit-backdrop-filter: blur(28px);
    border: 1px solid var(--border2);
    border-radius: 24px;
    padding: 40px;
    position: relative;
    overflow: hidden;
    box-shadow:
      0 12px 48px rgba(0,0,0,0.6),
      0 1px 0px rgba(255,255,255,0.05) inset;
  }
  .alp-card-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: linear-gradient(90deg, var(--teal) 0%, var(--gold) 100%);
  }

  /* Card header */
  .alp-card-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 32px;
  }
  .alp-icon-wrap {
    width: 56px; height: 56px;
    border-radius: 16px;
    background: rgba(20, 184, 166, 0.1);
    border: 1px solid rgba(45, 212, 191, 0.2);
    display: flex; align-items: center; justify-content: center;
    color: var(--teal-lt);
    margin-bottom: 20px;
  }
  .alp-title {
    font-family: var(--ff-display);
    font-size: 28px;
    font-weight: 700;
    color: var(--white);
    margin: 0 0 8px;
    letter-spacing: -0.02em;
  }
  .alp-subtitle {
    font-size: 14px;
    font-weight: 400;
    color: var(--gray-400);
    margin: 0;
  }

  /* Alert */
  .alp-alert-wrap { margin-bottom: 24px; }

  /* Form */
  .alp-form {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Field */
  .alp-field { display: flex; flex-direction: column; gap: 8px; }

  .alp-label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .alp-label {
    font-size: 12px;
    font-weight: 600;
    color: var(--gray-400);
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .alp-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid var(--border);
    border-radius: 12px;
    transition: all 0.2s;
  }
  .alp-field-focused .alp-input-wrap {
    border-color: rgba(45, 212, 191, 0.5);
    background: rgba(15, 23, 42, 0.8);
    box-shadow: 0 0 0 3px rgba(20, 184, 166, 0.15);
  }
  .alp-input-icon {
    position: absolute;
    left: 14px;
    color: var(--gray-600);
    pointer-events: none;
    transition: color 0.2s;
  }
  .alp-field-focused .alp-input-icon { color: var(--teal-lt); }

  .alp-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 14px 40px 14px 42px;
    font-family: var(--ff-body);
    font-size: 15px;
    color: var(--white);
    caret-color: var(--teal-lt);
    width: 100%;
  }
  .alp-input::placeholder { color: var(--gray-600); }

  .alp-eye {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    color: var(--gray-600);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    padding: 6px;
    border-radius: 8px;
    transition: all 0.15s;
  }
  .alp-eye:hover { color: var(--gray-200); background: rgba(255,255,255,0.05); }

  /* Submit */
  .alp-submit {
    margin-top: 8px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 16px;
    background: linear-gradient(135deg, var(--teal) 0%, #0f766e 100%);
    border: none;
    border-radius: 12px;
    color: var(--white);
    font-family: var(--ff-body);
    font-size: 15px;
    font-weight: 600;
    letter-spacing: 0.02em;
    cursor: pointer;
    box-shadow: 0 6px 20px rgba(20, 184, 166, 0.25);
    transition: all 0.2s;
    position: relative;
    overflow: hidden;
  }
  .alp-submit::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .alp-submit:hover:not(:disabled)::before { opacity: 1; }
  .alp-submit:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 28px rgba(20, 184, 166, 0.4);
  }
  .alp-submit:active:not(:disabled) { transform: scale(0.98); }
  .alp-submit:disabled { opacity: 0.5; cursor: not-allowed; }
  .alp-submit-loading { pointer-events: none; }

  .alp-spinner {
    width: 18px; height: 18px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: var(--white);
    border-radius: 50%;
    animation: alp-spin 0.7s linear infinite;
  }

  @media (max-width: 480px) {
    .alp-card { padding: 32px 24px; }
  }
`
