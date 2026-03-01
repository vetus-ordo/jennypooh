'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

// ─────────────────────────────────────────
//  ASSET MAP
//  Maps every character+variant to its /public path.
//  Video variants are handled by VideoCharacter.tsx.
// ─────────────────────────────────────────
const ASSETS: Record<string, Record<string, string>> = {
  baymax: {
    static:  '/baymax.png',
    wave:    '/baymax-wave.png',
    gif:     '/baymax.gif',
    dance:   '/baymax-dance.gif',
    heart:   '/baymax-heart.gif',
  },
  toothless: {
    static:  '/toothless.png',
    gif:     '/toothless-fly.gif',
    fly:     '/toothless-fly.gif',
    lick:    '/toothless-lick.gif',
  },
}

export type CharacterVariant = 'static' | 'gif' | 'wave' | 'dance' | 'heart' | 'fly' | 'lick'

interface Props {
  character: 'baymax' | 'toothless'
  variant?: CharacterVariant
  size?: number
  isSelected?: boolean
  isHovered?: boolean
  floatLoop?: boolean
  /** Flip horizontally — used when characters face each other in the duo view */
  mirrored?: boolean
  /** Delay the float loop so duo characters bob out of phase */
  floatDelay?: number
  className?: string
}

export default function CharacterDisplay({
  character,
  variant = 'static',
  size = 160,
  isSelected = false,
  isHovered = false,
  floatLoop = false,
  mirrored = false,
  floatDelay = 0,
  className = '',
}: Props) {
  const src = ASSETS[character]?.[variant] ?? ASSETS[character]?.['static'] ?? `/${character}.png`
  const isAnimated = variant !== 'static' && variant !== 'wave'

  return (
    <motion.div
      className={className}
      style={mirrored ? { transform: 'scaleX(-1)' } : undefined}
      animate={
        floatLoop
          ? { y: [0, -12, 0] }
          : {
              y: isSelected ? [0, -18, 0] : isHovered ? -8 : 0,
              scale: isSelected ? 1.1 : isHovered ? 1.05 : 1,
            }
      }
      transition={
        floatLoop
          ? { repeat: Infinity, duration: 3, ease: 'easeInOut', delay: floatDelay }
          : {
              y: isSelected
                ? { repeat: Infinity, duration: 2, ease: 'easeInOut' }
                : { duration: 0.3 },
              scale: { duration: 0.3 },
            }
      }
    >
      <Image
        src={src}
        alt={character === 'baymax' ? 'Baymax' : 'Toothless'}
        width={size}
        height={size}
        className="object-contain drop-shadow-2xl"
        priority
        unoptimized={isAnimated}
      />
    </motion.div>
  )
}

// ─────────────────────────────────────────
//  CHARACTER DUO
//  Renders Baymax (left) and Toothless (right)
//  facing each other, bobbing out of phase.
//  Used on: home page, join page, scenarios hub, results.
// ─────────────────────────────────────────
interface DuoProps {
  baymaxVariant?: CharacterVariant
  toothlessVariant?: CharacterVariant
  size?: number
  className?: string
}

export function CharacterDuo({
  baymaxVariant = 'gif',
  toothlessVariant = 'gif',
  size = 100,
  className = '',
}: DuoProps) {
  return (
    <div className={`duo-wrap ${className}`}>
      {/* Baymax floats on the standard 3s cycle */}
      <CharacterDisplay
        character="baymax"
        variant={baymaxVariant}
        size={size}
        floatLoop
        floatDelay={0}
      />
      {/* Toothless mirrors inward and floats 1.5s out of phase */}
      <CharacterDisplay
        character="toothless"
        variant={toothlessVariant}
        size={size}
        floatLoop
        floatDelay={1.5}
        mirrored
        className="duo-right"
      />
    </div>
  )
}
