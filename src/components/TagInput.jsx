import React, { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";

const TagInput = ({ tags = [], onChange, setTags, placeholder = "Add skill" }) => {
  const [input, setInput] = useState("");

  // Support both setTags and onChange prop patterns
  const handleTagsChange = (newTags) => {
    if (onChange) {
      onChange(newTags);
    } else if (setTags) {
      setTags(newTags);
    }
  };

  const addTag = () => {
    if (input.trim() && !tags.includes(input.trim())) {
      const newTags = [...tags, input.trim()];
      handleTagsChange(newTags);
      setInput("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const removeTag = (tag) => {
    const newTags = tags.filter((t) => t !== tag);
    handleTagsChange(newTags);
  };

  return (
    <div className="space-y-3">
      {/* Tags Display */}
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-0.5 rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-colors"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600 shadow-card focus:border-slate-300 focus:outline-none"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={addTag}
          className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-500 transition-colors whitespace-nowrap"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default TagInput;
