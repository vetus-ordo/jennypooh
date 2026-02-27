'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { scenarioData, characters, categoryGroups } from '@/lib/data'

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (target === 0) return
    const steps = 40
    let step = 0
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
  const colors = ['#7B9E89','#D98C71','#5B9BD5','#E94560','#FFD700','#7B5EA7']
  if (!active) return null
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 36 }).map((_, i) => (
        <motion.div key={i} className="absolute rounded-sm"
          style={{ width: Math.random()*10+6, height: Math.random()*10+6, background: colors[i%colors.length], left: `${Math.random()*100}%`, top: -20 }}
          animate={{ y: ['0vh','110vh'], x: [0, (Math.random()-0.5)*200], rotate: [0, Math.random()*720], opacity: [1,0.6,0] }}
          transition={{ duration: Math.random()*2+1.5, delay: Math.random()*0.8, ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}

function ScoreTier({ score }: { score: number }) {
  const [label, color] =
    score >= 90 ? ['Soulmates 💍', 'var(--accent-sage)'] :
    score >= 70 ? ['Pretty Aligned 💚', 'var(--accent-sage)'] :
    score >= 50 ? ['Work in Progress 🛠️', '#D98C71'] :
                  ['Opposites Attract ⚡', '#E94560']
  return <div className="text-2xl font-bold text-center" style={{ color }}>{label}</div>
}

export default function Results() {
  const [report, setReport] = useState<any[]>([])
  const [myCharacter, setMyCharacter] = useState('')
  const [partnerCharacter, setPartnerCharacter] = useState('')
  const [partnerName, setPartnerName] = useState('Partner')
  const [showConfetti, setShowConfetti] = useState(false)
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})
  const confettiFired = useRef(false)

  const matches = report.filter(r => r.isMatch).length
  const totalAnswered = report.length
  const scorePercent = totalAnswered > 0 ? Math.round((matches / totalAnswered) * 100) : 0
  const displayScore = useCountUp(scorePercent)

  useEffect(() => {
    const myChar = localStorage.getItem('myCharacter') || 'baymax'
    setMyCharacter(myChar)
    setPartnerCharacter(myChar === 'baymax' ? 'toothless' : 'baymax')
    setPartnerName(localStorage.getItem('partnerName') || 'Partner')
    document.body.setAttribute('data-theme', myChar)

    const results = Object.entries(scenarioData).map(([key, scenario]) => {
      const saved = JSON.parse(localStorage.getItem(`scenario_${key}`) || '{}')
      if (!saved.myAnswer || !saved.partnerAnswer) return null
      const myIdx = scenario.options.findIndex(o => o.id === saved.myAnswer)
      const partnerIdx = scenario.options.findIndex(o => o.id === saved.partnerAnswer)
      const isMatch = saved.myAnswer === saved.partnerAnswer
      const char = characters[myChar]
      const bothLast = myIdx === scenario.options.length-1 && partnerIdx === scenario.options.length-1
      const reaction = bothLast ? char.reactions.hilarious
        : isMatch ? char.reactions.perfect
        : Math.abs(myIdx - partnerIdx) <= 1 ? char.reactions.good
        : char.reactions.mismatch
      return {
        key, name: scenario.name, emoji: scenario.emoji,
        myAnswer: scenario.options[myIdx]?.text,
        partnerAnswer: scenario.options[partnerIdx]?.text,
        isMatch, reaction,
        category: Object.entries(categoryGroups).find(([,g]) => g.ids.includes(key))?.[0] ?? 'other'
      }
    }).filter(Boolean)
    setReport(results)
  }, [])

  useEffect(() => {
    if (scorePercent >= 70 && !confettiFired.current && totalAnswered > 0) {
      confettiFired.current = true
      setTimeout(() => { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3500) }, 1000)
    }
  }, [scorePercent, totalAnswered])

  const myEmoji = myCharacter === 'baymax' ? '🤖' : '🐉'
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
        <h1 className="text-4xl font-serif font-bold mb-2" style={{ color: 'var(--text-main)' }}>Compatibility Report</h1>
        <p className="italic" style={{ color: 'var(--text-main)', opacity: 0.5 }}>You & {partnerName}</p>
      </motion.header>

      {totalAnswered > 0 && (
        <motion.div className="blueprint-card text-center mb-10" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}>
          <div className="text-8xl font-bold mb-2 score-number" style={{ color: 'var(--accent-sage)' }}>{displayScore}%</div>
          <ScoreTier score={scorePercent} />
          <p className="mt-3 text-sm" style={{ color: 'var(--text-main)', opacity: 0.45 }}>{matches} matches out of {totalAnswered} answered</p>
        </motion.div>
      )}

      {totalAnswered > 0 && (
        <motion.div className="blueprint-card mb-10" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="font-bold text-sm uppercase tracking-widest mb-4" style={{ color: 'var(--text-main)', opacity: 0.45 }}>By Category</h2>
          <div className="grid grid-cols-2 gap-3">
            {categoryScores.filter(c => c.answered > 0).map(cat => (
              <div key={cat.label} className="text-center">
                <div className="text-2xl mb-1">{cat.emoji}</div>
                <div className="font-bold" style={{ color: 'var(--accent-sage)' }}>{cat.score}%</div>
                <div className="text-xs" style={{ color: 'var(--text-main)', opacity: 0.5 }}>{cat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="space-y-6">
        {report.map((res: any, i: number) => (
          <motion.div key={i} className="blueprint-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04 }}>
            <h2 className="text-lg font-bold pb-2 mb-4 flex items-center gap-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', color: 'var(--text-main)' }}>
              <span>{res.emoji}</span> {res.name}
            </h2>
            <div className="flex justify-between mb-4 gap-4">
              <div className="flex-1">
                <p className="text-xs uppercase font-bold mb-1" style={{ color: 'var(--text-main)', opacity: 0.4 }}>You ({myEmoji})</p>
                <p className="font-semibold text-sm" style={{ color: 'var(--accent-sage)' }}>{res.myAnswer}</p>
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase font-bold mb-1" style={{ color: 'var(--text-main)', opacity: 0.4 }}>{partnerName} ({partnerEmoji})</p>
                {revealed[i]
                  ? <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-semibold text-sm" style={{ color: 'var(--accent-sage)' }}>{res.partnerAnswer}</motion.p>
                  : <button onClick={() => setRevealed(p => ({ ...p, [i]: true }))} className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: 'var(--accent-terra)', color: 'white' }}>🎉 Reveal</button>
                }
              </div>
            </div>
            <AnimatePresence>
              {revealed[i] && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                  className={`p-3 rounded-xl text-sm font-medium text-center ${res.isMatch ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {res.reaction}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {totalAnswered === 0 && (
        <div className="text-center py-12" style={{ color: 'var(--text-main)', opacity: 0.5 }}>
          <div className="text-5xl mb-4">🤔</div>
          <p className="text-lg">No completed scenarios yet — go answer some first!</p>
        </div>
      )}

      {totalAnswered > 0 && (
        <motion.div className="mt-12 blueprint-card text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
          <p className="text-xs uppercase font-bold mb-3" style={{ color: 'var(--text-main)', opacity: 0.4 }}>Share Your Score</p>
          <div className="text-4xl font-bold mb-1" style={{ color: 'var(--accent-sage)' }}>{scorePercent}%</div>
          <div className="text-lg font-semibold mb-1" style={{ color: 'var(--text-main)' }}>{myEmoji} You & {partnerName} {partnerEmoji}</div>
          <p className="text-sm" style={{ color: 'var(--text-main)', opacity: 0.45 }}>Life Scenarios · Compatibility Quest</p>
        </motion.div>
      )}

      <div className="mt-12 text-center">
        <Link href="/scenarios" className="font-bold" style={{ color: 'var(--text-main)', opacity: 0.4 }}>← Back to Scenarios</Link>
      </div>
    </main>
  )
}
