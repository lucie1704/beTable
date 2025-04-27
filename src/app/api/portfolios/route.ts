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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, technologies, link, image } = body;

    const createdRecord = await base(tableName).create([
      {
        fields: {
          Nom: name,
          Description: description,
          Technologies: technologies,
          Lien: link,
          Photo: image ? [ image ] : [],
        },
      },
    ]);

    const portfolio = {
      id: createdRecord[0].id,
      ...createdRecord[0].fields,
    };

    return NextResponse.json(
      { message: 'Portfolio ajouté avec succès', portfolio },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur Airtable POST:', error);
    return NextResponse.json({ message: 'Erreur lors de l\'ajout du portfolio.' }, { status: 500 });
  }
}