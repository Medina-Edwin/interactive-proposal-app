"use client";

import { useState, useRef, useEffect } from "react";
import { CellValue } from "@/lib/proposal-types";
import { cellDisplay, formatARS } from "@/lib/proposal-helpers";

interface EditableCellProps {
  value: CellValue | undefined;
  onChange: (v: CellValue) => void;
  accent: string;
}

export function EditableCell({ value, onChange, accent }: EditableCellProps) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState("");
  const ref = useRef<HTMLInputElement>(null);

  // Non-editable display values
  const isStatic =
    value === "variable" || value === "propio" || value === "inhouse";

  useEffect(() => {
    if (editing && ref.current) {
      ref.current.focus();
      ref.current.select();
    }
  }, [editing]);

  function startEdit() {
    if (isStatic) return;
    setInput(typeof value === "number" ? String(value) : "");
    setEditing(true);
  }

  function commit() {
    const parsed = parseFloat(input.replace(/\./g, "").replace(",", "."));
    if (!isNaN(parsed) && parsed >= 0) {
      onChange(parsed);
    } else if (input.trim() === "" || input.trim() === "-") {
      onChange(null);
    }
    setEditing(false);
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === "Enter") commit();
    if (e.key === "Escape") setEditing(false);
  }

  const display = cellDisplay(value);
  const isEmpty = value === null || value === undefined;

  if (editing) {
    return (
      <td className="px-3 py-2 text-right">
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onBlur={commit}
          onKeyDown={handleKey}
          placeholder="0"
          className="w-full max-w-[120px] ml-auto bg-[#0e0e0d] border text-[#faf9f5] text-right px-2 py-1 text-sm rounded-sm outline-none focus:ring-1"
          style={{ borderColor: accent }}
        />
      </td>
    );
  }

  return (
    <td
      className={`px-3 py-2 text-right text-sm font-sans transition-colors group/cell ${
        isStatic
          ? "text-[#b0aea5] cursor-default"
          : "cursor-pointer hover:bg-white/5"
      }`}
      onClick={startEdit}
      title={isStatic ? undefined : "Click para editar"}
    >
      <span
        className={`${
          isEmpty
            ? "text-[#b0aea5]"
            : typeof value === "number" && value > 0
            ? "text-[#faf9f5] font-medium"
            : "text-[#b0aea5]"
        }`}
      >
        {display}
      </span>
      {!isStatic && (
        <span className="ml-1.5 opacity-0 group-hover/cell:opacity-35 inline-flex items-center">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 3a2.83 2.83 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
          </svg>
        </span>
      )}
    </td>
  );
}
