# Introduction

This is a personal project for me to enhance my skillsets using the Reactjs framework. Building on the accomplishment I build from the calculator project. This project introduce a more in depth challenge for me to use Reactjs hooks functionality.
Will be improve the website from time to time. Adding more interactive elements for user to explore my bio.

# Libraries Used

List of libraries used:

- ## React App with TypeScript Template

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

- ## Chakra UI

Chakra UI comes pre-configured with this lab, so you don't have to worry about installing it or setting it up.

The components from this library you will need to use are already imported from the `@chakra-ui/react` package at the top of each corresponding file.
If you don't see a component already imported, it's because you probably won't need it.
In any case, feel free to check their official [documentation](https://chakra-ui.com/docs/components) to see all the components at your disposal and their corresponding props.

- ## Google Analytics

Implemented Google Analytics to analyse and capture user traffic data to further understand number of visits and demographics.

- ## EmailJS Integration

The contact form uses EmailJS for client-side email functionality, allowing users to send messages directly from the website without requiring a backend server.

### Features

- **Client-side email sending** using EmailJS service
- **Form validation** with real-time error feedback
- **Fallback mechanism** with mailto links and clipboard copy
- **Responsive design** with glassmorphism UI effects
- **Loading states** and success/error notifications

### EmailJS Configuration

The EmailJS service is configured using environment variables in `.env.local`:

```bash
REACT_APP_EMAILJS_SERVICE_ID=your_service_id
REACT_APP_EMAILJS_PUBLIC_KEY=your_public_key
REACT_APP_EMAILJS_TEMPLATE_ID=your_template_id
```

### Setup Instructions

1. **Create EmailJS Account**: Sign up at [EmailJS](https://www.emailjs.com/)
2. **Create Email Service**: Connect your email provider (Gmail, Outlook, etc.)
3. **Create Email Template**: Design your email template with placeholders
4. **Get Credentials**: Copy your Service ID, Public Key, and Template ID
5. **Update Environment Variables**: Add your credentials to `.env.local`
6. **Test the Form**: Submit a test message to verify functionality

### Fallback System

If EmailJS is not configured or fails:

1. **Primary Fallback**: Opens user's email client with pre-filled message
2. **Secondary Fallback**: Copies formatted email content to clipboard
3. **User Notification**: Shows success message with instructions

### File Structure

```
src/
├── services/
│   └── emailService.ts          # EmailJS service implementation
├── components/
│   └── ContactMeSection.tsx     # Contact form component
└── context/
    └── alertContext.tsx         # Alert notification context
```

### Usage

The contact form automatically handles:

- Form validation (required fields, email format, message length)
- Email sending via EmailJS
- Error handling and user feedback
- Fallback mechanisms for reliability

### Security Notes

- EmailJS public keys are safe to expose in client-side code
- Environment variables are baked into the build at compile time
- No sensitive server-side credentials are required

### Current Implementation

The EmailJS service includes hardcoded fallback values to ensure functionality even if environment variables are not set:

```typescript
const EMAILJS_SERVICE_ID =
  process.env.REACT_APP_EMAILJS_SERVICE_ID || "service_hwqll8d";
const EMAILJS_TEMPLATE_ID =
  process.env.REACT_APP_EMAILJS_TEMPLATE_ID || "ySL3BCd11PVoaUDpM";
const EMAILJS_PUBLIC_KEY =
  process.env.REACT_APP_EMAILJS_PUBLIC_KEY || "template_c5rhw4u";
```

**Note**: The hardcoded values are for development/testing purposes. For production, always use environment variables.

### Deployment

For Firebase Hosting deployment:

1. **Build the project**: `npm run build`
2. **Deploy to Firebase**: `firebase deploy`
3. **Environment variables** are automatically included in the build

The contact form will work immediately after deployment with the configured EmailJS settings.
