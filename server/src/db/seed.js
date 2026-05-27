import { db } from "../config/db.js";
import { users, services, blogPosts } from "./schema.js";
import { eq } from "drizzle-orm";

/**
 * Reference data the application depends on at runtime. We seed this at
 * every boot but the operations are idempotent — existing rows are skipped,
 * not duplicated. NO demo users, appointments, messages, invoices, etc. are
 * created here. Use `npm run seed:doctor` to provision the clinic admin
 * once, and the patient portal handles real patient sign-ups from there.
 */
const SERVICES_TO_SEED = [
  { slug: "general-dentistry", name: "General Dentistry", category: "general", priceFrom: 50, priceTo: 300, durationMinutes: 30 },
  { slug: "dental-checkups", name: "Dental Check-ups & Examinations", category: "general", priceFrom: 50, priceTo: 80, durationMinutes: 30 },
  { slug: "teeth-cleaning", name: "Hygiene & Teeth Cleaning", category: "general", priceFrom: 70, priceTo: 120, durationMinutes: 45 },
  { slug: "teeth-whitening", name: "Teeth Whitening", category: "cosmetic", priceFrom: 250, priceTo: 400, durationMinutes: 60 },
  { slug: "invisalign", name: "Invisalign Clear Aligners", category: "orthodontics", priceFrom: 2500, priceTo: 5000, durationMinutes: 60 },
  { slug: "composite-bonding", name: "Composite Bonding", category: "cosmetic", priceFrom: 250, priceTo: 400, durationMinutes: 60 },
  { slug: "veneers", name: "Porcelain Veneers", category: "cosmetic", priceFrom: 800, priceTo: 1200, durationMinutes: 90 },
  { slug: "smile-design", name: "Smile Design", category: "cosmetic", priceFrom: 500, priceTo: 2000, durationMinutes: 60 },
  { slug: "root-canal", name: "Root Canal Treatment", category: "general", priceFrom: 600, priceTo: 1000, durationMinutes: 90 },
  { slug: "dental-crowns", name: "Dental Crowns", category: "advanced", priceFrom: 800, priceTo: 1000, durationMinutes: 90 },
  { slug: "tooth-extractions", name: "Tooth Extractions", category: "general", priceFrom: 120, priceTo: 250, durationMinutes: 30 },
  { slug: "emergency-dentistry", name: "Emergency Dentistry", category: "general", priceFrom: 80, priceTo: 300, durationMinutes: 45 },
  { slug: "dental-bridges", name: "Dental Bridges", category: "advanced", priceFrom: 1200, priceTo: 2000, durationMinutes: 90 },
  { slug: "gum-treatment", name: "Gum Treatment", category: "advanced", priceFrom: 150, priceTo: 400, durationMinutes: 60 },
  { slug: "composite-fillings", name: "Composite Fillings", category: "general", priceFrom: 80, priceTo: 200, durationMinutes: 30 },
  { slug: "dentures", name: "Dentures", category: "advanced", priceFrom: 800, priceTo: 2000, durationMinutes: 60 },
  { slug: "full-smile-makeovers", name: "Full Smile Makeovers", category: "cosmetic", priceFrom: 3000, priceTo: 8000, durationMinutes: 120 },
  { slug: "digital-smile-consultation", name: "Digital Smile Consultation", category: "cosmetic", priceFrom: 0, priceTo: 100, durationMinutes: 45 },
];

