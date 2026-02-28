'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
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
  
  // New 3-Phase State
  const [step, setStep] = useState<'mine' | 'guess' | 'stakes'>('mine')
  const [myAnswer, setMyAnswer] = useState<string | null>(null)
  const [guessedAnswer, setGuessedAnswer] = useState<string | null>(null)
  const [importance, setImportance] = useState(3)
  
  const [saved, setSaved] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  useEffect(() => {
    const char = localStorage.getItem('myCharacter') || ''
    setMyCharacter(char)
    document.body.setAttribute('data-theme', char)
    
    // Load existing data if replaying
    const s = localStorage.getItem(`scenario_${id}`)
    if (s) {
      const parsed = JSON.parse(s)
      if (parsed.myAnswer) setMyAnswer(parsed.myAnswer)
      if (parsed.guessedPartnerAnswer) setGuessedAnswer(parsed.guessedPartnerAnswer)
      if (parsed.importance) setImportance(parsed.importance)
    }
  }, [id])

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  }

  // 🚀 SYNC TO CLOUD
  const handleSave = async () => {
    if (myAnswer && !saved) {
      triggerHaptic()
      
      const payload = { 
        myAnswer, 
        guessedPartnerAnswer: guessedAnswer, 
        importance 
      }

      // 1. Save locally for instant UI reaction
      localStorage.setItem(`scenario_${id}`, JSON.stringify(payload))
      setSaved(true)

      const msg = myCharacter === 'baymax'
        ? '💙 Scanning complete. Response recorded.'
        : '🐉 *approving tail wag*'
      setToast(msg)

      // 2. Push to Firestore
      try {
        const roomId = localStorage.getItem('roomId');
        const role = localStorage.getItem('userRole') || 'host';
        
        if (roomId && role) {
          const roomRef = doc(db, "rooms", roomId);
          await updateDoc(roomRef, {
            [`${role}.answers.${id}`]: payload
          });
        }
      } catch (e) {
        console.error("Firebase sync error: ", e);
      }

      // 3. Route back to dashboard
      setTimeout(() => router.push('/scenarios'), 1200)
    }
  }

  if (!scenario) return (
    <div className="min-h-screen flex items-center justify-center" style={{ color: 'var(--text-main)' }}>
      Scenario not found.
    </div>
  )

  const activeGif = myCharacter === 'toothless' ? '/toothless-fly.gif' : '/baymax-dance.gif'

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
        {myCharacter && (
          <motion.div className="inline-block mb-4">
            <Image
              src={activeGif}
              alt={myCharacter}
              width={90} height={90}
              className="object-contain drop-shadow-xl"
              priority
              unoptimized
            />
          </motion.div>
        )}
        <h1 className="text-3xl md:text-4xl font-bold mb-5 flex items-center justify-center gap-3" style={{ color: 'var(--text-main)' }}>
          <span>{scenario.emoji}</span> {scenario.name}
        </h1>
        <div
          className="p-6 rounded-2xl text-left relative overflow-hidden"
          style={{ background: 'var(--accent-glow)', borderLeft: '4px solid var(--accent-sage)' }}
        >
          {/* Progress Indicator for the 3 steps */}
          <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'rgba(128,128,128,0.1)' }}>
            <motion.div 
              className="h-full" style={{ background: 'var(--accent-sage)' }}
              animate={{ width: step === 'mine' ? '33%' : step === 'guess' ? '66%' : '100%' }}
            />
          </div>

          <p className="italic mb-3 text-base mt-2" style={{ color: 'var(--text-main)', opacity: 0.8 }}>
            {scenario.situation}
          </p>
          <p className="text-lg font-bold" style={{ color: 'var(--accent-sage)' }}>
            {step === 'mine' ? scenario.question : step === 'guess' ? "What do you think she will choose?" : "How important is this to you?"}
          </p>
        </div>
      </motion.header>

      <AnimatePresence mode="wait">
        {step === 'mine' && (
          <motion.div key="mine" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3 mb-12">
            {scenario.options.map((option, i) => {
              const isSelected = myAnswer === option.id
              return (
                <motion.button
                  key={option.id}
                  onClick={() => { setMyAnswer(option.id); triggerHaptic(); setTimeout(() => setStep('guess'), 400); }}
                  whileHover={{ scale: 1.015, x: 4 }} whileTap={{ scale: 0.985 }}
                  className="w-full text-left p-5 rounded-2xl border-2 transition-all duration-200 flex items-center gap-4"
                  style={isSelected
                      ? { borderColor: 'var(--accent-sage)', background: 'var(--accent-glow)', boxShadow: `0 0 0 3px var(--accent-glow), var(--card-shadow)` }
                      : { borderColor: 'var(--border)', background: 'var(--bg-card)' }
                  }
                >
                  <span
                    className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all duration-200"
                    style={isSelected
                        ? { background: 'var(--accent-sage)', color: myCharacter === 'toothless' ? '#080C14' : 'white' }
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

        {step === 'guess' && (
          <motion.div key="guess" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3 mb-12">
            {scenario.options.map((option, i) => {
              const isSelected = guessedAnswer === option.id
              return (
                <motion.button
                  key={option.id}
                  onClick={() => { setGuessedAnswer(option.id); triggerHaptic(); setTimeout(() => setStep('stakes'), 400); }}
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
            <input 
              type="range" min="1" max="5" 
              value={importance} 
              onChange={(e) => { setImportance(Number(e.target.value)); triggerHaptic(); }}
              className="w-full h-2 rounded-lg appearance-none cursor-pointer mb-6"
              style={{ background: 'var(--border)' }}
            />
            <div className="flex justify-between text-xs font-bold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>
              <span style={importance <= 2 ? { color: 'var(--text-main)' } : {}}>Meh 🤷‍♂️</span>
              <span style={importance === 3 ? { color: 'var(--text-main)' } : {}}>Important 🤔</span>
              <span style={importance >= 4 ? { color: '#FF6B6B' } : {}}>Dealbreaker 🛑</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex justify-between items-center">
        {step !== 'mine' ? (
          <button onClick={() => setStep(step === 'stakes' ? 'guess' : 'mine')} className="font-bold transition-opacity hover:opacity-70" style={{ color: 'var(--text-muted)' }}>
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
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="btn-blueprint text-base"
            >
              Lock Protocol 🔒
            </motion.button>
          ) : null}
        </AnimatePresence>
      </div>
    </main>
  )
}