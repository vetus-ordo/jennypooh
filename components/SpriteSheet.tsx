'use client'

import { CSSProperties } from 'react'
import { motion } from 'framer-motion'

interface Props {
  /** Path to the sprite sheet image in /public */
  src: string
  /** Width of a single frame in the source image */
  frameWidth: number
  /** Height of a single frame in the source image */
  frameHeight: number
  /** Total number of frames in the strip */
  frameCount: number
  /** Playback speed */
  fps?: number
  /** Rendered width in px — height scales proportionally */
  size?: number
  /** Mirror horizontally */
  mirrored?: boolean
  /** Gentle float up/down */
  floatLoop?: boolean
  floatDelay?: number
  className?: string
}

export default function SpriteSheet({
  src,
  frameWidth,
  frameHeight,
  frameCount,
  fps = 15,
  size = 120,
  mirrored = false,
  floatLoop = false,
  floatDelay = 0,
  className,
}: Props) {
  const scale = size / frameWidth
  const scaledH = Math.round(frameHeight * scale)
  const scaledSheetW = Math.round(frameWidth * frameCount * scale)
  const duration = frameCount / fps

  // Unique keyframe name per sheet + size combo
  const animName = `ss-${src.replace(/[^a-z0-9]/gi, '')}-${scaledSheetW}`

  const containerStyle: CSSProperties = {
    width: size,
    height: scaledH,
    overflow: 'hidden',
    pointerEvents: 'none',
    userSelect: 'none',
    transform: mirrored ? 'scaleX(-1)' : undefined,
    display: 'inline-block',
    flexShrink: 0,
  }

  const stripStyle: CSSProperties = {
    width: scaledSheetW,
    height: scaledH,
    backgroundImage: `url('${src}')`,
    backgroundSize: `${scaledSheetW}px ${scaledH}px`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '0 0',
    animation: `${animName} ${duration}s steps(${frameCount}) infinite`,
    animationDelay: floatDelay ? `${floatDelay}s` : undefined,
    imageRendering: 'auto',
    willChange: 'background-position',
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
