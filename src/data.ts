/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Department, Doctor } from './types';

export const DEPARTMENTS: Department[] = [
  {
    id: 'cardiology',
    name: 'Cardiology',
    iconName: 'Heart',
    description: 'Advanced cardiovascular care, diagnostics, bypass surgeries, and heart health management.',
    detailedNeeds: [
      'State-of-the-art Cath Lab for Angioplasty',
      '24/7 Coronary Emergency Care',
      'Non-invasive Cardiac Electrophysiology',
      'Heart Failure and Arrhythmia clinics'
    ],
    bedCapacity: '45 Beds',
    headOfDept: 'Dr. Ramachandra Gowda'
  },
  {
    id: 'orthopedics',
    name: 'Orthopedics & Joint Care',
    iconName: 'Bone',
    description: 'Expert treatment for bone fractures, joint replacements, sports medicine, and spinal disorders.',
    detailedNeeds: [
      'Robotic Joint Replacement Surgery',
      'Sports Injury & Arthroscopy Unit',
      'Advanced Pediatric Orthopedics',
      'Comprehensive Trauma care & Rehabilitation'
    ],
    bedCapacity: '40 Beds',
    headOfDept: 'Dr. Srinivas Murthy'
  },
  {
    id: 'pediatrics',
    name: 'Pediatrics & Neonatology',
    iconName: 'Baby',
    description: 'Caring environment providing immunizations, pediatric surgery, and adolescent healthcare.',
    detailedNeeds: [
      'Level III Neonatal Intensive Care Unit (NICU)',
      'Pediatric ICU (PICU)',
      'Developmental Pediatrics Clinic',
      '24/7 Pediatric Emergency Response'
    ],
    bedCapacity: '30 Beds',
    headOfDept: 'Dr. Latha Venkatesh'
  },
  {
    id: 'neurology',
    name: 'Neurology & Neurosurgery',
    iconName: 'Brain',
    description: 'Comprehensive neurological services for stroke, epilepsy, spine trauma, and sleep disorders.',
    detailedNeeds: [
      'Advanced Neuro-ICU monitoring',
      'Minimally Invasive Spine Surgery',
      'Comprehensive Epilepsy Center',
      'Stroke Thrombolysis Unit'
    ],
    bedCapacity: '25 Beds',
    headOfDept: 'Dr. Anand Deshpande'
  },
  {
    id: 'gynecology',
    name: 'Obstetrics & Gynecology',
    iconName: 'Sparkles', // Standard representation
    description: 'Comprehensive maternity, neonatal support, high-risk pregnancy management, and fertility care.',
    detailedNeeds: [
      'LDR (Labor, Delivery, Recovery) suites',
      'High-Risk Pregnancy Specialty',
      'Laparoscopic Gynaecological Surgeries',
      'Comprehensive Well-Women Screening'
    ],
    bedCapacity: '35 Beds',
    headOfDept: 'Dr. Shrilakshmi Reddy'
  },
  {
    id: 'dermatology',
    name: 'Dermatology & Cosmetology',
    iconName: 'Activity',
    description: 'Treatment for chronic skin disorders, allergen detection, and advanced aesthetic enhancement.',
    detailedNeeds: [
      'Advanced Laser Therapy Center',
      'Chronic Skin condition management (Psoriasis, Vitiligo)',
      'Hair restoration and Scalp clinics',
      'Allergy testing and Immunotherapy'
    ],
    bedCapacity: '10 Beds',
    headOfDept: 'Dr. Meera Krishnan'
  }
];

