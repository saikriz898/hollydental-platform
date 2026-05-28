"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SERVICES, CLINIC } from "@/lib/constants";
import {
  Phone,
  Calendar,
  Menu,
  X,
  Home,
  Briefcase,
  Grid,
  ChevronDown,
  ArrowRight,
  ShieldAlert,
  LogOut,
  User as UserIcon,
  MapPin,
  Clock,
  Sparkles,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import Logo from "@/components/public/Logo";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showServices, setShowServices] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { openLoginModal } = useUIStore();

  const servicesRef = useRef<HTMLDivElement | null>(null);
  const accountRef = useRef<HTMLDivElement | null>(null);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const goToBooking = () => {
    const target = "/portal/booking";
    if (user) {
      router.push(target);
      return;
    }
    openLoginModal(() => router.push(target));
  };

  const goToDashboard = () => {
    if (!user) {
      openLoginModal();
      return;
    }
    router.push(user.role === "admin" ? "/admin/dashboard" : "/portal/dashboard");
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setShowServices(false);
    setMobileServicesOpen(false);
    setShowAccount(false);
  }, [pathname]);

  useEffect(() => {
    if (!showServices && !showAccount) return;
    const onClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (showServices && servicesRef.current && !servicesRef.current.contains(t)) {
        setShowServices(false);
      }
      if (showAccount && accountRef.current && !accountRef.current.contains(t)) {
        setShowAccount(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [showServices, showAccount]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setShowServices(false);
        setShowAccount(false);
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const categories = {
    general: SERVICES.filter((s) => s.category === "general"),
    cosmetic: SERVICES.filter((s) => s.category === "cosmetic"),
    advanced: SERVICES.filter(
      (s) => s.category === "advanced" || s.category === "orthodontics"
    ),
  };

  const handleHoverOpen = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setShowServices(true);
  };
  const handleHoverClose = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = setTimeout(() => setShowServices(false), 150);
  };

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      {/* Top utility bar — refined: navy with gold accents instead of loud red. */}
      <div className="hidden md:block bg-navy text-gray-300 text-[11px] font-medium relative z-50 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-9 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <span className="inline-flex items-center gap-1.5 text-gray-400">
              <MapPin className="w-3 h-3 text-gold" />
              {CLINIC.address || "Hollyhill Shopping Centre, Cork"}
            </span>
            <span className="inline-flex items-center gap-1.5 text-gray-400">
              <Clock className="w-3 h-3 text-gold" />
              Mon–Fri 9:00–18:00 · Sat 10:00–14:00
            </span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href={CLINIC.phoneHref}
              className="inline-flex items-center gap-1.5 hover:text-gold transition-colors"
            >
              <Phone className="w-3 h-3 text-gold" />
              {CLINIC.phone}
            </a>
            <span className="inline-flex items-center gap-1.5 text-gold font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              Same-day emergency slots available
            </span>
          </div>
        </div>
      </div>

      {/* Main navbar — glass on scroll, white at top, gold accent line. */}
      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 shadow-[0_8px_30px_rgba(10,22,40,0.08)] h-[68px]"
            : "bg-white h-[80px]"
        }`}
      >
        {/* Hairline gold accent — only visible at top */}
        {!scrolled && (
          <span className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />
        )}

        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-6 relative">
          {/* Logo block */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="inline-flex sm:hidden">
              <Logo variant="full" theme="dark" size={scrolled ? 36 : 42} />
            </div>
            <div className="hidden sm:inline-flex">
              <Logo variant="full" theme="dark" size={scrolled ? 50 : 64} />
            </div>
          </div>

          {/* Center nav — only ≥1024px */}
          <nav className="hidden lg:flex items-center gap-0.5 xl:gap-1 h-full flex-1 justify-center max-w-2xl">
            <NavLink href="/" active={isActive("/")}>
              Home
            </NavLink>

            <div
              ref={servicesRef}
              className="relative h-full flex items-center"
              onMouseEnter={handleHoverOpen}
              onMouseLeave={handleHoverClose}
            >
              <button
                type="button"
                onClick={() => setShowServices((v) => !v)}
                aria-expanded={showServices}
                aria-haspopup="true"
                className={`relative text-sm font-medium px-3 xl:px-4 h-9 inline-flex items-center gap-1 transition-colors cursor-pointer rounded-md ${
                  showServices || isActive("/services")
                    ? "text-navy"
                    : "text-navy/80 hover:text-navy"
                }`}
              >
                Services
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    showServices ? "rotate-180 text-gold" : ""
                  }`}
                />
                {(showServices || isActive("/services")) && (
                  <span className="absolute -bottom-0.5 left-3 right-3 h-[2px] bg-gold rounded-full" />
                )}
              </button>

              {showServices && (
                <div
                  role="menu"
                  className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[760px] xl:w-[860px] max-w-[calc(100vw-2rem)] bg-white text-navy rounded-2xl shadow-[0_30px_80px_-20px_rgba(10,22,40,0.35)] border border-gray-100 overflow-hidden animate-fade-up z-50"
                >
                  {/* Top accent */}
                  <span className="block h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />

                  <div className="grid grid-cols-12 gap-0">
                    {/* Featured panel */}
                    <div className="col-span-4 bg-navy text-white p-7 relative overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(201,169,110,0.18),transparent_60%)]" />
                      <div className="relative space-y-3">
                        <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold text-gold bg-gold/10 border border-gold/30 rounded-full px-2.5 py-1">
                          <Sparkles className="w-3 h-3" />
                          Most loved
                        </span>
                        <h4 className="font-serif text-xl font-bold leading-tight">
                          Find the right treatment for your smile
                        </h4>
                        <p className="text-xs text-gray-300 leading-relaxed">
                          From routine check-ups to full smile makeovers, our
                          team in Cork plans every step of your care.
                        </p>
                        <Link
                          href="/services"
                          onClick={() => setShowServices(false)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gold hover:text-white transition-colors mt-2"
                        >
                          Browse all services <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>

                    {/* Categories */}
                    <div className="col-span-8 grid grid-cols-3 gap-6 p-7">
                      <ServiceColumn
                        title="General"
                        services={categories.general}
                        onNavigate={() => setShowServices(false)}
                      />
                      <ServiceColumn
                        title="Cosmetic"
                        services={categories.cosmetic}
                        onNavigate={() => setShowServices(false)}
                      />
                      <ServiceColumn
                        title="Advanced & Ortho"
                        services={categories.advanced}
                        onNavigate={() => setShowServices(false)}
                      />
                    </div>
                  </div>

                  <div className="bg-off-white border-t border-gray-100 px-7 py-3 flex items-center justify-between">
                    <span className="text-[11px] text-gray-500">
                      Need help choosing? Book a free smile consultation.
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setShowServices(false);
                        goToBooking();
                      }}
                      className="text-[11px] font-bold text-navy hover:text-gold inline-flex items-center gap-1"
                    >
                      Book consultation <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <NavLink href="/about" active={isActive("/about")}>About</NavLink>
            <NavLink href="/pricing" active={isActive("/pricing")}>Pricing</NavLink>
            <NavLink href="/blog" active={isActive("/blog")}>Blog</NavLink>
            <NavLink href="/contact" active={isActive("/contact")}>Contact</NavLink>
          </nav>

          {/* Right cluster */}
          <div className="hidden lg:flex items-center gap-3 shrink-0">
            {user ? (
              <div ref={accountRef} className="relative">
                <button
                  type="button"
                  onClick={() => setShowAccount((v) => !v)}
                  aria-expanded={showAccount}
                  className="inline-flex items-center gap-2 hover:bg-navy/5 text-navy pl-1.5 pr-3 py-1.5 rounded-full font-medium text-xs transition-colors border border-transparent hover:border-gray-100"
                >
                  <span className="w-7 h-7 rounded-full bg-gradient-to-br from-gold to-gold-dark text-white flex items-center justify-center font-bold text-[11px] shadow-sm">
                    {(user.patientProfile?.firstName?.[0] || user.email?.[0] || "U").toUpperCase()}
                  </span>
                  <span className="hidden xl:inline truncate max-w-[120px]">
                    {user.patientProfile?.firstName || user.email}
                  </span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform ${
                      showAccount ? "rotate-180" : ""
                    }`}
                  />
                </button>
 
                {showAccount && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-gray-100 shadow-[0_20px_50px_-15px_rgba(10,22,40,0.25)] p-3 z-50 animate-fade-up overflow-hidden">
                    <span className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gold/0 via-gold to-gold/0" />
                    <div className="px-3 py-2 border-b border-gray-100 mb-2">
                      <p className="text-xs font-semibold text-navy truncate">
                        {user.patientProfile
                          ? `${user.patientProfile.firstName} ${user.patientProfile.lastName}`
                          : user.email}
                      </p>
                      <p className="text-[10px] uppercase tracking-widest text-gold font-bold mt-0.5">
                        {user.role}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAccount(false);
                        goToDashboard();
                      }}
                      className="w-full inline-flex items-center gap-2 text-left text-sm font-medium text-navy hover:bg-gold/5 px-3 py-2 rounded-lg transition-colors"
                    >
                      <UserIcon className="w-4 h-4 text-gold" />
                      Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowAccount(false);
                        logout("manual");
                        router.replace("/");
                      }}
                      className="w-full inline-flex items-center gap-2 text-left text-sm font-medium text-red-600 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                type="button"
                onClick={() => openLoginModal()}
                className="text-navy/80 hover:text-navy font-medium text-sm transition-colors cursor-pointer px-3 h-9 rounded-md"
              >
                Sign in
              </button>
            )}
 
             <button
              type="button"
              onClick={goToBooking}
              className="bg-gold hover:bg-[#009bde] text-white font-bold px-6 py-3 rounded-full text-sm shadow-[0_4px_0_0_#008BCC] hover:shadow-[0_5px_0_0_#008BCC] hover:translate-y-[-1px] active:translate-y-[3px] active:shadow-none transition-all duration-75 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Book Appointment</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </div>
 
          {/* Mobile actions */}
          <div className="flex lg:hidden items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={goToBooking}
              className="bg-gold hover:bg-[#009bde] text-white font-bold px-3.5 sm:px-4 py-2.5 rounded-full text-xs shadow-[0_3px_0_0_#008BCC] hover:shadow-[0_4px_0_0_#008BCC] hover:translate-y-[-1px] active:translate-y-[2px] active:shadow-none transition-all duration-75 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Book</span>
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="text-navy hover:text-gold focus:outline-none w-10 h-10 inline-flex items-center justify-center rounded-md hover:bg-gray-50 transition-colors"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 bg-navy text-white z-50 flex flex-col p-6 sm:p-8 animate-fade-up overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <Logo variant="full" theme="light" size={42} asLink={false} />
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-gold focus:outline-none w-10 h-10 inline-flex items-center justify-center rounded-md hover:bg-white/5 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-7 h-7" />
            </button>
          </div>

          <nav className="flex flex-col gap-1 text-base font-medium">
            <DrawerLink href="/" onClose={() => setIsOpen(false)}>
              Home
            </DrawerLink>

            <div className="border-b border-white/10">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setMobileServicesOpen((v) => !v);
                }}
                aria-expanded={mobileServicesOpen}
                className="w-full py-3 flex items-center justify-between hover:text-gold transition-colors cursor-pointer select-none"
              >
                <span>Services</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    mobileServicesOpen ? "rotate-180 text-gold" : ""
                  }`}
                />
              </button>
              {mobileServicesOpen && (
                <div className="pb-4 space-y-4 animate-fade-up">
                  <Link
                    href="/services"
                    onClick={() => setIsOpen(false)}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-gold py-2"
                  >
                    View all services <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                  <DrawerCategory
                    title="General"
                    services={categories.general}
                    onClose={() => setIsOpen(false)}
                  />
                  <DrawerCategory
                    title="Cosmetic"
                    services={categories.cosmetic}
                    onClose={() => setIsOpen(false)}
                  />
                  <DrawerCategory
                    title="Advanced & Ortho"
                    services={categories.advanced}
                    onClose={() => setIsOpen(false)}
                  />
                </div>
              )}
            </div>

            <DrawerLink href="/about" onClose={() => setIsOpen(false)}>About</DrawerLink>
            <DrawerLink href="/pricing" onClose={() => setIsOpen(false)}>Pricing</DrawerLink>
            <DrawerLink href="/blog" onClose={() => setIsOpen(false)}>Blog</DrawerLink>
            <DrawerLink href="/contact" onClose={() => setIsOpen(false)}>Contact</DrawerLink>

            {user ? (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  goToDashboard();
                }}
                className="text-gold hover:underline text-left cursor-pointer border-0 bg-transparent py-3"
              >
                My Dashboard
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  openLoginModal();
                }}
                className="text-gold hover:underline text-left cursor-pointer border-0 bg-transparent py-3"
              >
                Patient Sign In
              </button>
            )}

            {user && (
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  logout("manual");
                  router.replace("/");
                }}
                className="text-red-300 hover:text-red-200 hover:underline text-left cursor-pointer border-0 bg-transparent py-3 inline-flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            )}
          </nav>

          <div className="mt-auto flex flex-col gap-4 pt-6">
            <a
              href={CLINIC.phoneHref}
              className="border border-gold/35 hover:border-gold hover:text-white text-gold text-center py-3.5 rounded-xl font-bold shadow-[0_3px_0_0_rgba(201,169,110,0.15)] hover:shadow-[0_4px_0_0_rgba(201,169,110,0.2)] hover:translate-y-[-1px] active:translate-y-[2px] active:shadow-none transition-all duration-75 inline-flex items-center justify-center gap-2 bg-white/5 cursor-pointer"
            >
              <Phone className="w-4 h-4" /> Call {CLINIC.phone}
            </a>
            <button
              type="button"
              onClick={() => {
                setIsOpen(false);
                goToBooking();
              }}
              className="bg-gold hover:bg-[#009bde] text-white text-center py-3.5 rounded-xl font-bold shadow-[0_4px_0_0_#008BCC] hover:shadow-[0_5px_0_0_#008BCC] hover:translate-y-[-1px] active:translate-y-[3px] active:shadow-none transition-all duration-75 cursor-pointer inline-flex items-center justify-center gap-2"
            >
              Book Appointment
              <ArrowRight className="w-4 h-4" />
            </button>
            <p className="text-[10px] text-gray-400 text-center">
              <ShieldAlert className="w-3 h-3 inline-block mr-1 text-red-400" />
              Same-day emergency appointments available
            </p>
          </div>
        </div>
      )}

      {/* Floating emergency pill (mobile) */}
      <a
        href={CLINIC.phoneHref}
        aria-label="Emergency Call"
        className="lg:hidden fixed bottom-20 right-4 z-40 bg-red-600 hover:bg-red-500 text-white font-bold w-12 h-12 rounded-full inline-flex items-center justify-center shadow-[0_4px_0_0_#991b1b] hover:shadow-[0_5px_0_0_#991b1b] hover:translate-y-[-1px] active:translate-y-[3px] active:shadow-none transition-all duration-75 border border-red-500/20 cursor-pointer"
      >
        <ShieldAlert className="w-6 h-6" />
      </a>

      {/* Bottom nav (mobile) */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around px-2 z-40 shadow-inner">
        <BottomLink href="/" icon={<Home className="w-5 h-5" />} label="Home" active={isActive("/")} />
        <BottomLink
          href="/services"
          icon={<Briefcase className="w-5 h-5" />}
          label="Services"
          active={isActive("/services")}
        />
        <button
          type="button"
          onClick={goToBooking}
          className={`flex flex-col items-center justify-center font-semibold cursor-pointer border-0 bg-transparent transition-all ${
            isActive("/portal/booking") ? "text-gold font-bold scale-105" : "text-gold hover:scale-105"
          }`}
        >
          <Calendar className="w-6 h-6 text-gold" />
          <span className="text-[10px] mt-1">Book</span>
        </button>
        <BottomLink
          href="/contact"
          icon={<Grid className="w-5 h-5" />}
          label="More"
          active={isActive("/contact")}
        />
      </nav>
    </>
  );
}

