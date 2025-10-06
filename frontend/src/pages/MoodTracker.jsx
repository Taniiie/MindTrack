import React, { useState, useEffect } from 'react'
import axios from '../utils/axios'
import { Heart, Send, TrendingUp, Smile, Meh, Frown } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function MoodTracker() {
  const [text, setText] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchMoodHistory()
  }, [])

  const fetchMoodHistory = async () => {
    try {
      const response = await axios.get('/api/mood/history?limit=14')
      setHistory(response.data.history || [])
    } catch (error) {
      console.error('Error fetching mood history:', error)
    }
  }

  const handleAnalyze = async () => {
    if (!text.trim()) return

    setLoading(true)
    try {
      const response = await axios.post('/api/mood/analyze', { text })
      setAnalysis(response.data.analysis)
      setText('')
      fetchMoodHistory()
    } catch (error) {
      console.error('Error analyzing mood:', error)
    } finally {
      setLoading(false)
    }
  }

  const getMoodEmoji = (score) => {
    if (score >= 0.7) return <Smile className="text-green-500" size={48} />
    if (score >= 0.4) return <Meh className="text-yellow-500" size={48} />
    return <Frown className="text-red-500" size={48} />
  }

  const getScoreColor = (score) => {
    if (score >= 0.7) return 'text-green-600'
    if (score >= 0.4) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score) => {
    if (score >= 0.7) return 'Positive'
    if (score >= 0.4) return 'Neutral'
    return 'Needs Attention'
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Mood Tracker</h1>
        <p className="text-gray-600 mt-1">Track and analyze your emotional well-being</p>
      </div>

      {/* Mood Input */}
      <div className="card">
        <div className="flex items-center space-x-3 mb-4">
          <div className="bg-pink-100 p-2 rounded-lg">
            <Heart className="text-pink-600" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-gray-900">How are you feeling?</h2>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Express your thoughts and feelings... The AI will analyze your emotional state and provide insights."
          className="input min-h-[120px] resize-none"
          rows={5}
        />

        <button
          onClick={handleAnalyze}
          disabled={loading || !text.trim()}
          className="btn btn-primary mt-4 flex items-center space-x-2"
        >
          <Send size={18} />
          <span>{loading ? 'Analyzing...' : 'Analyze Mood'}</span>
        </button>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="card bg-gradient-to-br from-pink-50 to-purple-50 border-pink-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">AI Analysis Results</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="flex items-center space-x-4">
              {getMoodEmoji(analysis.mood_score)}
              <div>
                <p className="text-sm text-gray-600">Overall Mood</p>
                <p className={`text-3xl font-bold ${getScoreColor(analysis.mood_score)}`}>
                  {Math.round(analysis.mood_score * 100)}
                </p>
                <p className="text-sm text-gray-600">{getScoreLabel(analysis.mood_score)}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Anxiety Level</span>
                  <span className="font-medium">{Math.round(analysis.anxiety_level * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-orange-500 h-2 rounded-full transition-all"
                    style={{ width: `${analysis.anxiety_level * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Stress Level</span>
                  <span className="font-medium">{Math.round(analysis.stress_level * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-red-500 h-2 rounded-full transition-all"
                    style={{ width: `${analysis.stress_level * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-600">Depression Indicators</span>
                  <span className="font-medium">{Math.round(analysis.depression_indicators * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-purple-500 h-2 rounded-full transition-all"
                    style={{ width: `${analysis.depression_indicators * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-2">AI Insights</h4>
            <p className="text-gray-700">{analysis.analysis}</p>
            
            {analysis.emotions && analysis.emotions.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {analysis.emotions.map((emotion, index) => (
                  <span key={index} className="badge badge-info">
                    {emotion}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mood History Chart */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Mood History</h3>
          <TrendingUp className="text-primary-600" size={24} />
        </div>

        {history.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={history.reverse()}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="timestamp" 
                tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              />
              <YAxis domain={[0, 1]} />
              <Tooltip 
                labelFormatter={(value) => new Date(value).toLocaleString()}
                formatter={(value, name) => [Math.round(value * 100) + '%', name]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="mood_score" 
                stroke="#ec4899" 
                name="Mood Score"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="anxiety_level" 
                stroke="#f97316" 
                name="Anxiety"
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="stress_level" 
                stroke="#ef4444" 
                name="Stress"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex items-center justify-center h-64 text-gray-400">
            <p>No mood history yet. Start tracking your mood above!</p>
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Tips for Better Mood Tracking</h3>
        <ul className="space-y-2 text-gray-700">
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Be honest and authentic about your feelings</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Track your mood daily for better insights</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Include details about what influenced your mood</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-600 mr-2">•</span>
            <span>Use the journal feature for deeper reflection</span>
          </li>
        </ul>
      </div>
    </div>
  )
}
