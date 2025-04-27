import { useState, useEffect } from 'react';
import axios from 'axios';

type Student = {
  id: string;
  prenom: string;
  nom: string;
  promotion: string;
};

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/students');
        setStudents(response.data);
      } catch (err) {
        console.error('Erreur de récupération des étudiants:', err);
        setError('Erreur lors de la récupération des étudiants');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const getStudentName = (studentId: string): string => {
    const student = students.find(s => s.id === studentId);
    if (student) {
      return `${student.prenom} ${student.nom}`;
    }
    return studentId;
  };

  return {
    students,
    loading,
    error,
    getStudentName
  };
}