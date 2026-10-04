import React, { useState, useEffect } from 'react';
import { FileText, ExternalLink, Send, Sparkles } from 'lucide-react';
import { api } from '../../services/api';
import { useAuthStore } from '../../store/useAuthStore';
import { ContentItem } from '../../types';

export const ClientContent: React.FC = () => {
  const { activeClient } = useAuthStore();
  const [content, setContent] = useState<ContentItem[]>([]);

  useEffect(() => {
    if (activeClient) {
      api.getContent(activeClient.id).then(setContent).catch(console.error);
    }
  }, [activeClient]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="text-2xl font-extrabold text-white tracking-tight">Content Library & Published Assets</h1>
        <p className="text-xs text-gray-400">
          SEO blog posts, social media thought-leadership articles, and ad copy for <span className="text-brand-400 font-bold">{activeClient?.company_name}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {content.map((c) => (
          <div key={c.id} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-brand-400 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                  {c.platform} • {c.content_type}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  c.status === 'Published' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {c.status}
                </span>
              </div>
              <h3 className="text-sm font-bold text-white leading-snug">{c.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-4 whitespace-pre-line">{c.body}</p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs">
              {c.performance_metrics?.views ? (
                <span className="text-[11px] text-gray-400 font-semibold">
                  👁️ {c.performance_metrics.views} views • {c.performance_metrics.engagements || 0} engagements
                </span>
              ) : (
                <span className="text-[11px] text-gray-500">Drafted by AI Content Agent</span>
              )}

              {c.published_url && (
                <a href={c.published_url} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline flex items-center gap-1 font-semibold">
                  <span>View</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
