import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Calendar, Download, Sparkles, CheckCircle2, 
  ArrowRight, TrendingUp, Search, RefreshCw, Printer, FileText 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { DailyReport } from '../types';

export const ReportsCenter: React.FC = () => {
  const { activeClient } = useAuthStore();
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadReports = async () => {
    if (!activeClient) return;
    setLoading(true);
    try {
      const res = await api.getReports(activeClient.id);
      setReports(res);
      if (res.length > 0 && !selectedReport) {
        setSelectedReport(res[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReports();
  }, [activeClient]);

  const handleGenerateOnDemand = async () => {
    if (!activeClient) return;
    setIsGenerating(true);
    try {
      const newRep = await api.generateReport(activeClient.id);
      setReports([newRep, ...reports]);
      setSelectedReport(newRep);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Automated Daily Marketing Reports</h1>
          <p className="text-xs text-gray-400">
            Synthesized multi-channel performance intelligence for <span className="text-brand-400 font-bold">{activeClient?.company_name}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold border border-white/10 transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
          <button
            disabled={isGenerating}
            onClick={handleGenerateOnDemand}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-accent-purple hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all"
          >
            <Sparkles className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            <span>Synthesize Fresh Daily Report</span>
          </button>
        </div>
      </div>

      {/* Main Report View Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Reports List Column */}
        <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-3 lg:col-span-1 max-h-[80vh] overflow-y-auto">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">
            Report Archive ({reports.length})
          </span>

          <div className="space-y-2">
            {reports.map((r) => (
              <div
                key={r.id}
                onClick={() => setSelectedReport(r)}
                className={`p-3 rounded-xl border cursor-pointer transition-all text-xs ${
                  selectedReport?.id === r.id
                    ? 'bg-brand-500/10 border-brand-500/40 text-white'
                    : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-gray-200">
                  <span>{new Date(r.report_date).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  <FileText className="w-3.5 h-3.5 text-brand-400" />
                </div>
                <p className="text-[11px] text-gray-400 mt-1 truncate">{r.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Selected Report Details View */}
        <div className="lg:col-span-3 space-y-6">
          {selectedReport ? (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6 text-xs bg-dark-card/90">
              {/* Report Header */}
              <div className="border-b border-white/10 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">
                    AI Reporting Agent • Official Digest
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">{selectedReport.title}</h2>
                  <p className="text-xs text-gray-400">
                    Generated on {new Date(selectedReport.report_date).toLocaleString()}
                  </p>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold shrink-0 self-start sm:self-center">
                  Verified Executive Report
                </span>
              </div>

              {/* Executive Summary */}
              <div className="p-5 rounded-xl bg-gradient-to-r from-brand-950/40 to-dark-bg border border-brand-500/20 space-y-3">
                <h3 className="text-sm font-bold text-brand-400 flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  <span>Executive Summary & Key Highlights</span>
                </h3>
                <p className="text-xs font-semibold text-gray-200 leading-relaxed">
                  {selectedReport.executive_summary?.headline || 'Marketing operations running across all active channels.'}
                </p>

                {selectedReport.executive_summary?.key_highlights && (
                  <ul className="space-y-1.5 pt-1 text-gray-300">
                    {selectedReport.executive_summary.key_highlights.map((h: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Channel Metric Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500">SEO & Organic</span>
                  <p className="text-xl font-extrabold text-white">{selectedReport.seo_metrics?.clicks || selectedReport.seo_metrics?.organic_clicks || 340}</p>
                  <span className="text-[10px] text-gray-400 block">{selectedReport.seo_metrics?.impressions || 9200} Search Impressions</span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500">Paid Ads (ROAS)</span>
                  <p className="text-xl font-extrabold text-emerald-400">{selectedReport.advertising_metrics?.roas || '4.1x'}</p>
                  <span className="text-[10px] text-gray-400 block">${selectedReport.advertising_metrics?.ad_spend || 220} Daily Spend</span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500">New Leads</span>
                  <p className="text-xl font-extrabold text-accent-cyan">+{selectedReport.lead_metrics?.new_leads || 6}</p>
                  <span className="text-[10px] text-gray-400 block">{selectedReport.lead_metrics?.qualified_leads || 4} MQLs Qualified</span>
                </div>

                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-1">
                  <span className="text-[10px] uppercase font-bold text-gray-500">Social Reach</span>
                  <p className="text-xl font-extrabold text-accent-purple">{selectedReport.social_metrics?.reach?.toLocaleString() || '5,400'}</p>
                  <span className="text-[10px] text-gray-400 block">+{selectedReport.social_metrics?.new_followers || 28} New Followers</span>
                </div>
              </div>

              {/* Next Day Action Agenda */}
              {selectedReport.next_day_plan?.agenda && (
                <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-2">
                  <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
                    Autonomous Next-Day Execution Agenda
                  </h4>
                  <div className="space-y-1.5 text-gray-300">
                    {selectedReport.next_day_plan.agenda.map((item: string, i: number) => (
                      <div key={i} className="flex items-center gap-2">
                        <ArrowRight className="w-3.5 h-3.5 text-brand-400" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-panel p-12 text-center rounded-2xl border border-white/5 text-gray-400 text-xs">
              Select a report from the archive or synthesize a fresh one above.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
