'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { scenarioData, characters, categoryGroups } from '@/lib/data'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase'

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
  const colors = ['#00E5C8', '#4FC3F7', '#3A85C8', '#FF6B6B', '#FFD700', '#7B5EA7']
  if (!active) return null
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 48 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-sm"
          style={{ width: Math.random() * 10 + 6, height: Math.random() * 10 + 6, background: colors[i % colors.length], left: `${Math.random() * 100}%`, top: -20 }}
          animate={{ y: ['0vh', '115vh'], x: [0, (Math.random() - 0.5) * 260], rotate: [0, Math.random() * 720], opacity: [1, 0.8, 0] }}
          transition={{ duration: Math.random() * 2 + 1.5, delay: Math.random() * 0.8, ease: 'easeIn' }}
        />
      ))}
    </div>
  )
}

function ScoreTierBanner({ score }: { score: number }) {
  const [label, emoji, tierClass] =
    score >= 90 ? ['Soulmates', '💍', 'tier-soulmates']
    : score >= 70 ? ['Pretty Aligned', '💚', 'tier-aligned']
    : score >= 50 ? ['Work in Progress', '🛠️', 'tier-progress']
    : ['Opposites Attract', '⚡', 'tier-opposites']
  return (
    <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }} className={`rounded-2xl px-6 py-4 text-center mt-4 ${tierClass}`}>
      <span className="text-3xl mr-2">{emoji}</span>
      <span className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>{label}</span>
    </motion.div>
  )
}

function CharAvatar({ character, size = 48, animated = false }: { character: string; size?: number; animated?: boolean }) {
  if (!character) return null
  let source = `/${character}.png`
  if (animated) source = character === 'baymax' ? '/baymax-heart.gif' : '/toothless-lick.gif'
  return <Image src={source} alt={character} width={size} height={size} className={`object-contain inline-block ${animated ? 'drop-shadow-2xl' : 'drop-shadow-lg'}`} unoptimized={animated} />
}

