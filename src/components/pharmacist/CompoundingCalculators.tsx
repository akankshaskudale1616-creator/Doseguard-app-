import React, { useState } from 'react';
import {
  Calculator,
  FlaskConical,
  Baby,
  Activity,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Info,
} from 'lucide-react';

export const CompoundingCalculators: React.FC = () => {
  const [activeCalcTab, setActiveCalcTab] = useState<'alligation' | 'pediatric' | 'bsa_crcl'>('alligation');

  // ================= 1. ALLIGATION & DILUTION (C1V1 = C2V2) =================
  const [c1, setC1] = useState<number>(70); // % initial concentration
  const [v1, setV1] = useState<number>(0); // calculated or specified
  const [c2, setC2] = useState<number>(50); // % desired concentration
  const [v2, setV2] = useState<number>(500); // mL desired volume
  const [dilutionSolveTarget, setDilutionSolveTarget] = useState<'V1' | 'C2' | 'V2'>('V1');

  // Alligation Alternate state
  const [alligHigh, setAlligHigh] = useState<number>(50); // e.g. 50% dextrose
  const [alligLow, setAlligLow] = useState<number>(5); // e.g. 5% dextrose
  const [alligDesired, setAlligDesired] = useState<number>(20); // e.g. 20% dextrose
  const [alligTotalVol, setAlligTotalVol] = useState<number>(1000); // mL

  // Calculations for C1V1 = C2V2
  const calcDilutionV1 = c1 > 0 ? (c2 * v2) / c1 : 0;
  const diluentVol = v2 > calcDilutionV1 ? v2 - calcDilutionV1 : 0;

  // Calculations for Alligation Alternate
  const partsHigh = Math.max(0, alligDesired - alligLow);
  const partsLow = Math.max(0, alligHigh - alligDesired);
  const totalParts = partsHigh + partsLow;
  const volHigh = totalParts > 0 ? (partsHigh / totalParts) * alligTotalVol : 0;
  const volLow = totalParts > 0 ? (partsLow / totalParts) * alligTotalVol : 0;

  // ================= 2. PEDIATRIC DOSAGE RULES =================
  const [childAgeYears, setChildAgeYears] = useState<number>(6);
  const [childWeightKg, setChildWeightKg] = useState<number>(20);
  const [adultDoseMg, setAdultDoseMg] = useState<number>(500);

  // Young's rule: [Age / (Age + 12)] * Adult Dose (for 1-12 yrs)
  const youngsDose = childAgeYears > 0 ? (childAgeYears / (childAgeYears + 12)) * adultDoseMg : 0;

  // Dilling's rule: (Age / 20) * Adult Dose (for 4-20 yrs)
  const dillingsDose = childAgeYears > 0 ? (childAgeYears / 20) * adultDoseMg : 0;

  // Clark's rule: (Weight in kg / 70) * Adult Dose
  const clarksDose = childWeightKg > 0 ? (childWeightKg / 70) * adultDoseMg : 0;

  // ================= 3. BSA & RENAL CLEARANCE (CrCl) =================
  const [patientAge, setPatientAge] = useState<number>(68);
  const [patientGender, setPatientGender] = useState<'male' | 'female'>('male');
  const [patientWeightKg, setPatientWeightKg] = useState<number>(68);
  const [patientHeightCm, setPatientHeightCm] = useState<number>(168);
  const [serumCrMgDl, setSerumCrMgDl] = useState<number>(1.08);

  // Mosteller BSA = sqrt((Height_cm * Weight_kg) / 3600)
  const bsaMosteller =
    patientHeightCm > 0 && patientWeightKg > 0
      ? Math.sqrt((patientHeightCm * patientWeightKg) / 3600)
      : 0;

  // DuBois BSA = 0.007184 * Height^0.725 * Weight^0.425
  const bsaDuBois =
    patientHeightCm > 0 && patientWeightKg > 0
      ? 0.007184 * Math.pow(patientHeightCm, 0.725) * Math.pow(patientWeightKg, 0.425)
      : 0;

  // Cockcroft-Gault CrCl = [(140 - Age) * Weight_kg] / (72 * Serum_Cr) * (0.85 if female)
  const rawCrCl =
    serumCrMgDl > 0
      ? ((140 - patientAge) * patientWeightKg) / (72 * serumCrMgDl)
      : 0;
  const crClCockcroft = patientGender === 'female' ? rawCrCl * 0.85 : rawCrCl;

  // Renal staging
  const getRenalStage = (crcl: number) => {
    if (crcl >= 90) return { stage: 'Stage 1: Normal Renal Function (≥90 mL/min)', color: 'text-emerald-700 bg-emerald-50 border-emerald-300', advice: 'Standard dosing for renal-cleared drugs.' };
    if (crcl >= 60) return { stage: 'Stage 2: Mild Impairment (60–89 mL/min)', color: 'text-sky-700 bg-sky-50 border-sky-300', advice: 'Standard dosing for most drugs; monitor elderly.' };
    if (crcl >= 30) return { stage: 'Stage 3: Moderate Impairment (30–59 mL/min)', color: 'text-amber-800 bg-amber-50 border-amber-300', advice: 'Dose adjustment required for Amoxicillin, Metformin max 1000mg/day, Cefuroxime extend interval to q12-24h.' };
    if (crcl >= 15) return { stage: 'Stage 4: Severe Impairment (15–29 mL/min)', color: 'text-orange-800 bg-orange-50 border-orange-300', advice: 'Discontinue Metformin (lactic acidosis risk); reduce antibiotic dose by 50%.' };
    return { stage: 'Stage 5: Kidney Failure (<15 mL/min)', color: 'text-rose-800 bg-rose-50 border-rose-300', advice: 'Critical: Hemodialysis dosing rules apply.' };
  };

  const renalStage = getRenalStage(crClCockcroft);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
            <Calculator className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900">Clinical Compounding & Dosage Calculators</h3>
            <p className="text-xs text-slate-500">
              Pharmacopeia-grade clinical formulas for compounding dilutions, pediatric scaling, and renal clearance adjustment.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1.5 rounded-2xl text-xs font-semibold">
          <button
            onClick={() => setActiveCalcTab('alligation')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeCalcTab === 'alligation'
                ? 'bg-white text-orange-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5 text-orange-600" />
            <span>Alligation & Dilution ($C_1V_1=C_2V_2$)</span>
          </button>
          <button
            onClick={() => setActiveCalcTab('pediatric')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeCalcTab === 'pediatric'
                ? 'bg-white text-orange-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Baby className="w-3.5 h-3.5 text-amber-600" />
            <span>Pediatric Rules (Young's & Dilling's)</span>
          </button>
          <button
            onClick={() => setActiveCalcTab('bsa_crcl')}
            className={`px-3.5 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              activeCalcTab === 'bsa_crcl'
                ? 'bg-white text-orange-950 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-rose-600" />
            <span>BSA & Renal ($CrCl$)</span>
          </button>
        </div>
      </div>

      {/* ================= 1. ALLIGATION & DILUTION ================= */}
      {activeCalcTab === 'alligation' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Part A: Simple Dilution (C1V1 = C2V2) */}
            <div className="bg-orange-50/50 border border-orange-200/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-orange-900 flex items-center gap-1.5">
                  <FlaskConical className="w-4 h-4 text-orange-600" />
                  Formula 1: Direct Dilution ($C_1V_1 = C_2V_2$)
                </span>
                <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded-md border border-orange-200 text-orange-800">
                  Stock Solution Dilution
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Calculate the volume of concentrated stock solution ($V_1$) required to prepare a desired lower strength ($C_2$) in volume ($V_2$).
              </p>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Stock Conc ($C_1$) %
                  </label>
                  <input
                    type="number"
                    value={c1}
                    onChange={(e) => setC1(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Desired Conc ($C_2$) %
                  </label>
                  <input
                    type="number"
                    value={c2}
                    onChange={(e) => setC2(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Target Volume ($V_2$) mL
                  </label>
                  <input
                    type="number"
                    value={v2}
                    onChange={(e) => setV2(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                  />
                </div>
              </div>

              {/* Result card */}
              <div className="bg-white rounded-xl border border-orange-200 p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500 font-medium">Stock Volume Required ($V_1$):</span>
                  <span className="text-lg font-mono font-extrabold text-orange-900">
                    {calcDilutionV1.toFixed(2)} mL
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                  <span className="text-xs text-slate-500 font-medium">Diluent (Water/Saline) to Add:</span>
                  <span className="text-sm font-mono font-bold text-slate-700">
                    {diluentVol.toFixed(2)} mL
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 italic mt-1">
                  Compound instruction: Measure {calcDilutionV1.toFixed(1)} mL of {c1}% solution, and add QS with sterile water up to {v2} mL mark.
                </p>
              </div>
            </div>

            {/* Part B: Alligation Alternate Method */}
            <div className="bg-amber-50/50 border border-amber-200/80 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  Formula 2: Alligation Alternate
                </span>
                <span className="text-[11px] font-mono bg-white px-2 py-0.5 rounded-md border border-amber-200 text-amber-800">
                  Two-Strength Blending
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed">
                Determine parts and volumes needed when blending a higher-strength product and a lower-strength product to achieve an intermediate target.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Higher Strength ($C_H$) %
                  </label>
                  <input
                    type="number"
                    value={alligHigh}
                    onChange={(e) => setAlligHigh(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Lower Strength ($C_L$) %
                  </label>
                  <input
                    type="number"
                    value={alligLow}
                    onChange={(e) => setAlligLow(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Desired Target ($C_D$) %
                  </label>
                  <input
                    type="number"
                    value={alligDesired}
                    onChange={(e) => setAlligDesired(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Batch Volume (V_total) mL
                  </label>
                  <input
                    type="number"
                    value={alligTotalVol}
                    onChange={(e) => setAlligTotalVol(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>
              </div>

              {/* Alligation Results */}
              <div className="bg-white rounded-xl border border-amber-200 p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">Parts of {alligHigh}%:</span>
                  <span className="font-mono font-bold text-amber-900">
                    {partsHigh} parts ({volHigh.toFixed(1)} mL)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100">
                  <span className="text-slate-600 font-medium">Parts of {alligLow}%:</span>
                  <span className="font-mono font-bold text-amber-900">
                    {partsLow} parts ({volLow.toFixed(1)} mL)
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-100 font-bold text-slate-900">
                  <span>Total Compound:</span>
                  <span className="font-mono text-orange-950">
                    {alligTotalVol} mL of {alligDesired}% solution
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. PEDIATRIC DOSAGE RULES ================= */}
      {activeCalcTab === 'pediatric' && (
        <div className="space-y-6">
          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Baby className="w-4 h-4 text-amber-600" />
                Standard Pediatric Scaling Rules (Age & Weight Based)
              </span>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full border border-amber-200">
                Ages 1 to 18 Years
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Child Age (Years)
                </label>
                <input
                  type="number"
                  min="1"
                  max="18"
                  value={childAgeYears}
                  onChange={(e) => setChildAgeYears(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Child Weight (kg)
                </label>
                <input
                  type="number"
                  min="2"
                  max="80"
                  value={childWeightKg}
                  onChange={(e) => setChildWeightKg(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Standard Adult Dose (mg)
                </label>
                <input
                  type="number"
                  step="25"
                  value={adultDoseMg}
                  onChange={(e) => setAdultDoseMg(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>

            {/* Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Young's Rule */}
              <div className="bg-white rounded-2xl border border-orange-200 p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-orange-900">Young's Formula</span>
                  <span className="text-[10px] bg-orange-100 text-orange-800 font-bold px-1.5 py-0.5 rounded">
                    Age 1–12 yrs
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                  Child Dose = [Age / (Age + 12)] × Adult Dose
                </div>
                <div className="text-center pt-2">
                  <span className="text-2xl font-mono font-black text-orange-900">
                    {youngsDose.toFixed(1)} mg
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ({((youngsDose / adultDoseMg) * 100).toFixed(0)}% of adult dose)
                  </p>
                </div>
              </div>

              {/* Dilling's Rule */}
              <div className="bg-white rounded-2xl border border-amber-200 p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-amber-900">Dilling's Formula</span>
                  <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                    Age 4–20 yrs
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                  Child Dose = (Age / 20) × Adult Dose
                </div>
                <div className="text-center pt-2">
                  <span className="text-2xl font-mono font-black text-amber-900">
                    {dillingsDose.toFixed(1)} mg
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ({((dillingsDose / adultDoseMg) * 100).toFixed(0)}% of adult dose)
                  </p>
                </div>
              </div>

              {/* Clark's Rule */}
              <div className="bg-white rounded-2xl border border-sky-200 p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-sky-900">Clark's Formula</span>
                  <span className="text-[10px] bg-sky-100 text-sky-800 font-bold px-1.5 py-0.5 rounded">
                    Weight-based
                  </span>
                </div>
                <div className="font-mono text-xs text-slate-500 bg-slate-50 p-2 rounded-lg">
                  Child Dose = (Weight_kg / 70) × Adult Dose
                </div>
                <div className="text-center pt-2">
                  <span className="text-2xl font-mono font-black text-sky-900">
                    {clarksDose.toFixed(1)} mg
                  </span>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    ({((clarksDose / adultDoseMg) * 100).toFixed(0)}% of adult dose)
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Clinical Precaution:</strong> Mathematical rules are empiric approximations. For narrow therapeutic index medicines (e.g. Digoxin, Aminoglycosides, Antiepileptics), always consult exact mg/kg dosing guidelines and verify renal function.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. BSA & RENAL CLEARANCE (CrCl) ================= */}
      {activeCalcTab === 'bsa_crcl' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Input Parameters */}
            <div className="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-2xl p-5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-orange-600" />
                Patient Biometrics
              </h4>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Age (Years)
                    </label>
                    <input
                      type="number"
                      value={patientAge}
                      onChange={(e) => setPatientAge(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Gender
                    </label>
                    <select
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value as 'male' | 'female')}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
                    >
                      <option value="male">Male</option>
                      <option value="female">Female (× 0.85)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      value={patientWeightKg}
                      onChange={(e) => setPatientWeightKg(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      value={patientHeightCm}
                      onChange={(e) => setPatientHeightCm(Number(e.target.value))}
                      className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-700 block mb-1">
                    Serum Creatinine (S_cr) mg/dL
                  </label>
                  <input
                    type="number"
                    step="0.05"
                    value={serumCrMgDl}
                    onChange={(e) => setSerumCrMgDl(Number(e.target.value))}
                    className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Normal reference: 0.7 to 1.3 mg/dL. Values in elderly may overestimate GFR if muscle mass is low.
                  </p>
                </div>
              </div>
            </div>

            {/* Calculated Output Card */}
            <div className="lg:col-span-7 space-y-4">
              {/* Cockcroft-Gault Card */}
              <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-50 border border-orange-200 rounded-2xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-orange-950">
                      Cockcroft-Gault Renal Clearance ($CrCl$)
                    </span>
                    <p className="text-[11px] font-mono text-slate-600">
                      CrCl = [(140 - Age) × Wt] / [72 × Scr] {patientGender === 'female' ? '× 0.85' : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-3xl font-mono font-black text-orange-950">
                      {crClCockcroft.toFixed(1)}
                    </span>
                    <span className="text-xs font-bold text-slate-600 block">mL/min</span>
                  </div>
                </div>

                {/* Staging Badge */}
                <div className={`p-3 rounded-xl border text-xs font-medium space-y-1 ${renalStage.color}`}>
                  <div className="flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{renalStage.stage}</span>
                  </div>
                  <p className="text-[11px] pl-6 leading-relaxed">
                    {renalStage.advice}
                  </p>
                </div>
              </div>

              {/* BSA Outputs */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <span className="text-[11px] uppercase font-bold text-slate-500 block">
                    Mosteller Formula BSA
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-mono font-extrabold text-slate-900">
                      {bsaMosteller.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-slate-500">m²</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    sqrt((Ht × Wt) / 3600)
                  </p>
                </div>

                <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-xs">
                  <span className="text-[11px] uppercase font-bold text-slate-500 block">
                    DuBois Formula BSA
                  </span>
                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-2xl font-mono font-extrabold text-slate-900">
                      {bsaDuBois.toFixed(2)}
                    </span>
                    <span className="text-xs font-bold text-slate-500">m²</span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono mt-1">
                    0.007184 × Ht^0.725 × Wt^0.425
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
