import React, { useState, useEffect } from 'react';
import { Calendar, FileText, UserCheck, HeartPulse, Clock, ChevronRight, Eye, Download, ShieldAlert, Sparkles, CheckCircle2, ArrowUpRight, Activity } from 'lucide-react';
import { PatientDataStore, PatientProfileData, AppointmentItem, DoctorConsultedItem, MedicalTimelineItem } from '../../services/patientStore';
import { ClinicalPrescription } from '../../backend/services/PrescriptionService';
import { PrescriptionModal } from './PrescriptionModal';
import { useLanguage } from '../../LanguageContext';
import { RoutePath } from '../../types';

interface PatientDashboardViewProps {
  onNavigate: (route: RoutePath) => void;
}

export const PatientDashboardView: React.FC<PatientDashboardViewProps> = ({ onNavigate }) => {
  const { language, isRtl } = useLanguage();

  const [profile, setProfile] = useState<PatientProfileData>(PatientDataStore.getProfile());
  const [appointments, setAppointments] = useState<AppointmentItem[]>(PatientDataStore.getAppointments());
  const [prescriptions, setPrescriptions] = useState<ClinicalPrescription[]>(PatientDataStore.getPrescriptions());
  const [doctors, setDoctors] = useState<DoctorConsultedItem[]>(PatientDataStore.getDoctorsConsulted());
  const [timeline, setTimeline] = useState<MedicalTimelineItem[]>(PatientDataStore.getMedicalHistoryTimeline());

  // Modal State
  const [selectedPrescription, setSelectedPrescription] = useState<ClinicalPrescription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshData = () => {
    setProfile(PatientDataStore.getProfile());
    setAppointments(PatientDataStore.getAppointments());
    setPrescriptions(PatientDataStore.getPrescriptions());
    setDoctors(PatientDataStore.getDoctorsConsulted());
    setTimeline(PatientDataStore.getMedicalHistoryTimeline());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('patient-data-updated', refreshData);
    return () => window.removeEventListener('patient-data-updated', refreshData);
  }, []);

  const upcomingAppointments = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending');
  const nextAppointment = upcomingAppointments[0];
  const latestPrescription = prescriptions[0];

  const handleOpenPrescription = (rx: ClinicalPrescription) => {
    setSelectedPrescription(rx);
    setIsModalOpen(true);
  };

  const handleDownloadPdf = (rx: ClinicalPrescription) => {
    setSelectedPrescription(rx);
    setIsModalOpen(true);
  };

  return (
    <div id="patient-dashboard-view" className="space-y-8 max-w-7xl mx-auto w-full animate-fade-in text-left rtl:text-right">
      
      {/* 1. WELCOME BANNER & HEALTH SUMMARY */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 text-xs text-brand-text-secondary font-medium mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-blue-50 text-[#0F4C81] border border-blue-100 font-bold">
              {language === 'ar' ? 'بوابة المريض' : 'Patient Portal'}
            </span>
            <span>&bull;</span>
            <span className="text-[#0F4C81] font-mono">{profile.patientId}</span>
          </div>
          <h2 className="text-3xl font-bold text-[#1F2937]">
            {language === 'ar' ? `أهلاً بك، ${profile.name.split(' ')[0]}` : `Welcome, ${profile.name.split(' ')[0]}`}
          </h2>
          <p className="text-[#6B7280]">
            {language === 'ar' 
              ? 'مرحباً بك في نظام كاتب الذكي للرعاية الصحية. يمكنك الاطلاع على المواعيد، الوصفات الطبية، والسجل الطبي مباشرة.' 
              : 'Access your upcoming clinical appointments, digital prescriptions, and medical records in real-time.'}
          </p>
        </div>

        {/* Quick Health Status Info Bar */}
        <div className="flex items-center gap-4 shrink-0 bg-[#F8FAFC] p-4 rounded-xl border border-brand-border">
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-200">
            <HeartPulse className="h-6 w-6 text-emerald-600 animate-pulse" />
          </div>
          <div className="text-xs">
            <div className="flex items-center gap-1.5 font-bold text-[#1F2937]">
              <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              <span>{language === 'ar' ? 'حساب المريض متزامن' : 'EHR Patient Account Active'}</span>
            </div>
            <p className="text-[#6B7280] mt-0.5 font-medium">
              {language === 'ar' ? `فصيلة الدم: ${profile.bloodGroup} | العمر: ${profile.age}` : `Blood Group: ${profile.bloodGroup} | Age: ${profile.age}`}
            </p>
          </div>
        </div>
      </div>

      {/* 2. MAIN DASHBOARD CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* CARD A: UPCOMING APPOINTMENT */}
        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 text-[#0F4C81] rounded-xl">
                <Calendar className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-[#1F2937]">
                {language === 'ar' ? 'الموعد القادم' : 'Upcoming Appointment'}
              </h3>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              {nextAppointment ? nextAppointment.status : (language === 'ar' ? 'لا يوجد' : 'None')}
            </span>
          </div>

          {nextAppointment ? (
            <div className="space-y-3 bg-[#F8FAFC] p-4 rounded-xl border border-brand-border">
              <div>
                <p className="text-xs text-[#6B7280] font-medium uppercase tracking-wider">{language === 'ar' ? 'اسم الطبيب' : 'Doctor Name'}</p>
                <p className="font-extrabold text-base text-[#0F4C81]">{nextAppointment.doctorName}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[#6B7280] font-medium">{language === 'ar' ? 'القسم' : 'Department'}</p>
                  <p className="font-bold text-[#1F2937]">{nextAppointment.department}</p>
                </div>
                <div>
                  <p className="text-[#6B7280] font-medium">{language === 'ar' ? 'الحالة' : 'Status'}</p>
                  <p className="font-bold text-emerald-700">{nextAppointment.status}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5 text-slate-700 font-bold">
                  <Clock className="h-3.5 w-3.5 text-[#0F4C81]" />
                  <span>{nextAppointment.date} &bull; {nextAppointment.time}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 italic bg-[#F8FAFC] rounded-xl border border-dashed border-slate-200">
              {language === 'ar' ? 'لا توجد مواعيد قادمة' : 'No Upcoming Appointments.'}
            </div>
          )}

          <button
            onClick={() => onNavigate('/patient-appointments')}
            className="w-full py-2.5 bg-[#F8FAFC] hover:bg-blue-50 text-[#0F4C81] border border-blue-100 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{language === 'ar' ? 'عرض جميع المواعيد' : 'View All Appointments'}</span>
            <ChevronRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {/* CARD B: LATEST PRESCRIPTION */}
        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-[#1F2937]">
                {language === 'ar' ? 'أحدث وصفة طبية' : 'Latest Prescription'}
              </h3>
            </div>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2 py-0.5 rounded-md font-mono">
              {latestPrescription ? latestPrescription.patientDetails.date : 'N/A'}
            </span>
          </div>

          {latestPrescription ? (
            <div className="space-y-3 bg-[#F8FAFC] p-4 rounded-xl border border-brand-border">
              <div>
                <p className="text-xs text-[#6B7280] font-medium">{language === 'ar' ? 'التشخيص الرئيسي' : 'Primary Diagnosis'}</p>
                <p className="font-bold text-sm text-slate-900 bg-white p-2 rounded-lg border border-slate-200 mt-1">
                  {latestPrescription.provisionalDiagnosis}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span className="font-medium">{latestPrescription.patientDetails.consultingDoctor}</span>
                <span className="font-mono text-[#0F4C81] font-bold">{latestPrescription.medications?.length || 0} Meds</span>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-xs text-slate-400 italic bg-[#F8FAFC] rounded-xl border border-dashed border-slate-200">
              {language === 'ar' ? 'لا توجد وصفات طبية متاحة' : 'No prescriptions available.'}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => latestPrescription && handleOpenPrescription(latestPrescription)}
              disabled={!latestPrescription}
              className="flex-1 py-2.5 bg-[#0F4C81] hover:bg-[#0c3c66] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <Eye className="h-3.5 w-3.5" />
              <span>{language === 'ar' ? 'عرض الوصفة' : 'View Prescription'}</span>
            </button>

            <button
              onClick={() => latestPrescription && handleDownloadPdf(latestPrescription)}
              disabled={!latestPrescription}
              className="px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1 cursor-pointer disabled:opacity-50"
              title={language === 'ar' ? 'تحميل ملف PDF' : 'Download PDF'}
            >
              <Download className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* CARD C: DOCTOR CONSULTED */}
        <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 text-emerald-700 rounded-xl">
                <UserCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-[#1F2937]">
                {language === 'ar' ? 'الطبيب المباشر' : 'Doctor Consulted'}
              </h3>
            </div>
            <span className="text-xs font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
              1 Doctor
            </span>
          </div>

          <div className="space-y-2.5">
            {doctors.length > 0 ? (
              doctors.slice(0, 1).map((doc, idx) => (
                <div key={idx} className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-200 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-900 text-sm">{doc.doctorName}</p>
                      <p className="text-[#0F4C81] font-semibold">{doc.department}</p>
                    </div>
                    <span className="font-mono font-bold text-[#0F4C81] bg-blue-50 px-2.5 py-1 rounded border border-blue-100">
                      {prescriptions.length || doc.visitCount || 1} {language === 'ar' ? 'استشارات' : 'Consultations'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {language === 'ar' ? 'آخر استشارة:' : 'Last Visit:'} {latestPrescription ? latestPrescription.patientDetails.date : doc.lastVisitDate}
                  </p>
                </div>
              ))
            ) : (
              <div className="p-4 bg-[#F8FAFC] rounded-xl border border-slate-200 text-xs space-y-2">
                <p className="font-bold text-slate-900 text-sm">Dr. Harini, MD</p>
                <p className="text-[#0F4C81] font-semibold">Internal Medicine</p>
                <p className="text-[10px] text-slate-400 font-mono">Total Consultations: {prescriptions.length || 1}</p>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigate('/patient-history')}
            className="w-full py-2.5 bg-[#F8FAFC] hover:bg-emerald-50 text-emerald-800 border border-emerald-200 font-semibold text-xs rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{language === 'ar' ? 'عرض سجل الاستشارات' : 'Consultation History'}</span>
            <ChevronRight className={`h-4 w-4 ${isRtl ? 'rotate-180' : ''}`} />
          </button>
        </div>

      </div>

      {/* 3. SECONDARY DASHBOARD SECTION: PREVIOUS VISITS & MEDICAL HISTORY TIMELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* LEFT 7 COLS: PREVIOUS VISITS / CONSULTATIONS LIST */}
        <div className="lg:col-span-7 bg-white border border-brand-border rounded-2xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
            <h3 className="font-bold text-lg text-[#1F2937] flex items-center gap-2">
              <Activity className="h-5 w-5 text-[#0F4C81]" />
              <span>{language === 'ar' ? 'الاستشارات السابقة' : 'Consultations & EMR Records'}</span>
            </h3>
            <span className="text-xs text-slate-500 font-medium">Real-time records from EMR</span>
          </div>

          <div className="space-y-3">
            {prescriptions.length > 0 ? (
              prescriptions.map((rx, idx) => (
                <div
                  key={idx}
                  onClick={() => handleOpenPrescription(rx)}
                  className="p-4 bg-[#F8FAFC] hover:bg-blue-50/50 border border-slate-200 hover:border-blue-300 rounded-xl transition-all cursor-pointer flex items-center justify-between gap-4 group"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#0F4C81] font-mono bg-blue-50 px-2.5 py-0.5 rounded border border-blue-100">
                        {rx.patientDetails.date}
                      </span>
                      <span className="text-xs font-bold text-slate-800">{rx.patientDetails.consultingDoctor}</span>
                    </div>
                    <p className="text-xs font-bold text-slate-900">{rx.provisionalDiagnosis}</p>
                    {rx.chiefComplaint && <p className="text-xs text-slate-600 italic">"{rx.chiefComplaint}"</p>}
                  </div>

                  <div className="flex items-center gap-2 text-[#0F4C81] font-semibold text-xs opacity-80 group-hover:opacity-100 shrink-0">
                    <Eye className="h-4 w-4" />
                    <span>{language === 'ar' ? 'عرض الوصفة' : 'View Prescription'}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic p-6 text-center">No consultations available.</p>
            )}
          </div>
        </div>

        {/* RIGHT 5 COLS: MEDICAL HISTORY TIMELINE & ALLERGIES */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Timeline Box */}
          <div className="bg-white border border-brand-border rounded-2xl p-6 shadow-xs space-y-4">
            <h3 className="font-bold text-lg text-[#1F2937] pb-3 border-b border-slate-200">
              {language === 'ar' ? 'التسلسل الزمني الصحي' : 'Medical History Timeline'}
            </h3>

            <div className="space-y-6 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-200">
              {timeline.map((item, tIdx) => (
                <div key={tIdx} className="relative pl-8 space-y-2">
                  <div className="absolute left-0 top-0.5 w-7 h-7 rounded-full bg-[#0F4C81] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                    {item.year.slice(-2)}
                  </div>
                  <h4 className="text-xs font-black text-[#0F4C81] uppercase tracking-wider">{item.year}</h4>

                  <div className="space-y-2">
                    {item.events.map((ev, eIdx) => (
                      <div key={eIdx} className="bg-[#F8FAFC] p-3 rounded-xl border border-slate-200 text-xs flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 mt-0.5 shrink-0" />
                        <div>
                          <p className="font-bold text-slate-900">{ev.title}</p>
                          <p className="text-[10px] text-slate-500">{ev.date} &bull; {ev.category}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Allergies & Safety Notice */}
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
              <ShieldAlert className="h-4 w-4 text-amber-600" />
              <span>{language === 'ar' ? 'الحساسية المسجلة في الملف' : 'Recorded Drug Allergies'}</span>
            </div>
            <p className="text-xs font-bold text-amber-950 bg-amber-100 p-3 rounded-xl border border-amber-200">
              {profile.allergies}
            </p>
          </div>

        </div>

      </div>

      {/* Prescription Viewer Modal */}
      <PrescriptionModal
        prescription={selectedPrescription}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
};

