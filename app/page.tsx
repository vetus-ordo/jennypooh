'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { characters } from '@/lib/data'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import CharacterDisplay from '@/components/CharacterDisplay'

export default function Home() {
  const router = useRouter()
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(null)
  const [myName, setMyName] = useState('Andrew')
  const [partnerName, setPartnerName] = useState('Jenny')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreatingRoom, setIsCreatingRoom] = useState(false)
  const [roomId, setRoomId] = useState<string | null>(null)
  const [step, setStep] = useState<'character' | 'name' | 'invite'>('character')
  const [inviteOrigin, setInviteOrigin] = useState('')
  const [copied, setCopied] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    // Always use dual theme — both characters are always present throughout
    document.body.setAttribute('data-theme', 'dual')
    const savedRoom = localStorage.getItem('roomId')
    if (savedRoom) {
      router.push('/scenarios')
    } else {
      setIsLoading(false)
    }
  }, [router])

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator?.vibrate) {
      window.navigator.vibrate(50)
    }
  }

  const handleCreateRoom = async () => {
    if (!selectedCharacter) return
    setIsCreatingRoom(true)
    setErrorMsg(null)
    triggerHaptic()

    const newRoomId = Math.random().toString(36).substring(2, 10)
    const partnerCharacter = selectedCharacter === 'baymax' ? 'toothless' : 'baymax'
    const resolvedMyName = myName.trim() || 'Andrew'
    const resolvedPartnerName = partnerName.trim() || 'Jenny'

    try {
      await setDoc(doc(db, 'rooms', newRoomId), {
        createdAt: Date.now(),
        status: 'waiting',
        host: { name: resolvedMyName, character: selectedCharacter, answers: {} },
        client: { name: resolvedPartnerName, character: partnerCharacter, answers: {} },
      })

      localStorage.setItem('myCharacter', selectedCharacter)
      localStorage.setItem('myName', resolvedMyName)
      localStorage.setItem('partnerName', resolvedPartnerName)
      localStorage.setItem('roomId', newRoomId)
      localStorage.setItem('userRole', 'host')

      // Capture origin client-side for safe display in invite step
      setInviteOrigin(window.location.origin)

      setTimeout(() => {
        setRoomId(newRoomId)
        setStep('invite')
        setIsCreatingRoom(false)
      }, 1200)
    } catch (error: unknown) {
      console.error('Failed to create room:', error)
      setErrorMsg('Database Connection Failed. Ensure .env.local is configured properly.')
      setIsCreatingRoom(false)
    }
  }

  const copyInviteLink = () => {
    triggerHaptic()
    navigator.clipboard.writeText(`${window.location.origin}/join/${roomId}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const partnerCharacter = selectedCharacter === 'baymax' ? 'toothless' : 'baymax'

  // ── Phase 1: Dual loading screen — lightweight static PNGs, no video on first paint ──
  if (isLoading) return (
    <div
      className="min-h-screen flex flex-col items-center justify-center gap-8"
      style={{ backgroundColor: 'var(--bg-deep)' }}
    >
      <div className="flex items-end gap-10">
        <div className="flex flex-col items-center gap-3">
          <CharacterDisplay
            character="baymax"
            variant="static"
            size={100}
            floatLoop
            floatDelay={0}
          />
          <span className="text-xs font-bold tracking-widest uppercase duo-label-baymax">
            Baymax
          </span>
        </div>
        <div className="flex flex-col items-center gap-3">
          <CharacterDisplay
            character="toothless"
            variant="static"
            size={100}
            floatLoop
            floatDelay={1.5}
            mirrored
          />
          <span className="text-xs font-bold tracking-widest uppercase duo-label-toothless">
            Toothless
          </span>
        </div>
      </div>
      <p className="text-sm animate-pulse" style={{ color: 'var(--text-muted)' }}>
        Initializing…
      </p>
    </div>
  )

  return (
    <main className="min-h-screen flex flex-col relative overflow-hidden transition-colors duration-500">
      <AnimatePresence mode="wait">

        {/* ── Phase 2: Character Selection — duo hero, per-character accents, no theme swap ── */}
        {step === 'character' && (
          <motion.div
            key="char"
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
            className="flex flex-col min-h-screen items-center justify-center p-6 relative z-10 w-full max-w-4xl mx-auto"
          >
            {/* Duo hero — both characters always present, floating out of phase */}
            <div className="flex items-end justify-center gap-10 mb-8">
              <CharacterDisplay
                character="baymax" variant="gif" size={110}
                floatLoop floatDelay={0}
              />
              <CharacterDisplay
                character="toothless" variant="gif" size={110}
                floatLoop floatDelay={1.5} mirrored
              />
            </div>

            <div className="text-center mb-10">
              <h1
                className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight"
                style={{ color: 'var(--text-main)' }}
              >
                Diagnostic Protocol
              </h1>
              <p className="text-lg" style={{ color: 'var(--text-muted)' }}>
                Which companion are <em>you</em>?
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
              {(['baymax', 'toothless'] as const).map((id) => {
                const isSelected = selectedCharacter === id
                const accentHex = id === 'baymax' ? '#4FC3F7' : '#00E5C8'
                const accentVar = id === 'baymax' ? 'var(--color-baymax)' : 'var(--color-toothless)'
                const activeGif = id === 'baymax' ? '/baymax.gif' : '/toothless-fly.gif'

                return (
                  <motion.button
                    key={id}
                    onClick={() => { setSelectedCharacter(id); triggerHaptic() }}
                    whileHover={{ y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="glass-card p-8 text-left relative overflow-hidden flex flex-col group"
                    style={isSelected
                      ? { boxShadow: `0 0 0 2px ${accentHex}, var(--card-shadow)` }
                      : undefined
                    }
                  >
                    <motion.div
                      className="w-24 h-24 mb-6 relative z-10 mx-auto md:mx-0 flex items-center justify-center"
                      animate={{ scale: isSelected ? 1.1 : 1 }}
                      transition={{ scale: { duration: 0.3 } }}
                    >
                      <Image
                        src={activeGif}
                        alt={characters[id].name}
                        width={120} height={120}
                        className="object-contain drop-shadow-xl"
                        priority
                        unoptimized
                      />
                    </motion.div>

                    <div className="relative z-10 text-center md:text-left">
                      <h2 className="text-2xl font-bold mb-2" style={{ color: accentVar }}>
                        {characters[id].name}
                      </h2>
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                        {id === 'baymax'
                          ? 'Your personal healthcare companion. Clinical, precise, and highly attuned to physiological stress markers.'
                          : 'Night Fury. Intuitive, fiercely loyal, and highly responsive to environmental dynamics.'}
                      </p>
                    </div>

                    <AnimatePresence>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                          className="absolute top-6 right-6 w-6 h-6 rounded-full flex items-center justify-center text-xs z-10"
                          style={{ backgroundColor: accentHex, color: '#080C14' }}
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
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="w-full text-center"
                >
                  <button onClick={() => setStep('name')} className="btn-primary w-full md:w-auto px-12 py-4">
                    Proceed to Authorization →
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* ── Phase 3a: Name Step — both characters with live name labels ── */}
        {step === 'name' && selectedCharacter && (
          <motion.div
            key="name"
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative z-10"
          >
            <div className="glass-card p-10 w-full max-w-md text-center">

              {/* Duo header — host character + partner character facing each other, names update live */}
              <div className="flex justify-center items-end gap-8 mb-8">
                <div className="flex flex-col items-center gap-2">
                  <CharacterDisplay
                    character={selectedCharacter as 'baymax' | 'toothless'}
                    variant={selectedCharacter === 'baymax' ? 'wave' : 'gif'}
                    size={64} floatLoop floatDelay={0}
                  />
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: selectedCharacter === 'baymax' ? 'var(--color-baymax)' : 'var(--color-toothless)' }}
                  >
                    {myName.trim() || 'You'}
                  </span>
                </div>

                <div className="text-xl pb-8" style={{ color: 'var(--text-muted)' }}>↔</div>

                <div className="flex flex-col items-center gap-2" style={{ opacity: 0.85 }}>
                  {/* Partner: CharacterDisplay gif + mirrored so they face the user's character */}
                  <CharacterDisplay
                    character={partnerCharacter as 'baymax' | 'toothless'}
                    variant="gif"
                    size={64}
                    floatLoop
                    floatDelay={1.5}
                    mirrored
                  />
                  <span
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: partnerCharacter === 'baymax' ? 'var(--color-baymax)' : 'var(--color-toothless)' }}
                  >
                    {partnerName.trim() || 'Partner'}
                  </span>
                </div>
              </div>

              <h2
                className="text-3xl font-bold mb-3 tracking-tight"
                style={{ color: 'var(--text-main)' }}
              >
                Target Designation
              </h2>
              <p className="mb-8 text-sm" style={{ color: 'var(--text-muted)' }}>
                Establish secure routing protocol.
              </p>

              <div className="mb-5 text-left">
                <label
                  className="block text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Your Name
                </label>
                <input
                  type="text"
                  value={myName}
                  onChange={e => setMyName(e.target.value)}
                  placeholder="Enter your name..."
                  className="input-premium text-left"
                  autoFocus
                />
              </div>

              <div className="mb-8 text-left">
                <label
                  className="block text-xs font-bold uppercase tracking-widest mb-2"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Partner Name
                </label>
                <input
                  type="text"
                  value={partnerName}
                  onChange={e => setPartnerName(e.target.value)}
                  placeholder="Enter designation..."
                  className="input-premium text-left"
                />
              </div>

              {errorMsg && (
                <div className="mb-6 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-semibold text-left">
                  ⚠️ {errorMsg}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  onClick={() => setStep('character')}
                  className="px-6 py-3 rounded-xl font-semibold transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateRoom}
                  disabled={isCreatingRoom || !partnerName.trim() || !myName.trim()}
                  className="btn-primary flex-1"
                >
                  {isCreatingRoom ? 'Generating Link...' : 'Initialize Session'}
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Phase 3b: Invite Step — baymax waves, toothless licks, both celebrating ── */}
        {step === 'invite' && roomId && (
          <motion.div
            key="invite"
            initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }}
            className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative z-10"
          >
            <div className="glass-card p-10 w-full max-w-md text-center">

              {/* Both characters celebrating the link — baymax waves, toothless licks */}
              <div className="flex justify-center items-end gap-10 mb-6">
                <div className="flex flex-col items-center gap-2">
                  <CharacterDisplay
                    character="baymax" variant="wave"
                    size={72} floatLoop floatDelay={0}
                  />
                  <span className="text-xs font-bold tracking-widest uppercase duo-label-baymax">
                    {myName}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <CharacterDisplay
                    character="toothless" variant="lick"
                    size={72} floatLoop floatDelay={1.5} mirrored
                  />
                  <span className="text-xs font-bold tracking-widest uppercase duo-label-toothless">
                    {partnerName}
                  </span>
                </div>
              </div>

              <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--text-main)' }}>
                Link Established
              </h2>
              <p className="mb-8 text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
                Secure tunnel routed. Share this encrypted key with {partnerName} to begin synchronization.
              </p>

              <div
                onClick={copyInviteLink}
                className="rounded-xl p-4 flex items-center justify-between cursor-pointer transition-all mb-8 border hover:bg-white/5"
                style={{
                  backgroundColor: 'var(--bg-deep)',
                  borderColor: copied ? 'var(--accent-primary)' : 'var(--border-light)'
                }}
              >
                <code className="font-mono text-sm truncate mr-4" style={{ color: 'var(--accent-primary)' }}>
                  {inviteOrigin}/join/{roomId}
                </code>
                <div
                  className="p-2 rounded-lg transition-colors"
                  style={{
                    backgroundColor: copied ? 'var(--accent-primary)' : 'var(--bg-card)',
                    color: copied ? '#080C14' : 'inherit'
                  }}
                >
                  {copied ? '✅' : '📋'}
                </div>
              </div>

              <button onClick={() => router.push('/scenarios')} className="btn-primary w-full py-4">
                Enter Diagnostic Bay
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  )
}
