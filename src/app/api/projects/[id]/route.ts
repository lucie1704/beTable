import { NextResponse } from 'next/server';
import Airtable from 'airtable';

const apiKey = process.env.AIRTABLE_API_KEY!;
const baseId = process.env.AIRTABLE_BASE_ID!;
const tableName = process.env.AIRTABLE_TABLE_NAME_PROJECT!;
const base = new Airtable({ apiKey }).base(baseId);

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    
    const record = await base(tableName).find(projectId);
    
    if (!record) {
      return NextResponse.json(
        { message: 'Projet non trouvé' },
        { status: 404 }
      );
    }
    
    const project = {
      id: record.id,
      ...record.fields,
    };
    
    return NextResponse.json(project);
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération du projet.' },
      { status: 500 }
    );
  }
}