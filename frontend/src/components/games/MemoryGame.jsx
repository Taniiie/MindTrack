import React, { useState, useEffect } from 'react'
import { Trophy, RotateCcw } from 'lucide-react'

const EMOJIS = ['🧠', '❤️', '⭐', '🎯', '🎨', '🎵', '🌟', '💡']

export default function MemoryGame({ onComplete }) {
  const [cards, setCards] = useState([])
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])
  const [moves, setMoves] = useState(0)
  const [startTime, setStartTime] = useState(null)
  const [gameComplete, setGameComplete] = useState(false)

  useEffect(() => {
    initializeGame()
  }, [])

  useEffect(() => {
    if (matched.length === cards.length && cards.length > 0) {
      const endTime = Date.now()
      const timeTaken = (endTime - startTime) / 1000
      const score = Math.max(0, 100 - moves * 2)
      const accuracy = (cards.length / 2) / moves * 100
      
      setGameComplete(true)
      setTimeout(() => {
        onComplete(score, timeTaken * 1000, accuracy)
      }, 1500)
    }
  }, [matched])

  const initializeGame = () => {
    const gameCards = [...EMOJIS, ...EMOJIS]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({ id: index, emoji, flipped: false }))
    
    setCards(gameCards)
    setFlipped([])
    setMatched([])
    setMoves(0)
    setStartTime(Date.now())
    setGameComplete(false)
  }

  const handleCardClick = (index) => {
    if (flipped.length === 2 || flipped.includes(index) || matched.includes(index)) {
      return
    }

    const newFlipped = [...flipped, index]
    setFlipped(newFlipped)

    if (newFlipped.length === 2) {
      setMoves(moves + 1)
      
      const [first, second] = newFlipped
      if (cards[first].emoji === cards[second].emoji) {
        setMatched([...matched, first, second])
        setFlipped([])
      } else {
        setTimeout(() => setFlipped([]), 1000)
      }
    }
  }

  return (
    <div className="card max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Memory Match</h2>
        <button onClick={initializeGame} className="btn btn-secondary flex items-center space-x-2">
          <RotateCcw size={18} />
          <span>Restart</span>
        </button>
      </div>

      <div className="flex justify-between mb-6">
        <div className="text-center">
          <p className="text-sm text-gray-600">Moves</p>
          <p className="text-2xl font-bold text-primary-600">{moves}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-gray-600">Matched</p>
          <p className="text-2xl font-bold text-green-600">{matched.length / 2} / {cards.length / 2}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {cards.map((card, index) => {
          const isFlipped = flipped.includes(index) || matched.includes(index)
          
          return (
            <button
              key={card.id}
              onClick={() => handleCardClick(index)}
              disabled={isFlipped || gameComplete}
              className={`
                aspect-square rounded-lg text-4xl font-bold transition-all transform
                ${isFlipped 
                  ? 'bg-white border-2 border-primary-500 scale-105' 
                  : 'bg-primary-600 hover:bg-primary-700 active:scale-95'
                }
                ${matched.includes(index) ? 'bg-green-500 border-green-600' : ''}
              `}
            >
              {isFlipped ? card.emoji : '?'}
            </button>
          )
        })}
      </div>

      {gameComplete && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
          <Trophy className="text-green-600 mx-auto mb-3" size={48} />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Congratulations!</h3>
          <p className="text-gray-700">You completed the game in {moves} moves!</p>
        </div>
      )}
    </div>
  )
}
