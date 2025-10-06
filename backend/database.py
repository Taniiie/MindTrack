import sqlite3
import json
from datetime import datetime
from contextlib import contextmanager

DATABASE_NAME = 'mindtrack.db'

@contextmanager
def get_db():
    """Context manager for database connections"""
    conn = sqlite3.connect(DATABASE_NAME)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
        conn.commit()
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def init_database():
    """Initialize database with all required tables"""
    with get_db() as conn:
        cursor = conn.cursor()
        
        # Users table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                email TEXT UNIQUE NOT NULL,
                password_hash TEXT NOT NULL,
                full_name TEXT NOT NULL,
                date_of_birth TEXT,
                created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                last_login TEXT
            )
        ''')
        
        # Health metrics table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS health_metrics (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
                heart_rate INTEGER,
                hrv_score REAL,
                sleep_hours REAL,
                sleep_quality TEXT,
                steps INTEGER,
                activity_level TEXT,
                stress_level REAL,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Mood assessments table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS mood_assessments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
                mood_score REAL,
                anxiety_level REAL,
                stress_level REAL,
                depression_indicators REAL,
                text_input TEXT,
                voice_analysis TEXT,
                ai_analysis TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Journal entries table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS journal_entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
                content TEXT NOT NULL,
                sentiment_score REAL,
                emotions TEXT,
                keywords TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Cognitive assessments table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS cognitive_assessments (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
                game_type TEXT NOT NULL,
                score INTEGER,
                reaction_time REAL,
                accuracy REAL,
                difficulty_level INTEGER,
                cognitive_score REAL,
                memory_score REAL,
                focus_score REAL,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Recommendations table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS recommendations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
                category TEXT NOT NULL,
                title TEXT NOT NULL,
                description TEXT,
                priority TEXT,
                completed INTEGER DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Alerts table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS alerts (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
                alert_type TEXT NOT NULL,
                severity TEXT NOT NULL,
                message TEXT NOT NULL,
                acknowledged INTEGER DEFAULT 0,
                caregiver_notified INTEGER DEFAULT 0,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Caregivers table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS caregivers (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                caregiver_name TEXT NOT NULL,
                caregiver_email TEXT,
                caregiver_phone TEXT,
                relationship TEXT,
                notification_enabled INTEGER DEFAULT 1,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Chatbot conversations table
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chatbot_conversations (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER NOT NULL,
                timestamp TEXT DEFAULT CURRENT_TIMESTAMP,
                message TEXT NOT NULL,
                is_user INTEGER NOT NULL,
                sentiment_score REAL,
                emotion_detected TEXT,
                context_data TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        # Chatbot user profiles (for personalization)
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS chatbot_user_profiles (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER UNIQUE NOT NULL,
                conversation_count INTEGER DEFAULT 0,
                preferred_topics TEXT,
                emotional_patterns TEXT,
                last_affirmation_date TEXT,
                wellness_goals TEXT,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        ''')
        
        print("Database initialized successfully!")

if __name__ == '__main__':
    init_database()
