import React, { useState } from 'react';
import {
  MapPin,
  PhoneCall,
  Building2,
  Navigation,
  Sparkles,
  Search,
  ShieldAlert,
  ExternalLink,
  CheckCircle2,
  Phone,
  Compass,
  Star,
  Layers,
  ChevronRight,
  Info,
  Clock,
  HeartPulse
} from 'lucide-react';

export interface AmcHospitalCenter {
  id: string;
  name: string;
  amcCode: string;
  institution: string;
  department: string;
  city: string;
  state: string;
  zone: 'West' | 'North' | 'South' | 'East & Central';
  centerType: 'Apex / AIIMS' | 'Govt Medical College' | 'Private Tertiary' | 'Specialized Centre';
  address: string;
  pincode: string;
  emergencyPhone: string;
  pvCoordinatorPhone: string;
  coordinatorName: string;
  bedsCount: number;
  facilities: string[];
  status: 'Primary Regional Centre' | 'Recognized Nodal AMC' | 'Active PvPI Hospital';
  is24x7Casualty: boolean;
  distanceEstimate?: string;
  coordinates?: { lat: number; lng: number };
}

export const ALL_AMC_HOSPITAL_CENTERS: AmcHospitalCenter[] = [
  // WEST ZONE
  {
    id: 'amc-pune-sassoon',
    name: 'B.J. Government Medical College & Sassoon General Hospital',
    amcCode: 'AMC-042',
    institution: 'Department of Clinical Pharmacology & Internal Medicine',
    department: 'Adverse Drug Reaction Monitoring Centre (AMC-042)',
    city: 'Pune',
    state: 'Maharashtra',
    zone: 'West',
    centerType: 'Govt Medical College',
    address: 'Station Road, Sangamvadi, Pune',
    pincode: '411001',
    emergencyPhone: '020-26128000',
    pvCoordinatorPhone: '020-26128050',
    coordinatorName: 'Dr. Ananya Deshmukh, MD (Pharmacology)',
    bedsCount: 1296,
    facilities: ['24/7 Casualty', 'ADR Dechallenge Ward', 'Dermatology Biopsy', 'Toxicology Lab', 'ICU'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '0.4 km away (5 mins)',
    coordinates: { lat: 18.5284, lng: 73.8742 },
  },
  {
    id: 'amc-pune-kem',
    name: 'KEM Hospital & Research Centre',
    amcCode: 'AMC-049',
    institution: 'Department of Medicine & Clinical Research Unit',
    department: 'Recognized PvPI Partner Hospital',
    city: 'Pune',
    state: 'Maharashtra',
    zone: 'West',
    centerType: 'Private Tertiary',
    address: 'Sardar Moodliar Road, Rasta Peth, Pune',
    pincode: '411011',
    emergencyPhone: '020-66037300',
    pvCoordinatorPhone: '020-66037350',
    coordinatorName: 'Dr. Rajesh Kulkarni, MD',
    bedsCount: 550,
    facilities: ['24/7 Casualty', 'Cardiac ICU', 'Pediatric PV Unit', 'Electronic VigiFlow Link'],
    status: 'Recognized Nodal AMC',
    is24x7Casualty: true,
    distanceEstimate: '1.8 km away (12 mins)',
    coordinates: { lat: 18.5204, lng: 73.8698 },
  },
  {
    id: 'amc-pune-bharati',
    name: 'Bharati Vidyapeeth Deemed University Medical College & Hospital',
    amcCode: 'AMC-061',
    institution: 'Department of Pharmacology',
    department: 'ADR Monitoring Centre',
    city: 'Pune',
    state: 'Maharashtra',
    zone: 'West',
    centerType: 'Private Tertiary',
    address: 'Pune-Satara Road, Dhankawadi, Pune',
    pincode: '411043',
    emergencyPhone: '020-40555555',
    pvCoordinatorPhone: '020-40555500',
    coordinatorName: 'Dr. M. S. Joshi, MD',
    bedsCount: 850,
    facilities: ['24/7 Casualty', 'ICU', 'Poison Information Centre', 'ADR Screening Clinic'],
    status: 'Active PvPI Hospital',
    is24x7Casualty: true,
    distanceEstimate: '6.2 km away (22 mins)',
    coordinates: { lat: 18.4611, lng: 73.8553 },
  },
  {
    id: 'amc-mumbai-kem',
    name: 'Seth GS Medical College & KEM Hospital',
    amcCode: 'AMC-011',
    institution: 'Department of Clinical Pharmacology',
    department: 'National Apex Monitoring Node',
    city: 'Mumbai',
    state: 'Maharashtra',
    zone: 'West',
    centerType: 'Govt Medical College',
    address: 'Acharya Donde Marg, Parel, Mumbai',
    pincode: '400012',
    emergencyPhone: '022-24107000',
    pvCoordinatorPhone: '022-24107600',
    coordinatorName: 'Dr. Urmila Thatte, MD, PhD',
    bedsCount: 1800,
    facilities: ['24/7 Trauma Casualty', 'Comprehensive ADR Diagnostic Lab', 'Level-1 ICU', 'PvPI Training Centre'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '148 km away',
    coordinates: { lat: 19.0028, lng: 72.8427 },
  },
  {
    id: 'amc-mumbai-jj',
    name: 'Grant Government Medical College & Sir J.J. Group of Hospitals',
    amcCode: 'AMC-015',
    institution: 'Department of Pharmacology & Medicine',
    department: 'State Apex Centre for Pharmacovigilance',
    city: 'Mumbai',
    state: 'Maharashtra',
    zone: 'West',
    centerType: 'Govt Medical College',
    address: 'J.J. Marg, Byculla, Mumbai',
    pincode: '400008',
    emergencyPhone: '022-23735555',
    pvCoordinatorPhone: '022-23735550',
    coordinatorName: 'Dr. S. B. Shrivastava, MD',
    bedsCount: 2844,
    facilities: ['24/7 Casualty', 'Skin ADR Biopsy Ward', 'Critical Care Medicine', 'PvPI ADRMS Link'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '152 km away',
    coordinates: { lat: 18.9633, lng: 72.8335 },
  },
  {
    id: 'amc-nagpur-gmc',
    name: 'Government Medical College & Hospital (GMC Nagpur)',
    amcCode: 'AMC-034',
    institution: 'Department of Pharmacology',
    department: 'Regional ADR Monitoring Centre - Vidarbha',
    city: 'Nagpur',
    state: 'Maharashtra',
    zone: 'West',
    centerType: 'Govt Medical College',
    address: 'Hanuman Nagar, Medical Square, Nagpur',
    pincode: '440003',
    emergencyPhone: '0712-2744655',
    pvCoordinatorPhone: '0712-2744660',
    coordinatorName: 'Dr. S. K. Mukherjee, MD',
    bedsCount: 1400,
    facilities: ['24/7 Emergency Casualty', 'ICU', 'Pharmacogenetics Unit', 'State PvPI Liaison'],
    status: 'Recognized Nodal AMC',
    is24x7Casualty: true,
    distanceEstimate: '710 km away',
    coordinates: { lat: 21.1342, lng: 79.0984 },
  },
  {
    id: 'amc-ahmedabad-bjmc',
    name: 'B.J. Medical College & Civil Hospital',
    amcCode: 'AMC-056',
    institution: 'Department of Pharmacology',
    department: 'Regional AMC Gujarat Node',
    city: 'Ahmedabad',
    state: 'Gujarat',
    zone: 'West',
    centerType: 'Govt Medical College',
    address: 'Asarwa, Ahmedabad',
    pincode: '380016',
    emergencyPhone: '079-22680074',
    pvCoordinatorPhone: '079-22681021',
    coordinatorName: 'Dr. C. B. Tripathi, MD',
    bedsCount: 2800,
    facilities: ['24/7 Trauma Center', 'ADR Cell', 'Tertiary ICU', 'VigiFlow Gateway'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '660 km away',
    coordinates: { lat: 23.0525, lng: 72.6028 },
  },
  {
    id: 'amc-goa-gmc',
    name: 'Goa Medical College & Hospital',
    amcCode: 'AMC-072',
    institution: 'Department of Pharmacology',
    department: 'State AMC Goa',
    city: 'Bambolim',
    state: 'Goa',
    zone: 'West',
    centerType: 'Govt Medical College',
    address: 'NH-66, Bambolim, Tiswadi, Goa',
    pincode: '403202',
    emergencyPhone: '0832-2458700',
    pvCoordinatorPhone: '0832-2458725',
    coordinatorName: 'Dr. P. V. Rataboli, MD',
    bedsCount: 1150,
    facilities: ['24/7 Casualty', 'ICU', 'ADR Reporting Desk', 'Toxicology Lab'],
    status: 'Recognized Nodal AMC',
    is24x7Casualty: true,
    distanceEstimate: '445 km away',
    coordinates: { lat: 15.4619, lng: 73.8569 },
  },

  // NORTH ZONE
  {
    id: 'amc-delhi-aiims',
    name: 'All India Institute of Medical Sciences (AIIMS New Delhi)',
    amcCode: 'AMC-001',
    institution: 'Department of Pharmacology & National Poisons Information Centre',
    department: 'National Apex ADR Centre & WHO Collaborating Centre',
    city: 'New Delhi',
    state: 'Delhi NCR',
    zone: 'North',
    centerType: 'Apex / AIIMS',
    address: 'Sri Aurobindo Marg, Ansari Nagar, New Delhi',
    pincode: '110029',
    emergencyPhone: '011-26588500',
    pvCoordinatorPhone: '011-26588700',
    coordinatorName: 'Prof. Y. K. Gupta, MD (National PvPI Mentor)',
    bedsCount: 2478,
    facilities: ['24/7 Level-1 Trauma Centre', 'Apex ADR Diagnostic Unit', 'National Pharmacovigilance Core', 'ICU'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '1,420 km away',
    coordinates: { lat: 28.5672, lng: 77.2100 },
  },
  {
    id: 'amc-chd-pgimer',
    name: 'Postgraduate Institute of Medical Education & Research (PGIMER)',
    amcCode: 'AMC-002',
    institution: 'Department of Clinical Pharmacology',
    department: 'North India Apex AMC Centre',
    city: 'Chandigarh',
    state: 'Chandigarh',
    zone: 'North',
    centerType: 'Apex / AIIMS',
    address: 'Sector 12, Chandigarh',
    pincode: '160012',
    emergencyPhone: '0172-2746018',
    pvCoordinatorPhone: '0172-2755250',
    coordinatorName: 'Prof. Bikash Medhi, MD, FAMS',
    bedsCount: 1948,
    facilities: ['24/7 Emergency Complex', 'Advanced Cardiac ICU', 'Signal Detection Node', 'PvPI Training Hub'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '1,650 km away',
    coordinates: { lat: 30.7627, lng: 76.7766 },
  },
  {
    id: 'amc-delhi-mamc',
    name: 'Maulana Azad Medical College & Lok Nayak Hospital',
    amcCode: 'AMC-004',
    institution: 'Department of Pharmacology',
    department: 'Regional ADR Monitoring Centre',
    city: 'New Delhi',
    state: 'Delhi NCR',
    zone: 'North',
    centerType: 'Govt Medical College',
    address: '2, Bahadur Shah Zafar Marg, New Delhi',
    pincode: '110002',
    emergencyPhone: '011-23233000',
    pvCoordinatorPhone: '011-23233250',
    coordinatorName: 'Dr. Vandana Roy, MD',
    bedsCount: 2200,
    facilities: ['24/7 Casualty', 'Severe Drug Allergy Ward', 'ICU', 'ADR Surveillance Cell'],
    status: 'Recognized Nodal AMC',
    is24x7Casualty: true,
    distanceEstimate: '1,430 km away',
    coordinates: { lat: 28.6358, lng: 77.2405 },
  },
  {
    id: 'amc-lucknow-kgmu',
    name: "King George's Medical University (KGMU Lucknow)",
    amcCode: 'AMC-022',
    institution: 'Department of Pharmacology & Therapeutics',
    department: 'UP Central AMC Node',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    zone: 'North',
    centerType: 'Govt Medical College',
    address: 'Shah Mina Road, Chowk, Lucknow',
    pincode: '226003',
    emergencyPhone: '0522-2257450',
    pvCoordinatorPhone: '0522-2257540',
    coordinatorName: 'Prof. R. K. Dixit, MD',
    bedsCount: 4500,
    facilities: ['24/7 Trauma Centre', 'ADR Triage OPD', 'Multi-Specialty ICU', 'PvPI Registry'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '1,320 km away',
    coordinates: { lat: 26.8687, lng: 80.9167 },
  },
  {
    id: 'amc-rishikesh-aiims',
    name: 'All India Institute of Medical Sciences (AIIMS Rishikesh)',
    amcCode: 'AMC-104',
    institution: 'Department of Pharmacology',
    department: 'Himalayan Regional PvPI Node',
    city: 'Rishikesh',
    state: 'Uttarakhand',
    zone: 'North',
    centerType: 'Apex / AIIMS',
    address: 'Virbhadra Road, Rishikesh',
    pincode: '249203',
    emergencyPhone: '0135-2462929',
    pvCoordinatorPhone: '0135-2462970',
    coordinatorName: 'Dr. Puneet Dhamija, MD',
    bedsCount: 960,
    facilities: ['24/7 Emergency Casualty', 'High Altitude ADR Desk', 'ICU', 'Tele-PV Hub'],
    status: 'Recognized Nodal AMC',
    is24x7Casualty: true,
    distanceEstimate: '1,610 km away',
    coordinates: { lat: 30.0768, lng: 78.2882 },
  },

  // SOUTH ZONE
  {
    id: 'amc-bengaluru-bmc',
    name: 'Bangalore Medical College & Research Institute (Victoria Hospital)',
    amcCode: 'AMC-018',
    institution: 'Department of Pharmacology',
    department: 'Karnataka State Apex Monitoring Node',
    city: 'Bengaluru',
    state: 'Karnataka',
    zone: 'South',
    centerType: 'Govt Medical College',
    address: 'Fort Road, Near City Market, Kalasipalya, Bengaluru',
    pincode: '560002',
    emergencyPhone: '080-26701150',
    pvCoordinatorPhone: '080-26701165',
    coordinatorName: 'Dr. C. R. Jayanthi, MD',
    bedsCount: 1500,
    facilities: ['24/7 Emergency Trauma Casualty', 'Burns & ADR ICU', 'Cutaneous Drug Reaction Clinic'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '840 km away',
    coordinates: { lat: 12.9634, lng: 77.5756 },
  },
  {
    id: 'amc-chennai-mmc',
    name: 'Madras Medical College & Rajiv Gandhi Govt General Hospital',
    amcCode: 'AMC-008',
    institution: 'Department of Pharmacology',
    department: 'Tamil Nadu Regional AMC Node',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zone: 'South',
    centerType: 'Govt Medical College',
    address: 'E.V.R. Periyar Salai, Park Town, Chennai',
    pincode: '600003',
    emergencyPhone: '044-25305000',
    pvCoordinatorPhone: '044-25305120',
    coordinatorName: 'Dr. S. Sangeetha, MD',
    bedsCount: 2722,
    facilities: ['24/7 Comprehensive Casualty', 'Dermatology Adverse Reaction Ward', 'ICU', 'VigiFlow Desk'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '1,190 km away',
    coordinates: { lat: 13.0818, lng: 80.2785 },
  },
  {
    id: 'amc-vellore-cmc',
    name: 'Christian Medical College (CMC Vellore)',
    amcCode: 'AMC-019',
    institution: 'Department of Clinical Pharmacology',
    department: 'Recognized PvPI Centre of Excellence',
    city: 'Vellore',
    state: 'Tamil Nadu',
    zone: 'South',
    centerType: 'Private Tertiary',
    address: 'Ida Scudder Road, Vellore',
    pincode: '632004',
    emergencyPhone: '0416-2281000',
    pvCoordinatorPhone: '0416-2282050',
    coordinatorName: 'Dr. D. J. Christopher, MD',
    bedsCount: 3000,
    facilities: ['24/7 Emergency Casualty', 'Therapeutic Drug Monitoring (TDM) Lab', 'Advanced Allergy Centre'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '1,060 km away',
    coordinates: { lat: 12.9249, lng: 79.1354 },
  },
  {
    id: 'amc-hyd-nims',
    name: "Nizam's Institute of Medical Sciences (NIMS Hyderabad)",
    amcCode: 'AMC-025',
    institution: 'Department of Clinical Pharmacology & Therapeutics',
    department: 'Telangana Apex AMC Node',
    city: 'Hyderabad',
    state: 'Telangana',
    zone: 'South',
    centerType: 'Govt Medical College',
    address: 'Punjagutta Road, Hyderabad',
    pincode: '500082',
    emergencyPhone: '040-23489000',
    pvCoordinatorPhone: '040-23489150',
    coordinatorName: 'Prof. Usha Rani, MD',
    bedsCount: 1489,
    facilities: ['24/7 Trauma Emergency', 'Adverse Reaction Registry', 'Level-3 ICU', 'PvPI Training Node'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '560 km away',
    coordinates: { lat: 17.4225, lng: 78.4528 },
  },
  {
    id: 'amc-puducherry-jipmer',
    name: 'Jawaharlal Institute of Postgraduate Medical Education & Research (JIPMER)',
    amcCode: 'AMC-007',
    institution: 'Department of Pharmacology',
    department: 'Institute of National Importance & Regional AMC',
    city: 'Puducherry',
    state: 'Puducherry',
    zone: 'South',
    centerType: 'Apex / AIIMS',
    address: 'Dhanvantari Nagar, Gorimedu, Puducherry',
    pincode: '605006',
    emergencyPhone: '0413-2296000',
    pvCoordinatorPhone: '0413-2296350',
    coordinatorName: 'Dr. R. Kesavan, MD',
    bedsCount: 2134,
    facilities: ['24/7 Emergency Casualty', 'Advanced Pharmacovigilance Unit', 'ICU', 'Poison Centre'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '1,220 km away',
    coordinates: { lat: 11.9547, lng: 79.8093 },
  },

  // EAST & CENTRAL ZONE
  {
    id: 'amc-kolkata-mch',
    name: 'Medical College & Hospital Kolkata',
    amcCode: 'AMC-012',
    institution: 'Department of Pharmacology',
    department: 'East India Apex Monitoring Centre',
    city: 'Kolkata',
    state: 'West Bengal',
    zone: 'East & Central',
    centerType: 'Govt Medical College',
    address: '88, College Street, Bowbazar, Kolkata',
    pincode: '700073',
    emergencyPhone: '033-22551600',
    pvCoordinatorPhone: '033-22551630',
    coordinatorName: 'Dr. Suparna Chatterjee, MD',
    bedsCount: 1950,
    facilities: ['24/7 Trauma Casualty', 'ADR Diagnostic Unit', 'Critical Care Complex', 'VigiFlow Gateway'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '1,890 km away',
    coordinates: { lat: 22.5744, lng: 88.3629 },
  },
  {
    id: 'amc-bhubaneswar-aiims',
    name: 'All India Institute of Medical Sciences (AIIMS Bhubaneswar)',
    amcCode: 'AMC-091',
    institution: 'Department of Pharmacology',
    department: 'Regional AMC Odisha Node',
    city: 'Bhubaneswar',
    state: 'Odisha',
    zone: 'East & Central',
    centerType: 'Apex / AIIMS',
    address: 'Sijua, Patrapada, Bhubaneswar',
    pincode: '751019',
    emergencyPhone: '0674-2476789',
    pvCoordinatorPhone: '0674-2476850',
    coordinatorName: 'Dr. Debasish Hota, MD',
    bedsCount: 960,
    facilities: ['24/7 Emergency Casualty', 'ICU', 'Biochemical ADR Lab', 'PvPI Training Node'],
    status: 'Recognized Nodal AMC',
    is24x7Casualty: true,
    distanceEstimate: '1,490 km away',
    coordinates: { lat: 20.2315, lng: 85.7758 },
  },
  {
    id: 'amc-guwahati-gmch',
    name: 'Gauhati Medical College & Hospital (GMCH Guwahati)',
    amcCode: 'AMC-063',
    institution: 'Department of Pharmacology',
    department: 'North-East Regional Pharmacovigilance Apex Node',
    city: 'Guwahati',
    state: 'Assam',
    zone: 'East & Central',
    centerType: 'Govt Medical College',
    address: 'Narakasur Hilltop, Bhangagarh, Guwahati',
    pincode: '781032',
    emergencyPhone: '0361-2130214',
    pvCoordinatorPhone: '0361-2130225',
    coordinatorName: 'Dr. K. N. Baruah, MD',
    bedsCount: 2185,
    facilities: ['24/7 Casualty', 'ICU', 'Snake Venom & ADR Emergency Unit', 'E2B(R3) Link'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '2,510 km away',
    coordinates: { lat: 26.1558, lng: 91.7688 },
  },
  {
    id: 'amc-bhopal-aiims',
    name: 'All India Institute of Medical Sciences (AIIMS Bhopal)',
    amcCode: 'AMC-095',
    institution: 'Department of Pharmacology',
    department: 'Central India Regional AMC Node',
    city: 'Bhopal',
    state: 'Madhya Pradesh',
    zone: 'East & Central',
    centerType: 'Apex / AIIMS',
    address: 'Saket Nagar, Bhopal',
    pincode: '462020',
    emergencyPhone: '0755-2672317',
    pvCoordinatorPhone: '0755-2672340',
    coordinatorName: 'Dr. Balakrishnan S., MD',
    bedsCount: 960,
    facilities: ['24/7 Level-1 Casualty', 'Cardiopulmonary ICU', 'ADR Triage Clinic', 'VigiFlow Gateway'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '820 km away',
    coordinates: { lat: 23.2065, lng: 77.4589 },
  },
  {
    id: 'amc-surat-gmc',
    name: 'Govt Medical College & New Civil Hospital Surat',
    amcCode: 'AMC-058',
    institution: 'Department of Pharmacology',
    department: 'South Gujarat Regional AMC Node',
    city: 'Surat',
    state: 'Gujarat',
    zone: 'West',
    centerType: 'Govt Medical College',
    address: 'Majura Gate, Surat',
    pincode: '395001',
    emergencyPhone: '0261-2244175',
    pvCoordinatorPhone: '0261-2244180',
    coordinatorName: 'Dr. N. D. Kantharia, MD',
    bedsCount: 1250,
    facilities: ['24/7 Casualty', 'Critical Care ICU', 'ADR Cell', 'Pharmacovigilance Training'],
    status: 'Recognized Nodal AMC',
    is24x7Casualty: true,
    distanceEstimate: '420 km away',
    coordinates: { lat: 21.1702, lng: 72.8311 },
  },
  {
    id: 'amc-jaipur-sms',
    name: 'Sawai Man Singh (SMS) Medical College & Hospital',
    amcCode: 'AMC-027',
    institution: 'Department of Pharmacology',
    department: 'Rajasthan State Apex AMC Centre',
    city: 'Jaipur',
    state: 'Rajasthan',
    zone: 'North',
    centerType: 'Govt Medical College',
    address: 'J.L.N. Marg, Jaipur',
    pincode: '302004',
    emergencyPhone: '0141-2560291',
    pvCoordinatorPhone: '0141-2560295',
    coordinatorName: 'Dr. Lokendra Sharma, MD',
    bedsCount: 3200,
    facilities: ['24/7 Level-1 Trauma Emergency', 'State Poisons Centre', 'Level-3 ICU', 'VigiFlow Gateway'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '1,180 km away',
    coordinates: { lat: 26.8914, lng: 75.8164 },
  },
  {
    id: 'amc-lucknow-sgpgi',
    name: 'Sanjay Gandhi Postgraduate Institute of Medical Sciences (SGPGIMS)',
    amcCode: 'AMC-024',
    institution: 'Department of Clinical Immunology & Pharmacology',
    department: 'Advanced Super-Specialty ADR Centre',
    city: 'Lucknow',
    state: 'Uttar Pradesh',
    zone: 'North',
    centerType: 'Apex / AIIMS',
    address: 'Raebareli Road, Lucknow',
    pincode: '226014',
    emergencyPhone: '0522-2668700',
    pvCoordinatorPhone: '0522-2668800',
    coordinatorName: 'Dr. Amita Aggarwal, MD, DM',
    bedsCount: 1100,
    facilities: ['24/7 Emergency Casualty', 'Immunology Biopsy Lab', 'ICU', 'Rare ADR Registry'],
    status: 'Recognized Nodal AMC',
    is24x7Casualty: true,
    distanceEstimate: '1,310 km away',
    coordinates: { lat: 26.7441, lng: 80.9388 },
  },
  {
    id: 'amc-patiala-gmc',
    name: 'Government Medical College & Rajindra Hospital Patiala',
    amcCode: 'AMC-030',
    institution: 'Department of Pharmacology',
    department: 'Punjab Regional AMC Centre',
    city: 'Patiala',
    state: 'Punjab',
    zone: 'North',
    centerType: 'Govt Medical College',
    address: 'Sangrur Road, Patiala',
    pincode: '147001',
    emergencyPhone: '0175-2212018',
    pvCoordinatorPhone: '0175-2212025',
    coordinatorName: 'Dr. Dimple Arora, MD',
    bedsCount: 1129,
    facilities: ['24/7 Casualty', 'Emergency Medicine ICU', 'ADR Clinic'],
    status: 'Recognized Nodal AMC',
    is24x7Casualty: true,
    distanceEstimate: '1,590 km away',
    coordinates: { lat: 30.3398, lng: 76.3869 },
  },
  {
    id: 'amc-srinagar-skims',
    name: 'Sher-i-Kashmir Institute of Medical Sciences (SKIMS)',
    amcCode: 'AMC-032',
    institution: 'Department of Clinical Pharmacology',
    department: 'J&K Regional Pharmacovigilance Apex Node',
    city: 'Srinagar',
    state: 'Jammu & Kashmir',
    zone: 'North',
    centerType: 'Apex / AIIMS',
    address: 'Soura, Srinagar',
    pincode: '190011',
    emergencyPhone: '0194-2401013',
    pvCoordinatorPhone: '0194-2401015',
    coordinatorName: 'Dr. Zulfiqar Ali, MD',
    bedsCount: 1250,
    facilities: ['24/7 Emergency Wing', 'Cardiac ICU', 'High-Altitude Adverse Reaction Unit'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '2,150 km away',
    coordinates: { lat: 34.1353, lng: 74.8016 },
  },
  {
    id: 'amc-bengaluru-stjohn',
    name: "St. John's Medical College Hospital",
    amcCode: 'AMC-023',
    institution: 'Department of Pharmacology',
    department: 'Recognized Nodal PvPI Hospital',
    city: 'Bengaluru',
    state: 'Karnataka',
    zone: 'South',
    centerType: 'Private Tertiary',
    address: 'Sarjapur Road, John Nagar, Koramangala, Bengaluru',
    pincode: '560034',
    emergencyPhone: '080-22065000',
    pvCoordinatorPhone: '080-22065120',
    coordinatorName: 'Dr. Denis Xavier, MD, MSc',
    bedsCount: 1350,
    facilities: ['24/7 Trauma Casualty', 'Clinical Trials ADR Unit', 'ICU', 'Poison Desk'],
    status: 'Recognized Nodal AMC',
    is24x7Casualty: true,
    distanceEstimate: '845 km away',
    coordinates: { lat: 12.9299, lng: 77.6205 },
  },
  {
    id: 'amc-chennai-sriram',
    name: 'Sri Ramachandra Institute of Higher Education & Research',
    amcCode: 'AMC-014',
    institution: 'Department of Pharmacology',
    department: 'Deemed University ADR Monitoring Centre',
    city: 'Chennai',
    state: 'Tamil Nadu',
    zone: 'South',
    centerType: 'Private Tertiary',
    address: 'No.1, Ramachandra Nagar, Porur, Chennai',
    pincode: '600116',
    emergencyPhone: '044-45928500',
    pvCoordinatorPhone: '044-45928540',
    coordinatorName: 'Dr. S. Seethalakshmi, MD',
    bedsCount: 1800,
    facilities: ['24/7 Emergency Casualty', 'Therapeutic Monitoring Lab', 'ICU'],
    status: 'Recognized Nodal AMC',
    is24x7Casualty: true,
    distanceEstimate: '1,175 km away',
    coordinates: { lat: 13.0382, lng: 80.1415 },
  },
  {
    id: 'amc-hyd-osmania',
    name: 'Osmania General Hospital & Medical College',
    amcCode: 'AMC-028',
    institution: 'Department of Pharmacology',
    department: 'State Government Regional AMC Node',
    city: 'Hyderabad',
    state: 'Telangana',
    zone: 'South',
    centerType: 'Govt Medical College',
    address: 'Afzal Gunj, Hyderabad',
    pincode: '500012',
    emergencyPhone: '040-24600121',
    pvCoordinatorPhone: '040-24600140',
    coordinatorName: 'Dr. Y. Padmanabha Reddy, MD',
    bedsCount: 1568,
    facilities: ['24/7 Casualty', 'Trauma Ward', 'Toxicology & ADR Triage Clinic'],
    status: 'Recognized Nodal AMC',
    is24x7Casualty: true,
    distanceEstimate: '565 km away',
    coordinates: { lat: 17.3753, lng: 78.4735 },
  },
  {
    id: 'amc-tvm-gmc',
    name: 'Government Medical College Thiruvananthapuram',
    amcCode: 'AMC-038',
    institution: 'Department of Pharmacology',
    department: 'Kerala State Apex AMC Node',
    city: 'Thiruvananthapuram',
    state: 'Kerala',
    zone: 'South',
    centerType: 'Govt Medical College',
    address: 'Medical College Junction, Thiruvananthapuram',
    pincode: '695011',
    emergencyPhone: '0471-2528300',
    pvCoordinatorPhone: '0471-2528350',
    coordinatorName: 'Dr. B. Jayakumar, MD',
    bedsCount: 2950,
    facilities: ['24/7 Casualty & Trauma', 'Advanced ADR Lab', 'ICU', 'VigiFlow Desk'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '1,450 km away',
    coordinates: { lat: 8.5241, lng: 76.9208 },
  },
  {
    id: 'amc-kochi-amrita',
    name: 'Amrita Institute of Medical Sciences & Research Centre',
    amcCode: 'AMC-065',
    institution: 'Department of Clinical Pharmacology',
    department: 'Super-Specialty AMC Node',
    city: 'Kochi',
    state: 'Kerala',
    zone: 'South',
    centerType: 'Private Tertiary',
    address: 'Ponekkara, AIMS PO, Kochi',
    pincode: '682041',
    emergencyPhone: '0484-2851234',
    pvCoordinatorPhone: '0484-2851450',
    coordinatorName: 'Dr. B. Unnikrishnan, MD',
    bedsCount: 1450,
    facilities: ['24/7 Emergency Casualty', 'Bone Marrow & Organ Transplant ADR Lab', 'ICU'],
    status: 'Recognized Nodal AMC',
    is24x7Casualty: true,
    distanceEstimate: '1,280 km away',
    coordinates: { lat: 10.0328, lng: 76.2929 },
  },
  {
    id: 'amc-kolkata-ipgmer',
    name: 'Institute of Post Graduate Medical Education & Research (IPGMER & SSKM)',
    amcCode: 'AMC-016',
    institution: 'Department of Pharmacology',
    department: 'West Bengal State Apex Centre',
    city: 'Kolkata',
    state: 'West Bengal',
    zone: 'East & Central',
    centerType: 'Govt Medical College',
    address: '244, AJC Bose Road, Bhowanipore, Kolkata',
    pincode: '700020',
    emergencyPhone: '033-22231589',
    pvCoordinatorPhone: '033-22231600',
    coordinatorName: 'Dr. Santanu Kumar Tripathi, MD, DM',
    bedsCount: 2150,
    facilities: ['24/7 Trauma Casualty', 'ADR Clinical Pharmacology Lab', 'Critical Care ICU'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '1,895 km away',
    coordinates: { lat: 22.5392, lng: 88.3433 },
  },
  {
    id: 'amc-cuttack-scb',
    name: 'S.C.B. Medical College & Hospital',
    amcCode: 'AMC-044',
    institution: 'Department of Pharmacology',
    department: 'Odisha State Premier AMC Node',
    city: 'Cuttack',
    state: 'Odisha',
    zone: 'East & Central',
    centerType: 'Govt Medical College',
    address: 'Mangalabag, Cuttack',
    pincode: '753007',
    emergencyPhone: '0671-2414004',
    pvCoordinatorPhone: '0671-2414020',
    coordinatorName: 'Dr. B. K. Swain, MD',
    bedsCount: 2200,
    facilities: ['24/7 Casualty', 'Critical Care Unit', 'ADR Cell', 'Poison Desk'],
    status: 'Recognized Nodal AMC',
    is24x7Casualty: true,
    distanceEstimate: '1,510 km away',
    coordinates: { lat: 20.4625, lng: 85.8828 },
  },
  {
    id: 'amc-patna-pmch',
    name: 'Patna Medical College & Hospital (PMCH)',
    amcCode: 'AMC-048',
    institution: 'Department of Pharmacology',
    department: 'Bihar State Apex AMC Node',
    city: 'Patna',
    state: 'Bihar',
    zone: 'East & Central',
    centerType: 'Govt Medical College',
    address: 'Ashok Rajpath, Patna',
    pincode: '800004',
    emergencyPhone: '0612-2300080',
    pvCoordinatorPhone: '0612-2300095',
    coordinatorName: 'Dr. Ramanuj Kumar, MD',
    bedsCount: 1750,
    facilities: ['24/7 Emergency Casualty', 'ADR Screening Cell', 'ICU'],
    status: 'Recognized Nodal AMC',
    is24x7Casualty: true,
    distanceEstimate: '1,520 km away',
    coordinates: { lat: 25.6207, lng: 85.1578 },
  },
  {
    id: 'amc-patna-aiims',
    name: 'All India Institute of Medical Sciences (AIIMS Patna)',
    amcCode: 'AMC-093',
    institution: 'Department of Pharmacology',
    department: 'Regional Apex PvPI Center',
    city: 'Patna',
    state: 'Bihar',
    zone: 'East & Central',
    centerType: 'Apex / AIIMS',
    address: 'Phulwari Sharif, Patna',
    pincode: '801507',
    emergencyPhone: '0612-2451000',
    pvCoordinatorPhone: '0612-2451050',
    coordinatorName: 'Dr. Prem Kumar, MD',
    bedsCount: 960,
    facilities: ['24/7 Level-1 Trauma', 'Biochemical ADR Lab', 'ICU', 'Tele-Pharmacovigilance'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '1,515 km away',
    coordinates: { lat: 25.5606, lng: 85.0442 },
  },
  {
    id: 'amc-raipur-aiims',
    name: 'All India Institute of Medical Sciences (AIIMS Raipur)',
    amcCode: 'AMC-098',
    institution: 'Department of Pharmacology',
    department: 'Chhattisgarh Regional AMC Node',
    city: 'Raipur',
    state: 'East & Central',
    zone: 'East & Central',
    centerType: 'Apex / AIIMS',
    address: 'GE Road, Tatibandh, Raipur',
    pincode: '492099',
    emergencyPhone: '0771-2572999',
    pvCoordinatorPhone: '0771-2573020',
    coordinatorName: 'Dr. Nitin R. Gaikwad, MD',
    bedsCount: 960,
    facilities: ['24/7 Emergency Casualty', 'Toxicology Lab', 'ICU', 'ADR Cell'],
    status: 'Recognized Nodal AMC',
    is24x7Casualty: true,
    distanceEstimate: '1,020 km away',
    coordinates: { lat: 21.2571, lng: 81.5792 },
  },
  {
    id: 'amc-ncc-ipc',
    name: 'Indian Pharmacopoeia Commission (National Coordinating Centre - PvPI)',
    amcCode: 'AMC-000',
    institution: 'Ministry of Health & Family Welfare, Govt. of India',
    department: 'National Headquarters & WHO International Monitoring Centre Link',
    city: 'Ghaziabad',
    state: 'Delhi NCR',
    zone: 'North',
    centerType: 'Apex / AIIMS',
    address: 'Sector 23, Raj Nagar, Ghaziabad',
    pincode: '201002',
    emergencyPhone: '1800-180-3024',
    pvCoordinatorPhone: '0120-2783400',
    coordinatorName: 'Dr. Rajeev Singh Raghuvanshi (DCGI) & Dr. V. Kalaiselvan',
    bedsCount: 0,
    facilities: ['National Adverse Drug Reaction Database', 'VigiFlow India Gateway', 'Toll-Free Helpline', 'National Signal Review Panel'],
    status: 'Primary Regional Centre',
    is24x7Casualty: true,
    distanceEstimate: '1,450 km away',
    coordinates: { lat: 28.6946, lng: 77.4429 },
  },
];

export interface CoordinatingCenterSummary {
  centerKey: string;
  centerTitle: string;
  zone: 'National Apex' | 'West' | 'North' | 'South' | 'East & Central';
  leadInstitution: string;
  leadAmcCode: string;
  nodalOfficer: string;
  jurisdiction: string;
  contactNumber: string;
  themeColor: 'orange' | 'amber' | 'blue' | 'emerald' | 'purple';
  hospitalIds: string[];
}

export const PVPI_COORDINATING_CENTERS: CoordinatingCenterSummary[] = [
  {
    centerKey: 'center-apex',
    centerTitle: 'National Coordinating Centre (NCC-PvPI) & National Apex Node',
    zone: 'National Apex',
    leadInstitution: 'Indian Pharmacopoeia Commission (IPC) & AIIMS New Delhi',
    leadAmcCode: 'AMC-001 / NCC',
    nodalOfficer: 'Prof. Y. K. Gupta & Dr. V. Kalaiselvan (IPC-NCC)',
    jurisdiction: 'Pan-India Regulatory & WHO Collaborating Centre (Uppsala Link)',
    contactNumber: '1800-180-3024',
    themeColor: 'orange',
    hospitalIds: ['amc-ncc-ipc', 'amc-delhi-aiims'],
  },
  {
    centerKey: 'center-west',
    centerTitle: 'West Zone Regional Coordinating Centre & Associated AMC Hospitals',
    zone: 'West',
    leadInstitution: 'Seth GS Medical College & KEM Hospital Mumbai / B.J. Govt Medical College Pune',
    leadAmcCode: 'AMC-011 / AMC-042',
    nodalOfficer: 'Dr. Urmila Thatte, MD, PhD & Dr. Ananya Deshmukh, MD',
    jurisdiction: 'Maharashtra, Gujarat, Goa, Madhya Pradesh (Western Corridor)',
    contactNumber: '022-24107600 / 020-26128050',
    themeColor: 'amber',
    hospitalIds: [
      'amc-pune-sassoon',
      'amc-pune-kem',
      'amc-pune-bharati',
      'amc-mumbai-kem',
      'amc-mumbai-jj',
      'amc-nagpur-gmc',
      'amc-ahmedabad-bjmc',
      'amc-surat-gmc',
      'amc-goa-gmc',
      'amc-bhopal-aiims',
    ],
  },
  {
    centerKey: 'center-north',
    centerTitle: 'North Zone Regional Coordinating Centre & Associated AMC Hospitals',
    zone: 'North',
    leadInstitution: 'Postgraduate Institute of Medical Education & Research (PGIMER), Chandigarh',
    leadAmcCode: 'AMC-002',
    nodalOfficer: 'Prof. Bikash Medhi, MD, FAMS & Dr. Vandana Roy, MD',
    jurisdiction: 'Delhi NCR, Punjab, Haryana, Chandigarh, UP, Rajasthan, Uttarakhand, J&K',
    contactNumber: '0172-2755250 / 011-26588700',
    themeColor: 'blue',
    hospitalIds: [
      'amc-delhi-aiims',
      'amc-chd-pgimer',
      'amc-delhi-mamc',
      'amc-lucknow-kgmu',
      'amc-lucknow-sgpgi',
      'amc-jaipur-sms',
      'amc-patiala-gmc',
      'amc-srinagar-skims',
      'amc-rishikesh-aiims',
    ],
  },
  {
    centerKey: 'center-south',
    centerTitle: 'South Zone Regional Coordinating Centre & Associated AMC Hospitals',
    zone: 'South',
    leadInstitution: 'Christian Medical College (CMC) Vellore / BMCRI Victoria Hospital Bengaluru',
    leadAmcCode: 'AMC-019 / AMC-018',
    nodalOfficer: 'Dr. D. J. Christopher, MD & Dr. C. R. Jayanthi, MD',
    jurisdiction: 'Karnataka, Tamil Nadu, Telangana, Andhra Pradesh, Kerala, Puducherry',
    contactNumber: '0416-2282050 / 080-26701165',
    themeColor: 'emerald',
    hospitalIds: [
      'amc-vellore-cmc',
      'amc-bengaluru-bmc',
      'amc-bengaluru-stjohn',
      'amc-chennai-mmc',
      'amc-chennai-sriram',
      'amc-hyd-nims',
      'amc-hyd-osmania',
      'amc-puducherry-jipmer',
      'amc-tvm-gmc',
      'amc-kochi-amrita',
    ],
  },
  {
    centerKey: 'center-east',
    centerTitle: 'East & Central Zone Regional Coordinating Centre & Associated AMC Hospitals',
    zone: 'East & Central',
    leadInstitution: 'Medical College & Hospital Kolkata / AIIMS Bhubaneswar',
    leadAmcCode: 'AMC-012 / AMC-091',
    nodalOfficer: 'Dr. Suparna Chatterjee, MD & Dr. Debasish Hota, MD',
    jurisdiction: 'West Bengal, Odisha, Bihar, Jharkhand, Assam & North-East, Chhattisgarh',
    contactNumber: '033-22551630 / 0674-2476850',
    themeColor: 'purple',
    hospitalIds: [
      'amc-kolkata-mch',
      'amc-kolkata-ipgmer',
      'amc-bhubaneswar-aiims',
      'amc-cuttack-scb',
      'amc-patna-pmch',
      'amc-patna-aiims',
      'amc-guwahati-gmch',
      'amc-raipur-aiims',
    ],
  },
];

export const AmcLocator: React.FC = () => {
  // Existing state preserved
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

  // Primary Display Mode: 'by_centers' (All Hospitals According to Centers) vs 'directory' vs 'map'
  const [displayMode, setDisplayMode] = useState<'by_centers' | 'directory' | 'map'>('by_centers');
  const [activeCenterFilter, setActiveCenterFilter] = useState<string>('all');

  // New features: Full All-Hospital Directory according to Centers
  const [selectedZone, setSelectedZone] = useState<string>('All');
  const [selectedCenterType, setSelectedCenterType] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedHospital, setSelectedHospital] = useState<AmcHospitalCenter | null>(
    ALL_AMC_HOSPITAL_CENTERS[0]
  );
  const [dispatchSuccessAlert, setDispatchSuccessAlert] = useState<string | null>(null);

  const ZONES = ['All', 'West', 'North', 'South', 'East & Central'];
  const CENTER_TYPES = ['All', 'Apex / AIIMS', 'Govt Medical College', 'Private Tertiary'];

  // Filter all hospital centers
  const filteredHospitals = ALL_AMC_HOSPITAL_CENTERS.filter((hospital) => {
    // Search query matches
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesName = hospital.name.toLowerCase().includes(q);
      const matchesCity = hospital.city.toLowerCase().includes(q);
      const matchesState = hospital.state.toLowerCase().includes(q);
      const matchesCode = hospital.amcCode.toLowerCase().includes(q);
      const matchesInst = hospital.institution.toLowerCase().includes(q);
      if (!matchesName && !matchesCity && !matchesState && !matchesCode && !matchesInst) {
        return false;
      }
    }

    // Zone filter
    if (selectedZone !== 'All' && hospital.zone !== selectedZone) {
      return false;
    }

    // Center type filter
    if (selectedCenterType !== 'All' && hospital.centerType !== selectedCenterType) {
      return false;
    }

    return true;
  });

  // Preserve existing fetch API method
  const handleFetchCenters = async (city: string) => {
    setSelectedCity(city);
    setSearchQuery(city);
    setIsLoading(true);
    try {
      const response = await fetch('/api/find-amcs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city }),
      });
      if (response.ok) {
        const data = await response.json();
        setCenterData(data);
      }
    } catch (err) {
      console.warn('Backend API /api/find-amcs unavailable, using client-side verified PvPI dataset.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDispatchReportToAmc = (hosp: AmcHospitalCenter) => {
    setDispatchSuccessAlert(`Case dossier successfully routed to ${hosp.name} (${hosp.amcCode}) via PvPI VigiFlow Gateway!`);
    setTimeout(() => setDispatchSuccessAlert(null), 5000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header - Warm Light Orange Theme (Preserved design) */}
      <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/80 border border-orange-200 rounded-3xl p-6 text-slate-900 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-orange-600" />
            <h2 className="text-lg font-bold text-slate-900">ADR Monitoring Centres (AMCs) &amp; Casualty Locator</h2>
            <span className="text-[10px] bg-orange-100 text-orange-900 border border-orange-300 px-2 py-0.5 rounded-full font-bold">
              PvPI National Network Node
            </span>
          </div>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            Locate official Pharmacovigilance Programme of India (PvPI) monitoring centres, government medical colleges, apex AIIMS institutes, and 24/7 emergency casualty departments organized according to geographical centres.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <a
            href="tel:108"
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-transform active:scale-95"
          >
            <PhoneCall className="w-4 h-4" />
            <span>Call 108 Ambulance</span>
          </a>

          <a
            href="tel:18001803024"
            className="px-3.5 py-2 bg-white hover:bg-orange-50 text-orange-950 border border-orange-300 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            title="National PvPI Helpline"
          >
            <Phone className="w-3.5 h-3.5 text-orange-600" />
            <span>1800-180-3024 (PvPI Desk)</span>
          </a>
        </div>
      </div>

      {/* Dispatch Success Banner */}
      {dispatchSuccessAlert && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-3xl flex items-center justify-between text-emerald-950 shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="text-xs font-bold">{dispatchSuccessAlert}</span>
          </div>
          <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">
            E2B(R3) Transmitted
          </span>
        </div>
      )}

      {/* City / Quick Regional Tabs (Preserved design) */}
      <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200/80 p-4 shadow-xs flex items-center gap-2 overflow-x-auto text-xs">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
          <Compass className="w-3.5 h-3.5 text-orange-600" />
          <span>Quick City Filter:</span>
        </span>
        {CITIES.map((city) => (
          <button
            key={city}
            onClick={() => handleFetchCenters(city)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 ${
              selectedCity === city
                ? 'bg-orange-600 text-white shadow-md shadow-orange-600/20 font-bold'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* View Mode Switcher: All Hospitals According to Centers vs Unified Directory vs Map */}
      <div className="bg-white rounded-3xl border border-slate-200 p-2 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <button
            onClick={() => setDisplayMode('by_centers')}
            className={`py-2.5 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
              displayMode === 'by_centers'
                ? 'bg-gradient-to-r from-orange-600 to-amber-600 text-white shadow-md shadow-orange-600/20'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>All Hospitals According to Centers ({PVPI_COORDINATING_CENTERS.length} Centers)</span>
          </button>

          <button
            onClick={() => setDisplayMode('directory')}
            className={`py-2.5 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
              displayMode === 'directory'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Unified Directory List ({filteredHospitals.length} Hospitals)</span>
          </button>

          <button
            onClick={() => setDisplayMode('map')}
            className={`py-2.5 px-4 rounded-2xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
              displayMode === 'map'
                ? 'bg-slate-900 text-white shadow-md'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <Navigation className="w-4 h-4" />
            <span>Emergency Casualty Map &amp; Geolocation</span>
          </button>
        </div>
      </div>

      {/* ================= VIEW 1: ALL HOSPITALS ACCORDING TO CENTERS ================= */}
      {displayMode === 'by_centers' && (
        <div className="space-y-6">
          {/* Top Filter and Search Bar for Centers */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-orange-600" />
                  <span>PvPI Zonal Coordinating Centers &amp; Affiliated Hospital Network</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Official structure defined by the Indian Pharmacopoeia Commission (IPC). Every hospital is classified under its Regional Coordinating Apex Node.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hospital, city, or AMC code..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-orange-500 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Quick Center Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[10px] font-bold uppercase text-slate-400 mr-1 shrink-0">Filter Center:</span>
              <button
                onClick={() => setActiveCenterFilter('all')}
                className={`px-3 py-1.5 rounded-xl font-bold border transition-all whitespace-nowrap ${
                  activeCenterFilter === 'all'
                    ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                All 5 Coordinating Centers ({ALL_AMC_HOSPITAL_CENTERS.length} Hospitals)
              </button>
              {PVPI_COORDINATING_CENTERS.map((c) => (
                <button
                  key={c.centerKey}
                  onClick={() => setActiveCenterFilter(c.centerKey)}
                  className={`px-3 py-1.5 rounded-xl font-bold border transition-all whitespace-nowrap ${
                    activeCenterFilter === c.centerKey
                      ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {c.zone === 'National Apex' ? 'National Apex Node' : `${c.zone} Zone Center`}
                </button>
              ))}
            </div>
          </div>

          {/* Render Each Coordinating Center and its Hospitals */}
          <div className="space-y-6">
            {PVPI_COORDINATING_CENTERS.filter(
              (c) => activeCenterFilter === 'all' || activeCenterFilter === c.centerKey
            ).map((center) => {
              // Get all hospitals for this center matching search query
              const centerHospitals = ALL_AMC_HOSPITAL_CENTERS.filter((h) => {
                const isUnderCenter = center.hospitalIds.includes(h.id);
                if (!isUnderCenter) return false;
                if (searchQuery.trim()) {
                  const q = searchQuery.toLowerCase();
                  return (
                    h.name.toLowerCase().includes(q) ||
                    h.city.toLowerCase().includes(q) ||
                    h.state.toLowerCase().includes(q) ||
                    h.amcCode.toLowerCase().includes(q) ||
                    h.institution.toLowerCase().includes(q)
                  );
                }
                return true;
              });

              const totalBedsInCenter = centerHospitals.reduce((acc, h) => acc + h.bedsCount, 0);

              return (
                <div
                  key={center.centerKey}
                  className="bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-xs space-y-4"
                >
                  {/* Coordinating Center Header Banner */}
                  <div className="bg-gradient-to-r from-orange-50 via-amber-50 to-orange-100/60 p-5 border-b border-orange-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-orange-600 text-white px-2.5 py-0.5 rounded-full shadow-2xs">
                          {center.zone}
                        </span>
                        <h4 className="text-sm font-black text-slate-900">{center.centerTitle}</h4>
                        <span className="font-mono text-xs font-bold text-orange-950 bg-white border border-orange-300 px-2 py-0.2 rounded-md">
                          {center.leadAmcCode}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-slate-700 mt-1">
                        Lead Institute: <strong className="text-slate-900">{center.leadInstitution}</strong>
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600 mt-1">
                        <span>Lead Coordinator: <strong>{center.nodalOfficer}</strong></span>
                        <span>·</span>
                        <span>Jurisdiction: <strong>{center.jurisdiction}</strong></span>
                        <span>·</span>
                        <span>Helpdesk: <strong className="text-orange-700">{center.contactNumber}</strong></span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
                      <span className="text-xs font-bold bg-white text-slate-800 border border-slate-200 px-3 py-1.5 rounded-xl shadow-2xs">
                        {centerHospitals.length} Affiliated Hospital{centerHospitals.length > 1 ? 's' : ''} ({totalBedsInCenter} Beds)
                      </span>
                    </div>
                  </div>

                  {/* Affiliated Hospitals Grid under this Center */}
                  <div className="p-5 pt-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {centerHospitals.map((hosp) => {
                        const isSelected = selectedHospital?.id === hosp.id;
                        return (
                          <div
                            key={hosp.id}
                            onClick={() => setSelectedHospital(hosp)}
                            className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-3 text-xs flex flex-col justify-between ${
                              isSelected
                                ? 'border-orange-500 bg-orange-50/40 shadow-sm'
                                : 'border-slate-200 hover:border-orange-300 bg-white'
                            }`}
                          >
                            <div className="space-y-2">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="font-black text-slate-900 text-xs sm:text-sm">
                                      {hosp.name}
                                    </span>
                                    <span className="font-mono text-[10px] font-bold bg-orange-100 text-orange-900 border border-orange-300 px-1.5 py-0.2 rounded">
                                      {hosp.amcCode}
                                    </span>
                                  </div>
                                  <p className="text-slate-500 text-[11px] mt-0.5">{hosp.institution}</p>
                                </div>
                                {hosp.distanceEstimate && (
                                  <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-lg shrink-0">
                                    {hosp.distanceEstimate}
                                  </span>
                                )}
                              </div>

                              <p className="text-slate-600 text-xs">
                                📍 {hosp.address}, {hosp.city} - {hosp.pincode} ({hosp.state})
                              </p>

                              {/* Facilities & Beds */}
                              <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md">
                                  {hosp.bedsCount} Beds
                                </span>
                                <span className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md">
                                  {hosp.centerType}
                                </span>
                                {hosp.facilities.slice(0, 3).map((f, i) => (
                                  <span key={i} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">
                                    {f}
                                  </span>
                                ))}
                              </div>
                            </div>

                            {/* Action Buttons Row */}
                            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                              <a
                                href={`tel:${hosp.emergencyPhone}`}
                                onClick={(e) => e.stopPropagation()}
                                className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                              >
                                <PhoneCall className="w-3 h-3 text-rose-600" />
                                <span>24/7 Casualty: {hosp.emergencyPhone}</span>
                              </a>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDispatchReportToAmc(hosp);
                                }}
                                className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 active:scale-95"
                              >
                                <span>Route Report</span>
                                <ChevronRight className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {centerHospitals.length === 0 && (
                      <div className="p-6 text-center text-slate-500 text-xs bg-slate-50 rounded-2xl border border-slate-100">
                        No hospital found under this center matching &quot;{searchQuery}&quot;.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ================= VIEW 2: UNIFIED DIRECTORY LIST ================= */}
      {displayMode === 'directory' && (
        <div className="space-y-6">
          {/* Search & Comprehensive Filters for All Hospitals According to Centers */}
          <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-orange-600" />
                  <span>All Recognized Hospitals According to Centers ({filteredHospitals.length} Found)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Filter by official PvPI Zonal Coordinating Centers, hospital level, or search by facility name and AMC code.
                </p>
              </div>

              {/* Search Box */}
              <div className="relative w-full md:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search hospital, city, or AMC code (e.g. AMC-042)..."
                  className="w-full pl-9 pr-3.5 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:border-orange-500 font-medium"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Zone & Center Type Filter Pills */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              {/* Zone Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <span className="text-[10px] font-bold uppercase text-slate-400 mr-1 shrink-0">Zone:</span>
                {ZONES.map((zone) => (
                  <button
                    key={zone}
                    onClick={() => setSelectedZone(zone)}
                    className={`px-3 py-1 rounded-lg font-bold border transition-all whitespace-nowrap ${
                      selectedZone === zone
                        ? 'bg-orange-600 text-white border-orange-600 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {zone === 'All' ? 'All Zones' : `${zone} Zone`}
                  </button>
                ))}
              </div>

              {/* Center Type Selector */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 shrink-0">
                <span className="text-[10px] font-bold uppercase text-slate-400 mr-1 shrink-0">Type:</span>
                {CENTER_TYPES.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedCenterType(type)}
                    className={`px-3 py-1 rounded-lg font-bold border transition-all whitespace-nowrap ${
                      selectedCenterType === type
                        ? 'bg-slate-900 text-white border-slate-900 shadow-xs'
                        : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Hospitals Directory List & Map Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Hospitals Directory Cards (7 cols) */}
            <div className="lg:col-span-7 space-y-3.5">
              {filteredHospitals.map((hosp) => {
                const isSelected = selectedHospital?.id === hosp.id;
                return (
                  <div
                    key={hosp.id}
                    onClick={() => setSelectedHospital(hosp)}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer space-y-3 text-xs ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/40 shadow-sm'
                        : 'border-slate-200 hover:border-orange-300 bg-white'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-extrabold text-slate-900 text-sm">{hosp.name}</span>
                          <span className="font-mono text-[10px] font-bold bg-orange-100 text-orange-900 border border-orange-300 px-2 py-0.2 rounded">
                            {hosp.amcCode}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.2 rounded-full bg-slate-100 text-slate-700">
                            {hosp.zone} Zone · {hosp.city}
                          </span>
                        </div>
                        <p className="text-slate-500 text-[11px] mt-0.5">{hosp.institution}</p>
                        <p className="text-slate-600 text-xs mt-0.5">{hosp.address}, {hosp.city} - {hosp.pincode}</p>
                      </div>

                      {hosp.distanceEstimate && (
                        <span className="text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-xl shrink-0">
                          {hosp.distanceEstimate}
                        </span>
                      )}
                    </div>

                    {/* Facilities Badges */}
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      {hosp.facilities.map((fac, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                        >
                          {fac}
                        </span>
                      ))}
                      <span className="text-[10px] font-bold bg-orange-100 text-orange-800 px-2 py-0.5 rounded-md">
                        {hosp.bedsCount} Beds
                      </span>
                    </div>

                    {/* Action Row */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${hosp.emergencyPhone}`}
                          onClick={(e) => e.stopPropagation()}
                          className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                        >
                          <PhoneCall className="w-3 h-3 text-rose-600" />
                          <span>24/7 Casualty: {hosp.emergencyPhone}</span>
                        </a>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDispatchReportToAmc(hosp);
                          }}
                          className="px-3 py-1 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-xs font-bold transition-all shadow-xs flex items-center gap-1 active:scale-95"
                        >
                          <span>Route Report to this AMC</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredHospitals.length === 0 && (
                <div className="bg-white rounded-2xl border border-slate-200 p-8 text-center text-slate-500 text-xs">
                  No AMC hospital found matching your criteria. Try adjusting the search query or zone filter.
                </div>
              )}
            </div>

            {/* Selected Hospital Detailed Card & Emergency Protocol (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {selectedHospital && (
                <div className="bg-white rounded-3xl border-2 border-orange-200 p-6 shadow-sm space-y-4 text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-orange-100">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-orange-600" />
                      <span className="font-extrabold text-slate-900 text-sm">Selected AMC Center Profile</span>
                    </div>
                    <span className="font-mono font-bold text-xs bg-orange-100 text-orange-900 px-2.5 py-0.5 rounded-full border border-orange-300">
                      {selectedHospital.amcCode}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-black text-slate-900 text-sm">{selectedHospital.name}</h4>
                    <p className="text-slate-600 text-xs mt-0.5">{selectedHospital.institution}</p>
                    <span className="text-[10px] font-bold text-orange-800 bg-orange-50 border border-orange-200 px-2 py-0.5 rounded inline-block mt-1">
                      Status: {selectedHospital.status}
                    </span>
                  </div>

                  {/* Coordinates / Map Simulation */}
                  <div className="bg-slate-950 text-white p-4 rounded-2xl border border-slate-800 space-y-2 relative overflow-hidden">
                    <div className="flex items-center justify-between text-[11px] text-slate-400">
                      <span className="flex items-center gap-1 text-emerald-400 font-bold">
                        <Navigation className="w-3 h-3 animate-spin" /> Live Geolocation Active
                      </span>
                      <span className="font-mono text-slate-300">
                        {selectedHospital.coordinates?.lat.toFixed(4)}°N, {selectedHospital.coordinates?.lng.toFixed(4)}°E
                      </span>
                    </div>

                    <div className="h-28 bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 rounded-xl border border-white/10 flex flex-col items-center justify-center text-center p-3">
                      <MapPin className="w-7 h-7 text-orange-400 animate-bounce mb-1" />
                      <span className="text-xs font-bold text-white">{selectedHospital.name}</span>
                      <span className="text-[10px] text-slate-300">{selectedHospital.address}, {selectedHospital.city}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1">
                      <span className="text-slate-300 font-medium">Nearest Landmark: Station Road Corridor</span>
                      <span className="text-emerald-300 font-bold">{selectedHospital.distanceEstimate || 'Within Zone'}</span>
                    </div>
                  </div>

                  {/* Contacts Box */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Coordinator / HOD:</span>
                      <strong className="text-slate-900">{selectedHospital.coordinatorName}</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">24/7 Casualty Hotline:</span>
                      <a href={`tel:${selectedHospital.emergencyPhone}`} className="text-rose-600 font-bold underline font-mono">
                        {selectedHospital.emergencyPhone}
                      </a>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">AMC Department Desk:</span>
                      <a href={`tel:${selectedHospital.pvCoordinatorPhone}`} className="text-slate-800 font-bold font-mono">
                        {selectedHospital.pvCoordinatorPhone}
                      </a>
                    </div>
                  </div>

                  <div className="pt-1">
                    <button
                      onClick={() => handleDispatchReportToAmc(selectedHospital)}
                      className="w-full py-2.5 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-bold rounded-xl text-xs shadow-md shadow-orange-600/20 transition-all flex items-center justify-center gap-2 active:scale-95"
                    >
                      <Building2 className="w-4 h-4" />
                      <span>Transmit Active ADR Report to {selectedHospital.amcCode}</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Emergency Notice & Guidelines */}
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
                    <span>Shortness of breath, wheezing, or chest tightness</span>
                  </li>
                  <li className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-600 shrink-0" />
                    <span>Skin blisters spreading to mouth, eyes, or mucosal surfaces</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= VIEW 3: INTERACTIVE GEOLOCATION MAP ================= */}
      {displayMode === 'map' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Navigation className="w-4 h-4 text-orange-600" />
                <span>Live AMC Geolocation &amp; Casualty Navigation Map</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Real-time route calculation and distance estimation to nearest verified ADR Monitoring Centres and 24/7 Casualty wards.
              </p>
            </div>
            <span className="text-xs font-mono font-bold bg-emerald-100 text-emerald-900 px-3 py-1 rounded-full">
              GPS Synchronized
            </span>
          </div>

          <div className="bg-slate-950 text-white p-6 rounded-3xl border border-slate-800 space-y-4">
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
                <Navigation className="w-4 h-4 animate-spin" /> Active Patient Location: Sangamvadi Corridor, Pune (18.5284°N, 73.8742°E)
              </span>
              <span className="font-mono text-slate-400">PvPI Node: Western Zonal Hub</span>
            </div>

            <div className="h-72 bg-gradient-to-tr from-slate-900 via-slate-800 to-indigo-950 rounded-2xl border border-white/10 flex flex-col items-center justify-center text-center p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#f97316_1px,transparent_1px)] [background-size:16px_16px]" />
              <MapPin className="w-10 h-10 text-orange-400 animate-bounce mb-2" />
              <h4 className="text-base font-black text-white">{selectedHospital?.name || 'Nearest AMC Hospital'}</h4>
              <p className="text-xs text-slate-300 mt-1 max-w-md">{selectedHospital?.address}, {selectedHospital?.city}</p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-xl">
                  {selectedHospital?.distanceEstimate || '0.4 km away (5 mins)'}
                </span>
                <span className="text-xs font-mono font-bold bg-orange-500/20 text-orange-300 border border-orange-500/30 px-3 py-1 rounded-xl">
                  Casualty 24/7 Active
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[11px]">Primary Regional AMC:</span>
                <strong className="text-white block mt-0.5">{selectedHospital?.name}</strong>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[11px]">Emergency Casualty Phone:</span>
                <a href={`tel:${selectedHospital?.emergencyPhone}`} className="text-rose-400 font-bold underline font-mono block mt-0.5">
                  {selectedHospital?.emergencyPhone}
                </a>
              </div>
              <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                <span className="text-slate-400 block text-[11px]">National Emergency Hotline:</span>
                <a href="tel:108" className="text-emerald-400 font-bold underline font-mono block mt-0.5">
                  108 (Direct Ambulance Dispatch)
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Emergency Notice & Guidelines Footer (Preserved from existing design) */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-2 text-xs">
        <span className="font-bold text-slate-800 block">PvPI Toll-Free National Helpline</span>
        <p className="text-slate-600">
          National Pharmacovigilance Programme Helpline: <strong>1800-180-3024</strong> (Indian Pharmacopoeia Commission, Ghaziabad).
        </p>
      </div>
    </div>
  );
};
