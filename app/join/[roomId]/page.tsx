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
    // Check if she's already in a room
    if (typeof window !== 'undefined' && localStorage.getItem('roomId') === roomId) {
      router.push('/scenarios')
      return
    }

    const fetchRoomData = async () => {
      try {
        // 🚀 READ FROM FIREBASE
        const roomRef = doc(db, "rooms", roomId as string);
        const roomSnap = await getDoc(roomRef);

        if (roomSnap.exists()) {
          const data = roomSnap.data();
          setHostName(data.host.name); // Pulls 'Andrew' from the DB
          setAssignedCharacter(data.client.character); // Pulls whatever the opposite character is
          
          // Slight delay to allow the 'terminal' effect to play
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
      // 🚀 UPDATE FIREBASE to let your device know she joined
      await updateDoc(doc(db, "rooms", roomId as string), {
        status: 'active'
      })

      // Lock in her local context
      localStorage.setItem('myCharacter', assignedCharacter)
      localStorage.setItem('partnerName', hostName)
      localStorage.setItem('roomId', roomId as string)
      localStorage.setItem('userRole', 'client') // Marks her device as Player 2
      
      // Set the CSS theme to her character
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
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-[#080B10]">
      <AnimatePresence mode="wait">

        {/* STEP 1: DECRYPTING PAYLOAD (Terminal aesthetic for Jenny) */}
        {step === 'decrypting' && (
          <motion.div 
            key="decrypting"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-md font-mono text-sm"
          >
            <div className="glass-card p-8 border-[#00E5C8]/30">
              <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
                <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-[#8B9BB4] ml-2">tunnel_auth.sh</span>
              </div>
              
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                className="text-[#00E5C8] mb-2"
              >
                &gt; Requesting handshake via port 443... [OK]
              </motion.div>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                className="text-[#00E5C8] mb-2"
              >
                &gt; Validating session token: {roomId}... [OK]
              </motion.div>
              <motion.div 
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
                className="text-[#B68AFF] mb-2"
              >
                &gt; Decrypting host identification...
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: ERROR STATE */}
        {step === 'error' && (
          <motion.div key="error" className="glass-card p-8 text-center border-red-500/30">
             <h2 className="text-white text-xl font-bold mb-2">Connection Failed</h2>
             <p className="text-[#8B9BB4]">Invalid or expired Room ID.</p>
          </motion.div>
        )}

        {/* STEP 3: ACCEPT CONNECTION */}
        {step === 'accept' && assignedCharacter && (
          <motion.div 
            key="accept"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md relative z-10"
          >
            <div className="glass-card p-8 md:p-10 text-center relative overflow-hidden">
              {/* Background Glow */}
              <div className={`absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl -mr-10 -mt-10 ${assignedCharacter === 'toothless' ? 'bg-[#00E5C8]/20' : 'bg-[#3A85C8]/20'}`} />

              <div className="text-4xl mb-4">🔐</div>
              <h1 className="text-3xl font-bold mb-2 text-white">Incoming Link</h1>
              <p className="text-[#8B9BB4] mb-8 pb-8 border-b border-white/10">
                <strong className="text-white">{hostName}</strong> has invited you to synchronize diagnostic data.
              </p>

              <div className="flex flex-col items-center mb-10">
                <p className="text-sm font-bold uppercase tracking-widest text-[#8B9BB4] mb-4">
                  Your Assigned Companion
                </p>
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                >
                  {assignedCharacter === 'toothless' ? (
                     <video src="/toothless-courtship.mp4" autoPlay loop muted playsInline className="w-32 h-32 object-contain drop-shadow-2xl mb-4" />
                  ) : (
                     <Image src="/baymax.gif" alt="Baymax" width={140} height={140} className="object-contain drop-shadow-2xl mb-4" unoptimized />
                  )}
                </motion.div>
                <h2 className={`text-2xl font-bold ${assignedCharacter === 'toothless' ? 'text-[#00E5C8] font-serif' : 'text-[#3A85C8]'}`}>
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