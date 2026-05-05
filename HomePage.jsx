import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useEventStore } from '@/store/eventStore'
import { useAuthStore } from '@/store/authStore'
import { EventCard, Alert } from '@/components'
import { Search, Plus, Sparkles, ArrowRight, Calendar, MapPin, Users } from 'lucide-react'

/* ─── Skeleton Card ────────────────────────────────────────────────── */
function SkeletonCard() {
  return (
    <div className="ehub-card ehub-skeleton-card">
      <div className="ehub-skeleton ehub-skel-img" />
      <div className="ehub-card-body">
        <div className="ehub-skeleton ehub-skel-tag" />
        <div className="ehub-skeleton ehub-skel-title" />
        <div className="ehub-skeleton ehub-skel-title ehub-skel-short" />
        <div className="ehub-skeleton ehub-skel-line" />
        <div className="ehub-skeleton ehub-skel-line ehub-skel-line-short" />
      </div>
    </div>
  )
}

/* ─── Stat Badge ────────────────────────────────────────────────────── */
function StatBadge({ icon: Icon, label, value }) {
  return (
    <div className="ehub-stat-badge">
      <Icon size={16} strokeWidth={1.8} />
      <span className="ehub-stat-value">{value}</span>
      <span className="ehub-stat-label">{label}</span>
    </div>
  )
}

