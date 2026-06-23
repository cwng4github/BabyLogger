const { Pool } = require('pg');
require('dotenv').config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const schema = `
-- Baby Profile table
CREATE TABLE IF NOT EXISTS baby_profile (
  id SERIAL PRIMARY KEY,
  birth_date DATE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Reference Pattern table
CREATE TABLE IF NOT EXISTS reference_pattern (
  id SERIAL PRIMARY KEY,
  row_index INTEGER NOT NULL,
  time VARCHAR(5),
  feed TEXT,
  sleep_start VARCHAR(5),
  sleep_end VARCHAR(5),
  poop TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Records table
CREATE TABLE IF NOT EXISTS records (
  id VARCHAR(50) PRIMARY KEY,
  date DATE NOT NULL,
  time VARCHAR(5),
  feed_left INTEGER DEFAULT 0,
  feed_right INTEGER DEFAULT 0,
  feed_breast_milk INTEGER DEFAULT 0,
  feed_formula INTEGER DEFAULT 0,
  sleep_start BOOLEAN DEFAULT FALSE,
  sleep_end BOOLEAN DEFAULT FALSE,
  poop VARCHAR(10),
  pee VARCHAR(10),
  bath BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forecasts table
CREATE TABLE IF NOT EXISTS forecasts (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Forecast rows table
CREATE TABLE IF NOT EXISTS forecast_rows (
  id SERIAL PRIMARY KEY,
  forecast_id INTEGER NOT NULL REFERENCES forecasts(id) ON DELETE CASCADE,
  row_index INTEGER NOT NULL,
  time VARCHAR(5),
  feed TEXT,
  sleep_start VARCHAR(5),
  sleep_end VARCHAR(5),
  poop TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_records_date ON records(date);
CREATE INDEX IF NOT EXISTS idx_forecasts_date ON forecasts(date);
CREATE INDEX IF NOT EXISTS idx_forecast_rows_forecast_id ON forecast_rows(forecast_id);
CREATE INDEX IF NOT EXISTS idx_reference_pattern_row_index ON reference_pattern(row_index);
`;

async function migrate() {
  const client = await pool.connect();
  try {
    console.log('🔄 Starting database migration...');
    await client.query(schema);
    console.log('✅ Database migration completed successfully!');
    console.log('📊 Tables created:');
    console.log('   - baby_profile');
    console.log('   - reference_pattern');
    console.log('   - records');
    console.log('   - forecasts');
    console.log('   - forecast_rows');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate();

// Made with Bob
