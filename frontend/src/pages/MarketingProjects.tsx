import React, { useState, useEffect } from 'react';
import { 
  Rocket, Calendar, Play, Pause, Square, Sparkles, 
  CheckCircle2, ArrowRight, ShieldCheck, DollarSign, RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { StartMarketingModal } from '../components/StartMarketingModal';
import { MarketingProject, MarketingStrategy, MarketingPlan } from '../types';

export const MarketingProjects: React.FC = () => {
  const { activeClient } = useAuthStore();
  const [projects, setProjects] = useState<MarketingProject[]>([]);
  const [strategy, setStrategy] = useState<MarketingStrategy | null>(null);
  const [isStartModalOpen, setIsStartModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadProjects = async () => {
    if (!activeClient) return;
    setLoading(true);
    try {
      const res = await api.getProjects(activeClient.id);
      setProjects(res);
      if (res.length > 0) {
        const strat = await api.getStrategy(res[0].id);
        setStrategy(strat);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, [activeClient]);

  const handlePause = async (projId: string) => {
    try {
      await api.pauseMarketing(projId);
      loadProjects();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleResume = async (projId: string) => {
    try {
      await api.resumeMarketing(projId);
      loadProjects();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleStop = async (projId: string) => {
    if (!window.confirm('Are you sure you want to stop the marketing campaign?')) return;
    try {
      await api.stopMarketing(projId);
      loadProjects();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const activeProject = projects.find((p) => p.status === 'Active') || projects[0];

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Marketing Projects & 30-Day Execution Engine</h1>
          <p className="text-xs text-gray-400">
            Persistent omnichannel campaigns, strategic plans, and execution controls for <span className="text-brand-400 font-bold">{activeClient?.company_name}</span>
          </p>
        </div>
        <button
          onClick={() => setIsStartModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-purple text-white font-bold text-xs shadow-lg shadow-brand-500/20 hover:scale-105 active:scale-95 transition-all"
        >
          <Rocket className="w-4 h-4" />
          <span>START DIGITAL MARKETING</span>
        </button>
      </div>

      {activeProject ? (
        <div className="space-y-6">
          {/* Active Project Banner */}
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 bg-gradient-to-r from-dark-card to-brand-950/40">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                  activeProject.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  activeProject.status === 'Paused' ? 'bg-amber-500/20 text-amber-400' : 'bg-white/10 text-gray-400'
                }`}>
                  {activeProject.status}
                </span>
                <span className="text-xs text-gray-400">
                  Execution ID: <span className="font-mono text-brand-400 font-bold">{activeProject.current_campaign_execution_id || 'EXEC-STANDBY'}</span>
                </span>
              </div>
              <h2 className="text-xl font-bold text-white">{activeProject.title}</h2>
              <p className="text-xs text-gray-300 max-w-xl">{activeProject.description}</p>
            </div>

            {/* Campaign Controls */}
            <div className="flex items-center gap-2 shrink-0">
              {activeProject.status === 'Active' ? (
                <button
                  onClick={() => handlePause(activeProject.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold text-xs border border-amber-500/20 transition-colors"
                >
                  <Pause className="w-3.5 h-3.5" />
                  <span>Pause Campaigns</span>
                </button>
              ) : (
                <button
                  onClick={() => handleResume(activeProject.id)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs border border-emerald-500/20 transition-colors"
                >
                  <Play className="w-3.5 h-3.5" />
                  <span>Resume Campaigns</span>
                </button>
              )}

              <button
                onClick={() => handleStop(activeProject.id)}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/20 transition-colors"
              >
                <Square className="w-3.5 h-3.5" />
                <span>Stop</span>
              </button>
            </div>
          </div>

          {/* Strategy Details View */}
          {strategy && (
            <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-6 text-xs">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-brand-400" />
                  <h3 className="text-sm font-bold text-white">AI Omnichannel Marketing Strategy</h3>
                </div>
                <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Approved & Active
                </span>
              </div>

              <p className="text-gray-300 leading-relaxed text-xs">
                {strategy.executive_summary}
              </p>

              {/* Target Personas */}
              <div className="space-y-3">
                <h4 className="font-bold uppercase tracking-wider text-gray-400 text-[11px]">
                  Target ICP Personas & Angles
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {strategy.target_personas?.map((p: any, i: number) => (
                    <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                      <span className="font-bold text-brand-400 block text-xs">{p.persona_name || p.title}</span>
                      <p className="text-[11px] text-gray-300"><span className="text-gray-500">Core Hook:</span> {p.value_prop || p.solution}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* 30-Day Execution Roadmap Phases */}
              <div className="space-y-3">
                <h4 className="font-bold uppercase tracking-wider text-gray-400 text-[11px]">
                  30-Day Operational Roadmap Phases
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { phase: 'Phase 1 (Days 1-7)', title: 'Discovery & Audit', desc: 'Market intelligence, competitor gap teardown, and technical SEO baseline.' },
                    { phase: 'Phase 2 (Days 8-14)', title: 'Campaign Activation', desc: 'Deploy Google Search ads, publish cornerstone blog guides, and social scheduling.' },
                    { phase: 'Phase 3 (Days 15-21)', title: 'Lead Nurture & CRO', desc: 'Activate CRM lead scoring, retargeting pixels, and email follow-up sequence.' },
                    { phase: 'Phase 4 (Days 22-30)', title: 'Scale & Attribution', desc: 'Reallocate budget to winning ROAS ad sets and synthesize month-1 ROI digest.' },
                  ].map((ph, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-brand-400">{ph.phase}</span>
                      <h5 className="font-bold text-white text-xs">{ph.title}</h5>
                      <p className="text-[11px] text-gray-400 leading-relaxed">{ph.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="glass-panel p-12 text-center rounded-2xl border border-white/5 space-y-3">
          <Rocket className="w-12 h-12 text-brand-400/40 mx-auto" />
          <p className="text-sm font-bold text-white">No marketing campaigns active for this client</p>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            Click "Start Digital Marketing" to validate client configuration, generate strategy, and initialize background execution.
          </p>
          <button
            onClick={() => setIsStartModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-brand-500 text-white font-bold text-xs inline-block"
          >
            Launch Marketing Engine
          </button>
        </div>
      )}

      {activeClient && (
        <StartMarketingModal
          client={activeClient}
          project={activeProject}
          isOpen={isStartModalOpen}
          onClose={() => setIsStartModalOpen(false)}
          onSuccess={() => loadProjects()}
        />
      )}
    </div>
  );
};
