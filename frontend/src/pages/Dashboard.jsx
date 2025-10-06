import React, { useState, useEffect } from 'react'
import axios from '../utils/axios'
import { 
  Heart, Brain, Activity, TrendingUp, AlertCircle,
  Smile, Meh, Frown, Award, Target
} from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export default function Dashboard() {
  const [dashboard, setDashboard] = useState(null)
  const [healthTrends, setHealthTrends] = useState([])
  const [moodHistory, setMoodHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const [dashboardRes, healthRes, moodRes] = await Promise.all([
        axios.get('/api/dashboard'),
        axios.get('/api/health/trends?days=7'),
        axios.get('/api/mood/history?limit=7')
      ])

      setDashboard(dashboardRes.data.dashboard)
      setHealthTrends(healthRes.data.data || [])
      setMoodHistory(moodRes.data.history || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching dashboard:', error)
      setLoading(false)
    }
  }

  const getMoodIcon = (score) => {
    if (score >= 0.7) return <Smile className="text-green-500" size={24} />
    if (score >= 0.4) return <Meh className="text-yellow-500" size={24} />
    return <Frown className="text-red-500" size={24} />
  }

  const getMoodColor = (score) => {
    if (score >= 0.7) return 'text-green-600'
    if (score >= 0.4) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  const latestMood = dashboard?.mood
  const latestHealth = dashboard?.health
  const latestCognitive = dashboard?.cognitive

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Your mental health and wellness overview</p>
      </div>

      {/* Alerts */}
      {dashboard?.unread_alerts > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-start space-x-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0" size={24} />
          <div>
            <h3 className="font-semibold text-yellow-900">You have {dashboard.unread_alerts} unread alert(s)</h3>
            <p className="text-sm text-yellow-800 mt-1">Check your alerts for important health notifications.</p>
          </div>
        </div>
      )}

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Mood Score */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-pink-100 p-3 rounded-lg">
              <Heart className="text-pink-600" size={24} />
            </div>
            {latestMood && getMoodIcon(latestMood.mood_score)}
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Mood Score</h3>
          <p className={`text-3xl font-bold ${latestMood ? getMoodColor(latestMood.mood_score) : 'text-gray-400'}`}>
            {latestMood ? Math.round(latestMood.mood_score * 100) : '--'}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {latestMood ? 'Last updated today' : 'No data yet'}
          </p>
        </div>

        {/* Cognitive Score */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-purple-100 p-3 rounded-lg">
              <Brain className="text-purple-600" size={24} />
            </div>
            <Award className="text-purple-500" size={24} />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Cognitive Score</h3>
          <p className="text-3xl font-bold text-purple-600">
            {latestCognitive ? Math.round(latestCognitive.cognitive_score * 100) : '--'}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {latestCognitive ? 'Last assessment' : 'No assessments yet'}
          </p>
        </div>

        {/* Stress Level */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-orange-100 p-3 rounded-lg">
              <Activity className="text-orange-600" size={24} />
            </div>
            <TrendingUp className="text-orange-500" size={24} />
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Stress Level</h3>
          <p className="text-3xl font-bold text-orange-600">
            {latestHealth?.stress_level ? Math.round(latestHealth.stress_level * 100) : '--'}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            {latestHealth ? 'Current level' : 'No data yet'}
          </p>
        </div>

        {/* Daily Steps */}
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <div className="bg-green-100 p-3 rounded-lg">
              <Target className="text-green-600" size={24} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Daily Steps</h3>
          <p className="text-3xl font-bold text-green-600">
            {latestHealth?.steps ? latestHealth.steps.toLocaleString() : '--'}
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Goal: 8,000 steps
          </p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Mood Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mood Trend (7 Days)</h3>
          {moodHistory.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={moodHistory.reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis domain={[0, 1]} />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                  formatter={(value) => [Math.round(value * 100), 'Mood Score']}
                />
                <Area 
                  type="monotone" 
                  dataKey="mood_score" 
                  stroke="#ec4899" 
                  fill="#fce7f3" 
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>No mood data available yet. Start tracking your mood!</p>
            </div>
          )}
        </div>

        {/* Health Metrics Trend */}
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Health Metrics (7 Days)</h3>
          {healthTrends.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={healthTrends}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Line 
                  type="monotone" 
                  dataKey="heart_rate" 
                  stroke="#ef4444" 
                  name="Heart Rate"
                />
                <Line 
                  type="monotone" 
                  dataKey="sleep_hours" 
                  stroke="#3b82f6" 
                  name="Sleep Hours"
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>No health data available yet. Add your health metrics!</p>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="btn btn-primary">
            Track Mood
          </button>
          <button className="btn btn-secondary">
            Play Brain Game
          </button>
          <button className="btn btn-secondary">
            Add Health Data
          </button>
          <button className="btn btn-secondary">
            Write Journal
          </button>
        </div>
      </div>
    </div>
  )
}
