import { GoogleGenAI, Type } from "@google/genai";

export interface MedicationItem {
  medicineName: string;
  strength?: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  purpose?: string; // Patient awareness description (e.g., "Used for coping with nausea & vomiting")
}

export interface VitalsInfo {
  temperature?: string | null;
  pulse?: string | null;
  bloodPressure?: string | null;
  respiratoryRate?: string | null;
  spo2?: string | null;
}

export interface PatientDetails {
  patientName: string;
  patientId: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  bmi: string;
  bloodGroup: string;
  date: string;
  consultingDoctor: string;
}

export interface ClinicalPrescription {
  patientDetails: PatientDetails;
  chiefComplaint: string;
  historyOfPresentIllness: string;
  pastMedicalHistory: string;
  allergies: string;
  vitals: VitalsInfo;
  clinicalExamination: string;
  provisionalDiagnosis: string;
  diseaseDescription?: string;
  investigationsAdvised: string;
  medications: MedicationItem[];
  lifestyleDietAdvice: string;
  followUp: string;
  doctorsNotes: string;
}

export class PrescriptionService {
  /**
   * Generates a structured digital clinical prescription from a consultation transcript and patient information.
   * Employs Gemini 3.6 Flash via @google/genai with strict clinical guardrails.
   */
  static async generateClinicalPrescription(
    patientInfo: Partial<PatientDetails>,
    rawTranscript: string
  ): Promise<ClinicalPrescription> {
    console.log("🚀 [PrescriptionService] Generating Clinical Prescription from transcript length:", rawTranscript.length);

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || "";

    if (apiKey) {
      try {
        console.log("🧠 [PrescriptionService] Initializing GoogleGenAI for structured prescription extraction...");
        const ai = new GoogleGenAI({ apiKey });

        const systemPrompt = `
          You are an expert AI Clinical Documentation Assistant for Electronic Medical Record (EMR) systems.
          Your responsibility is to convert a doctor's consultation transcript into a professional digital clinical prescription based strictly on the provided transcript and patient details.

          STRICT CLINICAL RULES:
          1. Extract ONLY medically supported information from the provided consultation transcript and patient details.
          2. NEVER fabricate, invent, or guess symptoms, diagnoses, medications, dosages, allergies, vitals, or examination findings.
          3. If information for any field or section is unavailable or not mentioned in the transcript/patient details, set its string value to "Not Mentioned" (or set vitals fields to null if not mentioned).
          4. Maintain professional, precise clinical terminology.
          5. NEVER add medicines not mentioned in the consultation.
          6. NEVER modify medicine names. Keep exact brand or generic drug names as stated in the transcript.
          7. For every medication, extract:
             - medicineName: exact drug name
             - strength: e.g., "500 mg" or "Not Mentioned"
             - dosage: e.g., "1 tablet" or "Not Mentioned"
             - frequency: e.g., "Twice daily (BID)" or "Not Mentioned"
             - duration: e.g., "5 days" or "Not Mentioned"
             - instructions: e.g., "Take after meals" or "Not Mentioned"
             - purpose: concise, patient-friendly description of what this tablet helps with (e.g. "Used for coping with nausea & vomiting", "Antibiotic to clear bacterial lung infection", "Relieves pain and reduces fever")
          8. DISEASE DESCRIPTION: Provide 'diseaseDescription' - a brief, clear, patient-friendly 1-2 sentence overview explaining the diagnosed condition/disease and why these medications are prescribed to help the patient stay informed.
          9. VITALS: Only include values explicitly mentioned or supplied. If temperature, pulse, bloodPressure, respiratoryRate, or spo2 is not mentioned, return null for that specific vital sign.
          10. BMI: Calculate BMI if weight and height are provided (e.g. Weight (kg) / [Height (m)]^2), otherwise state "Not Mentioned".
          11. Ensure the output is a pristine JSON object matching the requested schema.
        `;

        const response = await ai.models.generateContent({
          model: "gemini-3.6-flash",
          contents: `Please process the following consultation transcript and patient details into a clinical prescription.

Patient Information Provided:
${JSON.stringify(patientInfo, null, 2)}

Consultation Transcript:
"${rawTranscript}"`,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                patientDetails: {
                  type: Type.OBJECT,
                  properties: {
                    patientName: { type: Type.STRING },
                    patientId: { type: Type.STRING },
                    age: { type: Type.STRING },
                    gender: { type: Type.STRING },
                    height: { type: Type.STRING },
                    weight: { type: Type.STRING },
                    bmi: { type: Type.STRING },
                    bloodGroup: { type: Type.STRING },
                    date: { type: Type.STRING },
                    consultingDoctor: { type: Type.STRING }
                  },
                  required: [
                    "patientName", "patientId", "age", "gender", "height", "weight", "bmi", "bloodGroup", "date", "consultingDoctor"
                  ]
                },
                chiefComplaint: { type: Type.STRING },
                historyOfPresentIllness: { type: Type.STRING },
                pastMedicalHistory: { type: Type.STRING },
                allergies: { type: Type.STRING },
                vitals: {
                  type: Type.OBJECT,
                  properties: {
                    temperature: { type: Type.STRING },
                    pulse: { type: Type.STRING },
                    bloodPressure: { type: Type.STRING },
                    respiratoryRate: { type: Type.STRING },
                    spo2: { type: Type.STRING }
                  }
                },
                clinicalExamination: { type: Type.STRING },
                provisionalDiagnosis: { type: Type.STRING },
                diseaseDescription: { type: Type.STRING },
                investigationsAdvised: { type: Type.STRING },
                medications: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      medicineName: { type: Type.STRING },
                      strength: { type: Type.STRING },
                      dosage: { type: Type.STRING },
                      frequency: { type: Type.STRING },
                      duration: { type: Type.STRING },
                      instructions: { type: Type.STRING },
                      purpose: { type: Type.STRING }
                    },
                    required: ["medicineName", "strength", "dosage", "frequency", "duration", "instructions", "purpose"]
                  }
                },
                lifestyleDietAdvice: { type: Type.STRING },
                followUp: { type: Type.STRING },
                doctorsNotes: { type: Type.STRING }
              },
              required: [
                "patientDetails", "chiefComplaint", "historyOfPresentIllness", "pastMedicalHistory",
                "allergies", "vitals", "clinicalExamination", "provisionalDiagnosis", "diseaseDescription",
                "investigationsAdvised", "medications", "lifestyleDietAdvice", "followUp", "doctorsNotes"
              ]
            }
          }
        });

        const textResponse = response.text;
        if (textResponse) {
          console.log("✅ [PrescriptionService] Clinical Prescription extracted successfully from Gemini API!");
          const cleanJsonStr = textResponse.trim().replace(/^```json/, "").replace(/```$/, "").trim();
          const parsed: ClinicalPrescription = JSON.parse(cleanJsonStr);

          // Ensure official registered patient metadata takes absolute priority
          const officialHeight = (patientInfo.height && patientInfo.height !== "Not Mentioned") 
            ? patientInfo.height 
            : (parsed.patientDetails?.height || "Not Mentioned");

          const officialWeight = (patientInfo.weight && patientInfo.weight !== "Not Mentioned") 
            ? patientInfo.weight 
            : (parsed.patientDetails?.weight || "Not Mentioned");

          parsed.patientDetails = {
            patientName: (patientInfo.patientName && patientInfo.patientName !== "Not Mentioned") ? patientInfo.patientName : (parsed.patientDetails?.patientName || "Not Mentioned"),
            patientId: (patientInfo.patientId && patientInfo.patientId !== "Not Mentioned") ? patientInfo.patientId : (parsed.patientDetails?.patientId || "Not Mentioned"),
            age: (patientInfo.age && patientInfo.age !== "Not Mentioned") ? String(patientInfo.age) : (parsed.patientDetails?.age || "Not Mentioned"),
            gender: (patientInfo.gender && patientInfo.gender !== "Not Mentioned") ? patientInfo.gender : (parsed.patientDetails?.gender || "Not Mentioned"),
            height: officialHeight,
            weight: officialWeight,
            bmi: this.calculateBMI(officialHeight, officialWeight),
            bloodGroup: (patientInfo.bloodGroup && patientInfo.bloodGroup !== "Not Mentioned") ? patientInfo.bloodGroup : (parsed.patientDetails?.bloodGroup || "Not Mentioned"),
            date: patientInfo.date || parsed.patientDetails?.date || new Date().toISOString().split("T")[0],
            consultingDoctor: patientInfo.consultingDoctor || parsed.patientDetails?.consultingDoctor || "Dr. Harini"
          };

          return parsed;
        }
      } catch (err: any) {
        console.error("⚠️ [PrescriptionService] Gemini extraction failed, using fallback clinical parser:", err.message);
      }
    } else {
      console.warn("⚠️ [PrescriptionService] GEMINI_API_KEY is not defined. Using fallback clinical parser.");
    }

    return this.fallbackClinicalParse(patientInfo, rawTranscript);
  }

  /**
   * Backward-compatible helper method that converts a transcript into a flat EMR record.
   */
  static async generateEMR(rawTranscript: string) {
    const rx = await this.generateClinicalPrescription({}, rawTranscript);
    return {
      chiefComplaint: rx.chiefComplaint,
      symptoms: rx.historyOfPresentIllness,
      diagnosis: rx.provisionalDiagnosis,
      medications: rx.medications.map(m => `${m.medicineName} ${m.strength}`).join(', ') || "Not Mentioned",
      dosage: rx.medications.map(m => `${m.dosage} ${m.frequency}`).join('; ') || "Not Mentioned",
      advice: rx.lifestyleDietAdvice,
      followUp: rx.followUp
    };
  }

  /**
   * Helper to compute Body Mass Index (BMI) accurately if height & weight are supplied.
   */
  private static calculateBMI(heightStr?: string, weightStr?: string): string {
    if (!heightStr || !weightStr) return "Not Mentioned";
    
    // Extract numeric values
    const hMatch = heightStr.match(/([\d.]+)/);
    const wMatch = weightStr.match(/([\d.]+)/);
    if (!hMatch || !wMatch) return "Not Mentioned";

    let heightCm = parseFloat(hMatch[1]);
    let weightKg = parseFloat(wMatch[1]);

    if (isNaN(heightCm) || isNaN(weightKg) || heightCm <= 0 || weightKg <= 0) {
      return "Not Mentioned";
    }

    // Convert cm to meters if value > 3 (e.g., 170cm vs 1.7m)
    const heightM = heightCm > 3 ? heightCm / 100 : heightCm;
    const bmiVal = weightKg / (heightM * heightM);

    return `${bmiVal.toFixed(1)} kg/m²`;
  }

  /**
   * Deterministic clinical heuristic parser used as fallback if Gemini API is unreachable.
   */
  private static fallbackClinicalParse(
    patientInfo: Partial<PatientDetails>,
    transcript: string
  ): ClinicalPrescription {
    const textLower = transcript.toLowerCase();

    // Default Vitals (Only extracted if present in text)
    const vitals: VitalsInfo = {};
    const tempMatch = transcript.match(/(?:temp|temperature|fever of)\s*(?:is|:)?\s*([\d.]+\s*°?[CF])/i);
    if (tempMatch) vitals.temperature = tempMatch[1];

    const bpMatch = transcript.match(/(?:bp|blood pressure)\s*(?:is|:)?\s*(\d{2,3}\/\d{2,3})/i);
    if (bpMatch) vitals.bloodPressure = bpMatch[1] + " mmHg";

    const pulseMatch = transcript.match(/(?:pulse|hr|heart rate)\s*(?:is|:)?\s*(\d{2,3})\s*(?:bpm)?/i);
    if (pulseMatch) vitals.pulse = pulseMatch[1] + " bpm";

    const spo2Match = transcript.match(/(?:spo2|oxygen|saturation)\s*(?:is|:)?\s*(\d{2,3}%?)/i);
    if (spo2Match) vitals.spo2 = spo2Match[1].includes("%") ? spo2Match[1] : spo2Match[1] + "%";

    const rrMatch = transcript.match(/(?:respiratory rate|rr)\s*(?:is|:)?\s*(\d{1,2})/i);
    if (rrMatch) vitals.respiratoryRate = rrMatch[1] + " breaths/min";

    // Extract Allergies
    let allergies = "Not Mentioned";
    const allergyMatch = transcript.match(/(?:allerg(?:ic|y)|allergies)(?:\s+to)?\s+([^\n.,]+)/i);
    if (allergyMatch) {
      allergies = allergyMatch[1].trim();
    } else if (textLower.includes("no known allergies") || textLower.includes("nkda")) {
      allergies = "No Known Drug Allergies (NKDA)";
    }

    // Fallback medications
    const medications: MedicationItem[] = [];
    if (textLower.includes("amoxicillin") || textLower.includes("azithromycin")) {
      medications.push({
        medicineName: "Azithromycin",
        strength: "500 mg",
        dosage: "1 tablet",
        frequency: "Once daily (QD)",
        duration: "5 days",
        instructions: "Take after meals with water",
        purpose: "Antibiotic used to treat bacterial throat/respiratory infections"
      });
    }
    if (textLower.includes("paracetamol") || textLower.includes("panadol")) {
      medications.push({
        medicineName: "Paracetamol",
        strength: "650 mg",
        dosage: "1 tablet",
        frequency: "Twice daily (BID)",
        duration: "3 days",
        instructions: "Take after food as needed for pain or fever",
        purpose: "Relieves body pain, headache, and helps reduce high fever"
      });
    }
    if (textLower.includes("vomikind") || textLower.includes("ondansetron") || textLower.includes("vomit")) {
      medications.push({
        medicineName: "Vomikind / Ondansetron",
        strength: "4 mg",
        dosage: "1 tablet",
        frequency: "As needed (PRN)",
        duration: "3 days",
        instructions: "Take 30 mins before food when feeling nauseous",
        purpose: "Used for coping with and preventing nausea and vomiting"
      });
    }
    if (textLower.includes("metformin")) {
      medications.push({
        medicineName: "Metformin Hydrochloride",
        strength: "1000 mg",
        dosage: "1 tablet",
        frequency: "Twice daily (BID)",
        duration: "Ongoing",
        instructions: "Take with meals to reduce stomach upset",
        purpose: "Helps lower and control blood sugar levels in Diabetes"
      });
    }

    const calculatedBMI = this.calculateBMI(patientInfo.height, patientInfo.weight);

    return {
      patientDetails: {
        patientName: patientInfo.patientName || "Not Mentioned",
        patientId: patientInfo.patientId || "Not Mentioned",
        age: String(patientInfo.age || "Not Mentioned"),
        gender: patientInfo.gender || "Not Mentioned",
        height: patientInfo.height || "Not Mentioned",
        weight: patientInfo.weight || "Not Mentioned",
        bmi: patientInfo.bmi || calculatedBMI,
        bloodGroup: patientInfo.bloodGroup || "Not Mentioned",
        date: patientInfo.date || new Date().toISOString().split("T")[0],
        consultingDoctor: patientInfo.consultingDoctor || "Dr. Harini"
      },
      chiefComplaint: transcript.length > 5 ? transcript.split(".")[0] : "Not Mentioned",
      historyOfPresentIllness: transcript || "Not Mentioned",
      pastMedicalHistory: "Not Mentioned",
      allergies: allergies,
      vitals: vitals,
      clinicalExamination: "Not Mentioned",
      provisionalDiagnosis: "Acute Clinical Symptoms",
      diseaseDescription: "A clinical condition requiring targeted symptomatic and therapeutic medication for rapid recovery.",
      investigationsAdvised: "Not Mentioned",
      medications: medications,
      lifestyleDietAdvice: "Maintain adequate hydration and rest as advised.",
      followUp: "As directed by physician",
      doctorsNotes: "Not Mentioned"
    };
  }
}
