'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const AdminPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [technologies, setTechnologies] = useState('');
  const [link, setLink] = useState('');
  const [image, setImage] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProject = {
      name,
      description,
      technologies: technologies.split(','),
      link,
      image,
    };

    try {
      const response = await axios.post('/api/portfolios', newProject, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 201) {
        setMessage('Project added successfully!');
        router.push('/admin');
      } else {
        setMessage('Failed to add the project.');
      }
    } catch (error) {
      setMessage('Error adding project.');
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Admin Page</h1>
      <h2>Add New Project</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Project Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="technologies">Technologies (comma-separated)</label>
          <input
            type="text"
            id="technologies"
            value={technologies}
            onChange={(e) => setTechnologies(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="link">Project Link</label>
          <input
            type="url"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="image">Image URL</label>
          <input
            type="url"
            id="image"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />
        </div>
        <button type="submit">Add Project</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default AdminPage;
