import React, { useState, useRef } from 'react';
import {
  Medicine,
  SymptomReport,
  VitalSigns,
  UrgencyLevel,
  MedicationAttachment,
  MedicationReminder,
  RefillRequest,
  ElectronicPrescription,
  DirectChatMessage,
  TelehealthAppointment,
  VitalSignEntry,
  PatientLabResult,
  PatientDocumentedAllergy,
  VisualAdrEvent,
  MedicationHistoryRecord,
} from '../../types/pv';
import { BodyMap } from './BodyMap';
import { MedicationTimelineGrid } from './MedicationTimelineGrid';
import { AttachmentDetailsModal } from './AttachmentDetailsModal';
import { CameraCaptureModal } from './CameraCaptureModal';
import { NotificationCenter } from './NotificationCenter';
import { PrescriptionsRefillsView } from './PrescriptionsRefillsView';
import { PhysicianPharmacyContactView } from './PhysicianPharmacyContactView';
import { HealthRecordsVitalsView } from './HealthRecordsVitalsView';
import { VisualAdrMapping } from '../adr/VisualAdrMapping';
import { MedicationHistoryView } from '../history/MedicationHistoryView';
import {
  Plus,
  Mic,
  Camera,
  QrCode,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Sparkles,
  Heart,
  Activity,
  Award,
  ChevronRight,
  ShieldAlert,
  HelpCircle,
  Volume2,
  Check,
  FileText,
  User,
  Monitor,
  Smartphone,
  Minus,
  Square,
  X,
  Paperclip,
  Upload,
  Image as ImageIcon,
  RotateCcw,
  Eye,
  Info,
  Bell,
  MessageSquare,
  Pill,
  RotateCw,
  Video,
} from 'lucide-react';
import { EDUCATIONAL_CARDS, INITIAL_REMINDERS } from '../../data/mockPvData';

interface PatientMobileViewProps {
  medicines: Medicine[];
  onAddMedicine: (med: Medicine) => void;
  onUpdateMedicineStatus: (id: string, status: Medicine['status']) => void;
  onSubmitReport: (report: SymptomReport) => void;
  activeReport?: SymptomReport;
  onEmergencyClick: () => void;
  onRequestRefill?: (req: RefillRequest) => void;
  ePrescriptions?: ElectronicPrescription[];
  refillRequests?: RefillRequest[];
  chatMessages?: DirectChatMessage[];
  onSendMessage?: (msg: DirectChatMessage) => void;
  appointments?: TelehealthAppointment[];
  onBookAppointment?: (apt: TelehealthAppointment) => void;
  vitalsLog?: VitalSignEntry[];
  onAddVitals?: (v: VitalSignEntry) => void;
  labResults?: PatientLabResult[];
  onAddLabResult?: (lab: PatientLabResult) => void;
  allergies?: PatientDocumentedAllergy[];
  onAddAllergy?: (alg: PatientDocumentedAllergy) => void;
  visualAdrEvents?: VisualAdrEvent[];
  onAddAdrEvent?: (event: VisualAdrEvent) => void;
  medicationHistory?: MedicationHistoryRecord[];
  onAddMedicationHistory?: (record: MedicationHistoryRecord) => void;
}

