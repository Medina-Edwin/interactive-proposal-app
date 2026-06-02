import { ProposalState } from "./proposal-types";

export const initialProposalState: ProposalState = {
  sections: [
    {
      id: "infraestructura",
      number: "01",
      title: "INFRAESTRUCTURA",
      subtitle: "Inversión del local",
      accent: "#d97757",
      description:
        "Estos ítems representan mejoras permanentes para 1310. Su adquisición potencia la capacidad del local más allá de los eventos de Zapateo.",
      columns: ["alquilerEvento", "compra"],
      columnLabels: {
        alquilerEvento: "Alquiler / evento",
        compra: "Compra",
      },
      rows: [
        {
          id: "infra-1",
          item: "Sistema de sonido",
          descripcion:
            "Refuerzo adicional al sistema existente — subwoofers + tops + amplificación",
          alquilerEvento: null,
          compra: null,
        },
        {
          id: "infra-2",
          item: "Iluminación",
          descripcion: "Moving heads, strobes o LED bars acordes a electrónica",
          alquilerEvento: null,
          compra: null,
        },
        {
          id: "infra-3",
          item: "Instalación eléctrica",
          descripcion:
            "Adecuación del tablero y circuitos para carga de evento (única vez)",
          alquilerEvento: null,
          compra: null,
        },
      ],
    },
    {
      id: "equipamiento",
      number: "02",
      title: "EQUIPAMIENTO TÉCNICO",
      subtitle: "Aporte de Zapateo",
      accent: "#6a9bcc",
      description:
        "Equipamiento técnico de DJ que Zapateo contrata por evento a través de proveedor fijo.",
      columns: ["costoEvento", "compra"],
      columnLabels: {
        costoEvento: "Costo / evento",
        compra: "Compra",
      },
      highlightNote:
        "★  Proveedor técnico: Proveedor fijo — nombre a confirmar. Garantiza disponibilidad y setup profesional.",
      rows: [
        {
          id: "equip-1",
          item: "Mixer / CDJs",
          descripcion:
            "Setup completo de DJ — mixer + 2/4 CDJs — proveedor fijo a confirmar",
          costoEvento: null,
          compra: null,
        },
        {
          id: "equip-2",
          item: "Máquina de humo / hazer",
          descripcion:
            "Haze continuo para realzar la iluminación — equipo propio",
          costoEvento: "propio",
          compra: null,
        },
      ],
    },
    {
      id: "produccion",
      number: "03",
      title: "PRODUCCIÓN ARTÍSTICA",
      subtitle: "Servicios creativos y de comunicación",
      accent: "#788c5d",
      description:
        "Servicios creativos y de comunicación a cargo de Zapateo. No son infraestructura — son parte de la identidad y la narrativa del evento.",
      columns: ["costoEvento"],
      columnLabels: {
        costoEvento: "Costo / evento",
      },
      note: "La seguridad corre por cuenta del local, lo que simplifica la operación y garantiza el conocimiento del espacio.",
      rows: [
        {
          id: "prod-1",
          item: "Fotografía & video",
          descripcion:
            "Cobertura completa del evento — fotos + reels + contenido para redes",
          costoEvento: null,
        },
        {
          id: "prod-2",
          item: "Decoración / ambientación",
          descripcion:
            "Elementos visuales que refuerzan la identidad del evento",
          costoEvento: "variable",
        },
        {
          id: "prod-3",
          item: "Diseño gráfico",
          descripcion:
            "Flyers, artes digitales, identidad visual del evento — in-house",
          costoEvento: "inhouse",
        },
      ],
    },
  ],
};
