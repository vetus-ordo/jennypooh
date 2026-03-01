'use client'

import SpriteSheet from './SpriteSheet'

// Baymax walk sheet: 151 frames at 120×68 each
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
      frameWidth={120}
      frameHeight={68}
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
