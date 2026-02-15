'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { categoryData } from '@/lib/data'

export default function Home() {
  const [completed, setCompleted] = useState(0);
  const total = Object.keys(categoryData).length;

  useEffect(() => {
    const count = Object.keys(categoryData).filter(key => {
      const data = JSON.parse(localStorage.getItem(`rankings_${key}`) || '{}');
      return data.player1 && data.player2;
    }).length;
    setCompleted(count);
  }, []);

  return (
    <main className="max-w-4xl mx-auto px-6 py-16">
      <header className="text-center mb-16">
        <div className="text-6xl mb-4">🏠</div>
        <h1 className="text-5xl font-serif font-bold text-slate-800 mb-2">The Blueprint</h1>
        <p className="text-xl text-slate-500 italic">Designing a life together, one choice at a time.</p>
      </header>

      {/* Progress Bar */}
      <div className="mb-12 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div className="flex justify-between items-end mb-4">
          <span className="text-slate-600 font-bold uppercase tracking-widest text-sm">Progress</span>
          <span className="text-2xl font-bold text-emerald-600">{Math.round((completed / total) * 100)}%</span>
        </div>
        <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
          <div 
            className="h-full bg-emerald-500 transition-all duration-1000 ease-out"
            style={{ width: `${(completed / total) * 100}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(categoryData).map(([id, cat]) => (
          <Link key={id} href={`/rank/${id}`}>
            <div className="blueprint-card group cursor-pointer">
              <div className="flex items-center gap-4">
                <span className="text-4xl group-hover:scale-125 transition-transform duration-300">
                  {cat.icon}
                </span>
                <div>
                  <h3 className="text-xl font-bold text-slate-700">{cat.name}</h3>
                  <p className="text-sm text-slate-400">Tap to align</p>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 text-center">
        <Link href="/results" className="btn-blueprint inline-block">
          View Final Compatibility Report
        </Link>
      </div>
    </main>
  )
}