import React, { useState } from 'react';

const platforms = ['LinkedIn', 'Twitter', 'Instagram', 'YouTube', 'Blog'];

const platformLimits = {
  LinkedIn: 3000,
  Twitter: 280,
  Instagram: 2200,
  YouTube: 5000,
  Blog: 10000
};

function ManualEditor() {
  const [content, setContent] = useState('');
  const [platform, setPlatform] = useState('LinkedIn');
  const [published, setPublished] = useState(false);

  const limit = platformLimits[platform];
  const count = content.length;
  const isOverLimit = count > limit;

  const platformColors = {
    YouTube: '#ef4444', LinkedIn: '#3b82f6',
    Blog: '#10b981', Twitter: '#38bdf8', Instagram: '#a855f7'
  };

  const applyFormat = (type) => {
    const textarea = document.getElementById('manual-editor');
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    let formatted = selected;

    if (type === 'bold') formatted = `**${selected}**`;
    if (type === 'italic') formatted = `_${selected}_`;
    if (type === 'underline') formatted = `__${selected}__`;

    const newContent = content.substring(0, start) + formatted + content.substring(end);
    setContent(newContent);
  };

  const handlePublish = () => {
    if (!content.trim()) return alert('Write something first!');
    if (isOverLimit) return alert(`You exceeded the ${platform} limit of ${limit} characters!`);
    setPublished(true);
    setTimeout(() => setPublished(false), 3000);
  };

  return (
    <div style={{ maxWidth: '800px' }}>

      {/* Platform Selector */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ color: '#94a3b8', fontSize: '13px', margin: '0 0 8px' }}>Select Platform:</p>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {platforms.map(p => (
            <button
              key={p}
              onClick={() => setPlatform(p)}
              style={{
                padding: '8px 16px', borderRadius: '8px', border: 'none',
                cursor: 'pointer', fontSize: '13px', fontWeight: 500,
                background: platform === p ? platformColors[p] : '#1e293b',
                color: platform === p ? 'white' : '#94a3b8',
              }}
            >
              {p === 'YouTube' && '🎥 '}
              {p === 'LinkedIn' && '💼 '}
              {p === 'Blog' && '📝 '}
              {p === 'Twitter' && '🐦 '}
              {p === 'Instagram' && '📸 '}
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Editor */}
      <div style={{ background: '#1e293b', borderRadius: '12px', padding: '24px', border: `1px solid ${platformColors[platform]}33` }}>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ margin: 0, color: '#e2e8f0' }}>✍️ Write Your Content</h3>
          <span style={{ fontSize: '12px', color: isOverLimit ? '#ef4444' : '#94a3b8' }}>
            {count}/{limit} characters
          </span>
        </div>

        {/* Formatting Toolbar */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
          {[
            { label: 'B', type: 'bold', style: { fontWeight: 'bold' } },
            { label: 'I', type: 'italic', style: { fontStyle: 'italic' } },
            { label: 'U', type: 'underline', style: { textDecoration: 'underline' } },
          ].map(btn => (
            <button
              key={btn.type}
              onClick={() => applyFormat(btn.type)}
              style={{
                width: '32px', height: '32px', background: '#334155',
                border: 'none', borderRadius: '6px', color: 'white',
                cursor: 'pointer', fontSize: '14px', ...btn.style
              }}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Textarea */}
        <textarea
          id="manual-editor"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={`Write your ${platform} content here... Be creative! ✨`}
          style={{
            width: '100%', height: '240px', background: '#0f172a',
            color: 'white', border: `1px solid ${isOverLimit ? '#ef4444' : '#334155'}`,
            borderRadius: '8px', padding: '12px', fontSize: '14px',
            resize: 'vertical', boxSizing: 'border-box', lineHeight: '1.6'
          }}
        />

        {/* Character warning */}
        {isOverLimit && (
          <p style={{ color: '#ef4444', fontSize: '12px', margin: '4px 0 0' }}>
            ⚠️ You're {count - limit} characters over the {platform} limit!
          </p>
        )}

        {/* Publish Button */}
        <button
          onClick={handlePublish}
          style={{
            marginTop: '16px', padding: '12px 32px',
            background: published ? '#10b981' : isOverLimit ? '#475569' : platformColors[platform],
            color: 'white', border: 'none', borderRadius: '8px',
            fontSize: '16px', cursor: isOverLimit ? 'not-allowed' : 'pointer', width: '100%'
          }}
        >
          {published ? '✅ Published to The Canvas!' : `🎨 Publish to The Canvas`}
        </button>

        <p style={{ color: '#475569', fontSize: '12px', textAlign: 'center', margin: '8px 0 0' }}>
          Your post will be labeled ✍️ "Human's Creativity" on The Canvas
        </p>
      </div>
    </div>
  );
}

export default ManualEditor;