1. **Create `src/helpers/friends.test.ts`**
   - The goal is to add missing test coverage for `getFriends` in `src/helpers/friends.ts`.
   - I will mock the global `fetch` function to test various scenarios without making real network requests.
2. **Write Test Cases**
   - Test that `getFriends` returns a default failure object when the response status is not 200.
   - Test that it handles responses where `body.success` is false by calling the provided setters with 0.
   - Test that it correctly parses a successful response, updates the total pages and progress, and returns the fetched friends.
3. **Ensure proper testing, verification, review, and reflection are done**
   - Run `npm run test -- --watchAll=false` to ensure the new tests pass and do not break the rest of the test suite.
4. **Commit the code**
   - Use `submit` to push the test file to a descriptive branch, fulfilling the task requirements.
