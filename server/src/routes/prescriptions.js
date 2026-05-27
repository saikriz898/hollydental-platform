import express from "express";
import crypto from "crypto";
import { db } from "../config/db.js";
import { prescriptions, patients, users } from "../db/schema.js";
import { desc, eq } from "drizzle-orm";
import { verifyToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/roleCheck.js";
import { logActivity } from "../lib/auditLog.js";
import { sendPush } from "../lib/push.js";

const router = express.Router();

function requireDb(res) {
  if (!process.env.DATABASE_URL) {
    res.status(503).json({
      message: "Prescription service is not configured (database unavailable).",
    });
    return false;
  }
  return true;
}

/* 1. GET prescriptions — admin sees all, patient sees their own. */
router.get("/", verifyToken, async (req, res) => {
  if (!requireDb(res)) return;
  try {
    if (req.user.role === "patient") {
      const pRows = await db
        .select()
        .from(patients)
        .where(eq(patients.userId, req.user.id))
        .limit(1);
      if (pRows.length === 0) return res.status(200).json([]);
      const myRx = await db
        .select()
        .from(prescriptions)
        .where(eq(prescriptions.patientId, pRows[0].id))
        .orderBy(desc(prescriptions.createdAt));
      return res.status(200).json(myRx);
    }

    const allRx = await db
      .select()
      .from(prescriptions)
      .orderBy(desc(prescriptions.createdAt));
    return res.status(200).json(allRx);
  } catch (error) {
    console.error("[prescriptions] GET / failed", error);
    return res
      .status(500)
      .json({ message: "Failed to retrieve prescriptions." });
  }
});

/* 2. POST create prescription (admin only). */
router.post("/", verifyToken, requireRole("admin"), async (req, res) => {
  if (!requireDb(res)) return;
  const {
    patientId,
    drugName,
    dosage,
    frequency,
    duration,
    instructions,
    notes,
  } = req.body || {};

  if (!patientId || !drugName || !dosage) {
    return res
      .status(400)
      .json({ message: "Patient, drug name and dosage are required." });
  }

  try {
    const [inserted] = await db
      .insert(prescriptions)
      .values({
        id: crypto.randomUUID(),
        patientId,
        doctorId: req.user.id,
        drugName,
        dosage,
        frequency: frequency || null,
        duration: duration || null,
        instructions: instructions || null,
        notes: notes || null,
      })
      .returning();

    // Push-notify the patient if their account is wired up.
    try {
      const pRows = await db
        .select()
        .from(patients)
        .where(eq(patients.id, patientId))
        .limit(1);
      const userId = pRows[0]?.userId;
      if (userId) {
        await sendPush(userId, {
          title: "New prescription",
          body: `${drugName} ${dosage} has been added to your portal.`,
          url: "/portal/prescriptions",
          tag: `prescription-${inserted.id}`,
        });
      }
    } catch (_) {
      // non-fatal
    }

    await logActivity(req, "prescription.created", {
      targetType: "prescription",
      targetId: inserted.id,
      metadata: { drugName, patientId },
    });

    return res.status(201).json({
      message: "Prescription generated successfully.",
      prescription: inserted,
    });
  } catch (error) {
    console.error("[prescriptions] POST failed", error);
    return res.status(500).json({ message: "Failed to create prescription." });
  }
});

/* 3. PUT edit prescription (admin only). */
router.put("/:id", verifyToken, requireRole("admin"), async (req, res) => {
  if (!requireDb(res)) return;
  try {
    const updated = await db
      .update(prescriptions)
      .set(req.body || {})
      .where(eq(prescriptions.id, req.params.id))
      .returning();
    if (updated.length === 0) {
      return res.status(404).json({ message: "Prescription not found." });
    }
    await logActivity(req, "prescription.updated", {
      targetType: "prescription",
      targetId: req.params.id,
    });
    return res.status(200).json(updated[0]);
  } catch (error) {
    console.error("[prescriptions] PUT failed", error);
    return res.status(500).json({ message: "Failed to edit prescription." });
  }
});

/* 4. DELETE prescription (admin only). */
router.delete("/:id", verifyToken, requireRole("admin"), async (req, res) => {
  if (!requireDb(res)) return;
  try {
    await db.delete(prescriptions).where(eq(prescriptions.id, req.params.id));
    await logActivity(req, "prescription.deleted", {
      targetType: "prescription",
      targetId: req.params.id,
    });
    return res.status(200).json({ message: "Prescription deleted successfully." });
  } catch (error) {
    console.error("[prescriptions] DELETE failed", error);
    return res.status(500).json({ message: "Failed to delete prescription." });
  }
});

export default router;
