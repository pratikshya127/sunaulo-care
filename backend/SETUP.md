# Sunaulo Backend — Setup Guide

## Prerequisites
- PHP 8.2+
- Composer
- MySQL 8+
- Node.js (already installed)

## Step 1 — Create a fresh Laravel 11 project
```bash
composer create-project laravel/laravel sunaulo-api
cd sunaulo-api
```

## Step 2 — Copy custom files
Copy the entire contents of this `backend/` folder into your fresh `sunaulo-api/` project,
replacing any files that already exist.

## Step 3 — Configure environment
```bash
cp .env.example .env
php artisan key:generate
```

Edit `.env`:
```
DB_DATABASE=sunaulo
DB_USERNAME=root
DB_PASSWORD=your_password
FRONTEND_URL=http://localhost:5173
```

## Step 4 — Create the database
```sql
CREATE DATABASE sunaulo;
```

## Step 5 — Run migrations and seed demo data
```bash
php artisan migrate --seed
```

This creates 3 demo accounts:
| Role      | Email                    | Password |
|-----------|--------------------------|----------|
| Caregiver | caregiver@sunaulo.app    | password |
| Family    | family@sunaulo.app       | password |
| Elderly   | elderly@sunaulo.app      | password |

## Step 6 — Install Sanctum and publish config
```bash
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
php artisan storage:link
```

## Step 7 — Start the API server
```bash
php artisan serve
# Runs on http://localhost:8000
```

## Step 8 — Start the frontend (in a separate terminal)
```bash
# In the project root (sunaulo-care-connect-main/)
npm run dev
# Runs on http://localhost:5173
```

## API Base URL
The frontend connects to `http://localhost:8000/api` by default.
To change it, add `VITE_API_URL=http://your-api-url/api` to the frontend `.env.local`.

## Full API Reference
| Method | Endpoint                          | Auth | Role       | Description               |
|--------|-----------------------------------|------|------------|---------------------------|
| POST   | /api/register                     | No   | Any        | Register                  |
| POST   | /api/login                        | No   | Any        | Login                     |
| POST   | /api/logout                       | Yes  | Any        | Logout                    |
| GET    | /api/user                         | Yes  | Any        | Current user              |
| GET    | /api/dashboard                    | Yes  | Any        | Role-based summary        |
| GET    | /api/elderly                      | Yes  | Caregiver  | List elderly              |
| POST   | /api/elderly                      | Yes  | Caregiver  | Add elderly               |
| PUT    | /api/elderly/{id}                 | Yes  | Caregiver  | Update elderly            |
| DELETE | /api/elderly/{id}                 | Yes  | Caregiver  | Delete elderly            |
| GET    | /api/health-records               | Yes  | All        | List health records       |
| POST   | /api/health-records               | Yes  | Caregiver  | Add health record         |
| GET    | /api/medicines                    | Yes  | All        | List medicines            |
| POST   | /api/medicines                    | Yes  | Caregiver  | Add medicine              |
| PUT    | /api/medicines/{id}               | Yes  | Caregiver  | Update medicine           |
| DELETE | /api/medicines/{id}               | Yes  | Caregiver  | Deactivate medicine       |
| GET    | /api/medicine-logs                | Yes  | All        | List today's logs         |
| POST   | /api/medicine-logs                | Yes  | Elderly    | Log taken/skipped         |
| GET    | /api/notifications                | Yes  | All        | List notifications        |
| POST   | /api/notifications/{id}/read      | Yes  | All        | Mark read                 |
| POST   | /api/notifications/read-all       | Yes  | All        | Mark all read             |
| GET    | /api/sos-alerts                   | Yes  | All        | List SOS alerts           |
| POST   | /api/sos-alerts                   | Yes  | Elderly    | Trigger SOS               |
| PUT    | /api/sos-alerts/{id}              | Yes  | Caregiver  | Resolve SOS               |
| GET    | /api/voice-messages               | Yes  | All        | List voice messages       |
| POST   | /api/voice-messages               | Yes  | All        | Send voice message        |
| DELETE | /api/voice-messages/{id}          | Yes  | All        | Delete voice message      |
| GET    | /api/reports/health               | Yes  | Caregiver/Family | Health report       |
| GET    | /api/reports/medicines            | Yes  | Caregiver/Family | Medicine compliance |
