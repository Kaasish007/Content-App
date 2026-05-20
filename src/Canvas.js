import React, { useState } from 'react';

const samplePosts = [
  {
    id: 1,
    user: 'Rahul K',
    avatar: 'R',
    platform: 'LinkedIn',
    label: 'ai',
    content: '🌎 Artificial Intelligence is transforming every industry! From healthcare to finance, AI is revolutionizing how we work and live. The future belongs to those who embrace this change! #AI #Innovation',
    likes: 42,
    comments: 8,
    time: '2 hours ago',
    color: '#3b82f6'
  },
  {
    id: 2,
    user: 'Priya S',
    avatar: 'P',
    platform: 'Instagram',
    label: 'human',
    content: '✨ Sometimes the best moments are the ones you never planned. Today was one of those days — spontaneous, beautiful, and full of life. Grateful for every second! 🌸 #Blessed #GoodVibes #HappyDay',
    likes: 128,
    comments: 24,
    time: '4 hours ago',
    color: '#a855f7'
  },
  {
    id: 3,
    user: 'Arun M',
    avatar: 'A',
    platform: 'Twitter',
    label: 'human',
    content: '1/ The secret to consistency is not motivation — it\'s systems. Build the right systems and success becomes inevitable. 🧵 Thread incoming...',
    likes: 89,
    comments: 15,
    time: '6 hours ago',
    color: '#38bdf8'
  }
];

function Canvas() {
  const [feed, setFeed] = useState('Trending');
  const [posts, setPosts] = useState(samplePosts);
  const [likedPosts, setLikedPosts] = useState([]);

  const handleLike = (id) => {
    if (likedPosts.includes(id)) {
      setLikedPosts(likedPosts.filter(p => p !== id));
      setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes - 1 } : p));
    } else {
      setLikedPosts([...likedPosts, id]);
      setPosts(posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p));
    }
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '24px', background: 'linear-gradient(135deg, #60a5fa, #a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          🎨 The Canvas
        </h2>
        <p style={{ margin: '4px 0 0', color: '#475569', fontSize: '14px' }}>
          Where creativity meets community
        </p>
      </div>

      {/* Feed Switcher */}
      <div style={{ display: 'flex', gap: '4px', background: '#1e293b', borderRadius: '10px', padding: '4px', marginBottom: '24px' }}>
        {['Trending', 'Latest', 'For You'].map(tab => (
          <button
            key={tab}
            onClick={() => setFeed(tab)}
            style={{
              flex: 1, padding: '8px', borderRadius: '7px', border: 'none',
              cursor: 'pointer', fontSize: '13px', fontWeight: 500,
              background: feed === tab ? '#3b82f6' : 'transparent',
              color: feed === tab ? 'white' : '#94a3b8',
              transition: 'all 0.2s'
            }}
          >
            {tab === 'Trending' && '🔥 '}
            {tab === 'Latest' && '🆕 '}
            {tab === 'For You' && '💡 '}
            {tab}
          </button>
        ))}
      </div>

      {/* Posts */}
      {posts.map(post => (
        <div
          key={post.id}
          style={{
            background: '#1e293b', borderRadius: '12px', padding: '20px',
            marginBottom: '16px', border: '1px solid #334155',
            transition: 'border-color 0.2s'
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = post.color}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#334155'}
        >
          {/* Post Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '36px', height: '36px', borderRadius: '50%',
                background: `linear-gradient(135deg, ${post.color}, #8b5cf6)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'white', fontWeight: 700, fontSize: '16px'
              }}>
                {post.avatar}
              </div>
              <div>
                <p style={{ margin: 0, color: '#e2e8f0', fontWeight: 600, fontSize: '14px' }}>{post.user}</p>
                <p style={{ margin: 0, color: '#475569', fontSize: '12px' }}>{post.time}</p>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {/* Platform badge */}
              <span style={{
                padding: '3px 8px', borderRadius: '20px', fontSize: '11px',
                background: `${post.color}22`, color: post.color, fontWeight: 500
              }}>
                {post.platform}
              </span>
              {/* Label badge */}
              <span style={{
                padding: '3px 8px', borderRadius: '20px', fontSize: '11px',
                background: post.label === 'ai' ? '#0ea5e922' : '#10b98122',
                color: post.label === 'ai' ? '#0ea5e9' : '#10b981', fontWeight: 500
              }}>
                {post.label === 'ai' ? '🤖 Made with AI' : '✍️ Human\'s Creativity'}
              </span>
            </div>
          </div>

          {/* Post Content */}
          <p style={{ color: '#e2e8f0', lineHeight: '1.6', fontSize: '14px', margin: '0 0 16px' }}>
            {post.content}
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '16px', borderTop: '1px solid #334155', paddingTop: '12px' }}>
            <button
              onClick={() => handleLike(post.id)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                color: likedPosts.includes(post.id) ? '#ef4444' : '#64748b',
                fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px'
              }}
            >
              {likedPosts.includes(post.id) ? '❤️' : '🤍'} {post.likes}
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              💬 {post.comments}
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              ⭐ Gift Star
            </button>
            <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              📤 Share
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Canvas;