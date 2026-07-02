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

    res.status(200).json({
      birthDate: profile ? profile.birth_date : null,
      reference: reference,
      records: allRecords,
      forecasts: allForecasts,
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
}

// Made with Bob
