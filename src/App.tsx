/**
 * DoseGuard - Digital Pharmacovigilance System
 * Patient-to-Pharmacist Adverse Drug Reaction Triage & PvPI Integration
 * Supporting 8 Defined User Groups with Dedicated Dashboards & Light Orange Theme
 */

import React, { useState } from 'react';
import { Header, AppTab } from './components/Header';
import { PatientMobileView } from './components/patient/PatientMobileView';
import { CaregiverDashboard } from './components/caregiver/CaregiverDashboard';
import { PharmacistDashboard } from './components/pharmacist/PharmacistDashboard';
import { PhysicianDashboard } from './components/physician/PhysicianDashboard';
import { HospitalPvDashboard } from './components/hospital_pv/HospitalPvDashboard';
import { AmcDashboard } from './components/amc/AmcDashboard';
import { RegulatorDashboard } from './components/regulator/RegulatorDashboard';
import { ResearcherDashboard } from './components/researcher/ResearcherDashboard';
import { SafetyChatbot } from './components/chat/SafetyChatbot';
import { SearchGroundingPortal } from './components/search/SearchGroundingPortal';
import { AmcLocator } from './components/maps/AmcLocator';
import { DermatologyComparator } from './components/dermatology/DermatologyComparator';
import { SignalAnalytics } from './components/analytics/SignalAnalytics';
import { SystemArchitecture } from './components/architecture/SystemArchitecture';
import { LanguageSection } from './components/language/LanguageSection';
import { LanguageProvider } from './context/LanguageContext';
import { EmergencyModal } from './components/EmergencyModal';
import { PvpiExportModal } from './components/pharmacist/PvpiExportModal';
import { Medicine, SymptomReport, UserRole, ElectronicPrescription, DispenseStatus, DrugInventoryItem, RefillRequest, PharmacistConsultationLog, TelehealthAppointment, ConsultationSoapNote, DirectChatMessage, VitalSignEntry, PatientLabResult, PatientDocumentedAllergy, VisualAdrEvent, MedicationHistoryRecord } from './types/pv';
import { INITIAL_MEDICINES, INITIAL_CASES } from './data/mockPvData';
import {
  INITIAL_E_PRESCRIPTIONS,
  INITIAL_DRUG_INVENTORY,
  INITIAL_REFILL_REQUESTS,
  INITIAL_CONSULTATION_LOGS,
  INITIAL_TELEHEALTH_APPOINTMENTS,
  INITIAL_SOAP_NOTES,
  INITIAL_CHAT_MESSAGES,
  INITIAL_VITALS_LOG,
  INITIAL_LAB_RESULTS,
  INITIAL_PATIENT_ALLERGIES,
  INITIAL_VISUAL_ADR_EVENTS,
  INITIAL_MEDICATION_HISTORY,
} from './data/clinicalWorkspaceData';
import { ShieldCheck, HeartHandshake, AlertCircle, Stethoscope, User, Pill, CheckCircle2, RotateCw } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<AppTab>('patient');
  const [userRole, setUserRole] = useState<UserRole>('patient');

  // State for medicines and cases
  const [medicines, setMedicines] = useState<Medicine[]>(INITIAL_MEDICINES);
  const [cases, setCases] = useState<SymptomReport[]>(INITIAL_CASES);
  const [selectedCase, setSelectedCase] = useState<SymptomReport>(INITIAL_CASES[0]);

  // Shared Multi-Role Clinical Workspace State
  const [ePrescriptions, setEPrescriptions] = useState<ElectronicPrescription[]>(INITIAL_E_PRESCRIPTIONS);
  const [inventory, setInventory] = useState<DrugInventoryItem[]>(INITIAL_DRUG_INVENTORY);
  const [refillRequests, setRefillRequests] = useState<RefillRequest[]>(INITIAL_REFILL_REQUESTS);
  const [consultationLogs, setConsultationLogs] = useState<PharmacistConsultationLog[]>(INITIAL_CONSULTATION_LOGS);
  const [appointments, setAppointments] = useState<TelehealthAppointment[]>(INITIAL_TELEHEALTH_APPOINTMENTS);
  const [soapNotes, setSoapNotes] = useState<ConsultationSoapNote[]>(INITIAL_SOAP_NOTES);
  const [chatMessages, setChatMessages] = useState<DirectChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [vitalsLog, setVitalsLog] = useState<VitalSignEntry[]>(INITIAL_VITALS_LOG);
  const [labResults, setLabResults] = useState<PatientLabResult[]>(INITIAL_LAB_RESULTS);
  const [allergies, setAllergies] = useState<PatientDocumentedAllergy[]>(INITIAL_PATIENT_ALLERGIES);
  const [visualAdrEvents, setVisualAdrEvents] = useState<VisualAdrEvent[]>(INITIAL_VISUAL_ADR_EVENTS);
  const [medicationHistory, setMedicationHistory] = useState<MedicationHistoryRecord[]>(INITIAL_MEDICATION_HISTORY);

  // Modals
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isPvpiModalOpen, setIsPvpiModalOpen] = useState(false);
  const [pvpiCaseToExport, setPvpiCaseToExport] = useState<SymptomReport>(INITIAL_CASES[0]);

  // Add new medicine handler
  const handleAddMedicine = (newMed: Medicine) => {
    setMedicines((prev) => [newMed, ...prev]);
  };

  // Toggle medicine status
  const handleUpdateMedicineStatus = (id: string, status: Medicine['status']) => {
    setMedicines((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );
  };

  // Submit new symptom report
  const handleSubmitReport = (newReport: SymptomReport) => {
    setCases((prev) => [newReport, ...prev]);
    setSelectedCase(newReport);
    if (newReport.urgencyLevel === 'EMERGENCY') {
      setIsEmergencyModalOpen(true);
    }
  };

  // Pharmacist update status
  const handleUpdateCaseStatus = (
    id: string,
    status: SymptomReport['reviewStatus'],
    notes?: string
  ) => {
    setCases((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, reviewStatus: status, pharmacistNotes: notes || c.pharmacistNotes } : c
      )
    );
    if (selectedCase.id === id) {
      setSelectedCase((prev) => ({
        ...prev,
        reviewStatus: status,
        pharmacistNotes: notes || prev.pharmacistNotes,
      }));
    }
  };

  const handleOpenPvpiModal = (caseData: SymptomReport) => {
    setPvpiCaseToExport(caseData);
    setIsPvpiModalOpen(true);
  };

  // E-Prescription handlers
  const handleAddEPrescription = (newErx: ElectronicPrescription) => {
    setEPrescriptions((prev) => [newErx, ...prev]);
  };

  const handleUpdateDispenseStatus = (id: string, status: DispenseStatus, notes?: string) => {
    setEPrescriptions((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              dispenseStatus: status,
              pharmacistNotes: notes !== undefined ? notes : p.pharmacistNotes,
              completedAt: status === 'Completed' ? new Date().toLocaleString() : p.completedAt,
            }
          : p
      )
    );
  };

  const handleVerifyPrescription = (
    id: string,
    verification: {
      allergyPassed: boolean;
      interactionPassed: boolean;
      dosagePassed: boolean;
      notes?: string;
    }
  ) => {
    setEPrescriptions((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              allergyCheckPassed: verification.allergyPassed,
              interactionCheckPassed: verification.interactionPassed,
              dosageVerificationPassed: verification.dosagePassed,
              pharmacistNotes: verification.notes || p.pharmacistNotes,
              verifiedAt: new Date().toLocaleString(),
            }
          : p
      )
    );
  };

  // Inventory handlers
  const handleReplenishStock = (id: string, qty: number, batchNumber: string) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              stockQuantity: item.stockQuantity + qty,
              batchNumber,
              status: item.stockQuantity + qty > item.reorderLevel ? 'In Stock' : 'Low Stock',
            }
          : item
      )
    );
  };

  const handleUpdatePrice = (id: string, newMrp: number) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, mrp: newMrp } : item))
    );
  };

  // Refill handlers
  const handleRequestRefill = (req: RefillRequest) => {
    setRefillRequests((prev) => [req, ...prev]);
  };

  const handleUpdateRefillStatus = (id: string, status: RefillRequest['status']) => {
    setRefillRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status } : r))
    );
  };

  // Consultation log handlers
  const handleAddConsultationLog = (log: PharmacistConsultationLog) => {
    setConsultationLogs((prev) => [log, ...prev]);
  };

  // Appointment & SOAP handlers
  const handleBookAppointment = (apt: TelehealthAppointment) => {
    setAppointments((prev) => [apt, ...prev]);
  };

  const handleAddSoapNote = (note: ConsultationSoapNote) => {
    setSoapNotes((prev) => [note, ...prev]);
  };

  // Chat message handler
  const handleSendMessage = (msg: DirectChatMessage) => {
    setChatMessages((prev) => [...prev, msg]);
  };

  // Vitals & Lab & Allergy handlers
  const handleAddVitals = (v: VitalSignEntry) => {
    setVitalsLog((prev) => [v, ...prev]);
  };

  const handleAddLabResult = (lab: PatientLabResult) => {
    setLabResults((prev) => [lab, ...prev]);
  };

  const handleAddAllergy = (alg: PatientDocumentedAllergy) => {
    setAllergies((prev) => [alg, ...prev]);
  };

  // Visual ADR and Medication History Handlers
  const handleAddAdrEvent = (newEvent: VisualAdrEvent) => {
    setVisualAdrEvents((prev) => [newEvent, ...prev]);
  };

  const handleAddMedicationHistory = (record: MedicationHistoryRecord) => {
    setMedicationHistory((prev) => [record, ...prev]);
  };

  const handleReconcileMedication = (id: string, notes: string) => {
    setMedicationHistory((prev) =>
      prev.map((m) => (m.id === id ? { ...m, notes: `${m.notes} | ${notes}` } : m))
    );
  };

  const handleDechallengeAction = (id: string, action: string) => {
    setVisualAdrEvents((prev) =>
      prev.map((e) =>
        e.id === id
          ? {
              ...e,
              dechallengeStatus: 'Positive (Resolved on stopping)',
              clinicalAction: `${e.clinicalAction} | Prescriber: ${action}`,
            }
          : e
      )
    );
  };

  const emergencyCount = cases.filter((c) => c.urgencyLevel === 'EMERGENCY').length;

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans relative selection:bg-orange-100 selection:text-orange-900">
        {/* Background ambient lighting flares - Warm Light Orange / Amber clinical aura */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[350px] bg-orange-200/20 rounded-full blur-[130px]" />
          <div className="absolute top-1/3 right-1/4 w-[500px] h-[300px] bg-amber-200/20 rounded-full blur-[110px]" />
          <div className="absolute bottom-10 left-1/3 w-[700px] h-[250px] bg-orange-100/30 rounded-full blur-[140px]" />
        </div>

        {/* Top Header with Role Switcher & Light Orange theme */}
        <Header
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onEmergencyClick={() => setIsEmergencyModalOpen(true)}
          userRole={userRole}
          setUserRole={setUserRole}
          emergencyCount={emergencyCount}
        />

        {/* Main Content Area: Renders the Dedicated Dashboard based on activeTab / Role */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
          {/* 1. PATIENT DASHBOARD */}
          {activeTab === 'patient' && (
            <PatientMobileView
              medicines={medicines}
              onAddMedicine={handleAddMedicine}
              onUpdateMedicineStatus={handleUpdateMedicineStatus}
              onSubmitReport={handleSubmitReport}
              activeReport={cases[0]}
              onEmergencyClick={() => setIsEmergencyModalOpen(true)}
              onRequestRefill={handleRequestRefill}
              ePrescriptions={ePrescriptions}
              refillRequests={refillRequests}
              chatMessages={chatMessages}
              onSendMessage={handleSendMessage}
              appointments={appointments}
              onBookAppointment={handleBookAppointment}
              vitalsLog={vitalsLog}
              onAddVitals={handleAddVitals}
              labResults={labResults}
              onAddLabResult={handleAddLabResult}
              allergies={allergies}
              onAddAllergy={handleAddAllergy}
              visualAdrEvents={visualAdrEvents}
              onAddAdrEvent={handleAddAdrEvent}
              medicationHistory={medicationHistory}
              onAddMedicationHistory={handleAddMedicationHistory}
            />
          )}

          {/* 2. CAREGIVER DASHBOARD */}
          {activeTab === 'caregiver' && (
            <CaregiverDashboard
              medicines={medicines}
              cases={cases}
              onSubmitReport={handleSubmitReport}
              onEmergencyClick={() => setIsEmergencyModalOpen(true)}
              onUpdateMedicineStatus={handleUpdateMedicineStatus}
            />
          )}

          {/* 3. COMMUNITY PHARMACIST DASHBOARD */}
          {activeTab === 'pharmacist' && (
            <PharmacistDashboard
              cases={cases}
              selectedCase={selectedCase}
              onSelectCase={setSelectedCase}
              onUpdateCaseStatus={handleUpdateCaseStatus}
              medicines={medicines}
              onOpenPvpiModal={handleOpenPvpiModal}
              prescriptions={ePrescriptions}
              onUpdateDispenseStatus={handleUpdateDispenseStatus}
              onVerifyPrescription={handleVerifyPrescription}
              inventory={inventory}
              onReplenishStock={handleReplenishStock}
              onUpdatePrice={handleUpdatePrice}
              refillRequests={refillRequests}
              onUpdateRefillStatus={handleUpdateRefillStatus}
              consultationLogs={consultationLogs}
              onAddConsultationLog={handleAddConsultationLog}
              visualAdrEvents={visualAdrEvents}
              onAddAdrEvent={handleAddAdrEvent}
              medicationHistory={medicationHistory}
              onAddMedicationHistory={handleAddMedicationHistory}
              onReconcileMedication={handleReconcileMedication}
            />
          )}

          {/* 4. PHYSICIAN DASHBOARD */}
          {activeTab === 'physician' && (
            <PhysicianDashboard
              cases={cases}
              selectedCase={selectedCase}
              onSelectCase={setSelectedCase}
              medicines={medicines}
              onOpenPvpiModal={handleOpenPvpiModal}
              onUpdateMedicineStatus={handleUpdateMedicineStatus}
              onAddEPrescription={handleAddEPrescription}
              allergies={allergies}
              vitalsLog={vitalsLog}
              labResults={labResults}
              onAddLabResult={handleAddLabResult}
              appointments={appointments}
              onBookAppointment={handleBookAppointment}
              soapNotes={soapNotes}
              onAddSoapNote={handleAddSoapNote}
              visualAdrEvents={visualAdrEvents}
              onAddAdrEvent={handleAddAdrEvent}
              medicationHistory={medicationHistory}
              onAddMedicationHistory={handleAddMedicationHistory}
              onDechallengeAction={handleDechallengeAction}
            />
          )}

          {/* 5. HOSPITAL PV TEAM DASHBOARD */}
          {activeTab === 'hospital_pv' && (
            <HospitalPvDashboard
              cases={cases}
              medicines={medicines}
              onOpenPvpiModal={handleOpenPvpiModal}
            />
          )}

          {/* 6. ADR MONITORING CENTRE (AMC) DASHBOARD */}
          {activeTab === 'amc' && (
            <AmcDashboard
              cases={cases}
              medicines={medicines}
              onOpenPvpiModal={handleOpenPvpiModal}
            />
          )}

          {/* 7. REGULATORS (PvPI / CDSCO) DASHBOARD */}
          {activeTab === 'regulator' && (
            <RegulatorDashboard
              cases={cases}
              medicines={medicines}
              onOpenPvpiModal={handleOpenPvpiModal}
            />
          )}

          {/* 8. RESEARCHERS DASHBOARD */}
          {activeTab === 'researcher' && <ResearcherDashboard />}

          {/* MULTILINGUAL & VERNACULAR PV SECTION */}
          {activeTab === 'language' && (
            <LanguageSection onNavigateToReport={() => setActiveTab('patient')} />
          )}

          {/* Clinical Supportive Tools */}
          {activeTab === 'chat' && <SafetyChatbot />}

          {activeTab === 'search' && <SearchGroundingPortal />}

          {activeTab === 'maps' && <AmcLocator />}

          {activeTab === 'dermatology' && <DermatologyComparator />}

          {activeTab === 'analytics' && <SignalAnalytics />}

          {activeTab === 'architecture' && <SystemArchitecture />}
        </main>

        {/* Emergency Red-Flag Warning Modal */}
        <EmergencyModal
          isOpen={isEmergencyModalOpen}
          onClose={() => setIsEmergencyModalOpen(false)}
          detectedRedFlags={
            selectedCase?.emergencyRedFlags.length > 0
              ? selectedCase.emergencyRedFlags
              : ['Facial / Lip Swelling detected', 'Rapid hypersensitivity onset']
          }
        />

        {/* Official PvPI ADRMS Export Modal */}
        <PvpiExportModal
          isOpen={isPvpiModalOpen}
          onClose={() => setIsPvpiModalOpen(false)}
          caseReport={pvpiCaseToExport}
        />

        {/* Modern Footer with Copyright & Author Attribution Badge */}
        <footer className="bg-white/95 backdrop-blur-md border-t border-orange-200 mt-auto py-8 relative z-20 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-5">
            {/* Upper Footer Row: Brand Info + Author Attribution Badge */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-orange-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-xs">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-slate-900 text-sm tracking-tight">DoseGuard</span>
                    <span className="text-[10px] bg-orange-100 text-orange-900 border border-orange-200 px-2 py-0.5 rounded-full font-bold">
                      PvPI v2.4 Certified
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500">
                    Patient-to-Pharmacist Multi-Role Digital Pharmacovigilance & Polypharmacy Platform
                  </p>
                </div>
              </div>

              {/* Author Attribution Badge */}
              <div className="flex items-center gap-2.5 bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/90 border border-orange-300/80 px-4 py-2 rounded-2xl shadow-xs transition-transform hover:scale-[1.01]">
                <div className="w-6 h-6 rounded-lg bg-orange-500 text-white flex items-center justify-center text-xs font-bold shadow-xs">
                  A
                </div>
                <div className="text-left">
                  <span className="text-[10px] text-orange-800 uppercase tracking-wider font-bold block">
                    Engineering & Design
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 tracking-tight">
                    Developed by Akanksha Suresh Kudale
                  </span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" title="Active Developer Attribution" />
              </div>
            </div>

            {/* Lower Footer Row: Copyright & Legal/Clinical Regulatory Disclaimer */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <div className="flex items-center gap-2 text-center sm:text-left">
                <span>© {new Date().getFullYear()} DoseGuard. All rights reserved.</span>
                <span className="text-slate-300 hidden sm:inline">·</span>
                <span className="text-orange-900 font-medium hidden sm:inline">
                  Indian Pharmacopoeia Commission (IPC) Pharmacovigilance Programme of India Interoperable
                </span>
              </div>

              <div className="text-[11px] text-slate-400 text-center sm:text-right">
                Emergency Hotline: <strong className="text-rose-600 font-bold">108 / 112</strong> · For medical emergencies, seek immediate hospitalization.
              </div>
            </div>
          </div>
        </footer>
      </div>
    </LanguageProvider>
  );
}
