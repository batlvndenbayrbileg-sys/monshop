"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { CONCERN_TAGS, INGREDIENT_TAGS } from "@/lib/tags";

export function TagInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (tags: string[]) => void;
}) {
  const [input, setInput] = useState("");

  const add = (raw: string) => {
    const t = raw.trim();
    if (!t) return;
    if (value.some((x) => x.toLowerCase() === t.toLowerCase())) return;
    onChange([...value, t]);
    setInput("");
  };

  const remove = (t: string) => onChange(value.filter((x) => x !== t));

  const suggestions = [...CONCERN_TAGS, ...INGREDIENT_TAGS].filter(
    (t) => !value.some((x) => x.toLowerCase() === t.toLowerCase())
  );

  return (
    <div>
      {/* Selected chips */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {value.map((t) => (
            <span
              key={t}
              className="inline-flex items-center gap-1.5 bg-brand-pink text-white rounded-pill pl-3 pr-1.5 py-1 text-xs font-medium"
            >
              {t}
              <button
                type="button"
                onClick={() => remove(t)}
                className="w-4 h-4 rounded-full bg-white/25 hover:bg-white/40 flex items-center justify-center"
                aria-label="Хасах"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === ",") {
              e.preventDefault();
              add(input);
            }
          }}
          placeholder="Таг бичээд Enter дарна (жнь: Хуурайшил)"
          className="flex-1 bg-bg-secondary border border-line rounded-pill px-5 py-3 text-sm focus:border-brand-pink outline-none"
        />
        <button
          type="button"
          onClick={() => add(input)}
          className="shrink-0 w-11 h-11 rounded-full bg-bg-secondary border border-line flex items-center justify-center hover:border-brand-pink transition"
          aria-label="Таг нэмэх"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested */}
      {suggestions.length > 0 && (
        <div className="mt-3">
          <div className="text-[11px] text-ink-muted mb-2">Санал болгох:</div>
          <div className="flex flex-wrap gap-1.5">
            {suggestions.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => add(t)}
                className="text-xs border border-line rounded-pill px-3 py-1.5 hover:border-brand-pink hover:text-brand-pink transition"
              >
                + {t}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
