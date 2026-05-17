# Charish

> **AWSHacks 2026 submission**
> A volunteer platform that rewards good deeds with real-world perks.

---

## The Problem

Volunteer organizations struggle to attract and retain volunteers. People want to give back, but life is busy and the immediate rewards are intangible. Meanwhile, local restaurants want foot traffic and a way to support their community.

**Charish bridges all three.** Volunteers show up to events, organizations get the help they need, and partner restaurants reward volunteers with discount coupons — turning a one-sided ask into a three-way win.

---

## How It Works

```
1. Organization posts an event
            ↓
2. User browses and applies
            ↓
3. Organization approves the application
            ↓
4. System auto-generates a ticket with a unique QR code
            ↓
5. Volunteer shows up, organization scans the QR at check-in
            ↓
6. Restaurant coupon is auto-issued to the volunteer
   (with their dietary preferences honored)
```

The whole loop — from posting an event to issuing a reward — runs on automation. No manual ticket creation, no manual coupon issuance, no spreadsheets.

---

## What We Built

In one hackathon weekend, we shipped a complete end-to-end platform:

### Backend (Flask REST API)
- **6 resource groups** — users, organizations, events, applications, tickets, coupons.
- **Full CRUD operations** across all entities.
- **Auto-issuance logic** — tickets are created the moment an application is approved; coupons are created the moment a ticket is used.
- **Dietary preference propagation** — coupons inherit the user's vegetarian flag so restaurants can serve the right meal without asking.
- **Health and DB-check endpoints** for monitoring.

### Serverless QR Code Generator (AWS Lambda)
- A standalone Lambda function that generates **SVG QR codes** on demand.
- SVG output means QR codes render crisply at any size — phone screen, paper printout, projector.
- Decoupled from the main API so it can scale independently and be reused by other projects.

### Frontend (Vue 3 + TypeScript)
- **Two role-based views** — volunteer view and organization view.
- Volunteers can browse events, apply, and pull up their QR code at check-in.
- Organizations can manage events, review applicants, and scan QR codes to issue rewards.

### Cloud Infrastructure
We went full AWS to match the hackathon theme:

| Service | What we used it for |
|---------|---------------------|
| **App Runner** | Hosts the containerized Flask API |
| **ECR** | Stores our Docker images |
| **RDS (PostgreSQL)** | Persistent storage with SSL-enforced connections |
| **Lambda** | Serverless QR code generation |

---

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Backend | Python 3.11 + Flask | Fast to iterate, great for REST APIs |
| Database | PostgreSQL on AWS RDS | Managed, reliable, SSL out of the box |
| Hosting | AWS App Runner + Docker + ECR | Zero-config container deployment |
| QR generation | AWS Lambda + `qrcode` 8.2 | Serverless, scales to zero when idle |
| Frontend | Vue 3 + TypeScript + Vite | Type-safe, fast HMR, small bundle |
| Transport | REST + JSON over HTTPS | Universal and easy to debug |

---

## Architecture at a Glance

```
┌─────────────────────────────────────────────────────────────┐
│                    AWS Cloud Environment                    │
│                                                             │
│   ┌──────────────┐       ┌──────────────┐                   │
│   │  App Runner  │──────▶│   RDS        │                   │
│   │  (Flask API) │  SSL  │  PostgreSQL  │                   │
│   └──────┬───────┘       └──────────────┘                   │
│          │                                                  │
│          ▼                                                  │
│   ┌──────────────┐                                          │
│   │   Lambda     │                                          │
│   │  (QR codes)  │                                          │
│   └──────────────┘                                          │
│          ▲                                                  │
└──────────┼──────────────────────────────────────────────────┘
           │ HTTPS / REST + JSON
           │
   ┌───────┴────────┐
   │   Vue 3 SPA    │
   │  (Vite build)  │
   └────────────────┘
```

Full architectural design is in [`architecture-design.md`](./architecture-design.md).

---

## Try It Yourself

### Run the backend locally

```bash
cd backend
pip install -r requirements.txt
python3 main.py
```

API runs at `http://localhost:5000`. Verify it's up:

```bash
curl http://localhost:5000/health
curl http://localhost:5000/db-check
```

### Run the frontend locally

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`.

### Environment variables

The backend needs these (we'll provide a `.env` to the judging panel separately):

| Variable | Description |
|----------|-------------|
| `DB_HOST` | RDS endpoint |
| `DB_PORT` | Database port (5432) |
| `DB_NAME` | Database name |
| `DB_USER` | Database username |
| `DB_PASSWORD` | Database password |
| `DB_SSLMODE` | SSL mode (`require`) |

---

## Honest Tradeoffs (What We'd Do With More Time)

We were upfront with ourselves about what to cut to ship something complete. Here's what we'd tackle next:

### 1. Authentication — the biggest known gap
We **skipped authentication entirely** to focus on getting the core flow working end-to-end. In production this would be unacceptable, but for a hackathon build it let us demo the full volunteer → ticket → coupon loop. Given another day, we'd add:
- JWT-based login for users and organizations.
- Role-based access control (only event owners can approve applications for their events).
- Password hashing and secure session management.
- Rate limiting on public endpoints.

### 2. Database security
The database is reachable via SSL, but with auth missing, the API itself is the weak link. Adding auth (above) closes the loop. We'd also add database-level row security and tighter IAM policies on RDS.

### 3. Other extensions we sketched but didn't build
- **Email/SMS notifications** on approval and event reminders.
- **Search & filters** on the events list (city, date, cause).
- **Restaurant coupon redemption** — restaurants need a way to scan and validate coupons.
- **Event capacity enforcement** — stop accepting applications once `volunteers_amount` is reached.
- **Multi-language support** — at minimum English + Traditional Chinese.
- **Automated tests** — unit + integration + end-to-end.
- **CI/CD via GitHub Actions** for auto-deploy on merge.

---

## Why We Think This Matters

Volunteering shouldn't be a chore. By creating a frictionless loop — apply, show up, get rewarded — Charish makes giving back feel as easy as ordering takeout. The local restaurant partnership means rewards come from the same community the volunteers are helping, keeping value circulating locally.

Built on AWS-native services, the platform scales from one event to one thousand without infrastructure changes. The serverless QR generator alone could power check-ins for any event platform.

---

## Team — Charish @ AWSHacks 2026

_Add team member names, roles, and contact info here._

---

## Repository Layout

```
charish/
├── backend/
│   ├── main.py              # Flask app entry point
│   ├── requirements.txt
│   ├── Dockerfile
│   └── deploy.sh            # Build + push to ECR
├── frontend/                # Vue 3 + TypeScript + Vite
│   ├── src/
│   ├── package.json
│   └── vite.config.ts
├── lambda/
│   ├── lambda_function.py   # QR code generator
│   └── qrcode/              # Bundled qrcode 8.2 library
├── architecture-design.md   # Full architectural breakdown
└── README.md                # You are here
```

Thanks for taking the time to review our project!
