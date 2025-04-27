import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { table } from 'console';

const apiKey = process.env.AIRTABLE_API_KEY!;
const baseId = process.env.AIRTABLE_BASE_ID!;
const tableName = process.env.AIRTABLE_TABLE_NAME_ETUDIANT!;

const base = new Airtable({ apiKey }).base(baseId);

export async function GET() {
  try {
    const records = await base(tableName)
      .select({
        view: 'Grid view',
      })
      .firstPage();

    const students = records.map(record => ({
      id: record.id,
      prenom: record.fields.Prénom,
      nom: record.fields.Nom,
      promotion: record.fields.Promotion,
    }));

    return NextResponse.json(students);
  } catch (error) {
    console.error('Erreur lors de la récupération des étudiants:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des étudiants.' },
      { status: 500 }
    );
  }
}