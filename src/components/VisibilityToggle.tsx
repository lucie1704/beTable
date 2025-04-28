'use client';
import { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface VisibilityToggleProps {
  projectId: string;
  initialVisibility: boolean;
  onToggle?: (isVisible: boolean) => void;
}

const VisibilityToggle: React.FC<VisibilityToggleProps> = ({ 
  projectId, 
  initialVisibility = true,
  onToggle 
}) => {
  const [isVisible, setIsVisible] = useState<boolean>(initialVisibility);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toggleVisibility = async () => {
    try {
      setIsLoading(true);
      
      const response = await axios.patch(`/api/projects/${projectId}/visibility`, {
        isVisible: !isVisible
      });
      
      if (response.status === 200) {
        setIsVisible(!isVisible);
        if (onToggle) {
          onToggle(!isVisible);
        }
      }
    } catch (error) {
      console.error('Erreur lors du changement de visibilité:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleVisibility}
      disabled={isLoading}
      title={isVisible ? "Cacher ce projet" : "Afficher ce projet"}
      className="h-9 w-9 rounded-full"
    >
      {isVisible ? (
        <Eye className="h-4 w-4" />
      ) : (
        <EyeOff className="h-4 w-4" />
      )}
    </Button>
  );
};

export default VisibilityToggle;