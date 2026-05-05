import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { Alert } from '@/components/Alert'
import { Mail, Lock, User, UserPlus, Eye, EyeOff, Sparkles, ChevronDown, GraduationCap, ShieldCheck } from 'lucide-react'

/* ── Password strength meter ─────────────────────────────────────── */
function StrengthBar({ password }) {
  const score = !password ? 0
    : [/.{8,}/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].filter(r => r.test(password)).length

  const levels = [
    { label: 'Too short', color: '#e84b6a' },
    { label: 'Weak',      color: '#e84b6a' },
    { label: 'Fair',      color: '#f5c842' },
    { label: 'Good',      color: '#0abf8e' },
    { label: 'Strong',    color: '#4361ee' },
  ]
  const { label, color } = levels[score]

  if (!password) return null
  return (
    <div className="sp-strength">
      <div className="sp-strength-bars">
        {[1,2,3,4].map(i => (
          <div
            key={i}
            className="sp-strength-seg"
            style={{ background: i <= score ? color : 'rgba(255,255,255,0.08)' }}
          />
        ))}
      </div>
      <span className="sp-strength-label" style={{ color }}>{label}</span>
    </div>
  )
}

/* ── Custom role selector ─────────────────────────────────────────── */
const ROLES = [
  { value: 'student', label: 'Student',       icon: GraduationCap, desc: 'Browse & register for events' },
  { value: 'admin',   label: 'Administrator', icon: ShieldCheck,   desc: 'Create & manage events'       },
]

function RoleSelector({ value, onChange }) {
  return (
    <div className="sp-roles">
      {ROLES.map(({ value: v, label, icon: Icon, desc }) => (
        <button
          key={v}
          type="button"
          className={`sp-role-btn ${value === v ? 'sp-role-active' : ''}`}
          onClick={() => onChange(v)}
        >
          <div className="sp-role-icon">
            <Icon size={16} strokeWidth={1.8} />
          </div>
          <div className="sp-role-text">
            <span className="sp-role-name">{label}</span>
            <span className="sp-role-desc">{desc}</span>
          </div>
          <div className="sp-role-check" aria-hidden>
            {value === v && <div className="sp-role-dot" />}
          </div>
        </button>
      ))}
    </div>
  )
}

