import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ScenarioPractice = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [score, setScore] = useState(0);

  const scenario = {
    title: "Making a New Friend",
    story: "You see a child playing alone at the park. You want to play with them.",
    steps: [
      {
        question: "What should you do first?",
        options: [
          { text: "Walk over and say hi", points: 10, feedback: "Perfect! Friendly greeting!" },
          { text: "Take their toy", points: 0, feedback: "No, that's not nice. We should ask first." },
          { text: "Just stare at them", points: 2, feedback: "Try saying hello instead!" }
        ]
      },
      {
        question: "They say hi back! What next?",
        options: [
          { text: "Ask 'Can I play with you?'", points: 10, feedback: "Great! You asked politely!" },
          { text: "Start playing without asking", points: 3, feedback: "Better to ask first." },
          { text: "Run away", points: 0, feedback: "Why run? They seem friendly!" }
        ]
      }
    ]
  };

  const handleChoice = (option) => {
    setScore(score + option.points);
    alert(option.feedback);
    
    if (step < scenario.steps.length - 1) {
      setStep(step + 1);
    } else {
      alert(`Scenario complete! Score: ${score + option.points}/20\n\nGreat job practicing social skills!`);
      navigate('/learn');
    }
  };

  return (
    <div className="scenario-practice" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FF9800 0%, #F44336 100%)', padding: '40px 20px' }}>
      <div className="container-narrow">
        <div className="card" style={{ padding: '40px' }}>
          <h1>🎭 {scenario.title}</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>{scenario.story}</p>

          <div style={{ background: '#f8f9fa', padding: '30px', borderRadius: '12px', marginBottom: '30px' }}>
            <h2>{scenario.steps[step].question}</h2>
          </div>

          <div style={{ display: 'grid', gap: '15px' }}>
            {scenario.steps[step].options.map((option, index) => (
              <button
                key={index}
                className="btn btn-large btn-primary"
                onClick={() => handleChoice(option)}
                style={{ textAlign: 'left', padding: '20px' }}
              >
                {option.text}
              </button>
            ))}
          </div>

          <button 
            className="btn" 
            onClick={() => navigate('/learn')}
            style={{ marginTop: '30px' }}
          >
            ← Back to Learning
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioPractice;
