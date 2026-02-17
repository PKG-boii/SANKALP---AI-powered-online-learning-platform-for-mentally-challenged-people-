import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ConversationPractice = () => {
  const navigate = useNavigate();
  const [character, setCharacter] = useState(null);
  const [conversation, setConversation] = useState([]);
  const [userInput, setUserInput] = useState('');

  const characters = [
    { id: 'friend', name: 'Alex the Friend', emoji: '👦', greeting: 'Hey! Want to play?' },
    { id: 'teacher', name: 'Ms. Johnson', emoji: '👩‍🏫', greeting: 'Good morning! How are you?' },
    { id: 'shopkeeper', name: 'Mr. Lee', emoji: '👨‍💼', greeting: 'Hello! How can I help you?' }
  ];

  const startConversation = (char) => {
    setCharacter(char);
    setConversation([
      { role: 'ai', message: char.greeting }
    ]);
  };

  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async () => {
    if (!userInput.trim() || isLoading) return;

    const newConversation = [
      ...conversation,
      { role: 'user', message: userInput }
    ];

    setConversation(newConversation);
    setUserInput('');
    setIsLoading(true);

    try {
      const API_URL = process.env.REACT_APP_API_URL || 'https://sankalp-ai-powered-online-learning-t3o4.onrender.com';
      
      const response = await fetch(`${API_URL}/api/conversation/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userInput: userInput,
          character: character.id,
          characterName: character.name,
          conversationHistory: newConversation
        })
      });

      const data = await response.json();

      setConversation([
        ...newConversation,
        { role: 'ai', message: data.data?.aiResponse || data.message || "That's interesting! Tell me more!" }
      ]);
    } catch (error) {
      console.error('AI error:', error);
      // Fallback response if AI fails
      setConversation([
        ...newConversation,
        { role: 'ai', message: "That's great! Tell me more!" }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!character) {
    return (
      <div className="conversation-practice" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)', padding: '40px 20px' }}>
        <div className="container-narrow">
          <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <h1>💬 Conversation Practice</h1>
            <p style={{ fontSize: '1.2rem', marginBottom: '40px' }}>
              Choose someone to talk with!
            </p>

            <div style={{ display: 'grid', gap: '20px' }}>
              {characters.map(char => (
                <button
                  key={char.id}
                  className="btn btn-large btn-primary"
                  onClick={() => startConversation(char)}
                  style={{ padding: '30px', fontSize: '1.3rem' }}
                >
                  <span style={{ fontSize: '3rem', display: 'block', marginBottom: '10px' }}>
                    {char.emoji}
                  </span>
                  {char.name}
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
  }

  return (
    <div className="conversation-practice" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #9C27B0 0%, #673AB7 100%)', padding: '40px 20px' }}>
      <div className="container-narrow">
        <div className="card" style={{ padding: '40px' }}>
          <div style={{ textAlign: 'center', marginBottom: '30px' }}>
            <div style={{ fontSize: '4rem' }}>{character.emoji}</div>
            <h2>{character.name}</h2>
          </div>

          <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', maxHeight: '400px', overflowY: 'auto', marginBottom: '20px' }}>
            {conversation.map((msg, index) => (
              <div 
                key={index}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                  marginBottom: '15px'
                }}
              >
                <div
                  style={{
                    background: msg.role === 'user' ? '#2196F3' : 'white',
                    color: msg.role === 'user' ? 'white' : 'black',
                    padding: '15px 20px',
                    borderRadius: '20px',
                    maxWidth: '70%',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                >
                  {msg.message}
                </div>
              </div>
            ))}
          </div>

          

          <div style={{ display: 'flex', gap: '10px' }}>
            {isLoading && (
            <div style={{ 
              textAlign: 'left', 
              marginBottom: '15px',
              padding: '10px 20px',
              background: 'white',
              borderRadius: '20px',
              display: 'inline-block',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              {character.emoji} typing...
            </div>
          )}
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
              placeholder="Type your message..."
              style={{ flex: 1, padding: '15px', fontSize: '1.1rem', borderRadius: '8px', border: '2px solid #ddd' }}
            />
            <button 
              className="btn btn-primary"
              onClick={sendMessage}
              style={{ padding: '15px 30px' }}
            >
              Send
            </button>
          </div>

          <button 
            className="btn" 
            onClick={() => setCharacter(null)}
            style={{ marginTop: '20px', width: '100%' }}
          >
            Change Character
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConversationPractice;
