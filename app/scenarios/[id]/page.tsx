'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { scenarioData } from '@/lib/data'

export default function ScenarioPage() {
  const { id } = useParams()
  const router = useRouter()
  const scenario = scenarioData[id as string]
  const [myCharacter, setMyCharacter] = useState<string>('')
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    const character = localStorage.getItem('myCharacter') || ''
    setMyCharacter(character)

    // Check if already answered
    const saved = localStorage.getItem(`scenario_${id}`)
    if (saved) {
      const data = JSON.parse(saved)
      setSelected(data.myAnswer || null)
    }
  }, [id])

  const handleSelect = (optionId: string) => {
    setSelected(optionId)
  }

  const handleSave = () => {
    if (selected) {
      localStorage.setItem(
        `scenario_${id}`,
        JSON.stringify({ myAnswer: selected })
      )
      router.push('/scenarios')
    }
  }

  if (!scenario) {
    return <div className="p-20 text-center">Scenario not found.</div>
  }

  const characterEmoji = myCharacter === 'baymax' ? '🤖' : '🐉'

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <header className="mb-12 text-center">
        <div className="text-5xl mb-4">{characterEmoji}</div>
        <h1 className="text-4xl font-serif font-bold text-slate-800 mb-4">
          {scenario.name}
        </h1>
        <div className="bg-slate-50 p-6 rounded-2xl mb-6">
          <p className="text-slate-600 italic mb-4">{scenario.situation}</p>
          <p className="text-lg font-semibold text-slate-800">
            {scenario.question}
          </p>
        </div>
      </header>

      <div className="space-y-4 mb-12">
        {scenario.options.map((option) => (
          <button
            key={option.id}
            onClick={() => handleSelect(option.id)}
            className={`w-full text-left p-6 rounded-2xl border-2 transition-all ${
              selected === option.id
                ? 'border-emerald-500 bg-emerald-50'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <p className="text-slate-700 font-medium">{option.text}</p>
          </button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <Link href="/scenarios" className="text-slate-400 hover:text-slate-600 font-bold">
          ← Back
        </Link>
        <button
          onClick={handleSave}
          disabled={!selected}
          className={`btn-blueprint ${!selected ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          Save Answer
        </button>
      </div>
    </main>
  )
}
