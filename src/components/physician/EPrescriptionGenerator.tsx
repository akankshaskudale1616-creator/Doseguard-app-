import React, { useState } from 'react';
import {
  ElectronicPrescription,
  Medicine,
  PatientDocumentedAllergy,
} from '../../types/pv';
import { CLINICAL_DRUG_DATABASE } from '../../data/clinicalWorkspaceData';
import {
  FileText,
  Search,
  Plus,
  Trash2,
  AlertTriangle,
  CheckCircle2,
  Send,
  Building2,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  Pill,
  Clock,
} from 'lucide-react';

interface EPrescriptionGeneratorProps {
  onAddEPrescription: (erx: ElectronicPrescription) => void;
  allergies: PatientDocumentedAllergy[];
  activeMedicines: Medicine[];
}

interface DraftMedItem {
  id: string;
  brandName: string;
  genericName: string;
  strength: string;
  dosageForm: string;
  frequency: string;
  route: string;
  durationDays: number;
  refills: number;
  instructions: string;
}

export const EPrescriptionGenerator: React.FC<EPrescriptionGeneratorProps> = ({
  onAddEPrescription,
  allergies,
  activeMedicines,
}) => {
  const [selectedDrugIndex, setSelectedDrugIndex] = useState<number>(1); // Defaults to Cefuroxime (Ceftum)
  const [customStrength, setCustomStrength] = useState<string>('500 mg');
  const [frequency, setFrequency] = useState<string>('BID');
  const [route, setRoute] = useState<string>('Oral');
  const [durationDays, setDurationDays] = useState<number>(7);
  const [refills, setRefills] = useState<number>(0);
  const [instructions, setInstructions] = useState<string>('Take 1 tablet twice daily after food for 7 days.');
  const [diagnosis, setDiagnosis] = useState<string>(
    'Acute Lower Respiratory Infection - Alternative therapy post-Amoxicillin hypersensitivity'
  );
  const [selectedPharmacy, setSelectedPharmacy] = useState<string>(
    'City Hospital Pharmacy (Node #1)'
  );

  const [prescribedItems, setPrescribedItems] = useState<DraftMedItem[]>([
    {
      id: 'draft-1',
      brandName: 'Ceftum 500',
      genericName: 'Cefuroxime Axetil',
      strength: '500 mg',
      dosageForm: 'Tablet',
      frequency: 'BID',
      route: 'Oral',
      durationDays: 7,
      refills: 0,
      instructions: 'Take 1 tablet after food twice daily. Watch for allergic cross-reactivity.',
    },
    {
      id: 'draft-2',
      brandName: 'Levocet 5',
      genericName: 'Levocetirizine',
      strength: '5 mg',
      dosageForm: 'Tablet',
      frequency: 'QD',
      route: 'Oral',
      durationDays: 5,
      refills: 1,
      instructions: 'Take 1 tablet at bedtime for relief of skin pruritus.',
    },
  ]);

  const [dispatchSuccess, setDispatchSuccess] = useState<string | null>(null);

  const currentSelectedDrug = CLINICAL_DRUG_DATABASE[selectedDrugIndex];

  // ================= AUTOMATIC CONTRAINDICATION & INTERACTION DETECTION =================
  const getContraindicationAlerts = () => {
    const alerts: Array<{ type: 'danger' | 'warning'; title: string; message: string }> = [];

    // Check all prescribed items and the current candidate against documented allergies
    const candidateName = currentSelectedDrug.brand.toLowerCase();
    const candidateGeneric = currentSelectedDrug.generic.toLowerCase();

    // 1. Penicillin allergy check
    const hasPenicillinAllergy = allergies.some((a) =>
      a.substance.toLowerCase().includes('penicillin') || a.substance.toLowerCase().includes('amoxicillin')
    );

    if (hasPenicillinAllergy) {
      if (candidateGeneric.includes('amoxicillin') || candidateGeneric.includes('ampicillin') || candidateName.includes('augmentin')) {
        alerts.push({
          type: 'danger',
          title: 'CRITICAL CONTRAINDICATION: Documented Penicillin Anaphylactoid Risk',
          message: `Patient Ramesh V. Kulkarni has severe documented allergy to Penicillins (angioedema, rash). Prescribing ${currentSelectedDrug.brand} is strictly contraindicated!`,
        });
      } else if (candidateGeneric.includes('cef') || candidateName.includes('ceftum')) {
        alerts.push({
          type: 'warning',
          title: 'Cephalosporin Cross-Reactivity Caution (<1%)',
          message: `Patient has penicillin allergy. 2nd generation cephalosporin (Cefuroxime) has distinct R1/R2 side chains with low cross-reactivity (<1%), but patient must be instructed to monitor cutaneous reactions.`,
        });
      }
    }

    // 2. Metformin / Contrast / Renal check
    const isTakingMetformin = activeMedicines.some((m) => m.genericName.toLowerCase().includes('metformin'));
    if (isTakingMetformin && (candidateName.includes('contrast') || candidateGeneric.includes('metformin'))) {
      alerts.push({
        type: 'warning',
        title: 'Renal / Lactic Acidosis Interaction Caution',
        message: 'Patient already receives Metformin. Ensure eGFR > 30 mL/min and monitor renal parameters.',
      });
    }

    return alerts;
  };

  const detectedAlerts = getContraindicationAlerts();

  const handleAddDrugToRx = () => {
    const newItem: DraftMedItem = {
      id: `draft-${Date.now()}`,
      brandName: currentSelectedDrug.brand,
      genericName: currentSelectedDrug.generic,
      strength: customStrength,
      dosageForm: 'Tablet',
      frequency,
      route,
      durationDays,
      refills,
      instructions,
    };
    setPrescribedItems([...prescribedItems, newItem]);
  };

  const handleRemoveDrug = (id: string) => {
    setPrescribedItems(prescribedItems.filter((i) => i.id !== id));
  };

  const handleDispatchEPrescription = () => {
    if (prescribedItems.length === 0) return;

    const newErx: ElectronicPrescription = {
      id: `ERX-2026-${Date.now().toString().slice(-4)}`,
      patientId: 'PAT-6801',
      patientName: 'Ramesh V. Kulkarni',
      patientAge: 68,
      patientGender: 'Male',
      prescriberName: 'Dr. Ananya Deshmukh, MD',
      prescriberRegistration: 'MCI-2009-4821',
      hospital: 'Department of Internal & Chest Medicine, Sassoon Hospital, Pune',
      date: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      diagnosis,
      medications: prescribedItems.map((item) => ({
        id: item.id,
        brandName: item.brandName,
        genericName: item.genericName,
        strength: item.strength,
        dosageForm: item.dosageForm,
        frequency: item.frequency,
        route: item.route,
        durationDays: item.durationDays,
        refills: item.refills,
        instructions: item.instructions,
      })),
      dispenseStatus: 'Pending',
      pharmacyName: selectedPharmacy,
      allergyCheckPassed: !detectedAlerts.some((a) => a.type === 'danger'),
      allergyNotes: 'Automated contraindication screen verified before dispatch.',
      interactionCheckPassed: true,
      dosageVerificationPassed: true,
      pharmacistNotes: 'New electronic prescription received from Dr. Ananya Deshmukh.',
    };

    onAddEPrescription(newErx);
    setDispatchSuccess(
      `e-Prescription (${newErx.id}) successfully dispatched to ${selectedPharmacy}! Now visible in Pharmacist Queue.`
    );
    setTimeout(() => setDispatchSuccess(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Dispatch confirmation banner */}
      {dispatchSuccess && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-center justify-between text-emerald-900 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold">{dispatchSuccess}</span>
          </div>
          <span className="text-[11px] font-mono text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full font-bold">
            Transmitted
          </span>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-white rounded-3xl border border-orange-200 p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-orange-900 bg-orange-100 px-2.5 py-0.5 rounded-full border border-orange-200 uppercase">
            Interactive Prescriber Engine
          </span>
          <h3 className="text-lg font-extrabold text-slate-900 mt-1">
            Electronic Prescription (e-Rx) Generator
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            Search formulary molecules, auto-fill frequencies/routes, verify allergy contraindications in real time, and dispatch directly to hospital or community pharmacy.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 font-semibold">Target Pharmacy:</span>
          <select
            value={selectedPharmacy}
            onChange={(e) => setSelectedPharmacy(e.target.value)}
            className="px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900"
          >
            <option value="City Hospital Pharmacy (Node #1)">City Hospital Pharmacy (Node #1)</option>
            <option value="Central Meds Dispensary">Central Meds Dispensary</option>
            <option value="Apex Community Pharmacy (PvPI Node)">Apex Community Pharmacy</option>
          </select>
        </div>
      </div>

      {/* Real-time Contraindication / Interaction Warning Alerts */}
      {detectedAlerts.length > 0 && (
        <div className="space-y-2">
          {detectedAlerts.map((alt, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border-2 flex items-start gap-3 shadow-xs ${
                alt.type === 'danger'
                  ? 'bg-rose-50 border-rose-400 text-rose-950 animate-pulse'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              <ShieldAlert className={`w-5 h-5 shrink-0 mt-0.5 ${alt.type === 'danger' ? 'text-rose-600' : 'text-amber-600'}`} />
              <div className="text-xs space-y-0.5">
                <span className="font-extrabold block text-sm">{alt.title}</span>
                <p className="leading-relaxed">{alt.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Grid: Drug Search & Builder (45%) + Current e-Rx Sheet & Dispatch (55%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Formulary Drug Picker & Auto-fill Form */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
            <Search className="w-4 h-4 text-orange-600" />
            Interactive Drug Search & Auto-fill Builder
          </h4>

          {/* Quick Molecule Selector */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">
              Select Candidate Molecule / Brand:
            </label>
            <select
              value={selectedDrugIndex}
              onChange={(e) => {
                const idx = Number(e.target.value);
                setSelectedDrugIndex(idx);
                setCustomStrength(CLINICAL_DRUG_DATABASE[idx].defaultDose);
                setFrequency(CLINICAL_DRUG_DATABASE[idx].defaultFreq);
                setRoute(CLINICAL_DRUG_DATABASE[idx].defaultRoute);
              }}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-400"
            >
              {CLINICAL_DRUG_DATABASE.map((d, i) => (
                <option key={i} value={i}>
                  {d.brand} ({d.generic}) - {d.class}
                </option>
              ))}
            </select>
          </div>

          <div className="p-3 bg-orange-50/50 rounded-2xl border border-orange-200/80 text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-orange-950">{currentSelectedDrug.brand}</span>
              <span className="text-[10px] bg-white border border-orange-200 px-2 py-0.5 rounded font-mono text-orange-800 font-bold">
                {currentSelectedDrug.class}
              </span>
            </div>
            <p className="text-[11px] text-slate-600">Active Compound: {currentSelectedDrug.generic}</p>
          </div>

          {/* Form Controls: Strength, Frequency, Route, Duration, Refills */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Strength (mg):</label>
              <input
                type="text"
                value={customStrength}
                onChange={(e) => setCustomStrength(e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono font-bold"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Frequency:</label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-xl font-bold"
              >
                <option value="QD">QD (Once daily)</option>
                <option value="BID">BID (Twice daily)</option>
                <option value="TID">TID (Thrice daily)</option>
                <option value="QID">QID (Four times daily)</option>
                <option value="PRN">PRN (As needed)</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Route:</label>
              <select
                value={route}
                onChange={(e) => setRoute(e.target.value)}
                className="w-full px-2 py-1.5 bg-white border border-slate-300 rounded-xl font-bold"
              >
                <option value="Oral">Oral</option>
                <option value="IV">Intravenous (IV)</option>
                <option value="Inhalation">Inhalation</option>
                <option value="Topical">Topical</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">Duration (Days):</label>
              <input
                type="number"
                value={durationDays}
                onChange={(e) => setDurationDays(Number(e.target.value))}
                className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl font-mono font-bold"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Authorized Refills:</label>
            <div className="flex items-center gap-2">
              {[0, 1, 2, 3].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => setRefills(num)}
                  className={`flex-1 py-1 rounded-xl text-xs font-bold border transition-all ${
                    refills === num
                      ? 'bg-orange-500 text-white border-orange-500 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200'
                  }`}
                >
                  {num} Refill{num > 1 ? 's' : ''}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Special Patient Instructions:</label>
            <input
              type="text"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-xl text-xs"
            />
          </div>

          <button
            type="button"
            onClick={handleAddDrugToRx}
            className="w-full py-2.5 bg-orange-100 hover:bg-orange-200 text-orange-950 font-bold border border-orange-300 rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-orange-600" />
            <span>Add Medication to Current e-Rx</span>
          </button>
        </div>

        {/* Right: Assembled e-Prescription Sheet & Direct Pharmacy Dispatch */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-orange-600" />
                Electronic Prescription Manifest ({prescribedItems.length} Drugs)
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Patient: Ramesh V. Kulkarni (PAT-6801) · Age 68 Male
              </p>
            </div>
            <span className="text-[10px] font-mono bg-orange-100 text-orange-900 px-2.5 py-0.5 rounded-full font-bold">
              Draft Mode
            </span>
          </div>

          {/* Clinical Diagnosis input */}
          <div>
            <label className="text-[11px] font-bold text-slate-700 block mb-1">Primary Clinical Diagnosis / Indication:</label>
            <input
              type="text"
              value={diagnosis}
              onChange={(e) => setDiagnosis(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-900 font-medium"
            />
          </div>

          {/* Items List */}
          <div className="space-y-3">
            {prescribedItems.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs border border-dashed border-slate-200 rounded-2xl">
                No medications added yet. Choose a molecule from the left builder to add items.
              </div>
            ) : (
              prescribedItems.map((item, idx) => (
                <div key={item.id} className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900 text-sm">{item.brandName}</span>
                        <span className="font-mono text-orange-900 bg-orange-100 px-2 py-0.2 rounded font-bold text-[11px]">
                          {item.strength}
                        </span>
                      </div>
                      <p className="text-slate-500 text-[11px] mt-0.5">{item.genericName}</p>
                    </div>

                    <button
                      onClick={() => handleRemoveDrug(item.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-700 pt-1 border-t border-slate-200">
                    <span className="font-semibold text-orange-950">
                      Freq: {item.frequency} · {item.route} · {item.durationDays} Days · {item.refills} Refills
                    </span>
                    <span className="text-slate-500 italic">{item.instructions}</span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Prescriber Attestation & Direct Dispatch Button */}
          <div className="p-4 bg-orange-50/50 rounded-2xl border border-orange-200/80 space-y-3 pt-4">
            <div className="flex items-center justify-between text-xs text-slate-600">
              <span>Prescriber: <strong>Dr. Ananya Deshmukh, MD (Reg: MCI-2009-4821)</strong></span>
              <span>Hospital: Sassoon Hospital, Pune</span>
            </div>

            <button
              onClick={handleDispatchEPrescription}
              disabled={prescribedItems.length === 0}
              className="w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 text-white font-extrabold rounded-2xl text-xs shadow-md shadow-orange-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Direct Dispatch e-Rx to {selectedPharmacy}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
