import { query } from './db';

// Types
export interface BabyProfile {
  id: number;
  birth_date: string;
  created_at: Date;
  updated_at: Date;
}

export interface ReferencePattern {
  time: string;
  feed: string;
  sleepStart: string;
  sleepEnd: string;
  poop: string;
}

export interface Record {
  id: string;
  date: string;
  time: string;
  feedLeft: number;
  feedRight: number;
  feedBreastMilk: number;
  feedFormula: number;
  sleepStart: boolean;
  sleepEnd: boolean;
  poop: string;
  pee: string;
  bath: boolean;
  notes: string;
}

export interface Forecast {
  date: string;
  rows: ForecastRow[];
}

export interface ForecastRow {
  time: string;
  feed: string;
  sleepStart: string;
  sleepEnd: string;
  poop: string;
}

// Baby Profile operations
export const babyProfile = {
  get: async (): Promise<BabyProfile | null> => {
    const result = await query(
      'SELECT * FROM baby_profile ORDER BY id DESC LIMIT 1'
    );
    return result.rows[0] || null;
  },

  save: async (birthDate: string): Promise<void> => {
    await query('DELETE FROM baby_profile');
    await query(
      'INSERT INTO baby_profile (birth_date) VALUES ($1)',
      [birthDate]
    );
  },
};

// Reference Pattern operations
export const referencePattern = {
  getAll: async (): Promise<ReferencePattern[]> => {
    const result = await query(
      'SELECT * FROM reference_pattern ORDER BY row_index'
    );
    return result.rows.map(r => ({
      time: r.time || '',
      feed: r.feed || '',
      sleepStart: r.sleep_start || '',
      sleepEnd: r.sleep_end || '',
      poop: r.poop || '',
    }));
  },

  saveAll: async (patterns: ReferencePattern[]): Promise<void> => {
    await query('DELETE FROM reference_pattern');
    for (let i = 0; i < patterns.length; i++) {
      const p = patterns[i];
      await query(
        `INSERT INTO reference_pattern (row_index, time, feed, sleep_start, sleep_end, poop)
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [i, p.time || '', p.feed || '', p.sleepStart || '', p.sleepEnd || '', p.poop || '']
      );
    }
  },
};

// Records operations
export const records = {
  getAll: async (): Promise<Record[]> => {
    const result = await query(
      'SELECT * FROM records ORDER BY date, time'
    );
    return result.rows.map(r => ({
      id: r.id,
      date: r.date,
      time: r.time || '',
      feedLeft: r.feed_left || 0,
      feedRight: r.feed_right || 0,
      feedBreastMilk: r.feed_breast_milk || 0,
      feedFormula: r.feed_formula || 0,
      sleepStart: r.sleep_start || false,
      sleepEnd: r.sleep_end || false,
      poop: r.poop || '',
      pee: r.pee || '',
      bath: r.bath || false,
      notes: r.notes || '',
    }));
  },

  getByDate: async (date: string): Promise<Record[]> => {
    const result = await query(
      'SELECT * FROM records WHERE date = $1 ORDER BY time',
      [date]
    );
    return result.rows.map(r => ({
      id: r.id,
      date: r.date,
      time: r.time || '',
      feedLeft: r.feed_left || 0,
      feedRight: r.feed_right || 0,
      feedBreastMilk: r.feed_breast_milk || 0,
      feedFormula: r.feed_formula || 0,
      sleepStart: r.sleep_start || false,
      sleepEnd: r.sleep_end || false,
      poop: r.poop || '',
      pee: r.pee || '',
      bath: r.bath || false,
      notes: r.notes || '',
    }));
  },

  add: async (record: Record): Promise<void> => {
    await query(
      `INSERT INTO records (id, date, time, feed_left, feed_right, feed_breast_milk, feed_formula,
       sleep_start, sleep_end, poop, pee, bath, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
      [
        record.id,
        record.date,
        record.time || '',
        record.feedLeft || 0,
        record.feedRight || 0,
        record.feedBreastMilk || 0,
        record.feedFormula || 0,
        record.sleepStart || false,
        record.sleepEnd || false,
        record.poop || '',
        record.pee || '',
        record.bath || false,
        record.notes || '',
      ]
    );
  },

  update: async (id: string, record: Record): Promise<void> => {
    await query(
      `UPDATE records
       SET date = $1, time = $2, feed_left = $3, feed_right = $4, feed_breast_milk = $5, feed_formula = $6,
       sleep_start = $7, sleep_end = $8, poop = $9, pee = $10, bath = $11, notes = $12, updated_at = CURRENT_TIMESTAMP
       WHERE id = $13`,
      [
        record.date,
        record.time || '',
        record.feedLeft || 0,
        record.feedRight || 0,
        record.feedBreastMilk || 0,
        record.feedFormula || 0,
        record.sleepStart || false,
        record.sleepEnd || false,
        record.poop || '',
        record.pee || '',
        record.bath || false,
        record.notes || '',
        id,
      ]
    );
  },

  delete: async (id: string): Promise<void> => {
    await query('DELETE FROM records WHERE id = $1', [id]);
  },
};

// Forecasts operations
export const forecasts = {
  getAll: async (): Promise<Forecast[]> => {
    const forecastList = await query(
      'SELECT * FROM forecasts ORDER BY date DESC'
    );
    const result: Forecast[] = [];

    for (const forecast of forecastList.rows) {
      const rows = await query(
        'SELECT * FROM forecast_rows WHERE forecast_id = $1 ORDER BY row_index',
        [forecast.id]
      );
      result.push({
        date: forecast.date,
        rows: rows.rows.map(r => ({
          time: r.time || '',
          feed: r.feed || '',
          sleepStart: r.sleep_start || '',
          sleepEnd: r.sleep_end || '',
          poop: r.poop || '',
        })),
      });
    }

    return result;
  },

  getByDate: async (date: string): Promise<Forecast | null> => {
    const forecastResult = await query(
      'SELECT * FROM forecasts WHERE date = $1',
      [date]
    );
    if (forecastResult.rows.length === 0) return null;

    const forecast = forecastResult.rows[0];
    const rows = await query(
      'SELECT * FROM forecast_rows WHERE forecast_id = $1 ORDER BY row_index',
      [forecast.id]
    );

    return {
      date: forecast.date,
      rows: rows.rows.map(r => ({
        time: r.time || '',
        feed: r.feed || '',
        sleepStart: r.sleep_start || '',
        sleepEnd: r.sleep_end || '',
        poop: r.poop || '',
      })),
    };
  },

  save: async (date: string, rows: ForecastRow[]): Promise<void> => {
    // Check if forecast exists
    const existing = await query(
      'SELECT id FROM forecasts WHERE date = $1',
      [date]
    );

    let forecastId: number;
    if (existing.rows.length > 0) {
      forecastId = existing.rows[0].id;
      await query('DELETE FROM forecast_rows WHERE forecast_id = $1', [forecastId]);
      await query(
        'UPDATE forecasts SET updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [forecastId]
      );
    } else {
      const result = await query(
        'INSERT INTO forecasts (date) VALUES ($1) RETURNING id',
        [date]
      );
      forecastId = result.rows[0].id;
    }

    // Insert forecast rows
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i];
      await query(
        `INSERT INTO forecast_rows (forecast_id, row_index, time, feed, sleep_start, sleep_end, poop)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [forecastId, i, r.time || '', r.feed || '', r.sleepStart || '', r.sleepEnd || '', r.poop || '']
      );
    }
  },
};

// Made with Bob
