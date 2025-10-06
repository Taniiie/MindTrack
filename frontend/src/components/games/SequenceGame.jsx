import React, { useState, useEffect } from 'react'
import { Target, RotateCcw } from 'lucide-react'

export default function SequenceGame({ onComplete }) {
  const [sequence, setSequence] = useState([])
  const [userInput, setUserInput] = useState([])
  const [gameState, setGameState] = useState('ready') // ready, showing, input, correct, wrong, complete
  const [level, setLevel] = useState(1)
  const [score, setScore] = useState(0)
  const [showingIndex, setShowingIndex] = useState(-1)

  const startGame = () => {
    const newSequence = Array.from({ length: level + 2 }, () => Math.floor(Math.random() * 9) + 1)
    setSequence(newSequence)
    setUserInput([])
    setGameState('showing')
    showSequence(newSequence)
  }

  const showSequence = async (seq) => {
    for (let i = 0; i < seq.length; i++) {
      setShowingIndex(seq[i])
      await new Promise(resolve => setTimeout(resolve, 600))
      setShowingIndex(-1)
      await new Promise(resolve => setTimeout(resolve, 300))
    }
    setGameState('input')
  }

  const handleNumberClick = (num) => {
    if (gameState !== 'input') return

    const newInput = [...userInput, num]
    setUserInput(newInput)

    if (newInput[newInput.length - 1] !== sequence[newInput.length - 1]) {
      setGameState('wrong')
      const finalScore = score
      const avgTime = 500
      const accuracy = (score / (level * 10)) * 100
      
      setTimeout(() => {
        onComplete(finalScore, avgTime, accuracy)
      }, 1500)
      return
    }

    if (newInput.length === sequence.length) {
      const newScore = score + level * 10
      setScore(newScore)
      setGameState('correct')
      
      if (level >= 5) {
        setTimeout(() => {
          setGameState('complete')
          const avgTime = 500
          const accuracy = 100
          setTimeout(() => {
            onComplete(newScore, avgTime, accuracy)
          }, 1500)
        }, 1000)
      } else {
        setTimeout(() => {
          setLevel(level + 1)
          startGame()
        }, 1500)
      }
    }
  }

  const reset = () => {
    setSequence([])
    setUserInput([])
    setGameState('ready')
    setLevel(1)
    setScore(0)
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Sequence Recall</h2>
        <button onClick={reset} className="btn btn-secondary flex items-center space-x-2">
          <RotateCcw size={18} />
          <span>Restart</span>
        </button>
      </div>

      <div className="flex justify-between mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-600">Level</p>
          <p className="text-2xl font-bold text-primary-600">{level}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Score</p>
          <p className="text-2xl font-bold text-green-600">{score}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Sequence</p>
          <p className="text-2xl font-bold text-purple-600">{sequence.length}</p>
        </div>
      </div>

      {gameState === 'ready' && (
        <div className="text-center py-12">
          <Target className="text-primary-600 mx-auto mb-4" size={64} />
          <h3 className="text-xl font-bold text-gray-900 mb-4">Ready to test your memory?</h3>
          <p className="text-gray-600 mb-6">Watch the sequence and repeat it!</p>
          <button onClick={startGame} className="btn btn-primary">
            Start Game
          </button>
        </div>
      )}

      {(gameState === 'showing' || gameState === 'input') && (
        <div>
          <div className="text-center mb-6">
            <p className="text-lg font-semibold text-gray-700">
              {gameState === 'showing' ? 'Watch the sequence...' : 'Your turn! Repeat the sequence'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
              <button
                key={num}
                onClick={() => handleNumberClick(num)}
                disabled={gameState !== 'input'}
                className={`
                  aspect-square rounded-lg text-3xl font-bold transition-all
                  ${showingIndex === num 
                    ? 'bg-primary-600 text-white scale-110' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }
                  ${gameState === 'input' ? 'cursor-pointer active:scale-95' : 'cursor-not-allowed'}
                `}
              >
                {num}
              </button>
            ))}
          </div>

          {userInput.length > 0 && (
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600 mb-2">Your input:</p>
              <div className="flex justify-center gap-2">
                {userInput.map((num, index) => (
                  <span key={index} className="badge badge-info text-lg">
                    {num}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {gameState === 'correct' && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-green-600 mb-2">Correct! 🎉</h3>
          <p className="text-gray-700">Moving to level {level + 1}...</p>
        </div>
      )}

      {gameState === 'wrong' && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-red-600 mb-2">Game Over</h3>
          <p className="text-gray-700">You reached level {level} with a score of {score}</p>
        </div>
      )}

      {gameState === 'complete' && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-8 text-center">
          <h3 className="text-2xl font-bold text-purple-600 mb-2">Amazing! 🏆</h3>
          <p className="text-gray-700">You completed all levels with a score of {score}!</p>
        </div>
      )}
    </div>
  )
}
