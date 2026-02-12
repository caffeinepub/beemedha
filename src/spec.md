# Specification

## Summary
**Goal:** Grant the Internet Identity principal `ekphf-6psww-nfwx5-qaowa-goqyc-hgqqa-4m57p-3xfjb-kb73d-joktd-sqe` admin access (multi-admin) while preserving existing canister state across upgrades.

**Planned changes:**
- Add the specified principal to the backend’s admin role list so admin-only route guards and APIs recognize them as an admin.
- Implement a safe, conditional upgrade behavior that preserves all existing stored data and ensures the admin grant is applied idempotently (does not break existing admins, no duplicate/failed upgrades).

**User-visible outcome:** When logged in via Internet Identity as the specified principal, the user can access all `/admin` routes and admin-only actions without seeing “Access Denied,” including after upgrading an already-deployed canister with existing data.
