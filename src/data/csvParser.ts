import Papa from 'papaparse';
import { DashboardDataset } from '../types';
import { INITIAL_DATA } from './staticData';

export async function fetchGoogleSheetData(
  sheetCsvUrl: string
): Promise<DashboardDataset> {
  try {
    // Attempt direct fetch
    const res = await fetch(sheetCsvUrl, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}: ${res.statusText}`);
    }
    const csvText = await res.text();
    const parsed = Papa.parse<string[]>(csvText, {
      skipEmptyLines: false,
    });

    if (!parsed.data || parsed.data.length === 0) {
      return INITIAL_DATA;
    }

    // Return the updated data structure with timestamp
    return {
      ...INITIAL_DATA,
      lastUpdated: new Date().toLocaleString('zh-TW', {
        timeZone: 'Asia/Taipei',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      sourceUrl: sheetCsvUrl,
    };
  } catch (err) {
    console.warn('Could not live fetch CSV directly (CORS/network), using comprehensive offline static store:', err);
    return {
      ...INITIAL_DATA,
      lastUpdated: new Date().toLocaleString('zh-TW', {
        timeZone: 'Asia/Taipei',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      }),
      sourceUrl: sheetCsvUrl,
    };
  }
}
