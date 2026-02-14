import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const { user, logout, API_URL } = useAuth();
  const [children, setChildren] = useState([]);
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildName, setNewChildName] = useState('');
  const [newChildAge, setNewChildAge] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchChildren();
    }
  }, [user]);

  const fetchChildren = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/children/${user.id}`);
      setChildren(response.data.data || []);
    } catch (error) {
      console.error('Error fetching children:', error);
    }
  };

  const handleAddChild = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/children`, {
        parentId: user.id,
        name: newChildName,
        age: parseInt(newChildAge)
      });
      setNewChildName('');
      setNewChildAge('');
      setShowAddChild(false);
      fetchChildren();
    } catch (error) {
      console.error('Error adding child:', error);
    }
  };

  return (
    <div className="dashboard">
      <nav className="navbar">
        <div className="container">
          <h2>🎓 Learning Platform</h2>
          <div>
            <span>Welcome, {user?.email}!</span>
            <button onClick={logout} className="btn btn-danger" style={{ marginLeft: '20px' }}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="container" style={{ marginTop: '40px' }}>
        <h1>Parent Dashboard</h1>

        <div className="grid grid-2" style={{ marginTop: '30px' }}>
          {children.map(child => (
            <div key={child.id} className="card module-card">
              <h3>{child.name}</h3>
              <p>Age: {child.age}</p>
              <button 
                className="btn btn-primary"
                onClick={() => {
                  localStorage.setItem('currentChild', JSON.stringify(child));
                  navigate('/learn');
                }}
              >
                Start Learning
              </button>
            </div>
          ))}

          <div className="card module-card" onClick={() => setShowAddChild(true)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '4rem' }}>➕</div>
              <h3>Add Child</h3>
            </div>
          </div>
        </div>

        {showAddChild && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="card" style={{ maxWidth: '500px', padding: '40px' }}>
              <h2>Add Child Profile</h2>
              <form onSubmit={handleAddChild}>
                <div className="input-group">
                  <label>Name</label>
                  <input
                    type="text"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Age</label>
                  <input
                    type="number"
                    value={newChildAge}
                    onChange={(e) => setNewChildAge(e.target.value)}
                    required
                    min="3"
                    max="25"
                  />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="submit" className="btn btn-primary">Add</button>
                  <button type="button" className="btn" onClick={() => setShowAddChild(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
