"""Main Flask application for MindTrack backend"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
import bcrypt
from datetime import datetime
import json
import sqlite3

from config import Config
from database import get_db
from models.ai_models import MoodAnalyzer, CognitiveAnalyzer, RecommendationEngine, WellnessChatbot

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
CORS(app, resources={r"/api/*": {"origins": Config.CORS_ORIGINS}})
jwt = JWTManager(app)

# Initialize AI models
mood_analyzer = MoodAnalyzer()
cognitive_analyzer = CognitiveAnalyzer()
recommendation_engine = RecommendationEngine()
wellness_chatbot = WellnessChatbot()


# ============================================================================
# Authentication Routes
# ============================================================================

@app.route('/api/auth/register', methods=['POST'])
def register():
    """Register a new user"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        full_name = data.get('full_name')
        date_of_birth = data.get('date_of_birth')
        
        if not all([email, password, full_name]):
            return jsonify({'error': 'Missing required fields'}), 400
        
        # Hash password
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        
        with get_db() as conn:
            cursor = conn.cursor()
            try:
                cursor.execute(
                    'INSERT INTO users (email, password_hash, full_name, date_of_birth) VALUES (?, ?, ?, ?)',
                    (email, password_hash, full_name, date_of_birth)
                )
                user_id = cursor.lastrowid
                
                # Create access token
                access_token = create_access_token(identity=str(user_id))
                
                return jsonify({
                    'message': 'User registered successfully',
                    'access_token': access_token,
                    'user': {
                        'id': user_id,
                        'email': email,
                        'full_name': full_name
                    }
                }), 201
            except sqlite3.IntegrityError:
                return jsonify({'error': 'Email already exists'}), 409
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/auth/login', methods=['POST'])
def login():
    """Login user"""
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')
        
        if not all([email, password]):
            return jsonify({'error': 'Missing email or password'}), 400
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM users WHERE email = ?', (email,))
            user = cursor.fetchone()
            
            if not user:
                return jsonify({'error': 'Invalid credentials'}), 401
            
            # Verify password
            if not bcrypt.checkpw(password.encode('utf-8'), user['password_hash'].encode('utf-8')):
                return jsonify({'error': 'Invalid credentials'}), 401
            
            # Update last login
            cursor.execute('UPDATE users SET last_login = ? WHERE id = ?', 
                         (datetime.now().isoformat(), user['id']))
            
            # Create access token
            access_token = create_access_token(identity=str(user['id']))
            
            return jsonify({
                'message': 'Login successful',
                'access_token': access_token,
                'user': {
                    'id': user['id'],
                    'email': user['email'],
                    'full_name': user['full_name']
                }
            }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# Health Metrics Routes
# ============================================================================

@app.route('/api/health/metrics', methods=['GET'])
@jwt_required()
def get_health_metrics():
    """Get user's health metrics"""
    try:
        user_id = int(get_jwt_identity())
        limit = request.args.get('limit', 30, type=int)
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''SELECT * FROM health_metrics 
                   WHERE user_id = ? 
                   ORDER BY timestamp DESC 
                   LIMIT ?''',
                (user_id, limit)
            )
            metrics = [dict(row) for row in cursor.fetchall()]
            
            return jsonify({'metrics': metrics}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/health/metrics', methods=['POST'])
@jwt_required()
def add_health_metrics():
    """Add health metrics data"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''INSERT INTO health_metrics 
                   (user_id, heart_rate, hrv_score, sleep_hours, sleep_quality, 
                    steps, activity_level, stress_level)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?)''',
                (user_id, data.get('heart_rate'), data.get('hrv_score'),
                 data.get('sleep_hours'), data.get('sleep_quality'),
                 data.get('steps'), data.get('activity_level'),
                 data.get('stress_level'))
            )
            
            return jsonify({'message': 'Health metrics added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/health/trends', methods=['GET'])
@jwt_required()
def get_health_trends():
    """Get health trends and analytics"""
    try:
        user_id = int(get_jwt_identity())
        days = request.args.get('days', 7, type=int)
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''SELECT * FROM health_metrics 
                   WHERE user_id = ? 
                   AND datetime(timestamp) >= datetime('now', '-' || ? || ' days')
                   ORDER BY timestamp ASC''',
                (user_id, days)
            )
            metrics = [dict(row) for row in cursor.fetchall()]
            
            # Calculate trends
            trends = {
                'avg_heart_rate': sum(m['heart_rate'] or 0 for m in metrics) / len(metrics) if metrics else 0,
                'avg_sleep_hours': sum(m['sleep_hours'] or 0 for m in metrics) / len(metrics) if metrics else 0,
                'avg_steps': sum(m['steps'] or 0 for m in metrics) / len(metrics) if metrics else 0,
                'avg_stress_level': sum(m['stress_level'] or 0 for m in metrics) / len(metrics) if metrics else 0,
                'data_points': len(metrics)
            }
            
            return jsonify({'trends': trends, 'data': metrics}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# Mood & Mental Health Routes
# ============================================================================

@app.route('/api/mood/analyze', methods=['POST'])
@jwt_required()
def analyze_mood():
    """Analyze mood from text input"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        text = data.get('text', '')
        
        # Perform AI analysis
        analysis = mood_analyzer.analyze_text(text)
        
        # Store in database
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''INSERT INTO mood_assessments 
                   (user_id, mood_score, anxiety_level, stress_level, 
                    depression_indicators, text_input, ai_analysis)
                   VALUES (?, ?, ?, ?, ?, ?, ?)''',
                (user_id, analysis['mood_score'], analysis['anxiety_level'],
                 analysis['stress_level'], analysis['depression_indicators'],
                 text, json.dumps(analysis))
            )
            
            # Check for alerts
            check_and_create_alerts(user_id, analysis)
        
        return jsonify({'analysis': analysis}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/mood/history', methods=['GET'])
@jwt_required()
def get_mood_history():
    """Get mood history"""
    try:
        user_id = int(get_jwt_identity())
        limit = request.args.get('limit', 30, type=int)
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''SELECT * FROM mood_assessments 
                   WHERE user_id = ? 
                   ORDER BY timestamp DESC 
                   LIMIT ?''',
                (user_id, limit)
            )
            history = [dict(row) for row in cursor.fetchall()]
            
            return jsonify({'history': history}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/journal/entry', methods=['POST'])
@jwt_required()
def create_journal_entry():
    """Create a journal entry"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        content = data.get('content', '')
        
        # Analyze sentiment
        analysis = mood_analyzer.analyze_text(content)
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''INSERT INTO journal_entries 
                   (user_id, content, sentiment_score, emotions, keywords)
                   VALUES (?, ?, ?, ?, ?)''',
                (user_id, content, analysis['mood_score'],
                 json.dumps(analysis['emotions']), '')
            )
            
            return jsonify({
                'message': 'Journal entry created',
                'sentiment': analysis
            }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/journal/entries', methods=['GET'])
@jwt_required()
def get_journal_entries():
    """Get journal entries"""
    try:
        user_id = int(get_jwt_identity())
        limit = request.args.get('limit', 20, type=int)
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''SELECT * FROM journal_entries 
                   WHERE user_id = ? 
                   ORDER BY timestamp DESC 
                   LIMIT ?''',
                (user_id, limit)
            )
            entries = [dict(row) for row in cursor.fetchall()]
            
            return jsonify({'entries': entries}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# Cognitive Assessment Routes
# ============================================================================

@app.route('/api/cognitive/game-result', methods=['POST'])
@jwt_required()
def submit_game_result():
    """Submit cognitive game result"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        
        game_type = data.get('game_type')
        score = data.get('score', 0)
        reaction_time = data.get('reaction_time', 0)
        accuracy = data.get('accuracy', 0)
        difficulty = data.get('difficulty_level', 1)
        
        # Analyze cognitive performance
        analysis = cognitive_analyzer.analyze_game_result(
            game_type, score, reaction_time, accuracy, difficulty
        )
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''INSERT INTO cognitive_assessments 
                   (user_id, game_type, score, reaction_time, accuracy, 
                    difficulty_level, cognitive_score, memory_score, focus_score)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)''',
                (user_id, game_type, score, reaction_time, accuracy, difficulty,
                 analysis['cognitive_score'], analysis['memory_score'], 
                 analysis['focus_score'])
            )
            
            return jsonify({
                'message': 'Game result submitted',
                'analysis': analysis
            }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/cognitive/assessment', methods=['GET'])
@jwt_required()
def get_cognitive_assessment():
    """Get cognitive assessment summary"""
    try:
        user_id = int(get_jwt_identity())
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''SELECT * FROM cognitive_assessments 
                   WHERE user_id = ? 
                   ORDER BY timestamp DESC 
                   LIMIT 10''',
                (user_id,)
            )
            assessments = [dict(row) for row in cursor.fetchall()]
            
            if assessments:
                # Detect trends
                trend_analysis = cognitive_analyzer.detect_decline_trend(assessments)
                
                # Calculate averages
                avg_cognitive = sum(a['cognitive_score'] or 0 for a in assessments) / len(assessments)
                avg_memory = sum(a['memory_score'] or 0 for a in assessments) / len(assessments)
                avg_focus = sum(a['focus_score'] or 0 for a in assessments) / len(assessments)
                
                return jsonify({
                    'summary': {
                        'avg_cognitive_score': round(avg_cognitive, 3),
                        'avg_memory_score': round(avg_memory, 3),
                        'avg_focus_score': round(avg_focus, 3),
                        'total_assessments': len(assessments)
                    },
                    'trend': trend_analysis,
                    'recent_assessments': assessments
                }), 200
            else:
                return jsonify({
                    'summary': None,
                    'message': 'No cognitive assessments found'
                }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/cognitive/trends', methods=['GET'])
@jwt_required()
def get_cognitive_trends():
    """Get cognitive performance trends"""
    try:
        user_id = int(get_jwt_identity())
        days = request.args.get('days', 30, type=int)
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''SELECT * FROM cognitive_assessments 
                   WHERE user_id = ? 
                   AND datetime(timestamp) >= datetime('now', '-' || ? || ' days')
                   ORDER BY timestamp ASC''',
                (user_id, days)
            )
            assessments = [dict(row) for row in cursor.fetchall()]
            
            return jsonify({'trends': assessments}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# Recommendations Routes
# ============================================================================

@app.route('/api/recommendations', methods=['GET'])
@jwt_required()
def get_recommendations():
    """Get personalized recommendations"""
    try:
        user_id = int(get_jwt_identity())
        
        # Gather user data
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Latest health metrics
            cursor.execute(
                'SELECT * FROM health_metrics WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1',
                (user_id,)
            )
            health = cursor.fetchone()
            
            # Latest mood assessment
            cursor.execute(
                'SELECT * FROM mood_assessments WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1',
                (user_id,)
            )
            mood = cursor.fetchone()
            
            # Latest cognitive assessment
            cursor.execute(
                'SELECT * FROM cognitive_assessments WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1',
                (user_id,)
            )
            cognitive = cursor.fetchone()
            
            # Compile user data
            user_data = {}
            if health:
                user_data.update(dict(health))
            if mood:
                user_data.update(dict(mood))
            if cognitive:
                user_data.update(dict(cognitive))
            
            # Generate recommendations
            recommendations = recommendation_engine.generate_recommendations(user_data)
            
            # Store recommendations
            for rec in recommendations:
                cursor.execute(
                    '''INSERT INTO recommendations 
                       (user_id, category, title, description, priority)
                       VALUES (?, ?, ?, ?, ?)''',
                    (user_id, rec['category'], rec['title'], 
                     rec['description'], rec['priority'])
                )
            
            return jsonify({'recommendations': recommendations}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# Alerts Routes
# ============================================================================

@app.route('/api/alerts', methods=['GET'])
@jwt_required()
def get_alerts():
    """Get user alerts"""
    try:
        user_id = int(get_jwt_identity())
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''SELECT * FROM alerts 
                   WHERE user_id = ? 
                   ORDER BY timestamp DESC 
                   LIMIT 20''',
                (user_id,)
            )
            alerts = [dict(row) for row in cursor.fetchall()]
            
            return jsonify({'alerts': alerts}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/alerts/<int:alert_id>/acknowledge', methods=['POST'])
@jwt_required()
def acknowledge_alert(alert_id):
    """Acknowledge an alert"""
    try:
        user_id = int(get_jwt_identity())
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                'UPDATE alerts SET acknowledged = 1 WHERE id = ? AND user_id = ?',
                (alert_id, user_id)
            )
            
            return jsonify({'message': 'Alert acknowledged'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/caregivers', methods=['GET', 'POST'])
@jwt_required()
def manage_caregivers():
    """Get or add caregivers"""
    try:
        user_id = int(get_jwt_identity())
        
        if request.method == 'GET':
            with get_db() as conn:
                cursor = conn.cursor()
                cursor.execute('SELECT * FROM caregivers WHERE user_id = ?', (user_id,))
                caregivers = [dict(row) for row in cursor.fetchall()]
                
                return jsonify({'caregivers': caregivers}), 200
        
        elif request.method == 'POST':
            data = request.get_json()
            
            with get_db() as conn:
                cursor = conn.cursor()
                cursor.execute(
                    '''INSERT INTO caregivers 
                       (user_id, caregiver_name, caregiver_email, 
                        caregiver_phone, relationship)
                       VALUES (?, ?, ?, ?, ?)''',
                    (user_id, data.get('name'), data.get('email'),
                     data.get('phone'), data.get('relationship'))
                )
                
                return jsonify({'message': 'Caregiver added successfully'}), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# Dashboard Routes
# ============================================================================

@app.route('/api/dashboard', methods=['GET'])
@jwt_required()
def get_dashboard():
    """Get dashboard summary data"""
    try:
        user_id = int(get_jwt_identity())
        
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Latest metrics
            cursor.execute(
                'SELECT * FROM health_metrics WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1',
                (user_id,)
            )
            latest_health = cursor.fetchone()
            
            cursor.execute(
                'SELECT * FROM mood_assessments WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1',
                (user_id,)
            )
            latest_mood = cursor.fetchone()
            
            cursor.execute(
                'SELECT * FROM cognitive_assessments WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1',
                (user_id,)
            )
            latest_cognitive = cursor.fetchone()
            
            # Unacknowledged alerts
            cursor.execute(
                'SELECT COUNT(*) as count FROM alerts WHERE user_id = ? AND acknowledged = 0',
                (user_id,)
            )
            alert_count = cursor.fetchone()['count']
            
            dashboard = {
                'health': dict(latest_health) if latest_health else None,
                'mood': dict(latest_mood) if latest_mood else None,
                'cognitive': dict(latest_cognitive) if latest_cognitive else None,
                'unread_alerts': alert_count
            }
            
            return jsonify({'dashboard': dashboard}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# AI Wellness Chatbot Routes
# ============================================================================

@app.route('/api/chatbot/message', methods=['POST'])
@jwt_required()
def chatbot_message():
    """Send message to AI wellness chatbot"""
    try:
        user_id = int(get_jwt_identity())
        data = request.get_json()
        message = data.get('message', '')
        
        if not message or len(message.strip()) == 0:
            return jsonify({'error': 'Message cannot be empty'}), 400
        
        with get_db() as conn:
            cursor = conn.cursor()
            
            # Get user context (recent health metrics, mood, etc.)
            cursor.execute(
                'SELECT * FROM health_metrics WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1',
                (user_id,)
            )
            health = cursor.fetchone()
            
            cursor.execute(
                'SELECT * FROM mood_assessments WHERE user_id = ? ORDER BY timestamp DESC LIMIT 1',
                (user_id,)
            )
            mood = cursor.fetchone()
            
            # Get conversation count
            cursor.execute(
                'SELECT COUNT(*) as count FROM chatbot_conversations WHERE user_id = ?',
                (user_id,)
            )
            conv_count = cursor.fetchone()['count']
            
            # Compile user context
            user_context = {
                'conversation_count': conv_count
            }
            if health:
                user_context.update({
                    'stress_level': health['stress_level'],
                    'sleep_hours': health['sleep_hours'],
                    'activity_level': health['activity_level']
                })
            if mood:
                user_context.update({
                    'mood_score': mood['mood_score'],
                    'anxiety_level': mood['anxiety_level']
                })
            
            # Generate chatbot response
            bot_response = wellness_chatbot.generate_response(message, user_context)
            
            # Store user message
            cursor.execute(
                '''INSERT INTO chatbot_conversations 
                   (user_id, message, is_user, sentiment_score, emotion_detected)
                   VALUES (?, ?, ?, ?, ?)''',
                (user_id, message, 1, bot_response['sentiment_score'], 
                 bot_response['emotion_detected'])
            )
            
            # Store bot response
            cursor.execute(
                '''INSERT INTO chatbot_conversations 
                   (user_id, message, is_user, emotion_detected, context_data)
                   VALUES (?, ?, ?, ?, ?)''',
                (user_id, bot_response['response'], 0, 
                 bot_response['emotion_detected'], json.dumps(bot_response))
            )
            
            # Update user profile
            cursor.execute(
                '''INSERT OR REPLACE INTO chatbot_user_profiles 
                   (user_id, conversation_count, last_affirmation_date)
                   VALUES (?, ?, ?)''',
                (user_id, conv_count + 1, datetime.now().isoformat())
            )
            
            return jsonify({
                'response': bot_response['response'],
                'suggestions': bot_response['suggestions'],
                'affirmation': bot_response['affirmation'],
                'recommended_exercise': bot_response['recommended_exercise'],
                'emotion_detected': bot_response['emotion_detected']
            }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/chatbot/history', methods=['GET'])
@jwt_required()
def get_chatbot_history():
    """Get chatbot conversation history"""
    try:
        user_id = int(get_jwt_identity())
        limit = request.args.get('limit', 50, type=int)
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''SELECT * FROM chatbot_conversations 
                   WHERE user_id = ? 
                   ORDER BY timestamp DESC 
                   LIMIT ?''',
                (user_id, limit)
            )
            conversations = [dict(row) for row in cursor.fetchall()]
            conversations.reverse()  # Show oldest first
            
            return jsonify({'conversations': conversations}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/chatbot/affirmation', methods=['GET'])
@jwt_required()
def get_daily_affirmation():
    """Get daily affirmation"""
    try:
        affirmation = wellness_chatbot.get_daily_affirmation()
        return jsonify({'affirmation': affirmation}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/chatbot/emotional-patterns', methods=['GET'])
@jwt_required()
def get_emotional_patterns():
    """Analyze emotional patterns from chatbot conversations"""
    try:
        user_id = int(get_jwt_identity())
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                '''SELECT emotion_detected, sentiment_score, timestamp 
                   FROM chatbot_conversations 
                   WHERE user_id = ? AND is_user = 1
                   ORDER BY timestamp DESC 
                   LIMIT 20''',
                (user_id,)
            )
            conversations = [dict(row) for row in cursor.fetchall()]
            
            # Analyze patterns
            patterns = wellness_chatbot.analyze_emotional_patterns(conversations)
            
            return jsonify({'patterns': patterns}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/chatbot/clear-history', methods=['DELETE'])
@jwt_required()
def clear_chatbot_history():
    """Clear chatbot conversation history"""
    try:
        user_id = int(get_jwt_identity())
        
        with get_db() as conn:
            cursor = conn.cursor()
            cursor.execute(
                'DELETE FROM chatbot_conversations WHERE user_id = ?',
                (user_id,)
            )
            
            return jsonify({'message': 'Conversation history cleared'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# ============================================================================
# Helper Functions
# ============================================================================

def check_and_create_alerts(user_id, analysis):
    """Check analysis results and create alerts if needed"""
    try:
        with get_db() as conn:
            cursor = conn.cursor()
            
            if analysis.get('anxiety_level', 0) > Config.ANXIETY_THRESHOLD:
                cursor.execute(
                    '''INSERT INTO alerts 
                       (user_id, alert_type, severity, message)
                       VALUES (?, ?, ?, ?)''',
                    (user_id, 'anxiety', 'high', 
                     'Elevated anxiety levels detected. Consider relaxation techniques.')
                )
            
            if analysis.get('depression_indicators', 0) > Config.DEPRESSION_THRESHOLD:
                cursor.execute(
                    '''INSERT INTO alerts 
                       (user_id, alert_type, severity, message)
                       VALUES (?, ?, ?, ?)''',
                    (user_id, 'depression', 'high',
                     'Signs of depression detected. Consider speaking with a healthcare provider.')
                )
            
            if analysis.get('stress_level', 0) > Config.STRESS_THRESHOLD:
                cursor.execute(
                    '''INSERT INTO alerts 
                       (user_id, alert_type, severity, message)
                       VALUES (?, ?, ?, ?)''',
                    (user_id, 'stress', 'medium',
                     'High stress levels detected. Take time for self-care.')
                )
    except Exception as e:
        print(f"Error creating alerts: {e}")


# ============================================================================
# Error Handlers
# ============================================================================

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Not found'}), 404


@app.errorhandler(500)
def internal_error(error):
    return jsonify({'error': 'Internal server error'}), 500


# JWT Error Handlers
@jwt.unauthorized_loader
def unauthorized_callback(callback):
    return jsonify({'error': 'Missing or invalid authorization token'}), 401


@jwt.invalid_token_loader
def invalid_token_callback(callback):
    return jsonify({'error': 'Invalid token'}), 401


@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({'error': 'Token has expired'}), 401


# ============================================================================
# Main
# ============================================================================

if __name__ == '__main__':
    app.run(debug=Config.DEBUG, port=5000, host='0.0.0.0')
