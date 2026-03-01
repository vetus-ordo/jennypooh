'use client'

import { CSSProperties } from 'react'
import { motion } from 'framer-motion'

// Sprite sheet specs — generated from 151 frames at 120x68px each
// Sheet: /public/baymax-walk-sheet.png (18120x68px)
const FRAME_W     = 120
const FRAME_H     = 68
const FRAME_COUNT = 151
const SHEET_W     = FRAME_W * FRAME_COUNT  // 18120
const FPS         = 15
const DURATION    = FRAME_COUNT / FPS      // ~10.07s

interface Props {
  /** Render width in px — height scales proportionally */
  size?: number
  /** Mirror horizontally — use when character should face left */
  mirrored?: boolean
  /** Float up/down like CharacterDisplay floatLoop */
  floatLoop?: boolean
  floatDelay?: number
  className?: string
}

export default function BaymaxSprite({
  size = 120,
  mirrored = false,
  floatLoop = false,
  floatDelay = 0,
  className,
}: Props) {
  const scaledH = Math.round((FRAME_H / FRAME_W) * size)
  const scaledSheetW = Math.round((SHEET_W / FRAME_W) * size)

  // Dynamic keyframe name so the sprite works at any size
  const animName = `bsp-${scaledSheetW}`

  const containerStyle: CSSProperties = {
    width:    size,
    height:   scaledH,
    overflow: 'hidden',
    pointerEvents: 'none',
    userSelect: 'none',
    transform: mirrored ? 'scaleX(-1)' : undefined,
    display: 'inline-block',
    flexShrink: 0,
  }

  const stripStyle: CSSProperties = {
    width:               scaledSheetW,
    height:              scaledH,
    backgroundImage:     `url('/baymax-walk-sheet.png')`,
    backgroundSize:      `${scaledSheetW}px ${scaledH}px`,
    backgroundRepeat:    'no-repeat',
    backgroundPosition:  '0 0',
    animation:           `${animName} ${DURATION}s steps(${FRAME_COUNT}) infinite`,
    animationDelay:      floatDelay ? `${floatDelay}s` : undefined,
    imageRendering:      'auto',
    willChange:          'background-position',
  }

  const inner = (
    <div style={containerStyle} className={className} draggable={false}>
      <style>{`
        @keyframes ${animName} {
          from { background-position-x: 0; }
          to   { background-position-x: -${scaledSheetW}px; }
        }
      `}</style>
      <div style={stripStyle} />
    </div>
  )

  if (!floatLoop) return inner

  return (
    <motion.div
      style={{ display: 'inline-block' }}
      animate={{ y: [0, -12, 0] }}
      transition={{
        repeat: Infinity,
        duration: 3,
        ease: 'easeInOut',
        delay: floatDelay,
      }}
    >
      {inner}
    </motion.div>
  )
}
