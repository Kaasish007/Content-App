import React, { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';

function DMs({ user, onClose }) {
  const [conversations, setConversations] = useState([]);
  const [activeConvo, setActiveConvo] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  const sampleConversations = [
    { id: '1', name: 'Rahul K', avatar: 'R', lastMessage: 'Hey, loved your post!', time: '2m ago', unread: 2 },
    { id: '2', name: 'Priya S', avatar: 'P', lastMessage: 'Can you share that template?', time: '1h ago', unread: 0 },
    { id: '3', name: 'Arun M', avatar: 'A', lastMessage: 'Thanks for the star! 🌟', time: '3h ago', unread: 1 },
  ];

  const sampleMessages = {
    '1': [
      { id: 1, sender: 'Rahul K', content: 'Hey, loved your post!', mine: false, time: '10:30 AM' },
      { id: 2, sender: 'me', content: 'Thank you so much! 😊', mine: true, time: '10:31 AM' },
      { id: 3, sender: 'Rahul K', content: 'How did you generate that LinkedIn content?', mine: false, time: '10:32 AM' },
    ],
    '2': [
      { id: 1, sender: 'Priya S', content: 'Can you share that template?', mine: false, time: '9:00 AM' },
    ],
    '3': [
      { id: 1, sender: 'Arun M', content: 'Thanks for the star! 🌟', mine: false, time: '7:00 AM' },
      { id: 2, sender: 'me', content: 'You deserved it! Great content 🔥', mine: true, time: '7:05 AM' },
    ],
  };

  useEffect(() => {
    setConversations(sampleConversations);
  }, []);

  useEffect(() => {
    if (activeConvo) {
      setMessages(sampleMessages[activeConvo.id] || []);
    }
  }, [activeConvo]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg = {
      id: messages.length + 1,
      sender: 'me',
      content: newMessage,
      mine: true,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages([...messages, msg]);
    setNewMessage('');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={onClose}>
      <div style={{
        background: '#0f172a', borderRadius: '16px', width: '860px',
        height: '600px', border: '1px solid #334155',
        display: 'flex', overflow: 'hidden'
      }} onClick={e => e.stopPropagation()}>

        {/* Left — Conversations */}
        <div style={{
          width: '280px', borderRight: '1px solid #334155',
          display: 'flex', flexDirection: 'column'
        }}>
          {/* Header */}
          <div style={{
            padding: '20px 16px', borderBottom: '1px solid #334155',
            display: 'flex', justifyContent: 'space-between', alignItems: 'center'
          }}>
            <h3 style={{ margin: 0, color: 'white', fontSize: '16px' }}>💬 Messages</h3>
            <button onClick={onClose} style={{
              background: '#334155', border: 'none', color: 'white',
              borderRadius: '50%', width: '28px', height: '28px',
              cursor: 'pointer', fontSize: '14px'
            }}>×</button>
          </div>

          {/* Search */}
          <div style={{ padding: '12px' }}>
            <input
              placeholder="🔍 Search messages..."
              style={{
                width: '100%', padding: '8px 12px', background: '#1e293b',
                border: '1px solid #334155', borderRadius: '8px',
                color: 'white', fontSize: '13px', boxSizing: 'border-box'
              }}
            />
          </div>

          {/* Conversation List */}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.map(convo => (
              <div
                key={convo.id}
                onClick={() => setActiveConvo(convo)}
                style={{
                  padding: '12px 16px', cursor: 'pointer', display: 'flex',
                  alignItems: 'center', gap: '12px',
                  background: activeConvo?.id === convo.id ? '#1e293b' : 'transparent',
                  borderBottom: '1px solid #1e293b', transition: 'all 0.2s'
                }}
                onMouseEnter={e => { if (activeConvo?.id !== convo.id) e.currentTarget.style.background = '#1e293b55'; }}
                onMouseLeave={e => { if (activeConvo?.id !== convo.id) e.currentTarget.style.background = 'transparent'; }}
              >
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700, fontSize: '16px', flexShrink: 0
                }}>
                  {convo.avatar}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <p style={{ margin: 0, color: 'white', fontSize: '14px', fontWeight: 600 }}>{convo.name}</p>
                    <span style={{ color: '#475569', fontSize: '11px' }}>{convo.time}</span>
                  </div>
                  <p style={{ margin: '2px 0 0', color: '#64748b', fontSize: '12px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {convo.lastMessage}
                  </p>
                </div>
                {convo.unread > 0 && (
                  <div style={{
                    width: '18px', height: '18px', borderRadius: '50%',
                    background: '#3b82f6', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', color: 'white', fontSize: '10px', fontWeight: 700
                  }}>
                    {convo.unread}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Right — Chat Area */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {activeConvo ? (
            <>
              {/* Chat Header */}
              <div style={{
                padding: '16px 20px', borderBottom: '1px solid #334155',
                display: 'flex', alignItems: 'center', gap: '12px'
              }}>
                <div style={{
                  width: '36px', height: '36px', borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontWeight: 700
                }}>
                  {activeConvo.avatar}
                </div>
                <div>
                  <p style={{ margin: 0, color: 'white', fontWeight: 600, fontSize: '14px' }}>{activeConvo.name}</p>
                  <p style={{ margin: 0, color: '#10b981', fontSize: '12px' }}>● Online</p>
                </div>
                <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
                  <button style={{ background: '#1e293b', border: 'none', color: '#94a3b8', padding: '6px 12px', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }}>
                    ⭐ Gift Star
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {messages.map(msg => (
                  <div key={msg.id} style={{
                    display: 'flex', justifyContent: msg.mine ? 'flex-end' : 'flex-start'
                  }}>
                    <div style={{
                      maxWidth: '70%', padding: '10px 14px', borderRadius: msg.mine ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                      background: msg.mine ? '#3b82f6' : '#1e293b',
                      color: 'white', fontSize: '14px', lineHeight: '1.5'
                    }}>
                      <p style={{ margin: 0 }}>{msg.content}</p>
                      <p style={{ margin: '4px 0 0', fontSize: '10px', color: msg.mine ? '#bfdbfe' : '#475569', textAlign: 'right' }}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div style={{
                padding: '16px 20px', borderTop: '1px solid #334155',
                display: 'flex', gap: '8px', alignItems: 'center'
              }}>
                <input
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSend()}
                  placeholder="Type a message..."
                  style={{
                    flex: 1, padding: '10px 14px', background: '#1e293b',
                    border: '1px solid #334155', borderRadius: '10px',
                    color: 'white', fontSize: '14px', outline: 'none'
                  }}
                />
                <button
                  onClick={handleSend}
                  style={{
                    padding: '10px 16px', background: '#3b82f6',
                    border: 'none', borderRadius: '10px', color: 'white',
                    cursor: 'pointer', fontSize: '16px'
                  }}
                >
                  ➤
                </button>
              </div>
            </>
          ) : (
            <div style={{
              flex: 1, display: 'flex', alignItems: 'center',
              justifyContent: 'center', flexDirection: 'column', gap: '12px'
            }}>
              <p style={{ fontSize: '48px' }}>💬</p>
              <p style={{ color: '#475569', fontSize: '16px' }}>Select a conversation to start chatting</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default DMs;