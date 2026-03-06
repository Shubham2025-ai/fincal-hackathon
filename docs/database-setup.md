# Database Setup

## MySQL (Production — Hackathon Spec)

### 1. Create the database
```sql
CREATE DATABASE fincal_retirement CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'fincal'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON fincal_retirement.* TO 'fincal'@'localhost';
FLUSH PRIVILEGES;
```

### 2. Set environment variable
Edit `.env`:
```env
DATABASE_URL="mysql://fincal:your_password@localhost:3306/fincal_retirement"
```

### 3. Push schema & generate client
```bash
npm install
npx prisma db push
npx prisma generate
```

### 4. Start the app
```bash
npm run build
npm start
```

### 5. Verify tables were created
```bash
npx prisma studio
# Opens at http://localhost:5555
```

---

## SQLite (Local Dev — Zero Config)

Change `schema.prisma` provider to `"sqlite"` and update `.env`:
```env
DATABASE_URL="file:./fincal.db"
```
Then run `npx prisma db push`. No MySQL server needed.

---

## Tables Created

| Table | Purpose |
|-------|---------|
| `Calculation` | Auto-logs every `/api/calculate` call |
| `SavedPlan` | Named plans saved by user via UI |
| `DailyAnalytics` | Aggregate stats |

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/calculate` | POST | Calculate + auto-log to DB |
| `/api/plans` | GET | List all saved plans |
| `/api/plans` | POST | Save a named plan |
| `/api/plans/[id]` | GET | Get single plan |
| `/api/plans/[id]` | DELETE | Delete a plan |
| `/api/analytics` | GET | Aggregate statistics |
| `/api/health` | GET | Health check |
