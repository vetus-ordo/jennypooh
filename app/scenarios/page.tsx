'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { scenarioData, categoryGroups } from '@/lib/data'
import CharacterDisplay from '@/components/CharacterDisplay'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase'

export default function Scenarios() {
  const router = useRouter()
  const [myCharacter, setMyCharacter] = useState('')
  const [answeredMap, setAnsweredMap] = useState<Record<string, boolean>>({})
  const [partnerName, setPartnerName] = useState('')
  const [partnerAnswered, setPartnerAnswered] = useState(0)
  const total = Object.keys(scenarioData).length

  useEffect(() => {
    const char = localStorage.getItem('myCharacter') || ''
    setMyCharacter(char)
    setPartnerName(localStorage.getItem('partnerName') || '')
    // Both characters share the stage from here on
    document.body.setAttribute('data-theme', 'dual')
    const map: Record<string, boolean> = {}
    Object.keys(scenarioData).forEach(k => {
      const s = JSON.parse(localStorage.getItem(`scenario_${k}`) || '{}')
      if (s.myAnswer) map[k] = true
    })
    setAnsweredMap(map)

    // Listen for partner's progress in real-time
    const roomId = localStorage.getItem('roomId')
    const myRole = localStorage.getItem('userRole') || 'host'
    const pRole = myRole === 'host' ? 'client' : 'host'
    if (roomId) {
      const unsubscribe = onSnapshot(doc(db, 'rooms', roomId), (snap) => {
        if (snap.exists()) {
          const data = snap.data()
          const pAnswers = data[pRole]?.answers || {}
          setPartnerAnswered(Object.keys(pAnswers).length)
        }
      })
      return () => unsubscribe()
    }
  }, [])

  const completed = Object.values(answeredMap).filter(Boolean).length
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0
  const firstUnanswered = Object.keys(scenarioData).find(k => !answeredMap[k])

  return (
    <main className="max-w-4xl mx-auto px-6 py-14">
      <motion.header className="text-center mb-10" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-5xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>Life Scenarios</h1>
        <p className="text-xl italic" style={{ color: 'var(--text-muted)' }}>How would you handle these situations?</p>
      </motion.header>

      <motion.div
        className="blueprint-card mb-10"
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
      >
        <div className="flex flex-wrap justify-between items-end gap-4 mb-4">
          <div>
            <span className="font-bold uppercase tracking-widest text-xs" style={{ color: 'var(--text-muted)' }}>Progress</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-4xl font-bold" style={{ color: 'var(--accent-sage)' }}>{percent}%</span>
              <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{completed} of {total} answered</span>
            </div>
          </div>
          {firstUnanswered && completed > 0 && (
            <button
              onClick={() => router.push(`/scenarios/${firstUnanswered}`)}
              className="text-sm font-bold px-4 py-2 rounded-full border-2 transition-all hover:scale-105"
              style={{ borderColor: 'var(--accent-terra)', color: 'var(--accent-terra)' }}
            >
              ▶ Resume
            </button>
          )}
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: 'rgba(128,128,128,0.12)' }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'var(--accent-sage)' }}
            initial={{ width: 0 }}
            animate={{ width: `${percent}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </motion.div>

      {Object.entries(categoryGroups).map(([catKey, cat], catIdx) => {
        const catIds = cat.ids
        const catAnswered = catIds.filter(id => answeredMap[id]).length
        return (
          <motion.section
            key={catKey}
            className="mb-12"
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 + catIdx * 0.08 }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">{cat.emoji}</span>
                <span className="font-bold uppercase tracking-widest text-xs" style={{ color: 'var(--text-muted)' }}>
                  {cat.label}
                </span>
              </div>
              <span className="text-xs font-bold" style={{ color: 'var(--accent-sage)' }}>
                {catAnswered}/{catIds.length}{catAnswered === catIds.length ? ' ✓' : ''}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {catIds.map((id, i) => {
                const scenario = scenarioData[id]
                if (!scenario) return null
                const isDone = !!answeredMap[id]
                return (
                  <motion.div key={id} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 * i }}>
                    <Link href={`/scenarios/${id}`}>
                      <div
                        className="blueprint-card cursor-pointer relative"
                        style={isDone ? { borderColor: 'var(--accent-sage)', background: 'var(--accent-glow)' } : {}}
                      >
                        {isDone && (
                          <div className="absolute top-4 right-4">
                            <svg width="24" height="24" viewBox="0 0 28 28" className="check-svg">
                              <circle cx="14" cy="14" r="13" fill="none" stroke="var(--accent-sage)" strokeWidth="2" />
                              <path d="M8 14l4 4 8-8" fill="none" stroke="var(--accent-sage)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                        )}
                        <div className="flex items-start gap-3">
                          <span className="text-3xl mt-1">{scenario.emoji}</span>
                          <div className="pr-8">
                            <h3 className="text-lg font-bold mb-1" style={{ color: 'var(--text-main)' }}>{scenario.name}</h3>
                            <p className="text-sm line-clamp-2" style={{ color: 'var(--text-muted)' }}>{scenario.situation}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                )
              })}
            </div>
          </motion.section>
        )
      })}

      <motion.div className="mt-4 text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
        <AnimatePresence mode="wait">
          {completed === total && partnerAnswered === total ? (
            <motion.div
              key="both-done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-8 mb-6"
            >
              <div className="flex items-center justify-center gap-6 mb-4">
                <CharacterDisplay character="baymax" variant="heart" size={56} floatLoop floatDelay={0} />
                <CharacterDisplay character="toothless" variant="lick" size={56} floatLoop floatDelay={1.5} mirrored />
              </div>
              <p className="text-lg font-bold mb-1" style={{ color: 'var(--text-main)' }}>
                Both players are done
              </p>
              <p className="text-sm mb-6" style={{ color: 'var(--text-muted)' }}>
                Time to see how well you two know each other.
              </p>
              <Link href="/results" className="btn-primary inline-block text-lg px-10 py-4">
                See Your Results
              </Link>
            </motion.div>
          ) : (
            <motion.div key="in-progress" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {partnerName && partnerAnswered < total && (
                <p className="text-sm mb-3 font-semibold" style={{ color: 'var(--text-muted)' }}>
                  {partnerAnswered === 0
                    ? `Waiting for ${partnerName} to start...`
                    : `${partnerName} has completed ${partnerAnswered}/${total} scenarios`}
                </p>
              )}
              <Link href="/results" className="btn-blueprint inline-block text-lg px-10 py-4">
                View Compatibility Report 💌
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
  )
}
