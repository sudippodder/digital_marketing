import React, { useState, useEffect } from 'react';
import { 
  Rocket, CheckCircle2, AlertTriangle, XCircle, Sparkles, 
  ArrowRight, ShieldCheck, Zap, Loader2, DollarSign, Calendar
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { api } from '../services/api';
import { Client, MarketingProject, ValidationResult } from '../types';

interface StartMarketingModalProps {
  client: Client;
  project?: MarketingProject;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (executionData: any) => void;
}

export const StartMarketingModal: React.FC<StartMarketingModalProps> = ({
  client,
  project,
  isOpen,
  onClose,
  onSuccess
}) => {
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [currentStep, setCurrentStep] = useState<'validate' | 'confirm' | 'executing' | 'success'>('validate');
  const [executionResult, setExecutionResult] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      setCurrentStep('validate');
      setValidating(true);
      
      // If project exists, validate on backend; otherwise synthesize local check
      if (project) {
        api.validateMarketingActivation(project.id)
          .then((res) => {
            setValidation(res);
            setValidating(false);
          })
          .catch(() => {
            // Fallback
            runLocalValidation();
          });
      } else {
        runLocalValidation();
      }
    }
  }, [isOpen, client, project]);

  const runLocalValidation = () => {
    const checks = {
      has_company_name: Boolean(client.company_name?.trim()),
      has_website: Boolean(client.business_website?.trim()),
      has_industry: Boolean(client.industry?.trim()),
      has_products_or_services: (client.products_count || 0) > 0 || (client.services_count || 0) > 0,
      has_marketing_objectives: (client.marketing_objectives || []).length > 0,
      has_target_audience: Boolean(client.target_audience?.trim()),
      has_marketing_budget: (client.monthly_marketing_budget || 0) > 0,
      has_brand_tone: Boolean(client.brand_tone?.trim()),
    };

    const errors: string[] = [];
    if (!checks.has_company_name) errors.push("Company Name is required.");
    if (!checks.has_website) errors.push("Business Website is required.");
    if (!checks.has_products_or_services) errors.push("At least one Product or Service must be registered in the Knowledge Base.");
    if (!checks.has_marketing_objectives) errors.push("At least one Marketing Objective must be configured.");
    if (!checks.has_target_audience) errors.push("Target Audience description must be defined.");
    if (!checks.has_marketing_budget) errors.push("Monthly Marketing Budget must be greater than $0.");

    const isValid = errors.length === 0;
    setValidation({
      is_valid: isValid,
      ready_to_start: isValid,
      checks,
      errors,
      warnings: []
    });
    setValidating(false);
  };

  const handleStartMarketing = async () => {
    setLoading(true);
    setCurrentStep('executing');

    try {
      let targetProjectId = project?.id;

      // If no project existed yet, create one
      if (!targetProjectId) {
        const newProj = await api.createProject(client.id, {
          title: `${client.company_name} Omnichannel Growth Engine`,
          description: `Autonomous 30-day AI marketing campaign for ${client.company_name}`,
          monthly_budget: client.monthly_marketing_budget || 5000,
          selected_services: [
            "SEO Audit", "Keyword Research", "Blog Content Creation", "Google Ads", "Meta Ads", "Lead Generation", "Daily Reporting"
          ]
        });
        targetProjectId = newProj.id;
      }

      // Trigger Start Marketing endpoint
      const res = await api.startMarketing(targetProjectId);
      setExecutionResult(res);
      setCurrentStep('success');

      // Trigger celebratory confetti
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#0E8FE8', '#8B5CF6', '#10B981', '#F59E0B']
      });

      onSuccess(res);
    } catch (err: any) {
      alert(`Activation failed: ${err.message}`);
      setCurrentStep('validate');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl glass-panel rounded-2xl shadow-2xl border border-white/10 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-brand-950/60 to-dark-card">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center">
              <Rocket className="w-5 h-5 animate-pulse-slow" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Launch Digital Marketing Engine
              </h3>
              <p className="text-xs text-gray-400">
                Client: <span className="text-brand-400 font-semibold">{client.company_name}</span>
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

        {/* Modal Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {validating ? (
            <div className="py-12 flex flex-col items-center justify-center space-y-3">
              <Loader2 className="w-8 h-8 text-brand-400 animate-spin" />
              <p className="text-xs text-gray-300">Validating client profile and knowledge readiness...</p>
            </div>
          ) : currentStep === 'validate' ? (
            <div className="space-y-5">
              {/* Status Header Box */}
              <div className={`p-4 rounded-xl border ${
                validation?.is_valid 
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' 
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}>
                <div className="flex items-center gap-2 font-bold text-sm">
                  {validation?.is_valid ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>All Pre-flight Validation Checks Passed! Ready to Launch.</span>
                    </>
                  ) : (
                    <>
                      <AlertTriangle className="w-5 h-5 text-rose-400" />
                      <span>Action Required Before Activation</span>
                    </>
                  )}
                </div>
                <p className="text-xs mt-1 text-gray-300">
                  {validation?.is_valid 
                    ? 'The client profile has all required knowledge base products, objectives, audience criteria, and budget settings.'
                    : 'Please configure the missing client properties before launching automated AI marketing.'}
                </p>
              </div>

              {/* Checklist Breakdown */}
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">Pre-Flight Readiness Checklist</h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/5">
                    {validation?.checks.has_company_name ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>Business Profile & URL</span>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/5">
                    {validation?.checks.has_products_or_services ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>Products & Services ({client.products_count || 0} items)</span>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/5">
                    {validation?.checks.has_marketing_objectives ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>Defined Marketing Objectives</span>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/5">
                    {validation?.checks.has_target_audience ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>Target Audience Segment</span>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/5">
                    {validation?.checks.has_marketing_budget ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>Monthly Budget (${client.monthly_marketing_budget?.toLocaleString()})</span>
                  </div>

                  <div className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 border border-white/5">
                    {validation?.checks.has_brand_tone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                    )}
                    <span>Brand Tone & Voice Guidelines</span>
                  </div>
                </div>
              </div>

              {/* Strategy Parameters Preview */}
              <div className="p-3.5 rounded-xl bg-brand-500/5 border border-brand-500/20 text-xs space-y-2">
                <div className="flex items-center justify-between text-brand-400 font-bold">
                  <span className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    Autonomous Orchestrator Scope
                  </span>
                  <span>30-Day Execution Cycle</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 text-gray-300">
                  <div>
                    <p className="text-[10px] text-gray-500">Allocated Budget</p>
                    <p className="font-semibold text-white">${client.monthly_marketing_budget?.toLocaleString()}/mo</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Autonomous Agents</p>
                    <p className="font-semibold text-white">8 Specialized</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-500">Safety Policy</p>
                    <p className="font-semibold text-emerald-400">Human Approval Active</p>
                  </div>
                </div>
              </div>
            </div>
          ) : currentStep === 'executing' ? (
            <div className="py-10 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-brand-500/20 text-brand-400 border border-brand-500/30 flex items-center justify-center mx-auto animate-bounce">
                <Rocket className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-white">Initializing AI Marketing Workflows...</h4>
              <p className="text-xs text-gray-400 max-w-md mx-auto">
                The Marketing Orchestrator is synthesizing the 30-day strategy, constructing the task execution queue, and triggering the Market Research and SEO Agents.
              </p>
              <div className="w-48 h-1.5 bg-dark-bg rounded-full mx-auto overflow-hidden">
                <div className="w-full h-full bg-gradient-to-r from-brand-500 to-accent-purple animate-pulse" />
              </div>
            </div>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-extrabold text-white">Marketing Engine Successfully Launched!</h4>
              <p className="text-xs text-gray-300 max-w-md mx-auto">
                Execution ID: <span className="font-mono text-brand-400 font-bold">{executionResult?.execution_id}</span>
              </p>
              <p className="text-xs text-gray-400">
                Tasks are actively executing in the background. The client portal and live reports have been initialized.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-dark-card flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 transition-colors"
          >
            {currentStep === 'success' ? 'Close' : 'Cancel'}
          </button>

          {currentStep === 'validate' && (
            <button
              disabled={!validation?.is_valid || loading}
              onClick={handleStartMarketing}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs tracking-wide uppercase transition-all duration-200 ${
                validation?.is_valid
                  ? 'bg-gradient-to-r from-brand-600 via-brand-500 to-accent-purple text-white shadow-lg shadow-brand-500/30 hover:scale-[1.02] active:scale-95'
                  : 'bg-white/10 text-gray-500 cursor-not-allowed'
              }`}
            >
              <Rocket className="w-4 h-4" />
              <span>START DIGITAL MARKETING</span>
            </button>
          )}

          {currentStep === 'success' && (
            <button
              onClick={() => {
                onClose();
                window.location.reload();
              }}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-brand-500 text-white font-bold text-xs hover:bg-brand-600 transition-colors"
            >
              <span>View Campaign Live</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
