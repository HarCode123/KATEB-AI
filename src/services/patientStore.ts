import { ClinicalPrescription } from '../backend/services/PrescriptionService';

export interface AppointmentItem {
  id: string;
  doctorName: string;
  department: string;
  hospital: string;
  date: string;
  time: string;
  status: 'Confirmed' | 'Pending' | 'Completed' | 'Cancelled';
  notes?: string;
}

export interface PatientNotificationItem {
  id: string;
  title: string;
  message: string;
  date: string;
  time: string;
  read: boolean;
  type: 'appointment' | 'prescription' | 'followup' | 'lab';
}

export interface DoctorConsultedItem {
  doctorName: string;
  department: string;
  visitCount: number;
  lastVisitDate: string;
}

export interface MedicalTimelineItem {
  year: string;
  events: { title: string; date: string; category: string }[];
}

export interface PatientProfileData {
  photoUrl?: string;
  patientId: string;
  name: string;
  age: string;
  gender: 'Male' | 'Female';
  bloodGroup: string;
  phone: string;
  email: string;
  emergencyContact: string;
  address: string;
  medicalConditions: string;
  allergies: string;
  height: string;
  weight: string;
  bmi: string;
}

const STORAGE_KEY_PROFILE = 'kateb_patient_profile';
const STORAGE_KEY_APPOINTMENTS = 'kateb_patient_appointments';
const STORAGE_KEY_PRESCRIPTIONS = 'kateb_patient_prescriptions';
const STORAGE_KEY_NOTIFICATIONS = 'kateb_patient_notifications';

// Initial realistic default data for Harini Al-Mansoor
export const DEFAULT_PATIENT_PROFILE: PatientProfileData = {
  patientId: 'PID-2026-001',
  name: 'Harini Al-Mansoor',
  age: '28',
  gender: 'Female',
  bloodGroup: 'O+',
  phone: '+966 50 123 4567',
  email: 'harini@kateb.ai',
  emergencyContact: '+966 55 987 6543 (Rashid Al-Mansoor - Spouse)',
  address: 'King Fahd Road, District 4, Riyadh, Saudi Arabia',
  medicalConditions: 'Mild Essential Hypertension',
  allergies: 'Penicillin (Mild skin rash)',
  height: '165 cm',
  weight: '62 kg',
  bmi: '22.8 (Normal)'
};

export const INITIAL_PRESCRIPTIONS: ClinicalPrescription[] = [
  {
    patientDetails: {
      patientName: 'Harini Al-Mansoor',
      patientId: 'PID-2026-001',
      age: '28',
      gender: 'Female',
      height: '165 cm',
      weight: '62 kg',
      bmi: '22.8 (Normal)',
      bloodGroup: 'O+',
      date: '2026-07-28',
      consultingDoctor: 'Dr. Harini, MD (Internal Medicine)'
    },
    vitals: {
      temperature: '38.6 °C',
      bloodPressure: '118/76 mmHg',
      pulse: '82 bpm',
      respiratoryRate: '18 /min',
      spo2: '98%'
    },
    chiefComplaint: 'Severe dry cough for 4 days keeping patient awake at night, with high fever since yesterday.',
    historyOfPresentIllness: '28-year-old female presents with acute onset non-productive cough, mild pleuritic chest tightness, and febrile episodes up to 38.6°C. No night sweats or hemoptysis.',
    pastMedicalHistory: 'Mild Hypertension',
    allergies: 'Penicillin (Mild skin rash)',
    clinicalExamination: 'Chest auscultation: Clear breath sounds bilaterally with mild scattered rhonchi. No focal crepitations or wheezing.',
    provisionalDiagnosis: 'Acute Bronchitis & Viral Upper Respiratory Infection',
    investigationsAdvised: 'Complete Blood Count (CBC) with differential, Chest X-Ray (PA View)',
    medications: [
      {
        medicineName: 'Azithromycin Tablet',
        strength: '500 mg',
        dosage: '1 Tablet',
        frequency: 'Once Daily (QD)',
        duration: '5 Days',
        instructions: 'Take after meals. Avoid antacids within 2 hours.'
      },
      {
        medicineName: 'Paracetamol Tablet',
        strength: '650 mg',
        dosage: '1 Tablet',
        frequency: 'Twice Daily (BID)',
        duration: '3 Days',
        instructions: 'Take after food as needed for fever and body ache.'
      },
      {
        medicineName: 'Levosalbutamol Syrup',
        strength: '1 mg/5 ml',
        dosage: '5 ml',
        frequency: 'Three Times Daily (TID)',
        duration: '5 Days',
        instructions: 'Take for bronchodilation and cough relief.'
      }
    ],
    lifestyleDietAdvice: 'Maintain adequate hydration (2-3L warm water/herbal tea per day). Get full bed rest. Avoid cold carbonated drinks.',
    followUp: 'Follow up in 5 days (02 Aug 2026) for lung re-evaluation, or immediately if breathlessness develops.',
    doctorsNotes: 'Patient advised to complete full course of Azithromycin. Monitor temperature twice daily.'
  }
];

