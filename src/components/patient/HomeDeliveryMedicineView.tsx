import React, { useState } from 'react';
import { Medicine, HomeDeliveryOrder, NearbyPharmacyShop } from '../../types/pv';
import {
  Truck,
  MapPin,
  Clock,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Building2,
  Navigation,
  ArrowLeft,
  ChevronRight,
  Package,
  FileText,
  User,
  Star,
  RefreshCw,
  Search,
  Check,
  Calendar,
  CreditCard,
  QrCode,
  Thermometer,
  KeyRound,
  ExternalLink,
  Plus,
  Sparkles,
  Info
} from 'lucide-react';

interface HomeDeliveryMedicineViewProps {
  medicines: Medicine[];
  onBack?: () => void;
  initialPreselectedMedId?: string | null;
}

const NEARBY_SHOPS: NearbyPharmacyShop[] = [
  {
    id: 'shop-apollo',
    name: 'Apollo Pharmacy - FC Road Branch',
    address: 'Shop 12-14, Fergusson College Rd, Shivajinagar, Pune 411004',
    distanceKm: 0.8,
    rating: 4.8,
    reviewsCount: 420,
    deliveryTimeEstimate: '20 - 30 mins',
    phone: '+91 20 2567 1102',
    openNow: true,
    coldChainReady: true,
    discountOffer: '15% Senior Citizen Discount Applied',
    badge: 'Fastest Delivery'
  },
  {
    id: 'shop-medplus',
    name: 'MedPlus Chemists - Model Colony',
    address: 'Plot 34, Hare Krishna Mandir Rd, Model Colony, Pune 411016',
    distanceKm: 1.2,
    rating: 4.7,
    reviewsCount: 310,
    deliveryTimeEstimate: '25 - 35 mins',
    phone: '+91 20 2565 8890',
    openNow: true,
    coldChainReady: true,
    discountOffer: 'Generic Refill Savings 20%',
    badge: 'Generic Partner'
  },
  {
    id: 'shop-wellness',
    name: 'Wellness Forever 24x7 - Shivajinagar',
    address: 'J.M. Road, Opp. Sambhaji Park, Shivajinagar, Pune 411005',
    distanceKm: 1.9,
    rating: 4.9,
    reviewsCount: 650,
    deliveryTimeEstimate: '30 - 40 mins',
    phone: '+91 20 2553 4400',
    openNow: true,
    coldChainReady: true,
    discountOffer: '24/7 Cold Chain & Emergency Refills',
    badge: '24x7 Verified'
  },
  {
    id: 'shop-hospital',
    name: 'City Central Hospital Dispensary',
    address: 'Sassoon Medical Complex, Station Rd, Pune 411001',
    distanceKm: 0.4,
    rating: 4.9,
    reviewsCount: 890,
    deliveryTimeEstimate: '15 - 20 mins',
    phone: '+91 20 2612 8050',
    openNow: true,
    coldChainReady: true,
    discountOffer: 'Direct Hospital EHR Billing',
    badge: 'Hospital In-House'
  },
  {
    id: 'shop-noble',
    name: 'Noble Chemists & Druggists - Deccan',
    address: '759/5 Deccan Gymkhana, Pune 411004',
    distanceKm: 2.1,
    rating: 4.6,
    reviewsCount: 180,
    deliveryTimeEstimate: '35 - 45 mins',
    phone: '+91 20 2566 3311',
    openNow: true,
    coldChainReady: false,
    discountOffer: 'Flat 10% on Chronic Medications',
    badge: 'Local Chemist'
  }
];

