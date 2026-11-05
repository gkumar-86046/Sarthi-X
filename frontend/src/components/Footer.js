import React from 'react';
import { BookOpen, Globe, MessageSquare, Hash, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer glass">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <div className="logo">
              <BookOpen size={28} color="var(--primary)" />
              <span className="logo-text gradient-text">Sarathi-X</span>
            </div>
            <p className="footer-description">
              Empowering the next generation of innovators with affordable, AI-driven education. Learn faster, build better.
            </p>
            <div className="social-links">
              <a href="#root" className="social-link" aria-label="Chat"><MessageSquare size={20} /></a>
              <a href="#root" className="social-link" aria-label="Website"><Globe size={20} /></a>
              <a href="#root" className="social-link" aria-label="Social"><Hash size={20} /></a>
              <a href="#root" className="social-link" aria-label="Email"><Mail size={20} /></a>
            </div>
          </div>
          
          <div className="footer-links">
            <h4>Quick Links</h4>
            <ul>
              <li><a href="#features">Features</a></li>
              <li><a href="#courses">Courses</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#how-it-works">Roadmap</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4>Resources</h4>
            <ul>
              <li><a href="#root">Blog</a></li>
              <li><a href="#root">Community</a></li>
              <li><a href="#root">Help Center</a></li>
              <li><a href="#root">Guidelines</a></li>
            </ul>
          </div>
          
          <div className="footer-links">
            <h4>Legal</h4>
            <ul>
              <li><a href="#root">Terms of Service</a></li>
              <li><a href="#root">Privacy Policy</a></li>
              <li><a href="#root">Cookie Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Sarathi-X. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
