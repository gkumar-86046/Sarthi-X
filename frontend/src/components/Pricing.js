import React from 'react';
import { Check } from 'lucide-react';

const Pricing = () => {
  return (
    <section id="pricing" className="section pricing">
      <div className="container">
        <h2 className="section-title">Invest in Your <span className="gradient-text">Future</span></h2>
        <p className="section-subtitle">
          Premium education shouldn't break the bank. Choose the plan that works best for your learning goals.
        </p>
        
        <div className="pricing-grid">
          <div className="pricing-card glass-card">
            <div className="pricing-header">
              <h3>Basic</h3>
              <p>For self-paced learners</p>
            </div>
            <div className="pricing-price">
              <span className="currency">$</span>
              <span className="amount">9</span>
              <span className="period">/month</span>
            </div>
            <ul className="pricing-features">
              <li><Check size={18} className="text-primary" color="var(--primary)" /> Access to all core courses</li>
              <li><Check size={18} className="text-primary" color="var(--primary)" /> Community support access</li>
              <li><Check size={18} className="text-primary" color="var(--primary)" /> Basic AI Assistant (100 prompts/mo)</li>
              <li className="disabled"><Check size={18} color="var(--glass-border)" /> 1-on-1 Mentorship</li>
              <li className="disabled"><Check size={18} color="var(--glass-border)" /> Verified Certificates</li>
            </ul>
            <button className="btn btn-outline w-100">Choose Basic</button>
          </div>
          
          <div className="pricing-card glass-card popular">
            <div className="popular-badge">Most Popular</div>
            <div className="pricing-header">
              <h3>Pro</h3>
              <p>For career-focused individuals</p>
            </div>
            <div className="pricing-price">
              <span className="currency">$</span>
              <span className="amount">29</span>
              <span className="period">/month</span>
            </div>
            <ul className="pricing-features">
              <li><Check size={18} className="text-primary" color="var(--primary)" /> Everything in Basic</li>
              <li><Check size={18} className="text-primary" color="var(--primary)" /> Unlimited AI Assistant access</li>
              <li><Check size={18} className="text-primary" color="var(--primary)" /> 2 Mentorship sessions/month</li>
              <li><Check size={18} className="text-primary" color="var(--primary)" /> Verified Certificates</li>
              <li><Check size={18} className="text-primary" color="var(--primary)" /> Job placement assistance</li>
            </ul>
            <button className="btn btn-primary w-100">Choose Pro</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
