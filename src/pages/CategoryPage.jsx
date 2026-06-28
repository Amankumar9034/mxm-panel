import { useState, useEffect, useCallback } from 'react';
import Header from '../components/Header';
import {
  getCategoryList, createCategory, updateCategory,
  updateCategoryStatus, deleteCategory
} from '../api/panelService';
import { Search, Plus, Edit2, Trash2, X, Upload, ChevronRight, Layers, CheckCircle2, XCircle, LayoutGrid } from 'lucide-react';

const EMPTY_FORM = { name: '', isActive: true, image: null, imagePreview: '' };

export default function CategoryPage() {
  const [rootCats, setRootCats] = useState([]);
  const [subCats, setSubCats] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [subLoading, setSubLoading] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const fetchRoot = useCallback(async () => {
    setLoading(true);
    try {
      const params = {};
      if (search) params.search = search;
      if (statusFilter !== 'all') params.isActive = statusFilter === 'active';
      const res = await getCategoryList(params);
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setRootCats(list);
    } catch (err) { console.error('fetchRoot:', err?.response?.data || err.message); }
    finally { setLoading(false); }
  }, [search, statusFilter]);

  const fetchSubs = useCallback(async (parentId) => {
    setSubLoading(true);
    try {
      const res = await getCategoryList({ parentId });
      const list = Array.isArray(res.data?.data) ? res.data.data : [];
      setSubCats(list);
    } catch (err) { console.error('fetchSubs:', err?.response?.data || err.message); }
    finally { setSubLoading(false); }
  }, []);

  useEffect(() => { fetchRoot(); }, [fetchRoot]);
  useEffect(() => {
    if (selectedCat) fetchSubs(selectedCat._id);
    else setSubCats([]);
  }, [selectedCat, fetchSubs]);

  const openModal = (type, edit = null) => {
    setForm(edit
      ? { name: edit.name, isActive: edit.isActive ?? true, image: null, imagePreview: edit.image || '' }
      : EMPTY_FORM);
    setModal({ type, edit });
  };
  const closeModal = () => { setModal(null); setForm(EMPTY_FORM); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('isActive', String(form.isActive));
      if (modal.type === 'subcategory' && selectedCat) fd.append('parentId', selectedCat._id);
      if (form.image) fd.append('image', form.image);
      if (modal.edit) {
        await updateCategory(modal.edit._id, fd);
      } else {
        await createCategory(fd);
      }
      closeModal();
      fetchRoot();
      if (selectedCat) fetchSubs(selectedCat._id);
    } catch (err) { console.error('submit:', err?.response?.data || err.message); }
    finally { setFormLoading(false); }
  };

  const handleToggleStatus = async (cat) => {
    try {
      await updateCategoryStatus(cat._id, !cat.isActive);
      fetchRoot();
      if (selectedCat) fetchSubs(selectedCat._id);
    } catch (err) { console.error(err); }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteCategory(deleteConfirm._id);
      setDeleteConfirm(null);
      if (selectedCat?._id === deleteConfirm._id) setSelectedCat(null);
      fetchRoot();
      if (selectedCat) fetchSubs(selectedCat._id);
    } catch (err) { console.error(err); }
  };

  // ── computed stats (no extra API calls) ──
  const totalCats = rootCats.length;
  const activeCats = rootCats.filter(c => c.isActive).length;
  const inactiveCats = rootCats.filter(c => !c.isActive).length;
  const totalSubs = subCats.length;

  const STAT_CARDS = [
    { label: 'Total Categories', value: totalCats,    Icon: Layers,        grad: 'linear-gradient(135deg,#7C3AED,#6D28D9)', light: '#F5F3FF', border: '#DDD6FE', glow: 'rgba(124,58,237,0.18)' },
    { label: 'Active',           value: activeCats,   Icon: CheckCircle2,  grad: 'linear-gradient(135deg,#16A34A,#15803D)', light: '#F0FDF4', border: '#BBF7D0', glow: 'rgba(22,163,74,0.15)'  },
    { label: 'Inactive',         value: inactiveCats, Icon: XCircle,       grad: 'linear-gradient(135deg,#DC2626,#B91C1C)', light: '#FEF2F2', border: '#FECACA', glow: 'rgba(220,38,38,0.15)'  },
    { label: 'Subcategories',    value: selectedCat ? totalSubs : '—', Icon: LayoutGrid, grad: 'linear-gradient(135deg,#0891B2,#0E7490)', light: '#ECFEFF', border: '#A5F3FC', glow: 'rgba(8,145,178,0.15)' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: 'Inter, sans-serif' }}>
      <Header />

      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '28px 24px 80px' }}>

        {/* PAGE TITLE */}
        <div style={{ marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#111827', margin: 0 }}>Category Management</h1>
            <p style={{ color: '#6B7280', fontSize: 13, marginTop: 4 }}>Manage root categories and their subcategories</p>
          </div>
          <button onClick={() => openModal('category')} style={addBtn}
            onMouseEnter={e => { e.currentTarget.style.transform='translateY(-1px)'; e.currentTarget.style.boxShadow='0 6px 20px rgba(124,58,237,0.35)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'; }}>
            <Plus size={15} /> Add Category
          </button>
        </div>

        {/* STAT CARDS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }} className="stats-grid">
          {STAT_CARDS.map(s => (
            <div key={s.label}
              className="stat-card"
              style={{
                background: 'white', border: `1px solid ${s.border}`,
                borderRadius: 16, padding: '20px 20px 16px',
                boxShadow: `0 2px 12px ${s.glow}`,
                position: 'relative', overflow: 'hidden',
                transition: 'transform 0.2s, box-shadow 0.2s', cursor: 'default',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow=`0 8px 24px ${s.glow}`; }}
              onMouseLeave={e => { e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow=`0 2px 12px ${s.glow}`; }}
            >
              {/* accent bar */}
              <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background: s.grad, borderRadius:'16px 16px 0 0' }} />
              {/* glow blob */}
              <div style={{ position:'absolute', top:-20, right:-20, width:80, height:80, borderRadius:'50%', background: s.light, filter:'blur(20px)', opacity:0.8 }} />

              <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', position:'relative' }}>
                <div>
                  <p style={{ fontSize:11, fontWeight:700, color:'#9CA3AF', textTransform:'uppercase', letterSpacing:'0.08em', margin:0 }}>{s.label}</p>
                  <p style={{ fontSize:32, fontWeight:900, color:'#111827', margin:'6px 0 0', lineHeight:1 }}>{s.value}</p>
                </div>
                <div style={{
                  width:44, height:44, borderRadius:12,
                  background: s.grad,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  boxShadow:`0 4px 12px ${s.glow}`,
                  flexShrink:0,
                }}>
                  <s.Icon size={20} color="white" strokeWidth={2} />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* SEARCH + FILTER */}
        <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search categories or subcategories..."
              style={searchInput}
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={filterSelect}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="hidden">Hidden</option>
          </select>
        </div>

        {/* MAIN GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: 20, alignItems: 'start' }} className="cat-grid">

          {/* SIDEBAR */}
          <div style={card}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: '#111827' }}>Categories</span>
              <span style={countBadge}>{rootCats.length}</span>
            </div>

            {loading ? <SidebarSkeleton /> : rootCats.length === 0 ? (
              <p style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', padding: '24px 0' }}>No categories yet</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, maxHeight: 560, overflowY: 'auto', paddingRight: 2 }}>
                {rootCats.map(cat => {
                  const isSelected = selectedCat?._id === cat._id;
                  return (
                    <div
                      key={cat._id}
                      onClick={() => setSelectedCat(cat)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 12,
                        padding: '12px 14px', borderRadius: 12, cursor: 'pointer',
                        border: `1.5px solid ${isSelected ? '#7C3AED' : '#E5E7EB'}`,
                        background: isSelected ? 'linear-gradient(135deg,#F5F3FF,#EDE9FE)' : 'white',
                        boxShadow: isSelected ? '0 4px 14px rgba(124,58,237,0.12)' : '0 1px 3px rgba(0,0,0,0.04)',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.boxShadow='0 4px 12px rgba(0,0,0,0.08)'; }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.boxShadow='0 1px 3px rgba(0,0,0,0.04)'; }}
                    >
                      {/* avatar */}
                      <div style={{
                        width: 42, height: 42, borderRadius: 10, overflow: 'hidden', flexShrink: 0,
                        background: isSelected ? 'linear-gradient(135deg,#7C3AED,#6D28D9)' : '#F3F4F6',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: isSelected ? '0 3px 10px rgba(124,58,237,0.3)' : 'none',
                      }}>
                        {cat.image
                          ? <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                          : <Layers size={18} color={isSelected ? 'white' : '#9CA3AF'} />}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontWeight: 700, fontSize: 13, color: isSelected ? '#5B21B6' : '#111827', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{cat.name}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginTop: 3 }}>
                          <span style={{ width: 6, height: 6, borderRadius: '50%', background: cat.isActive ? '#22C55E' : '#EF4444', flexShrink: 0 }} />
                          <span style={{ fontSize: 11, color: cat.isActive ? '#16A34A' : '#EF4444', fontWeight: 600 }}>{cat.isActive ? 'Active' : 'Hidden'}</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
                        <button onClick={e => { e.stopPropagation(); openModal('category', cat); }} style={sideIconBtn('#EEF2FF', '#4F46E5')} title="Edit"><Edit2 size={12} /></button>
                        <button onClick={e => { e.stopPropagation(); setDeleteConfirm(cat); }} style={sideIconBtn('#FEF2F2', '#EF4444')} title="Delete"><Trash2 size={12} /></button>
                        {isSelected && <ChevronRight size={14} color="#7C3AED" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* SUBCATEGORY PANEL */}
          <div style={card}>
            {/* panel header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 10 }}>
              <div>
                {selectedCat ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <h2 style={{ fontSize: 20, fontWeight: 800, color: '#111827', margin: 0 }}>{selectedCat.name}</h2>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 999, letterSpacing: '0.05em',
                      background: selectedCat.isActive ? '#DCFCE7' : '#FEE2E2',
                      color: selectedCat.isActive ? '#15803D' : '#B91C1C',
                    }}>{selectedCat.isActive ? 'ACTIVE' : 'HIDDEN'}</span>
                  </div>
                ) : (
                  <h2 style={{ fontSize: 20, fontWeight: 800, color: '#9CA3AF', margin: 0 }}>Select a Category</h2>
                )}
                <p style={{ color: '#9CA3AF', fontSize: 12, marginTop: 4 }}>
                  {selectedCat ? 'Showing relational subcategories inside table list view' : 'Click a category from the sidebar to view its subcategories'}
                </p>
              </div>
              {selectedCat && (
                <button onClick={() => openModal('subcategory')} style={addBtn}>
                  <Plus size={14} /> Add Subcategory
                </button>
              )}
            </div>

            {!selectedCat ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>👈</div>
                <p style={{ color: '#9CA3AF', fontWeight: 600, fontSize: 14 }}>Select a category from the left panel</p>
              </div>
            ) : subLoading ? <TableSkeleton /> : subCats.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: 48, marginBottom: 12 }}>📂</div>
                <p style={{ color: '#9CA3AF', fontWeight: 600, fontSize: 14 }}>No subcategories yet</p>
                <p style={{ color: '#D1D5DB', fontSize: 12, marginTop: 4 }}>Click "+ Add Subcategory" to create one</p>
              </div>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
                  <thead>
                    <tr style={{ background: '#F9FAFB', borderBottom: '2px solid #E5E7EB' }}>
                      {['S.NO', 'IMAGE', 'SUBCATEGORY NAME', 'STATUS', 'ACTIONS'].map((h, i) => (
                        <th key={h} style={{
                          padding: '12px 16px', fontSize: 11, fontWeight: 700, color: '#6B7280',
                          textTransform: 'uppercase', letterSpacing: '0.08em',
                          textAlign: i === 0 ? 'center' : 'left',
                        }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {subCats.map((sub, i) => (
                      <tr key={sub._id}
                        style={{ borderBottom: '1px solid #F3F4F6', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#FAFAFA'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={{ padding: '14px 16px', textAlign: 'center', color: '#6B7280', fontWeight: 600, fontSize: 13 }}>{i + 1}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ width: 46, height: 46, borderRadius: 8, overflow: 'hidden', border: '1px solid #E5E7EB', background: '#F9FAFB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            {sub.image
                              ? <img src={sub.image} alt={sub.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                              : <span style={{ fontSize: 20 }}>📷</span>}
                          </div>
                        </td>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: '#111827' }}>{sub.name}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <span style={{
                            display: 'inline-flex', alignItems: 'center', gap: 5,
                            padding: '4px 12px', borderRadius: 999, fontSize: 12, fontWeight: 600,
                            background: sub.isActive ? '#F0FDF4' : '#FEF2F2',
                            color: sub.isActive ? '#15803D' : '#B91C1C',
                            border: `1px solid ${sub.isActive ? '#BBF7D0' : '#FECACA'}`,
                          }}>
                            <span style={{ width: 6, height: 6, borderRadius: '50%', background: sub.isActive ? '#22C55E' : '#EF4444' }} />
                            {sub.isActive ? 'Active' : 'Hidden'}
                          </span>
                        </td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <button onClick={() => openModal('subcategory', sub)} style={tableBtn('#EEF2FF', '#4F46E5')}>
                              Edit
                            </button>
                            <button onClick={() => handleToggleStatus(sub)} style={tableBtn(sub.isActive ? '#FFF7ED' : '#F0FDF4', sub.isActive ? '#C2410C' : '#15803D')}>
                              {sub.isActive ? 'Hide' : 'Show'}
                            </button>
                            <button onClick={() => setDeleteConfirm(sub)} style={tableBtn('#FEF2F2', '#DC2626')}>
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ADD/EDIT MODAL */}
      {modal && (
        <div style={overlay}>
          <div style={modalBox}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 24px', borderBottom: '1px solid #F3F4F6' }}>
              <h3 style={{ fontSize: 16, fontWeight: 800, color: '#111827', margin: 0 }}>
                {modal.edit ? 'Edit' : 'Add'} {modal.type === 'category' ? 'Category' : `Subcategory${selectedCat ? ` — ${selectedCat.name}` : ''}`}
              </h3>
              <button onClick={closeModal} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9CA3AF', display: 'flex' }}><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={labelStyle}>Name *</label>
                <input required value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder={modal.type === 'category' ? 'e.g. Electronics' : 'e.g. Smart Phones'}
                  style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Status</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  {[{ val: true, label: '● Active' }, { val: false, label: '● Hidden' }].map(opt => (
                    <label key={String(opt.val)} style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '9px', border: `1.5px solid ${form.isActive === opt.val ? '#7C3AED' : '#E5E7EB'}`,
                      borderRadius: 8, cursor: 'pointer',
                      background: form.isActive === opt.val ? '#F5F3FF' : 'white',
                      fontWeight: 600, fontSize: 13,
                      color: form.isActive === opt.val ? '#7C3AED' : '#6B7280',
                    }}>
                      <input type="radio" style={{ display: 'none' }} checked={form.isActive === opt.val} onChange={() => setForm(f => ({ ...f, isActive: opt.val }))} />
                      {opt.label}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label style={labelStyle}>Image (optional)</label>
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  gap: 6, border: '2px dashed #D1D5DB', borderRadius: 10, padding: 18,
                  cursor: 'pointer', background: '#F9FAFB',
                }}>
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={e => {
                    const file = e.target.files[0];
                    if (!file) return;
                    setForm(f => ({ ...f, image: file, imagePreview: URL.createObjectURL(file) }));
                  }} />
                  {form.imagePreview
                    ? <img src={form.imagePreview} alt="preview" style={{ maxHeight: 80, borderRadius: 8, objectFit: 'cover' }} />
                    : <><Upload size={20} color="#9CA3AF" /><span style={{ color: '#9CA3AF', fontSize: 12 }}>Click to upload image</span></>}
                </label>
              </div>

              <div style={{ display: 'flex', gap: 10, paddingTop: 4, borderTop: '1px solid #F3F4F6' }}>
                <button type="button" onClick={closeModal} style={cancelBtn}>Cancel</button>
                <button type="submit" disabled={formLoading} style={submitBtn}>
                  {formLoading ? 'Saving…' : (modal.edit ? 'Update' : 'Create')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {deleteConfirm && (
        <div style={overlay}>
          <div style={{ ...modalBox, maxWidth: 380, textAlign: 'center', padding: '32px 28px' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#FEF2F2', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px', fontSize: 26 }}>🗑️</div>
            <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 8, color: '#111827' }}>Delete?</h3>
            <p style={{ color: '#6B7280', fontSize: 13, marginBottom: 22 }}>
              "<strong>{deleteConfirm.name}</strong>" and all its subcategories will be permanently removed.
            </p>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleDelete} style={{ ...submitBtn, background: 'linear-gradient(135deg,#EF4444,#DC2626)', flex: 1 }}>Delete</button>
              <button onClick={() => setDeleteConfirm(null)} style={{ ...cancelBtn, flex: 1 }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 860px) { .cat-grid { grid-template-columns: 1fr !important; } .stats-grid { grid-template-columns: repeat(2,1fr) !important; } }
        @media (max-width: 480px) { .stats-grid { grid-template-columns: 1fr !important; } }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 4px; }
      `}</style>
    </div>
  );
}

/* ── shared styles ── */
const card = { background: 'white', borderRadius: 14, border: '1px solid #E5E7EB', padding: 20, boxShadow: '0 1px 6px rgba(0,0,0,0.05)' };
const countBadge = { background: '#EEF2FF', color: '#4F46E5', fontSize: 12, fontWeight: 700, padding: '2px 10px', borderRadius: 999 };
const addBtn = { display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 10, background: '#7C3AED', color: 'white', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer' };
const searchInput = { width: '100%', paddingLeft: 36, paddingRight: 14, paddingTop: 10, paddingBottom: 10, border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 13, outline: 'none', background: 'white', boxSizing: 'border-box' };
const filterSelect = { padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: 10, fontSize: 13, background: 'white', color: '#374151', outline: 'none', cursor: 'pointer', minWidth: 130 };
const sideIconBtn = (bg, color) => ({ width: 26, height: 26, borderRadius: 6, background: bg, color, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' });
const tableBtn = (bg, color) => ({ padding: '5px 14px', borderRadius: 7, background: bg, color, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 700 });
const overlay = { position: 'fixed', inset: 0, zIndex: 50, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(5px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 };
const modalBox = { background: 'white', borderRadius: 16, width: '100%', maxWidth: 440, boxShadow: '0 20px 60px rgba(0,0,0,0.18)' };
const labelStyle = { display: 'block', fontSize: 11, fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 };
const inputStyle = { width: '100%', padding: '10px 14px', border: '1.5px solid #E5E7EB', borderRadius: 8, fontSize: 14, outline: 'none', background: 'white', boxSizing: 'border-box' };
const cancelBtn = { flex: 1, padding: '11px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: 'white', color: '#374151', fontWeight: 700, cursor: 'pointer', fontSize: 14 };
const submitBtn = { flex: 1, padding: '11px', borderRadius: 8, background: '#7C3AED', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 14 };

function TableSkeleton() {
  return (
    <div>
      <div style={{ height: 44, background: '#F9FAFB', borderRadius: 6, marginBottom: 10 }} />
      {[...Array(4)].map((_, i) => <div key={i} style={{ height: 62, background: '#F3F4F6', borderRadius: 6, marginBottom: 8 }} />)}
    </div>
  );
}
function SidebarSkeleton() {
  return <div>{[...Array(4)].map((_, i) => <div key={i} style={{ height: 60, background: '#F3F4F6', borderRadius: 10, marginBottom: 8 }} />)}</div>;
}
