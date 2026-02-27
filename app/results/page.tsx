'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { scenarioData, characters, categoryGroups } from '@/lib/data'

function useCountUp(target: number, duration = 1400) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (target === 0) return
    const steps = 50; let step = 0
    const timer = setInterval(() => {
      step++
      setCount(Math.round((step / steps) * target))
      if (step >= steps) clearInterval(timer)
    }, duration / steps)
    return () => clearInterval(timer)
  }, [target, duration])
  return count
}

function Confetti({ active }: { active: boolean }) {
  const colors = ['#00E5C8','#4FC3F7','#3A85C8','#FF6B6B','#FFD700','#7B5EA7']
  if (!active) return null
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 48 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-sm"
          style={{ width: Math.random()*10+6, height: Math.random()*10+6, background: colors[i%colors.length], left: `${Math.random()*100}%`, top: -20 }}
          animate={{ y: ['0vh','115vh'], x: [0,(Math.random()-0.5)*260], rotate: [0,Math.random()*720], opacity: [1,0.8,0] }}
          transition={{ duration: Math.random()*2+1.5, delay: Math.random()*0.8, ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}

function ScoreTierBanner({ score }: { score: number }) {
  const [label, emoji, tierClass] =
    score >= 90 ? ['Soulmates',         '💍', 'tier-soulmates']
    : score >= 70 ? ['Pretty Aligned',  '💚', 'tier-aligned']
    : score >= 50 ? ['Work in Progress','🛠️', 'tier-progress']
    :               ['Opposites Attract','⚡', 'tier-opposites']
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
      className={`rounded-2xl px-6 py-4 text-center mt-4 ${tierClass}`}>
      <span className="text-3xl mr-2">{emoji}</span>
      <span className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>{label}</span>
    </motion.div>
  )
}

export default function Results() {
  const [report, setReport]             = useState<any[]>([])
  const [myCharacter, setMyCharacter]   = useState('')
  const [partnerCharacter, setPartnerCharacter] = useState('')
  const [partnerName, setPartnerName]   = useState('Partner')
  const [showConfetti, setShowConfetti] = useState(false)
  const [revealed, setRevealed]         = useState<Record<number, boolean>>({})
  const [scoreReady, setScoreReady]     = useState(false)
  const [countdown, setCountdown]       = useState<number | null>(null)
  const confettiFired = useRef(false)

  const matches       = report.filter(r => r.isMatch).length
  const totalAnswered = report.length
  const scorePercent  = totalAnswered > 0 ? Math.round((matches / totalAnswered) * 100) : 0
  const displayScore  = useCountUp(scoreReady ? scorePercent : 0)

  useEffect(() => {
    const myChar = localStorage.getItem('myCharacter') || 'baymax'
    setMyCharacter(myChar)
    setPartnerCharacter(myChar === 'baymax' ? 'toothless' : 'baymax')
    setPartnerName(localStorage.getItem('partnerName') || 'Partner')
    document.body.setAttribute('data-theme', myChar)

    const results = Object.entries(scenarioData).map(([key, scenario]) => {
      const saved = JSON.parse(localStorage.getItem(`scenario_${key}`) || '{}')
      if (!saved.myAnswer || !saved.partnerAnswer) return null
      const myIdx      = scenario.options.findIndex(o => o.id === saved.myAnswer)
      const partnerIdx = scenario.options.findIndex(o => o.id === saved.partnerAnswer)
      const isMatch    = saved.myAnswer === saved.partnerAnswer
      const char       = characters[myChar]
      const bothLast   = myIdx === scenario.options.length-1 && partnerIdx === scenario.options.length-1
      const reaction   = bothLast ? char.reactions.hilarious
        : isMatch ? char.reactions.perfect
        : Math.abs(myIdx-partnerIdx) <= 1 ? char.reactions.good
        : char.reactions.mismatch
      return {
        key, name: scenario.name, emoji: scenario.emoji,
        myAnswer: scenario.options[myIdx]?.text,
        partnerAnswer: scenario.options[partnerIdx]?.text,
        isMatch, reaction,
        category: Object.entries(categoryGroups).find(([,g]) => g.ids.includes(key))?.[0] ?? 'other',
      }
    }).filter(Boolean)
    setReport(results)
  }, [])

  useEffect(() => {
    if (totalAnswered === 0) return
    let n = 3; setCountdown(n)
    const tick = setInterval(() => {
      n--
      if (n <= 0) { clearInterval(tick); setCountdown(null); setScoreReady(true) }
      else setCountdown(n)
    }, 700)
    return () => clearInterval(tick)
  }, [totalAnswered])

  useEffect(() => {
    if (scorePercent >= 70 && !confettiFired.current && totalAnswered > 0 && scoreReady) {
      confettiFired.current = true
      setTimeout(() => { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3500) }, 400)
    }
  }, [scorePercent, totalAnswered, scoreReady])

  const myEmoji      = myCharacter === 'baymax' ? '🤖' : '🐉'
  const partnerEmoji = partnerCharacter === 'baymax' ? '🤖' : '🐉'

  const categoryScores = Object.entries(categoryGroups).map(([key, group]) => {
    const cats = report.filter((r: any) => r.category === key)
    return { ...group, score: cats.length > 0 ? Math.round(cats.filter((r: any) => r.isMatch).length / cats.length * 100) : null, answered: cats.length }
  })

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <Confetti active={showConfetti} />

      <motion.header className="text-center mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-6xl mb-4">{myEmoji} 💌 {partnerEmoji}</div>
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>Compatibility Report</h1>
        <p className="italic" style={{ color: 'var(--text-muted)' }}>You & {partnerName}</p>
      </motion.header>

      {totalAnswered > 0 && (
        <motion.div className="blueprint-card text-center mb-10"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
          <AnimatePresence mode="wait">
            {countdown !== null ? (
              <motion.div key={`cd-${countdown}`}
                initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1.1, opacity: 1 }} exit={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 0.45 }} className="text-8xl font-bold py-6" style={{ color: 'var(--accent-sage)' }}>
                {countdown}
              </motion.div>
            ) : (
              <motion.div key="score" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-9xl font-bold mb-2 score-number" style={{ color: 'var(--accent-sage)' }}>{displayScore}%</div>
                <ScoreTierBanner score={scorePercent} />
                <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>{matches} matches out of {totalAnswered} answered</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {totalAnswered > 0 && (
        <motion.div className="blueprint-card mb-10" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="font-bold text-xs uppercase tracking-widest mb-5" style={{ color: 'var(--text-muted)' }}>By Category</h2>
          <div className="space-y-4">
            {categoryScores.filter(c => c.answered > 0).map((cat, i) => (
              <div key={cat.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                    <span>{cat.emoji}</span> {cat.label}
                  </span>
                  <span className="text-sm font-bold" style={{ color: 'var(--accent-sage)' }}>{cat.score}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(128,128,128,0.12)' }}>
                  <motion.div className="h-full rounded-full" style={{ background: 'var(--accent-sage)' }}
                    initial={{ width: 0 }} animate={{ width: `${cat.score}%` }}
                    transition={{ duration: 0.9, delay: 0.5 + i * 0.1, ease: 'easeOut' }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="space-y-6">
        {report.map((res: any, i: number) => (
          <motion.div key={i} className="blueprint-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04 }}>
            <h2 className="text-lg font-bold pb-3 mb-4 flex items-center gap-2"
              style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-main)' }}>
              <span>{res.emoji}</span> {res.name}
            </h2>
            <div className="flex justify-between mb-4 gap-4">
              <div className="flex-1">
                <p className="text-xs uppercase font-bold mb-1" style={{ color: 'var(--text-muted)' }}>You ({myEmoji})</p>
                <p className="font-semibold text-sm" style={{ color: 'var(--accent-sage)' }}>{res.myAnswer}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase font-bold mb-1" style={{ color: 'var(--text-muted)' }}>{partnerName} ({partnerEmoji})</p>
                {revealed[i]
                  ? <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-semibold text-sm" style={{ color: 'var(--accent-sage)' }}>{res.partnerAnswer}</motion.p>
                  : <button onClick={() => setRevealed(p => ({ ...p, [i]: true }))}
                      className="text-xs font-bold px-3 py-1 rounded-full transition-all hover:scale-105"
                      style={{ background: 'var(--accent-terra)', color: myCharacter === 'toothless' ? '#080C14' : 'white' }}>
                      🎉 Reveal
                    </button>
                }
              </div>
            </div>
            <AnimatePresence>
              {revealed[i] && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className={`p-3 rounded-xl text-sm font-semibold text-center ${res.isMatch ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {res.reaction}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {totalAnswered === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
          <div className="text-6xl mb-5">🤔</div>
          <p className="text-xl font-semibold mb-2" style={{ color: 'var(--text-main)' }}>Nothing here yet</p>
          <p>Go answer some scenarios first!</p>
          <Link href="/scenarios" className="btn-blueprint inline-block mt-6 text-base px-8 py-3">← Back to Scenarios</Link>
        </div>
      )}

      {totalAnswered > 0 && (
        <motion.div className="mt-14 rounded-3xl overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
          style={{
            background: myCharacter === 'toothless'
              ? 'linear-gradient(135deg, #080C14 0%, #0D1B2E 100%)'
              : 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)',
            border: '1px solid var(--border)',
            boxShadow: 'var(--card-shadow)',
          }}>
          <div className="p-8 text-center">
            <p className="text-xs uppercase font-bold trac
