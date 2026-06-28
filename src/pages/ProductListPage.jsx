import { useState } from 'react';
import Header from '../components/Header';
import { ShieldCheck, Sliders, CheckCircle, Ban, Clock, AlertTriangle, ChevronRight, Phone, Mail, User, Building, MapPin, Eye } from 'lucide-react';

const INITIAL_PRODUCTS = [
  {
    id: 'shuttle-loom',
    title: 'Shuttle Loom Machine',
    company: 'Rahul Machinery',
    desc: 'High Performance Shuttle Loom Machine for Smooth & Reliable Fabric Production. Equipped with automatic pick-finding and robust beat-up mechanism.',
    badge1: 'Machines',
    badge2: 'Textile',
    condition: 'Used - Excellent',
    price: '₹12,50,000',
    location: 'Delhi, India',
    category: 'machines',
    status: 'pending',
    time: '2 hrs ago',
    sellerName: 'Rahul Machinery',
    sellerPhone: '+91 9876543210',
    sellerEmail: 'rahul@machinery.com',
    sellerGst: '22AAAAA0000A1Z5',
    sellerAvatar: 'https://i.pravatar.cc/150?img=18',
    images: [
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600',
      'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=600',
      'https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=600'
    ]
  },
  {
    id: 'airjet-loom',
    title: 'AirJet Loom',
    company: 'Aman Electronics',
    desc: 'High Speed Production | Smooth Performance | Energy Efficient | Low Maintenance. Ideal for cotton and synthetic fiber weaving.',
    badge1: 'Machines',
    badge2: 'Textile',
    condition: 'Used - Like New',
    price: '₹95,000',
    location: 'Mumbai, India',
    category: 'machines',
    status: 'approved',
    time: '30 mins ago',
    sellerName: 'Aman Electronics',
    sellerPhone: '+91 9123456789',
    sellerEmail: 'aman@electronics.com',
    sellerGst: '27BBBCC1111D1Z2',
    sellerAvatar: 'https://i.pravatar.cc/150?img=33',
    images: [
      'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=600',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600'
    ]
  },
  {
    id: 'cat-excavator',
    title: 'CAT 320 Excavator',
    company: 'Tata Heavy Equipment',
    desc: 'Equipped with heavy-duty bucket and high-efficiency hydraulic systems. Excellent fuel efficiency and low operating hours.',
    badge1: 'Heavy Duty',
    badge2: 'Excavation',
    condition: 'Used - Good',
    price: '₹28,50,000',
    location: 'Pune, India',
    category: 'vehicles',
    status: 'rejected',
    time: '1 day ago',
    sellerName: 'Tata Heavy Equipment',
    sellerPhone: '+91 8888888888',
    sellerEmail: 'sales@tataheavy.com',
    sellerGst: '27AAACT1111A1Z0',
    sellerAvatar: 'https://i.pravatar.cc/150?img=12',
    images: [
      'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=600',
      'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=600'
    ]
  }
];

