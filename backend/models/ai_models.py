"""AI models for mood detection and cognitive assessment"""
import numpy as np
import re
from textblob import TextBlob
from datetime import datetime, timedelta
import json

class MoodAnalyzer:
    """Analyzes text and behavioral patterns to detect mood and mental health indicators"""
    
    def __init__(self):
        self.anxiety_keywords = [
            'worried', 'anxious', 'nervous', 'panic', 'fear', 'scared', 
            'overwhelmed', 'stressed', 'tense', 'uneasy', 'restless'
        ]
        self.depression_keywords = [
            'sad', 'depressed', 'hopeless', 'empty', 'worthless', 'tired',
            'exhausted', 'lonely', 'isolated', 'numb', 'unmotivated'
        ]
        self.stress_keywords = [
            'stress', 'pressure', 'burden', 'overwhelmed', 'exhausted',
            'demanding', 'hectic', 'chaotic', 'intense', 'struggling'
        ]
    
    def analyze_text(self, text):
        """
        Analyze text for mood indicators
        Returns: dict with mood scores and analysis
        """
        if not text or len(text.strip()) == 0:
            return self._default_analysis()
        
        # Sentiment analysis using TextBlob
        blob = TextBlob(text.lower())
        sentiment = blob.sentiment
        
        # Keyword detection
        anxiety_count = sum(1 for keyword in self.anxiety_keywords if keyword in text.lower())
        depression_count = sum(1 for keyword in self.depression_keywords if keyword in text.lower())
        stress_count = sum(1 for keyword in self.stress_keywords if keyword in text.lower())
        
        # Calculate scores (0-1 scale)
        word_count = len(text.split())
        anxiety_score = min(anxiety_count / max(word_count * 0.1, 1), 1.0)
        depression_score = min(depression_count / max(word_count * 0.1, 1), 1.0)
        stress_score = min(stress_count / max(word_count * 0.1, 1), 1.0)
        
        # Overall mood score (0 = very negative, 1 = very positive)
        mood_score = (sentiment.polarity + 1) / 2  # Convert from [-1, 1] to [0, 1]
        
        # Adjust mood score based on negative indicators
        mood_score = mood_score * (1 - (anxiety_score + depression_score + stress_score) / 3)
        
        # Extract emotions
        emotions = self._extract_emotions(text, sentiment, anxiety_score, depression_score, stress_score)
        
        return {
            'mood_score': round(mood_score, 3),
            'anxiety_level': round(anxiety_score, 3),
            'depression_indicators': round(depression_score, 3),
            'stress_level': round(stress_score, 3),
            'sentiment_polarity': round(sentiment.polarity, 3),
            'sentiment_subjectivity': round(sentiment.subjectivity, 3),
            'emotions': emotions,
            'analysis': self._generate_analysis(mood_score, anxiety_score, depression_score, stress_score)
        }
    
    def _extract_emotions(self, text, sentiment, anxiety, depression, stress):
        """Extract dominant emotions from analysis"""
        emotions = []
        
        if sentiment.polarity > 0.3:
            emotions.append('positive')
        elif sentiment.polarity < -0.3:
            emotions.append('negative')
        else:
            emotions.append('neutral')
        
        if anxiety > 0.3:
            emotions.append('anxious')
        if depression > 0.3:
            emotions.append('sad')
        if stress > 0.3:
            emotions.append('stressed')
        
        return emotions
    
    def _generate_analysis(self, mood, anxiety, depression, stress):
        """Generate human-readable analysis"""
        analysis = []
        
        if mood > 0.7:
            analysis.append("Overall mood appears positive and healthy.")
        elif mood > 0.4:
            analysis.append("Mood is moderate with some fluctuations.")
        else:
            analysis.append("Mood indicators suggest emotional distress.")
        
        if anxiety > 0.5:
            analysis.append("Elevated anxiety levels detected.")
        if depression > 0.5:
            analysis.append("Signs of depressive symptoms present.")
        if stress > 0.5:
            analysis.append("High stress levels identified.")
        
        if not analysis:
            analysis.append("Mental health indicators within normal range.")
        
        return " ".join(analysis)
    
    def _default_analysis(self):
        """Return default analysis for empty input"""
        return {
            'mood_score': 0.5,
            'anxiety_level': 0.0,
            'depression_indicators': 0.0,
            'stress_level': 0.0,
            'sentiment_polarity': 0.0,
            'sentiment_subjectivity': 0.0,
            'emotions': ['neutral'],
            'analysis': 'No text provided for analysis.'
        }


