import { useEffect, useState } from 'react'
import { useRegistrationStore } from '@/store/registrationStore'
import { useAuthStore } from '@/store/authStore'
import { Alert } from '@/components'
import { CheckCircle2, Clock, XCircle, Users, TrendingUp, Award, ShieldAlert, Home } from 'lucide-react'
import { format } from 'date-fns'

/* ── Stat card ───────────────────────────────────────────────────── */
function StatCard({ icon: Icon, label, value, accent }) {
  return (
    <div className="adp-stat-card" style={{ '--accent': accent }}>
      <div className="adp-stat-top">
        <div className="adp-stat-icon"><Icon size={16} strokeWidth={1.8} /></div>
        <div className="adp-stat-bar" />
      </div>
      <p className="adp-stat-value">{value}</p>
      <p className="adp-stat-label">{label}</p>
    </div>
  )
}

/* ── Progress row ────────────────────────────────────────────────── */
function ProgressRow({ label, pct, color }) {
  return (
    <div className="adp-prog-row">
      <div className="adp-prog-head">
        <span className="adp-prog-label">{label}</span>
        <span className="adp-prog-pct" style={{ color }}>{pct.toFixed(1)}%</span>
      </div>
      <div className="adp-prog-track">
        <div className="adp-prog-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

/* ── Status badge ────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const map = {
    APPROVED: { label: 'Approved', color: 'var(--teal)',      bg: 'rgba(10,191,142,.14)',   border: 'rgba(10,191,142,.30)'  },
    PENDING:  { label: 'Pending',  color: 'var(--gold)',      bg: 'rgba(245,200,66,.12)',   border: 'rgba(245,200,66,.30)'  },
    REJECTED: { label: 'Rejected', color: 'var(--rose)',      bg: 'rgba(232,75,106,.13)',   border: 'rgba(232,75,106,.30)'  },
  }
  const s = map[status] ?? map.PENDING
  return (
    <span className="adp-badge" style={{ color: s.color, background: s.bg, borderColor: s.border }}>
      {s.label}
    </span>
  )
}

/* ── Donut chart ─────────────────────────────────────────────────── */
function Donut({ pct, color, label }) {
  const r = 52, c = 2 * Math.PI * r
  const dash = isFinite(pct) ? (pct / 100) * c : 0
  return (
    <div className="adp-donut-wrap">
      <svg width="136" height="136" viewBox="0 0 136 136">
        <circle cx="68" cy="68" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
        <circle
          cx="68" cy="68" r={r} fill="none"
          stroke={color} strokeWidth="12"
          strokeDasharray={`${dash} ${c}`}
          strokeLinecap="round"
          transform="rotate(-90 68 68)"
          style={{ transition: 'stroke-dasharray 0.8s ease' }}
        />
      </svg>
      <div className="adp-donut-inner">
        <span className="adp-donut-pct" style={{ color }}>{isFinite(pct) ? pct.toFixed(0) : 0}%</span>
        <span className="adp-donut-lbl">{label}</span>
      </div>
    </div>
  )
}

/* ── Main ────────────────────────────────────────────────────────── */
export function AdminDashboardPage() {
  const { user } = useAuthStore()
  const { registrations, fetchRegistrations, isLoading } = useRegistrationStore()
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({ totalRegistrations: 0, approved: 0, pending: 0, rejected: 0 })

  useEffect(() => {
    if (user?.role === 'ROLE_ADMIN') fetchRegistrations()
    const t = setTimeout(() => setMounted(true), 60)
    return () => clearTimeout(t)
  }, [user])

  useEffect(() => {
    const approved = registrations.filter(r => r.status === 'APPROVED').length
    const pending  = registrations.filter(r => r.status === 'PENDING').length
    const rejected = registrations.filter(r => r.status === 'REJECTED').length
    setStats({ totalRegistrations: registrations.length, approved, pending, rejected })
  }, [registrations])

  const pct = (n) => stats.totalRegistrations ? (n / stats.totalRegistrations) * 100 : 0

  /* Access denied */
  if (user?.role !== 'ROLE_ADMIN') return (
    <>
      <style>{CSS}</style>
      <div className="adp-root adp-denied">
        <div className="adp-orb adp-orb-1" aria-hidden /><div className="adp-orb adp-orb-2" aria-hidden />
        <div className="adp-denied-icon"><ShieldAlert size={32} strokeWidth={1.5} /></div>
        <h2 className="adp-denied-title">Access Restricted</h2>
        <p className="adp-denied-sub">This area is for administrators only.</p>
        <a href="/" className="adp-btn-home"><Home size={14} strokeWidth={2.5} /> Go Home</a>
      </div>
    </>
  )

  return (
    <>
      <style>{CSS}</style>
      <div className={`adp-root ${mounted ? 'adp-mounted' : ''}`}>
        <div className="adp-orb adp-orb-1" aria-hidden />
        <div className="adp-orb adp-orb-2" aria-hidden />
        <div className="adp-orb adp-orb-3" aria-hidden />
        <div className="adp-grid"          aria-hidden />

        {/* ── Hero header ── */}
        <header className="adp-hero adp-anim-1">
          <div className="adp-hero-inner">
            <div className="adp-hero-label">
              <Award size={12} strokeWidth={2.5} /> Admin Console
            </div>
            <h1 className="adp-hero-title">Dashboard</h1>
            <p className="adp-hero-sub">Registrations overview & analytics</p>
          </div>
        </header>

        <main className="adp-main">

          {/* ── Stat cards ── */}
          <div className="adp-stats-grid adp-anim-2">
            <StatCard icon={Users}        label="Total Registrations" value={stats.totalRegistrations} accent="var(--indigo-lt)" />
            <StatCard icon={CheckCircle2} label="Approved"            value={stats.approved}           accent="var(--teal)"     />
            <StatCard icon={Clock}        label="Pending"             value={stats.pending}            accent="var(--gold)"     />
            <StatCard icon={XCircle}      label="Rejected"            value={stats.rejected}           accent="var(--rose)"     />
          </div>

          {/* ── Analytics panel ── */}
          <div className="adp-panel adp-anim-3">
            <div className="adp-panel-header">
              <TrendingUp size={16} strokeWidth={2} />
              <h2 className="adp-panel-title">Registration Statistics</h2>
            </div>

            <div className="adp-analytics-grid">
              {/* Progress bars */}
              <div className="adp-analytics-col">
                <p className="adp-col-heading">Status breakdown</p>
                <div className="adp-prog-list">
                  <ProgressRow label="Approved" pct={pct(stats.approved)} color="var(--teal)" />
                  <ProgressRow label="Pending"  pct={pct(stats.pending)}  color="var(--gold)" />
                  <ProgressRow label="Rejected" pct={pct(stats.rejected)} color="var(--rose)" />
                </div>
              </div>

              {/* Donut */}
              <div className="adp-analytics-col adp-col-center">
                <p className="adp-col-heading">Approval rate</p>
                <Donut pct={pct(stats.approved)} color="var(--teal)" label="Approved" />
              </div>

              {/* Quick stats */}
              <div className="adp-analytics-col">
                <p className="adp-col-heading">Quick stats</p>
                <div className="adp-quick-stats">
                  <div className="adp-quick-card" style={{ '--qc': 'var(--indigo-lt)' }}>
                    <span className="adp-quick-label">Avg per event</span>
                    <span className="adp-quick-value">{(stats.totalRegistrations / 10).toFixed(1)}</span>
                  </div>
                  <div className="adp-quick-card" style={{ '--qc': 'var(--gold)' }}>
                    <span className="adp-quick-label">Pending review</span>
                    <span className="adp-quick-value">{stats.pending}</span>
                  </div>
                  <div className="adp-quick-card" style={{ '--qc': 'var(--teal)' }}>
                    <span className="adp-quick-label">Approval rate</span>
                    <span className="adp-quick-value">{pct(stats.approved).toFixed(0)}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Registrations table ── */}
          <div className="adp-panel adp-anim-4">
            <div className="adp-panel-header">
              <Award size={16} strokeWidth={2} />
              <h2 className="adp-panel-title">Recent Registrations</h2>
              <span className="adp-count-pill">{registrations.length} total</span>
            </div>

            {isLoading ? (
              <div className="adp-table-skeleton">
                {Array.from({ length: 5 }, (_, i) => (
                  <div key={i} className="adp-skel-row">
                    <div className="adp-skeleton adp-skel-name" />
                    <div className="adp-skeleton adp-skel-event" />
                    <div className="adp-skeleton adp-skel-badge" />
                    <div className="adp-skeleton adp-skel-date" />
                  </div>
                ))}
              </div>
            ) : registrations.length === 0 ? (
              <div className="adp-empty">
                <p className="adp-empty-text">No registrations yet</p>
              </div>
            ) : (
              <div className="adp-table-wrap">
                <table className="adp-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Event</th>
                      <th>Status</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {registrations.slice(0, 10).map(reg => (
                      <tr key={reg.id}>
                        <td>
                          <div className="adp-user-cell">
                            <div className="adp-avatar">
                              {(reg.user?.name ?? 'U')[0].toUpperCase()}
                            </div>
                            <span className="adp-user-name">{reg.user?.name ?? 'N/A'}</span>
                          </div>
                        </td>
                        <td><span className="adp-event-name">{reg.event?.title ?? 'N/A'}</span></td>
                        <td><StatusBadge status={reg.status} /></td>
                        <td>
                          <span className="adp-date">
                            {format(new Date(reg.registrationTime), 'MMM dd, yyyy · h:mm a')}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </main>
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
    --border:rgba(255,255,255,0.09); --border2:rgba(255,255,255,0.15);
    --surface:rgba(255,255,255,0.04); --surface2:rgba(255,255,255,0.08);
    --ff-display:'Playfair Display',Georgia,serif;
    --ff-body:'DM Sans',system-ui,sans-serif;
  }

  @keyframes adp-fade-up { from{opacity:0;transform:translateY(18px)} to{opacity:1;transform:translateY(0)} }
  @keyframes adp-pulse   { 0%,100%{opacity:.50;transform:scale(1)} 50%{opacity:.75;transform:scale(1.07)} }
  @keyframes adp-shimmer { from{background-position:-200% 0} to{background-position:200% 0} }

  .adp-root {
    font-family:var(--ff-body);
    min-height:100vh;
    background:
      radial-gradient(ellipse 80% 50% at 15% 0%,  rgba(67,97,238,.24) 0%,transparent 65%),
      radial-gradient(ellipse 55% 45% at 85% 100%, rgba(232,75,106,.14) 0%,transparent 65%),
      linear-gradient(165deg,var(--navy-900) 0%,var(--navy-950) 100%);
    color:var(--gray-100);
    position:relative;
    overflow-x:hidden;
  }

  .adp-orb { position:fixed;border-radius:50%;pointer-events:none;animation:adp-pulse 9s ease-in-out infinite; }
  .adp-orb-1 { width:520px;height:520px;top:-200px;left:-130px;  background:radial-gradient(circle,rgba(67,97,238,.17) 0%,transparent 70%); }
  .adp-orb-2 { width:400px;height:400px;bottom:-130px;right:-90px;background:radial-gradient(circle,rgba(232,75,106,.12) 0%,transparent 70%);animation-delay:-4.5s; }
  .adp-orb-3 { width:260px;height:260px;top:38%;left:55%;         background:radial-gradient(circle,rgba(10,191,142,.08) 0%,transparent 70%);animation-delay:-2s; }
  .adp-grid  { position:fixed;inset:0;background-image:linear-gradient(rgba(255,255,255,.02) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.02) 1px,transparent 1px);background-size:48px 48px;pointer-events:none; }

  .adp-root .adp-anim-1,.adp-root .adp-anim-2,.adp-root .adp-anim-3,.adp-root .adp-anim-4 { opacity:0; }
  .adp-mounted .adp-anim-1 { animation:adp-fade-up .50s ease forwards .05s; }
  .adp-mounted .adp-anim-2 { animation:adp-fade-up .50s ease forwards .18s; }
  .adp-mounted .adp-anim-3 { animation:adp-fade-up .50s ease forwards .30s; }
  .adp-mounted .adp-anim-4 { animation:adp-fade-up .50s ease forwards .42s; }

  /* ── Hero ── */
  .adp-hero {
    position:relative;z-index:2;
    padding:52px 0 48px;
    border-bottom:1px solid var(--border2);
    background:
      radial-gradient(ellipse 60% 100% at 0% 50%, rgba(67,97,238,.20) 0%,transparent 70%),
      rgba(10,22,40,.40);
    backdrop-filter:blur(12px);
  }
  .adp-hero-inner { max-width:1200px;margin:0 auto;padding:0 28px; }
  .adp-hero-label {
    display:inline-flex;align-items:center;gap:6px;
    font-size:11px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;
    color:var(--gold);background:rgba(245,200,66,.10);border:1px solid rgba(245,200,66,.28);
    border-radius:100px;padding:5px 13px;margin-bottom:16px;
  }
  .adp-hero-title { font-family:var(--ff-display);font-size:clamp(32px,5vw,52px);font-weight:800;color:var(--white);margin:0 0 8px;letter-spacing:-.02em; }
  .adp-hero-sub   { font-size:15px;font-weight:300;color:var(--gray-400);margin:0; }

  /* ── Main ── */
  .adp-main { position:relative;z-index:2;max-width:1200px;margin:0 auto;padding:40px 28px 80px;display:flex;flex-direction:column;gap:24px; }

  /* ── Stat cards ── */
  .adp-stats-grid { display:grid;grid-template-columns:repeat(4,1fr);gap:16px; }
  .adp-stat-card {
    background:rgba(15,32,64,.65);
    backdrop-filter:blur(20px);
    border:1px solid var(--border2);
    border-radius:18px;
    padding:22px 22px 20px;
    position:relative;
    overflow:hidden;
    box-shadow:0 4px 24px rgba(0,0,0,.35);
    transition:transform .2s,box-shadow .2s;
  }
  .adp-stat-card:hover { transform:translateY(-3px);box-shadow:0 8px 32px rgba(0,0,0,.45); }
  .adp-stat-card::before { content:'';position:absolute;top:0;left:0;right:0;height:2px;background:var(--accent);opacity:.8; }
  .adp-stat-top  { display:flex;align-items:center;justify-content:space-between;margin-bottom:16px; }
  .adp-stat-icon { width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.06);border:1px solid var(--border2);display:flex;align-items:center;justify-content:center;color:var(--accent); }
  .adp-stat-bar  { width:32px;height:3px;border-radius:100px;background:var(--accent);opacity:.35; }
  .adp-stat-value{ font-family:var(--ff-display);font-size:36px;font-weight:700;color:var(--white);margin:0 0 4px;letter-spacing:-.02em;line-height:1; }
  .adp-stat-label{ font-size:12px;font-weight:400;color:var(--gray-600);text-transform:uppercase;letter-spacing:.05em;margin:0; }

  /* ── Panels ── */
  .adp-panel {
    background:rgba(15,32,64,.65);
    backdrop-filter:blur(20px);
    border:1px solid var(--border2);
    border-radius:20px;
    overflow:hidden;
    box-shadow:0 4px 24px rgba(0,0,0,.30);
  }
  .adp-panel-header {
    display:flex;align-items:center;gap:10px;
    padding:22px 26px;
    border-bottom:1px solid var(--border);
    color:var(--indigo-lt);
  }
  .adp-panel-title { font-family:var(--ff-display);font-size:18px;font-weight:700;color:var(--white);margin:0;flex:1; }
  .adp-count-pill { font-size:11.5px;font-weight:500;color:var(--gray-400);background:var(--surface2);border:1px solid var(--border2);border-radius:100px;padding:4px 12px; }

  /* ── Analytics grid ── */
  .adp-analytics-grid { display:grid;grid-template-columns:1fr 1fr 1fr;gap:0; }
  .adp-analytics-col  { padding:26px 28px;border-right:1px solid var(--border); }
  .adp-analytics-col:last-child { border-right:none; }
  .adp-col-center { display:flex;flex-direction:column;align-items:center; }
  .adp-col-heading { font-size:11px;font-weight:500;letter-spacing:.06em;text-transform:uppercase;color:var(--gray-600);margin:0 0 18px; }

  /* Progress */
  .adp-prog-list { display:flex;flex-direction:column;gap:16px; }
  .adp-prog-row  { display:flex;flex-direction:column;gap:7px; }
  .adp-prog-head { display:flex;justify-content:space-between;align-items:center; }
  .adp-prog-label{ font-size:13px;font-weight:400;color:var(--gray-200); }
  .adp-prog-pct  { font-size:13px;font-weight:600; }
  .adp-prog-track{ height:5px;border-radius:100px;background:rgba(255,255,255,.07);overflow:hidden; }
  .adp-prog-fill { height:100%;border-radius:100px;transition:width .8s ease; }

  /* Donut */
  .adp-donut-wrap { position:relative;display:inline-flex;align-items:center;justify-content:center;margin-top:4px; }
  .adp-donut-inner{ position:absolute;display:flex;flex-direction:column;align-items:center;gap:3px; }
  .adp-donut-pct  { font-family:var(--ff-display);font-size:26px;font-weight:700;line-height:1; }
  .adp-donut-lbl  { font-size:11px;color:var(--gray-600);letter-spacing:.04em; }

  /* Quick stats */
  .adp-quick-stats { display:flex;flex-direction:column;gap:10px; }
  .adp-quick-card  { background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:12px;padding:14px 16px;border-left:3px solid var(--qc); }
  .adp-quick-label { display:block;font-size:11.5px;color:var(--gray-600);margin-bottom:6px; }
  .adp-quick-value { display:block;font-family:var(--ff-display);font-size:26px;font-weight:700;color:var(--qc);line-height:1; }

  /* ── Table ── */
  .adp-table-wrap { overflow-x:auto; }
  .adp-table { width:100%;border-collapse:collapse; }
  .adp-table thead tr { border-bottom:1px solid var(--border2); }
  .adp-table th {
    padding:13px 20px;text-align:left;
    font-size:11px;font-weight:500;letter-spacing:.07em;text-transform:uppercase;color:var(--gray-600);
  }
  .adp-table tbody tr { border-bottom:1px solid rgba(255,255,255,.04);transition:background .15s; }
  .adp-table tbody tr:hover { background:rgba(255,255,255,.03); }
  .adp-table tbody tr:last-child { border-bottom:none; }
  .adp-table td { padding:14px 20px;vertical-align:middle; }

  .adp-user-cell { display:flex;align-items:center;gap:10px; }
  .adp-avatar    { width:32px;height:32px;border-radius:50%;background:rgba(67,97,238,.20);border:1px solid rgba(90,123,255,.30);display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:600;color:var(--indigo-lt);flex-shrink:0; }
  .adp-user-name { font-size:14px;font-weight:500;color:var(--gray-100); }
  .adp-event-name{ font-size:13.5px;color:var(--gray-400); }
  .adp-date      { font-size:12.5px;color:var(--gray-600); }
  .adp-badge     { display:inline-block;padding:4px 12px;border-radius:100px;font-size:11.5px;font-weight:500;border:1px solid;letter-spacing:.03em; }

  /* ── Skeleton ── */
  .adp-skeleton { background:linear-gradient(90deg,rgba(255,255,255,.04) 25%,rgba(255,255,255,.09) 50%,rgba(255,255,255,.04) 75%);background-size:200% 100%;animation:adp-shimmer 1.6s ease-in-out infinite;border-radius:8px; }
  .adp-table-skeleton { padding:8px 20px;display:flex;flex-direction:column;gap:12px; }
  .adp-skel-row  { display:flex;gap:20px;align-items:center;padding:8px 0; }
  .adp-skel-name { height:16px;width:120px;border-radius:100px; }
  .adp-skel-event{ height:14px;flex:1; }
  .adp-skel-badge{ height:24px;width:72px;border-radius:100px; }
  .adp-skel-date { height:14px;width:100px; }

  /* ── Empty ── */
  .adp-empty { padding:40px;text-align:center; }
  .adp-empty-text { font-size:15px;color:var(--gray-600); }

  /* ── Access denied ── */
  .adp-denied { display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:12px;min-height:100vh;padding:40px; }
  .adp-denied-icon { width:64px;height:64px;border-radius:50%;background:rgba(232,75,106,.14);border:1px solid rgba(232,75,106,.30);display:flex;align-items:center;justify-content:center;color:var(--rose);margin-bottom:8px; }
  .adp-denied-title{ font-family:var(--ff-display);font-size:26px;font-weight:700;color:var(--gray-100);margin:0; }
  .adp-denied-sub  { font-size:15px;color:var(--gray-600);margin:0 0 16px; }
  .adp-btn-home    { display:inline-flex;align-items:center;gap:7px;padding:11px 22px;background:var(--surface2);border:1px solid var(--border2);border-radius:100px;color:var(--indigo-lt);font-family:var(--ff-body);font-size:14px;font-weight:500;text-decoration:none;transition:background .15s,border-color .15s; }
  .adp-btn-home:hover { background:rgba(90,123,255,.12);border-color:rgba(90,123,255,.45); }

  @media(max-width:900px) {
    .adp-stats-grid    { grid-template-columns:repeat(2,1fr); }
    .adp-analytics-grid{ grid-template-columns:1fr; }
    .adp-analytics-col { border-right:none;border-bottom:1px solid var(--border); }
    .adp-analytics-col:last-child { border-bottom:none; }
  }
  @media(max-width:520px) {
    .adp-stats-grid { grid-template-columns:1fr; }
    .adp-main { padding:24px 16px 60px; }
    .adp-hero-inner { padding:0 18px; }
  }
`