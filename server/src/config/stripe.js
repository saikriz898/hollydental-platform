import Stripe from "stripe";
import dotenv from "dotenv";

dotenv.config();

let stripe;

if (process.env.STRIPE_SECRET_KEY) {
  stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2023-10-16", // use a stable API version
  });
  console.log("Stripe configured successfully.");
} else {
  console.warn("STRIPE_SECRET_KEY is missing. Stripe payments will run in MOCK mode.");
  stripe = {
    paymentIntents: {
      create: async ({ amount, currency, metadata }) => {
        console.log(`[MOCK STRIPE] Creating payment intent for ${amount} ${currency}`);
        return {
          id: "pi_mock_" + Math.random().toString(36).substr(2, 9),
          client_secret: "pi_mock_secret_" + Math.random().toString(36).substr(2, 9),
          amount,
          currency,
          status: "requires_payment_method",
          metadata,
        };
      },
      retrieve: async (id) => {
        console.log(`[MOCK STRIPE] Retrieving payment intent ${id}`);
        return {
          id,
          amount: 5000,
          status: "succeeded",
        };
      },
    },
  };
}

export { stripe };
