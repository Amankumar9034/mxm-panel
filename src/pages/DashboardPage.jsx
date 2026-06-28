import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';

const STAT_CARDS = [
  { label: 'Total Users', value: '14,282', sub: 'Active buyers & sellers', badge: '↑ 12%', emoji: '👥', color: '#7c3aed', glow: 'rgba(168,85,247,0.35)' },
  { label: 'Pending Approvals', value: '48 Items', sub: 'Product verification pipeline', badge: 'REVIEW', emoji: '⏳', color: '#d97706', glow: 'rgba(251,191,36,0.35)', pulse: true },
  { label: 'Live Listings', value: '3,419', sub: 'Visible on user screens', badge: 'LIVE', emoji: '🚀', color: '#059669', glow: 'rgba(16,185,129,0.35)' },
  { label: 'Premium Subs', value: '852', sub: 'Copper to Diamond tiers', badge: 'DIAMOND', emoji: '💎', color: '#2563eb', glow: 'rgba(59,130,246,0.35)' },
  { label: 'Total Revenue', value: '₹4.82L', sub: 'Plan sales this month', badge: '↑ 8.4%', emoji: '💰', color: '#e11d48', glow: 'rgba(244,63,94,0.35)' },
];

const RECENT_PRODUCTS = [
  { name: 'JCB 3DX', category: 'Construction', seller: 'Rahul Machinery', city: 'Delhi', price: '₹18.4L', date: '18 May 2026', img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=300' },
  { name: 'CAT 320', category: 'Excavator', seller: 'Tata Equipments', city: 'Haryana', price: '₹25.8L', date: '16 May 2026', img: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=300' },
  { name: 'Komatsu D65', category: 'Bulldozer', seller: 'Singh Heavy', city: 'Punjab', price: '₹32.5L', date: '14 May 2026', img: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=300' },
];

const VERIFICATION_STATS = [
  { label: 'Approved Listings', sub: 'Successfully verified', count: '3,284', color: '#059669' },
  { label: 'Rejected Listings', sub: 'Failed moderation', count: '135', color: '#ef4444' },
  { label: 'Under Review', sub: 'In verification queue', count: '48', color: '#d97706' },
];

export default function DashboardPage() {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Header />
      <main style={{ maxWidth: '100%', margin: '0 auto', padding: '28px 24px 80px' }}>

        {/* PAGE TITLE */}
        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>Dashboard</h1>
          <p style={{ color: '#64748b', fontSize: 14 }}>Welcome back! Here's what's happening on MXM.</p>
        </div>

        {/* STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
          {STAT_CARDS.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>

        {/* MAIN GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: 20, alignItems: 'start' }} className="dash-grid">

          {/* RECENT PRODUCTS TABLE */}
          <div style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(16px)', borderRadius: 28, border: '1px solid rgba(255,255,255,0.5)', padding: '28px 24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#111827' }}>Recently Listed Products</h2>
                <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>Verify products to make them live</p>
              </div>
              <button onClick={() => navigate('/products')} style={{
                padding: '10px 20px', borderRadius: 12, background: '#f59e0b',
                border: 'none', color: 'white', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                transition: 'background 0.2s',
              }}>Take Action →</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 640 }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                    {['Product', 'Seller', 'City', 'Price', 'Listed Date'].map(h => (
                      <th key={h} style={{ paddingBottom: 14, fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {RECENT_PRODUCTS.map((p, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f9fafb' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f8fafc'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                      <td style={{ padding: '16px 0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <img src={p.img} style={{ width: 56, height: 56, borderRadius: 12, objectFit: 'cover' }} alt={p.name} onError={e => e.target.style.display='none'} />
                          <div>
                            <p style={{ fontWeight: 800, color: '#111827', fontSize: 14 }}>{p.name}</p>
                            <p style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>{p.category}</p>
                          </div>
                        </div>
                      </td>
                      <td style={{ color: '#374151', fontWeight: 600, fontSize: 14 }}>{p.seller}</td>
                      <td style={{ color: '#374151', fontWeight: 600, fontSize: 14 }}>{p.city}</td>
                      <td style={{ color: '#7c3aed', fontWeight: 800, fontSize: 14 }}>{p.price}</td>
                      <td style={{ color: '#6b7280', fontSize: 13 }}>{p.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* VERIFICATION ANALYTICS */}
          <div style={{ background: 'rgba(255,255,255,0.82)', backdropFilter: 'blur(16px)', borderRadius: 28, border: '1px solid rgba(255,255,255,0.5)', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: '#111827' }}>Verification Analytics</h2>
                <p style={{ color: '#6b7280', fontSize: 13, marginTop: 4 }}>Moderation performance overview</p>
              </div>
              <div style={{ width: 52, height: 52, borderRadius: 14, background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>✅</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {VERIFICATION_STATS.map(s => (
                <div key={s.label} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: 'white', borderRadius: 14, border: '1px solid #e2e8f0', padding: '16px',
                }}>
                  <div>
                    <p style={{ fontWeight: 700, color: '#111827', fontSize: 14 }}>{s.label}</p>
                    <p style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>{s.sub}</p>
                  </div>
                  <p style={{ fontSize: 28, fontWeight: 900, color: s.color }}>{s.count}</p>
                </div>
              ))}
            </div>

            {/* QUICK LINKS */}
            <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #f1f5f9' }}>
              <p style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>Quick Access</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {[
                  { label: 'App Users', to: '/users', emoji: '👥', color: '#7c3aed' },
                  { label: 'Categories', to: '/categories', emoji: '📂', color: '#0891b2' },
                ].map(link => (
                  <button key={link.to} onClick={() => navigate(link.to)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px',
                    background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 10,
                    cursor: 'pointer', textAlign: 'left', transition: 'background 0.2s',
                    color: link.color, fontWeight: 700, fontSize: 14,
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.background = '#f8fafc'}
                  >
                    <span style={{ fontSize: 18 }}>{link.emoji}</span>
                    {link.label}
                    <span style={{ marginLeft: 'auto' }}>→</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style>{`
        @media (max-width: 1200px) { .dash-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function StatCard({ label, value, sub, badge, emoji, color, glow, pulse }) {
  return (
    <div style={{
      position: 'relative', overflow: 'hidden',
      background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.25)', borderRadius: 24, padding: 20,
      boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
      transition: 'transform 0.35s ease, box-shadow 0.35s ease',
      cursor: 'default',
    }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-5px)'; e.currentTarget.style.boxShadow = `0 20px 60px ${glow}`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.08)'; }}
    >
      {/* shine overlay */}
      <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.05) 50%, transparent 100%)', pointerEvents: 'none', borderRadius: 24 }} />
      {/* glow blob */}
      <div style={{ position: 'absolute', bottom: -24, right: -24, width: 80, height: 80, background: `${color}25`, filter: 'blur(24px)', borderRadius: '50%' }} />

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: color, textTransform: 'uppercase', letterSpacing: '0.2em', fontFamily: 'monospace' }}>{label}</span>
        <span style={{
          padding: '10px', borderRadius: 12, background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.2)', fontSize: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        }}>{emoji}</span>
      </div>
      <div style={{ marginTop: 20, display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', position: 'relative', zIndex: 1 }}>
        <h3 style={{ fontSize: 32, fontWeight: 900, color: color + 'ee', letterSpacing: '-1px' }}>{value}</h3>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 10,
          background: pulse ? `${color}cc` : 'rgba(255,255,255,0.22)',
          border: '1px solid rgba(255,255,255,0.2)', color: pulse ? 'white' : color,
          animation: pulse ? 'pulse-badge 1.5s ease infinite' : 'none',
        }}>
          {badge}
        </span>
      </div>
      <p style={{ fontSize: 11, color: color + '99', marginTop: 6, fontWeight: 600, position: 'relative', zIndex: 1 }}>{sub}</p>
      <style>{`@keyframes pulse-badge { 0%,100%{opacity:1} 50%{opacity:0.6} }`}</style>
    </div>
  );
}
