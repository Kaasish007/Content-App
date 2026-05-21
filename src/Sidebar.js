import React from 'react';

const platforms = [
  { name: 'YouTube', icon: '🎥', color: '#ef4444' },
  { name: 'LinkedIn', icon: '💼', color: '#3b82f6' },
  { name: 'Blog', icon: '📝', color: '#10b981' },
  { name: 'Twitter', icon: '🐦', color: '#38bdf8' },
  { name: 'Instagram', icon: '📸', color: '#a855f7' },
];

function Sidebar({ activePlatform, setActivePlatform, onCanvasClick, starBalance, onStarsClick }) {
  return (
    <div style={{
      position: 'fixed', left: 0, top: '60px', bottom: 0,
      width: '220px', background: '#0f172a',
      borderRight: '1px solid #1e293b', padding: '24px 12px',
      display: 'flex', flexDirection: 'column', gap: '8px'
    }}>

      <p style={{ color: '#475569', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px 8px' }}>
        Platforms
      </p>

      {platforms.map(platform => (
        <div
          key={platform.name}
          onClick={() => setActivePlatform(platform.name)}
          style={{
            display: 'flex', alignItems: 'center', gap: '12px',
            padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
            background: activePlatform === platform.name ? `${platform.color}22` : 'transparent',
            border: activePlatform === platform.name ? `1px solid ${platform.color}44` : '1px solid transparent',
            transition: 'all 0.2s'
          }}
          onMouseEnter={e => {
            if (activePlatform !== platform.name) {
              e.currentTarget.style.background = '#1e293b';
            }
          }}
          onMouseLeave={e => {
            if (activePlatform !== platform.name) {
              e.currentTarget.style.background = 'transparent';
            }
          }}
        >
          <span style={{ fontSize: '20px' }}>{platform.icon}</span>
          <span style={{
            color: activePlatform === platform.name ? platform.color : '#94a3b8',
            fontSize: '14px', fontWeight: activePlatform === platform.name ? 600 : 400
          }}>
            {platform.name}
          </span>
          {activePlatform === platform.name && (
            <div style={{
              marginLeft: 'auto', width: '6px', height: '6px',
              borderRadius: '50%', background: platform.color
            }} />
          )}
        </div>
      ))}

      <div style={{ borderTop: '1px solid #1e293b', margin: '8px 0' }} />

      <p style={{ color: '#475569', fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 8px 8px' }}>
        Community
      </p>

      <div
        onClick={onCanvasClick}
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{ fontSize: '20px' }}>🎨</span>
        <span style={{ color: '#94a3b8', fontSize: '14px' }}>The Canvas</span>
      </div>

      <div
        style={{
          display: 'flex', alignItems: 'center', gap: '12px',
          padding: '10px 12px', borderRadius: '10px', cursor: 'pointer',
          transition: 'all 0.2s'
        }}
        onMouseEnter={e => e.currentTarget.style.background = '#1e293b'}
        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
      >
        <span style={{ fontSize: '20px' }}>🏆</span>
        <span style={{ color: '#94a3b8', fontSize: '14px' }}>Leaderboard</span>
      </div>

      <div
        onClick={onStarsClick}
        style={{ marginTop: 'auto', background: '#1e293b', borderRadius: '10px', padding: '12px', cursor: 'pointer' }}
      >
        <p style={{ margin: 0, color: '#fbbf24', fontSize: '13px', fontWeight: 600 }}>⭐ Your Stars</p>
        <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '12px' }}>{starBalance || 0} stars earned</p>
      </div>
    </div>
  );
}

export default Sidebar;