import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import { getUserList, updateUserStatus, deleteUserAdmin, getUserById } from '../api/panelService';
import { Search, X, Phone, Mail, CalendarDays, Shield, Trash2, CheckCircle, XCircle } from 'lucide-react';

export default function AppUsersPage() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [confirmModal, setConfirmModal] = useState(null); // { userId, action: 'delete'|'toggle', currentStatus }
  const [actionLoading, setActionLoading] = useState(false);
  const limit = 15;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (search) params.search = search;
      if (gender) params.gender = gender;
      const res = await getUserList(params);
      const d = res.data?.data || res.data;
      setUsers(d?.list || d?.users || d?.data || []);
      setTotal(d?.total || d?.count || 0);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally { setLoading(false); }
  }, [page, search, gender]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const openDetail = async (userId) => {
    setDetailLoading(true);
    try {
      const res = await getUserById(userId);
      setSelectedUser(res.data?.data || res.data);
    } catch { setSelectedUser(null); }
    finally { setDetailLoading(false); }
  };

  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    setActionLoading(true);
    try {
      if (confirmModal.action === 'delete') {
        await deleteUserAdmin(confirmModal.userId);
      } else {
        await updateUserStatus(confirmModal.userId, !confirmModal.currentStatus);
      }
      setConfirmModal(null);
      setSelectedUser(null);
      fetchUsers();
    } catch (err) { console.error(err); }
    finally { setActionLoading(false); }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Header />
      <main style={{ maxWidth: '100%', margin: '0 auto', padding: '24px 20px 80px' }}>

        {/* TOP BAR */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
          gap: 12, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)',
          padding: '16px 20px', borderRadius: 18, border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.06)', marginBottom: 20, position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: -40, left: -40, width: 120, height: 120, background: 'rgba(124,58,237,0.08)', borderRadius: '50%', filter: 'blur(20px)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, position: 'relative', zIndex: 1 }}>
            <div style={{ width: 8, height: 36, background: '#ea580c', borderRadius: 4 }} />
            <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1e293b' }}>
              Total Users: <span style={{ color: '#7c3aed' }}>{total}</span>
            </h2>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
            {/* SEARCH */}
            <div style={{ position: 'relative' }}>
              <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
              <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search users..."
                style={{ paddingLeft: 36, paddingRight: 14, paddingTop: 9, paddingBottom: 9, border: '1.5px solid #e2e8f0', borderRadius: 14, fontSize: 13, outline: 'none', background: '#f8fafc', minWidth: 200 }} />
            </div>

            {/* GENDER FILTER */}
            <select value={gender} onChange={e => { setGender(e.target.value); setPage(1); }} style={{
              padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: 14, fontSize: 13,
              background: 'white', color: '#374151', outline: 'none', cursor: 'pointer',
            }}>
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
        </div>

        {/* MAIN GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: selectedUser ? '1fr 360px' : '1fr', gap: 16, alignItems: 'start', transition: 'grid-template-columns 0.4s ease' }} className="users-grid">

          {/* USERS TABLE */}
          <div style={{ background: 'white', borderRadius: 18, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
            {loading ? (
              <TableSkeleton />
            ) : users.length === 0 ? (
              <EmptyState message="No users found" />
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 760 }}>
                  <thead>
                    <tr style={{ background: 'linear-gradient(to right, #0f172a, #1e3a8a, #0f172a)', color: 'white' }}>
                      {['Username', 'Phone', 'Email', 'Joined', 'Gender', 'Status', 'Action'].map(h => (
                        <th key={h} style={{ padding: '12px 16px', fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', textAlign: h === 'Action' ? 'center' : 'left' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr key={u._id || i}
                        style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.2s', cursor: 'pointer' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fafafa'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1e293b' }}>{u.name || '—'}</td>
                        <td style={{ padding: '12px 16px', color: '#475569' }}>{u.phone || '—'}</td>
                        <td style={{ padding: '12px 16px', color: '#475569' }}>{u.email || '—'}</td>
                        <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 12 }}>{u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-IN') : '—'}</td>
                        <td style={{ padding: '12px 16px', color: '#64748b', textTransform: 'capitalize' }}>{u.gender || '—'}</td>
                        <td style={{ padding: '12px 16px' }}>
                          <span style={{
                            padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 700,
                            background: u.isActive ? '#dcfce7' : '#fee2e2',
                            color: u.isActive ? '#16a34a' : '#dc2626',
                          }}>{u.isActive ? 'Active' : 'Inactive'}</span>
                        </td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                          <button onClick={() => openDetail(u._id)} style={{
                            padding: '6px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                            background: 'linear-gradient(135deg, #2563eb, #4f46e5)', color: 'white',
                            border: 'none', cursor: 'pointer', marginRight: 6, transition: 'transform 0.15s',
                          }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                          >View</button>
                          <button onClick={() => setConfirmModal({ userId: u._id, action: 'delete' })} style={{
                            padding: '6px 12px', borderRadius: 10, fontSize: 12, fontWeight: 700,
                            background: 'linear-gradient(135deg, #ef4444, #e11d48)', color: 'white',
                            border: 'none', cursor: 'pointer', transition: 'transform 0.15s',
                          }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                          >Del</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* PAGINATION */}
            {totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '16px', borderTop: '1px solid #f1f5f9' }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={paginationBtn(page === 1)}>← Prev</button>
                <span style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={paginationBtn(page === totalPages)}>Next →</button>
              </div>
            )}
          </div>

          {/* DETAILS PANEL */}
          {selectedUser && (
            <div style={{
              background: 'white', border: '1px solid #e2e8f0', borderRadius: 22,
              boxShadow: '0 10px 40px rgba(0,0,0,0.10)', overflow: 'hidden',
              animation: 'slideInRight 0.35s ease',
            }}>
              {/* HEADER */}
              <div style={{ background: 'linear-gradient(to right, #0f172a, #1e3a8a, #0f172a)', padding: 24, position: 'relative', textAlign: 'center' }}>
                <button onClick={() => setSelectedUser(null)} style={{
                  position: 'absolute', top: 14, right: 14, width: 32, height: 32, borderRadius: '50%',
                  background: 'rgba(255,255,255,0.15)', border: 'none', color: 'white', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <X size={16} />
                </button>
                <img
                  src={selectedUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(selectedUser.name || 'User')}&background=1e3a8a&color=ffffff&size=128`}
                  alt={selectedUser.name}
                  style={{ width: 84, height: 84, borderRadius: '50%', objectFit: 'cover', border: '3px solid rgba(255,255,255,0.3)' }}
                />
                <h3 style={{ color: 'white', fontWeight: 700, marginTop: 10, fontSize: 18 }}>{selectedUser.name || 'Unknown'}</h3>
                <p style={{ color: '#93c5fd', fontSize: 13 }}>{selectedUser.email || selectedUser.role || 'App User'}</p>
              </div>

              <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {[
                  { icon: <Phone size={18} color="#2563eb" />, label: 'Phone', value: selectedUser.phone },
                  { icon: <Mail size={18} color="#7c3aed" />, label: 'Email', value: selectedUser.email },
                  { icon: <CalendarDays size={18} color="#059669" />, label: 'Joined', value: selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString('en-IN') : '—' },
                  { icon: <Shield size={18} color="#d97706" />, label: 'Status', value: selectedUser.isActive ? 'Active' : 'Inactive' },
                ].map(row => (
                  <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#f8fafc', borderRadius: 12, padding: '12px 14px', border: '1px solid #e2e8f0' }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>{row.icon}</div>
                    <div>
                      <p style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{row.label}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{row.value || '—'}</p>
                    </div>
                  </div>
                ))}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 6 }}>
                  <button onClick={() => setConfirmModal({ userId: selectedUser._id, action: 'toggle', currentStatus: selectedUser.isActive })} style={{
                    padding: '12px', borderRadius: 14, background: 'linear-gradient(135deg, #f97316, #eab308)',
                    color: 'white', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                    {selectedUser.isActive ? <><XCircle size={15} />Block</> : <><CheckCircle size={15} />Activate</>}
                  </button>
                  <button onClick={() => setConfirmModal({ userId: selectedUser._id, action: 'delete' })} style={{
                    padding: '12px', borderRadius: 14, background: 'linear-gradient(135deg, #ef4444, #e11d48)',
                    color: 'white', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                    <Trash2 size={15} /> Delete
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CONFIRM MODAL */}
      {confirmModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}>
          <div style={{
            background: 'white', borderRadius: 24, width: '100%', maxWidth: 420,
            boxShadow: '0 25px 80px rgba(0,0,0,0.25)', animation: 'popupScale 0.3s ease',
          }}>
            <div style={{ padding: '28px 24px 16px', textAlign: 'center' }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#fef2f2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <span style={{ fontSize: 32 }}>⚠️</span>
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 800, color: '#0f172a', marginBottom: 8 }}>Confirm Action</h3>
              <p style={{ color: '#64748b', fontSize: 14, lineHeight: 1.6 }}>
                {confirmModal.action === 'delete' ? 'Are you sure you want to permanently delete this user? This action cannot be undone.' : `Are you sure you want to ${confirmModal.currentStatus ? 'block' : 'activate'} this user?`}
              </p>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: '16px 24px 24px' }}>
              <button onClick={handleConfirmAction} disabled={actionLoading} style={{
                padding: '13px', borderRadius: 14, background: 'linear-gradient(135deg, #ef4444, #e11d48)',
                color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 14,
              }}>
                {actionLoading ? 'Processing…' : 'Confirm'}
              </button>
              <button onClick={() => setConfirmModal(null)} style={{
                padding: '13px', borderRadius: 14, background: 'white', border: '1.5px solid #e2e8f0',
                color: '#374151', fontWeight: 700, cursor: 'pointer', fontSize: 14,
              }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 900px) { .users-grid { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div style={{ padding: 24 }}>
      {[...Array(8)].map((_, i) => (
        <div key={i} style={{ height: 48, borderRadius: 8, background: '#f1f5f9', marginBottom: 8, animation: 'pulse-sk 1.4s ease infinite alternate' }} />
      ))}
      <style>{`@keyframes pulse-sk { from{opacity:1} to{opacity:0.5} }`}</style>
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div style={{ padding: 60, textAlign: 'center' }}>
      <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
      <p style={{ color: '#94a3b8', fontWeight: 600, fontSize: 15 }}>{message}</p>
    </div>
  );
}

const paginationBtn = (disabled) => ({
  padding: '8px 16px', borderRadius: 10, border: '1.5px solid #e2e8f0',
  background: disabled ? '#f8fafc' : 'white', color: disabled ? '#94a3b8' : '#374151',
  fontWeight: 600, fontSize: 13, cursor: disabled ? 'not-allowed' : 'pointer',
});
