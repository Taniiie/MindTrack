# MindTrack – AI-Powered Mental Health & Early Cognitive Decline Monitor

## 🧠 Overview

MindTrack is a comprehensive digital health platform that combines AI, wearable sensor integration, and behavioral analytics to monitor and improve mental health, cognitive function, and overall well-being.

## ✨ Key Features

- **AI Wellness Companion (Chatbot)**: Empathetic AI chatbot for mental health support, daily affirmations, and personalized wellness insights
- **Wearable Health Integration**: Track sleep, heart rate variability, activity levels, and stress biomarkers
- **AI Mood & Stress Detection**: Analyze voice patterns, messages, and journaling to identify emotional shifts
- **Cognitive Wellness Games**: Adaptive brain-training exercises to detect early signs of cognitive decline
- **Personalized Care Recommendations**: AI-driven suggestions for meditation, exercise, and therapy
- **Alerts & Support Network**: Notify caregivers of concerning patterns for timely intervention
- **Holistic Wellness Dashboard**: Integrated view of physical health, mental health, and lifestyle data

## 🚀 Tech Stack

### Backend
- **Python 3.9+** with Flask
- **SQLite** for database
- **TensorFlow/Scikit-learn** for AI models
- **JWT** for authentication

### Frontend
- **React 18** with Vite
- **TailwindCSS** for styling
- **Recharts** for data visualization
- **Lucide React** for icons
- **Axios** for API calls

## 📦 Installation

### Prerequisites
- Python 3.9 or higher
- Node.js 16 or higher
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Create a virtual environment:
```bash
python -m venv venv
```

3. Activate the virtual environment:
- Windows: `venv\Scripts\activate`
- Mac/Linux: `source venv/bin/activate`

4. Install dependencies:
```bash
pip install -r requirements.txt
```

5. Initialize the database:
```bash
python init_db.py
```

6. Run the backend server:
```bash
python app.py
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🎮 Usage

1. **Register/Login**: Create an account or login to access the dashboard
2. **Connect Wearables**: Link your fitness tracker or smartwatch (simulated in demo)
3. **Daily Check-ins**: Complete mood assessments and journal entries
4. **Play Cognitive Games**: Engage with brain-training exercises
5. **View Insights**: Monitor your wellness dashboard and AI-generated recommendations
6. **Set Alerts**: Configure caregiver notifications for concerning patterns

## 🧪 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Health Tracking
- `GET /api/health/metrics` - Get user health metrics
- `POST /api/health/metrics` - Submit health data
- `GET /api/health/trends` - Get health trends

### Mood & Mental Health
- `POST /api/mood/analyze` - Analyze mood from text/voice
- `GET /api/mood/history` - Get mood history
- `POST /api/journal/entry` - Create journal entry

### Cognitive Assessment
- `POST /api/cognitive/game-result` - Submit game results
- `GET /api/cognitive/assessment` - Get cognitive assessment
- `GET /api/cognitive/trends` - Get cognitive trends

### AI Wellness Chatbot
- `POST /api/chatbot/message` - Send message to chatbot
- `GET /api/chatbot/history` - Get conversation history
- `GET /api/chatbot/affirmation` - Get daily affirmation
- `GET /api/chatbot/emotional-patterns` - Analyze emotional patterns
- `DELETE /api/chatbot/clear-history` - Clear conversation history

### Recommendations
- `GET /api/recommendations` - Get personalized recommendations
- `POST /api/alerts/configure` - Configure alert settings

## 🔒 Security

- JWT-based authentication
- Password hashing with bcrypt
- CORS protection
- Input validation and sanitization
- Secure API endpoints

## 🤝 Contributing

This is a demo project for educational purposes. Feel free to extend and customize it for your needs.

## 📄 License

MIT License - Feel free to use this project for learning and development.

## 🆘 Support

For issues or questions, please create an issue in the repository.

---

**Note**: This is a demonstration platform. For production use, ensure proper medical compliance (HIPAA, GDPR), security audits, and professional healthcare provider integration.
