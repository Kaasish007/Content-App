import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from './supabase';

const rewards = [
  { id: 1, name: '1 Week Creator Plan', icon: '🎁', cost: 50, description: 'Unlock Creator plan features for 7 days' },
  { id: 2, name: 'Creator Spotlight', icon: '🔦', cost: 30, description: 'Your post pinned to top of Canvas for 24 hours' },
  { id: 3, name: 'AI Power Mode', icon: '⚡', cost: 20, description: 'Bigger word limits and faster generation for 3 days' },
  { id: 4, name: 'Verified Creator Badge', icon: '✅', cost: 100, description: 'Special checkmark on your profile forever' },
  { id: 5, name: 'Exclusive Canvas Theme', icon: '🎨', cost: 25, description: 'Unlock a unique theme for your Canvas profile' },
];

function Stars({ user, onClose }) {
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('Overview');
  const [redeeming, setRedeeming] = useState(null);

  useEffect(() => {
    loadStars();
  }, []);

  const loadStars = async () => {
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      const [balanceRes, historyRes] = await Promise.all([
        axios.get(`${process.env.REACT_APP_API_URL}/api/stars/balance`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${process.env.REACT_APP_API_URL}/api/stars/history`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setBalance(balanceRes.data.balance);
      setHistory(historyRes.data.history);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRedeem = async (reward) => {
    if (balance < reward.cost) return alert('Not enough stars!');
    setRedeeming(reward.id);
    setTimeout(() => {
      alert(`🎉 Successfully redeemed: ${reward.name}!`);
      setRedeeming(null);
    }, 1500);
  };

  const reasonLabels = {
    daily_login: '📅 Daily Login',
    post_published: '📝 Post Published',
    likes_milestone: '❤️ Likes Milestone',
    gifted: '🎁 Gift Received',
    redeemed: '🛍️ Redeemed Reward'
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={onClose}>
      <div style={{
        background: '#0f172a', borderRadius: '16px', width: '700px',
        maxHeight: '85vh', overflow: 'hidden', border: '1px solid #334155',
        display: 'flex', flexDirection: 'column'
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #1e293b, #0f172a)',
          padding: '24px 32px', borderBottom: '1px solid #334155',
          display: 'flex', justifyContent: 'space-between', alignItems: 'center'
        }}>
          <div>
            <h2 style={{ margin: 0, color: 'white', fontSize: '22px' }}>⭐ Stars</h2>
            <p style={{ margin: '4px 0 0', color: '#94a3b8', fontSize: '14px' }}>Earn stars, redeem rewards</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              background: '#1e293b', borderRadius: '12px', padding: '12px 20px',
              textAlign: 'center', border: '1px solid #fbbf2444'
            }}>
              <p style={{ margin: 0, color: '#fbbf24', fontSize: '28px', fontWeight: 700 }}>{balance}</p>
              <p style={{ margin: 0, color: '#94a3b8', fontSize: '12px' }}>Total Stars</p>
            </div>
            <button onClick={onClose} style={{
              background: '#334155', border: 'none', color: 'white',
              borderRadius: '50%', width: '32px', height: '32px',
              cursor: 'pointer', fontSize: '16px'
            }}>×</button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '4px', padding: '16px 32px 0', borderBottom: '1px solid #334155' }}>
          {['Overview', 'History', 'Redeem'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '8px 20px', border: 'none', cursor: 'pointer',
                background: 'transparent', fontSize: '14px', fontWeight: 500,
                color: activeTab === tab ? '#60a5fa' : '#94a3b8',
                borderBottom: activeTab === tab ? '2px solid #60a5fa' : '2px solid transparent',
                transition: 'all 0.2s'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 32px' }}>

          {activeTab === 'Overview' && (
            <div>
              <h3 style={{ color: 'white', margin: '0 0 16px' }}>How to Earn Stars</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { icon: '📅', action: 'Daily Login', stars: '+1 star', desc: 'Log in every day to earn stars' },
                  { icon: '📝', action: 'Publish Content', stars: '+2 stars', desc: 'Publish to The Canvas' },
                  { icon: '❤️', action: 'Get 10 Likes', stars: '+5 stars', desc: 'When your post reaches 10 likes' },
                  { icon: '❤️', action: 'Get 50 Likes', stars: '+15 stars', desc: 'When your post reaches 50 likes' },
                  { icon: '❤️', action: 'Get 100 Likes', stars: '+30 stars', desc: 'When your post reaches 100 likes' },
                  { icon: '🎁', action: 'Receive Star Gift', stars: 'Varies', desc: 'When another user gifts you stars' },
                ].map(item => (
                  <div key={item.action} style={{
                    background: '#1e293b', borderRadius: '10px', padding: '14px 16px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    border: '1px solid #334155'
                  }}>
                    <span style={{ fontSize: '24px' }}>{item.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, color: 'white', fontWeight: 600, fontSize: '14px' }}>{item.action}</p>
                      <p style={{ margin: '2px 0 0', color: '#94a3b8', fontSize: '12px' }}>{item.desc}</p>
                    </div>
                    <span style={{
                      color: '#fbbf24', fontWeight: 700, fontSize: '14px',
                      background: '#fbbf2422', padding: '4px 10px', borderRadius: '20px'
                    }}>
                      {item.stars}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'History' && (
            <div>
              <h3 style={{ color: 'white', margin: '0 0 16px' }}>Star History</h3>
              {history.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px', color: '#475569' }}>
                  No star history yet — start earning! ⭐
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {history.map(item => (
                    <div key={item.id} style={{
                      background: '#1e293b', borderRadius: '8px', padding: '12px 16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      border: '1px solid #334155'
                    }}>
                      <div>
                        <p style={{ margin: 0, color: 'white', fontSize: '14px' }}>
                          {reasonLabels[item.reason] || item.reason}
                        </p>
                        <p style={{ margin: '2px 0 0', color: '#475569', fontSize: '12px' }}>
                          {new Date(item.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span style={{
                        color: item.type === 'earned' || item.type === 'received' ? '#10b981' : '#ef4444',
                        fontWeight: 700, fontSize: '16px'
                      }}>
                        {item.type === 'earned' || item.type === 'received' ? '+' : '-'}{item.amount} ⭐
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'Redeem' && (
            <div>
              <h3 style={{ color: 'white', margin: '0 0 4px' }}>Redeem Rewards</h3>
              <p style={{ color: '#94a3b8', fontSize: '14px', margin: '0 0 16px' }}>
                You have <strong style={{ color: '#fbbf24' }}>{balance} stars</strong> to spend
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {rewards.map(reward => (
                  <div key={reward.id} style={{
                    background: '#1e293b', borderRadius: '10px', padding: '16px',
                    display: 'flex', alignItems: 'center', gap: '12px',
                    border: `1px solid ${balance >= reward.cost ? '#334155' : '#1e293b'}`,
                    opacity: balance >= reward.cost ? 1 : 0.6
                  }}>
                    <span style={{ fontSize: '28px' }}>{reward.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, color: 'white', fontWeight: 600, fontSize: '14px' }}>{reward.name}</p>
                      <p style={{ margin: '2px 0 0', color: '#94a3b8', fontSize: '12px' }}>{reward.description}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: '0 0 6px', color: '#fbbf24', fontWeight: 700 }}>{reward.cost} ⭐</p>
                      <button
                        onClick={() => handleRedeem(reward)}
                        disabled={balance < reward.cost || redeeming === reward.id}
                        style={{
                          padding: '6px 16px',
                          background: balance >= reward.cost ? '#3b82f6' : '#334155',
                          color: 'white', border: 'none', borderRadius: '6px',
                          cursor: balance >= reward.cost ? 'pointer' : 'not-allowed',
                          fontSize: '13px'
                        }}
                      >
                        {redeeming === reward.id ? '⏳' : 'Redeem'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Stars;