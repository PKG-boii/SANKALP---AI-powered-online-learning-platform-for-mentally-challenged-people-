import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const EmotionPractice = () => {
  const navigate = useNavigate();
  const { currentChild } = useAuth();
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  // Real face emotion data with image URLs
  const emotions = [
    { 
      emotion: 'happy', 
      imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      clues: '😊 Look at: Smiling mouth, crinkled eyes, raised cheeks'
    },
    { 
      emotion: 'sad', 
      imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face',
      clues: '😢 Look at: Down-turned mouth, droopy eyes, furrowed brow'
    },
    { 
      emotion: 'angry', 
      imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop&crop=face',
      clues: '😠 Look at: Tight lips, narrowed eyes, tense jaw'
    },
    { 
      emotion: 'surprised', 
      imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face',
      clues: '😮 Look at: Wide open eyes, raised eyebrows, open mouth'
    },
    { 
      emotion: 'scared', 
      imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop&crop=face',
      clues: '😰 Look at: Wide eyes, raised eyebrows, tense expression'
    }
  ];

  const handleAnswer = (selected) => {
    setSelectedAnswer(selected);
    const isCorrect = selected === emotions[currentQuestion].emotion;
    
    if (isCorrect) {
      setScore(score + 1);
      setFeedback({
        type: 'correct',
        message: `✅ Excellent! That's correct - this person is ${selected}!`,
        details: emotions[currentQuestion].clues
      });
    } else {
      setFeedback({
        type: 'wrong',
        message: `Not quite! This person is actually ${emotions[currentQuestion].emotion}.`,
        details: emotions[currentQuestion].clues
      });
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < emotions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setFeedback(null);
      setSelectedAnswer(null);
    } else {
      alert(`Quiz complete! You got ${score} out of ${emotions.length} correct! 🎉`);
      navigate('/learn');
    }
  };

  return (
    <div className="emotion-practice" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
      padding: '40px 20px',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        <div className="bubble bubble-1"></div>
        <div className="bubble bubble-2"></div>
        <div className="bubble bubble-3"></div>
      </div>

      <div className="container-narrow" style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '40px',
          color: 'white'
        }}>
          <h1 style={{ 
            fontSize: '3.5rem', 
            marginBottom: '10px',
            textShadow: '0 5px 20px rgba(0,0,0,0.5)'
          }}>
            😊 Emotion Recognition
          </h1>
          <p style={{ 
            fontSize: '1.5rem',
            textShadow: '0 2px 10px rgba(0,0,0,0.3)'
          }}>
            Question {currentQuestion + 1} of {emotions.length} | Score: {score}
          </p>
        </div>

        <div className="card" style={{ 
          padding: '50px', 
          textAlign: 'center',
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '30px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
        }}>
          {/* Face Image */}
          <div style={{ 
            marginBottom: '40px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <img 
              src={emotions[currentQuestion].imageUrl}
              alt="Person's face"
              style={{
                width: '350px',
                height: '350px',
                borderRadius: '20px',
                objectFit: 'cover',
                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                border: '5px solid white'
              }}
              onError={(e) => {
                // Fallback to emoji if image fails to load
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <div style={{ 
              display: 'none', 
              fontSize: '15rem',
              filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.3))'
            }}>
              {emotions[currentQuestion].emotion === 'happy' && '😊'}
              {emotions[currentQuestion].emotion === 'sad' && '😢'}
              {emotions[currentQuestion].emotion === 'angry' && '😠'}
              {emotions[currentQuestion].emotion === 'surprised' && '😮'}
              {emotions[currentQuestion].emotion === 'scared' && '😰'}
            </div>
          </div>

          <h2 style={{ 
            fontSize: '2rem', 
            marginBottom: '30px',
            color: '#333'
          }}>
            How is this person feeling?
          </h2>

          {/* Feedback Section - Shows inline */}
          {feedback && (
            <div style={{
              padding: '25px',
              borderRadius: '15px',
              marginBottom: '30px',
              background: feedback.type === 'correct' ? '#E8F5E9' : '#FFEBEE',
              border: `3px solid ${feedback.type === 'correct' ? '#4CAF50' : '#F44336'}`,
              animation: 'slideDown 0.3s ease'
            }}>
              <p style={{ 
                fontSize: '1.5rem', 
                fontWeight: 'bold',
                color: feedback.type === 'correct' ? '#2E7D32' : '#C62828',
                marginBottom: '15px'
              }}>
                {feedback.message}
              </p>
              <p style={{ 
                fontSize: '1.2rem',
                color: '#555',
                lineHeight: '1.8'
              }}>
                {feedback.details}
              </p>
            </div>
          )}

          {/* Answer Buttons */}
          {!feedback && (
            <div style={{ 
              display: 'grid', 
              gap: '15px',
              marginBottom: '20px'
            }}>
              {['happy', 'sad', 'angry', 'surprised', 'scared'].map(emotion => (
                <button
                  key={emotion}
                  className="btn btn-large"
                  onClick={() => handleAnswer(emotion)}
                  style={{ 
                    textTransform: 'capitalize',
                    fontSize: '1.5rem',
                    background: selectedAnswer === emotion ? '#667eea' : 'linear-gradient(135deg, #667eea, #764ba2)',
                    color: 'white'
                  }}
                >
                  {emotion === 'happy' && '😊'} 
                  {emotion === 'sad' && '😢'} 
                  {emotion === 'angry' && '😠'} 
                  {emotion === 'surprised' && '😮'} 
                  {emotion === 'scared' && '😰'} 
                  {' '}{emotion}
                </button>
              ))}
            </div>
          )}

          {/* Next Button - Shows after feedback */}
          {feedback && (
            <button 
              className="btn btn-large btn-primary"
              onClick={nextQuestion}
              style={{ fontSize: '1.5rem' }}
            >
              {currentQuestion < emotions.length - 1 ? 'Next Question ➜' : 'Finish Quiz 🎉'}
            </button>
          )}

          <button 
            className="btn" 
            onClick={() => navigate('/learn')}
            style={{ marginTop: '20px' }}
          >
            ← Back to Learning
          </button>
        </div>
      </div>

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default EmotionPractice;