export default function Results() {
  const [myCharacter, setMyCharacter] = useState('')
  const [partnerCharacter, setPartnerCharacter] = useState('')
  const [partnerName, setPartnerName] = useState('Partner')
  
  // Real-time Data State
  const [myData, setMyData] = useState<Record<string, any>>({})
  const [partnerData, setPartnerData] = useState<Record<string, any>>({})
  
  const [showConfetti, setShowConfetti] = useState(false)
  const [revealed, setRevealed] = useState<Record<number, boolean>>({})
  const [scoreReady, setScoreReady] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)
  const confettiFired = useRef(false)

  // 1. Setup Listeners
  useEffect(() => {
    const myChar = localStorage.getItem('myCharacter') || 'baymax'
    const pName = localStorage.getItem('partnerName') || 'Partner'
    const roomId = localStorage.getItem('roomId')
    const myRole = localStorage.getItem('userRole') || 'host'
    const pRole = myRole === 'host' ? 'client' : 'host'

    setMyCharacter(myChar)
    setPartnerCharacter(myChar === 'baymax' ? 'toothless' : 'baymax')
    setPartnerName(pName)
    document.body.setAttribute('data-theme', myChar)

    if (!roomId) return;

    // 🚀 REAL-TIME FIREBASE SYNC
    const unsubscribe = onSnapshot(doc(db, "rooms", roomId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setMyData(data[myRole]?.answers || {});
        setPartnerData(data[pRole]?.answers || {});
      }
    });

    return () => unsubscribe();
  }, [])

  // 2. Data Calculation (Weighted Math & Guesses)
  let totalPossiblePoints = 0;
  let totalEarnedPoints = 0;
  let matches = 0;
  let myCorrectGuesses = 0;
  let partnerCorrectGuesses = 0;

  const report = Object.entries(scenarioData).map(([key, scenario]) => {
    const myAns = myData[key];
    const pAns = partnerData[key];
    
    // Only calculate if BOTH people have answered this specific question
    if (!myAns?.myAnswer || !pAns?.myAnswer) return null;

    const myIdx = scenario.options.findIndex(o => o.id === myAns.myAnswer)
    const partnerIdx = scenario.options.findIndex(o => o.id === pAns.myAnswer)
    const isMatch = myAns.myAnswer === pAns.myAnswer
    
    if (isMatch) matches++;

    // Guess Accuracy Logic
    if (myAns.guessedPartnerAnswer === pAns.myAnswer) myCorrectGuesses++;
    if (pAns.guessedPartnerAnswer === myAns.myAnswer) partnerCorrectGuesses++;

    // Importance Weighting Logic (Average of both your stakes)
    const myImp = Number(myAns.importance) || 3;
    const pImp = Number(pAns.importance) || 3;
    const avgImp = (myImp + pImp) / 2;

    totalPossiblePoints += avgImp;
    if (isMatch) totalEarnedPoints += avgImp;

    // Reaction Logic
    const char = characters[myCharacter]
    const bothLast = myIdx === scenario.options.length - 1 && partnerIdx === scenario.options.length - 1
    const reaction = bothLast ? char.reactions.hilarious
      : isMatch ? char.reactions.perfect
      : Math.abs(myIdx - partnerIdx) <= 1 ? char.reactions.good
      : char.reactions.mismatch

    return {
      key, name: scenario.name, emoji: scenario.emoji, avgImp,
      myAnswerText: scenario.options[myIdx]?.text,
      partnerAnswerText: scenario.options[partnerIdx]?.text,
      isMatch, reaction,
      category: Object.entries(categoryGroups).find(([, g]) => g.ids.includes(key))?.[0] ?? 'other',
    }
  }).filter(Boolean)

  const totalAnswered = report.length
  const totalScenarios = Object.keys(scenarioData).length
  const partnerAnsweredCount = Object.keys(partnerData).length
  
  // Calculate final weighted score
  const weightedScorePercent = totalPossiblePoints > 0 ? Math.round((totalEarnedPoints / totalPossiblePoints) * 100) : 0
  const displayScore = useCountUp(scoreReady ? weightedScorePercent : 0)

  // 3. UI Effects
  useEffect(() => {
    if (totalAnswered === 0) return
    let n = 3
    setCountdown(n)
    const tick = setInterval(() => {
      n--
      if (n <= 0) { clearInterval(tick); setCountdown(null); setScoreReady(true) }
      else setCountdown(n)
    }, 700)
    return () => clearInterval(tick)
  }, [totalAnswered])

  useEffect(() => {
    if (weightedScorePercent >= 70 && !confettiFired.current && totalAnswered > 0 && scoreReady) {
      confettiFired.current = true
      setTimeout(() => { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 3500) }, 400)
    }
  }, [weightedScorePercent, totalAnswered, scoreReady])

  const shareCardBg = myCharacter === 'toothless' ? 'linear-gradient(135deg, #080C14 0%, #0D1B2E 100%)' : 'linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%)'

  // TypeScript Fix: Explicitly type `r: any` and use optional chaining `?.` so the compiler stops complaining
  const categoryScores = Object.entries(categoryGroups).map(([key, group]) => {
    const cats = report.filter((r: any) => r && r.category === key)
    const catPossible = cats.reduce((sum: number, r: any) => sum + (r?.avgImp || 0), 0);
    const catEarned = cats.reduce((sum: number, r: any) => r?.isMatch ? sum + (r?.avgImp || 0) : sum, 0);
    return {
      ...group,
      score: cats.length > 0 && catPossible > 0 ? Math.round((catEarned / catPossible) * 100) : null,
      answered: cats.length,
    }
  })

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <Confetti active={showConfetti} />

      <motion.header className="text-center mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-center gap-4 mb-4">
          <CharAvatar character={myCharacter} size={84} animated={true} />
          <span className="text-4xl">💌</span>
          <CharAvatar character={partnerCharacter} size={84} animated={true} />
        </div>
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>Compatibility Report</h1>
        <p className="italic" style={{ color: 'var(--text-muted)' }}>You & {partnerName}</p>
      </motion.header>

      {/* THE WAITING STATE BANNER */}
      {partnerAnsweredCount < totalScenarios && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="mb-10 p-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg" style={{ background: 'var(--bg-card)', border: '1px solid var(--glass-border)' }}>
          <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
          <p className="text-sm font-bold tracking-wide" style={{ color: 'var(--text-main)' }}>
            Sync Active. Waiting for {partnerName} to complete {totalScenarios - partnerAnsweredCount} more scenarios.
          </p>
        </motion.div>
      )}

      {totalAnswered > 0 && (
        <motion.div className="blueprint-card text-center mb-10" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}>
          <AnimatePresence mode="wait">
            {countdown !== null ? (
              <motion.div key={`cd-${countdown}`} initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1.1, opacity: 1 }} exit={{ scale: 1.6, opacity: 0 }} transition={{ duration: 0.45 }} className="text-8xl font-bold py-6" style={{ color: 'var(--accent-sage)' }}>
                {countdown}
              </motion.div>
            ) : (
              <motion.div key="score" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-9xl font-bold mb-2 score-number" style={{ color: 'var(--accent-sage)' }}>
                  {displayScore}%
                </div>
                <ScoreTierBanner score={weightedScorePercent} />
                <p className="mt-4 text-sm font-semibold" style={{ color: 'var(--text-muted)' }}>
                  {matches} matches • Weighted by Importance
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* NEW MIND READER CARDS (GUESS ACCURACY) */}
      {totalAnswered > 0 && (
        <motion.div className="flex gap-4 mb-10" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="flex-1 blueprint-card p-5 text-center">
            <div className="text-3xl mb-2">🔮</div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>You Predicted Her</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--accent-purple, #B68AFF)' }}>{myCorrectGuesses} / {totalAnswered}</p>
          </div>
          <div className="flex-1 blueprint-card p-5 text-center">
            <div className="text-3xl mb-2">🧠</div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>She Predicted You</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--accent-purple, #B68AFF)' }}>{partnerCorrectGuesses} / {totalAnswered}</p>
          </div>
        </motion.div>
      )}

      {totalAnswered > 0 && (
        <motion.div className="blueprint-card mb-10" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <h2 className="font-bold text-xs uppercase tracking-widest mb-5" style={{ color: 'var(--text-muted)' }}>By Category</h2>
          <div className="space-y-4">
            {categoryScores.filter(c => c.answered > 0).map((cat, i) => (
              <div key={cat.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-main)' }}><span>{cat.emoji}</span> {cat.label}</span>
                  <span className="text-sm font-bold" style={{ color: 'var(--accent-sage)' }}>{cat.score}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(128,128,128,0.12)' }}>
                  <motion.div className="h-full rounded-full" style={{ background: 'var(--accent-sage)' }} initial={{ width: 0 }} animate={{ width: `${cat.score}%` }} transition={{ duration: 0.9, delay: 0.5 + i * 0.1, ease: 'easeOut' }} />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div className="space-y-6">
        {report.map((res: any, i: number) => (
          <motion.div key={res.key} className="blueprint-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04 }}>
            <h2 className="text-lg font-bold pb-3 mb-4 flex items-center gap-2" style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-main)' }}>
              <span>{res.emoji}</span> {res.name}
            </h2>
            <div className="flex justify-between mb-4 gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <CharAvatar character={myCharacter} size={18} />
                  <p className="text-xs uppercase font-bold" style={{ color: 'var(--text-muted)' }}>You</p>
                </div>
                <p className="font-semibold text-sm" style={{ color: 'var(--accent-sage)' }}>{res.myAnswerText}</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <CharAvatar character={partnerCharacter} size={18} />
                  <p className="text-xs uppercase font-bold" style={{ color: 'var(--text-muted)' }}>{partnerName}</p>
                </div>
                {revealed[i] ? (
                  <motion.p initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="font-semibold text-sm" style={{ color: 'var(--accent-sage)' }}>
                    {res.partnerAnswerText}
                  </motion.p>
                ) : (
                  <button onClick={() => setRevealed(p => ({ ...p, [i]: true }))} className="text-xs font-bold px-3 py-1 rounded-full transition-all hover:scale-105" style={{ background: 'var(--accent-terra)', color: myCharacter === 'toothless' ? '#080C14' : 'white' }}>
                    🎉 Reveal
                  </button>
                )}
              </div>
            </div>
            <AnimatePresence>
              {revealed[i] && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={`p-3 rounded-xl text-sm font-semibold text-center ${res.isMatch ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
                  {res.reaction}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {totalAnswered === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
          <div className="text-6xl mb-5">📡</div>
          <p className="text-xl font-semibold mb-2" style={{ color: 'var(--text-main)' }}>Diagnostic Bay Empty</p>
          <p>Once you and {partnerName} synchronize data, the report will compile here.</p>
        </div>
      )}

      {totalAnswered > 0 && (
        <motion.div className="mt-14 rounded-3xl overflow-hidden" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }} style={{ background: shareCardBg, border: '1px solid var(--border)', boxShadow: 'var(--card-shadow)' }}>
          <div className="p-8 text-center">
            <p className="text-xs uppercase font-bold tracking-widest mb-5" style={{ color: 'var(--text-muted)' }}>Share Your Score</p>
            <div className="flex items-center justify-center gap-4 mb-3">
              <CharAvatar character={myCharacter} size={56} />
              <span className="text-3xl">💌</span>
              <CharAvatar character={partnerCharacter} size={56} />
            </div>
            <div className="text-6xl font-bold mb-2" style={{ color: 'var(--accent-sage)' }}>{weightedScorePercent}%</div>
            <div className="text-xl font-bold mb-1" style={{ color: 'var(--text-main)' }}>You & {partnerName}</div>
            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>jennypooh · Life Scenarios</p>
          </div>
        </motion.div>
      )}

      <div className="mt-10 text-center">
        <Link href="/scenarios" className="font-bold transition-opacity hover:opacity-60" style={{ color: 'var(--text-muted)' }}>← Back to Hub</Link>
      </div>
    </main>
  )
}