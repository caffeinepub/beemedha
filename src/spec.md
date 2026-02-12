# Specification

## Summary
**Goal:** Make the specified Internet Identity principal the sole administrator (single-admin mode) and reflect this in both backend enforcement and the admin access UI.

**Planned changes:**
- Backend: grant admin privileges to principal `zq4an-uqz34-isqap-u5moy-4rxll-vz3ff-ndqph-gvmn5-hqe6u-o6j3v-yqe` and enforce that it is the only admin.
- Backend: block admin-management operations that would add any additional admins or remove/demote the owner; ensure `listAdmins` returns only the owner principal.
- Frontend (/admin/access): disable or remove “Add New Admin” and “Remove Administrator” actions and display an English notice explaining single-admin mode and that admin access is locked to the owner principal.

**User-visible outcome:** The owner principal can successfully perform admin-only actions, no other principals can become admins, and the Admin Access Management page clearly shows single-admin mode with only the owner listed and no add/remove controls available.
