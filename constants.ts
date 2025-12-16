// Google Sheet Configuration
export const SPREADSHEET_ID = '1kc_rK64ISlAj9XQ6lm_IfEty_MxbO6RklYAVL5XMVxw';

// Using Google Visualization API to get CSV without API Key (Requires "Anyone with link" or "Published to Web")
// Defaults to the first sheet which is standard for this type of database
export const CSV_URL = `https://docs.google.com/spreadsheets/d/${SPREADSHEET_ID}/gviz/tq?tqx=out:csv`;

// Column Indices (0-based) based on the description:
// B (Name) -> Index 1
// C (IC) -> Index 2
// G (Link) -> Index 6
export const COL_INDEX_NAME = 1;
export const COL_INDEX_IC = 2;
export const COL_INDEX_LINK = 6;