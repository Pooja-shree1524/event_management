import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useEventStore } from '@/store/eventStore'
import { useRegistrationStore } from '@/store/registrationStore'
import { useAuthStore } from '@/store/authStore'
import { Alert } from '@/components'
import { Calendar, MapPin, Users2, ArrowLeft, CheckCircle2, Sparkles, Clock } from 'lucide-react'
import { format } from 'date-fns'

/* ── Loading skeleton ─────────────────────────────────────────────── */
function DetailSkeleton() {
  return (
    <div className="edp-root">
      <style>{CSS}</style>
      <div className="edp-inner">
        <div className="edp-skeleton edp-skel-back" />
        <div className="edp-skeleton edp-skel-hero" />
        <div className="edp-body">
          <div className="edp-skeleton edp-skel-line edp-skel-lg" />
          <div className="edp-skeleton edp-skel-line" style={{ width: '60%' }} />
          <div className="edp-skeleton edp-skel-line" style={{ width: '45%', marginTop: 24 }} />
        </div>
      </div>
    </div>
  )
}

/* ── Meta info row ────────────────────────────────────────────────── */
function MetaItem({ icon: Icon, label, value, accent }) {
  return (
    <div className="edp-meta-item">
      <div className={`edp-meta-icon ${accent ? 'edp-meta-icon-accent' : ''}`}>
        <Icon size={15} strokeWidth={2} />
      </div>
      <div>
        <p className="edp-meta-label">{label}</p>
        <p className="edp-meta-value">{value}</p>
      </div>
    </div>
  )
}

