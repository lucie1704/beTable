import React from 'react';
import { useState } from 'react';

interface LikeButtonProps {
  projectId: string;
  initialLikes: number;
  className?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ 
  projectId, 
  initialLikes = 0,
  className = '',
}) => {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [isLiking, setIsLiking] = useState<boolean>(false);
  const [hasLiked, setHasLiked] = useState<boolean>(
    typeof window !== 'undefined' && localStorage.getItem(`liked_project_${projectId}`) === 'true'
  );

  // Fonction pour ajouter un like
  const addLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isLiking || hasLiked) return;
    
    try {
      setIsLiking(true);
      
      const response = await fetch(`/api/projects/${projectId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Erreur lors de l\'ajout du like');
      }
      
      const data = await response.json();
      setLikes(data.likes);
      setHasLiked(true);
      
      // Stocker l'état du like dans le localStorage
      localStorage.setItem(`liked_project_${projectId}`, 'true');
    } catch (err) {
      console.error('Erreur lors de l\'ajout du like:', err);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <button 
      onClick={addLike}
      disabled={isLiking || hasLiked}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        padding: '8px 12px',
        borderRadius: '20px',
        border: 'none',
        backgroundColor: hasLiked ? '#ffebee' : '#f5f5f5',
        color: hasLiked ? '#e91e63' : '#666',
        cursor: hasLiked ? 'default' : 'pointer',
        fontSize: '14px',
        transition: 'all 0.2s ease'
      }}
      aria-label="Aimer ce projet"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill={hasLiked ? "currentColor" : "none"}
        stroke="currentColor" 
        strokeWidth="2"
        strokeLinecap="round" 
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
      </svg>
      <span>{likes}</span>
    </button>
  );
};

export default LikeButton;