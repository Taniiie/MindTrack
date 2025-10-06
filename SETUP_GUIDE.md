# MindTrack Setup Guide

## Quick Start Guide

Follow these steps to get MindTrack up and running on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:
- **Python 3.9 or higher** - [Download Python](https://www.python.org/downloads/)
- **Node.js 16 or higher** - [Download Node.js](https://nodejs.org/)
- **Git** (optional) - For version control

### Step 1: Backend Setup

1. **Navigate to the backend directory:**
   ```bash
   cd mindtrack/backend
   ```

2. **Create a virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate the virtual environment:**
   - **Windows:**
     ```bash
     venv\Scripts\activate
     ```
   - **Mac/Linux:**
     ```bash
     source venv/bin/activate
     ```

4. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Create environment file:**
   - Copy `.env.example` to `.env`
   - Update the secret keys (important for production!)
   ```bash
   copy .env.example .env
   ```

6. **Initialize the database:**
   ```bash
   python init_db.py
   ```

7. **Start the backend server:**
   ```bash
   python app.py
   ```
   
   The backend should now be running on `http://localhost:5000`

### Step 2: Frontend Setup

1. **Open a new terminal and navigate to the frontend directory:**
   ```bash
   cd mindtrack/frontend
   ```

2. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   The frontend should now be running on `http://localhost:5173`

### Step 3: Access the Application

1. Open your web browser and go to `http://localhost:5173`
2. Click "Sign up" to create a new account
3. Fill in your details and register
4. Start using MindTrack!

## Troubleshooting

### Backend Issues

**Problem: Module not found errors**
- Solution: Make sure you've activated the virtual environment and installed all dependencies
  ```bash
  pip install -r requirements.txt
  ```

**Problem: Database errors**
- Solution: Delete the existing database and reinitialize
  ```bash
  del mindtrack.db
  python init_db.py
  ```

**Problem: Port 5000 already in use**
- Solution: Change the port in `app.py` or kill the process using port 5000

### Frontend Issues

**Problem: npm install fails**
- Solution: Clear npm cache and try again
  ```bash
  npm cache clean --force
  npm install
  ```

**Problem: Port 5173 already in use**
- Solution: The Vite dev server will automatically try the next available port

**Problem: API connection errors**
- Solution: Ensure the backend is running on port 5000 and check the proxy configuration in `vite.config.js`

## Production Deployment

### Backend Deployment

1. **Set production environment variables:**
   - Generate secure secret keys
   - Set `FLASK_ENV=production`
   - Configure production database

2. **Use a production WSGI server:**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -b 0.0.0.0:5000 app:app
   ```

### Frontend Deployment

1. **Build the production bundle:**
   ```bash
   npm run build
   ```

2. **Deploy the `dist` folder to your hosting service**
   - Netlify, Vercel, or any static hosting
   - Update API endpoint in production

## Security Considerations

⚠️ **Important for Production:**

1. **Change all secret keys** in `.env` file
2. **Enable HTTPS** for all communications
3. **Implement rate limiting** on API endpoints
4. **Add input validation** and sanitization
5. **Set up proper CORS** policies
6. **Use environment-specific configurations**
7. **Implement proper session management**
8. **Add logging and monitoring**

## Database Backup

To backup your database:
```bash
copy backend\mindtrack.db backend\mindtrack_backup.db
```

## Updating Dependencies

### Backend:
```bash
pip install --upgrade -r requirements.txt
```

### Frontend:
```bash
npm update
```

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the main README.md
3. Check application logs for error messages

## Next Steps

After setup:
1. Explore the dashboard
2. Track your mood daily
3. Chat with the AI Wellness Companion for support and guidance
4. Play cognitive games
5. Add health metrics
6. Write journal entries
7. Review AI-generated recommendations

## New Feature: AI Wellness Companion 🤖💙

The AI Wellness Companion is an empathetic chatbot that provides:
- **Emotional Support**: Listens and responds to your feelings with empathy
- **Daily Affirmations**: Personalized positive messages throughout the day
- **Mindfulness Exercises**: Guided breathing, grounding, and meditation techniques
- **Mood-Boosting Activities**: Suggestions tailored to your emotional state
- **Pattern Analysis**: Tracks your emotional trends and provides insights
- **Context-Aware Responses**: Integrates with your health data for personalized support

Access the chatbot from the "AI Wellness Companion" menu item in the navigation sidebar.

Enjoy using MindTrack! 🧠💙
