import React from 'react';
import { Terminal, CheckCircle2, XCircle, Clock, Cpu, Coins, ShieldAlert } from 'lucide-react';
import { MarketingTask } from '../types';

interface TaskLogsModalProps {
  task: MarketingTask | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TaskLogsModal: React.FC<TaskLogsModalProps> = ({ task, isOpen, onClose }) => {
  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl glass-panel rounded-2xl shadow-2xl border border-white/10 overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-dark-card shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white truncate max-w-md">{task.title}</h3>
              <p className="text-xs text-gray-400">
                Agent: <span className="text-brand-400 font-semibold">{task.agent_name}</span> | Day {task.day_number}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-xs px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 text-xs">
          {/* Metadata badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-gray-500 block">Status</span>
              <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                {task.status === 'Completed' ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                ) : task.status === 'Failed' ? (
                  <XCircle className="w-3.5 h-3.5 text-rose-400" />
                ) : (
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                )}
                {task.status}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-gray-500 block">AI Token Usage</span>
              <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                <Cpu className="w-3.5 h-3.5 text-accent-cyan" />
                {task.token_usage?.toLocaleString()} tokens
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-gray-500 block">Estimated Cost</span>
              <span className="font-bold text-white flex items-center gap-1 mt-0.5">
                <Coins className="w-3.5 h-3.5 text-amber-400" />
                ${task.execution_cost?.toFixed(4)}
              </span>
            </div>

            <div className="p-2.5 rounded-xl bg-white/5 border border-white/5">
              <span className="text-[10px] text-gray-500 block">Human Approval</span>
              <span className={`font-bold mt-0.5 ${task.requires_approval ? 'text-amber-400' : 'text-gray-400'}`}>
                {task.requires_approval ? task.approval_status : 'Auto-Approved'}
              </span>
            </div>
          </div>

          {/* Error message if any */}
          {task.error_message && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Execution Error</p>
                <p className="text-[11px] text-gray-300 mt-0.5">{task.error_message}</p>
              </div>
            </div>
          )}

          {/* Structured Output Data */}
          <div>
            <h4 className="font-bold text-gray-300 mb-1.5 uppercase tracking-wider text-[10px]">
              AI Agent Structured Output
            </h4>
            <pre className="p-3 rounded-xl bg-dark-bg border border-white/10 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-60">
              {JSON.stringify(task.output_data, null, 2)}
            </pre>
          </div>

          {/* Execution Logs */}
          <div>
            <h4 className="font-bold text-gray-300 mb-1.5 uppercase tracking-wider text-[10px]">
              Execution Trace Logs
            </h4>
            <div className="p-3 rounded-xl bg-dark-bg border border-white/10 font-mono text-[11px] space-y-1.5 max-h-48 overflow-y-auto">
              {task.logs && task.logs.length > 0 ? (
                task.logs.map((l, i) => (
                  <div key={i} className="flex items-start gap-2 text-gray-300">
                    <span className="text-gray-500 text-[10px] shrink-0">
                      {new Date(l.timestamp).toLocaleTimeString()}
                    </span>
                    <span className={`px-1 rounded text-[10px] font-bold ${
                      l.level === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' :
                      l.level === 'ERROR' ? 'bg-rose-500/20 text-rose-400' : 'bg-brand-500/20 text-brand-400'
                    }`}>
                      {l.level}
                    </span>
                    <span>{l.message}</span>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">No logs captured</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-dark-card flex justify-end shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
