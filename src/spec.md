# Specification

## Summary
**Goal:** Replace Internet Identity protection on admin routes with a password-based admin login, and add customer login via email/phone OTP.

**Planned changes:**
- Frontend: Make `/#/admin` a dedicated admin login page (username/email + password) and add a client-side admin session with logout.
- Frontend: Update route guards so all `/#/admin/*` pages require the new password-admin login and redirect to `/#/admin` with an “Admin login required” message when not authenticated.
- Backend: Add a single-admin authentication API using the provided credentials, storing/verifying only a one-way derived representation of the password, and returning a session/token (or equivalent).
- Backend: Update admin-only backend methods (create/update/delete product, create/delete product update, update logo, view contact submissions, seed products) to authorize via the new password-admin session instead of Internet Identity roles.
- Frontend + Backend: Add customer OTP login flow (enter email/phone → enter OTP → logged-in state + logout), including backend APIs to start and verify OTP challenges (without external SMS/email delivery).

**User-visible outcome:** Admins can log in at `/#/admin` with a password to access the existing admin dashboard and tools without Internet Identity prompts, and customers can log in using an email address or phone number and verify via OTP to see a logged-in state and log out.
