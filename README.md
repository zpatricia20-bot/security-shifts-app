# Security Shifts

A production-ready shift management system for security services. Manage operators, shops, shifts, attendance, pay, and automations via WhatsApp.

## Features

✅ **Shift Management** – Calendar/table views, real-time status tracking
✅ **Operators** – Profiles, documents, expiry reminders, reviews
✅ **Attendance** – Check-in/out with GPS, unpaid breaks, live map
✅ **Pay Calculation** – Hourly rates, automatic pay item generation, exports
✅ **WhatsApp Automations** – Night-before confirmations, inbound reply parsing, group commands
✅ **Import/Export** – CSV/XLSX turni files, payroll exports
✅ **Role-Based Access** – Admin, Manager, Operator, Read-Only with JWT auth
✅ **Replit Compatible** – Single-port deployment, no Docker required

## Tech Stack

- **Backend:** NestJS, Prisma, PostgreSQL, Zod, JWT, Helmet, Rate-Limiting
- **Frontend:** Next.js 14 (App Router), React, Tailwind, shadcn/ui, TanStack Query, React Hook Form, Leaflet
- **Deployment:** Docker (local), GitHub, Replit

## Project Structure

```
security-shifts/
├── api/                           # NestJS backend
│   ├── src/
│   │   ├── auth/                 # JWT, guards, decorators
│   │   ├── operators/             # Operators resource (CRUD + validators)
│   │   ├── shops/                 # Shops resource
│   │   ├── shifts/                # Shifts resource, attendance logs
│   │   ├── documents/             # Document uploads & expiry tracking
│   │   ├── pay/                   # Pay calculation, exports
│   │   ├── whatsapp/              # WhatsApp provider & webhook
│   │   ├── import/                # CSV/XLSX importer
│   │   ├── jobs/                  # Scheduled tasks (reminders, confirmations)
│   │   ├── common/                # Guards, middleware, utils
│   │   └── main.ts
│   ├── prisma/
│   │   └── schema.prisma         # Data model
│   ├── test/
│   │   ├── pay.spec.ts           # Pay calculation tests
│   │   └── whatsapp-parser.spec.ts
│   ├── package.json
│   └── tsconfig.json
├── web/                           # Next.js frontend
│   ├── app/
│   │   ├── (auth)/
│   │   │   └── login/
│   │   ├── (dashboard)/
│   │   │   ├── dashboard/
│   │   │   ├── shifts/
│   │   │   ├── shifts/[id]/
│   │   │   ├── operators/
│   │   │   ├── shops/
│   │   │   ├── import/
│   │   │   ├── reports/
│   │   │   └── layout.tsx
│   │   ├── me/
│   │   │   ├── shifts/           # Mobile operator view
│   │   │   └── layout.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                   # shadcn/ui components
│   │   ├── shift-calendar.tsx
│   │   ├── shift-table.tsx
│   │   ├── map-view.tsx
│   │   ├── document-uploader.tsx
│   │   ├── import-wizard.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── api-client.ts
│   │   ├── hooks.ts              # TanStack Query hooks
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── package.json
│   ├── next.config.mjs
│   └── tailwind.config.ts
├── prisma/
│   └── schema.prisma             # Centralized schema (shared reference)
├── docker-compose.yml
├── .env.example
├── package.json                  # Root monorepo
├── .replit
├── README.md
├── LICENSE
└── .gitignore
```

## Quick Start

### Prerequisites

- Node.js ≥ 18
- PostgreSQL 14+ (or use Docker)
- Git

### 1. Local Development (Docker)

```bash
# Clone & install
git clone https://github.com/yourusername/security-shifts.git
cd security-shifts
npm install

# Start services
docker-compose up -d

# Setup database
npm run db:migrate
npm run seed

# Run dev servers
npm run dev
```

- Web: http://localhost:3000
- API: http://localhost:4000
- Docs: http://localhost:4000/api

### 2. Local Development (Manual PostgreSQL)

```bash
# Set up .env
cp .env.example .env

# Edit .env with your PostgreSQL connection
# DATABASE_URL="postgresql://user:password@localhost:5432/security_shifts"

npm install
npm run db:migrate
npm run seed

# Start dev servers
npm run dev
```

### 3. Deploy on GitHub

```bash
# Initialize repo
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/security-shifts.git
git branch -M main
git push -u origin main

# GitHub Actions will run tests & lint on push (CI configured in .github/workflows)
```

### 4. Deploy on Replit

**Option A: Import from GitHub**

