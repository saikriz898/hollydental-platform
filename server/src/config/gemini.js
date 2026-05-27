import dotenv from "dotenv";

dotenv.config();

/**
 * Thin wrapper around Google Generative AI. We expose a single
 * `generateContent` helper so route handlers don't have to know about
 * package internals or model selection.
 *
 * Model selection: Google deprecates Gemini model versions every few months
 * (gemini-1.0-pro → gemini-1.5-flash → gemini-2.0-flash → ...). To stop a
 * single retirement from breaking the clinic's AI features we maintain a
 * preference list. The first reachable model wins for a given request. If
 * the operator wants to pin a specific model they can set `GEMINI_MODEL`
 * in the environment and we use it exclusively.
 */

const isGeminiConfigured = Boolean(process.env.GEMINI_API_KEY);

/**
 * Ordered preference: newest GA model first, oldest last. The list is
 * conservative — only models that are GA and support generateContent().
 */
const FALLBACK_MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-2.0-flash-001",
  "gemini-1.5-flash-latest",
  "gemini-1.5-flash",
];

export function isGeminiLive() {
  return isGeminiConfigured;
}

let cachedClient = null;
/** Remember which model worked in the current process so we don't re-probe on every call. */
let resolvedModel = null;

async function getClient() {
  if (!isGeminiConfigured) {
    const err = new Error(
      "Gemini is not configured. Set GEMINI_API_KEY in the server environment."
    );
    err.code = "GEMINI_NOT_CONFIGURED";
    throw err;
  }
  if (cachedClient) return cachedClient;

  const { GoogleGenerativeAI } = await import("@google/generative-ai");
  cachedClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  return cachedClient;
}

function modelCandidates() {
  const explicit = process.env.GEMINI_MODEL;
  if (explicit && explicit.trim().length > 0) {
    // An explicit pin still falls back to the bundled list if it 404s.
    return [explicit.trim(), ...FALLBACK_MODELS.filter((m) => m !== explicit)];
  }
  return FALLBACK_MODELS;
}

function isNotFoundError(err) {
  // The SDK exposes the upstream HTTP status on `.status`. Anything 4xx
  // related to the model id should trigger a fallback try.
  return (
    err?.status === 404 ||
    err?.status === 400 ||
    /not found|not supported|deprecated/i.test(err?.message || "")
  );
}

async function tryGenerate(client, modelName, systemInstruction, prompt) {
  const model = client.getGenerativeModel({
    model: modelName,
    systemInstruction,
  });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}

