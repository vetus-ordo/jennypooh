'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { scenarioData } from '@/lib/data'

// 🚀 FIREBASE IMPORTS
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'

const OPTION_LETTERS = ['A', 'B', 'C', 'D', 'E']

export default function ScenarioPage() {
  const { id } = useParams()
  const router = useRouter()
  const scenario = scenarioData[id as string]
  const [myCharacter, setMyCharacter] = useState('')

  // 3-Phase State
  const [step, setStep] = useState<'mine' | 'guess' | 'stakes'>('mine')
  const [myAnswer, setMyAnswer] = useState<string | null>(null)
  const [mySecondChoice, setMySecondChoice] = useState<string | null>(null)
  const [guessedAnswer, setGuessedAnswer] = useState<string | null>(null)
  const [importance, setImportance] = useState(3)

  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const char = localStorage.getItem('myCharacter') || ''
    setMyCharacter(char)
    // Always dual — both characters share every page from here on
    document.body.setAttribute('data-theme', 'dual')

    // Load existing data if replaying
    const s = localStorage.getItem(`scenario_${id}`)
    if (s) {
      const parsed = JSON.parse(s)
      if (parsed.myAnswer) setMyAnswer(parsed.myAnswer)
      if (parsed.mySecondChoice) setMySecondChoice(parsed.mySecondChoice)
      if (parsed.guessedPartnerAnswer) setGuessedAnswer(parsed.guessedPartnerAnswer)
      if (parsed.importance) setImportance(parsed.importance)
    }
  }, [id])

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50)
    }
  }

  // 🚀 SYNC TO CLOUD
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (myAnswer && !saved && !saving) {
      triggerHaptic()
      setSaving(true)

      const payload = {
        myAnswer,
        mySecondChoice: mySecondChoice || null,
        guessedPartnerAnswer: guessedAnswer,
        importance,
      }

      // 1. Save locally for instant UI reaction
      localStorage.setItem(`scenario_${id}`, JSON.stringify(payload))

      // 2. Push to Firestore — wait for it to complete
      try {
        const roomId = localStorage.getItem('roomId')
        const role = localStorage.getItem('userRole') || 'host'
        if (roomId && role) {
          const roomRef = doc(db, 'rooms', roomId)
          await updateDoc(roomRef, {
            [`${role}.answers.${id}`]: payload,
          })
        }

        setSaved(true)
        const msg = myCharacter === 'baymax'
          ? '💙 Scanning complete. Response recorded.'
          : '🐉 *approving tail wag*'
        setToast(msg)

        // 3. Route back to dashboard only after Firebase succeeds
        setTimeout(() => router.push('/scenarios'), 1200)
      } catch (e) {
        console.error('Firebase sync error: ', e)
        setSaving(false)
        setToast('⚠️ Sync failed — tap Lock to retry')
        setTimeout(() => setToast(null), 3000)
      }
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
        <h1 className="text-3xl md:text-4xl font-bold mb-5 flex items-center justify-center gap-3" style={{ color: 'var(--text-main)' }}>
          <span>{scenario.emoji}</span> {scenario.name}
        </h1>
        <div
          className="p-6 rounded-2xl text-left relative overflow-hidden"
          style={{ background: 'var(--accent-glow)', borderLeft: '4px solid var(--accent-sage)' }}
        >
          {/* 3-step progress bar */}
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'rgba(128,128,128,0.1)' }}>
            <motion.div
              className="h-full"
              style={{ background: 'var(--accent-sage)' }}
              animate={{ width: step === 'mine' ? '33%' : step === 'guess' ? '66%' : '100%' }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>

          <p className="italic mb-3 text-base mt-2" style={{ color: 'var(--text-main)', opacity: 0.8 }}>
            {scenario.situation}
          </p>
          <p className="text-lg font-bold" style={{ color: 'var(--accent-sage)' }}>
            {step === 'mine'
              ? scenario.question
              : step === 'guess'
              ? 'What do you think her top choice will be?'
              : 'How important is this to you?'}
          </p>
        </div>
      </motion.header>

      <AnimatePresence mode="wait">
        {step === 'mine' && (
          <motion.div key="mine" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3 mb-12">
            <p className="text-xs uppercase font-bold tracking-widest text-center mb-4" style={{ color: 'var(--text-muted)' }}>
              {!myAnswer ? 'Pick your top choice' : !mySecondChoice ? 'Now pick a backup' : 'Tap to change'}
            </p>
            {scenario.options.map((option, i) => {
              const isFirst = myAnswer === option.id
              const isSecond = mySecondChoice === option.id
              const handlePick = () => {
                triggerHaptic()
                if (isFirst) {
                  // Deselect 1st → clear both
                  setMyAnswer(null)
                  setMySecondChoice(null)
                } else if (isSecond) {
                  // Deselect 2nd only
                  setMySecondChoice(null)
                } else if (!myAnswer) {
                  // Nothing selected yet → becomes 1st
                  setMyAnswer(option.id)
                } else {
                  // 1st exists, pick 2nd → auto-advance
                  setMySecondChoice(option.id)
                  setTimeout(() => setStep('guess'), 500)
                }
              }
              return (
                <motion.button
                  key={option.id}
                  onClick={handlePick}
                  whileHover={{ scale: 1.015, x: 4 }} whileTap={{ scale: 0.985 }}
                  className="w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4"
                  style={isFirst
                    ? { borderColor: 'var(--accent-sage)', background: 'var(--accent-glow)', boxShadow: `0 0 0 3px var(--accent-glow), var(--card-shadow)` }
                    : isSecond
                    ? { borderColor: 'rgba(182, 138, 255, 0.6)', background: 'rgba(182, 138, 255, 0.1)', boxShadow: `0 0 0 2px rgba(182, 138, 255, 0.15)` }
                    : { borderColor: 'var(--border)', background: 'var(--bg-card)' }
                  }
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-200 relative"
                    style={isFirst
                      ? { background: 'var(--accent-sage)', color: myCharacter === 'toothless' ? '#080C14' : 'white' }
                      : isSecond
                      ? { background: 'rgba(182, 138, 255, 0.7)', color: '#fff' }
                      : { background: 'rgba(128,128,128,0.12)', color: 'var(--text-muted)' }
                    }
                  >
                    {OPTION_LETTERS[i]}
                  </span>
                  <p className="font-medium flex-1" style={{ color: 'var(--text-main)' }}>{option.text}</p>
                  {isFirst && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'var(--accent-sage)', color: myCharacter === 'toothless' ? '#080C14' : 'white' }}>1st</span>}
                  {isSecond && <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(182, 138, 255, 0.7)', color: '#fff' }}>2nd</span>}
                </motion.button>
              )
            })}
          </motion.div>
        )}

        {step === 'guess' && (
          <motion.div key="guess" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3 mb-12">
            {scenario.options.map((option, i) => {
              const isSelected = guessedAnswer === option.id
              return (
                <motion.button
                  key={option.id}
                  onClick={() => { setGuessedAnswer(option.id); triggerHaptic(); setTimeout(() => setStep('stakes'), 400) }}
                  whileHover={{ scale: 1.015, x: 4 }} whileTap={{ scale: 0.985 }}
                  className="w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4"
                  style={isSelected
                    ? { borderColor: '#B68AFF', background: 'rgba(182, 138, 255, 0.15)', boxShadow: `0 0 0 3px rgba(182, 138, 255, 0.15), var(--card-shadow)` }
                    : { borderColor: 'var(--border)', background: 'var(--bg-card)' }
                  }
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-200"
                    style={isSelected
                      ? { background: '#B68AFF', color: '#080C14' }
                      : { background: 'rgba(128,128,128,0.12)', color: 'var(--text-muted)' }
                    }
                  >
                    {OPTION_LETTERS[i]}
                  </span>
                  <p className="font-medium" style={{ color: 'var(--text-main)' }}>{option.text}</p>
                </motion.button>
              )
            })}
          </motion.div>
        )}

        {step === 'stakes' && (
          <motion.div key="stakes" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-12 text-center py-6">
            {/* Dot selector */}
            <div className="flex justify-center gap-4 mb-6">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  onClick={() => { setImportance(level); triggerHaptic() }}
                  className="flex flex-col items-center gap-2 transition-all duration-200"
                >
                  <motion.div
                    animate={{
                      scale: importance === level ? 1.3 : 1,
                      opacity: importance >= level ? 1 : 0.3,
                    }}
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors duration-200"
                    style={{
                      background: importance === level
                        ? (level >= 4 ? '#FF6B6B' : 'var(--accent-sage)')
                        : importance >= level
                        ? (level >= 4 ? 'rgba(255, 107, 107, 0.4)' : 'rgba(138, 188, 139, 0.4)')
                        : 'rgba(128,128,128,0.15)',
                      color: importance >= level ? '#fff' : 'var(--text-muted)',
                      boxShadow: importance === level ? `0 0 12px ${level >= 4 ? 'rgba(255, 107, 107, 0.5)' : 'rgba(138, 188, 139, 0.5)'}` : 'none',
                    }}
                  >
                    {level}
                  </motion.div>
                </button>
              ))}
            </div>
            {/* Label */}
            <motion.p
              key={importance}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm font-bold uppercase tracking-wider"
              style={{ color: importance >= 4 ? '#FF6B6B' : importance >= 3 ? 'var(--text-main)' : 'var(--text-muted)' }}
            >
              {importance <= 1 ? 'Not a big deal 🤷‍♂️'
                : importance === 2 ? 'Slightly matters 🤷‍♂️'
                : importance === 3 ? 'Important 🤔'
                : importance === 4 ? 'Very important 🔥'
                : 'Dealbreaker 🛑'}
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        {step !== 'mine' ? (
          <button
            onClick={() => setStep(step === 'stakes' ? 'guess' : 'mine')}
            className="font-bold transition-opacity hover:opacity-70"
            style={{ color: 'var(--text-muted)' }}
          >
            ← Back
          </button>
        ) : (
          <Link href="/scenarios" className="font-bold transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
            ← Exit
          </Link>
        )}

        <AnimatePresence mode="wait">
          {saved ? (
            <motion.div key="saved" initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-3xl">✅</motion.div>
          ) : step === 'stakes' ? (
            <motion.button
              key="save"
              onClick={handleSave}
              disabled={saving}
              whileHover={{ scale: saving ? 1 : 1.05 }}
              whileTap={{ scale: saving ? 1 : 0.95 }}
              className="btn-blueprint text-base"
            >
              {saving ? 'Syncing...' : 'Lock Protocol 🔒'}
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  )
}
