'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { scenarioData } from '@/lib/data'

export default function ScenarioPage() {
  const { id } = useParams()
  const router = useRouter()
  const scenario = scenarioData[id as string]
  const [myCharacter, setMyCharacter] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const char = localStorage.getItem('myCharacter') || ''
    setMyCharacter(char)
    document.body.setAttribute('data-theme', char)
    const s = localStorage.getItem(`scenario_${id}`)
    if (s) setSelected(JSON.parse(s).myAnswer || null)
  }, [id])

  const handleSave = () => {
    if (selected) {
      localStorage.setItem(`scenario_${id}`, JSON.stringify({ myAnswer: selected }))
      setSaved(true)
      setTimeout(() => router.push('/scenarios'), 600)
    }
  }

  if (!scenario) return <div className="p-20 text-center">Scenario not found.</div>

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <motion.header className="mb-12 text-center" initial={{ opacity: 0, y: -15 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-5xl mb-2">{scenario.emoji}</div>
        <div className="text-3xl mb-4">{myCharacter === 'baymax' ? '🤖' : '🐉'}</div>
        <h1 className="text-4xl font-serif font-bold mb-4" style={{ color: 'var(--text-main)' }}>{scenario.name}</h1>
        <div className="p-6 rounded-2xl mb-6" style={{ background: 'rgba(0,0,0,0.05)' }}>
          <p className="italic mb-4" style={{ color: 'var(--text-main)', opacity: 0.7 }}>{scenario.situation}</p>
          <p className="text-lg font-semibold" style={{ color: 'var(--text-main)' }}>{scenario.question}</p>
        </div>
      </motion.header>

      <div className="space-y-4 mb-12">
        {scenario.options.map((option, i) => (
          <motion.button key={option.id} onClick={() => setSelected(option.id)}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.07 }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            className="w-full text-left p-6 rounded-2xl border-2 transition-all"
            style={selected === option.id
              ? { borderColor: 'var(--accent-sage)', background: 'rgba(123,158,137,0.1)' }
              : { borderColor: 'rgba(0,0,0,0.1)', background: 'white' }}
          >
            <p className="font-medium" style={{ color: 'var(--text-main)' }}>{option.text}</p>
          </motion.button>
        ))}
      </div>

      <div className="flex justify-between items-center">
        <Link href="/scenarios" className="font-bold" style={{ color: 'var(--text-main)', opacity: 0.4 }}>← Back</Link>
        <AnimatePresence mode="wait">
          {saved
            ? <motion.div key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-2xl">✅</motion.div>
            : <motion.button key="save" onClick={handleSave} disabled={!selected}
                whileHover={selected ? { scale: 1.05 } : {}} whileTap={selected ? { scale: 0.95 } : {}}
                className={`btn-blueprint ${!selected ? 'opacity-40 cursor-not-allowed' : ''}`}>
                Save Answer
              </motion.button>
          }
        </AnimatePresence>
      </div>
    </main>
  )
}
