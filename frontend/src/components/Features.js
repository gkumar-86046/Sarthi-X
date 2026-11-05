import React from 'react';
import { BookOpen, Bot, Users, Zap, Lightbulb, Target } from 'lucide-react';

const featureData = [
  {
    icon: <BookOpen size={32} />,
    title: "Affordable Learning Resources",
    description: "Access premium-quality courses and study materials at the lowest possible price point in the market."
  },
  {
    icon: <Bot size={32} />,
    title: "AI-Based Learning Guidance",
    description: "Get personalized learning paths and real-time assistance from our advanced AI mentor."
  },
  {
    icon: <Users size={32} />,
    title: "Mentorship Support",
    description: "Connect with industry experts who provide 1-on-1 guidance, code reviews, and career advice."
  },
  {
    icon: <Zap size={32} />,
    title: "Skill Development",
    description: "Focus on in-demand, modern skills that employers are actively looking for right now."
  },
  {
    icon: <Lightbulb size={32} />,
    title: "Innovation & Projects",
    description: "Learn by doing. Build real-world, production-ready projects that stand out in your portfolio."
  },
  {
    icon: <Target size={32} />,
    title: "Career Growth Support",
    description: "From resume building to interview prep, we guide you until you land your dream job."
  }
];

const Features = () => {
  return (
    <section id="features" className="section features">
      <div className="container">
        <h2 className="section-title">Why <span className="gradient-text">Sarathi-X</span> is Different</h2>
        <p className="section-subtitle">
          We combine cutting-edge AI technology with expert mentorship to provide an unparalleled learning experience.
        </p>
        
        <div className="features-grid">
          {featureData.map((feature, index) => (
            <div className="feature-card glass-card" key={index}>
              <div className="feature-icon-wrapper">
                {feature.icon}
              </div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
