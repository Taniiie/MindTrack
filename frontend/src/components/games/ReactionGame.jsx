import React, { useState, useEffect } from 'react'
import { Zap, RotateCcw } from 'lucide-react'

export default function ReactionGame({ onComplete }) {
  const [gameState, setGameState] = useState('ready') // ready, waiting, click, result
  const [reactionTimes, setReactionTimes] = useState([])
  const [startTime, setStartTime] = useState(null)
  const [round, setRound] = useState(0)
  const totalRounds = 5

  const startGame = () => {
    setGameState('waiting')
    const delay = Math.random() * 3000 + 1000 // 1-4 seconds
    
    setTimeout(() => {
      setGameState('click')
      setStartTime(Date.now())
    }, delay)
  }

  const handleClick = () => {
    if (gameState === 'waiting') {
      setGameState('ready')
      alert('Too early! Wait for the green screen.')
      return
    }

    if (gameState === 'click') {
      const reactionTime = Date.now() - startTime
      const newTimes = [...reactionTimes, reactionTime]
      setReactionTimes(newTimes)
      
      if (round + 1 >= totalRounds) {
        const avgTime = newTimes.reduce((a, b) => a + b, 0) / newTimes.length
        const score = Math.max(0, 100 - (avgTime - 200) / 10)
        const accuracy = 100
        
        setGameState('result')
        setTimeout(() => {
          onComplete(Math.round(score), avgTime, accuracy)
        }, 2000)
      } else {
        setRound(round + 1)
        setGameState('ready')
      }
    }
  }

  const reset = () => {
    setGameState('ready')
    setReactionTimes([])
    setRound(0)
  }

  const avgReactionTime = reactionTimes.length > 0
    ? Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length)
    : 0

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Reaction Time Test</h2>
        <button onClick={reset} className="btn btn-secondary flex items-center space-x-2">
          <RotateCcw size={18} />
          <span>Restart</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2">
          <span>Round {round + 1} of {totalRounds}</span>
          <span>Avg: {avgReactionTime}ms</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-primary-600 h-2 rounded-full transition-all"
            style={{ width: `${((round) / totalRounds) * 100}%` }}
          />
        </div>
      </div>

      <div
        onClick={handleClick}
        className={`
          rounded-lg p-12 text-center cursor-pointer transition-all
          ${gameState === 'ready' ? 'bg-blue-500 hover:bg-blue-600' : ''}
          ${gameState === 'waiting' ? 'bg-red-500' : ''}
          ${gameState === 'click' ? 'bg-green-500 hover:bg-green-600' : ''}
          ${gameState === 'result' ? 'bg-purple-500' : ''}
        `}
      >
        {gameState === 'ready' && (
          <div>
            <Zap className="text-white mx-auto mb-4" size={64} />
            <h3 className="text-2xl font-bold text-white mb-2">Ready?</h3>
            <p className="text-white">Click to start</p>
          </div>
        )}

        {gameState === 'waiting' && (
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Wait...</h3>
            <p className="text-white">Get ready to click!</p>
          </div>
        )}

        {gameState === 'click' && (
          <div>
            <h3 className="text-3xl font-bold text-white mb-2">CLICK NOW!</h3>
            <p className="text-white">As fast as you can!</p>
          </div>
        )}

        {gameState === 'result' && (
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Complete!</h3>
            <p className="text-white">Average: {avgReactionTime}ms</p>
          </div>
        )}
      </div>

      {reactionTimes.length > 0 && (
        <div className="mt-6">
          <h4 className="font-semibold text-gray-900 mb-3">Your Times</h4>
          <div className="flex flex-wrap gap-2">
            {reactionTimes.map((time, index) => (
              <div key={index} className="badge badge-info">
                Round {index + 1}: {time}ms
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
