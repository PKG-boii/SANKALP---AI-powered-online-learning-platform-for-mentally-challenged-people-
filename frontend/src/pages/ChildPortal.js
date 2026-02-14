import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './ChildPortal.css';

const ChildPortal = () => {
  const navigate = useNavigate();
  const { currentChild } = useAuth();

  const modules = [
    {
      id: 'greetings',
      icon: '👋',
      title: 'Greetings',
      description: 'Practice saying hello!',
      path: '/learn/greetings',
      color: '#2196F3'
    },
    {
      id: 'emotions',
      icon: '😊',
      title: 'Emotions',
      description: 'Learn about feelings',
      path: '/learn/emotions',
      color: '#4CAF50'
    },
    {
      id: 'scenarios',
      icon: '🎭',
      title: 'Scenarios',
      description: 'Real-life situations',
      path: '/learn/scenarios',
      color: '#FF9800'
    },
    {
      id: 'conversation',
      icon: '💬',
      title: 'Conversations',
      description: 'Talk with friends',
      path: '/learn/conversation',
      color: '#9C27B0'
    },
    {
      id: 'video',
      icon: '📹',
      title: 'Video Practice',
      description: 'Record yourself',
      path: '/learn/video',
      color: '#F44336'
    }
  ];

  const child = currentChild || JSON.parse(localStorage.getItem('currentChild') || 'null');

  if (!child) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Please select a child profile first</h2>
        <button className="btn btn-primary" onClick={() => navigate('/dashboard')}>
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="child-portal">
      {/* Animated Background */}
      <div className="animated-background">
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
        <div className="bubble bubble-4"></div>
        <div className="bubble bubble-5"></div>
        <div className="bubble bubble-6"></div>
        <div className="star star-1">⭐</div>
        <div className="star star-2">✨</div>
        <div className="star star-3">🌟</div>
        <div className="star star-4">💫</div>
        <div className="star star-5">⭐</div>
        <div className="floating-shape shape-1">🎨</div>
        <div className="floating-shape shape-2">🎪</div>
        <div className="floating-shape shape-3">🎯</div>
        <div className="floating-shape shape-4">🎭</div>
      </div>

      <div className="portal-header" style={{ 
        background: 'transparent', 
        padding: '80px 40px 60px', 
        color: 'white', 
        textAlign: 'center',
        position: 'relative',
        zIndex: 2
      }}>
        <h1 style={{ 
          fontSize: '4rem', 
          marginBottom: '15px',
          textShadow: '0 5px 20px rgba(0,0,0,0.5)',
          fontWeight: '900',
          letterSpacing: '1px'
        }}>
          Hi {child.name}! 👋
        </h1>
        <p style={{ 
          fontSize: '1.8rem',
          textShadow: '0 2px 10px rgba(0,0,0,0.4)',
          fontWeight: '500',
          opacity: 0.95
        }}>What would you like to learn today?</p>
      </div>

      <div className="container" style={{ 
        marginTop: '40px', 
        position: 'relative', 
        zIndex: 2,
        paddingBottom: '80px'
      }}>
        <div className="grid grid-3">
          {modules.map(module => (
            <div
              key={module.id}
              className="module-card"
              onClick={() => navigate(module.path)}
              style={{ borderColor: module.color }}
            >
              <div className="module-icon" style={{ color: module.color }}>
                {module.icon}
              </div>
              <h3 className="module-title">{module.title}</h3>
              <p className="module-description">{module.description}</p>
              <button className="btn btn-primary" style={{ 
                background: module.color, 
                marginTop: '20px',
                fontSize: '1.3rem',
                fontWeight: '700',
                padding: '18px 40px',
                border: 'none',
                boxShadow: `0 5px 20px ${module.color}80`
              }}>
                START LEARNING
              </button>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '60px' }}>
          <button className="btn" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChildPortal;
