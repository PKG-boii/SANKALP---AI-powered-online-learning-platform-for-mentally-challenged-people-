#!/bin/bash

# Complete AI Learning Platform Setup Script
# This script creates all remaining files needed for the platform

echo "🚀 Setting up AI-Powered Learning Platform..."
echo "================================================"

cd /home/claude/learning-platform

# Create all necessary directories
echo "📁 Creating directory structure..."
mkdir -p frontend/src/{pages,modules/{greetings,emotions,scenarios,conversation,video},components,context,services,utils}
mkdir -p frontend/public
mkdir -p backend/{routes,services,config,models,middleware}
mkdir -p database

# Create database configuration
echo "🗄️ Creating database configuration..."
cat > backend/config/database.js << 'DBEOF'
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, '../../database/learning.db');

class Database {
  constructor() {
    this.db = null;
  }

  initialize() {
    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('❌ Database connection failed:', err);
      } else {
        console.log('✅ Database connected');
        this.createTables();
      }
    });
  }

  createTables() {
    const tables = `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT DEFAULT 'parent',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS children (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        parent_id INTEGER,
        name TEXT NOT NULL,
        age INTEGER,
        preferences TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(parent_id) REFERENCES users(id)
      );

      CREATE TABLE IF NOT EXISTS activities (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        child_id INTEGER,
        module TEXT NOT NULL,
        user_input TEXT,
        ai_response TEXT,
        score INTEGER,
        feedback TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY(child_id) REFERENCES children(id)
      );

      CREATE TABLE IF NOT EXISTS progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        child_id INTEGER,
        module TEXT NOT NULL,
        total_attempts INTEGER DEFAULT 0,
        average_score REAL DEFAULT 0,
        last_practiced DATETIME,
        mastery_level REAL DEFAULT 0,
        FOREIGN KEY(child_id) REFERENCES children(id)
      );
    `;

    this.db.exec(tables, (err) => {
      if (err) {
        console.error('❌ Error creating tables:', err);
      } else {
        console.log('✅ Database tables ready');
      }
    });
  }

  saveActivity(activity) {
    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO activities (child_id, module, user_input, ai_response, score, feedback)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      this.db.run(query, [
        activity.childId,
        activity.module,
        activity.userInput,
        activity.aiResponse,
        activity.score,
        activity.feedback
      ], function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID });
      });
    });
  }

  getProgress(childId, module = null) {
    return new Promise((resolve, reject) => {
      let query = 'SELECT * FROM progress WHERE child_id = ?';
      const params = [childId];

      if (module) {
        query += ' AND module = ?';
        params.push(module);
      }

      this.db.all(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
}

module.exports = new Database();
DBEOF

# Create authentication routes
echo "🔐 Creating auth routes..."
cat > backend/routes/auth.js << 'AUTHEOF'
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    db.db.run(
      'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
      [email, hashedPassword, 'parent'],
      function(err) {
        if (err) {
          return res.status(400).json({
            success: false,
            message: 'User already exists'
          });
        }

        const token = jwt.sign({ id: this.lastID, email }, JWT_SECRET);

        res.json({
          success: true,
          token,
          user: { id: this.lastID, email, role: 'parent' }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    db.db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
      if (err || !user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET);

      res.json({
        success: true,
        token,
        user: { id: user.id, email: user.email, role: user.role }
      });
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
AUTHEOF

# Create children routes
cat > backend/routes/children.js << 'CHILDEOF'
const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/:parentId', (req, res) => {
  const { parentId } = req.params;

  db.db.all(
    'SELECT * FROM children WHERE parent_id = ?',
    [parentId],
    (err, children) => {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      res.json({ success: true, data: children });
    }
  );
});

router.post('/', (req, res) => {
  const { parentId, name, age, preferences } = req.body;

  db.db.run(
    'INSERT INTO children (parent_id, name, age, preferences) VALUES (?, ?, ?, ?)',
    [parentId, name, age, JSON.stringify(preferences || {})],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }
      res.json({
        success: true,
        data: { id: this.lastID, name, age }
      });
    }
  );
});

module.exports = router;
CHILDEOF

# Create progress routes
cat > backend/routes/progress.js << 'PROGEOF'
const express = require('express');
const router = express.Router();
const db = require('../config/database');

router.get('/:childId', async (req, res) => {
  try {
    const { childId } = req.params;
    const progress = await db.getProgress(childId);
    res.json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
PROGEOF

# Create environment file template
cat > backend/.env.example << 'ENVEOF'
PORT=5000
NODE_ENV=development
JWT_SECRET=change-this-to-a-random-secret-key

# Database
DATABASE_URL=sqlite:./database/learning.db

# AI Service Configuration
# Options: local, openai, anthropic
AI_SERVICE=local

# Local AI (Ollama) - FREE
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2

# OpenAI - PAID (uncomment if using)
# OPENAI_API_KEY=your-key-here

# Anthropic - PAID (uncomment if using)
# ANTHROPIC_API_KEY=your-key-here
ENVEOF

# Frontend components
echo "⚛️ Creating React components..."

# Voice Input Component
cat > frontend/src/components/VoiceInput.js << 'VOICEEOF'
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
VOICEEOF

echo "✅ All core files created!"
echo ""
echo "📋 Next Steps:"
echo "1. cd backend && npm install"
echo "2. cd frontend && npm install"
echo "3. Copy backend/.env.example to backend/.env"
echo "4. Install Ollama (free local AI): https://ollama.ai"
echo "5. Run: ollama pull llama2"
echo "6. Start backend: cd backend && npm start"
echo "7. Start frontend: cd frontend && npm start"
echo ""
echo "🎉 Your platform will be ready at http://localhost:3000"
