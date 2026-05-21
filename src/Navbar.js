import React from 'react';

function Navbar({ user, onLogout, activeTab, setActiveTab, onProfileClick, onDMClick }) {
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      background: '#0f172a', borderBottom: '1px solid #1e293b',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', height: '60px'
    }}>

      <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
        <h1 style={{ margin: 0, fontSize: '20px', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontWeight: 800 }}>
          ✨ ContentAI
        </h1>

        <div style={{ display: 'flex', gap: '4px', background: '#1e293b', borderRadius: '8px', padding: '4px' }}>
          {['Content Generation', 'Manual Writing'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '6px 16px', borderRadius: '6px', border: 'none',
                background: activeTab === tab ? '#3b82f6' : 'transparent',
                color: activeTab === tab ? 'white' : '#94a3b8',
                cursor: 'pointer', fontSize: '13px', fontWeight: 500
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px' }}>
        {['Explore', 'About Us', 'The Canvas'].map(link => (
          <span
            key={link}
            style={{ color: '#94a3b8', cursor: 'pointer', fontSize: '14px', fontWeight: 500 }}
          >
            {link}
          </span>
        ))}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <input
          placeholder="🔍 Search..."
          style={{
            background: '#1e293b', border: '1px solid #334155', borderRadius: '8px',
            padding: '6px 12px', color: 'white', fontSize: '13px', width: '180px',
            outline: 'none'
          }}
        />

        <button
          onClick={onDMClick}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#94a3b8' }}
        >
          💬
        </button>

        <button
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: '#94a3b8' }}
        >
          ⚙️
        </button>

        <div
          onClick={onProfileClick}
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
      </div>
    </div>
  );
}

export default Navbar;