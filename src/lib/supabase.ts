/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createClient } from '@supabase/supabase-js';
import { Appointment } from '../types';

// Hardcoded default fallback keys provided by the user, or overridden by optional custom flow keys
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || 'https://aluzghqsgszatldewqji.supabase.co';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_OYyTn0l8NqiNxMsl2U_OSQ_YxOr01Va';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * SQL snippet to create the required table in the Supabase SQL Editor.
 * This is displayed in the developer setup assistant component.
 */
export const SUPABASE_SETUP_SQL = `-- Create Table for Shrilakshmi Hospital Appointments
CREATE TABLE IF NOT EXISTS appointments (
  id TEXT PRIMARY KEY,
  patient_name TEXT NOT NULL,
  patient_age INTEGER NOT NULL,
  patient_gender TEXT NOT NULL,
  patient_phone TEXT NOT NULL,
  patient_email TEXT NOT NULL,
  doctor_id TEXT NOT NULL,
  doctor_name TEXT NOT NULL,
  department_name TEXT NOT NULL,
  date TEXT NOT NULL,
  time_slot TEXT NOT NULL,
  symptoms TEXT NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'Confirmed',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) to ensure secure direct access
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;

-- Creating standard RLS Policies for Anon client-side operations
CREATE POLICY "Allow anyone to insert appointments" 
  ON appointments FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Allow anyone to query appointments" 
  ON appointments FOR SELECT 
  USING (true);

CREATE POLICY "Allow anyone to update appointments" 
  ON appointments FOR UPDATE 
  USING (true);

CREATE POLICY "Allow anyone to delete appointments" 
  ON appointments FOR DELETE 
  USING (true);`;

// Mappers to decouple the local Typescript interface models from DB relations (snake_case)
export function mapAppointmentToSupabase(apt: Appointment) {
  return {
    id: apt.id,
    patient_name: apt.patientName,
    patient_age: apt.patientAge,
    patient_gender: apt.patientGender,
    patient_phone: apt.patientPhone,
    patient_email: apt.patientEmail,
    doctor_id: apt.doctorId,
    doctor_name: apt.doctorName,
    department_name: apt.departmentName,
    date: apt.date,
    time_slot: apt.timeSlot,
    symptoms: apt.symptoms,
    notes: apt.notes || null,
    status: apt.status,
    created_at: apt.createdAt
  };
}

export function mapSupabaseToAppointment(row: any): Appointment {
  return {
    id: row.id,
    patientName: row.patient_name,
    patientAge: row.patient_age,
    patientGender: row.patient_gender as 'Male' | 'Female' | 'Other',
    patientPhone: row.patient_phone,
    patientEmail: row.patient_email,
    doctorId: row.doctor_id,
    doctorName: row.doctor_name,
    departmentName: row.department_name,
    date: row.date,
    timeSlot: row.time_slot,
    symptoms: row.symptoms,
    notes: row.notes || undefined,
    status: row.status as 'Confirmed' | 'Active' | 'Cancelled',
    createdAt: row.created_at
  };
}

/**
 * Fetch all appointments from Supabase, ordered by newest first.
 */
export async function getSupabaseAppointments(): Promise<Appointment[]> {
  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data) return [];
    return data.map(mapSupabaseToAppointment);
  } catch (err) {
    console.error('Supabase getSupabaseAppointments query failed:', err);
    throw new Error('Could not fetch appointments from Supabase backend DB.', { cause: err });
  }
}

/**
 * Persists a new appointment record to Supabase.
 */
export async function insertSupabaseAppointment(apt: Appointment): Promise<Appointment> {
  try {
    const dbRow = mapAppointmentToSupabase(apt);
    const { data, error } = await supabase
      .from('appointments')
      .insert([dbRow])
      .select();

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      throw new Error('No record returned from insert operation.');
    }

    return mapSupabaseToAppointment(data[0]);
  } catch (err) {
    console.error('Supabase insertSupabaseAppointment failed:', err);
    throw new Error('Could not persist new appointment record to Supabase DB.', { cause: err });
  }
}

/**
 * Update appointment status (e.g., set to 'Cancelled').
 */
export async function updateSupabaseAppointmentStatus(id: string, status: 'Confirmed' | 'Active' | 'Cancelled'): Promise<void> {
  try {
    const { error } = await supabase
      .from('appointments')
      .update({ status })
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (err) {
    console.error('Supabase updateSupabaseAppointmentStatus failed:', err);
    throw new Error(`Could not update appointment status in Supabase DB for ID: ${id}`, { cause: err });
  }
}

/**
 * Delete an appointment record completely.
 */
export async function deleteSupabaseAppointment(id: string): Promise<void> {
  try {
    const { error } = await supabase
      .from('appointments')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }
  } catch (err) {
    console.error('Supabase deleteSupabaseAppointment failed:', err);
    throw new Error(`Could not delete appointment from Supabase DB for ID: ${id}`, { cause: err });
  }
}
