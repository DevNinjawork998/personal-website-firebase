Build and deploy the project to Firebase Hosting.

Steps:
1. Run `npm run build` — this runs the TypeScript check then Vite build. Stop and report if it fails.
2. Run `npx firebase deploy --only hosting` to deploy the `build/` output directory.
3. Report the live URL from the deploy output.

Note: The user must be logged in via `firebase login` and have the correct project selected (`firebase use`). If the deploy fails due to auth, tell the user to run `! firebase login` in the prompt.
