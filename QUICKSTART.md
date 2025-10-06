# MindTrack - Quick Start Guide

## 🚀 Get Started in 5 Minutes!

This guide will help you quickly set up and run MindTrack with the new AI Wellness Companion chatbot.

## ⚡ Prerequisites

Make sure you have installed:
- **Python 3.9+** - [Download](https://www.python.org/downloads/)
- **Node.js 16+** - [Download](https://nodejs.org/)

## 📦 Installation Steps

### Step 1: Backend Setup (2 minutes)

Open a terminal and run:

```bash
# Navigate to backend directory
cd mindtrack/backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database (creates all tables including chatbot tables)
python init_db.py
```

You should see: `Database initialized successfully!`

### Step 2: Start Backend (30 seconds)

```bash
# Make sure you're in backend directory and venv is activated
python app.py
```

You should see: `Running on http://127.0.0.1:5000`

**Keep this terminal open!**

### Step 3: Frontend Setup (2 minutes)

Open a **NEW terminal** and run:

```bash
# Navigate to frontend directory
cd mindtrack/frontend

# Install dependencies
npm install
```

### Step 4: Start Frontend (30 seconds)

```bash
# Make sure you're in frontend directory
npm run dev
```

You should see: `Local: http://localhost:5173/`

**Keep this terminal open too!**

## 🎉 Access the Application

1. Open your browser and go to: **http://localhost:5173**
2. Click **"Sign up"** to create an account
3. Fill in your details and register
4. You're in! 🎊

## 🤖 Try the AI Wellness Companion

1. Look at the left sidebar
2. Click **"AI Wellness Companion"** (has a chat bubble icon 💬)
3. Start chatting with your empathetic AI companion!

### Example Messages to Try:
- "I'm feeling anxious about work today"
- "I had a great day and feeling happy!"
- "I'm stressed and overwhelmed"
- "Can you help me relax?"

## 🎯 Explore Other Features

### Mood Tracker
- Click "Mood Tracker" in sidebar
- Share how you're feeling
- Get AI-powered mood analysis

### Cognitive Games
- Click "Cognitive Games"
- Play Memory Match, Reaction Test, or Sequence Recall
- Track your cognitive performance

### Health Metrics
- Click "Health Metrics"
- Add your health data (heart rate, sleep, steps)
- View trends over time

### Journal
- Click "Journal"
- Write your thoughts
- Get sentiment analysis

### Recommendations
- Click "Recommendations"
- Get personalized wellness suggestions
- Based on your data

## 🔧 Troubleshooting

### Backend won't start?
```bash
# Make sure virtual environment is activated
# You should see (venv) in your terminal prompt

# Try reinstalling dependencies
pip install --upgrade -r requirements.txt
```

### Frontend won't start?
```bash
# Clear npm cache
npm cache clean --force

# Reinstall dependencies
rm -rf node_modules
npm install
```

### Port already in use?
- **Backend (5000)**: Stop any other Flask apps or change port in `app.py`
- **Frontend (5173)**: Vite will automatically use next available port

### Database errors?
```bash
# Delete and recreate database
cd backend
del mindtrack.db  # Windows
# rm mindtrack.db  # Mac/Linux
python init_db.py
```

## 📱 What You Can Do Now

### With the AI Wellness Companion:
- 💬 Have empathetic conversations about your feelings
- 🌟 Receive daily affirmations
- 🧘 Get mindfulness exercise recommendations
- 📊 Track your emotional patterns over time
- 🎯 Receive personalized wellness suggestions
- ❤️ Get support during stressful moments

### With MindTrack:
- Track your mood daily
- Monitor health metrics
- Play brain-training games
- Write journal entries
- Get AI recommendations
- View comprehensive dashboard

## 🎨 Features Highlights

### AI Wellness Companion Features:
✅ Empathetic responses to your emotions
✅ Daily affirmations (morning/evening)
✅ 5 mindfulness exercises with instructions
✅ 12 mood-boosting activity suggestions
✅ Emotional pattern analysis
✅ Context-aware support (uses your health data)
✅ Professional help suggestions when needed
✅ Beautiful, modern chat interface
✅ Emotion-based color coding
✅ Conversation history

## 📚 Learn More

- **Full Setup Guide**: See `SETUP_GUIDE.md`
- **Chatbot User Guide**: See `CHATBOT_GUIDE.md`
- **All Features**: See `FEATURES.md`
- **Implementation Details**: See `CHATBOT_IMPLEMENTATION.md`
- **API Documentation**: See `API_DOCUMENTATION.md`

## 🆘 Need Help?

1. Check the troubleshooting section above
2. Review `SETUP_GUIDE.md` for detailed instructions
3. Check browser console for errors (F12)
4. Verify both backend and frontend are running
5. Make sure you're using correct URLs

## 🎊 You're All Set!

Enjoy using MindTrack with your new AI Wellness Companion! 

Remember: The chatbot is here to support you, but it's not a replacement for professional mental health care. If you're in crisis, please reach out to:
- **National Suicide Prevention Lifeline**: 988 (US)
- **Crisis Text Line**: Text HOME to 741741
- **Emergency Services**: 911

---

**Happy wellness journey!** 🧠💙✨
