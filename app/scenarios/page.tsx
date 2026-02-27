'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { scenarioData } from '@/lib/data'

export default function Scenarios() {
  const [completed, setCompleted] = useState(0)
  const [myCharacter, setMyCharacter] = useState('')
  const [shuffled, setShuffled] = useState<string[]>([])
  const total = Object.keys(scenarioData).length

  useEffect(() => {
    const char = localStorage.getItem('myCharacter') || ''
    setMyCharacter(char)
    document.body.setAttribute('data-theme', char)
    setCompleted(Object.keys(scenarioData).filter(k => JSON.parse(localStorage.getItem(`scenario_${k}`) || '{}').myAnswer).length)
    setShuffled(Object.keys(scenarioData))
  }, [])

  const handleShuffle = () => {
    const keys = [...Object.keys(scenarioData)]
    for (let i = keys.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [keys[i], keys[j]] = [keys[j], keys[i]]
    }
    setShuffled(keys)
  }

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <motion.header className="text-center mb-16" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-6xl mb-4">{myCharacter === 'baymax' ? '🤖' : '🐉'}</div>
        <h1 className="text-5xl font-serif font-bold mb-2" style={{ color: 'var(--text-main)' }}>Life Scenarios</h1>
        <p className="text-xl italic" style={{ color: 'var(--text-main)', opacity: 0.6 }}>How would you handle these situations?</p>
      </motion.header>

      <motion.div className="mb-12 blueprint-card" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
        <div className="flex justify-between items-end mb-4">
          <span className="font-bold uppercase tracking-widest text-sm" style={{ color: 'var(--text-main)', opacity: 0.5 }}>Progress</span>
          <span className="text-2xl font-bold" style={{ color: 'var(--accent-sage)' }}>{completed}/{total}</span>
        </div>
        <div className="h-4 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.08)' }}>
          <motion.div className="h-full rounded-full" style={{ background: 'var(--accent-sage)' }}
            initial={{ width: 0 }} animate={{ width: `${(completed / total) * 100}%` }}
            transition={{ duration: 1, ease: 'easeOut' }} />
        </div>
      </motion.div>

      <div className="flex justify-end mb-4">
        <button onClick={handleShuffle} className="text-sm font-bold px-4 py-2 rounded-full border-2 transition-all hover:scale-105"
          style={{ borderColor: 'var(--accent-sage)', color: 'var(--accent-sage)' }}>
          🔀 Shuffle Order
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {shuffled.map((id, i) => {
          const scenario = scenarioData[id]
          if (!scenario) return null
          const isCompleted = typeof window !== 'undefined' && JSON.parse(localStorage.getItem(`scenario_${id}`) || '{}').myAnswer
          return (
            <motion.div key={id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Link href={`/scenarios/${id}`}>
                <div className="blueprint-card cursor-pointer relative">
                  {isCompleted && (
                    <div className="absolute top-4 right-4">
                      <svg width="28" height="28" viewBox="0 0 28 28" className="check-svg">
                        <circle cx="14" cy="14" r="13" fill="none" stroke="var(--accent-sage)" strokeWidth="2"/>
                        <path d="M8 14l4 4 8-8" fill="none" stroke="var(--accent-sage)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  )}
                  <div className="flex items-start gap-3">
                    <span className="text-3xl mt-1">{scenario.emoji}</span>
                    <div>
                      <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>{scenario.name}</h3>
                      <p className="text-sm line-clamp-2" style={{ color: 'var(--text-main)', opacity: 0.55 }}>{scenario.situation}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          )
        })}
      </div>

      <motion.div className="mt-16 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <Link href="/results" className="btn-blueprint inline-block text-lg px-10 py-4">View Compatibility Report 💌</Link>
      </motion.div>
    </main>
  )
}
