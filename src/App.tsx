/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import Header from './components/Header';
import AboutSection from './components/AboutSection';
import DepartmentSection from './components/DepartmentSection';
import DoctorSection from './components/DoctorSection';
import BookingForm from './components/BookingForm';
import Footer from './components/Footer';
import LucideIcon from './components/LucideIcon';
import { Doctor, Appointment } from './types';
import { 
  supabase, 
  getSupabaseAppointments, 
  insertSupabaseAppointment, 
  deleteSupabaseAppointment 
} from './lib/supabase';

export default function App() {
  const [activeSection, setActiveSection] = useState('hero');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState('all');
  
  // Selection states for appointment pre-population
  const [preSelectedDoctor, setPreSelectedDoctor] = useState<Doctor | null>(null);
  const [preSelectedDepartmentId, setPreSelectedDepartmentId] = useState<string | null>(null);

  // Database connection sync status tracker
  const [dbStatus, setDbStatus] = useState<'connecting' | 'online' | 'no-table' | 'error' | 'local'>('connecting');

  // Load existing appointments from localStorage on mount as warm cache
  const [myBookings, setMyBookings] = useState<Appointment[]>(() => {
    const saved = localStorage.getItem('shrilakshmi_appointments');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Error loading static appointments:', e);
      }
    }
    return [];
  });

  // Sync real-time appointments updates from Supabase on mount
  useEffect(() => {
    async function syncWithSupabase() {
      setDbStatus('connecting');
      try {
        const fetched = await getSupabaseAppointments();
        setMyBookings(fetched);
        setDbStatus('online');
      } catch (err: any) {
        console.warn('Initial Supabase connection failed. Checking details:', err);
        
        // Probe check to inspect if table is simply missing versus invalid API keys
        try {
          const { error } = await supabase.from('appointments').select('id').limit(1);
          if (error) {
            if (error.code === '42P01' || error.message?.toLowerCase().includes('does not exist')) {
              setDbStatus('no-table');
            } else {
              setDbStatus('error');
            }
          } else {
            setDbStatus('error');
          }
        } catch {
          setDbStatus('error');
        }
      }
    }
    syncWithSupabase();
  }, []);

  // Back up state persistently in localStorage as local safety fallback
  useEffect(() => {
    localStorage.setItem('shrilakshmi_appointments', JSON.stringify(myBookings));
  }, [myBookings]);

  // Track user active viewport scrolling section
  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      const sections = ['hero', 'about', 'departments', 'doctors', 'book'];
      
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Scroll to section manually
  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveSection(sectionId);
    }
  };

  // Cross-component callback: Select department under Dept tab -> scroll to expert panel
  const handleSelectDepartmentForDoctorsByTab = (deptId: string) => {
    setSelectedDeptFilter(deptId);
    handleNavigate('doctors');
  };

  // Cross-component callback: Select department under Dept tab -> fill inside booking form & scroll to booking form
  const handleSelectDepartmentForBookingByTab = (deptId: string) => {
    setPreSelectedDepartmentId(deptId);
    setPreSelectedDoctor(null);
    handleNavigate('book');
  };

  // Cross-component callback: Select specific doctor on card -> fill inside booking form & scroll to booking form
  const handleInitiateBookingWithDoctor = (doctor: Doctor) => {
    setPreSelectedDoctor(doctor);
    setPreSelectedDepartmentId(doctor.departmentId);
    handleNavigate('book');
  };

  // Safe reset for selections
  const handleClearPreSelections = () => {
    setPreSelectedDoctor(null);
    setPreSelectedDepartmentId(null);
  };

  // Appointments actions linked to Supabase cloud storage
  const handleAddBooking = async (appointment: Appointment): Promise<boolean> => {
    // 1. Warm sync - immediately append to local state
    setMyBookings(prev => [appointment, ...prev]);

    // 2. Persist to Supabase if connection capability is active
    if (dbStatus !== 'local' && dbStatus !== 'error') {
      try {
        await insertSupabaseAppointment(appointment);
        if (dbStatus === 'connecting') {
          setDbStatus('online');
        }
        return true;
      } catch (err: any) {
        console.error('Error inserting to Supabase. Falling back securely to LocalStorage...', err);
        if (err.message?.toLowerCase().includes('does not exist') || err.cause?.code === '42P01') {
          setDbStatus('no-table');
        } else {
          setDbStatus('error');
        }
        // Fallback works automatically since it was already pushed to local state/localStorage
        return true;
      }
    }
    return true;
  };

  const handleCancelBooking = async (appointmentId: string): Promise<void> => {
    // 1. Remove from local state
    setMyBookings(prev => prev.filter(b => b.id !== appointmentId));

    // 2. Execute deletion command in Supabase
    if (dbStatus !== 'local' && dbStatus !== 'error') {
      try {
        await deleteSupabaseAppointment(appointmentId);
      } catch (err: any) {
        console.error('Error deleting from Supabase:', err);
        if (err.message?.toLowerCase().includes('does not exist') || err.cause?.code === '42P01') {
          setDbStatus('no-table');
        } else {
          setDbStatus('error');
        }
      }
    }
  };

  return (
    <div id="hospital-app-root" className="min-h-screen bg-slate-50 font-sans selection:bg-sky-500 selection:text-white">
      
      {/* Header bar component */}
      <Header 
        onNavigate={handleNavigate} 
        activeSection={activeSection} 
      />

      <main className="pt-[72px]">
        
        {/* Custom Hero Trust Section banner */}
        <section 
          id="hero" 
          className="pb-16 pt-8 sm:pb-24 sm:pt-12 bg-slate-50 relative overflow-hidden"
        >
          {/* Subtle Ambient Shapes */}
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            
            {/* Bento Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
              
              {/* Box 1 (Left / Main Overview Box) - Span 8 */}
              <div className="md:col-span-8 bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-10 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] flex flex-col justify-between min-h-[420px] bento-card">
                <div className="space-y-6">
                  {/* Real location tag */}
                  <div className="inline-flex items-center gap-2 bg-sky-50 border border-sky-100 text-sky-700 text-xs font-bold font-mono px-3.5 py-1.5 rounded-full shadow-sm leading-none">
                    <LucideIcon name="mapPin" className="w-3.5 h-3.5 text-sky-600" />
                    <span>Indiranagar, Bengaluru</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#1E293B] tracking-tight leading-tight font-display">
                    Your Health, Our <span className="text-sky-650">Sacred Mission</span>.
                  </h1>
                  
                  <p className="text-sm sm:text-base text-slate-500 max-w-2xl font-normal leading-relaxed">
                    Shrilakshmi Hospital blends trusted local clinical expertise with world-class medical infrastructure. Experience compassionate care from Bengaluru's leading multi-specialty medical team.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-6 mt-6 border-t border-slate-100">
                  <button
                    id="hero-cta-book"
                    onClick={() => handleNavigate('book')}
                    className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-2xl shadow-lg shadow-sky-100 transition-all active:scale-95 text-center cursor-pointer"
                  >
                    <LucideIcon name="calendar" className="w-4 h-4" />
                    <span>Book Appointment</span>
                  </button>

                  <button
                    id="hero-cta-depts"
                    onClick={() => handleNavigate('departments')}
                    className="flex items-center justify-center gap-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider py-4 px-8 rounded-2xl transition-all active:scale-95 text-center cursor-pointer"
                  >
                    <span>Browse Departments</span>
                    <LucideIcon name="chevronRight" className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Box 2 (Right / Care Desk Metrics Box) - Span 4 */}
              <div className="md:col-span-4 bg-sky-600 text-white rounded-[32px] p-6 sm:p-8 shadow-[0_10px_25px_-5px_rgba(14,165,233,0.15)] flex flex-col justify-between min-h-[420px] relative overflow-hidden bento-card">
                {/* Background lighting flare */}
                <div className="absolute -top-16 -right-16 w-36 h-36 bg-white/10 rounded-full blur-2xl pointer-events-none" />
                
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
                    <div className="flex items-center gap-2.5">
                      <div className="bg-white/15 p-2 rounded-xl text-white">
                        <LucideIcon name="activity" className="w-5 h-5 animate-pulse" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-white block">Shrilakshmi Care</span>
                        <span className="text-[10px] text-sky-100 block font-mono font-bold uppercase tracking-wider">Fast-track OP Queue</span>
                      </div>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[9px] uppercase tracking-widest font-mono font-extrabold px-2 py-0.5 rounded-full flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-450 animate-ping inline-block" />
                      <span>Live</span>
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3 bg-white/10 p-4 rounded-2xl">
                      <LucideIcon name="award" className="w-5 h-5 text-sky-200 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="text-xs font-bold text-white uppercase tracking-tight">Est. 24+ Year Legacy</h4>
                        <p className="text-[11px] text-sky-100 mt-1 leading-relaxed">
                          Trusted outpatient clinics, state-of-the-art diagnostic labs, bypasses, pediatric neonatology, and rehabilitation programs.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/10 grid grid-cols-2 gap-4">
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                    <span className="text-2xl font-extrabold tracking-tight font-display block text-white leading-none">99.4%</span>
                    <span className="text-[9px] font-bold text-sky-150 uppercase font-mono mt-1.5 block">Satisfied Care</span>
                  </div>
                  <div className="bg-white/5 rounded-2xl p-3 border border-white/10">
                    <span className="text-2xl font-extrabold tracking-tight font-display block text-white leading-none">35+</span>
                    <span className="text-[9px] font-bold text-sky-150 uppercase font-mono mt-1.5 block">Resident MDs</span>
                  </div>
                </div>
              </div>

              {/* Box 3 (Bottom Left / Contacts Callout & Hotline Box) - Span 4 */}
              <div 
                onClick={() => window.location.href = 'tel:+918029994444'}
                className="md:col-span-4 bg-[#1E293B] hover:bg-[#1E293B]/95 text-white rounded-[32px] p-6 shadow-sm bento-card flex flex-col justify-between min-h-[180px] cursor-pointer group"
              >
                <div className="flex items-center justify-between">
                  <div className="bg-slate-800 p-2.5 rounded-xl text-slate-300">
                    <LucideIcon name="phone" className="w-5 h-5" />
                  </div>
                  <span className="text-[9px] uppercase tracking-wider font-mono font-bold text-slate-400">Emergency Desk</span>
                </div>

                <div>
                  <span className="text-xs text-slate-450 block font-mono">Immediate Consult Helpline</span>
                  <span className="text-xl sm:text-2xl font-extrabold tracking-tight text-white block mt-1 hover:text-sky-400 transition-colors font-display">
                    +91 80 2999 4444
                  </span>
                </div>
              </div>

              {/* Box 4 (Bottom Right / Commitments Highlights Bullet Grid) - Span 8 */}
              <div className="md:col-span-8 bg-white border border-slate-200/80 rounded-[32px] p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] bento-card grid grid-cols-1 sm:grid-cols-3 gap-6">
                
                <div className="flex flex-col justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="bg-sky-50 text-sky-600 p-2.5 rounded-xl w-10 h-10 flex items-center justify-center">
                    <LucideIcon name="check" className="w-5 h-5" />
                  </div>
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">24/7 Clinical ER</h4>
                    <p className="text-[11px] text-slate-450 mt-1 leading-relaxed">Around the clock emergency trauma & specialty backup team</p>
                  </div>
                </div>

                <div className="flex flex-col justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="bg-sky-50 text-sky-600 p-2.5 rounded-xl w-10 h-10 flex items-center justify-center">
                    <LucideIcon name="award" className="w-5 h-5" />
                  </div>
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">NABH Accredited</h4>
                    <p className="text-[11px] text-slate-450 mt-1 leading-relaxed">Highest Indian standards for critical safety and processes</p>
                  </div>
                </div>

                <div className="flex flex-col justify-between p-2 rounded-2xl hover:bg-slate-50 transition-colors">
                  <div className="bg-sky-50 text-sky-600 p-2.5 rounded-xl w-10 h-10 flex items-center justify-center">
                    <LucideIcon name="shield" className="w-5 h-5" />
                  </div>
                  <div className="mt-4">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-tight">Cashless Insurance</h4>
                    <p className="text-[11px] text-slate-450 mt-1 leading-relaxed">Direct support for major TPA, corporate & insurance networks</p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Section 1: About Us */}
        <AboutSection />

        {/* Section 2: Clinical Departments */}
        <DepartmentSection 
          onSelectDepartmentForDoctors={handleSelectDepartmentForDoctorsByTab}
          onSelectDepartmentForBooking={handleSelectDepartmentForBookingByTab}
        />

        {/* Section 3: Our Expert Doctors */}
        <DoctorSection 
          selectedDeptFilter={selectedDeptFilter}
          onSetDeptFilter={setSelectedDeptFilter}
          onInitiateBookingWithDoctor={handleInitiateBookingWithDoctor}
        />

        {/* Section 4: Book Appointment */}
        <BookingForm 
          preSelectedDoctor={preSelectedDoctor}
          preSelectedDepartmentId={preSelectedDepartmentId}
          onClearPreSelections={handleClearPreSelections}
          onAddBooking={handleAddBooking}
          myBookings={myBookings}
          onCancelBooking={handleCancelBooking}
        />

      </main>

      {/* Hospital Footer component */}
      <Footer 
        onQuickNavigate={handleNavigate} 
        appointments={myBookings}
        onCancelAppointment={handleCancelBooking}
      />

    </div>
  );
}
