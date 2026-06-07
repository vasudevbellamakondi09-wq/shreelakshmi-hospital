/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Doctor } from '../types';
import { DOCTORS, DEPARTMENTS } from '../data';
import LucideIcon from './LucideIcon';

interface DoctorSectionProps {
  selectedDeptFilter: string;
  onSetDeptFilter: (deptId: string) => void;
  onInitiateBookingWithDoctor: (doctor: Doctor) => void;
}

export default function DoctorSection({ 
  selectedDeptFilter, 
  onSetDeptFilter, 
  onInitiateBookingWithDoctor 
}: DoctorSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Auto scroll to doctor section when filter is applied from elsewhere
  useEffect(() => {
    if (selectedDeptFilter !== 'all') {
      const element = document.getElementById('doctors');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [selectedDeptFilter]);

  // Memoized filtered doctors based on selected department and search query
  const filteredDoctors = useMemo(() => {
    return DOCTORS.filter(doc => {
      const matchesDept = selectedDeptFilter === 'all' || doc.departmentId === selectedDeptFilter;
      const matchesSearch = 
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.education.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [selectedDeptFilter, searchQuery]);

  return (
    <section id="doctors" className="py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-sky-605 font-extrabold tracking-wider text-xs uppercase font-mono bg-sky-50 px-3.5 py-1.5 rounded-full inline-block border border-sky-100">
            Our Specialists
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mt-3 font-display">
            Consult Our Expert Doctor Panel
          </h2>
          <div className="h-1.5 w-16 bg-sky-500 mx-auto mt-4 rounded-full" />
          <p className="text-slate-500 text-sm mt-4 font-normal">
            Connect with highly accredited, compassionate medical leaders in Bengaluru dedicated to delivering patient-centric medical treatment.
          </p>
        </div>

        {/* Filters Tool-Bar & Search - styled as a Bento box */}
        <div className="bg-white rounded-[32px] p-6 border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] mb-12 bento-card">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6">
            
            {/* Search input field */}
            <div className="relative w-full md:w-96">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <LucideIcon name="search" className="w-4 h-4 text-sky-500" />
              </span>
              <input
                type="text"
                id="doctor-search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, specialty, education..."
                className="w-full pl-10 pr-16 py-3 rounded-2xl border border-slate-200 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-xs text-slate-800 outline-none transition-all placeholder:text-slate-400 bg-slate-50/50"
              />
              {searchQuery && (
                <button 
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                >
                  <span className="text-[10px] font-bold bg-slate-200/60 py-1 px-2.5 rounded-lg">Clear</span>
                </button>
              )}
            </div>

            {/* Department selection */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-slate-500 text-[11px] font-bold">
              <div className="flex items-center gap-1.5 font-mono uppercase tracking-wider text-slate-400">
                <LucideIcon name="filter" className="w-3.5 h-3.5 text-sky-600" />
                <span>Filter Dept:</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button
                  id="filter-dept-all"
                  onClick={() => onSetDeptFilter('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all uppercase tracking-tight cursor-pointer ${
                    selectedDeptFilter === 'all'
                      ? 'bg-sky-600 text-white shadow-sm'
                      : 'bg-slate-55 hover:bg-slate-100 text-slate-650'
                  }`}
                >
                  All Specialists
                </button>
                {DEPARTMENTS.map(dept => (
                  <button
                    key={dept.id}
                    id={`filter-dept-${dept.id}`}
                    onClick={() => onSetDeptFilter(dept.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all uppercase tracking-tight cursor-pointer ${
                      selectedDeptFilter === dept.id
                        ? 'bg-sky-600 text-white shadow-sm'
                        : 'bg-slate-50 border border-slate-205 hover:bg-slate-100 text-slate-600'
                    }`}
                  >
                    {dept.name.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* Doctor Grid results */}
        <AnimatePresence mode="popLayout">
          {filteredDoctors.length > 0 ? (
            <motion.div 
              id="doctors-grid"
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {filteredDoctors.map((doc) => {
                const docDept = DEPARTMENTS.find(d => d.id === doc.departmentId);
                return (
                  <motion.div
                    key={doc.id}
                    id={`doc-card-${doc.id}`}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-[32px] border border-slate-200/80 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] hover:shadow-xl hover:-translate-y-1 transition-all overflow-hidden flex flex-col group bento-card"
                  >
                    
                    {/* Header bar / Initial Avatar */}
                    <div className="bg-sky-500/5 p-5 flex items-center justify-between border-b border-slate-100">
                      <div className="flex items-center gap-3">
                        <div className="w-11 h-11 bg-sky-600 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-sm font-sans tracking-wide">
                          {doc.name.split(' ').slice(-1)[0][0] || 'Dr'}
                        </div>
                        <div>
                          <span className="text-[9px] text-sky-700 font-extrabold font-mono tracking-wider uppercase bg-sky-50 border border-sky-100/50 px-1.5 py-0.5 rounded leading-none w-fit block mb-1">
                            {docDept?.name || 'General'}
                          </span>
                          <h3 className="text-sm font-extrabold text-slate-800 tracking-tight leading-none group-hover:text-sky-700 transition-colors">
                            {doc.name}
                          </h3>
                        </div>
                      </div>
                    </div>

                    {/* Card Content body */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      
                      <div className="space-y-2">
                        <span className="text-[10px] font-mono block text-slate-400 font-bold uppercase tracking-wider leading-none">
                          {doc.specialty}
                        </span>
                        
                        <div className="space-y-1 text-slate-600 text-xs">
                          <p className="font-bold block text-slate-700">{doc.education}</p>
                          <p className="line-clamp-3 text-[11px] text-slate-500 italic mt-1 bg-slate-50 p-3 rounded-xl border border-slate-100">
                            "{doc.bio}"
                          </p>
                        </div>
                      </div>

                      {/* Diagnostic values list */}
                      <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-100 text-[11px]">
                        <div>
                          <span className="text-[9px] text-slate-400 block font-mono uppercase font-bold">Experience</span>
                          <span className="font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded block w-fit mt-0.5 text-[10px]">
                            {doc.experience}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block font-mono uppercase font-bold">Patient Rating</span>
                          <div className="flex items-center gap-1 mt-0.5">
                            <LucideIcon name="star" className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="font-extrabold text-slate-700 text-[11px]">{doc.rating.toFixed(1)}/5</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block font-mono uppercase font-bold">Timing</span>
                          <span className="font-bold text-slate-500 block text-[10px] mt-0.5">
                            {doc.timing.split(' ')[0]} {doc.timing.split(' ')[1]}
                          </span>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block font-mono uppercase font-bold">Consult Fee</span>
                          <span className="font-extrabold text-slate-800 block text-[11px] mt-0.5">
                            ₹{doc.consultationFee}
                          </span>
                        </div>
                      </div>

                      {/* Available Days Badges */}
                      <div className="flex flex-wrap gap-1 pt-1.5">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => {
                          const isAvailable = doc.availableDays.includes(day);
                          return (
                            <span 
                              key={day} 
                              className={`text-[8px] uppercase font-bold font-mono px-1.5 py-0.5 rounded ${
                                isAvailable 
                                  ? 'bg-sky-50 text-sky-700 border border-sky-100' 
                                  : 'bg-slate-100 text-slate-300 line-through'
                              }`}
                            >
                              {day}
                            </span>
                          );
                        })}
                      </div>

                      {/* Action trigger button */}
                      <button
                        id={`btn-doc-book-${doc.id}`}
                        onClick={() => onInitiateBookingWithDoctor(doc)}
                        className="w-full bg-sky-650 hover:bg-sky-750 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all shadow-sm hover:shadow-md cursor-pointer text-center"
                      >
                        Book Appointment
                      </button>

                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div 
              id="no-doctors-found"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-16 bg-white rounded-3xl border border-slate-200 max-w-xl mx-auto"
            >
              <div className="bg-slate-50 text-slate-400 p-4 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4">
                <LucideIcon name="stethoscope" className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-slate-800 text-lg">No Matching Specialists</h3>
              <p className="text-xs text-slate-550 mt-2 block mx-auto max-w-sm">
                We couldn't find any consultants matching your query. Adjust your department filters or clear the search query.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  onSetDeptFilter('all');
                }}
                className="mt-5 text-xs font-bold bg-sky-600 text-white py-2.5 px-5 rounded-xl cursor-all-scroll shadow hover:bg-sky-700 transition-colors uppercase tracking-wider"
              >
                Reset All Filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
}
