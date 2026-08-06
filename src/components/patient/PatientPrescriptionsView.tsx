import React, { useState, useEffect } from 'react';
import { Pill, Calendar, Download, Eye, Sparkles, Search, Stethoscope, AlertCircle } from 'lucide-react';
import { PatientDataStore } from '../../services/patientStore';
import { ClinicalPrescription } from '../../backend/services/PrescriptionService';
import { PrescriptionModal } from './PrescriptionModal';
import { useLanguage } from '../../LanguageContext';

export const PatientPrescriptionsView: React.FC = () => {
  const { language } = useLanguage();
  const [prescriptions, setPrescriptions] = useState<ClinicalPrescription[]>(PatientDataStore.getPrescriptions());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<ClinicalPrescription | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const refreshData = () => {
    setPrescriptions(PatientDataStore.getPrescriptions());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('patient-data-updated', refreshData);
    return () => window.removeEventListener('patient-data-updated', refreshData);
  }, []);

  const filtered = prescriptions.filter(p => {
    const q = searchQuery.toLowerCase();
    const diag = (p.provisionalDiagnosis || '').toLowerCase();
    const doc = (p.patientDetails.consultingDoctor || '').toLowerCase();
    const meds = (p.medications || []).map(m => m.medicineName.toLowerCase()).join(' ');
    return diag.includes(q) || doc.includes(q) || meds.includes(q);
  });

  const handleOpenModal = (rx: ClinicalPrescription) => {
    setSelectedPrescription(rx);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full animate-fade-in text-left rtl:text-right">
      
      {/* Header */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#0F4C81] font-bold uppercase tracking-wider mb-1 font-mono">
            <Pill className="h-4 w-4" />
            <span>{language === 'ar' ? 'الوصفات الطبية الرقمية' : 'Digital EMR Prescriptions'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
            {language === 'ar' ? 'جميع الوصفات الطبية المعتمدة' : 'Issued Medical Prescriptions'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            {language === 'ar' 
              ? 'جميع الوصفات والبروتوكولات الدوائية الصادرة من الطبيب متاحة للتنزيل والمعاينة بصيغة PDF عالية الجودة.' 
              : 'All official digital prescriptions generated during your doctor visits. Click to view or download high-fidelity PDF.'}
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 rtl:right-3 rtl:left-auto top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'بحث باسم الدواء أو التشخيص...' : 'Search medicine or diagnosis...'}
            className="w-full pl-9 rtl:pr-9 rtl:pl-3 pr-4 py-2.5 bg-[#F8FAFC] border border-brand-border rounded-xl text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:border-[#0F4C81] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Grid of Prescriptions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length > 0 ? (
          filtered.map((rx, idx) => (
            <div
              key={idx}
              className="bg-white border border-brand-border hover:border-blue-300 rounded-2xl p-6 shadow-xs transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 bg-indigo-50 text-indigo-700 rounded-xl">
                      <Pill className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900">
                        {rx.provisionalDiagnosis || 'Prescription Protocol'}
                      </h3>
                      <p className="text-xs text-slate-500 font-medium">{rx.patientDetails.consultingDoctor}</p>
                    </div>
                  </div>

                  <span className="text-xs font-bold font-mono text-[#0F4C81] bg-blue-50 px-2.5 py-1 rounded-lg border border-blue-100">
                    {rx.patientDetails.date}
                  </span>
                </div>

                {/* Medications Table Preview */}
                <div className="bg-[#F8FAFC] p-3.5 rounded-xl border border-slate-200 space-y-2">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {language === 'ar' ? 'قائمة الأدوية الموصوفة' : 'Prescribed Medicines'}
                  </span>
                  
                  {rx.medications && rx.medications.length > 0 ? (
                    <div className="space-y-1.5">
                      {rx.medications.slice(0, 3).map((med, mIdx) => (
                        <div key={mIdx} className="flex items-center justify-between text-xs bg-white p-2 rounded border border-slate-200 font-mono">
                          <span className="font-bold text-slate-900">{med.medicineName}</span>
                          <span className="text-[#0F4C81] font-semibold">{med.strength} ({med.frequency})</span>
                        </div>
                      ))}
                      {rx.medications.length > 3 && (
                        <p className="text-[10px] text-slate-500 italic text-center font-semibold pt-1">
                          +{rx.medications.length - 3} additional medications prescribed
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic">No medications listed.</p>
                  )}
                </div>

                {/* Follow-up Note */}
                {rx.followUp && (
                  <div className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex items-start gap-1.5 font-medium">
                    <AlertCircle className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>Follow-Up: {rx.followUp}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-[10px] font-mono text-slate-400">EMR Verified</span>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenModal(rx)}
                    className="px-3.5 py-2 bg-[#0F4C81] hover:bg-[#0c3c66] text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="h-3.5 w-3.5" />
                    <span>{language === 'ar' ? 'عرض الوصفة' : 'View Prescription'}</span>
                  </button>

                  <button
                    onClick={() => handleOpenModal(rx)}
                    className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-all flex items-center gap-1 cursor-pointer"
                    title={language === 'ar' ? 'تحميل PDF' : 'Download PDF'}
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">{language === 'ar' ? 'تحميل' : 'PDF'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-2 bg-white border border-brand-border rounded-2xl p-12 text-center text-slate-400 italic">
            {language === 'ar' ? 'لا توجد وصفات طبية متاحة' : 'No prescriptions available.'}
          </div>
        )}
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
