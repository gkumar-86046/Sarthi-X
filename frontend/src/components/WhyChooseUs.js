import React from 'react';
import { CheckCircle2 } from 'lucide-react';

const WhyChooseUs = () => {
  const points = [
    "Lowest price learning globally",
    "Beginner-friendly curated roadmaps",
    "Practical, production-grade projects",
    "24/7 AI learning assistant",
    "Verified certificates & Mentorship support"
  ];

  return (
    <section className="section why-choose-us">
      <div className="container wcu-container">
        <div className="wcu-image">
          <div className="glass-card wcu-graphics">
            <div className="circle-graphic circle-1"></div>
            <div className="circle-graphic circle-2"></div>
            <div className="glass-card overlay-card stat-card-1">
              <h3>95%</h3>
              <p>Placement Rate</p>
            </div>
            <div className="glass-card overlay-card stat-card-2">
              <h3>10x</h3>
              <p>Faster Learning</p>
            </div>
          </div>
        </div>
        
        <div className="wcu-content">
          <h2 className="section-title" style={{ textAlign: 'left' }}>
            Why Choose <span className="gradient-text">Sarathi-X?</span>
          </h2>
          <p className="wcu-description">
            We are redefining education by breaking down barriers. Our platform combines the power of artificial intelligence with human expertise to deliver an unmatched learning journey.
          </p>
          
          <ul className="wcu-list">
            {points.map((point, index) => (
              <li key={index} className="wcu-list-item">
                <CheckCircle2 size={24} className="check-icon" color="var(--primary)" />
                <span>{point}</span>
              </li>
            ))}
          </ul>
          
          <button className="btn btn-primary" style={{ marginTop: '20px' }}>
            Start Your Journey
          </button>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
