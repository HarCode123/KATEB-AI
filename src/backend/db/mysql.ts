import mysql from "mysql2/promise";
import fs from "fs";
import path from "path";

// DB Configuration from Environment Variables
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "Harini123MySQL";
const DB_NAME = process.env.DB_NAME || "kateb_ai";
const DB_PORT = parseInt(process.env.DB_PORT || "3306", 10);

let pool: mysql.Pool | null = null;
let useLocalFallback = false;

// Local JSON storage for fallback emulation
const FALLBACK_DB_PATH = path.join(process.cwd(), "consultation_transcripts_local.json");
const FALLBACK_EMR_PATH = path.join(process.cwd(), "electronic_medical_records_local.json");
const FALLBACK_PATIENTS_PATH = path.join(process.cwd(), "patients_local.json");

interface LocalTranscript {
  id: number;
  doctor_id: string;
  patient_id: string;
  raw_transcript: string;
  created_at: string;
  updated_at: string;
}

interface LocalEMR {
  emr_id: number;
  consultation_id: number;
  patient_id: string;
  patient_name?: string;
  age?: string | number;
  gender?: string;
  height?: string;
  weight?: string;
  blood_group?: string;
  doctor_id: string;
  visit_date: string;
  chief_complaint: string;
  symptoms: string;
  diagnosis: string;
  medications: string;
  dosage: string;
  advice: string;
  follow_up_date: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface LocalPatient {
  patient_id: string;
  first_name: string;
  last_name: string;
  age: number;
  gender: string;
  height_cm?: number;
  weight_kg?: number;
  phone_number: string;
  email?: string;
  address?: string;
  blood_group?: string;
  allergies?: string;
  created_at: string;
  updated_at: string;
}

// Lazy initialization of database pool
export async function getDatabaseConnection() {
  if (pool) return pool;

  // If no DB host is specified, immediately trigger fallback
  if (!DB_HOST) {
    if (!useLocalFallback) {
      console.warn("⚠️ [Database] DB_HOST environment variable is not defined. Falling back to local JSON persistence.");
      useLocalFallback = true;
      initLocalFallbackDb();
    }
    return null;
  }

  try {
    console.log(`🔌 [Database] Connecting to MySQL database at ${DB_HOST}:${DB_PORT}...`);
    pool = mysql.createPool({
      host: DB_HOST,
      user: DB_USER,
      password: DB_PASSWORD,
      database: DB_NAME,
      port: DB_PORT,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    // Test the connection
    const connection = await pool.getConnection();
    console.log("✅ [Database] MySQL connection established successfully!");
    connection.release();

    // Automatically ensure tables exist
    await ensureTableExists();

    return pool;
  } catch (err: any) {
    console.log(`ℹ️ [Database] MySQL connection was not established: ${err.message}`);
    console.log("📝 [Database] Activating local fallback mode. Transcripts will be stored in local JSON files.");
    pool = null;
    useLocalFallback = true;
    initLocalFallbackDb();
    return null;
  }
}

// Check if we are currently using the fallback DB
export function isUsingLocalFallback(): boolean {
  return useLocalFallback || !DB_HOST;
}

// Setup local JSON file database if not exists
function initLocalFallbackDb() {
  try {
    if (!fs.existsSync(FALLBACK_DB_PATH)) {
      fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify([], null, 2), "utf-8");
      console.log(`📁 [Database] Created local transcripts fallback file: ${FALLBACK_DB_PATH}`);
    }
    if (!fs.existsSync(FALLBACK_EMR_PATH)) {
      fs.writeFileSync(FALLBACK_EMR_PATH, JSON.stringify([], null, 2), "utf-8");
      console.log(`📁 [Database] Created local EMR records fallback file: ${FALLBACK_EMR_PATH}`);
    }
    if (!fs.existsSync(FALLBACK_PATIENTS_PATH)) {
      const defaultPatients: LocalPatient[] = [
        {
          patient_id: "PID-2026-001",
          first_name: "Harini",
          last_name: "Al-Mansoor",
          age: 28,
          gender: "Female",
          height_cm: 165,
          weight_kg: 62,
          phone_number: "+966 50 123 4567",
          email: "harini.almansoor@example.com",
          address: "King Fahd Road, District 4, Riyadh, Saudi Arabia",
          blood_group: "O+",
          allergies: "Penicillin (Mild skin rash)",
          created_at: "2026-01-10T08:00:00.000Z",
          updated_at: "2026-07-28T10:00:00.000Z"
        }
      ];
      fs.writeFileSync(FALLBACK_PATIENTS_PATH, JSON.stringify(defaultPatients, null, 2), "utf-8");
      console.log(`📁 [Database] Created local patients fallback file with single patient Harini Al-Mansoor: ${FALLBACK_PATIENTS_PATH}`);
    }
  } catch (err) {
    console.error("❌ [Database] Failed to initialize fallback JSON database:", err);
  }
}

// Create MySQL tables if they do not exist
async function ensureTableExists() {
  if (!pool) return;
  try {
    // 1. Doctors table
    const createDoctorsTableQuery = `
      CREATE TABLE IF NOT EXISTS doctors (
        doctor_id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        specialty VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        hospital VARCHAR(255) DEFAULT 'Kateb Clinical Medical Center',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.query(createDoctorsTableQuery);

    // Seed primary doctor if not exists
    await pool.query(`
      INSERT IGNORE INTO doctors (doctor_id, name, specialty, email, hospital)
      VALUES ('doctor@kateb.ai', 'Dr. Harini, MD', 'Internal Medicine & Clinical AI Specialist', 'doctor@kateb.ai', 'Kateb Clinical Medical Center');
    `);

    // 2. Patients table
    const createPatientsTableQuery = `
      CREATE TABLE IF NOT EXISTS patients (
        patient_id VARCHAR(255) PRIMARY KEY,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        gender VARCHAR(50) NOT NULL,
        height_cm DECIMAL(5,2),
        weight_kg DECIMAL(5,2),
        phone_number VARCHAR(100) NOT NULL,
        email VARCHAR(255),
        address TEXT,
        blood_group VARCHAR(20),
        allergies TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.query(createPatientsTableQuery);

    // Seed primary patient if not exists
    await pool.query(`
      INSERT IGNORE INTO patients (patient_id, first_name, last_name, age, gender, height_cm, weight_kg, phone_number, email, address, blood_group, allergies)
      VALUES ('PID-2026-001', 'Harini', 'Al-Mansoor', 28, 'Female', 165.0, 62.0, '+966 50 123 4567', 'harini.almansoor@example.com', 'King Fahd Road, District 4, Riyadh, Saudi Arabia', 'O+', 'Penicillin (Mild skin rash)');
    `);

    // 3. Consultation Transcripts
    const createTranscriptsTableQuery = `
      CREATE TABLE IF NOT EXISTS consultation_transcripts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        doctor_id VARCHAR(255) NOT NULL,
        patient_id VARCHAR(255) NOT NULL,
        raw_transcript TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.query(createTranscriptsTableQuery);

    // 4. Electronic Medical Records
    const createEMRTableQuery = `
      CREATE TABLE IF NOT EXISTS electronic_medical_records (
        emr_id INT AUTO_INCREMENT PRIMARY KEY,
        consultation_id INT NOT NULL,
        patient_id VARCHAR(255) NOT NULL,
        doctor_id VARCHAR(255) NOT NULL,
        visit_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        chief_complaint TEXT,
        symptoms TEXT,
        diagnosis TEXT,
        medications TEXT,
        dosage TEXT,
        advice TEXT,
        follow_up_date VARCHAR(255),
        status VARCHAR(50) DEFAULT 'Completed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (consultation_id) REFERENCES consultation_transcripts(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.query(createEMRTableQuery);

    // 5. Digital Prescriptions
    const createPrescriptionsTableQuery = `
      CREATE TABLE IF NOT EXISTS patient_prescriptions (
        prescription_id INT AUTO_INCREMENT PRIMARY KEY,
        patient_id VARCHAR(255) NOT NULL,
        doctor_id VARCHAR(255) NOT NULL,
        doctor_name VARCHAR(255) NOT NULL,
        visit_date VARCHAR(100) NOT NULL,
        provisional_diagnosis TEXT,
        medications_json JSON,
        diet_advice TEXT,
        follow_up VARCHAR(255),
        doctors_notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.query(createPrescriptionsTableQuery);

    // 6. Appointments
    const createAppointmentsTableQuery = `
      CREATE TABLE IF NOT EXISTS patient_appointments (
        appointment_id VARCHAR(255) PRIMARY KEY,
        patient_id VARCHAR(255) NOT NULL,
        doctor_name VARCHAR(255) NOT NULL,
        department VARCHAR(255) NOT NULL,
        hospital VARCHAR(255) DEFAULT 'Kateb Clinical Medical Center',
        appointment_date VARCHAR(100) NOT NULL,
        appointment_time VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'Confirmed',
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.query(createAppointmentsTableQuery);

    // 7. Notifications
    const createNotificationsTableQuery = `
      CREATE TABLE IF NOT EXISTS patient_notifications (
        notification_id VARCHAR(255) PRIMARY KEY,
        patient_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        date_str VARCHAR(100) NOT NULL,
        time_str VARCHAR(100) NOT NULL,
        is_read TINYINT(1) DEFAULT 0,
        type VARCHAR(50) DEFAULT 'general',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `;
    await pool.query(createNotificationsTableQuery);

    console.log("📋 [Database] All Kateb AI & Patient Portal MySQL tables initialized successfully.");
  } catch (err) {
    console.error("❌ [Database] Failed to ensure database tables exist:", err);
    throw err;
  }
}

// Helper methods for direct local fallback operations
export function getLocalTranscripts(): LocalTranscript[] {
  try {
    initLocalFallbackDb();
    const data = fs.readFileSync(FALLBACK_DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("❌ [Database] Error reading local fallback transcripts:", err);
    return [];
  }
}

export function saveLocalTranscript(doctor_id: string, patient_id: string, raw_transcript: string): LocalTranscript {
  try {
    const transcripts = getLocalTranscripts();
    const newId = transcripts.length > 0 ? Math.max(...transcripts.map(t => t.id)) + 1 : 1;
    const now = new Date().toISOString();
    
    const newRecord: LocalTranscript = {
      id: newId,
      doctor_id,
      patient_id,
      raw_transcript,
      created_at: now,
      updated_at: now
    };
    
    transcripts.push(newRecord);
    fs.writeFileSync(FALLBACK_DB_PATH, JSON.stringify(transcripts, null, 2), "utf-8");
    console.log(`💾 [Database] Successfully saved transcript locally (ID: ${newId})`);
    return newRecord;
  } catch (err) {
    console.error("❌ [Database] Error saving local transcript:", err);
    throw new Error("Local persistence write error");
  }
}

export function getLocalEMRRecords(): LocalEMR[] {
  try {
    initLocalFallbackDb();
    const data = fs.readFileSync(FALLBACK_EMR_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("❌ [Database] Error reading local fallback EMR records:", err);
    return [];
  }
}

export function saveLocalEMRRecord(
  consultation_id: number,
  patient_id: string,
  doctor_id: string,
  chief_complaint: string,
  symptoms: string,
  diagnosis: string,
  medications: string,
  dosage: string,
  advice: string,
  follow_up_date: string,
  status: string = "Completed",
  patient_name?: string,
  age?: string | number,
  gender?: string,
  height?: string,
  weight?: string,
  blood_group?: string
): LocalEMR {
  try {
    const records = getLocalEMRRecords();
    const newId = records.length > 0 ? Math.max(...records.map(r => r.emr_id)) + 1 : 1;
    const now = new Date().toISOString();

    const newRecord: LocalEMR = {
      emr_id: newId,
      consultation_id,
      patient_id,
      patient_name,
      age,
      gender,
      height,
      weight,
      blood_group,
      doctor_id,
      visit_date: now,
      chief_complaint,
      symptoms,
      diagnosis,
      medications,
      dosage,
      advice,
      follow_up_date,
      status,
      created_at: now,
      updated_at: now
    };

    records.push(newRecord);
    fs.writeFileSync(FALLBACK_EMR_PATH, JSON.stringify(records, null, 2), "utf-8");
    console.log(`💾 [Database] Successfully saved EMR record locally (EMR ID: ${newId}, consultation ID: ${consultation_id})`);
    return newRecord;
  } catch (err) {
    console.error("❌ [Database] Error saving local EMR record:", err);
    throw new Error("Local EMR persistence write error");
  }
}

export function getLocalPatients(): LocalPatient[] {
  try {
    initLocalFallbackDb();
    const data = fs.readFileSync(FALLBACK_PATIENTS_PATH, "utf-8");
    return JSON.parse(data);
  } catch (err) {
    console.error("❌ [Database] Error reading local fallback patients:", err);
    return [];
  }
}

export function saveLocalPatient(
  patient_id: string,
  first_name: string,
  last_name: string,
  age: number,
  gender: string,
  height_cm: number | undefined,
  weight_kg: number | undefined,
  phone_number: string,
  email: string | undefined,
  address: string | undefined,
  blood_group: string | undefined,
  allergies: string | undefined
): LocalPatient {
  try {
    const patients = getLocalPatients();
    const now = new Date().toISOString();
    const existingIdx = patients.findIndex(p => p.patient_id === patient_id);
    
    const newRecord: LocalPatient = {
      patient_id,
      first_name,
      last_name,
      age,
      gender,
      height_cm: height_cm !== undefined ? height_cm : (existingIdx >= 0 ? patients[existingIdx].height_cm : undefined),
      weight_kg: weight_kg !== undefined ? weight_kg : (existingIdx >= 0 ? patients[existingIdx].weight_kg : undefined),
      phone_number,
      email: email !== undefined ? email : (existingIdx >= 0 ? patients[existingIdx].email : undefined),
      address: address !== undefined ? address : (existingIdx >= 0 ? patients[existingIdx].address : undefined),
      blood_group: blood_group !== undefined ? blood_group : (existingIdx >= 0 ? patients[existingIdx].blood_group : undefined),
      allergies: allergies !== undefined ? allergies : (existingIdx >= 0 ? patients[existingIdx].allergies : undefined),
      created_at: existingIdx >= 0 ? patients[existingIdx].created_at : now,
      updated_at: now
    };
    
    if (existingIdx >= 0) {
      patients[existingIdx] = newRecord;
      console.log(`💾 [Database] Successfully updated existing patient locally (Patient ID: ${patient_id})`);
    } else {
      patients.push(newRecord);
      console.log(`💾 [Database] Successfully created new patient locally (Patient ID: ${patient_id})`);
    }
    
    fs.writeFileSync(FALLBACK_PATIENTS_PATH, JSON.stringify(patients, null, 2), "utf-8");
    return newRecord;
  } catch (err) {
    console.error("❌ [Database] Error saving local patient:", err);
    throw new Error("Local Patient persistence write error");
  }
}
