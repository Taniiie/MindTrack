import os
from datetime import timedelta
from dotenv import load_dotenv

load_dotenv()

class Config:
    """Application configuration"""
    
    # Flask
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    DEBUG = os.getenv('FLASK_ENV', 'development') == 'development'
    
    # JWT
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt-secret-key-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    
    # Database
    DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///mindtrack.db')
    
    # CORS
    CORS_ORIGINS = ['http://localhost:5173', 'http://localhost:3000']
    
    # AI Models
    MOOD_MODEL_PATH = 'models/mood_classifier.pkl'
    COGNITIVE_MODEL_PATH = 'models/cognitive_analyzer.pkl'
    
    # Thresholds
    STRESS_THRESHOLD = 0.7
    ANXIETY_THRESHOLD = 0.65
    DEPRESSION_THRESHOLD = 0.6
    COGNITIVE_DECLINE_THRESHOLD = 0.5
    
    # Alert Settings
    ALERT_EMAIL_ENABLED = False
    ALERT_SMS_ENABLED = False