export const DOCTORS: Doctor[] = [
  {
    id: 'doc-1',
    name: 'Dr. Ramachandra Gowda',
    departmentId: 'cardiology',
    specialty: 'Senior Consultant Interventional Cardiologist',
    education: 'MBBS, MD (General Medicine), DM (Cardiology), FACC',
    experience: '22 Years',
    rating: 4.9,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timing: '09:00 AM - 01:00 PM',
    consultationFee: 750,
    bio: 'Renowned expert in coronary angioplasty, pacemaker installations, and pediatric cardiac interventions. Former academician at Bengaluru Medical College.'
  },
  {
    id: 'doc-2',
    name: 'Dr. Ananya Rao',
    departmentId: 'cardiology',
    specialty: 'Consultant Non-Invasive Cardiologist',
    education: 'MBBS, MD, DNB (Cardiology)',
    experience: '12 Years',
    rating: 4.8,
    availableDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    timing: '02:00 PM - 06:00 PM',
    consultationFee: 600,
    bio: 'Specialist in 3D Echocardiography, Stress Tests, and Preventive Cardiology. Dedicated to coaching patients towards active heart habits.'
  },
  {
    id: 'doc-3',
    name: 'Dr. Srinivas Murthy',
    departmentId: 'orthopedics',
    specialty: 'Chief Joint Replacement & Spine Surgeon',
    education: 'MBBS, MS (Ortho), MCh (Ortho - UK)',
    experience: '20 Years',
    rating: 4.9,
    availableDays: ['Mon', 'Tue', 'Thu', 'Fri'],
    timing: '10:00 AM - 02:00 PM',
    consultationFee: 700,
    bio: 'Pioneer of muscle-sparing knee and dynamic hip resurfacing techniques. Passionate about getting athletes back on the track securely.'
  },
  {
    id: 'doc-4',
    name: 'Dr. Vivek Hegde',
    departmentId: 'orthopedics',
    specialty: 'Consultant Sports Medicine Specialist',
    education: 'MBBS, MS (Ortho), Fellowship in Arthroscopy & Sports Medicine',
    experience: '10 Years',
    rating: 4.7,
    availableDays: ['Tue', 'Thu', 'Sat'],
    timing: '03:00 PM - 07:00 PM',
    consultationFee: 550,
    bio: 'Expert in arthroscopic ligament reconstructions (ACL/PCL) and complex cartilage repairs. Consultant for major state sports academies.'
  },
  {
    id: 'doc-5',
    name: 'Dr. Latha Venkatesh',
    departmentId: 'pediatrics',
    specialty: 'Senior Pediatrician & Neonatologist',
    education: 'MBBS, MD (Pediatrics), Fellowship in Neonatology (Australia)',
    experience: '18 Years',
    rating: 4.9,
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    timing: '09:00 AM - 12:30 PM',
    consultationFee: 650,
    bio: 'Acclaimed neonatologist managing pre-term infants and congenital disorders. Advocate for child immunization programs across rural Karnataka.'
  },
  {
    id: 'doc-6',
    name: 'Dr. Shrilakshmi Reddy',
    departmentId: 'gynecology',
    specialty: 'Director & Chief Obstetrics Gynaecologist',
    education: 'MBBS, DGO, MD (Obstetrics & Gynecology)',
    experience: '25 Years',
    rating: 5.0,
    availableDays: ['Mon', 'Wed', 'Thu', 'Fri'],
    timing: '10:00 AM - 01:30 PM',
    consultationFee: 800,
    bio: 'Founder of Shrilakshmi Care initiatives. Renowned specialist in high-risk pregnancy care, micro-invasive laparoscopic hysterectomy, and family planning consultancy.'
  },
  {
    id: 'doc-7',
    name: 'Dr. Anand Deshpande',
    departmentId: 'neurology',
    specialty: 'Senior Consultant Neurologist',
    education: 'MBBS, MD, DM (Neurology), Fellow of European Board of Neurology',
    experience: '16 Years',
    rating: 4.8,
    availableDays: ['Tue', 'Wed', 'Fri'],
    timing: '11:00 AM - 03:00 PM',
    consultationFee: 750,
    bio: 'Extensive expert in managing stroke thrombolysis, neuro-muscular conditions, migraine, and Parkinsonian movement disorders.'
  },
  {
    id: 'doc-8',
    name: 'Dr. Meera Krishnan',
    departmentId: 'dermatology',
    specialty: 'Consultant Dermatologist & Aesthetic Laser Expert',
    education: 'MBBS, MD (Dermatology)',
    experience: '9 Years',
    rating: 4.7,
    availableDays: ['Mon', 'Tue', 'Thu', 'Sat'],
    timing: '12:00 PM - 05:00 PM',
    consultationFee: 500,
    bio: 'Specialist in clinical dermatology, chemical peels, acne scar management, and laser-assisted skin contouring.'
  }
];

export const TIME_SLOTS = [
  '09:00 AM',
  '09:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM'
];
