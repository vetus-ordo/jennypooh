'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

// ─────────────────────────────────────────
//  VIDEO ASSET MAP
//  All videos use descriptive filenames — mapped here explicitly.
//  baymax-coffee.mp4  → calm/ambient   (join page Baymax idle)
//  baymax-soccer.mp4  → playful        (results <50 mismatch)
//  toothless-courtship.mp4 → affectionate (join page Toothless idle)
//  toothless-smack.mp4     → playful smack (results <50 mismatch)
// ─────────────────────────────────────────
const VIDEO_ASSETS: Record<string, Record<string, string>> = {
  baymax: {
    idle:   '/baymax-coffee.mp4',
    soccer: '/baymax-soccer.mp4',
  },
  toothless: {
    idle:   '/toothless-courtship.mp4',
    smack:  '/toothless-smack.mp4',
  },
}

// GIF fallback when video fails to load (graceful, animated — not static PNG)
const GIF_FALLBACK: Record<string, string> = {
  baymax:    '/baymax.gif',
  toothless: '/toothless-fly.gif',
}

export type VideoVariant = 'idle' | 'soccer' | 'smack'

interface Props {
  character: 'baymax' | 'toothless'
  variant?: VideoVariant
  size?: number
  floatLoop?: boolean
  /** Delay the float loop to sync with CharacterDisplay duo patterns */
  floatDelay?: number
  rounded?: boolean
  /** Flip horizontally — mirrors the character to face inward in duo layouts.
   *  Matches the mirrored prop on CharacterDisplay for consistency. */
  mirrored?: boolean
  className?: string
}

export default function VideoCharacter({
  character,
  variant = 'idle',
  size = 160,
  floatLoop = false,
  floatDelay = 0,
  rounded = false,
  mirrored = false,
  className = '',
}: Props) {
  const [videoError, setVideoError] = useState(false)

  const videoSrc = VIDEO_ASSETS[character]?.[variant] ?? VIDEO_ASSETS[character]?.['idle']
  const mirrorStyle = mirrored ? { transform: 'scaleX(-1)' } as const : undefined

  const inner = videoError ? (
    <Image
      src={GIF_FALLBACK[character]}
      alt={character}
      width={size}
      height={size}
      className="object-contain drop-shadow-2xl"
      unoptimized
      priority
    />
  ) : (
    <video
      src={videoSrc}
      autoPlay
      loop
      muted
      playsInline
      onError={() => setVideoError(true)}
      style={{ width: size, height: size }}
      className={`object-contain drop-shadow-2xl${rounded ? ' rounded-full' : ''}`}
    />
  )

  if (!floatLoop) return (
    <div className={className} style={mirrorStyle}>{inner}</div>
  )

  return (
    <motion.div
      className={className}
      style={mirrorStyle}
      animate={{ y: [0, -12, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: floatDelay }}
    >
      {inner}
    </motion.div>
  )
}
