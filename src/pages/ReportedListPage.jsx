import { useState } from 'react';
import Header from '../components/Header';
import { AlertTriangle, MapPin, Eye, Phone, MessageSquare, ShieldAlert } from 'lucide-react';

const INITIAL_REPORTS = [
  {
    id: 'shuttle-loom',
    title: 'Shuttle Loom Machine',
    desc: 'Heavy Construction Equipment',
    category: 'Machines',
    subcategory: 'Textile',
    seller: 'Rahul Machinery',
    price: '₹18.4L',
    date: '18 May 2026',
    actionedBy: 'Admin Team',
    actionedDate: '19 May 2026, 11:45 AM',
    reportBy: 'Aman Sharma',
    contact: '+91 9876543210',
    comments: 'Seller was unresponsive and provided wrong information about the product. Requested a refund but never got it. Beware of this seller!',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=300'
  },
  {
    id: 'airjet-loom',
    title: 'CAT 320',
    desc: 'Excavator Machine',
    category: 'Machines',
    subcategory: 'Textile',
    seller: 'Tata Equipments',
    price: '₹10.8L',
    date: '15 May 2026',
    actionedBy: 'Admin Team',
    actionedDate: '17 May 2026, 03:10 PM',
    reportBy: 'Rohit Verma',
    contact: '+91 9123456780',
    comments: 'Spam listing. Images are stolen from google. Machine condition is described as new but it is completely rusted.',
    img: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=300'
  }
];

