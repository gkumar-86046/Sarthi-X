import React from 'react';
import { UserPlus, Compass, Trophy, Briefcase } from 'lucide-react';

const steps = [
  {
    icon: <UserPlus size={28} />,
    title: "Create Account",
    description: "Sign up and set your learning goals with our AI guide."
  },
  {
    icon: <Compass size={28} />,
    title: "Personalized Roadmap",
    description: "Get a custom curriculum tailored to your current skill level."
  },
  {
    icon: <Trophy size={28} />,
    title: "Learn & Build",
    description: "Complete modules and build real-world projects."
  },
  {
    icon: <Briefcase size={28} />,
    title: "Get Certified & Hired",
    description: "Earn your verified certificate and land your dream job."
  }
];

const HowItWorks = () => {
  return (
    <section id="how-it-works" className="section how-it-works">
      <div className="container">
        <h2 className="section-title">How <span className="gradient-text">It Works</span></h2>
        <p className="section-subtitle">
          A simple, streamlined process to take you from absolute beginner to industry professional.
        </p>
        
        <div className="steps-container">
          <div className="connecting-line"></div>
          {steps.map((step, index) => (
            <div className="step-item" key={index}>
              <div className="step-number">{index + 1}</div>
              <div className="step-icon glass">
                {step.icon}
              </div>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-description">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
