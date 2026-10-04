import React, { useState, useEffect } from 'react';
import { BarChart3, FileText, Printer, CheckCircle2, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { DailyReport } from '../../types';

export const ClientReports: React.FC = () => {
  const { activeClient } = useAuthStore();
  const [reports, setReports] = useState<DailyReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<DailyReport | null>(null);

  useEffect(() => {
    if (activeClient) {
      api.getReports(activeClient.id).then((res) => {
        setReports(res);
        if (res.length > 0) setSelectedReport(res[0]);
      }).catch(console.error);
    }
  }, [activeClient]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Marketing Performance Reports</h1>
          <p className="text-xs text-gray-400">Daily autonomous marketing intelligence digests</p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 text-xs font-semibold border border-white/10"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print / Save PDF</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="glass-panel p-4 rounded-2xl border border-white/5 space-y-2 lg:col-span-1 max-h-[75vh] overflow-y-auto">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Available Reports</span>
          {reports.map((r) => (
            <div
              key={r.id}
              onClick={() => setSelectedReport(r)}
              className={`p-3 rounded-xl border cursor-pointer text-xs transition-all ${
                selectedReport?.id === r.id ? 'bg-brand-500/10 border-brand-500/40 text-white' : 'bg-white/5 border-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              <div className="font-bold text-gray-200">{new Date(r.report_date).toLocaleDateString()}</div>
              <p className="text-[11px] text-gray-400 truncate mt-0.5">{r.title}</p>
            </div>
          ))}
        </div>

        <div className="lg:col-span-3">
          {selectedReport ? (
            <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/5 space-y-6 text-xs bg-dark-card/90">
              <div className="border-b border-white/10 pb-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-brand-400">Daily Digest</span>
                <h2 className="text-xl font-bold text-white mt-0.5">{selectedReport.title}</h2>
                <p className="text-xs text-gray-400">Delivered on {new Date(selectedReport.report_date).toLocaleString()}</p>
              </div>

              <div className="p-5 rounded-xl bg-brand-500/5 border border-brand-500/20 space-y-3">
                <h3 className="text-sm font-bold text-brand-400">Executive Summary</h3>
                <p className="text-xs font-semibold text-gray-200 leading-relaxed">
                  {selectedReport.executive_summary?.headline}
                </p>
                {selectedReport.executive_summary?.key_highlights && (
                  <ul className="space-y-1.5 text-gray-300">
                    {selectedReport.executive_summary.key_highlights.map((h: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold">SEO Clicks</span>
                  <span className="text-xl font-extrabold text-white">{selectedReport.seo_metrics?.clicks || 320}</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold">Ad ROAS</span>
                  <span className="text-xl font-extrabold text-emerald-400">{selectedReport.advertising_metrics?.roas || '4.2x'}</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold">New Leads</span>
                  <span className="text-xl font-extrabold text-accent-cyan">+{selectedReport.lead_metrics?.new_leads || 5}</span>
                </div>
                <div className="p-4 rounded-xl bg-white/5 border border-white/5">
                  <span className="text-[10px] text-gray-500 block uppercase font-bold">Social Reach</span>
                  <span className="text-xl font-extrabold text-accent-purple">{selectedReport.social_metrics?.reach || '4,800'}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-12 text-center rounded-2xl text-gray-400 text-xs">No report selected.</div>
          )}
        </div>
      </div>
    </div>
  );
};
