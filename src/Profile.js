import React, { useState } from 'react';

function Profile({ user, onClose }) {
  const [activeSection, setActiveSection] = useState('About Me');

  const sections = ['About Me', 'Skill Set', 'Interests', 'Your Works', 'Favourites', 'Subscription'];

  const sectionIcons = {
    'About Me': '👤',
    'Skill Set': '🛠️',
    'Interests': '💡',
    'Your Works': '📁',
    'Favourites': '❤️',
    'Subscription': '💎'
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }}
      onClick={onClose}
    >
      <div
        style={{
          background: '#0f172a', borderRadius: '16px', width: '800px',
          maxHeight: '85vh', overflow: 'hidden', border: '1px solid #334155',
          display: 'flex', flexDirection: 'column'
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Profile Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          padding: '32px', borderBottom: '1px solid #334155',
          position: 'relative'
        }}>
          <button
            onClick={onClose}
            style={{
              position: 'absolute', top: '16px', right: '16px',
              background: '#334155', border: 'none', color: 'white',
              borderRadius: '50%', width: '32px', height: '32px',
              cursor: 'pointer', fontSize: '16px'
            }}
          >×</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            {/* Avatar */}
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 700, fontSize: '36px',
              border: '3px solid #334155'
            }}>
              {user?.email?.[0]?.toUpperCase()}
            </div>

            <div>
              <h2 style={{ margin: 0, color: 'white', fontSize: '22px' }}>
                {user?.email?.split('@')[0]}
              </h2>
              <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '14px' }}>
                {user?.email}
              </p>
              <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                <span style={{
                  padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                  background: '#1e293b', color: '#60a5fa', border: '1px solid #334155'
                }}>
                  🌱 Newcomer
                </span>
                <span style={{
                  padding: '3px 10px', borderRadius: '20px', fontSize: '12px',
                  background: '#1e293b', color: '#fbbf24', border: '1px solid #334155'
                }}>
                  ✏️ Spark Plan
                </span>
              </div>
            </div>

            {/* Stats */}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '24px' }}>
              {[
                { label: 'Posts', value: '0' },
                { label: 'Followers', value: '0' },
                { label: 'Following', value: '0' },
                { label: 'Stars', value: '0' },
              ].map(stat => (
                <div key={stat.label} style={{ textAlign: 'center' }}>
                  <p style={{ margin: 0, color: 'white', fontWeight: 700, fontSize: '20px' }}>{stat.value}</p>
                  <p style={{ margin: '2px 0 0', color: '#94a3b8', fontSize: '12px' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* Left Nav */}
          <div style={{
            width: '200px', borderRight: '1px solid #334155',
            padding: '16px 8px', display: 'flex', flexDirection: 'column', gap: '4px'
          }}>
            {sections.map(section => (
              <div
                key={section}
                onClick={() => setActiveSection(section)}
                style={{
                  padding: '10px 12px', borderRadius: '8px', cursor: 'pointer',
                  background: activeSection === section ? '#1e293b' : 'transparent',
                  color: activeSection === section ? '#60a5fa' : '#94a3b8',
                  fontSize: '13px', fontWeight: activeSection === section ? 600 : 400,
                  display: 'flex', alignItems: 'center', gap: '8px',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => {
                  if (activeSection !== section) e.currentTarget.style.background = '#1e293b';
                }}
                onMouseLeave={e => {
                  if (activeSection !== section) e.currentTarget.style.background = 'transparent';
                }}
              >
                {sectionIcons[section]} {section}
              </div>
            ))}
          </div>

          {/* Right Content */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>

            {activeSection === 'About Me' && (
              <div>
                <h3 style={{ color: 'white', margin: '0 0 16px' }}>👤 About Me</h3>
                <textarea
                  placeholder="Tell the world about yourself... What do you create? What drives you?"
                  style={{
                    width: '100%', height: '120px', background: '#1e293b',
                    border: '1px solid #334155', borderRadius: '8px',
                    color: 'white', padding: '12px', fontSize: '14px',
                    resize: 'none', boxSizing: 'border-box'
                  }}
                />
                <button style={{
                  marginTop: '12px', padding: '8px 20px',
                  background: '#3b82f6', color: 'white', border: 'none',
                  borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
                }}>
                  Save
                </button>
              </div>
            )}

            {activeSection === 'Skill Set' && (
              <div>
                <h3 style={{ color: 'white', margin: '0 0 16px' }}>🛠️ Skill Set</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>Add your skills so others know what you're great at!</p>
                <input
                  placeholder="e.g. Content Writing, Social Media, SEO..."
                  style={{
                    width: '100%', padding: '12px', background: '#1e293b',
                    border: '1px solid #334155', borderRadius: '8px',
                    color: 'white', fontSize: '14px', boxSizing: 'border-box'
                  }}
                />
                <button style={{
                  marginTop: '12px', padding: '8px 20px',
                  background: '#3b82f6', color: 'white', border: 'none',
                  borderRadius: '8px', cursor: 'pointer', fontSize: '14px'
                }}>
                  Add Skill
                </button>
              </div>
            )}

            {activeSection === 'Interests' && (
              <div>
                <h3 style={{ color: 'white', margin: '0 0 16px' }}>💡 Interests</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>What topics excite you? This helps us personalize your Canvas feed!</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '12px' }}>
                  {['AI & Tech', 'Marketing', 'Design', 'Business', 'Education', 'Health', 'Finance', 'Sports', 'Music', 'Travel'].map(interest => (
                    <span
                      key={interest}
                      style={{
                        padding: '6px 14px', borderRadius: '20px', fontSize: '13px',
                        background: '#1e293b', color: '#94a3b8',
                        border: '1px solid #334155', cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = '#3b82f622';
                        e.currentTarget.style.color = '#60a5fa';
                        e.currentTarget.style.borderColor = '#3b82f6';
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = '#1e293b';
                        e.currentTarget.style.color = '#94a3b8';
                        e.currentTarget.style.borderColor = '#334155';
                      }}
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'Your Works' && (
              <div>
                <h3 style={{ color: 'white', margin: '0 0 16px' }}>📁 Your Works</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>Your published content will appear here!</p>
                <div style={{
                  background: '#1e293b', borderRadius: '8px', padding: '32px',
                  textAlign: 'center', border: '1px dashed #334155', marginTop: '12px'
                }}>
                  <p style={{ color: '#475569', fontSize: '14px' }}>No works yet — start creating! 🎨</p>
                </div>
              </div>
            )}

            {activeSection === 'Favourites' && (
              <div>
                <h3 style={{ color: 'white', margin: '0 0 16px' }}>❤️ Favourites</h3>
                <p style={{ color: '#94a3b8', fontSize: '14px' }}>Posts you love will be saved here!</p>
                <div style={{
                  background: '#1e293b', borderRadius: '8px', padding: '32px',
                  textAlign: 'center', border: '1px dashed #334155', marginTop: '12px'
                }}>
                  <p style={{ color: '#475569', fontSize: '14px' }}>No favourites yet — explore The Canvas! 🎨</p>
                </div>
              </div>
            )}

            {activeSection === 'Subscription' && (
              <div>
                <h3 style={{ color: 'white', margin: '0 0 16px' }}>💎 Subscription</h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                  {[
                    { name: 'Spark', price: 'Free', color: '#94a3b8', current: true },
                    { name: 'Creator', price: '₹299/mo', color: '#3b82f6', current: false },
                    { name: 'Masterpiece', price: '₹999/mo', color: '#a855f7', current: false },
                  ].map(plan => (
                    <div key={plan.name} style={{
                      flex: 1, background: '#1e293b', borderRadius: '10px',
                      padding: '16px', border: `1px solid ${plan.current ? plan.color : '#334155'}`,
                      textAlign: 'center'
                    }}>
                      <p style={{ margin: 0, color: plan.color, fontWeight: 700, fontSize: '16px' }}>{plan.name}</p>
                      <p style={{ margin: '4px 0 12px', color: '#94a3b8', fontSize: '14px' }}>{plan.price}</p>
                      {plan.current ? (
                        <span style={{ color: '#10b981', fontSize: '12px' }}>✅ Current Plan</span>
                      ) : (
                        <button style={{
                          padding: '6px 16px', background: plan.color,
                          color: 'white', border: 'none', borderRadius: '6px',
                          cursor: 'pointer', fontSize: '12px'
                        }}>
                          Upgrade
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;