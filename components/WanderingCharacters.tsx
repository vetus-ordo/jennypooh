'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import BaymaxSprite from './BaymaxSprite'
import SpriteSheet from './SpriteSheet'

// ─── Timing constants (generous frequency — don't be sparing) ────────
const BAYMAX_INITIAL_DELAY: [number, number]      = [2, 5]
const BAYMAX_INTERVAL: [number, number]            = [8, 18]
const BAYMAX_CROSS_DURATION: [number, number]      = [18, 25]

const TOOTHLESS_INITIAL_DELAY: [number, number]    = [3, 8]
const TOOTHLESS_INTERVAL: [number, number]         = [10, 22]
const TOOTHLESS_CROSS_DURATION: [number, number]   = [12, 18]

const LIGHT_FURY_INITIAL_DELAY: [number, number]   = [5, 10]
const LIGHT_FURY_INTERVAL: [number, number]        = [12, 25]
const LIGHT_FURY_CROSS_DURATION: [number, number]  = [14, 22]

const PEEK_INITIAL_DELAY: [number, number]         = [4, 10]
const PEEK_INTERVAL: [number, number]              = [14, 28]
const PEEK_HOLD_DURATION: [number, number]         = [2.5, 5]

const COMPANION_INITIAL_DELAY: [number, number]    = [10, 18]
const COMPANION_INTERVAL: [number, number]         = [16, 30]
const COMPANION_CROSS_DURATION: [number, number]   = [10, 16]

