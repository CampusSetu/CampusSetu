import React, { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { createApplication } from "../api/mockApplications";
import { useAuth } from "../contexts/AuthContext";
import {
  ArrowUpRightIcon,
  PaperClipIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";
import Button from "./Button";

export default function ApplyModal({ job, onClose, onApplied }) {
  const { user } = useAuth();
  const [resumeUrl, setResumeUrl] = useState(user?.profile?.resumeUrl || "");
  const [cover, setCover] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    if (!user) {
      alert("Please login as a student to apply.");
      return;
    }
    setLoading(true);
    try {
      await createApplication({
        jobId: job.id,
        studentId: user.id,
        resumeUrl,
        cover,
      });
      onApplied?.();
      onClose();
    } catch (error) {
      console.error(error);
      alert("Failed to submit application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Transition.Root show as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-elevated">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                    <SparklesIcon className="h-6 w-6" />
                  </div>
                  <div>
                    <Dialog.Title className="text-xl font-semibold text-slate-900">
                      Apply for {job.title}
                    </Dialog.Title>
                    <p className="text-xs text-slate-500">
                      {job.companyName} • {job.location}
                    </p>
                  </div>
                </div>

                <form onSubmit={submit} className="mt-6 space-y-5">
                  <div className="space-y-2">
                    <label htmlFor="resume" className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Resume URL
                    </label>
                    <div className="relative">
                      <PaperClipIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                      <input
                        id="resume"
                        type="url"
                        value={resumeUrl}
                        onChange={(event) => setResumeUrl(event.target.value)}
                        placeholder="https://portfolio.com/resume.pdf"
                        className="w-full rounded-xl border border-slate-200 bg-white px-11 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                      />
                    </div>
                    <p className="text-xs text-slate-400">
                      Provide a public link to your latest resume or portfolio. Leave blank if unchanged.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="cover" className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Cover note
                    </label>
                    <textarea
                      id="cover"
                      rows={4}
                      value={cover}
                      onChange={(event) => setCover(event.target.value)}
                      placeholder="Highlight your interest and relevant experience..."
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300"
                    />
                  </div>

                  <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
                    <p className="font-semibold text-slate-700">Tip for impact</p>
                    <p>Reference a recent project or internship aligning with {job.companyName}'s mission. Mention availability and preferred start.</p>
                  </div>

                  <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                    <Button variant="secondary" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button type="submit" loading={loading} rightIcon={ArrowUpRightIcon}>
                      Submit application
                    </Button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
