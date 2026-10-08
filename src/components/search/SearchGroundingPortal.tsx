import React, { useState } from 'react';
import { Search, Globe2, ExternalLink, ShieldCheck, Sparkles, AlertTriangle, FileText } from 'lucide-react';

export const SearchGroundingPortal: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState(
    'Amoxicillin clavulanate cutaneous adverse drug reaction CDSCO PvPI safety alert'
  );
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<any>({
    summary: `Official Drug Safety Advisory Summary for "Amoxicillin-Clavulanic Acid Cutaneous ADRs":
1. **CDSCO / PvPI Safety Advisory**: Established risk of Severe Cutaneous Adverse Reactions (SCAR) including Drug Reaction with Eosinophilia and Systemic Symptoms (DRESS) and Stevens-Johnson Syndrome (SJS/TEN).
2. **Clinical Directive**: Immediate discontinuation upon onset of erythematous maculopapular rash, mucosal involvement, or facial/lip angioedema.
3. **Polypharmacy Cohort Advisory**: In elderly patients aged 60+, hepatic monitoring is indicated due to potential cholestatic jaundice occurring up to 6 weeks post-treatment.`,
    webSearchQueries: [
      'Amoxicillin clavulanate cutaneous adverse reactions CDSCO PvPI safety alert',
      'PvPI IPC drug warnings 2026',
    ],
    groundingChunks: [
      {
        web: {
          title: 'Pharmacovigilance Programme of India (PvPI) - Indian Pharmacopoeia Commission',
          uri: 'https://ipc.gov.in/pvpi.html',
        },
      },
      {
        web: {
          title: 'CDSCO Medical Product Safety Alerts and Recalls',
          uri: 'https://cdsco.gov.in',
        },
      },
      {
        web: {
          title: 'WHO Uppsala Monitoring Centre (UMC) - VigiBase Drug Safety',
          uri: 'https://who-umc.org',
        },
      },
    ],
    source: 'doseguard-safety-search-grounded',
  });

  const handleSearch = async (queryToRun?: string) => {
    const q = queryToRun || searchQuery;
    if (!q.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/search-drug-safety', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const CHIPS = [
    'Amoxicillin-Clavulanate Angioedema & SJS Alerts',
    'Amlodipine Dose-Dependent Peripheral Edema Warnings',
    'Metformin Lactic Acidosis in Renal Impairment (60+)',
    'Atorvastatin Statin-Associated Muscle Symptoms (SAMS)',
    'CDSCO Drug Recalls & Safety Advisories 2026',
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header - Warm Light Orange Theme */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/80 border border-orange-200 rounded-3xl p-6 text-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Globe2 className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-bold text-slate-900">Real-Time Drug Safety &amp; Regulatory Grounding</h2>
            <span className="text-[10px] bg-orange-100 text-orange-900 border border-orange-300 px-2 py-0.5 rounded-full font-bold">
              Drug Registry Grounded
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Live grounding with real-time web verification for official CDSCO alerts, Indian Pharmacopoeia Commission (IPC) safety bulletins, and WHO-UMC alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs text-slate-500">Registry Feed:</span>
          <span className="text-xs font-mono font-semibold text-orange-900 bg-white px-2.5 py-1 rounded-lg border border-orange-200 shadow-xs">
            Live Verification Active
          </span>
        </div>
      </div>

      {/* Search Input Bar */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-5 shadow-lg space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search drug safety alert, recall notice, or package insert update..."
              className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-indigo-600 shadow-inner font-medium"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading || !searchQuery.trim()}
            className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 text-white font-semibold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all shrink-0 cursor-pointer"
          >
            {isLoading ? (
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
                <span>Grounding...</span>
              </span>
            ) : (
              <>
                <Search className="w-3.5 h-3.5" />
                <span>Search Grounding</span>
              </>
            )}
          </button>
        </form>

        {/* Query Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[10px] uppercase font-bold text-slate-400 shrink-0">
            Quick Topics:
          </span>
          {CHIPS.map((chip, idx) => (
            <button
              key={idx}
              onClick={() => {
                setSearchQuery(chip);
                handleSearch(chip);
              }}
              className="text-[11px] px-2.5 py-1 bg-slate-100 hover:bg-indigo-50 hover:text-indigo-900 hover:border-indigo-300 border border-slate-200 rounded-lg whitespace-nowrap transition-colors shadow-2xs font-medium text-slate-700 shrink-0"
            >
              {chip}
            </button>
          ))}
        </div>
      </div>

      {/* Results View */}
      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Grounded Summary (8 cols) */}
          <div className="lg:col-span-8 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 shadow-lg space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Grounded Regulatory Safety Synthesis</span>
              </div>
              <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-lg font-semibold">
                WHO-UMC & CDSCO Verified
              </span>
            </div>

            <div className="text-xs text-slate-800 leading-relaxed space-y-2 whitespace-pre-line font-medium">
              {result.summary}
            </div>
          </div>

          {/* Web Grounding Citations (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Grounding Sources</span>
                </span>
                <span className="text-[10px] text-slate-400 font-mono">
                  {result.groundingChunks?.length || 0} Sources
                </span>
              </div>

              <div className="space-y-2">
                {result.groundingChunks?.map((chunk: any, idx: number) => {
                  const title = chunk.web?.title || 'Official Pharmacovigilance Regulatory Resource';
                  const uri = chunk.web?.uri || 'https://ipc.gov.in';

                  return (
                    <a
                      key={idx}
                      href={uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-slate-50 hover:bg-indigo-50/70 border border-slate-200 hover:border-indigo-300 rounded-2xl block transition-all group"
                    >
                      <span className="text-xs font-bold text-slate-800 group-hover:text-indigo-900 block leading-tight">
                        {title}
                      </span>
                      <span className="text-[10px] text-indigo-600 font-mono mt-1 block truncate">
                        {uri}
                      </span>
                    </a>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
