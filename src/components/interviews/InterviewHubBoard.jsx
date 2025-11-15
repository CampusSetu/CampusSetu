import React, { useMemo } from "react";
import {
  BellAlertIcon,
  BoltIcon,
  CalendarDaysIcon,
  CheckCircleIcon,
  ClockIcon,
  GlobeAltIcon,
  VideoCameraIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";

const roleCopy = {
  student: {
    label: "Student workspace",
    title: "Interview Hub",
    subtitle:
      "Track every round, eliminate clashes, and step into interviews fully prepared.",
    kicker: "Smart interview scheduling",
    cta: "Review playbook",
  },
  recruiter: {
    label: "Recruiter control",
    title: "Interview Hub",
    subtitle:
      "Coordinate multi-round panels, share links instantly, and keep every stakeholder aligned.",
    kicker: "Smart interview scheduling",
    cta: "Share agenda",
  },
};

const featureHighlights = [
  {
    title: "Multi-round scheduling",
    description:
      "Stack aptitude, technical, and HR rounds with auto-notifications for every participant.",
    icon: CalendarDaysIcon,
    color: "text-indigo-600 bg-indigo-50",
  },
  {
    title: "Calendar integration",
    description:
      "Sync with Google, Outlook, or iCal to prevent clashes across time zones.",
    icon: GlobeAltIcon,
    color: "text-sky-600 bg-sky-50",
  },
  {
    title: "Virtual interview kits",
    description:
      "Drop meeting links, assessment tools, and prep docs into one shareable card.",
    icon: VideoCameraIcon,
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "Smart reminders",
    description:
      "Email, SMS, and push nudges fire automatically so no one misses a slot.",
    icon: BellAlertIcon,
    color: "text-rose-600 bg-rose-50",
  },
];

const safeDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date;
};

const formatDate = (value, timezone) => {
  const date = safeDate(value);
  if (!date) return "TBD";
  try {
    return new Intl.DateTimeFormat("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      timeZone: timezone || "UTC",
    }).format(date);
  } catch {
    return date.toDateString();
  }
};

const formatTime = (value, timezone) => {
  const date = safeDate(value);
  if (!date) return "";
  try {
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: timezone || "UTC",
    }).format(date);
  } catch {
    return date.toLocaleTimeString();
  }
};

