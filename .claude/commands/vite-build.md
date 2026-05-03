# Run the full Vite production build pipeline and summarize the result

Steps:

1. Run `npm run build` (which runs `tsc && vite build`)
2. If successful, list the key output files in `build/` with their sizes
3. If it fails, identify whether the error is from TypeScript or from Vite bundling, and show the relevant error

This is useful before deploying or to verify the build is production-ready.
