/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface HospitalLogoProps {
  className?: string;
  size?: number | string;
}

export default function HospitalLogo({ className = '', size = '2.5rem' }: HospitalLogoProps) {
  // Deep charcoal and crimson red palette matching the sent photo exactly
  const charcoalColor = '#334155'; // Clean zinc/slate-700
  const crimsonColor = '#DC2626'; // Vibrant medical red-600

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`flex-shrink-0 select-none ${className}`}
    >
      {/* Outer circular frame in high-contrast charcoal */}
      <circle
        cx="50"
        cy="50"
        r="44"
        fill="none"
        stroke={charcoalColor}
        strokeWidth="6"
      />
      
      {/* Top-Right Charcoal Crescent Loop */}
      <path
        d="M 50 16 
           C 66 16, 78 28, 76 43 
           C 74 53, 62 49, 58 41 
           C 54 31, 44 26, 37 30 
           C 35 31, 34 27, 37 25 
           C 41 21, 45 16, 50 16 Z"
        fill={charcoalColor}
      />
      
      {/* Bottom-Left Charcoal Crescent Loop (Perfect 180-degree rotational symmetry) */}
      <path
        d="M 50 84 
           C 34 84, 22 72, 24 57 
           C 26 47, 38 51, 42 59 
           C 46 69, 56 74, 63 70 
           C 65 69, 66 73, 63 75 
           C 59 79, 55 84, 50 84 Z"
        fill={charcoalColor}
      />
      
      {/* Central Scarlet Red Elegant "S" Spine (Perfect 180-degree rotational symmetry) */}
      <path
        d="M 33,35 
           C 37,27 45,34 50,44 
           C 55,54 63,73 67,65 
           C 63,73 55,66 50,56 
           C 45,46 37,27 33,35 Z"
        fill={crimsonColor}
      />
    </svg>
  );
}
