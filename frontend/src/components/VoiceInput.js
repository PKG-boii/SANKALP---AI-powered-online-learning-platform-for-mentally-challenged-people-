import React, { useState } from 'react';
import './VoiceInput.css';

const VoiceInput = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);

  const startListening = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onTranscript(transcript);
      setIsListening(false);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  return (
    <div className="voice-input">
      <button
        className={`btn btn-large ${isListening ? 'btn-danger' : 'btn-primary'}`}
        onClick={startListening}
        disabled={isListening}
      >
        {isListening ? (
          <>
            <span className="listening-indicator"></span>
            Listening...
          </>
        ) : (
          <>
            🎤 Tap to Speak
          </>
        )}
      </button>
    </div>
  );
};

export default VoiceInput;
