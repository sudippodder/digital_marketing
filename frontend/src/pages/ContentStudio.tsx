import React, { useState, useEffect } from 'react';
import { 
  FileText, Plus, Sparkles, Send, CheckCircle2, 
  ExternalLink, Share2, Tag, Calendar, Loader2 
} from 'lucide-react';
import { api } from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { ContentItem } from '../types';

export const ContentStudio: React.FC = () => {
  const { activeClient } = useAuthStore();
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [activePlatform, setActivePlatform] = useState('all');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [promptTopic, setPromptTopic] = useState('');
  const [targetType, setTargetType] = useState('Blog Post');

  const loadContent = async () => {
    if (!activeClient) return;
    try {
      const res = await api.getContent(activeClient.id);
      setContentItems(res);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadContent();
  }, [activeClient]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClient || !promptTopic) return;
    setIsGenerating(true);
    try {
      await api.createContent(activeClient.id, {
        title: promptTopic,
        content_type: targetType,
        platform: targetType === 'Blog Post' ? 'Blog' : 'LinkedIn',
        body: `Automated high-impact marketing piece synthesized for ${activeClient.company_name}.\n\nKey Insights:\n1. Addressing target audience challenges.\n2. Demonstrating domain authority and ROI.\n3. Clear call-to-action for consultation.`,
        target_keywords: ['industry growth', 'scalability solutions']
      });
      setShowGenerateModal(false);
      setPromptTopic('');
      loadContent();
    } catch (err: any) {
      alert(`Generation failed: ${err.message}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePublish = async (contentId: string) => {
    try {
      const res = await api.publishContent(contentId);
      alert(`Successfully published to ${res.published_url}`);
      loadContent();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const filteredContent = contentItems.filter((c) => {
    if (activePlatform === 'all') return true;
    return c.platform.toLowerCase() === activePlatform.toLowerCase();
  });

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-white tracking-tight">AI Content Studio & Publisher</h1>
          <p className="text-xs text-gray-400">
            SEO blog articles, LinkedIn thought leadership, social captions, and high-converting ad copy
          </p>
        </div>
        <button
          onClick={() => setShowGenerateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-accent-purple hover:opacity-95 text-white font-bold text-xs shadow-lg shadow-brand-500/20 transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>Synthesize AI Content</span>
        </button>
      </div>

      {/* Platform Filter */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs">
        {['all', 'Blog', 'LinkedIn', 'Instagram', 'Meta'].map((p) => (
          <button
            key={p}
            onClick={() => setActivePlatform(p)}
            className={`px-3.5 py-1.5 rounded-xl font-bold capitalize transition-colors ${
              activePlatform === p ? 'bg-brand-500 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {p} ({p === 'all' ? contentItems.length : contentItems.filter((c) => c.platform.toLowerCase() === p.toLowerCase()).length})
          </button>
        ))}
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContent.map((item) => (
          <div key={item.id} className="glass-panel p-6 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-start justify-between">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  {item.platform} • {item.content_type}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  item.status === 'Published' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {item.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-white line-clamp-2">{item.title}</h3>
              <p className="text-xs text-gray-400 line-clamp-4 whitespace-pre-line">{item.body}</p>

              {item.target_keywords && item.target_keywords.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {item.target_keywords.map((kw, i) => (
                    <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400">
                      #{kw}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              {item.performance_metrics?.views ? (
                <span className="text-[11px] text-gray-400 font-semibold">
                  👁️ {item.performance_metrics.views} views • {item.performance_metrics.engagements || 0} engagements
                </span>
              ) : (
                <span className="text-[11px] text-gray-500">Drafted by AI Agent</span>
              )}

              {item.status !== 'Published' ? (
                <button
                  onClick={() => handlePublish(item.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold text-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Publish</span>
                </button>
              ) : (
                <a
                  href={item.published_url || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-brand-400 hover:underline flex items-center gap-1"
                >
                  <span>View Live</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Generate AI Content Modal */}
      {showGenerateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="glass-panel p-6 rounded-2xl max-w-lg w-full border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-400" />
                <span>AI Content Generator</span>
              </h3>
              <button onClick={() => setShowGenerateModal(false)} className="text-gray-400 text-xs px-2 py-1">✕</button>
            </div>

            <form onSubmit={handleGenerate} className="space-y-3 text-xs">
              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Content Format</label>
                <select
                  value={targetType}
                  onChange={(e) => setTargetType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none"
                >
                  <option value="Blog Post">Cornerstone SEO Blog Article</option>
                  <option value="Social Caption">LinkedIn Thought-Leadership Post</option>
                  <option value="Ad Copy">Google & Meta High-CTR Ad Copy</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-400 mb-1 font-semibold">Topic / Focus Angle</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 5 Costly Mistakes When Choosing Enterprise Health Software"
                  value={promptTopic}
                  onChange={(e) => setPromptTopic(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-dark-bg border border-white/10 text-white focus:outline-none focus:border-brand-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowGenerateModal(false)} className="px-3 py-1.5 rounded-lg bg-white/5 text-gray-300">
                  Cancel
                </button>
                <button type="submit" disabled={isGenerating} className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-brand-500 hover:bg-brand-600 text-white font-bold">
                  {isGenerating && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Generate Draft</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
