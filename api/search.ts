import Papa from 'papaparse';

// Constants duplicated here to ensure serverless function is self-contained
const SPREADSHEET_ID = '1kc_rK64ISlAj9XQ6lm_IfEty_MxbO6RklYAVL5XMVxw';
const SHEET_NAME = 'COMPILE';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;

const KEYWORDS = {
  NAME: ['NAMA', 'NAME', 'PARTICIPANT', 'PELAJAR'],
  IC: ['NO KAD', 'IC', 'MYKID', 'NO. KAD', 'IDENTITY', 'KP'],
  LINK: ['SIJIL', 'CERT', 'LINK', 'URL', 'MERGED', 'PAUTAN']
};

const normalizeString = (str: string): string => {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

export default async function handler(req: any, res: any) {
  // 1. Tell the browser/Vercel NOT to cache this API response
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');

  try {
    const { name, ic } = req.query;

    if (!name || !ic) {
      return res.status(400).json({ error: 'Missing parameters' });
    }

    // 2. Fetch CSV securely from Google
    // Add a timestamp parameter to the URL to bypass Google's internal caching
    const timestamp = Date.now();
    const uniqueUrl = `${CSV_URL}&_t=${timestamp}`;

    const response = await fetch(uniqueUrl, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch sheet: ${response.statusText}`);
    }
    const csvText = await response.text();

    if (csvText.trim().startsWith('<!DOCTYPE html') || csvText.includes('<html')) {
        return res.status(500).json({ error: 'Sheet not published to web or ID is invalid' });
    }

    // 3. Parse CSV
    const parseResult = Papa.parse(csvText, {
        header: false,
        skipEmptyLines: true
    });
    
    const rawData = parseResult.data as string[][];
    if (!rawData || rawData.length === 0) {
        return res.status(200).json({ found: false });
    }

    // 4. Detect Headers (Logic from previous client-side service)
    let nameIndex = -1;
    let icIndex = -1;
    let headerRowIndex = -1;

    for (let i = 0; i < Math.min(rawData.length, 10); i++) {
        const row = rawData[i].map((cell: string) => cell.toUpperCase());
        const nIndex = row.findIndex(cell => KEYWORDS.NAME.some(k => cell.includes(k)));
        const iIndex = row.findIndex(cell => KEYWORDS.IC.some(k => cell.includes(k)));

        if (nIndex !== -1 && iIndex !== -1) {
            nameIndex = nIndex;
            icIndex = iIndex;
            headerRowIndex = i;
            break;
        }
    }

    if (nameIndex === -1) {
        // Fallback defaults
        nameIndex = 1; 
        icIndex = 2;   
        headerRowIndex = 0;
    }

    // 5. Search for the specific student
    const normalizedInputName = normalizeString(name as string);
    const normalizedInputIC = normalizeString(ic as string);

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
        const colG = match[6]?.trim();
        const colF = match[5]?.trim();
        
        let link = '';
        if (colG && (colG.startsWith('http') || colG.startsWith('www'))) {
            link = colG;
        } else if (colF && (colF.startsWith('http') || colF.startsWith('www'))) {
            link = colF;
        } else {
            const foundUrl = match.find(cell => cell && (cell.trim().startsWith('http') || cell.trim().startsWith('www')));
            if (foundUrl) link = foundUrl.trim();
        }

        return res.status(200).json({
            found: true,
            data: {
                name: match[nameIndex]?.trim(),
                icNumber: match[icIndex]?.toString().trim(),
                certLink: link
            }
        });
    }

    return res.status(200).json({ found: false });

  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}