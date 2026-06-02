"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ProposalState, ProposalRow } from "@/lib/proposal-types";
import { initialProposalState } from "@/lib/proposal-initial-data";
import { ProposalSectionBlock } from "@/components/proposal-section";
import { ProposalSummary } from "@/components/proposal-summary";

let rowCounter = 100;

export default function Page() {
  const [state, setState] = useState<ProposalState>(initialProposalState);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstLoad = useRef(true);

  // Load from DB on mount
  useEffect(() => {
    fetch("/api/proposal")
      .then((r) => r.json())
      .then((data) => {
        setState(data);
        isFirstLoad.current = false;
      })
      .catch(() => {
        isFirstLoad.current = false;
      });
  }, []);

  // Scroll progress
  useEffect(() => {
    function onScroll() {
      const scrolled = window.scrollY;
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? (scrolled / total) * 100 : 0);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-save with debounce
  useEffect(() => {
    if (isFirstLoad.current) return;

    setSaveStatus("saving");
    if (saveTimer.current) clearTimeout(saveTimer.current);

    saveTimer.current = setTimeout(async () => {
      try {
        const res = await fetch("/api/proposal", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(state),
        });
        setSaveStatus(res.ok ? "saved" : "error");
      } catch {
        setSaveStatus("error");
      }
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 800);
  }, [state]);

  const updateRow = useCallback(
    (sectionId: string, rowId: string, patch: Partial<ProposalRow>) => {
      setState((prev) => ({
        ...prev,
        sections: prev.sections.map((s) =>
          s.id !== sectionId
            ? s
            : {
                ...s,
                rows: s.rows.map((r) =>
                  r.id !== rowId ? r : { ...r, ...patch }
                ),
              }
        ),
      }));
    },
    []
  );

  const addRow = useCallback((sectionId: string) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id !== sectionId
          ? s
          : {
              ...s,
              rows: [
                ...s.rows,
                {
                  id: `row-${++rowCounter}`,
                  item: "",
                  descripcion: "",
                  alquilerEvento: null,
                  costoEvento: null,
                  compra: null,
                },
              ],
            }
      ),
    }));
  }, []);

  const deleteRow = useCallback((sectionId: string, rowId: string) => {
    setState((prev) => ({
      ...prev,
      sections: prev.sections.map((s) =>
        s.id !== sectionId
          ? s
          : { ...s, rows: s.rows.filter((r) => r.id !== rowId) }
      ),
    }));
  }, []);

  return (
    <main className="min-h-screen bg-[#141413] text-[#faf9f5]">
      {/* Scroll progress bar */}
      <div className="fixed top-0 left-0 z-50 h-[2px] w-full bg-[#1d1d1b]">
        <div
          className="h-full bg-[#d97757] transition-[width] duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Save status indicator */}
      <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
        {saveStatus === "saving" && (
          <span className="font-sans text-[10px] tracking-widest uppercase text-[#b0aea5] bg-[#1d1d1b] px-3 py-1.5 rounded-sm border border-[rgba(232,230,220,0.1)]">
            Guardando…
          </span>
        )}
        {saveStatus === "saved" && (
          <span className="font-sans text-[10px] tracking-widest uppercase text-[#788c5d] bg-[#1d1d1b] px-3 py-1.5 rounded-sm border border-[#788c5d33]">
            ✓ Guardado
          </span>
        )}
        {saveStatus === "error" && (
          <span className="font-sans text-[10px] tracking-widest uppercase text-red-400 bg-[#1d1d1b] px-3 py-1.5 rounded-sm border border-red-400/20">
            Error al guardar
          </span>
        )}
      </div>

      {/* HERO */}
      <header className="max-w-5xl mx-auto px-6 pt-20 pb-12">

        {/* Brand lockup */}
        <div className="mb-10">
          <div className="flex items-end gap-4 flex-wrap mb-3">
            <div className="leading-none">
              <p className="font-sans text-[2.5rem] font-light tracking-[0.18em] text-[#b0aea5] uppercase leading-none">
                Club
              </p>
              <p className="font-sans text-[3.5rem] font-bold tracking-tight text-[#faf9f5] uppercase leading-none">
                Zapateo
              </p>
            </div>
            <p className="font-sans text-2xl font-medium tracking-wide text-[#d97757] uppercase pb-1.5">
              × Local 1310
            </p>
          </div>
          <p className="font-serif italic text-[#b0aea5] text-base">
            Del beat y la amistad, nació Zapateo.
          </p>
        </div>

        {/* Divider with date chip */}
        <div className="flex items-center gap-4 mb-10">
          <div className="h-px flex-1 bg-[#d97757]" />
          <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#b0aea5] whitespace-nowrap">
            Propuesta · Junio 2026
          </span>
        </div>

        {/* Document title */}
        <p className="font-sans text-[1.75rem] font-bold tracking-tight text-[#faf9f5] uppercase leading-tight mb-8">
          Propuesta Técnica{" "}
          <span className="text-[#d97757]">& Productiva</span>
        </p>

        {/* About + Objetivo grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-[#1d1d1b] rounded-sm p-6 border-l-[3px] border-[#d97757]">
            <p className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-[#d97757] mb-3">
              Quiénes somos
            </p>
            <p className="font-serif text-[#b0aea5] leading-relaxed text-sm">
              Club Zapateo es una productora de eventos de música electrónica.
              Organizamos experiencias inmersivas — House, Tech House, Techno, Drum &
              Bass — sin perder coherencia de marca ni calidad de producción.
            </p>
          </div>
          <div className="bg-[#1d1d1b] rounded-sm p-6 border border-[rgba(232,230,220,0.1)]">
            <p className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-[#b0aea5] mb-3">
              Objetivo
            </p>
            <p className="font-serif text-[#b0aea5] leading-relaxed text-sm">
              Transparentar los costos de producción de una fiesta electrónica en 1310
              y abrir la conversación sobre qué asume el local como inversión y qué
              corre por cuenta de la productora.
            </p>
          </div>
        </div>

        {/* Genre tags */}
        <div className="flex flex-wrap gap-2">
          {["House", "Tech House", "Techno", "Drum & Bass"].map((tag) => (
            <span
              key={tag}
              className="font-sans text-[10px] font-semibold tracking-[0.18em] px-3 py-1.5 rounded-sm uppercase"
              style={{
                background: "rgba(217,119,87,0.08)",
                color: "#d97757",
                border: "1px solid rgba(217,119,87,0.28)",
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-5xl mx-auto px-6 pb-16">
        {state.sections.map((section) => (
          <ProposalSectionBlock
            key={section.id}
            section={section}
            onUpdateRow={updateRow}
            onAddRow={addRow}
            onDeleteRow={deleteRow}
          />
        ))}

        <ProposalSummary state={state} />

        {/* Próximos Pasos */}
        <section className="mb-16">
          <div className="h-[3px] w-full mb-6 bg-[#d97757]" />
          <div className="mb-8">
            <span className="font-sans text-xs font-light tracking-[0.25em] uppercase text-[#d97757]">
              Hoja de ruta
            </span>
            <h2 className="font-sans text-2xl font-bold tracking-tight text-[#faf9f5] uppercase mt-1">
              Próximos Pasos
            </h2>
          </div>

          <div className="relative pl-1">
            <div className="absolute left-4 top-4 bottom-4 w-px bg-[rgba(232,230,220,0.08)]" />
            <div className="space-y-5">
              {[
                {
                  title: "Recorrida técnica",
                  body: "Evaluar instalación eléctrica y acústica del local para validar los requerimientos de infraestructura.",
                },
                {
                  title: "Definición de roles",
                  body: "Acordar qué ítems asume 1310 como inversión en infraestructura y cuáles corren por cuenta de Zapateo.",
                },
                {
                  title: "Alianza & calendario",
                  body: "Establecer condiciones de la alianza, fechas tentativas y modelo de operación compartida.",
                },
              ].map((step, i) => (
                <div key={i} className="flex items-start gap-5 relative">
                  <div
                    className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-sans font-bold text-xs z-10"
                    style={
                      i === 0
                        ? { background: "#d97757", color: "#faf9f5" }
                        : {
                            background: "#1d1d1b",
                            color: "#b0aea5",
                            border: "1px solid rgba(232,230,220,0.15)",
                          }
                    }
                  >
                    {i + 1}
                  </div>
                  <div className="pt-1 pb-1">
                    <p className="font-sans text-sm font-semibold text-[#faf9f5] mb-0.5">
                      {step.title}
                    </p>
                    <p className="font-serif italic text-sm text-[#b0aea5] leading-relaxed">
                      {step.body}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[rgba(232,230,220,0.1)] pt-8 pb-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <p className="font-sans text-xs font-semibold tracking-[0.25em] uppercase text-[#faf9f5]">
                Club Zapateo
              </p>
              <p className="font-serif italic text-[#b0aea5]/50 text-xs mt-0.5">
                Del beat y la amistad, nació Zapateo.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-px w-10 bg-[#d97757]" />
              <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-[#b0aea5]/50">
                Documento confidencial
              </span>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
