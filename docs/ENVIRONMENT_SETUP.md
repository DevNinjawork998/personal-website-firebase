# Environment Variables Setup Guide

This guide explains how to configure environment variables for local development and production deployment.

## 🔐 Overview

This application uses environment variables to securely manage API keys and configuration. The variables are:

**EmailJS Configuration:**

- `REACT_APP_EMAILJS_SERVICE_ID` - EmailJS service identifier
- `REACT_APP_EMAILJS_TEMPLATE_ID` - EmailJS template identifier
- `REACT_APP_EMAILJS_PUBLIC_KEY` - EmailJS public key

**Firebase Configuration:**

- `REACT_APP_FIREBASE_API_KEY` - Firebase API key
- `REACT_APP_FIREBASE_AUTH_DOMAIN` - Firebase auth domain
- `REACT_APP_FIREBASE_PROJECT_ID` - Firebase project ID
- `REACT_APP_FIREBASE_STORAGE_BUCKET` - Firebase storage bucket
- `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` - Firebase messaging sender ID
- `REACT_APP_FIREBASE_APP_ID` - Firebase app ID
- `REACT_APP_FIREBASE_MEASUREMENT_ID` - Firebase measurement ID (Analytics)

**Important:** In React apps built with Create React App, environment variables are embedded into the JavaScript bundle at **build time**, not runtime.

## 💻 Local Development

1. **Create `.env` file:**

   ```bash
   cp .env.example .env
   ```

2. **Add your values** - Edit `.env` with actual credentials (see `.env.example` for format)

3. **Restart dev server:**

   ```bash
   npm start
   ```

**Note:** `.env` is gitignored and never committed.

## 🚀 GitHub Actions / Production Setup

### Step 1: Add secrets to GitHub

1. Go to your GitHub repository
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **"New repository secret"**
4. Add each secret:

**EmailJS Secrets:**

- Name: `REACT_APP_EMAILJS_SERVICE_ID`, Value: `service_hwqll8d`
- Name: `REACT_APP_EMAILJS_TEMPLATE_ID`, Value: `template_c5rhw4u`
- Name: `REACT_APP_EMAILJS_PUBLIC_KEY`, Value: `ySL3BCd11PVoaUDpM`

**Firebase Secrets:**

- Name: `REACT_APP_FIREBASE_API_KEY`, Value: `AIzaSyBxl3XAJPdJCsulNW_y986yWZI71RRNnkI`
- Name: `REACT_APP_FIREBASE_AUTH_DOMAIN`, Value: `personal-website-3580d.firebaseapp.com`
- Name: `REACT_APP_FIREBASE_PROJECT_ID`, Value: `personal-website-3580d`
- Name: `REACT_APP_FIREBASE_STORAGE_BUCKET`, Value: `personal-website-3580d.appspot.com`
- Name: `REACT_APP_FIREBASE_MESSAGING_SENDER_ID`, Value: `508647798578`
- Name: `REACT_APP_FIREBASE_APP_ID`, Value: `1:508647798578:web:82dc231a174aa0cbb0892b`
- Name: `REACT_APP_FIREBASE_MEASUREMENT_ID`, Value: `G-QGWC8Z9P92`

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
    # These secrets are injected during build
    # EmailJS Configuration
    REACT_APP_EMAILJS_SERVICE_ID: ${{ secrets.REACT_APP_EMAILJS_SERVICE_ID }}
    REACT_APP_EMAILJS_TEMPLATE_ID: ${{ secrets.REACT_APP_EMAILJS_TEMPLATE_ID }}
    REACT_APP_EMAILJS_PUBLIC_KEY: ${{ secrets.REACT_APP_EMAILJS_PUBLIC_KEY }}
    # Firebase Configuration
    REACT_APP_FIREBASE_API_KEY: ${{ secrets.REACT_APP_FIREBASE_API_KEY }}
    REACT_APP_FIREBASE_AUTH_DOMAIN: ${{ secrets.REACT_APP_FIREBASE_AUTH_DOMAIN }}
    REACT_APP_FIREBASE_PROJECT_ID: ${{ secrets.REACT_APP_FIREBASE_PROJECT_ID }}
    REACT_APP_FIREBASE_STORAGE_BUCKET: ${{ secrets.REACT_APP_FIREBASE_STORAGE_BUCKET }}
    REACT_APP_FIREBASE_MESSAGING_SENDER_ID: ${{ secrets.REACT_APP_FIREBASE_MESSAGING_SENDER_ID }}
    REACT_APP_FIREBASE_APP_ID: ${{ secrets.REACT_APP_FIREBASE_APP_ID }}
    REACT_APP_FIREBASE_MEASUREMENT_ID: ${{ secrets.REACT_APP_FIREBASE_MEASUREMENT_ID }}
  run: npm run build
```

### Step 3: Add Firebase service account for deployment (if not already done)

For Firebase Hosting deployment, you also need:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Add: `FIREBASE_SERVICE_ACCOUNT` (JSON content of your service account key)

To get this:

- Run `firebase init hosting:github` in your project, OR
- Go to Firebase Console → Project Settings → Service Accounts → Generate New Private Key
- Copy the entire JSON content as the secret value

## 🐛 Troubleshooting

**Blank screen / App not loading:**

- Ensure `.env` exists in project root
- Restart dev server after creating/editing `.env`
- Check browser console for errors

**Variables showing as undefined:**

- Variable names must start with `REACT_APP_`
- No spaces around `=` in `.env` file
- Must restart server after `.env` changes

**GitHub Actions failing:**

- Verify all 11 secrets are added (case-sensitive names)
- Check workflow logs for specific errors
- Ensure secrets are in **Actions** section (not Environments)

## 🔒 Security Notes

- Never commit `.env` files
- Never hardcode secrets in source code
- Firebase & EmailJS client keys are public by design (security is server-side)
- Keep service account keys out of frontend code

## 📝 Key Points

- Environment variables are embedded at **build time**, not runtime
- Local: `.env` file
- Production: GitHub Actions secrets injected during build
- Always restart dev server after `.env` changes
