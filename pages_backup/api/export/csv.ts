import type { NextApiRequest, NextApiResponse } from 'next';
import { babyProfile, referencePattern, records, forecasts } from '@/lib/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const profile = await babyProfile.get();
    const reference = await referencePattern.getAll();
    const allRecords = await records.getAll();
    const allForecasts = await forecasts.getAll();

    let csv = '';

    csv += '=== BABY PROFILE ===\n';
    csv += `birth_date,${profile ? profile.birth_date : ''}\n\n`;

    csv += '=== REFERENCE PATTERN ===\n';
    csv += 'index,time,feed,sleep_start,sleep_end,poop\n';
    reference.forEach((r, i) => {
      csv += `${i + 1},${r.time || ''},${r.feed || ''},${r.sleepStart || ''},${r.sleepEnd || ''},${r.poop || ''}\n`;
    });
    csv += '\n';

    csv += '=== HISTORY RECORDS ===\n';
    csv += 'id,date,time,feed_left_mins,feed_right_mins,feed_breast_milk_ml,feed_formula_ml,sleep_start,sleep_end,poop,pee,bath,notes\n';
    allRecords.forEach(r => {
      csv += `${r.id},${r.date},${r.time || ''},${r.feedLeft || 0},${r.feedRight || 0},${r.feedBreastMilk || 0},${r.feedFormula || 0},${r.sleepStart ? 'Y' : 'N'},${r.sleepEnd ? 'Y' : 'N'},${r.poop || ''},${r.pee || ''},${r.bath ? 'Y' : 'N'},"${r.notes || ''}"\n`;
    });
    csv += '\n';

    csv += '=== FORECASTS ===\n';
    csv += 'date,row_index,time,feed,sleep_start,sleep_end,poop\n';
    allForecasts.forEach(f => {
      f.rows.forEach((row, idx) => {
        csv += `${f.date},${idx + 1},${row.time || ''},${row.feed || ''},${row.sleepStart || ''},${row.sleepEnd || ''},${row.poop || ''}\n`;
      });
    });

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=baby_log.csv');
    res.status(200).send(csv);
  } catch (error) {
    console.error('Error exporting CSV:', error);
    res.status(500).json({ error: 'Failed to export CSV' });
  }
}

// Made with Bob
