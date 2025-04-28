import { NextResponse } from 'next/server';
import Airtable from 'airtable';
import { getServerSession } from 'next-auth';

const apiKey = process.env.AIRTABLE_API_KEY!;
const baseId = process.env.AIRTABLE_BASE_ID!;
const tableName = process.env.AIRTABLE_TABLE_NAME_PROJECT!;

const base = new Airtable({ apiKey }).base(baseId);

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession();
  if (!session) {
    return NextResponse.json({ message: 'Non autorisé' }, { status: 401 });
  }

  try {
    const projectId = params.id;
    const { isVisible } = await req.json();
    
    await base(tableName).update([
      {
        id: projectId,
        fields: {
          isVisible: isVisible,
        },
      },
    ]);
    
    return NextResponse.json({ 
      message: isVisible ? 'Projet visible' : 'Projet caché',
      isVisible 
    });
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la visibilité:', error);
    return NextResponse.json(
      { message: 'Erreur lors de la mise à jour de la visibilité.' },
      { status: 500 }
    );
  }
}