export default function ReportedListPage() {
  const [reports] = useState(INITIAL_REPORTS);
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Header />
      <main style={{ maxWidth: '100%', margin: '0 auto', padding: '24px 20px 80px' }}>
        
        {/* TOP PANEL */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(16px)',
          padding: '20px 24px', borderRadius: 22, border: '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 8px 30px rgba(0,0,0,0.04)', marginBottom: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 16, background: 'linear-gradient(135deg, #ef4444, #f97316)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(239,68,68,0.25)'
            }}>
              <AlertTriangle size={24} color="white" />
            </div>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a' }}>Reported Products</h2>
              <p style={{ color: '#64748b', fontSize: 13, marginTop: 2 }}>Monitor reported products & take necessary moderation actions</p>
            </div>
          </div>
          <div style={{ background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: 16, padding: '10px 20px', textAlign: 'center' }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Total Reports</span>
            <h3 style={{ fontSize: 20, fontWeight: 900, color: '#991b1b', marginTop: 2 }}>{reports.length}</h3>
          </div>
        </div>

        {/* TABLE WRAPPER */}
        <div style={{ background: 'white', borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 1200 }}>
              <thead>
                <tr style={{ background: 'linear-gradient(to right, #0f172a, #1e3a8a, #0f172a)', color: 'white' }}>
                  {[
                    'Product Details', 'Category', 'Sub-category', 'Seller', 'Product Price', 
                    'Listed Date', 'Actioned By', 'Actioned Date & Time', 'Report By', 
                    'User Contact No', 'Report Comments', 'Product Info'
                  ].map(h => (
                    <th key={h} style={{ padding: '14px 18px', fontWeight: 600, fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'left', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reports.map((r, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fef2f233'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    
                    {/* PRODUCT */}
                    <td style={{ padding: '14px 18px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={r.img} alt={r.title} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                        <div>
                          <h4 style={{ fontWeight: 800, color: '#1e293b', fontSize: 14 }}>{r.title}</h4>
                          <p style={{ color: '#64748b', fontSize: 12, marginTop: 1 }}>{r.desc}</p>
                        </div>
                      </div>
                    </td>

                    <td style={{ padding: '14px 18px', color: '#334155' }}>{r.category}</td>
                    <td style={{ padding: '14px 18px', color: '#334155' }}>{r.subcategory}</td>
                    <td style={{ padding: '14px 18px', fontWeight: 600, color: '#334155' }}>{r.seller}</td>
                    
                    {/* PRICE */}
                    <td style={{ padding: '14px 18px' }}>
                      <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 800, background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe' }}>{r.price}</span>
                    </td>

                    <td style={{ padding: '14px 18px', color: '#475569' }}>{r.date}</td>
                    <td style={{ padding: '14px 18px', fontWeight: 600, color: '#475569' }}>{r.actionedBy}</td>
                    <td style={{ padding: '14px 18px', color: '#64748b', fontSize: 13 }}>{r.actionedDate}</td>
                    <td style={{ padding: '14px 18px', fontWeight: 700, color: '#1e293b' }}>{r.reportBy}</td>
                    <td style={{ padding: '14px 18px', color: '#475569', fontWeight: 600 }}>{r.contact}</td>
                    
                    {/* COMMENTS */}
                    <td style={{ padding: '14px 18px', maxWidth: 300, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#ef4444', fontWeight: 500 }} title={r.comments}>
                      {r.comments}
                    </td>

                    {/* ACTIONS */}
                    <td style={{ padding: '14px 18px' }}>
                      <button onClick={() => setSelectedReport(r)} style={{
                        padding: '6px 14px', borderRadius: 10, background: 'linear-gradient(135deg, #0891b2, #0284c7)',
                        color: 'white', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 6, transition: 'transform 0.15s'
                      }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                      >
                        <Eye size={13} /> View Details
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* DETAIL MODAL */}
      {selectedReport && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 999, background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(6px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16
        }}>
          <div style={{
            background: 'white', borderRadius: 24, width: '100%', maxWidth: 540,
            boxShadow: '0 25px 80px rgba(0,0,0,0.25)', animation: 'popupScale 0.3s ease', overflow: 'hidden'
          }}>
            {/* Header */}
            <div style={{ background: 'linear-gradient(135deg, #ef4444, #b91c1c)', padding: '24px 20px', color: 'white', display: 'flex', alignItems: 'center', gap: 10 }}>
              <ShieldAlert size={28} />
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 900 }}>Report Details</h3>
                <p style={{ fontSize: 12, opacity: 0.85 }}>Flagged listing audit</p>
              </div>
              <button onClick={() => setSelectedReport(null)} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', cursor: 'pointer', width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
            </div>

            <div style={{ padding: 24, display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Product Info */}
              <div style={{ display: 'flex', gap: 12, borderBottom: '1px solid #f1f5f9', paddingBottom: 14 }}>
                <img src={selectedReport.img} alt={selectedReport.title} style={{ width: 64, height: 64, borderRadius: 12, objectFit: 'cover' }} />
                <div>
                  <h4 style={{ fontSize: 16, fontWeight: 800, color: '#1e293b' }}>{selectedReport.title}</h4>
                  <p style={{ fontSize: 13, color: '#64748b' }}>{selectedReport.desc} ({selectedReport.category})</p>
                  <p style={{ fontSize: 14, fontWeight: 900, color: '#7c3aed', marginTop: 4 }}>Price: {selectedReport.price}</p>
                </div>
              </div>

              {/* Reporter details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Reporter</span>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>{selectedReport.reportBy}</p>
                </div>
                <div style={{ background: '#f8fafc', padding: 12, borderRadius: 12, border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase' }}>Contact</span>
                  <p style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginTop: 2 }}>{selectedReport.contact}</p>
                </div>
              </div>

              {/* Report Comments */}
              <div style={{ background: '#fef2f2', padding: 16, borderRadius: 12, border: '1px solid #fecaca' }}>
                <span style={{ fontSize: 10, color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 4 }}><MessageSquare size={12} /> Comments</span>
                <p style={{ fontSize: 13, color: '#991b1b', marginTop: 6, lineHeight: 1.6, fontWeight: 500 }}>{selectedReport.comments}</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 8 }}>
                <button onClick={() => setSelectedReport(null)} style={{ padding: '12px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: 700, cursor: 'pointer' }}>Close</button>
                <button onClick={() => { setSelectedReport(null); alert('Moderator action initiated.'); }} style={{ padding: '12px', borderRadius: 12, background: 'linear-gradient(135deg, #ef4444, #e11d48)', color: 'white', fontWeight: 800, border: 'none', cursor: 'pointer' }}>Take Action 🛠️</button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
