# Dental App Backend

Node.js + Express 5 API for the dental patient app and admin web panel.

**Production URL:** https://dental-backend-0e7e.onrender.com

## Prerequisites

- [Node.js](https://nodejs.org/) 18+
- MongoDB (local or [MongoDB Atlas](https://www.mongodb.com/atlas))

## Local development

```bash
cd dental_app_2025_backend
npm install
cp .env.example .env
# Edit .env — use PORT=10000 to match Flutter ApiConfig local URL
npm start
```

Health check: `GET http://localhost:10000/` → `Dental API Running`

### Connect Flutter apps locally

In **dental_admin_web** / **dental_app_flutter_2025**, open `lib/config/api_config.dart` (or `app_config.dart`) and set:

```dart
static const bool useLocalBackend = true;
```

Hot restart the Flutter app. Switch back to `false` for Render.

## Deploy to Render

After changing backend code locally, deploy so the patient app and admin (on Render mode) get the updates.

### One-time Render setup

1. [Render Dashboard](https://dashboard.render.com) → **New Web Service**
2. Connect the `dental_app_2025_backend` Git repo
3. Settings:
   - **Build command:** `npm install`
   - **Start command:** `npm start`
   - **Environment:** Node

4. Add **Environment Variables** (same as `.env`, never commit real values):

   | Key | Description |
   |-----|-------------|
   | `PORT` | Render sets this automatically (usually `10000`) |
   | `MONGO_URI` | MongoDB Atlas connection string |
   | `JWT_SECRET` | Strong random secret |
   | `RESEND_API_KEY` | Email service key |
   | `FIREBASE_SERVICE_ACCOUNT` | Full JSON string for push notifications |

5. Deploy → note the service URL (e.g. `https://dental-backend-0e7e.onrender.com`)

### Deploy after code changes

If Render is connected to your Git repo with **Auto-Deploy** enabled:

```bash
cd dental_app_2025_backend
git add .
git commit -m "Describe your API changes"
git push origin main
```

Render rebuilds and redeploys automatically (usually 2–5 minutes).

**Manual deploy:** Render Dashboard → your service → **Manual Deploy** → **Deploy latest commit**

### Verify deployment

```bash
curl https://dental-backend-0e7e.onrender.com/
# → Dental API Running
```

Then set Flutter `useLocalBackend = false` and test the admin / patient app against Render.

## Recommended workflow

```
1. Change backend code locally
2. npm start → test with Flutter (useLocalBackend = true)
3. git commit + git push → Render auto-deploys
4. Flutter useLocalBackend = false → confirm on Render
5. Patient app on phones already uses Render — no app update needed for API-only changes
```

## API modules

| Prefix | Purpose |
|--------|---------|
| `/api/auth` | Register, login, FCM token, password reset |
| `/api/patients` | Patient CRUD & profiles |
| `/api/dentists` | Dentist CRUD & slots |
| `/api/appointments` | Appointments (admin + app flows) |
| `/api/payments` | Payments |
| `/api/attendance` | Dentist attendance |
| `/api/ourservices` | Service videos |
| `/api/exportData` | CSV export |
| `/api/testimonials` | Reviews |

## Project layout

```
Dental/
├── dental_app_2025_backend/   ← this repo (deploy to Render)
├── dental_admin_web/          ← Flutter admin panel
└── dental_app_flutter_2025/   ← Flutter patient app
```

Both Flutter apps share this backend. API-only changes deploy via Render without rebuilding mobile apps.
