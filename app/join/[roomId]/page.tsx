'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'
import VideoCharacter from '@/components/VideoCharacter'

export default function JoinRoom() {
  const { roomId } = useParams()
  const router = useRouter()

  const [step, setStep] = useState<'decrypting' | 'accept' | 'error'>('decrypting')
  const [hostName, setHostName] = useState('')
  const [clientName, setClientName] = useState('')
  const [assignedCharacter, setAssignedCharacter] = useState<'baymax' | 'toothless' | null>(null)
  const [hostCharacter, setHostCharacter] = useState<'baymax' | 'toothless' | null>(null)
  const [isJoining, setIsJoining] = useState(false)

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50)
    }
  }

  const fetchRoomData = async () => {
    setStep('decrypting')
    try {
      const roomRef = doc(db, 'rooms', roomId as string)
      const roomSnap = await getDoc(roomRef)

      if (roomSnap.exists()) {
        const data = roomSnap.data()
        setHostName(data.host.name || 'Player 1')
        setClientName(data.client.name || 'Player 2')
        setAssignedCharacter(data.client.character)
        setHostCharacter(data.host.character)

        // Both characters present from the moment she arrives
        document.body.setAttribute('data-theme', 'dual')

        setTimeout(() => setStep('accept'), 1800)
      } else {
        setStep('error')
      }
    } catch (error) {
      console.error('Failed to fetch room:', error)
      setStep('error')
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('roomId') === roomId) {
      router.push('/scenarios')
      return
    }

    fetchRoomData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, router])

  const handleAccept = async () => {
    if (!assignedCharacter) return
    setIsJoining(true)
    triggerHaptic()

    try {
      await updateDoc(doc(db, 'rooms', roomId as string), {
        status: 'active',
      })

      localStorage.setItem('myCharacter', assignedCharacter)
      localStorage.setItem('myName', clientName)
      localStorage.setItem('partnerName', hostName)
      localStorage.setItem('roomId', roomId as string)
      localStorage.setItem('userRole', 'client')

      document.body.setAttribute('data-theme', 'dual')

      setTimeout(() => router.push('/scenarios'), 1000)
    } catch (e) {
      console.error(e)
      setIsJoining(false)
    }
  }

  // Name labels: Baymax side owner vs Toothless side owner
  const baymaxOwner    = hostCharacter === 'baymax'    ? hostName : clientName
  const toothlessOwner = hostCharacter === 'toothless' ? hostName : clientName

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      <AnimatePresence mode="wait">

        {/* STEP 1: DECRYPTING */}
        {step === 'decrypting' && (
          <motion.div
            key="decrypting"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md font-mono text-sm"
          >
            <div className="glass-card p-8 text-left">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b" style={{ borderColor: 'var(--border-light)' }}>
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-2 font-semibold" style={{ color: 'var(--text-muted)' }}>tunnel_auth.sh</span>
              </div>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="mb-2 font-medium" style={{ color: 'var(--accent-primary)' }}
              >
                &gt; Requesting handshake via port 443... [OK]
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="mb-2 font-medium" style={{ color: 'var(--accent-primary)' }}
              >
                &gt; Validating session token: {roomId}... [OK]
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
                className="mb-2 font-medium" style={{ color: 'var(--text-main)' }}
              >
                &gt; Initializing duo protocol...
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: ERROR */}
        {step === 'error' && (
          <motion.div key="error" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-8 text-center" style={{ borderColor: '#FF6B6B' }}>
            <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>Connection Failed</h2>
            <p className="mb-4" style={{ color: 'var(--text-muted)' }}>Invalid or expired Room ID.</p>
            <button
              onClick={fetchRoomData}
              className="btn-primary px-6 py-2.5 text-sm"
            >
              Try Again
            </button>
          </motion.div>
        )}

        {/* STEP 3: ACCEPT — Both characters fully visible, equal presence, facing each other */}
        {step === 'accept' && assignedCharacter && hostCharacter && (
          <motion.div
            key="accept"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-lg relative z-10"
          >
            <div className="glass-card p-8 md:p-10 text-center relative overflow-hidden">

              {/*
               * Both characters shown with full opacity — no dimming.
               * Baymax plays baymax-coffee.mp4 (calm, welcoming).
               * Toothless plays toothless-courtship.mp4 (affectionate, excited).
               * floatLoop handles the float natively at -12px amplitude;
               * mirrored on Toothless makes them face each other.
               */}
              <div className="flex justify-center gap-10 mb-6 mt-2">

                {/* Baymax — baymax-coffee.mp4 */}
                <div className="flex flex-col items-center gap-2">
                  <VideoCharacter
                    character="baymax"
                    variant="idle"
                    size={140}
                    floatLoop
                    floatDelay={0}
                  />
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xs font-black uppercase tracking-widest duo-label-baymax">
                      Baymax
                    </span>
                    <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                      {baymaxOwner}
                    </span>
                  </div>
                </div>

                {/* Toothless — toothless-courtship.mp4, mirrored to face Baymax */}
                <div className="flex flex-col items-center gap-2">
                  <VideoCharacter
                    character="toothless"
                    variant="idle"
                    size={140}
                    floatLoop
                    floatDelay={1.5}
                    mirrored
                  />
                  <div className="flex flex-col items-center gap-0.5">
                    <span className="text-xs font-black uppercase tracking-widest duo-label-toothless">
                      Toothless
                    </span>
                    <span className="text-[10px] font-semibold" style={{ color: 'var(--text-muted)' }}>
                      {toothlessOwner}
                    </span>
                  </div>
                </div>
              </div>

              <h1 className="text-2xl font-extrabold mb-2 tracking-tight" style={{ color: 'var(--text-main)' }}>
                You&rsquo;re Invited 💌
              </h1>

              <p className="mb-8 text-sm leading-relaxed pb-6 border-b" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-light)' }}>
                <strong style={{ color: 'var(--text-main)' }}>{hostName}</strong> is waiting for you.
                Both Baymax and Toothless will be with you the whole time &mdash;
                you and <strong style={{ color: 'var(--text-main)' }}>{hostName}</strong> each have a companion for the journey.
              </p>

              <button
                onClick={handleAccept}
                disabled={isJoining}
                className="btn-primary w-full py-4 text-lg"
              >
                {isJoining ? 'Synchronizing...' : 'Enter the Bay →'}
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  )
}
