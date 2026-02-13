# Specification

## Summary
**Goal:** Ensure the Internet Identity principal `zq4an-uqz34-isqap-u5moy-4rxll-vz3ff-ndqph-gvmn5-hqe6u-o6j3v-yqe` is always granted `#admin` access in the backend so they can use the admin panel and admin-only features.

**Planned changes:**
- Update backend access-control state initialization to include the specified principal as `#admin` (bootstrap on fresh install when no admins exist).
- Ensure upgrades preserve any existing stored admins and add the specified principal if missing (use migration only if required to maintain stable state compatibility).

**User-visible outcome:** When logged in as principal `zq4an-uqz34-isqap-u5moy-4rxll-vz3ff-ndqph-gvmn5-hqe6u-o6j3v-yqe`, admin routes (`/admin/*`) and admin-only actions (e.g., create/update products, manage news, upload logo) work without “unauthorized,” even on a fresh deploy with empty state.
