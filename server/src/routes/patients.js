import express from "express";
import crypto from "crypto";
import { db } from "../config/db.js";
import { patients, treatments } from "../db/schema.js";
import { eq, ilike, or } from "drizzle-orm";
import { verifyToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/roleCheck.js";
import { generateContent } from "../config/gemini.js";
import { prompts } from "../config/prompts.js";

const router = express.Router();

function requireDb(res) {
  if (!process.env.DATABASE_URL) {
    res
      .status(503)
      .json({ message: "Patient directory is not configured." });
    return false;
  }
  return true;
}

/* 1. GET ALL — admin search/filter. */
router.get("/", verifyToken, requireRole("admin"), async (req, res) => {
  if (!requireDb(res)) return;
  const { search } = req.query;

  try {
    if (search) {
      const term = `%${search}%`;
      const results = await db
        .select()
        .from(patients)
        .where(
          or(
            ilike(patients.firstName, term),
            ilike(patients.lastName, term),
            ilike(patients.email, term),
            ilike(patients.phone, term)
          )
        );
      return res.status(200).json(results);
    }

    const results = await db.select().from(patients);
    return res.status(200).json(results);
  } catch (error) {
    console.error("[patients] GET / failed", error);
    return res.status(500).json({ message: "Failed to retrieve patients." });
  }
});

/* 2. GET patient detail (admin). */
router.get("/:id", verifyToken, requireRole("admin"), async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const rows = await db
      .select()
      .from(patients)
      .where(eq(patients.id, req.params.id))
      .limit(1);
    if (rows.length === 0) {
      return res.status(404).json({ message: "Patient not found." });
    }
    return res.status(200).json(rows[0]);
  } catch (error) {
    console.error("[patients] GET /:id failed", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve patient profile." });
  }
});

/* 3. POST create (admin). */
router.post("/", verifyToken, requireRole("admin"), async (req, res) => {
  if (!requireDb(res)) return;
  const {
    firstName,
    lastName,
    dateOfBirth,
    gender,
    phone,
    email,
    address,
    emergencyContact,
    emergencyPhone,
    medicalConditions,
    medications,
    allergies,
    insuranceProvider,
    notes,
  } = req.body || {};

  if (!firstName || !lastName || !phone || !email) {
    return res.status(400).json({ message: "Missing required patient fields." });
  }

  try {
    const [inserted] = await db
      .insert(patients)
      .values({
        id: crypto.randomUUID(),
        firstName,
        lastName,
        dateOfBirth,
        gender,
        phone,
        email,
        address,
        emergencyContact,
        emergencyPhone,
        medicalConditions,
        medications,
        allergies,
        insuranceProvider,
        notes,
        gdprConsent: true,
        consentDate: new Date(),
      })
      .returning();
    return res.status(201).json({
      message: "Patient profile created successfully.",
      patient: inserted,
    });
  } catch (error) {
    console.error("[patients] POST / failed", error);
    return res
      .status(500)
      .json({ message: "Failed to create patient profile." });
  }
});

/* 4. PUT update (admin). */
router.put("/:id", verifyToken, requireRole("admin"), async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const updated = await db
      .update(patients)
      .set({ ...(req.body || {}), updatedAt: new Date() })
      .where(eq(patients.id, req.params.id))
      .returning();
    if (updated.length === 0) {
      return res.status(404).json({ message: "Patient not found." });
    }
    return res.status(200).json(updated[0]);
  } catch (error) {
    console.error("[patients] PUT /:id failed", error);
    return res
      .status(500)
      .json({ message: "Failed to update patient profile." });
  }
});

/* 5. GET clinical summary (AI generated, admin only). */
router.get("/:id/summary", verifyToken, requireRole("admin"), async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const rows = await db
      .select()
      .from(patients)
      .where(eq(patients.id, req.params.id))
      .limit(1);
    const patient = rows[0];
    if (!patient) return res.status(404).json({ message: "Patient not found." });

    const tRows = await db
      .select()
      .from(treatments)
      .where(eq(treatments.patientId, patient.id));
    const completedTreatments = tRows.length
      ? tRows.map((t) => t.description).join(", ")
      : "None";

    const birthDate = patient.dateOfBirth ? new Date(patient.dateOfBirth) : null;
    const age = birthDate
      ? new Date().getFullYear() - birthDate.getFullYear()
      : null;

    const summary = await generateContent(
      prompts.patientSummary.systemInstruction(),
      prompts.patientSummary.prompt({
        name: `${patient.firstName} ${patient.lastName}`,
        age,
        lastVisit: patient.updatedAt,
        completedTreatments,
        outstanding: patient.notes || "None recorded",
        medicalNotes: patient.medicalConditions || "None",
      })
    );

    return res.status(200).json({ summary });
  } catch (error) {
    console.error("[patients] summary failed", error);
    return res
      .status(500)
      .json({ message: "Failed to generate patient summary." });
  }
});

export default router;