export default function ProductListPage() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [selectedProductId, setSelectedProductId] = useState(INITIAL_PRODUCTS[0].id);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const selectedProduct = products.find(p => p.id === selectedProductId) || products[0];

  const handleStatusUpdate = (newStatus) => {
    setProducts(prev => prev.map(p => {
      if (p.id === selectedProductId) {
        return { ...p, status: newStatus.toLowerCase() };
      }
      return p;
    }));
  };

  const filteredProducts = products.filter(p => {
    const catMatch = categoryFilter === 'all' || p.category === categoryFilter;
    const statusMatch = statusFilter === 'all' || p.status === statusFilter;
    return catMatch && statusMatch;
  });

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Header />
      <main style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 20px 80px' }}>
        
        {/* STATS ROW */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Pending Review', value: products.filter(p => p.status === 'pending').length, color: '#eab308', emoji: '📦' },
            { label: 'Live Products', value: products.filter(p => p.status === 'approved').length, color: '#10b981', emoji: '🚀' },
            { label: 'Rejected Products', value: products.filter(p => p.status === 'rejected').length, color: '#ef4444', emoji: '🚫' },
            { label: 'Total Listings', value: products.length, color: '#6366f1', emoji: '⚙️' }
          ].map(stat => (
            <div key={stat.label} style={{
              background: 'white', border: '1px solid #e2e8f0', borderRadius: 20, padding: 18,
              boxShadow: '0 4px 12px rgba(0,0,0,0.03)', display: 'flex', alignItems: 'center', justifyContent: 'space-between'
            }}>
              <div>
                <span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{stat.label}</span>
                <h3 style={{ fontSize: 28, fontWeight: 900, color: stat.color, marginTop: 4 }}>{stat.value}</h3>
              </div>
              <span style={{ fontSize: 24 }}>{stat.emoji}</span>
            </div>
          ))}
        </div>

        {/* WORKSPACE GRID */}
        <div style={{ display: 'grid', gridTemplateColumns: '440px 1fr', gap: 20, alignItems: 'start' }} className="prod-grid">
          
          {/* LEFT: PRODUCTS LIST queue */}
          <div style={{ background: 'white', borderRadius: 24, border: '1px solid #e2e8f0', padding: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.04)', maxHeight: '780px', overflowY: 'auto' }}>
            <div style={{ marginBottom: 18 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a' }}>Product Queue</h2>
              <p style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>Select a product to view detailed info and moderate</p>
            </div>

            {/* FILTERS */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 16 }}>
              <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} style={selectStyle}>
                <option value="all">All Categories</option>
                <option value="machines">Machines</option>
                <option value="vehicles">Vehicles</option>
              </select>
              <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={selectStyle}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* LIST */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {filteredProducts.map(p => (
                <div
                  key={p.id}
                  onClick={() => { setSelectedProductId(p.id); setCurrentImgIndex(0); }}
                  style={{
                    padding: 12, borderRadius: 16, border: `1.5px solid ${selectedProductId === p.id ? '#7c3aed' : '#e2e8f0'}`,
                    background: selectedProductId === p.id ? '#f5f3ff' : 'white', cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', gap: 12
                  }}
                >
                  <img src={p.images[0]} alt={p.title} style={{ width: 80, height: 80, borderRadius: 12, objectFit: 'cover', border: '1px solid #f1f5f9' }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4 }}>
                      <h4 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.title}</h4>
                      <span style={badgeStyle(p.status)}>{p.status}</span>
                    </div>
                    <p style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{p.company}</p>
                    <p style={{ fontSize: 12, color: '#64748b', marginTop: 6, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.desc}</p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 13, fontWeight: 900, color: '#7c3aed' }}>{p.price}</span>
                      <span style={{ fontSize: 10, color: '#94a3b8' }}>{p.time}</span>
                    </div>
                  </div>
                </div>
              ))}
              {filteredProducts.length === 0 && (
                <p style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8', fontSize: 14 }}>No products matching filters</p>
              )}
            </div>
          </div>

          {/* RIGHT: DETAILS PANEL */}
          {selectedProduct && (
            <div style={{ background: 'white', borderRadius: 24, border: '1px solid #e2e8f0', padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              
              {/* TOP HEADER */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
                <div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                    <span style={tagStyle('#f5f3ff', '#7c3aed')}>{selectedProduct.badge1}</span>
                    <span style={tagStyle('#ecfeff', '#0891b2')}>{selectedProduct.badge2}</span>
                  </div>
                  <h1 style={{ fontSize: 24, fontWeight: 900, color: '#0f172a' }}>{selectedProduct.title}</h1>
                  <p style={{ fontSize: 14, color: '#64748b', marginTop: 6, lineHeight: 1.5 }}>{selectedProduct.desc}</p>
                </div>
                <div style={{ textAlign: 'center', background: '#fef3c7', border: '1px solid #fde68a', borderRadius: 16, padding: '12px 20px', minWidth: 120 }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Status</span>
                  <h3 style={{ fontSize: 16, fontWeight: 900, color: '#b45309', marginTop: 2, textTransform: 'capitalize' }}>{selectedProduct.status}</h3>
                </div>
              </div>

              {/* MEDIA GALLERY */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 12, marginBottom: 24 }}>
                <div style={{ height: 380, borderRadius: 20, overflow: 'hidden', border: '1px solid #e2e8f0', background: '#f8fafc' }}>
                  <img src={selectedProduct.images[currentImgIndex]} alt="Main Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {selectedProduct.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt="Thumbnail"
                      onClick={() => setCurrentImgIndex(idx)}
                      style={{
                        height: 80, borderRadius: 12, objectFit: 'cover', cursor: 'pointer',
                        border: `2px solid ${currentImgIndex === idx ? '#7c3aed' : 'transparent'}`,
                        opacity: currentImgIndex === idx ? 1 : 0.7, transition: 'all 0.2s'
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* DETAILS GRID */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
                
                {/* PRODUCT INFO */}
                <div style={{ background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0', padding: 18 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>Product Details</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={detailRowStyle}>
                      <span style={{ color: '#94a3b8' }}>Condition</span>
                      <strong style={{ color: '#334155' }}>{selectedProduct.condition}</strong>
                    </div>
                    <div style={detailRowStyle}>
                      <span style={{ color: '#94a3b8' }}>Price</span>
                      <strong style={{ color: '#7c3aed', fontWeight: 900 }}>{selectedProduct.price}</strong>
                    </div>
                    <div style={detailRowStyle}>
                      <span style={{ color: '#94a3b8' }}>Location</span>
                      <strong style={{ color: '#334155' }}>{selectedProduct.location}</strong>
                    </div>
                    <div style={detailRowStyle}>
                      <span style={{ color: '#94a3b8' }}>Category</span>
                      <strong style={{ color: '#334155', textTransform: 'capitalize' }}>{selectedProduct.category}</strong>
                    </div>
                  </div>
                </div>

                {/* SELLER INFO */}
                <div style={{ background: '#f8fafc', borderRadius: 16, border: '1px solid #e2e8f0', padding: 18 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                    <img src={selectedProduct.sellerAvatar} alt="Seller" style={{ width: 44, height: 44, borderRadius: 12, objectFit: 'cover' }} />
                    <div>
                      <h4 style={{ fontSize: 14, fontWeight: 800, color: '#1e293b' }}>{selectedProduct.sellerName}</h4>
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#10b981' }}>Verified Merchant</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    <div style={detailRowStyle}>
                      <span style={{ color: '#94a3b8' }}>Phone</span>
                      <strong style={{ color: '#334155' }}>{selectedProduct.sellerPhone}</strong>
                    </div>
                    <div style={detailRowStyle}>
                      <span style={{ color: '#94a3b8' }}>Email</span>
                      <strong style={{ color: '#334155', fontSize: 12 }}>{selectedProduct.sellerEmail}</strong>
                    </div>
                    <div style={detailRowStyle}>
                      <span style={{ color: '#94a3b8' }}>GSTIN</span>
                      <strong style={{ color: '#334155' }}>{selectedProduct.sellerGst}</strong>
                    </div>
                  </div>
                </div>

              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', gap: 12, borderTop: '1px solid #f1f5f9', paddingTop: 20 }}>
                <button onClick={() => handleStatusUpdate('rejected')} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid #fecaca', background: '#fef2f2', color: '#ef4444', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  Reject Product
                </button>
                <button onClick={() => handleStatusUpdate('pending')} style={{ flex: 1, padding: '12px', borderRadius: 12, border: '1.5px solid #fde68a', background: '#fffbeb', color: '#d97706', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>
                  Ask Changes
                </button>
                <button onClick={() => handleStatusUpdate('approved')} style={{ flex: 2, padding: '12px', borderRadius: 12, background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', color: 'white', fontWeight: 800, fontSize: 13, border: 'none', cursor: 'pointer' }}>
                  Approve & Go Live 🚀
                </button>
              </div>

            </div>
          )}
        </div>
      </main>
      
      <style>{`
        @media (max-width: 1024px) {
          .prod-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const selectStyle = {
  padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 13,
  background: 'white', color: '#475569', outline: 'none', cursor: 'pointer'
};

const badgeStyle = (status) => {
  const isApproved = status === 'approved';
  const isRejected = status === 'rejected';
  return {
    fontSize: 10, fontWeight: 700, textTransform: 'uppercase', padding: '3px 8px', borderRadius: 6,
    background: isApproved ? '#dcfce7' : isRejected ? '#fee2e2' : '#fef3c7',
    color: isApproved ? '#16a34a' : isRejected ? '#dc2626' : '#d97706',
    border: `1.5px solid ${isApproved ? '#bbf7d0' : isRejected ? '#fecaca' : '#fde68a'}`
  };
};

const tagStyle = (bg, color) => ({
  padding: '2px 8px', borderRadius: 6, fontSize: 10, fontWeight: 700,
  textTransform: 'uppercase', background: bg, color
});

const detailRowStyle = {
  display: 'flex', justifyContent: 'space-between', fontSize: 13, borderBottom: '1px dashed #e2e8f0', paddingBottom: 6
};
