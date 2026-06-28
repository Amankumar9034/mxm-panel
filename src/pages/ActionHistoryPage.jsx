import { useState } from 'react';
import Header from '../components/Header';
import Chart from 'react-apexcharts';
import { Sliders, Filter, Search, ArrowUpRight, CheckCircle, Ban, Clock, MapPin, Eye } from 'lucide-react';

const INITIAL_ACTIONS = [
  {
    id: 'shuttle-loom',
    title: 'Shuttle Loom Machine',
    category: 'Machines',
    subcategory: 'Textile',
    seller: 'Rahul Machinery',
    city: 'Delhi',
    price: '₹18.4L',
    date: '18 May 2026',
    action: 'approved',
    actionedBy: 'Admin Team',
    actionedTime: '18 May 2026, 04:45 PM',
    img: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?q=80&w=300'
  },
  {
    id: 'cat-excavator',
    title: 'CAT 320',
    category: 'Machines',
    subcategory: 'Heavy Equipment',
    seller: 'Tata Equipments',
    city: 'Haryana',
    price: '₹25.8L',
    date: '16 May 2026',
    action: 'rejected',
    actionedBy: 'Admin Team',
    actionedTime: '16 May 2026, 11:20 AM',
    img: 'https://images.unsplash.com/photo-1565043589221-1a6fd9ae45c7?q=80&w=300'
  },
  {
    id: 'hyundai-loader',
    title: 'Hyundai Loader',
    category: 'Machines',
    subcategory: 'Loader',
    seller: 'BuildPro India',
    city: 'Mumbai',
    price: '₹14.9L',
    date: '14 May 2026',
    action: 'pending',
    actionedBy: 'Admin Team',
    actionedTime: '14 May 2026, 09:10 AM',
    img: 'https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=300'
  }
];

