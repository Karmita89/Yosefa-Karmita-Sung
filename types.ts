export enum ActivityType {
  CHECK_IN = 'CHECK_IN',
  CHECK_OUT = 'CHECK_OUT',
  DAILY_REPORT = 'DAILY_REPORT',
  EXTRA = 'EXTRA'
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  role: 'STUDENT' | 'ADMIN';
}

export interface AttendanceRecord {
  id: string;
  userId: string;
  type: ActivityType;
  timestamp: number;
  description?: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  photoEvidence?: string; // base64 or url
  aiGeneratedSummary?: boolean;
}

export interface NavItem {
  label: string;
  icon: string;
  id: string;
}