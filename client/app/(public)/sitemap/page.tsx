import { SERVICES } from "@/lib/constants";
import Link from "next/link";

export default function SitemapPage() {
  const aftercareSlugs = [
    "tooth-extraction",
    "root-canal",
    "teeth-whitening",
    "composite-bonding",
    "veneers",
    "invisalign",
  ];

  return (
    <div className="space-y-16 pb-16">
      
      {/* Interior Hero */}
      <section className="bg-navy text-white py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gold/10 opacity-40" />
        <div className="relative z-10 space-y-3">
          <h1 className="font-serif text-4xl md:text-5xl font-bold">Clinic Sitemap</h1>
          <p className="text-gray-300 text-xs md:text-sm tracking-wide uppercase">
            Complete page index directory for Hollyhill Dental Clinic
          </p>
        </div>
      </section>

      {/* 3-Column link layout */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-3 gap-12 text-xs">
        
        {/* Col 1: Public & Service Slugs */}
        <div className="space-y-4">
          <h4 className="font-serif text-sm font-bold text-navy border-b border-gray-100 pb-2">Public Site & Services</h4>
          <ul className="space-y-2 text-gray-500 font-medium">
            <li><Link href="/" className="hover:text-gold transition-colors">Homepage</Link></li>
            <li><Link href="/about" className="hover:text-gold transition-colors">About Story</Link></li>
            <li><Link href="/dr-roghay-alizadeh" className="hover:text-gold transition-colors">Dr. Roghay Alizadeh Bio</Link></li>
            <li><Link href="/services" className="hover:text-gold transition-colors">Services Overview</Link></li>
            <li className="pt-2 font-bold text-navy">Individual Treatments:</li>
            {SERVICES.map((s) => (
              <li key={s.slug} className="pl-3">
                <Link href={`/services/${s.slug}`} className="hover:text-gold transition-colors">
                  &bull; {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 2: Patient Resources */}
        <div className="space-y-4">
          <h4 className="font-serif text-sm font-bold text-navy border-b border-gray-100 pb-2">Patient Resources</h4>
          <ul className="space-y-2 text-gray-500 font-medium">
            <li><Link href="/dental-anxiety" className="hover:text-gold transition-colors">Nervous Patient Program</Link></li>
            <li><Link href="/childrens-dentistry" className="hover:text-gold transition-colors">Children's Dentistry</Link></li>
            <li><Link href="/emergency" className="hover:text-gold transition-colors">Emergency Dentistry</Link></li>
            <li><Link href="/gallery" className="hover:text-gold transition-colors">Before/After Gallery</Link></li>
            <li><Link href="/testimonials" className="hover:text-gold transition-colors">Patient Testimonials</Link></li>
            <li className="pt-2 font-bold text-navy">Post-Treatment Aftercare:</li>
            {aftercareSlugs.map((slug) => (
              <li key={slug} className="pl-3">
                <Link href={`/aftercare/${slug}`} className="hover:text-gold transition-colors">
                  &bull; {slug.replace("-", " ")}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Actions & Legal */}
        <div className="space-y-4">
          <h4 className="font-serif text-sm font-bold text-navy border-b border-gray-100 pb-2">Actions & Legal</h4>
          <ul className="space-y-2 text-gray-500 font-medium">
            <li><Link href="/pricing" className="hover:text-gold transition-colors">Pricing & Appointment Booking</Link></li>
            <li><Link href="/insurance-payment" className="hover:text-gold transition-colors">Insurance & Payment Plans</Link></li>
            <li><Link href="/contact" className="hover:text-gold transition-colors">Contact Details</Link></li>
            <li><Link href="/new-patient" className="hover:text-gold transition-colors">New Patient Registration</Link></li>
            <li><Link href="/referral" className="hover:text-gold transition-colors">Patient Referral Scheme</Link></li>
            <li><Link href="/careers" className="hover:text-gold transition-colors">Careers & Vacancies</Link></li>
            <li><Link href="/portal/login" className="hover:text-gold transition-colors">Patient Portal Login</Link></li>
            <li><Link href="/admin/login" className="hover:text-gold transition-colors">Admin Dashboard Login</Link></li>
            <li className="pt-2 font-bold text-navy">Legal compliance:</li>
            <li className="pl-3"><Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link></li>
            <li className="pl-3"><Link href="/privacy" className="hover:text-gold transition-colors">Cookies Settings</Link></li>
            <li className="pl-3"><Link href="/complaints" className="hover:text-gold transition-colors">Complaints Procedure</Link></li>
          </ul>
        </div>

      </section>

    </div>
  );
}
