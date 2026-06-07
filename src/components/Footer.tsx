/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import LucideIcon from './LucideIcon';
import HospitalLogo from './HospitalLogo';
import { Appointment } from '../types';
import { 
  Lock, 
  Unlock, 
  ShieldCheck, 
  KeyRound, 
  LogOut, 
  Search, 
  Trash2, 
  Users, 
  Calendar, 
  Clock, 
  Activity,
  Phone
} from 'lucide-react';

interface FooterProps {
  onQuickNavigate: (section: string) => void;
  appointments: Appointment[];
  onCancelAppointment: (id: string) => Promise<void>;
}

export default function Footer({ onQuickNavigate, appointments = [], onCancelAppointment }: FooterProps) {
  const currentYear = new Date().getFullYear();

  // Admin access state management
  const [registeredAdminId, setRegisteredAdminId] = useState<string | null>(() => {
    try {
      return localStorage.getItem('shrilakshmi_admin_id');
    } catch {
      return null;
    }
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Input fields state
  const [setupInput, setSetupInput] = useState('');
  const [loginInput, setLoginInput] = useState('');
  
  // Feedback notices
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Administrative handlers
  const handleSetupAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const trimmed = setupInput.trim();
    
    if (!trimmed) {
      setErrorMsg('Unique Admin ID cannot be empty.');
      return;
    }
    if (trimmed.length < 4) {
      setErrorMsg('Admin ID is too short. Use at least 4 alphanumeric characters.');
      return;
    }

    // Additional safeguard check
    const existing = localStorage.getItem('shrilakshmi_admin_id');
    if (existing) {
      setErrorMsg('Initialization slot consumption detected. Setup is blocked.');
      return;
    }

    try {
      localStorage.setItem('shrilakshmi_admin_id', trimmed);
      setRegisteredAdminId(trimmed);
      setIsLoggedIn(true); // Automatically log in the setup creator
      setSuccessMsg(`Welcome Admin! Single slot initialized securely with ID: "${trimmed}".`);
      setSetupInput('');
    } catch (err) {
      setErrorMsg('Failed to lock administrative coordinates.');
    }
  };

  const handleLoginAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const trimmed = loginInput.trim();

    if (!trimmed) {
      setErrorMsg('Administrative login credentials required.');
      return;
    }

    if (trimmed === registeredAdminId) {
      setIsLoggedIn(true);
      setLoginInput('');
      setSuccessMsg('Administrative authentication successful.');
    } else {
      setErrorMsg('Invalid Administrator access credentials. Rejected.');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setErrorMsg('');
    setSuccessMsg('');
  };

  const handleCancelClick = async (id: string) => {
    if (window.confirm('Are you sure you want to permanently cancel and delete this healthcare appointment record?')) {
      setCancellingId(id);
      try {
        await onCancelAppointment(id);
        setSuccessMsg('Patient schedule successfully de-allocated and purged from Supabase cloud database.');
      } catch (err: any) {
        setErrorMsg('Error purging record: ' + (err.message || 'Supabase service issue.'));
      } finally {
        setCancellingId(null);
      }
    }
  };

  // Filter schedules
  const filteredAppointments = (appointments || []).filter(apt => {
    const query = searchTerm.toLowerCase();
    return (
      apt.patientName.toLowerCase().includes(query) ||
      apt.patientPhone.toLowerCase().includes(query) ||
      apt.doctorName.toLowerCase().includes(query) ||
      apt.departmentName.toLowerCase().includes(query) ||
      apt.date.toLowerCase().includes(query)
    );
  });

  return (
    <footer id="hospital-footer" className="bg-[#0F172A] text-slate-350 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800 text-sm">
          
          {/* Logo & Brief Description */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-1 rounded-full bg-slate-100 border border-slate-200 shadow-sm flex items-center justify-center">
                <HospitalLogo size="2rem" />
              </div>
              <span className="text-lg font-bold font-sans tracking-tight text-white block">
                Shrilakshmi Hospital
              </span>
            </div>
            
            <p className="text-slate-400 text-xs leading-relaxed pt-2">
              A premium multi-specialty institution in Bengaluru, dedicated to compassionate healing, ethical diagnostic practices, and state-of-the-art emergency responses since 2002.
            </p>

            <span className="text-[9px] uppercase font-mono tracking-wider font-extrabold text-sky-400 bg-sky-500/10 border border-sky-500/20 px-2.5 py-1 rounded inline-block">
              NABH Accredited Facility
            </span>
          </div>

          {/* Quick links */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-[#F9FAFB]">Quick Resource Links</h4>
            <div className="grid grid-cols-1 gap-2.5 text-xs text-slate-400">
              <button onClick={() => onQuickNavigate('about')} className="text-left hover:text-sky-440 transition-colors cursor-pointer">About Us</button>
              <button onClick={() => onQuickNavigate('departments')} className="text-left hover:text-sky-440 transition-colors cursor-pointer">Clinical Departments</button>
              <button onClick={() => onQuickNavigate('doctors')} className="text-left hover:text-sky-440 transition-colors cursor-pointer">Medical Consultants Panel</button>
              <button onClick={() => onQuickNavigate('book')} className="text-left hover:text-sky-440 transition-colors cursor-pointer">Book Healthcare Slot</button>
            </div>
          </div>

          {/* Emergency Helplines column */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-[#F9FAFB]">24/7 Helpline & Care</h4>
            <div className="space-y-3.5 text-slate-450">
              <div className="flex items-start gap-2.5">
                <LucideIcon name="phone" className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-mono block leading-none">Emergency Trauma Desk</span>
                  <a href="tel:+918029994444" className="text-xs font-bold text-white hover:text-sky-450 transition-colors">
                    +91 80 2999 4444
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <LucideIcon name="mail" className="w-4 h-4 text-sky-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[9px] text-slate-500 uppercase font-mono block leading-none">Registered Email Queries</span>
                  <a href="mailto:appointments@shrilakshmihospital.in" className="text-xs font-bold text-[#F3F4F6] hover:text-sky-450 transition-colors">
                    appointments@shrilakshmihospital.in
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Location Block */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase font-mono font-bold tracking-widest text-[#F9FAFB]">Physical Campus Address</h4>
            <div className="space-y-3.5 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <LucideIcon name="mapPin" className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                <span className="leading-normal">
                  #45, 12th Main Road, Indiranagar, Near Metro Station Junction, Bengaluru, Karnataka - 560038
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <LucideIcon name="clock" className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                <span>
                  OPD Services: Mon - Sat: 9 AM - 8 PM | Emergencies: Open 24 Hours
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Safe Administration Gate */}
        <div id="admin-clinical-gate" className="mt-8 pt-8 border-t border-slate-800">
          <div className="flex justify-center mb-6">
            <button
              type="button"
              id="toggle-admin-console"
              onClick={() => {
                setIsExpanded(!isExpanded);
                setErrorMsg('');
                setSuccessMsg('');
              }}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-850 hover:text-white text-slate-400 hover:border-slate-700 text-xs font-mono rounded-full border border-slate-850 cursor-pointer shadow-md transition-all active:scale-95"
            >
              {isLoggedIn ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400 animate-pulse" />
              ) : (
                <Lock className="w-4 h-4 text-sky-500 animate-pulse" />
              )}
              <span>
                {isExpanded ? 'Minimize Administrative Session' : '🔒 Access Shrilakshmi Admin Gateway'}
              </span>
            </button>
          </div>

          {isExpanded && (
            <div className="bg-slate-900/60 border border-slate-800/80 rounded-[28px] p-6 sm:p-8 mb-8 overflow-hidden transition-all duration-300">
              
              {/* STATUS INDICATOR HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-slate-800 rounded-2xl text-sky-400">
                    {isLoggedIn ? <Unlock className="w-5 h-5 text-emerald-400" /> : <Lock className="w-5 h-5 text-amber-500" />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                      {isLoggedIn ? 'Operational Admin Console - ACTIVE' : 'Hospital Portal Security Protocol'}
                    </h3>
                    <p className="text-xs text-slate-400 leading-snug mt-0.5">
                      {isLoggedIn 
                        ? 'Authenticated. Authorized to access, filter, and purge outpatient scheduled slots.' 
                        : 'Secure multi-specialty dashboard for Indiranagar outpatient scheduling.'}
                    </p>
                  </div>
                </div>

                {/* Logged Status Badge & Log Out */}
                {isLoggedIn && (
                  <div className="flex items-center gap-3 self-start sm:self-center">
                    <span className="text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2.5 py-1 rounded-full font-bold">
                      Session Active: ID [{registeredAdminId}]
                    </span>
                    <button
                      type="button"
                      onClick={handleLogout}
                      className="text-xs font-bold text-rose-400 hover:text-rose-350 bg-slate-800 px-3.5 py-2 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>

              {/* DYNAMIC SUBVIEWS: ERROR & SUCCESS alerts */}
              {(errorMsg || successMsg) && (
                <div className="mt-4 space-y-2">
                  {errorMsg && (
                    <div className="p-4 bg-rose-500/10 border border-rose-500/25 text-rose-400 rounded-xl text-xs font-mono flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                      <span>{errorMsg}</span>
                    </div>
                  )}
                  {successMsg && (
                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 rounded-xl text-xs font-mono flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span>{successMsg}</span>
                    </div>
                  )}
                </div>
              )}

              {/* FLOW SECTION CONTROL */}
              {!registeredAdminId ? (
                /* SETUP MODE - SINGLE CREATION SLOT */
                <div className="mt-6 max-w-lg mx-auto">
                  <div className="bg-amber-500/5 border border-amber-500/15 p-5 rounded-2xl mb-5 space-y-2">
                    <h4 className="text-xs font-bold font-mono text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <KeyRound className="w-4 h-4" />
                      <span>First-Time Setup Slot (One-Time Creation Only)</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Initialize this hospital terminal by defining a custom <strong className="text-white font-mono">Admin Access ID</strong>. Once created, this registration slot will be permanently locked: <strong className="text-sky-400">no one will be able to create or register an ID ever again on this system.</strong>
                    </p>
                  </div>

                  <form onSubmit={handleSetupAdmin} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                        Choose Admin Access ID
                      </label>
                      <input
                        type="text"
                        required
                        value={setupInput}
                        onChange={(e) => setSetupInput(e.target.value)}
                        placeholder="e.g. shrilakshmi_admin_2026"
                        className="w-full bg-slate-950 text-white border border-slate-850 px-4 py-3 rounded-xl focus:outline-none focus:border-sky-500 text-xs font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all cursor-pointer shadow-md text-center"
                    >
                      Initialize Security ID & Access Console
                    </button>
                  </form>
                </div>
              ) : !isLoggedIn ? (
                /* LOGIN MODE */
                <div className="mt-6 max-w-lg mx-auto">
                  <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl mb-5 flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-sky-500 flex-shrink-0" />
                    <p className="text-xs text-slate-400 font-mono leading-snug">
                      Authorization Slot Closed. Only login option is available. Registration is perpetually locked.
                    </p>
                  </div>

                  <form onSubmit={handleLoginAdmin} className="space-y-4">
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 font-bold">
                        Enter Registered Admin ID
                      </label>
                      <input
                        type="password"
                        required
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-slate-950 text-white border border-slate-850 px-4 py-3 rounded-xl focus:outline-none focus:border-sky-500 text-xs font-mono"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider py-3 px-6 rounded-xl transition-all cursor-pointer shadow-md text-center"
                    >
                      Authenticate Access
                    </button>
                  </form>
                </div>
              ) : (
                /* LOGGED IN ADMINISTRATOR PANEL */
                <div className="mt-6 space-y-6">
                  
                  {/* METRICS ROW */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider font-bold">Total Patient Bookings</span>
                        <span className="text-2xl font-extrabold font-mono text-white block mt-1">{appointments.length}</span>
                      </div>
                      <Users className="w-8 h-8 text-slate-800" />
                    </div>

                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider font-bold">Confirmed / Active</span>
                        <span className="text-2xl font-extrabold font-mono text-emerald-450 block mt-1">
                          {appointments.filter(a => a.status === 'Confirmed' || a.status === 'Active').length}
                        </span>
                      </div>
                      <Activity className="w-8 h-8 text-emerald-950" />
                    </div>

                    <div className="bg-slate-950 border border-slate-850 p-4 rounded-2xl flex items-center justify-between">
                      <div>
                        <span className="text-[10px] uppercase font-mono text-slate-500 tracking-wider font-bold">Archived / Cancelled</span>
                        <span className="text-2xl font-extrabold font-mono text-slate-400 block mt-1">
                          {appointments.filter(a => a.status === 'Cancelled').length}
                        </span>
                      </div>
                      <Trash2 className="w-8 h-8 text-slate-800" />
                    </div>
                  </div>

                  {/* LIVE SCHEDULING FILTER COMPONENT */}
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                      <h4 className="text-xs uppercase font-mono tracking-widest text-[#F9FAFB] font-bold">
                        Live Outpatient Traffic Monitor ({filteredAppointments.length} matching)
                      </h4>

                      <div className="relative max-w-sm w-full">
                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Search patient, doc, phone..."
                          className="w-full bg-slate-950 text-slate-200 pl-10 pr-4 py-2.5 rounded-xl border border-slate-850 text-xs focus:outline-none focus:border-sky-500 transition-colors"
                        />
                      </div>
                    </div>

                    {/* APPOINTMENTS LIST GRID */}
                    {filteredAppointments.length === 0 ? (
                      <div className="bg-slate-950 rounded-2xl py-8 px-4 text-center border border-slate-850/60">
                        <p className="text-xs text-slate-500 font-mono">No active outpatient schedules found matching the filter query.</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                        {filteredAppointments.map((apt) => (
                          <div 
                            key={apt.id} 
                            style={{ contentVisibility: 'auto' }}
                            className="bg-slate-950 border border-slate-850 hover:border-slate-800 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 transition-colors"
                          >
                            <div className="space-y-1.5">
                              {/* Patient detail row */}
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-bold text-slate-100 text-sm">{apt.patientName}</span>
                                <span className="text-[10px] text-slate-400 bg-slate-900 border border-slate-850 px-2 py-0.5 rounded">
                                  {apt.patientAge} Yrs • {apt.patientGender}
                                </span>
                                <span className={`text-[9px] uppercase tracking-wider font-mono px-2 py-0.5 rounded font-bold ${
                                  apt.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-450 border border-rose-500/20' : 'bg-sky-500/10 text-sky-400 border border-sky-500/20'
                                }`}>
                                  {apt.status}
                                </span>
                              </div>

                              {/* Contact row */}
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-400">
                                <span className="flex items-center gap-1">
                                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                                  <span>{apt.patientPhone}</span>
                                </span>
                                <span>•</span>
                                <span className="text-slate-500 truncate max-w-[200px]">{apt.patientEmail}</span>
                              </div>

                              {/* Specialist and Slot Row */}
                              <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-300">
                                <span className="font-semibold text-sky-400">{apt.departmentName}</span>
                                <span className="text-slate-500">›</span>
                                <span className="text-slate-350">{apt.doctorName}</span>
                                <span className="text-slate-500">|</span>
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Calendar className="w-3.5 h-3.5" />
                                  <span>{apt.date}</span>
                                </span>
                                <span className="flex items-center gap-1 text-slate-400">
                                  <Clock className="w-3.5 h-3.5" />
                                  <span>{apt.timeSlot}</span>
                                </span>
                              </div>

                              {/* Clinical Symptoms/Notes if any */}
                              {apt.symptoms && (
                                <p className="text-[11px] text-slate-500 italic bg-slate-905/40 p-2 rounded-lg border border-slate-900 mt-1 max-w-3xl leading-relaxed">
                                  Symptoms: {apt.symptoms} {apt.notes && `| Note: ${apt.notes}`}
                                </p>
                              )}
                            </div>

                            {/* Purge / Cancel Button */}
                            {apt.status !== 'Cancelled' && (
                              <button
                                type="button"
                                disabled={cancellingId === apt.id}
                                onClick={() => handleCancelClick(apt.id)}
                                className="bg-rose-950/40 hover:bg-rose-900 border border-rose-900/35 text-rose-350 font-bold text-[10px] uppercase tracking-wider py-2 px-3.5 rounded-xl transition-all self-end md:self-center disabled:opacity-50 cursor-pointer flex items-center gap-1"
                              >
                                {cancellingId === apt.id ? (
                                  <svg className="animate-spin h-3.5 w-3.5 text-rose-350" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                  </svg>
                                ) : (
                                  <Trash2 className="w-3.5 h-3.5" />
                                )}
                                <span>Cancel Appt</span>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                </div>
              )}

            </div>
          )}
        </div>
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 leading-normal text-center md:text-left">
          <div>
            <p>© {currentYear} Shrilakshmi Hospital, Bengaluru. All Rights Reserved.</p>
            <p className="mt-1 text-slate-600">Disclaimer: This patient portal is optimized to coordinate outpatient schedules in real-time. For immediately life-threatening clinical circumstances, kindly rush to our physical emergency room directly.</p>
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span className="cursor-pointer hover:underline">Privacy Policy</span>
            <span>•</span>
            <span className="cursor-pointer hover:underline">Terms of Care</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