function rand(min: number, max: number) {
  return min + Math.random() * (max - min)
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// ─── Sprite definitions (all 384×216 per frame) ──────────────
const TOOTHLESS_SPRITES = [
  { src: '/toothless-flapping-sprite.png', frameCount: 46 },
  { src: '/toothless-wings-sprite.png',    frameCount: 66 },
]

const LIGHT_FURY_SPRITES = [
  { src: '/light-fury-sprite.png',   frameCount: 38 },
  { src: '/light-fury-2-sprite.png', frameCount: 34 },
  { src: '/light-fury-3-sprite.png', frameCount: 27 },
  { src: '/light-fury-4-sprite.png', frameCount: 68 },
]

const FACE_SPRITES = [
  { src: '/toothless-face-sprite.png',   frameCount: 8 },
  { src: '/toothless-face-2-sprite.png', frameCount: 28 },
  { src: '/toothless-face-3-sprite.png', frameCount: 20 },
  { src: '/toothless-face-4-sprite.png', frameCount: 31 },
]

// Combined pool for the companion flyer — any dragon can appear
const ALL_FLYING_SPRITES = [...TOOTHLESS_SPRITES, ...LIGHT_FURY_SPRITES]

const SPRITE_FRAME_W = 384
const SPRITE_FRAME_H = 216

export default function WanderingCharacters() {
  const [isMobile, setIsMobile] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  // ── Baymax state ──
  const [baymaxActive, setBaymaxActive] = useState(false)
  const [baymaxDir, setBaymaxDir] = useState<'ltr' | 'rtl'>('ltr')
  const baymaxTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const baymaxCross = useRef(rand(...BAYMAX_CROSS_DURATION))

  // ── Toothless state ──
  const [toothlessActive, setToothlessActive] = useState(false)
  const [toothlessDir, setToothlessDir] = useState<'ltr' | 'rtl'>('rtl')
  const [toothlessY, setToothlessY] = useState(15)
  const [toothlessSprite, setToothlessSprite] = useState(TOOTHLESS_SPRITES[0])
  const toothlessTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const toothlessCross = useRef(rand(...TOOTHLESS_CROSS_DURATION))

  // ── Light Fury state ──
  const [lightFuryActive, setLightFuryActive] = useState(false)
  const [lightFuryDir, setLightFuryDir] = useState<'ltr' | 'rtl'>('ltr')
  const [lightFuryY, setLightFuryY] = useState(20)
  const [lightFurySprite, setLightFurySprite] = useState(LIGHT_FURY_SPRITES[0])
  const lightFuryTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lightFuryCross = useRef(rand(...LIGHT_FURY_CROSS_DURATION))

  // ── Face peek state ──
  const [peekActive, setPeekActive] = useState(false)
  const [peekX, setPeekX] = useState(50)
  const [peekSprite, setPeekSprite] = useState(FACE_SPRITES[0])
  const [peekHold, setPeekHold] = useState(3)
  const peekTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  // ── Companion flyer state ──
  const [companionActive, setCompanionActive] = useState(false)
  const [companionDir, setCompanionDir] = useState<'ltr' | 'rtl'>('rtl')
  const [companionY, setCompanionY] = useState(30)
  const [companionSprite, setCompanionSprite] = useState(ALL_FLYING_SPRITES[0])
  const companionTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const companionCross = useRef(rand(...COMPANION_CROSS_DURATION))

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

  // Reduced motion still disables; mobile now allowed
  const disabled = reducedMotion

  // ── Schedule helpers ──
  const scheduleBaymax = useCallback((delay?: number) => {
    if (baymaxTimer.current) clearTimeout(baymaxTimer.current)
    const ms = (delay ?? rand(...BAYMAX_INTERVAL)) * 1000
    baymaxTimer.current = setTimeout(() => {
      setBaymaxDir(Math.random() > 0.5 ? 'ltr' : 'rtl')
      baymaxCross.current = rand(...BAYMAX_CROSS_DURATION)
      setBaymaxActive(true)
    }, ms)
  }, [])

  const scheduleToothless = useCallback((delay?: number) => {
    if (toothlessTimer.current) clearTimeout(toothlessTimer.current)
    const ms = (delay ?? rand(...TOOTHLESS_INTERVAL)) * 1000
    toothlessTimer.current = setTimeout(() => {
      setToothlessDir(Math.random() > 0.5 ? 'ltr' : 'rtl')
      setToothlessY(8 + Math.random() * 22)
      setToothlessSprite(pick(TOOTHLESS_SPRITES))
      toothlessCross.current = rand(...TOOTHLESS_CROSS_DURATION)
      setToothlessActive(true)
    }, ms)
  }, [])

  const scheduleLightFury = useCallback((delay?: number) => {
    if (lightFuryTimer.current) clearTimeout(lightFuryTimer.current)
    const ms = (delay ?? rand(...LIGHT_FURY_INTERVAL)) * 1000
    lightFuryTimer.current = setTimeout(() => {
      setLightFuryDir(Math.random() > 0.5 ? 'ltr' : 'rtl')
      setLightFuryY(10 + Math.random() * 25)
      setLightFurySprite(pick(LIGHT_FURY_SPRITES))
      lightFuryCross.current = rand(...LIGHT_FURY_CROSS_DURATION)
      setLightFuryActive(true)
    }, ms)
  }, [])

  const schedulePeek = useCallback((delay?: number) => {
    if (peekTimer.current) clearTimeout(peekTimer.current)
    const ms = (delay ?? rand(...PEEK_INTERVAL)) * 1000
    peekTimer.current = setTimeout(() => {
      setPeekX(10 + Math.random() * 80) // 10%–90% from left
      setPeekSprite(pick(FACE_SPRITES))
      setPeekHold(rand(...PEEK_HOLD_DURATION))
      setPeekActive(true)
    }, ms)
  }, [])

  const scheduleCompanion = useCallback((delay?: number) => {
    if (companionTimer.current) clearTimeout(companionTimer.current)
    const ms = (delay ?? rand(...COMPANION_INTERVAL)) * 1000
    companionTimer.current = setTimeout(() => {
      setCompanionDir(Math.random() > 0.5 ? 'ltr' : 'rtl')
      setCompanionY(5 + Math.random() * 30)
      setCompanionSprite(pick(ALL_FLYING_SPRITES))
      companionCross.current = rand(...COMPANION_CROSS_DURATION)
      setCompanionActive(true)
    }, ms)
  }, [])

  // ── Kick off initial appearances ──
  useEffect(() => {
    if (disabled) return
    scheduleBaymax(rand(...BAYMAX_INITIAL_DELAY))
    scheduleToothless(rand(...TOOTHLESS_INITIAL_DELAY))
    scheduleLightFury(rand(...LIGHT_FURY_INITIAL_DELAY))
    schedulePeek(rand(...PEEK_INITIAL_DELAY))
    scheduleCompanion(rand(...COMPANION_INITIAL_DELAY))
    return () => {
      if (baymaxTimer.current) clearTimeout(baymaxTimer.current)
      if (toothlessTimer.current) clearTimeout(toothlessTimer.current)
      if (lightFuryTimer.current) clearTimeout(lightFuryTimer.current)
      if (peekTimer.current) clearTimeout(peekTimer.current)
      if (companionTimer.current) clearTimeout(companionTimer.current)
    }
  }, [disabled, scheduleBaymax, scheduleToothless, scheduleLightFury, schedulePeek, scheduleCompanion])

  // ── Pause when tab hidden, resume when visible ──
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        setBaymaxActive(false)
        setToothlessActive(false)
        setLightFuryActive(false)
        setPeekActive(false)
        setCompanionActive(false)
        if (baymaxTimer.current) clearTimeout(baymaxTimer.current)
        if (toothlessTimer.current) clearTimeout(toothlessTimer.current)
        if (lightFuryTimer.current) clearTimeout(lightFuryTimer.current)
        if (peekTimer.current) clearTimeout(peekTimer.current)
        if (companionTimer.current) clearTimeout(companionTimer.current)
      } else if (!disabled) {
        scheduleBaymax(rand(...BAYMAX_INITIAL_DELAY))
        scheduleToothless(rand(...TOOTHLESS_INITIAL_DELAY))
        scheduleLightFury(rand(...LIGHT_FURY_INITIAL_DELAY))
        schedulePeek(rand(...PEEK_INITIAL_DELAY))
        scheduleCompanion(rand(...COMPANION_INITIAL_DELAY))
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [disabled, scheduleBaymax, scheduleToothless, scheduleLightFury, schedulePeek, scheduleCompanion])

  // ── Completion handlers ──
  const onBaymaxDone = useCallback(() => {
    setBaymaxActive(false)
    if (!document.hidden) scheduleBaymax()
  }, [scheduleBaymax])

  const onToothlessDone = useCallback(() => {
    setToothlessActive(false)
    if (!document.hidden) scheduleToothless()
  }, [scheduleToothless])

  const onLightFuryDone = useCallback(() => {
    setLightFuryActive(false)
    if (!document.hidden) scheduleLightFury()
  }, [scheduleLightFury])

  const onPeekDone = useCallback(() => {
    setPeekActive(false)
    if (!document.hidden) schedulePeek()
  }, [schedulePeek])

  const onCompanionDone = useCallback(() => {
    setCompanionActive(false)
    if (!document.hidden) scheduleCompanion()
  }, [scheduleCompanion])

  if (disabled) return null

  // Responsive sizes — 3× original, smaller on mobile
  const BAYMAX_SIZE     = isMobile ? 135 : 210
  const TOOTHLESS_SIZE  = isMobile ? 120 : 192
  const LIGHT_FURY_SIZE = isMobile ? 114 : 180
  const PEEK_SIZE       = isMobile ? 132 : 192
  const COMPANION_SIZE  = isMobile ? 100 : 160

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
            style={{ position: 'absolute', bottom: 8, opacity: 0.45 }}
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
            initial={{ x: toothlessDir === 'ltr' ? -100 : 'calc(100vw + 100px)' }}
            animate={{
              x: toothlessDir === 'ltr' ? 'calc(100vw + 100px)' : -100,
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
              opacity: 0.4,
            }}
          >
            <SpriteSheet
              src={toothlessSprite.src}
              frameWidth={SPRITE_FRAME_W}
              frameHeight={SPRITE_FRAME_H}
              frameCount={toothlessSprite.frameCount}
              fps={14}
              size={TOOTHLESS_SIZE}
              mirrored={toothlessDir === 'ltr'}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── LIGHT FURY: glides through the mid-upper area ── */}
      <AnimatePresence>
        {lightFuryActive && (
          <motion.div
            key={`lf-${Date.now()}`}
            initial={{ x: lightFuryDir === 'ltr' ? -100 : 'calc(100vw + 100px)' }}
            animate={{
              x: lightFuryDir === 'ltr' ? 'calc(100vw + 100px)' : -100,
              y: [0, -14, 6, -10, 0],
            }}
            transition={{
              x: { duration: lightFuryCross.current, ease: 'linear' },
              y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
            }}
            onAnimationComplete={onLightFuryDone}
            style={{
              position: 'absolute',
              top: `${lightFuryY}%`,
              opacity: 0.38,
            }}
          >
            <SpriteSheet
              src={lightFurySprite.src}
              frameWidth={SPRITE_FRAME_W}
              frameHeight={SPRITE_FRAME_H}
              frameCount={lightFurySprite.frameCount}
              fps={12}
              size={LIGHT_FURY_SIZE}
              mirrored={lightFuryDir === 'rtl'}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── COMPANION: extra flyer (any dragon) for lively skies ── */}
      <AnimatePresence>
        {companionActive && (
          <motion.div
            key={`cp-${Date.now()}`}
            initial={{ x: companionDir === 'ltr' ? -80 : 'calc(100vw + 80px)' }}
            animate={{
              x: companionDir === 'ltr' ? 'calc(100vw + 80px)' : -80,
              y: [0, -10, 5, -8, 0],
            }}
            transition={{
              x: { duration: companionCross.current, ease: 'linear' },
              y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
            }}
            onAnimationComplete={onCompanionDone}
            style={{
              position: 'absolute',
              top: `${companionY}%`,
              opacity: 0.32,
            }}
          >
            <SpriteSheet
              src={companionSprite.src}
              frameWidth={SPRITE_FRAME_W}
              frameHeight={SPRITE_FRAME_H}
              frameCount={companionSprite.frameCount}
              fps={13}
              size={COMPANION_SIZE}
              mirrored={companionDir === 'ltr'}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOOTHLESS FACE PEEK: rises from bottom edge, holds, drops ── */}
      <AnimatePresence>
        {peekActive && (
          <motion.div
            key={`pk-${Date.now()}`}
            initial={{ y: 80 }}
            animate={{ y: [80, -10, -10, 80] }}
            transition={{
              duration: peekHold + 1.6,
              times: [0, 0.2, 0.8, 1],
              ease: 'easeInOut',
            }}
            onAnimationComplete={onPeekDone}
            style={{
              position: 'absolute',
              bottom: 0,
              left: `${peekX}%`,
              opacity: 0.5,
            }}
          >
            <SpriteSheet
              src={peekSprite.src}
              frameWidth={SPRITE_FRAME_W}
              frameHeight={SPRITE_FRAME_H}
              frameCount={peekSprite.frameCount}
              fps={10}
              size={PEEK_SIZE}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
