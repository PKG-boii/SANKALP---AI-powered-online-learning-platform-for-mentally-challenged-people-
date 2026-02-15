import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const VideoPractice = () => {
  const navigate = useNavigate();
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);
  const [stream, setStream] = useState(null);
  const [recordedVideos, setRecordedVideos] = useState([]);
  const [currentVideoURL, setCurrentVideoURL] = useState(null);
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 1280, height: 720 }, 
        audio: true 
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(err => {
          // Ignore play interruption errors
          if (err.name !== 'AbortError') {
            console.error('Video play error:', err);
          }
        });
      }
    } catch (error) {
      alert('Camera access denied. Please allow camera access to use this feature.');
      console.error('Camera error:', error);
    }
  };

  // Auto-start camera when component loads
  useEffect(() => {
    let isMounted = true;
    
    if (isMounted) {
      startCamera();
    }
    
    return () => {
      isMounted = false;
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const startRecording = () => {
    if (!stream) return;
    
    chunksRef.current = [];
    
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm;codecs=vp8,opus'
    });
    
    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };
    
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/webm' });
      const url = URL.createObjectURL(blob);
      
      const newVideo = {
        id: Date.now(),
        url: url,
        timestamp: new Date().toLocaleString()
      };
      
      setRecordedVideos(prev => [...prev, newVideo]);
      setCurrentVideoURL(url);
      setHasRecorded(true);
    };
    
    mediaRecorderRef.current = mediaRecorder;
    mediaRecorder.start();
    setIsRecording(true);
    
    // Auto-stop after 10 seconds
    setTimeout(() => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        stopRecording();
      }
    }, 10000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const recordAgain = () => {
    setHasRecorded(false);
    setCurrentVideoURL(null);
  };

  const deleteVideo = (videoId) => {
    const videoToDelete = recordedVideos.find(v => v.id === videoId);
    if (videoToDelete) {
      URL.revokeObjectURL(videoToDelete.url);
    }
    setRecordedVideos(recordedVideos.filter(v => v.id !== videoId));
  };

  return (
    <div className="video-practice" style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #F44336 0%, #E91E63 100%)', 
      padding: '40px 20px' 
    }}>
      <div className="container-narrow">
        <div className="card" style={{ 
          padding: '50px', 
          textAlign: 'center',
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '30px'
        }}>
          <h1>📹 Video Practice</h1>
          <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
            Record yourself practicing greetings and get feedback!
          </p>

          {/* Live Video Feed */}
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
                    transform: 'scaleX(-1)',
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
                    🔴 RECORDING (10 sec max)
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

          {/* Playback of Just Recorded Video */}
          {hasRecorded && currentVideoURL && (
            <div style={{ marginBottom: '30px' }}>
              <h2 style={{ marginBottom: '20px' }}>✅ Recording Complete!</h2>
              <div style={{ 
                background: '#000', 
                borderRadius: '20px', 
                overflow: 'hidden', 
                marginBottom: '30px' 
              }}>
                <video 
                  src={currentVideoURL}
                  controls
                  style={{ 
                    width: '100%', 
                    maxWidth: '800px',
                    borderRadius: '20px'
                  }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button 
                  className="btn btn-primary btn-large"
                  onClick={recordAgain}
                >
                  📹 Record Another
                </button>
              </div>
            </div>
          )}

          {/* List of All Recorded Videos */}
          {recordedVideos.length > 0 && (
            <div style={{ 
              marginTop: '50px', 
              padding: '30px', 
              background: '#f5f5f5', 
              borderRadius: '20px' 
            }}>
              <h2 style={{ marginBottom: '25px' }}>
                🎬 Your Recordings ({recordedVideos.length})
              </h2>
              
              <div style={{ 
                display: 'grid', 
                gap: '20px',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))'
              }}>
                {recordedVideos.map((video, index) => (
                  <div 
                    key={video.id}
                    style={{ 
                      background: 'white', 
                      padding: '15px', 
                      borderRadius: '15px',
                      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                    }}
                  >
                    <div style={{ 
                      fontWeight: 'bold', 
                      marginBottom: '10px',
                      fontSize: '1.1rem'
                    }}>
                      Recording #{recordedVideos.length - index}
                    </div>
                    <div style={{ 
                      fontSize: '0.9rem', 
                      color: '#666', 
                      marginBottom: '15px' 
                    }}>
                      {video.timestamp}
                    </div>
                    <video 
                      src={video.url}
                      controls
                      style={{ 
                        width: '100%', 
                        borderRadius: '10px',
                        marginBottom: '15px'
                      }}
                    />
                    <button 
                      className="btn btn-danger"
                      onClick={() => deleteVideo(video.id)}
                      style={{ width: '100%' }}
                    >
                      🗑 Delete
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button 
            className="btn" 
            onClick={() => navigate('/learn')}
            style={{ marginTop: '30px' }}
          >
            ← Back to Learning
          </button>
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default VideoPractice;