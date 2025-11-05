import React, { useState } from "react";

export default function JobForm({ onSubmit, initialData = {} }) {
  const [form, setForm] = useState({
    title: initialData.title || "",
    description: initialData.description || "",
    eligibility: initialData.eligibility || "",
    skills: (initialData.skills || []).join(", "),
    deadline: initialData.deadline || "",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      skills: form.skills.split(",").map((s) => s.trim()),
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto space-y-4 p-6 bg-white rounded-2xl shadow"
    >
      <input
        name="title"
        value={form.title}
        onChange={handleChange}
        placeholder="Job Title"
        className="w-full p-2 border rounded"
        required
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Job Description"
        className="w-full p-2 border rounded"
        rows="4"
        required
      />
      <input
        name="eligibility"
        value={form.eligibility}
        onChange={handleChange}
        placeholder="Eligibility"
        className="w-full p-2 border rounded"
        required
      />
      <input
        name="skills"
        value={form.skills}
        onChange={handleChange}
        placeholder="Skills (comma separated)"
        className="w-full p-2 border rounded"
      />
      <input
        type="date"
        name="deadline"
        value={form.deadline}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        required
      />

      <div className="flex justify-end space-x-3">
        <button type="reset" className="px-4 py-2 border rounded">
          Save Draft
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Publish
        </button>
      </div>
    </form>
  );
}
