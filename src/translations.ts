export type Language = 'en' | 'ar';

export interface TranslationSchema {
  // Navigation & Branding
  brandName: string;
  appDescription: string;
  doctors: string;
  hospitals: string;
  patients: string;
  dashboard: string;
  emrRecords: string;
  logout: string;
  signIn: string;
  signup: string;

  // General Actions
  save: string;
  cancel: string;
  backToDashboard: string;
  newConsultation: string;
  loading: string;
  errors: string;
  notifications: string;

  // Login Screen
  loginPortalHeader: string;
  authorizedPersonnelOnly: string;
  fullNameLabel: string;
  fullNamePlaceholder: string;
  emailLabel: string;
  emailPlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  invalidCredentials: string;
  accessSystemButton: string;
  returnToHomepage: string;

  // Landing Screen
  clinicalPlatform: string;
  landingHeadline: string;
  landingSubtitle: string;
  landingFooter: string;

  // Dashboard Overview
  helloDoctor: string;
  welcomeDoctorText: string;
  hospitalSystemConnected: string;
  secureSessionActive: string;
  newConsultationDesc: string;
  emrRecordsDesc: string;

  // Consultation Session Drawer
  consultationSessionHeader: string;
  consultationSessionSubtitle: string;
  minimizeSession: string;
  recordConversationHeader: string;
  microphoneAriaStop: string;
  microphoneAriaStopConnecting: string;
  microphoneAriaStart: string;
  stateLiveCapturing: string;
  stateStopping: string;
  stateConnecting: string;
  stateContinuousSpeech: string;
  tipLiveListening: string;
  tipStopping: string;
  tipConnecting: string;
  tipInitial: string;
  liveApiEngine: string;
  typePrescriptionLabel: string;
  typePrescriptionPlaceholder: string;
  translateToArabicButton: string;
  translatingStatus: string;
  arabicTranslationLabel: string;
  arabicTranslationPlaceholder: string;
  submittingNote: string;
  submitRecordButton: string;

  // Dept Summary Panel
  deptSummaryHeader: string;
  todaysVisitsLabel: string;
  todaysVisitsValue: string;
  consultationsFiledLabel: string;
  consultationsFiledValue: string;
  avgSessionTimeLabel: string;
  avgSessionTimeValue: string;
  pendingLabApprovalsLabel: string;
  pendingLabApprovalsValue: string;

  // EMR view & Search Table
  emrTitleText: string;
  emrSubtitleText: string;
  searchPlaceholder: string;
  showingRecordsText: (count: number, total: number) => string;
  noMedicalRecordsFound: string;
  noMedicalRecordsSearchTip: string;

  // Table Columns & Gender
  colSNo: string;
  colPatientId: string;
  colPatientName: string;
  colAge: string;
  colGender: string;
  genderMale: string;
  genderFemale: string;
  colVisitDate: string;
  colDiagnosis: string;
  colPrescription: string;
  colFollowUpDate: string;
}

