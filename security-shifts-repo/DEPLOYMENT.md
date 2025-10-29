# Security Shifts - Complete Setup Guide

## 📦 What's Included

This is a **production-ready monorepo** for the Security Shifts application with:

✅ **Backend (NestJS + Prisma + PostgreSQL)**  
✅ **Frontend (Next.js 14 App Router + shadcn/ui)**  
✅ **Local Docker support**  
✅ **GitHub Actions CI/CD**  
✅ **Replit single-port deployment** (no Docker needed)  
✅ **Full test suite** (pay calculation, WhatsApp parser)  
✅ **Seed data** for immediate testing  

---

## 🚀 Quick Start (5 minutes)

### Option 1: Local Development with Docker

```bash
# 1. Extract ZIP and enter directory
cd security-shifts

# 2. Install dependencies
npm install

# 3. Copy environment file
cp .env.example .env

# 4. Start services (PostgreSQL, Redis, MailHog)
docker-compose up -d

# 5. Setup database
npm run db:migrate
npm run seed

# 6. Start dev servers
npm run dev
```

**Access:**
- Web: http://localhost:3000
- API: http://localhost:4000/api
- MailHog: http://localhost:8025
- Prisma Studio: `npm run db:studio`

**Demo Credentials:**
- Admin: `admin@securityshifts.local` / `admin123`
- Manager: `manager@securityshifts.local` / `manager123`

---

### Option 2: Local Development (Manual PostgreSQL)

If you prefer not to use Docker:

```bash
# 1. Install PostgreSQL (macOS: `brew install postgresql`)
# 2. Create database
createdb security_shifts

# 3. Update .env
DATABASE_URL="postgresql://user:password@localhost:5432/security_shifts"

# 4. Install & setup
npm install
npm run db:migrate
npm run seed
npm run dev
```

---

## 📤 Deploy to GitHub

### 1. Create GitHub Repository

```bash
git init
git add .
git commit -m "Initial commit: Security Shifts MVP"
git branch -M main

# Create repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/security-shifts.git
git push -u origin main
```

### 2. GitHub Actions CI/CD

The repo includes `.github/workflows/ci.yml` which:
- ✅ Runs tests on every push
- ✅ Checks linting & type safety
- ✅ Builds both API and Web
- ✅ Uploads artifacts

**Add secrets to GitHub** (Settings → Secrets):
- `DATABASE_URL` – PostgreSQL connection string (for CI tests)
- `JWT_SECRET` – Random strong secret (32+ chars)

### 3. (Optional) Deploy to GitHub Pages (Web Only)

```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to web/package.json:
"deploy": "next export && gh-pages -d out"

# Then:
npm run build -w web
npm run deploy -w web
```

---

## 🔴 Deploy to Replit

### Method A: Import from GitHub (Easiest)

1. Go to **replit.com** → Click **"Create"**
2. Select **"Import from GitHub"**
3. Paste: `https://github.com/YOUR_USERNAME/security-shifts.git`
4. Click **"Import"**
5. Set environment secrets (Replit Secrets tab):
   - `DATABASE_URL` (use Replit PostgreSQL or external)
   - `JWT_SECRET`
   - `WHATSAPP_PROVIDER=mock` (for demo)
6. Click **"Run"** ▶️

**Done!** Replit will:
- Read `.replit` file
- Install dependencies
- Run `npm run build && npm run start`
- Start on single public port (Replit sets `$PORT`)

### Method B: Push to Replit

```bash
# Install Replit CLI
npm install -g @replit/cli

# Create new Replit from local repo
replit create security-shifts

# Push code
replit push
```

### Replit Architecture (Single Port)

```
┌─────────────────────────────────────┐
│  Browser (http://replit-project.dev)│
│                                     │
│  [Next.js Web on $PORT]             │
│  ├─ /                               │
│  ├─ /dashboard                      │
│  └─ /api/* (rewrites to :4000)      │
│                                     │
│  [NestJS API on :4000 (internal)]   │
│  ├─ /auth/login                     │
│  ├─ /operators                      │
│  └─ /shifts                         │
└─────────────────────────────────────┘
```

**Key Settings in `.replit`:**
```
modules = ["nodejs-20"]
run = ["bash", "-c", "npm run build && npm run start"]

[[ports]]
localPort = 3000
externalPort = 80
```

**CORS Config** (enabled automatically):
- API allows: `http://localhost:${process.env.PORT}`
- Web proxies: `/api/*` → `http://localhost:4000/*`

---

## 📝 Environment Variables

### Required
```bash
DATABASE_URL=postgresql://user:password@localhost:5432/security_shifts
JWT_SECRET=your-secret-key-change-in-production
```

