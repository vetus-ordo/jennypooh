'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { scenarioData, characters, categoryGroups } from '@/lib/data'
import { doc, onSnapshot } from 'firebase/firestore'
import { db } from '@/firebase'
import CharacterDisplay from '@/components/CharacterDisplay'
import VideoCharacter from '@/components/VideoCharacter'

// ─── Utilities ─────────────────────────────────────────────────────

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
  const hearts = ['❤️', '💚', '💜', '💛', '✨', '💖']
  if (!active) return null
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-center select-none"
          style={{
            fontSize: Math.random() * 14 + 10,
            left: `${Math.random() * 100}%`,
            top: -30,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, (Math.random() - 0.5) * 200],
            rotate: [0, (Math.random() - 0.5) * 360],
            opacity: [1, 0.9, 0],
          }}
          transition={{ duration: Math.random() * 2.5 + 2, delay: Math.random() * 1, ease: 'easeIn' }}
        >
          {hearts[i % hearts.length]}
        </motion.div>
      ))}
    </div>
  )
}

function ScoreTierBanner({ score }: { score: number }) {
  const [label, emoji, tierClass] =
    score >= 90 ? ['Soulmates',          '💍', 'tier-soulmates']
    : score >= 70 ? ['Pretty Aligned',   '💚', 'tier-aligned']
    : score >= 50 ? ['Work in Progress', '🛠️', 'tier-progress']
    : ['Opposites Attract',              '⚡', 'tier-opposites']
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3 }}
      className={`rounded-2xl px-6 py-4 text-center mt-4 ${tierClass}`}
    >
      <span className="text-3xl mr-2">{emoji}</span>
      <span className="text-2xl font-bold" style={{ color: 'var(--text-main)' }}>{label}</span>
    </motion.div>
  )
}

// Small static avatar — used only for 18px scenario-card labels
function CharAvatar({ character, size = 48 }: { character: string; size?: number }) {
  if (!character) return null
  return (
    <Image
      src={`/${character}.png`}
      alt={character}
      width={size}
      height={size}
      className="object-contain inline-block drop-shadow-lg"
    />
  )
}

// ─── Score-tier duo reaction header ─────────────────────────────────────────────
//  Both characters react together based on the weighted score.
//  Uses CharacterDisplay for all image-based reactions (handles float
//  natively, consistent asset map, correct -12px amplitude).
//  Videos reserved for <50 mismatch only — where the playful energy fits.
//
//  Asset map:
//    pre-reveal → baymax.png        + toothless.png         (static, suspenseful)
//    ≥90         → baymax-heart.gif  + toothless-lick.gif    (Soulmates)
//    ≥70         → baymax-dance.gif  + toothless-fly.gif     (Pretty Aligned)
//    ≥50         → baymax-wave.png   + toothless-fly.gif     (Work in Progress)
//    <50         → baymax-soccer.mp4 + toothless-smack.mp4  (Opposites Attract)
// ───────────────────────────────────────────────────────────────────
function DuoReaction({ score, ready }: { score: number; ready: boolean }) {
  // Pre-reveal: static PNGs, suspenseful 💌 separator
  if (!ready) {
    return (
      <div className="flex items-center justify-center gap-8 mb-4">
        <CharacterDisplay character="baymax" variant="static" size={84} floatLoop floatDelay={0} />
        <span className="text-4xl">💌</span>
        <CharacterDisplay character="toothless" variant="static" size={84} floatLoop floatDelay={1.5} mirrored />
      </div>
    )
  }

  // ≥90 — Soulmates: baymax-heart.gif + toothless-lick.gif
  if (score >= 90) {
    return (
      <div className="flex items-center justify-center gap-8 mb-4">
        <CharacterDisplay character="baymax" variant="heart" size={88} floatLoop floatDelay={0} />
        <span className="text-4xl">💍</span>
        <CharacterDisplay character="toothless" variant="lick" size={88} floatLoop floatDelay={1.5} mirrored />
      </div>
    )
  }

  // ≥70 — Pretty Aligned: baymax-dance.gif + toothless-fly.gif
  if (score >= 70) {
    return (
      <div className="flex items-center justify-center gap-8 mb-4">
        <CharacterDisplay character="baymax" variant="dance" size={88} floatLoop floatDelay={0} />
        <span className="text-4xl">💚</span>
        <CharacterDisplay character="toothless" variant="fly" size={88} floatLoop floatDelay={1.5} mirrored />
      </div>
    )
  }

  // ≥50 — Work in Progress: baymax-wave.png + toothless-fly.gif
  if (score >= 50) {
    return (
      <div className="flex items-center justify-center gap-8 mb-4">
        <CharacterDisplay character="baymax" variant="wave" size={88} floatLoop floatDelay={0} />
        <span className="text-4xl">🛠️</span>
        <CharacterDisplay character="toothless" variant="fly" size={88} floatLoop floatDelay={1.5} mirrored />
      </div>
    )
  }

  // <50 — Opposites Attract: baymax-soccer.mp4 + toothless-smack.mp4
  // Videos fit the playful mismatch energy; mirrored prop on VideoCharacter
  // replaces the previous caller-side <div style={scaleX(-1)}> workaround.
  return (
    <div className="flex items-center justify-center gap-8 mb-4">
      <VideoCharacter character="baymax" variant="soccer" size={88} floatLoop floatDelay={0} />
      <span className="text-4xl">⚡</span>
      <VideoCharacter character="toothless" variant="smack" size={88} floatLoop floatDelay={1.5} mirrored />
    </div>
  )
}

