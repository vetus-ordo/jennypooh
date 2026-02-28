'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { characters } from '@/lib/data'

export default function Home() {
  const router = useRouter()
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [partnerName, setPartnerName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [step, setStep] = useState<'character' | 'name'>('character')
  const [hoveredChar, setHoveredChar] = useState<string | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem('myCharacter')
    if (saved) { router.push('/scenarios') } else { setIsLoading(false) }
  }, [router])

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-warm)' }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
      >
        <Image src="/baymax.png" alt="Loading" width={80} height={80} className="object-contain drop-shadow-xl" />
      </motion.div>
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

  const charMeta = {
    baymax: {
      tagline: 'Your personal healthcare companion',
      sub: 'Warm, precise, and always here for you',
      bg: 'linear-gradient(160deg, #EFF6FF 0%, #DBEAFE 60%, #BFDBFE 100%)',
      glow: 'rgba(58,133,200,0.22)',
      ring: 'rgba(58,133,200,0.5)',
      textColor: '#0D1B2A',
      imgSize: 200,
    },
    toothless: {
      tagline: 'Night Fury. Last of his kind.',
      sub: 'Fast, fierce, and fiercely loyal',
      bg: 'linear-gradient(160deg, #080C14 0%, #0D1B2E 60%, #101828 100%)',
      glow: 'rgba(0,229,200,0.18)',
      ring: 'rgba(0,229,200,0.6)',
      textColor: '#E8F4FD',
      imgSize: 220,
    },
  } as const

  const partnerCharacter = selectedCharacter === 'baymax' ? 'toothless' : 'baymax'

  return (
    <main className="min-h-screen flex flex-col" style={{ background: 'var(--bg-warm)' }}>
      <AnimatePresence mode="wait">

        {step === 'character' && (
          <motion.div
            key="char"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }}
            className="flex flex-col min-h-screen"
          >
            <div className="text-center pt-14 pb-6 px-6">
              <motion.h1
                initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-3"
                style={{ color: 'var(--text-main)', fontFamily: 'var(--font-nunito)' }}
              >
                Choose Your Companion
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-lg italic" style={{ color: 'var(--text-main)', opacity: 0.5 }}
              >
                Who guides your journey?
              </motion.p>
            </div>

            <div className="flex flex-col md:flex-row flex-1">
              {(['baymax', 'toothless'] as const).map((id, idx) => {
                const meta = charMeta[id]
                const isSelected = selectedCharacter === id
                const isHovered = hoveredChar === id
                return (
                  <motion.button
                    key={id}
                    onClick={() => setSelectedCharacter(id)}
                    onHoverStart={() => setHoveredChar(id)}
                    onHoverEnd={() => setHoveredChar(null)}
                    initial={{ opacity: 0, x: idx === 0 ? -40 : 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + idx * 0.1 }}
                    className="relative flex-1 flex flex-col items-center justify-center p-12 md:p-16 overflow-hidden"
                    style={{
                      background: meta.bg,
                      minHeight: '320px',
                      outline: isSelected ? `3px solid ${meta.ring}` : '3px solid transparent',
                      outlineOffset: '-3px',
                      transition: 'outline 0.2s ease',
                    }}
                  >
                    {/* Glow orb */}
                    <motion.div
                      className="absolute rounded-full blur-3xl"
                      style={{
                        width: '340px', height: '340px',
                        background: meta.glow,
                        top: '50%', left: '50%',
                        transform: 'translate(-50%,-50%)',
                      }}
                      animate={{ scale: isHovered || isSelected ? 1.3 : 1, opacity: isHovered || isSelected ? 1 : 0.6 }}
                      transition={{ duration: 0.6 }}
                    />

                    {/* Character image */}
                    <motion.div
                      className="relative z-10 mb-6"
                      animate={{
                        y: isSelected ? [0, -18, 0] : isHovered ? -8 : 0,
                        scale: isSelected ? 1.1 : isHovered ? 1.05 : 1,
                      }}
                      transition={{
                        y: isSelected
                          ? { repeat: Infinity, duration: 2, ease: 'easeInOut' }
                          : { duration: 0.3 },
                        scale: { duration: 0.3 },
                      }}
                    >
                      <Image
                        src={`/${id}.png`}
                        alt={id === 'baymax' ? 'Baymax' : 'Toothless'}
                        width={meta.imgSize}
                        height={meta.imgSize}
                        className="object-contain drop-shadow-2xl"
                        priority
                      />
                    </motion.div>

                    <div className="relative z-10 text-center">
                      <h2
                        className="text-3xl md:text-4xl font-bold mb-2"
                        style={{
                          color: meta.textColor,
                          fontFamily: id === 'toothless' ? 'var(--font-cinzel),serif' : 'var(--font-nunito),sans-serif',
                        }}
                      >
                        {characters[id].name}
                      </h2>
                      <p className="text-base font-semibold mb-1" style={{ color: meta.textColor, opacity: 0.8 }}>
                        {meta.tagline}
                      </p>
                      <p className="text-sm italic" style={{ color: meta.textColor, opacity: 0.5 }}>
                        {meta.sub}
                      </p>
                    </div>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                          className="absolute top-5 right-5 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg z-10"
                          style={{ background: meta.ring }}
                        >
                          ✓
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.button>
                )
              })}
            </div>

            <AnimatePresence>
              {selectedCharacter && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-center py-10 px-6" style={{ background: 'var(--bg-warm)' }}
                >
                  <button onClick={() => setStep('name')} className="btn-blueprint text-xl px-14 py-4">
                    Continue with {characters[selectedCharacter].name} →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {step === 'name' && selectedCharacter && (
          <motion.div
            key="name"
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-16"
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="text-center mb-10"
            >
              <h2 className="text-4xl font-bold mb-3" style={{ color: 'var(--text-main)' }}>One more thing...</h2>
              <p className="text-lg italic" style={{ color: 'var(--text-muted)' }}>What should we call your partner?</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
              className="grid grid-cols-2 gap-6 w-full max-w-sm mb-8"
            >
              <div className="blueprint-card text-center py-6 flex flex-col items-center gap-2">
                <Image
                  src={`/${selectedCharacter}.png`}
                  alt={selectedCharacter}
                  width={72} height={72}
                  className="object-contain drop-shadow-lg"
                />
                <p className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>You</p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {selectedCharacter === 'baymax' ? 'Baymax' : 'Toothless'}
                </p>
              </div>
              <div className="blueprint-card text-center py-6 flex flex-col items-center gap-2">
                <Image
                  src={`/${partnerCharacter}.png`}
                  alt="Partner"
                  width={72} height={72}
                  className="object-contain drop-shadow-lg"
                />
                <p className="font-bold text-sm" style={{ color: 'var(--text-main)' }}>
                  {partnerName.trim() || 'Partner'}
                </p>
                <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                  {selectedCharacter === 'baymax' ? 'Toothless' : 'Baymax'}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="w-full max-w-sm"
            >
              <input
                type="text"
                value={partnerName}
                onChange={e => setPartnerName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleContinue()}
                placeholder="Partner's name..."
                className="w-full text-center text-xl px-6 py-4 rounded-2xl border-2 focus:outline-none mb-6 transition-all"
                style={{
                  background: 'var(--bg-card)',
                  color: 'var(--text-main)',
                  borderColor: 'var(--border)',
                  boxShadow: 'var(--card-shadow)',
                }}
                autoFocus
              />
              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setStep('character')}
                  className="px-6 py-3 rounded-full font-bold border-2 hover:scale-105 transition-all"
                  style={{ borderColor: 'var(--accent-sage)', color: 'var(--accent-sage)' }}
                >
                  ← Back
                </button>
                <button onClick={handleContinue} className="btn-blueprint text-lg px-10 py-3">
                  {partnerName.trim() ? "Let's go! 🚀" : 'Skip & Start'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  )
}
