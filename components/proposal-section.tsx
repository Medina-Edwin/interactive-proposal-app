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

  const totalAlquiler = hasAlquiler ? sumColumn(section.rows, "alquilerEvento") : 0;
  const totalCompra = hasCompra ? sumColumn(section.rows, "compra") : 0;
  const totalCosto = hasCosto ? sumColumn(section.rows, "costoEvento") : 0;

  return (
    <section className="mb-12">
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
        <p className="font-sans text-sm font-light tracking-widest uppercase text-[#b0aea5] mb-3">
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
      <div className="overflow-x-auto rounded-sm border border-[rgba(232,230,220,0.15)]">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr style={{ background: section.accent }}>
              <th className="px-3 py-2.5 text-left font-sans text-xs font-semibold uppercase tracking-widest text-[#faf9f5] w-[18%]">
                Ítem
              </th>
              <th className="px-3 py-2.5 text-left font-sans text-xs font-semibold uppercase tracking-widest text-[#faf9f5]">
                Descripción
              </th>
              <th className="px-3 py-2.5 text-center font-sans text-xs font-semibold uppercase tracking-widest text-[#faf9f5] w-12">
                ML
              </th>
              {hasAlquiler && (
                <th className="px-3 py-2.5 text-right font-sans text-xs font-semibold uppercase tracking-widest text-[#faf9f5] w-36">
                  {section.columnLabels.alquilerEvento ?? "Alquiler / evento"}
                </th>
              )}
              {hasCosto && (
                <th className="px-3 py-2.5 text-right font-sans text-xs font-semibold uppercase tracking-widest text-[#faf9f5] w-36">
                  {section.columnLabels.costoEvento ?? "Costo / evento"}
                </th>
              )}
              {hasCompra && (
                <th className="px-3 py-2.5 text-right font-sans text-xs font-semibold uppercase tracking-widest text-[#faf9f5] w-36">
                  {section.columnLabels.compra ?? "Compra"}
                </th>
              )}
              <th className="px-2 py-2.5 w-8" />
            </tr>
          </thead>
          <tbody>
            {section.rows.map((row, i) => (
              <tr
                key={row.id}
                className="group/row border-b border-[rgba(232,230,220,0.08)] transition-colors hover:bg-white/[0.02]"
                style={{
                  background: i % 2 === 0 ? "#1d1d1b" : "#171715",
                  borderLeft: `2px solid ${section.accent}33`,
                }}
              >
                {/* Item name editable */}
                <td className="px-3 py-2.5">
                  <input
                    type="text"
                    value={row.item}
                    onChange={(e) =>
                      onUpdateRow(section.id, row.id, { item: e.target.value })
                    }
                    className="bg-transparent text-[#faf9f5] font-sans text-sm font-medium w-full outline-none focus:underline placeholder:text-[#b0aea5]"
                    placeholder="Nuevo ítem"
                  />
                </td>
                {/* Description editable */}
                <td className="px-3 py-2.5">
                  <input
                    type="text"
                    value={row.descripcion}
                    onChange={(e) =>
                      onUpdateRow(section.id, row.id, { descripcion: e.target.value })
                    }
                    className="bg-transparent text-[#b0aea5] font-serif text-sm w-full outline-none focus:text-[#faf9f5] transition-colors placeholder:text-[#b0aea5]/50"
                    placeholder="Descripción"
                  />
                </td>
                {/* ML popover */}
                <MLPopover
                  row={row}
                  accent={section.accent}
                  hasColumns={{ alquilerEvento: hasAlquiler, compra: hasCompra, costoEvento: hasCosto }}
                  onUpdateRow={(patch) => onUpdateRow(section.id, row.id, patch)}
                />
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
                <td className="px-2 py-2.5 text-center">
                  <button
                    onClick={() => onDeleteRow(section.id, row.id)}
                    className="opacity-0 group-hover/row:opacity-100 text-[#b0aea5] hover:text-red-400 transition-all text-xs"
                    aria-label="Eliminar fila"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add row button */}
      <button
        onClick={() => onAddRow(section.id)}
        className="mt-2 flex items-center gap-1.5 text-xs font-sans font-light tracking-widest uppercase px-3 py-1.5 rounded-sm border transition-colors hover:bg-white/5"
        style={{ color: section.accent, borderColor: `${section.accent}44` }}
      >
        <span className="text-base leading-none">+</span> Agregar ítem
      </button>

      {/* Section totals footer */}
      <div
        className="mt-3 rounded-sm px-4 py-3 flex flex-wrap gap-6 text-sm"
        style={{ background: "#1d1d1b", borderLeft: `3px solid ${section.accent}` }}
      >
        {hasAlquiler && (
          <div>
            <span className="text-[#b0aea5] font-sans text-xs uppercase tracking-widest">
              Total alquiler / evento:{" "}
            </span>
            <span className="font-sans font-semibold" style={{ color: section.accent }}>
              {formatARS(totalAlquiler)}
            </span>
          </div>
        )}
        {hasCosto && (
          <div>
            <span className="text-[#b0aea5] font-sans text-xs uppercase tracking-widest">
              Total costo / evento:{" "}
            </span>
            <span className="font-sans font-semibold" style={{ color: section.accent }}>
              {formatARS(totalCosto)}
            </span>
          </div>
        )}
        {hasCompra && (
          <div>
            <span className="text-[#b0aea5] font-sans text-xs uppercase tracking-widest">
              Total compra:{" "}
            </span>
            <span className="font-sans font-semibold" style={{ color: section.accent }}>
              {formatARS(totalCompra)}
            </span>
          </div>
        )}
      </div>

      {/* Optional note */}
      {section.note && (
        <div className="mt-4 px-4 py-3 rounded-sm bg-[#1d1d1b] border border-[rgba(232,230,220,0.1)] text-sm font-serif italic text-[#b0aea5]">
          {section.note}
        </div>
      )}

      {/* Section number footer */}
      <div className="mt-4 text-right">
        <span
          className="font-sans text-xs font-light tracking-[0.3em] uppercase"
          style={{ color: `${section.accent}60` }}
        >
          Sección {section.number}
        </span>
      </div>
    </section>
  );
}
