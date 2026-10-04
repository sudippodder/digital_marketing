import React, { useState, useEffect } from 'react';
import { 
  CheckSquare, CheckCircle2, XCircle, AlertTriangle, 
  ShieldAlert, Sparkles, MessageSquare, Eye, RefreshCw 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { Approval } from '../types';

export const ApprovalCenter: React.FC = () => {
  const { activeClient } = useAuthStore();
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [statusFilter, setStatusFilter] = useState('Pending');
  const [loading, setLoading] = useState(true);

  const loadApprovals = async () => {
    setLoading(true);
    try {
      const res = await api.getApprovals(activeClient?.id);
      setApprovals(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApprovals();
  }, [activeClient]);

  const handleApprove = async (approvalId: string) => {
    try {
      await api.approveRequest(approvalId);
      loadApprovals();
    } catch (err: any) {
      alert(`Approval failed: ${err.message}`);
    }
  };

  const handleReject = async (approvalId: string) => {
    const notes = prompt('Enter rejection or change request reason:');
    if (notes === null) return;
    try {
      await api.rejectRequest(approvalId, notes);
      loadApprovals();
    } catch (err: any) {
      alert(`Update failed: ${err.message}`);
    }
  };

  const filteredApprovals = approvals.filter((a) => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">Human Approval & Safety Center</h1>
          <p className="text-xs text-gray-400">
            Review and authorize public content publishing, ad spend adjustments, and strategic modifications
          </p>
        </div>
        <button
          onClick={loadApprovals}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-200 font-semibold border border-white/10"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs">
        {['Pending', 'Approved', 'Rejected', 'all'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl font-bold capitalize transition-colors ${
              statusFilter === st ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {st} ({st === 'all' ? approvals.length : approvals.filter((a) => a.status === st).length})
          </button>
        ))}
      </div>

      {/* Approval Cards */}
      <div className="space-y-4">
        {filteredApprovals.length === 0 ? (
          <div className="glass-panel p-12 text-center rounded-2xl border border-white/5">
            <CheckCircle2 className="w-12 h-12 text-emerald-400/40 mx-auto mb-3" />
            <p className="text-sm font-bold text-white">No items awaiting approval</p>
            <p className="text-xs text-gray-400 mt-1">
              All AI agent marketing tasks are either auto-approved or have been reviewed.
            </p>
          </div>
        ) : (
          filteredApprovals.map((a) => (
            <div key={a.id} className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                      {a.approval_type}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      a.risk_level === 'High' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400'
                    }`}>
                      {a.risk_level} Impact
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{a.title}</h3>
                  <p className="text-xs text-gray-400">{a.description}</p>
                </div>

                <span className={`text-xs px-3 py-1 rounded-full font-bold ${
                  a.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                  a.status === 'Rejected' ? 'bg-rose-500/20 text-rose-400' : 'bg-amber-500/20 text-amber-400 animate-pulse'
                }`}>
                  {a.status}
                </span>
              </div>

              {/* Payload Preview */}
              <div className="p-4 rounded-xl bg-dark-bg/80 border border-white/5 text-xs text-gray-300 space-y-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Generated Payload Preview</span>
                <pre className="font-mono text-[11px] text-emerald-400 overflow-x-auto max-h-40">
                  {JSON.stringify(a.payload_preview, null, 2)}
                </pre>
              </div>

              {/* Reviewer Notes if rejected */}
              {a.reviewer_notes && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  <span className="font-bold">Reviewer Feedback:</span> {a.reviewer_notes}
                </div>
              )}

              {/* Action Buttons */}
              {a.status === 'Pending' && (
                <div className="pt-2 flex items-center justify-end gap-3 border-t border-white/5">
                  <button
                    onClick={() => handleReject(a.id)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-xs border border-rose-500/20 transition-colors"
                  >
                    <XCircle className="w-4 h-4" />
                    <span>Reject / Request Changes</span>
                  </button>

                  <button
                    onClick={() => handleApprove(a.id)}
                    className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Authorize & Publish</span>
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
