"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CLINIC } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock, ChevronDown, ChevronUp } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useAuthStore } from "@/store/useAuthStore";

export default function Footer() {
  const router = useRouter();
  const { openLoginModal } = useUIStore();
  const { user } = useAuthStore();
  const [openAccordions, setOpenAccordions] = useState<{ [key: string]: boolean }>({
    quickLinks: false,
    patientLinks: false,
    contactInfo: false,
  });

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const goToBooking = () => {
    const target = "/portal/booking";
    if (user) {
      router.push(target);
      return;
    }
    openLoginModal(() => router.push(target));
  };

  return (
    <footer className="bg-navy text-white pt-16 pb-24 xl:pb-8 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8 xl:gap-12">
        
        {/* Column 1: Brand & Badges */}
        <div className="space-y-6">
          <Link href="/" className="flex items-center gap-2">
            <img
              src="/logo.png"
              alt="Hollyhill Dental Logo"
              className="w-9 h-9 object-contain"
            />
            <span className="font-serif text-lg md:text-xl font-bold tracking-wide text-white">
              {CLINIC.name}
            </span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
            {CLINIC.tagline}. Leading-edge clinical care with a 5-star hotel luxury experience.
          </p>

          {/* Badges Row */}
          <div className="flex flex-wrap gap-4 pt-2">
            {/* Google Rating Badge */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex items-center gap-3">
              <span className="text-lg font-bold text-white">5.0</span>
              <div>
                <span className="block text-[10px] text-gray-400 uppercase font-semibold">Google Reviews</span>
                <span className="block text-xs text-gold">★★★★★</span>
              </div>
            </div>
            {/* IDC Register Badge */}
            <div className="bg-white/5 border border-white/10 rounded-lg p-3 flex flex-col justify-center">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Irish Dental</span>
              <span className="text-xs text-white font-medium">Council Registered</span>
            </div>
          </div>
        </div>

        {/* Column 2: Quick Links (Accordion on mobile) */}
        <div>
          {/* Mobile header */}
          <div
            className="flex items-center justify-between md:block cursor-pointer md:cursor-default py-3 border-b border-white/10 md:border-0"
            onClick={() => toggleAccordion("quickLinks")}
          >
            <h4 className="text-sm font-semibold tracking-wider text-gold uppercase font-serif">Quick Links</h4>
            <span className="md:hidden">
              {openAccordions.quickLinks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          </div>

          {/* List */}
          <ul
            className={`mt-4 space-y-3 text-sm text-gray-400 ${
              openAccordions.quickLinks ? "block" : "hidden md:block"
            }`}
          >
            <li><Link href="/services" className="hover:text-gold transition-colors">Services Overview</Link></li>
            <li><Link href="/about" className="hover:text-gold transition-colors">About Us</Link></li>
            <li><Link href="/pricing" className="hover:text-gold transition-colors">Pricing Guide</Link></li>
            <li><Link href="/blog" className="hover:text-gold transition-colors">Blog CMS</Link></li>
            <li><Link href="/contact" className="hover:text-gold transition-colors">Contact</Link></li>
            <li>
              <Link href="/emergency" className="text-red-500 font-semibold hover:text-red-400 transition-colors">
                Dental Emergency
              </Link>
            </li>
          </ul>
        </div>

        {/* Column 3: Patient Links (Accordion on mobile) */}
        <div>
          <div
            className="flex items-center justify-between md:block cursor-pointer md:cursor-default py-3 border-b border-white/10 md:border-0"
            onClick={() => toggleAccordion("patientLinks")}
          >
            <h4 className="text-sm font-semibold tracking-wider text-gold uppercase font-serif">Patient Resources</h4>
            <span className="md:hidden">
              {openAccordions.patientLinks ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          </div>

          <ul
            className={`mt-4 space-y-3 text-sm text-gray-400 ${
              openAccordions.patientLinks ? "block" : "hidden md:block"
            }`}
          >
            <li><button onClick={goToBooking} className="hover:text-gold transition-colors text-left cursor-pointer border-0 bg-transparent p-0 text-sm font-sans">Book Appointment</button></li>
            <li><button onClick={() => openLoginModal()} className="hover:text-gold transition-colors text-left cursor-pointer border-0 bg-transparent p-0 text-sm font-sans">Patient Portal</button></li>
            <li><Link href="/new-patient" className="hover:text-gold transition-colors">New Patient Form</Link></li>
            <li><Link href="/gallery" className="hover:text-gold transition-colors">Before/After Gallery</Link></li>
            <li><Link href="/testimonials" className="hover:text-gold transition-colors">Testimonials</Link></li>
            <li><Link href="/referral" className="hover:text-gold transition-colors">Patient Referral</Link></li>
          </ul>
        </div>

        {/* Column 4: Contact & Hours (Accordion on mobile) */}
        <div>
          <div
            className="flex items-center justify-between md:block cursor-pointer md:cursor-default py-3 border-b border-white/10 md:border-0"
            onClick={() => toggleAccordion("contactInfo")}
          >
            <h4 className="text-sm font-semibold tracking-wider text-gold uppercase font-serif">Contact & Hours</h4>
            <span className="md:hidden">
              {openAccordions.contactInfo ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          </div>

          <div
            className={`mt-4 space-y-4 text-sm text-gray-400 ${
              openAccordions.contactInfo ? "block" : "hidden md:block"
            }`}
          >
            <a
              href="https://maps.app.goo.gl/8LiV9dg7KN5ApjYf9"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start gap-3 hover:text-gold transition-colors"
            >
              <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <span>{CLINIC.address}</span>
            </a>
            <div className="flex items-center gap-3">
              <Phone className="w-5 h-5 text-gold shrink-0" />
              <a href={CLINIC.phoneHref} className="text-gold font-semibold hover:underline">
                {CLINIC.phone}
              </a>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-gold shrink-0" />
              <a href={`mailto:${CLINIC.email}`} className="hover:text-gold transition-colors">
                {CLINIC.email}
              </a>
            </div>
            <div className="flex items-start gap-3 pt-2">
              <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <span className="block">{CLINIC.hours.weekdays}</span>
                <span className="block">{CLINIC.hours.saturday}</span>
                <span className="block text-red-400">{CLINIC.hours.sunday}</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="max-w-7xl mx-auto px-4 md:px-8 mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
        <span>&copy; {new Date().getFullYear()} Hollyhill Dental Cork. All rights reserved.</span>
        <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
          <Link href="/privacy" className="hover:text-gold transition-colors">Privacy Policy</Link>
          <Link href="/privacy" className="hover:text-gold transition-colors">Cookie Policy</Link>
          <Link href="/complaints" className="hover:text-gold transition-colors">Complaints Procedure</Link>
          <Link href="/sitemap" className="hover:text-gold transition-colors">Sitemap</Link>
          <span className="text-gray-600">GDPR Contact: {CLINIC.gdprEmail}</span>
        </div>
      </div>
    </footer>
  );
}
