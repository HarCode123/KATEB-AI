/**
 * Types and Dummy Data for Kateb AI - Arabic Medical Assistant
 */

export type RoutePath = 
  | '/' 
  | '/login' 
  | '/signup'
  | '/dashboard' 
  | '/emr-records' 
  | '/patients'
  | '/patient-dashboard'
  | '/patient-history'
  | '/patient-prescriptions'
  | '/patient-appointments'
  | '/patient-notifications'
  | '/patient-profile';

export type UserRole = 'doctor' | 'patient';

export interface PatientRecord {
  sNo: number;
  patientId: string;
  patientName: string;
  age: number;
  gender: 'Male' | 'Female';
  visitDate: string;
  diagnosis: string;
  prescription: string;
  followUpDate: string;
}

export const DUMMY_RECORDS: PatientRecord[] = [];
