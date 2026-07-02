import type { NextApiRequest, NextApiResponse } from 'next';
import { babyProfile } from '@/lib/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const profile = await babyProfile.get();
      res.status(200).json(profile ? { birthDate: profile.birth_date } : { birthDate: null });
    } catch (error) {
      console.error('Error fetching baby profile:', error);
      res.status(500).json({ error: 'Failed to fetch baby profile' });
    }
  } else if (req.method === 'POST') {
    try {
      const { birthDate } = req.body;
      if (!birthDate) {
        return res.status(400).json({ error: 'Birth date is required' });
      }

      await babyProfile.save(birthDate);
      res.status(200).json({ success: true, message: 'Baby profile saved' });
    } catch (error) {
      console.error('Error saving baby profile:', error);
      res.status(500).json({ error: 'Failed to save baby profile' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Made with Bob
