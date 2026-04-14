🧪 Add tests for getCategories

🎯 What: The testing gap for the getCategories API call has been addressed by writing unit tests for `getCategories.ts`.
📊 Coverage: Added tests to cover the successful parsing of HTML returning straight and gay categories. Included test cases for edge cases such as missing attributes (e.g., missing span or image elements) and graceful error handling when fetch throws an error.
✨ Result: The test suite now mocks the global fetch API properly. This leads to increased test coverage and more confidence when refactoring in the future.
