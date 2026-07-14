# Privacy

Raqm is local-first. No account is required. No cloud database stores user tax records. No external analytics or third-party tracking is included.

Stored sensitive data:

- Profile
- Income
- Withholding
- Bank profit
- Assets
- Liabilities
- Calculation result

These records are encrypted in IndexedDB. Non-sensitive UI preferences may use localStorage in future versions; the current MVP does not rely on localStorage for financial data.

Exports are generated locally and become the user's responsibility once downloaded.
