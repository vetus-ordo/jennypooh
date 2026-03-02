'use client'

import SpriteSheet from './SpriteSheet'

// Baymax walk sheet: 151 frames at 240×136 each (2× upscaled)
interface Props {
  size?: number
  mirrored?: boolean
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
  return (
    <SpriteSheet
      src="/baymax-walk-sheet.png"
      frameWidth={240}
      frameHeight={136}
      frameCount={151}
      fps={15}
      size={size}
      mirrored={mirrored}
      floatLoop={floatLoop}
      floatDelay={floatDelay}
      className={className}
    />
  )
}
