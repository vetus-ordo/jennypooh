'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/firebase'

export default function JoinRoom() {
  const { roomId } = useParams()
  const router = useRouter()
  
  const [step, setStep] = useState<'decrypting' | 'accept' | 'error'>('decrypting')
  const [hostName, setHostName] = useState('Andrew')
  const [assignedCharacter, setAssignedCharacter] = useState<string | null>(null)
  const [isJoining, setIsJoining] = useState(false)

  // Mobile haptic feedback
  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('roomId') === roomId) {
      router.push('/scenarios')
      return
    }

    const fetchRoomData = async () => {
      try {
        const roomRef = doc(db, "rooms", roomId as string);
        const roomSnap = await getDoc(roomRef);

        if (roomSnap.exists()) {
          const data = roomSnap.data();
          setHostName(data.host.name); 
          setAssignedCharacter(data.client.character); 
          
          // Set theme temporarily to match assigned character for the reveal
          document.body.setAttribute('data-theme', data.client.character)
          
          setTimeout(() => setStep('accept'), 1800);
        } else {
          setStep('error');
        }
      } catch (error) {
        console.error("Failed to fetch room:", error)
        setStep('error');
      }
    }

    fetchRoomData()
  }, [roomId, router])

  const handleAccept = async () => {
    if (!assignedCharacter) return
    setIsJoining(true)
    triggerHaptic()

    try {
      await updateDoc(doc(db, "rooms", roomId as string), {
        status: 'active'
      })

      localStorage.setItem('myCharacter', assignedCharacter)
      localStorage.setItem('partnerName', hostName)
      localStorage.setItem('roomId', roomId as string)
      localStorage.setItem('userRole', 'client') 
      
      document.body.setAttribute('data-theme', assignedCharacter)

      setTimeout(() => {
        router.push('/scenarios')
      }, 1000)
    } catch (e) {
      console.error(e)
      setIsJoining(false)
    }
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden transition-colors duration-500">
      <AnimatePresence mode="wait">

        {/* STEP 1: DECRYPTING PAYLOAD */}
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
                &gt; Decrypting host identification...
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: ERROR STATE */}
        {step === 'error' && (
          <motion.div key="error" className="glass-card p-8 text-center" style={{ borderColor: '#FF6B6B' }}>
             <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>Connection Failed</h2>
             <p style={{ color: 'var(--text-muted)' }}>Invalid or expired Room ID.</p>
          </motion.div>
        )}

        {/* STEP 3: ACCEPT CONNECTION */}
        {step === 'accept' && assignedCharacter && (
          <motion.div 
            key="accept"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="glass-card p-8 md:p-12 text-center relative overflow-hidden">
              <div className="text-4xl mb-4">🔐</div>
              <h1 className="text-3xl font-extrabold mb-3 tracking-tight" style={{ color: 'var(--text-main)' }}>Incoming Link</h1>
              
              <p className="mb-8 pb-8 border-b text-sm leading-relaxed" style={{ color: 'var(--text-muted)', borderColor: 'var(--border-light)' }}>
                <strong style={{ color: 'var(--text-main)' }}>{hostName}</strong> has invited you to synchronize diagnostic data.
              </p>

              <div className="flex flex-col items-center mb-10">
                <p className="text-xs font-bold uppercase tracking-widest mb-6" style={{ color: 'var(--text-muted)' }}>
                  Your Assigned Companion
                </p>
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                  className="w-32 h-32 relative flex items-center justify-center mb-6"
                >
                  {assignedCharacter === 'toothless' ? (
                     <video src="/toothless-courtship.mp4" autoPlay loop muted playsInline className="w-full h-full object-contain drop-shadow-2xl rounded-full" />
                  ) : (
                     <Image src="/baymax.gif" alt="Baymax" width={140} height={140} className="object-contain drop-shadow-2xl" unoptimized />
                  )}
                </motion.div>
                <h2 className={`text-2xl font-bold ${assignedCharacter === 'toothless' ? 'font-serif' : ''}`} style={{ color: 'var(--text-main)' }}>
                  {assignedCharacter === 'toothless' ? 'Toothless' : 'Baymax'}
                </h2>
              </div>

              <button 
                onClick={handleAccept} 
                disabled={isJoining}
                className="btn-primary w-full py-4 text-lg"
              >
                {isJoining ? 'Synchronizing...' : 'Accept & Enter Bay →'}
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  )
}