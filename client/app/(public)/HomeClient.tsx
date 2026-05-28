"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { CLINIC } from "@/lib/constants";
import { 
  Star, 
  ShieldCheck, 
  Award, 
  HeartHandshake, 
  HelpCircle, 
  ArrowRight, 
  Clock,
  Smile,
  Calendar,
  Users,
  Activity,
  Heart,
  Sparkles,
  ChevronRight,
  Shield,
  Phone,
  CheckCircle,
  Quote
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import BeforeAfterSlider from "@/components/public/BeforeAfterSlider";

/* -------------------- 3D Scroll Animation Wrapper -------------------- */
function Scroll3D({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      {
        threshold: 0.05, // triggers when at least 5% of the element is visible
        rootMargin: "0px 0px -80px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      window.removeEventListener("resize", checkMobile);
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const outOfViewTransform = isMobile
    ? "translateY(20px) scale(0.99)" // Soft slide & scale on mobile to prevent layout issues
    : "translateY(50px) rotateX(6deg) scale(0.98)"; // Premium 3D perspective rotation on desktop

  const inViewTransform = isMobile
    ? "translateY(0px) scale(1)"
    : "translateY(0px) rotateX(0deg) scale(1)";

  return (
    <div
      ref={ref}
      className={`transition-all duration-[1000ms] transform ${className}`}
      style={{
        opacity: isIntersecting ? 1 : 0,
        transform: isIntersecting ? inViewTransform : outOfViewTransform,
        perspective: isMobile ? undefined : "1000px",
        transformStyle: isMobile ? undefined : "preserve-3d",
        transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
      }}
    >
      {children}
    </div>
  );
}

export default function HomeClient() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isHeroVideoPlaying, setIsHeroVideoPlaying] = useState(false);
  const router = useRouter();
  const { user } = useAuthStore();
  const { openLoginModal } = useUIStore();

  const goToBooking = () => {
    const target = "/portal/booking";
    if (user) {
      router.push(target);
      return;
    }
    openLoginModal(() => {
      router.push(target);
    });
  };

  const faqs = [
    {
      q: "Do you offer same-day appointments for dental emergencies?",
      a: "Yes! We reserve dedicated emergency slots daily. If you have severe toothache, bleeding, or a broken tooth, call us immediately at +353 21 430 3072 so we can schedule you today.",
    },
    {
      q: "Can I pay for my dental treatments in instalments?",
      a: "Absolutely. We offer tailored, interest-free payment plans for major treatments like Invisalign and Porcelain Veneers. Speak to our team to arrange monthly instalments.",
    },
    {
      q: "How does the PRSI dental benefit work?",
      a: "If you qualify under PRSI, you are entitled to one free dental exam and a subsidized teeth cleaning (€15 charge instead of the standard rate) once per calendar year.",
    },
    {
      q: "Is parking available at the clinic?",
      a: "Yes, we are located in Unit 6 of the Hollyhill Shopping Centre in Cork, which offers extensive free parking directly in front of the clinic.",
    },
  ];

  return (
    <div className="space-y-24 pb-32 md:pb-16 bg-white overflow-hidden font-sans">
      
      {/* 1. HERO SECTION (Preloaded background video + centered typography update for readability) */}
      <section className="relative pt-10 pb-16 md:py-16 lg:py-24 overflow-hidden bg-navy min-h-[calc(100dvh-144px)] md:min-h-[600px] lg:min-h-[700px] flex items-center justify-center text-center">
        {/* Background Video */}
        <video
          src="/hero-bg.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover z-0 opacity-100"
        />
        
        {/* Dark Navy Overlay to keep video visible and crisp */}
        <div className="absolute inset-0 bg-navy/40 z-0" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,173,239,0.2),transparent_60%)] z-0" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full flex flex-col items-center justify-center space-y-6 md:space-y-8 relative z-10">
          
          {/* Top Badge */}
          <span className="inline-flex items-center gap-1.5 bg-gold/20 text-gold text-xs font-semibold tracking-wider px-4 py-1.5 rounded-full border border-gold/30 animate-fade-up">
            <Shield className="w-3.5 h-3.5" /> Advanced Dental Care Excellence
          </span>
          
          {/* Headline */}
          <h1 className="font-serif text-4xl sm:text-5xl md:text-6.5xl font-bold leading-[1.15] text-white tracking-tight animate-fade-up" style={{ color: '#ffffff' }}>
            Complete Dental Care <br />
            <span className="text-gold" style={{ color: '#00ADEF' }}>For Every Smile</span>
          </h1>
          
          {/* Subtext */}
          <p className="text-gray-200 text-sm md:text-base leading-relaxed max-w-2xl font-normal animate-fade-up" style={{ color: '#e5e7eb' }}>
            Experience dental precision paired with a gentle touch. Our expert team utilizes state-of-the-art technology to ensure your smile remains your most confident asset.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center pt-2 md:pt-4 w-full animate-fade-up">
            <button
              onClick={goToBooking}
              className="bg-gold hover:bg-[#009bde] text-white text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-full shadow-[0_4px_0_0_#008BCC] hover:shadow-[0_5px_0_0_#008BCC] hover:translate-y-[-1px] active:translate-y-[3px] active:shadow-none transition-all duration-75 cursor-pointer flex items-center gap-2"
            >
              <Calendar className="w-4 h-4" /> Schedule Your Visit
            </button>
            <Link
              href="/services"
              className="border border-white/20 hover:border-gold hover:text-gold text-white text-xs font-semibold uppercase tracking-wider px-8 py-4 rounded-full shadow-[0_4px_0_0_rgba(255,255,255,0.1)] hover:shadow-[0_5px_0_0_rgba(255,255,255,0.15)] hover:translate-y-[-1px] active:translate-y-[3px] active:shadow-none transition-all duration-75 flex items-center gap-1.5 bg-white/10 hover:bg-white/20 backdrop-blur-md"
            >
              View All Services
            </Link>
          </div>

          {/* Social Proof Row */}
          <div className="flex items-center justify-center gap-4 pt-4 mt-4 md:pt-6 md:mt-6 border-t border-white/10 w-full max-w-md mx-auto animate-fade-up">
            <div className="flex -space-x-3">
              <img
                src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
                alt="Patient"
                className="w-10 h-10 rounded-full border-2 border-navy object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
                alt="Patient"
                className="w-10 h-10 rounded-full border-2 border-navy object-cover"
              />
              <img
                src="https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
                alt="Patient"
                className="w-10 h-10 rounded-full border-2 border-navy object-cover"
              />
            </div>
            <div className="text-left">
              <p className="text-xs font-bold text-white">Trusted by 10K+ Patients</p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-[10px] text-gray-300 font-semibold">(5.0 Rating)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PATIENT-CENTERED EXCELLENCE (Features strip wrapped in Scroll3D) */}
      <Scroll3D>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-navy tracking-tight leading-tight">
              Patient-Centered Excellence
            </h2>
            <p className="text-gray-500 text-xs md:text-sm max-w-xl mx-auto leading-relaxed font-light">
              We believe dental care should be more than just procedures. It's about building relationships based on trust, comfort, and exceptional results.
            </p>
          </div>

          {/* Feature Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            
            {/* Card 1 */}
            <div className="group bg-gradient-to-b from-white to-[#fdfcf9] rounded-3xl border border-gold/15 hover:border-gold/45 p-8 shadow-[0_15px_40px_rgba(10,22,40,0.03)] hover:shadow-[0_25px_50px_rgba(10,22,40,0.08)] transition-all duration-300 flex flex-col gap-5 items-start hover:-translate-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-navy text-gold flex items-center justify-center shrink-0 border border-gold/20 shadow-md group-hover:scale-105 transition-transform duration-300">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Compassionate Care</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                Our team is dedicated to making every clinical step easy, quiet, and pain-free for children and adults alike.
              </p>
            </div>

            {/* Card 2 */}
            <div className="group bg-gradient-to-b from-white to-[#fdfcf9] rounded-3xl border border-gold/15 hover:border-gold/45 p-8 shadow-[0_15px_40px_rgba(10,22,40,0.03)] hover:shadow-[0_25px_50px_rgba(10,22,40,0.08)] transition-all duration-300 flex flex-col gap-5 items-start hover:-translate-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-navy text-gold flex items-center justify-center shrink-0 border border-gold/20 shadow-md group-hover:scale-105 transition-transform duration-300">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Advanced Tech</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                From low-radiation digital x-rays to intraoral imaging, we select advanced technology to guarantee accuracy and minimize discomfort.
              </p>
            </div>

            {/* Card 3 */}
            <div className="group bg-gradient-to-b from-white to-[#fdfcf9] rounded-3xl border border-gold/15 hover:border-gold/45 p-8 shadow-[0_15px_40px_rgba(10,22,40,0.03)] hover:shadow-[0_25px_50px_rgba(10,22,40,0.08)] transition-all duration-300 flex flex-col gap-5 items-start hover:-translate-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-navy text-gold flex items-center justify-center shrink-0 border border-gold/20 shadow-md group-hover:scale-105 transition-transform duration-300">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-bold text-navy uppercase tracking-wider">Tailored Plans</h3>
              <p className="text-xs text-gray-500 leading-relaxed font-light">
                No two smiles are the same. We develop custom treatment plans that align with your oral health goals and budget.
              </p>
            </div>
          </div>
        </section>
      </Scroll3D>

      {/* 3. COMPLETE DENTAL SERVICES (Grid Masonry wrapped in Scroll3D) */}
      <Scroll3D>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-2">
              <h2 className="font-serif text-3xl font-bold text-navy tracking-tight leading-tight">
                Complete Dental Services
              </h2>
              <p className="text-gray-400 text-xs md:text-sm font-light">
                Comprehensive solutions for your family's oral health.
              </p>
            </div>
            <Link
              href="/services"
              className="inline-flex items-center gap-2 border border-navy/10 hover:border-gold hover:text-gold text-navy text-[11px] font-bold tracking-widest uppercase px-6 py-3 rounded-full shadow-[0_3px_0_0_rgba(10,22,40,0.06)] hover:shadow-[0_4px_0_0_rgba(10,22,40,0.1)] hover:translate-y-[-1px] active:translate-y-[2px] active:shadow-none transition-all duration-75 shrink-0 self-start md:self-auto bg-white cursor-pointer"
            >
              View More Services
              <ArrowRight className="w-3.5 h-3.5 text-gold" />
            </Link>
          </div>

          {/* Masonry Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            
            {/* Card 1: General Dentistry (Landscape 2/3 width) */}
            <div 
              onClick={() => router.push("/services/general-dentistry")}
              className="lg:col-span-2 group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 h-[300px] cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1629909615184-74f495363b67?auto=format&fit=crop&q=80&w=600"
                alt="General Dentistry Room"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 space-y-3 text-white">
                <span className="text-[9px] uppercase tracking-wider font-bold text-gold bg-gold/10 border border-gold/25 px-2.5 py-0.5 rounded-full inline-block">
                  PREVENTATIVE
                </span>
                <h3 className="font-serif text-xl font-bold">General Dentistry</h3>
                <p className="text-gray-300 text-xs leading-relaxed max-w-lg font-light line-clamp-2">
                  Routine check-ups, fillings, and cleanings to maintain your healthy smile.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold group-hover:underline">
                  Learn More <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Card 2: Cosmetic Dentistry (Tall 1/3 width, solid blue bg) */}
            <div 
              onClick={() => router.push("/services/teeth-whitening")}
              className="lg:col-span-1 group rounded-3xl p-8 text-white bg-gold flex flex-col justify-between h-[300px] shadow-sm hover:shadow-lg hover:bg-gold-dark transition-all duration-300 cursor-pointer relative overflow-hidden"
            >
              <div className="absolute -top-12 -right-12 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              
              <div className="space-y-4 relative z-10">
                <div className="w-11 h-11 rounded-full bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="font-serif text-xl font-bold">Cosmetic Dentistry</h3>
                <p className="text-white/90 text-xs leading-relaxed font-light">
                  Transform your smile with veneers, whitening, and bonding for a radiant appearance.
                </p>
              </div>
              
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-white relative z-10">
                View Transformations <ArrowRight className="w-4 h-4" />
              </span>
            </div>

            {/* Card 3: Dental Implants (Short 1/3 width) */}
            <div 
              onClick={() => router.push("/services/dental-crowns")}
              className="lg:col-span-1 group relative rounded-3xl overflow-hidden shadow-sm hover:shadow-lg border border-gray-100 h-[260px] cursor-pointer"
            >
              <img
                src="https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400"
                alt="Dental Implants"
                className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-8 space-y-3 text-white">
                <h3 className="font-serif text-lg font-bold">Dental Implants</h3>
                <p className="text-gray-300 text-xs leading-relaxed font-light line-clamp-1">
                  Permanent replacement for teeth.
                </p>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-gold">
                  Learn More <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>

            {/* Card 4: Pediatric & Kids Dentistry (Landscape 2/3 width, light blue bg) */}
            <div 
              onClick={() => router.push("/services/childrens-dentistry")}
              className="lg:col-span-2 group rounded-3xl p-8 bg-[#E8F5FF] grid grid-cols-1 md:grid-cols-12 gap-6 items-center h-[260px] shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="md:col-span-8 space-y-4">
                <h3 className="font-serif text-xl font-bold text-navy">Pediatric &amp; Kids Dentistry</h3>
                <p className="text-gray-600 text-xs leading-relaxed font-light">
                  A fun, fear-free environment specialized for the littlest smiles in your family. We make dental care fun and simple.
                </p>
                <button className="bg-gold hover:bg-[#009bde] text-white font-bold py-2.5 px-6 rounded-full text-xs uppercase tracking-wider shadow-[0_3px_0_0_#008BCC] hover:shadow-[0_4px_0_0_#008BCC] hover:translate-y-[-1px] active:translate-y-[2px] active:shadow-none transition-all duration-75 cursor-pointer">
                  Schedule Child's Program
                </button>
              </div>
              
              <div className="md:col-span-4 flex justify-center">
                <div className="w-28 h-28 rounded-full border-4 border-white shadow-md overflow-hidden bg-white shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1484981138541-3d074aa97716?auto=format&fit=crop&q=80&w=400"
                    alt="Child patient smiling"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

          </div>
        </section>
      </Scroll3D>

      {/* 4. DOCTOR PROFILE SECTION */}
      <Scroll3D>
        <section className="bg-gradient-to-b from-[#fdfcf9] to-white py-20 md:py-24 border-y border-gold/15">
          <div className="max-w-7xl mx-auto px-4 md:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Image (Left on desktop) */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="relative w-full max-w-[360px] aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/5 bg-white group hover:scale-[1.01] transition-transform duration-500">
                <img
                  src="/doctor.png"
                  alt={`${CLINIC.doctor} — ${CLINIC.doctorTitle}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute -bottom-5 -right-5 sm:-right-6 bg-navy text-white rounded-2xl shadow-card px-5 py-4 max-w-[220px]">
                  <span className="block text-[10px] uppercase tracking-widest font-semibold text-gold">
                    Principal Dentist
                  </span>
                  <span className="block font-serif text-base font-semibold mt-0.5">
                    {CLINIC.doctor}
                  </span>
                </div>
              </div>
            </div>

            {/* Content (Right on desktop) */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-gold bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/15 inline-block">
                Clinical Leadership
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy leading-tight">
                {CLINIC.doctor}
              </h2>
              <span className="inline-flex items-center gap-1.5 bg-gold/10 text-gold border border-gold/30 text-[11px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full">
                <Award className="w-3.5 h-3.5" /> {CLINIC.doctorTitle}
              </span>

              <p className="text-gray-600 text-xs md:text-sm leading-relaxed font-light">
                Dr. Roghay Alizadeh is recognised across Cork for her advanced aesthetic work — from
                porcelain veneers and composite bonding to complex full-mouth rehabilitation. She is
                equally known for her empathetic chair-side manner with anxious and complex patients.
              </p>

              <div className="rounded-2xl border border-gold/10 bg-white p-5 shadow-sm">
                <h4 className="font-serif text-xs font-bold text-navy mb-3 uppercase tracking-wider">
                  Credentials &amp; Memberships
                </h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2.5">
                  <li className="flex items-start gap-2.5 text-xs text-gray-700 font-light">
                    <CheckCircle className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span>Dental Council of Ireland (#4203)</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-gray-700 font-light">
                    <CheckCircle className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span>Member of Irish Dental Association</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-gray-700 font-light">
                    <CheckCircle className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span>Advanced Cosmetic Dentistry Cert</span>
                  </li>
                  <li className="flex items-start gap-2.5 text-xs text-gray-700 font-light">
                    <CheckCircle className="w-4 h-4 text-gold mt-0.5 shrink-0" />
                    <span>Nervous Patient Sedation Specialist</span>
                  </li>
                </ul>
              </div>

              <blockquote className="relative rounded-2xl border border-gold/30 bg-gold/5 p-5 text-navy">
                <Quote className="absolute -top-3 -left-3 w-7 h-7 text-gold bg-white rounded-full p-1.5 shadow" />
                <p className="font-serif italic text-sm md:text-base leading-snug">
                  &ldquo;Every smile we design starts with listening. Clinical detail follows naturally
                  from understanding what the patient actually wants.&rdquo;
                </p>
              </blockquote>

              <div className="pt-2">
                <Link
                  href="/about"
                  className="inline-flex items-center gap-2 bg-navy hover:bg-[#061e3d] text-white text-xs font-bold uppercase tracking-wider px-8 py-4 rounded-full shadow-[0_4px_0_0_#031833] hover:shadow-[0_5px_0_0_#031833] hover:translate-y-[-1px] active:translate-y-[3px] active:shadow-none transition-all duration-75 cursor-pointer"
                >
                  Read Full Bio &amp; Story <ArrowRight className="w-4 h-4 text-gold" />
                </Link>
              </div>
            </div>

          </div>
        </section>
      </Scroll3D>

      {/* 5. REAL SMILE TRANSFORMATIONS */}
      <Scroll3D>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-2">
              <span className="text-[10px] font-bold tracking-[0.25em] text-gold uppercase bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/15 inline-block">
                Smile Gallery
              </span>
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy tracking-tight leading-tight">
                Real Smile Transformations
              </h2>
              <p className="text-gray-500 text-xs md:text-sm font-light">
                See the results of our precision cosmetic dentistry. Drag the slider to compare before &amp; after.
              </p>
            </div>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 border border-navy/10 hover:border-gold hover:text-gold text-navy text-[11px] font-bold tracking-widest uppercase px-6 py-3 rounded-full shadow-[0_3px_0_0_rgba(10,22,40,0.06)] hover:shadow-[0_4px_0_0_rgba(10,22,40,0.1)] hover:translate-y-[-1px] active:translate-y-[2px] active:shadow-none transition-all duration-75 shrink-0 self-start md:self-auto bg-white cursor-pointer"
            >
              Visit Smile Gallery
              <ArrowRight className="w-3.5 h-3.5 text-gold" />
            </Link>
          </div>

          {/* Grid of Sliders */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-3">
              <BeforeAfterSlider
                treatmentName="Porcelain Veneers"
                initials="A.C."
                beforeImage="/image_copy.png"
                afterImage="/image_copy.png"
              />
              <p className="text-[11px] text-gray-400 font-light text-center">
                * Full smile makeover with custom porcelain veneers to restore symmetry and color.
              </p>
            </div>
            
            <div className="space-y-3">
              <BeforeAfterSlider
                treatmentName="Composite Bonding"
                initials="M.H."
                beforeImage="/image.png"
                afterImage="/image.png"
              />
              <p className="text-[11px] text-gray-400 font-light text-center">
                * Quick, non-invasive repair of chipped teeth using premium composite bonding materials.
              </p>
            </div>
          </div>
        </section>
      </Scroll3D>

      {/* 6. MODERN TECH SHOWCASE (Wrapped in Scroll3D) */}
      <Scroll3D>
        <section className="bg-navy text-white py-24 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,173,239,0.06),transparent_50%)]" />
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
            
            {/* Tech List */}
            <div className="lg:col-span-7 space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl font-bold text-white tracking-tight">
                Modern Tech for Comfortable Care
              </h2>
              <p className="text-gray-300 text-xs md:text-sm font-light">
                We invest in the future of dental care so every visit is faster, more precise, and entirely pain-free.
              </p>

              <div className="space-y-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold shrink-0 mt-0.5">
                    <Activity className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-none">Digital Low-Radiation X-Rays</h4>
                    <p className="text-xs text-gray-300 mt-2 leading-relaxed font-light">Safe and detailed view that exposes a tiny fraction of standard x-ray radiation.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold shrink-0 mt-0.5">
                    <Smile className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-none">Advanced Laser Therapy</h4>
                    <p className="text-xs text-gray-300 mt-2 leading-relaxed font-light">Painless gum treatment and cavity preparation without the drill.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold shrink-0 mt-0.5">
                    <Sparkles className="w-4.5 h-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white leading-none">Intraoral 3D Scanning</h4>
                    <p className="text-xs text-gray-300 mt-2 leading-relaxed font-light">Say goodbye to messy impressions. High-speed 3D digital smile mapping.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tech Photo */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="relative w-full max-w-[360px] aspect-[4/3] rounded-3xl">
                
                <div className="w-full h-full rounded-3xl overflow-hidden shadow-2xl border-4 border-white/5 relative z-10 bg-gray-900">
                  <img
                    src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&q=80&w=500"
                    alt="Modern dental scanner and therapy device"
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Floating 100% Badge */}
                <div className="absolute -top-4 -right-4 bg-gold text-white font-bold py-2.5 px-5 rounded-xl shadow-lg border border-gold/30 z-20 text-[10px] uppercase tracking-wider">
                  100% Pain Free
                </div>

              </div>
            </div>

          </div>
        </section>
      </Scroll3D>

      {/* 7. PREMIUM PRODUCTS & TREATMENTS (Wrapped in Scroll3D) */}
      <Scroll3D>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="text-[10px] font-bold tracking-[0.25em] text-gold uppercase bg-gold/10 px-3.5 py-1.5 rounded-full border border-gold/15 inline-block">
              Clinic Shop &amp; Treatments
            </span>
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-navy tracking-tight leading-tight">
              Featured Products &amp; Premium Services
            </h2>
            <p className="text-gray-500 text-xs md:text-sm max-w-xl mx-auto leading-relaxed font-light">
              Elevate your home care routine and explore our top-tier cosmetic dental treatments recommended by our clinical team.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {/* Product Card 1: Dental Bonding */}
            <div className="group bg-gradient-to-b from-white to-[#fdfcf9] rounded-3xl border border-gold/15 hover:border-gold/45 overflow-hidden shadow-[0_15px_40px_rgba(10,22,40,0.03)] hover:shadow-[0_25px_60px_rgba(10,22,40,0.08)] transition-all duration-500 flex flex-col h-full hover:-translate-y-1.5 relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 border-b border-gold/10">
                <img
                  src="https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&q=80&w=600"
                  alt="Dental Bonding Treatment"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-navy/95 border border-gold/30 text-gold font-serif font-bold text-xs px-4 py-2 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
                  €120.00 – €180.00
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-7 flex flex-col flex-grow justify-between space-y-5">
                <div className="space-y-3">
                  <span className="text-[9px] font-bold tracking-widest text-gold uppercase bg-gold/10 px-2.5 py-1 rounded-full border border-gold/15 inline-block">Cosmetic Procedure</span>
                  <h3 className="font-serif text-lg font-bold text-navy group-hover:text-gold transition-colors">
                    Dental Bonding
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">
                    With dental bonding we can repair chips, stains and fluorosis as well as change the shape and size of the tooth to improve your smile. We do this by adding composite carefully to the teeth.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={goToBooking}
                    className="w-full bg-gold hover:bg-[#009bde] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-2xl shadow-[0_4px_0_0_#008BCC] hover:shadow-[0_5px_0_0_#008BCC] hover:translate-y-[-1px] active:translate-y-[3px] active:shadow-none transition-all duration-75 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Calendar className="w-4 h-4" /> Book Treatment
                  </button>
                  <p className="text-[10px] text-center text-gray-400 mt-3">
                    Or call <a href="tel:0214303072" className="underline hover:text-gold">021 430 3072</a> for bookings
                  </p>
                </div>
              </div>
            </div>

            {/* Product Card 2: Black Is White Teeth Whitening Toothpaste */}
            <div className="group bg-gradient-to-b from-white to-[#fdfcf9] rounded-3xl border border-gold/15 hover:border-gold/45 overflow-hidden shadow-[0_15px_40px_rgba(10,22,40,0.03)] hover:shadow-[0_25px_60px_rgba(10,22,40,0.08)] transition-all duration-500 flex flex-col h-full hover:-translate-y-1.5 relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 border-b border-gold/10">
                <img
                  src="https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&q=80&w=600"
                  alt="Black Is White Teeth Whitening Toothpaste"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-navy/95 border border-gold/30 text-gold font-serif font-bold text-xs px-4 py-2 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
                  €30.00
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-7 flex flex-col flex-grow justify-between space-y-5">
                <div className="space-y-3">
                  <span className="text-[9px] font-bold tracking-widest text-gold uppercase bg-gold/10 px-2.5 py-1 rounded-full border border-gold/15 inline-block">Daily Care</span>
                  <h3 className="font-serif text-lg font-bold text-navy group-hover:text-gold transition-colors">
                    Black Is White Whitening Toothpaste
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">
                    Fresh lime mint toothpaste from Curaprox with NEW activated carbon to bring up the whiteness of a patient's teeth. Provides clean, advanced daily whitening care.
                  </p>
                </div>
                <div className="pt-2">
                  <a
                    href="tel:0214303072"
                    className="w-full border border-navy/15 hover:border-gold hover:text-gold text-navy text-xs font-bold uppercase tracking-wider py-4 rounded-2xl shadow-[0_3px_0_0_rgba(10,22,40,0.06)] hover:shadow-[0_4px_0_0_rgba(10,22,40,0.1)] hover:translate-y-[-1px] active:translate-y-[2px] active:shadow-none transition-all duration-75 flex items-center justify-center gap-2 bg-white cursor-pointer"
                  >
                    <Phone className="w-4 h-4 text-gold" /> Purchase at Clinic
                  </a>
                  <p className="text-[10px] text-center text-gray-400 mt-3">
                    Available for pick up during clinic hours
                  </p>
                </div>
              </div>
            </div>

            {/* Product Card 3: Pola Light Teeth Whitening Kits */}
            <div className="group bg-gradient-to-b from-white to-[#fdfcf9] rounded-3xl border border-gold/15 hover:border-gold/45 overflow-hidden shadow-[0_15px_40px_rgba(10,22,40,0.03)] hover:shadow-[0_25px_60px_rgba(10,22,40,0.08)] transition-all duration-500 flex flex-col h-full hover:-translate-y-1.5 relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-50 border-b border-gold/10">
                <img
                  src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?auto=format&fit=crop&q=80&w=600"
                  alt="Pola Light Teeth Whitening Kits"
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-700"
                />
                <div className="absolute top-4 right-4 bg-navy/95 border border-gold/30 text-gold font-serif font-bold text-xs px-4 py-2 rounded-full shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
                  €250.00
                </div>
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
              <div className="p-7 flex flex-col flex-grow justify-between space-y-5">
                <div className="space-y-3">
                  <span className="text-[9px] font-bold tracking-widest text-gold uppercase bg-gold/10 px-2.5 py-1 rounded-full border border-gold/15 inline-block">Whitening Kit</span>
                  <h3 className="font-serif text-lg font-bold text-navy group-hover:text-gold transition-colors">
                    Pola Light Whitening Kits
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-light">
                    Advanced teeth whitening system. Enjoy a brighter more confident smile in 5 days. Pola Light combines Pola's award winning formula with an LED mouthpiece.
                  </p>
                </div>
                <div className="pt-2">
                  <button
                    onClick={goToBooking}
                    className="w-full bg-navy hover:bg-[#061e3d] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-2xl shadow-[0_4px_0_0_#031833] hover:shadow-[0_5px_0_0_#031833] hover:translate-y-[-1px] active:translate-y-[3px] active:shadow-none transition-all duration-75 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    Buy Now
                  </button>
                  <p className="text-[10px] text-center text-gray-400 mt-3">
                    Consultation required before product purchase
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Scroll3D>

      {/* 8. TESTIMONIALS (Quotes & consulted doc image wrapped in Scroll3D) */}
      <Scroll3D>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="bg-gradient-to-br from-white via-white to-[#fdfcf9] border border-gold/15 rounded-[2.5rem] p-8 lg:p-12 shadow-[0_20px_50px_rgba(10,22,40,0.03)] grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-gold/5 blur-[50px] pointer-events-none" />
            
            {/* Review Quote (Left) */}
            <div className="lg:col-span-7 space-y-6 relative z-10">
              <span className="block font-serif text-7xl text-gold/30 leading-none h-6 select-none">“</span>
              
              <div className="flex text-gold">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-navy leading-snug">
                "A Transformation Beyond My Expectations"
              </h3>

              <p className="text-gray-600 text-xs sm:text-sm leading-relaxed font-light">
                "The level of care at Hollyhill Dental is unparalleled. I was always nervous about dental visits, but their advanced tech and compassionate approach completely changed my perspective. My full-smile restoration has given me a new lease on life!"
              </p>

              <div className="flex items-center gap-3.5 pt-4">
                <img
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80"
                  alt="Sarah Jenkins"
                  className="w-10 h-10 rounded-full object-cover border border-gold/10"
                />
                <div>
                  <h4 className="text-xs font-bold text-navy">Sarah Jenkins</h4>
                  <p className="text-[9px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">Patient, Full Smile Restoration</p>
                </div>
              </div>
            </div>

            {/* Consulted mock box (Right) */}
            <div className="lg:col-span-5 flex justify-center relative z-10">
              <div className="w-full max-w-[340px] bg-navy/5 border border-gold/15 rounded-3xl p-6 shadow-inner flex items-center justify-center aspect-square">
                <div className="w-full h-full rounded-2xl overflow-hidden shadow-xl border-4 border-white bg-white">
                  <img
                    src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=400"
                    alt="Dentists consulting case on computer monitor"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>

          </div>
        </section>
      </Scroll3D>

      {/* 9. FAQ ACCORDION (Wrapped in Scroll3D) */}
      <Scroll3D>
        <section className="max-w-3xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="font-serif text-3xl font-bold text-navy">Frequently Asked Questions</h2>
            <p className="text-gray-500 text-xs font-light">Got questions about our clinical care? We have answers.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;

              return (
                <div
                  key={index}
                  className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm"
                >
                  <div
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="p-5 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors select-none"
                  >
                    <span className="text-xs md:text-sm font-bold text-navy leading-snug">{faq.q}</span>
                    <span className="text-gold font-bold text-lg">{isOpen ? "−" : "+"}</span>
                  </div>
                  {isOpen && (
                    <div className="p-5 bg-gray-50 border-t border-gray-100 text-xs text-gray-600 leading-relaxed animate-fade-up">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      </Scroll3D>

      {/* 10. READY FOR HEALTHIER, BRIGHTER SMILE? (Final CTA Block wrapped in Scroll3D) */}
      <Scroll3D>
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-gold to-[#0A4B87] rounded-[2rem] py-10 px-5 md:p-14 lg:p-16 text-center text-white space-y-6 relative overflow-hidden shadow-xl">
            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/5 rounded-full blur-2xl" />

            <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl font-bold leading-tight relative z-10">
              Ready for a Healthier, Brighter Smile?
            </h2>
            
            <p className="text-white/80 text-xs md:text-sm max-w-xl mx-auto leading-relaxed font-light relative z-10">
              Join thousands of happy patients and experience the future of dental care today. Your first consultation is just a click away.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4 relative z-10 w-full sm:w-auto max-w-sm sm:max-w-none mx-auto">
              <button
                onClick={goToBooking}
                className="w-full sm:w-auto bg-white hover:bg-gray-50 text-navy font-bold py-3.5 px-8 rounded-full text-xs uppercase tracking-wider shadow-[0_4px_0_0_#e2e8f0] hover:shadow-[0_5px_0_0_#e2e8f0] hover:translate-y-[-1px] active:translate-y-[3px] active:shadow-none transition-all duration-75 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Calendar className="w-4 h-4 text-gold" /> Book Appointment Now
              </button>
              <a
                href={CLINIC.phoneHref}
                className="w-full sm:w-auto border border-white/20 hover:bg-white/10 text-white font-semibold py-3.5 px-8 rounded-full text-xs uppercase tracking-wider shadow-[0_4px_0_0_rgba(255,255,255,0.15)] hover:shadow-[0_5px_0_0_rgba(255,255,255,0.2)] hover:translate-y-[-1px] active:translate-y-[3px] active:shadow-none transition-all duration-75 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Phone className="w-4 h-4" /> Call Clinic<span className="hidden sm:inline">: {CLINIC.phone}</span>
              </a>
            </div>
          </div>
        </section>
      </Scroll3D>

    </div>
  );
}