// ─── Main page ─────────────────────────────────────────────────────────────────

export default function Results() {
  const [myCharacter, setMyCharacter]           = useState('')
  const [partnerCharacter, setPartnerCharacter] = useState('')
  const [myName, setMyName]                     = useState('You')
  const [partnerName, setPartnerName]           = useState('Partner')

  const [myData, setMyData]           = useState<Record<string, any>>({})
  const [partnerData, setPartnerData] = useState<Record<string, any>>({})

  const [showConfetti, setShowConfetti] = useState(false)
  const [revealed, setRevealed]         = useState<Record<number, boolean>>({})
  const [scoreReady, setScoreReady]     = useState(false)
  const [countdown, setCountdown]       = useState<number | null>(null)
  const confettiFired = useRef(false)

  const triggerHaptic = () => {
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(50)
    }
  }

  useEffect(() => {
    const myChar = localStorage.getItem('myCharacter') || 'baymax'
    setMyCharacter(myChar)
    setPartnerCharacter(myChar === 'baymax' ? 'toothless' : 'baymax')
    setMyName(localStorage.getItem('myName') || 'You')
    setPartnerName(localStorage.getItem('partnerName') || 'Partner')

    // Always dual — results celebrate both characters equally
    document.body.setAttribute('data-theme', 'dual')

    const roomId = localStorage.getItem('roomId')
    const myRole = localStorage.getItem('userRole') || 'host'
    const pRole = myRole === 'host' ? 'client' : 'host'

    if (!roomId) return

    const unsubscribe = onSnapshot(doc(db, 'rooms', roomId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data()
        setMyData(data[myRole]?.answers || {})
        setPartnerData(data[pRole]?.answers || {})
      }
    })

    return () => unsubscribe()
  }, [])

  // ─── Weighted scoring ────────────────────────────────────────────────
  let totalPossiblePoints = 0
  let totalEarnedPoints   = 0
  let matches             = 0
  let myCorrectGuesses    = 0
  let partnerCorrectGuesses = 0

  type ReactionKey = 'perfect' | 'good' | 'mismatch' | 'hilarious'

  type MatchLevel = 'exact' | 'cross' | 'backup' | 'none'

  const report = Object.entries(scenarioData).map(([key, scenario]) => {
    const myAns = myData[key]
    const pAns  = partnerData[key]
    if (!myAns?.myAnswer || !pAns?.myAnswer) return null

    const myIdx      = scenario.options.findIndex(o => o.id === myAns.myAnswer)
    const partnerIdx = scenario.options.findIndex(o => o.id === pAns.myAnswer)

    // ─── Tiered matching ──────────────────────────────────────
    const isExactMatch = myAns.myAnswer === pAns.myAnswer
    const isCrossMatch = !isExactMatch && (
      (myAns.myAnswer === pAns.mySecondChoice) ||
      (myAns.mySecondChoice === pAns.myAnswer)
    )
    const isBackupMatch = !isExactMatch && !isCrossMatch &&
      myAns.mySecondChoice && pAns.mySecondChoice &&
      myAns.mySecondChoice === pAns.mySecondChoice

    const matchLevel: MatchLevel = isExactMatch ? 'exact'
      : isCrossMatch ? 'cross'
      : isBackupMatch ? 'backup'
      : 'none'

    if (isExactMatch) matches++

    const correctGuess = myAns.guessedPartnerAnswer === pAns.myAnswer
    if (correctGuess) myCorrectGuesses++
    if (pAns.guessedPartnerAnswer === myAns.myAnswer) partnerCorrectGuesses++

    const myImp   = Number(myAns.importance) || 3
    const pImp    = Number(pAns.importance)  || 3
    const avgImp  = (myImp + pImp) / 2

    totalPossiblePoints += avgImp
    if (isExactMatch)       totalEarnedPoints += avgImp
    else if (isCrossMatch)  totalEarnedPoints += avgImp * 0.5
    else if (isBackupMatch) totalEarnedPoints += avgImp * 0.25

    // 2nd choice text for display
    const my2ndIdx      = myAns.mySecondChoice ? scenario.options.findIndex(o => o.id === myAns.mySecondChoice) : -1
    const partner2ndIdx = pAns.mySecondChoice  ? scenario.options.findIndex(o => o.id === pAns.mySecondChoice)  : -1

    const bothLast = myIdx === scenario.options.length - 1 && partnerIdx === scenario.options.length - 1
    const reactionKey: ReactionKey =
      bothLast ? 'hilarious'
      : isExactMatch ? 'perfect'
      : (isCrossMatch || isBackupMatch) ? 'good'
      : 'mismatch'

    return {
      key, name: scenario.name, emoji: scenario.emoji, avgImp,
      myAnswerText:         scenario.options[myIdx]?.text,
      partnerAnswerText:    scenario.options[partnerIdx]?.text,
      my2ndText:            my2ndIdx >= 0 ? scenario.options[my2ndIdx]?.text : null,
      partner2ndText:       partner2ndIdx >= 0 ? scenario.options[partner2ndIdx]?.text : null,
      isMatch: isExactMatch, matchLevel, correctGuess, reactionKey,
      category: Object.entries(categoryGroups).find(([, g]) => g.ids.includes(key))?.[0] ?? 'other',
    }
  }).filter(Boolean)

  const totalAnswered        = report.length
  const totalScenarios       = Object.keys(scenarioData).length
  const partnerAnsweredCount = Object.keys(partnerData).length
  const weightedScorePercent = totalPossiblePoints > 0
    ? Math.round((totalEarnedPoints / totalPossiblePoints) * 100)
    : 0
  const displayScore = useCountUp(scoreReady ? weightedScorePercent : 0)

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
      setTimeout(() => { setShowConfetti(true); setTimeout(() => setShowConfetti(false), 4000) }, 1600)
    }
  }, [weightedScorePercent, totalAnswered, scoreReady])

  const categoryScores = Object.entries(categoryGroups).map(([key, group]) => {
    const cats        = report.filter((r: any) => r && r.category === key)
    const catPossible = cats.reduce((sum: number, r: any) => sum + (r?.avgImp || 0), 0)
    const catEarned   = cats.reduce((sum: number, r: any) => {
      if (!r) return sum
      const w = r.matchLevel === 'exact' ? 1 : r.matchLevel === 'cross' ? 0.5 : r.matchLevel === 'backup' ? 0.25 : 0
      return sum + (r.avgImp || 0) * w
    }, 0)
    return {
      ...group,
      score:    cats.length > 0 && catPossible > 0 ? Math.round((catEarned / catPossible) * 100) : null,
      answered: cats.length,
    }
  })

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <Confetti active={showConfetti} />

      {/* ── Header: both characters react to the score ── */}
      <motion.header className="text-center mb-12" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={scoreReady ? `ready-${weightedScorePercent}` : 'waiting'}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            <DuoReaction score={weightedScorePercent} ready={scoreReady} />
          </motion.div>
        </AnimatePresence>
        <h1 className="text-4xl font-bold mb-2" style={{ color: 'var(--text-main)' }}>Compatibility Report</h1>
        <p className="italic" style={{ color: 'var(--text-muted)' }}>{myName} &amp; {partnerName}</p>
      </motion.header>

      {/* ── Waiting banner ── */}
      {partnerAnsweredCount < totalScenarios && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
          className="mb-10 p-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse flex-shrink-0" />
          <p className="text-sm font-bold tracking-wide" style={{ color: 'var(--text-main)' }}>
            Sync Active. Waiting for {partnerName} to complete {totalScenarios - partnerAnsweredCount} more scenarios.
          </p>
        </motion.div>
      )}

      {/* ── Score countdown + number ── */}
      {totalAnswered > 0 && (
        <motion.div
          className="glass-card text-center mb-10 p-8"
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }}
        >
          <AnimatePresence mode="wait">
            {countdown !== null ? (
              <motion.div
                key={`cd-${countdown}`}
                initial={{ scale: 0.4, opacity: 0 }} animate={{ scale: 1.1, opacity: 1 }} exit={{ scale: 1.6, opacity: 0 }}
                transition={{ duration: 0.45 }}
                className="text-8xl font-bold py-6" style={{ color: 'var(--accent-base)' }}
              >
                {countdown}
              </motion.div>
            ) : (
              <motion.div key="score" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <div className="text-9xl font-bold mb-2 score-number" style={{ color: 'var(--accent-base)' }}>
                  {displayScore}%
                </div>
                <ScoreTierBanner score={weightedScorePercent} />
                <p className="mt-4 text-sm" style={{ color: 'var(--text-muted)' }}>
                  {matches} perfect {matches === 1 ? 'match' : 'matches'} • {report.filter((r: any) => r?.matchLevel === 'cross' || r?.matchLevel === 'backup').length} partial • Weighted by Importance
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}

      {/* ── Mind Reader cards ── */}
      {totalAnswered > 0 && (() => {
        const guessLabel = (correct: number, total: number) => {
          if (total === 0) return ''
          const pct = correct / total
          if (pct >= 0.7) return 'Mind reader!'
          if (pct >= 0.5) return 'Pretty intuitive'
          if (pct >= 0.3) return 'Getting there'
          return 'Mysterious to each other'
        }
        return (
        <motion.div
          className="flex gap-4 mb-10"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
        >
          <div className="flex-1 glass-card p-5 text-center">
            <div className="text-3xl mb-2">🔮</div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              {myName} → {partnerName}
            </p>
            <p className="text-2xl font-bold text-purple-400">{myCorrectGuesses} / {totalAnswered}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider mt-1.5" style={{ color: myCorrectGuesses / totalAnswered >= 0.5 ? 'var(--accent-sage)' : 'var(--text-muted)' }}>
              {guessLabel(myCorrectGuesses, totalAnswered)}
            </p>
          </div>
          <div className="flex-1 glass-card p-5 text-center">
            <div className="text-3xl mb-2">🧠</div>
            <p className="text-[10px] sm:text-xs font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>
              {partnerName} → {myName}
            </p>
            <p className="text-2xl font-bold text-purple-400">{partnerCorrectGuesses} / {totalAnswered}</p>
            <p className="text-[10px] font-bold uppercase tracking-wider mt-1.5" style={{ color: partnerCorrectGuesses / totalAnswered >= 0.5 ? 'var(--accent-sage)' : 'var(--text-muted)' }}>
              {guessLabel(partnerCorrectGuesses, totalAnswered)}
            </p>
          </div>
        </motion.div>
        )
      })()}

      {/* ── Category breakdown ── */}
      {totalAnswered > 0 && (
        <motion.div
          className="glass-card p-6 mb-10"
          initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
        >
          <h2 className="font-bold text-xs uppercase tracking-widest mb-5" style={{ color: 'var(--text-muted)' }}>By Category</h2>
          <div className="space-y-4">
            {categoryScores.filter(c => c.answered > 0).map((cat, i) => (
              <div key={cat.label}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                    <span>{cat.emoji}</span> {cat.label}
                  </span>
                  <div className="flex items-center gap-2">
                    {cat.score !== null && cat.score < 40 && (
                      <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded" style={{ background: 'rgba(255, 179, 71, 0.2)', color: '#FFB347' }}>
                        Worth discussing
                      </span>
                    )}
                    <span className="text-sm font-bold" style={{ color: cat.score !== null && cat.score < 40 ? '#FFB347' : 'var(--accent-base)' }}>{cat.score}%</span>
                  </div>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--bg-app)' }}>
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: cat.score !== null && cat.score < 40 ? '#FFB347' : 'var(--accent-base)' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.score}%` }}
                    transition={{ duration: 0.9, delay: 0.5 + i * 0.1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ── Reveal All + Scenario breakdown cards ── */}
      {totalAnswered > 0 && Object.keys(revealed).length < report.length && (
        <motion.div className="flex justify-end mb-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <button
            onClick={() => {
              triggerHaptic()
              const all: Record<number, boolean> = {}
              report.forEach((_: any, idx: number) => { all[idx] = true })
              setRevealed(all)
            }}
            className="text-xs font-bold px-4 py-2 rounded-lg transition-all border border-[var(--border-focus)] hover:bg-[var(--accent-base)] hover:text-black"
            style={{ color: 'var(--text-muted)' }}
          >
            Reveal All 🎉
          </button>
        </motion.div>
      )}
      <div className="space-y-6">
        {report.map((res: any, i: number) => {
          const matchBadge = res.matchLevel === 'exact'
            ? { label: 'Perfect Match', color: 'var(--accent-sage)' }
            : res.matchLevel === 'cross'
            ? { label: 'Partial Match', color: '#B68AFF' }
            : res.matchLevel === 'backup'
            ? { label: 'Backup Match', color: '#FFB347' }
            : { label: 'Mismatch', color: 'var(--text-muted)' }

          return (
          <motion.div
            key={res.key}
            className="glass-card p-6"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.04 }}
          >
            <div className="flex justify-between items-start mb-4 pb-3 border-b border-[var(--border-subtle)]">
              <h2 className="text-lg font-bold flex items-center gap-2 text-[var(--text-main)]">
                <span>{res.emoji}</span> {res.name}
              </h2>
              <div className="flex items-center gap-3">
                {revealed[i] && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full" style={{ background: matchBadge.color, color: '#080C14' }}>
                    {matchBadge.label}
                  </span>
                )}
                <Link href={`/scenarios/${res.key}`} className="text-xs text-[var(--text-muted)] hover:text-white underline">Edit</Link>
              </div>
            </div>

            <div className="flex justify-between mb-4 gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <CharAvatar character={myCharacter} size={18} />
                  <p className="text-xs uppercase font-bold" style={{ color: 'var(--text-muted)' }}>{myName}</p>
                </div>
                <p className="font-semibold text-sm" style={{ color: 'var(--accent-base)' }}>{res.myAnswerText}</p>
                {res.my2ndText && (
                  <p className="text-xs mt-1.5 flex items-center gap-1.5">
                    <span className="inline-block w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(182, 138, 255, 0.5)', color: '#fff', lineHeight: '16px', textAlign: 'center' }}>2</span>
                    <span style={{ color: 'var(--text-muted)' }}>{res.my2ndText}</span>
                  </p>
                )}
                {res.correctGuess && <p className="text-xs font-bold text-purple-400 mt-2">🔮 Guessed Correctly</p>}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-1.5 mb-1">
                  <CharAvatar character={partnerCharacter} size={18} />
                  <p className="text-xs uppercase font-bold" style={{ color: 'var(--text-muted)' }}>{partnerName}</p>
                </div>
                {revealed[i] ? (
                  <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                    <p className="font-semibold text-sm" style={{ color: 'var(--accent-base)' }}>{res.partnerAnswerText}</p>
                    {res.partner2ndText && (
                      <p className="text-xs mt-1.5 flex items-center gap-1.5">
                        <span className="inline-block w-4 h-4 rounded-full text-[8px] font-bold flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(182, 138, 255, 0.5)', color: '#fff', lineHeight: '16px', textAlign: 'center' }}>2</span>
                        <span style={{ color: 'var(--text-muted)' }}>{res.partner2ndText}</span>
                      </p>
                    )}
                  </motion.div>
                ) : (
                  <button
                    onClick={() => { triggerHaptic(); setRevealed(p => ({ ...p, [i]: true })) }}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg transition-all border border-[var(--border-focus)] hover:bg-[var(--accent-base)] hover:text-black"
                  >
                    🎉 Reveal
                  </button>
                )}
              </div>
            </div>

            {/* Both characters react simultaneously on reveal */}
            <AnimatePresence>
              {revealed[i] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="flex gap-2 justify-center flex-wrap pt-1"
                >
                  <div className="reaction-bubble reaction-bubble-baymax">
                    {characters.baymax.reactions[res.reactionKey as keyof typeof characters.baymax.reactions]}
                  </div>
                  <div className="reaction-bubble reaction-bubble-toothless">
                    {characters.toothless.reactions[res.reactionKey as keyof typeof characters.toothless.reactions]}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
          )
        })}
      </div>

      {/* ── Empty state ── */}
      {totalAnswered === 0 && (
        <div className="text-center py-16" style={{ color: 'var(--text-muted)' }}>
          <div className="flex justify-center mb-6">
            <CharacterDisplay character="baymax" variant="static" size={72} floatLoop floatDelay={0} />
            <span className="text-4xl mx-4 self-center">💌</span>
            <CharacterDisplay character="toothless" variant="static" size={72} floatLoop floatDelay={1.5} mirrored />
          </div>
          <p className="text-xl font-semibold mb-2" style={{ color: 'var(--text-main)' }}>Waiting for both players...</p>
          <p className="mb-1">{myName}: {Object.keys(myData).length}/{totalScenarios} completed</p>
          <p>{partnerName}: {partnerAnsweredCount}/{totalScenarios} completed</p>
          <Link href="/scenarios" className="btn-primary inline-block mt-6 text-base px-8 py-3">
            ← Back to Scenarios
          </Link>
        </div>
      )}

      {/* ── Share card ── */}
      {totalAnswered > 0 && (
        <motion.div
          className="mt-14 rounded-3xl overflow-hidden glass-card"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        >
          <div className="p-8 text-center bg-gradient-to-b from-transparent to-black/20">
            <p className="text-xs uppercase font-bold tracking-widest mb-5" style={{ color: 'var(--text-muted)' }}>Share Your Score</p>
            <div className="flex items-center justify-center gap-6 mb-3">
              <Image src="/baymax.png" alt="Baymax" width={56} height={56} className="object-contain drop-shadow-xl" />
              <span className="text-3xl">💌</span>
              <Image src="/toothless.png" alt="Toothless" width={56} height={56} className="object-contain drop-shadow-xl" style={{ transform: 'scaleX(-1)' }} />
            </div>
            <div className="text-6xl font-bold mb-2" style={{ color: 'var(--accent-base)' }}>{weightedScorePercent}%</div>
            <div className="text-xl font-bold mb-1" style={{ color: 'var(--text-main)' }}>{myName} &amp; {partnerName}</div>
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
