import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const VideoPractice = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [stream, setStream] = useState(null);
  const videoRef = useRef(null);
  const [recordedVideoURL, setRecordedVideoURL] = useState(null);

  // Auto-start camera when component loads
  React.useEffect(() => {
    startCamera();
    
    // Cleanup: stop camera when leaving page
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: true 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play();
      }
    } catch (error) {
      alert('Camera access denied. Please allow camera access to use this feature.');
      console.error('Camera error:', error);
    }
  };

  const startRecording = () => {
    setIsRecording(true);
    setHasRecorded(false);
    // In a real app, this would use MediaRecorder API
    setTimeout(() => {
      stopRecording();
    }, 5000); // Auto-stop after 5 seconds for demo
  };

  const stopRecording = () => {
    setIsRecording(false);
    setHasRecorded(true);
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    // In real app, would create blob URL of recording
    alert('Recording saved! In the real app, you would see your video here and get AI feedback on your practice.');
  };

  return (
    <div className="video-practice" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #F44336 0%, #E91E63 100%)', padding: '40px 20px' }}>
      <div className="container-narrow">
        <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
          <h1>📹 Video Practice</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
            Record yourself practicing greetings and get feedback!
          </p>

          <div style={{ background: '#f8f9fa', borderRadius: '12px', padding: '20px', marginBottom: '30px' }}>
            <h3>Instructions:</h3>
            <ol style={{ textAlign: 'left', fontSize: '1.1rem', lineHeight: '2' }}>
              <li>Click "Start Camera" to begin</li>
              <li>Position yourself in frame</li>
              <li>Click "Record" when ready</li>
              <li>Practice your greeting (smile, wave, say hello)</li>
              <li>Review and get feedback</li>
            </ol>
          </div>

          {!hasRecorded && (
            <div>
              <div style={{ 
                background: '#000', 
                borderRadius: '20px', 
                overflow: 'hidden', 
                marginBottom: '30px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
                position: 'relative'
              }}>
                <video 
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  style={{ 
                    width: '100%', 
                    maxWidth: '800px', 
                    borderRadius: '20px',
                    transform: 'scaleX(-1)', // Mirror effect
                    display: 'block'
                  }}
                />
                {isRecording && (
                  <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    background: 'red',
                    color: 'white',
                    padding: '10px 20px',
                    borderRadius: '25px',
                    fontWeight: 'bold',
                    fontSize: '1.2rem',
                    animation: 'pulse 1s infinite'
                  }}>
                    🔴 RECORDING
                  </div>
                )}
              </div>
              
              {!isRecording ? (
                <button 
                  className="btn btn-large btn-danger"
                  onClick={startRecording}
                  style={{ fontSize: '1.5rem', padding: '20px 50px' }}
                >
                  🔴 Start Recording
                </button>
              ) : (
                <button 
                  className="btn btn-large"
                  onClick={stopRecording}
                  style={{ 
                    background: '#333', 
                    color: 'white',
                    fontSize: '1.5rem', 
                    padding: '20px 50px' 
                  }}
                >
                  ⏹ Stop Recording
                </button>
              )}
            </div>
          )}

          {hasRecorded && (
            <div style={{ background: '#E8F5E9', padding: '30px', borderRadius: '12px', marginBottom: '20px' }}>
              <h2>✅ Great Job!</h2>
              <p style={{ fontSize: '1.2rem', marginTop: '20px' }}>
                In the full version, you would see:
              </p>
              <ul style={{ textAlign: 'left', fontSize: '1.1rem', marginTop: '20px' }}>
                <li>✅ Your recorded video</li>
                <li>✅ AI analysis of your greeting</li>
                <li>✅ Feedback on smile, eye contact, and voice</li>
                <li>✅ Comparison with example videos</li>
                <li>✅ Score and encouragement</li>
              </ul>
              <button 
                className="btn btn-primary btn-large"
                onClick={() => {
                  setHasRecorded(false);
                  setStream(null);
                }}
                style={{ marginTop: '20px' }}
              >
                Record Again
              </button>
            </div>
          )}

          <button 
            className="btn" 
            onClick={() => navigate('/learn')}
            style={{ marginTop: '20px' }}
          >
            ← Back to Learning
          </button>

          <div style={{ marginTop: '30px', padding: '20px', background: '#FFF3E0', borderRadius: '8px', fontSize: '0.95rem' }}>
            <strong>Note:</strong> This is a demo version. The full app would include actual video recording and AI-powered feedback on your practice sessions.
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPractice;
