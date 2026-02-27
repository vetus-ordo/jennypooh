'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { characters } from '@/lib/data'

export default function Home() {
  const router = useRouter()
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [partnerName, setPartnerName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [step, setStep] = useState<'character' | 'name'>('character')

  useEffect(() => {
    const saved = localStorage.getItem('myCharacter')
    if (saved) { router.push('/scenarios') } else { setIsLoading(false) }
  }, [router])

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }} className="text-5xl">🤖</motion.div>
    </div>
  )

  const handleContinue = () => {
    if (selectedCharacter) {
      localStorage.setItem('myCharacter', selectedCharacter)
      if (partnerName.trim()) localStorage.setItem('partnerName', partnerName.trim())
      document.body.setAttribute('data-theme', selectedCharacter)
      router.push('/scenarios')
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-16">
      <motion.header className="text-center mb-16" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-5xl font-serif font-bold mb-4" style={{ color: 'var(--text-main)' }}>Choose Your Companion</h1>
        <p className="text-xl italic" style={{ color: 'var(--text-main)', opacity: 0.6 }}>Pick your character for this adventure</p>
      </motion.header>

      <AnimatePresence mode="wait">
        {step === 'character' && (
          <motion.div key="char" initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 30 }} className="w-full max-w-4xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {(['baymax', 'toothless'] as const).map(id => (
                <motion.button key={id} onClick={() => setSelectedCharacter(id)}
                  whileHover={{ scale: 1.04, y: -6 }} whileTap={{ scale: 0.97 }}
                  className={`blueprint-card text-left ${selectedCharacter === id ? id === 'baymax' ? 'ring-4 ring-blue-400' : 'ring-4 ring-purple-400' : ''}`}
                >
                  <div className="text-center mb-6">
                    <motion.div className="text-8xl mb-4"
                      animate={selectedCharacter === id ? id === 'baymax' ? { scale: [1,1.2,1] } : { rotate: [0,-10,10,-5,0] } : {}}
                      transition={{ duration: 0.5 }}
                    >
                      {id === 'baymax' ? '🤖' : '🐉'}
                    </motion.div>
                    <h2 className="text-3xl font-bold" style={{ color: 'var(--text-main)' }}>{characters[id].name}</h2>
                    <p className="italic mt-2" style={{ color: 'var(--text-main)', opacity: 0.55 }}>
                      {id === 'baymax' ? 'Healthcare companion mode' : 'Night Fury ready for adventure'}
                    </p>
                  </div>
                </motion.button>
              ))}
            </div>
            <AnimatePresence>
              {selectedCharacter && (
                <motion.div className="text-center" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                  <button onClick={() => setStep('name')} className="btn-blueprint text-lg px-12 py-4">
                    Continue with {characters[selectedCharacter].name} →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {step === 'name' && (
          <motion.div key="name" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} className="w-full max-w-md text-center">
            <div className="text-6xl mb-6">{selectedCharacter === 'baymax' ? '🤖' : '🐉'}</div>
            <h2 className="text-3xl font-serif font-bold mb-3" style={{ color: 'var(--text-main)' }}>One more thing...</h2>
            <p className="mb-8 italic" style={{ color: 'var(--text-main)', opacity: 0.6 }}>What should we call your partner on the results page?</p>
            <input type="text" value={partnerName} onChange={e => setPartnerName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleContinue()}
              placeholder="Partner's name..."
              className="w-full text-center text-xl px-6 py-4 rounded-2xl border-2 border-slate-200 focus:outline-none focus:border-blue-400 mb-6"
              style={{ background: 'rgba(255,255,255,0.8)', color: '#2F353B' }} autoFocus
            />
            <div className="flex gap-4 justify-center">
              <button onClick={() => setStep('character')} className="px-6 py-3 rounded-full font-bold border-2 hover:scale-105 transition-all"
                style={{ borderColor: 'var(--accent-sage)', color: 'var(--accent-sage)' }}>← Back</button>
              <button onClick={handleContinue} className="btn-blueprint text-lg px-10 py-3">
                {partnerName.trim() ? "Let's go! 🚀" : 'Skip & Start'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