class CognitiveAnalyzer:
    """Analyzes cognitive game performance to detect cognitive decline"""
    
    def __init__(self):
        self.baseline_scores = {
            'memory': 70,
            'reaction': 500,  # milliseconds
            'focus': 75,
            'problem_solving': 70
        }
    
    def analyze_game_result(self, game_type, score, reaction_time, accuracy, difficulty):
        """
        Analyze cognitive game results
        Returns: dict with cognitive assessment
        """
        # Normalize scores to 0-1 scale
        normalized_score = min(score / 100, 1.0)
        normalized_accuracy = min(accuracy / 100, 1.0)
        
        # Calculate reaction time score (lower is better)
        reaction_score = max(0, 1 - (reaction_time / 2000))  # 2000ms as baseline
        
        # Calculate cognitive domain scores
        memory_score = self._calculate_memory_score(game_type, normalized_score, normalized_accuracy)
        focus_score = self._calculate_focus_score(game_type, reaction_score, normalized_accuracy)
        problem_solving_score = self._calculate_problem_solving_score(game_type, normalized_score, difficulty)
        
        # Overall cognitive score
        cognitive_score = (memory_score + focus_score + problem_solving_score) / 3
        
        return {
            'cognitive_score': round(cognitive_score, 3),
            'memory_score': round(memory_score, 3),
            'focus_score': round(focus_score, 3),
            'problem_solving_score': round(problem_solving_score, 3),
            'performance_level': self._get_performance_level(cognitive_score),
            'recommendations': self._generate_cognitive_recommendations(
                cognitive_score, memory_score, focus_score, problem_solving_score
            )
        }
    
    def _calculate_memory_score(self, game_type, score, accuracy):
        """Calculate memory domain score"""
        if game_type in ['memory_match', 'sequence_recall']:
            return (score * 0.6 + accuracy * 0.4)
        return score * 0.5 + accuracy * 0.5
    
    def _calculate_focus_score(self, game_type, reaction_score, accuracy):
        """Calculate focus domain score"""
        if game_type in ['reaction_test', 'attention_task']:
            return (reaction_score * 0.7 + accuracy * 0.3)
        return reaction_score * 0.5 + accuracy * 0.5
    
    def _calculate_problem_solving_score(self, game_type, score, difficulty):
        """Calculate problem-solving domain score"""
        difficulty_multiplier = 1 + (difficulty - 1) * 0.2  # Reward higher difficulty
        return min(score * difficulty_multiplier, 1.0)
    
    def _get_performance_level(self, score):
        """Get performance level description"""
        if score >= 0.8:
            return 'Excellent'
        elif score >= 0.6:
            return 'Good'
        elif score >= 0.4:
            return 'Fair'
        else:
            return 'Needs Improvement'
    
    def _generate_cognitive_recommendations(self, cognitive, memory, focus, problem_solving):
        """Generate personalized cognitive recommendations"""
        recommendations = []
        
        if memory < 0.6:
            recommendations.append("Practice memory exercises daily to improve recall.")
        if focus < 0.6:
            recommendations.append("Try meditation to enhance focus and attention.")
        if problem_solving < 0.6:
            recommendations.append("Engage in puzzles and strategy games.")
        if cognitive < 0.5:
            recommendations.append("Consider consulting a healthcare provider for cognitive assessment.")
        
        if not recommendations:
            recommendations.append("Maintain current cognitive activities for optimal brain health.")
        
        return recommendations
    
    def detect_decline_trend(self, historical_scores):
        """
        Detect cognitive decline trend from historical data
        Returns: dict with trend analysis
        """
        if len(historical_scores) < 3:
            return {
                'trend': 'insufficient_data',
                'decline_detected': False,
                'message': 'More data needed for trend analysis.'
            }
        
        # Calculate trend using simple linear regression
        scores = [s['cognitive_score'] for s in historical_scores[-10:]]  # Last 10 assessments
        x = np.arange(len(scores))
        slope = np.polyfit(x, scores, 1)[0]
        
        decline_detected = slope < -0.05  # Declining trend
        
        return {
            'trend': 'declining' if decline_detected else 'stable' if abs(slope) < 0.05 else 'improving',
            'decline_detected': decline_detected,
            'slope': round(slope, 4),
            'message': self._get_trend_message(slope, decline_detected)
        }
    
    def _get_trend_message(self, slope, decline_detected):
        """Generate trend message"""
        if decline_detected:
            return "Cognitive performance shows declining trend. Consider consulting a healthcare provider."
        elif slope > 0.05:
            return "Cognitive performance is improving. Keep up the good work!"
        else:
            return "Cognitive performance is stable."


