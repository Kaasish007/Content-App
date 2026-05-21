import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase, logoutUser } from './supabase';
import Login from './Login';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './App.css';
import ManualEditor from './ManualEditor';
import Canvas from './Canvas';
import Profile from './Profile';
import DMs from './DMs';
import Stars from './Stars';


function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Content Generation');
  const [activePlatform, setActivePlatform] = useState('LinkedIn');
  const [text, setText] = useState('');
  const [outputs, setOutputs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeAudience, setAudience] = useState('Professional');
  const [showProfile, setShowProfile] = useState(false);
  const [showDMs, setShowDMs] = useState(false);
  const [starBalance, setStarBalance] = useState(0);
  const [showStars, setShowStars] = useState(false);

  const platformToOutput = {
    LinkedIn: 'linkedin',
    Twitter: 'twitter',
    Instagram: 'instagram',
    Blog: 'blog',
    YouTube: 'newsletter'
  };

  const platformColors = {
    YouTube: '#ef4444', LinkedIn: '#3b82f6',
    Blog: '#10b981', Twitter: '#38bdf8', Instagram: '#a855f7'
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
  setUser(session?.user ?? null);
  setAuthLoading(false);
  if (session?.user) {
    // Claim daily login star
    await axios.post(`${process.env.REACT_APP_API_URL}/api/stars/daily-login`, {}, {
      headers: { Authorization: `Bearer ${session.access_token}` }
    });
    // Get star balance
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/stars/balance`, {
      headers: { Authorization: `Bearer ${session.access_token}` }
    });
    setStarBalance(data.balance);
  }
});
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
  }, []);

  const handleGenerate = async () => {
    if (!text.trim()) return alert('Please enter some content!');
    setLoading(true);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/generate`, {
        rawText: text,
        platform: activePlatform,
        audience: activeAudience
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOutputs(res.data.outputs);
    } catch (err) {
      alert('Error generating content. Is your backend running?');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    const key = platformToOutput[activePlatform];
    navigator.clipboard.writeText(outputs[key]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await logoutUser();
    setOutputs(null);
    setText('');
  };

  if (authLoading) return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
      Loading...
    </div>
  );

  if (!user) return <Login onLogin={setUser} />;

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'sans-serif' }}>

      <Navbar
        user={user}
        onLogout={handleLogout}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onProfileClick={() => setShowProfile(true)}
        onDMClick={() => setShowDMs(true)}
      />

      <Sidebar
  activePlatform={activePlatform}
  setActivePlatform={(platform) => {
    setActivePlatform(platform);
    setOutputs(null);
    setText('');
    setActiveTab('Content Generation');
  }}
  onCanvasClick={() => setActiveTab('The Canvas')}
  starBalance={starBalance}
  onStarsClick={() => setShowStars(true)}
/>

      <div style={{ marginLeft: '220px', marginTop: '60px', padding: '32px' }}>

        <div style={{ marginBottom: '24px' }}>
          <h2 style={{ margin: 0, fontSize: '24px', color: platformColors[activePlatform] }}>
            {activePlatform === 'YouTube' && '🎥'}
            {activePlatform === 'LinkedIn' && '💼'}
            {activePlatform === 'Blog' && '📝'}
            {activePlatform === 'Twitter' && '🐦'}
            {activePlatform === 'Instagram' && '📸'}
            {' '}{activePlatform} Content
          </h2>
          <p style={{ margin: '4px 0 0', color: '#475569', fontSize: '14px' }}>
            Generate tailored content for {activePlatform}
          </p>
        </div>

        {activeTab === 'Content Generation' && (
          <div style={{ maxWidth: '800px' }}>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {['Professional', 'Student', 'Creator', 'Business'].map(audience => (
                <button
                  key={audience}
                  onClick={() => setAudience(audience)}
                  style={{
                    padding: '8px 16px', borderRadius: '8px', border: 'none',
                    cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                    background: activeAudience === audience ? platformColors[activePlatform] : '#1e293b',
                    color: activeAudience === audience ? 'white' : '#94a3b8',
                    transition: 'all 0.2s'
                  }}
                >
                  {audience === 'Professional' && '👔 '}
                  {audience === 'Student' && '🎓 '}
                  {audience === 'Creator' && '🎨 '}
                  {audience === 'Business' && '🏢 '}
                  {audience}
                </button>
              ))}
            </div>

            <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', marginBottom: '24px', border: `1px solid ${platformColors[activePlatform]}33` }}>
              <h3 style={{ margin: '0 0 16px', color: '#e2e8f0' }}>📝 Paste Your Content</h3>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder={`Paste your content here for ${activePlatform} — ${activeAudience} audience...`}
                style={{
                  width: '100%', height: '160px', background: '#0f172a',
                  color: 'white', border: '1px solid #334155', borderRadius: '8px',
                  padding: '12px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box'
                }}
              />
              <button
                onClick={handleGenerate}
                disabled={loading}
                style={{
                  marginTop: '12px', padding: '12px 32px',
                  background: loading ? '#475569' : platformColors[activePlatform],
                  color: 'white', border: 'none', borderRadius: '8px',
                  fontSize: '16px', cursor: loading ? 'not-allowed' : 'pointer', width: '100%'
                }}
              >
                {loading ? '⏳ Generating...' : `🚀 Generate ${activePlatform} Content for ${activeAudience}s`}
              </button>
            </div>

            {outputs && (
              <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', border: `1px solid ${platformColors[activePlatform]}33` }}>
                <h3 style={{ margin: '0 0 16px', color: '#e2e8f0' }}>🎯 Generated {activePlatform} Content</h3>
                <div style={{
                  background: '#0f172a', borderRadius: '8px', padding: '16px',
                  whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#e2e8f0', minHeight: '200px'
                }}>
                  {outputs[platformToOutput[activePlatform]]}
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                  <button
                    onClick={handleCopy}
                    style={{
                      padding: '10px 24px',
                      background: copied ? '#10b981' : '#334155',
                      color: 'white', border: 'none', borderRadius: '8px',
                      cursor: 'pointer', fontSize: '14px'
                    }}
                  >
                    {copied ? '✅ Copied!' : '📋 Copy'}
                  </button>
                  <button style={{
                    padding: '10px 24px', background: '#334155',
                    color: 'white', border: 'none', borderRadius: '8px',
                    cursor: 'pointer', fontSize: '14px'
                  }}>
                    🎨 Publish to Canvas
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Manual Writing' && <ManualEditor />}
        {activeTab === 'The Canvas' && <Canvas />}

      </div>

      {showProfile && <Profile user={user} onClose={() => setShowProfile(false)} />}
      {showDMs && <DMs user={user} onClose={() => setShowDMs(false)} />}
      {showStars && <Stars user={user} onClose={() => setShowStars(false)} />}
    </div>
  );
}

export default App;