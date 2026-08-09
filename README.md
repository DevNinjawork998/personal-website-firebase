# Personal Portfolio Website

A modern, responsive personal portfolio website built with React and TypeScript, featuring contact form integration, Firebase backend, and Google Analytics tracking.

## 🚀 Tech Stack

### Core

- **React** (v18.2) with **TypeScript** - UI framework
- **Vite** - Build tooling
- **Chakra UI** - Component library & styling

### Services & Integration

- **Firebase** - Backend services
  - Firestore - Database for projects
  - Hosting - Deployment platform
  - Analytics - User tracking
- **Framer Motion** - Animations

### Testing & CI/CD

- **Vitest & React Testing Library** - Unit & integration tests
- **GitHub Actions** - Automated deployment

## 🎯 Features

- ✨ Modern, responsive design with glassmorphism effects
- 🗂️ Dynamic projects section powered by Firestore
- 📊 Google Analytics integration
- 🔒 Environment-based configuration
- ✅ Comprehensive test coverage
- 🚀 Automated CI/CD pipeline

## 🛠️ Quick Start

### Prerequisites

- Node.js (v20+)
- npm or yarn
- Firebase account

### Installation

```bash
# Clone the repository
git clone <your-repo-url>

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm start
```

Visit [http://localhost:3000](http://localhost:3000) to view the app.

## 📜 Available Scripts

| Command           | Description                                |
| ----------------- | ------------------------------------------ |
| `npm start`       | Start development server at localhost:3000 |
| `npm test`        | Run tests in watch mode                    |
| `npm run test:ci` | Run tests with coverage for CI             |
| `npm run build`   | Build production bundle                    |
| `npm run format`  | Format code with Prettier                  |

## 🔧 Configuration

### Environment Variables

This project requires environment variables for external services. See detailed setup in:

- **Quick setup:** [`SETUP_CHECKLIST.md`](./SETUP_CHECKLIST.md)
- **Detailed guide:** [`ENVIRONMENT_SETUP.md`](./ENVIRONMENT_SETUP.md)

**Required variables:**

- Firebase configuration (7 variables)

### Firebase Setup

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Firestore Database
3. Create a `projects` collection
4. Add Firebase config to your `.env` file

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Header.tsx
│   ├── LandingSection.tsx
│   ├── ProjectsSection.tsx
│   ├── ContactMeSection.tsx
│   └── ...
├── services/           # External integrations
│   └── projectsService.ts # Firebase Firestore
├── hooks/              # Custom React hooks
├── config/             # Configuration files
│   └── firebase.ts        # Firebase setup
└── __tests__/          # Test files
```

## 🧪 Testing

```bash
# Run tests in watch mode
npm test

# Run tests with coverage
npm run test:coverage

# Run tests for CI (non-interactive)
npm run test:ci
```

## 🚀 Deployment

### Manual Deployment

```bash
# Build the project
npm run build

# Deploy to Firebase
firebase deploy
```

### Automated Deployment (GitHub Actions)

The project includes GitHub Actions workflows for automated deployment:

- **Push to `master`/`main`** → Automatically builds and deploys
- **Pull requests** → Preview deployment

**Setup required:**

1. Add GitHub secrets (see `SETUP_CHECKLIST.md`)
   - 7 environment variable secrets (Firebase config)
   - 1 Firebase service account secret: `FIREBASE_SERVICE_ACCOUNT_[YOUR_PROJECT_ID]`
2. Push to trigger deployment

See [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml) for workflow details.

## 📧 Contact Section

A static call-to-action: a `mailto:` link plus GitHub and LinkedIn links. No form, no third-party email service.

## 🗂️ Projects Section

Projects are stored in Firebase Firestore and can be:

- ✏️ Edited without code changes
- 📊 Ordered by priority
- 🖼️ Include images and links
- 🏷️ Tagged with technologies

**Firestore collection:** `projects`

**Document structure:**

```typescript
{
  title: string;
  description: string;
  imageSrc: string;
  url: string;
  tech: string[];
  order: number;
}
```

## 🔐 Security Notes

- Firebase API keys are public by design (security via Firestore rules)
- Never commit `.env` files
- GitHub secrets are encrypted and injected at build time
- Service account keys should never be in frontend code

## 📚 Additional Resources

- **Setup Guide:** [`ENVIRONMENT_SETUP.md`](./ENVIRONMENT_SETUP.md)
- **Quick Checklist:** [`SETUP_CHECKLIST.md`](./SETUP_CHECKLIST.md)
- **Firebase Setup:** [`FIREBASE_SETUP.md`](./FIREBASE_SETUP.md)

## 📖 Learn More

- [Vite Documentation](https://vite.dev/)
- [React Documentation](https://reactjs.org/)
- [Chakra UI Components](https://chakra-ui.com/docs/components)
- [Firebase Documentation](https://firebase.google.com/docs)

## 🎨 UI Features

- Glassmorphism design effects
- Smooth scroll animations
- Responsive navigation
- Dark theme optimized
- Accessible components (Chakra UI)

## 🔮 Future Enhancements

- [ ] Blog section with CMS
- [ ] Project filtering by technology
- [ ] Dark/light mode toggle
- [ ] Multi-language support
- [ ] Enhanced analytics dashboard
- [ ] PDF resume download

## 📄 License

This project is for personal use and portfolio demonstration.

---

**Built with ❤️ using React, TypeScript, and Firebase**
