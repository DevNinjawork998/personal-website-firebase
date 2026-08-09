# Environment Variables Setup Guide

This guide explains how to configure environment variables for local development and production deployment.

## 🔐 Overview

This application uses environment variables to securely manage API keys and configuration. The variables are:

**Firebase Configuration:**

- `REACT_APP_FIREBASE_API_KEY` - Firebase API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `REACT_APP_FIREBASE_PROJECT_ID` - Firebase project ID
- `REACT_APP_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `REACT_APP_FIREBASE_APP_ID` - Firebase app ID
- `REACT_APP_FIREBASE_MEASUREMENT_ID` - Firebase measurement ID (Analytics)

**Important:** This is a Vite application. Environment variables are embedded into the JavaScript bundle at **build time**, not runtime. Vite only exposes variables prefixed with `VITE_` to the app.

## 💻 Local Development

For local development, use `VITE_` prefix in your `.env` file:

1. **Create `.env` file:**

   ```bash
   cp .env.example .env
   ```

2. **Add your values** with `VITE_` prefix:

   ```bash
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   # etc.
   ```

3. **Restart dev server:**

   ```bash
   npm run dev
   ```

**Note:** `.env` is gitignored and never committed.

## 🚀 GitHub Actions / Production Setup

### Step 1: Add secrets to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add each secret:

### Step 2: GitHub Actions workflow

The workflow file at `.github/workflows/deploy.yml` will automatically:

1. Check out your code
2. Install dependencies
3. Run tests
4. **Inject secrets as environment variables during the build step**
5. Build the production bundle (with secrets baked in)
6. Deploy to Firebase Hosting

Key section of the workflow:

```yaml
- name: Build application
  env:
    # Map GitHub secrets (REACT_APP_*) to Vite env vars (VITE_*)
    # Vite only exposes variables prefixed with VITE_ to the app
    # Firebase Configuration
    VITE_FIREBASE_API_KEY: ${{ secrets.REACT_APP_FIREBASE_API_KEY }}
    VITE_FIREBASE_AUTH_DOMAIN: ${{ secrets.REACT_APP_FIREBASE_AUTH_DOMAIN }}
    VITE_FIREBASE_PROJECT_ID: ${{ secrets.REACT_APP_FIREBASE_PROJECT_ID }}
    VITE_FIREBASE_STORAGE_BUCKET: ${{ secrets.REACT_APP_FIREBASE_STORAGE_BUCKET }}
    VITE_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.REACT_APP_FIREBASE_MESSAGING_SENDER_ID }}
    VITE_FIREBASE_APP_ID: ${{ secrets.REACT_APP_FIREBASE_APP_ID }}
    VITE_FIREBASE_MEASUREMENT_ID: ${{ secrets.REACT_APP_FIREBASE_MEASUREMENT_ID }}
  run: npm run build
```

**Note:** GitHub secrets use `REACT_APP_*` naming (historical), but they are mapped to `VITE_*` environment variables during the build because Vite only exposes variables prefixed with `VITE_` to the application.

### Step 3: Add Firebase service account for deployment (if not already done)

For Firebase Hosting deployment, you also need:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add: `FIREBASE_SERVICE_ACCOUNT_[YOUR_PROJECT_ID]` (JSON content of your service account key)

To get this:

- Run `firebase init hosting:github` in your project (it will create the secret automatically), OR
- Go to Firebase Console → Project Settings → Service Accounts → Generate New Private Key
- Copy the entire JSON content as the secret value

## 🐛 Troubleshooting

**Blank screen / App not loading:**

- Ensure `.env` exists in project root
- Restart dev server after creating/editing `.env`
- Check browser console for errors

**Variables showing as undefined:**

- Local `.env` variable names must start with `VITE_`
- No spaces around `=` in `.env` file
- Must restart server after `.env` changes

**GitHub Actions failing:**

- Verify all 11 secrets are added (case-sensitive names)
- Check workflow logs for specific errors
- Ensure secrets are in **Actions** section (not Environments)

## 🔒 Security Notes

- Never commit `.env` files
- Never hardcode secrets in source code
- Firebase client keys are public by design (security is server-side)
- Keep service account keys out of frontend code

## 📝 Key Points

- Environment variables are embedded at **build time**, not runtime
- Local: `.env` file
- Production: GitHub Actions secrets injected during build
- Always restart dev server after `.env` changes