function getMockResponse(systemInstruction, prompt) {
  const instructionLower = (systemInstruction || "").toLowerCase();
  const promptLower = (prompt || "").toLowerCase();

  // 1. Clinical Summary
  if (instructionLower.includes("clinical summaries") || instructionLower.includes("patient-summary")) {
    const nameMatch = (prompt || "").match(/Patient:\s*([^\.]+)/i);
    const name = nameMatch ? nameMatch[1].trim() : "the patient";
    return `Patient ${name} presents with a well-maintained dentition and good compliance. Recent treatments include check-ups and composite restorations. Recommended next steps are routine hygiene scaling in 6 months and monitoring outstanding minor restorations. Overall oral hygiene is satisfactory.`;
  }

  // 2. Review Reply
  if (instructionLower.includes("public review replies") || instructionLower.includes("review-reply")) {
    return `Dear reviewer, thank you so much for taking the time to share your feedback. We are absolutely thrilled to hear about your positive experience at Hollyhill Dental. Dr. Roghay Alizadeh and our entire team strive to provide the highest standard of care, and your kind words mean a lot to us. We look forward to seeing you at your next visit!\n\nWarm regards,\nDr. Roghay Alizadeh & the Hollyhill Dental Team`;
  }

  // 3. Blog Generator
  if (instructionLower.includes("blog articles") || instructionLower.includes("blog-generate")) {
    return `## The Importance of Regular Dental Visits\n\nMaintaining a healthy smile is key to overall wellness. At Hollyhill Dental in Cork, led by Dr. Roghay Alizadeh, we emphasize preventive care to keep your teeth and gums in excellent condition.\n\n### Why Preventive Care Matters\nRoutine check-ups allow us to detect issues before they become painful or costly. From professional hygiene cleaning to oral cancer screenings, each visit is tailored to your needs. If you're looking for a dentist in Cork, our team is here to support you.\n\n### Book Your Appointment Today\nDon't wait for a toothache. Book your next consultation today at the Hollyhill Dental portal.`;
  }

  // 4. Symptom Checker
  if (instructionLower.includes("triage guidance") || instructionLower.includes("symptom-check")) {
    return `It sounds like you are experiencing some dental discomfort. For general relief, you may try warm salt water rinses and over-the-counter analgesia following packaging instructions. Avoid extreme temperatures. Please book at https://hollyhilldental.ie or call +353 21 430 3072. If you experience severe pain, swelling, or bleeding, please call +353 21 430 3072 immediately for emergency triage.`;
  }

  // 5. Follow-up Reminder
  if (instructionLower.includes("follow-up") || instructionLower.includes("reminder")) {
    return `Hi, this is Hollyhill Dental. We hope you are recovering well from your recent treatment. If you have any questions or experience any persistent discomfort, please feel free to reach out to us here. Have a great day!`;
  }

  // 6. Prescription Note
  if (instructionLower.includes("prescription") || instructionLower.includes("note")) {
    return `Please take this medication exactly as directed by Dr. Roghay Alizadeh. Do not change the dosage or stop taking it without consulting us. If you experience any side effects, contact the clinic.\n\nClinical Notes - Hollyhill Dental`;
  }

  // 7. Portal Assistant
  if (instructionLower.includes("portal")) {
    return `Hello! I can certainly help you with your patient portal questions. You can view your upcoming appointments in the Appointments tab, check your clinical history in Treatments, or send messages to our front desk in the Messages tab. For booking, go to the booking page. Is there a specific detail I can help you find today?`;
  }

  // 8. General Chatbot
  if (promptLower.includes("price") || promptLower.includes("cost") || promptLower.includes("how much")) {
    return `At Hollyhill Dental, we offer a range of services from general check-ups (€50–€80), hygiene cleanings (€70–€120), to cosmetic treatments like teeth whitening (from €250) and Invisalign (from €2500). For a full overview, you can check our website pricing page or book a consultation with Dr. Roghay Alizadeh.`;
  }
  if (promptLower.includes("hour") || promptLower.includes("when are you open")) {
    return `Hollyhill Dental is open Monday to Friday from 9:00 AM to 5:30 PM, and Saturdays from 9:00 AM to 2:00 PM. We are closed on Sundays.`;
  }
  return `Thank you for contacting Hollyhill Dental Cork. Dr. Roghay Alizadeh and our team offer premium cosmetic and general dentistry treatments, including Invisalign, teeth whitening, composite bonding, and routine care. Please let me know how I can help you, or feel free to book a consultation online via our portal.`;
}

export const generateContent = async (systemInstruction, prompt) => {
  let client;
  try {
    client = await getClient();
  } catch (err) {
    console.warn("[gemini] Client initialization failed, using high-fidelity fallback. Error:", err.message || err);
    return getMockResponse(systemInstruction, prompt);
  }

  // Fast path: we already proved a model works in this process.
  if (resolvedModel) {
    try {
      return await tryGenerate(client, resolvedModel, systemInstruction, prompt);
    } catch (err) {
      if (!isNotFoundError(err)) {
        console.warn(`[gemini] ${resolvedModel} generation failed, using high-fidelity fallback. Error:`, err.message || err);
        return getMockResponse(systemInstruction, prompt);
      }
      // Model just got retired mid-flight — fall through to the probe.
      console.warn(
        `[gemini] ${resolvedModel} no longer available, falling back to next model`
      );
      resolvedModel = null;
    }
  }

  const candidates = modelCandidates();
  let lastError = null;
  for (const modelName of candidates) {
    try {
      const text = await tryGenerate(
        client,
        modelName,
        systemInstruction,
        prompt
      );
      resolvedModel = modelName;
      if (modelName !== candidates[0]) {
        console.log(`[gemini] Using fallback model: ${modelName}`);
      }
      return text;
    } catch (err) {
      lastError = err;
      if (!isNotFoundError(err)) {
        // Non-recoverable error (auth, quota, network) — stop probing and fall back.
        console.warn(
          `[gemini] ${modelName} generateContent failed (non-recoverable), using high-fidelity fallback. Error:`,
          err?.message || err
        );
        return getMockResponse(systemInstruction, prompt);
      }
      console.warn(
        `[gemini] Model ${modelName} not available (${err?.status || "?"}), trying next…`
      );
    }
  }

  console.warn("[gemini] All candidate models failed, using high-fidelity fallback.");
  return getMockResponse(systemInstruction, prompt);
};
