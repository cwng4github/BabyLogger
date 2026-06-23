import type { NextApiRequest, NextApiResponse } from 'next';
import { forecasts } from '@/lib/database';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'GET') {
    try {
      const { date } = req.query;

      if (date && typeof date === 'string') {
        const forecast = await forecasts.getByDate(date);
        res.status(200).json(forecast);
      } else {
        const allForecasts = await forecasts.getAll();
        res.status(200).json(allForecasts);
      }
    } catch (error) {
      console.error('Error fetching forecasts:', error);
      res.status(500).json({ error: 'Failed to fetch forecasts' });
    }
  } else if (req.method === 'POST') {
    try {
      const { date, rows } = req.body;
      if (!date || !Array.isArray(rows)) {
        return res.status(400).json({ error: 'Date and rows are required' });
      }

      await forecasts.save(date, rows);
      res.status(200).json({ success: true, message: 'Forecast saved' });
    } catch (error) {
      console.error('Error saving forecast:', error);
      res.status(500).json({ error: 'Failed to save forecast' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

// Made with Bob
