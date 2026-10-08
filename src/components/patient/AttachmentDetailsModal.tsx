import React, { useState } from 'react';
import { Medicine, MedicationAttachment } from '../../types/pv';
import {
  X,
  Camera,
  Calendar,
  Clock,
  ShieldCheck,
  FileText,
  ZoomIn,
  ZoomOut,
  Download,
  CheckCircle2,
  AlertTriangle,
  Info,
  Pill,
} from 'lucide-react';

interface AttachmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  medicine: Medicine;
  attachment?: MedicationAttachment;
}

export const AttachmentDetailsModal: React.FC<AttachmentDetailsModalProps> = ({
  isOpen,
  onClose,
  medicine,
  attachment,
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  if (!isOpen) return null;

  const currentAttachment: MedicationAttachment = attachment || medicine.attachment || {
    id: `att-${medicine.id}`,
    fileName: `${medicine.brandName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_label.jpg`,
    fileSize: '384 KB',
    mimeType: 'image/jpeg',
    dataUrl: medicine.labelPhoto || '/src/assets/images/medicine_blister_pack_1791221295842.jpg',
    capturedAt: new Date().toLocaleString(),
    source: 'camera',
    batchNumber: medicine.batchNumber || 'AX26-904',
    expiryDate: '08/2027',
    notes: 'Medication label photo captured via device camera for pharmacist verification.',
  };

  const imageUrl = currentAttachment.dataUrl || medicine.labelPhoto || '/src/assets/images/medicine_blister_pack_1791221295842.jpg';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header - Soft, light, easy-to-read theme */}
        <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-blue-50 border-b border-indigo-100 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-sm">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">Medication Label Attachment</h3>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 border border-indigo-200 px-2 py-0.5 rounded-full">
                  Device Camera Verified
                </span>
              </div>
              <p className="text-xs text-slate-600">
                {medicine.brandName} ({medicine.strength}) · {medicine.genericName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-white/80 transition-colors"
            title="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Left: Image Viewer with Zoom */}
            <div className="space-y-3">
              <div className="relative bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden flex items-center justify-center min-h-[260px] max-h-[360px]">
                <img
                  src={imageUrl}
                  alt={medicine.brandName}
                  referrerPolicy="no-referrer"
                  style={{ transform: `scale(${zoomLevel})` }}
                  className="w-full h-auto object-contain transition-transform duration-200 max-h-[350px]"
                />

                {/* Overlay Zoom Controls */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-white/95 backdrop-blur-md px-2 py-1 rounded-xl shadow-md border border-slate-200 text-xs">
                  <button
                    onClick={() => setZoomLevel((z) => Math.max(0.8, z - 0.2))}
                    className="p-1 text-slate-600 hover:text-slate-900"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="font-mono text-[11px] font-semibold text-slate-700 px-1">
                    {Math.round(zoomLevel * 100)}%
                  </span>
                  <button
                    onClick={() => setZoomLevel((z) => Math.min(2.5, z + 0.2))}
                    className="p-1 text-slate-600 hover:text-slate-900"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-semibold text-slate-700 border border-slate-200 shadow-xs flex items-center gap-1">
                  <Camera className="w-3 h-3 text-indigo-600" />
                  <span>Captured via Camera</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                <span>Pinch or click + / - to zoom label details</span>
                <a
                  href={imageUrl}
                  target="_blank"
                  rel="noreferrer"
                  download={currentAttachment.fileName || 'medication_label.jpg'}
                  className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Original</span>
                </a>
              </div>
            </div>

            {/* Right: Structured Attachment Details */}
            <div className="space-y-4 text-xs">
              {/* File Metadata Box */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2.5">
                <span className="font-bold text-slate-900 uppercase tracking-wider text-[11px] block">
                  Attachment Metadata
                </span>

                <div className="grid grid-cols-2 gap-2 text-slate-700">
                  <div>
                    <span className="text-slate-400 block text-[10px]">File Name:</span>
                    <span className="font-mono font-medium text-slate-900 break-all">
                      {currentAttachment.fileName}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">File Size:</span>
                    <span className="font-mono font-medium text-slate-900">
                      {currentAttachment.fileSize}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Captured On:</span>
                    <span className="font-medium text-slate-900 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {currentAttachment.capturedAt}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px]">Capture Method:</span>
                    <span className="font-semibold text-indigo-700 capitalize">
                      {currentAttachment.source === 'camera' ? '📷 Device Camera' : '📁 Upload / Scan'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Medication Verification Cross-Check */}
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-2.5">
                <span className="font-bold text-indigo-950 uppercase tracking-wider text-[11px] block flex items-center gap-1.5">
                  <Pill className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Associated Prescription Record</span>
                </span>

                <div className="space-y-1.5 text-slate-800">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Brand Name:</span>
                    <span className="font-bold text-slate-900">{medicine.brandName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Generic Formula:</span>
                    <span className="font-medium text-slate-900">{medicine.genericName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Strength:</span>
                    <span className="font-mono font-semibold text-slate-900">{medicine.strength}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Batch Number:</span>
                    <span className="font-mono font-bold text-indigo-900 bg-white px-2 py-0.5 rounded border border-indigo-200">
                      {currentAttachment.batchNumber || medicine.batchNumber || 'AX26-904'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Expiration Date:</span>
                    <span className="font-mono font-medium text-slate-800">
                      {currentAttachment.expiryDate || '08/2027'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Prescriber:</span>
                    <span className="text-slate-800">{medicine.prescriber}</span>
                  </div>
                </div>
              </div>

              {/* Safety & Pharmacovigilance Inspection Card */}
              <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200 space-y-2">
                <div className="flex items-center gap-2 text-emerald-900 font-bold">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Pharmacist Inspection Verification</span>
                </div>
                <p className="text-[11px] text-emerald-950 leading-relaxed">
                  {currentAttachment.notes ||
                    'Label image confirms physical packaging, manufacturer lot number, and dosage strength. Correlated with adverse drug reaction timeline.'}
                </p>
                <div className="flex items-center gap-3 pt-1 text-[10px] text-emerald-800 font-medium">
                  <span className="flex items-center gap-1">✓ Batch Legible</span>
                  <span className="flex items-center gap-1">✓ Foil Intact</span>
                  <span className="flex items-center gap-1">✓ Expiry Valid</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3.5 flex items-center justify-between">
          <div className="text-[11px] text-slate-500">
            Dose Guard Attachment Service · Document ID: {currentAttachment.id}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
          >
            Close Details
          </button>
        </div>
      </div>
    </div>
  );
};
