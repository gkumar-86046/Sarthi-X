import React from 'react';
import { Star, Quote } from 'lucide-react';

const testimonialsData = [
  {
    name: "Rahul Sharma",
    role: "Frontend Developer",
    image: "https://i.pravatar.cc/150?img=11",
    content: "Sarathi-X completely transformed my learning journey. The AI mentor helped me debug my React code instantly, and the projects were exactly what I needed for my portfolio.",
    rating: 5
  },
  {
    name: "Priya Patel",
    role: "Data Scientist",
    image: "https://i.pravatar.cc/150?img=5",
    content: "The most affordable and high-quality learning platform out there. The data science track is incredibly detailed, and the mentorship support is top-notch.",
    rating: 5
  },
  {
    name: "Amit Kumar",
    role: "Cyber Security Analyst",
    image: "https://i.pravatar.cc/150?img=15",
    content: "I started from scratch and within 4 months, I landed my first job. The practical, hands-on approach of Sarathi-X is unmatched in the industry.",
    rating: 5
  }
];

const Testimonials = () => {
  return (
    <section className="section testimonials">
      <div className="container">
        <h2 className="section-title">What Our <span className="gradient-text">Students Say</span></h2>
        <p className="section-subtitle">
          Join thousands of successful learners who have transformed their careers with Sarathi-X.
        </p>
        
        <div className="testimonials-grid">
          {testimonialsData.map((testimonial, index) => (
            <div className="testimonial-card glass-card" key={index}>
              <Quote className="quote-icon" size={40} color="var(--glass-border)" />
              <div className="rating">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} size={16} fill="#eab308" color="#eab308" />
                ))}
              </div>
              <p className="testimonial-content">"{testimonial.content}"</p>
              
              <div className="testimonial-author">
                <img src={testimonial.image} alt={testimonial.name} className="author-img" />
                <div className="author-info">
                  <h4>{testimonial.name}</h4>
                  <span>{testimonial.role}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
