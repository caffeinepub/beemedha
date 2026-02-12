# Specification

## Summary
**Goal:** Restrict the Admin Access management page and its related admin-management APIs so only the owner’s Internet Identity principal can access/use them.

**Planned changes:**
- Frontend: Add an owner-principal gate for the `/admin/access` route so only principal `zq4an-uqz34-isqap-u5moy-4rxll-vz3ff-ndqph-gvmn5-hqe6u-o6j3v-yqe` can view and use the existing AdminAccessPage UI.
- Frontend: Ensure non-owner users see an explicit “Access Denied” experience on `/admin/access`, and unauthenticated users are prompted to sign in first, then still restricted if not the owner.
- Backend: Enforce the same owner-only restriction on the admin-management APIs used by the page (`listAdmins`, `addAdmin`, `removeAdmin`) so only the owner principal can call them successfully.

**User-visible outcome:** When the owner is logged in, `/admin/access` works as it does today; anyone else (including other admins) is denied access, and logged-out users are prompted to sign in before restrictions are enforced.
