# Specification

## Summary
**Goal:** Eliminate the admin dashboard flicker/regression after clicks by fixing conflicting admin auth gating/redirect logic and stabilizing admin routing.

**Planned changes:**
- Remove/adjust conflicting admin authentication gating and redirect behavior that causes redirects or full remount loops during in-dashboard navigation.
- Ensure switching admin dashboard sections (sidebar navigation) updates content without triggering redirects, repeated session validation, or full-screen loading states.
- Add a small developer-facing safeguard in admin routing/guards to avoid repeated navigation calls to the same path and prevent rapid auth-state oscillation during normal interaction.

**User-visible outcome:** Authenticated admins can use `/admin` and click through dashboard sections without visible flicker or repeated loading; unauthenticated users are redirected once to `/admin/login` without loops, and the admin UI remains stable after login.
