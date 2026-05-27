"use client";

import { useEffect, useState } from "react";
import { apiRequest } from "@/lib/api";
import { History } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function PortalTreatmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiRequest("/appointments/my")
      .then((data) => {
        // filter completed ones as treatments
        setAppointments(data.filter((a: any) => a.status === "completed" || a.appointmentDate < new Date().toISOString()));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="border-b border-gray-100 pb-4">
        <h1 className="font-serif text-2xl font-bold text-navy">Treatment History</h1>
        <p className="text-gray-500 text-xs mt-1">Review complete medical logs and diagnostic visits in Cork</p>
      </div>

      {loading ? (
        <div className="h-[200px] shimmer rounded-xl" />
      ) : appointments.length === 0 ? (
        <div className="border border-gray-100 rounded-2xl bg-white p-12 text-center space-y-3 max-w-md mx-auto">
          <History className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-serif text-base font-semibold text-navy">No Treatments Logged</h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            There are no completed medical procedures registered in your patient file yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6 max-w-3xl">
          {appointments.map((item, idx) => (
            <div key={item.id} className="relative flex gap-6 pl-4 md:pl-8 group">
              {/* Vertical connected line */}
              {idx < appointments.length - 1 && (
                <div className="absolute top-8 bottom-0 left-[27px] md:left-[43px] w-0.5 bg-gray-200" />
              )}
              
              {/* Circle Timeline bullet */}
              <div className="w-6 h-6 rounded-full bg-gold/10 text-gold flex items-center justify-center font-bold text-xs shrink-0 mt-1 relative z-10">
                &bull;
              </div>

              {/* Card info */}
              <div className="border border-gray-100 bg-white rounded-xl p-5 shadow-sm hover:border-gold transition-colors flex-1 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase">{formatDate(item.appointmentDate)}</span>
                    <h3 className="font-serif text-base font-bold text-navy mt-1">
                      {item.serviceId.replace("-", " ")}
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-navy bg-gold/10 px-2 py-0.5 rounded">
                    Dr. Roghay
                  </span>
                </div>

                {item.notes && (
                  <p className="text-gray-500 text-xs leading-relaxed bg-gray-50 p-3 rounded-lg">
                    {item.notes}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
