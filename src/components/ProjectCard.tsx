import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Project } from '../types/project';
import LikeButton from './LikeButton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const { id, Nom, Description, Technologies, Photo, Likes = 0 } = project;
  
  return (
    <Card>
      <CardHeader>
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
        <CardTitle>{Nom}</CardTitle>
        <CardDescription>{Description}</CardDescription>
      </CardHeader>
      <CardContent>
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
      </CardContent>
      <CardFooter>
        <LikeButton projectId={id} initialLikes={Likes} />
          <Link 
            href={`/projects/${id}`}
            className="text-blue-600 hover:text-blue-800"
          >
            Voir détails
          </Link>
      </CardFooter>
    </Card>
  );
};

export default ProjectCard;