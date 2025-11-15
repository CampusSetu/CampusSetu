import React, { useRef } from "react";
import {
  ArrowUpTrayIcon,
  ArrowDownTrayIcon,
} from "@heroicons/react/24/outline";

export default function ResumeUploadCard({
  lastUpdated,
  resumeFile,
  onUpload,
}) {
  const inputRef = useRef(null);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => onUpload?.(reader.result, file.name);
    reader.readAsDataURL(file);
  };

  return (
    <section className="rounded-2xl border border-white/60 bg-white/85 backdrop-blur p-6 shadow-lg">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            Resume Upload
          </p>
          <h2 className="text-lg font-semibold text-slate-900">
            Keep your PDF synced
          </h2>
          <p className="text-sm text-slate-500">
            Attach the PDF you actually share with recruiters so the placement
            team can access it instantly.
          </p>
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 shadow-sm transition hover:bg-blue-100"
        >
          <ArrowUpTrayIcon className="h-4 w-4" /> Upload PDF
        </button>
        <input
          type="file"
          accept="application/pdf"
          ref={inputRef}
          className="hidden"
          onChange={handleFile}
        />
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-white/60 bg-white/90 backdrop-blur p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Status
          </p>
          <p className="mt-2 text-sm font-semibold text-slate-900">
            {resumeFile ? "Synced to cloud" : "No file uploaded"}
          </p>
          <p className="text-xs text-slate-500">
            {lastUpdated
              ? `Updated ${new Date(lastUpdated).toLocaleDateString()}`
              : "Upload your PDF to unlock recruiter access."}
          </p>
        </div>
        <div className="rounded-2xl border border-dashed border-blue-200 bg-blue-50/30 p-4">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
            Shareable link
          </p>
          <p className="mt-2 text-sm text-slate-500">
            We generate a secure link for recruiters to download your resume.
          </p>
          <button
            type="button"
            disabled={!resumeFile}
            onClick={() => resumeFile && window.open(resumeFile, "_blank")}
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            {resumeFile ? "Preview resume" : "Upload to preview"}
          </button>
        </div>
      </div>
    </section>
  );
}
