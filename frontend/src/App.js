import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ChildPortal from './pages/ChildPortal';

// Modules
import GreetingPractice from './modules/greetings/GreetingPractice';
import EmotionPractice from './modules/emotions/EmotionPractice';
import ScenarioPractice from './modules/scenarios/ScenarioPractice';
import ConversationPractice from './modules/conversation/ConversationPractice';
import VideoPractice from './modules/video/VideoPractice';

// Auth Context
import { AuthProvider, useAuth } from './context/AuthContext';

// Protected Route Component
const ProtectedRoute = ({ children, requireRole }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireRole && user.role !== requireRole) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Parent/Teacher Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute requireRole="parent">
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Child Learning Routes */}
            <Route 
              path="/learn" 
              element={
                <ProtectedRoute>
                  <ChildPortal />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/learn/greetings" 
              element={
                <ProtectedRoute>
                  <GreetingPractice />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/learn/emotions" 
              element={
                <ProtectedRoute>
                  <EmotionPractice />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/learn/scenarios" 
              element={
                <ProtectedRoute>
                  <ScenarioPractice />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/learn/conversation" 
              element={
                <ProtectedRoute>
                  <ConversationPractice />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/learn/video" 
              element={
                <ProtectedRoute>
                  <VideoPractice />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
