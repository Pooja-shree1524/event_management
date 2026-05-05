import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Alert } from '@/components/Alert'
import { Mail, Lock, LogIn, Eye, EyeOff, Sparkles } from 'lucide-react'

export function LoginPage() {
  const navigate = useNavigate()
  const { login, isLoading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [focused, setFocused] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) clearError()
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await login(formData.email, formData.password)
      navigate('/')
    } catch (err) {
      console.error('Login failed:', err)
    }
  }

  return (
    <>
      <style>{CSS}</style>

      <div className={`lp-root ${mounted ? 'lp-mounted' : ''}`}>
        {/* Orbs */}
        <div className="lp-orb lp-orb-1" aria-hidden />
        <div className="lp-orb lp-orb-2" aria-hidden />
        <div className="lp-orb lp-orb-3" aria-hidden />

        {/* Grid lines decoration */}
        <div className="lp-grid" aria-hidden />

        <div className="lp-center">
          {/* Brand */}
          <div className="lp-brand lp-anim-1">
            <div className="lp-brand-icon">
              <Sparkles size={18} strokeWidth={2} />
            </div>
            <span className="lp-brand-name">EventHub</span>
          </div>

          {/* Card */}
          <div className="lp-card lp-anim-2">
            {/* Card top accent line */}
            <div className="lp-card-accent" aria-hidden />

            {/* Header */}
            <div className="lp-card-header">
              <div className="lp-icon-wrap">
                <LogIn size={22} strokeWidth={1.8} />
              </div>
              <h1 className="lp-title">Welcome back</h1>
              <p className="lp-subtitle">Sign in to continue your journey</p>
            </div>

            {/* Error */}
            {error && (
              <div className="lp-alert-wrap">
                <Alert type="error" message={error} onClose={clearError} autoClose={false} />
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="lp-form">
              {/* Email */}
              <div className={`lp-field ${focused === 'email' ? 'lp-field-focused' : ''} ${formData.email ? 'lp-field-filled' : ''}`}>
                <label className="lp-label" htmlFor="lp-email">Email address</label>
                <div className="lp-input-wrap">
                  <Mail className="lp-input-icon" size={16} strokeWidth={2} />
                  <input
                    id="lp-email"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={() => setFocused('email')}
                    onBlur={() => setFocused(null)}
                    className="lp-input"
                    placeholder="you@example.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className={`lp-field ${focused === 'password' ? 'lp-field-focused' : ''} ${formData.password ? 'lp-field-filled' : ''}`}>
                <div className="lp-label-row">
                  <label className="lp-label" htmlFor="lp-password">Password</label>
                  <button type="button" className="lp-forgot">Forgot password?</button>
                </div>
                <div className="lp-input-wrap">
                  <Lock className="lp-input-icon" size={16} strokeWidth={2} />
                  <input
                    id="lp-password"
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    onFocus={() => setFocused('password')}
                    onBlur={() => setFocused(null)}
                    className="lp-input"
                    placeholder="••••••••"
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="lp-eye"
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
                className={`lp-submit ${isLoading ? 'lp-submit-loading' : ''}`}
              >
                {isLoading ? (
                  <>
                    <span className="lp-spinner" aria-hidden />
                    <span>Signing in…</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <LogIn size={15} strokeWidth={2.5} />
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="lp-divider">
              <span className="lp-divider-line" />
              <span className="lp-divider-text">New here?</span>
              <span className="lp-divider-line" />
            </div>

            {/* Sign up */}
            <Link to="/signup" className="lp-signup-btn">
              Create your account
            </Link>
          </div>

          {/* Footer note */}
          <p className="lp-footer lp-anim-3">
            By signing in you agree to our{' '}
            <a href="/terms" className="lp-footer-link">Terms</a>
            {' '}and{' '}
            <a href="/privacy" className="lp-footer-link">Privacy Policy</a>
          </p>
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
    --navy-950: #050c1a;
    --navy-900: #0a1628;
    --navy-800: #0f2040;
    --indigo:   #4361ee;
    --indigo-lt:#5a7bff;
    --gold:     #f5c842;
    --rose:     #e84b6a;
    --white:    #ffffff;
    --gray-100: #e8edf8;
    --gray-200: #c4cde0;
    --gray-400: #8899bb;
    --gray-600: #4a5880;
    --surface:  rgba(255,255,255,0.05);
    --surface2: rgba(255,255,255,0.09);
    --border:   rgba(255,255,255,0.10);
    --border2:  rgba(255,255,255,0.18);
    --ff-display:'Playfair Display', Georgia, serif;
    --ff-body:   'DM Sans', system-ui, sans-serif;
  }

  @keyframes lp-fade-up {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes lp-pulse {
    0%,100% { opacity:0.55; transform:scale(1);    }
    50%      { opacity:0.80; transform:scale(1.08); }
  }
  @keyframes lp-spin {
    to { transform: rotate(360deg); }
  }

  .lp-root {
    font-family: var(--ff-body);
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px 16px;
    background:
      radial-gradient(ellipse 80% 60% at 10% 0%,  rgba(67,97,238,0.28) 0%, transparent 65%),
      radial-gradient(ellipse 60% 50% at 90% 100%, rgba(232,75,106,0.18) 0%, transparent 65%),
      linear-gradient(160deg, var(--navy-900) 0%, var(--navy-950) 100%);
    overflow: hidden;
    position: relative;
  }

  /* Orbs */
  .lp-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    animation: lp-pulse 9s ease-in-out infinite;
  }
  .lp-orb-1 {
    width: 500px; height: 500px;
    top: -200px; left: -150px;
    background: radial-gradient(circle, rgba(67,97,238,0.20) 0%, transparent 70%);
  }
  .lp-orb-2 {
    width: 400px; height: 400px;
    bottom: -180px; right: -100px;
    background: radial-gradient(circle, rgba(232,75,106,0.16) 0%, transparent 70%);
    animation-delay: -4.5s;
  }
  .lp-orb-3 {
    width: 220px; height: 220px;
    top: 40%; right: 20%;
    background: radial-gradient(circle, rgba(245,200,66,0.10) 0%, transparent 70%);
    animation-delay: -2s;
  }

  /* Grid lines */
  .lp-grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  /* Center column */
  .lp-center {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 440px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
  }

  /* Animations */
  .lp-root .lp-anim-1,
  .lp-root .lp-anim-2,
  .lp-root .lp-anim-3 { opacity: 0; }
  .lp-mounted .lp-anim-1 { animation: lp-fade-up 0.50s ease forwards 0.05s; }
  .lp-mounted .lp-anim-2 { animation: lp-fade-up 0.55s ease forwards 0.18s; }
  .lp-mounted .lp-anim-3 { animation: lp-fade-up 0.50s ease forwards 0.32s; }

  /* Brand */
  .lp-brand {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }
  .lp-brand-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--indigo) 0%, #7b2ff7 100%);
    display: flex; align-items: center; justify-content: center;
    color: var(--white);
    box-shadow: 0 4px 14px rgba(67,97,238,0.45);
  }
  .lp-brand-name {
    font-family: var(--ff-display);
    font-size: 22px;
    font-weight: 800;
    color: var(--white);
    letter-spacing: -0.02em;
  }

  /* Card */
  .lp-card {
    width: 100%;
    background: rgba(15,32,64,0.70);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--border2);
    border-radius: 24px;
    padding: 36px 36px 32px;
    position: relative;
    overflow: hidden;
    box-shadow:
      0 8px 40px rgba(0,0,0,0.50),
      0 1px 0px rgba(255,255,255,0.08) inset;
  }
  .lp-card-accent {
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, var(--indigo) 0%, var(--rose) 60%, transparent 100%);
    border-radius: 24px 24px 0 0;
  }

  /* Card header */
  .lp-card-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin-bottom: 28px;
  }
  .lp-icon-wrap {
    width: 52px; height: 52px;
    border-radius: 16px;
    background: rgba(67,97,238,0.15);
    border: 1px solid rgba(90,123,255,0.30);
    display: flex; align-items: center; justify-content: center;
    color: var(--indigo-lt);
    margin-bottom: 16px;
  }
  .lp-title {
    font-family: var(--ff-display);
    font-size: 28px;
    font-weight: 700;
    color: var(--white);
    margin: 0 0 6px;
    letter-spacing: -0.02em;
  }
  .lp-subtitle {
    font-size: 14px;
    font-weight: 300;
    color: var(--gray-400);
    margin: 0;
  }

  /* Alert */
  .lp-alert-wrap { margin-bottom: 20px; }

  /* Form */
  .lp-form {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  /* Field */
  .lp-field { display: flex; flex-direction: column; gap: 8px; }

  .lp-label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .lp-label {
    font-size: 12.5px;
    font-weight: 500;
    color: var(--gray-200);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .lp-forgot {
    font-size: 12px;
    color: var(--indigo-lt);
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
    font-family: var(--ff-body);
    transition: opacity 0.15s;
  }
  .lp-forgot:hover { opacity: 0.75; }

  .lp-input-wrap {
    position: relative;
    display: flex;
    align-items: center;
    background: rgba(255,255,255,0.05);
    border: 1px solid var(--border);
    border-radius: 12px;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
  }
  .lp-field-focused .lp-input-wrap {
    border-color: rgba(90,123,255,0.60);
    background: rgba(255,255,255,0.08);
    box-shadow: 0 0 0 3px rgba(67,97,238,0.15);
  }
  .lp-input-icon {
    position: absolute;
    left: 14px;
    color: var(--gray-600);
    pointer-events: none;
    flex-shrink: 0;
    transition: color 0.2s;
  }
  .lp-field-focused .lp-input-icon { color: var(--indigo-lt); }

  .lp-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 13px 40px 13px 42px;
    font-family: var(--ff-body);
    font-size: 14.5px;
    font-weight: 400;
    color: var(--white);
    caret-color: var(--indigo-lt);
    width: 100%;
  }
  .lp-input::placeholder { color: var(--gray-600); }

  .lp-eye {
    position: absolute;
    right: 12px;
    background: none;
    border: none;
    color: var(--gray-600);
    cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    padding: 4px;
    border-radius: 6px;
    transition: color 0.15s, background 0.15s;
  }
  .lp-eye:hover { color: var(--gray-200); background: rgba(255,255,255,0.08); }

  /* Submit */
  .lp-submit {
    margin-top: 4px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 24px;
    background: linear-gradient(135deg, var(--indigo) 0%, #7b2ff7 100%);
    border: none;
    border-radius: 12px;
    color: var(--white);
    font-family: var(--ff-body);
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 18px rgba(67,97,238,0.42);
    transition: opacity 0.15s, transform 0.15s, box-shadow 0.2s;
    position: relative;
    overflow: hidden;
  }
  .lp-submit::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .lp-submit:hover:not(:disabled)::before { opacity: 1; }
  .lp-submit:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(67,97,238,0.58);
  }
  .lp-submit:active:not(:disabled) { transform: scale(0.98); }
  .lp-submit:disabled { opacity: 0.55; cursor: not-allowed; }
  .lp-submit-loading { pointer-events: none; }

  .lp-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.30);
    border-top-color: var(--white);
    border-radius: 50%;
    animation: lp-spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  /* Divider */
  .lp-divider {
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 24px 0 0;
  }
  .lp-divider-line {
    flex: 1;
    height: 1px;
    background: var(--border);
  }
  .lp-divider-text {
    font-size: 12px;
    color: var(--gray-600);
    white-space: nowrap;
    letter-spacing: 0.04em;
  }

  /* Sign up button */
  .lp-signup-btn {
    display: block;
    width: 100%;
    margin-top: 12px;
    padding: 13px 24px;
    background: transparent;
    border: 1px solid var(--border2);
    border-radius: 12px;
    color: var(--gray-200);
    font-family: var(--ff-body);
    font-size: 14.5px;
    font-weight: 500;
    text-align: center;
    text-decoration: none;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
  }
  .lp-signup-btn:hover {
    background: var(--surface2);
    border-color: rgba(90,123,255,0.45);
    color: var(--white);
  }

  /* Footer */
  .lp-footer {
    font-size: 12px;
    color: var(--gray-600);
    text-align: center;
    margin: 0;
    line-height: 1.7;
  }
  .lp-footer-link {
    color: var(--gray-400);
    text-decoration: none;
    border-bottom: 1px solid rgba(136,153,187,0.35);
    transition: color 0.15s, border-color 0.15s;
  }
  .lp-footer-link:hover { color: var(--indigo-lt); border-color: var(--indigo-lt); }

  @media (max-width: 480px) {
    .lp-card { padding: 28px 20px 24px; border-radius: 20px; }
  }
`