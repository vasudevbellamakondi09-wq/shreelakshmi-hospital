/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import LucideIcon from './LucideIcon';

export default function AboutSection() {
  const stats = [
    { value: '24+', label: 'Years of Excellence', icon: 'award', bg: 'bg-white border border-slate-200/80' },
    { value: '150+', label: 'Premium Beds', icon: 'activity', bg: 'bg-sky-50 border border-sky-100 text-sky-900' },
    { value: '35+', label: 'Elite Consultants', icon: 'stethoscope', bg: 'bg-slate-900 text-white border border-transparent' },
    { value: '75K+', label: 'Families Served', icon: 'checkCircle', bg: 'bg-white border border-slate-200/80' }
  ];

  const values = [
    {
      title: 'Patient-First Focus',
      desc: 'All processes are customized around the comfort, safety, and rapid recovery of our patients.',
      color: 'bg-sky-100 text-sky-800'
    },
    {
      title: 'Clinical Distinction',
      desc: 'Top-tier board certified doctors leveraging peer-reviewed guidelines and state-of-the-art diagnostics.',
      color: 'bg-emerald-100 text-emerald-800'
    },
    {
      title: 'Integrity & Ethics',
      desc: '100% transparent billing, honest clinical recommendations, and respect for patient rights.',
      color: 'bg-amber-100 text-amber-850'
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  return (
    <section id="about" className="py-20 bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-sky-605 font-extrabold tracking-wider text-xs uppercase font-mono bg-sky-50 px-3.5 py-1.5 rounded-full inline-block border border-sky-100">
            About Our Mission
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight mt-3 font-display">
            Shrilakshmi Hospital, Bengaluru
          </h2>
          <div className="h-1.5 w-16 bg-sky-500 mx-auto mt-4 rounded-full" />
          <p className="text-slate-500 text-sm sm:text-base mt-5 leading-relaxed font-normal">
            Established in 2002, Shrilakshmi Hospital has stood as a beacon of advanced, compassionate healthcare in Bengaluru. Located in the heart of Indiranagar, we combine world-class medical innovation with human warmth.
          </p>
        </div>

        {/* Content Bento Matrix Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Legacy & Introduction Text Left Column - Span 7 */}
          <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-[32px] p-6 sm:p-8 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.02)] flex flex-col justify-between bento-card">
            <div className="space-y-6">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-800 tracking-tight leading-snug font-display">
                Pioneering Holistic Healthcare and Patient Healing Since 2002
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed font-normal">
                At Shrilakshmi Hospital, we understand that healing goes beyond prescribing medicines. Our premium 150-bed tertiary facility is designed carefully to create a stress-free environment for both patients and their families. 
              </p>
              <p className="text-sm text-slate-500 leading-relaxed font-normal">
                Equipped with a futuristic catheterization lab, continuous neonatal support wards (NICU/PICU), dynamic laminar-flow operational theaters, and 24/7 cardiac and trauma emergency response, we offer critical and preventive healthcare under a single roof.
              </p>
            </div>

            {/* Checklist elements block */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-start gap-2.5">
                <div className="bg-sky-50 text-sky-600 p-1 rounded-lg mt-0.5">
                  <LucideIcon name="check" className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-tight">Clinical Trauma ER</h4>
                  <p className="text-[11px] text-slate-450 mt-0.5">Available 24 hours with continuous super-specialists cover.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="bg-sky-50 text-sky-600 p-1 rounded-lg mt-0.5">
                  <LucideIcon name="check" className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-tight">Ultra-Modern Suites</h4>
                  <p className="text-[11px] text-slate-450 mt-0.5">Infection-controlled laminar-flow operational theaters.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="bg-sky-50 text-sky-600 p-1 rounded-lg mt-0.5">
                  <LucideIcon name="check" className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-tight">Empathetic Nursing</h4>
                  <p className="text-[11px] text-slate-450 mt-0.5">Highly-trained resident nursing system at the bedside.</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="bg-sky-50 text-sky-600 p-1 rounded-lg mt-0.5">
                  <LucideIcon name="check" className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-xs uppercase tracking-tight">In-House Diagnostics</h4>
                  <p className="text-[11px] text-slate-450 mt-0.5">In-house MRI, CT scanner, Ultrasound, and quick path-lab responses.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Location Callout Right Column - Span 5 */}
          <div className="lg:col-span-5 bg-[#1E293B] text-white rounded-[32px] p-6 sm:p-8 shadow-sm flex flex-col justify-between relative overflow-hidden bento-card">
            <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl" />
            
            <div>
              <div className="flex items-center gap-2 bg-slate-800 text-sky-350 text-[10px] font-bold font-mono px-3 py-1 rounded-full border border-slate-700 w-fit mb-6">
                <LucideIcon name="mapPin" className="w-3.5 h-3.5" />
                <span>Prime Bengaluru Campus</span>
              </div>
              
              <h4 className="text-lg font-bold text-white mb-2 font-display">Reach our Indiranagar Center</h4>
              <p className="text-slate-400 text-xs leading-relaxed mb-6">
                Conveniently situated in Bengaluru's dynamic hub, our campus offers ample visitor parking, direct high-speed vehicular stretcher entry points, wheelchair-friendly hallways, and ambient green resting space.
              </p>
            </div>
            
            <div className="space-y-4 border-t border-slate-800 pt-6">
              <div className="flex items-start gap-3">
                <div className="bg-slate-800 text-sky-400 p-2 rounded-xl mt-0.5">
                  <LucideIcon name="mapPin" className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-200 block text-xs uppercase tracking-wider">Campus Address</span>
                  <span className="text-xs text-slate-300 block leading-relaxed mt-1">
                    #45, 12th Main Road, Indiranagar, Near Metro Station, Bengaluru, Karnataka - 560038
                  </span>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="bg-slate-800 text-sky-400 p-2 rounded-xl mt-0.5">
                  <LucideIcon name="clock" className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-200 block text-xs uppercase tracking-wider">Operational Hours</span>
                  <span className="text-xs text-slate-300 block mt-1">
                    OPD: 09:00 AM - 08:00 PM | Emergency Desk: open 24 Hours
                  </span>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="bg-slate-800 text-sky-400 p-2 rounded-xl mt-0.5">
                  <LucideIcon name="mail" className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-slate-200 block text-xs uppercase tracking-wider">Email Correspondence</span>
                  <a href="mailto:info@shrilakshmihospital.in" className="text-xs text-sky-305 font-semibold hover:underline block mt-0.5">
                    info@shrilakshmihospital.in
                  </a>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Stats Grid Segment */}
        <motion.div 
          id="hospital-stats"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-16"
        >
          {stats.map((stat, i) => (
            <motion.div 
              key={i} 
              variants={itemVariants}
              className={`p-6 rounded-3xl text-center bento-card ${stat.bg}`}
            >
              <div className="mx-auto bg-sky-505/10 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border border-slate-100">
                <LucideIcon name={stat.icon} className="w-5.5 h-5.5 text-sky-600" />
              </div>
              <span className="font-sans text-2xl sm:text-3xl font-extrabold tracking-tight block font-display">{stat.value}</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase font-mono mt-1 pr-1 block leading-tight">{stat.label}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Core Values / Pillars Segment */}
        <div id="hospital-values" className="mt-16">
          <h4 className="text-xs font-bold text-slate-400 tracking-wider font-mono text-center mb-10 uppercase">
            Our Core Healthcare Pillars
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div key={i} className="bg-white p-8 rounded-[28px] border border-slate-200/80 shadow-sm relative bento-card flex flex-col justify-between">
                <div>
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono font-bold mb-6 ${v.color}`}>
                    0{i + 1}
                  </div>
                  <h5 className="font-bold text-slate-800 text-sm uppercase tracking-tight mb-2">{v.title}</h5>
                  <p className="text-slate-500 text-xs leading-relaxed">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
