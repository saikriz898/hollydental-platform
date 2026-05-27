"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { apiRequest, apiUpload } from "@/lib/api";
import { useLiveData } from "@/lib/useLiveData";
import { toast } from "@/lib/toast";
import { FolderLock, Upload, Download, Trash, RefreshCw } from "lucide-react";

interface PatientLite {
  id: string;
  firstName: string;
  lastName: string;
}

interface ClinicalFile {
  id: string;
  fileName: string;
  fileType: string;
  category?: string;
  cloudinaryUrl: string;
  createdAt: string;
}

function normalizePatients(raw: any): PatientLite[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.patients)) return raw.patients;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

function normalizeFiles(raw: any): ClinicalFile[] {
  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.files)) return raw.files;
  if (Array.isArray(raw?.data)) return raw.data;
  return [];
}

export default function AdminFilesPage() {
  const { data: patients = [], loading: patientsLoading } = useLiveData<PatientLite[]>(
    "/patients",
    { intervalMs: 0, select: normalizePatients, initialData: [] }
  );

  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("xray");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFile, setPendingFile] = useState<File | null>(null);

  // Auto-select the first patient once we have the list
  useEffect(() => {
    if (!selectedPatientId && patients.length > 0) {
      setSelectedPatientId(patients[0].id);
    }
  }, [patients, selectedPatientId]);

  const {
    data: files = [],
    loading: filesLoading,
    refetch,
  } = useLiveData<ClinicalFile[]>(
    selectedPatientId ? `/files/patient/${selectedPatientId}` : null,
    { intervalMs: 30000, select: normalizeFiles, initialData: [] }
  );

  const sortedFiles = useMemo(
    () =>
      [...files].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      ),
    [files]
  );

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pendingFile) {
      toast.warning("Please choose a file to upload.");
      return;
    }
    if (!selectedPatientId) {
      toast.warning("Please select a patient first.");
      return;
    }
    setUploading(true);
    try {
      await apiUpload("/files/upload", {
        patientId: selectedPatientId,
        category,
        file: pendingFile,
      });
      setShowUpload(false);
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      refetch();
      toast.success("File uploaded.");
    } catch (error: any) {
      toast.error(`Upload failed: ${error?.message || "Please try again."}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const ok = await toast.confirm({
      title: "Delete this file?",
      message: "It will be removed from the patient record.",
      confirmText: "Delete",
      danger: true,
    });
    if (!ok) return;
    try {
      await apiRequest(`/files/${id}`, { method: "DELETE" });
      refetch();
      toast.success("File deleted.");
    } catch (error: any) {
      toast.error(`Failed to delete file: ${error?.message || "Please try again."}`);
    }
  };

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4 gap-4 flex-wrap">
        <div>
          <h1 className="font-serif text-2xl font-bold text-navy">Clinical File Manager</h1>
          <p className="text-gray-500 text-xs mt-1">
            Upload X-rays, clinical reports, consent forms, and dental scans securely.
          </p>
        </div>
        <div className="flex gap-3 items-center flex-wrap">
          <select
            value={selectedPatientId}
            onChange={(e) => setSelectedPatientId(e.target.value)}
            disabled={patientsLoading || patients.length === 0}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-gold min-w-[220px]"
          >
            {patients.length === 0 ? (
              <option value="">No patients</option>
            ) : (
              patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.firstName} {p.lastName}
                </option>
              ))
            )}
          </select>
          <button
            onClick={() => setShowUpload(true)}
            disabled={!selectedPatientId}
            className="bg-gold hover:bg-gold-dark text-navy font-bold px-4 py-2 rounded-lg text-xs shadow flex items-center gap-1 focus:outline-none disabled:opacity-50"
          >
            <Upload className="w-4 h-4" /> Upload File
          </button>
          <button
            onClick={refetch}
            className="border border-navy text-navy font-semibold px-4 py-2 rounded-lg text-xs hover:bg-gray-50 focus:outline-none flex items-center gap-1"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${filesLoading ? "animate-spin" : ""}`} /> Reload
          </button>
        </div>
      </div>

      {filesLoading && sortedFiles.length === 0 ? (
        <div className="h-[200px] shimmer rounded-2xl" />
      ) : sortedFiles.length === 0 ? (
        <div className="border border-gray-200 rounded-2xl bg-white p-12 text-center space-y-3 max-w-md mx-auto">
          <FolderLock className="w-10 h-10 text-gray-300 mx-auto" />
          <h3 className="font-serif text-base font-semibold text-navy">No Files Logged</h3>
          <p className="text-gray-500 text-xs leading-relaxed">
            There are no clinical documents uploaded for this patient yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedFiles.map((file) => (
            <div
              key={file.id}
              className="border border-gray-200 bg-white rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:border-gold transition-colors"
            >
              <div className="aspect-video bg-gray-50 border-b border-gray-100 flex items-center justify-center relative">
                {(file.fileType || "").startsWith("image/") ? (
                  <img
                    src={file.cloudinaryUrl}
                    alt={file.fileName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FolderLock className="w-8 h-8 text-gold" />
                )}
              </div>

              <div className="p-4 space-y-3">
                <div>
                  {file.category && (
                    <span className="text-[8px] font-bold text-gold uppercase tracking-wider bg-gold/10 px-2 py-0.5 rounded">
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

                <div className="flex gap-2">
                  <a
                    href={file.cloudinaryUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 border border-gray-200 hover:border-gold hover:text-gold text-navy font-semibold py-1.5 rounded-lg text-xs flex items-center justify-center gap-1 focus:outline-none"
                  >
                    <Download className="w-3.5 h-3.5" /> Download
                  </a>
                  <button
                    onClick={() => handleDelete(file.id)}
                    className="border border-red-100 hover:bg-red-50 text-red-500 p-1.5 rounded-lg focus:outline-none"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showUpload && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-[420px] p-6 space-y-6 shadow-2xl relative animate-fade-up">
            <button
              onClick={() => {
                setShowUpload(false);
                setPendingFile(null);
                if (fileInputRef.current) fileInputRef.current.value = "";
              }}
              className="absolute right-4 top-4 text-gray-400 hover:text-navy text-lg font-bold focus:outline-none"
            >
              &times;
            </button>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div className="border-b border-gray-200 pb-3">
                <h4 className="font-serif text-lg font-bold text-navy">Upload Clinical File</h4>
                <p className="text-gray-500 text-[10px] mt-0.5">
                  Attach clinical assets directly to{" "}
                  <span className="font-semibold text-navy">
                    {selectedPatient
                      ? `${selectedPatient.firstName} ${selectedPatient.lastName}`
                      : "the selected patient"}
                  </span>
                  &apos;s record.
                </p>
              </div>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-navy">File Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none"
                  >
                    <option value="xray">X-ray Diagnostic Scan</option>
                    <option value="document">Consent Paperwork</option>
                    <option value="photo">Aesthetic Smile Photo</option>
                    <option value="report">Clinical Report</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-semibold text-navy">File</label>
                  <input
                    ref={fileInputRef}
                    type="file"
                    required
                    accept="image/*,application/pdf"
                    onChange={(e) => setPendingFile(e.target.files?.[0] || null)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg p-2.5 text-xs focus:outline-none file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:bg-navy file:text-white"
                  />
                  {pendingFile && (
                    <p className="text-[10px] text-gray-500">
                      {pendingFile.name} · {(pendingFile.size / 1024).toFixed(1)} KB
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-gold hover:bg-gold-dark text-navy font-bold py-2.5 rounded-lg text-xs shadow-md transition-colors disabled:opacity-50"
              >
                {uploading ? "Uploading…" : "Upload File"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
