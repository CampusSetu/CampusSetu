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
    <section className="rounded-3xl border border-slate-200 bg-gradient-to-br from-white via-slate-50 to-slate-100 p-6 shadow-sm">
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
          className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-300"
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
        <div className="rounded-2xl border border-slate-200 bg-white/90 p-4">
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
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-4">
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
            className="mt-3 inline-flex items-center gap-2 rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            {resumeFile ? "Preview resume" : "Upload to preview"}
          </button>
        </div>
      </div>
    </section>
  );
}
