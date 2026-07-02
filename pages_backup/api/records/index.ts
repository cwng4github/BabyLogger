import type { NextApiRequest, NextApiResponse } from 'next';
import { records } from '@/lib/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { date } = req.query;
      let allRecords;

      if (date && typeof date === 'string') {
        allRecords = await records.getByDate(date);
      } else {
        allRecords = await records.getAll();
      }

      res.status(200).json(allRecords);
    } catch (error) {
      console.error('Error fetching records:', error);
      res.status(500).json({ error: 'Failed to fetch records' });
    }
  } else if (req.method === 'POST') {
    try {
      const record = req.body;
      if (!record.id || !record.date) {
        return res.status(400).json({ error: 'Record ID and date are required' });
      }

      await records.add(record);
      res.status(200).json({ success: true, message: 'Record added' });
    } catch (error) {
      console.error('Error adding record:', error);
      res.status(500).json({ error: 'Failed to add record' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Made with Bob
