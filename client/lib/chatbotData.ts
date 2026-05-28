export interface ChatbotFAQ {
  keywords: string[];
  response: string;
}

export const CHATBOT_FAQS: ChatbotFAQ[] = [
  {
    keywords: ["price", "pricing", "cost", "fee", "fees", "how much", "charge", "charges", "expensive", "cheap"],
    response: `Our primary treatment fee guide:
• First Consultation: €40
• Exam, Scale & Polish: €60
• Teeth Whitening Home Kit: €199
• Composite Bonding: €120 - €180 per tooth
• Composite Veneers: €180 - €250 per tooth
• Porcelain Veneers: €650 per tooth
• Crown: €650 per tooth
• Bridges: From €650 per unit
• Extractions: €80 - €109 (Routine), €150 - €200 (Surgical)
• Fillings: €60 (Temporary), €70 - €100 (Silver), €80 - €120 (White)
• Invisalign Go: €2,150 (Single), €2,950 (Double)
• Invisalign Full: €4,000

We also offer interest-free monthly instalment options for Invisalign and veneers. Would you like to book a consultation?`,
  },
  {
    keywords: ["consultation", "consult", "first visit", "exam", "examination", "checkup", "check up", "scale", "polish", "cleaning"],
    response: `A first consultation with Dr. Roghay Alizadeh is €40.
An Exam, Scale & Polish (cleaning) is €60 (done in the same appointment).
If you qualify under the PRSI dental benefit, you are entitled to a free annual exam and a subsidized cleaning (only €15 out-of-pocket instead of €60!).`,
  },
  {
    keywords: ["root canal", "nerve", "endodontics"],
    response: `Root Canal Treatment (which includes the filling of the access cavity) is priced by tooth type:
• Incisor: €350
• Canine: €350
• Pre-Molar: €450
• Molar: €650
Would you like to book a consultation to address tooth pain?`,
  },
  {
    keywords: ["invisalign", "aligner", "aligners", "braces", "orthodontics", "straighten"],
    response: `We specialize in Invisalign orthodontic clear aligners:
• Invisalign Go (Single Arch): €2,150
• Invisalign Go (Double Arch): €2,950
• Invisalign Full: €4,000

We offer 0% interest monthly instalment plans to help spread the cost. Would you like to schedule an Invisalign consultation?`,
  },
  {
    keywords: ["bonding", "composite bonding", "chipped", "chips", "spaces", "gap", "gaps"],
    response: `Composite Bonding is a non-invasive cosmetic treatment to repair chipped, stained, or uneven teeth:
• €120 - €180 per tooth
We also offer Composite Veneers at €180 - €250 per tooth. This can be completed in a single visit!`,
  },
  {
    keywords: ["veneer", "veneers", "porcelain"],
    response: `We offer custom wafer-thin Porcelain Veneers to create a flawless, natural smile:
• Porcelain Veneers: €650 per tooth
• Composite Veneers: €180 - €250 per tooth
installements can be arranged. Would you like to book a cosmetic consult?`,
  },
  {
    keywords: ["crown", "crowns", "cap", "caps"],
    response: `Dental Crowns encase weak or heavily filled teeth to restore their strength:
• Crown (per tooth): €650
These are bespoke and custom-matched to your surrounding teeth.`,
  },
  {
    keywords: ["bridge", "bridges"],
    response: `Dental Bridges span gaps left by missing teeth:
• Bridges (per unit): From €650
They are fixed, durable, and act like natural teeth.`,
  },
  {
    keywords: ["filling", "fillings", "cavity", "decay", "tooth ache"],
    response: `We use natural-looking materials for fillings:
• Temporary Filling: €60
• Silver (Amalgam) Filling: €70 - €100
• White (Composite) Filling: €80 - €120`,
  },
  {
    keywords: ["extraction", "extractions", "pull", "wisdom", "remove tooth"],
    response: `Our extractions are performed gently and comfortably:
• Routine Extraction: €80 - €109
• Surgical Extraction: €150 - €200`,
  },
  {
    keywords: ["hour", "hours", "time", "times", "open", "opening", "saturday", "weekend", "sunday"],
    response: `Hollyhill Dental is open:
• Monday to Friday: 9:00am – 5:30pm
• Saturday: 9:00am – 2:00pm
• Sunday: Closed
We reserve emergency slots daily, so please contact us early if you are in pain.`,
  },
  {
    keywords: ["address", "location", "where", "cork", "map", "directions", "park", "parking"],
    response: `We are located at:
Unit 6, Hollyhill Shopping Centre, Co. Cork, T23 E030, Ireland.
There is extensive, free parking directly in front of the clinic!`,
  },
  {
    keywords: ["phone", "call", "telephone", "contact", "email", "whatsapp", "number"],
    response: `You can reach Hollyhill Dental at:
• Phone: +353 21 430 3072
• WhatsApp: Chat at wa.me/353214303072
• Email: info@hollyhilldental.ie`,
  },
  {
    keywords: ["book", "booking", "schedule", "appointment", "reserve", "slot"],
    response: `Booking is easy! Sign in to the Hollyhill Dental Patient Portal to select a date and request an appointment slot. No credit card is required to book; our administrative team will confirm your slot via email within 24 hours.`,
  },
  {
    keywords: ["medical card", "medical cards", "prsi", "social welfare", "benefit"],
    response: `Yes! We accept medical cards for eligible treatments under the GMS scheme.
Additionally, if you contribute to PRSI, you qualify for one free dental exam and a subsidized cleaning (€15 out-of-pocket instead of €60) per calendar year. We check eligibility at booking.`,
  },
  {
    keywords: ["doctor", "dentist", "roghay", "roghayeh", "alizadeh", "team", "who"],
    response: `Our principal cosmetic dentist is Dr. Roghay Alizadeh. She has over 20 years of clinical experience in Cork, specializing in advanced aesthetic smile makeovers, porcelain veneers, composite bonding, and gentle treatment for nervous patients.`,
  },
];

export const DEFAULT_RESPONSE = `I'm here to help with any questions about Hollyhill Dental! You can ask about:
• Pricing (e.g., "how much is bonding/cleaning?")
• Opening Hours & Location
• PRSI and Medical Card options
• Booking an appointment online
• Our principal dentist, Dr. Roghay Alizadeh

Alternatively, you can call us at +353 21 430 3072.`;
