'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { characters } from '@/lib/data'

export default function Home() {
  const router = useRouter()
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [partnerName, setPartnerName] = useState('Jenny')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [step, setStep] = useState<'character' | 'name' | 'invite'>('character')
  const [hoveredChar, setHoveredChar] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const savedRoom = localStorage.getItem('roomId')
    if (savedRoom) { 
      router.push(`/scenarios`) 
    } else { 
      setIsLoading(false) 
    }
  }, [router])

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
  }

  const handleCreateRoom = async () => {
    if (!selectedCharacter) return
    setIsCreatingRoom(true)
    triggerHaptic()

    const newRoomId = Math.random().toString(36).substring(2, 10)
    
    try {
      localStorage.setItem('myCharacter', selectedCharacter)
      localStorage.setItem('partnerName', partnerName.trim())
      localStorage.setItem('roomId', newRoomId)
      
      setTimeout(() => {
        setRoomId(newRoomId)
        setStep('invite')
        setIsCreatingRoom(false)
      }, 1500)

    } catch (error) {
      console.error("Failed to create room:", error)
      setIsCreatingRoom(false)
    }
  }

  const copyInviteLink = () => {
    triggerHaptic()
    const url = `${window.location.origin}/join/${roomId}`
    navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#080B10]">
      <div className="w-32 h-32 rounded-full overflow-hidden border border-[#3A85C8]/30 shadow-[0_0_30px_rgba(58,133,200,0.2)] mb-6">
        <video src="/baymax-coffee.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover opacity-90" />
      </div>
    </div>
  )

  const partnerCharacter = selectedCharacter === 'baymax' ? 'toothless' : 'baymax'

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500">
      <AnimatePresence mode="wait">

        {step === 'character' && (
          <motion.div
            key="char"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.97 }}
            className="flex flex-col min-h-screen relative z-10"
          >
            <div className="text-center pt-14 pb-6 px-6">
              <motion.h1
                initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                className="text-4xl md:text-5xl font-bold mb-3 text-white"
              >
                Choose Your Companion
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-lg italic text-[#8B9BB4]"
              >
                Who guides your journey?
              </motion.p>
            </div>

            <div className="flex flex-col md:flex-row flex-1 gap-4 p-6 max-w-6xl mx-auto w-full">
              {(['baymax', 'toothless'] as const).map((id, idx) => {
                const isSelected = selectedCharacter === id
                const isHovered = hoveredChar === id
                const activeGif = id === 'baymax' ? '/baymax.gif' : '/toothless-fly.gif'
                
                return (
                  <motion.button
                    key={id}
                    onClick={() => { setSelectedCharacter(id); document.body.setAttribute('data-theme', id); triggerHaptic(); }}
                    onHoverStart={() => setHoveredChar(id)}
                    onHoverEnd={() => setHoveredChar(null)}
                    initial={{ opacity: 0, x: idx === 0 ? -40 : 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + idx * 0.1 }}
                    className={`relative flex-1 flex flex-col items-center justify-center p-12 md:p-16 overflow-hidden glass-card cursor-pointer group ${isSelected ? 'ring-2 ring-offset-2 ring-offset-[#080B10]' : ''}`}
                    style={isSelected ? { borderColor: id === 'toothless' ? '#00E5C8' : '#3A85C8' } : {}}
                  >
                    <motion.div
                      className="relative z-10 mb-6"
                      animate={{
                        y: isSelected ? [0, -12, 0] : isHovered ? -8 : 0,
                        scale: isSelected ? 1.1 : isHovered ? 1.05 : 1,
                      }}
                      transition={{
                        y: isSelected ? { repeat: Infinity, duration: 3, ease: 'easeInOut' } : { duration: 0.3 },
                        scale: { duration: 0.3 },
                      }}
                    >
                      <Image
                        src={activeGif}
                        alt={characters[id].name}
                        width={200} height={200}
                        className="object-contain drop-shadow-2xl"
                        priority
                        unoptimized
                      />
                    </motion.div>

                    <div className="relative z-10 text-center">
                      <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
                        {characters[id].name}
                      </h2>
                      <p className="text-base font-semibold mb-1 text-white/80">
                        {id === 'baymax' ? 'Your personal healthcare companion' : 'Night Fury. Last of his kind.'}
                      </p>
                    </div>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                          className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg z-10 shadow-lg ${id === 'baymax' ? 'bg-[#3A85C8]' : 'bg-[#00E5C8] text-[#080B10]'}`}
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
                  className="text-center pb-12 pt-6 px-6 relative z-10"
                >
                  <button onClick={() => setStep('name')} className="btn-primary text-xl px-14 py-4">
                    Initialize {characters[selectedCharacter].name} Protocol →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* STEP 2: NAME ENTRY */}
        {step === 'name' && selectedCharacter && (
          <motion.div
            key="name"
            initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative z-10"
          >
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
              <h2 className="text-4xl font-bold mb-3 text-white">Target Designation</h2>
              <p className="text-lg italic text-[#8B9BB4]">Who are we routing this connection to?</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 w-full max-w-sm mb-8 text-center">
              <div className="flex justify-center items-center gap-6 mb-8">
                 <div className="flex flex-col items-center">
                    <div className="w-16 h-16 flex items-center justify-center mb-2">
                      <Image src={selectedCharacter === 'baymax' ? '/baymax-wave.png' : '/toothless.png'} alt="You" width={64} height={64} className="object-contain drop-shadow-lg" />
                    </div>
                    <span className="text-xs text-[#8B9BB4] font-bold uppercase">Host</span>
                 </div>
                 <div className="text-[#8B9BB4] text-2xl">↔</div>
                 <div className="flex flex-col items-center">
                    <div className="w-16 h-16 flex items-center justify-center mb-2 opacity-70">
                      {partnerCharacter === 'baymax' ? (
                        <Image src="/baymax.png" alt="Partner" width={64} height={64} className="object-contain drop-shadow-lg" />
                      ) : (
                        <video src="/toothless-courtship.mp4" autoPlay loop muted playsInline className="w-full h-full object-contain drop-shadow-lg" />
                      )}
                    </div>
                    <span className="text-xs text-[#8B9BB4] font-bold uppercase">Client</span>
                 </div>
              </div>

              <input
                type="text"
                value={partnerName}
                onChange={e => setPartnerName(e.target.value)}
                placeholder="Her name..."
                className="w-full text-center text-2xl px-6 py-4 rounded-2xl bg-white/5 border border-white/20 text-white focus:outline-none focus:border-white/50 mb-8 transition-all"
                autoFocus
              />

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => setStep('character')}
                  className="px-6 py-3 rounded-full font-bold text-[#8B9BB4] hover:text-white transition-colors"
                >
                  ← Back
                </button>
                <button onClick={handleCreateRoom} disabled={isCreatingRoom || !partnerName.trim()} className="btn-primary px-8 py-3 w-full flex items-center justify-center">
                  {isCreatingRoom ? (
                    <span className="animate-pulse">Establishing Link...</span>
                  ) : (
                    "Generate Secure Room 🚀"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* STEP 3: INVITE LINK GENERATION */}
        {step === 'invite' && roomId && (
          <motion.div
            key="invite"
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative z-10"
          >
            <motion.div className="glass-card p-10 w-full max-w-lg text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#00E5C8]/20 rounded-full blur-3xl -mr-10 -mt-10" />
              
              <div className="text-5xl mb-6">📡</div>
              <h2 className="text-3xl font-bold mb-2 text-white">Connection Established</h2>
              <p className="text-[#8B9BB4] mb-8">
                Routing secure tunnel to Santa Clara. Send this encrypted link to {partnerName}.
              </p>

              <div 
                onClick={copyInviteLink}
                className="bg-black/40 border border-white/10 rounded-xl p-4 flex items-center justify-between cursor-pointer hover:border-white/30 transition-all mb-8 group"
              >
                <code className="text-[#00E5C8] font-mono text-sm sm:text-base truncate mr-4">
                  jennypooh.app/join/{roomId}
                </code>
                <div className="bg-white/10 p-2 rounded-lg group-hover:bg-white/20 transition-all">
                  {copied ? '✅' : '📋'}
                </div>
              </div>

              <p className="text-xs text-[#8B9BB4] italic mb-8">
                {copied ? "Copied to clipboard! Text it over." : "Tap the link to copy."}
              </p>

              <button onClick={() => router.push('/scenarios')} className="btn-primary w-full py-4 text-lg">
                Enter Diagnostic Bay →
              </button>
            </motion.div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  )
}