export default function ActionHistoryPage() {
  const [actions, setActions] = useState(INITIAL_ACTIONS);
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sortBy, setSortBy] = useState('Newest First');
  const [search, setSearch] = useState('');

  // Charts Config
  const revenueOptions = {
    chart: { type: 'area', height: 400, toolbar: { show: false }, zoom: { enabled: false } },
    colors: ['#7c3aed'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth', width: 4 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.05 }
    },
    grid: { borderColor: '#e2e8f0' },
    xaxis: { categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] }
  };

  const revenueSeries = [{
    name: 'Revenue',
    data: [120, 180, 160, 250, 320, 420, 390, 480, 520, 610, 590, 720]
  }];

  const categoryOptions = {
    chart: { type: 'donut', height: 250, toolbar: { show: false } },
    labels: ['Machines', 'Appliances', 'Vehicles'],
    colors: ['#7c3aed', '#06b6d4', '#f59e0b'],
    legend: { position: 'bottom', horizontalAlign: 'center', fontSize: '14px', fontWeight: 500 },
    plotOptions: { pie: { donut: { size: '72%' } } },
    stroke: { width: 0 },
    dataLabels: { enabled: false }
  };

  const categorySeries = [44, 26, 18];

  const handleApplyFilter = () => {
    setFilterOpen(false);
    // Simple filter logic simulation
  };

  const handleResetFilter = () => {
    setStatusFilter('');
    setFromDate('');
    setToDate('');
    setSortBy('Newest First');
    setFilterOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F8FAFC' }}>
      <Header />
      <main style={{ maxWidth: '100%', margin: '0 auto', padding: '24px 20px 80px' }}>
        
        {/* CHARTS BLOCK */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20, marginBottom: 24 }} className="charts-grid">
          {/* Revenue Chart */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 28, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', marginBottom: 16 }}>Revenue Overview</h3>
            <Chart options={revenueOptions} series={revenueSeries} type="area" height={320} />
          </div>
          {/* Category Chart */}
          <div style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: 28, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>Categories Distribution</h3>
            <Chart options={categoryOptions} series={categorySeries} type="donut" height={250} />
          </div>
        </div>

        {/* DATA BLOCK */}
        <div style={{ background: 'white', borderRadius: 28, border: '1px solid #e2e8f0', padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.03)' }}>
          
          {/* TOP BAR */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12, marginBottom: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 12, height: 40, background: 'linear-gradient(to bottom, #f59e0b, #f97316)', borderRadius: 4 }} />
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>Recently Actioned Products</h2>
                <p style={{ color: '#64748b', fontSize: 12 }}>Review & manage recently listed marketplace products</p>
              </div>
            </div>

            {/* FILTER & BUTTONS */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', position: 'relative' }}>
              <button
                onClick={() => setFilterOpen(!filterOpen)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px',
                  borderRadius: 14, border: '1px solid #e2e8f0', background: 'white',
                  color: '#334155', fontWeight: 700, fontSize: 13, cursor: 'pointer'
                }}
              >
                <Sliders size={16} color="#f97316" />
                <span>Sort & Filter</span>
              </button>

              {/* FILTER DROPDOWN */}
              {filterOpen && (
                <div style={{
                  position: 'absolute', right: 0, top: '110%', width: 340, background: 'white',
                  borderRadius: 24, border: '1px solid #e2e8f0', boxShadow: '0 20px 50px rgba(0,0,0,0.15)',
                  padding: 20, zIndex: 100, animation: 'fadeInUp 0.15s ease'
                }}>
                  <h4 style={{ fontSize: 14, fontWeight: 800, color: '#0f172a', marginBottom: 12 }}>Filter Products</h4>
                  
                  <div style={{ marginBottom: 12 }}>
                    <label style={lblStyle}>Action Status</label>
                    <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} style={inpStyle}>
                      <option value="">All Status</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                      <option value="pending">Pending</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
                    <div>
                      <label style={lblStyle}>From Date</label>
                      <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)} style={inpStyle} />
                    </div>
                    <div>
                      <label style={lblStyle}>To Date</label>
                      <input type="date" value={toDate} onChange={e => setToDate(e.target.value)} style={inpStyle} />
                    </div>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={lblStyle}>Sort By</label>
                    <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={inpStyle}>
                      <option>Newest First</option>
                      <option>Oldest First</option>
                      <option>Highest Price</option>
                      <option>Lowest Price</option>
                    </select>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={handleApplyFilter} style={{ flex: 1, padding: '10px', borderRadius: 12, background: 'linear-gradient(135deg, #f97316, #eab308)', color: 'white', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: 13 }}>Apply</button>
                    <button onClick={handleResetFilter} style={{ padding: '10px 14px', borderRadius: 12, border: '1.5px solid #e2e8f0', background: 'white', color: '#475569', fontWeight: 700, cursor: 'pointer', fontSize: 13 }}>Reset</button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* TABLE */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14, minWidth: 1000 }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                  {['Product', 'Seller', 'City', 'Product Price', 'Listed Date', 'Action', 'Actioned By', 'Actioned Date & Time'].map(h => (
                    <th key={h} style={{ paddingBottom: 12, fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'left' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {actions.map((act, i) => (
                  <tr key={i} style={{ borderBottom: '1px solid #f8fafc' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#fcf8f2'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '14px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <img src={act.img} alt={act.title} style={{ width: 52, height: 52, borderRadius: 12, objectFit: 'cover', border: '1px solid #e2e8f0' }} />
                        <div>
                          <h4 style={{ fontWeight: 800, color: '#1e293b', fontSize: 14 }}>{act.title}</h4>
                          <p style={{ color: '#64748b', fontSize: 12, marginTop: 1 }}>{act.category}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ color: '#334155', fontWeight: 600 }}>{act.seller}</td>
                    <td style={{ color: '#334155' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                        <MapPin size={13} color="#f97316" />
                        {act.city}
                      </div>
                    </td>
                    <td>
                      <span style={{ padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 800, background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe' }}>{act.price}</span>
                    </td>
                    <td style={{ color: '#64748b' }}>{act.date}</td>
                    <td>
                      <span style={actionStyle(act.action)}>{act.action}</span>
                    </td>
                    <td style={{ fontWeight: 600, color: '#475569' }}>{act.actionedBy}</td>
                    <td style={{ color: '#64748b', fontSize: 13 }}>{act.actionedTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      <style>{`
        @media (max-width: 1100px) {
          .charts-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}

const lblStyle = { display: 'block', fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 };
const inpStyle = { width: '100%', padding: '8px 12px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: 13, outline: 'none', background: '#f8fafc' };

const actionStyle = (action) => {
  const isApproved = action === 'approved';
  const isRejected = action === 'rejected';
  return {
    display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700,
    background: isApproved ? '#dcfce7' : isRejected ? '#fee2e2' : '#fef3c7',
    color: isApproved ? '#16a34a' : isRejected ? '#dc2626' : '#d97706',
  };
};