/* ── Main page ────────────────────────────────────────────────────── */
export function SignupPage() {
  const navigate = useNavigate()
  const { signup, isLoading, error, clearError } = useAuthStore()
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', role: 'student',
  })
  const [showPass, setShowPass]    = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [focused, setFocused]      = useState(null)
  const [mounted, setMounted]      = useState(false)
  const [pwMismatch, setPwMismatch] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (error) clearError()
    if (name === 'confirmPassword' || name === 'password') setPwMismatch(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      setPwMismatch(true)
      return
    }
    try {
      await signup(formData.name, formData.email, formData.password, formData.role)
      navigate('/login')
    } catch (err) {
      console.error('Signup failed:', err)
    }
  }

  const Field = ({ id, label, name, type = 'text', placeholder, icon: Icon, toggle, show, onToggle }) => (
    <div className={`sp-field ${focused === name ? 'sp-field-focused' : ''} ${formData[name] ? 'sp-field-filled' : ''}`}>
      <label className="sp-label" htmlFor={id}>{label}</label>
      <div className="sp-input-wrap">
        <Icon className="sp-input-icon" size={15} strokeWidth={2} />
        <input
          id={id}
          type={toggle ? (show ? 'text' : 'password') : type}
          name={name}
          value={formData[name]}
          onChange={handleChange}
          onFocus={() => setFocused(name)}
          onBlur={() => setFocused(null)}
          className={`sp-input ${name === 'confirmPassword' && pwMismatch ? 'sp-input-error' : ''}`}
          placeholder={placeholder}
          autoComplete={name === 'password' ? 'new-password' : name === 'confirmPassword' ? 'new-password' : name}
          required
        />
        {toggle && (
          <button type="button" className="sp-eye" onClick={onToggle} aria-label={show ? 'Hide' : 'Show'}>
            {show ? <EyeOff size={14} strokeWidth={2} /> : <Eye size={14} strokeWidth={2} />}
          </button>
        )}
      </div>
    </div>
  )

  return (
    <>
      <style>{CSS}</style>
      <div className={`sp-root ${mounted ? 'sp-mounted' : ''}`}>
        <div className="sp-orb sp-orb-1" aria-hidden />
        <div className="sp-orb sp-orb-2" aria-hidden />
        <div className="sp-orb sp-orb-3" aria-hidden />
        <div className="sp-grid"         aria-hidden />

        <div className="sp-center">
          {/* Brand */}
          <div className="sp-brand sp-anim-1">
            <div className="sp-brand-icon"><Sparkles size={18} strokeWidth={2} /></div>
            <span className="sp-brand-name">EventHub</span>
          </div>

          {/* Card */}
          <div className="sp-card sp-anim-2">
            <div className="sp-card-accent" aria-hidden />

            {/* Header */}
            <div className="sp-card-header">
              <div className="sp-icon-wrap"><UserPlus size={22} strokeWidth={1.8} /></div>
              <h1 className="sp-title">Create your account</h1>
              <p className="sp-subtitle">Join thousands discovering great events</p>
            </div>

            {/* Alerts */}
            {error && (
              <div className="sp-alert-wrap">
                <Alert type="error" message={error} onClose={clearError} autoClose={false} />
              </div>
            )}
            {pwMismatch && (
              <div className="sp-alert-wrap">
                <Alert type="error" message="Passwords do not match." onClose={() => setPwMismatch(false)} autoClose={false} />
              </div>
            )}

            <form onSubmit={handleSubmit} className="sp-form">
              <Field id="sp-name"  label="Full name"  name="name"  placeholder="John Doe"          icon={User} />
              <Field id="sp-email" label="Email address" name="email" type="email" placeholder="you@example.com" icon={Mail} />

              {/* Role selector */}
              <div className="sp-field">
                <label className="sp-label">Account type</label>
                <RoleSelector value={formData.role} onChange={v => setFormData(p => ({ ...p, role: v }))} />
              </div>

              <Field
                id="sp-pass" label="Password" name="password"
                placeholder="Min. 8 characters" icon={Lock}
                toggle show={showPass} onToggle={() => setShowPass(v => !v)}
              />
              <StrengthBar password={formData.password} />

              <Field
                id="sp-confirm" label="Confirm password" name="confirmPassword"
                placeholder="••••••••" icon={Lock}
                toggle show={showConfirm} onToggle={() => setShowConfirm(v => !v)}
              />

              <button
                type="submit"
                disabled={isLoading}
                className={`sp-submit ${isLoading ? 'sp-submit-loading' : ''}`}
              >
                {isLoading ? (
                  <><span className="sp-spinner" aria-hidden /><span>Creating account…</span></>
                ) : (
                  <span>Create Account</span>
                )}
              </button>
            </form>

            <div className="sp-divider">
              <span className="sp-div-line" />
              <span className="sp-div-text">Already a member?</span>
              <span className="sp-div-line" />
            </div>

            <Link to="/login" className="sp-login-btn">Sign in instead</Link>
          </div>

          <p className="sp-footer sp-anim-3">
            By creating an account you agree to our{' '}
            <a href="/terms" className="sp-footer-link">Terms</a>
            {' '}and{' '}
            <a href="/privacy" className="sp-footer-link">Privacy Policy</a>
          </p>
        </div>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════════ */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  :root {
    --navy-950:#050c1a; --navy-900:#0a1628; --navy-800:#0f2040;
    --indigo:#4361ee; --indigo-lt:#5a7bff;
    --gold:#f5c842; --rose:#e84b6a; --teal:#0abf8e;
    --white:#ffffff;
    --gray-100:#e8edf8; --gray-200:#c4cde0; --gray-400:#8899bb; --gray-600:#4a5880;
    --border:rgba(255,255,255,0.10); --border2:rgba(255,255,255,0.16);
    --surface:rgba(255,255,255,0.04); --surface2:rgba(255,255,255,0.08);
    --ff-display:'Playfair Display',Georgia,serif;
    --ff-body:'DM Sans',system-ui,sans-serif;
  }

  @keyframes sp-fade-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes sp-pulse { 0%,100%{opacity:.55;transform:scale(1)} 50%{opacity:.78;transform:scale(1.07)} }
  @keyframes sp-spin  { to{transform:rotate(360deg)} }

  .sp-root {
    font-family:var(--ff-body);
    min-height:100vh;
    display:flex; align-items:center; justify-content:center;
    padding:32px 16px;
    background:
      radial-gradient(ellipse 75% 60% at 10% 0%,  rgba(67,97,238,.28) 0%,transparent 65%),
      radial-gradient(ellipse 60% 50% at 90% 100%, rgba(232,75,106,.18) 0%,transparent 65%),
      linear-gradient(160deg,var(--navy-900) 0%,var(--navy-950) 100%);
    position:relative; overflow:hidden;
  }

  .sp-orb { position:absolute; border-radius:50%; pointer-events:none; animation:sp-pulse 9s ease-in-out infinite; }
  .sp-orb-1 { width:500px;height:500px; top:-200px;left:-150px;  background:radial-gradient(circle,rgba(67,97,238,.18) 0%,transparent 70%); }
  .sp-orb-2 { width:400px;height:400px; bottom:-180px;right:-100px; background:radial-gradient(circle,rgba(232,75,106,.14) 0%,transparent 70%); animation-delay:-4.5s; }
  .sp-orb-3 { width:220px;height:220px; top:35%;right:18%; background:radial-gradient(circle,rgba(245,200,66,.09) 0%,transparent 70%); animation-delay:-2s; }
  .sp-grid  { position:absolute;inset:0; background-image:linear-gradient(rgba(255,255,255,.022) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.022) 1px,transparent 1px); background-size:48px 48px; pointer-events:none; }

  .sp-center { position:relative;z-index:2; width:100%;max-width:460px; display:flex;flex-direction:column;align-items:center;gap:20px; }

  .sp-root .sp-anim-1,.sp-root .sp-anim-2,.sp-root .sp-anim-3 { opacity:0; }
  .sp-mounted .sp-anim-1 { animation:sp-fade-up .50s ease forwards .05s; }
  .sp-mounted .sp-anim-2 { animation:sp-fade-up .55s ease forwards .18s; }
  .sp-mounted .sp-anim-3 { animation:sp-fade-up .50s ease forwards .32s; }

  /* Brand */
  .sp-brand { display:flex;align-items:center;gap:10px; }
  .sp-brand-icon { width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--indigo) 0%,#7b2ff7 100%);display:flex;align-items:center;justify-content:center;color:var(--white);box-shadow:0 4px 14px rgba(67,97,238,.45); }
  .sp-brand-name { font-family:var(--ff-display);font-size:22px;font-weight:800;color:var(--white);letter-spacing:-.02em; }

  /* Card */
  .sp-card {
    width:100%;
    background:rgba(15,32,64,.70);
    backdrop-filter:blur(24px); -webkit-backdrop-filter:blur(24px);
    border:1px solid var(--border2);
    border-radius:24px;
    padding:36px 36px 30px;
    position:relative; overflow:hidden;
    box-shadow:0 8px 40px rgba(0,0,0,.50),0 1px 0 rgba(255,255,255,.08) inset;
  }
  .sp-card-accent { position:absolute;top:0;left:0;right:0;height:2px;background:linear-gradient(90deg,#7b2ff7 0%,var(--indigo) 45%,var(--rose) 100%);border-radius:24px 24px 0 0; }

  /* Header */
  .sp-card-header { display:flex;flex-direction:column;align-items:center;text-align:center;margin-bottom:26px; }
  .sp-icon-wrap { width:52px;height:52px;border-radius:16px;background:rgba(67,97,238,.15);border:1px solid rgba(90,123,255,.30);display:flex;align-items:center;justify-content:center;color:var(--indigo-lt);margin-bottom:16px; }
  .sp-title   { font-family:var(--ff-display);font-size:26px;font-weight:700;color:var(--white);margin:0 0 6px;letter-spacing:-.02em; }
  .sp-subtitle{ font-size:14px;font-weight:300;color:var(--gray-400);margin:0; }

  .sp-alert-wrap { margin-bottom:16px; }

  /* Form */
  .sp-form { display:flex;flex-direction:column;gap:14px; }

  /* Field */
  .sp-field { display:flex;flex-direction:column;gap:7px; }
  .sp-label  { font-size:12px;font-weight:500;color:var(--gray-200);letter-spacing:.05em;text-transform:uppercase; }
  .sp-input-wrap { position:relative;display:flex;align-items:center;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:12px;transition:border-color .2s,background .2s,box-shadow .2s; }
  .sp-field-focused .sp-input-wrap { border-color:rgba(90,123,255,.60);background:rgba(255,255,255,.08);box-shadow:0 0 0 3px rgba(67,97,238,.15); }
  .sp-input-icon { position:absolute;left:14px;color:var(--gray-600);pointer-events:none;transition:color .2s; }
  .sp-field-focused .sp-input-icon { color:var(--indigo-lt); }
  .sp-input { flex:1;background:transparent;border:none;outline:none;padding:12px 38px 12px 40px;font-family:var(--ff-body);font-size:14px;font-weight:400;color:var(--white);caret-color:var(--indigo-lt);width:100%; }
  .sp-input::placeholder { color:var(--gray-600); }
  .sp-input-error { color:#ff8aa0 !important; }
  .sp-eye { position:absolute;right:11px;background:none;border:none;color:var(--gray-600);cursor:pointer;display:flex;align-items:center;justify-content:center;padding:4px;border-radius:6px;transition:color .15s,background .15s; }
  .sp-eye:hover { color:var(--gray-200);background:rgba(255,255,255,.08); }

  /* Strength */
  .sp-strength { display:flex;align-items:center;gap:8px;margin-top:-4px; }
  .sp-strength-bars { display:flex;gap:4px;flex:1; }
  .sp-strength-seg  { flex:1;height:3px;border-radius:100px;transition:background .3s; }
  .sp-strength-label{ font-size:11px;font-weight:500;min-width:48px;text-align:right;transition:color .3s; }

  /* Role selector */
  .sp-roles { display:flex;flex-direction:column;gap:8px; }
  .sp-role-btn {
    display:flex;align-items:center;gap:12px;
    background:rgba(255,255,255,.04);
    border:1px solid var(--border);
    border-radius:12px;
    padding:11px 14px;
    cursor:pointer;
    transition:background .15s,border-color .15s,box-shadow .15s;
    text-align:left;
    width:100%;
  }
  .sp-role-btn:hover { background:var(--surface2);border-color:var(--border2); }
  .sp-role-active {
    background:rgba(67,97,238,.12) !important;
    border-color:rgba(90,123,255,.50) !important;
    box-shadow:0 0 0 3px rgba(67,97,238,.10);
  }
  .sp-role-icon { width:32px;height:32px;border-radius:9px;background:var(--surface2);border:1px solid var(--border);display:flex;align-items:center;justify-content:center;color:var(--gray-400);flex-shrink:0;transition:background .15s,color .15s; }
  .sp-role-active .sp-role-icon { background:rgba(67,97,238,.20);border-color:rgba(90,123,255,.40);color:var(--indigo-lt); }
  .sp-role-text { flex:1;display:flex;flex-direction:column;gap:2px; }
  .sp-role-name { font-size:13.5px;font-weight:500;color:var(--gray-100); }
  .sp-role-desc { font-size:11.5px;color:var(--gray-600); }
  .sp-role-check { width:18px;height:18px;border-radius:50%;border:1.5px solid var(--border2);display:flex;align-items:center;justify-content:center;flex-shrink:0;transition:border-color .15s; }
  .sp-role-active .sp-role-check { border-color:var(--indigo-lt); }
  .sp-role-dot { width:8px;height:8px;border-radius:50%;background:var(--indigo-lt); }

  /* Submit */
  .sp-submit { margin-top:6px;width:100%;display:flex;align-items:center;justify-content:center;gap:8px;padding:14px 24px;background:linear-gradient(135deg,var(--indigo) 0%,#7b2ff7 100%);border:none;border-radius:12px;color:var(--white);font-family:var(--ff-body);font-size:15px;font-weight:600;cursor:pointer;box-shadow:0 4px 18px rgba(67,97,238,.42);transition:opacity .15s,transform .15s,box-shadow .2s;position:relative;overflow:hidden; }
  .sp-submit::before { content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.12) 0%,transparent 100%);opacity:0;transition:opacity .2s; }
  .sp-submit:hover:not(:disabled)::before { opacity:1; }
  .sp-submit:hover:not(:disabled) { transform:translateY(-1px);box-shadow:0 6px 24px rgba(67,97,238,.56); }
  .sp-submit:active:not(:disabled) { transform:scale(.98); }
  .sp-submit:disabled { opacity:.55;cursor:not-allowed; }
  .sp-submit-loading { pointer-events:none; }
  .sp-spinner { width:16px;height:16px;border:2px solid rgba(255,255,255,.30);border-top-color:var(--white);border-radius:50%;animation:sp-spin .7s linear infinite;flex-shrink:0; }

  /* Divider */
  .sp-divider { display:flex;align-items:center;gap:12px;margin:22px 0 0; }
  .sp-div-line { flex:1;height:1px;background:var(--border); }
  .sp-div-text { font-size:12px;color:var(--gray-600);white-space:nowrap;letter-spacing:.04em; }

  /* Login link */
  .sp-login-btn { display:block;width:100%;margin-top:12px;padding:13px 24px;background:transparent;border:1px solid var(--border2);border-radius:12px;color:var(--gray-200);font-family:var(--ff-body);font-size:14.5px;font-weight:500;text-align:center;text-decoration:none;transition:background .15s,border-color .15s,color .15s; }
  .sp-login-btn:hover { background:var(--surface2);border-color:rgba(90,123,255,.45);color:var(--white); }

  /* Footer */
  .sp-footer { font-size:12px;color:var(--gray-600);text-align:center;margin:0;line-height:1.7; }
  .sp-footer-link { color:var(--gray-400);text-decoration:none;border-bottom:1px solid rgba(136,153,187,.35);transition:color .15s,border-color .15s; }
  .sp-footer-link:hover { color:var(--indigo-lt);border-color:var(--indigo-lt); }

  @media (max-width:480px) {
    .sp-card { padding:26px 18px 22px;border-radius:20px; }
    .sp-roles { flex-direction:column; }
  }
`