'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { characters } from '@/lib/data'

export default function Home() {
  const router = useRouter()
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user already selected a character
    const saved = localStorage.getItem('myCharacter')
    if (saved) {
      router.push('/scenarios')
    } else {
      setIsLoading(false)
    }
  }, [router])

  const handleSelect = (characterId: string) => {
    setSelectedCharacter(characterId)
  }

  const handleContinue = () => {
    if (selectedCharacter) {
      localStorage.setItem('myCharacter', selectedCharacter)
      router.push('/scenarios')
    }
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <header className="text-center mb-16">
        <h1 className="text-5xl font-serif font-bold text-slate-800 mb-4">
          Choose Your Companion
        </h1>
        <p className="text-xl text-slate-500 italic">
          Pick your character for this adventure
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl w-full mb-12">
        {/* Baymax Card */}
        <button
          onClick={() => handleSelect('baymax')}
          className={`blueprint-card text-left transition-all ${
            selectedCharacter === 'baymax' 
              ? 'ring-4 ring-emerald-500 scale-105' 
              : 'hover:scale-105'
          }`}
        >
          <div className="text-center mb-6">
            <div className="text-8xl mb-4">🤖</div>
            <h2 className="text-3xl font-bold text-slate-800">Baymax</h2>
            <p className="text-slate-500 italic mt-2">Healthcare companion mode</p>
          </div>
          <div className="space-y-2 text-sm text-slate-600">
            <p>• "I am satisfied with this compatibility"</p>
            <p>• "Treatment is working well"</p>
            <p>• "I detect a need for discussion"</p>
          </div>
        </button>

        {/* Toothless Card */}
        <button
          onClick={() => handleSelect('toothless')}
          className={`blueprint-card text-left transition-all ${
            selectedCharacter === 'toothless' 
              ? 'ring-4 ring-emerald-500 scale-105' 
              : 'hover:scale-105'
          }`}
        >
          <div className="text-center mb-6">
            <div className="text-8xl mb-4">🐉</div>
            <h2 className="text-3xl font-bold text-slate-800">Toothless</h2>
            <p className="text-slate-500 italic mt-2">Night Fury ready for adventure</p>
          </div>
          <div className="space-y-2 text-sm text-slate-600">
            <p>• 😊 *happy wiggle*</p>
            <p>• 🤔 *curious head tilt*</p>
            <p>• 😐 *skeptical squint*</p>
          </div>
        </button>
      </div>

      {selectedCharacter && (
        <button
          onClick={handleContinue}
          className="btn-blueprint text-lg px-12 py-4"
        >
          Continue with {characters[selectedCharacter].name}
        </button>
      )}
    </main>
  )
}
