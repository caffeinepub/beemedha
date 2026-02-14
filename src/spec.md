# Specification

## Summary
**Goal:** Replace Internet Identity (passkey) admin authentication with a fixed username/password admin login using the existing password hashing flow.

**Planned changes:**
- Update backend admin credential initialization so the only valid admin login is username "Thejas Kinnigoli" with password "789852qwertyuiop", with password verification performed via the existing hashPassword() mechanism (no plaintext storage/compare).
- Remove/disable Internet Identity-based admin authentication UI and access gating in the admin area.
- Ensure /admin/* routes require a successful username/password admin session, and remove or replace the /admin/access route so Internet Identity admin access is unavailable (English messaging only).

**User-visible outcome:** Admin users can log in using the fixed username/password and access admin pages; Internet Identity login is no longer shown or used for admin access.
