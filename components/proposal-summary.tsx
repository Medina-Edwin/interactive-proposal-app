"use client";

import { ProposalState } from "@/lib/proposal-types";
import { formatARS, isNumeric, sumColumn } from "@/lib/proposal-helpers";

interface ProposalSummaryProps {
  state: ProposalState;
}

interface SummaryRow {
  item: string;
  quien: string;
  costoEvento: string;
  compra: string;
}

export function ProposalSummary({ state }: ProposalSummaryProps) {
  const infraSection = state.sections.find((s) => s.id === "infraestructura");
  const equipSection = state.sections.find((s) => s.id === "equipamiento");
  const prodSection = state.sections.find((s) => s.id === "produccion");

  function getRow(section: typeof infraSection, rowId: string): typeof infraSection extends undefined ? undefined : (typeof infraSection)["rows"][0] | undefined {
    return section?.rows.find((r) => r.id === rowId);
  }

  const infra1 = getRow(infraSection, "infra-1");
  const infra2 = getRow(infraSection, "infra-2");
  const infra3 = getRow(infraSection, "infra-3");
  const equip1 = getRow(equipSection, "equip-1");
  const equip2 = getRow(equipSection, "equip-2");
  const prod1 = getRow(prodSection, "prod-1");
  const prod3 = getRow(prodSection, "prod-3");

  const summaryRows: SummaryRow[] = [
    {
      item: infra1?.item ?? "Sonido (refuerzo)",
      quien: "1310 (inversión)",
      costoEvento: formatVal(infra1?.alquilerEvento),
      compra: formatVal(infra1?.compra),
    },
    {
      item: infra2?.item ?? "Iluminación",
      quien: "1310 (inversión)",
      costoEvento: formatVal(infra2?.alquilerEvento),
      compra: formatVal(infra2?.compra),
    },
    {
      item: infra3?.item ?? "Instalación eléctrica",
      quien: "1310 (única vez)",
      costoEvento: "—",
      compra: formatVal(infra3?.compra),
    },
    {
      item: equip1?.item ?? "Mixer / CDJs",
      quien: "Zapateo",
      costoEvento: formatVal(equip1?.costoEvento),
      compra: formatVal(equip1?.compra),
    },
    {
      item: equip2?.item ?? "Máquina de humo",
      quien: "Zapateo (propio)",
      costoEvento: "—",
      compra: "—",
    },
    {
      item: prod1?.item ?? "Fotografía & video",
      quien: "Zapateo",
      costoEvento: formatVal(prod1?.costoEvento),
      compra: "—",
    },
    {
      item: prod3?.item ?? "Diseño gráfico",
      quien: "Zapateo (in-house)",
      costoEvento: "—",
      compra: "—",
    },
    {
      item: "Seguridad",
      quien: "1310",
      costoEvento: "—",
      compra: "—",
    },
  ];

  // Global totals
  let totalEvento = 0;
  let totalCompra = 0;
  let itemsCotizados = 0;

  for (const section of state.sections) {
    if (section.columns.includes("alquilerEvento")) {
      totalEvento += sumColumn(section.rows, "alquilerEvento");
    }
    if (section.columns.includes("costoEvento")) {
      totalEvento += sumColumn(section.rows, "costoEvento");
    }
    if (section.columns.includes("compra")) {
      totalCompra += sumColumn(section.rows, "compra");
    }
    for (const row of section.rows) {
      if (
        isNumeric(row.alquilerEvento) ||
        isNumeric(row.costoEvento) ||
        isNumeric(row.compra)
      ) {
        itemsCotizados++;
      }
    }
  }

  return (
    <section className="mb-12">
      <div className="h-[3px] w-full mb-6" style={{ background: "#d97757" }} />

      <div className="mb-6">
        <div className="flex items-baseline gap-3 mb-1">
          <span className="font-sans text-xs font-light tracking-[0.25em] uppercase text-[#d97757]">
            Resumen
          </span>
          <h2 className="font-sans text-2xl font-bold tracking-tight text-[#faf9f5]">
            RESUMEN GENERAL
          </h2>
        </div>
        <p className="font-sans text-sm font-light tracking-widest uppercase text-[#b0aea5]">
          Todos los valores en tiempo real
        </p>
      </div>

      <div className="overflow-x-auto rounded-sm border border-[rgba(232,230,220,0.15)] mb-4">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-[#d97757]">
              <th className="px-3 py-2.5 text-left font-sans text-xs font-semibold uppercase tracking-widest text-[#faf9f5]">
                Ítem
              </th>
              <th className="px-3 py-2.5 text-left font-sans text-xs font-semibold uppercase tracking-widest text-[#faf9f5]">
                Quién lo asume
              </th>
              <th className="px-3 py-2.5 text-right font-sans text-xs font-semibold uppercase tracking-widest text-[#faf9f5] w-36">
                Costo / evento
              </th>
              <th className="px-3 py-2.5 text-right font-sans text-xs font-semibold uppercase tracking-widest text-[#faf9f5] w-36">
                Compra
              </th>
            </tr>
          </thead>
          <tbody>
            {summaryRows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-[rgba(232,230,220,0.08)]"
                style={{
                  background: i % 2 === 0 ? "#1d1d1b" : "#171715",
                  borderLeft: "2px solid #d9775733",
                }}
              >
                <td className="px-3 py-2.5 font-sans text-sm font-medium text-[#faf9f5]">
                  {row.item}
                </td>
                <td className="px-3 py-2.5 font-serif text-sm text-[#b0aea5] italic">
                  {row.quien}
                </td>
                <td className="px-3 py-2.5 text-right font-sans text-sm text-[#faf9f5]">
                  {row.costoEvento}
                </td>
                <td className="px-3 py-2.5 text-right font-sans text-sm text-[#faf9f5]">
                  {row.compra}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Global totals */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="bg-[#1d1d1b] rounded-sm px-4 py-4 border-l-[3px] border-[#d97757]">
          <p className="font-sans text-xs uppercase tracking-widest text-[#b0aea5] mb-1">
            Total costo por evento
          </p>
          <p className="font-sans text-xl font-bold text-[#d97757]">
            {formatARS(totalEvento)}
          </p>
        </div>
        <div className="bg-[#1d1d1b] rounded-sm px-4 py-4 border-l-[3px] border-[#6a9bcc]">
          <p className="font-sans text-xs uppercase tracking-widest text-[#b0aea5] mb-1">
            Total inversión compra
          </p>
          <p className="font-sans text-xl font-bold text-[#6a9bcc]">
            {formatARS(totalCompra)}
          </p>
        </div>
        <div className="bg-[#1d1d1b] rounded-sm px-4 py-4 border-l-[3px] border-[#788c5d]">
          <p className="font-sans text-xs uppercase tracking-widest text-[#b0aea5] mb-1">
            Ítems cotizados
          </p>
          <p className="font-sans text-xl font-bold text-[#788c5d]">
            {itemsCotizados} ítem{itemsCotizados !== 1 ? "s" : ""}
          </p>
        </div>
      </div>
    </section>
  );
}

function formatVal(v: unknown): string {
  if (v === null || v === undefined) return "—";
  if (v === "variable") return "Variable";
  if (v === "propio") return "$0 (propio)";
  if (v === "inhouse") return "$0 (in-house)";
  if (typeof v === "number") return formatARS(v);
  return "—";
}
