import React, { useState, useEffect } from 'react';
import { 
  ListTodo, Play, RefreshCw, Terminal, CheckCircle2, 
  XCircle, Clock, AlertTriangle, ShieldCheck, Cpu, Coins, Eye 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { TaskLogsModal } from '../components/TaskLogsModal';
import { MarketingTask } from '../types';

export const TaskQueue: React.FC = () => {
  const { activeClient } = useAuthStore();
  const [tasks, setTasks] = useState<MarketingTask[]>([]);
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTask, setSelectedTask] = useState<MarketingTask | null>(null);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    if (!activeClient) return;
    setLoading(true);
    try {
      const projects = await api.getProjects(activeClient.id);
      if (projects.length > 0) {
        const tasksRes = await api.getTasks(projects[0].id);
        setTasks(tasksRes);
      } else {
        setTasks([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
    const interval = setInterval(loadTasks, 8000);
    return () => clearInterval(interval);
  }, [activeClient]);

  const handleExecuteNow = async (taskId: string) => {
    try {
      await api.executeTaskNow(taskId);
      loadTasks();
    } catch (err: any) {
      alert(`Execution failed: ${err.message}`);
    }
  };

  const handleRetry = async (taskId: string) => {
    try {
      await api.retryTask(taskId);
      loadTasks();
    } catch (err: any) {
      alert(`Retry failed: ${err.message}`);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (statusFilter === 'all') return true;
    return t.status === statusFilter;
  });

  const openLogs = (task: MarketingTask) => {
    setSelectedTask(task);
    setIsLogsModalOpen(true);
  };

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Task Execution Queue</h1>
          <p className="text-xs text-gray-400">
            Real-time background agent tasks for <span className="text-brand-400 font-bold">{activeClient?.company_name}</span>
          </p>
        </div>
        <button
          onClick={loadTasks}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs text-gray-200 font-semibold transition-colors border border-white/10"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Queue</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs overflow-x-auto">
        {['all', 'Completed', 'Running', 'Queued', 'Pending', 'Awaiting Approval', 'Failed'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`px-3.5 py-1.5 rounded-xl font-bold transition-colors ${
              statusFilter === st ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {st} ({st === 'all' ? tasks.length : tasks.filter((t) => t.status === st).length})
          </button>
        ))}
      </div>

      {/* Tasks Table */}
      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-dark-card/90 text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-white/5">
              <tr>
                <th className="py-3 px-4">Task Description</th>
                <th className="py-3 px-4">Specialized Agent</th>
                <th className="py-3 px-4">Day #</th>
                <th className="py-3 px-4">Tokens / Cost</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    No tasks found matching filter.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((t) => (
                  <tr key={t.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 font-semibold text-white max-w-xs truncate">
                      {t.title}
                    </td>
                    <td className="py-3.5 px-4 text-brand-400 font-medium">
                      {t.agent_name}
                    </td>
                    <td className="py-3.5 px-4 text-gray-400">
                      Day {t.day_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="text-white font-mono">{t.token_usage?.toLocaleString() || 0}</span>
                      <span className="text-[10px] text-gray-500 ml-1">(${t.execution_cost?.toFixed(3)})</span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        t.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' :
                        t.status === 'Running' ? 'bg-brand-500/20 text-brand-400 border border-brand-500/30 animate-pulse' :
                        t.status === 'Failed' ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30' :
                        t.status === 'Awaiting Approval' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-white/10 text-gray-400'
                      }`}>
                        {t.status === 'Completed' && <CheckCircle2 className="w-3 h-3" />}
                        {t.status === 'Failed' && <XCircle className="w-3 h-3" />}
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <button
                        onClick={() => openLogs(t)}
                        title="View Execution Output & Logs"
                        className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-brand-400 font-semibold text-[11px] transition-colors"
                      >
                        Inspect Output
                      </button>

                      {t.status !== 'Completed' && (
                        <button
                          onClick={() => handleExecuteNow(t.id)}
                          title="Trigger Execution Immediately"
                          className="px-2.5 py-1 rounded-lg bg-brand-500 hover:bg-brand-600 text-white font-bold text-[11px] transition-colors"
                        >
                          Run Now
                        </button>
                      )}

                      {t.status === 'Failed' && (
                        <button
                          onClick={() => handleRetry(t.id)}
                          title="Retry Failed Task"
                          className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-[11px] transition-colors"
                        >
                          Retry
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TaskLogsModal
        task={selectedTask}
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)}
      />
    </div>
  );
};