1. Go to [replit.com](https://replit.com)
2. Click **"Create Replit"** → **"Import from GitHub"**
3. Paste: `https://github.com/yourusername/security-shifts.git`
4. Click **"Import"**
5. In Replit secrets, set:
   - `DATABASE_URL` (Replit PostgreSQL or external)
   - `JWT_SECRET`
   - Other env vars from `.env.example`
6. Click **"Run"** (Replit will use `.replit` config)

**Option B: Clone & Push**

```bash
# In terminal
git clone https://github.com/yourusername/security-shifts.git
cd security-shifts

# Push to new Replit project
replit --create-from-git https://github.com/yourusername/security-shifts.git
```

**Replit Configuration Notes:**

- `.replit` runs: `npm run build && npm run start`
- Web listens on `process.env.PORT` (Replit sets it, typically 3000)
- API listens on port 4000
- Next.js rewrites in `/web/next.config.mjs` proxy `/api/*` → `http://localhost:4000/*`
- CORS is configured to allow `http://localhost:${process.env.PORT}`
- Only one public port (web) is exposed

## Environment Variables

See `.env.example` for all options. Key ones:

| Variable | Default | Notes |
|----------|---------|-------|
| `DATABASE_URL` | (required) | PostgreSQL connection string |
| `JWT_SECRET` | (required) | Change in production |
| `WHATSAPP_PROVIDER` | `mock` | Options: `mock`, `meta`, `twilio` |
| `STORAGE_PROVIDER` | `local` | Options: `local`, `s3` |
| `TZ` | `Europe/Rome` | Timezone for scheduling |
| `CORS_ORIGIN` | `http://localhost:3000` | Frontend URL |

## Database

### Migrations

```bash
# Create a new migration
npm run db:migrate -- --name "add_field"

# Apply migrations
npm run db:migrate

# Open Prisma Studio (GUI)
npm run db:studio
```

### Seed Data

```bash
npm run seed
```

Generates sample operators, shops, shifts, and assignments for testing.

## API Documentation

Run the dev server and visit:

- Swagger UI: `http://localhost:4000/api`
- OpenAPI JSON: `http://localhost:4000/api-json`

### Key Endpoints

**Auth**
- `POST /auth/register` – Create account
- `POST /auth/login` – JWT login
- `POST /auth/refresh` – Refresh token

**Operators**
- `GET /operators` – List all
- `POST /operators` – Create
- `GET /operators/:id` – Details
- `PATCH /operators/:id` – Update
- `DELETE /operators/:id` – Soft delete

**Shifts**
- `GET /shifts` – List with filters (date, shop, operator, status)
- `POST /shifts` – Create
- `GET /shifts/:id` – Details + attendance logs
- `PATCH /shifts/:id` – Update start/end times, notes, status
- `POST /shifts/:id/assignments` – Assign operator(s)
- `POST /shifts/:id/check-in` – Create attendance log

**Attendance**
- `GET /shifts/:id/attendance` – Logs for shift
- `POST /shifts/:id/attendance` – Create (check-in, break, check-out)

**Pay**
- `GET /pay/shifts/:shiftId` – Pay item for shift
- `GET /pay/operators/:operatorId` – Period totals
- `POST /pay/export` – Download CSV/XLSX

**WhatsApp**
- `POST /whatsapp/send-confirmation` – Trigger night-before confirmations
- `POST /whatsapp/webhook` – Inbound webhook

**Import**
- `POST /import/preview` – Dry-run (file upload, column mapping)
- `POST /import/commit` – Actually create shifts/operators/shops

**Files**
- `POST /files/upload` – Upload document/turni file
- `GET /files/:id/download` – Download

## Testing

```bash
# Run all tests (backend)
npm run test

# Watch mode
npm run test -- --watch

# Coverage
npm run test -- --coverage
```

### Key Test Suites

- **Pay Calculation** (`test/pay.spec.ts`)
  - Validates payableMinutes logic
  - Tests rate precedence
  - Confirms calcSnapshot audit trail

- **WhatsApp Parser** (`test/whatsapp-parser.spec.ts`)
  - Parses "OK/✅/NO" replies
  - Validates GPS parsing from group messages
  - Tests timezone-aware scheduling

## Workflows & Features

### 1. Shift Assignment & WhatsApp Confirmation

1. Admin creates shift, assigns operators
2. At 20:00 Europe/Rome, system sends WhatsApp template: *"Ciao {name}, domani {date} dalle {start} alle {end} a {shop}. Confermi? Rispondi OK."*
3. Operator replies "OK" or "NO"
4. Inbound webhook updates `shift_assignments.confirmation_status`
5. Manager gets alert if "NO"

### 2. Check-In/Out with GPS

1. Operator opens `/me/shifts` mobile view
2. Clicks "Start Shift" (captures GPS, creates attendance_log with `eventType=check_in`)
3. Clicks "Start Break" / "End Break" (tracks unpaid time)
4. Clicks "End Shift" (check_out timestamp)
5. All logged with lat/lng for accountability

### 3. Pay Calculation

```
payableMinutes = max(0, (actual_end - actual_start) - sum(unpaid_breaks))
totalCents = payableMinutes * hourlyRateCents / 60

Rate hierarchy:
1. Operator-specific hourly rate
2. Shop-specific default rate
3. Global default rate
4. Fallback: 15.00 EUR/hour
```

### 4. Import "Turni" CSV/XLSX

1. Upload file (column auto-detection)
2. Map columns: `shop_name`, `date`, `start_time`, `end_time`, `unpaid_break_minutes`, `notes`, `operator_phone`
3. Preview mode shows what will be created
4. Options: auto-create missing shops/operators
5. Commit to database

### 5. Document Expiry Reminders

1. Upload operator documents (contracts, permits, ID)
2. Set expiry date and notification threshold (e.g., 30 days before)
3. Daily job checks docs; if within threshold, sends WhatsApp alert
4. Links to renewal workflow in UI

## Roles & Permissions

| Role | Features |
|------|----------|
| **Admin** | Full access; create/delete operators & shops; configure system |
| **Manager** | Assign operators; edit shifts; approve check-ins; view reports |
| **Operator** | View own shifts; check-in/out; request changes |
| **Read-Only** | View-only access to dashboards & reports |

Route guards enforce these via `@UseGuards(JwtAuthGuard, RbacGuard)` and `@Roles(...)` decorators.

## File Upload & Storage

Supports local & S3 storage:

```javascript
// .env
STORAGE_PROVIDER=s3
AWS_S3_BUCKET=my-bucket
AWS_S3_REGION=eu-west-1
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
```

## WhatsApp Integration

### Providers

1. **Mock** (default for testing)
   - Logs to console; no real sends
2. **Meta/Twilio** (production)
   - Set API keys in `.env`
   - Webhook parses inbound messages

### Message Types

- **Templates** – Pre-approved confirmations (20:00 daily)
- **Freeform** – Alerts, reminders, group commands
- **Group Keywords** – `IN`, `BREAK START`, `BREAK END`, `OUT` (with optional GPS)

## Timezone & Scheduling

All times use Europe/Rome by default. Configure in `.env`:

```bash
TZ=Europe/Rome
```

Jobs use node-cron + node-schedule for:

- 20:00 daily: Send WhatsApp confirmations
- 06:00 daily: Check document expiries, send reminders
- Hourly: Batch process queued notifications

## Rate Limiting

Configured in API:

- **Auth endpoints:** 5 requests per 15 min per IP
- **Webhooks:** 10 requests per 15 min per source
- **General:** 100 requests per 15 min per user token

Customize in `.env`: `RATE_LIMIT_WINDOW_MS`, `RATE_LIMIT_MAX_REQUESTS`.

## Logging & Monitoring

- API logs to console + file (`logs/app.log`)
- Structured JSON logging for production
- Error tracking: Sentry integration ready (configure in `.env`)

## Contributing

1. Fork repo
2. Create feature branch: `git checkout -b feature/my-feature`
3. Commit: `git commit -m "feat: add feature"`
4. Push & open PR

## License

MIT – See LICENSE file

## Support

- **Issues:** [GitHub Issues](https://github.com/yourusername/security-shifts/issues)
- **Docs:** [Full API Docs](http://localhost:4000/api)
- **Slack:** [Join Community](#)

## Deployment Checklist

- [ ] Set strong `JWT_SECRET` in `.env`
- [ ] Configure `DATABASE_URL` to production PostgreSQL
- [ ] Set `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`
- [ ] Configure S3 or persistent storage for uploads
- [ ] Set `NODE_ENV=production`
- [ ] Enable HTTPS (Replit/GitHub Pages auto-handle this)
- [ ] Run `npm run test` to verify
- [ ] Run `npm run db:migrate` to apply migrations
- [ ] Test WhatsApp webhook by sending reply
- [ ] Monitor logs for errors

---

**Built with ❤️ for security professionals**
