import type { NextApiRequest, NextApiResponse } from 'next';
import { records } from '@/lib/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  if (typeof id !== 'string') {
    return res.status(400).json({ error: 'Invalid record ID' });
  }

  if (req.method === 'PUT') {
    try {
      const record = req.body;
      await records.update(id, record);
      res.status(200).json({ success: true, message: 'Record updated' });
    } catch (error) {
      console.error('Error updating record:', error);
      res.status(500).json({ error: 'Failed to update record' });
    }
  } else if (req.method === 'DELETE') {
    try {
      await records.delete(id);
      res.status(200).json({ success: true, message: 'Record deleted' });
    } catch (error) {
      console.error('Error deleting record:', error);
      res.status(500).json({ error: 'Failed to delete record' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Made with Bob
