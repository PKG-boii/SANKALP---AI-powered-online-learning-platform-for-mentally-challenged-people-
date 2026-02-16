# AI-Powered Learning Platform for Specially-Abled Children

An interactive learning platform focusing on communication and social skills development for children with Down syndrome and other special needs.

## 🎯 Core Features

### Implemented Modules:
1. **Greetings & Introductions** - AI-powered conversation practice
2. **Emotion Recognition** - Interactive emotion identification with feedback
3. **Social Scenarios** - Branching scenario practice with real-life situations
4. **Conversation Practice** - Role-play with AI characters
5. **Video Modeling & Feedback** - Record and analyze practice videos

### Platform Features:
- Adaptive AI that responds naturally to children
- Real-time feedback and encouragement
- Parent/Teacher dashboard for progress tracking
- Gamification with points and badges
- Speech recognition and text-to-speech support
- Accessible, child-friendly interface

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn
- Modern web browser (Chrome, Firefox, Edge)

### Installation

```bash
# Install dependencies
npm install

# Start frontend (React)
cd frontend
npm install
npm start
# Runs on http://localhost:3000

# Start backend (Node.js/Express)
cd backend
npm install
npm start
# Runs on http://localhost:5000
```

## 📁 Project Structure

```
learning-platform/
├── frontend/           # React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── modules/        # Learning modules
│   │   │   ├── greetings/
│   │   │   ├── emotions/
│   │   │   ├── scenarios/
│   │   │   ├── conversation/
│   │   │   └── video/
│   │   ├── pages/          # Main pages
│   │   ├── services/       # API calls
│   │   └── utils/          # Helper functions
│   └── public/
├── backend/            # Express API server
│   ├── routes/            # API endpoints
│   ├── services/          # Business logic
│   │   └── aiService.js   # AI integration
│   ├── models/            # Database models
│   └── config/            # Configuration
└── database/           # Database files (SQLite)
```

## 🎨 Technology Stack

### Frontend
- React.js - UI framework
- React Router - Navigation
- Axios - HTTP client
- Web Speech API - Voice input/output
- face-api.js - Facial expression analysis

### Backend
- Node.js + Express - Server framework
- SQLite - Local database (development)
- JWT - Authentication

### AI Integration Options
- **Free (Local)**: Ollama + LLaMA 2 or Mistral 7B
- **Paid (Better quality)**: OpenAI GPT-4 or Anthropic Claude API

## 🔧 Configuration

### Environment Variables

Create `.env` files in both frontend and backend:

**backend/.env:**
```
PORT=5000
DATABASE_URL=sqlite:./database/learning.db
JWT_SECRET=your_secret_key_here

# AI Service (choose one)
AI_SERVICE=local  # or 'openai' or 'anthropic'

# If using OpenAI
OPENAI_API_KEY=your_key_here

# If using Anthropic
ANTHROPIC_API_KEY=your_key_here

# If using local Ollama
OLLAMA_URL=http://localhost:11434
OLLAMA_MODEL=llama2
```

**frontend/.env:**
```
REACT_APP_API_URL=http://localhost:5000
```

## 📊 Database Schema

The platform uses SQLite for easy setup. Schema includes:
- `users` - Parent/teacher accounts
- `children` - Child profiles
- `activities` - Learning activity records
- `sessions` - Practice session data
- `progress` - Skill progress tracking

## 🎮 Usage

### For Parents/Teachers:
1. Create account and login
2. Add child profile(s)
3. Customize learning preferences
4. Assign modules and set goals
5. Track progress via dashboard

### For Children:
1. Parent logs them in
2. Choose learning module
3. Practice with AI guidance
4. Earn points and badges
5. Review progress

## 🧪 Testing

```bash
# Run frontend t add .ests
cd frontend
npm test

# Run backend tests
cd backend
npm test






