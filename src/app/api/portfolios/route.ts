import { NextResponse } from 'next/server';
import Airtable from 'airtable';

const apiKey = process.env.AIRTABLE_API_KEY!;
const baseId = process.env.AIRTABLE_BASE_ID!;
const tableName = process.env.AIRTABLE_TABLE_NAME!;

const base = new Airtable({ apiKey }).base(baseId);

export async function GET() {
  try {
    const records = await base(tableName)
    .select({ view: 'Grid view' })
    .firstPage();

    const portfolios = records.map(record => ({
      id: record.id,
      ...record.fields,
    }));

    return NextResponse.json(portfolios);
  } catch (error) {
    console.error('Erreur Airtable:', error);
    return NextResponse.error();
  }
}
