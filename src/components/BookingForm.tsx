/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Appointment, Doctor } from '../types';
import { DEPARTMENTS, DOCTORS, TIME_SLOTS } from '../data';
import LucideIcon from './LucideIcon';

interface BookingFormProps {
  preSelectedDoctor: Doctor | null;
  preSelectedDepartmentId: string | null;
  onClearPreSelections: () => void;
  onAddBooking: (appointment: Appointment) => Promise<boolean>;
  myBookings: Appointment[];
  onCancelBooking: (id: string) => Promise<void>;
}

export default function BookingForm({
  preSelectedDoctor,
  preSelectedDepartmentId,
  onClearPreSelections,
  onAddBooking,
  myBookings,
  onCancelBooking
}: BookingFormProps) {
  // Main form states
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientEmail, setPatientEmail] = useState('');
  
  const [selectedDeptId, setSelectedDeptId] = useState(preSelectedDepartmentId || '');
  const [selectedDoctorId, setSelectedDoctorId] = useState(preSelectedDoctor?.id || '');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredSlot, setPreferredSlot] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [notes, setNotes] = useState('');

  // UI state for success receipts and search queries
  const [bookingSuccessObj, setBookingSuccessObj] = useState<Appointment | null>(null);
  const [validationError, setValidationError] = useState('');
  const [activeTab, setActiveTab] = useState<'book' | 'my-bookings'>('book');
  const [searchPhone, setSearchPhone] = useState('');
  
  // Supabase operational loading states
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle pre-selections correctly on external signals
  useEffect(() => {
    if (preSelectedDoctor) {
      setSelectedDeptId(preSelectedDoctor.departmentId);
      setSelectedDoctorId(preSelectedDoctor.id);
      setActiveTab('book');
    } else if (preSelectedDepartmentId) {
      setSelectedDeptId(preSelectedDepartmentId);
      setSelectedDoctorId('');
      setActiveTab('book');
    }
  }, [preSelectedDoctor, preSelectedDepartmentId]);

  // Compute available doctors for selected department
  const filteredDoctors = useMemo(() => {
    if (!selectedDeptId) return [];
    return DOCTORS.filter(d => d.departmentId === selectedDeptId);
  }, [selectedDeptId]);

  // Handle department change -> reset doctor choice if mismatch
  const handleDepartmentChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const deptId = e.target.value;
    setSelectedDeptId(deptId);
    setSelectedDoctorId(''); // reset doctor selection
    setPreferredSlot('');
  };

  // Get current selected doctor details
  const currentDoctorObj = useMemo(() => {
    return DOCTORS.find(d => d.id === selectedDoctorId) || null;
  }, [selectedDoctorId]);

  // Date constraints - restrict to today and next 30 days
  const minDateString = useMemo(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const maxDateString = useMemo(() => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    const yyyy = maxDate.getFullYear();
    const mm = String(maxDate.getMonth() + 1).padStart(2, '0');
    const dd = String(maxDate.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // Form Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');

    // Validations
    if (!patientName.trim()) return setValidationError('Patient Name is required.');
    if (!patientAge || parseInt(patientAge) <= 0 || parseInt(patientAge) > 120) {
      return setValidationError('Please enter a valid age (1-120).');
    }
    if (!patientPhone.match(/^\+?[\d\s-]{10,13}$/)) {
      return setValidationError('Please enter a valid phone number (10 digits).');
    }
    if (!patientEmail.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return setValidationError('Please enter a valid email address.');
    }
    if (!selectedDeptId) return setValidationError('Please choose a medical department.');
    if (!selectedDoctorId) return setValidationError('Please choose a consultant.');
    if (!preferredDate) return setValidationError('Please choose an appointment date.');
    if (!preferredSlot) return setValidationError('Please select a preferred time slot.');
    if (!symptoms.trim()) return setValidationError('Please briefly state your symptoms or reason for consult.');

    const selectedDeptObj = DEPARTMENTS.find(d => d.id === selectedDeptId);
    const docObj = DOCTORS.find(d => d.id === selectedDoctorId);

    // Create unique appointment record
    const newAppointment: Appointment = {
      id: `APT-${String(Date.now()).slice(-6)}-${Math.floor(100 + Math.random() * 900)}`,
      patientName: patientName.trim(),
      patientAge: parseInt(patientAge),
      patientGender,
      patientPhone: patientPhone.trim(),
      patientEmail: patientEmail.trim().toLowerCase(),
      doctorId: selectedDoctorId,
      doctorName: docObj?.name || 'Academic Consultant',
      departmentName: selectedDeptObj?.name || 'Outpatient Clinic',
      date: preferredDate,
      timeSlot: preferredSlot,
      symptoms: symptoms.trim(),
      notes: notes.trim() || undefined,
      status: 'Confirmed',
      createdAt: new Date().toISOString()
    };

    setIsSubmitting(true);
    try {
      const isSuccess = await onAddBooking(newAppointment);
      if (isSuccess) {
        setBookingSuccessObj(newAppointment);

        // Clear form inputs
        setPatientName('');
        setPatientAge('');
        setPatientPhone('');
        setPatientEmail('');
        setSelectedDeptId('');
        setSelectedDoctorId('');
        setPreferredDate('');
        setPreferredSlot('');
        setSymptoms('');
        setNotes('');
        onClearPreSelections();
      } else {
        setValidationError('Failed to sync appointment with Supabase. Ensure appointments table is created and policies are configured.');
      }
    } catch (err: any) {
      setValidationError(err.message || 'database error securely synchronizing with Supabase cloud.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter local bookings list based on search phone/email
  const searchFilteredBookings = useMemo(() => {
    if (!searchPhone) return myBookings;
    return myBookings.filter(b => 
      b.patientPhone.includes(searchPhone) || 
      b.patientEmail.includes(searchPhone.toLowerCase()) ||
      b.patientName.toLowerCase().includes(searchPhone.toLowerCase())
    );
  }, [myBookings, searchPhone]);

  return (
    <section id="book" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sky-605 font-extrabold tracking-wider text-xs uppercase font-mono bg-sky-50 px-3.5 py-1.5 rounded-full inline-block border border-sky-100">
            Appointment Desk
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mt-3 font-display">
            Schedule Your Health Consultation
          </h2>
          <div className="h-1.5 w-16 bg-sky-500 mx-auto mt-4 rounded-full" />
          <p className="text-slate-500 text-sm mt-4">
            Request slots instantly. Review credentials, choose timings, and manage your booked clinical appointments securely below.
          </p>
        </div>

        {/* Tab Selection */}
        <div className="flex justify-center mb-10">
          <div className="bg-slate-50 border border-slate-200/80 p-1.5 rounded-2xl flex items-center justify-between w-full max-w-md">
            <button
              id="tab-btn-book"
              onClick={() => {
                setActiveTab('book');
                setBookingSuccessObj(null);
              }}
              className={`flex-1 text-center py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'book'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-sky-650'
              }`}
            >
              <span className="inline-flex items-center gap-1.5 justify-center">
                <LucideIcon name="calendar" className="w-4 h-4" />
                Book Session
              </span>
            </button>
            <button
              id="tab-btn-mybook"
              onClick={() => setActiveTab('my-bookings')}
              className={`flex-1 text-center py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all cursor-pointer relative ${
                activeTab === 'my-bookings'
                  ? 'bg-sky-600 text-white shadow-md'
                  : 'text-slate-600 hover:text-sky-650'
              }`}
            >
              <span className="inline-flex items-center gap-1.5 justify-center">
                <LucideIcon name="checkSquare" className="w-4 h-4" />
                My Appointments
                {myBookings.length > 0 && (
                  <span className="bg-emerald-500 text-white rounded-full text-[9px] w-5 h-5 flex items-center justify-center font-mono font-bold ml-1">
                    {myBookings.length}
                  </span>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Show interactive booking form */}
        {activeTab === 'book' ? (
          <div className="max-w-4xl mx-auto">
            {bookingSuccessObj ? (
              
              /* CONFIRMED CLINICAL APPOINTMENT PASS/RECEIPT */
              <div id="booking-receipt" className="bg-emerald-50/40 border border-emerald-250/50 rounded-[32px] p-6 sm:p-10 shadow-lg overflow-hidden relative bento-card">
                
                {/* Decorative Elements */}
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-sky-500 via-sky-600 to-emerald-500" />
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl" />

                <div className="text-center pb-8 border-b border-emerald-200/50">
                  <div className="mx-auto bg-emerald-500 text-white p-3.5 rounded-2xl w-14 h-14 flex items-center justify-center shadow-lg shadow-emerald-100 mb-4 animate-bounce">
                    <LucideIcon name="check" className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-[#065F46] font-display">Appointment Confirmed</h3>
                  <p className="text-xs text-emerald-850 mt-1 uppercase font-mono tracking-widest font-bold">
                    Shrilakshmi Hospital, Bengaluru
                  </p>
                </div>

                {/* Patient / Consult Pass body */}
                <div className="py-8 grid grid-cols-1 md:grid-cols-2 gap-8 text-neutral-800 text-sm">
                  
                  {/* Left Column Pass Info */}
                  <div className="space-y-4">
                    <div>
                      <span className="text-[10px] uppercase font-mono block text-slate-400 font-bold mb-0.5">Booking Reference</span>
                      <span className="font-mono font-bold text-slate-800 text-xs select-all bg-white px-3 py-1.5 rounded-lg border border-slate-200 block w-fit">
                        {bookingSuccessObj.id}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono block text-slate-400 font-bold mb-0.5">Patient Name</span>
                      <span className="font-bold text-slate-800 text-base">{bookingSuccessObj.patientName}</span>
                      <span className="text-slate-500 text-xs block mt-0.5">
                        {bookingSuccessObj.patientAge} Years old | {bookingSuccessObj.patientGender}
                      </span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-mono block text-slate-400 font-bold mb-0.5">Contact Registered</span>
                      <span className="font-semibold text-slate-700 block text-xs">{bookingSuccessObj.patientPhone}</span>
                      <span className="text-slate-500 text-[11px] block">{bookingSuccessObj.patientEmail}</span>
                    </div>
                  </div>

                  {/* Right Column Consult Info */}
                  <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm relative">
                    <div>
                      <span className="text-[10px] uppercase font-mono block text-slate-400 font-bold mb-0.5">Assigned Specialist</span>
                      <span className="font-bold text-slate-800 block text-sm text-sky-700">
                        {bookingSuccessObj.doctorName}
                      </span>
                      <span className="text-slate-500 text-[10px] block uppercase font-bold tracking-wider mt-1">
                        {bookingSuccessObj.departmentName}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-3">
                      <div>
                        <span className="text-[10px] uppercase font-mono block text-slate-400 font-bold mb-0.5">Schedule Date</span>
                        <span className="font-bold text-slate-700 block text-xs">{new Date(bookingSuccessObj.date).toLocaleDateString('en-IN', { weekday: 'short', day: '2-digit', month: 'short', year: 'numeric' })}</span>
                      </div>
                      <div>
                        <span className="text-[10px] uppercase font-mono block text-slate-400 font-bold mb-0.5">Time Slot</span>
                        <span className="font-bold text-emerald-800 block bg-emerald-50 px-2 py-0.5 rounded text-xs text-center w-fit">
                          {bookingSuccessObj.timeSlot}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Clinical Guidelines Footnote */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200/80 space-y-2.5 text-xs text-slate-500 leading-relaxed">
                  <div className="flex items-center gap-2 text-sky-700 font-bold uppercase tracking-wider text-[10px] font-mono">
                    <LucideIcon name="info" className="w-4 h-4 text-sky-600" />
                    <span>Patient Guidelines & Instructions</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Please arrive <strong>20 minutes prior</strong> to your schedule slot for basic vitals screening.</li>
                    <li>Bring all relevant historical lab reports, scan films, and ongoing prescriptions.</li>
                    <li>If you need to cancel or reschedule, kindly do so under the <strong>My Appointments</strong> tab.</li>
                    <li>Report at Front Desk Block B, Indiranagar campus.</li>
                  </ul>
                </div>

                {/* Bottom Trigger actions */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8 pt-6 border-t border-emerald-100">
                  <button
                    onClick={() => {
                      setBookingSuccessObj(null);
                    }}
                    className="w-full sm:w-auto bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md shadow-sky-100 text-center cursor-pointer"
                  >
                    Book Another Slot
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab('my-bookings');
                      setBookingSuccessObj(null);
                    }}
                    className="w-full sm:w-auto border border-slate-200 hover:bg-slate-50 text-slate-650 font-bold py-3 px-6 rounded-2xl text-xs uppercase tracking-wider transition-all text-center cursor-pointer"
                  >
                    View All Active Bookings
                  </button>
                </div>

              </div>
            ) : (
              
              /* FORM SUBMISSION HOOK */
              <form 
                onSubmit={handleSubmit} 
                className="bg-white rounded-[32px] p-6 sm:p-10 border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] space-y-8 relative overflow-hidden bento-card"
              >
                
                {/* Check warning banner from state selections */}
                {preSelectedDoctor && (
                  <div id="booking-preselect-banner" className="bg-sky-50 border border-sky-100 rounded-2xl p-4 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-sky-600 text-white p-2 rounded-xl">
                        <LucideIcon name="stethoscope" className="w-5 h-5" />
                      </div>
                      <div>
                        <span className="text-[9px] uppercase font-mono font-bold text-slate-400 block">Pre-selected Consultant</span>
                        <span className="text-xs font-bold text-slate-800">{preSelectedDoctor.name}</span>
                        <span className="text-xs font-semibold text-sky-700 block mt-0.5">{preSelectedDoctor.specialty}</span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={onClearPreSelections}
                      className="text-xs text-slate-500 hover:text-sky-600 bg-white border border-slate-200 px-3 py-1.5 rounded-xl font-bold transition-all cursor-pointer"
                    >
                      Reset selection
                    </button>
                  </div>
                )}

                {validationError && (
                  <div id="validation-error-banner" className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3 text-rose-700 text-xs">
                    <LucideIcon name="shield" className="w-5 h-5 flex-shrink-0" />
                    <span>{validationError}</span>
                  </div>
                )}

                {/* Patient Information Section */}
                <div>
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 flex items-center gap-2 pb-3 border-b border-slate-100">
                    <LucideIcon name="user" className="w-4 h-4 text-sky-500" />
                    <span>1. Patient Demographics & Contact</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5 font-normal">
                    
                    {/* Patient Name */}
                    <div className="md:col-span-2">
                      <label htmlFor="patient-name-input" className="block text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                        Patient Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="text"
                        id="patient-name-input"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs text-slate-700 outline-none transition-all placeholder:text-slate-400 bg-slate-50/30"
                        required
                      />
                    </div>

                    {/* Patient Age */}
                    <div>
                      <label htmlFor="patient-age-input" className="block text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                        Age (Years) <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="number"
                        id="patient-age-input"
                        value={patientAge}
                        onChange={(e) => setPatientAge(e.target.value)}
                        placeholder="e.g. 32"
                        min="1"
                        max="120"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs text-slate-700 outline-none transition-all placeholder:text-slate-400 bg-slate-50/30"
                        required
                      />
                    </div>

                    {/* Patient Gender */}
                    <div>
                      <label className="block text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                        Gender <span className="text-rose-500">*</span>
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Male', 'Female', 'Other'].map(g => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setPatientGender(g as any)}
                            className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                              patientGender === g
                                ? 'bg-sky-650 text-white border-sky-650'
                                : 'bg-white text-slate-600 hover:bg-slate-50 border-slate-200'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Patient Phone */}
                    <div>
                      <label htmlFor="patient-phone-input" className="block text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                        Phone Number <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="tel"
                        id="patient-phone-input"
                        value={patientPhone}
                        onChange={(e) => setPatientPhone(e.target.value)}
                        placeholder="e.g. 9888800000"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs text-slate-700 outline-none transition-all placeholder:text-slate-400 bg-slate-50/30"
                        required
                      />
                    </div>

                    {/* Patient Email */}
                    <div>
                      <label htmlFor="patient-email-input" className="block text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="email"
                        id="patient-email-input"
                        value={patientEmail}
                        onChange={(e) => setPatientEmail(e.target.value)}
                        placeholder="patient@example.com"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs text-slate-700 outline-none transition-all placeholder:text-slate-400 bg-slate-50/30"
                        required
                      />
                    </div>

                  </div>
                </div>

                {/* Consultation Details Section */}
                <div>
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 flex items-center gap-2 pb-3 border-b border-slate-100">
                    <LucideIcon name="stethoscope" className="w-4 h-4 text-sky-500" />
                    <span>2. Department & Consultant Specialty</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
                    
                    {/* Department Dropdown */}
                    <div>
                      <label htmlFor="dept-select" className="block text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                        Choose Department <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="dept-select"
                        value={selectedDeptId}
                        onChange={handleDepartmentChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-205 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs text-slate-700 outline-none bg-slate-50/20 transition-all font-semibold"
                        required
                      >
                        <option value="">-- Choose Clinical Specialty --</option>
                        {DEPARTMENTS.map(d => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Doctor Dropdown */}
                    <div>
                      <label htmlFor="doctor-select" className="block text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                        Choose Specialist Consultant <span className="text-rose-500">*</span>
                      </label>
                      <select
                        id="doctor-select"
                        value={selectedDoctorId}
                        onChange={(e) => {
                          setSelectedDoctorId(e.target.value);
                          setPreferredSlot('');
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-205 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs text-slate-700 outline-none bg-slate-50/20 transition-all disabled:opacity-60 font-semibold"
                        disabled={!selectedDeptId}
                        required
                      >
                        <option value="">-- Choose Doctor --</option>
                        {filteredDoctors.map(doctor => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name} ({doctor.specialty} | ₹{doctor.consultationFee})
                          </option>
                        ))}
                      </select>
                      {!selectedDeptId && (
                        <p className="text-[10px] text-slate-400 mt-1.5 block italic leading-none pl-1">Please choose a department first to load specialists.</p>
                      )}
                    </div>

                  </div>

                  {/* Doctor Info Panel */}
                  {currentDoctorObj && (
                    <div id="booking-doctor-brief" className="mt-4 bg-slate-50 p-4 rounded-xl border border-slate-200/60 leading-relaxed text-[11px] text-slate-500">
                      <p className="font-bold text-slate-700">Specialist Bio & Timings:</p>
                      <p className="mt-1 font-normal">"{currentDoctorObj.bio}"</p>
                      <p className="mt-2 text-sky-700 font-bold flex items-center gap-1.5">
                        <LucideIcon name="clock" className="w-3.5 h-3.5" />
                        <span>Days Available: {currentDoctorObj.availableDays.join(', ')} | Consulting hours: {currentDoctorObj.timing}</span>
                      </p>
                    </div>
                  )}
                </div>

                {/* Scheduling Section */}
                <div>
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 flex items-center gap-2 pb-3 border-b border-slate-100">
                    <LucideIcon name="calendar" className="w-4 h-4 text-sky-500" />
                    <span>3. Choose Reference Date & Slot</span>
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-5 items-start">
                    
                    {/* Date picker */}
                    <div className="md:col-span-1">
                      <label htmlFor="preferred-date" className="block text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                        Preferred Date <span className="text-rose-500">*</span>
                      </label>
                      <input
                        type="date"
                        id="preferred-date"
                        value={preferredDate}
                        onChange={(e) => setPreferredDate(e.target.value)}
                        min={minDateString}
                        max={maxDateString}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs text-slate-700 outline-none transition-all bg-slate-50/20"
                        required
                      />
                      <span className="text-[10px] text-slate-450 block mt-1.5 leading-normal italic pl-1">Select dates up to 30 days in advance.</span>
                    </div>

                    {/* Slot pills selector */}
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-1.5 text-left pl-1">
                        Select Best Consulting Slot <span className="text-rose-500">*</span>
                      </label>
                      
                      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-2 border border-slate-200/60 rounded-xl bg-slate-50/50">
                        {TIME_SLOTS.map(slot => {
                          const isSelected = preferredSlot === slot;
                          return (
                            <button
                               key={slot}
                              type="button"
                              onClick={() => setPreferredSlot(slot)}
                              className={`py-2 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer border ${
                                isSelected
                                  ? 'bg-sky-600 border-sky-600 text-white shadow-sm'
                                  : 'bg-white border-slate-200 text-slate-600 hover:border-sky-400 hover:text-sky-750'
                              }`}
                            >
                              {slot}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                  </div>
                </div>

                {/* Symptoms / Clinical reason */}
                <div>
                  <h3 className="text-xs font-bold font-mono uppercase tracking-wider text-slate-500 flex items-center gap-2 pb-3 border-b border-slate-100">
                    <LucideIcon name="activity" className="w-4 h-4 text-sky-500" />
                    <span>4. Reason/Symptoms for Clinical Consult</span>
                  </h3>

                  <div className="space-y-4 mt-5">
                    <div>
                      <label htmlFor="symptoms-input" className="block text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                        Describe Symptoms & Primary Complaint <span className="text-rose-500">*</span>
                      </label>
                      <textarea
                        id="symptoms-input"
                        rows={3}
                        value={symptoms}
                        onChange={(e) => setSymptoms(e.target.value)}
                        placeholder="Please write about discomfort, symptoms and duration (e.g. chronic chest tightness, joint stiffness, baby fever, etc.)."
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs text-slate-700 outline-none transition-all placeholder:text-slate-400 resize-none bg-slate-50/20"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="notes-input" className="block text-[10px] font-bold font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                        Special Notes or Historical Conditions (Optional)
                      </label>
                      <input
                        type="text"
                        id="notes-input"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="e.g. wheelchair support required, allergic to penicillin, diabetes patient"
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs text-slate-700 outline-none transition-all placeholder:text-slate-400 bg-slate-50/20"
                      />
                    </div>
                  </div>
                </div>

                {/* Submit trigger button */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    id="btn-confirm-appointment"
                    disabled={isSubmitting}
                    className="bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider py-4 px-10 rounded-2xl transition-all shadow-lg shadow-sky-100 active:scale-95 cursor-pointer text-center disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSubmitting && (
                      <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                    )}
                    <span>{isSubmitting ? 'Securing Slot in Supabase...' : 'Confirm Healthcare Appointment'}</span>
                  </button>
                </div>

              </form>
            )}
          </div>
        ) : (
          
          /* ACTIVE USER APPOINTMENT MANAGER */
          <div className="max-w-4xl mx-auto space-y-6">
            
            {/* Search filter bar block */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <LucideIcon name="filter" className="w-4 h-4 text-sky-600" />
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider font-mono">Filter Scheduled Bookings</span>
              </div>
              <div className="relative w-full sm:w-80">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-slate-400">
                  <LucideIcon name="search" className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  value={searchPhone}
                  onChange={(e) => setSearchPhone(e.target.value)}
                  placeholder="Enter name, phone or registered email..."
                  className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-sky-550 text-xs text-slate-700 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            {searchFilteredBookings.length > 0 ? (
              <div id="user-bookings-list" className="space-y-4">
                {searchFilteredBookings.map((apt) => (
                  <div
                    key={apt.id}
                    className="bg-white rounded-[28px] p-6 border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden bento-card"
                  >
                    
                    {/* CONFIRMED HEALTH ACCENTS SIDE-BAR */}
                    <div className="absolute top-0 bottom-0 left-0 w-1.5 bg-sky-500" />

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pl-4">
                      
                      {/* Left: Patient Details & Ref */}
                      <div className="space-y-3">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-[9px] font-bold bg-slate-100 text-slate-500 px-2.5 py-0.5 rounded-md border border-slate-200/60">
                            {apt.id}
                          </span>
                          <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-150 flex items-center gap-1">
                            <LucideIcon name="check" className="w-3 h-3 text-emerald-600 animate-pulse" />
                            Confirmed
                          </span>
                        </div>

                        <div>
                          <h4 className="text-sm font-extrabold text-slate-800 leading-none">
                            {apt.patientName} <span className="text-xs font-normal text-slate-500">(Age: {apt.patientAge} | {apt.patientGender})</span>
                          </h4>
                          <p className="text-xs text-slate-500 mt-2">
                            Registered Hotline: {apt.patientPhone} | Contact: {apt.patientEmail}
                          </p>
                        </div>

                        <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 max-w-lg">
                          <span className="text-[9px] uppercase font-mono block text-slate-400 font-bold mb-0.5 leading-none">Primary Symptoms Complaint</span>
                          <p className="text-xs text-slate-600 italic line-clamp-1">"{apt.symptoms}"</p>
                        </div>
                      </div>

                      {/* Right: Assigned Specialists & Slottings */}
                      <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end justify-between gap-4 md:text-right">
                        <div>
                          <span className="text-xs block font-bold text-slate-700">{apt.doctorName}</span>
                          <span className="text-[10px] block font-mono font-bold uppercase tracking-wider text-sky-600 mt-0.5">{apt.departmentName}</span>
                        </div>

                        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 p-2.5 rounded-xl text-xs font-bold text-slate-700">
                          <LucideIcon name="calendar" className="w-3.5 h-3.5 text-sky-505" />
                          <span>{new Date(apt.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })} at {apt.timeSlot}</span>
                        </div>

                        <button
                          type="button"
                          id={`btn-cancel-apt-${apt.id}`}
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to cancel the appointment ${apt.id} with ${apt.doctorName}?`)) {
                              onCancelBooking(apt.id);
                            }
                          }}
                          className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100/50 px-3.5 py-1.5 rounded-xl cursor-pointer transition-colors"
                        >
                          <LucideIcon name="trash" className="w-3.5 h-3.5" />
                          <span>Cancel Booking</span>
                        </button>
                      </div>

                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div id="no-saved-bookings" className="text-center py-16 bg-white rounded-3xl border border-slate-200">
                <div className="bg-slate-100 text-slate-400 p-4 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                  <LucideIcon name="calendar" className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-slate-800 text-sm uppercase font-mono tracking-wider">No Booked Visits</h3>
                <p className="text-xs text-slate-500 mt-2 block max-w-sm mx-auto leading-relaxed">
                  You do not have any registered visits under this search. Move back to the **Book Session** tab to request slots with our team of specialists.
                </p>
                <button
                  onClick={() => setActiveTab('book')}
                  className="mt-5 text-xs font-bold bg-sky-600 text-white py-2.5 px-6 rounded-xl cursor-pointer hover:bg-sky-700 transition-colors uppercase tracking-wider shadow-sm"
                >
                  Create Booking Now
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </section>
  );
}