### Optional
```bash
NODE_ENV=development

# API
API_PORT=4000
CORS_ORIGIN=http://localhost:3000

# WhatsApp (for production)
WHATSAPP_PROVIDER=mock  # or: meta, twilio
# WHATSAPP_ACCESS_TOKEN=xxx
# WHATSAPP_PHONE_NUMBER_ID=xxx

# Pay Defaults
DEFAULT_HOURLY_RATE_CENTS=1500  # €15.00/hour
DOCUMENT_REMINDER_DAYS=30

# Timezone
TZ=Europe/Rome
```

See `.env.example` for all options.

---

## 🔧 Common Tasks

### Database Migrations

```bash
# Create new migration
npm run db:migrate -- --name "add_field"

# Reset database (careful!)
npm run db:reset

# Open GUI
npm run db:studio
```

### Running Tests

```bash
# All tests
npm run test

# Watch mode
npm run test -- --watch

# Coverage
npm run test -- --coverage
```

### Linting & Type Check

```bash
npm run lint
npm run type-check
```

### Seed Fresh Data

```bash
npm run seed
```

---

## 📚 Project Structure

```
security-shifts/
├── api/                              # NestJS backend
│   ├── src/
│   │   ├── auth/                    # JWT, RBAC guards
│   │   ├── operators/               # Operator CRUD
│   │   ├── shifts/                  # Shift management
│   │   ├── shops/                   # Shop management
│   │   ├── documents/               # File uploads
│   │   ├── pay/                     # Pay calculation
│   │   ├── whatsapp/                # WhatsApp integration
│   │   ├── import/                  # CSV/XLSX importer
│   │   ├── common/                  # Shared utilities
│   │   └── main.ts
│   ├── test/
│   │   ├── pay.spec.ts
│   │   └── whatsapp-parser.spec.ts
│   ├── prisma/
│   ├── package.json
│   └── tsconfig.json
│
├── web/                              # Next.js frontend
│   ├── app/
│   │   ├── (auth)/login
│   │   ├── (dashboard)/
│   │   │   ├── dashboard
│   │   │   ├── shifts
│   │   │   ├── operators
│   │   │   ├── shops
│   │   │   ├── import
│   │   │   └── reports
│   │   ├── (me)/shifts               # Mobile operator view
│   │   └── layout.tsx
│   ├── components/
│   │   └── ui/                      # shadcn/ui components
│   ├── lib/
│   │   ├── api-client.ts            # Axios instance
│   │   ├── hooks.ts                 # TanStack Query hooks
│   │   └── utils.ts
│   ├── package.json
│   ├── next.config.mjs
│   └── tailwind.config.ts
│
├── prisma/
│   ├── schema.prisma                # Complete data model
│   └── seed.ts
│
├── docker-compose.yml               # Local services
├── .env.example
├── .replit                          # Replit config
├── package.json                     # Root monorepo
├── README.md
├── LICENSE
└── .gitignore
```

---

## 🔐 Security Checklist

- [ ] Change `JWT_SECRET` in production
- [ ] Use strong database password
- [ ] Enable HTTPS (automatic on GitHub/Replit)
- [ ] Configure WhatsApp provider credentials
- [ ] Set `NODE_ENV=production` on servers
- [ ] Enable database backups
- [ ] Monitor rate limits and adjust as needed
- [ ] Review RBAC guard on sensitive endpoints

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 4000
lsof -ti:4000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Database Connection Failed
```bash
# Check PostgreSQL is running
pg_isready

# Check .env DATABASE_URL is correct
cat .env | grep DATABASE_URL
```

### Tests Failing
```bash
# Rebuild
npm run build

# Ensure database migrated
npm run db:migrate

# Run tests with output
npm run test -- --verbose
```

### Replit Won't Start
- Check Secrets are set (DATABASE_URL, JWT_SECRET)
- Clear cache: **Tools** → **Kill all Processes** → **Run**
- Check logs for errors

---

## 📖 API Documentation

Once running, visit:
- **Swagger UI:** http://localhost:4000/api
- **OpenAPI JSON:** http://localhost:4000/api-json

### Example Requests

**Login**
```bash
curl -X POST http://localhost:4000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@securityshifts.local","password":"admin123"}'
```

**List Shifts**
```bash
curl -X GET http://localhost:4000/shifts \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📞 Support

- **Issues:** GitHub Issues
- **Docs:** Full README in repo
- **Examples:** Seed data in `prisma/seed.ts`

---

## 🎯 Next Steps

1. **Local:** `docker-compose up` → `npm run seed` → `npm run dev`
2. **GitHub:** Push code, verify CI passes
3. **Replit:** Import from GitHub, set secrets, click Run
4. **Production:** Update env vars, enable backups, monitor logs

**Happy shifting! 🔐✅**
