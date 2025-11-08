import React from 'react';

const ROLES = [
  {
    key: 'student',
    label: 'Student',
  },
  {
    key: 'recruiter',
    label: 'Recruiter',
  },
  {
    key: 'placement',
    label: 'CGC',
  },
];

export default function RoleSelect({ value, onChange }) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">
        Choose your workspace role
      </legend>
      <div className="grid gap-2 sm:grid-cols-3">
        {ROLES.map((role) => {
          const isActive = value === role.key;
          return (
            <label key={role.key} className="cursor-pointer select-none">
              <input
                type="radio"
                name="role"
                value={role.key}
                checked={isActive}
                onChange={() => onChange(role.key)}
                className="peer sr-only"
              />
              <div
                className={`inline-flex h-9 w-full items-center justify-center gap-2 whitespace-nowrap rounded-md border text-sm font-medium transition [&>span]:pointer-events-none peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-slate-300 ${
                  isActive
                    ? 'border-slate-900 bg-slate-900/6 text-slate-900 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <span className="tracking-tight">{role.label}</span>
              </div>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}
