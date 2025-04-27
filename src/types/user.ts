export type User = {
    id: string;
    prenom_nom: string;
    "Prénom": string;
    Nom: string;
    "Rôle": string;
    Commentaires: string[];
    "Mot de passe": string;
    Email: string;
  };
  
export type UserRecord = {
id: string;
fields: User; 
};