const detectConflicts = (slots = []) => {
  if (!slots.length) return [];
  const ordered = [...slots].sort(
    (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
  );
  const overlaps = [];
  for (let index = 1; index < ordered.length; index += 1) {
    const current = ordered[index];
    const previous = ordered[index - 1];
    if (new Date(previous.end).getTime() > new Date(current.start).getTime()) {
      overlaps.push({ previous, current });
    }
  }
  return overlaps;
};

const percentage = (value, total) => {
  if (!total) return "0%";
  return `${Math.round((value / total) * 100)}%`;
};

export default function InterviewHubBoard({
  role = "student",
  loading = false,
  interviews = [],
  programs = [],
}) {
  const copy = roleCopy[role] || roleCopy.student;

  const orderedSlots = useMemo(
    () =>
      [...interviews].sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
      ),
    [interviews]
  );

  const upcomingSlots = useMemo(() => {
    const now = Date.now();
    const future = orderedSlots.filter(
      (slot) => new Date(slot.end || slot.start).getTime() >= now
    );
    return future.length ? future : orderedSlots;
  }, [orderedSlots]);

  const nextInterview = upcomingSlots[0] || null;
  const conflicts = useMemo(
    () => detectConflicts(orderedSlots),
    [orderedSlots]
  );

  const virtualCount = useMemo(
    () =>
      orderedSlots.filter((slot) =>
        (slot.mode || "").toLowerCase().includes("virtual")
      ).length,
    [orderedSlots]
  );

  const reminderChannels = useMemo(() => {
    const channels = new Set();
    orderedSlots.forEach((slot) => {
      (slot.reminders || []).forEach((channel) => channels.add(channel));
    });
    return channels;
  }, [orderedSlots]);

  const calendarIntegrations = useMemo(() => {
    const providers = new Set();
    orderedSlots.forEach((slot) => {
      (slot.calendarSync || []).forEach((provider) => providers.add(provider));
    });
    return providers;
  }, [orderedSlots]);

  const timezoneSet = useMemo(() => {
    const bucket = new Set();
    orderedSlots.forEach((slot) => slot.timezone && bucket.add(slot.timezone));
    return bucket;
  }, [orderedSlots]);

  const featuredProgram = useMemo(() => {
    if (!programs.length) return null;
    if (nextInterview) {
      const specific = programs.find(
        (program) => program.jobId === nextInterview.jobId
      );
      if (specific) return specific;
    }
    return programs[0];
  }, [programs, nextInterview]);

  const programRounds = featuredProgram?.rounds || [];

  const joinCall = (link) => {
    if (!link) return;
    window.open(link, "_blank", "noopener,noreferrer");
  };

  const skeleton = (
    <div className="space-y-6">
      {Array.from({ length: 3 }).map((_, idx) => (
        <div
          key={idx}
          className="h-32 animate-pulse rounded-3xl bg-slate-200/70"
        />
      ))}
    </div>
  );

  if (loading) return skeleton;

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-white/70 bg-gradient-to-br from-white via-slate-50 to-blue-50 px-8 py-10 shadow-[0_25px_65px_-45px_rgba(15,23,42,0.75)]">
        <div className="pointer-events-none absolute -top-24 left-0 h-72 w-72 rounded-full bg-blue-200/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-4 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-4 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-slate-500">
              <span className="inline-block h-1.5 w-1.5 rounded-full bg-blue-500" />
              <span>{copy.label}</span>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                {copy.kicker}
              </p>
              <h1 className="text-3xl font-semibold text-slate-900 sm:text-4xl">
                {copy.title}
              </h1>
              <p className="text-sm leading-relaxed text-slate-600">
                {copy.subtitle}
              </p>
            </div>
            {nextInterview ? (
              <div className="flex flex-wrap items-center gap-3 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-3 py-1 font-medium text-slate-700 shadow">
                  <ClockIcon className="h-4 w-4" />
                  Next ·{" "}
                  {formatDate(
                    nextInterview.start,
                    nextInterview.timezone
                  )} · {formatTime(nextInterview.start, nextInterview.timezone)}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                  <CheckCircleIcon className="h-4 w-4" />
                  {nextInterview.companyName}
                </span>
              </div>
            ) : (
              <p className="text-sm text-slate-500">
                No interviews are scheduled yet—create one from your recruiter
                dashboard.
              </p>
            )}
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:w-auto">
            <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                Rounds scheduled
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {orderedSlots.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {virtualCount} virtual-ready ·{" "}
                {percentage(virtualCount, orderedSlots.length)} hybrid coverage
              </p>
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/85 p-5 shadow backdrop-blur">
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-400">
                Conflict checks
              </p>
              <p className="mt-3 text-3xl font-semibold text-slate-900">
                {conflicts.length}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {conflicts.length
                  ? "Resolve flagged overlaps"
                  : "No clashes detected"}
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="card-elevated relative overflow-hidden p-5">
          <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-blue-100/60" />
          <div className="relative flex flex-col gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CalendarDaysIcon className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Calendar coverage
            </p>
            <p className="text-3xl font-semibold text-slate-900">
              {calendarIntegrations.size || 0}
            </p>
            <p className="text-xs text-slate-500">
              {calendarIntegrations.size > 0
                ? Array.from(calendarIntegrations).join(" · ")
                : "Connect a calendar to auto-sync"}
            </p>
          </div>
        </div>

        <div className="card-elevated p-5">
          <div className="flex flex-col gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-rose-50 text-rose-600">
              <BellAlertIcon className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Reminder channels
            </p>
            <p className="text-3xl font-semibold text-slate-900">
              {reminderChannels.size || 0}
            </p>
            <p className="text-xs text-slate-500">
              {reminderChannels.size > 0
                ? `${Array.from(reminderChannels).join(", ")}`
                : "Configure reminders for coverage"}
            </p>
          </div>
        </div>

        <div className="card-elevated p-5">
          <div className="flex flex-col gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
              <VideoCameraIcon className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Virtual readiness
            </p>
            <p className="text-3xl font-semibold text-slate-900">
              {virtualCount}
            </p>
            <p className="text-xs text-slate-500">
              Meeting links ready for{" "}
              {percentage(virtualCount, orderedSlots.length)} of rounds
            </p>
          </div>
        </div>

        <div className="card-elevated p-5">
          <div className="flex flex-col gap-3">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <GlobeAltIcon className="h-5 w-5" />
            </div>
            <p className="text-sm font-semibold text-slate-800">
              Time zones managed
            </p>
            <p className="text-3xl font-semibold text-slate-900">
              {timezoneSet.size}
            </p>
            <p className="text-xs text-slate-500">
              {timezoneSet.size
                ? Array.from(timezoneSet).join(" · ")
                : "Single timezone"}
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="card-elevated p-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-50 text-brand-600">
              <BoltIcon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h2 className="text-base font-semibold text-slate-900">
                Upcoming schedule
              </h2>
              <p className="text-sm text-slate-500">
                Live view of the next interview blocks, platforms, and owners.
              </p>
            </div>
            {conflicts.length > 0 && (
              <span className="rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                {conflicts.length} conflict{conflicts.length > 1 ? "s" : ""}{" "}
                flagged
              </span>
            )}
          </div>

          <div className="mt-6 space-y-4">
            {upcomingSlots.slice(0, 5).map((slot) => (
              <div
                key={slot.id}
                className="flex flex-col gap-3 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm transition hover:border-brand-200"
              >
                <div className="flex flex-wrap items-start gap-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {slot.round}
                    </p>
                    <p className="text-xs text-slate-500">
                      {slot.companyName} · {slot.jobTitle}
                    </p>
                  </div>
                  <span
                    className={clsx(
                      "ml-auto rounded-full px-3 py-1 text-xs font-semibold",
                      slot.status === "Confirmed" || slot.status === "Scheduled"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {slot.status}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                    <CalendarDaysIcon className="h-4 w-4" />
                    {formatDate(slot.start, slot.timezone)} ·{" "}
                    {formatTime(slot.start, slot.timezone)}
                  </span>
                  <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                    <ClockIcon className="h-4 w-4" />
                    {Math.max(
                      15,
                      Math.round(
                        (new Date(slot.end).getTime() -
                          new Date(slot.start).getTime()) /
                          60000
                      )
                    )}
                    min
                  </span>
                  {slot.mode && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-0.5 font-medium text-slate-600">
                      {slot.mode}
                    </span>
                  )}
                  {!!slot.panel?.length && (
                    <span className="inline-flex items-center gap-1">
                      Panel · {slot.panel.join(", ")}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                  {slot.meetingLink ? (
                    <button
                      type="button"
                      onClick={() => joinCall(slot.meetingLink)}
                      className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-300"
                    >
                      <VideoCameraIcon className="h-4 w-4" />
                      Join link
                    </button>
                  ) : (
                    <span className="rounded-full border border-dashed border-slate-200 px-3 py-1 text-xs text-slate-400">
                      Awaiting link
                    </span>
                  )}
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
                    {slot.reminders?.join(" · ") || "No reminders"}
                  </span>
                  <span className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
                    {slot.calendarSync?.join(" · ") || "Calendar pending"}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-elevated flex flex-col gap-5 p-6">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Round blueprint
            </h2>
            <p className="text-sm text-slate-500">
              {featuredProgram
                ? `${featuredProgram.companyName} · ${featuredProgram.role}`
                : "Select a role to view the multi-round plan."}
            </p>
          </div>
          {featuredProgram ? (
            <>
              <div className="space-y-3">
                {programRounds.map((round, index) => (
                  <div
                    key={`${featuredProgram.jobId}-${round.label}`}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/80 px-4 py-3"
                  >
                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-white text-sm font-semibold text-slate-700">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-900">
                        {round.label}
                      </p>
                      <p className="text-xs text-slate-500">
                        {round.mode} · {round.duration} mins · {round.window}
                      </p>
                    </div>
                    <span className="text-xs font-medium text-slate-500">
                      {round.owner}
                    </span>
                  </div>
                ))}
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-xs text-slate-500">
                <p className="font-semibold text-slate-800">
                  Collaboration stack
                </p>
                <p>{featuredProgram.tools.join(" · ")}</p>
                <p className="mt-2">
                  Coordinator · {featuredProgram.coordinator}
                </p>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
              Blueprint data will appear once interviews are scheduled.
            </div>
          )}
          {nextInterview && (
            <button
              type="button"
              onClick={() => joinCall(nextInterview.meetingLink)}
              disabled={!nextInterview.meetingLink}
              className={clsx(
                "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-sm font-semibold shadow-sm",
                nextInterview.meetingLink
                  ? "bg-brand-600 text-white hover:bg-brand-500"
                  : "bg-slate-200 text-slate-500 cursor-not-allowed"
              )}
            >
              <ArrowPathIcon className="h-4 w-4" />
              {copy.cta}
            </button>
          )}
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {featureHighlights.map((feature) => {
          const Icon = feature.icon;
          return (
            <div
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-sm"
            >
              <div
                className={clsx(
                  "mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl",
                  feature.color
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="text-base font-semibold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                {feature.description}
              </p>
            </div>
          );
        })}
      </section>
    </div>
  );
}
