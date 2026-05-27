"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { SERVICES, ServiceType } from "@/lib/constants";
import { apiRequest } from "@/lib/api";
import { useAuthStore } from "@/store/useAuthStore";
import { useUIStore } from "@/store/useUIStore";
import { formatDate } from "@/lib/utils";
import {
  generateSlotsForDate,
  isFutureSlot,
  maxIsoDate,
  todayIsoDate,
  validateBookingDate,
  CLINIC_SCHEDULE,
} from "@/lib/bookingHours";
import {
  Calendar,
  Clock,
  CheckCircle,
  Search,
  Info,
  ShieldCheck,
  ArrowRight,
  ArrowLeft,
  ChevronRight,
} from "lucide-react";
/*  */
const bookingSchema = z.object({
  serviceId: z.string().min(1, "Please select a service"),
  date: z.string().min(1, "Please select an appointment date"),
  time: z.string().min(1, "Please select an appointment time"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  phone: z.string().min(6, "Valid phone number is required"),
  email: z.string().email("Please enter a valid email"),
  notes: z.string().optional(),
});

type BookingFormValues = z.infer<typeof bookingSchema>;

const STEPS = [
  { id: 1, label: "Service" },
  { id: 2, label: "Schedule" },
  { id: 3, label: "Your Details" },
  { id: 4, label: "Review" },
  { id: 5, label: "Confirmation" },
] as const;

interface BookingFormProps {
  /** When true, drops the outer card chrome — useful when wrapped in a page that already has its own card. */
  compact?: boolean;
  onClose?: () => void;
}

export default function BookingForm({ compact = false, onClose }: BookingFormProps) {
  const { user } = useAuthStore();
  const { openLoginModal, bookingServiceSlug } = useUIStore();

  const [step, setStep] = useState<number>(1);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedService, setSelectedService] = useState<ServiceType | null>(null);
  const [serverSlots, setServerSlots] = useState<string[] | null>(null);
  const [loadingSlots, setLoadingSlots] = useState<boolean>(false);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [bookingResult, setBookingResult] = useState<{
    appointment: any;
    service: ServiceType | null;
  } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    watch,
    trigger,
    formState: { errors },
  } = useForm<BookingFormValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      serviceId: "",
      date: "",
      time: "",
      firstName: user?.patientProfile?.firstName || "",
      lastName: user?.patientProfile?.lastName || "",
      phone: user?.patientProfile?.phone || "",
      email: user?.email || "",
      notes: "",
    },
  });

  const watchedDate = watch("date");
  const watchedServiceId = watch("serviceId");

  // Hydrate patient details from auth context once it's available
  useEffect(() => {
    if (user) {
      setValue("firstName", user.patientProfile?.firstName || "");
      setValue("lastName", user.patientProfile?.lastName || "");
      setValue("phone", user.patientProfile?.phone || "");
      setValue("email", user.email || "");
    }
  }, [user, setValue]);

  // Pre-select service if slug provided in store
  useEffect(() => {
    if (bookingServiceSlug) {
      const service = SERVICES.find((s) => s.slug === bookingServiceSlug);
      if (service) {
        setSelectedService(service);
        setValue("serviceId", service.slug, { shouldValidate: true });
        setStep(2);
      }
    }
  }, [bookingServiceSlug, setValue]);

  // Live slot lookup whenever date or service changes (only after the date is valid)
  useEffect(() => {
    if (!watchedDate || !watchedServiceId) {
      setServerSlots(null);
      return;
    }
    const dateError = validateBookingDate(watchedDate);
    if (dateError) {
      setServerSlots(null);
      return;
    }

    let cancelled = false;
    setLoadingSlots(true);
    apiRequest(
      `/appointments/slots?date=${encodeURIComponent(watchedDate)}&service=${encodeURIComponent(
        watchedServiceId
      )}`
    )
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data?.slots)
          ? data.slots
          : null;
        setServerSlots(list);
      })
      .catch(() => {
        if (!cancelled) setServerSlots(null);
      })
      .finally(() => {
        if (!cancelled) setLoadingSlots(false);
      });

    return () => {
      cancelled = true;
    };
  }, [watchedDate, watchedServiceId]);

  // Computed slots: intersect server availability with clinic-aware grid.
  const availableSlots = useMemo(() => {
    if (!watchedDate) return [];
    const generated = generateSlotsForDate(watchedDate, {
      durationMinutes: selectedService?.duration || 30,
    });
    if (!serverSlots) return generated;
    // Honour the server list but never show past times for today.
    const allowed = new Set(generated);
    return serverSlots.filter((s) => allowed.has(s));
  }, [watchedDate, selectedService, serverSlots]);

  // Re-validate the chosen time when slots change (e.g. day moves on, slot expires)
  useEffect(() => {
    const time = watch("time");
    if (!time) return;
    if (!availableSlots.includes(time)) {
      setValue("time", "");
    }
  }, [availableSlots, setValue, watch]);

  const filteredServices = useMemo(
    () =>
      SERVICES.filter((s) =>
        s.name.toLowerCase().includes(searchTerm.toLowerCase().trim())
      ),
    [searchTerm]
  );

  const selectService = (service: ServiceType) => {
    setSelectedService(service);
    setValue("serviceId", service.slug, { shouldValidate: true });
    setStep(2);
  };

  const handleDateSelect = (dateStr: string) => {
    const dateError = validateBookingDate(dateStr);
    if (dateError) {
      setValue("date", "", { shouldValidate: true });
      setValue("time", "", { shouldValidate: true });
      setError("date", { type: "manual", message: dateError });
      return;
    }
    clearErrors("date");
    setValue("date", dateStr, { shouldValidate: true });
    setValue("time", "");
  };

  const handleTimeSelect = (timeStr: string) => {
    if (!isFutureSlot(watchedDate, timeStr)) {
      setError("time", {
        type: "manual",
        message: "That slot is no longer available. Please pick another time.",
      });
      return;
    }
    clearErrors("time");
    setValue("time", timeStr, { shouldValidate: true });
  };

  const goNext = async () => {
    if (step === 2) {
      const dateError = validateBookingDate(watchedDate);
      if (dateError) {
        setError("date", { type: "manual", message: dateError });
        return;
      }
      const time = watch("time");
      if (!time || !isFutureSlot(watchedDate, time)) {
        setError("time", {
          type: "manual",
          message: "Please pick a valid future time slot.",
        });
        return;
      }
      const ok = await trigger(["date", "time"]);
      if (!ok) return;
      setStep(3);
    } else if (step === 3) {
      const ok = await trigger(["firstName", "lastName", "email", "phone"]);
      if (!ok) return;
      setStep(4);
    }
  };

  const goPrev = () => setStep((prev) => Math.max(1, prev - 1));

  const onSubmit = async (values: BookingFormValues) => {
    // Final guard before submit — date/time may have aged out while the user was filling in details.
    const dateError = validateBookingDate(values.date);
    if (dateError) {
      setError("date", { type: "manual", message: dateError });
      setStep(2);
      return;
    }
    if (!isFutureSlot(values.date, values.time)) {
      setError("time", {
        type: "manual",
        message: "Slot has expired. Please choose another time.",
      });
      setStep(2);
      return;
    }

    if (!user) {
      setSubmitError(
        "Please sign in to submit your appointment request."
      );
      openLoginModal(() => {
        handleSubmit(onSubmit)();
      });
      setSubmitting(false);
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const result = await apiRequest("/appointments", {
        method: "POST",
        body: JSON.stringify({
          serviceId: values.serviceId,
          appointmentDate: values.date,
          appointmentTime: values.time,
          notes: values.notes,
          patient: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone,
          },
        }),
      });

      const appointment = result?.appointment || result;

      setBookingResult({ appointment, service: selectedService });

      import("canvas-confetti")
        .then((confetti) => {
          confetti.default({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        })
        .catch(() => undefined);

      setStep(5);
    } catch (error: any) {
      setSubmitError(error?.message || "Booking failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const containerClass = compact
    ? "p-0 flex flex-col h-full overflow-hidden"
    : "bg-white rounded-2xl border border-gray-100 shadow-card p-6 md:p-10 max-w-3xl mx-auto";

  // Schedule note for the currently selected day
  const scheduleNote = useMemo(() => {
    if (!watchedDate) return null;
    const date = new Date(`${watchedDate}T00:00:00`);
    if (Number.isNaN(date.getTime())) return null;
    const day = date.getDay();
    const sched = CLINIC_SCHEDULE[day];
    if (!sched.open) return "Closed on this day.";
    return `Clinic hours: ${sched.open} – ${sched.close}`;
  }, [watchedDate]);

  return (
    <div className={containerClass}>
      {/* Stepper */}
      <div
        className={
          compact
            ? "sticky top-0 z-30 bg-white/95 backdrop-blur-sm pt-6 sm:pt-8 pr-12 pb-4 mb-6 border-b border-gray-100 flex"
            : "mb-6 flex"
        }
      >
        <div className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-1.5 shadow-sm">
          <ol className="flex items-center justify-between w-full">
            {STEPS.map((s, idx) => {
              const isActive = step === s.id;
              const isComplete = step > s.id;

              return (
                <li
                  key={s.id}
                  className="flex-1 flex items-center min-w-0 last:flex-initial"
                >
                  <div
                    className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-1 rounded-lg transition-all ${
                      isActive
                        ? "bg-navy text-white font-semibold"
                        : isComplete
                        ? "bg-gold/10 text-gold-dark font-medium"
                        : "text-gray-400"
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold shrink-0 ${
                        isActive
                          ? "bg-gold text-navy font-bold"
                          : isComplete
                          ? "bg-navy text-gold"
                          : "bg-white text-gray-400 border border-gray-200"
                      }`}
                    >
                      {isComplete ? "✓" : s.id}
                    </span>
                    <span className="hidden md:inline tracking-wider uppercase text-[10px] truncate">
                      {s.label}
                    </span>
                  </div>

                  {idx < STEPS.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-gray-300 mx-1.5 shrink-0" />
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* STEP 1 — SERVICE */}
      {step === 1 && (
        <div
          className={`space-y-6 ${
            compact ? "flex-1 flex flex-col overflow-hidden" : ""
          }`}
        >
          <div className="space-y-1.5 shrink-0">
            <span className="text-[10px] uppercase font-semibold tracking-widest text-gold">
              Step 1 of 5
            </span>
            <h3 className="font-serif text-2xl text-navy font-semibold">
              Select a Dental Service
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Choose the treatment you&apos;d like to book. Final fees are confirmed at consultation.
            </p>
          </div>

          <div className="relative shrink-0">
            <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search treatments (e.g. Invisalign, Cleaning)…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-gold focus:bg-white transition-colors"
            />
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
              compact
                ? "flex-1 overflow-y-auto no-scrollbar pr-1 py-1"
                : "max-h-[380px] overflow-y-auto no-scrollbar pr-1"
            }`}
          >
            {filteredServices.length === 0 ? (
              <div className="md:col-span-2 text-center py-8 text-xs text-gray-400">
                No services match &ldquo;{searchTerm}&rdquo;.
              </div>
            ) : (
              filteredServices.map((service) => (
                <button
                  type="button"
                  key={service.slug}
                  onClick={() => selectService(service)}
                  className="text-left border border-gray-100 hover:border-gold hover:shadow-md rounded-xl p-4 cursor-pointer transition-all flex flex-col justify-between focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
                >
                  <div>
                    <span className="text-[10px] uppercase font-semibold tracking-wider text-gold">
                      {service.category}
                    </span>
                    <h4 className="font-serif text-sm font-semibold text-navy mt-1">
                      {service.name}
                    </h4>
                    <p className="text-gray-500 text-xs line-clamp-2 mt-1.5">
                      {service.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-gray-50 mt-4 pt-3 text-xs">
                    <span className="text-gray-400">
                      Duration: {service.duration} mins
                    </span>
                    <span className="font-semibold text-navy">
                      &euro;{service.priceFrom} – &euro;{service.priceTo}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      )}

      {/* STEP 2 — SCHEDULE */}
      {step === 2 && (
        <div
          className={`space-y-6 ${
            compact ? "flex-1 flex flex-col overflow-hidden" : ""
          }`}
        >
          <div className="space-y-1.5 shrink-0">
            <span className="text-[10px] uppercase font-semibold tracking-widest text-gold">
              Step 2 of 5
            </span>
            <h3 className="font-serif text-2xl text-navy font-semibold">
              Choose Date &amp; Time
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Booking for{" "}
              <span className="font-medium text-navy">{selectedService?.name}</span>
            </p>
          </div>

          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
              compact ? "flex-1 overflow-y-auto no-scrollbar pr-1 py-1" : ""
            }`}
          >
            <div className="space-y-2">
              <label className="text-xs font-semibold text-navy flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-gold" /> Select Date
              </label>
              <input
                type="date"
                min={todayIsoDate()}
                max={maxIsoDate()}
                value={watchedDate || ""}
                onChange={(e) => handleDateSelect(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-lg p-3 text-sm focus:outline-none focus:border-gold focus:bg-white transition-colors"
              />
              {scheduleNote && (
                <p className="text-[11px] text-gray-500 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-gold shrink-0" />
                  {scheduleNote}
                </p>
              )}
              {errors.date && (
                <p className="text-[11px] text-red-500">{errors.date.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-navy flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gold" /> Available Time Slots
              </label>

              {!watchedDate ? (
                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-lg p-6 text-center text-xs text-gray-400 flex flex-col items-center gap-1.5">
                  <Info className="w-5 h-5 text-gray-300" />
                  Please select an appointment date first.
                </div>
              ) : loadingSlots ? (
                <div className="grid grid-cols-3 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-10 rounded-lg shimmer bg-gray-100" />
                  ))}
                </div>
              ) : availableSlots.length === 0 ? (
                <div className="bg-red-50/50 border border-red-100 rounded-lg p-4 text-center text-xs text-red-500">
                  No available slots for this date. Please pick another day.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto no-scrollbar pr-1">
                  {availableSlots.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => handleTimeSelect(t)}
                      className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-all focus:outline-none focus:ring-2 focus:ring-gold/30 ${
                        watch("time") === t
                          ? "bg-navy text-white border-navy"
                          : "border-gray-200 hover:border-gold hover:text-gold text-navy"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
              {errors.time && (
                <p className="text-[11px] text-red-500">{errors.time.message}</p>
              )}
            </div>
          </div>

          <div className={compact ? "shrink-0 mt-auto pt-4" : "pt-4"}>
            <StepNav onBack={goPrev} onNext={goNext} primaryLabel="Continue" />
          </div>
        </div>
      )}

      {/* STEP 3 — DETAILS */}
      {step === 3 && (
        <div
          className={`space-y-6 ${
            compact ? "flex-1 flex flex-col overflow-hidden" : ""
          }`}
        >
          <div className="space-y-1.5 shrink-0">
            <span className="text-[10px] uppercase font-semibold tracking-widest text-gold">
              Step 3 of 5
            </span>
            <h3 className="font-serif text-2xl text-navy font-semibold">
              Patient Information
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              Confirm your contact details so the clinic can reach you about your appointment.
            </p>
          </div>

          {!user && (
            <div className="bg-gold/5 border border-gold/20 rounded-xl p-3.5 flex items-center justify-between text-xs text-navy shrink-0">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-gold shrink-0" />
                <span>Already registered? Sign in to pre-fill your details.</span>
              </div>
              <button
                type="button"
                onClick={() => openLoginModal()}
                className="text-gold font-bold hover:underline cursor-pointer ml-4 whitespace-nowrap"
              >
                Sign In &rarr;
              </button>
            </div>
          )}

          <div
            className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${
              compact ? "flex-1 overflow-y-auto no-scrollbar pr-1 py-1" : ""
            }`}
          >
            <Field label="First Name" error={errors.firstName?.message}>
              <input
                type="text"
                {...register("firstName")}
                className={inputCls(!!errors.firstName)}
              />
            </Field>
            <Field label="Last Name" error={errors.lastName?.message}>
              <input
                type="text"
                {...register("lastName")}
                className={inputCls(!!errors.lastName)}
              />
            </Field>
            <Field label="Email" error={errors.email?.message}>
              <input
                type="email"
                {...register("email")}
                className={inputCls(!!errors.email)}
              />
            </Field>
            <Field label="Mobile Number" error={errors.phone?.message}>
              <input
                type="tel"
                {...register("phone")}
                className={inputCls(!!errors.phone)}
              />
            </Field>
            <Field
              label="Special Requests / Medical Concerns"
              hint="Optional"
              className="md:col-span-2"
            >
              <textarea
                rows={3}
                {...register("notes")}
                placeholder="Mention anxiety, mobility needs, allergies, or anything we should know."
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-gold focus:bg-white resize-none transition-colors"
              />
            </Field>
          </div>

          <div className={compact ? "shrink-0 mt-auto pt-4" : "pt-4"}>
            <StepNav onBack={goPrev} onNext={goNext} primaryLabel="Review Booking" />
          </div>
        </div>
      )}

      {/* STEP 4 — REVIEW & CONFIRM */}
      {step === 4 && (
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={`space-y-6 ${
            compact ? "flex-1 flex flex-col overflow-hidden" : ""
          }`}
        >
          <div className="space-y-1.5 shrink-0">
            <span className="text-[10px] uppercase font-semibold tracking-widest text-gold">
              Step 4 of 5
            </span>
            <h3 className="font-serif text-2xl text-navy font-semibold">
              Review &amp; Confirm
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed">
              No payment is required to book. The clinic will review your request and
              confirm by email.
            </p>
          </div>

          <div
            className={`space-y-4 ${
              compact ? "flex-1 overflow-y-auto no-scrollbar pr-1 py-1" : ""
            }`}
          >
            <div className="rounded-2xl border border-gray-100 bg-off-white overflow-hidden">
              <ReviewRow label="Treatment" value={selectedService?.name} />
              <ReviewRow
                label="Estimated Fee"
                value={
                  selectedService
                    ? `€${selectedService.priceFrom} – €${selectedService.priceTo}`
                    : "—"
                }
              />
              <ReviewRow label="Date" value={formatDate(watch("date"))} />
              <ReviewRow label="Time" value={watch("time")} />
              <ReviewRow
                label="Patient"
                value={`${watch("firstName")} ${watch("lastName")}`}
              />
              <ReviewRow label="Email" value={watch("email")} />
              <ReviewRow label="Phone" value={watch("phone")} />
              {watch("notes") && (
                <ReviewRow label="Notes" value={watch("notes")} multiline />
              )}
            </div>

            <div className="flex items-start gap-2.5 rounded-xl border border-gold/30 bg-gold/5 p-3.5 text-xs text-navy">
              <ShieldCheck className="w-4 h-4 text-gold mt-0.5 shrink-0" />
              <p className="leading-relaxed">
                Submitting will create a <strong>pending</strong> appointment request.
                You&apos;ll receive a confirmation message once the clinic team approves it.
                Fees are settled in person at the clinic — no online payment is required.
              </p>
            </div>

            {submitError && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-3.5 py-3 text-xs text-red-600 flex items-start gap-2">
                <span className="font-bold">Booking failed:</span>
                <span className="leading-relaxed">{submitError}</span>
              </div>
            )}
          </div>

          <div className={compact ? "shrink-0 mt-auto pt-4" : "pt-4"}>
            <StepNav
              onBack={goPrev}
              primaryLabel={submitting ? "Submitting…" : "Submit appointment request"}
              primaryType="submit"
              disablePrimary={submitting}
            />
          </div>
        </form>
      )}

      {/* STEP 5 — CONFIRMATION */}
      {step === 5 && bookingResult && (
        <div
          className={`text-center py-6 space-y-6 ${
            compact ? "flex-1 flex flex-col overflow-hidden" : ""
          }`}
        >
          <div className={`w-16 h-16 rounded-full ${
            bookingResult.appointment?.status === "confirmed" ? "bg-emerald-50 text-emerald-500" : "bg-amber-50 text-amber-500"
          } mx-auto flex items-center justify-center shadow-inner shrink-0`}>
            {bookingResult.appointment?.status === "confirmed" ? (
              <CheckCircle className="w-10 h-10" />
            ) : (
              <Clock className="w-10 h-10" />
            )}
          </div>

          <div className="space-y-1.5 shrink-0">
            <span className="text-[10px] uppercase font-semibold tracking-widest text-gold">
              Step 5 of 5
            </span>
            <h3 className="font-serif text-2xl text-navy font-semibold">
              {bookingResult.appointment?.status === "confirmed" ? "Appointment Confirmed" : "Request Submitted"}
            </h3>
            <p className="text-gray-500 text-xs leading-relaxed max-w-md mx-auto">
              {bookingResult.appointment?.status === "confirmed"
                ? `Thank you, ${watch("firstName")}. Your appointment is confirmed! The clinic has been notified.`
                : `Thank you, ${watch("firstName")}. Your appointment request is submitted and is awaiting approval. We will notify you shortly.`}
            </p>
          </div>

          <div
            className={`max-w-md mx-auto w-full bg-off-white border border-gray-100 rounded-2xl p-6 text-left space-y-3 text-sm text-navy ${
              compact ? "flex-1 overflow-y-auto no-scrollbar" : ""
            }`}
          >
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-400 text-xs">Reference</span>
              <span className="font-mono font-semibold text-xs">
                {String(bookingResult.appointment?.id || "")
                  .substring(0, 8)
                  .toUpperCase() || "PENDING"}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Treatment</span>
              <span className="font-semibold">{bookingResult.service?.name}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Date</span>
              <span className="font-semibold">
                {formatDate(
                  bookingResult.appointment?.appointmentDate || watch("date")
                )}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">Time</span>
              <span className="font-semibold">
                {bookingResult.appointment?.appointmentTime || watch("time")}
              </span>
            </div>
            <div className="flex justify-between border-t border-gray-200 pt-2">
              <span className="text-gray-400 text-xs">Status</span>
              <span className={`${
                bookingResult.appointment?.status === "confirmed" ? "text-emerald-600" : "text-amber-600"
              } font-bold text-xs uppercase tracking-wider`}>
                {bookingResult.appointment?.status === "confirmed" ? "Confirmed" : "Pending Approval"}
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row gap-3 justify-center shrink-0 mt-auto">
            {onClose ? (
              <button
                type="button"
                onClick={onClose}
                className="bg-navy hover:bg-gray-800 text-white text-xs font-semibold px-6 py-2.5 rounded-lg shadow cursor-pointer"
              >
                Close & Return
              </button>
            ) : (
              <a
                href="/portal/appointments"
                className="bg-navy hover:bg-gray-800 text-white text-xs font-semibold px-6 py-2.5 rounded-lg shadow"
              >
                View My Appointments
              </a>
            )}
            <button
              type="button"
              onClick={() => {
                setStep(1);
                setSelectedService(null);
                setBookingResult(null);
                setValue("date", "");
                setValue("time", "");
                setValue("notes", "");
              }}
              className="border border-gray-200 text-navy font-semibold px-6 py-2.5 rounded-lg text-xs hover:bg-gray-50 transition-colors cursor-pointer"
            >
              Book Another Visit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------- Helpers -------------------- */

function inputCls(hasError: boolean) {
  return `w-full bg-gray-50 border rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:bg-white transition-colors ${
    hasError
      ? "border-red-300 focus:border-red-400"
      : "border-gray-200 focus:border-gold"
  }`;
}

function Field({
  label,
  hint,
  error,
  className = "",
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      <label className="text-[11px] font-semibold text-navy flex items-center justify-between gap-2">
        <span>{label}</span>
        {hint && <span className="text-gray-400 font-normal">{hint}</span>}
      </label>
      {children}
      {error && <p className="text-[11px] text-red-500">{error}</p>}
    </div>
  );
}

function ReviewRow({
  label,
  value,
  multiline,
}: {
  label: string;
  value?: string | null;
  multiline?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 px-5 py-3.5 border-b border-gray-100 last:border-0 text-sm">
      <span className="text-gray-400 text-xs font-medium uppercase tracking-wider w-32 shrink-0">
        {label}
      </span>
      <span
        className={`text-navy font-semibold text-right flex-1 ${
          multiline ? "whitespace-pre-line text-left" : "truncate"
        }`}
      >
        {value || "—"}
      </span>
    </div>
  );
}

function StepNav({
  onBack,
  onNext,
  primaryLabel,
  primaryType = "button",
  disablePrev = false,
  disablePrimary = false,
}: {
  onBack: () => void;
  onNext?: () => void;
  primaryLabel: string;
  primaryType?: "button" | "submit";
  disablePrev?: boolean;
  disablePrimary?: boolean;
}) {
  return (
    <div className="flex justify-between items-center border-t border-gray-100 pt-6">
      <button
        type="button"
        onClick={onBack}
        disabled={disablePrev}
        className="border border-gray-200 text-navy font-semibold px-5 py-2.5 rounded-lg text-xs hover:bg-gray-50 transition-colors flex items-center gap-1.5 disabled:opacity-50"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back
      </button>
      <button
        type={primaryType}
        onClick={primaryType === "button" ? onNext : undefined}
        disabled={disablePrimary}
        className="bg-gold hover:bg-gold-dark text-navy font-bold px-6 py-2.5 rounded-lg text-xs shadow-md transition-colors flex items-center gap-1.5 disabled:opacity-50"
      >
        {primaryLabel}
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
