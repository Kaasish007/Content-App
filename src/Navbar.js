import React, { useState } from 'react';

function Navbar({ user, onLogout, activeTab, setActiveTab }) {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: '#0f172a', borderBottom: '1px solid #1e293b',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', height: '60px'
    }}>

      {/* Left — Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
          ✨ ContentAI
        </h1>

        {/* Center Tabs */}
        <div style={{ display: 'flex', gap: '4px', background: '#1e293b', borderRadius: '8px', padding: '4px' }}>
          {['Content Generation', 'Manual Writing'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '6px 16px', borderRadius: '6px', border: 'none',
                background: activeTab === tab ? '#3b82f6' : 'transparent',
                color: activeTab === tab ? 'white' : '#94a3b8',
                cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                transition: 'all 0.2s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Center — Nav Links */}
      <div style={{ display: 'flex', gap: '24px' }}>
        {['Explore', 'About Us', 'The Canvas'].map(link => (
          <span
            key={link}
            style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '14px', fontWeight: 500, transition: 'color 0.2s' }}
            onMouseEnter={e => e.target.style.color = '#60a5fa'}
            onMouseLeave={e => e.target.style.color = '#94a3b8'}
          >
            {link}
          </span>
        ))}
      </div>

      {/* Right — Search + Settings + Avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>

        {/* Search Bar */}
        <div style={{ position: 'relative' }}>
          <input
            placeholder="🔍 Search..."
            style={{
              background: '#1e293b', border: '1px solid #334155', borderRadius: '8px',
              padding: '6px 12px', color: 'white', fontSize: '13px', width: '180px',
              outline: 'none'
            }}
          />
        </div>

        {/* Settings */}
        <div style={{ fontSize: '20px', cursor: 'pointer', color: '#94a3b8' }}
          onMouseEnter={e => e.target.style.color = '#60a5fa'}
          onMouseLeave={e => e.target.style.color = '#94a3b8'}
        >
          ⚙️
        </div>

        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <div
            onClick={() => setShowProfile(!showProfile)}
            style={{
              width: '36px', height: '36px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '16px', cursor: 'pointer',
              border: '2px solid #334155'
            }}
          >
            {user?.email?.[0]?.toUpperCase()}
          </div>

          {/* Dropdown */}
          {showProfile && (
            <div style={{
              position: 'absolute', right: 0, top: '44px', background: '#1e293b',
              border: '1px solid #334155', borderRadius: '12px', padding: '8px',
              minWidth: '200px', zIndex: 1001
            }}>
              <div style={{ padding: '8px 12px', color: '#94a3b8', fontSize: '12px', borderBottom: '1px solid #334155', marginBottom: '4px' }}>
                {user?.email}
              </div>
              {['Your Works', 'Skill Set', 'Interests', 'About Me', 'Subscription', 'Favourites'].map(item => (
                <div
                  key={item}
                  style={{ padding: '8px 12px', color: '#e2e8f0', fontSize: '14px', cursor: 'pointer', borderRadius: '6px' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#334155'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                >
                  {item}
                </div>
              ))}
              <div
                onClick={onLogout}
                style={{ padding: '8px 12px', color: '#f87171', fontSize: '14px', cursor: 'pointer', borderRadius: '6px', borderTop: '1px solid #334155', marginTop: '4px' }}
                onMouseEnter={e => e.currentTarget.style.background = '#334155'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                🚪 Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;