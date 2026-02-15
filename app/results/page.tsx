'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { categoryData, Category } from '@/lib/data'

export default function Results() {
  const [report, setReport] = useState<any[]>([]);

  useEffect(() => {
    const results = Object.entries(categoryData).map(([key, cat]) => {
      const saved = JSON.parse(localStorage.getItem(`rankings_${key}`) || '{}');
      if (!saved.player1 || !saved.player2) return null;

      const p1Top = cat.items.find(i => i.id === saved.player1[0]);
      const p2Top = cat.items.find(i => i.id === saved.player2[0]);
      
      const isBliss = saved.player1[0] === saved.player2[0];
      const isTrade = saved.player1[0] === saved.player2[saved.player2.length - 1] || 
                      saved.player2[0] === saved.player1[saved.player1.length - 1];

      return {
        name: cat.name,
        p1: p1Top?.name,
        p2: p2Top?.name,
        status: isBliss ? 'Bliss' : isTrade ? 'Trade' : 'Talk'
      }
    }).filter(Boolean);
    setReport(results);
  }, []);

  return (
    <main className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-serif font-bold text-center mb-12">The Compatibility Report</h1>
      
      <div className="space-y-6">
        {report.map((res, i) => (
          <div key={i} className="blueprint-card">
            <h2 className="text-lg font-bold border-b border-slate-100 pb-2 mb-4">{res.name}</h2>
            <div className="flex justify-between mb-4">
              <div className="text-center">
                <p className="text-xs uppercase text-slate-400 font-bold mb-1">Jenny</p>
                <p className="font-semibold text-emerald-700">{res.p1}</p>
              </div>
              <div className="text-center">
                <p className="text-xs uppercase text-slate-400 font-bold mb-1">Andrew</p>
                <p className="font-semibold text-emerald-700">{res.p2}</p>
              </div>
            </div>

            <div className={`p-3 rounded-xl text-sm font-bold text-center ${
              res.status === 'Bliss' ? 'bg-emerald-50 text-emerald-700' : 
              res.status === 'Trade' ? 'bg-amber-50 text-amber-700' : 'bg-rose-50 text-rose-700'
            }`}>
              {res.status === 'Bliss' && "✨ DOMESTIC BLISS: You are in total sync!"}
              {res.status === 'Trade' && "🤝 PERFECT TRADE: One loves what the other hates!"}
              {res.status === 'Talk' && "⚠️ NEGOTIATION: Different visions. Wine required."}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-center">
        <Link href="/" className="text-slate-400 hover:text-slate-600 font-bold">← Back to Quest</Link>
      </div>
    </main>
  );
}