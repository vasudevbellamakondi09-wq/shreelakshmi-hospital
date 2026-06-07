/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Heart,
  Bone,
  Baby,
  Brain,
  Sparkles,
  Activity,
  MapPin,
  Phone,
  Mail,
  Clock,
  Calendar,
  Award,
  Star,
  Check,
  CheckCircle,
  Stethoscope,
  ChevronRight,
  Info,
  AlertCircle,
  Trash2,
  Filter,
  Search,
  User,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

interface LucideIconProps {
  name: string;
  className?: string;
  size?: number;
}

export default function LucideIcon({ name, className = "w-5 h-5", size }: LucideIconProps) {
  const iconProps = { className, size };

  switch (name.toLowerCase()) {
    case 'heart':
      return <Heart {...iconProps} />;
    case 'bone':
      return <Bone {...iconProps} />;
    case 'baby':
      return <Baby {...iconProps} />;
    case 'brain':
      return <Brain {...iconProps} />;
    case 'sparkles':
      return <Sparkles {...iconProps} />;
    case 'activity':
      return <Activity {...iconProps} />;
    case 'mappin':
      return <MapPin {...iconProps} />;
    case 'phone':
      return <Phone {...iconProps} />;
    case 'mail':
      return <Mail {...iconProps} />;
    case 'clock':
      return <Clock {...iconProps} />;
    case 'calendar':
      return <Calendar {...iconProps} />;
    case 'award':
      return <Award {...iconProps} />;
    case 'star':
      return <Star {...iconProps} />;
    case 'check':
      return <Check {...iconProps} />;
    case 'checkcircle':
      return <CheckCircle {...iconProps} />;
    case 'stethoscope':
      return <Stethoscope {...iconProps} />;
    case 'chevronright':
      return <ChevronRight {...iconProps} />;
    case 'info':
      return <Info {...iconProps} />;
    case 'alertcircle':
      return <AlertCircle {...iconProps} />;
    case 'trash2':
      return <Trash2 {...iconProps} />;
    case 'filter':
      return <Filter {...iconProps} />;
    case 'search':
      return <Search {...iconProps} />;
    case 'user':
      return <User {...iconProps} />;
    case 'shieldalert':
      return <ShieldAlert {...iconProps} />;
    case 'arrowright':
      return <ArrowRight {...iconProps} />;
    default:
      return <Stethoscope {...iconProps} />;
  }
}
