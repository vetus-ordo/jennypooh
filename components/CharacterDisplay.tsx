'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

interface Props {
  character: 'baymax' | 'toothless'
  size?: number
  isSelected?: boolean
  isHovered?: boolean
  floatLoop?: boolean
  className?: string
}

export default function CharacterDisplay({
  character,
  size = 160,
  isSelected = false,
  isHovered = false,
  floatLoop = false,
  className = '',
}: Props) {
  return (
    <motion.div
      className={className}
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
          ? { repeat: Infinity, duration: 3, ease: 'easeInOut' }
          : {
              y: isSelected
                ? { repeat: Infinity, duration: 2, ease: 'easeInOut' }
                : { duration: 0.3 },
              scale: { duration: 0.3 },
            }
      }
    >
      <Image
        src={`/${character}.png`}
        alt={character === 'baymax' ? 'Baymax' : 'Toothless'}
        width={size}
        height={size}
        className="object-contain drop-shadow-2xl"
        priority
      />
    </motion.div>
  )
}
