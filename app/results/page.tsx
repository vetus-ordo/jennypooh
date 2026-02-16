'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { scenarioData, characters } from '@/lib/data'

export default function Results() {
  const [report, setReport] = useState<any[]>([])
  const [myCharacter, setMyCharacter] = useState<string>('')
  const [partnerCharacter, setPartnerCharacter] = useState<string>('')

  useEffect(() => {
    const myChar = localStorage.getItem('myCharacter') || 'baymax'
    setMyCharacter(myChar)
    setPartnerCharacter(myChar === 'baymax' ? 'toothless' : 'baymax')

    const results = Object.entries(scenarioData).map(([key, scenario]) => {
      const saved = JSON.parse(localStorage.getItem(`scenario_${key}`) || '{}')
      if (!saved.myAnswer || !saved.partnerAnswer) return null

      const myOption = scenario.options.find(o => o.id === saved.myAnswer)
      const partnerOption = scenario.options.find(o => o.id === saved.partnerAnswer)

      const isMatch = saved.myAnswer === saved.partnerAnswer
      const character = characters[myChar]

      let reaction = character.reactions.mismatch
      if (isMatch) reaction = character.reactions.perfect
      else if (Math.abs(
        scenario.options.findIndex(o => o.id === saved.myAnswer) -
        scenario.options.findIndex(o => o.id === saved.partnerAnswer)
      ) <= 1) {
        reaction = character.reactions.good
      }

      return {
        name: scenario.name,
        myAnswer: myOption?.text,
        partnerAnswer: partnerOption?.text,
        isMatch,
        reaction
      }
    }).filter(Boolean)
    
    setReport(results)
  }, [])

  const myEmoji = myCharacter === 'baymax' ? '🤖' : '🐉'
  const partnerEmoji = partnerCharacter === 'baymax' ? '🤖' : '🐉'

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <header className="text-center mb-12">
        <div className="text-6xl mb-4">
          {myEmoji} {partnerEmoji}
        </div>
        <h1 className="text-4xl font-serif font-bold text-slate-800">
          Compatibility Report
        </h1>
      </header>

      <div className="space-y-6">
        {report.map((res, i) => (
          <div key={i} className="blueprint-card">
            <h2 className="text-lg font-bold border-b border-slate-100 pb-2 mb-4">
              {res.name}
            </h2>
            <div className="flex justify-between mb-4 gap-4">
              <div className="flex-1">
                <p className="text-xs uppercase text-slate-400 font-bold mb-1">
                  You ({myEmoji})
                </p>
                <p className="font-semibold text-emerald-700 text-sm">
                  {res.myAnswer}
                </p>
              </div>
              <div className="flex-1">
                <p className="text-xs uppercase text-slate-400 font-bold mb-1">
                  Partner ({partnerEmoji})
                </p>
                <p className="font-semibold text-emerald-700 text-sm">
                  {res.partnerAnswer}
                </p>
              </div>
            </div>

            <div
              className={`p-3 rounded-xl text-sm font-medium text-center ${
                res.isMatch
                  ? 'bg-emerald-50 text-emerald-700'
                  : 'bg-amber-50 text-amber-700'
              }`}
            >
              {res.reaction}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center">
        <Link href="/scenarios" className="text-slate-400 hover:text-slate-600 font-bold">
          ← Back to Scenarios
        </Link>
      </div>
    </main>
  )
}
