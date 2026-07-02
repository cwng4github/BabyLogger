import type { NextApiRequest, NextApiResponse } from 'next';
import { referencePattern } from '@/lib/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const patterns = await referencePattern.getAll();
      res.status(200).json(patterns);
    } catch (error) {
      console.error('Error fetching reference pattern:', error);
      res.status(500).json({ error: 'Failed to fetch reference pattern' });
    }
  } else if (req.method === 'POST') {
    try {
      const { patterns } = req.body;
      if (!Array.isArray(patterns)) {
        return res.status(400).json({ error: 'Patterns must be an array' });
      }

      await referencePattern.saveAll(patterns);
      res.status(200).json({ success: true, message: 'Reference pattern saved' });
    } catch (error) {
      console.error('Error saving reference pattern:', error);
      res.status(500).json({ error: 'Failed to save reference pattern' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Made with Bob
