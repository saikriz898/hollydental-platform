"use client";

import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { ArrowRight } from "lucide-react";

interface BookButtonProps {
  className?: string;
  label?: string;
  /** Optional service slug to pre-select on the booking page. */
  serviceSlug?: string;
  showIcon?: boolean;
}

export default function BookButton({
  className = "bg-gold hover:bg-gold-dark text-navy font-bold text-xs px-6 py-3 rounded-lg shadow-md transition-colors",
  label = "Book Appointment",
  serviceSlug,
  showIcon = false,
}: BookButtonProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { openLoginModal } = useUIStore();

  const target = serviceSlug
    ? `/portal/booking?service=${encodeURIComponent(serviceSlug)}`
    : "/portal/booking";

  const handleClick = () => {
    if (user) {
      router.push(target);
      return;
    }
    // Open the login modal in place; route to booking on success.
    openLoginModal(() => {
      router.push(target);
    });
  };

  return (
    <button onClick={handleClick} className={`${className} cursor-pointer border-0`}>
      {label}
      {showIcon && <ArrowRight className="w-4 h-4 ml-1.5 inline-block" />}
    </button>
  );
}
