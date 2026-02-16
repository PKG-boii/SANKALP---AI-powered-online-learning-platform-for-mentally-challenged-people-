import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import VoiceInput from '../../components/VoiceInput';
import './GreetingPractice.css';

const GreetingPractice = () => {
  const { currentChild, API_URL } = useAuth();
  const [step, setStep] = useState('intro'); // intro, practice, feedback
  const [userInput, setUserInput] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);
  const [aiResponse, setAiResponse] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [inputMode, setInputMode] = useState('type'); // type, speak, quick
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [attempts, setAttempts] = useState(0);

  const quickResponses = [
    "Hi, I'm " + (currentChild?.name || "Sarah"),
    "Hello! Nice to meet you!",
    "Hey! How are you?",
    "Good morning!"
  ];

  useEffect(() => {
    // Start the module with introduction
    if (step === 'intro') {
      speak("Hi! I'm Alex. I'm here to help you practice greetings. Let's start!");
    }
  }, [step]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 1;
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const startPractice = () => {
    setStep('practice');
    setConversationHistory([{
      role: 'ai',
      message: "Hi! What's your name?",
      timestamp: new Date()
    }]);
    speak("Hi! What's your name?");
  };

  const handleSubmit = async (input = userInput) => {
    if (!input.trim()) return;

    setLoading(true);
    const newMessage = {
      role: 'user',
      message: input,
      timestamp: new Date()
    };

    setConversationHistory(prev => [...prev, newMessage]);
    setUserInput('');

    try {
      const response = await axios.post(`${API_URL}/api/conversation/greeting`, {
        childId: currentChild?.id,
        userInput: input,
        conversationHistory: conversationHistory
      });

      const { aiResponse: aiMsg, feedback: fbk, score: scr } = response.data.data;

      setAiResponse(aiMsg);
      setFeedback(fbk);
      setScore(scr);
      setAttempts(prev => prev + 1);

      const aiMessage = {
        role: 'ai',
        message: aiMsg,
        timestamp: new Date()
      };

      setConversationHistory(prev => [...prev, aiMessage]);
      speak(aiMsg);

      // Show feedback after response
      setTimeout(() => {
        setStep('feedback');
      }, 2000);

    } catch (error) {
      console.error('Error getting AI response:', error);
      setFeedback(['Oops! Something went wrong. Try again!']);
      setStep('feedback');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickResponse = (response) => {
    handleSubmit(response);
  };

  const handleVoiceInput = (transcript) => {
    setUserInput(transcript);
    handleSubmit(transcript);
  };

  const tryAgain = () => {
    setStep('practice');
    setFeedback([]);
    setScore(0);
  };

  const finish = () => {
    window.location.href = '/learn';
  };

  const child = currentChild || JSON.parse(localStorage.getItem('currentChild') || 'null');

  if (!child) {
    return (
      <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        <div className="card" style={{ maxWidth: '600px', padding: '60px', textAlign: 'center', animation: 'popIn 0.5s ease' }}>
          <div style={{ fontSize: '6rem', marginBottom: '20px' }}>🎓</div>
          <h1 style={{ color: '#667eea', marginBottom: '20px' }}>Oops! No Profile Selected</h1>
          <p style={{ fontSize: '1.3rem', marginBottom: '30px', color: '#666' }}>
            Please go back and select a child profile to start learning!
          </p>
          <button 
            className="btn btn-large btn-primary"
            onClick={() => navigate('/dashboard')}
          >
            ← Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="greeting-practice">
      <div className="practice-header">
        <h1>👋 Greeting Practice</h1>
        <p>Practice saying hello and introducing yourself!</p>
      </div>

      <div className="container-narrow">
        {/* Intro Step */}
        {step === 'intro' && (
          <div className="intro-screen">
            <div className="ai-character">
              <div className="avatar">🤖</div>
              <div className="character-name">Alex</div>
            </div>
            <div className="intro-message card">
              <p>
                Hi! I'm Alex, and I'm excited to practice greetings with you today!
              </p>
              <p>
                I'll say hello, and you can respond. Don't worry - there's no wrong answer!
                Just be friendly and be yourself.
              </p>
            </div>
            <button 
              className="btn btn-large btn-primary" 
              onClick={startPractice}
            >
              Let's Start! 🎉
            </button>
          </div>
        )}

        {/* Practice Step */}
        {step === 'practice' && (
          <div className="practice-screen">
            {/* AI Character */}
            <div className="ai-character">
              <div className={`avatar ${isSpeaking ? 'speaking' : ''}`}>
                🤖
              </div>
              {isSpeaking && (
                <div className="speaking-indicator">
                  <div className="speaking-bar"></div>
                  <div className="speaking-bar"></div>
                  <div className="speaking-bar"></div>
                </div>
              )}
            </div>

            {/* Conversation Display */}
            <div className="conversation-box card">
              {conversationHistory.map((msg, index) => (
                <div 
                  key={index} 
                  className={`message ${msg.role === 'ai' ? 'ai-message' : 'user-message'}`}
                >
                  <div className="message-avatar">
                    {msg.role === 'ai' ? '🤖' : '👤'}
                  </div>
                  <div className="message-bubble">
                    <p>{msg.message}</p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="message ai-message">
                  <div className="message-avatar">🤖</div>
                  <div className="message-bubble">
                    <div className="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input Methods */}
            <div className="input-section">
              <div className="input-mode-selector">
                <button 
                  className={`mode-btn ${inputMode === 'type' ? 'active' : ''}`}
                  onClick={() => setInputMode('type')}
                >
                  ⌨️ Type
                </button>
                <button 
                  className={`mode-btn ${inputMode === 'speak' ? 'active' : ''}`}
                  onClick={() => setInputMode('speak')}
                >
                  🎤 Speak
                </button>
                <button 
                  className={`mode-btn ${inputMode === 'quick' ? 'active' : ''}`}
                  onClick={() => setInputMode('quick')}
                >
                  ⚡ Quick
                </button>
              </div>

              {/* Type Mode */}
              {inputMode === 'type' && (
                <div className="type-input">
                  <input
                    type="text"
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                    placeholder="Type your response here..."
                    disabled={loading}
                    autoFocus
                  />
                  <button 
                    className="btn btn-primary" 
                    onClick={() => handleSubmit()}
                    disabled={loading || !userInput.trim()}
                  >
                    Send ➜
                  </button>
                </div>
              )}

              {/* Speak Mode */}
              {inputMode === 'speak' && (
                <div className="speak-input">
                  <VoiceInput onTranscript={handleVoiceInput} />
                  {userInput && (
                    <div className="transcript-preview">
                      You said: "{userInput}"
                    </div>
                  )}
                </div>
              )}

              {/* Quick Response Mode */}
              {inputMode === 'quick' && (
                <div className="quick-responses">
                  {quickResponses.map((response, index) => (
                    <button
                      key={index}
                      className="btn btn-success quick-btn"
                      onClick={() => handleQuickResponse(response)}
                      disabled={loading}
                    >
                      {response}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Feedback Step */}
        {step === 'feedback' && (
          <div className="feedback-screen">
            <div className="feedback-card card">
              {/* Score Display */}
              <div className="score-display">
                <div className="score-circle">
                  <span className="score-number">{score}</span>
                  <span className="score-label">/10</span>
                </div>
                <h2>
                  {score >= 8 ? "Excellent! 🌟" : 
                   score >= 6 ? "Great Job! 👍" : 
                   "Good Try! 💪"}
                </h2>
              </div>

              {/* Feedback Items */}
              <div className="feedback-list">
                {feedback.map((item, index) => (
                  <div key={index} className="feedback-item">
                    <span className="feedback-icon">
                      {item.startsWith('✓') ? '✅' : '⚠️'}
                    </span>
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Encouragement */}
              <div className="encouragement">
                {score >= 8 ? (
                  <p>You're doing amazing! Keep up the great work!</p>
                ) : score >= 6 ? (
                  <p>You're making great progress! Let's practice more!</p>
                ) : (
                  <p>That's okay! Practice makes perfect. Try again!</p>
                )}
              </div>

              {/* Actions */}
              <div className="feedback-actions">
                <button 
                  className="btn btn-primary"
                  onClick={tryAgain}
                >
                  Practice Again
                </button>
                <button 
                  className="btn btn-success"
                  onClick={finish}
                >
                  Done for Now
                </button>
              </div>

              {/* Progress Indicator */}
              <div className="session-progress">
                <p>Practice sessions today: {attempts}</p>
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{width: `${Math.min(attempts * 20, 100)}%`}}
                  >
                    {Math.min(attempts * 20, 100)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GreetingPractice;
