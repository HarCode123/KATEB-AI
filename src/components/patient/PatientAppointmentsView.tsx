import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin, CheckCircle2, Plus, Sparkles } from 'lucide-react';
import { PatientDataStore, AppointmentItem } from '../../services/patientStore';
import { useLanguage } from '../../LanguageContext';

export const PatientAppointmentsView: React.FC = () => {
  const { language } = useLanguage();
  const [appointments, setAppointments] = useState<AppointmentItem[]>(PatientDataStore.getAppointments());
  
  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [docName, setDocName] = useState('Dr. Harini, MD');
  const [dept, setDept] = useState('Internal Medicine');
  const [aptDate, setAptDate] = useState('2026-08-10');
  const [aptTime, setAptTime] = useState('10:00 AM');
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const refreshData = () => {
    setAppointments(PatientDataStore.getAppointments());
  };

  useEffect(() => {
    refreshData();
    window.addEventListener('patient-data-updated', refreshData);
    return () => window.removeEventListener('patient-data-updated', refreshData);
  }, []);

  const upcomingList = appointments.filter(a => a.status === 'Confirmed' || a.status === 'Pending');

  const handleBookAppointment = (e: React.FormEvent) => {
    e.preventDefault();
    const newApt: AppointmentItem = {
      id: `apt-${Date.now()}`,
      doctorName: docName,
      department: dept,
      hospital: 'Kateb Clinical Medical Center',
      date: aptDate,
      time: aptTime,
      status: 'Confirmed',
      notes: 'Requested via Patient Portal Online Scheduling.'
    };

    PatientDataStore.addAppointment(newApt);
    PatientDataStore.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Appointment Booked Successfully',
      message: `Your appointment with ${docName} (${dept}) has been scheduled for ${aptDate} at ${aptTime}.`,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
      type: 'appointment'
    });

    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setIsBookingOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full animate-fade-in text-left rtl:text-right">
      
      {/* Header */}
      <div className="bg-white border border-brand-border rounded-2xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-[#0F4C81] font-bold uppercase tracking-wider mb-1 font-mono">
            <Calendar className="h-4 w-4" />
            <span>{language === 'ar' ? 'إدارة المواعيد السريرية' : 'Clinical Appointment Schedule'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#1F2937]">
            {language === 'ar' ? 'المواعيد الطبية' : 'Appointments'}
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            {language === 'ar' 
              ? 'تتبع مواعيدك القادمة مع طبيبك وحجز مواعيد متابعة جديدة بسهولة.' 
              : 'Track upcoming physician appointments and schedule follow-up visits.'}
          </p>
        </div>

        <button
          onClick={() => setIsBookingOpen(true)}
          className="px-5 py-3 bg-[#0F4C81] hover:bg-[#0c3c66] text-white font-semibold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span>{language === 'ar' ? 'حجز موعد جديد' : 'Book New Appointment'}</span>
        </button>
      </div>

      {/* Appointment Cards List (Upcoming Only) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upcomingList.length > 0 ? (
          upcomingList.map((apt) => (
            <div
              key={apt.id}
              className="bg-white border border-brand-border hover:border-blue-300 rounded-2xl p-6 shadow-xs transition-all space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {apt.status}
                  </span>

                  <span className="text-xs font-mono font-bold text-slate-500">
                    {apt.id}
                  </span>
                </div>

                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{language === 'ar' ? 'اسم الطبيب المعالج' : 'Doctor'}</p>
                  <p className="font-extrabold text-lg text-[#0F4C81] mt-0.5">{apt.doctorName}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-[#F8FAFC] p-3 rounded-xl border border-slate-200">
                  <div>
                    <p className="text-slate-400 font-medium">{language === 'ar' ? 'القسم' : 'Department'}</p>
                    <p className="font-bold text-slate-800">{apt.department}</p>
                  </div>
                  <div>
                    <p className="text-slate-400 font-medium">{language === 'ar' ? 'المستشفى' : 'Hospital'}</p>
                    <p className="font-bold text-slate-800 truncate">{apt.hospital}</p>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-xs font-bold text-slate-700 bg-blue-50/60 p-3 rounded-xl border border-blue-100">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-[#0F4C81]" />
                    <span>{apt.date}</span>
                  </div>
                  <div className="flex items-center gap-1.5 font-mono">
                    <Clock className="h-4 w-4 text-[#0F4C81]" />
                    <span>{apt.time}</span>
                  </div>
                </div>

                {apt.notes && (
                  <p className="text-xs text-slate-500 italic bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                    "{apt.notes}"
                  </p>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full bg-white border border-brand-border rounded-2xl p-12 text-center text-slate-400 italic">
            {language === 'ar' ? 'لا توجد مواعيد قادمة' : 'No upcoming appointments.'}
          </div>
        )}
      </div>

      {/* Book Appointment Modal */}
      {isBookingOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-2xl border border-brand-border shadow-2xl w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-[#0F4C81]" />
                <span>{language === 'ar' ? 'حجز موعد استشارة جديدة' : 'Book New Appointment'}</span>
              </h3>
              <button
                onClick={() => setIsBookingOpen(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
              >
                ✕
              </button>
            </div>

            {bookingSuccess ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-600 mx-auto" />
                <p className="font-bold text-sm">{language === 'ar' ? 'تم تأكيد حجز الموعد بنجاح!' : 'Appointment Booked Successfully!'}</p>
              </div>
            ) : (
              <form onSubmit={handleBookAppointment} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">{language === 'ar' ? 'اختر الطبيب' : 'Select Doctor'}</label>
                  <select
                    value={docName}
                    onChange={(e) => {
                      setDocName(e.target.value);
                      if (e.target.value.includes('Harini')) setDept('Internal Medicine');
                      else setDept('General Medicine');
                    }}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:border-[#0F4C81]"
                  >
                    <option value="Dr. Harini, MD">Dr. Harini, MD (Internal Medicine)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{language === 'ar' ? 'التاريخ' : 'Appointment Date'}</label>
                  <input
                    type="date"
                    value={aptDate}
                    onChange={(e) => setAptDate(e.target.value)}
                    required
                    className="w-full p-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:border-[#0F4C81]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">{language === 'ar' ? 'الوقت' : 'Time Slot'}</label>
                  <select
                    value={aptTime}
                    onChange={(e) => setAptTime(e.target.value)}
                    className="w-full p-2.5 bg-[#F8FAFC] border border-slate-200 rounded-xl font-bold text-slate-900 focus:outline-hidden focus:border-[#0F4C81]"
                  >
                    <option value="09:00 AM">09:00 AM</option>
                    <option value="10:00 AM">10:00 AM</option>
                    <option value="11:30 AM">11:30 AM</option>
                    <option value="02:00 PM">02:00 PM</option>
                    <option value="04:30 PM">04:30 PM</option>
                  </select>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsBookingOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-all"
                  >
                    {language === 'ar' ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#0F4C81] hover:bg-[#0c3c66] text-white rounded-xl font-bold transition-all"
                  >
                    {language === 'ar' ? 'تأكيد الحجز' : 'Confirm Booking'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

