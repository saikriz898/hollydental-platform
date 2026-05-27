import express from "express";
import { db } from "../config/db.js";
import {
  appointments,
  messages,
  patients,
  prescriptions,
  services,
} from "../db/schema.js";
import { and, desc, eq, gte } from "drizzle-orm";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

function requireDb(res) {
  if (!process.env.DATABASE_URL) {
    res
      .status(503)
      .json({ message: "Notifications service is not configured." });
    return false;
  }
  return true;
}

const STATUS_LABELS = {
  pending: "Appointment Awaiting Confirmation",
  confirmed: "Appointment Confirmed",
  arrived: "Marked as Arrived at Clinic",
  in_progress: "Dental Treatment in Progress",
  completed: "Dental Treatment Completed",
  cancelled: "Appointment Cancelled",
  no_show: "Marked as Appointment No-Show",
};

/**
 * GET /api/notifications/me — synthesises a notification feed for the
 * authenticated patient by stitching together recent appointment status
 * changes, new prescriptions, and inbound messages.
 *
 * We don't persist a separate notifications table because every event we
 * surface is already authoritatively stored in its source table. Instead
 * we map them into a uniform feed item shape on the fly. This keeps the
 * feature consistent with the audit log even if a clinician reverses a
 * decision later.
 */
router.get("/me", verifyToken, async (req, res) => {
  if (!requireDb(res)) return;
  if (req.user.role !== "patient") {
    return res.status(403).json({ message: "Forbidden." });
  }

  try {
    const pRows = await db
      .select()
      .from(patients)
      .where(eq(patients.userId, req.user.id))
      .limit(1);
    const patient = pRows[0];
    if (!patient) return res.status(200).json([]);

    const since = new Date();
    since.setDate(since.getDate() - 60);

    const [apptRows, rxRows, msgRows] = await Promise.all([
      db
        .select({
          id: appointments.id,
          status: appointments.status,
          updatedAt: appointments.updatedAt,
          appointmentDate: appointments.appointmentDate,
          appointmentTime: appointments.appointmentTime,
          serviceName: services.name,
        })
        .from(appointments)
        .leftJoin(services, eq(appointments.serviceId, services.id))
        .where(
          and(
            eq(appointments.patientId, patient.id),
            gte(appointments.updatedAt, since)
          )
        )
        .orderBy(desc(appointments.updatedAt))
        .limit(15),
      db
        .select()
        .from(prescriptions)
        .where(
          and(
            eq(prescriptions.patientId, patient.id),
            gte(prescriptions.createdAt, since)
          )
        )
        .orderBy(desc(prescriptions.createdAt))
        .limit(10),
      db
        .select()
        .from(messages)
        .where(
          and(
            eq(messages.patientId, patient.id),
            eq(messages.senderRole, "admin"),
            gte(messages.createdAt, since)
          )
        )
        .orderBy(desc(messages.createdAt))
        .limit(15),
    ]);

    const items = [
      ...apptRows.map((a) => ({
        id: `appt-${a.id}-${a.status}`,
        type: "appointment",
        title:
          STATUS_LABELS[a.status] ||
          `Appointment status: ${a.status.replace("_", " ")}`,
        body: `${a.serviceName || "Appointment"} on ${a.appointmentDate} at ${a.appointmentTime}`,
        href: `/portal/appointments/${a.id}`,
        timestamp: a.updatedAt,
        read: false,
      })),
      ...rxRows.map((r) => ({
        id: `rx-${r.id}`,
        type: "prescription",
        title: "New prescription",
        body: `${r.drugName} ${r.dosage}${r.frequency ? ` · ${r.frequency}` : ""}`,
        href: "/portal/prescriptions",
        timestamp: r.createdAt,
        read: false,
      })),
      ...msgRows.map((m) => ({
        id: `msg-${m.id}`,
        type: "message",
        title: "New message from the clinic",
        body: m.deletedAt ? "Message removed" : m.body.slice(0, 140),
        href: "/portal/messages",
        timestamp: m.createdAt,
        read: !!m.isRead,
      })),
    ].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );

    return res.status(200).json(items);
  } catch (error) {
    console.error("[notifications] failed", error);
    return res
      .status(500)
      .json({ message: "Failed to load notifications." });
  }
});

export default router;
