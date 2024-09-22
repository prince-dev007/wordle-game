'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { AlertCircle, Delete } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

const WORD_LENGTH = 5
const MAX_GUESSES = 6
const KEYBOARD_LAYOUT = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DEL']
]

const WORDS = ['REACT', 'REDUX', 'HOOKS', 'STATE', 'PROPS', 'ASYNC', 'AWAIT', 'FETCH', 'ROUTE', 'STYLE']

export function WordleGameComponent() {
  const [secretWord, setSecretWord] = useState('')
  const [guesses, setGuesses] = useState<string[]>([])
  const [currentGuess, setCurrentGuess] = useState('')
  const [gameOver, setGameOver] = useState(false)
  const [message, setMessage] = useState('')
  const [usedLetters, setUsedLetters] = useState<{[key: string]: string}>({})

  useEffect(() => {
    setSecretWord(WORDS[Math.floor(Math.random() * WORDS.length)])
  }, [])

  const handleKeyPress = useCallback((key: string) => {
    if (gameOver) return

    if (key === 'ENTER') {
      if (currentGuess.length !== WORD_LENGTH) {
        setMessage('Word must be 5 letters long')
        return
      }
      if (!WORDS.includes(currentGuess)) {
        setMessage('Not in word list')
        return
      }
      const newGuesses = [...guesses, currentGuess]
      setGuesses(newGuesses)
      
      // Update used letters
      const newUsedLetters = {...usedLetters}
      for (let i = 0; i < currentGuess.length; i++) {
        const letter = currentGuess[i]
        if (secretWord[i] === letter) {
          newUsedLetters[letter] = 'correct'
        } else if (secretWord.includes(letter) && newUsedLetters[letter] !== 'correct') {
          newUsedLetters[letter] = 'present'
        } else if (!newUsedLetters[letter]) {
          newUsedLetters[letter] = 'absent'
        }
      }
      setUsedLetters(newUsedLetters)

      setCurrentGuess('')

      if (currentGuess === secretWord) {
        setGameOver(true)
        setMessage('Congratulations! You won!')
      } else if (newGuesses.length === MAX_GUESSES) {
        setGameOver(true)
        setMessage(`Game over! The word was ${secretWord}`)
      }
    } else if (key === 'DEL') {
      setCurrentGuess(currentGuess.slice(0, -1))
    } else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
      setCurrentGuess(currentGuess + key)
    }
  }, [currentGuess, gameOver, guesses, secretWord, usedLetters])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        handleKeyPress('ENTER')
      } else if (event.key === 'Backspace') {
        handleKeyPress('DEL')
      } else {
        const key = event.key.toUpperCase()
        if (/^[A-Z]$/.test(key)) {
          handleKeyPress(key)
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [handleKeyPress])

  const getLetterStyle = (letter: string, index: number, guess: string) => {
    if (guess[index] === secretWord[index]) {
      return 'bg-green-500 text-white'
    } else if (secretWord.includes(guess[index])) {
      return 'bg-yellow-500 text-white'
    } else {
      return 'bg-gray-500 text-white'
    }
  }

  const getKeyboardButtonStyle = (key: string) => {
    switch (usedLetters[key]) {
      case 'correct':
        return 'bg-green-500 text-white'
      case 'present':
        return 'bg-yellow-500 text-white'
      case 'absent':
        return 'bg-gray-500 text-white'
      default:
        return 'bg-gray-200'
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-8 text-black">Wordle</h1>
      <div className="grid grid-cols-5 gap-2 mb-4">
        {[...Array(MAX_GUESSES)].map((_, rowIndex) => (
          <React.Fragment key={rowIndex}>
            {[...Array(WORD_LENGTH)].map((_, colIndex) => {
              const letter = guesses[rowIndex]?.[colIndex] || (rowIndex === guesses.length ? currentGuess[colIndex] : '')
              const style = guesses[rowIndex] ? getLetterStyle(letter, colIndex, guesses[rowIndex]) : 'bg-white'
              return (
                <div
                  key={colIndex}
                  className={`w-12 h-12 border-2 border-gray-300 flex items-center justify-center text-2xl text-black font-bold ${style}`}
                >
                  {letter}
                </div>
              )
            })}
          </React.Fragment>
        ))}
      </div>
      <div className="mb-4">
        {KEYBOARD_LAYOUT.map((row, rowIndex) => (
          <div key={rowIndex} className="flex justify-center mb-2 text-black">
            {row.map((key) => (
              <Button
                key={key}
                onClick={() => handleKeyPress(key)}
                className={`mx-1 ${getKeyboardButtonStyle(key)}`}
                variant={key === 'ENTER' || key === 'DEL' ? 'default' : 'outline'}
              >
                {key === 'DEL' ? <Delete className="h-4 w-4" /> : key}
              </Button>
            ))}
          </div>
        ))}
      </div>
      {message && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Attention</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
      {gameOver && (
        <Button onClick={() => window.location.reload()}>Play Again</Button>
      )}
    </div>
  )
}