import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, KeyRound, CheckCircle2, Eye, EyeOff, ArrowRight } from 'lucide-react';

export default function ChangePasswordPage() {
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (confirmPass && newPass !== confirmPass) {
      setErrorMsg(true);
    } else {
      setErrorMsg(false);
    }
  }, [newPass, confirmPass]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      alert("Passwords do not match!");
      return;
    }
    alert("Password updated successfully!");
    navigate('/dashboard');
  };

  // Bubble animation setup
  useEffect(() => {
    const container = document.getElementById("bubble-container");
    if (!container) return;

    const bubbles = [];
    const colors = ["bg-purple-300", "bg-teal-200", "bg-pink-300", "bg-orange-200", "bg-cyan-200"];

    class Bubble {
      constructor() {
        this.element = document.createElement("div");
        this.element.className = "absolute rounded-full mix-blend-multiply filter blur-3xl opacity-40";
        const color = colors[Math.floor(Math.random() * colors.length)];
        this.radius = 200 + Math.random() * 100;
        this.element.classList.add(color);
        this.element.style.width = `${this.radius}px`;
        this.element.style.height = `${this.radius}px`;
        this.x = Math.random() * (window.innerWidth - this.radius);
        this.y = Math.random() * (window.innerHeight - this.radius);
        this.vx = (Math.random() - 0.5) * 4;
        this.vy = (Math.random() - 0.5) * 4;
        container.appendChild(this.element);
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x + this.radius > window.innerWidth || this.x < 0) this.vx *= -1;
        if (this.y + this.radius > window.innerHeight || this.y < 0) this.vy *= -1;
        this.element.style.transform = `translate(${this.x}px, ${this.y}px)`;
      }
    }

    for (let i = 0; i < 6; i++) {
      bubbles.push(new Bubble());
    }

    let animationId;
    const animate = () => {
      bubbles.forEach(b => b.update());
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      container.innerHTML = '';
    };
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}>
      
      {/* Dynamic Bubbles */}
      <div id="bubble-container" style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }} />

      {/* Form Card */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        boxShadow: '0 25px 50px -12px rgba(90, 50, 163, 0.2)',
        width: '100%', maxWidth: 440, borderRadius: 28, padding: '32px 24px', position: 'relative', zIndex: 10
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center',
            width: 60, height: 60, background: '#5a32a3', borderRadius: 20, marginBottom: 16,
            boxShadow: '0 12px 24px rgba(90, 50, 163, 0.25)'
          }}>
            <ShieldAlert size={28} color="white" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: '#1e293b' }}>Update Security</h1>
          <p style={{ color: '#64748b', fontSize: 13, marginTop: 4 }}>Please enter details below to change password</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* New Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>New Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', left: 14 }}>
                <KeyRound size={16} color="#94a3b8" />
              </div>
              <input
                type={showNew ? 'text' : 'password'}
                value={newPass}
                onChange={e => setNewPass(e.target.value)}
                required
                placeholder="Create new password"
                style={{
                  width: '100%', padding: '12px 40px 12px 42px', borderRadius: 14,
                  border: '1.5px solid #e2e8f0', background: 'rgba(255, 255, 255, 0.7)',
                  outline: 'none', fontSize: 14, transition: 'all 0.2s'
                }}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                style={{ position: 'absolute', right: 14, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showNew ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
              </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <label style={{ fontSize: 10, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Confirm New Password</label>
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div style={{ position: 'absolute', left: 14 }}>
                <CheckCircle2 size={16} color="#94a3b8" />
              </div>
              <input
                type={showConfirm ? 'text' : 'password'}
                value={confirmPass}
                onChange={e => setConfirmPass(e.target.value)}
                required
                placeholder="Repeat new password"
                style={{
                  width: '100%', padding: '12px 40px 12px 42px', borderRadius: 14,
                  border: `1.5px solid ${errorMsg ? '#ef4444' : '#e2e8f0'}`, background: 'rgba(255, 255, 255, 0.7)',
                  outline: 'none', fontSize: 14, transition: 'all 0.2s'
                }}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                style={{ position: 'absolute', right: 14, background: 'none', border: 'none', cursor: 'pointer' }}
              >
                {showConfirm ? <EyeOff size={16} color="#94a3b8" /> : <Eye size={16} color="#94a3b8" />}
              </button>
            </div>
            {errorMsg && (
              <p style={{ fontSize: 11, color: '#ef4444', fontWeight: 600, marginTop: 4, fontStyle: 'italic' }}>Passwords do not match!</p>
            )}
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button
              type="button"
              onClick={() => navigate('/dashboard')}
              style={{
                flex: 1, padding: '12px', borderRadius: 14, border: '1.5px solid #e2e8f0',
                background: 'white', color: '#475569', fontWeight: 700, fontSize: 14, cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                flex: 2, padding: '12px', borderRadius: 14, background: '#5a32a3',
                color: 'white', fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                boxShadow: '0 8px 20px rgba(90, 50, 163, 0.25)'
              }}
            >
              <span>Change Password</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </form>

        <div style={{ borderTop: '1px solid #e2e8f0', marginTop: 24, paddingTop: 18, textAlign: 'center' }}>
          <span style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
            © 2026 Machine Exchange Mart (MXM). All rights reserved
          </span>
        </div>
      </div>
    </div>
  );
}
