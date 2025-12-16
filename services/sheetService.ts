import Papa from 'papaparse';
import { StudentRecord } from '../types';
import { SPREADSHEET_ID, SHEET_NAME } from '../constants';

const KEYWORDS = {
  NAME: ['NAMA', 'NAME', 'PARTICIPANT', 'PELAJAR', 'PEMENANG', 'MURID', 'CALON'],
  IC: ['NO KAD', 'IC', 'MYKID', 'NO. KAD', 'IDENTITY', 'KP', 'NO K/P', 'NO. K/P', 'IC NO'],
  LINK: ['SIJIL', 'CERT', 'LINK', 'URL', 'MERGED', 'PAUTAN', 'SIJIL PENYERTAAN', 'DOWNLOAD']
};

export const normalizeString = (str: string): string => {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

export const searchStudent = async (name: string, icNumber: string): Promise<StudentRecord | null> => {
  try {
    const baseUrl = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq`;
    const cacheBuster = `_t=${Date.now()}`;
    
    // Strategy 1: Try fetching the specific sheet name "COMPILE"
    let csvUrl = `${baseUrl}?tqx=out:csv&sheet=${SHEET_NAME}&${cacheBuster}`;
    
    let response = await fetch(csvUrl);

    // Strategy 2: Fallback to first sheet (gid=0) if "COMPILE" is not found (400/404)
    if (!response.ok && (response.status === 400 || response.status === 404)) {
        console.warn(`Sheet '${SHEET_NAME}' not found (Status: ${response.status}). Attempting fallback to first sheet (gid=0).`);
        csvUrl = `${baseUrl}?tqx=out:csv&gid=0&${cacheBuster}`;
        response = await fetch(csvUrl);
    }
    
    if (!response.ok) {
      throw new Error(`Failed to fetch sheet. Status: ${response.status} ${response.statusText}. Please check the Spreadsheet ID and Permissions.`);
    }

    const csvText = await response.text();

    // Check if the response is actually HTML (Google Sheets auth/error page usually)
    if (csvText.trim().startsWith('<!DOCTYPE html') || csvText.includes('<html')) {
        throw new Error('Sheet is likely private or not published. Please set "General Access" to "Anyone with the link".');
    }

    // Parse CSV
    const parseResult = Papa.parse(csvText, {
        header: false,
        skipEmptyLines: true
    });
    
    const rawData = parseResult.data as string[][];
    if (!rawData || rawData.length === 0) {
        return null;
    }

    // Detect Headers
    let nameIndex = -1;
    let icIndex = -1;
    let headerRowIndex = -1;

    // Scan first 20 rows for headers to be safe against blank top rows
    for (let i = 0; i < Math.min(rawData.length, 20); i++) {
        const row = rawData[i].map((cell: string) => (cell || '').toUpperCase());
        const nIndex = row.findIndex(cell => KEYWORDS.NAME.some(k => cell.includes(k)));
        const iIndex = row.findIndex(cell => KEYWORDS.IC.some(k => cell.includes(k)));

        if (nIndex !== -1 && iIndex !== -1) {
            nameIndex = nIndex;
            icIndex = iIndex;
            headerRowIndex = i;
            break;
        }
    }

    // Fallback if headers not found (Use typical defaults: B=1, C=2)
    if (nameIndex === -1) {
        console.warn("Headers not detected automatically. Using default columns (B and C).");
        nameIndex = 1; 
        icIndex = 2;   
        headerRowIndex = 0;
    }

    // Search for the specific student
    const normalizedInputName = normalizeString(name);
    const normalizedInputIC = normalizeString(icNumber);

    // Skip header rows
    const dataRows = rawData.slice(headerRowIndex + 1);

    const match = dataRows.find(row => {
        const rowName = row[nameIndex]?.trim() || '';
        const rowIc = row[icIndex]?.toString().trim() || '';
        
        return normalizeString(rowName) === normalizedInputName && 
               normalizeString(rowIc) === normalizedInputIC;
    });

    if (match) {
        // Extract link logic
        let link = '';

        // 1. Try to find a header for "LINK" / "SIJIL"
        if (headerRowIndex !== -1) {
             const headerRow = rawData[headerRowIndex].map(c => (c||'').toUpperCase());
             const linkIndex = headerRow.findIndex(cell => KEYWORDS.LINK.some(k => cell.includes(k)));
             if (linkIndex !== -1 && match[linkIndex]) {
                 const val = match[linkIndex].trim();
                 if (val.startsWith('http') || val.startsWith('www')) {
                     link = val;
                 }
             }
        }

        // 2. If no link found via header, try specific known columns (G=6, F=5)
        if (!link) {
            const colG = match[6]?.trim();
            const colF = match[5]?.trim();
            if (colG && (colG.startsWith('http') || colG.startsWith('www'))) link = colG;
            else if (colF && (colF.startsWith('http') || colF.startsWith('www'))) link = colF;
        }

        // 3. Last resort: scan the entire row for ANY url
        if (!link) {
            const foundUrl = match.find(cell => cell && (cell.trim().startsWith('http') || cell.trim().startsWith('www')));
            if (foundUrl) link = foundUrl.trim();
        }

        return {
            name: match[nameIndex]?.trim(),
            icNumber: match[icIndex]?.toString().trim(),
            certLink: link
        };
    }

    return null;

  } catch (error) {
    console.error("Search error details:", error);
    throw error;
  }
};