/* ── Main page ────────────────────────────────────────────────────── */
export function EventDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { selectedEvent, fetchEventById, isLoading } = useEventStore()
  const { registerEvent, registrations, fetchUserRegistrations } = useRegistrationStore()
  const [isRegistered, setIsRegistered] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState('')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    fetchEventById(id)
    if (user?.id) fetchUserRegistrations(user.id)
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [id, user?.id])

  useEffect(() => {
    if (selectedEvent && registrations.length > 0) {
      const registered = registrations.some(
        r => r.event?.id === selectedEvent.id && r.status !== 'REJECTED'
      )
      setIsRegistered(registered)
    }
  }, [selectedEvent, registrations])

  const handleRegister = async () => {
    if (!user?.id) { navigate('/login'); return }
    setIsSubmitting(true)
    try {
      await registerEvent(user.id, selectedEvent.id)
      setIsRegistered(true)
      setMessage('Successfully registered for this event!')
    } catch (error) {
      setMessage(error.response?.data?.message || 'Failed to register. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <DetailSkeleton />

  if (!selectedEvent) {
    return (
      <>
        <style>{CSS}</style>
        <div className="edp-root edp-not-found">
          <div className="edp-nf-icon">🔍</div>
          <h2 className="edp-nf-title">Event not found</h2>
          <p className="edp-nf-sub">This event may have been removed or the link is incorrect.</p>
          <button className="edp-btn-back-pill" onClick={() => navigate('/')}>
            <ArrowLeft size={14} strokeWidth={2.5} /> Back to Events
          </button>
        </div>
      </>
    )
  }

  const eventDate    = new Date(selectedEvent.dateTime)
  const formattedDate = format(eventDate, 'MMMM dd, yyyy')
  const formattedTime = format(eventDate, 'h:mm a')
  const isPast        = eventDate < new Date()

  return (
    <>
      <style>{CSS}</style>
      <div className={`edp-root ${mounted ? 'edp-mounted' : ''}`}>
        {/* Orbs */}
        <div className="edp-orb edp-orb-1" aria-hidden />
        <div className="edp-orb edp-orb-2" aria-hidden />
        <div className="edp-grid-bg"    aria-hidden />

        <div className="edp-inner">

          {/* Back button */}
          <button className="edp-back edp-anim-1" onClick={() => navigate('/')}>
            <ArrowLeft size={15} strokeWidth={2.5} />
            <span>Back to Events</span>
          </button>

          {/* Alert */}
          {message && (
            <div className="edp-alert-wrap edp-anim-1">
              <Alert
                type={message.includes('Successfully') ? 'success' : 'error'}
                message={message}
                onClose={() => setMessage('')}
              />
            </div>
          )}

          {/* Hero banner */}
          <div className="edp-hero edp-anim-2">
            <div className="edp-hero-bg" aria-hidden />
            <div className="edp-hero-content">
              <div className="edp-category-pill">
                <Sparkles size={11} strokeWidth={2.5} />
                <span>{selectedEvent.category}</span>
              </div>
              <h1 className="edp-event-title">{selectedEvent.title}</h1>
              {isPast && <span className="edp-past-badge">Past Event</span>}
            </div>
          </div>

          {/* Main card */}
          <div className="edp-card edp-anim-3">

            {/* Top: meta + register */}
            <div className="edp-card-top">

              {/* Meta info */}
              <div className="edp-meta-grid">
                <MetaItem icon={Calendar} label="Date"  value={formattedDate} accent />
                <MetaItem icon={Clock}    label="Time"  value={formattedTime} />
                <MetaItem icon={MapPin}   label="Venue" value={selectedEvent.venue} />
                {selectedEvent.organizerDetails && (
                  <MetaItem icon={Users2} label="Organizer" value={selectedEvent.organizerDetails} />
                )}
              </div>

              {/* Register panel */}
              <div className="edp-register-panel">
                {isRegistered ? (
                  <div className="edp-registered">
                    <div className="edp-reg-icon-wrap">
                      <CheckCircle2 size={28} strokeWidth={1.8} />
                    </div>
                    <p className="edp-reg-title">You're registered!</p>
                    <p className="edp-reg-sub">See you at the event. Check your email for details.</p>
                  </div>
                ) : isPast ? (
                  <div className="edp-past-panel">
                    <p className="edp-past-text">Registration closed</p>
                    <p className="edp-past-sub">This event has already taken place.</p>
                  </div>
                ) : (
                  <div className="edp-reg-cta">
                    <p className="edp-reg-cta-label">Ready to join?</p>
                    <p className="edp-reg-cta-sub">Secure your spot before it fills up.</p>
                    <button
                      className={`edp-btn-register ${isSubmitting ? 'edp-btn-loading' : ''}`}
                      onClick={handleRegister}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <><span className="edp-spinner" aria-hidden /><span>Registering…</span></>
                      ) : (
                        <span>Register Now</span>
                      )}
                    </button>
                    {!user?.id && (
                      <p className="edp-login-note">
                        You'll be asked to sign in first
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="edp-divider" />

            {/* About */}
            <div className="edp-content-section edp-anim-4">
              <h2 className="edp-section-title">About this event</h2>
              <p className="edp-section-body">{selectedEvent.description}</p>
            </div>

            {/* Rules */}
            {selectedEvent.rules && (
              <>
                <div className="edp-divider" />
                <div className="edp-content-section edp-anim-4">
                  <h2 className="edp-section-title">Rules & guidelines</h2>
                  <p className="edp-section-body">{selectedEvent.rules}</p>
                </div>
              </>
            )}

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
    --navy-950: #050c1a;
    --navy-900: #0a1628;
    --navy-800: #0f2040;
    --indigo:   #4361ee;
    --indigo-lt:#5a7bff;
    --gold:     #f5c842;
    --rose:     #e84b6a;
    --teal:     #0abf8e;
    --white:    #ffffff;
    --gray-100: #e8edf8;
    --gray-200: #c4cde0;
    --gray-400: #8899bb;
    --gray-600: #4a5880;
    --border:   rgba(255,255,255,0.10);
    --border2:  rgba(255,255,255,0.16);
    --surface:  rgba(255,255,255,0.04);
    --surface2: rgba(255,255,255,0.08);
    --ff-display:'Playfair Display', Georgia, serif;
    --ff-body:   'DM Sans', system-ui, sans-serif;
  }

  @keyframes edp-fade-up {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes edp-pulse {
    0%,100% { opacity:0.55; transform:scale(1); }
    50%      { opacity:0.78; transform:scale(1.07); }
  }
  @keyframes edp-spin {
    to { transform:rotate(360deg); }
  }
  @keyframes edp-shimmer {
    from { background-position:-200% 0; }
    to   { background-position: 200% 0; }
  }
  @keyframes edp-pop-in {
    from { opacity:0; transform:scale(0.90); }
    to   { opacity:1; transform:scale(1); }
  }

  /* ── Root ── */
  .edp-root {
    font-family: var(--ff-body);
    min-height: 100vh;
    background:
      radial-gradient(ellipse 80% 50% at 15% 0%,  rgba(67,97,238,0.24) 0%, transparent 65%),
      radial-gradient(ellipse 55% 45% at 85% 100%, rgba(232,75,106,0.15) 0%, transparent 65%),
      linear-gradient(165deg, var(--navy-900) 0%, var(--navy-950) 100%);
    color: var(--gray-100);
    position: relative;
    overflow-x: hidden;
  }

  /* Orbs */
  .edp-orb {
    position: fixed;
    border-radius: 50%;
    pointer-events: none;
    animation: edp-pulse 9s ease-in-out infinite;
  }
  .edp-orb-1 {
    width: 500px; height: 500px;
    top: -180px; left: -120px;
    background: radial-gradient(circle, rgba(67,97,238,0.18) 0%, transparent 70%);
  }
  .edp-orb-2 {
    width: 380px; height: 380px;
    bottom: -120px; right: -80px;
    background: radial-gradient(circle, rgba(232,75,106,0.14) 0%, transparent 70%);
    animation-delay: -4.5s;
  }
  .edp-grid-bg {
    position: fixed;
    inset: 0;
    background-image:
      linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px),
      linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px);
    background-size: 48px 48px;
    pointer-events: none;
  }

  /* ── Inner ── */
  .edp-inner {
    position: relative;
    z-index: 2;
    max-width: 920px;
    margin: 0 auto;
    padding: 40px 24px 80px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  /* Animations */
  .edp-root .edp-anim-1,
  .edp-root .edp-anim-2,
  .edp-root .edp-anim-3,
  .edp-root .edp-anim-4 { opacity: 0; }
  .edp-mounted .edp-anim-1 { animation: edp-fade-up 0.45s ease forwards 0.05s; }
  .edp-mounted .edp-anim-2 { animation: edp-fade-up 0.50s ease forwards 0.15s; }
  .edp-mounted .edp-anim-3 { animation: edp-fade-up 0.50s ease forwards 0.28s; }
  .edp-mounted .edp-anim-4 { animation: edp-fade-up 0.45s ease forwards 0.38s; }

  /* ── Back button ── */
  .edp-back {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    background: var(--surface);
    border: 1px solid var(--border2);
    border-radius: 100px;
    padding: 9px 18px;
    font-family: var(--ff-body);
    font-size: 13.5px;
    font-weight: 500;
    color: var(--gray-200);
    cursor: pointer;
    width: fit-content;
    transition: background 0.15s, border-color 0.15s, color 0.15s, transform 0.15s;
  }
  .edp-back:hover {
    background: var(--surface2);
    border-color: rgba(90,123,255,0.40);
    color: var(--white);
    transform: translateX(-2px);
  }

  /* Alert */
  .edp-alert-wrap { }

  /* ── Hero banner ── */
  .edp-hero {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    min-height: 240px;
    display: flex;
    align-items: flex-end;
    padding: 36px;
    border: 1px solid var(--border2);
  }
  .edp-hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse 80% 100% at 20% 0%, rgba(67,97,238,0.55) 0%, transparent 65%),
      radial-gradient(ellipse 60% 80% at 90% 100%, rgba(123,47,247,0.45) 0%, transparent 60%),
      linear-gradient(140deg, #0f1e4a 0%, #1a0b35 100%);
  }
  .edp-hero-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .edp-category-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(245,200,66,0.14);
    border: 1px solid rgba(245,200,66,0.34);
    border-radius: 100px;
    padding: 5px 14px;
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.07em;
    text-transform: uppercase;
    color: var(--gold);
    width: fit-content;
  }
  .edp-event-title {
    font-family: var(--ff-display);
    font-size: clamp(26px, 4.5vw, 46px);
    font-weight: 800;
    color: var(--white);
    margin: 0;
    letter-spacing: -0.02em;
    line-height: 1.1;
    max-width: 680px;
  }
  .edp-past-badge {
    display: inline-flex;
    align-items: center;
    background: rgba(232,75,106,0.18);
    border: 1px solid rgba(232,75,106,0.38);
    border-radius: 100px;
    padding: 4px 14px;
    font-size: 11.5px;
    font-weight: 500;
    color: #ff8aa0;
    width: fit-content;
    letter-spacing: 0.04em;
  }

  /* ── Main card ── */
  .edp-card {
    background: rgba(15,32,64,0.65);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid var(--border2);
    border-radius: 22px;
    overflow: hidden;
    box-shadow:
      0 8px 40px rgba(0,0,0,0.45),
      0 1px 0 rgba(255,255,255,0.07) inset;
  }

  /* Card top: meta + register */
  .edp-card-top {
    display: grid;
    grid-template-columns: 1fr 300px;
    gap: 0;
  }

  /* Meta grid */
  .edp-meta-grid {
    display: flex;
    flex-direction: column;
    gap: 0;
    padding: 32px 32px;
    border-right: 1px solid var(--border);
  }
  .edp-meta-item {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 14px 0;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }
  .edp-meta-item:last-child { border-bottom: none; }
  .edp-meta-icon {
    width: 34px; height: 34px;
    border-radius: 10px;
    background: var(--surface2);
    border: 1px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--gray-400);
    flex-shrink: 0;
    margin-top: 2px;
  }
  .edp-meta-icon-accent {
    background: rgba(67,97,238,0.14);
    border-color: rgba(90,123,255,0.30);
    color: var(--indigo-lt);
  }
  .edp-meta-label {
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--gray-600);
    margin: 0 0 4px;
  }
  .edp-meta-value {
    font-size: 15px;
    font-weight: 500;
    color: var(--gray-100);
    margin: 0;
    line-height: 1.4;
  }

  /* Register panel */
  .edp-register-panel {
    padding: 32px 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  /* Registered state */
  .edp-registered {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 10px;
    animation: edp-pop-in 0.40s cubic-bezier(0.34,1.56,0.64,1) forwards;
  }
  .edp-reg-icon-wrap {
    width: 58px; height: 58px;
    border-radius: 50%;
    background: rgba(10,191,142,0.14);
    border: 1px solid rgba(10,191,142,0.35);
    display: flex; align-items: center; justify-content: center;
    color: var(--teal);
    margin-bottom: 4px;
  }
  .edp-reg-title {
    font-family: var(--ff-display);
    font-size: 18px;
    font-weight: 700;
    color: var(--teal);
    margin: 0;
  }
  .edp-reg-sub {
    font-size: 13px;
    color: var(--gray-600);
    margin: 0;
    line-height: 1.55;
  }

  /* Past state */
  .edp-past-panel {
    text-align: center;
  }
  .edp-past-text {
    font-size: 15px;
    font-weight: 600;
    color: var(--gray-400);
    margin: 0 0 6px;
  }
  .edp-past-sub {
    font-size: 13px;
    color: var(--gray-600);
    margin: 0;
  }

  /* CTA state */
  .edp-reg-cta {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 8px;
    width: 100%;
  }
  .edp-reg-cta-label {
    font-family: var(--ff-display);
    font-size: 17px;
    font-weight: 700;
    color: var(--white);
    margin: 0;
  }
  .edp-reg-cta-sub {
    font-size: 13px;
    color: var(--gray-600);
    margin: 0 0 8px;
    line-height: 1.5;
  }
  .edp-btn-register {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 14px 20px;
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
  .edp-btn-register::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 100%);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .edp-btn-register:hover:not(:disabled)::before { opacity: 1; }
  .edp-btn-register:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(67,97,238,0.56);
  }
  .edp-btn-register:active:not(:disabled) { transform: scale(0.98); }
  .edp-btn-register:disabled { opacity: 0.55; cursor: not-allowed; }
  .edp-btn-loading { pointer-events: none; }

  .edp-spinner {
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.30);
    border-top-color: var(--white);
    border-radius: 50%;
    animation: edp-spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  .edp-login-note {
    font-size: 11.5px;
    color: var(--gray-600);
    margin: 4px 0 0;
  }

  /* Divider */
  .edp-divider {
    height: 1px;
    background: var(--border);
    margin: 0;
  }

  /* Content sections */
  .edp-content-section {
    padding: 32px 36px;
  }
  .edp-section-title {
    font-family: var(--ff-display);
    font-size: 22px;
    font-weight: 700;
    color: var(--white);
    margin: 0 0 16px;
    letter-spacing: -0.015em;
  }
  .edp-section-body {
    font-size: 15.5px;
    font-weight: 300;
    color: var(--gray-400);
    line-height: 1.80;
    margin: 0;
    white-space: pre-line;
  }

  /* ── Skeletons ── */
  .edp-skeleton {
    background: linear-gradient(90deg,
      rgba(255,255,255,0.04) 25%,
      rgba(255,255,255,0.09) 50%,
      rgba(255,255,255,0.04) 75%
    );
    background-size: 200% 100%;
    animation: edp-shimmer 1.6s ease-in-out infinite;
    border-radius: 10px;
  }
  .edp-skel-back  { height: 36px; width: 140px; border-radius: 100px; }
  .edp-skel-hero  { height: 240px; border-radius: 20px; }
  .edp-body       { padding: 32px; display: flex; flex-direction: column; gap: 14px; }
  .edp-skel-line  { height: 18px; }
  .edp-skel-lg    { height: 28px; }

  /* ── Not found ── */
  .edp-not-found {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    gap: 12px;
    min-height: 100vh;
    padding: 40px;
  }
  .edp-nf-icon  { font-size: 52px; margin-bottom: 8px; }
  .edp-nf-title {
    font-family: var(--ff-display);
    font-size: 26px; font-weight: 700;
    color: var(--gray-200); margin: 0;
  }
  .edp-nf-sub {
    font-size: 15px; color: var(--gray-600);
    margin: 0 0 16px; max-width: 340px; line-height: 1.6;
  }
  .edp-btn-back-pill {
    display: inline-flex; align-items: center; gap: 7px;
    background: var(--surface2);
    border: 1px solid var(--border2);
    border-radius: 100px;
    padding: 10px 22px;
    font-family: var(--ff-body);
    font-size: 14px; font-weight: 500;
    color: var(--indigo-lt);
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }
  .edp-btn-back-pill:hover {
    background: rgba(90,123,255,0.12);
    border-color: rgba(90,123,255,0.45);
  }

  /* ── Responsive ── */
  @media (max-width: 700px) {
    .edp-card-top {
      grid-template-columns: 1fr;
    }
    .edp-meta-grid {
      border-right: none;
      border-bottom: 1px solid var(--border);
      padding: 24px 22px;
    }
    .edp-register-panel { padding: 24px 22px; }
    .edp-content-section { padding: 24px 22px; }
    .edp-hero { padding: 24px; min-height: 190px; }
    .edp-inner { padding: 24px 16px 60px; }
  }
`