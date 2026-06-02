"use client";

import { ProposalSection, ProposalRow, CellValue } from "@/lib/proposal-types";
import { formatARS, sumColumn } from "@/lib/proposal-helpers";
import { EditableCell } from "./editable-cell";
import { MLPopover } from "./ml-popover";

interface ProposalSectionProps {
  section: ProposalSection;
  onUpdateRow: (sectionId: string, rowId: string, patch: Partial<ProposalRow>) => void;
  onAddRow: (sectionId: string) => void;
  onDeleteRow: (sectionId: string, rowId: string) => void;
}

function TrashIcon() {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
    </svg>
  );
}

export function ProposalSectionBlock({
  section,
  onUpdateRow,
  onAddRow,
  onDeleteRow,
}: ProposalSectionProps) {
  const cols = section.columns;
  const hasAlquiler = cols.includes("alquilerEvento");
  const hasCompra = cols.includes("compra");
  const hasCosto = cols.includes("costoEvento");
  const showML = section.showML !== false;

  const totalAlquiler = hasAlquiler ? sumColumn(section.rows, "alquilerEvento") : 0;
  const totalCompra = hasCompra ? sumColumn(section.rows, "compra") : 0;
  const totalCosto = hasCosto ? sumColumn(section.rows, "costoEvento") : 0;

  return (
    <section className="mb-14">
      {/* Top color strip */}
      <div className="h-[3px] w-full mb-6" style={{ background: section.accent }} />

      {/* Section header */}
      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-1">
          <span
            className="font-sans text-xs font-light tracking-[0.25em] uppercase"
            style={{ color: section.accent }}
          >
            {section.number}
          </span>
          <h2 className="font-sans text-2xl font-bold tracking-tight text-[#faf9f5]">
            {section.title}
          </h2>
        </div>
        <p className="font-sans text-xs font-light tracking-widest uppercase text-[#b0aea5] mb-3">
          {section.subtitle}
        </p>
        <p className="font-serif italic text-sm text-[#b0aea5] leading-relaxed max-w-2xl">
          &ldquo;{section.description}&rdquo;
        </p>
      </div>

      {/* Highlight note */}
      {section.highlightNote && (
        <div
          className="mb-4 px-4 py-3 rounded-sm border-l-2 text-sm font-sans text-[#faf9f5] bg-[#1d1d1b]"
          style={{ borderColor: section.accent }}
        >
          {section.highlightNote}
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto rounded-sm border border-[rgba(232,230,220,0.12)]">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ background: section.accent }}>
              <th className="px-4 py-3 text-left font-sans text-[10px] font-semibold uppercase tracking-widest text-[#faf9f5] w-[18%]">
                Ítem
              </th>
              <th className="px-4 py-3 text-left font-sans text-[10px] font-semibold uppercase tracking-widest text-[#faf9f5]">
                Descripción
              </th>
              {showML && (
                <th className="px-3 py-3 text-center font-sans text-[10px] font-semibold uppercase tracking-widest text-[#faf9f5] w-10">
                  ML
                </th>
              )}
              {hasAlquiler && (
                <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-widest text-[#faf9f5] w-36">
                  {section.columnLabels.alquilerEvento ?? "Alquiler / evento"}
                </th>
              )}
              {hasCosto && (
                <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-widest text-[#faf9f5] w-36">
                  {section.columnLabels.costoEvento ?? "Costo / evento"}
                </th>
              )}
              {hasCompra && (
                <th className="px-4 py-3 text-right font-sans text-[10px] font-semibold uppercase tracking-widest text-[#faf9f5] w-36">
                  {section.columnLabels.compra ?? "Compra"}
                </th>
              )}
              <th className="px-2 py-3 w-9" />
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, i) => (
              <tr
                key={row.id}
                className="group/row border-b border-[rgba(232,230,220,0.06)] transition-colors hover:bg-white/[0.03]"
                style={{
                  background: i % 2 === 0 ? "#1d1d1b" : "#181816",
                  borderLeft: `2px solid ${section.accent}2a`,
                }}
              >
                {/* Item name */}
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={row.item}
                    onChange={(e) =>
                      onUpdateRow(section.id, row.id, { item: e.target.value })
                    }
                    className="bg-transparent text-[#faf9f5] font-sans text-sm font-medium w-full outline-none focus:underline placeholder:text-[#b0aea5]/50"
                    placeholder="Nuevo ítem"
                  />
                </td>
                {/* Description */}
                <td className="px-4 py-3">
                  <input
                    type="text"
                    value={row.descripcion}
                    onChange={(e) =>
                      onUpdateRow(section.id, row.id, { descripcion: e.target.value })
                    }
                    className="bg-transparent text-[#b0aea5] font-serif text-sm w-full outline-none focus:text-[#faf9f5] transition-colors placeholder:text-[#b0aea5]/40"
                    placeholder="Descripción"
                  />
                </td>
                {/* ML popover */}
                {showML && (
                  <MLPopover
                    row={row}
                    accent={section.accent}
                    hasColumns={{ alquilerEvento: hasAlquiler, compra: hasCompra, costoEvento: hasCosto }}
                    onUpdateRow={(patch) => onUpdateRow(section.id, row.id, patch)}
                  />
                )}
                {/* Price columns */}
                {hasAlquiler && (
                  <EditableCell
                    value={row.alquilerEvento}
                    onChange={(v) =>
                      onUpdateRow(section.id, row.id, { alquilerEvento: v })
                    }
                    accent={section.accent}
                  />
                )}
                {hasCosto && (
                  <EditableCell
                    value={row.costoEvento}
                    onChange={(v) =>
                      onUpdateRow(section.id, row.id, { costoEvento: v })
                    }
                    accent={section.accent}
                  />
                )}
                {hasCompra && (
                  <EditableCell
                    value={row.compra}
                    onChange={(v) =>
                      onUpdateRow(section.id, row.id, { compra: v })
                    }
                    accent={section.accent}
                  />
                )}
                {/* Delete row */}
                <td className="px-2 py-3 text-center">
                  <button
                    onClick={() => onDeleteRow(section.id, row.id)}
                    className="opacity-0 group-hover/row:opacity-100 text-[#b0aea5] hover:text-red-400 transition-all"
                    aria-label="Eliminar fila"
                  >
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
            {section.rows.length === 0 && (
              <tr>
                <td
                  colSpan={2 + (showML ? 1 : 0) + cols.length + 1}
                  className="px-4 py-8 text-center font-serif italic text-sm text-[#b0aea5]/50"
                >
                  Sin ítems. Agregá uno debajo.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add row button */}
      <button
        onClick={() => onAddRow(section.id)}
        className="mt-3 flex items-center gap-2 text-[11px] font-sans font-medium tracking-widest uppercase px-4 py-2 rounded-sm border transition-all hover:bg-white/[0.04] active:scale-[0.98]"
        style={{ color: section.accent, borderColor: `${section.accent}35` }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        Agregar ítem
      </button>

      {/* Section totals footer */}
      <div
        className="mt-3 rounded-sm px-5 py-3.5 flex flex-wrap gap-6 text-sm"
        style={{ background: "#181816", borderLeft: `3px solid ${section.accent}` }}
      >
        {hasAlquiler && (
          <div>
            <span className="text-[#b0aea5] font-sans text-[10px] uppercase tracking-widest">
              Total alquiler / evento:{" "}
            </span>
            <span className="font-sans font-semibold text-sm" style={{ color: section.accent }}>
              {formatARS(totalAlquiler)}
            </span>
          </div>
        )}
        {hasCosto && (
          <div>
            <span className="text-[#b0aea5] font-sans text-[10px] uppercase tracking-widest">
              Total costo / evento:{" "}
            </span>
            <span className="font-sans font-semibold text-sm" style={{ color: section.accent }}>
              {formatARS(totalCosto)}
            </span>
          </div>
        )}
        {hasCompra && (
          <div>
            <span className="text-[#b0aea5] font-sans text-[10px] uppercase tracking-widest">
              Total compra:{" "}
            </span>
            <span className="font-sans font-semibold text-sm" style={{ color: section.accent }}>
              {formatARS(totalCompra)}
            </span>
          </div>
        )}
      </div>

      {/* Optional note */}
      {section.note && (
        <div className="mt-4 px-5 py-3.5 rounded-sm bg-[#181816] border border-[rgba(232,230,220,0.08)] text-sm font-serif italic text-[#b0aea5]">
          {section.note}
        </div>
      )}
    </section>
  );
}
