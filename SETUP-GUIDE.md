# BabyLogger Next.js Setup Guide

This guide will walk you through setting up the BabyLogger Next.js application from scratch.

## Step-by-Step Setup

### Step 1: Install Dependencies

```bash
npm install
```

This will install:
- Next.js and React
- PostgreSQL client (pg)
- Chart.js for visualizations
- TypeScript and type definitions
- Tailwind CSS for styling

### Step 2: Install and Configure PostgreSQL

#### macOS (using Homebrew)

```bash
# Install PostgreSQL
brew install postgresql@15

# Start PostgreSQL service
brew services start postgresql@15

# Create a database
createdb babylogger
```

#### Ubuntu/Debian

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start PostgreSQL service
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Switch to postgres user and create database
sudo -u postgres psql
CREATE DATABASE babylogger;
CREATE USER babylogger_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE babylogger TO babylogger_user;
\q
```

#### Windows

1. Download PostgreSQL from https://www.postgresql.org/download/windows/
2. Run the installer
3. Remember the password you set for the postgres user
4. Open pgAdmin or use psql to create the database:

```sql
CREATE DATABASE babylogger;
```

### Step 3: Configure Environment Variables

Create `.env.local` file:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# For local PostgreSQL
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/babylogger

# Or if you created a specific user
DATABASE_URL=postgresql://babylogger_user:your_password@localhost:5432/babylogger

NODE_ENV=development
```

**Important**: Never commit `.env.local` to git. It's already in `.gitignore`.

### Step 4: Run Database Migration

```bash
npm run db:migrate
```

You should see:
```
🔄 Starting database migration...
✅ Database migration completed successfully!
📊 Tables created:
   - baby_profile
   - reference_pattern
   - records
   - forecasts
   - forecast_rows
```

### Step 5: Verify Database Setup

Connect to your database and verify tables were created:

```bash
psql -U postgres -d babylogger

# List all tables
\dt

# You should see:
# baby_profile
# reference_pattern
# records
# forecasts
# forecast_rows

# Exit
\q
```

### Step 6: Start Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Troubleshooting

### Issue: "Cannot find module 'pg'"

**Solution**: Run `npm install`

### Issue: "Connection refused" or "ECONNREFUSED"

**Solution**: 
1. Check if PostgreSQL is running:
   ```bash
   # macOS
   brew services list
   
   # Linux
   sudo systemctl status postgresql
   ```

2. Start PostgreSQL if it's not running:
   ```bash
   # macOS
   brew services start postgresql@15
   
   # Linux
   sudo systemctl start postgresql
   ```

### Issue: "password authentication failed"

**Solution**: 
1. Check your DATABASE_URL in `.env.local`
2. Verify PostgreSQL user and password:
   ```bash
   psql -U postgres
   \du  # List all users
   ```

3. Reset password if needed:
   ```sql
   ALTER USER postgres WITH PASSWORD 'new_password';
   ```

### Issue: "database does not exist"

**Solution**: Create the database:
```bash
createdb babylogger
# or
psql -U postgres -c "CREATE DATABASE babylogger;"
```

### Issue: TypeScript errors in IDE

**Solution**: These are expected before running `npm install`. After installation, restart your IDE or TypeScript server.

### Issue: Port 3000 already in use

**Solution**:
```bash
# Find and kill the process
lsof -ti:3000 | xargs kill -9

# Or use a different port
npm run dev -- -p 3001
```

## Testing the Application

### 1. Set Baby Profile
- Go to SETUP tab
- Enter baby's birth date
- Click "儲存設定"

### 2. View Reference Pattern
- The app automatically loads age-appropriate patterns
- You can modify them manually
- Click "儲存參考模板" to save changes

### 3. Add Records
- Go to RECORD tab
- Fill in feeding, sleep, or diaper information
- Click "加入記錄"

### 4. Generate Forecast
- Go to FORECAST tab
- Click "更新預測"
- Click "保存今日預測" to save

### 5. View Plan
- Go to PLAN tab
- See today's predicted vs actual schedule
- View the comparison chart

### 6. Export Data
- Click the CSV button in the header
- Download your data for backup

## Database Backup

### Backup

```bash
pg_dump -U postgres babylogger > babylogger_backup.sql
```

### Restore

```bash
psql -U postgres babylogger < babylogger_backup.sql
```

## Production Deployment

### Environment Variables for Production

```env
DATABASE_URL=postgresql://user:password@host:5432/database
NODE_ENV=production
```

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

1. Push code to GitHub
2. Import project in Vercel
3. Add `DATABASE_URL` environment variable
4. Deploy

Vercel will automatically:
- Install dependencies
- Build the application
- Deploy to a global CDN

## Next Steps

1. ✅ Complete setup following this guide
2. ✅ Test all features
3. ✅ Add your first baby record
4. ✅ Generate your first forecast
5. ✅ Export data to verify everything works

## Need Help?

- Check the main README-NEXTJS.md for more details
- Review the API documentation in README-NEXTJS.md
- Check PostgreSQL logs: `tail -f /usr/local/var/log/postgresql@15.log` (macOS)

## Security Notes

- Never commit `.env.local` to version control
- Use strong passwords for PostgreSQL
- In production, use SSL for database connections
- Regularly backup your database
- Keep dependencies updated: `npm audit fix`

---

Happy tracking! 👶🍼💤