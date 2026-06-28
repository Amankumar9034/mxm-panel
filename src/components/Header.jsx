import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { label: 'Product List', to: '/products', icon: '🗄️' },
  { label: 'Manage Categories', to: '/categories', icon: '📂' },
  { label: 'Action History', to: '/action-history', icon: '⏱️' },
  { label: 'Reported List', to: '/reported', icon: '⚠️' },
  { label: 'App Users', to: '/users', icon: '👥' },
];

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dropRef = useRef(null);
  const userRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdownOpen(false);
      if (userRef.current && !userRef.current.contains(e.target)) setUserMenuOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 50, width: '100%',
      background: 'radial-gradient(circle at center, #1A2845 0%, #091236 100%)',
      borderBottom: '1px solid rgba(255,255,255,0.1)',
      boxShadow: '0 4px 24px rgba(0,0,0,0.25)',
    }}>
      <div style={{ maxWidth: '100%', margin: '0 auto', padding: '0 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 72 }}>

          {/* LOGO */}
          <Link to="/dashboard" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{
              background: 'white', borderRadius: 12, width: 48, height: 48,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: 4, boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
            }}>
              <img src="/logo.png" alt="MXM Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: 'white', fontWeight: 900, fontSize: 18, letterSpacing: '0.1em', textTransform: 'uppercase', lineHeight: 1 }}>MXM</span>
              <span style={{
                background: 'linear-gradient(to right, #fbbf24, #fde68a)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap',
              }}>Machine Exchange Mart ⚙️</span>
            </div>
          </Link>

          {/* DESKTOP NAV */}
          <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }} className="desktop-nav">
            <Link to="/dashboard" className="nav-link" style={{
              ...navLinkStyle,
              background: location.pathname === '/dashboard' ? 'rgba(255,255,255,0.15)' : 'transparent',
            }}>
              <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M4 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1H5a1 1 0 01-1-1v-4zM14 15a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
              </svg>
              Dashboard
            </Link>

            {/* APP CONTROLS DROPDOWN */}
            <div ref={dropRef} style={{ position: 'relative' }}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ ...navLinkStyle, border: 'none', cursor: 'pointer', background: dropdownOpen ? 'rgba(255,255,255,0.15)' : 'transparent' }}
              >
                <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                App Controls
                <svg width={12} height={12} fill="none" stroke="currentColor" viewBox="0 0 24 24"
                  style={{ transition: 'transform 0.2s', transform: dropdownOpen ? 'rotate(180deg)' : 'none' }}>
                  <path strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {dropdownOpen && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, width: 240,
                  background: 'white', boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                  borderRadius: 12, border: '1px solid #e2e8f0', paddingBlock: 8, zIndex: 100,
                  animation: 'fadeInUp 0.15s ease',
                }}>
                  {NAV_ITEMS.map(item => (
                    <Link key={item.to} to={item.to} onClick={() => setDropdownOpen(false)} style={dropdownLinkStyle(location.pathname === item.to)}>
                      <span style={{ fontSize: 16 }}>{item.icon}</span>
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* USER MENU + MOBILE TOGGLE */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div ref={userRef} style={{ position: 'relative' }}>
              <button onClick={() => setUserMenuOpen(!userMenuOpen)} style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '4px 6px',
                borderRadius: 999, background: 'rgba(255,255,255,0.1)', border: 'none', cursor: 'pointer',
              }}>
                <img src="/user.png" alt="user" style={{ width: 36, height: 36, borderRadius: '50%', border: '2px solid rgba(255,255,255,0.25)', objectFit: 'cover' }} />
                <div style={{ textAlign: 'left', paddingRight: 4 }} className="user-info">
                  <p style={{ fontSize: 12, fontWeight: 700, color: 'white', lineHeight: 1.2 }}>{user?.name || 'Admin'}</p>
                  <p style={{ fontSize: 11, color: '#c4b5fd', fontWeight: 500 }}>Admin</p>
                </div>
              </button>
              {userMenuOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '110%', width: 220,
                  background: 'white', borderRadius: 12, boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                  border: '1px solid #e2e8f0', padding: 8, zIndex: 100,
                  animation: 'fadeInUp 0.15s ease',
                }}>
                  <Link to="/change-password" onClick={() => setUserMenuOpen(false)} style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '10px 14px', borderRadius: 8, border: 'none', background: 'transparent',
                    color: '#475569', fontSize: 14, fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#f1f5f9'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeWidth={2} d="M12 15v-2a3 3 0 00-3-3H6a3 3 0 00-3 3v2m14-4h2a2 2 0 012 2v4a2 2 0 01-2 2h-2m-10-8h10a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2z" />
                    </svg>
                    Change Password
                  </Link>
                  <div style={{ height: '1px', background: '#f1f5f9', margin: '4px 0' }} />
                  <button onClick={handleLogout} style={{
                    display: 'flex', alignItems: 'center', gap: 10, width: '100%',
                    padding: '10px 14px', borderRadius: 8, border: 'none', background: 'transparent',
                    color: '#ef4444', fontSize: 14, fontWeight: 600, cursor: 'pointer',
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <svg width={16} height={16} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* HAMBURGER */}
            <button className="mobile-menu-btn" onClick={() => setMobileOpen(!mobileOpen)} style={{
              background: 'none', border: 'none', color: 'white', cursor: 'pointer', fontSize: 20, padding: 6,
            }}>
              <i className={`fas ${mobileOpen ? 'fa-times' : 'fa-bars'}`} />
            </button>
          </div>
        </div>
      </div>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div style={{ background: 'white', borderTop: '1px solid #e2e8f0', boxShadow: '0 10px 30px rgba(0,0,0,0.12)', padding: '12px 16px' }}>
          {[{ label: 'Dashboard', to: '/dashboard', icon: '🏠' }, ...NAV_ITEMS].map(item => (
            <Link key={item.to} to={item.to} onClick={() => setMobileOpen(false)} style={{
              display: 'block', padding: '12px 16px', color: '#334155', fontWeight: 600,
              textDecoration: 'none', borderRadius: 8, marginBottom: 2,
              background: location.pathname === item.to ? '#f5f3ff' : 'transparent',
            }}>
              <span style={{ marginRight: 8 }}>{item.icon}</span>{item.label}
            </Link>
          ))}
          <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 8, paddingTop: 8 }}>
            <Link to="/change-password" onClick={() => setMobileOpen(false)} style={{
              display: 'block', padding: '12px 16px', color: '#334155', fontWeight: 600,
              textDecoration: 'none', borderRadius: 8, marginBottom: 2,
            }}>
              <span style={{ marginRight: 8 }}>🔑</span>Change Password
            </Link>
            <button onClick={handleLogout} style={{
              display: 'block', width: '100%', textAlign: 'left', padding: '12px 16px',
              color: '#ef4444', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', borderRadius: 8,
            }}>
              <i className="fas fa-sign-out-alt" style={{ marginRight: 8 }} />Logout
            </button>
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 1024px) { .mobile-menu-btn { display: none !important; } }
        @media (max-width: 1023px) { .desktop-nav { display: none !important; } .user-info { display: none; } }
      `}</style>
    </header>
  );
}

const navLinkStyle = {
  display: 'flex', alignItems: 'center', gap: 6,
  padding: '8px 14px', borderRadius: 8, fontSize: 14, fontWeight: 600,
  color: 'rgba(255,255,255,0.88)', textDecoration: 'none',
  transition: 'background 0.2s, color 0.2s',
};

const dropdownLinkStyle = (active) => ({
  display: 'flex', alignItems: 'center', gap: 10,
  padding: '9px 16px', fontSize: 14, color: active ? '#5a32a3' : '#334155',
  fontWeight: active ? 700 : 500, background: active ? '#f5f3ff' : 'transparent',
  textDecoration: 'none', transition: 'background 0.15s',
});

