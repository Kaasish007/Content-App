import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [text, setText] = useState('');
  const [outputs, setOutputs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('linkedin');
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) return alert('Please enter some content!');
    setLoading(true);
    try {
      const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/generate`, {
        rawText: text
      });
      setOutputs(res.data.outputs);
      setActiveTab('linkedin');
    } catch (err) {
      alert('Error generating content. Is your backend running?');
    }
    setLoading(false);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(outputs[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const tabs = ['linkedin', 'twitter', 'instagram', 'blog', 'newsletter'];

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* Header */}
      <div style={{ background: '#1e293b', padding: '20px', textAlign: 'center', borderBottom: '1px solid #334155' }}>
        <h1 style={{ margin: 0, fontSize: '28px', color: '#60a5fa' }}>✨ ContentAI</h1>
        <p style={{ margin: '5px 0 0', color: '#94a3b8' }}>Transform any content into social media posts instantly</p>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>
        
        {/* Input Section */}
        <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ margin: '0 0 16px', color: '#e2e8f0' }}>📝 Paste Your Content</h2>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste your blog post, article, video transcript, or any text here..."
            style={{
              width: '100%', height: '160px', background: '#0f172a', color: 'white',
              border: '1px solid #334155', borderRadius: '8px', padding: '12px',
              fontSize: '14px', resize: 'vertical', boxSizing: 'border-box'
            }}
          />
          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              marginTop: '12px', padding: '12px 32px', background: loading ? '#475569' : '#3b82f6',
              color: 'white', border: 'none', borderRadius: '8px', fontSize: '16px',
              cursor: loading ? 'not-allowed' : 'pointer', width: '100%'
            }}
          >
            {loading ? '⏳ Generating all 5 formats...' : '🚀 Generate Content'}
          </button>
        </div>

        {/* Output Section */}
        {outputs && (
          <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px' }}>
            <h2 style={{ margin: '0 0 16px', color: '#e2e8f0' }}>🎯 Generated Content</h2>
            
            {/* Tabs */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
              {tabs.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '8px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer',
                    background: activeTab === tab ? '#3b82f6' : '#334155',
                    color: 'white', fontSize: '13px', textTransform: 'capitalize'
                  }}
                >
                  {tab === 'linkedin' && '💼 '}
                  {tab === 'twitter' && '🐦 '}
                  {tab === 'instagram' && '📸 '}
                  {tab === 'blog' && '📝 '}
                  {tab === 'newsletter' && '📧 '}
                  {tab}
                </button>
              ))}
            </div>

            {/* Content */}
            <div style={{
              background: '#0f172a', borderRadius: '8px', padding: '16px',
              whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#e2e8f0', minHeight: '200px'
            }}>
              {outputs[activeTab]}
            </div>

            {/* Copy Button */}
            <button
              onClick={handleCopy}
              style={{
                marginTop: '12px', padding: '10px 24px',
                background: copied ? '#10b981' : '#334155',
                color: 'white', border: 'none', borderRadius: '8px',
                cursor: 'pointer', fontSize: '14px'
              }}
            >
              {copied ? '✅ Copied!' : '📋 Copy to Clipboard'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;