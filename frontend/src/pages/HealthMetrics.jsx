import React, { useState, useEffect } from 'react'
import axios from '../utils/axios'
import { Activity, Heart, Moon, TrendingUp, Plus } from 'lucide-react'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

export default function HealthMetrics() {
  const [metrics, setMetrics] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    heart_rate: '',
    hrv_score: '',
    sleep_hours: '',
    sleep_quality: 'good',
    steps: '',
    activity_level: 'moderate',
    stress_level: ''
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMetrics()
  }, [])

  const fetchMetrics = async () => {
    try {
      const response = await axios.get('/api/health/metrics?limit=14')
      setMetrics(response.data.metrics || [])
      setLoading(false)
    } catch (error) {
      console.error('Error fetching metrics:', error)
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await axios.post('/api/health/metrics', {
        heart_rate: parseInt(formData.heart_rate) || null,
        hrv_score: parseFloat(formData.hrv_score) || null,
        sleep_hours: parseFloat(formData.sleep_hours) || null,
        sleep_quality: formData.sleep_quality,
        steps: parseInt(formData.steps) || null,
        activity_level: formData.activity_level,
        stress_level: parseFloat(formData.stress_level) || null
      })
      
      setFormData({
        heart_rate: '',
        hrv_score: '',
        sleep_hours: '',
        sleep_quality: 'good',
        steps: '',
        activity_level: 'moderate',
        stress_level: ''
      })
      setShowForm(false)
      fetchMetrics()
    } catch (error) {
      console.error('Error submitting metrics:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const latestMetrics = metrics[0] || {}

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Health Metrics</h1>
          <p className="text-gray-600 mt-1">Track your physical health and wellness data</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>Add Metrics</span>
        </button>
      </div>

      {/* Add Metrics Form */}
      {showForm && (
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add Health Metrics</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  name="heart_rate"
                  value={formData.heart_rate}
                  onChange={handleChange}
                  className="input"
                  placeholder="70"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  HRV Score
                </label>
                <input
                  type="number"
                  step="0.1"
                  name="hrv_score"
                  value={formData.hrv_score}
                  onChange={handleChange}
                  className="input"
                  placeholder="50"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sleep Hours
                </label>
                <input
                  type="number"
                  step="0.5"
                  name="sleep_hours"
                  value={formData.sleep_hours}
                  onChange={handleChange}
                  className="input"
                  placeholder="7.5"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sleep Quality
                </label>
                <select
                  name="sleep_quality"
                  value={formData.sleep_quality}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="excellent">Excellent</option>
                  <option value="good">Good</option>
                  <option value="fair">Fair</option>
                  <option value="poor">Poor</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Steps
                </label>
                <input
                  type="number"
                  name="steps"
                  value={formData.steps}
                  onChange={handleChange}
                  className="input"
                  placeholder="8000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Activity Level
                </label>
                <select
                  name="activity_level"
                  value={formData.activity_level}
                  onChange={handleChange}
                  className="input"
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="light">Light</option>
                  <option value="moderate">Moderate</option>
                  <option value="active">Active</option>
                  <option value="very_active">Very Active</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stress Level (0-1)
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  max="1"
                  name="stress_level"
                  value={formData.stress_level}
                  onChange={handleChange}
                  className="input"
                  placeholder="0.5"
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button type="submit" className="btn btn-primary">
                Save Metrics
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="btn btn-secondary"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Current Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-red-100 p-2 rounded-lg">
              <Heart className="text-red-600" size={24} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Heart Rate</h3>
          <p className="text-3xl font-bold text-red-600">
            {latestMetrics.heart_rate || '--'}
          </p>
          <p className="text-xs text-gray-500 mt-1">bpm</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Moon className="text-blue-600" size={24} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Sleep</h3>
          <p className="text-3xl font-bold text-blue-600">
            {latestMetrics.sleep_hours || '--'}
          </p>
          <p className="text-xs text-gray-500 mt-1">hours</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-green-100 p-2 rounded-lg">
              <Activity className="text-green-600" size={24} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">Steps</h3>
          <p className="text-3xl font-bold text-green-600">
            {latestMetrics.steps ? latestMetrics.steps.toLocaleString() : '--'}
          </p>
          <p className="text-xs text-gray-500 mt-1">today</p>
        </div>

        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="bg-orange-100 p-2 rounded-lg">
              <TrendingUp className="text-orange-600" size={24} />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">HRV Score</h3>
          <p className="text-3xl font-bold text-orange-600">
            {latestMetrics.hrv_score || '--'}
          </p>
          <p className="text-xs text-gray-500 mt-1">variability</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Heart Rate & HRV Trend</h3>
          {metrics.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={metrics.reverse()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Legend />
                <Line type="monotone" dataKey="heart_rate" stroke="#ef4444" name="Heart Rate" />
                <Line type="monotone" dataKey="hrv_score" stroke="#f97316" name="HRV Score" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>No data available. Add your health metrics!</p>
            </div>
          )}
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Sleep & Activity</h3>
          {metrics.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="timestamp" 
                  tickFormatter={(value) => new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                />
                <YAxis />
                <Tooltip 
                  labelFormatter={(value) => new Date(value).toLocaleDateString()}
                />
                <Legend />
                <Bar dataKey="sleep_hours" fill="#3b82f6" name="Sleep Hours" />
                <Bar dataKey="steps" fill="#10b981" name="Steps (÷1000)" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-400">
              <p>No data available. Add your health metrics!</p>
            </div>
          )}
        </div>
      </div>

      {/* Health Tips */}
      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">💡 Health Tips</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Heart Health</h4>
            <p className="text-sm text-gray-600">Maintain 60-100 bpm resting heart rate. Regular exercise improves cardiovascular health.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Sleep Quality</h4>
            <p className="text-sm text-gray-600">Aim for 7-9 hours of quality sleep. Maintain consistent sleep schedule.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Daily Activity</h4>
            <p className="text-sm text-gray-600">Target 8,000-10,000 steps daily. Regular movement reduces health risks.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">HRV Monitoring</h4>
            <p className="text-sm text-gray-600">Higher HRV indicates better recovery and stress management capacity.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
