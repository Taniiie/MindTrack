"""Database initialization script"""
from database import init_database

if __name__ == '__main__':
    print("Initializing MindTrack database...")
    init_database()
    print("Database setup complete!")
