import React, { useState, useRef, useEffect } from 'react';
import {
  medicineBlisterPackImg,
  prescriptionSampleImg,
} from '../../assets/images';
import {
  Camera,
  X,
  RotateCcw,
  Check,
  Upload,
  Sparkles,
  AlertCircle,
  SwitchCamera,
  Image as ImageIcon,
} from 'lucide-react';

interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPhotoCaptured: (dataUrl: string, fileName: string, fileSize: string) => void;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onPhotoCaptured,
}) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [capturedPreview, setCapturedPreview] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Initialize camera when modal opens
  useEffect(() => {
    if (!isOpen) {
      stopCamera();
      setCapturedPreview(null);
      setCameraError(null);
      return;
    }

    startCamera(facingMode);

    return () => {
      stopCamera();
    };
  }, [isOpen, facingMode]);

  const startCamera = async (facing: 'environment' | 'user') => {
    stopCamera();
    setCameraError(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera API is not supported on this browser or environment.');
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facing,
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch((err) => console.log('Video play error:', err));
      }
    } catch (err: any) {
      console.warn('Unable to access device camera:', err);
      setCameraError(
        'Device camera not directly accessible or permission was not granted. You can use your phone/system photo picker or select a sample label photo below.'
      );
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current || document.createElement('canvas');
    canvas.width = video.videoWidth || 1280;
    canvas.height = video.videoHeight || 720;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedPreview(dataUrl);
      stopCamera();
    }
  };

  const handleConfirmCaptured = () => {
    if (!capturedPreview) return;
    const timeCode = new Date().toISOString().replace(/[-:T.]/g, '').slice(0, 14);
    const fileName = `med_label_camera_${timeCode}.jpg`;
    onPhotoCaptured(capturedPreview, fileName, '380 KB');
    onClose();
  };

  const handleRetake = () => {
    setCapturedPreview(null);
    startCamera(facingMode);
  };

  const handleSwitchCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const sizeKb = Math.round(file.size / 1024) + ' KB';
      setCapturedPreview(dataUrl);
      stopCamera();
    };
    reader.readAsDataURL(file);
  };

  const handleUseSample = (sampleUrl: string, sampleName: string) => {
    setCapturedPreview(sampleUrl);
    stopCamera();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header - Soft, light colors */}
        <div className="bg-gradient-to-r from-sky-50 via-indigo-50 to-blue-50 border-b border-indigo-100 px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">Device Camera · Medication Label</h3>
              <p className="text-[11px] text-slate-600">Align blister pack or box inside the guide frame</p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Viewfinder / Preview Body */}
        <div className="p-4 space-y-4">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 aspect-[4/3] flex items-center justify-center border border-slate-300 shadow-inner">
            {capturedPreview ? (
              <img
                src={capturedPreview}
                alt="Captured label"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain bg-slate-900"
              />
            ) : stream ? (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover"
                />
                {/* Viewfinder Target Reticle */}
                <div className="absolute inset-6 border-2 border-dashed border-sky-400/80 rounded-2xl pointer-events-none flex flex-col items-center justify-between p-3">
                  <span className="text-[10px] font-mono font-bold bg-slate-900/80 text-sky-200 px-2 py-0.5 rounded backdrop-blur-xs">
                    Position medicine brand & batch here
                  </span>
                  <div className="w-12 h-1 bg-sky-400/80 rounded-full animate-pulse" />
                </div>
              </>
            ) : (
              <div className="p-6 text-center space-y-3 text-slate-300">
                <Camera className="w-10 h-10 text-slate-400 mx-auto" />
                <p className="text-xs max-w-xs text-slate-300">
                  {cameraError || 'Initializing camera stream...'}
                </p>
                <div className="flex flex-col gap-2 pt-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs"
                  >
                    <Upload className="w-4 h-4" />
                    <span>Choose Photo from Device</span>
                  </button>
                  <button
                    onClick={() =>
                      handleUseSample(
                        medicineBlisterPackImg,
                        'augmentin_blister.jpg'
                      )
                    }
                    className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4 text-sky-300" />
                    <span>Use Sample Blister Strip Photo</span>
                  </button>
                </div>
              </div>
            )}

            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Action Toolbar */}
          <div className="space-y-3">
            {capturedPreview ? (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleRetake}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Retake Photo</span>
                </button>
                <button
                  onClick={handleConfirmCaptured}
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-1.5 shadow-md transition-colors"
                >
                  <Check className="w-4 h-4" />
                  <span>Use This Label Photo</span>
                </button>
              </div>
            ) : stream ? (
              <div className="flex items-center justify-between gap-3 px-2">
                <button
                  onClick={handleSwitchCamera}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
                  title="Switch Front/Back Camera"
                >
                  <SwitchCamera className="w-5 h-5" />
                </button>

                {/* Shutter Button */}
                <button
                  onClick={handleCaptureSnapshot}
                  className="w-16 h-16 rounded-full border-4 border-indigo-200 bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center shadow-lg transition-transform active:scale-95"
                  title="Capture Photo"
                >
                  <Camera className="w-7 h-7" />
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100"
                  title="Upload from Device"
                >
                  <ImageIcon className="w-5 h-5" />
                </button>
              </div>
            ) : null}

            {/* Hidden native input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />

            {/* Quick Sample Presets */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
              <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Test Samples:</span>
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() =>
                    handleUseSample(
                      medicineBlisterPackImg,
                      'augmentin_strip.jpg'
                    )
                  }
                  className="text-[10px] px-2 py-1 bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
                >
                  Blister Strip
                </button>
                <button
                  onClick={() =>
                    handleUseSample(
                      prescriptionSampleImg,
                      'rx_label.jpg'
                    )
                  }
                  className="text-[10px] px-2 py-1 bg-white hover:bg-indigo-50 border border-slate-200 rounded-lg text-slate-700 font-medium"
                >
                  Prescription
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
