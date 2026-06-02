"use client";

import { useState, useCallback } from "react";
import { ProposalState, ProposalRow } from "@/lib/proposal-types";
import { initialProposalState } from "@/lib/proposal-initial-data";
import { ProposalSectionBlock } from "@/components/proposal-section";
import { ProposalSummary } from "@/components/proposal-summary";

let rowCounter = 100;

export default function Page() {
  const [state, setState] = useState<ProposalState>(initialProposalState);

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
      {/* Orange top bar */}
      <div className="h-1 w-full bg-[#d97757]" />

      {/* HERO */}
      <header className="max-w-5xl mx-auto px-6 pt-16 pb-12">
        <div className="mb-8">
          <p className="font-sans text-4xl font-light tracking-widest text-[#b0aea5] uppercase leading-none">
            Club
          </p>
          <p className="font-sans text-5xl font-bold tracking-tight text-[#faf9f5] uppercase leading-none">
            Zapateo
          </p>
          <p className="font-sans text-3xl font-medium tracking-wide text-[#d97757] uppercase leading-none mt-1">
            × Local 1310
          </p>
          <p className="font-serif italic text-[#b0aea5] mt-4 text-lg leading-relaxed">
            Del beat y la amistad, nació Zapateo.
          </p>
        </div>

        {/* Orange divider */}
        <div className="h-px w-full bg-[#d97757] mb-8" />

        <div className="mb-10">
          <p className="font-sans text-3xl font-bold tracking-tight text-[#faf9f5] uppercase leading-tight">
            Propuesta Técnica{" "}
            <span className="text-[#d97757]">& Productiva</span>
          </p>
        </div>

        {/* About card */}
        <div className="bg-[#1d1d1b] rounded-sm p-6 mb-6 border-l-[3px] border-[#d97757]">
          <p className="font-serif text-[#b0aea5] leading-relaxed text-sm">
            Club Zapateo es una productora de eventos de música electrónica.
            Organizamos experiencias inmersivas dentro del universo electrónico,
            adaptando el género al evento — House, Tech House, Techno, Drum &
            Bass — sin perder coherencia de marca ni calidad de producción.
          </p>
        </div>

        {/* Objetivo */}
        <div className="bg-[#1d1d1b] rounded-sm p-6 mb-8 border border-[rgba(232,230,220,0.12)]">
          <p className="font-sans text-xs font-light tracking-[0.3em] uppercase text-[#d97757] mb-2">
            Objetivo
          </p>
          <p className="font-serif text-[#b0aea5] leading-relaxed text-sm">
            Este documento detalla los requerimientos técnicos y de producción
            necesarios para realizar una fiesta de música electrónica en 1310.
            El propósito es transparentar los costos involucrados y abrir una
            conversación sobre qué puede asumir el local como inversión en su
            infraestructura, y qué corre por cuenta de la productora.
          </p>
        </div>

        {/* Genre tags */}
        <div className="flex flex-wrap gap-2">
          {["HOUSE", "TECH HOUSE", "TECHNO", "DRUM & BASS"].map((tag) => (
            <span
              key={tag}
              className="font-sans text-xs font-medium tracking-widest px-3 py-1.5 rounded-sm"
              style={{ background: "#d9775722", color: "#d97757", border: "1px solid #d9775744" }}
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

        {/* Summary */}
        <ProposalSummary state={state} />

        {/* Próximos pasos */}
        <section className="mb-16">
          <div className="h-[3px] w-full mb-6 bg-[#d97757]" />
          <div className="mb-6">
            <h2 className="font-sans text-2xl font-bold tracking-tight text-[#faf9f5] uppercase">
              Próximos Pasos
            </h2>
          </div>
          <div className="space-y-4">
            {[
              "Recorrida técnica del local para evaluar instalación eléctrica y acústica.",
              "Definir qué ítems asume 1310 como inversión y cuáles se alquilan.",
              "Acordar calendario de eventos y condiciones de la alianza.",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4">
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-sans font-bold text-sm text-[#faf9f5]"
                  style={{ background: "#d97757" }}
                >
                  {i + 1}
                </div>
                <p className="font-serif text-[#b0aea5] leading-relaxed pt-1.5 text-sm">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-[rgba(232,230,220,0.15)] pt-8 pb-4 text-center">
          <p className="font-sans text-xs font-light tracking-[0.3em] uppercase text-[#b0aea5]">
            Club Zapateo
          </p>
          <p className="font-serif italic text-[#b0aea5]/60 text-sm mt-1">
            Del beat y la amistad, nació Zapateo.
          </p>
          <div className="mt-4 h-px w-16 bg-[#d97757] mx-auto" />
        </footer>
      </div>
    </main>
  );
}
