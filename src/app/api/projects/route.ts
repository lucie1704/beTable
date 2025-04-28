import { NextResponse } from 'next/server';
import Airtable from 'airtable';

const apiKey = process.env.AIRTABLE_API_KEY!;
const baseId = process.env.AIRTABLE_BASE_ID!;
const tableName = process.env.AIRTABLE_TABLE_NAME_PROJECT!;
import { getServerSession } from 'next-auth';

const base = new Airtable({ apiKey }).base(baseId);

export async function GET(req: Request) {
  const url = new URL(req.url);
  const search = url.searchParams.get('search');
  const showAll = url.searchParams.get('showAll') === 'true';
  
  // Vérifier si l'utilisateur est connecté 
  const session = await getServerSession();
  const isAdmin = !!session;
  
  try {
    let filterFormula = '';
    
    if (search) {
      filterFormula = `AND(OR(SEARCH("${search}", LOWER({Nom})), SEARCH("${search}", LOWER({Description}))), {isVisible} = 1)`;
    } else {
      filterFormula = '{isVisible} = 1';
    }
    
    if (isAdmin && showAll) {
      if (search) {
        filterFormula = `OR(SEARCH("${search}", LOWER({Nom})), SEARCH("${search}", LOWER({Description})))`;
      } else {
        filterFormula = '';
      }
    }
    
    const records = await base(tableName)
      .select({
        view: 'Grid view',
        filterByFormula: filterFormula,
      })
      .firstPage();
    
    const projects = records.map(record => ({
      id: record.id,
      ...record.fields,
    }));
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Erreur Airtable:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des projets.' },
      { status: 500 }
    );
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

    const project = {
      id: createdRecord[0].id,
      ...createdRecord[0].fields,
    };

    return NextResponse.json(
      { message: 'Projet ajouté avec succès', project },
      { status: 201 }
    );
  } catch (error) {
    console.error('Erreur Airtable POST:', error);
    return NextResponse.json({ message: 'Erreur lors de l\'ajout du projet.' }, { status: 500 });
  }
}