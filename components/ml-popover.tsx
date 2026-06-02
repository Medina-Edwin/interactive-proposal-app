"use client";

import { useState, useRef, useEffect } from "react";
import { extractMLId, formatARS } from "@/lib/proposal-helpers";
import { ProposalRow } from "@/lib/proposal-types";

interface MLPopoverProps {
  row: ProposalRow;
  accent: string;
  hasColumns: { alquilerEvento: boolean; compra: boolean; costoEvento: boolean };
  onUpdateRow: (patch: Partial<ProposalRow>) => void;
}

interface MLResult {
  title: string;
  price: number;
  url: string;
}

export function MLPopover({ row, accent, hasColumns, onUpdateRow }: MLPopoverProps) {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(row.mlUrl || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<MLResult | null>(row.mlData || null);
  const [error, setError] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const hasLink = !!row.mlUrl;

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  async function fetchML() {
    setError(null);
    setResult(null);
    const id = extractMLId(url);
    if (!id) {
      setError("URL de Mercado Libre no reconocida");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`https://api.mercadolibre.com/items/${id}`);
      if (!res.ok) throw new Error("No se pudo obtener el producto");
      const data = await res.json();
      const fetched: MLResult = {
        title: data.title,
        price: data.price,
        url: data.permalink,
      };
      setResult(fetched);
      onUpdateRow({ mlUrl: url, mlData: fetched });
    } catch {
      setError("No se pudo obtener el precio. Verificá la URL.");
    } finally {
      setLoading(false);
    }
  }

  function applyPrice(col: "alquilerEvento" | "costoEvento" | "compra") {
    if (!result) return;
    onUpdateRow({ [col]: result.price });
    setOpen(false);
  }

  return (
    <td className="px-3 py-2 text-center relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center justify-center w-6 h-6 rounded-sm transition-colors"
        style={{ color: hasLink ? accent : "#b0aea5" }}
        title="Vincular producto de Mercado Libre"
        aria-label="Vincular Mercado Libre"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
          <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
        </svg>
      </button>

      {open && (
        <div
          ref={popoverRef}
          className="absolute z-50 left-0 top-full mt-1 w-80 rounded-sm border shadow-2xl p-4 text-left"
          style={{
            background: "#1d1d1b",
            borderColor: accent,
            borderWidth: "1px",
          }}
        >
          <p className="text-xs font-sans uppercase tracking-widest mb-2" style={{ color: accent }}>
            Vincular Mercado Libre
          </p>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={url}
              onChange={(e) => { setUrl(e.target.value); setError(null); setResult(null); }}
              placeholder="https://articulo.mercadolibre.com.ar/..."
              className="flex-1 bg-[#141413] border border-[rgba(232,230,220,0.2)] rounded-sm px-2 py-1.5 text-xs text-[#faf9f5] placeholder:text-[#b0aea5] outline-none focus:border-current"
              style={{ "--tw-border-opacity": "1" } as React.CSSProperties}
              onFocus={(e) => (e.target.style.borderColor = accent)}
              onBlur={(e) => (e.target.style.borderColor = "rgba(232,230,220,0.2)")}
            />
            <button
              onClick={fetchML}
              disabled={loading || !url}
              className="px-3 py-1.5 text-xs font-sans font-medium rounded-sm transition-opacity disabled:opacity-40"
              style={{ background: accent, color: "#faf9f5" }}
            >
              {loading ? "..." : "Obtener"}
            </button>
          </div>

          {error && (
            <p className="text-xs text-red-400 mb-2">{error}</p>
          )}

          {result && (
            <div className="space-y-2">
              <div className="bg-[#141413] rounded-sm p-2 border border-[rgba(232,230,220,0.1)]">
                <p className="text-xs text-[#faf9f5] leading-snug mb-1 line-clamp-2">{result.title}</p>
                <p className="text-sm font-medium" style={{ color: accent }}>{formatARS(result.price)}</p>
                <a
                  href={result.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-[#b0aea5] hover:text-[#faf9f5] underline underline-offset-2 transition-colors"
                >
                  Ver en Mercado Libre →
                </a>
              </div>
              <p className="text-[10px] uppercase tracking-widest text-[#b0aea5]">¿Usar este precio como...?</p>
              <div className="flex flex-wrap gap-2">
                {hasColumns.alquilerEvento && (
                  <button
                    onClick={() => applyPrice("alquilerEvento")}
                    className="text-xs px-2 py-1 rounded-sm border transition-colors hover:opacity-80"
                    style={{ borderColor: accent, color: accent }}
                  >
                    Alquiler / evento
                  </button>
                )}
                {hasColumns.costoEvento && (
                  <button
                    onClick={() => applyPrice("costoEvento")}
                    className="text-xs px-2 py-1 rounded-sm border transition-colors hover:opacity-80"
                    style={{ borderColor: accent, color: accent }}
                  >
                    Costo / evento
                  </button>
                )}
                {hasColumns.compra && (
                  <button
                    onClick={() => applyPrice("compra")}
                    className="text-xs px-2 py-1 rounded-sm border transition-colors hover:opacity-80"
                    style={{ borderColor: accent, color: accent }}
                  >
                    Compra
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </td>
  );
}
