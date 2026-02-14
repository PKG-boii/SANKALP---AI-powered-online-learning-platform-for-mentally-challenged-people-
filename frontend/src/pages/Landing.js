import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const Landing = () => {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero">
        {/* Animated Background Elements */}
        <div className="hero-particles">
          <div className="particle particle-1">💫</div>
          <div className="particle particle-2">⭐</div>
          <div className="particle particle-3">✨</div>
          <div className="particle particle-4">🌟</div>
          <div className="particle particle-5">💫</div>
          <div className="particle particle-6">⭐</div>
          <div className="particle particle-7">✨</div>
          <div className="particle particle-8">🌟</div>
        </div>
        <div className="wave wave-1"></div>
        <div className="wave wave-2"></div>
        <div className="wave wave-3"></div>
        
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              🌟 AI-Powered Learning for Every Child
            </h1>
            <p className="hero-subtitle">
              Empowering specially-abled children with personalized 
              communication and social skills training
            </p>
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-large btn-primary">
                Get Started Free
              </Link>
              <Link to="/login" className="btn btn-large btn-success">
                Login
              </Link>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-emoji">🎓✨</div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">Core Learning Modules</h2>
          <div className="grid grid-3">
            <div className="feature-card">
              <div className="feature-icon">👋</div>
              <h3>Greetings & Introductions</h3>
              <p>Practice conversations with friendly AI characters</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">😊</div>
              <h3>Emotion Recognition</h3>
              <p>Learn to identify and understand emotions</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">🎭</div>
              <h3>Social Scenarios</h3>
              <p>Navigate real-life situations with guidance</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">💬</div>
              <h3>Conversation Practice</h3>
              <p>Role-play with AI in different contexts</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📹</div>
              <h3>Video Modeling</h3>
              <p>Record and review practice sessions</p>
            </div>
            
            <div className="feature-card">
              <div className="feature-icon">📊</div>
              <h3>Progress Tracking</h3>
              <p>Monitor growth with detailed insights</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits">
        <div className="container">
          <h2 className="section-title">Why Choose Our Platform?</h2>
          <div className="grid grid-2">
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-content">
                <h3>AI-Powered Personalization</h3>
                <p>Adapts to each child's unique learning pace and style</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-content">
                <h3>Immediate Feedback</h3>
                <p>Instant, encouraging responses to build confidence</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-content">
                <h3>Parent Dashboard</h3>
                <p>Track progress and customize learning goals</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-content">
                <h3>Safe & Private</h3>
                <p>Secure environment designed for children</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-content">
                <h3>Unlimited Practice</h3>
                <p>Learn at your own pace, anytime, anywhere</p>
              </div>
            </div>
            
            <div className="benefit-item">
              <div className="benefit-icon">✓</div>
              <div className="benefit-content">
                <h3>Engaging & Fun</h3>
                <p>Gamification with points, badges, and rewards</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing">
        <div className="container">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <div className="grid grid-3">
            <div className="price-card">
              <h3>Free</h3>
              <div className="price">$0<span>/month</span></div>
              <ul className="price-features">
                <li>✓ 1 child profile</li>
                <li>✓ Greetings module</li>
                <li>✓ Basic emotions</li>
                <li>✓ 15 min/day limit</li>
                <li>✓ Progress tracking</li>
              </ul>
              <Link to="/register" className="btn btn-primary">
                Start Free
              </Link>
            </div>
            
            <div className="price-card featured">
              <div className="popular-badge">Most Popular</div>
              <h3>Family</h3>
              <div className="price">$29<span>/month</span></div>
              <ul className="price-features">
                <li>✓ Unlimited children</li>
                <li>✓ All modules unlocked</li>
                <li>✓ Unlimited time</li>
                <li>✓ Video recording</li>
                <li>✓ Custom scenarios</li>
                <li>✓ Priority support</li>
              </ul>
              <Link to="/register" className="btn btn-success">
                Get Started
              </Link>
            </div>
            
            <div className="price-card">
              <h3>School</h3>
              <div className="price">$199<span>/month</span></div>
              <ul className="price-features">
                <li>✓ Up to 30 students</li>
                <li>✓ Teacher dashboard</li>
                <li>✓ Custom content</li>
                <li>✓ IEP reports</li>
                <li>✓ Training included</li>
                <li>✓ Dedicated support</li>
              </ul>
              <Link to="/register" className="btn btn-purple">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta">
        <div className="container">
          <h2>Ready to Get Started?</h2>
          <p>Join hundreds of families helping their children thrive</p>
          <Link to="/register" className="btn btn-large btn-primary">
            Create Free Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-content">
            <div className="footer-section">
              <h4>Learning Platform</h4>
              <p>Empowering every child to learn and grow</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Sign Up</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Support</h4>
              <ul>
                <li><a href="mailto:support@learningplatform.com">Contact Us</a></li>
                <li><a href="/help">Help Center</a></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 AI Learning Platform. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
