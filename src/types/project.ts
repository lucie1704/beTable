export interface Project {
  id: string;
  Nom: string;
  Description: string;
  Technologies: string[];
  Lien: string;
  Photo: {
    id: string;
    url: string;
    filename: string;
    size: number;
    type: string;
    thumbnails: {
      small: {
        url: string;
        width: number;
        height: number;
      };
      large: {
        url: string;
        width: number;
        height: number;
      };
      full: {
        url: string;
        width: number;
        height: number;
      };
    };
  }[];
  Étudiants: string[];
  Catégories: string[];
  isVisible: boolean;
  Likes: number;
  Commentaire: string[];
};
