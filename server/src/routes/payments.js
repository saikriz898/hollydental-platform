import express from "express";

const router = express.Router();

/**
 * Payment endpoints have been retired. The clinic uses a request-and-confirm
 * appointment workflow with no online payment. Anything pointed at this router
 * gets a clear 410 Gone so the frontend (and any external integrations) know
 * the route is intentionally unavailable.
 */
router.all("*", (_req, res) => {
  return res.status(410).json({
    code: "PAYMENTS_DISABLED",
    message:
      "Online payments are not enabled for this clinic. Patients submit appointment requests; fees are handled in person.",
  });
});

export default router;
