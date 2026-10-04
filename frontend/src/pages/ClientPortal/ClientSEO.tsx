import React, { useState, useEffect } from 'react';
import { Rocket, TrendingUp, Search, CheckCircle2, AlertTriangle, ArrowUp } from 'lucide-react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';

export const ClientSEO: React.FC = () => {
  const { activeClient } = useAuthStore();
  const [keywords, setKeywords] = useState<any[]>([
    { keyword: 'cloud ehr software', position: 3, prev: 7, volume: 8100, difficulty: 52, intent: 'Commercial' },
    { keyword: 'ambient ai medical scribe', position: 2, prev: 5, volume: 4600, difficulty: 38, intent: 'Transactional' },
    { keyword: 'hipaa compliant telehealth platform', position: 4, prev: 9, volume: 5200, difficulty: 44, intent: 'Commercial' },
    { keyword: 'best medical clinic ehr 2026', position: 1, prev: 3, volume: 2900, difficulty: 35, intent: 'Transactional' }
  ]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">SEO & Search Engine Rankings</h1>
        <p className="text-xs text-gray-400">
          Autonomous keyword tracking, Google Search Console index movement, and technical site health for <span className="text-brand-400 font-bold">{activeClient?.company_name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400">SEO Health Score</span>
          <p className="text-2xl font-extrabold text-emerald-400">94/100</p>
          <span className="text-[10px] text-gray-400 font-semibold">Core Web Vitals Optimal</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400">Tracked Keywords</span>
          <p className="text-2xl font-extrabold text-white">{keywords.length}</p>
          <span className="text-[10px] text-brand-400 font-semibold">100% in Top 5 Results</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-white/5 space-y-1">
          <span className="text-xs font-semibold text-gray-400">Organic CTR</span>
          <p className="text-2xl font-extrabold text-accent-cyan">4.2%</p>
          <span className="text-[10px] text-emerald-400 font-semibold">+1.1% vs last month</span>
        </div>
      </div>

      {/* Keywords Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <table className="w-full text-left text-xs text-gray-300">
          <thead className="bg-dark-card/90 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5">
            <tr>
              <th className="py-3 px-4">Target Keyword</th>
              <th className="py-3 px-4">Current Position</th>
              <th className="py-3 px-4">Search Volume</th>
              <th className="py-3 px-4">Difficulty</th>
              <th className="py-3 px-4">Intent</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {keywords.map((kw, i) => (
              <tr key={i} className="hover:bg-white/[0.02]">
                <td className="py-3.5 px-4 font-bold text-white flex items-center gap-2">
                  <span>{kw.keyword}</span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="font-extrabold text-emerald-400 flex items-center gap-1">
                    #{kw.position}
                    <ArrowUp className="w-3 h-3 text-emerald-400" />
                    <span className="text-[10px] text-gray-500 font-normal">from #{kw.prev}</span>
                  </span>
                </td>
                <td className="py-3.5 px-4 font-mono">{kw.volume.toLocaleString()}/mo</td>
                <td className="py-3.5 px-4">{kw.difficulty}/100</td>
                <td className="py-3.5 px-4">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-400">
                    {kw.intent}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
