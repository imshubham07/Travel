# Travel Experiences Backend

Backend API for a travel experiences marketplace built with Node.js, Express, TypeScript, Prisma, and PostgreSQL.

## Prerequisites (new laptop)

Install these first:

- **Node.js**: v18+ (recommended v20 LTS)
- **npm**: comes with Node.js
- **PostgreSQL**: v14+ (or use any hosted PostgreSQL)
- **Git**

Optional (for DB GUI):

- Prisma Studio via `npm run prisma:studio`

## 1) Clone the project

```bash
git clone https://github.com/imshubham07/Travel.git
cd Travel
```

## 2) Install dependencies

```bash
npm install
```

## 3) Create environment file

Create `.env` in project root:

```env
PORT=3000
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/travel_db?schema=public"
JWT_SECRET="change-this-to-a-long-random-secret"
NODE_ENV=development
```

Notes:
- Update `DATABASE_URL` with your local/remote Postgres credentials.
- `JWT_SECRET` must be set, otherwise auth token logic will fail.

## 4) Prepare database (Prisma)

Run migrations and generate Prisma client:

```bash
npx prisma migrate dev
npx prisma generate
```

Or with scripts:

```bash
npm run prisma:migrate
npm run prisma:generate
```

## 5) Start the server

Development mode (auto-reload):

```bash
npm run dev
```

Server starts at:

- `http://localhost:3000`
- Health check: `http://localhost:3000/health`

## 6) Build and run (production style)

```bash
npm run build
npm start
```

## Useful scripts

- `npm run dev` → start dev server with watch mode
- `npm run build` → compile TypeScript to `dist/`
- `npm start` → run compiled app
- `npm run typecheck` → check TypeScript types
- `npm run prisma:migrate` → apply/create Prisma migration (dev)
- `npm run prisma:generate` → regenerate Prisma client
- `npm run prisma:studio` → open Prisma Studio

## Quick verification

After server starts, test:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "db": "connected"
}
```

## Common issues

- **Database connection error**
  - Check Postgres is running.
  - Verify `DATABASE_URL` in `.env`.
  - Ensure database exists (`travel_db`) and credentials are correct.

- **Port already in use**
  - Change `PORT` in `.env` (for example `PORT=3001`) and restart.

- **Prisma client mismatch after schema changes**
  - Run `npm run prisma:generate` again.

---

