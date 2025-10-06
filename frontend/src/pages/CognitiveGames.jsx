import React, { useState, useEffect } from 'react'
import axios from '../utils/axios'
import { Brain, Play, Trophy, Clock, Target, Zap } from 'lucide-react'
import MemoryGame from '../components/games/MemoryGame'
import ReactionGame from '../components/games/ReactionGame'
import SequenceGame from '../components/games/SequenceGame'

export default function CognitiveGames() {
  const [selectedGame, setSelectedGame] = useState(null)
  const [assessment, setAssessment] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAssessment()
  }, [])

  const fetchAssessment = async () => {
    try {
      const response = await axios.get('/api/cognitive/assessment')
      setAssessment(response.data)
      setLoading(false)
    } catch (error) {
      console.error('Error fetching assessment:', error)
      setLoading(false)
    }
  }

  const handleGameComplete = async (gameType, score, reactionTime, accuracy) => {
    try {
      await axios.post('/api/cognitive/game-result', {
        game_type: gameType,
        score,
        reaction_time: reactionTime,
        accuracy,
        difficulty_level: 1
      })
      fetchAssessment()
      setSelectedGame(null)
    } catch (error) {
      console.error('Error submitting game result:', error)
    }
  }

  const games = [
    {
      id: 'memory_match',
      name: 'Memory Match',
      description: 'Test your memory by matching pairs of cards',
      icon: Brain,
      color: 'purple',
      component: MemoryGame
    },
    {
      id: 'reaction_test',
      name: 'Reaction Time',
      description: 'Measure your reaction speed and focus',
      icon: Zap,
      color: 'yellow',
      component: ReactionGame
    },
    {
      id: 'sequence_recall',
      name: 'Sequence Recall',
      description: 'Remember and repeat number sequences',
      icon: Target,
      color: 'blue',
      component: SequenceGame
    }
  ]

  if (selectedGame) {
    const GameComponent = selectedGame.component
    return (
      <div className="animate-fadeIn">
        <button
          onClick={() => setSelectedGame(null)}
          className="btn btn-secondary mb-4"
        >
          ← Back to Games
        </button>
        <GameComponent
          onComplete={(score, reactionTime, accuracy) => 
            handleGameComplete(selectedGame.id, score, reactionTime, accuracy)
          }
        />
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Cognitive Games</h1>
        <p className="text-gray-600 mt-1">Train your brain and track cognitive performance</p>
      </div>

      {/* Assessment Summary */}
      {assessment?.summary && (
        <div className="card bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Cognitive Performance</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Overall Score</span>
                <Brain className="text-purple-600" size={20} />
              </div>
              <p className="text-3xl font-bold text-purple-600">
                {Math.round(assessment.summary.avg_cognitive_score * 100)}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Memory</span>
                <Target className="text-blue-600" size={20} />
              </div>
              <p className="text-3xl font-bold text-blue-600">
                {Math.round(assessment.summary.avg_memory_score * 100)}
              </p>
            </div>

            <div className="bg-white rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Focus</span>
                <Zap className="text-yellow-600" size={20} />
              </div>
              <p className="text-3xl font-bold text-yellow-600">
                {Math.round(assessment.summary.avg_focus_score * 100)}
              </p>
            </div>
          </div>

          {assessment.trend && (
            <div className="mt-4 bg-white rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Trend Analysis</h4>
              <p className="text-gray-700">{assessment.trend.message}</p>
              <span className={`badge mt-2 ${
                assessment.trend.trend === 'improving' ? 'badge-success' :
                assessment.trend.trend === 'declining' ? 'badge-danger' :
                'badge-info'
              }`}>
                {assessment.trend.trend.toUpperCase()}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Game Selection */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {games.map((game) => {
          const Icon = game.icon
          return (
            <div key={game.id} className="card hover:shadow-lg transition-shadow">
              <div className={`bg-${game.color}-100 p-4 rounded-lg mb-4 flex items-center justify-center`}>
                <Icon className={`text-${game.color}-600`} size={48} />
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{game.name}</h3>
              <p className="text-gray-600 mb-4">{game.description}</p>
              
              <button
                onClick={() => setSelectedGame(game)}
                className="btn btn-primary w-full flex items-center justify-center space-x-2"
              >
                <Play size={18} />
                <span>Play Now</span>
              </button>
            </div>
          )
        })}
      </div>

      {/* Benefits */}
      <div className="card bg-green-50 border-green-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-3">🧠 Benefits of Cognitive Training</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start space-x-3">
            <Trophy className="text-green-600 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-medium text-gray-900">Improve Memory</h4>
              <p className="text-sm text-gray-600">Enhance short-term and working memory</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Clock className="text-green-600 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-medium text-gray-900">Boost Focus</h4>
              <p className="text-sm text-gray-600">Increase attention span and concentration</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Zap className="text-green-600 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-medium text-gray-900">Faster Processing</h4>
              <p className="text-sm text-gray-600">Improve reaction time and mental agility</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Brain className="text-green-600 flex-shrink-0" size={20} />
            <div>
              <h4 className="font-medium text-gray-900">Early Detection</h4>
              <p className="text-sm text-gray-600">Monitor cognitive health over time</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