export const translations: Record<Language, TranslationSchema> = {
  en: {
    brandName: "Kateb AI",
    appDescription: "Arabic Medical Assistant",
    doctors: "Doctors",
    hospitals: "Hospitals",
    patients: "Patients",
    dashboard: "Dashboard",
    emrRecords: "EMR Records",
    logout: "Logout",
    signIn: "Sign In",
    signup: "Signup",

    save: "Save",
    cancel: "Cancel",
    backToDashboard: "Back to Dashboard",
    newConsultation: "New Consultation",
    loading: "Loading...",
    errors: "Errors",
    notifications: "Notifications",

    loginPortalHeader: "Hospital Portal Access",
    authorizedPersonnelOnly: "Authorized Personnel Only",
    fullNameLabel: "Full Name",
    fullNamePlaceholder: "Enter authorized name",
    emailLabel: "Email Address",
    emailPlaceholder: "doctor@kateb.ai",
    passwordLabel: "Security Password",
    passwordPlaceholder: "••••••",
    invalidCredentials: "Invalid Email or Password",
    accessSystemButton: "Access System",
    returnToHomepage: "Return to Homepage",

    clinicalPlatform: "Clinical Platform",
    landingHeadline: "Kateb AI",
    landingSubtitle: "Arabic Medical Assistant",
    landingFooter: "© 2026 Kateb AI. Dedicated Hospital Medical Systems. All Rights Reserved.",

    helloDoctor: "Hello Dr. Harini",
    welcomeDoctorText: "Welcome to Kateb AI. What would you like to do today?",
    hospitalSystemConnected: "Hospital System Connected",
    secureSessionActive: "Secure Session Active",
    newConsultationDesc: "Start a new patient consultation and capture diagnosis automatically.",
    emrRecordsDesc: "View and manage historical patient medical records and reports.",

    consultationSessionHeader: "New Patient Consultation Session",
    consultationSessionSubtitle: "Input clinical inputs to generate patient diagnostic reports.",
    minimizeSession: "Minimize Session",
    recordConversationHeader: "Record the Conversation",
    microphoneAriaStop: "Stop Voice Recording",
    microphoneAriaStopConnecting: "Cancel Connection Attempt",
    microphoneAriaStart: "Start Voice Recording",
    stateLiveCapturing: "🔴 Gemini Live Capturing...",
    stateStopping: "🛑 Stopping...",
    stateConnecting: "⏳ Connecting to Gemini Live...",
    stateContinuousSpeech: "Continuous Speech Capturing",
    tipLiveListening: "Speak clearly in English. Click the red button to finish capturing and auto-translate.",
    tipStopping: "Completing session audio capture and auto-translating notes...",
    tipConnecting: "Initializing secure microphone and real-time audio pipeline...",
    tipInitial: "Click the button above to speak clinical notes in English directly.",
    liveApiEngine: "Live API Engine",
    typePrescriptionLabel: "Type your Prescription",
    typePrescriptionPlaceholder: "Type prescription notes, diagnosis, medication list, dosages, or follow-up schedules manually here...",
    translateToArabicButton: "Translate to Arabic",
    translatingStatus: "Translating...",
    arabicTranslationLabel: "Arabic Translation",
    arabicTranslationPlaceholder: "Arabic translation will appear here...",
    submittingNote: "Note: Click below to generate an official AI-assisted digital prescription.",
    submitRecordButton: "Create Prescription",

    deptSummaryHeader: "Authorized Department Summary (Internal Medicine)",
    todaysVisitsLabel: "Today's Visits",
    todaysVisitsValue: "12 Patients",
    consultationsFiledLabel: "Consultations Filed",
    consultationsFiledValue: "8 Completed",
    avgSessionTimeLabel: "Average Session Time",
    avgSessionTimeValue: "8.5 Minutes",
    pendingLabApprovalsLabel: "Pending Lab Approvals",
    pendingLabApprovalsValue: "3 Orders",

    emrTitleText: "Electronic Medical Records",
    emrSubtitleText: "Explore complete records of patient diagnoses, medication protocols, and follow-up clinical indicators.",
    searchPlaceholder: "Search by Patient Name, ID, or Diagnosis...",
    showingRecordsText: (count: number, total: number) => `Showing ${count} of ${total} electronic medical records`,
    noMedicalRecordsFound: "No medical records found",
    noMedicalRecordsSearchTip: "Try searching for a different patient name or ID.",

    colSNo: "S.No",
    colPatientId: "Patient ID",
    colPatientName: "Patient Name",
    colAge: "Age",
    colGender: "Gender",
    genderMale: "Male",
    genderFemale: "Female",
    colVisitDate: "Visit Date",
    colDiagnosis: "Diagnosis",
    colPrescription: "Prescription",
    colFollowUpDate: "Follow-up Date"
  },
  ar: {
    brandName: "كاتب الذكاء الاصطناعي",
    appDescription: "المساعد الطبي العربي",
    doctors: "الأطباء",
    hospitals: "المستشفيات",
    patients: "المرضى",
    dashboard: "لوحة التحكم",
    emrRecords: "السجلات الطبية",
    logout: "تسجيل الخروج",
    signIn: "تسجيل الدخول",
    signup: "إنشاء حساب",

    save: "حفظ",
    cancel: "إلغاء",
    backToDashboard: "العودة إلى لوحة التحكم",
    newConsultation: "استشارة جديدة",
    loading: "جاري التحميل...",
    errors: "الأخطاء",
    notifications: "الإشعارات",

    loginPortalHeader: "بوابة دخول المستشفى",
    authorizedPersonnelOnly: "للموظفين المصرح لهم فقط",
    fullNameLabel: "الاسم الكامل",
    fullNamePlaceholder: "أدخل الاسم المصرح به",
    emailLabel: "البريد الإلكتروني",
    emailPlaceholder: "doctor@kateb.ai",
    passwordLabel: "كلمة مرور الأمان",
    passwordPlaceholder: "••••••",
    invalidCredentials: "البريد الإلكتروني أو كلمة المرور غير صالحة",
    accessSystemButton: "دخول النظام",
    returnToHomepage: "العودة إلى الصفحة الرئيسية",

    clinicalPlatform: "المنصة السريرية",
    landingHeadline: "كاتب الذكاء الاصطناعي",
    landingSubtitle: "المساعد الطبي العربي",
    landingFooter: "© ٢٠٢٦ كاتب الذكاء الاصطناعي. أنظمة مستشفيات مخصصة. جميع الحقوق محفوظة.",

    helloDoctor: "أهلاً د. هاريني",
    welcomeDoctorText: "مرحباً بك في كاتب الذكاء الاصطناعي. ماذا تود أن تفعل اليوم؟",
    hospitalSystemConnected: "متصل بنظام المستشفى",
    secureSessionActive: "الجلسة الآمنة نشطة",
    newConsultationDesc: "ابدأ استشارة مريض جديدة والتقط التشخيص تلقائياً.",
    emrRecordsDesc: "عرض وإدارة سجلات المرضى والتقارير الطبية السابقة.",

    consultationSessionHeader: "جلسة استشارة مريض جديدة",
    consultationSessionSubtitle: "أدخل البيانات السريرية لإنشاء التقارير التشخيصية للمرضى.",
    minimizeSession: "تصغير الجلسة",
    recordConversationHeader: "تسجيل المحادثة",
    microphoneAriaStop: "إيقاف تسجيل الصوت",
    microphoneAriaStopConnecting: "إلغاء محاولة الاتصال",
    microphoneAriaStart: "بدء تسجيل الصوت",
    stateLiveCapturing: "🔴 التقاط مباشر من جيميناي...",
    stateStopping: "🛑 جاري الإيقاف...",
    stateConnecting: "⏳ جاري الاتصال بجيميناي لايف...",
    stateContinuousSpeech: "التقاط مستمر للكلام",
    tipLiveListening: "تحدث بوضوح باللغة الإنجليزية. انقر على الزر الأحمر لإنهاء الالتقاط والترجمة التلقائية.",
    tipStopping: "جاري إكمال التقاط الصوت للجلسة وترجمة الملاحظات تلقائياً...",
    tipConnecting: "جاري تهيئة الميكروفون الآمن ومسار الصوت المباشر...",
    tipInitial: "انقر على الزر أعلاه لتتحدث بالملاحظات السريرية باللغة الإنجليزية مباشرة.",
    liveApiEngine: "محرك البث المباشر (API)",
    typePrescriptionLabel: "اكتب الوصفة الطبية",
    typePrescriptionPlaceholder: "اكتب يدوياً هنا ملاحظات الوصفة الطبية، التشخيص، قائمة الأدوية، الجرعات، أو مواعيد المتابعة...",
    translateToArabicButton: "الترجمة إلى العربية",
    translatingStatus: "جاري الترجمة...",
    arabicTranslationLabel: "الترجمة العربية",
    arabicTranslationPlaceholder: "ستظهر الترجمة العربية هنا...",
    submittingNote: "ملاحظة: انقر أدناه لإنشاء وصفة طبية رقمية معتمدة بالذكاء الاصطناعي.",
    submitRecordButton: "إنشاء وصفة طبية",

    deptSummaryHeader: "ملخص القسم المصرح به (الباطنة العامة)",
    todaysVisitsLabel: "زيارات اليوم",
    todaysVisitsValue: "١٢ مريضاً",
    consultationsFiledLabel: "الاستشارات المسجلة",
    consultationsFiledValue: "٨ مكتملة",
    avgSessionTimeLabel: "متوسط وقت الجلسة",
    avgSessionTimeValue: "٨.٥ دقيقة",
    pendingLabApprovalsLabel: "موافقات المختبر المعلقة",
    pendingLabApprovalsValue: "٣ طلبات",

    emrTitleText: "السجلات الطبية الإلكترونية",
    emrSubtitleText: "استكشف السجلات الكاملة لتشخيصات المرضى، وبروتوكولات الأدوية، ومؤشرات المتابعة الطبية.",
    searchPlaceholder: "ابحث باسم المريض، الرقم التعريفي، أو التشخيص...",
    showingRecordsText: (count: number, total: number) => `عرض ${count} من أصل ${total} من السجلات الطبية الإلكترونية`,
    noMedicalRecordsFound: "لم يتم العثور على سجلات طبية",
    noMedicalRecordsSearchTip: "جرّب البحث باسم مريض آخر أو رقمه التعريفي.",

    colSNo: "م",
    colPatientId: "رقم المريض",
    colPatientName: "اسم المريض",
    colAge: "العمر",
    colGender: "الجنس",
    genderMale: "ذكر",
    genderFemale: "أنثى",
    colVisitDate: "تاريخ الزيارة",
    colDiagnosis: "التشخيص",
    colPrescription: "الوصفة الطبية",
    colFollowUpDate: "تاريخ المتابعة"
  }
};
