# Charis — Dev Setup

## Prerequisites
- **Node.js** v18+ — https://nodejs.org (LTS)
- **Git** — https://git-scm.com

---

## 1. Clone & enter the project

```bash
git clone <repo-url>
cd Charis/charis
```

---

## 2. Install dependencies

```bash
npm install
```

---

## 3. Create your `.env`

**Mac / Linux:**
```bash
cp .env.example .env
```

**Windows:**
```bash
copy .env.example .env
```

---

## 4. Start the dev server

```bash
npm run dev
```

Open `http://localhost:5173`

---

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build |
| `npm run type-check` | TypeScript check |

---

## Windows note
If any `npx tailwindcss` command fails, use:
```bash
node node_modules/tailwindcss/lib/cli.js <command>
```



AAAAAAAA Jacob
