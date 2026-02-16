'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { scenarioData } from '@/lib/data'

export default function Scenarios() {
  const [completed, setCompleted] = useState(0)
  const [myCharacter, setMyCharacter] = useState<string>('')
  const total = Object.keys(scenarioData).length

  useEffect(() => {
    const character = localStorage.getItem('myCharacter') || ''
    setMyCharacter(character)

    const count = Object.keys(scenarioData).filter(key => {
      const data = JSON.parse(localStorage.getItem(`scenario_${key}`) || '{}')
      return data.myAnswer
    }).length
    setCompleted(count)
  }, [])

  const characterEmoji = myCharacter === 'baymax' ? '🤖' : '🐉'

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <header className="text-center mb-16">
        <div className="text-6xl mb-4">{characterEmoji}</div>
        <h1 className="text-5xl font-serif font-bold text-slate-800 mb-2">
          Life Scenarios
        </h1>
        <p className="text-xl text-slate-500 italic">
          How would you handle these situations?
        </p>
      </header>

      {/* Progress Bar */}
      <div className="mb-12 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-end mb-4">
          <span className="text-slate-600 font-bold uppercase tracking-widest text-sm">
            Progress
          </span>
          <span className="text-2xl font-bold text-emerald-600">
            {completed}/{total}
          </span>
        </div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
            style={{ width: `${(completed / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(scenarioData).map(([id, scenario]) => {
          const saved = localStorage.getItem(`scenario_${id}`)
          const isCompleted = saved && JSON.parse(saved).myAnswer

          return (
            <Link key={id} href={`/scenario/${id}`}>
              <div className="blueprint-card group cursor-pointer relative">
                {isCompleted && (
                  <div className="absolute top-4 right-4 text-2xl">✓</div>
                )}
                <div>
                  <h3 className="text-xl font-bold text-slate-700 mb-2">
                    {scenario.name}
                  </h3>
                  <p className="text-sm text-slate-500 line-clamp-2">
                    {scenario.situation}
                  </p>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      <div className="mt-16 text-center">
        <Link href="/results" className="btn-blueprint inline-block">
          View Compatibility Report
        </Link>
      </div>
    </main>
  )
}
