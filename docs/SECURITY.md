# Security

## Controls

- Financial records are stored in IndexedDB through Dexie as encrypted blobs.
- AES-GCM is used for encryption.
- PBKDF2 derives the key from the user password with a random salt.
- A random IV is used per encrypted record.
- Passwords and raw keys are not stored.
- Sensitive financial data is not stored in localStorage.
- The SvelteKit server sets CSP, `nosniff`, referrer, permissions, and frame-denial headers.
- No analytics or third-party scripts are included.

## Threat Model

- Malicious backend: no backend receives financial data in the MVP.
- Compromised frontend deployment: mitigated through review, tests, lockfile, and strict hosting controls.
- Browser extension risk: users should avoid untrusted extensions on financial devices.
- Shared computer risk: vault lock, auto-lock, and panic wipe reduce exposure.
- Lost password: unrecoverable by design.
- Local device malware: browser encryption cannot protect against fully compromised devices.
- Dependency supply chain: lockfile, lean dependencies, audits, and review are required.
- Compromised rule pack: controlled rule updates, tests, checksum/signature design, and visible status.
- Future local AI model compromise: model files must be checksummed and disabled by default.

## Headers

Production uses first-party CSP. Inline SvelteKit startup scripts and generated styles are allowed for the MVP deployment path; no third-party scripts are allowed. A later hardening pass should move to nonce or hash-based script CSP.
