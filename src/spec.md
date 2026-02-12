# Specification

## Summary
**Goal:** Allow admins to upload/replace a website logo that is stored persistently in the backend and displayed in the site header.

**Planned changes:**
- Add backend support to store a single logo (bytes + MIME type) in canister state, with an admin-only update method, a public query to fetch the logo, and stable persistence across upgrades.
- Add React Query hooks to fetch the current logo and to upload/replace it, including invalidation/refetch after upload so UI updates immediately.
- Add an admin-only page linked from the existing admin dashboard to upload/replace the logo with basic validation and a preview of the currently saved logo.
- Update the site header to use the persisted logo when available, and fall back to the existing static logo behavior when unavailable or if loading fails.

**User-visible outcome:** Admins can change the site logo from an admin page, and the header will show the uploaded logo immediately and keep it across redeploys/upgrades (with a fallback logo if none is set).
