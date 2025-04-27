import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '../types/project';
import LikeButton from './LikeButton';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { id, Nom, Description, Technologies, Lien, Photo, Likes = 0 } = project;
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {Photo && Photo.length > 0 && (
        <div className="relative h-48 w-full">
          <Image 
            src={Photo[0].url} 
            alt={Nom} 
            fill 
            className="object-cover"
          />
        </div>
      )}
      
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{Nom}</h3>
        <p className="text-gray-600 mb-4 line-clamp-3">{Description}</p>
        
        {Technologies && Technologies.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {Technologies.map((tech, index) => (
              <span 
                key={index}
                className="px-2 py-1 bg-gray-100 text-xs rounded-full"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex justify-between items-center mt-4">
          <LikeButton projectId={id} initialLikes={Likes} />
          
          <Link 
            href={`/projects/${id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            Voir détails
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;