# BabyLogger - Next.js Edition

A Next.js web application for tracking baby feeding, sleeping, and diaper changes with PostgreSQL database. This app helps parents predict and plan their baby's daily routine based on age-specific reference patterns and historical records.

## 🎯 What Changed from Node.js to Next.js

### Architecture Changes
- **Backend**: Express.js → Next.js API Routes
- **Database**: SQLite → PostgreSQL
- **Frontend**: EJS Templates → React/Next.js Pages
- **Styling**: Maintained Tailwind CSS with custom MUJI design

### Key Benefits
- ✅ Modern React-based frontend
- ✅ PostgreSQL for production-ready data storage
- ✅ API routes built into Next.js
- ✅ Better performance and SEO
- ✅ TypeScript support
- ✅ Easy deployment to Vercel, Netlify, or any Node.js host

## 📋 Prerequisites

- Node.js 18+ 
- PostgreSQL 12+ installed and running
- npm or yarn package manager

## 🚀 Installation

### 1. Clone and Install Dependencies

```bash
cd /Users/cwng/Documents/git/ForEunice-1
npm install
```

### 2. Set Up PostgreSQL Database

Create a PostgreSQL database:

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE babylogger;

# Exit psql
\q
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your PostgreSQL credentials:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/babylogger
NODE_ENV=development
```

Replace `username` and `password` with your PostgreSQL credentials.

### 4. Run Database Migration

```bash
npm run db:migrate
```

This will create all necessary tables in your PostgreSQL database.

### 5. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
ForEunice-1/
├── lib/
│   ├── db.ts                   # PostgreSQL connection pool
│   └── database.ts             # Database operations
├── pages/
│   ├── api/                    # Next.js API routes
│   │   ├── baby-profile.ts
│   │   ├── data.ts
│   │   ├── forecasts.ts
│   │   ├── reference-pattern.ts
│   │   ├── records/
│   │   │   ├── index.ts
│   │   │   └── [id].ts
│   │   └── export/
│   │       └── csv.ts
│   ├── _app.tsx                # Next.js app wrapper
│   ├── _document.tsx           # HTML document structure
│   └── index.tsx               # Main application page
├── scripts/
│   └── migrate.js              # Database migration script
├── styles/
│   └── globals.css             # Global styles
├── .env.example                # Environment variables template
├── .env.local                  # Your local environment (create this)
├── next.config.js              # Next.js configuration
├── package.json                # Dependencies
├── tailwind.config.js          # Tailwind CSS config
└── tsconfig.json               # TypeScript config
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:migrate` - Run database migrations

## 📊 Database Schema

### Tables

1. **baby_profile** - Baby's birth date and profile info
2. **reference_pattern** - Reference feeding/sleep schedule templates
3. **records** - Historical activity records (feeding, sleep, diaper)
4. **forecasts** - Saved daily predictions
5. **forecast_rows** - Individual forecast entries

## 🎨 Features

- 📅 **Daily Planning**: View today's predicted schedule
- 📝 **Record History**: Track feeding, sleep, and diaper changes
- 📊 **Smart Forecasting**: Predict schedules based on patterns
- 👶 **Age-Based Templates**: Automatic patterns for 0-12 months
- 💾 **PostgreSQL Storage**: Production-ready database
- 📤 **CSV Export**: Export all data for backup
- 🎨 **MUJI Design**: Clean, minimalist Japanese aesthetic

## 🌐 API Endpoints

### Baby Profile
- `GET /api/baby-profile` - Get baby profile
- `POST /api/baby-profile` - Save baby profile

### Reference Pattern
- `GET /api/reference-pattern` - Get reference pattern
- `POST /api/reference-pattern` - Save reference pattern

### Records
- `GET /api/records` - Get all records (optional: ?date=YYYY-MM-DD)
- `POST /api/records` - Add new record
- `PUT /api/records/[id]` - Update record
- `DELETE /api/records/[id]` - Delete record

### Forecasts
- `GET /api/forecasts` - Get all forecasts (optional: ?date=YYYY-MM-DD)
- `POST /api/forecasts` - Save forecast

### Export
- `GET /api/export/csv` - Export all data as CSV

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `DATABASE_URL`
4. Deploy!

### Other Platforms

The app can be deployed to any platform that supports:
- Node.js 18+
- PostgreSQL database
- Environment variables

Popular options:
- Railway
- Render
- Heroku
- DigitalOcean App Platform

## 🔄 Migration from Old Version

If you have data in the old SQLite version:

1. Export data using the CSV export feature
2. Set up the new PostgreSQL database
3. Manually import the CSV data or use the UI to re-enter

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
pg_isready

# Test connection
psql -U username -d babylogger
```

### Port Already in Use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### TypeScript Errors

```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## 📝 Development Notes

- All TypeScript errors during development are expected until `npm install` is run
- The app uses server-side rendering for the main page
- API routes handle all database operations
- Chart.js is loaded via CDN for visualization

## 🤝 Contributing

This is a personal project, but suggestions are welcome!

## 📄 License

MIT

## 👶 Author

Created for Eunice with ❤️

---

**Note**: This is the Next.js version. The original Node.js/Express version files are still in the repository but are no longer used.