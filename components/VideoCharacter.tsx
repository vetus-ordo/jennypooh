'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'

interface Props {
  character: 'baymax' | 'toothless'
  size?: number
  floatLoop?: boolean
  className?: string
}

export default function VideoCharacter({
  character,
  size = 160,
  floatLoop = false,
  className = '',
}: Props) {
  const [videoError, setVideoError] = useState(false)

  const inner = videoError ? (
    <Image
      src={`/${character}.png`}
      alt={character}
      width={size}
      height={size}
      className="object-contain drop-shadow-2xl"
      priority
    />
  ) : (
    <video
      src={`/${character}.mp4`}
      autoPlay
      loop
      muted
      playsInline
      onError={() => setVideoError(true)}
      style={{ width: size, height: size }}
      className="object-contain drop-shadow-2xl"
    />
  )

  if (!floatLoop) return <div className={className}>{inner}</div>

  return (
    <motion.div
      className={className}
      animate={{ y: [0, -12, 0] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
    >
      {inner}
    </motion.div>
  )
}
