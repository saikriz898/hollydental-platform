"use client";

import { useMemo, useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { useLiveData } from "@/lib/useLiveData";
import { apiRequest } from "@/lib/api";
import { FolderOpen, Download, FileText, X, RefreshCw } from "lucide-react";

interface PatientFile {
  id: string;
  fileName: string;
  fileType: string;
  category?: string;
  cloudinaryUrl: string;
  createdAt: string;
}

function normalize(raw: any): PatientFile[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.files)) return raw.files;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

export default function PortalFilesPage() {
  const { user } = useAuthStore();
  const patientId = user?.patientProfile?.id;

  const [activeImage, setActiveImage] = useState<string | null>(null);

  const { data: files = [], loading, error, refetch } = useLiveData<PatientFile[]>(
    patientId ? `/files/patient/${patientId}` : null,
    { intervalMs: 30000, select: normalize, initialData: [] }
  );

  const sorted = useMemo(
    () =>
      [...files].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [files]
  );

  const handleDownload = async (file: PatientFile) => {
    try {
      const res = await fetch(file.cloudinaryUrl, { credentials: "omit" });
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = file.fileName || "download";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      // Fall back to opening the cloud URL directly
      window.open(file.cloudinaryUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-gray-100 pb-4 flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy">My Diagnostic Files</h1>
          <p className="text-gray-500 text-xs mt-1">
            X-rays, clinical reports, and care documents shared by your dentist.
          </p>
        </div>
        <button
          onClick={refetch}
          className="border border-gray-200 hover:border-gold hover:text-gold text-navy font-semibold px-3 py-1.5 rounded-lg text-xs flex items-center gap-1.5 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {loading && sorted.length === 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-[260px] shimmer rounded-2xl bg-gray-100" />
          ))}
        </div>
      ) : error ? (
        <div className="border border-red-100 bg-red-50/40 rounded-2xl p-6 text-center text-xs text-red-600">
          We couldn&apos;t load your clinical files. Please try again in a moment.
        </div>
      ) : sorted.length === 0 ? (
        <div className="border border-gray-100 rounded-2xl bg-white p-12 text-center space-y-3 max-w-md mx-auto">
          <FolderOpen className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-serif text-base font-semibold text-navy">No Files Logged</h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            There are no clinical documents or diagnostic photos uploaded to your patient profile folder yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((file) => {
            const isImage = (file.fileType || "").startsWith("image/");

            return (
              <div
                key={file.id}
                className="border border-gray-100 bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-gold transition-colors"
              >
                <div
                  className={`aspect-video flex items-center justify-center bg-gray-50 border-b border-gray-50 relative ${
                    isImage ? "cursor-pointer group" : ""
                  }`}
                  onClick={() => isImage && setActiveImage(file.cloudinaryUrl)}
                >
                  {isImage ? (
                    <>
                      <img
                        src={file.cloudinaryUrl}
                        alt={file.fileName}
                        className="w-full h-full object-cover group-hover:opacity-90 transition-opacity"
                      />
                      <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="bg-white/90 text-navy font-bold text-[10px] px-3 py-1 rounded shadow">
                          Preview Image
                        </span>
                      </div>
                    </>
                  ) : (
                    <FileText className="w-10 h-10 text-gold" />
                  )}
                </div>

                <div className="p-4 space-y-3">
                  <div>
                    {file.category && (
                      <span className="text-[8px] uppercase font-bold tracking-wider text-gold bg-gold/10 px-2 py-0.5 rounded">
                        {file.category}
                      </span>
                    )}
                    <h4 className="font-serif text-xs font-bold text-navy mt-1.5 truncate">
                      {file.fileName}
                    </h4>
                    <span className="block text-[10px] text-gray-400 mt-0.5">
                      Uploaded: {new Date(file.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDownload(file)}
                    className="w-full border border-gray-200 hover:border-gold hover:text-gold text-navy font-semibold py-2 rounded-lg text-xs flex items-center justify-center gap-1.5 transition-colors focus:outline-none"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {activeImage && (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
          <button
            onClick={() => setActiveImage(null)}
            className="absolute top-4 right-4 text-white hover:text-gold focus:outline-none"
          >
            <X className="w-8 h-8" />
          </button>
          <div className="max-w-[90vw] max-h-[80vh] relative rounded-lg overflow-hidden shadow-2xl border border-white/10">
            <img
              src={activeImage}
              alt="Clinical Attachment Preview"
              className="object-contain max-h-[80vh]"
            />
          </div>
        </div>
      )}
    </div>
  );
}
