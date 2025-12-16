import { StudentRecord } from '../types';

export const normalizeString = (str: string): string => {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

// Replaces fetchStudentData with a secure search function
export const searchStudent = async (name: string, icNumber: string): Promise<StudentRecord | null> => {
  try {
    const params = new URLSearchParams({
      name: name,
      ic: icNumber
    });

    // Call our serverless function
    const response = await fetch(`/api/search?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();

    if (result.found && result.data) {
      return result.data as StudentRecord;
    }

    return null;
  } catch (error) {
    console.error("Search error:", error);
    throw error;
  }
};