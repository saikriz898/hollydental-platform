"use client";

import { useEffect, useState, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useLiveData } from "@/lib/useLiveData";
import {
  LayoutDashboard,
  CalendarDays,
  Users,
  FileText,
  ClipboardList,
  Cpu,
  NotebookPen,
  TrendingUp,
  FolderLock,
  Settings,
  LogOut,
  CalendarCheck,
  MessageSquare,
  Activity,
  ShoppingBag,
  PackageCheck,
} from "lucide-react";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { logout, performLogoutTransition } = useAuthStore();
  const [isPending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  useEffect(() => {
    if (pendingHref && pathname.startsWith(pendingHref)) {
      setPendingHref(null);
    }
  }, [pathname, pendingHref]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.shiftKey ||
      e.altKey ||
      e.button !== 0
    ) {
      return;
    }
    if (pathname === href) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    setPendingHref(href);
    startTransition(() => {
      router.push(href);
    });
  };

  const handleLogout = () => {
    performLogoutTransition(router);
  };

  // Live feeds for sidebar badge counters
  const [pendingAppts, setPendingAppts] = useState<number>(0);
  const [unreadMsgs, setUnreadMsgs] = useState<number>(0);

  const { data: appointments = [] } = useLiveData<any[]>("/appointments", {
    intervalMs: 15000,
    initialData: [],
  });

  const { data: messages = [] } = useLiveData<any[]>("/messages", {
    intervalMs: 15000,
    initialData: [],
  });

  useEffect(() => {
    if (Array.isArray(appointments)) {
      setPendingAppts(appointments.filter((a) => a.status === "pending").length);
    }
  }, [appointments]);

  useEffect(() => {
    if (Array.isArray(messages)) {
      setUnreadMsgs(messages.reduce((acc, t) => acc + (t.unreadFromPatient || 0), 0));
    }
  }, [messages]);

  const navItems = [
    { name: "Overview", href: "/admin/dashboard", icon: LayoutDashboard },
    { name: "Appointments", href: "/admin/appointments", icon: CalendarDays },
    { name: "Approvals", href: "/admin/approvals", icon: CalendarCheck },
    { name: "Messages", href: "/admin/messages", icon: MessageSquare },
    { name: "Patients", href: "/admin/patients", icon: Users },
    { name: "Billing", href: "/admin/billing", icon: FileText },
    { name: "Prescriptions", href: "/admin/prescriptions", icon: ClipboardList },
    { name: "Products Manager", href: "/admin/products", icon: ShoppingBag },
    { name: "Orders", href: "/admin/orders", icon: PackageCheck },
    { name: "AI Panel", href: "/admin/ai", icon: Cpu },
    { name: "Blog CMS", href: "/admin/blog", icon: NotebookPen },
    { name: "Analytics", href: "/admin/analytics", icon: TrendingUp },
    { name: "Activity Log", href: "/admin/activity", icon: Activity },
    { name: "File Manager", href: "/admin/files", icon: FolderLock },
    { name: "System Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <aside className="hidden xl:flex flex-col w-[240px] bg-navy border-r border-white/5 h-screen sticky top-0 left-0 p-6 z-30 text-white overflow-hidden">
      
      {/* Brand logo */}
      <div className="mb-10 shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Hollyhill Dental Logo"
            className="w-7 h-7 object-contain bg-white rounded-md p-0.5"
          />
          <span className="font-serif text-sm font-bold text-white tracking-wide">
            Hollyhill Clinical
          </span>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1 no-scrollbar mb-6">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          let badge = null;
          if (item.name === "Approvals" && pendingAppts > 0) {
            badge = (
              <span className="ml-auto bg-gold text-navy text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                {pendingAppts}
              </span>
            );
          } else if (item.name === "Messages" && unreadMsgs > 0) {
            badge = (
              <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                {unreadMsgs}
              </span>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              prefetch
              onClick={(e) => handleNavClick(e, item.href)}
              aria-busy={pendingHref === item.href}
              className={`relative flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                isActive
                  ? "text-white bg-white/10 border-l-4 border-gold pl-3"
                  : pendingHref === item.href
                  ? "text-white bg-white/10"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive || pendingHref === item.href
                    ? "text-gold"
                    : "text-gray-400"
                } ${
                  pendingHref === item.href && isPending ? "animate-pulse" : ""
                }`}
              />
              <span>{item.name}</span>
              {badge}
              {pendingHref === item.href && isPending && (
                <span
                  aria-hidden
                  className="absolute right-3 inline-block w-3 h-3 border-2 border-gold border-t-transparent rounded-full animate-spin"
                />
              )}
            </Link>
          );
        })}
      </nav>

      {/* User profile & Logout */}
      <div className="border-t border-white/10 pt-6 mt-auto space-y-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold/40 flex items-center justify-center font-bold text-gold text-xs">
            RA
          </div>
          <div className="truncate">
            <span className="block text-xs font-bold text-white truncate">
              Dr. Roghay Alizadeh
            </span>
            <span className="inline-block bg-gold/25 text-gold text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5 uppercase tracking-wider">
              Principal Dentist
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-semibold text-red-400 hover:bg-red-950/20 transition-colors focus:outline-none"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
}
