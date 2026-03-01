'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

// ─────────────────────────────────────────
//  VIDEO ASSET MAP
//  Previously broke by trying /${character}.mp4 which doesn't exist.
//  All videos use descriptive filenames — mapped here explicitly.
// ─────────────────────────────────────────
const VIDEO_ASSETS: Record<string, Record<string, string>> = {
  baymax: {
    idle:   '/baymax-coffee.mp4',   // Calm, ambient — loading screens & idle
    soccer: '/baymax-soccer.mp4',   // Playful — mismatch / low-score moments
  },
  toothless: {
    idle:   '/toothless-courtship.mp4', // Affectionate — join page & invite reveal
    smack:  '/toothless-smack.mp4',     // Playful smack — mismatch / low-score moments
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
  className?: string
}

export default function VideoCharacter({
  character,
  variant = 'idle',
  size = 160,
  floatLoop = false,
  floatDelay = 0,
  rounded = false,
  className = '',
}: Props) {
  const [videoError, setVideoError] = useState(false)

  const videoSrc = VIDEO_ASSETS[character]?.[variant] ?? VIDEO_ASSETS[character]?.['idle']

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

  if (!floatLoop) return <div className={className}>{inner}</div>

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -12, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut', delay: floatDelay }}
    >
      {inner}
    </motion.div>
  )
}