export const PatientMobileView: React.FC<PatientMobileViewProps> = ({
  medicines,
  onAddMedicine,
  onUpdateMedicineStatus,
  onSubmitReport,
  activeReport,
  onEmergencyClick,
  onRequestRefill = () => {},
  ePrescriptions = [],
  refillRequests = [],
  chatMessages = [],
  onSendMessage = () => {},
  appointments = [],
  onBookAppointment = () => {},
  vitalsLog = [],
  onAddVitals = () => {},
  labResults = [],
  onAddLabResult = () => {},
  allergies = [],
  onAddAllergy = () => {},
  visualAdrEvents = [],
  onAddAdrEvent = () => {},
  medicationHistory = [],
  onAddMedicationHistory = () => {},
}) => {
  // View format: 'windows' application vs 'mobile' screen (Patient Only)
  const [viewMode, setViewMode] = useState<'windows' | 'mobile'>('windows');

  // Navigation inside app: 'home' | 'timeline' | 'medicines' | 'prescriptions' | 'adrmap' | 'history' | 'attachments' | 'reminders' | 'contact' | 'vitals' | 'report' | 'result' | 'followup'
  const [currentScreen, setCurrentScreen] = useState<
    'home' | 'timeline' | 'medicines' | 'prescriptions' | 'adrmap' | 'history' | 'attachments' | 'reminders' | 'contact' | 'vitals' | 'report' | 'result' | 'followup'
  >('timeline');

  // Daily medication reminders state (Notification Center)
  const [reminders, setReminders] = useState<MedicationReminder[]>(INITIAL_REMINDERS);
  const [currentTimeStr, setCurrentTimeStr] = useState<string>('10:30'); // Active patient morning triage clock

  // Parse time "HH:MM" to minutes since midnight
  const parseTimeToMinutes = (timeStr: string) => {
    const [h, m] = timeStr.split(':').map(Number);
    return (h || 0) * 60 + (m || 0);
  };

  const currentMinutes = parseTimeToMinutes(currentTimeStr);

  // Identify missed doses: enabled, not taken today, scheduled time has passed
  const missedReminders = reminders.filter((r) => {
    if (!r.isEnabled || r.takenToday) return false;
    return parseTimeToMinutes(r.scheduledTime) < currentMinutes;
  });

  const handleTakeDose = (medicineId: string, reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) =>
        r.id === reminderId
          ? {
              ...r,
              takenToday: true,
              takenAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              isMissed: false,
            }
          : r
      )
    );
  };

  const handleSkipDose = (medicineId: string, reminderId: string) => {
    setReminders((prev) =>
      prev.map((r) => (r.id === reminderId ? { ...r, isMissed: true } : r))
    );
  };

  const handleUpdateReminders = (updated: MedicationReminder[]) => {
    setReminders(updated);
  };

  // Add medicine state & optional label attachment
  const [addMode, setAddMode] = useState<'scan' | 'barcode' | 'manual' | null>(null);
  const [ocrLoading, setOcrLoading] = useState(false);
  const [ocrDetected, setOcrDetected] = useState<any>(null);
  const [labelAttachment, setLabelAttachment] = useState<MedicationAttachment | null>(null);
  const [isCameraModalOpen, setIsCameraModalOpen] = useState(false);
  const [selectedAttachmentForModal, setSelectedAttachmentForModal] = useState<{ med: Medicine; att?: MedicationAttachment } | null>(null);
  const [targetMedForCamera, setTargetMedForCamera] = useState<Medicine | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const [manualMed, setManualMed] = useState({
    brandName: '',
    genericName: '',
    strength: '',
    dosageForm: 'Tablet' as const,
    frequency: 'Once daily',
    route: 'Oral',
    startDate: new Date().toISOString().split('T')[0],
    prescriber: 'Dr. S. Kulkarni',
    indication: '',
    batchNumber: '',
    expiryDate: '',
  });

  // Symptom report state
  const [reportLang, setReportLang] = useState<string>('mr');
  const [symptomText, setSymptomText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [transcribing, setTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Real microphone audio recording with DoseGuard audio transcription
  const handleToggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
      setIsRecording(false);
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach((track) => track.stop());
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          setTranscribing(true);

          try {
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = async () => {
              const base64Audio = reader.result as string;
              const res = await fetch('/api/transcribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  audioBase64: base64Audio,
                  mimeType: 'audio/webm',
                  languageHint: reportLang,
                }),
              });
              const data = await res.json();
              if (data.transcribedText) {
                setSymptomText(data.transcribedText);
              }
            };
          } catch (err) {
            console.error('Transcription error:', err);
          } finally {
            setTranscribing(false);
          }
        };

        mediaRecorder.start();
        setIsRecording(true);
      } catch (err) {
        console.warn('Microphone permission not granted or unavailable, using voice preset:', err);
        handleApplyPreset(reportLang);
      }
    }
  };
  const [selectedRegions, setSelectedRegions] = useState<string[]>(['arms_hands', 'face_lips']);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['Red rash / Erythema', 'Severe itching / Pruritus']);
  const [hasLipSwelling, setHasLipSwelling] = useState(true);
  const [hasBreathingDifficulty, setHasBreathingDifficulty] = useState(false);
  const [hasBlisters, setHasBlisters] = useState(false);
  const [hasFever, setHasFever] = useState(false);
  const [vitals, setVitals] = useState<VitalSigns>({
    bpSystolic: 138,
    bpDiastolic: 86,
    heartRate: 88,
    spo2: 97,
    tempC: 37.2,
    bloodGlucose: 142,
  });
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  // Follow-up screen state
  const [followupSymptomState, setFollowupSymptomState] = useState<'improved' | 'same' | 'worse' | 'resolved'>('improved');
  const [followupDrugState, setFollowupDrugState] = useState<'stopped_by_doctor' | 'continued' | 'reduced'>('stopped_by_doctor');
  const [followupHospitalized, setFollowupHospitalized] = useState<boolean>(false);
  const [followupCompleted, setFollowupCompleted] = useState<boolean>(false);

  // Preset voice scripts from clinical specification
  const PRESET_SCRIPTS: Record<string, string> = {
    mr: 'मी नवीन गोळी सुरू केल्यापासून दोन दिवसांपासून अंगावर लाल पुरळ आणि खाज येत आहे. आज सकाळी ओठ थोडे सुजल्यासारखे वाटत आहेत.',
    hi: 'पैर के टखनों में पिछले चार दिनों से सूजन आ रही है और चलने में भारीपन लग रहा है।',
    ta: 'மருந்து உட்கொண்ட பிறகு நெஞ்சு படபடப்பு மற்றும் நாக்கில் வீக்கம் ஏற்பட்டது.',
    te: 'టాబ్లెట్ వేసుకున్న తర్వాత విపరీతమైన కళ్ళు తిరగడం మరియు ఒంటిపై దద్దుర్లు వచ్చాయి.',
    bn: 'ওষুধ খাওয়ার পর শরীরে প্রচণ্ড চুলকানি, লাল দাগ এবং বমি বমি ভাব হচ্ছে।',
    gu: 'દવા લીધા પછી મોં પર સોજો અને શ્વાસ લેવામાં ગૂંગળામણ અનુભવાય છે.',
    en: 'Since starting the new antibiotic two days ago, severe red rash and itching developed on chest and arms, with mild lip swelling.',
  };

  const handleApplyPreset = (lang: string) => {
    setReportLang(lang);
    setSymptomText(PRESET_SCRIPTS[lang] || PRESET_SCRIPTS.en);
    if (lang === 'mr' || lang === 'ta' || lang === 'gu') {
      setSelectedRegions(['arms_hands', 'face_lips']);
      setSelectedSymptoms(['Red rash / Erythema', 'Severe itching / Pruritus', 'Lip swelling / Angioedema']);
      setHasLipSwelling(true);
    } else if (lang === 'hi') {
      setSelectedRegions(['legs_ankles']);
      setSelectedSymptoms(['Bilateral ankle swelling (Edema)', 'Heavy legs']);
      setHasLipSwelling(false);
    } else {
      setSelectedRegions(['arms_hands']);
      setSelectedSymptoms(['Cutaneous rash', 'Pruritus / Itching']);
      setHasLipSwelling(false);
    }
  };

  // Run AI analysis
  const handleAnalyzeAndSubmit = async () => {
    if (!symptomText.trim()) return;
    setAnalyzing(true);

    try {
      const response = await fetch('/api/analyze-symptom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: symptomText,
          language: reportLang,
          patientAge: 68,
          activeMeds: medicines.map((m) => `${m.brandName} (${m.genericName})`),
        }),
      });

      const data = await response.json();

      // Check emergency red flags
      const flags: string[] = [...(data.emergencyRedFlags || [])];
      if (hasLipSwelling && !flags.includes('Facial / Lip Swelling detected')) {
        flags.push('Facial / Lip Angioedema detected');
      }
      if (hasBreathingDifficulty && !flags.includes('Respiratory distress detected')) {
        flags.push('Severe Dyspnea / Airway obstruction');
      }
      if (hasBlisters && !flags.includes('Blistering rash detected')) {
        flags.push('Mucocutaneous blistering (SJS/TEN warning)');
      }

      const urgency: UrgencyLevel =
        flags.length > 0 || hasLipSwelling || hasBreathingDifficulty
          ? 'EMERGENCY'
          : data.urgencyLevel || 'PHARMACIST_REVIEW';

      const causalityScore = {
        cAdrTotal: urgency === 'EMERGENCY' ? 84 : 70,
        category: urgency === 'EMERGENCY' ? ('HIGH_PRIORITY_ADR' as const) : ('PROBABLE' as const),
        categoryLabel: urgency === 'EMERGENCY' ? 'High-Priority Suspected ADR' : 'Probable Drug-Related Association',
        userFacingAdvice:
          urgency === 'EMERGENCY'
            ? 'Seek immediate emergency clinical evaluation. Do not wait for standard follow-up.'
            : 'Contact your community pharmacist or physician today for clinical assessment.',
        breakdown: {
          temporalFit_T: { score: 9.5, max: 10, weight: 0.25, contribution: 23.75, rationale: 'Symptoms started within 48h of antibiotic initiation.' },
          doseResponse_D: { score: 7.0, max: 10, weight: 0.15, contribution: 10.5, rationale: 'Standard therapeutic dose; cumulative exposure reached.' },
          knownAssociation_K: { score: 9.8, max: 10, weight: 0.20, contribution: 19.6, rationale: 'Known high frequency of cutaneous hypersensitivity for beta-lactams in WHO-UMC.' },
          dechallenge_R: { score: 6.5, max: 10, weight: 0.15, contribution: 9.75, rationale: 'Withholding advised under physician guidance.' },
          hostFactors_H: { score: 8.5, max: 10, weight: 0.15, contribution: 12.75, rationale: 'Age 68 + polypharmacy (6 concurrent medicines).' },
          alternativeExplanations_A: { score: 2.0, max: 10, weight: 0.10, contribution: 2.0, rationale: 'Alternative primary disease or viral exanthem assessed as secondary.' },
        },
        explanation: 'Strong temporal fit with newly added antibiotic plus red-flag angioedema symptoms.',
      };

      const newReport: SymptomReport = {
        id: `CASE-${Date.now().toString().slice(-4)}`,
        patientId: 'PAT-6801',
        patientName: 'Ramesh V. Kulkarni',
        patientAge: 68,
        patientGender: 'Male',
        isElderlyPolypharmacy: true,
        reportedAt: new Date().toISOString(),
        inputLanguage: reportLang,
        originalText: symptomText,
        translatedText: data.translatedText || symptomText,
        extractedSymptoms: Array.from(new Set([...(data.extractedSymptoms || []), ...selectedSymptoms])),
        meddraTerms: data.meddraTerms || [
          { pt: 'Rash erythematous', soc: 'Skin disorders', code: '10037844' },
          { pt: 'Pruritus', soc: 'Skin disorders', code: '10037087' },
        ],
        negatedSymptoms: data.negatedSymptoms || (hasBreathingDifficulty ? [] : ['No shortness of breath']),
        severity: urgency === 'EMERGENCY' ? 'severe' : 'moderate',
        onsetDate: new Date().toISOString().split('T')[0],
        durationDays: 2,
        bodyLocations: selectedRegions,
        vitals,
        emergencyRedFlags: flags,
        followUpResponses: {
          hasLipSwelling,
          hasBreathingDifficulty,
          hasBlisters,
          hasFever,
        },
        outcome: 'persisting',
        urgencyLevel: urgency,
        completenessScore: 88,
        missingFields: ['Manufacturer batch number verification'],
        causality: causalityScore,
        reviewStatus: 'pending',
      };

      setAnalysisResult(newReport);
      onSubmitReport(newReport);
      setCurrentScreen('result');
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  // OCR scan simulation
  const handleSimulateScan = async () => {
    setOcrLoading(true);
    try {
      const res = await fetch('/api/scan-prescription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ samplePreset: 'sample_elderly_rx' }),
      });
      const data = await res.json();
      setOcrDetected(data);
    } catch (err) {
      console.error(err);
    } finally {
      setOcrLoading(false);
    }
  };

  const handleConfirmOcrMedicine = () => {
    if (!ocrDetected || !ocrDetected.detectedMedicines) return;
    const item = ocrDetected.detectedMedicines[0];
    const newMed: Medicine = {
      id: `med-${Date.now().toString().slice(-4)}`,
      brandName: item.brandName,
      genericName: item.genericName,
      strength: item.strength,
      dosageForm: 'Tablet',
      frequency: item.frequency,
      route: item.route || 'Oral',
      startDate: new Date().toISOString().split('T')[0],
      status: 'active',
      prescriber: ocrDetected.doctorName || 'Dr. Suresh Kulkarni',
      indication: item.indication || 'Lower Respiratory Tract Infection',
      source: 'ocr',
      verifiedByPharmacist: false,
      ocrConfidence: item.confidence || 0.95,
      isSuspected: true,
    };
    onAddMedicine(newMed);
    setOcrDetected(null);
    setAddMode(null);
    setCurrentScreen('medicines');
  };

  const handlePhotoCaptured = (dataUrl: string, fileName: string, fileSize: string) => {
    const attachment: MedicationAttachment = {
      id: `att-${Date.now().toString().slice(-4)}`,
      fileName,
      fileSize,
      mimeType: 'image/jpeg',
      dataUrl,
      capturedAt: new Date().toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }),
      source: 'camera',
      batchNumber: manualMed.batchNumber || 'AX26-904',
      expiryDate: manualMed.expiryDate || '08/2027',
      notes: 'Medication label photo captured via device camera for pharmacist verification.',
    };

    if (targetMedForCamera) {
      // Attach to an existing medicine
      const updatedMed: Medicine = {
        ...targetMedForCamera,
        labelPhoto: dataUrl,
        attachment,
        batchNumber: targetMedForCamera.batchNumber || 'AX26-904',
      };
      onAddMedicine(updatedMed);
      setTargetMedForCamera(null);
    } else {
      setLabelAttachment(attachment);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const sizeKb = Math.round(file.size / 1024) + ' KB';
      handlePhotoCaptured(dataUrl, file.name, sizeKb);
    };
    reader.readAsDataURL(file);
  };

  const handleApplySamplePhoto = (sampleUrl: string, sampleName: string, batchNo: string) => {
    handlePhotoCaptured(sampleUrl, sampleName, '418 KB');
    setManualMed((prev) => ({
      ...prev,
      batchNumber: batchNo,
      expiryDate: '08/2027',
    }));
  };

  return (
    <div className={`w-full mx-auto pb-12 ${viewMode === 'windows' ? 'max-w-6xl' : 'max-w-md'}`}>
      {/* Top Format Selector: Windows Application vs Mobile Screen (Patient Only) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 bg-white p-3.5 rounded-2xl border border-sky-200 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-sky-50 border border-sky-200 flex items-center justify-center text-sky-700">
            {viewMode === 'windows' ? <Monitor className="w-5 h-5" /> : <Smartphone className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-900">
                {viewMode === 'windows' ? 'Windows Healthcare Application' : 'Mobile Smartphone Screen'}
              </span>
              <span className="text-[10px] font-semibold bg-sky-50 text-sky-800 border border-sky-200 px-2 py-0.5 rounded-full">
                Patient Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              {viewMode === 'windows'
                ? 'Desktop PC view with high readability, ribbon controls, and spacious patient management'
                : 'Handheld smartphone interface for touch gestures and on-the-go reporting'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-sky-50/80 p-1 rounded-xl border border-sky-200 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('windows')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'windows'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Windows App</span>
          </button>
          <button
            onClick={() => setViewMode('mobile')}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg flex items-center gap-1.5 transition-all ${
              viewMode === 'mobile'
                ? 'bg-sky-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/60'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile Screen</span>
          </button>
        </div>
      </div>

      {/* Main Application Container Frame */}
      <div
        className={`bg-white shadow-xl border overflow-hidden flex flex-col ${
          viewMode === 'windows'
            ? 'rounded-2xl border-slate-300 min-h-[740px]'
            : 'rounded-[2.5rem] border-[6px] border-slate-300 min-h-[720px]'
        }`}
      >
        {/* ================= WINDOWS APPLICATION TITLE BAR ================= */}
        {viewMode === 'windows' ? (
          <>
            <div className="bg-slate-100/95 text-slate-800 px-4 py-2 border-b border-slate-200 flex items-center justify-between text-xs select-none">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-sky-600 flex items-center justify-center text-white text-[10px] font-bold">
                  D
                </div>
                <span className="font-semibold text-slate-900">
                  Dose Guard - Digital Pharmacovigilance Patient Console [Windows Edition]
                </span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500 font-mono text-[11px]">Ramesh V. Kulkarni (ID: PAT-6801)</span>
              </div>

              <div className="flex items-center gap-3 text-slate-500">
                <span className="text-[11px] text-slate-500 hidden md:inline">Language: Marathi / English</span>
                <div className="flex items-center gap-1">
                  <button
                    className="w-7 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700 transition-colors"
                    title="Minimize Window"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <button
                    className="w-7 h-6 flex items-center justify-center hover:bg-slate-200 rounded text-slate-700 transition-colors"
                    title="Maximize Window"
                  >
                    <Square className="w-2.5 h-2.5" />
                  </button>
                  <button
                    className="w-7 h-6 flex items-center justify-center hover:bg-rose-500 hover:text-white rounded text-slate-700 transition-colors"
                    title="Close Application"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          </>
        ) : (
          /* ================= MOBILE PHONE STATUS BAR ================= */
          <>
            <div className="pt-2 pb-1 bg-slate-100 flex justify-center border-b border-slate-200">
              <div className="w-24 h-4 bg-slate-900 rounded-full flex items-center justify-center gap-1.5 px-2">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                <div className="w-1.5 h-1.5 rounded-full bg-slate-700" />
              </div>
            </div>

            <div className="bg-slate-100 text-slate-700 px-5 py-2 flex items-center justify-between border-b border-slate-200 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold tracking-tight text-slate-900">Dose Guard Mobile</span>
              </div>
              <div className="flex items-center gap-2 text-slate-500 text-[11px]">
                <span>Marathi / Eng</span>
                <span className="font-mono font-bold text-sky-800">{currentTimeStr} AM</span>
              </div>
            </div>
          </>
        )}

        {/* Patient Profile Bar - Light Blue, Soft, High Readability Theme */}
        <div className="bg-gradient-to-r from-sky-50 via-blue-50/70 to-sky-100/60 border-b border-sky-200 text-slate-900 px-5 py-3.5 flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <img
              src="/src/assets/images/senior_patient_1791221318901.jpg"
              alt="Ramesh V. Kulkarni"
              referrerPolicy="no-referrer"
              className="w-11 h-11 rounded-full object-cover border-2 border-sky-300 shadow-xs"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-900">Ramesh V. Kulkarni</span>
                <span className="text-[11px] bg-white border border-sky-200 text-sky-800 font-bold px-2 py-0.5 rounded-full font-mono">
                  68 yrs
                </span>
              </div>
              <p className="text-xs text-slate-600 font-medium">
                Caregiver: Rohan Kulkarni (Son) · Priority Polypharmacy (6 Meds)
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Quick Access Notification Center Bell with Missed Dose Badge */}
            <button
              onClick={() => setCurrentScreen('reminders')}
              className={`px-3 py-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs relative ${
                missedReminders.length > 0
                  ? 'bg-rose-50 border-rose-300 text-rose-800 hover:bg-rose-100'
                  : 'bg-white border-sky-200 text-sky-800 hover:bg-sky-50'
              }`}
              title="Medication Reminders & Notification Center"
            >
              <Bell className="w-4 h-4 text-sky-600" />
              <span className="hidden sm:inline">Reminders</span>
              {missedReminders.length > 0 && (
                <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold animate-pulse">
                  {missedReminders.length} Missed
                </span>
              )}
            </button>

            <button
              onClick={onEmergencyClick}
              className="p-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-md shadow-rose-600/30 transition-transform active:scale-95 flex items-center gap-1.5"
              title="Emergency SOS"
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="text-xs font-bold hidden sm:inline">SOS</span>
            </button>
          </div>
        </div>

        {/* In-App Segmented Navigation Tabs in Light Blue Theme */}
        <div className="bg-sky-50/60 p-1.5 flex gap-1 border-b border-sky-200 overflow-x-auto text-xs">
          <button
            onClick={() => setCurrentScreen('home')}
            className={`py-1.5 px-3 font-semibold rounded-lg transition-all whitespace-nowrap ${
              currentScreen === 'home' ? 'bg-sky-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentScreen('timeline')}
            className={`py-1.5 px-3 font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
              currentScreen === 'timeline' ? 'bg-sky-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Timeline Grid</span>
          </button>
          <button
            onClick={() => setCurrentScreen('prescriptions')}
            className={`py-1.5 px-3 font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
              currentScreen === 'prescriptions' ? 'bg-sky-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Pill className="w-3.5 h-3.5 text-sky-600" />
            <span>Prescriptions & Refills ({medicines.filter((m) => m.status === 'active').length})</span>
          </button>
          <button
            onClick={() => setCurrentScreen('reminders')}
            className={`py-1.5 px-3 font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentScreen === 'reminders'
                ? 'bg-sky-600 text-white shadow-xs font-bold'
                : missedReminders.length > 0
                ? 'bg-rose-100 text-rose-800 border border-rose-300 font-bold'
                : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Bell className="w-3.5 h-3.5" />
            <span>Pill Tracker & Reminders</span>
            {missedReminders.length > 0 && (
              <span className="bg-rose-600 text-white text-[10px] px-1.5 py-0.2 rounded-full font-bold">
                {missedReminders.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setCurrentScreen('adrmap')}
            className={`py-1.5 px-3 font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentScreen === 'adrmap'
                ? 'bg-sky-600 text-white shadow-xs font-bold'
                : 'text-rose-700 bg-rose-50/70 hover:bg-rose-100/80 font-bold border border-rose-200/80'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-rose-600" />
            <span>Visual ADR Map ({visualAdrEvents.length})</span>
          </button>
          <button
            onClick={() => setCurrentScreen('history')}
            className={`py-1.5 px-3 font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              currentScreen === 'history' ? 'bg-sky-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-indigo-600" />
            <span>Medication History ({medicationHistory.length})</span>
          </button>
          <button
            onClick={() => setCurrentScreen('medicines')}
            className={`py-1.5 px-3 font-semibold rounded-lg transition-all whitespace-nowrap ${
              currentScreen === 'medicines' ? 'bg-sky-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            My Meds ({medicines.length})
          </button>
          <button
            onClick={() => setCurrentScreen('contact')}
            className={`py-1.5 px-3 font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
              currentScreen === 'contact' ? 'bg-sky-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Doctor & Pharmacy Contact</span>
          </button>
          <button
            onClick={() => setCurrentScreen('vitals')}
            className={`py-1.5 px-3 font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
              currentScreen === 'vitals' ? 'bg-sky-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Health Records & Vitals</span>
          </button>
          <button
            onClick={() => setCurrentScreen('attachments')}
            className={`py-1.5 px-3 font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1 ${
              currentScreen === 'attachments' ? 'bg-sky-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5" />
            <span>Label Photos ({medicines.filter((m) => m.labelPhoto || m.attachment).length})</span>
          </button>
          <button
            onClick={() => setCurrentScreen('report')}
            className={`py-1.5 px-3 font-semibold rounded-lg transition-all whitespace-nowrap ${
              currentScreen === 'report' ? 'bg-sky-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            Report Symptom
          </button>
          <button
            onClick={() => setCurrentScreen('followup')}
            className={`py-1.5 px-3 font-semibold rounded-lg transition-all whitespace-nowrap ${
              currentScreen === 'followup' || currentScreen === 'result' ? 'bg-sky-600 text-white shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900 hover:bg-white/80'
            }`}
          >
            Safety Status
          </button>
        </div>

        {/* Main Screen Content View */}
        <div className="p-5 flex-1 overflow-y-auto">
          {/* ================= SCREEN: PRESCRIPTIONS & REFILLS ================= */}
          {currentScreen === 'prescriptions' && (
            <PrescriptionsRefillsView
              medicines={medicines}
              onRequestRefill={onRequestRefill}
              ePrescriptions={ePrescriptions}
            />
          )}

          {/* ================= SCREEN: PHYSICIAN & PHARMACY CONTACT ================= */}
          {currentScreen === 'contact' && (
            <PhysicianPharmacyContactView
              chatMessages={chatMessages}
              onSendMessage={onSendMessage}
              appointments={appointments}
              onBookAppointment={onBookAppointment}
            />
          )}

          {/* ================= SCREEN: HEALTH RECORDS & VITALS ================= */}
          {currentScreen === 'vitals' && (
            <HealthRecordsVitalsView
              vitalsLog={vitalsLog}
              onAddVitals={onAddVitals}
              labResults={labResults}
              onAddLabResult={onAddLabResult}
              allergies={allergies}
              onAddAllergy={onAddAllergy}
            />
          )}

          {/* ================= SCREEN: VISUAL ADR MAPPING ================= */}
          {currentScreen === 'adrmap' && (
            <VisualAdrMapping
              mode="patient"
              adrEvents={visualAdrEvents}
              onAddAdrEvent={onAddAdrEvent}
              patientName="Ramesh V. Kulkarni"
              onNavigateToReport={() => setCurrentScreen('report')}
            />
          )}

          {/* ================= SCREEN: MEDICATION HISTORY ================= */}
          {currentScreen === 'history' && (
            <MedicationHistoryView
              mode="patient"
              historyRecords={medicationHistory}
              onAddRecord={onAddMedicationHistory}
              patientName="Ramesh V. Kulkarni"
              onNavigateToAdrMap={(adrId) => setCurrentScreen('adrmap')}
            />
          )}
          {/* Missed Dose Alert Notification Banner (Prominently shown in Patient View if scheduled time has passed) */}
          {missedReminders.length > 0 && currentScreen !== 'reminders' && (
            <div className="mb-5 bg-gradient-to-r from-sky-50 via-rose-50/70 to-sky-50 border-2 border-rose-300 rounded-2xl p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-slate-900 animate-in fade-in">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-sm shrink-0 animate-bounce">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider bg-rose-200 text-rose-900 px-2 py-0.5 rounded-full">
                      Missed Dose Alert
                    </span>
                    <span className="text-xs text-rose-950 font-extrabold">
                      {missedReminders.length} Scheduled Dose{missedReminders.length > 1 ? 's' : ''} Overdue
                    </span>
                  </div>
                  <p className="text-xs text-slate-700 mt-1">
                    Scheduled time has passed for: <strong className="text-slate-900">{missedReminders.map(m => `${m.medicineName} (${m.scheduledTime} AM)`).join(', ')}</strong>.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                <button
                  onClick={() => handleTakeDose(missedReminders[0].medicineId, missedReminders[0].id)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 transition-colors"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Take Now</span>
                </button>
                <button
                  onClick={() => setCurrentScreen('reminders')}
                  className="px-3 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <Bell className="w-3.5 h-3.5" />
                  <span>Notification Center ({missedReminders.length})</span>
                </button>
              </div>
            </div>
          )}
          {/* ================= SCREEN: MEDICATION TIMELINE GRID ================= */}
          {currentScreen === 'timeline' && (
            <MedicationTimelineGrid
              medicines={medicines}
              onUpdateMedicineStatus={onUpdateMedicineStatus}
              onOpenReport={() => setCurrentScreen('report')}
            />
          )}

          {/* ================= SCREEN 1: HOME DASHBOARD ================= */}
          {currentScreen === 'home' && (
            <div className="space-y-5">
              {/* Primary Report CTA - Light, High Legibility Theme */}
              <div className="bg-gradient-to-br from-sky-50 via-indigo-50/70 to-blue-50 rounded-2xl p-5 text-slate-900 shadow-sm border border-indigo-200">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-indigo-700 font-bold block mb-1">
                      Real-World Pharmacovigilance
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">Uncomfortable or noticing side effects?</h3>
                    <p className="text-xs text-slate-600 mt-1 max-w-sm leading-relaxed">
                      Speak or record your symptoms in Marathi, Hindi, or English. Dose Guard analyzes drug timelines and alerts your pharmacist.
                    </p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center shrink-0 border border-indigo-200 shadow-xs">
                    <Heart className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setCurrentScreen('report')}
                    className="flex-1 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs transition-colors shadow-xs text-center flex items-center justify-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Report a Symptom Now</span>
                  </button>
                  <button
                    onClick={() => setCurrentScreen('attachments')}
                    className="py-2.5 px-3.5 bg-white hover:bg-indigo-50 text-indigo-800 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 border border-indigo-200 shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Attach Label Photo</span>
                  </button>
                  <button
                    onClick={() => setCurrentScreen('timeline')}
                    className="py-2.5 px-3.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold rounded-xl text-xs transition-colors flex items-center gap-1.5 border border-slate-200 shadow-xs"
                  >
                    <Calendar className="w-3.5 h-3.5 text-slate-600" />
                    <span>View Calendar Grid</span>
                  </button>
                </div>
              </div>

              {/* Status Alert if recent case exists */}
              {activeReport && (
                <div
                  onClick={() => setCurrentScreen('result')}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    activeReport.urgencyLevel === 'EMERGENCY'
                      ? 'bg-rose-50 border-rose-200 text-rose-950'
                      : 'bg-amber-50 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertCircle className={`w-5 h-5 ${activeReport.urgencyLevel === 'EMERGENCY' ? 'text-rose-600' : 'text-amber-600'}`} />
                      <span className="text-xs font-bold uppercase tracking-wider">
                        Active Suspected Event Under Review
                      </span>
                    </div>
                    <span className="text-xs font-bold text-rose-700">{activeReport.urgencyLevel}</span>
                  </div>
                  <p className="text-xs mt-1 text-slate-700">
                    Reported: {activeReport.extractedSymptoms.join(', ')} · Linked to Augmentin 625.
                  </p>
                  <div className="mt-2 text-[11px] text-indigo-700 font-semibold flex items-center gap-1">
                    <span>View Safety Assessment & Triage Details</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              )}

              {/* Today's Medicines & Calendar Schedule Preview */}
              <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 inline-block mb-1">
                      Today&apos;s Dosing Schedule
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Medication Doses & Frequency ({medicines.filter((m) => m.status === 'active').length} Active)</span>
                    </h4>
                  </div>
                  <button
                    onClick={() => setCurrentScreen('timeline')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-200 transition-colors flex items-center gap-1"
                  >
                    <span>Full Grid</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-2.5">
                  {medicines.map((med) => (
                    <div
                      key={med.id}
                      className={`p-3 rounded-2xl border transition-all ${
                        med.isSuspected
                          ? 'bg-rose-50/60 border-rose-200'
                          : med.status === 'active'
                          ? 'bg-slate-50/80 border-slate-200 hover:border-indigo-300'
                          : 'bg-slate-100/60 border-slate-200 opacity-60'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2.5">
                        <div className="flex items-start gap-2.5">
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                              med.isSuspected ? 'bg-rose-100 text-rose-800 border border-rose-200' : 'bg-indigo-100 text-indigo-800'
                            }`}
                          >
                            Rx
                          </div>
                          <div>
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-xs font-extrabold text-slate-900">{med.brandName}</span>
                              <span className="text-[11px] text-slate-500 font-mono">({med.strength})</span>
                              {med.isSuspected && (
                                <span className="text-[10px] bg-rose-100 text-rose-800 px-1.5 py-0.2 rounded-md font-bold border border-rose-200">
                                  Suspected ADR
                                </span>
                              )}
                            </div>
                            <span className="text-[11px] text-slate-600 block mt-0.5">
                              {med.genericName}
                            </span>
                            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                              <span className="text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md">
                                Freq: {med.frequency}
                              </span>
                              <span className="text-[10px] text-slate-500 bg-white border border-slate-200 px-2 py-0.5 rounded-md">
                                {med.indication}
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            onUpdateMedicineStatus(
                              med.id,
                              med.status === 'active' ? 'stopped' : 'active'
                            )
                          }
                          className={`px-3 py-1.5 text-xs font-bold rounded-xl border transition-all shrink-0 ${
                            med.status === 'active'
                              ? 'bg-blue-600 text-white border-blue-600 shadow-xs hover:bg-blue-700'
                              : 'bg-white text-slate-600 border-slate-300 hover:border-slate-400'
                          }`}
                        >
                          {med.status === 'active' ? 'Taken ✓' : 'Stopped'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setCurrentScreen('timeline')}
                  className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Open Interactive 7-Day Medication Timeline Calendar Grid</span>
                </button>
              </div>

              {/* Gamified Follow-up & Safety Completeness Badges */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span className="text-xs font-bold text-slate-900">Safety Check-in Progress</span>
                  </div>
                  <span className="text-xs font-mono font-semibold text-indigo-700">88% Complete</span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mb-3">
                  <div className="bg-indigo-600 h-full rounded-full" style={{ width: '88%' }} />
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-slate-700">7-Day Adherence Logged</span>
                  </div>
                  <div className="p-2 bg-white rounded-lg border border-slate-200 flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-slate-700">Verified by Pharmacist</span>
                  </div>
                </div>
              </div>

              {/* Patient Education Cards */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Patient Safety Guides
                </h4>
                <div className="space-y-2">
                  {EDUCATIONAL_CARDS.map((card) => (
                    <div
                      key={card.id}
                      className="p-3 bg-white border border-slate-200 rounded-xl hover:border-slate-300 transition-colors"
                    >
                      <div className="flex items-center justify-between text-[11px] text-slate-500 mb-1">
                        <span className="font-semibold text-indigo-700">{card.category}</span>
                        <span>{card.readTime}</span>
                      </div>
                      <h5 className="text-xs font-bold text-slate-900">{card.title}</h5>
                      <p className="text-[11px] text-slate-600 mt-0.5 leading-relaxed">{card.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================= SCREEN 2: MY MEDICINES ================= */}
          {currentScreen === 'medicines' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Current Medications</h3>
                  <p className="text-xs text-slate-500">
                    Adults 60+ with 5+ medicines have elevated ADR risk.
                  </p>
                </div>
                <button
                  onClick={() => setAddMode(addMode ? null : 'scan')}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Medicine</span>
                </button>
              </div>

              {/* Add Medicine Options Drawer */}
              {addMode && (
                <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                      Add New Prescription Medicine
                    </span>
                    <button
                      onClick={() => setAddMode(null)}
                      className="text-xs text-slate-500 hover:text-slate-800"
                    >
                      Cancel
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setAddMode('scan')}
                      className={`p-2.5 rounded-xl border text-center transition-colors ${
                        addMode === 'scan'
                          ? 'bg-white border-indigo-500 text-indigo-800 shadow-xs'
                          : 'bg-white/60 border-slate-200 text-slate-700'
                      }`}
                    >
                      <Camera className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                      <span className="text-xs font-semibold block">Prescription OCR</span>
                    </button>

                    <button
                      onClick={() => setAddMode('barcode')}
                      className={`p-2.5 rounded-xl border text-center transition-colors ${
                        addMode === 'barcode'
                          ? 'bg-white border-indigo-500 text-indigo-800 shadow-xs'
                          : 'bg-white/60 border-slate-200 text-slate-700'
                      }`}
                    >
                      <QrCode className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                      <span className="text-xs font-semibold block">Barcode / Box</span>
                    </button>

                    <button
                      onClick={() => setAddMode('manual')}
                      className={`p-2.5 rounded-xl border text-center transition-colors ${
                        addMode === 'manual'
                          ? 'bg-white border-indigo-500 text-indigo-800 shadow-xs'
                          : 'bg-white/60 border-slate-200 text-slate-700'
                      }`}
                    >
                      <FileText className="w-4 h-4 mx-auto mb-1 text-indigo-600" />
                      <span className="text-xs font-semibold block">Manual Entry</span>
                    </button>
                  </div>

                  {/* Scan prescription view */}
                  {addMode === 'scan' && (
                    <div className="space-y-3 pt-2">
                      <div className="relative rounded-xl overflow-hidden border border-indigo-200 bg-slate-100 max-h-48">
                        <img
                          src="/src/assets/images/prescription_sample_1791221283671.jpg"
                          alt="Doctor prescription"
                          referrerPolicy="no-referrer"
                          className="w-full h-44 object-cover"
                        />
                        <div className="absolute bottom-2 right-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded">
                          Sample Hospital Rx
                        </div>
                      </div>

                      <button
                        onClick={handleSimulateScan}
                        disabled={ocrLoading}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-xs"
                      >
                        {ocrLoading ? (
                          <span>Scanning prescription with DoseGuard OCR...</span>
                        ) : (
                          <>
                            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
                            <span>Run AI Prescription Recognition</span>
                          </>
                        )}
                      </button>

                      {/* Mandatory OCR Confirmation Banner (Rule: Never assume OCR is 100% correct without patient confirm) */}
                      {ocrDetected && (
                        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
                          <div className="flex items-center gap-1.5 text-amber-900 text-xs font-bold">
                            <AlertCircle className="w-4 h-4 text-amber-600" />
                            <span>Confirmation Required: Verify Detected Medicine</span>
                          </div>
                          <div className="text-xs text-slate-800 space-y-1">
                            <p>
                              <strong>Detected:</strong> {ocrDetected.detectedMedicines[0].brandName} (
                              {ocrDetected.detectedMedicines[0].genericName}) -{' '}
                              {ocrDetected.detectedMedicines[0].strength}
                            </p>
                            <p className="text-slate-600">
                              Frequency: {ocrDetected.detectedMedicines[0].frequency} · Prescriber:{' '}
                              {ocrDetected.doctorName}
                            </p>
                          </div>
                          <button
                            onClick={handleConfirmOcrMedicine}
                            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold shadow-xs"
                          >
                            I Confirm this is My Prescribed Medicine ✓
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Barcode mode */}
                  {addMode === 'barcode' && (
                    <div className="space-y-3 pt-2">
                      <div className="rounded-xl overflow-hidden border border-indigo-200 bg-slate-100 max-h-48">
                        <img
                          src="/src/assets/images/medicine_blister_pack_1791221295842.jpg"
                          alt="Medicine blister pack"
                          referrerPolicy="no-referrer"
                          className="w-full h-44 object-cover"
                        />
                      </div>
                      <p className="text-xs text-slate-600">
                        Camera detected GS1 2D DataMatrix barcode: Batch <code>AX26-904</code>, Exp: <code>08/2027</code>.
                      </p>
                      <button
                        onClick={handleSimulateScan}
                        className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs"
                      >
                        Extract Package Details
                      </button>
                    </div>
                  )}

                  {/* Manual entry with Optional Photo Attachment Field */}
                  {addMode === 'manual' && (
                    <div className="space-y-3 pt-1 text-xs">
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700">Brand Name</label>
                        <input
                          type="text"
                          value={manualMed.brandName}
                          onChange={(e) => setManualMed({ ...manualMed, brandName: e.target.value })}
                          placeholder="e.g. Augmentin 625 Duo"
                          className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-semibold text-slate-700">Generic Formula</label>
                        <input
                          type="text"
                          value={manualMed.genericName}
                          onChange={(e) => setManualMed({ ...manualMed, genericName: e.target.value })}
                          placeholder="e.g. Amoxicillin + Clavulanate"
                          className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700">Strength</label>
                          <input
                            type="text"
                            value={manualMed.strength}
                            onChange={(e) => setManualMed({ ...manualMed, strength: e.target.value })}
                            placeholder="e.g. 625 mg"
                            className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700">Frequency</label>
                          <input
                            type="text"
                            value={manualMed.frequency}
                            onChange={(e) => setManualMed({ ...manualMed, frequency: e.target.value })}
                            placeholder="Twice daily"
                            className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      {/* Optional Batch Number and Prescriber */}
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700">Batch / Lot No (Optional)</label>
                          <input
                            type="text"
                            value={manualMed.batchNumber}
                            onChange={(e) => setManualMed({ ...manualMed, batchNumber: e.target.value })}
                            placeholder="e.g. AX26-904"
                            className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-semibold text-slate-700">Indication (Optional)</label>
                          <input
                            type="text"
                            value={manualMed.indication}
                            onChange={(e) => setManualMed({ ...manualMed, indication: e.target.value })}
                            placeholder="e.g. Bronchitis"
                            className="w-full mt-1 p-2 border border-slate-300 rounded-lg text-xs"
                          />
                        </div>
                      </div>

                      {/* ================= OPTIONAL ATTACHMENT FIELD (DEVICE CAMERA) ================= */}
                      <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                              <Camera className="w-4 h-4 text-indigo-600" />
                              <span>Medication Label Attachment (Optional)</span>
                            </label>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              Capture a photo of the medicine packaging, blister foil, or bottle with your device camera
                            </p>
                          </div>
                          {labelAttachment && (
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                              <Check className="w-3 h-3" /> Attached
                            </span>
                          )}
                        </div>

                        {labelAttachment ? (
                          <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-3">
                            <div className="flex items-center gap-3">
                              <img
                                src={labelAttachment.dataUrl}
                                alt="Attached label"
                                referrerPolicy="no-referrer"
                                className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs cursor-pointer hover:opacity-90"
                                onClick={() =>
                                  setSelectedAttachmentForModal({
                                    med: {
                                      id: 'temp',
                                      ...manualMed,
                                      status: 'active',
                                      source: 'manual',
                                      verifiedByPharmacist: false,
                                    },
                                    att: labelAttachment,
                                  })
                                }
                              />
                              <div className="flex-1 min-w-0 text-[11px]">
                                <span className="font-bold text-slate-900 block truncate">
                                  {labelAttachment.fileName}
                                </span>
                                <div className="text-slate-500 space-y-0.5 mt-0.5">
                                  <p>Size: {labelAttachment.fileSize} · Source: {labelAttachment.source === 'camera' ? '📷 Device Camera' : '📁 Upload'}</p>
                                  <p>Captured: {labelAttachment.capturedAt}</p>
                                  {manualMed.batchNumber && (
                                    <p className="font-mono text-indigo-700 font-semibold">Lot: {manualMed.batchNumber}</p>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={() => {
                                  setManualMed((prev) => ({
                                    ...prev,
                                    brandName: prev.brandName || 'Augmentin 625 Duo',
                                    genericName: prev.genericName || 'Amoxicillin + Clavulanic Acid',
                                    strength: prev.strength || '625 mg',
                                    frequency: prev.frequency || 'Twice daily',
                                    batchNumber: prev.batchNumber || 'AX26-904',
                                    expiryDate: prev.expiryDate || '08/2027',
                                    indication: prev.indication || 'Respiratory Tract Infection',
                                  }));
                                }}
                                className="py-1 px-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-[11px] font-bold border border-indigo-200 flex items-center gap-1 transition-colors"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Auto-Fill from Photo</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setTargetMedForCamera(null);
                                  setIsCameraModalOpen(true);
                                }}
                                className="py-1 px-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                <span>Retake Photo</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => setLabelAttachment(null)}
                                className="py-1 px-2.5 text-rose-600 hover:bg-rose-50 rounded-lg text-[11px] font-semibold ml-auto transition-colors"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                              {/* Live Device Camera Modal Button */}
                              <button
                                type="button"
                                onClick={() => {
                                  setTargetMedForCamera(null);
                                  setIsCameraModalOpen(true);
                                }}
                                className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
                              >
                                <Camera className="w-4 h-4" />
                                <span>Open Camera</span>
                              </button>

                              {/* Native device camera input */}
                              <label className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-xs">
                                <Camera className="w-4 h-4 text-indigo-600" />
                                <span>Camera Shutter</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  capture="environment"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                />
                              </label>

                              {/* Browse / Upload File */}
                              <label className="py-2.5 px-3 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors col-span-2 sm:col-span-1 shadow-xs">
                                <Upload className="w-4 h-4 text-slate-600" />
                                <span>Upload File</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  onChange={handleFileUpload}
                                  className="hidden"
                                />
                              </label>
                            </div>

                            {/* Quick sample preset buttons */}
                            <div className="flex items-center justify-between bg-white p-2 rounded-xl border border-slate-200 text-[11px]">
                              <span className="text-slate-500 flex items-center gap-1">
                                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                                <span>Quick Samples:</span>
                              </span>
                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleApplySamplePhoto(
                                      '/src/assets/images/medicine_blister_pack_1791221295842.jpg',
                                      'augmentin_strip.jpg',
                                      'AX26-904'
                                    )
                                  }
                                  className="px-2 py-0.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded border border-slate-200 text-[10px] font-medium"
                                >
                                  Blister Strip
                                </button>
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleApplySamplePhoto(
                                      '/src/assets/images/prescription_sample_1791221283671.jpg',
                                      'rx_slip.jpg',
                                      'RX-2026'
                                    )
                                  }
                                  className="px-2 py-0.5 bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 rounded border border-slate-200 text-[10px] font-medium"
                                >
                                  Prescription
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => {
                          if (!manualMed.brandName) return;
                          onAddMedicine({
                            id: `med-${Date.now().toString().slice(-4)}`,
                            ...manualMed,
                            status: 'active',
                            source: labelAttachment ? 'ocr' : 'manual',
                            verifiedByPharmacist: false,
                            labelPhoto: labelAttachment?.dataUrl,
                            attachment: labelAttachment || undefined,
                            batchNumber: manualMed.batchNumber || (labelAttachment ? 'AX26-904' : undefined),
                          });
                          setManualMed({
                            brandName: '',
                            genericName: '',
                            strength: '',
                            dosageForm: 'Tablet',
                            frequency: 'Once daily',
                            route: 'Oral',
                            startDate: new Date().toISOString().split('T')[0],
                            prescriber: 'Dr. S. Kulkarni',
                            indication: '',
                            batchNumber: '',
                            expiryDate: '',
                          });
                          setLabelAttachment(null);
                          setAddMode(null);
                        }}
                        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-xs transition-colors flex items-center justify-center gap-1.5"
                      >
                        <Check className="w-4 h-4" />
                        <span>Save Medicine {labelAttachment ? 'with Label Photo ✓' : ''}</span>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Medicine List */}
              <div className="space-y-3">
                {medicines.map((med) => (
                  <div
                    key={med.id}
                    className={`p-4 bg-white border rounded-2xl space-y-3 transition-all ${
                      med.isSuspected ? 'border-amber-300 bg-amber-50/20' : 'border-slate-200 shadow-xs'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-bold text-slate-900">{med.brandName}</span>
                          <span className="text-xs text-slate-600 font-mono">({med.strength})</span>
                          {med.isSuspected && (
                            <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-1.5 py-0.2 rounded border border-rose-200">
                              Suspected ADR
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 block mt-0.5">
                          Generic: {med.genericName}
                        </span>
                      </div>

                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          med.status === 'active'
                            ? 'bg-blue-100 text-blue-800'
                            : med.status === 'stopped'
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {med.status.toUpperCase()}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1 border-t border-slate-100">
                      <div>
                        <span className="text-slate-400">Started:</span> {med.startDate}
                      </div>
                      <div>
                        <span className="text-slate-400">Frequency:</span> {med.frequency}
                      </div>
                      <div>
                        <span className="text-slate-400">Indication:</span> {med.indication}
                      </div>
                      <div>
                        <span className="text-slate-400">Prescriber:</span> {med.prescriber}
                      </div>
                    </div>

                    {/* Label Attachment Details Card / Quick Trigger */}
                    {med.labelPhoto || med.attachment ? (
                      <div className="flex items-center justify-between p-2.5 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={med.labelPhoto || med.attachment?.dataUrl}
                            alt="Label"
                            referrerPolicy="no-referrer"
                            className="w-10 h-10 rounded-lg object-cover border border-indigo-200 cursor-pointer shadow-xs"
                            onClick={() =>
                              setSelectedAttachmentForModal({
                                med,
                                att: med.attachment,
                              })
                            }
                          />
                          <div>
                            <span className="text-xs font-bold text-indigo-950 flex items-center gap-1">
                              <Camera className="w-3.5 h-3.5 text-indigo-600" />
                              <span>Label Photo Attached</span>
                            </span>
                            <span className="text-[10px] text-slate-500 font-mono">
                              Lot: {med.batchNumber || med.attachment?.batchNumber || 'AX26-904'}
                            </span>
                          </div>
                        </div>

                        <button
                          onClick={() =>
                            setSelectedAttachmentForModal({
                              med,
                              att: med.attachment,
                            })
                          }
                          className="px-3 py-1 bg-white hover:bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-lg text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
                        >
                          <Eye className="w-3 h-3" />
                          <span>View Details</span>
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between p-2 bg-slate-50 rounded-xl border border-slate-200 text-xs">
                        <span className="text-[11px] text-slate-500">No label photo attached</span>
                        <button
                          onClick={() => {
                            setTargetMedForCamera(med);
                            setIsCameraModalOpen(true);
                          }}
                          className="px-2.5 py-1 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-white border border-indigo-200 rounded-lg flex items-center gap-1 shadow-xs"
                        >
                          <Camera className="w-3 h-3" />
                          <span>+ Attach Photo</span>
                        </button>
                      </div>
                    )}

                    {/* Status change actions */}
                    <div className="flex items-center gap-1.5 pt-1">
                      <span className="text-[10px] font-semibold text-slate-400">Mark Status:</span>
                      <button
                        onClick={() => onUpdateMedicineStatus(med.id, 'active')}
                        className={`text-[10px] px-2.5 py-0.5 rounded-lg border font-semibold ${
                          med.status === 'active' ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold' : 'text-slate-600 border-slate-200'
                        }`}
                      >
                        Active
                      </button>
                      <button
                        onClick={() => onUpdateMedicineStatus(med.id, 'stopped')}
                        className={`text-[10px] px-2.5 py-0.5 rounded-lg border font-semibold ${
                          med.status === 'stopped' ? 'bg-rose-50 text-rose-700 border-rose-300 font-bold' : 'text-slate-600 border-slate-200'
                        }`}
                      >
                        Stopped
                      </button>
                      <button
                        onClick={() => onUpdateMedicineStatus(med.id, 'dose_changed')}
                        className={`text-[10px] px-2.5 py-0.5 rounded-lg border font-semibold ${
                          med.status === 'dose_changed' ? 'bg-amber-50 text-amber-700 border-amber-300 font-bold' : 'text-slate-600 border-slate-200'
                        }`}
                      >
                        Dose Changed
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ================= SCREEN: LABEL PHOTOS & ATTACHMENTS GALLERY ================= */}
          {currentScreen === 'attachments' && (
            <div className="space-y-5">
              <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-blue-50 p-4 rounded-2xl border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Medication Packaging & Label Photos
                    </h3>
                    <p className="text-xs text-slate-600">
                      Physical photos of strips, bottles, and boxes captured using device camera
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setTargetMedForCamera(null);
                      setIsCameraModalOpen(true);
                    }}
                    className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>Open Device Camera</span>
                  </button>
                  <label className="px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Grid of Attached Photos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {medicines
                  .filter((m) => m.labelPhoto || m.attachment)
                  .map((med) => {
                    const att = med.attachment || {
                      id: `att-${med.id}`,
                      fileName: `${med.brandName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_label.jpg`,
                      fileSize: '380 KB',
                      mimeType: 'image/jpeg',
                      dataUrl: med.labelPhoto || '/src/assets/images/medicine_blister_pack_1791221295842.jpg',
                      capturedAt: '2026-10-01 10:24 AM',
                      source: 'camera' as const,
                      batchNumber: med.batchNumber || 'AX26-904',
                      expiryDate: '08/2027',
                    };

                    return (
                      <div
                        key={med.id}
                        className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3 shadow-xs hover:border-indigo-300 transition-all"
                      >
                        <div
                          className="relative rounded-xl overflow-hidden bg-slate-100 border border-slate-200 aspect-video flex items-center justify-center group cursor-pointer"
                          onClick={() => setSelectedAttachmentForModal({ med, att })}
                        >
                          <img
                            src={att.dataUrl}
                            alt={med.brandName}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                          />
                          <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold gap-1.5">
                            <Eye className="w-4 h-4" />
                            <span>Inspect Full Details & Zoom</span>
                          </div>
                          <div className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] px-2 py-0.5 rounded font-mono">
                            Batch: {att.batchNumber || med.batchNumber || 'AX26-904'}
                          </div>
                          <div className="absolute top-2 right-2 bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-xs">
                            <Camera className="w-3 h-3" />
                            <span>Camera Photo</span>
                          </div>
                        </div>

                        <div className="space-y-1.5 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900 text-sm">{med.brandName}</span>
                            <span className="font-mono text-slate-500 text-[11px]">{med.strength}</span>
                          </div>
                          <p className="text-slate-600 text-[11px]">
                            Generic: {med.genericName}
                          </p>
                          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                            <span>Captured: {att.capturedAt}</span>
                            <span>{att.fileSize}</span>
                          </div>
                        </div>

                        <button
                          onClick={() => setSelectedAttachmentForModal({ med, att })}
                          className="w-full py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition-colors flex items-center justify-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Full Attachment Details</span>
                        </button>
                      </div>
                    );
                  })}
              </div>

              {/* Informational Card */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs space-y-2 text-slate-700">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Info className="w-4 h-4 text-indigo-600" />
                  <span>Why photograph medication packaging?</span>
                </div>
                <p className="leading-relaxed text-slate-600">
                  Under the Pharmacovigilance Programme of India (PvPI), capturing the original blister foil or bottle label provides your pharmacist with verifiable proof of the manufacturer batch number, expiration date, and physical integrity of the medicine, speeding up adverse reaction evaluations.
                </p>
              </div>
            </div>
          )}

          {/* ================= SCREEN: MEDICATION REMINDERS & NOTIFICATION CENTER ================= */}
          {currentScreen === 'reminders' && (
            <NotificationCenter
              medicines={medicines}
              reminders={reminders}
              onUpdateReminders={handleUpdateReminders}
              onTakeDose={handleTakeDose}
              onSkipDose={handleSkipDose}
              currentTimeStr={currentTimeStr}
            />
          )}

          {/* ================= SCREEN 3: REPORT A SYMPTOM ================= */}
          {currentScreen === 'report' && (
            <div className="space-y-5">
              <div>
                <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
                  AI-Assisted Symptom Capture
                </span>
                <h3 className="text-sm font-bold text-slate-900">How are you feeling?</h3>
                <p className="text-xs text-slate-500">
                  Speak in Marathi, Hindi, or English. We link symptom onset with medicine start dates.
                </p>
              </div>

              {/* Language Selector & Demo Presets */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-700">Preferred Voice Language:</span>
                  <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
                    <button
                      onClick={() => handleApplyPreset('mr')}
                      className={`px-2 py-0.5 rounded-lg text-xs font-semibold shrink-0 ${
                        reportLang === 'mr' ? 'bg-orange-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      मराठी
                    </button>
                    <button
                      onClick={() => handleApplyPreset('hi')}
                      className={`px-2 py-0.5 rounded-lg text-xs font-semibold shrink-0 ${
                        reportLang === 'hi' ? 'bg-orange-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      हिंदी
                    </button>
                    <button
                      onClick={() => handleApplyPreset('ta')}
                      className={`px-2 py-0.5 rounded-lg text-xs font-semibold shrink-0 ${
                        reportLang === 'ta' ? 'bg-orange-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      தமிழ்
                    </button>
                    <button
                      onClick={() => handleApplyPreset('te')}
                      className={`px-2 py-0.5 rounded-lg text-xs font-semibold shrink-0 ${
                        reportLang === 'te' ? 'bg-orange-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      తెలుగు
                    </button>
                    <button
                      onClick={() => handleApplyPreset('bn')}
                      className={`px-2 py-0.5 rounded-lg text-xs font-semibold shrink-0 ${
                        reportLang === 'bn' ? 'bg-orange-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      বাংলা
                    </button>
                    <button
                      onClick={() => handleApplyPreset('gu')}
                      className={`px-2 py-0.5 rounded-lg text-xs font-semibold shrink-0 ${
                        reportLang === 'gu' ? 'bg-orange-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      ગુજરાતી
                    </button>
                    <button
                      onClick={() => handleApplyPreset('en')}
                      className={`px-2 py-0.5 rounded-lg text-xs font-semibold shrink-0 ${
                        reportLang === 'en' ? 'bg-orange-600 text-white shadow-xs' : 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      English
                    </button>
                  </div>
                </div>

                {/* Voice Input Simulator Box */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                      <Mic className={`w-3.5 h-3.5 ${isRecording ? 'text-rose-600 animate-pulse' : 'text-indigo-600'}`} />
                      <span>
                        {transcribing
                          ? 'Transcribing audio with DoseGuard Voice AI...'
                          : isRecording
                          ? 'Listening to microphone (speak now)...'
                          : 'Voice Input / Transcript'}
                      </span>
                    </span>
                    <button
                      type="button"
                      onClick={handleToggleRecording}
                      disabled={transcribing}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                        isRecording
                          ? 'bg-rose-600 text-white border-rose-600 shadow-sm animate-pulse'
                          : transcribing
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-200'
                          : 'bg-white text-slate-700 border-slate-300 hover:border-indigo-500'
                      }`}
                    >
                      {isRecording ? 'Stop Recording' : transcribing ? 'Transcribing...' : 'Record Voice'}
                    </button>
                  </div>

                  <textarea
                    rows={3}
                    value={symptomText}
                    onChange={(e) => setSymptomText(e.target.value)}
                    placeholder="Describe what happened after taking your medicine..."
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-indigo-600"
                  />

                  {/* Quick Preset Prompts */}
                  <div className="flex items-center gap-1.5 text-[11px] text-slate-500 overflow-x-auto pb-1">
                    <span className="shrink-0 font-medium text-slate-400">Demo cases:</span>
                    <button
                      onClick={() => handleApplyPreset('mr')}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:border-indigo-400 shrink-0"
                    >
                      Co-Amoxiclav Rash & Angioedema (Marathi)
                    </button>
                    <button
                      onClick={() => handleApplyPreset('hi')}
                      className="px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-700 hover:border-indigo-400 shrink-0"
                    >
                      Amlodipine Ankle Swelling (Hindi)
                    </button>
                  </div>
                </div>
              </div>

              {/* Interactive Anatomical Body Map */}
              <BodyMap
                selectedRegions={selectedRegions}
                onToggleRegion={(reg) =>
                  setSelectedRegions((prev) =>
                    prev.includes(reg) ? prev.filter((r) => r !== reg) : [...prev, reg]
                  )
                }
                selectedSymptoms={selectedSymptoms}
                onSelectSymptom={(sym) =>
                  setSelectedSymptoms((prev) =>
                    prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
                  )
                }
              />

              {/* Clinical Red-Flag Safety Questions */}
              <div className="p-4 bg-rose-50/60 border border-rose-200 rounded-2xl space-y-3">
                <div className="flex items-center gap-1.5 text-rose-950 font-bold text-xs">
                  <ShieldAlert className="w-4 h-4 text-rose-600" />
                  <span>Targeted Emergency Safety Screening</span>
                </div>
                <p className="text-[11px] text-slate-600">
                  Please answer these 4 critical questions so DoseGuard can prioritize urgent medical care:
                </p>

                <div className="space-y-2 text-xs">
                  <label className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-800">Do you have any facial, lip, or tongue swelling?</span>
                    <input
                      type="checkbox"
                      checked={hasLipSwelling}
                      onChange={(e) => setHasLipSwelling(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-800">Do you have difficulty breathing, wheezing, or choking?</span>
                    <input
                      type="checkbox"
                      checked={hasBreathingDifficulty}
                      onChange={(e) => setHasBreathingDifficulty(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-800">Are there blisters or peeling on skin, mouth, or eyes?</span>
                    <input
                      type="checkbox"
                      checked={hasBlisters}
                      onChange={(e) => setHasBlisters(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded"
                    />
                  </label>

                  <label className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                    <span className="text-slate-800">Do you have a sudden high fever accompanied by rash?</span>
                    <input
                      type="checkbox"
                      checked={hasFever}
                      onChange={(e) => setHasFever(e.target.checked)}
                      className="w-4 h-4 text-rose-600 rounded"
                    />
                  </label>
                </div>
              </div>

              {/* Vitals Signs Integration */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Vital Signs & Wearable Data (Optional)</span>
                  </span>
                  <span className="text-[11px] text-slate-500">Connected BP monitor</span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] text-slate-500 block">BP (mmHg)</label>
                    <input
                      type="text"
                      value={`${vitals.bpSystolic}/${vitals.bpDiastolic}`}
                      onChange={(e) => {
                        const parts = e.target.value.split('/');
                        setVitals({
                          ...vitals,
                          bpSystolic: Number(parts[0]) || 120,
                          bpDiastolic: Number(parts[1]) || 80,
                        });
                      }}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">Heart Rate</label>
                    <input
                      type="number"
                      value={vitals.heartRate}
                      onChange={(e) => setVitals({ ...vitals, heartRate: Number(e.target.value) })}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-500 block">SpO2 (%)</label>
                    <input
                      type="number"
                      value={vitals.spo2}
                      onChange={(e) => setVitals({ ...vitals, spo2: Number(e.target.value) })}
                      className="w-full p-1.5 bg-white border border-slate-300 rounded text-xs font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                onClick={handleAnalyzeAndSubmit}
                disabled={analyzing || !symptomText.trim()}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 disabled:bg-slate-300 text-white font-bold rounded-2xl text-xs shadow-md shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {analyzing ? (
                  <span>Standardizing Symptoms & Evaluating Causality...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4 text-white" />
                    <span>Process Report & Triage Urgency</span>
                  </>
                )}
              </button>
            </div>
          )}

          {/* ================= SCREEN 4: SAFETY RESULT SCREEN ================= */}
          {(currentScreen === 'result' || currentScreen === 'followup') && (
            <div className="space-y-4">
              {/* Triage Urgency Banner */}
              {analysisResult || activeReport ? (
                (() => {
                  const rep = analysisResult || activeReport!;
                  const isEmerg = rep.urgencyLevel === 'EMERGENCY';

                  return (
                    <div className="space-y-4">
                      <div
                        className={`p-5 rounded-2xl border text-white shadow-sm ${
                          isEmerg ? 'bg-rose-600 border-rose-700' : 'bg-amber-600 border-amber-700'
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-widest bg-white/20 px-2 py-0.5 rounded">
                              Triage Designation
                            </span>
                            <h3 className="text-lg font-extrabold mt-1">
                              {isEmerg
                                ? 'EMERGENCY WARNING — SEEK EMERGENCY CARE NOW'
                                : 'PHARMACIST / CLINICIAN REVIEW RECOMMENDED'}
                            </h3>
                          </div>
                          <ShieldAlert className="w-8 h-8 text-white/80 shrink-0" />
                        </div>

                        <p className="text-xs text-white/90 mt-2 leading-relaxed">
                          {isEmerg
                            ? 'Your symptoms include potential emergency red flags (facial/airway swelling or rapid hypersensitivity reaction). Do not wait for an in-app reply. Contact emergency services (108 / 112) or go to the nearest emergency casualty immediately.'
                            : 'Timing matches your recent medication adjustment. Your community pharmacist has been alerted to review this case today.'}
                        </p>

                        {isEmerg && (
                          <div className="mt-4 flex gap-2">
                            <a
                              href="tel:108"
                              className="flex-1 py-2 px-3 bg-white text-rose-700 font-bold rounded-xl text-xs text-center flex items-center justify-center gap-1"
                            >
                              Call 108 Emergency
                            </a>
                            <button
                              onClick={onEmergencyClick}
                              className="py-2 px-3 bg-rose-700 text-white font-semibold rounded-xl text-xs"
                            >
                              View Red-Flag Directives
                            </button>
                          </div>
                        )}
                      </div>

                      {/* 3 Separate System Outputs (Layer 3 Temporal Causality Engine) */}
                      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3">
                        <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
                          Triage & Causality Engine Outputs
                        </span>

                        <div className="grid grid-cols-1 gap-2.5 text-xs">
                          {/* Output 1: Exposure-event association score */}
                          <div className="p-3 bg-white border border-slate-200 rounded-xl">
                            <div className="flex items-center justify-between text-slate-500 mb-1">
                              <span className="font-semibold text-slate-700">1. Exposure–Event Association</span>
                              <span className="font-mono font-bold text-indigo-600">{rep.causality.cAdrTotal}/100</span>
                            </div>
                            <p className="text-slate-600 font-medium">
                              &ldquo;This symptom occurred 48h after starting {medicines.find((m) => m.isSuspected)?.brandName || 'Augmentin 625 Duo'}.&rdquo;
                            </p>
                          </div>

                          {/* Output 2: Seriousness / Urgency score */}
                          <div className="p-3 bg-white border border-slate-200 rounded-xl">
                            <div className="flex items-center justify-between text-slate-500 mb-1">
                              <span className="font-semibold text-slate-700">2. Seriousness & Urgency Level</span>
                              <span
                                className={`font-mono font-bold ${
                                  isEmerg ? 'text-rose-700' : 'text-amber-700'
                                }`}
                              >
                                {rep.urgencyLevel}
                              </span>
                            </div>
                            <p className="text-slate-600 font-medium">
                              &ldquo;{isEmerg ? 'Emergency warning — immediate clinical assessment required' : 'Contact pharmacist/doctor today'}&rdquo;
                            </p>
                          </div>

                          {/* Output 3: Report Completeness score */}
                          <div className="p-3 bg-white border border-slate-200 rounded-xl">
                            <div className="flex items-center justify-between text-slate-500 mb-1">
                              <span className="font-semibold text-slate-700">3. Report Completeness Score</span>
                              <span className="font-mono font-bold text-blue-600">{rep.completenessScore}%</span>
                            </div>
                            <p className="text-slate-600 font-medium">
                              &ldquo;Your report is {rep.completenessScore}% complete — {rep.missingFields[0] || 'Ready for clinical submission'}&rdquo;
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Follow-up Screen Section (Layer 1 Screen 5) */}
                      <div className="p-4 bg-indigo-50/60 border border-indigo-200 rounded-2xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-indigo-950 uppercase tracking-wider">
                            Patient Follow-Up Status (Day 4 Check-In)
                          </span>
                          <span className="text-[10px] bg-indigo-100 text-indigo-900 px-2 py-0.5 rounded font-semibold border border-indigo-200">
                            Causality Evolution
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <div>
                            <label className="text-slate-700 font-semibold block mb-1">
                              Has the symptom improved?
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                onClick={() => setFollowupSymptomState('improved')}
                                className={`p-2 rounded-lg border text-center ${
                                  followupSymptomState === 'improved'
                                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                                    : 'bg-white text-slate-700'
                                }`}
                              >
                                Yes, Improving
                              </button>
                              <button
                                onClick={() => setFollowupSymptomState('worse')}
                                className={`p-2 rounded-lg border text-center ${
                                  followupSymptomState === 'worse'
                                    ? 'bg-rose-700 text-white font-bold'
                                    : 'bg-white text-slate-700'
                                }`}
                              >
                                No, Same / Worse
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="text-slate-700 font-semibold block mb-1">
                              Did you or your doctor stop the suspected medicine?
                            </label>
                            <div className="grid grid-cols-2 gap-1.5">
                              <button
                                onClick={() => setFollowupDrugState('stopped_by_doctor')}
                                className={`p-2 rounded-lg border text-center ${
                                  followupDrugState === 'stopped_by_doctor'
                                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                                    : 'bg-white text-slate-700'
                                }`}
                              >
                                Yes, Stopped on Advice
                              </button>
                              <button
                                onClick={() => setFollowupDrugState('continued')}
                                className={`p-2 rounded-lg border text-center ${
                                  followupDrugState === 'continued'
                                    ? 'bg-slate-700 text-white font-bold'
                                    : 'bg-white text-slate-700'
                                }`}
                              >
                                Still Taking It
                              </button>
                            </div>
                          </div>

                          <label className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200">
                            <span className="text-slate-800">Were you hospitalized or visited the ER?</span>
                            <input
                              type="checkbox"
                              checked={followupHospitalized}
                              onChange={(e) => setFollowupHospitalized(e.target.checked)}
                              className="w-4 h-4 text-indigo-600 rounded"
                            />
                          </label>

                          <button
                            onClick={() => setFollowupCompleted(true)}
                            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-xs mt-1 shadow-md shadow-indigo-600/20"
                          >
                            {followupCompleted ? '✓ Follow-Up Logged (Causality Updated)' : 'Submit Follow-Up Details'}
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })()
              ) : (
                <div className="p-8 text-center text-slate-500 space-y-2">
                  <p className="text-xs">No active symptom report submitted yet.</p>
                  <button
                    onClick={() => setCurrentScreen('report')}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs"
                  >
                    Report First Symptom
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input for document/photo upload fallback */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Hidden camera input for direct shutter */}
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileUpload}
        className="hidden"
      />

      {/* Medication Label Attachment Details Modal */}
      {selectedAttachmentForModal && (
        <AttachmentDetailsModal
          isOpen={!!selectedAttachmentForModal}
          onClose={() => setSelectedAttachmentForModal(null)}
          medicine={selectedAttachmentForModal.med}
          attachment={selectedAttachmentForModal.att}
        />
      )}

      {/* Live Device Camera Capture Modal */}
      <CameraCaptureModal
        isOpen={isCameraModalOpen}
        onClose={() => {
          setIsCameraModalOpen(false);
          setTargetMedForCamera(null);
        }}
        onPhotoCaptured={handlePhotoCaptured}
      />
    </div>
  );
};
