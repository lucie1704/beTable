'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Project } from '@/types/project';
import VisibilityToggle from '@/components/VisibilityToggle';

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('/api/projects', { params: { showAll: true } });
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setTechnologies('');
    setLink('');
    setImage('');
    setSelectedProject(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const projectData = {
      name,
      description,
      technologies: technologies.split(',').map(tech => tech.trim()),
      link,
      image,
    };

    try {
      if (selectedProject) {
        await axios.put(`/api/projects/${selectedProject.id}`, projectData);
      } else {
        await axios.post('/api/projects', projectData);
      }
      fetchProjects();
      resetForm();
      setIsOpen(false);
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setName(project.Nom);
    setDescription(project.Description);
    setTechnologies(project.Technologies ? project.Technologies.join(', ') : '');
    setLink(project.Lien || '');
    setImage(project.Photo && project.Photo.length > 0 ? project.Photo[0].url : '');
    setIsOpen(true);
  };

  const openAddProjectDialog = () => {
    resetForm();
    setIsOpen(true);
  };

  const handleVisibilityToggle = (projectId: string, isVisible: boolean) => {
    setProjects(projects.map(project => 
      project.id === projectId 
        ? { ...project, isVisible: isVisible } 
        : project
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin - Gestion du Portfolio</h1>
        <Dialog open={isOpen} onOpenChange={(open) => {
          if (!open) resetForm();
          setIsOpen(open);
        }}>
          <DialogTrigger asChild>
            <Button onClick={openAddProjectDialog}>Ajouter un projet</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{selectedProject ? 'Modifier un projet' : 'Ajouter un projet'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">Nom du projet</label>
                <Input
                  id="name"
                  placeholder="Nom du projet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium">Description</label>
                <Textarea
                  id="description"
                  placeholder="Description détaillée du projet"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  rows={4}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="technologies" className="text-sm font-medium">Technologies</label>
                <Input
                  id="technologies"
                  placeholder="Technologies (séparées par des virgules)"
                  value={technologies}
                  onChange={(e) => setTechnologies(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="link" className="text-sm font-medium">Lien du projet</label>
                <Input
                  id="link"
                  placeholder="https://..."
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="image" className="text-sm font-medium">URL de l&apos;image</label>
                <Input
                  id="image"
                  placeholder="URL de l'image"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>
              
              <div className="flex justify-end gap-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  disabled={isLoading}
                >
                  Annuler
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Traitement...' : selectedProject ? 'Mettre à jour' : 'Ajouter'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading && !projects.length ? (
        <div className="text-center py-8">
          <p>Chargement des projets...</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Technologies</TableHead>
                <TableHead>Lien</TableHead>
                <TableHead>Visibilité</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Aucun projet trouvé
                  </TableCell>
                </TableRow>
              ) : (
                projects.map((project) => (
                  <TableRow key={project.id} className={!project.isVisible ? 'opacity-60' : ''}>
                    <TableCell className="font-medium">{project.Nom}</TableCell>
                    <TableCell>
                      {project.Description && project.Description.length > 50
                        ? `${project.Description.slice(0, 50)}...`
                        : project.Description || 'Aucune description'}
                    </TableCell> 
                    <TableCell>
                      {project.Technologies && project.Technologies.length > 0
                        ? project.Technologies.join(', ')
                        : 'Aucune technologie'}
                    </TableCell>
                    <TableCell>
                      {project.Lien ? (
                        <Link 
                          href={project.Lien}
                          target="_blank" 
                          rel="noopener noreferrer" 
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          Voir
                        </Link>
                      ) : (
                        <span className="text-gray-500">Aucun lien</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <VisibilityToggle 
                        projectId={project.id}
                        initialVisibility={project.isVisible === true}
                        onToggle={(isVisible) => handleVisibilityToggle(project.id, isVisible)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                          Éditer
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}