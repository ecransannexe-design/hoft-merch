# Supabase Setup — HOFT Merchandising

## 1 — Create project

Go to https://supabase.com/dashboard → New project.
Choose a region close to Canada (e.g. us-east-1).

---

## 2 — Run the schema

1. Open your project → **SQL Editor** → **New query**
2. Paste the contents of `supabase/schema.sql`
3. Click **Run**

---

## 3 — Create storage buckets

In your Supabase project → **Storage** → **New bucket**:

| Bucket name | Public | Purpose |
|---|---|---|
| `visit-photos` | ✅ Yes | All audit photos |
| `signatures` | ✅ Yes | Signature PNGs |

Then for each bucket → **Policies** → **New policy** → "Allow all operations" (for MVP).

---

## 4 — Get your credentials

**Settings** → **API**:

| Variable | Where to find it |
|---|---|
| `VITE_SUPABASE_URL` | "Project URL" |
| `VITE_SUPABASE_ANON_KEY` | "anon public" key |

Create a `.env` file in `hoft-app/`:

```
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

> **Never commit `.env` to git** — it's in `.gitignore`.

---

## 5 — Test the connection

```bash
cd hoft-app
npm run dev
```

Open the app → complete a visit → check the Supabase dashboard → **Table Editor** → visits.
The row should appear within seconds.

---

## 6 — Production hardening (before App Store)

- Add Supabase Auth (email OTP or social login)
- Replace permissive RLS policies with user-scoped policies
- Enable storage bucket policies per user
- Enable Supabase Audit Logs
- Set up automated backups (Pro plan)
