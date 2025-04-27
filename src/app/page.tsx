'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import Image from 'next/image';
import { Portfolio } from '@/types/portfolio';

export default function Home() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);

  useEffect(() => {
    axios.get('/api/portfolios')
      .then(res => {
        setPortfolios(res.data);
      })
      .catch(err => {
        console.error('Erreur de récupération', err);
      });
  }, []);

  return (
    <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <h1>Mes Projets</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
        {portfolios.map((portfolio) => (
          <div key={portfolio.id} style={{ border: '1px solid #ccc', borderRadius: '10px', overflow: 'hidden' }}>
            <Image
              src={portfolio.Photo && portfolio.Photo.length > 0 ? portfolio.Photo[0].url : '/default-background.png'} 
              alt={portfolio.Nom} 
              width={300} 
              height={200} 
              style={{ objectFit: 'cover', width: '100%' }} 
            />
            <div style={{ padding: '15px' }}>
              <h2>{portfolio.Nom}</h2>
              <p>{portfolio.Description}</p>
              <p><strong>Technologies:</strong>
              {portfolio.Technologies && portfolio.Technologies.length > 0 
                ? portfolio.Technologies.join(', ') 
                : 'No technologies listed'}
              </p>
              <a href={portfolio.Lien} target="_blank" rel="noopener noreferrer">Voir le projet</a>
              <p><strong>J&apos;aime:</strong> {portfolio["J'aime"]}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