const STARTER_BLOG_POSTS = [
  {
    title: "7 Signs You May Need a Dental Checkup",
    slug: "7-signs-need-dental-checkup",
    excerpt:
      "From persistent sensitivity to bleeding gums, here are the top warning signs that mean it's time to book a checkup at Hollyhill Dental.",
    body: `<p>Twice-yearly checkups are the gold standard, but your mouth often tells you it needs attention before then. If any of the seven signs below sound familiar, book a consultation with our team in Cork.</p>
<h3>1. Persistent tooth sensitivity</h3><p>Sensitivity to hot, cold or sweet foods can mean worn enamel or an early cavity.</p>
<h3>2. Bleeding or swollen gums</h3><p>Healthy gums don't bleed. Bleeding while brushing is the earliest sign of gum disease.</p>
<h3>3. Chronic bad breath</h3><p>If brushing and flossing don't fix it, the cause is usually deeper than diet.</p>
<h3>4. Lingering toothaches</h3><p>A constant ache often signals a deep cavity or cracked tooth.</p>
<h3>5. Dry mouth</h3><p>Saliva protects your enamel; chronic dryness raises decay risk significantly.</p>
<h3>6. Jaw clicking or tenderness</h3><p>Common with grinding (bruxism) or TMJ disorders.</p>
<h3>7. Sores or patches that won't heal</h3><p>Anything in your mouth that lingers more than two weeks should be examined.</p>
<p>If any of these resonate, please call <strong>+353 21 430 3072</strong> or book online.</p>`,
    category: "Preventive Dentistry",
    tags: "checkup, sensitivity, gum health",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=1200",
    seoTitle: "7 Signs You May Need a Dental Checkup | Hollyhill Dental",
    seoDescription:
      "Discover seven warning signs from sensitivity to bleeding gums that mean it's time to book a checkup at Hollyhill Dental in Cork.",
  },
  {
    title: "Benefits of Professional Teeth Whitening",
    slug: "benefits-professional-teeth-whitening",
    excerpt:
      "Why in-clinic whitening is safer, faster and longer-lasting than supermarket whitening kits.",
    body: `<p>Over-the-counter whitening promises a brighter smile but rarely delivers a clinical-grade result. Here's why a professional whitening session at Hollyhill Dental outperforms drugstore kits.</p>
<h3>Stronger, safely applied</h3><p>Our medical-grade gels lift deep stains while custom barriers protect your gums.</p>
<h3>Faster transformation</h3><p>Most patients leave several shades brighter after a single 60-minute visit.</p>
<h3>Longer-lasting results</h3><p>With a take-home top-up kit your bright smile can last 18–24 months.</p>
<p>Curious if whitening suits you? Book a free shade consultation with Dr. Roghay Alizadeh today.</p>`,
    category: "Cosmetic Dentistry",
    tags: "whitening, cosmetic, smile",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=1200",
    seoTitle: "Benefits of Professional Teeth Whitening | Hollyhill Dental",
    seoDescription:
      "Learn why clinical whitening is safer and longer-lasting than retail strips. Cork's Hollyhill Dental explains the science behind the smile.",
  },
  {
    title: "Invisalign vs Traditional Braces",
    slug: "invisalign-vs-traditional-braces",
    excerpt:
      "Comparing aesthetics, comfort, hygiene and treatment speed to help you choose the right alignment option.",
    body: `<p>Both Invisalign and traditional braces straighten teeth effectively, but the patient experience is very different. Here's how to decide.</p>
<h3>Aesthetics</h3><p>Invisalign aligners are virtually invisible, while metal brackets are highly visible.</p>
<h3>Comfort</h3><p>Aligners are smooth thermoplastic; braces can rub the cheeks until your mouth adapts.</p>
<h3>Hygiene</h3><p>Invisalign trays come out for brushing and flossing; braces require special tools to clean.</p>
<h3>Compliance</h3><p>Aligners only work if worn 22 hours a day; braces are fixed and continuous.</p>
<h3>Complex cases</h3><p>Severe crowding or rotated teeth still respond best to fixed appliances.</p>
<p>Not sure which is right for you? Book a digital smile consultation and we'll model both options.</p>`,
    category: "Orthodontics",
    tags: "invisalign, braces, alignment",
    featuredImageUrl:
      "https://images.unsplash.com/photo-1513224506828-ac7c9880c101?auto=format&fit=crop&q=80&w=1200",
    seoTitle: "Invisalign vs Traditional Braces | Hollyhill Dental Cork",
    seoDescription:
      "Compare Invisalign with traditional braces — aesthetics, comfort, hygiene and treatment speed — at Hollyhill Dental Cork.",
  },
];

export const seedDatabase = async () => {
  if (!process.env.DATABASE_URL) {
    console.log("[seed] DATABASE_URL missing, skipping reference seed.");
    return;
  }

  try {
    console.log("[seed] Reference data check…");

    // 1. Services — required for booking, pricing pages, etc.
    let servicesAdded = 0;
    for (const service of SERVICES_TO_SEED) {
      const existing = await db
        .select({ id: services.id })
        .from(services)
        .where(eq(services.slug, service.slug))
        .limit(1);
      if (existing.length === 0) {
        await db.insert(services).values(service);
        servicesAdded += 1;
      }
    }
    if (servicesAdded > 0) {
      console.log(`[seed] Inserted ${servicesAdded} new service(s).`);
    }

    // 2. Starter blog posts — only if a doctor/admin exists to author them.
    // Patient & demo data is intentionally NOT seeded here. Run
    // `npm run seed:doctor` once to provision the clinic admin.
    const admin = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, "admin"))
      .limit(1);

    if (admin.length > 0) {
      const adminId = admin[0].id;
      let postsAdded = 0;
      for (const post of STARTER_BLOG_POSTS) {
        const existing = await db
          .select({ id: blogPosts.id })
          .from(blogPosts)
          .where(eq(blogPosts.slug, post.slug))
          .limit(1);
        if (existing.length === 0) {
          await db.insert(blogPosts).values({
            ...post,
            authorId: adminId,
            status: "published",
            publishedAt: new Date(),
          });
          postsAdded += 1;
        }
      }
      if (postsAdded > 0) {
        console.log(`[seed] Inserted ${postsAdded} starter blog post(s).`);
      }
    } else {
      console.log(
        "[seed] No admin account yet — skipping blog post seed. Run `npm run seed:doctor` to create the clinic admin."
      );
    }

    console.log("[seed] Reference data ready.");
  } catch (error) {
    console.error("[seed] Reference seeding failed:", error);
  }
};
