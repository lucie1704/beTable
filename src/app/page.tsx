'use client';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '@/types/project';
import LikeButton from '@/components/LikeButton';
import CustomNavbar from '@/components/NavBar';

export default function Home() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState<string>();

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
    <>
    <CustomNavbar />
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
              <Link href={`/projects/${project.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
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
                  {project.Lien && (
                    <a 
                      href={project.Lien} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      style={{ 
                        display: 'inline-block', 
                        marginBottom: '10px',
                        color: '#0066cc',
                        textDecoration: 'underline'
                      }}
                    >
                      Voir le projet en ligne
                    </a>
                  )}
                </div>
              </Link>
              <div style={{ padding: '0 15px 15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <LikeButton projectId={project.id} initialLikes={project.Likes || 0} />
                <Link 
                  href={`/projects/${project.id}`}
                  style={{
                    display: 'inline-block',
                    padding: '8px 12px',
                    backgroundColor: '#0066cc',
                    color: 'white',
                    borderRadius: '5px',
                    textDecoration: 'none',
                    fontSize: '14px'
                  }}
                >
                  Voir détails
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </main>
    </>
  );
}