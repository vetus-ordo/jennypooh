'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import BaymaxSprite from './BaymaxSprite'

// ─── Timing constants ─────────────────────────────────────────
const BAYMAX_INITIAL_DELAY: [number, number]    = [8, 15]   // seconds range before first appearance
const BAYMAX_INTERVAL: [number, number]         = [25, 50]  // seconds between appearances
const BAYMAX_CROSS_DURATION: [number, number]   = [18, 25]  // seconds to cross viewport

const TOOTHLESS_INITIAL_DELAY: [number, number] = [15, 25]
const TOOTHLESS_INTERVAL: [number, number]      = [30, 60]
const TOOTHLESS_CROSS_DURATION: [number, number] = [12, 18]

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

export default function WanderingCharacters() {
  const [isMobile, setIsMobile] = useState(true) // default true to avoid SSR flash
  const [reducedMotion, setReducedMotion] = useState(false)

  // Baymax state
  const [baymaxActive, setBaymaxActive] = useState(false)
  const [baymaxDir, setBaymaxDir] = useState<'ltr' | 'rtl'>('ltr')
  const baymaxTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const baymaxCross = useRef(rand(...BAYMAX_CROSS_DURATION))

  // Toothless state
  const [toothlessActive, setToothlessActive] = useState(false)
  const [toothlessDir, setToothlessDir] = useState<'rtl' | 'ltr'>('rtl')
  const [toothlessY, setToothlessY] = useState(15)
  const toothlessTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toothlessCross = useRef(rand(...TOOTHLESS_CROSS_DURATION))

  // ── Media queries ──
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const rmq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setIsMobile(mq.matches)
    setReducedMotion(rmq.matches)
    const onMobile = (e: MediaQueryListEvent) => setIsMobile(e.matches)
    const onMotion = (e: MediaQueryListEvent) => setReducedMotion(e.matches)
    mq.addEventListener('change', onMobile)
    rmq.addEventListener('change', onMotion)
    return () => { mq.removeEventListener('change', onMobile); rmq.removeEventListener('change', onMotion) }
  }, [])

  // ── Pause when tab hidden ──
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        setBaymaxActive(false)
        setToothlessActive(false)
        if (baymaxTimer.current) clearTimeout(baymaxTimer.current)
        if (toothlessTimer.current) clearTimeout(toothlessTimer.current)
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  const disabled = isMobile || reducedMotion

  // ── Schedule helpers ──
  const scheduleBaymax = useCallback((delay?: number) => {
    if (baymaxTimer.current) clearTimeout(baymaxTimer.current)
    const ms = (delay ?? rand(...BAYMAX_INTERVAL)) * 1000
    baymaxTimer.current = setTimeout(() => {
      const dir = Math.random() > 0.5 ? 'ltr' : 'rtl' as const
      setBaymaxDir(dir)
      baymaxCross.current = rand(...BAYMAX_CROSS_DURATION)
      setBaymaxActive(true)
    }, ms)
  }, [])

  const scheduleToothless = useCallback((delay?: number) => {
    if (toothlessTimer.current) clearTimeout(toothlessTimer.current)
    const ms = (delay ?? rand(...TOOTHLESS_INTERVAL)) * 1000
    toothlessTimer.current = setTimeout(() => {
      const dir = Math.random() > 0.5 ? 'ltr' : 'rtl' as const
      setToothlessDir(dir)
      setToothlessY(8 + Math.random() * 22)
      toothlessCross.current = rand(...TOOTHLESS_CROSS_DURATION)
      setToothlessActive(true)
    }, ms)
  }, [])

  // ── Kick off initial appearances ──
  useEffect(() => {
    if (disabled) return
    scheduleBaymax(rand(...BAYMAX_INITIAL_DELAY))
    scheduleToothless(rand(...TOOTHLESS_INITIAL_DELAY))
    return () => {
      if (baymaxTimer.current) clearTimeout(baymaxTimer.current)
      if (toothlessTimer.current) clearTimeout(toothlessTimer.current)
    }
  }, [disabled, scheduleBaymax, scheduleToothless])

  // ── Completion handlers ──
  const onBaymaxDone = useCallback(() => {
    setBaymaxActive(false)
    if (!document.hidden) scheduleBaymax()
  }, [scheduleBaymax])

  const onToothlessDone = useCallback(() => {
    setToothlessActive(false)
    if (!document.hidden) scheduleToothless()
  }, [scheduleToothless])

  if (disabled) return null

  const BAYMAX_SIZE = 70
  const TOOTHLESS_SIZE = 54

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      {/* ── BAYMAX: walks along the bottom ── */}
      <AnimatePresence>
        {baymaxActive && (
          <motion.div
            key={`bx-${Date.now()}`}
            initial={{ x: baymaxDir === 'ltr' ? -100 : 'calc(100vw + 100px)' }}
            animate={{ x: baymaxDir === 'ltr' ? 'calc(100vw + 100px)' : -100 }}
            transition={{ duration: baymaxCross.current, ease: 'linear' }}
            onAnimationComplete={onBaymaxDone}
            style={{ position: 'absolute', bottom: 8, opacity: 0.35 }}
          >
            <BaymaxSprite
              size={BAYMAX_SIZE}
              mirrored={baymaxDir === 'rtl'}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOOTHLESS: flies across the upper area ── */}
      <AnimatePresence>
        {toothlessActive && (
          <motion.div
            key={`tl-${Date.now()}`}
            initial={{ x: toothlessDir === 'ltr' ? -80 : 'calc(100vw + 80px)' }}
            animate={{
              x: toothlessDir === 'ltr' ? 'calc(100vw + 80px)' : -80,
              y: [0, -18, 8, -12, 0],
            }}
            transition={{
              x: { duration: toothlessCross.current, ease: 'linear' },
              y: { duration: 3, repeat: Infinity, ease: 'easeInOut' },
            }}
            onAnimationComplete={onToothlessDone}
            style={{
              position: 'absolute',
              top: `${toothlessY}%`,
              opacity: 0.3,
            }}
          >
            <Image
              src="/toothless-fly.gif"
              alt=""
              width={TOOTHLESS_SIZE}
              height={TOOTHLESS_SIZE}
              className="object-contain"
              unoptimized
              style={{
                transform: toothlessDir === 'ltr' ? 'scaleX(-1)' : undefined,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
