import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { sendOtp, verifyOtp } from '../api/panelService';

export default function LoginPage() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState('phone'); // 'phone' | 'otp'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const otpRefs = useRef([]);
  const { login } = useAuth();
  const navigate = useNavigate();

  /* bubble animation */
  useEffect(() => {
    const container = document.getElementById('bubble-container');
    if (!container) return;
    const colors = ['#7c3aed22', '#5b21b622', '#06b6d422', '#8b5cf622'];
    const bubbles = [];
    for (let i = 0; i < 18; i++) {
      const b = document.createElement('div');
      const size = Math.random() * 80 + 30;
      Object.assign(b.style, {
        position: 'absolute',
        width: size + 'px', height: size + 'px',
        borderRadius: '50%',
        background: colors[Math.floor(Math.random() * colors.length)],
        left: Math.random() * 100 + '%',
        bottom: '-80px',
        animation: `bubbleRise ${Math.random() * 10 + 8}s ease-in ${Math.random() * 6}s infinite`,
      });
      container.appendChild(b);
      bubbles.push(b);
    }
    return () => bubbles.forEach(b => b.remove());
  }, []);

  /* resend countdown */
  useEffect(() => {
    if (countdown <= 0) return;
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError('');
    if (!/^\d{10}$/.test(phone)) { setError('Enter a valid 10-digit phone number'); return; }
    setLoading(true);
    try {
      await sendOtp(phone);
      setStep('otp');
      setCountdown(30);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to send OTP. Try again.');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError('');
    const otpStr = otp.join('');
    if (otpStr.length !== 6) { setError('Enter all 6 digits of the OTP'); return; }
    setLoading(true);
    try {
      const res = await verifyOtp(phone, otpStr);
      const resData = res.data?.data || res.data;
      const token = resData.token || resData.accessToken;
      const user = resData.user;
      login(token, user);
      navigate('/dashboard');
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally { setLoading(false); }
  };

  const handleOtpInput = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[i] = val;
    setOtp(next);
    if (val && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const handleOtpKeyDown = (i, e) => {
    if (e.key === 'Backspace' && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: 16, background: '#f1f5f9', position: 'relative', overflow: 'hidden',
      fontFamily: "'Rajdhani', sans-serif",
    }}>
      <div id="bubble-container" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{
        background: 'rgba(255,255,255,0.88)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.55)', borderRadius: 28,
        boxShadow: '0 25px 60px rgba(90,50,163,0.18)', width: '100%', maxWidth: 420,
        padding: '36px 32px', position: 'relative', zIndex: 10,
        animation: 'fadeInUp 0.45s ease both',
      }}>
        {/* LOGO */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 80, height: 80, borderRadius: 18, padding: 6, overflow: 'hidden',
            border: '1px solid rgba(255,255,255,0.2)', boxShadow: '0 8px 20px rgba(90,50,163,0.2)',
            marginBottom: 8,
          }}>
            <img src="/logo.png" alt="MXM" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: 12 }} />
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#5a32a3', letterSpacing: '-0.5px', lineHeight: 1 }}>
            Machine Exchange Mart
          </h1>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 6, fontWeight: 500 }}>
            {step === 'phone' ? 'Enter your phone number to continue' : `OTP sent to +91 ${phone}`}
          </p>
        </div>

        {/* ERROR */}
        {error && (
          <div style={{
            background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626',
            borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 600, marginBottom: 16,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* PHONE STEP */}
        {step === 'phone' && (
          <form onSubmit={handleSendOtp} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 6 }}>
                Phone Number
              </label>
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontSize: 18 }}>📱</span>
                <input
                  type="tel" maxLength={10} value={phone}
                  onChange={e => setPhone(e.target.value.replace(/\D/, ''))}
                  placeholder="10-digit mobile number"
                  style={{
                    width: '100%', paddingLeft: 44, paddingRight: 16, paddingTop: 12, paddingBottom: 12,
                    border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: 16, outline: 'none',
                    background: 'white', transition: 'border 0.2s, box-shadow 0.2s',
                    fontFamily: 'Inter, sans-serif',
                  }}
                  onFocus={e => { e.target.style.borderColor = '#5a32a3'; e.target.style.boxShadow = '0 0 0 3px rgba(90,50,163,0.1)'; }}
                  onBlur={e => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{
              background: loading ? '#9c7cd4' : 'linear-gradient(135deg, #5a32a3, #7c3aed)',
              color: 'white', fontWeight: 700, fontSize: 16, padding: '13px 24px',
              borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 20px rgba(90,50,163,0.3)', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {loading ? <><span>Sending</span><LoadingSpinner /></> : <><span>Send OTP</span> 📲</>}
            </button>
          </form>
        )}

        {/* OTP STEP */}
        {step === 'otp' && (
          <form onSubmit={handleVerifyOtp} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12, textAlign: 'center' }}>
                Enter 6-Digit OTP
              </label>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                {otp.map((digit, i) => (
                  <input
                    key={i} ref={el => otpRefs.current[i] = el}
                    type="text" inputMode="numeric" maxLength={1} value={digit}
                    onChange={e => handleOtpInput(i, e.target.value)}
                    onKeyDown={e => handleOtpKeyDown(i, e)}
                    style={{
                      width: 50, height: 56, textAlign: 'center', fontSize: 22, fontWeight: 700,
                      border: '2px solid ' + (digit ? '#5a32a3' : '#dbe3ef'),
                      borderRadius: 12, outline: 'none', background: 'white', transition: '0.2s',
                      boxShadow: digit ? '0 0 0 3px rgba(90,50,163,0.1)' : 'none',
                    }}
                    onFocus={e => { e.target.style.borderColor = '#5a32a3'; e.target.style.boxShadow = '0 0 0 3px rgba(90,50,163,0.12)'; }}
                    onBlur={e => { if (!e.target.value) { e.target.style.borderColor = '#dbe3ef'; e.target.style.boxShadow = 'none'; } }}
                  />
                ))}
              </div>
            </div>

            <button type="submit" disabled={loading} style={{
              background: loading ? '#9c7cd4' : 'linear-gradient(135deg, #5a32a3, #7c3aed)',
              color: 'white', fontWeight: 700, fontSize: 16, padding: '13px 24px',
              borderRadius: 12, border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: '0 8px 20px rgba(90,50,163,0.3)', transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              {loading ? <><span>Verifying</span><LoadingSpinner /></> : <><span>Verify & Login</span> 🔓</>}
            </button>

            <div style={{ textAlign: 'center' }}>
              {countdown > 0 ? (
                <p style={{ fontSize: 13, color: '#94a3b8' }}>Resend OTP in <strong style={{ color: '#5a32a3' }}>{countdown}s</strong></p>
              ) : (
                <button type="button" onClick={() => { setStep('phone'); setOtp(['','','','','','']); setError(''); }} style={{
                  background: 'none', border: 'none', color: '#5a32a3', fontWeight: 600, fontSize: 13, cursor: 'pointer',
                }}>← Change Number / Resend OTP</button>
              )}
            </div>
          </form>
        )}

        <p style={{ textAlign: 'center', fontSize: 10, color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: 24 }}>
          © 2026 Machine Exchange Mart (MXM). All rights reserved
        </p>
      </div>
    </div>
  );
}

function LoadingSpinner() {
  return (
    <div style={{
      width: 18, height: 18, border: '2px solid rgba(255,255,255,0.4)',
      borderTopColor: 'white', borderRadius: '50%',
      animation: 'spin 0.7s linear infinite',
    }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