export const INITIAL_APPOINTMENTS: AppointmentItem[] = [
  {
    id: 'apt-001',
    doctorName: 'Dr. Harini, MD',
    department: 'Internal Medicine',
    hospital: 'Kateb Clinical Medical Center',
    date: '02 Aug 2026',
    time: '10:00 AM',
    status: 'Confirmed',
    notes: '5-Day Post-Bronchitis lung re-evaluation follow-up.'
  }
];

export const INITIAL_NOTIFICATIONS: PatientNotificationItem[] = [
  {
    id: 'notif-001',
    title: 'Upcoming Appointment Reminder',
    message: 'Your follow-up appointment with Dr. Harini, MD is scheduled for 02 Aug 2026 at 10:00 AM in Internal Medicine.',
    date: '2026-07-31',
    time: '09:00 AM',
    read: false,
    type: 'appointment'
  },
  {
    id: 'notif-002',
    title: 'New Digital Prescription Available',
    message: 'Dr. Harini, MD has issued a new prescription for Acute Bronchitis & Viral Infection. Click to view or download PDF.',
    date: '2026-07-28',
    time: '10:30 AM',
    read: false,
    type: 'prescription'
  },
  {
    id: 'notif-003',
    title: 'Follow-Up Notice Due',
    message: 'Your chest re-evaluation follow-up is scheduled on 02 Aug 2026. Please ensure you take medications as directed.',
    date: '2026-07-28',
    time: '10:35 AM',
    read: true,
    type: 'followup'
  },
  {
    id: 'notif-004',
    title: 'Lab Report Uploaded',
    message: 'Your Complete Blood Count (CBC) and Chest X-Ray diagnostic results have been uploaded to your EMR file.',
    date: '2026-07-29',
    time: '02:15 PM',
    read: true,
    type: 'lab'
  }
];

// Helper methods for Patient Data Management
export class PatientDataStore {
  static getProfile(): PatientProfileData {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return DEFAULT_PATIENT_PROFILE;
  }

