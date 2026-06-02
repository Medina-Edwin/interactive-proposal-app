export type CellValue = number | null | "variable" | "propio" | "inhouse";

export interface ProposalRow {
  id: string;
  item: string;
  descripcion: string;
  mlUrl?: string;
  mlData?: { title: string; price: number; url: string } | null;
  // columns differ per section but we store all possible fields
  alquilerEvento?: CellValue;
  compra?: CellValue;
  costoEvento?: CellValue;
}

export interface ProposalSection {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  accent: string;
  description: string;
  columns: ("alquilerEvento" | "compra" | "costoEvento")[];
  columnLabels: Partial<Record<"alquilerEvento" | "compra" | "costoEvento", string>>;
  rows: ProposalRow[];
  note?: string;
  highlightNote?: string;
}

export interface ProposalState {
  sections: ProposalSection[];
}
