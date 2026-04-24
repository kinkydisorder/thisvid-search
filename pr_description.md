Title: 🧹 [Code Health] Remove console.error from useSearchLogic catch block

Description:
🎯 **What:** Removed a `console.error` statement inside a `catch` block in `src/hooks/useSearchLogic.ts`. Also updated the block to `catch { ... }` (omitting the bound `error` variable) to prevent unused variable linting errors.
💡 **Why:** `console.error` logs can clutter the user's browser console, especially in cases where expected errors (like 404s or network timeouts) happen and are already handled functionally. We also use a more precise error boundary now by ignoring the search exception instead of printing standard output to the end-user.
✅ **Verification:** Verified changes through testing. Ran `npx tsc --noEmit` and `npm run test -- --watchAll=false` which proved the typescript builds pass cleanly with 0 type errors, and all tests pass cleanly.
✨ **Result:** A cleaner console for users and an improvement to the application's overall code health without mutating functional behavior.
