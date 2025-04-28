'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Project } from '@/types/project';

export default function AdminDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await axios.get('/api/projects');
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
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
    }
  };

  const handleEdit = (project: Project) => {
    setSelectedProject(project);
    setName(project.Nom);
    setDescription(project.Description);
    setTechnologies(project.Technologies.join(', '));
    setLink(project.Lien);
    setImage(project.Photo[0].url);
    setIsOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      try {
        await axios.delete(`/api/projects/${id}`);
        fetchProjects();
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Admin - Portfolio Management</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>Ajouter un projet</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedProject ? 'Modifier un projet' : 'Ajouter un projet'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                placeholder="Nom du projet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              <Input
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              <Input
                placeholder="Technologies (séparées par des virgules)"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
              />
              <Input
                placeholder="Lien du projet"
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
              <Input
                placeholder="URL de l'image"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
              <Button type="submit" className="w-full">
                {selectedProject ? 'Mettre à jour' : 'Ajouter'}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nom</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Technologies</TableHead>
            <TableHead>Lien</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project) => (
            <TableRow key={project.id}>
              <TableCell>{project.Nom}</TableCell>
              <TableCell>
                {project.Description.length > 50
                  ? `${project.Description.slice(0, 50)}...`
                  : project.Description}
              </TableCell> 
              <TableCell>
                {project.Technologies && project.Technologies.length > 0
                  ? project.Technologies.join(', ')
                  : 'Aucune technologie'}
              </TableCell>
              <TableCell>
                <a href={project.Lien} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Voir
                </a>
              </TableCell>
              <TableCell className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => handleEdit(project)}>
                  Éditer
                </Button>
                <Button variant="destructive" size="sm" onClick={() => handleDelete(project.id)}>
                  Supprimer
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
