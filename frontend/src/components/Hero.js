import React from 'react';
import { ArrowRight, Play, Sparkles } from 'lucide-react';

const Hero = ({ onNavigate }) => {
  return (
    <section className="hero">
      <div className="container hero-container">
        <div className="hero-content">
          <div className="badge glass">
            <Sparkles size={16} className="text-accent" color="var(--accent)" />
            <span>The Future of Learning is Here</span>
          </div>
          
          <h1 className="hero-title">
            Learn. Innovate.<br />
            Enhance Your<br />
            <span className="gradient-text">Intelligence.</span>
          </h1>
          
          <p className="hero-description">
            Sarathi-X helps students and learners access high-quality, AI-powered learning resources at the lowest possible price. Your personal guide to mastering tomorrow's skills, today.
          </p>
          
          <div
            className="hero-actions"
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              width: '100%',
              maxWidth: '100%',
              boxSizing: 'border-box'
            }}
          >
            <button
              className="btn btn-primary"
              onClick={() => onNavigate && onNavigate('register')}
              style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', justifyContent: 'center' }}
            >
              Start Learning
              <ArrowRight size={20} />
            </button>
            <a
              href="#courses"
              className="btn btn-outline"
              style={{ textDecoration: 'none', width: '100%', maxWidth: '100%', boxSizing: 'border-box', justifyContent: 'center' }}
            >
              <Play size={20} />
              Explore Courses
            </a>
          </div>
          
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">10k+</span>
              <span className="stat-label">Active Learners</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">50+</span>
              <span className="stat-label">AI Mentors</span>
            </div>
            <div className="stat-divider"></div>
            <div className="stat">
              <span className="stat-number">4.9/5</span>
              <span className="stat-label">User Rating</span>
            </div>
          </div>
        </div>
        
        <div className="hero-image-wrapper">
          <div className="hero-image-placeholder glass-card">
            {/* We use CSS and icons to create a futuristic placeholder */}
            <div className="code-block">
              <div className="code-header">
                <span className="dot dot-red"></span>
                <span className="dot dot-yellow"></span>
                <span className="dot dot-green"></span>
              </div>
              <pre style={{ overflowX: 'auto', maxWidth: '100%' }}>
                <code>
                  <span className="keyword">const</span> <span className="variable">future</span> = <span className="function">await</span> <span className="keyword">SarathiX</span>.<span className="function">learn</span>();<br/><br/>
                  <span className="keyword">if</span> (future.<span className="property">isAI_Powered</span>) &#123;<br/>
                  &nbsp;&nbsp;<span className="variable">skills</span>.<span className="function">upgrade</span>(<span className="string">'MAX'</span>);<br/>
                  &nbsp;&nbsp;<span className="variable">career</span>.<span className="function">accelerate</span>();<br/>
                  &#125;
                </code>
              </pre>
            </div>
            
            <div className="floating-card ai-card glass">
              <Sparkles size={24} color="var(--secondary)" />
              <div>
                <h4>AI Assistant</h4>
                <p>Online now</p>
              </div>
            </div>
            
            <div className="floating-card progress-card glass">
              <div className="progress-circle">
                <span>98%</span>
              </div>
              <div>
                <h4>Course Progress</h4>
                <p>Data Science</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
