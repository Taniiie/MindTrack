import React, { useState, useEffect } from 'react'
import axios from '../utils/axios'
import { BookOpen, Plus, Calendar, Smile, Meh, Frown } from 'lucide-react'

export default function Journal() {
  const [entries, setEntries] = useState([])
  const [showForm, setShowForm] = useState(false)
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchEntries()
  }, [])

  const fetchEntries = async () => {
    try {
      const response = await axios.get('/api/journal/entries')
      setEntries(response.data.entries || [])
    } catch (error) {
      console.error('Error fetching entries:', error)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) return

    setLoading(true)
    try {
      await axios.post('/api/journal/entry', { content })
      setContent('')
      setShowForm(false)
      fetchEntries()
    } catch (error) {
      console.error('Error creating entry:', error)
    } finally {
      setLoading(false)
    }
  }

  const getSentimentIcon = (score) => {
    if (score >= 0.6) return <Smile className="text-green-500" size={20} />
    if (score >= 0.4) return <Meh className="text-yellow-500" size={20} />
    return <Frown className="text-red-500" size={20} />
  }

  const getSentimentColor = (score) => {
    if (score >= 0.6) return 'bg-green-50 border-green-200'
    if (score >= 0.4) return 'bg-yellow-50 border-yellow-200'
    return 'bg-red-50 border-red-200'
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Journal</h1>
          <p className="text-gray-600 mt-1">Reflect on your thoughts and feelings</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus size={18} />
          <span>New Entry</span>
        </button>
      </div>

      {/* New Entry Form */}
      {showForm && (
        <div className="card">
          <div className="flex items-center space-x-3 mb-4">
            <div className="bg-purple-100 p-2 rounded-lg">
              <BookOpen className="text-purple-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">New Journal Entry</h2>
          </div>

          <form onSubmit={handleSubmit}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write about your day, thoughts, feelings, or anything on your mind..."
              className="input min-h-[200px] resize-none"
              rows={8}
            />

            <div className="flex space-x-3 mt-4">
              <button
                type="submit"
                disabled={loading || !content.trim()}
                className="btn btn-primary"
              >
                {loading ? 'Saving...' : 'Save Entry'}
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

      {/* Journal Entries */}
      <div className="space-y-4">
        {entries.length > 0 ? (
          entries.map((entry) => (
            <div
              key={entry.id}
              className={`card ${getSentimentColor(entry.sentiment_score || 0.5)}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="text-gray-600" size={20} />
                  <span className="text-sm font-medium text-gray-700">
                    {new Date(entry.timestamp).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  {getSentimentIcon(entry.sentiment_score || 0.5)}
                  <span className="text-sm font-medium text-gray-600">
                    {Math.round((entry.sentiment_score || 0.5) * 100)}
                  </span>
                </div>
              </div>

              <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                {entry.content}
              </p>

              {entry.emotions && JSON.parse(entry.emotions).length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {JSON.parse(entry.emotions).map((emotion, index) => (
                    <span key={index} className="badge badge-info">
                      {emotion}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="card text-center py-12">
            <BookOpen className="text-gray-400 mx-auto mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No journal entries yet</h3>
            <p className="text-gray-600 mb-6">Start writing to track your thoughts and feelings</p>
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-primary"
            >
              Create First Entry
            </button>
          </div>
        )}
      </div>

      {/* Journaling Benefits */}
      <div className="card bg-purple-50 border-purple-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">📝 Benefits of Journaling</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Emotional Processing</h4>
            <p className="text-sm text-gray-600">Express and process complex emotions in a safe space.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Stress Reduction</h4>
            <p className="text-sm text-gray-600">Writing helps reduce stress and anxiety levels.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Self-Awareness</h4>
            <p className="text-sm text-gray-600">Gain insights into your thoughts and behavior patterns.</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-1">Track Progress</h4>
            <p className="text-sm text-gray-600">Monitor your mental health journey over time.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