  static saveProfile(profile: PatientProfileData): void {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(profile));
    } catch (e) {}
  }

  static getPrescriptions(): ClinicalPrescription[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_PRESCRIPTIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_PRESCRIPTIONS;
  }

  static addPrescription(prescription: ClinicalPrescription): void {
    const list = this.getPrescriptions();
    // Prepend newest prescription
    const updated = [prescription, ...list];
    try {
      localStorage.setItem(STORAGE_KEY_PRESCRIPTIONS, JSON.stringify(updated));
    } catch (e) {}

    // Auto-create notification
    this.addNotification({
      id: `notif-${Date.now()}`,
      title: 'New Digital Prescription Issued',
      message: `Dr. ${prescription.patientDetails.consultingDoctor || 'Harini, MD'} has uploaded a new prescription for ${prescription.provisionalDiagnosis || 'Consultation'}.`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'prescription'
    });

    // Auto-create upcoming appointment if follow up specified
    if (prescription.followUp && prescription.followUp.length > 3) {
      this.addAppointment({
        id: `apt-${Date.now()}`,
        doctorName: prescription.patientDetails.consultingDoctor || 'Dr. Harini, MD',
        department: 'Internal Medicine',
        hospital: 'Kateb Clinical Medical Center',
        date: prescription.followUp.includes('(') ? prescription.followUp.split('(')[1].replace(')', '') : 'In 7 Days',
        time: '10:00 AM',
        status: 'Confirmed',
        notes: `Follow-up for ${prescription.provisionalDiagnosis || 'recent consultation'}.`
      });
    }

    // Trigger custom event for UI re-render
    window.dispatchEvent(new CustomEvent('patient-data-updated'));
  }

  static getAppointments(): AppointmentItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPOINTMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_APPOINTMENTS;
  }

  static addAppointment(apt: AppointmentItem): void {
    const list = this.getAppointments();
    const updated = [apt, ...list];
    try {
      localStorage.setItem(STORAGE_KEY_APPOINTMENTS, JSON.stringify(updated));
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('patient-data-updated'));
  }

  static getNotifications(): PatientNotificationItem[] {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_NOTIFICATIONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return INITIAL_NOTIFICATIONS;
  }

  static addNotification(notif: PatientNotificationItem): void {
    const list = this.getNotifications();
    const updated = [notif, ...list];
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('patient-data-updated'));
  }

  static markNotificationRead(id: string): void {
    const list = this.getNotifications();
    const updated = list.map(n => n.id === id ? { ...n, read: true } : n);
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('patient-data-updated'));
  }

  static markAllNotificationsRead(): void {
    const list = this.getNotifications();
    const updated = list.map(n => ({ ...n, read: true }));
    try {
      localStorage.setItem(STORAGE_KEY_NOTIFICATIONS, JSON.stringify(updated));
    } catch (e) {}
    window.dispatchEvent(new CustomEvent('patient-data-updated'));
  }

  static getDoctorsConsulted(): DoctorConsultedItem[] {
    const prescriptions = this.getPrescriptions();
    const map = new Map<string, { dept: string; count: number; date: string }>();

    prescriptions.forEach(p => {
      const doc = p.patientDetails.consultingDoctor || 'Dr. Harini, MD';
      const dept = doc.includes('Endocrinology') ? 'Endocrinology' : doc.includes('Cardiology') ? 'Cardiology' : doc.includes('Gastroenterology') ? 'Gastroenterology' : 'Internal Medicine';
      const date = p.patientDetails.date;

      if (!map.has(doc)) {
        map.set(doc, { dept, count: 1, date });
      } else {
        const curr = map.get(doc)!;
        map.set(doc, { dept: curr.dept, count: curr.count + 1, date: curr.date > date ? curr.date : date });
      }
    });

    const result: DoctorConsultedItem[] = [];
    map.forEach((val, key) => {
      result.push({
        doctorName: key,
        department: val.dept,
        visitCount: val.count,
        lastVisitDate: val.date
      });
    });

    return result;
  }

  static getMedicalHistoryTimeline(): MedicalTimelineItem[] {
    return [
      {
        year: '2026',
        events: [
          { title: 'Acute Bronchitis & High Fever Consultation', date: '28 Jul 2026', category: 'Prescription & Diagnosis' },
          { title: 'CBC & Chest X-Ray Diagnostic Imaging', date: '29 Jul 2026', category: 'Laboratory Report' },
          { title: 'Routine Medical Wellness Review', date: '10 Jan 2026', category: 'General Screening' }
        ]
      },
      {
        year: '2025',
        events: [
          { title: 'Comprehensive Blood Panel & Lipid Profile', date: '15 Nov 2025', category: 'Laboratory Report' },
          { title: 'Annual Health Checkup & Allergy Assessment', date: '12 Jun 2025', category: 'Wellness Visit' }
        ]
      }
    ];
  }
}
