import express from "express";
import { db } from "../config/db.js";
import { users, patients, auditLogs, passwordResetTokens } from "../db/schema.js";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";
import { verifyToken } from "../middleware/auth.js";
import { requireRole } from "../middleware/roleCheck.js";
import { logActivity, AuditActions } from "../lib/auditLog.js";

const router = express.Router();

function requireDb(res) {
  if (!process.env.DATABASE_URL) {
    res.status(503).json({ message: "Admin service is not configured." });
    return false;
  }
  return true;
}

/**
 * 1. Force a user to change their password on next login.
 *    Body: { reason?: string }
 */
router.post(
  "/users/:id/force-password-change",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    if (!requireDb(res)) return;
    const { reason } = req.body || {};

    try {
      const targetRows = await db
        .select()
        .from(users)
        .where(eq(users.id, req.params.id))
        .limit(1);
      const target = targetRows[0];
      if (!target) {
        return res.status(404).json({ message: "User not found." });
      }

      await db
        .update(users)
        .set({ mustChangePassword: true, updatedAt: new Date() })
        .where(eq(users.id, target.id));

      await logActivity(req, AuditActions.ADMIN_USER_PASSWORD_RESET, {
        targetType: "user",
        targetId: target.id,
        metadata: { reason: reason || null, email: target.email },
      });

      return res.status(200).json({
        message: "Password reset required for this user.",
        user: {
          id: target.id,
          email: target.email,
          role: target.role,
          mustChangePassword: true,
        },
      });
    } catch (err) {
      console.error("[admin.force_password_change] failed", err);
      return res
        .status(500)
        .json({ message: "Failed to enforce password reset." });
    }
  }
);

/**
 * 2. List recent audit log entries.
 *    Supports ?limit, ?action, ?actorId, ?targetId, ?since.
 */
router.get(
  "/audit-logs",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    if (!requireDb(res)) return;
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 100, 1), 500);
    const { action, actorId, targetId, since, search } = req.query;

    try {
      const filters = [];
      if (action) filters.push(eq(auditLogs.action, String(action)));
      if (actorId) filters.push(eq(auditLogs.actorId, String(actorId)));
      if (targetId) filters.push(eq(auditLogs.targetId, String(targetId)));
      if (since) {
        const date = new Date(String(since));
        if (!Number.isNaN(date.getTime())) {
          filters.push(sql`${auditLogs.createdAt} >= ${date}`);
        }
      }
      if (search) {
        filters.push(
          or(
            ilike(auditLogs.action, `%${search}%`),
            ilike(auditLogs.targetType, `%${search}%`)
          )
        );
      }

      const rows = await db
        .select()
        .from(auditLogs)
        .where(filters.length ? and(...filters) : undefined)
        .orderBy(desc(auditLogs.createdAt))
        .limit(limit);

      return res.status(200).json(rows);
    } catch (err) {
      console.error("[admin.audit_logs] failed", err);
      return res.status(500).json({ message: "Failed to load audit logs." });
    }
  }
);

/**
 * 4. List pending password reset requests with the human-readable code so
 * staff can read it back to the patient (no email is sent).
 */
router.get(
  "/password-resets",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    if (!requireDb(res)) return;
    try {
      const rows = await db
        .select({
          id: passwordResetTokens.id,
          userId: passwordResetTokens.userId,
          status: passwordResetTokens.status,
          displayCode: passwordResetTokens.displayCode,
          expiresAt: passwordResetTokens.expiresAt,
          createdAt: passwordResetTokens.createdAt,
          usedAt: passwordResetTokens.usedAt,
          resolvedAt: passwordResetTokens.resolvedAt,
          email: users.email,
          role: users.role,
        })
        .from(passwordResetTokens)
        .leftJoin(users, eq(passwordResetTokens.userId, users.id))
        .orderBy(desc(passwordResetTokens.createdAt));
      return res.status(200).json(rows);
    } catch (err) {
      console.error("[admin.password_resets] failed", err);
      return res
        .status(500)
        .json({ message: "Failed to load password reset queue." });
    }
  }
);

/**
 * 5. Mark a reset request resolved (admin spoke to the patient and read out
 * the code, or determined the request was illegitimate).
 */
router.post(
  "/password-resets/:id/resolve",
  verifyToken,
  requireRole("admin"),
  async (req, res) => {
    if (!requireDb(res)) return;
    try {
      const [updated] = await db
        .update(passwordResetTokens)
        .set({
          status: "resolved",
          resolvedAt: new Date(),
          resolvedBy: req.user.id,
          displayCode: null,
        })
        .where(eq(passwordResetTokens.id, req.params.id))
        .returning();
      if (!updated) {
        return res.status(404).json({ message: "Reset request not found." });
      }
      await logActivity(req, "auth.password.reset_resolved", {
        targetType: "password_reset",
        targetId: req.params.id,
      });
      return res.status(200).json({ message: "Marked as resolved." });
    } catch (err) {
      console.error("[admin.password_resets.resolve] failed", err);
      return res.status(500).json({ message: "Failed to update request." });
    }
  }
);


export default router;
