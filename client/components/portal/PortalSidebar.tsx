"use client";

import { useEffect, useState, useMemo, useTransition } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useLiveData } from "@/lib/useLiveData";
import {
  LayoutDashboard,
  CalendarDays,
  History,
  FolderOpen,
  MessageSquare,
  User,
  LogOut,
  ClipboardList,
  Receipt,
  Bell,
  ShoppingBag,
  PackageCheck,
} from "lucide-react";

export default function PortalSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout, performLogoutTransition } = useAuthStore();
  const [isPending, startTransition] = useTransition();
  const [pendingHref, setPendingHref] = useState<string | null>(null);

  // Clear the optimistic highlight as soon as the new route is committed.
  useEffect(() => {
    if (pendingHref && pathname.startsWith(pendingHref)) {
      setPendingHref(null);
    }
  }, [pathname, pendingHref]);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    // Allow modifier-clicks (new tab, etc.) to behave normally.
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
  const { data: notifications = [] } = useLiveData<any[]>(
    user?.role === "patient" ? "/notifications/me" : null,
    { intervalMs: 15000, initialData: [] }
  );

  const [unreadNotifsCount, setUnreadNotifsCount] = useState(0);

  useEffect(() => {
    if (pathname === "/portal/notifications") {
      localStorage.setItem("lastSeenNotifications", new Date().toISOString());
      setUnreadNotifsCount(0);
    } else {
      const lastSeen = localStorage.getItem("lastSeenNotifications");
      if (!lastSeen) {
        setUnreadNotifsCount(notifications.length > 0 ? 1 : 0);
      } else {
        const lastSeenDate = new Date(lastSeen).getTime();
        const newNotifs = notifications.filter(
          (n) => new Date(n.timestamp).getTime() > lastSeenDate
        );
        setUnreadNotifsCount(newNotifs.length);
      }
    }
  }, [notifications, pathname]);

  const { data: messages = [] } = useLiveData<any[]>(
    user?.patientProfile?.id ? `/messages/${user.patientProfile.id}` : null,
    { intervalMs: 15000, initialData: [] }
  );

  const unreadMessagesCount = useMemo(
    () => messages.filter((m) => m?.senderRole === "admin" && !m?.isRead).length,
    [messages]
  );

  const navItems = [
    { name: "Dashboard", href: "/portal/dashboard", icon: LayoutDashboard },
    { name: "Notifications", href: "/portal/notifications", icon: Bell },
    { name: "My Appointments", href: "/portal/appointments", icon: CalendarDays },
    { name: "Dental Chart", href: "/portal/chart", icon: ClipboardList },
    { name: "Treatment History", href: "/portal/treatments", icon: History },
    { name: "Prescriptions", href: "/portal/prescriptions", icon: ClipboardList },
    { name: "Invoices & Billing", href: "/portal/invoices", icon: Receipt },
    { name: "My Files", href: "/portal/files", icon: FolderOpen },
    { name: "Oral Care Products", href: "/portal/products", icon: ShoppingBag },
    { name: "My Orders", href: "/portal/orders", icon: PackageCheck },
    { name: "Messages", href: "/portal/messages", icon: MessageSquare },
    { name: "Profile Settings", href: "/portal/profile", icon: User },
  ];

  return (
    <aside className="hidden xl:flex flex-col w-[240px] bg-white border-r border-gray-100 h-screen sticky top-0 left-0 p-6 z-30 overflow-hidden">
      
      {/* Brand logo */}
      <div className="mb-10 flex items-center justify-between shrink-0">
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Hollyhill Dental Logo"
            className="w-7 h-7 object-contain"
          />
          <span className="font-serif text-sm font-bold text-navy tracking-wide">
            Hollyhill Portal
          </span>
        </Link>
      </div>

      {/* Nav List */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1 no-scrollbar mb-6">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const Icon = item.icon;

          let badge = null;
          if (item.name === "Notifications" && unreadNotifsCount > 0) {
            badge = (
              <span className="ml-auto bg-gold text-navy text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                {unreadNotifsCount}
              </span>
            );
          } else if (item.name === "Messages" && unreadMessagesCount > 0) {
            badge = (
              <span className="ml-auto bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full animate-pulse">
                {unreadMessagesCount}
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
                  ? "text-gold bg-gold/5 border-l-4 border-gold pl-3"
                  : pendingHref === item.href
                  ? "text-gold bg-gold/10"
                  : "text-navy hover:text-gold hover:bg-gray-50"
              }`}
            >
              <Icon
                className={`w-4 h-4 ${
                  isActive || pendingHref === item.href
                    ? "text-gold"
                    : "text-navy"
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
      <div className="border-t border-gray-100 pt-6 mt-auto space-y-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center font-bold text-gold text-xs">
            {user?.patientProfile?.firstName?.[0] || "P"}
          </div>
          <div className="truncate">
            <span className="block text-xs font-bold text-navy truncate">
              {user?.patientProfile?.firstName} {user?.patientProfile?.lastName}
            </span>
            <span className="inline-block bg-gold/10 text-gold text-[9px] font-bold px-2 py-0.5 rounded-full mt-0.5">
              Patient
            </span>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors focus:outline-none"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

    </aside>
  );
}
