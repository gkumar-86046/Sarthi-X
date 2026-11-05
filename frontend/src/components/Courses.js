import React from 'react';
import { ArrowRight, Code, Terminal, BrainCircuit, Database, Shield, Rocket } from 'lucide-react';

const coursesData = [
  {
    icon: <Code size={24} />,
    title: "Web Development",
    level: "Beginner to Pro",
    duration: "12 Weeks",
    students: "1.2k",
    color: "#3b82f6" // blue
  },
  {
    icon: <Terminal size={24} />,
    title: "Python Mastery",
    level: "Beginner to Pro",
    duration: "8 Weeks",
    students: "2.5k",
    color: "#eab308" // yellow
  },
  {
    icon: <BrainCircuit size={24} />,
    title: "Artificial Intelligence",
    level: "Intermediate",
    duration: "16 Weeks",
    students: "850",
    color: "#8b5cf6" // violet
  },
  {
    icon: <Database size={24} />,
    title: "Data Science",
    level: "Intermediate",
    duration: "14 Weeks",
    students: "1.1k",
    color: "#10b981" // emerald
  },
  {
    icon: <Shield size={24} />,
    title: "Cyber Security",
    level: "All Levels",
    duration: "10 Weeks",
    students: "920",
    color: "#ef4444" // red
  },
  {
    icon: <Rocket size={24} />,
    title: "Startup Guidance",
    level: "Advanced",
    duration: "6 Weeks",
    students: "500",
    color: "#f97316" // orange
  }
];

const Courses = () => {
  return (
    <section id="courses" className="section courses">
      <div className="container">
        <div className="courses-header">
          <div>
            <h2 className="section-title" style={{ textAlign: 'left', marginBottom: '10px' }}>
              Explore <span className="gradient-text">Top Courses</span>
            </h2>
            <p className="section-subtitle" style={{ textAlign: 'left', margin: '0', maxWidth: '500px' }}>
              Master the most in-demand skills with our structured, project-based curriculum.
            </p>
          </div>
          <button className="btn btn-outline view-all-btn">
            View All Courses <ArrowRight size={18} />
          </button>
        </div>
        
        <div className="courses-grid">
          {coursesData.map((course, index) => (
            <div className="course-card glass-card" key={index}>
              <div className="course-icon" style={{ backgroundColor: `${course.color}20`, color: course.color }}>
                {course.icon}
              </div>
              <h3 className="course-title">{course.title}</h3>
              <div className="course-meta">
                <span className="meta-item">{course.level}</span>
                <span className="meta-dot">•</span>
                <span className="meta-item">{course.duration}</span>
              </div>
              <div className="course-footer">
                <div className="students-count">
                  <div className="avatars">
                    <div className="avatar"></div>
                    <div className="avatar"></div>
                    <div className="avatar"></div>
                  </div>
                  <span>{course.students} enrolled</span>
                </div>
                <button className="icon-btn">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Courses;
