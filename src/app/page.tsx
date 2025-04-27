'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Project } from '@/types/project';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>();

  // Fonction pour mettre à jour le terme de recherche
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm !== undefined) {
      const fetchProjects = async () => {
        try {
          const params: Record<string, string> = {};
          if (debouncedSearchTerm) {
            params.search = debouncedSearchTerm;
          }

          const response = await axios.get('/api/projects', { params });
          setProjects(response.data);
        } catch (error) {
          console.error('Erreur de récupération', error);
        }
      };

      fetchProjects();
    }
  }, [debouncedSearchTerm]); 

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Portfolio étudiant JPO</h1>
      
      <input
        type="text"
        placeholder="Rechercher par titre, description ou technologie"
        value={searchTerm}
        onChange={handleSearchChange}
        style={{ padding: '10px', marginBottom: '20px', width: '100%', maxWidth: '500px', borderRadius: '5px', border: '1px solid #ccc' }}
      />
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {projects.length === 0 ? (
          <p style={{ gridColumn: 'span 1', textAlign: 'center', width: '100%' }}>Aucun résultat trouvé</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} style={{ border: '1px solid #ccc', borderRadius: '10px', overflow: 'hidden' }}>
              <Image
                src={project.Photo && project.Photo.length > 0 ? project.Photo[0].url : '/default-background.png'} 
                alt={project.Nom} 
                width={300} 
                height={200} 
                style={{ objectFit: 'cover', width: '100%' }} 
              />
              <div style={{ padding: '15px' }}>
                <h2>{project.Nom}</h2>
                <p>{project.Description}</p>
                <p><strong>Technologies:</strong>
                  {project.Technologies && project.Technologies.length > 0 
                    ? project.Technologies.join(', ') 
                    : 'No technologies listed'}
                </p>
                <a href={project.Lien} target="_blank" rel="noopener noreferrer">Voir le projet</a>
                <p><strong>J&apos;aime:</strong> {project["J'aime"]}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}