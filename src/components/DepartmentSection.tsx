/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Department } from '../types';
import { DEPARTMENTS } from '../data';
import LucideIcon from './LucideIcon';

interface DepartmentSectionProps {
  onSelectDepartmentForDoctors: (deptId: string) => void;
  onSelectDepartmentForBooking: (deptId: string) => void;
}

export default function DepartmentSection({ 
  onSelectDepartmentForDoctors,
  onSelectDepartmentForBooking 
}: DepartmentSectionProps) {
  const [selectedDeptId, setSelectedDeptId] = useState<string | null>(DEPARTMENTS[0].id);

  const activeDept = DEPARTMENTS.find(d => d.id === selectedDeptId) || DEPARTMENTS[0];

  return (
    <section id="departments" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sky-605 font-extrabold tracking-wider text-xs uppercase font-mono bg-sky-50 px-3.5 py-1.5 rounded-full inline-block border border-sky-100">
            Clinical Excellence
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mt-3 font-display">
            Our Medical Departments
          </h2>
          <div className="h-1.5 w-16 bg-sky-500 mx-auto mt-4 rounded-full" />
          <p className="text-slate-500 text-sm mt-4 font-normal max-w-2xl mx-auto leading-relaxed">
            Shrilakshmi Hospital provides state-of-the-art diagnostics and inpatient amenities across standard clinical niches. Explore our clinical capacities below.
          </p>
        </div>

        {/* Dynamic Interactive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Department List - Left Column */}
          <div className="lg:col-span-4 bg-slate-50/50 border border-slate-200/60 p-4 rounded-[32px] space-y-2.5 shadow-sm bento-card">
            <span className="text-[10px] uppercase font-mono text-slate-400 font-bold tracking-wider pl-2 py-1 block">
              Clinical Branches
            </span>
            {DEPARTMENTS.map((dept) => {
              const isSelected = dept.id === selectedDeptId;
              return (
                <button
                  key={dept.id}
                  id={`dept-tab-${dept.id}`}
                  onClick={() => setSelectedDeptId(dept.id)}
                  className={`w-full flex items-center justify-between text-left px-4 py-3.5 rounded-2xl transition-all duration-200 border group ${
                    isSelected 
                      ? 'bg-sky-600 text-white border-sky-600 shadow-md shadow-sky-100 font-semibold' 
                      : 'bg-white text-slate-600 hover:text-sky-650 hover:bg-sky-50/30 border-slate-200/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl transition-colors ${
                      isSelected ? 'bg-white/15 text-white' : 'bg-slate-50 text-slate-500 group-hover:text-sky-600'
                    }`}>
                      <LucideIcon name={dept.iconName} className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="font-bold block text-xs uppercase tracking-tight leading-none">{dept.name}</span>
                      <span className={`text-[10px] block mt-1 font-mono ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                        {dept.bedCapacity || 'Multiple'} Beds capacity
                      </span>
                    </div>
                  </div>
                  <LucideIcon 
                    name="chevronRight" 
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      isSelected ? 'translate-x-1 text-white' : 'text-slate-400 group-hover:text-sky-500'
                    }`} 
                  />
                </button>
              );
            })}
          </div>

          {/* Department Detail Sheet Panels - Right Column */}
          <div className="lg:col-span-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeDept.id}
                id={`dept-detail-${activeDept.id}`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-[32px] p-6 sm:p-10 border border-slate-200/85 shadow-sm relative overflow-hidden bento-card"
              >
                
                {/* Background Accent */}
                <div className="absolute top-0 right-0 w-44 h-44 bg-sky-500/5 rounded-full blur-3xl pointer-events-none" />

                {/* Header of Detail Panel */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="bg-sky-50 text-sky-600 p-3 rounded-2xl border border-sky-100">
                      <LucideIcon name={activeDept.iconName} className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[9px] tracking-wider uppercase font-mono font-bold text-sky-700 bg-sky-50 border border-sky-100/50 px-2 py-0.5 rounded-md inline-block">
                        Clinical Core
                      </span>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight mt-1 font-display">
                        {activeDept.name} Department
                      </h3>
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-mono block font-bold leading-none">
                      Department Head & Chief
                    </span>
                    <span className="text-xs font-bold text-slate-700 block mt-1.5 bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
                      {activeDept.headOfDept}
                    </span>
                  </div>
                </div>

                {/* Primary Description */}
                <div className="py-6">
                  <h4 className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-2">Scope of Practice</h4>
                  <p className="text-slate-500 text-sm leading-relaxed font-normal">
                    {activeDept.description}
                  </p>
                </div>

                {/* Specializations list & check bullets */}
                <div className="pb-8">
                  <h4 className="text-[10px] font-mono uppercase text-slate-400 font-bold mb-4">Highlights & Support Facilities</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeDept.detailedNeeds.map((need, index) => (
                      <div key={index} className="flex items-start gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-150 shadow-sm hover:border-slate-200 transition-colors">
                        <div className="bg-sky-50 text-sky-600 p-1 rounded-lg mt-0.5">
                          <LucideIcon name="check" className="w-3.5 h-3.5 animate-pulse" />
                        </div>
                        <span className="text-xs font-bold text-slate-650 leading-normal">{need}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Fast Navigation Callouts Foot-Bar */}
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-slate-100">
                  <button
                    id={`btn-viewdoc-${activeDept.id}`}
                    onClick={() => onSelectDepartmentForDoctors(activeDept.id)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 border border-slate-200 hover:border-sky-600 text-slate-600 hover:text-sky-700 hover:bg-sky-50/20 py-3 px-5 rounded-2xl text-xs uppercase tracking-wider font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                  >
                    <LucideIcon name="user" className="w-4 h-4" />
                    <span>Consult Specialists</span>
                  </button>

                  <button
                    id={`btn-bookdept-${activeDept.id}`}
                    onClick={() => onSelectDepartmentForBooking(activeDept.id)}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 bg-sky-600 text-white hover:bg-sky-700 font-bold py-3 px-5 rounded-2xl text-xs uppercase tracking-wider transition-all shadow-md shadow-sky-100 active:scale-95 cursor-pointer"
                  >
                    <LucideIcon name="calendar" className="w-4 h-4" />
                    <span>Instant Booking</span>
                  </button>
                </div>

              </motion.div>
            </AnimatePresence>
          </div>

        </div>

      </div>
    </section>
  );
}
