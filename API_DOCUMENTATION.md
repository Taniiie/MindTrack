# MindTrack API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Authentication Endpoints

### Register User
**POST** `/auth/register`

Create a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "full_name": "John Doe",
  "date_of_birth": "1990-01-01"
}
```

**Response (201):**
```json
{
  "message": "User registered successfully",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

### Login
**POST** `/auth/login`

Authenticate and receive access token.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response (200):**
```json
{
  "message": "Login successful",
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe"
  }
}
```

---

## Health Metrics Endpoints

### Get Health Metrics
**GET** `/health/metrics?limit=30`

Retrieve user's health metrics.

**Query Parameters:**
- `limit` (optional): Number of records to return (default: 30)

**Response (200):**
```json
{
  "metrics": [
    {
      "id": 1,
      "user_id": 1,
      "timestamp": "2024-01-15T10:30:00",
      "heart_rate": 72,
      "hrv_score": 55.5,
      "sleep_hours": 7.5,
      "sleep_quality": "good",
      "steps": 8500,
      "activity_level": "moderate",
      "stress_level": 0.4
    }
  ]
}
```

### Add Health Metrics
**POST** `/health/metrics`

Submit new health metrics data.

**Request Body:**
```json
{
  "heart_rate": 72,
  "hrv_score": 55.5,
  "sleep_hours": 7.5,
  "sleep_quality": "good",
  "steps": 8500,
  "activity_level": "moderate",
  "stress_level": 0.4
}
```

**Response (201):**
```json
{
  "message": "Health metrics added successfully"
}
```

### Get Health Trends
**GET** `/health/trends?days=7`

Get aggregated health trends.

**Query Parameters:**
- `days` (optional): Number of days to analyze (default: 7)

**Response (200):**
```json
{
  "trends": {
    "avg_heart_rate": 72.5,
    "avg_sleep_hours": 7.2,
    "avg_steps": 8200,
    "avg_stress_level": 0.45,
    "data_points": 7
  },
  "data": [...]
}
```

---

## Mood & Mental Health Endpoints

### Analyze Mood
**POST** `/mood/analyze`

Analyze mood from text input using AI.

**Request Body:**
```json
{
  "text": "I'm feeling really anxious today about work deadlines..."
}
```

**Response (200):**
```json
{
  "analysis": {
    "mood_score": 0.35,
    "anxiety_level": 0.72,
    "depression_indicators": 0.15,
    "stress_level": 0.68,
    "sentiment_polarity": -0.3,
    "sentiment_subjectivity": 0.6,
    "emotions": ["anxious", "stressed", "negative"],
    "analysis": "Elevated anxiety levels detected. High stress levels identified."
  }
}
```

### Get Mood History
**GET** `/mood/history?limit=30`

Retrieve mood assessment history.

**Query Parameters:**
- `limit` (optional): Number of records (default: 30)

**Response (200):**
```json
{
  "history": [
    {
      "id": 1,
      "user_id": 1,
      "timestamp": "2024-01-15T14:20:00",
      "mood_score": 0.65,
      "anxiety_level": 0.3,
      "stress_level": 0.4,
      "depression_indicators": 0.2,
      "text_input": "Feeling good today...",
      "ai_analysis": "{...}"
    }
  ]
}
```

### Create Journal Entry
**POST** `/journal/entry`

Create a new journal entry with sentiment analysis.

**Request Body:**
```json
{
  "content": "Today was a productive day. I completed my tasks and felt accomplished..."
}
```

**Response (201):**
```json
{
  "message": "Journal entry created",
  "sentiment": {
    "mood_score": 0.75,
    "emotions": ["positive"],
    "...": "..."
  }
}
```

### Get Journal Entries
**GET** `/journal/entries?limit=20`

Retrieve journal entries.

**Response (200):**
```json
{
  "entries": [
    {
      "id": 1,
      "user_id": 1,
      "timestamp": "2024-01-15T20:00:00",
      "content": "Today was a productive day...",
      "sentiment_score": 0.75,
      "emotions": "[\"positive\"]",
      "keywords": ""
    }
  ]
}
```

---

## Cognitive Assessment Endpoints

### Submit Game Result
**POST** `/cognitive/game-result`

Submit cognitive game performance data.

**Request Body:**
```json
{
  "game_type": "memory_match",
  "score": 85,
  "reaction_time": 1250,
  "accuracy": 90,
  "difficulty_level": 1
}
```

**Response (201):**
```json
{
  "message": "Game result submitted",
  "analysis": {
    "cognitive_score": 0.82,
    "memory_score": 0.85,
    "focus_score": 0.78,
    "problem_solving_score": 0.85,
    "performance_level": "Excellent",
    "recommendations": [
      "Maintain current cognitive activities for optimal brain health."
    ]
  }
}
```

### Get Cognitive Assessment
**GET** `/cognitive/assessment`

Get cognitive assessment summary and trend analysis.

**Response (200):**
```json
{
  "summary": {
    "avg_cognitive_score": 0.78,
    "avg_memory_score": 0.82,
    "avg_focus_score": 0.75,
    "total_assessments": 10
  },
  "trend": {
    "trend": "stable",
    "decline_detected": false,
    "slope": 0.02,
    "message": "Cognitive performance is stable."
  },
  "recent_assessments": [...]
}
```

### Get Cognitive Trends
**GET** `/cognitive/trends?days=30`

Get cognitive performance trends over time.

**Response (200):**
```json
{
  "trends": [
    {
      "id": 1,
      "timestamp": "2024-01-15T16:00:00",
      "game_type": "memory_match",
      "score": 85,
      "cognitive_score": 0.82,
      "memory_score": 0.85,
      "focus_score": 0.78
    }
  ]
}
```

---

## Recommendations Endpoint

### Get Recommendations
**GET** `/recommendations`

Get AI-generated personalized recommendations.

**Response (200):**
```json
{
  "recommendations": [
    {
      "category": "mental_health",
      "title": "Anxiety Management",
      "description": "Practice deep breathing exercises for 10 minutes daily.",
      "priority": "high"
    },
    {
      "category": "sleep",
      "title": "Improve Sleep Quality",
      "description": "Aim for 7-9 hours of sleep. Maintain consistent sleep schedule.",
      "priority": "medium"
    }
  ]
}
```

---

## Alerts Endpoints

### Get Alerts
**GET** `/alerts`

Retrieve user alerts.

**Response (200):**
```json
{
  "alerts": [
    {
      "id": 1,
      "user_id": 1,
      "timestamp": "2024-01-15T15:00:00",
      "alert_type": "anxiety",
      "severity": "high",
      "message": "Elevated anxiety levels detected.",
      "acknowledged": 0,
      "caregiver_notified": 0
    }
  ]
}
```

### Acknowledge Alert
**POST** `/alerts/<alert_id>/acknowledge`

Mark an alert as acknowledged.

**Response (200):**
```json
{
  "message": "Alert acknowledged"
}
```

---

## Caregivers Endpoints

### Get Caregivers
**GET** `/caregivers`

Get list of registered caregivers.

**Response (200):**
```json
{
  "caregivers": [
    {
      "id": 1,
      "user_id": 1,
      "caregiver_name": "Jane Doe",
      "caregiver_email": "jane@example.com",
      "caregiver_phone": "+1234567890",
      "relationship": "spouse",
      "notification_enabled": 1
    }
  ]
}
```

### Add Caregiver
**POST** `/caregivers`

Add a new caregiver.

**Request Body:**
```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "phone": "+1234567890",
  "relationship": "spouse"
}
```

**Response (201):**
```json
{
  "message": "Caregiver added successfully"
}
```

---

## Dashboard Endpoint

### Get Dashboard
**GET** `/dashboard`

Get comprehensive dashboard summary.

**Response (200):**
```json
{
  "dashboard": {
    "health": {
      "heart_rate": 72,
      "sleep_hours": 7.5,
      "steps": 8500,
      "stress_level": 0.4
    },
    "mood": {
      "mood_score": 0.65,
      "anxiety_level": 0.3,
      "stress_level": 0.4
    },
    "cognitive": {
      "cognitive_score": 0.78,
      "memory_score": 0.82
    },
    "unread_alerts": 2
  }
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields"
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 404 Not Found
```json
{
  "error": "Not found"
}
```

### 409 Conflict
```json
{
  "error": "Email already exists"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error"
}
```

---

## Rate Limiting

Currently no rate limiting is implemented. For production, implement rate limiting to prevent abuse.

## CORS

CORS is enabled for:
- `http://localhost:5173`
- `http://localhost:3000`

Update `config.py` to add additional origins.

---

**Note**: All timestamps are in ISO 8601 format. All scores are normalized to 0-1 scale unless otherwise specified.
