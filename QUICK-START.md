# 🚀 Quick Start Guide

Get BabyLogger Next.js up and running in 5 minutes!

## Prerequisites Check

Before starting, make sure you have:
- ✅ Node.js 18+ installed (`node --version`)
- ✅ PostgreSQL installed and running
- ✅ A terminal/command prompt open

## 5-Minute Setup

### 1️⃣ Install Dependencies (1 min)

```bash
npm install
```

### 2️⃣ Create PostgreSQL Database (1 min)

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE babylogger;

# Exit
\q
```

### 3️⃣ Configure Environment (1 min)

```bash
# Copy example env file
cp .env.example .env.local

# Edit .env.local with your database credentials
# Replace 'username' and 'password' with your PostgreSQL credentials
```

Example `.env.local`:
```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/babylogger
NODE_ENV=development
```

### 4️⃣ Run Database Migration (1 min)

```bash
npm run db:migrate
```

Expected output:
```
✅ Database migration completed successfully!
```

### 5️⃣ Start the App (1 min)

```bash
npm run dev
```

Open http://localhost:3000 🎉

## First Steps in the App

1. **Set Baby's Birth Date**
   - Go to SETUP tab
   - Enter birth date
   - Click "儲存設定"

2. **Add Your First Record**
   - Go to RECORD tab
   - Fill in feeding/sleep info
   - Click "加入記錄"

3. **Generate Forecast**
   - Go to FORECAST tab
   - Click "更新預測"
   - Click "保存今日預測"

4. **View Daily Plan**
   - Go to PLAN tab
   - See your schedule!

## Troubleshooting

### "Cannot connect to database"
```bash
# Check if PostgreSQL is running
pg_isready

# Start PostgreSQL if needed (macOS)
brew services start postgresql@15

# Start PostgreSQL if needed (Linux)
sudo systemctl start postgresql
```

### "Port 3000 already in use"
```bash
# Kill the process
lsof -ti:3000 | xargs kill -9
```

### "Module not found"
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## What's Next?

- 📖 Read [README-NEXTJS.md](README-NEXTJS.md) for full documentation
- 🔧 Check [SETUP-GUIDE.md](SETUP-GUIDE.md) for detailed setup
- 📝 Review [CONVERSION-SUMMARY.md](CONVERSION-SUMMARY.md) to understand the changes

## Need Help?

Common issues and solutions are in [SETUP-GUIDE.md](SETUP-GUIDE.md#troubleshooting)

---

Happy tracking! 👶🍼