/* -------------------- Helpers -------------------- */

function NavLink({
  href,
  active,
  children,
}: {
  href: string;
  active: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`relative text-sm font-medium px-3 xl:px-4 h-9 inline-flex items-center transition-colors rounded-md ${
        active ? "text-navy" : "text-navy/80 hover:text-navy"
      }`}
    >
      {children}
      {active && (
        <span className="absolute -bottom-0.5 left-3 right-3 h-[2px] bg-gold rounded-full" />
      )}
    </Link>
  );
}

function ServiceColumn({
  title,
  services,
  onNavigate,
}: {
  title: string;
  services: { slug: string; name: string }[];
  onNavigate: () => void;
}) {
  return (
    <div>
      <h4 className="text-[10px] uppercase font-bold tracking-widest text-gold mb-3 pb-2 border-b border-gold/20">
        {title}
      </h4>
      <ul className="space-y-0.5">
        {services.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/services/${s.slug}`}
              onClick={onNavigate}
              className="block text-[13px] text-gray-600 hover:text-navy hover:bg-gold/5 rounded-md px-2 py-1.5 transition-colors"
            >
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function DrawerLink({
  href,
  children,
  onClose,
}: {
  href: string;
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onClose}
      className="py-3 hover:text-gold transition-colors border-b border-white/10"
    >
      {children}
    </Link>
  );
}

function DrawerCategory({
  title,
  services,
  onClose,
}: {
  title: string;
  services: { slug: string; name: string }[];
  onClose: () => void;
}) {
  return (
    <div>
      <h5 className="text-[10px] uppercase tracking-widest font-bold text-gold mb-2">
        {title}
      </h5>
      <ul className="space-y-1.5">
        {services.map((s) => (
          <li key={s.slug}>
            <Link
              href={`/services/${s.slug}`}
              onClick={onClose}
              className="block text-sm text-gray-300 hover:text-white py-1"
            >
              {s.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

function BottomLink({
  href,
  icon,
  label,
  active,
}: {
  href: string;
  icon: React.ReactNode;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex flex-col items-center justify-center transition-all ${
        active ? "text-gold font-bold scale-105" : "text-gray-500 hover:text-gold"
      }`}
    >
      {icon}
      <span className="text-[10px] mt-1">{label}</span>
    </Link>
  );
}
