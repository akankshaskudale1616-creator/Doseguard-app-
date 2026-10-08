import React, { useState } from 'react';
import { MapPin, PhoneCall, Building2, Navigation, Sparkles, Search, ShieldAlert, ExternalLink } from 'lucide-react';

export const AmcLocator: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState('Pune');
  const [isLoading, setIsLoading] = useState(false);
  const [centerData, setCenterData] = useState<any>({
    details: `Official ADR Monitoring Centres (AMCs) & Emergency Centers near Pune:
1. **B.J. Government Medical College & Sassoon General Hospital**
   - Address: Station Road, Sangamvadi, Pune, Maharashtra 411001
   - Status: Primary Regional ADR Monitoring Centre (AMC Code: AMC-042)
   - Emergency Casualty: 24/7 Active · Phone: 020-26128000

2. **KEM Hospital & Research Centre**
   - Address: Sardar Moodliar Road, Rasta Peth, Pune 411011
   - Status: Recognized PvPI Partner Hospital
   - Emergency Casualty: 24/7 Active · Phone: 020-66037300

3. **National Medical Emergency Helpline: 108 / 112**
   - Direct ambulance dispatch across all districts of Maharashtra and India.`,
    groundingChunks: [
      { web: { title: 'Sassoon General Hospital ADR Monitoring Centre', uri: 'https://bjmcpune.org' } },
      { web: { title: 'KEM Hospital Pune Clinical Emergency Centre', uri: 'https://kemhospitalpune.org' } },
    ],
  });

  const CITIES = ['Pune', 'Mumbai', 'Nagpur', 'Bengaluru', 'Delhi NCR', 'Hyderabad', 'Chennai'];

  const handleFetchCenters = async (city: string) => {
    setSelectedCity(city);
    setIsLoading(true);
    try {
      const response = await fetch('/api/find-amcs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city }),
      });
      const data = await response.json();
      setCenterData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {/* Header - Warm Light Orange Theme */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/80 border border-orange-200 rounded-3xl p-6 text-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-bold text-slate-900">ADR Monitoring Centres (AMCs) &amp; Casualty Locator</h2>
            <span className="text-[10px] bg-orange-100 text-orange-900 border border-orange-300 px-2 py-0.5 rounded-full font-bold">
              PvPI Network Node
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Locate official Pharmacovigilance Programme of India (PvPI) monitoring centres, government medical colleges, and 24/7 emergency casualty departments.
          </p>
        </div>

        <a
          href="tel:108"
          className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call 108 Emergency Ambulance</span>
        </a>
      </div>

      {/* City Tabs */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-4 shadow-lg flex items-center gap-2 overflow-x-auto">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1">
          Select Region:
        </span>
        {CITIES.map((city) => (
          <button
            key={city}
            onClick={() => handleFetchCenters(city)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              selectedCity === city
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Results Card (8 cols) */}
        <div className="lg:col-span-8 bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-6 shadow-lg space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900">
              <Building2 className="w-4 h-4 text-indigo-600" />
              <span>Verified PvPI Centres & Emergency Hospitals in {selectedCity}</span>
            </div>
            {isLoading && (
              <span className="text-[10px] text-indigo-600 flex items-center gap-1 font-semibold">
                <Sparkles className="w-3 h-3 animate-spin" />
                <span>Locating with Google Maps...</span>
              </span>
            )}
          </div>

          <div className="text-xs text-slate-800 leading-relaxed space-y-2 whitespace-pre-line font-medium">
            {centerData.details}
          </div>
        </div>

        {/* Emergency Notice & Guidelines (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-900 font-bold text-xs">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>When to visit an AMC or Casualty</span>
            </div>
            <ul className="text-xs text-rose-950 space-y-1.5">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                <span>Acute facial or tongue swelling within 2 hours of drug intake</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                <span>Shortness of breath, wheezing, or tightness</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                <span>Skin blisters spreading to mouth, eyes, or genitals</span>
              </li>
            </ul>
          </div>

          <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 shadow-lg space-y-2 text-xs">
            <span className="font-bold text-slate-800 block">PvPI Toll-Free National Helpline</span>
            <p className="text-slate-600">
              National Pharmacovigilance Programme Helpline: <strong>1800-180-3024</strong> (Indian Pharmacopoeia Commission).
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