class RecommendationEngine:
    """Generates personalized health and wellness recommendations"""
    
    def generate_recommendations(self, user_data):
        """
        Generate personalized recommendations based on user data
        user_data: dict with health metrics, mood, cognitive scores
        """
        recommendations = []
        
        # Mental health recommendations
        if user_data.get('anxiety_level', 0) > 0.6:
            recommendations.append({
                'category': 'mental_health',
                'title': 'Anxiety Management',
                'description': 'Practice deep breathing exercises for 10 minutes daily. Try the 4-7-8 technique.',
                'priority': 'high'
            })
        
        if user_data.get('stress_level', 0) > 0.7:
            recommendations.append({
                'category': 'stress_relief',
                'title': 'Stress Reduction',
                'description': 'Consider guided meditation or yoga. Take regular breaks during work.',
                'priority': 'high'
            })
        
        if user_data.get('depression_indicators', 0) > 0.6:
            recommendations.append({
                'category': 'mental_health',
                'title': 'Mood Support',
                'description': 'Engage in physical activity and social connections. Consider speaking with a therapist.',
                'priority': 'high'
            })
        
        # Physical health recommendations
        if user_data.get('sleep_hours', 7) < 6:
            recommendations.append({
                'category': 'sleep',
                'title': 'Improve Sleep Quality',
                'description': 'Aim for 7-9 hours of sleep. Maintain consistent sleep schedule.',
                'priority': 'medium'
            })
        
        if user_data.get('steps', 5000) < 5000:
            recommendations.append({
                'category': 'exercise',
                'title': 'Increase Physical Activity',
                'description': 'Try to reach 8,000-10,000 steps daily. Take short walks throughout the day.',
                'priority': 'medium'
            })
        
        # Cognitive health recommendations
        if user_data.get('cognitive_score', 0.7) < 0.5:
            recommendations.append({
                'category': 'cognitive',
                'title': 'Brain Training',
                'description': 'Play cognitive games daily. Read, learn new skills, and stay mentally active.',
                'priority': 'high'
            })
        
        # Default recommendations if all metrics are good
        if not recommendations:
            recommendations.append({
                'category': 'wellness',
                'title': 'Maintain Healthy Habits',
                'description': 'Continue your current wellness routine. Stay active and engaged.',
                'priority': 'low'
            })
        
        return recommendations


