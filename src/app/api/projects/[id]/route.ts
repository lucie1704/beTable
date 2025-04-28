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



export async function PUT(req: Request) {
  try {
    const url = new URL(req.url);
    const pathSegments = url.pathname.split('/');
    const projectId = pathSegments[pathSegments.length - 1];
    
    if (!projectId) {
      return NextResponse.json({ message: 'ID du projet non spécifié' }, { status: 400 });
    }
    
    const body = await req.json();
    const { name, description, technologies, link, image } = body;

    const fields: any = {};
    if (name !== undefined) fields.Nom = name;
    if (description !== undefined) fields.Description = description;
    if (technologies !== undefined) fields.Technologies = technologies;
    if (link !== undefined) fields.Lien = link;
    if (image !== undefined) {
      if (typeof image === 'string') {
        fields.Photo = [{ url: image }];
      } 
      else if (Array.isArray(image)) {
        fields.Photo = image;
      } else if (image) {
        fields.Photo = [image];
      }
    }

    const updatedRecord = await base(tableName).update([
      {
        id: projectId,
        fields: fields,
      },
    ]);

    if (!updatedRecord || updatedRecord.length === 0) {
      return NextResponse.json({ message: 'Projet non trouvé' }, { status: 404 });
    }

    const project = {
      id: updatedRecord[0].id,
      ...updatedRecord[0].fields,
    };

    return NextResponse.json(
      { message: 'Projet mis à jour avec succès', project },
      { status: 200 }
    );
  } catch (error) {
    console.error('Erreur Airtable PUT:', error);
    return NextResponse.json({ message: 'Erreur lors de la mise à jour du projet.' }, { status: 500 });
  }
}