const INITIAL_ORDERS: HomeDeliveryOrder[] = [
  {
    id: 'HD-DEL-8921',
    patientId: 'PAT-6801',
    patientName: 'Ramesh V. Kulkarni',
    orderDate: 'Today',
    orderTime: '10:15 AM',
    pharmacyType: 'nearby',
    pharmacyName: 'Apollo Pharmacy - FC Road Branch',
    pharmacyAddress: 'Shop 12-14, Fergusson College Rd, Pune 411004',
    pharmacyPhone: '+91 20 2567 1102',
    pharmacistLicense: 'MH-PUN-08412B (R.Ph. Snehal Shinde)',
    deliveryAddress: 'Flat 402, Shanti Heights, Shivajinagar, Pune 411005',
    contactPerson: 'Rohan Kulkarni (Son / Caregiver)',
    contactPhone: '+91 98220 12345',
    medicines: [
      {
        id: 'med-amlodipine',
        brandName: 'Amlodipine',
        genericName: 'Amlodipine Besylate',
        strength: '5mg',
        quantityCourse: '30 Tablets (1 Month Course)',
        unitPrice: 68
      },
      {
        id: 'med-metformin',
        brandName: 'Metformin SR',
        genericName: 'Metformin Hydrochloride Extended Release',
        strength: '500mg',
        quantityCourse: '60 Tablets (1 Month Course)',
        unitPrice: 112
      },
      {
        id: 'med-pantop',
        brandName: 'Pantoprazole',
        genericName: 'Pantoprazole Gastro-resistant',
        strength: '40mg',
        quantityCourse: '30 Tablets (1 Month Course)',
        unitPrice: 94
      }
    ],
    deliverySpeed: 'Express (30-45 mins)',
    paymentMode: 'Cash on Delivery (COD)',
    totalAmount: 274,
    seniorDiscountApplied: 41,
    netPayable: 233,
    status: 'Out for Delivery',
    riderName: 'Suresh Patil',
    riderPhone: '+91 98811 54321',
    riderVehicle: 'Hero Electric MH-12-DE-4412 (Zero Emission)',
    riderRating: 4.9,
    estimatedDeliveryTime: 'Arriving in ~14 mins (1.1 km away)',
    deliveryOtp: '5924',
    currentStepIndex: 3,
    distanceRemainingKm: 1.1,
    coldChainTempC: 22,
    specialInstructions: 'Ring bell twice. Hand medicines to caregiver Rohan. Cold chain packaging verified.',
    prescriptionRefId: 'ERX-2026-901',
    timeline: [
      {
        title: 'Order Placed & e-Rx Verified',
        time: '10:15 AM',
        description: 'Verified with e-Prescription ERX-2026-901 (Dr. Ananya Deshmukh, MD).',
        completed: true
      },
      {
        title: 'Pharmacist Quality Checked & Packed',
        time: '10:28 AM',
        description: 'Batch BX-A409 & BX-M882 sealed with tamper-proof QR code & cold pouch.',
        completed: true
      },
      {
        title: 'Assigned to Delivery Partner',
        time: '10:35 AM',
        description: 'Picked up by Suresh Patil (+91 98811 54321) from FC Road store.',
        completed: true
      },
      {
        title: 'Out for Delivery (Rider in Transit)',
        time: '10:38 AM',
        description: 'Live GPS tracked: Near Gokhale Chowk approaching Shivajinagar.',
        completed: true
      },
      {
        title: 'Delivered & OTP Verified',
        time: 'Estimated 10:52 AM',
        description: 'Will provide secure 4-digit OTP 5924 upon contactless handover.',
        completed: false
      }
    ]
  }
];

