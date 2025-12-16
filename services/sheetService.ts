import Papa from 'papaparse';
import { StudentRecord } from '../types';
import { CSV_URL } from '../constants';

// Keywords to identify columns dynamically (case-insensitive)
const KEYWORDS = {
  NAME: ['NAMA', 'NAME', 'PARTICIPANT', 'PELAJAR'],
  IC: ['NO KAD', 'IC', 'MYKID', 'NO. KAD', 'IDENTITY', 'KP'],
  LINK: ['SIJIL', 'CERT', 'LINK', 'URL', 'MERGED', 'PAUTAN']
};

export const fetchStudentData = async (): Promise<StudentRecord[]> => {
  try {
    const response = await fetch(CSV_URL);
    if (!response.ok) {
      throw new Error(`Gagal menghubungi pangkalan data: ${response.statusText}`);
    }
    const csvText = await response.text();

    // Check if the response is actually HTML
    if (csvText.trim().startsWith('<!DOCTYPE html') || csvText.includes('<html')) {
      throw new Error('Google Sheet cannot be accessed. Please ensure "File > Share > Publish to web" is enabled for the sheet.');
    }

    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: false,
        skipEmptyLines: true,
        complete: (results) => {
          const rawData = results.data as string[][];
          
          if (rawData.length === 0) {
            resolve([]);
            return;
          }

          // Smart Header Detection
          let nameIndex = -1;
          let icIndex = -1;
          let headerRowIndex = -1;

          for (let i = 0; i < Math.min(rawData.length, 10); i++) {
            const row = rawData[i].map(cell => cell.toUpperCase());
            
            const nIndex = row.findIndex(cell => KEYWORDS.NAME.some(k => cell.includes(k)));
            const iIndex = row.findIndex(cell => KEYWORDS.IC.some(k => cell.includes(k)));

            if (nIndex !== -1 && iIndex !== -1) {
              nameIndex = nIndex;
              icIndex = iIndex;
              headerRowIndex = i;
              console.log(`Headers found at row ${i + 1}: Name[${nameIndex}], IC[${icIndex}]`);
              break;
            }
          }

          if (nameIndex === -1) {
             console.warn("Could not detect headers automatically. Using default indices.");
             nameIndex = 1; // B
             icIndex = 2;   // C
             headerRowIndex = 0;
          }

          const students: StudentRecord[] = rawData
            .slice(headerRowIndex + 1)
            .map(row => {
              // Robust Link Extraction strategy:
              // 1. Check Column G (Index 6) - User specified
              // 2. Check Column F (Index 5) - User specified
              // 3. Scan entire row for a cell starting with http/https
              
              const colG = row[6]?.trim();
              const colF = row[5]?.trim();
              
              let link = '';
              if (colG && (colG.startsWith('http') || colG.startsWith('www'))) {
                link = colG;
              } else if (colF && (colF.startsWith('http') || colF.startsWith('www'))) {
                link = colF;
              } else {
                // Fallback: search row for URL
                const foundUrl = row.find(cell => cell && (cell.trim().startsWith('http') || cell.trim().startsWith('www')));
                if (foundUrl) link = foundUrl.trim();
              }

              return {
                name: row[nameIndex]?.trim() || '',
                icNumber: row[icIndex]?.toString().trim() || '',
                certLink: link
              };
            })
            .filter(student => student.name && student.icNumber);

          resolve(students);
        },
        error: (error: Error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};

export const normalizeString = (str: string): string => {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};
