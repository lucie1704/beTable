'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import axios from 'axios';
import type { Project } from '@/types/project';
import LikeButton from '@/components/LikeButton';
import { useStudents } from '@/hooks/useStudents';

export default function ProjectPage({ params }: { params: { id: string } }) {
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { students, loading: studentsLoading, getStudentName } = useStudents();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/projects/${params.id}`);
        setProject(response.data);
      } catch (err) {
        setError('Erreur lors de la récupération du projet');
        console.error('Erreur:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [params.id]);

  if (loading || studentsLoading) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <p>Chargement...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
        <div style={{ color: 'red', marginBottom: '15px' }}>
          {error || 'Impossible de charger le projet'}
        </div>
        <Link href="/" style={{ color: '#0066cc' }}>
          Retour à la liste des projets
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <Link href="/" style={{ display: 'inline-block', marginBottom: '20px', color: '#0066cc' }}>
        &larr; Retour à la liste des projets
      </Link>

      <div style={{ backgroundColor: 'white', borderRadius: '10px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        {project.Photo && project.Photo.length > 0 && (
          <div style={{ position: 'relative', height: '400px', width: '100%' }}>
            <Image 
              src={project.Photo[0].url} 
              alt={project.Nom} 
              fill
              style={{ objectFit: 'cover' }}
            />
          </div>
        )}
        
        <div style={{ padding: '30px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h1 style={{ fontSize: '2rem', margin: 0 }}>{project.Nom}</h1>
            <LikeButton 
              projectId={project.id} 
              initialLikes={project.Likes || 0} 
            />
          </div>
          
          <h2 style={{ fontSize: '1.5rem', marginTop: '30px', marginBottom: '10px' }}>Description</h2>
          <p style={{ fontSize: '1rem', lineHeight: '1.6' }}>{project.Description}</p>
          
          {project.Technologies && project.Technologies.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Technologies</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {project.Technologies.map((tech, index) => (
                  <span 
                    key={index}
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#f0f0f0', 
                      borderRadius: '20px',
                      fontSize: '0.9rem'
                    }}
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {project.Étudiants && project.Étudiants.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Étudiants</h2>
              <ul style={{ paddingLeft: '20px' }}>
                {project.Étudiants.map((studentId, index) => (
                  <li key={index} style={{ marginBottom: '5px' }}>{getStudentName(studentId)}</li>
                ))}
              </ul>
            </div>
          )}
          
          {project.Catégories && project.Catégories.length > 0 && (
            <div style={{ marginTop: '30px' }}>
              <h2 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>Catégories</h2>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {project.Catégories.map((category, index) => (
                  <span 
                    key={index}
                    style={{ 
                      padding: '5px 10px', 
                      backgroundColor: '#e3f2fd', 
                      color: '#0066cc',
                      borderRadius: '20px',
                      fontSize: '0.9rem'
                    }}
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          {project.Lien && (
            <div style={{ marginTop: '30px' }}>
              <a 
                href={project.Lien} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ 
                  display: 'inline-block',
                  padding: '10px 20px',
                  backgroundColor: '#0066cc',
                  color: 'white',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Voir le projet en ligne
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}