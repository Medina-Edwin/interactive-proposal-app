import { sql } from "@/lib/db";
import { NextResponse } from "next/server";
import { initialProposalState } from "@/lib/proposal-initial-data";

export async function GET() {
  await sql`
    CREATE TABLE IF NOT EXISTS proposal_state (
      id   INTEGER PRIMARY KEY DEFAULT 1,
      data JSONB NOT NULL
    )
  `;

  const rows = await sql`SELECT data FROM proposal_state WHERE id = 1`;

  if (rows.length === 0) {
    return NextResponse.json(initialProposalState);
  }

  return NextResponse.json(rows[0].data);
}

export async function POST(req: Request) {
  const body = await req.json();

  await sql`
    INSERT INTO proposal_state (id, data)
    VALUES (1, ${JSON.stringify(body)})
    ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data
  `;

  return NextResponse.json({ ok: true });
}
