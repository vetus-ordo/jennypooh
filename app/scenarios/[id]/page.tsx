'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { scenarioData } from '@/lib/data'

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E']

export default function ScenarioPage() {
  const { id } = useParams()
  const router = useRouter()
  const scenario = scenarioData[id as string]
  const [myCharacter, setMyCharacter] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const char = localStorage.getItem('myCharacter') || ''
    setMyCharacter(char)
    document.body.setAttribute('data-theme', char)
    const s = localStorage.getItem(`scenario_${id}`)
    if (s) setSelected(JSON.parse(s).myAnswer || null)
  }, [id])

  const handleSave = () => {
    if (selected && !saved) {
      localStorage.setItem(`scenario_${id}`, JSON.stringify({ myAnswer: selected }))
      setSaved(true)
      const msg = myCharacter === 'baymax'
        ? '💙 Scanning complete. Response recorded.'
        : '🐉 *approving tail wag*'
      setToast(msg)
      setTimeout(() => router.push('/scenarios'), 1200)
    }
  }

  if (!scenario) return (
    <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--text-main)' }}>
      Scenario not found.
    </div>
  )

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 left-1/2 z-50 px-6 py-3 rounded-full font-bold text-sm shadow-xl"
            style={{
              transform: 'translateX(-50%)',
              background: 'var(--accent-sage)',
              color: myCharacter === 'toothless' ? '#080C14' : 'white',
            }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.header className="mb-10 text-center" initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-5xl mb-3">{scenario.emoji}</div>
        {myCharacter && (
          <motion.div
            className="inline-block mb-4"
            animate={{ y: [0, -8, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            <Image
              src={`/${myCharacter}.png`}
              alt={myCharacter}
              width={80} height={80}
              className="object-contain drop-shadow-xl"
              priority
            />
          </motion.div>
        )}
        <h1 className="text-3xl md:text-4xl font-bold mb-5" style={{ color: 'var(--text-main)' }}>
          {scenario.name}
        </h1>
        <div
          className="p-6 rounded-2xl text-left"
          style={{ background: 'var(--accent-glow)', borderLeft: '4px solid var(--accent-sage)' }}
        >
          <p className="italic mb-3 text-base" style={{ color: 'var(--text-main)', opacity: 0.8 }}>
            {scenario.situation}
          </p>
          <p className="text-lg font-bold" style={{ color: 'var(--accent-sage)' }}>{scenario.question}</p>
        </div>
      </motion.header>

      <div className="space-y-3 mb-12">
        {scenario.options.map((option, i) => {
          const isSelected = selected === option.id
          return (
            <motion.button
              key={option.id}
              onClick={() => setSelected(option.id)}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.015, x: 4 }}
              whileTap={{ scale: 0.985 }}
              className="w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4"
              style={
                isSelected
                  ? {
                      borderColor: 'var(--accent-sage)',
                      background: 'var(--accent-glow)',
                      boxShadow: `0 0 0 3px var(--accent-glow), var(--card-shadow)`,
                    }
                  : {
                      borderColor: 'var(--border)',
                      background: 'var(--bg-card)',
                    }
              }
            >
              <span
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-200"
                style={
                  isSelected
                    ? {
                        background: 'var(--accent-sage)',
                        color: myCharacter === 'toothless' ? '#080C14' : 'white',
                      }
                    : {
                        background: 'rgba(128,128,128,0.12)',
                        color: 'var(--text-muted)',
                      }
                }
              >
                {OPTION_LETTERS[i]}
              </span>
              <p className="font-medium" style={{ color: 'var(--text-main)' }}>{option.text}</p>
            </motion.button>
          )
        })}
      </div>

      <div className="flex justify-between items-center">
        <Link href="/scenarios" className="font-bold transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
          ← Back
        </Link>
        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl">✅</motion.div>
          ) : (
            <motion.button
              key="save"
              onClick={handleSave}
              disabled={!selected}
              whileHover={selected ? { scale: 1.05 } : {}}
              whileTap={selected ? { scale: 0.95 } : {}}
              className={`btn-blueprint text-base ${!selected ? 'opacity-30 cursor-not-allowed' : ''}`}
            >
              Save Answer
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </main>
  )
}
