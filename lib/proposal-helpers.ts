import { CellValue } from "./proposal-types";

export function formatARS(n: number): string {
  return "$ " + n.toLocaleString("es-AR", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function extractMLId(url: string): string | null {
  const match = url.match(/MLA-?(\d+)/i);
  return match ? `MLA${match[1]}` : null;
}

export function isNumeric(v: CellValue): v is number {
  return typeof v === "number" && v > 0;
}

export function cellDisplay(v: CellValue | undefined): string {
  if (v === null || v === undefined) return "—";
  if (v === "variable") return "Variable";
  if (v === "propio") return "$0 (propio)";
  if (v === "inhouse") return "$0 (in-house)";
  if (typeof v === "number") return formatARS(v);
  return "—";
}

export function sumColumn(
  rows: { alquilerEvento?: CellValue; compra?: CellValue; costoEvento?: CellValue }[],
  col: "alquilerEvento" | "compra" | "costoEvento"
): number {
  return rows.reduce((acc, r) => {
    const v = r[col];
    return acc + (isNumeric(v) ? v : 0);
  }, 0);
}