export const HomeDeliveryMedicineView: React.FC<HomeDeliveryMedicineViewProps> = ({
  medicines,
  onBack,
  initialPreselectedMedId = null
}) => {
  const [activeTab, setActiveTab] = useState<'order' | 'tracking' | 'history'>('tracking');
  const [orders, setOrders] = useState<HomeDeliveryOrder[]>(INITIAL_ORDERS);
  const [selectedOrderId, setSelectedOrderId] = useState<string>(INITIAL_ORDERS[0]?.id || '');
  
  // New Order Form State
  const [shopMode, setShopMode] = useState<'nearby' | 'custom'>('nearby');
  const [selectedShopId, setSelectedShopId] = useState<string>(NEARBY_SHOPS[0].id);
  
  // Custom Shop fields
  const [customShopName, setCustomShopName] = useState<string>('Shree Balaji Medical & General Stores');
  const [customShopAddress, setCustomShopAddress] = useState<string>('Shop No. 4, Near Gokhale Chowk, Pune 411004');
  const [customShopPhone, setCustomShopPhone] = useState<string>('+91 98230 45678');
  const [customShopLicense, setCustomShopLicense] = useState<string>('MH-PUN-104928B (Local Chemist)');

  // Selected medicines for refill delivery
  const [selectedMedIds, setSelectedMedIds] = useState<string[]>(() => {
    if (initialPreselectedMedId) {
      return [initialPreselectedMedId];
    }
    // Default to active non-suspected medicines
    return medicines
      .filter((m) => m.status === 'active' && !m.isSuspected)
      .slice(0, 3)
      .map((m) => m.id);
  });

  const [courseDuration, setCourseDuration] = useState<'15_days' | '30_days' | '60_days'>('30_days');
  const [deliverySpeed, setDeliverySpeed] = useState<'Express (30-45 mins)' | 'Standard Same-Day' | 'Scheduled Evening Slot'>('Express (30-45 mins)');
  const [paymentMode, setPaymentMode] = useState<'Cash on Delivery (COD)' | 'UPI / QR Scan' | 'Senior Citizen Healthcare Card'>('Cash on Delivery (COD)');
  
  // Delivery address & notes
  const [deliveryAddress, setDeliveryAddress] = useState<string>('Flat 402, Shanti Heights, Shivajinagar, Pune 411005');
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [specialInstructions, setSpecialInstructions] = useState<string>('Elderly patient at home. Please call son Rohan before reaching.');
  const [orderSuccessBanner, setOrderSuccessBanner] = useState<string | null>(null);

  // Active tracking order
  const activeOrder = orders.find((o) => o.id === selectedOrderId) || orders[0];

  // Helper to toggle medicine selection
  const handleToggleMed = (id: string) => {
    setSelectedMedIds((prev) =>
      prev.includes(id) ? prev.filter((mId) => mId !== id) : [...prev, id]
    );
  };

  // Calculate pricing
  const calculateTotal = () => {
    const multiplier = courseDuration === '15_days' ? 0.6 : courseDuration === '60_days' ? 1.9 : 1.0;
    const baseSubtotal = selectedMedIds.length * 85 * multiplier;
    const seniorDiscount = Math.round(baseSubtotal * 0.15);
    const net = Math.max(0, Math.round(baseSubtotal - seniorDiscount));
    return { subtotal: Math.round(baseSubtotal), seniorDiscount, net };
  };

  const { subtotal, seniorDiscount, net } = calculateTotal();

  // Submit new delivery order
  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedMedIds.length === 0) {
      alert('Please select at least one prescribed medicine to deliver.');
      return;
    }

    const chosenShop = shopMode === 'nearby' 
      ? NEARBY_SHOPS.find((s) => s.id === selectedShopId) || NEARBY_SHOPS[0]
      : {
          name: customShopName || 'Local Chemist of Choice',
          address: customShopAddress || 'Shivajinagar, Pune',
          phone: customShopPhone || '+91 98220 00000',
          pharmacistLicense: customShopLicense || 'MH-PUN-LOCAL',
          deliveryTimeEstimate: '35 - 45 mins'
        };

    const orderMeds = medicines
      .filter((m) => selectedMedIds.includes(m.id))
      .map((m) => ({
        id: m.id,
        brandName: m.brandName,
        genericName: m.genericName,
        strength: m.strength,
        quantityCourse: courseDuration === '15_days' ? '15 Days Course' : courseDuration === '60_days' ? '60 Days Course' : '30 Days Course',
        unitPrice: 85
      }));

    const newId = `HD-DEL-${Math.floor(1000 + Math.random() * 9000)}`;
    const randomOtp = `${Math.floor(1000 + Math.random() * 9000)}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newOrder: HomeDeliveryOrder = {
      id: newId,
      patientId: 'PAT-6801',
      patientName: 'Ramesh V. Kulkarni',
      orderDate: 'Today',
      orderTime: nowTime,
      pharmacyType: shopMode,
      pharmacyName: chosenShop.name,
      pharmacyAddress: chosenShop.address,
      pharmacyPhone: chosenShop.phone,
      pharmacistLicense: 'MH-PUN-REGISTERED (Direct e-Rx Verified)',
      deliveryAddress,
      contactPerson: 'Rohan Kulkarni (Son / Caregiver)',
      contactPhone: '+91 98220 12345',
      medicines: orderMeds,
      deliverySpeed,
      paymentMode,
      totalAmount: subtotal,
      seniorDiscountApplied: seniorDiscount,
      netPayable: net,
      status: 'Order Placed',
      riderName: 'Vikram Jadhav',
      riderPhone: '+91 98233 77123',
      riderVehicle: 'Ather 450X MH-12-PQ-9182',
      riderRating: 4.8,
      estimatedDeliveryTime: 'Arriving in ~35 mins',
      deliveryOtp: randomOtp,
      currentStepIndex: 1,
      distanceRemainingKm: 2.3,
      coldChainTempC: 21,
      specialInstructions,
      prescriptionRefId: 'ERX-2026-901',
      timeline: [
        {
          title: 'Order Placed & e-Rx Verified',
          time: nowTime,
          description: `Dispatched to ${chosenShop.name}. Linked to Dr. Ananya Deshmukh's e-Prescription.`,
          completed: true
        },
        {
          title: 'Pharmacist Quality Checked & Packed',
          time: 'In Progress',
          description: 'Pharmacist validating blister pack authenticity & batch dates.',
          completed: false
        },
        {
          title: 'Assigned to Delivery Partner',
          time: 'Upcoming',
          description: 'Rider Vikram Jadhav will collect with cold-chain carrying pack.',
          completed: false
        },
        {
          title: 'Out for Delivery (Rider in Transit)',
          time: 'Upcoming',
          description: 'Live GPS beacon will activate once rider departs shop.',
          completed: false
        },
        {
          title: 'Delivered & OTP Verified',
          time: 'Upcoming',
          description: `Deliver to ${deliveryAddress} with OTP ${randomOtp}.`,
          completed: false
        }
      ]
    };

    setOrders((prev) => [newOrder, ...prev]);
    setSelectedOrderId(newId);
    setOrderSuccessBanner(`Order #${newId} dispatched successfully to ${chosenShop.name}!`);
    setActiveTab('tracking');

    setTimeout(() => {
      setOrderSuccessBanner(null);
    }, 6000);
  };

  // Simulate rider progression for demo / testing
  const handleAdvanceStep = () => {
    if (!activeOrder) return;
    setOrders((prev) =>
      prev.map((ord) => {
        if (ord.id !== activeOrder.id) return ord;
        const nextStep = Math.min(ord.currentStepIndex + 1, 4);
        const updatedTimeline = ord.timeline.map((item, idx) => ({
          ...item,
          completed: idx <= nextStep,
          time: idx === nextStep ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : item.time
        }));
        
        let newStatus: HomeDeliveryOrder['status'] = ord.status;
        let newEta = ord.estimatedDeliveryTime;
        let newDist = ord.distanceRemainingKm;

        if (nextStep === 1) {
          newStatus = 'Prescription Verified';
          newEta = 'Arriving in ~25 mins';
          newDist = 2.0;
        } else if (nextStep === 2) {
          newStatus = 'Dispensing & Cold-Chain Packed';
          newEta = 'Arriving in ~20 mins';
          newDist = 1.6;
        } else if (nextStep === 3) {
          newStatus = 'Out for Delivery';
          newEta = 'Arriving in ~8 mins (400m away)';
          newDist = 0.4;
        } else if (nextStep === 4) {
          newStatus = 'Delivered';
          newEta = 'Delivered at Doorstep';
          newDist = 0;
        }

        return {
          ...ord,
          currentStepIndex: nextStep,
          status: newStatus,
          estimatedDeliveryTime: newEta,
          distanceRemainingKm: newDist,
          timeline: updatedTimeline
        };
      })
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Navigation Bar with Back Button on Left Corner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-3xl border border-sky-200 shadow-xs">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-300 rounded-2xl transition-all shadow-xs flex items-center gap-1.5 font-bold text-xs group shrink-0 active:scale-95"
              title="Back to Prescriptions & Daily Schedule"
            >
              <ArrowLeft className="w-4 h-4 text-sky-600 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back</span>
            </button>
          )}

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                Dispensary Delivery Service
              </span>
              <span className="text-xs text-slate-500 font-mono">Pune City Coverage · e-Rx Verified</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 mt-0.5 flex items-center gap-2">
              <Truck className="w-5 h-5 text-emerald-600" />
              <span>Medicine Home Delivery &amp; Live Tracking</span>
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">
              Order refills directly to your doorstep from verified nearby pharmacy shops or any local chemist of your choice.
            </p>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 self-start sm:self-auto text-xs shrink-0">
          <button
            onClick={() => setActiveTab('order')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'order'
                ? 'bg-white text-emerald-800 shadow-xs border border-emerald-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Plus className="w-3.5 h-3.5 text-emerald-600" />
            <span>Order Delivery</span>
          </button>

          <button
            onClick={() => setActiveTab('tracking')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 relative ${
              activeTab === 'tracking'
                ? 'bg-white text-sky-900 shadow-xs border border-sky-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 text-sky-600" />
            <span>Live Tracking</span>
            {orders.filter((o) => o.status !== 'Delivered').length > 0 && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            )}
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`px-3.5 py-2 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-white text-slate-900 shadow-xs border border-slate-200'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5 text-slate-500" />
            <span>Orders ({orders.length})</span>
          </button>
        </div>
      </div>

      {/* Success Notification Alert */}
      {orderSuccessBanner && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-3xl flex items-center justify-between text-emerald-950 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <span className="text-xs font-bold block">{orderSuccessBanner}</span>
              <span className="text-[11px] text-emerald-700">
                Courier and pharmacist notified. Live tracking route activated below.
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full font-bold">
            Live Dispatch Active
          </span>
        </div>
      )}

      {/* ================= VIEW 1: LIVE TRACKING & GPS DETAILS ================= */}
      {activeTab === 'tracking' && activeOrder && (
        <div className="space-y-6 animate-in fade-in">
          {/* Order Selector (if multiple orders exist) */}
          {orders.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="text-slate-400 font-bold uppercase text-[10px] shrink-0">Switch Order:</span>
              {orders.map((ord) => (
                <button
                  key={ord.id}
                  onClick={() => setSelectedOrderId(ord.id)}
                  className={`px-3 py-1.5 rounded-xl border font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    ord.id === activeOrder.id
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-sky-300'
                  }`}
                >
                  <span>{ord.id}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    ord.status === 'Delivered' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {ord.status}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Top Real-Time Tracking Status Card */}
          <div className="bg-gradient-to-br from-sky-900 via-slate-900 to-blue-950 text-white rounded-3xl p-6 shadow-xl relative overflow-hidden border border-sky-800">
            {/* Background Map Graphic Accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold bg-white/20 text-sky-200 px-2 py-0.5 rounded border border-white/20">
                      TRACKING ID: {activeOrder.id}
                    </span>
                    <span className="text-xs text-sky-300 flex items-center gap-1 font-medium">
                      <Clock className="w-3 h-3" /> Ordered at {activeOrder.orderTime} ({activeOrder.orderDate})
                    </span>
                  </div>
                  <h4 className="text-xl font-black text-white mt-1 flex items-center gap-2">
                    <span>{activeOrder.status}</span>
                    {activeOrder.status !== 'Delivered' && (
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
                    )}
                  </h4>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Source: <strong className="text-white">{activeOrder.pharmacyName}</strong> ➔ Destination: <span className="text-sky-200">{activeOrder.deliveryAddress}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-center">
                    <span className="text-[10px] text-sky-200 uppercase font-bold block">Delivery Security OTP</span>
                    <span className="text-2xl font-mono font-black text-emerald-300 tracking-widest">
                      {activeOrder.deliveryOtp}
                    </span>
                    <span className="text-[9px] text-slate-300 block">Share with rider at door</span>
                  </div>

                  {activeOrder.status !== 'Delivered' && (
                    <button
                      onClick={handleAdvanceStep}
                      className="px-3.5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl text-xs transition-all shadow-lg shadow-emerald-500/30 flex items-center gap-1.5 active:scale-95"
                      title="Simulate courier step progression"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Simulate Rider Step</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Graphical Simulated Route Visualizer */}
              <div className="bg-slate-950/70 p-4 sm:p-5 rounded-2xl border border-white/10 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-sky-400" />
                    <span className="font-bold text-white">{activeOrder.pharmacyName}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-emerald-300 font-bold bg-emerald-950/60 px-3 py-1 rounded-full border border-emerald-500/30">
                    <Navigation className="w-3 h-3 text-emerald-400 animate-spin" />
                    <span>{activeOrder.estimatedDeliveryTime}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-rose-400" />
                    <span className="font-bold text-white">Ramesh Kulkarni (Home)</span>
                  </div>
                </div>

                {/* Progress bar visualizer */}
                <div className="relative pt-2 pb-1">
                  <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-sky-400 via-teal-400 to-emerald-400 transition-all duration-700 relative"
                      style={{
                        width: `${Math.min(100, (activeOrder.currentStepIndex + 1) * 20)}%`
                      }}
                    />
                  </div>

                  {/* Rider Marker pin */}
                  <div
                    className="absolute top-1 transform -translate-x-1/2 transition-all duration-700 flex flex-col items-center"
                    style={{
                      left: `${Math.min(95, Math.max(5, (activeOrder.currentStepIndex + 1) * 20))}%`
                    }}
                  >
                    <div className="w-7 h-7 rounded-full bg-emerald-500 border-2 border-white shadow-md flex items-center justify-center text-slate-950 animate-bounce">
                      <Truck className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Store Dispatched (FC Road)</span>
                  <span>
                    Distance Remaining: <strong className="text-emerald-300">{activeOrder.distanceRemainingKm} km</strong>
                  </span>
                  <span>Doorstep Handover (Shivajinagar)</span>
                </div>
              </div>

              {/* Rider & Safety Monitoring Pill Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {/* Rider Card */}
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                      SP
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-300 block">Delivery Rider</span>
                      <strong className="text-white text-xs block">{activeOrder.riderName}</strong>
                      <span className="text-[10px] text-emerald-300 font-mono flex items-center gap-1">
                        <Star className="w-2.5 h-2.5 fill-emerald-300" /> {activeOrder.riderRating} ★ · {activeOrder.riderVehicle}
                      </span>
                    </div>
                  </div>

                  <a
                    href={`tel:${activeOrder.riderPhone}`}
                    className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition-all shadow-xs flex items-center gap-1 text-[11px] font-bold"
                  >
                    <Phone className="w-3 h-3" />
                    <span>Call</span>
                  </a>
                </div>

                {/* Cold Chain Sensor */}
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 flex items-center justify-center shrink-0">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-300 block">Cold-Chain &amp; Packaging</span>
                    <strong className="text-white text-xs block">{activeOrder.coldChainTempC}°C Safe Range</strong>
                    <span className="text-[10px] text-teal-300">Insulated Blister Pouch OK</span>
                  </div>
                </div>

                {/* Doctor Prescription Link */}
                <div className="bg-white/10 backdrop-blur-md p-3 rounded-2xl border border-white/10 flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-300 border border-sky-500/30 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-300 block">Prescription Authenticity</span>
                    <strong className="text-white text-xs block">{activeOrder.prescriptionRefId}</strong>
                    <span className="text-[10px] text-sky-300">Signed: Dr. Ananya Deshmukh</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stepper Timeline & Package Contents Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Progress Timeline */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2 pb-2 border-b border-slate-100">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Live Delivery Journey ({activeOrder.timeline.filter((t) => t.completed).length} of 5 Completed)</span>
              </h4>

              <div className="relative pl-6 space-y-5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                {activeOrder.timeline.map((step, idx) => (
                  <div key={idx} className="relative group">
                    <div
                      className={`absolute -left-6 top-0.5 w-5 h-5 rounded-full flex items-center justify-center border-2 transition-all ${
                        step.completed
                          ? 'bg-emerald-500 border-white text-white shadow-xs'
                          : idx === activeOrder.currentStepIndex
                          ? 'bg-sky-500 border-white text-white ring-4 ring-sky-100 animate-pulse'
                          : 'bg-white border-slate-300 text-slate-300'
                      }`}
                    >
                      {step.completed ? (
                        <Check className="w-3 h-3 stroke-[3]" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-current" />
                      )}
                    </div>

                    <div>
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-xs font-bold ${
                            step.completed
                              ? 'text-slate-900'
                              : idx === activeOrder.currentStepIndex
                              ? 'text-sky-800'
                              : 'text-slate-400'
                          }`}
                        >
                          {step.title}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">{step.time}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">{step.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Package Contents & Pharmacy Receipt Summary */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>Prescription Items in Pouch ({activeOrder.medicines.length})</span>
                </h4>
                <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  {activeOrder.paymentMode}
                </span>
              </div>

              <div className="divide-y divide-slate-100 text-xs">
                {activeOrder.medicines.map((med, i) => (
                  <div key={i} className="py-2.5 flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-slate-900">{med.brandName}</span>
                        <span className="font-mono text-[10px] bg-sky-50 text-sky-800 px-1.5 py-0.2 rounded font-bold border border-sky-200">
                          {med.strength}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block">{med.genericName}</span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Course: {med.quantityCourse} · Genuine Blister Pack
                      </span>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="font-mono font-bold text-slate-900">₹{med.unitPrice}</span>
                      <span className="text-[10px] text-emerald-600 block">Verified Batch</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Calculation Card */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-1.5 text-xs text-slate-700">
                <div className="flex justify-between">
                  <span>Subtotal MRP:</span>
                  <span className="font-mono">₹{activeOrder.totalAmount}</span>
                </div>
                <div className="flex justify-between text-emerald-700 font-bold">
                  <span>Senior Citizen Waiver / Shop Discount:</span>
                  <span className="font-mono">- ₹{activeOrder.seniorDiscountApplied}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Doorstep Delivery Fee ({activeOrder.deliverySpeed}):</span>
                  <span className="font-mono text-emerald-600 font-bold">FREE (Waived)</span>
                </div>
                <div className="border-t border-slate-200 pt-1.5 flex justify-between font-black text-sm text-slate-900">
                  <span>Net Amount Payable:</span>
                  <span className="font-mono text-emerald-800">₹{activeOrder.netPayable}</span>
                </div>
              </div>

              {/* Pharmacy & Delivery Address Box */}
              <div className="space-y-2 text-xs pt-1 text-slate-600">
                <div className="p-2.5 bg-sky-50/60 rounded-xl border border-sky-100 flex items-start gap-2">
                  <Building2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Fulfilling Pharmacy Shop:</strong>
                    <span>{activeOrder.pharmacyName} · Tel: {activeOrder.pharmacyPhone}</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5 font-mono">{activeOrder.pharmacistLicense}</span>
                  </div>
                </div>

                <div className="p-2.5 bg-amber-50/60 rounded-xl border border-amber-100 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block font-bold">Delivery Address:</strong>
                    <span>{activeOrder.deliveryAddress}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5">
                      Contact: {activeOrder.contactPerson} ({activeOrder.contactPhone})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 2: ORDER NEW HOME DELIVERY ================= */}
      {activeTab === 'order' && (
        <form onSubmit={handlePlaceOrder} className="space-y-6 animate-in fade-in">
          {/* Section 1: Choose Pharmacy Source (Nearby vs Any Local Shop) */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Step 1 of 4
                </span>
                <h4 className="text-sm font-black text-slate-900 mt-1 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-emerald-600" />
                  <span>Select Pharmacy Source: Nearby Shop or Any Chemist of Your Choice</span>
                </h4>
              </div>

              {/* Mode switch pills */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-2xl border border-slate-200 text-xs shrink-0">
                <button
                  type="button"
                  onClick={() => setShopMode('nearby')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    shopMode === 'nearby'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Nearby Certified Shops</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShopMode('custom')}
                  className={`px-3 py-1.5 rounded-xl font-bold transition-all flex items-center gap-1.5 ${
                    shopMode === 'custom'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Any Shop of Choice</span>
                </button>
              </div>
            </div>

            {/* If Nearby Shops is active */}
            {shopMode === 'nearby' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {NEARBY_SHOPS.map((shop) => {
                  const isSelected = selectedShopId === shop.id;
                  return (
                    <div
                      key={shop.id}
                      onClick={() => setSelectedShopId(shop.id)}
                      className={`p-4 rounded-2xl border-2 cursor-pointer transition-all space-y-2 text-xs relative ${
                        isSelected
                          ? 'border-emerald-500 bg-emerald-50/40 shadow-sm'
                          : 'border-slate-200 hover:border-emerald-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">{shop.name}</span>
                            {shop.badge && (
                              <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                                {shop.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-slate-500 text-[11px] mt-0.5">{shop.address}</p>
                        </div>

                        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 border-emerald-500 bg-white">
                          {isSelected && <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />}
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-[11px] pt-1">
                        <span className="bg-slate-100 text-slate-700 font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Navigation className="w-3 h-3 text-emerald-600" />
                          {shop.distanceKm} km away
                        </span>
                        <span className="bg-sky-50 text-sky-800 font-bold px-2 py-0.5 rounded-md flex items-center gap-1 border border-sky-200">
                          <Clock className="w-3 h-3 text-sky-600" />
                          {shop.deliveryTimeEstimate}
                        </span>
                        <span className="text-amber-700 font-bold flex items-center gap-1">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" /> {shop.rating} ({shop.reviewsCount}+)
                        </span>
                      </div>

                      {shop.discountOffer && (
                        <div className="text-[11px] text-emerald-800 bg-emerald-100/70 px-2 py-1 rounded-lg font-bold flex items-center gap-1.5">
                          <Sparkles className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{shop.discountOffer}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* If Any Shop of Choice is active */}
            {shopMode === 'custom' && (
              <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-900">
                  <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Order from Any Local Shop / Chemist:</strong> Enter the name and address or contact number of your family chemist. Our delivery agent will pickup your e-Rx medicines directly from that shop!
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Pharmacy / Chemist Shop Name *
                    </label>
                    <input
                      type="text"
                      value={customShopName}
                      onChange={(e) => setCustomShopName(e.target.value)}
                      placeholder="e.g., Shree Balaji Medical Stores"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-hidden font-medium"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-800 mb-1">
                      Shop Phone Number (Optional for order coordination)
                    </label>
                    <input
                      type="text"
                      value={customShopPhone}
                      onChange={(e) => setCustomShopPhone(e.target.value)}
                      placeholder="e.g., +91 98230 45678"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-hidden font-medium"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      Shop Address / Landmark *
                    </label>
                    <input
                      type="text"
                      value={customShopAddress}
                      onChange={(e) => setCustomShopAddress(e.target.value)}
                      placeholder="e.g., Shop No. 4, Near Gokhale Chowk, Pune 411004"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-hidden font-medium"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block font-bold text-slate-800 mb-1">
                      Chemist Drug License # or Notes (Optional)
                    </label>
                    <input
                      type="text"
                      value={customShopLicense}
                      onChange={(e) => setCustomShopLicense(e.target.value)}
                      placeholder="e.g., MH-PUN-104928B or 'Trusted family chemist for 15 years'"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-hidden font-medium"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Section 2: Select Medicines to Deliver */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Step 2 of 4
                </span>
                <h4 className="text-sm font-black text-slate-900 mt-1 flex items-center gap-2">
                  <Package className="w-4 h-4 text-emerald-600" />
                  <span>Select Active Prescriptions to Deliver ({selectedMedIds.length} Selected)</span>
                </h4>
              </div>

              {/* Course Duration Selector */}
              <div className="flex items-center gap-1 text-xs">
                <span className="text-slate-400 font-bold uppercase text-[10px] mr-1">Duration:</span>
                <button
                  type="button"
                  onClick={() => setCourseDuration('15_days')}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                    courseDuration === '15_days' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  15 Days
                </button>
                <button
                  type="button"
                  onClick={() => setCourseDuration('30_days')}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                    courseDuration === '30_days' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  30 Days (1 Mo)
                </button>
                <button
                  type="button"
                  onClick={() => setCourseDuration('60_days')}
                  className={`px-2.5 py-1 rounded-lg font-bold border transition-all ${
                    courseDuration === '60_days' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-600'
                  }`}
                >
                  60 Days
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {medicines.map((med) => {
                const isSelected = selectedMedIds.includes(med.id);
                const isStopped = med.status === 'stopped' || med.isSuspected;

                return (
                  <div
                    key={med.id}
                    onClick={() => {
                      if (!isStopped) handleToggleMed(med.id);
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition-all space-y-2 text-xs select-none ${
                      isStopped
                        ? 'bg-rose-50/50 border-rose-200 opacity-60 cursor-not-allowed'
                        : isSelected
                        ? 'border-emerald-500 bg-emerald-50/40 shadow-xs cursor-pointer'
                        : 'border-slate-200 hover:border-emerald-200 bg-white cursor-pointer'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-5 h-5 rounded-lg border-2 mt-0.5 flex items-center justify-center shrink-0 ${
                            isStopped
                              ? 'border-rose-300 bg-rose-100 text-rose-500'
                              : isSelected
                              ? 'border-emerald-600 bg-emerald-600 text-white'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-slate-900 text-sm">{med.brandName}</span>
                            <span className="font-mono text-[11px] font-bold bg-sky-100 text-sky-900 px-1.5 py-0.2 rounded">
                              {med.strength}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-500 block">{med.genericName}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            Daily Schedule: {med.frequency}
                          </span>
                        </div>
                      </div>

                      {isStopped ? (
                        <span className="text-[10px] bg-rose-100 text-rose-800 font-bold px-2 py-0.5 rounded-full">
                          ADR Blocked
                        </span>
                      ) : (
                        <span className="text-xs font-mono font-bold text-slate-900">
                          ₹85
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 3: Delivery Address & Caregiver Details */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Step 3 of 4
                </span>
                <h4 className="text-sm font-black text-slate-900 mt-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-600" />
                  <span>Delivery Address &amp; Caregiver Contact</span>
                </h4>
              </div>

              <button
                type="button"
                onClick={() => setIsEditingAddress(!isEditingAddress)}
                className="text-xs font-bold text-sky-700 hover:text-sky-900 underline"
              >
                {isEditingAddress ? 'Save Address' : 'Edit Address'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block font-bold text-slate-800 mb-1">
                  Delivery Destination (Patient Residence) *
                </label>
                {isEditingAddress ? (
                  <textarea
                    rows={2}
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-hidden font-medium"
                    required
                  />
                ) : (
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-800 flex items-center justify-between">
                    <span>{deliveryAddress}</span>
                    <span className="text-[11px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600">
                      Pune 411005
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Primary Contact Person &amp; Phone
                </label>
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 font-medium text-slate-800">
                  Rohan Kulkarni (Son / Caregiver) · +91 98220 12345
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-800 mb-1">
                  Delivery Speed &amp; Priority
                </label>
                <select
                  value={deliverySpeed}
                  onChange={(e) => setDeliverySpeed(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-hidden font-medium"
                >
                  <option value="Express (30-45 mins)">⚡ Express Delivery (Within 35 mins) - Free for Seniors</option>
                  <option value="Standard Same-Day">🚚 Standard Same-Day (Within 2 hours)</option>
                  <option value="Scheduled Evening Slot">🕒 Scheduled Evening Slot (6:00 PM - 8:00 PM)</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block font-bold text-slate-800 mb-1">
                  Special Notes for Rider &amp; Pharmacist
                </label>
                <input
                  type="text"
                  value={specialInstructions}
                  onChange={(e) => setSpecialInstructions(e.target.value)}
                  placeholder="e.g. Ring bell twice, senior citizen patient, hand to Rohan"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl focus:border-emerald-500 focus:outline-hidden font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Payment & Digital e-Rx Checkout */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Step 4 of 4
                </span>
                <h4 className="text-sm font-black text-slate-900 mt-1 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Payment Mode &amp; e-Rx Order Confirmation</span>
                </h4>
              </div>

              <div className="flex items-center gap-2 font-mono text-emerald-700 font-bold bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>e-Rx ERX-2026-901 Linked</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <label
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all space-y-1 block ${
                  paymentMode === 'Cash on Delivery (COD)'
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-200 hover:border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <input
                    type="radio"
                    name="paymentMode"
                    checked={paymentMode === 'Cash on Delivery (COD)'}
                    onChange={() => setPaymentMode('Cash on Delivery (COD)')}
                    className="text-emerald-600"
                  />
                  <span className="font-extrabold text-slate-900">Cash on Delivery</span>
                </div>
                <p className="text-[11px] text-slate-500">Pay cash or scan rider's UPI QR at doorstep.</p>
              </label>

              <label
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all space-y-1 block ${
                  paymentMode === 'UPI / QR Scan'
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-200 hover:border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <input
                    type="radio"
                    name="paymentMode"
                    checked={paymentMode === 'UPI / QR Scan'}
                    onChange={() => setPaymentMode('UPI / QR Scan')}
                    className="text-emerald-600"
                  />
                  <span className="font-extrabold text-slate-900">Instant UPI Payment</span>
                </div>
                <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, or BHIM.</p>
              </label>

              <label
                className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all space-y-1 block ${
                  paymentMode === 'Senior Citizen Healthcare Card'
                    ? 'border-emerald-500 bg-emerald-50/50'
                    : 'border-slate-200 hover:border-emerald-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <input
                    type="radio"
                    name="paymentMode"
                    checked={paymentMode === 'Senior Citizen Healthcare Card'}
                    onChange={() => setPaymentMode('Senior Citizen Healthcare Card')}
                    className="text-emerald-600"
                  />
                  <span className="font-extrabold text-slate-900">Senior Health Card</span>
                </div>
                <p className="text-[11px] text-slate-500">Direct hospital billing via Maharashtra Health Scheme.</p>
              </label>
            </div>

            {/* Price Breakdown Banner */}
            <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/60 p-4 rounded-2xl border border-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-600 block">Total Prescription Refill Value:</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-2xl font-black text-slate-900 font-mono">₹{net}</span>
                  <span className="text-xs line-through text-slate-400 font-mono">₹{subtotal}</span>
                  <span className="text-xs font-bold text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                    Saved ₹{seniorDiscount} (Senior Discount)
                  </span>
                </div>
                <span className="text-[11px] text-slate-500 block mt-0.5">
                  Includes {selectedMedIds.length} medicine courses + express packaging with verified e-Rx copy.
                </span>
              </div>

              <button
                type="submit"
                disabled={selectedMedIds.length === 0}
                className="px-6 py-3.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-black rounded-2xl text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
              >
                <Truck className="w-5 h-5" />
                <span>Confirm &amp; Dispatch Home Delivery</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ================= VIEW 3: ORDER HISTORY & INVOICES ================= */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Previous Prescription Delivery Orders ({orders.length})</span>
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Full record of dispensed medicines, delivering pharmacies, and digital invoices.
              </p>
            </div>

            <button
              onClick={() => setActiveTab('order')}
              className="px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold border border-emerald-300 rounded-xl text-xs transition-all flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-600" />
              <span>Order New Delivery</span>
            </button>
          </div>

          <div className="space-y-3.5">
            {orders.map((ord) => (
              <div
                key={ord.id}
                className="p-4 rounded-2xl border border-slate-200 hover:border-sky-300 transition-all space-y-3 text-xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900 text-sm">{ord.id}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {ord.status}
                    </span>
                    <span className="text-slate-400">·</span>
                    <span className="text-slate-500 font-medium">
                      {ord.orderDate} at {ord.orderTime}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedOrderId(ord.id);
                        setActiveTab('tracking');
                      }}
                      className="px-3 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold rounded-lg border border-sky-200 transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <Navigation className="w-3 h-3 text-sky-600" />
                      <span>Track Status</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-slate-600">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Pharmacy Shop:</span>
                    <strong className="text-slate-900 block">{ord.pharmacyName}</strong>
                    <span className="text-[11px] text-slate-500">{ord.pharmacyAddress}</span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Medicines Dispensed:</span>
                    <span className="text-slate-900 font-medium">
                      {ord.medicines.map((m) => `${m.brandName} (${m.strength})`).join(', ')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment &amp; OTP:</span>
                    <span className="text-slate-900 font-bold">₹{ord.netPayable} via {ord.paymentMode}</span>
                    <span className="text-[10px] font-mono text-emerald-700 block font-bold">
                      Delivery OTP: {ord.deliveryOtp}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
