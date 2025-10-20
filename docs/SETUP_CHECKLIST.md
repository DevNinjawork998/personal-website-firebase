# 🚀 Quick Setup

## Local Development

```bash
# 1. Create .env file
cp .env.example .env

# 2. Edit .env and add your credentials
# (See .env.example for variable names)

# 3. Start dev server
npm start
```

## GitHub Actions (Production)

### Add 11 Secrets to GitHub

**Go to:** Your Repo → Settings → Secrets and variables → Actions → New repository secret

**Add these secrets:**

**EmailJS (3):**

- `REACT_APP_EMAILJS_SERVICE_ID`
- `REACT_APP_EMAILJS_TEMPLATE_ID`
- `REACT_APP_EMAILJS_PUBLIC_KEY`

**Firebase (7):**

- `REACT_APP_FIREBASE_API_KEY`
- `REACT_APP_FIREBASE_AUTH_DOMAIN`
- `REACT_APP_FIREBASE_PROJECT_ID`
- `REACT_APP_FIREBASE_STORAGE_BUCKET`
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`
- `REACT_APP_FIREBASE_APP_ID`
- `REACT_APP_FIREBASE_MEASUREMENT_ID`

**Deployment (1):**

- `FIREBASE_SERVICE_ACCOUNT_PERSONAL_WEBSITE_3580D` ← Get from Firebase Console

### Deploy

Push to `master`/`main` → GitHub Actions builds & deploys automatically ✅

## Troubleshooting

| Issue               | Fix                                         |
| ------------------- | ------------------------------------------- |
| Blank screen        | Restart dev server after creating `.env`    |
| Variables undefined | Names must start with `REACT_APP_`          |
| Build fails         | Check all 11 secrets added (case-sensitive) |

---

**See `ENVIRONMENT_SETUP.md` for detailed guide**
