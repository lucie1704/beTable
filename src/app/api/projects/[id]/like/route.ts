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
    
    const likes = record.fields.Likes || 0;
    
    return NextResponse.json({ likes });
  } catch (error) {
    console.error('Erreur lors de la récupération des likes:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la récupération des likes.' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;
    
    const record = await base(tableName).find(projectId);
    const currentLikes = Number(record.fields.Likes) || 0;
    const newLikes = currentLikes + 1;
    
    await base(tableName).update([
      {
        id: projectId,
        fields: {
          Likes: newLikes,
        },
      },
    ]);
    
    return NextResponse.json({ 
      message: 'Like ajouté avec succès', 
      likes: newLikes 
    });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du like:', error);
    return NextResponse.json(
      { message: 'Erreur lors de l\'ajout du like.' },
      { status: 500 }
    );
  }
}