class WellnessChatbot:
    """AI-powered Mental Health Chatbot for empathetic support and wellness guidance"""
    
    def __init__(self):
        self.mood_analyzer = MoodAnalyzer()
        
        # Affirmations database
        self.affirmations = {
            'morning': [
                "Today is a new beginning. You have the power to make it amazing! 🌅",
                "You are capable of handling whatever comes your way today. 💪",
                "Start your day with gratitude. You are worthy of good things. ✨",
                "Every morning brings new opportunities. Embrace them with confidence! 🌟",
                "You are stronger than you think. Today will be a great day! 🌈"
            ],
            'evening': [
                "You did your best today, and that's what matters. Rest well. 🌙",
                "Be proud of yourself for making it through today. Tomorrow is a fresh start. ⭐",
                "Take time to reflect on the good moments of today. You deserve peace. 🌸",
                "Release the stress of the day. You are safe and cared for. 💙",
                "Every day is progress. Rest and recharge for tomorrow. 🌺"
            ],
            'stress': [
                "Take a deep breath. You are doing better than you think. 🌬️",
                "It's okay to take a break. Your wellbeing matters most. 🧘",
                "You've overcome challenges before, and you will overcome this too. 💪",
                "Remember: progress, not perfection. You're doing great! 🌟",
                "One step at a time. You don't have to do everything at once. 🦋"
            ],
            'anxiety': [
                "You are safe. This feeling will pass. Breathe slowly. 🌊",
                "Anxiety is temporary. You have the strength to get through this. 💙",
                "Ground yourself in the present moment. You are here, and you are okay. 🌿",
                "Your feelings are valid. Be gentle with yourself. 🌸",
                "You've survived 100% of your worst days. You can do this. 🌈"
            ],
            'sadness': [
                "It's okay to feel sad. Your emotions are valid. 💙",
                "You are not alone. Reach out if you need support. 🤗",
                "This too shall pass. Better days are coming. 🌅",
                "Be kind to yourself. You deserve compassion and care. 🌺",
                "Your feelings matter. Take all the time you need. 🌸"
            ],
            'general': [
                "You are valued and important. Never forget that. ✨",
                "Your mental health journey is unique and valid. 🌟",
                "Small steps forward are still progress. Keep going! 🦋",
                "You deserve happiness, peace, and love. 💖",
                "Believe in yourself. You are capable of amazing things! 🌈"
            ]
        }
        
        # Mindfulness exercises
        self.mindfulness_exercises = [
            {
                'name': '4-7-8 Breathing',
                'description': 'Breathe in for 4 counts, hold for 7, exhale for 8. Repeat 4 times.',
                'duration': '2 minutes',
                'benefits': 'Reduces anxiety and promotes relaxation'
            },
            {
                'name': '5-4-3-2-1 Grounding',
                'description': 'Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste.',
                'duration': '3 minutes',
                'benefits': 'Helps with anxiety and panic attacks'
            },
            {
                'name': 'Body Scan Meditation',
                'description': 'Focus on each part of your body from toes to head, releasing tension.',
                'duration': '10 minutes',
                'benefits': 'Reduces stress and improves body awareness'
            },
            {
                'name': 'Gratitude Practice',
                'description': 'Write down 3 things you\'re grateful for today.',
                'duration': '5 minutes',
                'benefits': 'Improves mood and overall wellbeing'
            },
            {
                'name': 'Progressive Muscle Relaxation',
                'description': 'Tense and release each muscle group, starting from your feet.',
                'duration': '15 minutes',
                'benefits': 'Relieves physical tension and stress'
            }
        ]
        
        # Mood-boosting activities
        self.mood_boosting_activities = [
            "Take a 10-minute walk outside 🚶",
            "Listen to your favorite uplifting music 🎵",
            "Call or text a friend you trust 📱",
            "Do 5 minutes of stretching or yoga 🧘",
            "Watch a funny video or comedy show 😄",
            "Practice a hobby you enjoy 🎨",
            "Take a warm shower or bath 🛁",
            "Write in your journal 📝",
            "Pet an animal or look at cute animal pictures 🐾",
            "Drink a cup of herbal tea ☕",
            "Do a random act of kindness 💝",
            "Organize a small space around you 🧹"
        ]
        
        # Response templates based on emotion
        self.response_templates = {
            'anxious': [
                "I hear that you're feeling anxious. That must be difficult. Let's work through this together.",
                "Anxiety can be overwhelming. Remember, you're not alone in this feeling.",
                "It's completely normal to feel anxious sometimes. Would you like to try a calming exercise?"
            ],
            'sad': [
                "I'm sorry you're feeling this way. Your feelings are valid and important.",
                "It's okay to feel sad. Would you like to talk about what's bothering you?",
                "I'm here to listen. Sometimes expressing our feelings can help."
            ],
            'stressed': [
                "Stress can be really challenging. Let's find ways to help you feel more at ease.",
                "It sounds like you have a lot on your plate. What's weighing on you most?",
                "I understand you're feeling stressed. Let's break things down together."
            ],
            'positive': [
                "I'm so glad to hear you're feeling good! What's contributing to your positive mood?",
                "That's wonderful! It's great to celebrate these positive moments.",
                "Your positive energy is inspiring! Keep nurturing what makes you feel good."
            ],
            'neutral': [
                "Thank you for sharing. How can I support you today?",
                "I'm here to listen and help. What would you like to talk about?",
                "How are you really feeling? I'm here to support you."
            ]
        }
    
    def generate_response(self, user_message, user_context=None):
        """
        Generate empathetic chatbot response based on user message and context
        user_context: dict with user's recent mood, stress levels, activity patterns
        """
        # Analyze the user's message
        analysis = self.mood_analyzer.analyze_text(user_message)
        
        # Determine primary emotion
        primary_emotion = self._determine_primary_emotion(analysis)
        
        # Generate contextual response
        response = self._generate_contextual_response(
            user_message, 
            primary_emotion, 
            analysis, 
            user_context
        )
        
        # Add suggestions if appropriate
        suggestions = self._generate_suggestions(primary_emotion, analysis, user_context)
        
        return {
            'response': response,
            'suggestions': suggestions,
            'emotion_detected': primary_emotion,
            'sentiment_score': analysis['mood_score'],
            'recommended_exercise': self._recommend_exercise(primary_emotion),
            'affirmation': self._get_affirmation(primary_emotion)
        }
    
    def _determine_primary_emotion(self, analysis):
        """Determine the primary emotion from analysis"""
        emotions = analysis['emotions']
        
        if 'anxious' in emotions:
            return 'anxious'
        elif 'sad' in emotions:
            return 'sad'
        elif 'stressed' in emotions:
            return 'stressed'
        elif 'positive' in emotions:
            return 'positive'
        else:
            return 'neutral'
    
    def _generate_contextual_response(self, message, emotion, analysis, context):
        """Generate contextual empathetic response"""
        import random
        
        # Get base response template
        base_responses = self.response_templates.get(emotion, self.response_templates['neutral'])
        response = random.choice(base_responses)
        
        # Add context-aware insights
        if context:
            if context.get('stress_level', 0) > 0.7:
                response += " I notice your stress levels have been high lately. "
            if context.get('sleep_hours', 7) < 6:
                response += " Getting more rest might help you feel better. "
            if context.get('conversation_count', 0) > 5:
                response += " I'm glad we can continue our conversation. "
        
        # Add empathetic acknowledgment
        if analysis['anxiety_level'] > 0.6:
            response += " Your anxiety is valid, and it's brave of you to acknowledge it."
        elif analysis['depression_indicators'] > 0.6:
            response += " I want you to know that what you're feeling matters."
        
        return response
    
    def _generate_suggestions(self, emotion, analysis, context):
        """Generate personalized suggestions"""
        import random
        suggestions = []
        
        # Suggest mindfulness exercises
        if emotion in ['anxious', 'stressed']:
            exercise = random.choice([e for e in self.mindfulness_exercises if 'anxiety' in e['benefits'].lower() or 'stress' in e['benefits'].lower()])
            suggestions.append({
                'type': 'exercise',
                'content': exercise
            })
        
        # Suggest mood-boosting activities
        if emotion in ['sad', 'neutral']:
            activity = random.choice(self.mood_boosting_activities)
            suggestions.append({
                'type': 'activity',
                'content': activity
            })
        
        # Suggest professional help if needed
        if analysis['depression_indicators'] > 0.7 or analysis['anxiety_level'] > 0.8:
            suggestions.append({
                'type': 'professional_help',
                'content': "Consider reaching out to a mental health professional for additional support. You don't have to go through this alone."
            })
        
        # Add breathing exercise for immediate relief
        if emotion in ['anxious', 'stressed']:
            suggestions.append({
                'type': 'quick_tip',
                'content': "Try this now: Take 3 deep breaths. Inhale slowly through your nose, hold for 3 seconds, exhale through your mouth."
            })
        
        return suggestions
    
    def _recommend_exercise(self, emotion):
        """Recommend a mindfulness exercise based on emotion"""
        import random
        
        if emotion in ['anxious', 'stressed']:
            suitable_exercises = [e for e in self.mindfulness_exercises if 'anxiety' in e['benefits'].lower() or 'stress' in e['benefits'].lower()]
        else:
            suitable_exercises = self.mindfulness_exercises
        
        return random.choice(suitable_exercises) if suitable_exercises else self.mindfulness_exercises[0]
    
    def _get_affirmation(self, emotion):
        """Get an appropriate affirmation"""
        import random
        from datetime import datetime
        
        # Determine time of day
        hour = datetime.now().hour
        if hour < 12:
            time_category = 'morning'
        elif hour < 18:
            time_category = 'general'
        else:
            time_category = 'evening'
        
        # Get emotion-specific affirmation if available
        if emotion in self.affirmations:
            return random.choice(self.affirmations[emotion])
        else:
            return random.choice(self.affirmations.get(time_category, self.affirmations['general']))
    
    def get_daily_affirmation(self):
        """Get daily affirmation based on time of day"""
        import random
        from datetime import datetime
        
        hour = datetime.now().hour
        if hour < 12:
            return random.choice(self.affirmations['morning'])
        elif hour < 18:
            return random.choice(self.affirmations['general'])
        else:
            return random.choice(self.affirmations['evening'])
    
    def analyze_emotional_patterns(self, conversation_history):
        """Analyze emotional patterns from conversation history"""
        if not conversation_history or len(conversation_history) < 3:
            return {
                'pattern': 'insufficient_data',
                'insights': 'More conversations needed to identify patterns.'
            }
        
        # Extract emotions from history
        emotions = []
        sentiment_scores = []
        
        for conv in conversation_history:
            if conv.get('emotion_detected'):
                emotions.append(conv['emotion_detected'])
            if conv.get('sentiment_score'):
                sentiment_scores.append(conv['sentiment_score'])
        
        # Calculate patterns
        most_common_emotion = max(set(emotions), key=emotions.count) if emotions else 'neutral'
        avg_sentiment = sum(sentiment_scores) / len(sentiment_scores) if sentiment_scores else 0.5
        
        # Generate insights
        insights = self._generate_pattern_insights(most_common_emotion, avg_sentiment, len(conversation_history))
        
        return {
            'pattern': most_common_emotion,
            'average_sentiment': round(avg_sentiment, 3),
            'conversation_count': len(conversation_history),
            'insights': insights,
            'recommendation': self._get_pattern_recommendation(most_common_emotion, avg_sentiment)
        }
    
    def _generate_pattern_insights(self, emotion, avg_sentiment, count):
        """Generate insights from emotional patterns"""
        insights = []
        
        if emotion == 'anxious' and count >= 5:
            insights.append("You've been experiencing anxiety frequently. Consider stress management techniques.")
        elif emotion == 'sad' and avg_sentiment < 0.4:
            insights.append("Your mood has been consistently low. It might help to talk to someone you trust.")
        elif emotion == 'stressed' and count >= 5:
            insights.append("Stress seems to be a recurring theme. Let's work on coping strategies together.")
        elif emotion == 'positive' and avg_sentiment > 0.7:
            insights.append("You've been maintaining a positive outlook! Keep up the great work.")
        else:
            insights.append("Your emotional state varies. This is completely normal.")
        
        return " ".join(insights)
    
    def _get_pattern_recommendation(self, emotion, avg_sentiment):
        """Get recommendation based on emotional patterns"""
        if emotion in ['anxious', 'stressed'] or avg_sentiment < 0.4:
            return "Consider establishing a daily mindfulness routine and ensure you're getting adequate rest."
        elif emotion == 'sad':
            return "Engage in activities you enjoy and maintain social connections. Professional support can also be beneficial."
        else:
            return "Continue your current wellness practices and stay mindful of your emotional health."