/* ─── HomePage ──────────────────────────────────────────────────────── */
export function HomePage() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { events, fetchEvents, isLoading, error } = useEventStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredEvents, setFilteredEvents] = useState([])
  const [mounted, setMounted] = useState(false)
  const inputRef = useRef(null)

  useEffect(() => {
    fetchEvents()
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const q = searchQuery.trim().toLowerCase()
    setFilteredEvents(
      q
        ? events.filter(
            (e) =>
              e.title.toLowerCase().includes(q) ||
              e.category.toLowerCase().includes(q)
          )
        : events
    )
  }, [events, searchQuery])

  const isEmpty = !isLoading && filteredEvents.length === 0

  return (
    <>
      {/* ── Inject styles ── */}
      <style>{CSS}</style>

      <div className={`ehub-root ${mounted ? 'ehub-mounted' : ''}`}>

        {/* ══ Hero ══════════════════════════════════════════════════════ */}
        <section className="ehub-hero">
          {/* Decorative orbs */}
          <div className="ehub-orb ehub-orb-1" aria-hidden />
          <div className="ehub-orb ehub-orb-2" aria-hidden />
          <div className="ehub-orb ehub-orb-3" aria-hidden />

          <div className="ehub-hero-inner">
            {/* Label */}
            <div className="ehub-pill ehub-hero-pill ehub-anim-1">
              <Sparkles size={13} strokeWidth={2} />
              <span>Discover · Connect · Experience</span>
            </div>

            {/* Headline */}
            <h1 className="ehub-headline ehub-anim-2">
              Find Your Next
              <span className="ehub-headline-accent"> Unforgettable</span>
              <br />Event
            </h1>

            <p className="ehub-subline ehub-anim-3">
              Curated events crafted for curious minds — from exclusive
              workshops to grand showcases.
            </p>

            {/* Stats row */}
            <div className="ehub-stats ehub-anim-4">
              <StatBadge icon={Calendar} label="Events live" value="2,400+" />
              <div className="ehub-stats-div" />
              <StatBadge icon={Users} label="Attendees" value="180k+" />
              <div className="ehub-stats-div" />
              <StatBadge icon={MapPin} label="Cities" value="60+" />
            </div>

            {/* Search */}
            <div className="ehub-search-wrap ehub-anim-5">
              <div className="ehub-search-box">
                <Search className="ehub-search-icon" size={18} strokeWidth={2} />
                <input
                  ref={inputRef}
                  type="text"
                  className="ehub-search-input"
                  placeholder="Search by name or category…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  aria-label="Search events"
                />
                {searchQuery && (
                  <button
                    className="ehub-search-clear"
                    onClick={() => { setSearchQuery(''); inputRef.current?.focus() }}
                    aria-label="Clear search"
                  >
                    ×
                  </button>
                )}
              </div>
              {user?.role === 'ROLE_ADMIN' && (
                <button
                  className="ehub-btn-create"
                  onClick={() => navigate('/create-event')}
                >
                  <Plus size={16} strokeWidth={2.5} />
                  <span>Create</span>
                </button>
              )}
            </div>
          </div>
        </section>

        {/* ══ Main content ══════════════════════════════════════════════ */}
        <main className="ehub-main">

          {error && (
            <div className="ehub-alert-wrap">
              <Alert type="error" message={error} />
            </div>
          )}

          {/* Section header */}
          <div className="ehub-section-header">
            <div>
              <h2 className="ehub-section-title">
                {searchQuery ? 'Search results' : 'Featured events'}
              </h2>
              {!isLoading && (
                <p className="ehub-section-count">
                  {filteredEvents.length}{' '}
                  {filteredEvents.length === 1 ? 'event' : 'events'} found
                </p>
              )}
            </div>
            {!searchQuery && (
              <button className="ehub-btn-ghost" onClick={() => navigate('/events')}>
                View all <ArrowRight size={14} strokeWidth={2} />
              </button>
            )}
          </div>

          {/* Grid */}
          {isLoading ? (
            <div className="ehub-grid">
              {Array.from({ length: 6 }, (_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : isEmpty ? (
            <div className="ehub-empty">
              <div className="ehub-empty-icon" aria-hidden>🔍</div>
              <p className="ehub-empty-title">
                {searchQuery ? 'No results for that search' : 'No events yet'}
              </p>
              <p className="ehub-empty-sub">
                {searchQuery
                  ? 'Try different keywords or browse all events.'
                  : 'Check back soon — new events are added daily.'}
              </p>
              {searchQuery && (
                <button
                  className="ehub-btn-outline"
                  onClick={() => setSearchQuery('')}
                >
                  Clear search
                </button>
              )}
            </div>
          ) : (
            <div className="ehub-grid">
              {filteredEvents.map((event, i) => (
                <div
                  key={event.id}
                  className="ehub-card-wrap"
                  style={{ animationDelay: `${Math.min(i * 60, 400)}ms` }}
                >
                  <EventCard
                    event={event}
                    onClick={() => navigate(`/events/${event.id}`)}
                    onRegister={() => navigate(`/events/${event.id}`)}
                  />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  )
}

/* ════════════════════════════════════════════════════════════════════
   Styles
   ════════════════════════════════════════════════════════════════════ */
const CSS = `
  /* ── Fonts ── */
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  /* ── Tokens ── */
  :root {
    --navy-950: #050c1a;
    --navy-900: #0a1628;
    --navy-800: #0f2040;
    --navy-700: #162d58;
    --navy-600: #1f3f78;
    --indigo:   #4361ee;
    --indigo-lt:#5a7bff;
    --gold:     #f5c842;
    --gold-dim: #c9a22a;
    --rose:     #e84b6a;
    --teal:     #0abf8e;
    --white:    #ffffff;
    --gray-100: #e8edf8;
    --gray-200: #c4cde0;
    --gray-400: #8899bb;
    --gray-600: #4a5880;
    --surface:  rgba(255,255,255,0.04);
    --surface2: rgba(255,255,255,0.08);
    --border:   rgba(255,255,255,0.10);
    --border2:  rgba(255,255,255,0.18);
    --blur-sm:  blur(12px);
    --blur-md:  blur(24px);
    --radius-sm:10px;
    --radius-md:16px;
    --radius-lg:22px;
    --radius-xl:32px;
    --ff-display:'Playfair Display', Georgia, serif;
    --ff-body:   'DM Sans', system-ui, sans-serif;
    --shadow-card: 0 4px 24px rgba(0,0,0,0.30), 0 1px 4px rgba(0,0,0,0.20);
    --shadow-glow: 0 0 40px rgba(67,97,238,0.25);
  }

  /* ── Base ── */
  .ehub-root {
    font-family: var(--ff-body);
    background: var(--navy-950);
    color: var(--gray-100);
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* ── Animations ── */
  @keyframes ehub-fade-up {
    from { opacity:0; transform:translateY(24px); }
    to   { opacity:1; transform:translateY(0);    }
  }
  @keyframes ehub-pulse-slow {
    0%,100% { opacity:0.55; transform:scale(1);    }
    50%      { opacity:0.80; transform:scale(1.08); }
  }
  @keyframes ehub-shimmer {
    from { background-position: -200% 0; }
    to   { background-position:  200% 0; }
  }
  @keyframes ehub-card-in {
    from { opacity:0; transform:translateY(18px) scale(0.98); }
    to   { opacity:1; transform:translateY(0)     scale(1);   }
  }

  .ehub-root .ehub-anim-1 { opacity:0; }
  .ehub-root .ehub-anim-2 { opacity:0; }
  .ehub-root .ehub-anim-3 { opacity:0; }
  .ehub-root .ehub-anim-4 { opacity:0; }
  .ehub-root .ehub-anim-5 { opacity:0; }

  .ehub-mounted .ehub-anim-1 { animation: ehub-fade-up 0.55s ease forwards 0.05s; }
  .ehub-mounted .ehub-anim-2 { animation: ehub-fade-up 0.60s ease forwards 0.15s; }
  .ehub-mounted .ehub-anim-3 { animation: ehub-fade-up 0.55s ease forwards 0.28s; }
  .ehub-mounted .ehub-anim-4 { animation: ehub-fade-up 0.55s ease forwards 0.38s; }
  .ehub-mounted .ehub-anim-5 { animation: ehub-fade-up 0.55s ease forwards 0.48s; }

  .ehub-card-wrap {
    opacity: 0;
    animation: ehub-card-in 0.45s ease forwards;
  }

  /* ══ HERO ═════════════════════════════════════════════════════════ */
  .ehub-hero {
    position: relative;
    min-height: 580px;
    display: flex;
    align-items: center;
    overflow: hidden;
    background:
      radial-gradient(ellipse 80% 60% at 20% 0%,   rgba(67,97,238,0.30) 0%, transparent 70%),
      radial-gradient(ellipse 60% 50% at 80% 100%,  rgba(232,75,106,0.18) 0%, transparent 65%),
      linear-gradient(165deg, var(--navy-900) 0%, var(--navy-950) 100%);
    border-bottom: 1px solid var(--border);
    padding: 72px 0 80px;
  }

  /* Decorative orbs */
  .ehub-orb {
    position: absolute;
    border-radius: 50%;
    pointer-events: none;
    animation: ehub-pulse-slow 8s ease-in-out infinite;
  }
  .ehub-orb-1 {
    width: 480px; height: 480px;
    top: -180px; left: -100px;
    background: radial-gradient(circle, rgba(67,97,238,0.22) 0%, transparent 70%);
    animation-delay: 0s;
  }
  .ehub-orb-2 {
    width: 360px; height: 360px;
    bottom: -120px; right: -80px;
    background: radial-gradient(circle, rgba(232,75,106,0.18) 0%, transparent 70%);
    animation-delay: -4s;
  }
  .ehub-orb-3 {
    width: 200px; height: 200px;
    top: 50%; left: 60%;
    background: radial-gradient(circle, rgba(245,200,66,0.10) 0%, transparent 70%);
    animation-delay: -2s;
  }

  .ehub-hero-inner {
    position: relative;
    z-index: 2;
    width: 100%;
    max-width: 900px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  /* ── Pill ── */
  .ehub-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-size: 11.5px;
    font-weight: 500;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--gold);
    background: rgba(245,200,66,0.10);
    border: 1px solid rgba(245,200,66,0.28);
    border-radius: 100px;
    padding: 6px 14px;
    margin-bottom: 24px;
  }
  .ehub-hero-pill svg { color: var(--gold); }

  /* ── Headline ── */
  .ehub-headline {
    font-family: var(--ff-display);
    font-size: clamp(40px, 6vw, 72px);
    font-weight: 800;
    line-height: 1.08;
    color: var(--white);
    margin: 0 0 18px;
    letter-spacing: -0.02em;
  }
  .ehub-headline-accent {
    background: linear-gradient(110deg, var(--indigo-lt) 20%, var(--rose) 80%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* ── Subline ── */
  .ehub-subline {
    font-size: 17px;
    font-weight: 300;
    color: var(--gray-400);
    max-width: 520px;
    line-height: 1.65;
    margin: 0 0 32px;
  }

  /* ── Stats ── */
  .ehub-stats {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 36px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .ehub-stats-div {
    width: 1px;
    height: 28px;
    background: var(--border2);
  }
  .ehub-stat-badge {
    display: flex;
    align-items: center;
    gap: 7px;
    font-size: 13.5px;
    color: var(--gray-200);
  }
  .ehub-stat-badge svg { color: var(--indigo-lt); flex-shrink: 0; }
  .ehub-stat-value { font-weight: 600; color: var(--white); }
  .ehub-stat-label { color: var(--gray-400); }

  /* ── Search ── */
  .ehub-search-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
    width: 100%;
    max-width: 640px;
  }
  .ehub-search-box {
    flex: 1;
    position: relative;
    display: flex;
    align-items: center;
    background: rgba(255,255,255,0.07);
    backdrop-filter: var(--blur-sm);
    -webkit-backdrop-filter: var(--blur-sm);
    border: 1px solid var(--border2);
    border-radius: var(--radius-xl);
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .ehub-search-box:focus-within {
    border-color: rgba(90,123,255,0.60);
    background: rgba(255,255,255,0.10);
    box-shadow: 0 0 0 3px rgba(67,97,238,0.18), var(--shadow-glow);
  }
  .ehub-search-icon {
    position: absolute;
    left: 16px;
    color: var(--gray-400);
    pointer-events: none;
    flex-shrink: 0;
  }
  .ehub-search-input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    padding: 14px 44px 14px 46px;
    font-family: var(--ff-body);
    font-size: 15px;
    font-weight: 400;
    color: var(--white);
    caret-color: var(--indigo-lt);
  }
  .ehub-search-input::placeholder { color: var(--gray-600); }
  .ehub-search-clear {
    position: absolute;
    right: 12px;
    background: var(--surface2);
    border: none;
    border-radius: 50%;
    width: 24px; height: 24px;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px;
    color: var(--gray-400);
    cursor: pointer;
    transition: color 0.15s, background 0.15s;
  }
  .ehub-search-clear:hover { color: var(--white); background: rgba(255,255,255,0.14); }

  /* ── Create button ── */
  .ehub-btn-create {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 14px 22px;
    background: linear-gradient(135deg, var(--indigo) 0%, #7b2ff7 100%);
    border: none;
    border-radius: var(--radius-xl);
    color: var(--white);
    font-family: var(--ff-body);
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    white-space: nowrap;
    box-shadow: 0 4px 16px rgba(67,97,238,0.40);
    transition: opacity 0.15s, transform 0.15s, box-shadow 0.2s;
  }
  .ehub-btn-create:hover {
    opacity: 0.9;
    transform: translateY(-1px);
    box-shadow: 0 6px 22px rgba(67,97,238,0.55);
  }
  .ehub-btn-create:active { transform: scale(0.97); }

  /* ══ MAIN ═════════════════════════════════════════════════════════ */
  .ehub-main {
    max-width: 1240px;
    margin: 0 auto;
    padding: 56px 24px 80px;
  }

  .ehub-alert-wrap { margin-bottom: 28px; }

  /* ── Section header ── */
  .ehub-section-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 32px;
    gap: 16px;
    flex-wrap: wrap;
  }
  .ehub-section-title {
    font-family: var(--ff-display);
    font-size: clamp(22px, 3vw, 32px);
    font-weight: 700;
    color: var(--white);
    margin: 0 0 4px;
    letter-spacing: -0.015em;
  }
  .ehub-section-count {
    font-size: 13px;
    color: var(--gray-600);
    margin: 0;
  }
  .ehub-btn-ghost {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--ff-body);
    font-size: 13.5px;
    font-weight: 500;
    color: var(--indigo-lt);
    background: transparent;
    border: 1px solid rgba(90,123,255,0.30);
    border-radius: 100px;
    padding: 8px 16px;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s, color 0.15s;
    white-space: nowrap;
  }
  .ehub-btn-ghost:hover {
    background: rgba(90,123,255,0.10);
    border-color: rgba(90,123,255,0.55);
    color: var(--white);
  }

  /* ── Grid ── */
  .ehub-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 22px;
  }

  /* ── Skeleton ── */
  .ehub-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: var(--radius-lg);
    overflow: hidden;
  }
  .ehub-skeleton-card { }
  .ehub-skeleton {
    background: linear-gradient(90deg,
      rgba(255,255,255,0.04) 25%,
      rgba(255,255,255,0.10) 50%,
      rgba(255,255,255,0.04) 75%
    );
    background-size: 200% 100%;
    animation: ehub-shimmer 1.6s ease-in-out infinite;
    border-radius: var(--radius-sm);
  }
  .ehub-skel-img   { height: 200px; border-radius: 0; }
  .ehub-card-body  { padding: 18px 20px; display: flex; flex-direction: column; gap: 12px; }
  .ehub-skel-tag   { height: 20px; width: 72px; border-radius: 100px; }
  .ehub-skel-title { height: 20px; width: 90%; }
  .ehub-skel-short { width: 55%; }
  .ehub-skel-line  { height: 14px; }
  .ehub-skel-line-short { width: 70%; }

  /* ── Empty state ── */
  .ehub-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 80px 24px;
    gap: 12px;
  }
  .ehub-empty-icon { font-size: 48px; margin-bottom: 8px; }
  .ehub-empty-title {
    font-family: var(--ff-display);
    font-size: 22px;
    font-weight: 700;
    color: var(--gray-200);
    margin: 0;
  }
  .ehub-empty-sub {
    font-size: 15px;
    color: var(--gray-600);
    margin: 0 0 16px;
    max-width: 360px;
    line-height: 1.6;
  }
  .ehub-btn-outline {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    font-family: var(--ff-body);
    font-size: 14px;
    font-weight: 500;
    color: var(--indigo-lt);
    background: transparent;
    border: 1px solid rgba(90,123,255,0.40);
    border-radius: 100px;
    padding: 10px 22px;
    cursor: pointer;
    transition: background 0.15s, border-color 0.15s;
  }
  .ehub-btn-outline:hover {
    background: rgba(90,123,255,0.10);
    border-color: rgba(90,123,255,0.65);
  }

  /* ── Responsive ── */
  @media (max-width: 640px) {
    .ehub-hero { padding: 52px 0 60px; }
    .ehub-stats-div { display: none; }
    .ehub-stats { gap: 12px; }
    .ehub-search-wrap { flex-direction: column; align-items: stretch; }
    .ehub-btn-create { justify-content: center; border-radius: var(--radius-xl); }
    .ehub-grid { grid-template-columns: 1fr; }
    .ehub-section-header { flex-direction: column; align-items: flex-start; }
  }
`