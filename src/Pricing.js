import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from './supabase';

function Pricing({ onClose }) {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(null);
  const [currentPlan, setCurrentPlan] = useState('spark');

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/api/stripe/plans`);
      setPlans(data.plans);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpgrade = async (planId) => {
    if (planId === 'spark') return;
    setLoading(planId);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/stripe/checkout`,
        { plan: planId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      window.location.href = data.url;
    } catch (err) {
      alert('Error creating checkout session');
    }
    setLoading(null);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.8)', zIndex: 2000,
      display: 'flex', alignItems: 'center', justifyContent: 'center'
    }} onClick={onClose}>
      <div style={{
        background: '#0f172a', borderRadius: '16px', width: '860px',
        maxHeight: '90vh', overflow: 'auto', border: '1px solid #334155',
        padding: '40px'
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '40px', position: 'relative' }}>
          <button onClick={onClose} style={{
            position: 'absolute', right: 0, top: 0,
            background: '#334155', border: 'none', color: 'white',
            borderRadius: '50%', width: '32px', height: '32px',
            cursor: 'pointer', fontSize: '16px'
          }}>×</button>
          <h2 style={{ margin: 0, fontSize: '28px', color: 'white' }}>Choose Your Plan</h2>
          <p style={{ color: '#94a3b8', margin: '8px 0 0', fontSize: '16px' }}>
            Start free, upgrade when you're ready 🚀
          </p>
        </div>

        {/* Plans */}
        <div style={{ display: 'flex', gap: '20px' }}>
          {plans.map(plan => (
            <div
              key={plan.id}
              style={{
                flex: 1, background: '#1e293b', borderRadius: '16px',
                padding: '28px', border: `2px solid ${plan.id === 'creator' ? plan.color : '#334155'}`,
                position: 'relative', transition: 'all 0.2s'
              }}
            >
              {plan.id === 'creator' && (
                <div style={{
                  position: 'absolute', top: '-12px', left: '50%',
                  transform: 'translateX(-50%)',
                  background: '#3b82f6', color: 'white',
                  padding: '4px 16px', borderRadius: '20px', fontSize: '12px', fontWeight: 700
                }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <p style={{ fontSize: '32px', margin: '0 0 8px' }}>{plan.icon}</p>
                <h3 style={{ margin: 0, color: plan.color, fontSize: '22px' }}>{plan.name}</h3>
                <div style={{ margin: '12px 0' }}>
                  <span style={{ color: 'white', fontSize: '36px', fontWeight: 700 }}>
                    {plan.price === 0 ? 'Free' : `${plan.currency}${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span style={{ color: '#94a3b8', fontSize: '14px' }}>/{plan.period}</span>
                  )}
                </div>
              </div>

              <div style={{ marginBottom: '24px' }}>
                {plan.features.map(feature => (
                  <div key={feature} style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    padding: '6px 0', borderBottom: '1px solid #334155'
                  }}>
                    <span style={{ color: '#10b981', fontSize: '14px' }}>✓</span>
                    <span style={{ color: '#e2e8f0', fontSize: '14px' }}>{feature}</span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => handleUpgrade(plan.id)}
                disabled={loading === plan.id || currentPlan === plan.id}
                style={{
                  width: '100%', padding: '12px',
                  background: currentPlan === plan.id ? '#334155' : plan.color,
                  color: 'white', border: 'none', borderRadius: '10px',
                  fontSize: '15px', fontWeight: 600,
                  cursor: currentPlan === plan.id || plan.id === 'spark' ? 'default' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {loading === plan.id ? '⏳ Loading...' :
                  currentPlan === plan.id ? '✅ Current Plan' :
                  plan.id === 'spark' ? 'Free Forever' :
                  `Upgrade to ${plan.name}`}
              </button>
            </div>
          ))}
        </div>

        <p style={{ textAlign: 'center', color: '#475569', fontSize: '13px', marginTop: '24px' }}>
          🔒 Secure payment powered by Stripe • Cancel anytime
        </p>
      </div>
    </div>
  );
}

export default Pricing;