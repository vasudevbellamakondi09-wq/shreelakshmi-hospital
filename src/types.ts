/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Department {
  id: string;
  name: string;
  iconName: string; // Resolves to LucideIcon dynamically
  description: string;
  detailedNeeds: string[];
  bedCapacity?: string;
  headOfDept: string;
}

export interface Doctor {
  id: string;
  name: string;
  departmentId: string;
  specialty: string;
  education: string;
  experience: string;
  rating: number;
  availableDays: string[];
  timing: string;
  consultationFee: number;
  bio: string;
}

export interface Appointment {
  id: string;
  patientName: string;
  patientAge: number;
  patientGender: 'Male' | 'Female' | 'Other';
  patientPhone: string;
  patientEmail: string;
  doctorId: string;
  doctorName: string;
  departmentName: string;
  date: string;
  timeSlot: string;
  symptoms: string;
  notes?: string;
  status: 'Confirmed' | 'Active' | 'Cancelled';
  createdAt: string;
}
