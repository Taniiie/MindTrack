import React, { useState, useEffect, useRef } from 'react'
import axios from '../utils/axios'
import { MessageCircle, Send, Sparkles, Heart, Brain, Smile, AlertCircle, Loader, Trash2 } from 'lucide-react'

export default function WellnessChatbot() {
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [dailyAffirmation, setDailyAffirmation] = useState('')
  const [emotionalPatterns, setEmotionalPatterns] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    loadChatHistory()
    loadDailyAffirmation()
    loadEmotionalPatterns()
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadChatHistory = async () => {
    try {
      const response = await axios.get('/api/chatbot/history')
      setMessages(response.data.conversations || [])
    } catch (error) {
      console.error('Error loading chat history:', error)
    }
  }

  const loadDailyAffirmation = async () => {
    try {
      const response = await axios.get('/api/chatbot/affirmation')
      setDailyAffirmation(response.data.affirmation)
    } catch (error) {
      console.error('Error loading affirmation:', error)
    }
  }

  const loadEmotionalPatterns = async () => {
    try {
      const response = await axios.get('/api/chatbot/emotional-patterns')
      setEmotionalPatterns(response.data.patterns)
    } catch (error) {
      console.error('Error loading patterns:', error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage.trim() || loading) return

    const userMessage = inputMessage.trim()
    setInputMessage('')
    setLoading(true)

    // Add user message to UI immediately
    const tempUserMsg = {
      message: userMessage,
      is_user: 1,
      timestamp: new Date().toISOString()
    }
    setMessages(prev => [...prev, tempUserMsg])

    try {
      const response = await axios.post(
        '/api/chatbot/message',
        { message: userMessage }
      )

      const botResponse = response.data

      // Add bot response to messages
      const botMessage = {
        message: botResponse.response,
        is_user: 0,
        timestamp: new Date().toISOString(),
        emotion_detected: botResponse.emotion_detected,
        suggestions: botResponse.suggestions,
        affirmation: botResponse.affirmation,
        recommended_exercise: botResponse.recommended_exercise
      }
      setMessages(prev => [...prev, botMessage])

      // Reload patterns after conversation
      loadEmotionalPatterns()
    } catch (error) {
      console.error('Error sending message:', error)
      alert('Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const clearHistory = async () => {
    if (!confirm('Are you sure you want to clear your conversation history?')) return

    try {
      await axios.delete('/api/chatbot/clear-history')
      setMessages([])
      loadEmotionalPatterns()
    } catch (error) {
      console.error('Error clearing history:', error)
      alert('Failed to clear history.')
    }
  }

  const getEmotionIcon = (emotion) => {
    switch (emotion) {
      case 'positive':
        return <Smile className="w-4 h-4 text-green-500" />
      case 'anxious':
        return <AlertCircle className="w-4 h-4 text-yellow-500" />
      case 'sad':
        return <Heart className="w-4 h-4 text-blue-500" />
      case 'stressed':
        return <Brain className="w-4 h-4 text-orange-500" />
      default:
        return <MessageCircle className="w-4 h-4 text-gray-500" />
    }
  }

  const getEmotionColor = (emotion) => {
    switch (emotion) {
      case 'positive':
        return 'bg-green-50 border-green-200'
      case 'anxious':
        return 'bg-yellow-50 border-yellow-200'
      case 'sad':
        return 'bg-blue-50 border-blue-200'
      case 'stressed':
        return 'bg-orange-50 border-orange-200'
      default:
        return 'bg-gray-50 border-gray-200'
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
              <MessageCircle className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">AI Wellness Companion</h1>
              <p className="text-gray-600">Your empathetic mental health support chatbot</p>
            </div>
          </div>
          <button
            onClick={clearHistory}
            className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear History</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chat Area */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden flex flex-col" style={{ height: '600px' }}>
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-purple-50/30 to-white">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                  <div className="p-6 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full">
                    <Sparkles className="w-16 h-16 text-purple-600" />
                  </div>
                  <h3 className="text-2xl font-semibold text-gray-800">Welcome to Your Wellness Companion</h3>
                  <p className="text-gray-600 max-w-md">
                    I'm here to listen, support, and guide you through your mental wellness journey. 
                    Share your thoughts, feelings, or concerns with me.
                  </p>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex ${msg.is_user ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl p-4 ${
                        msg.is_user
                          ? 'bg-gradient-to-br from-purple-500 to-pink-500 text-white'
                          : `${getEmotionColor(msg.emotion_detected)} border-2`
                      }`}
                    >
                      {!msg.is_user && msg.emotion_detected && (
                        <div className="flex items-center space-x-2 mb-2">
                          {getEmotionIcon(msg.emotion_detected)}
                          <span className="text-xs font-medium text-gray-600 capitalize">
                            {msg.emotion_detected} emotion detected
                          </span>
                        </div>
                      )}
                      <p className={`${msg.is_user ? 'text-white' : 'text-gray-800'}`}>
                        {msg.message}
                      </p>
                      
                      {/* Show suggestions for bot messages */}
                      {!msg.is_user && msg.suggestions && msg.suggestions.length > 0 && (
                        <div className="mt-4 space-y-2">
                          {msg.suggestions.map((suggestion, idx) => (
                            <div
                              key={idx}
                              className="bg-white/80 rounded-lg p-3 text-sm"
                            >
                              <div className="font-semibold text-purple-700 capitalize mb-1">
                                {suggestion.type.replace('_', ' ')}
                              </div>
                              {typeof suggestion.content === 'string' ? (
                                <p className="text-gray-700">{suggestion.content}</p>
                              ) : (
                                <div className="text-gray-700">
                                  <div className="font-medium">{suggestion.content.name}</div>
                                  <div className="text-xs mt-1">{suggestion.content.description}</div>
                                  <div className="text-xs text-gray-500 mt-1">
                                    ⏱️ {suggestion.content.duration} • {suggestion.content.benefits}
                                  </div>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Show affirmation */}
                      {!msg.is_user && msg.affirmation && (
                        <div className="mt-3 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-4 h-4 text-purple-600" />
                            <span className="text-sm font-medium text-purple-800">{msg.affirmation}</span>
                          </div>
                        </div>
                      )}

                      <span className={`text-xs mt-2 block ${msg.is_user ? 'text-purple-100' : 'text-gray-500'}`}>
                        {new Date(msg.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                ))
              )}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 rounded-2xl p-4 flex items-center space-x-2">
                    <Loader className="w-5 h-5 text-purple-600 animate-spin" />
                    <span className="text-gray-600">Thinking...</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200">
              <div className="flex space-x-3">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  placeholder="Share your thoughts or feelings..."
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !inputMessage.trim()}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Daily Affirmation */}
          {dailyAffirmation && (
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center space-x-2 mb-3">
                <Sparkles className="w-6 h-6" />
                <h3 className="text-lg font-semibold">Daily Affirmation</h3>
              </div>
              <p className="text-white/90 leading-relaxed">{dailyAffirmation}</p>
            </div>
          )}

          {/* Emotional Patterns */}
          {emotionalPatterns && emotionalPatterns.pattern !== 'insufficient_data' && (
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center space-x-2">
                <Brain className="w-5 h-5 text-purple-600" />
                <span>Emotional Insights</span>
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Most Common Emotion</div>
                  <div className="flex items-center space-x-2">
                    {getEmotionIcon(emotionalPatterns.pattern)}
                    <span className="font-medium text-gray-800 capitalize">{emotionalPatterns.pattern}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Average Sentiment</div>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full"
                        style={{ width: `${emotionalPatterns.average_sentiment * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700">
                      {Math.round(emotionalPatterns.average_sentiment * 100)}%
                    </span>
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Conversations</div>
                  <div className="font-medium text-gray-800">{emotionalPatterns.conversation_count}</div>
                </div>
                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-700 leading-relaxed">{emotionalPatterns.insights}</p>
                </div>
                {emotionalPatterns.recommendation && (
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800">{emotionalPatterns.recommendation}</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Features Info */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">How I Can Help</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-pink-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-800">Empathetic Support</div>
                  <div className="text-sm text-gray-600">Listen and respond to your emotions</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Sparkles className="w-5 h-5 text-purple-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-800">Daily Affirmations</div>
                  <div className="text-sm text-gray-600">Positive messages to boost your mood</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Brain className="w-5 h-5 text-blue-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-800">Pattern Analysis</div>
                  <div className="text-sm text-gray-600">Track emotional trends over time</div>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MessageCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium text-gray-800">Wellness Tips</div>
                  <div className="text-sm text-gray-600">Personalized exercises and activities</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
