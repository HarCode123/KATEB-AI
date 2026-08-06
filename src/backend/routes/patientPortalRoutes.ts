import { Router, Request, Response } from "express";
import { PatientDataStore, DEFAULT_PATIENT_PROFILE, INITIAL_PRESCRIPTIONS, INITIAL_APPOINTMENTS, INITIAL_NOTIFICATIONS } from "../../services/patientStore.ts";

const router = Router();

// GET /api/patient/profile
router.get("/profile", (req: Request, res: Response) => {
  try {
    const profile = PatientDataStore.getProfile();
    return res.status(200).json({ success: true, data: profile });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/patient/history
router.get("/history", (req: Request, res: Response) => {
  try {
    const prescriptions = PatientDataStore.getPrescriptions();
    const timeline = PatientDataStore.getMedicalHistoryTimeline();
    return res.status(200).json({
      success: true,
      data: {
        prescriptions,
        timeline
      }
    });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/patient/prescriptions
router.get("/prescriptions", (req: Request, res: Response) => {
  try {
    const prescriptions = PatientDataStore.getPrescriptions();
    return res.status(200).json({ success: true, data: prescriptions });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/patient/appointments
router.get("/appointments", (req: Request, res: Response) => {
  try {
    const appointments = PatientDataStore.getAppointments();
    return res.status(200).json({ success: true, data: appointments });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/patient/upcoming-appointment
router.get("/upcoming-appointment", (req: Request, res: Response) => {
  try {
    const appointments = PatientDataStore.getAppointments();
    const upcoming = appointments.find(a => a.status === 'Confirmed' || a.status === 'Pending') || null;
    return res.status(200).json({ success: true, data: upcoming });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/patient/doctor
router.get("/doctor", (req: Request, res: Response) => {
  try {
    const doctors = PatientDataStore.getDoctorsConsulted();
    const primaryDoctor = doctors[0] || {
      doctorName: "Dr. Harini, MD",
      department: "Internal Medicine",
      visitCount: PatientDataStore.getPrescriptions().length || 1,
      lastVisitDate: PatientDataStore.getPrescriptions()[0]?.patientDetails.date || "2026-07-28"
    };
    return res.status(200).json({ success: true, data: primaryDoctor });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/patient/notifications
router.get("/notifications", (req: Request, res: Response) => {
  try {
    const notifications = PatientDataStore.getNotifications();
    return res.status(200).json({ success: true, data: notifications });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/patient/prescription/:id
router.get("/prescription/:id", (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const prescriptions = PatientDataStore.getPrescriptions();
    // Find by date or index or patient ID match
    const found = prescriptions.find((p, idx) => `rx-${idx}` === id || p.patientDetails.date === id || p.patientDetails.patientId === id) || prescriptions[0];
    if (!found) {
      return res.status(404).json({ success: false, message: "Prescription record not found." });
    }
    return res.status(200).json({ success: true, data: found });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

export default router;
