# Specification

## Summary
**Goal:** Add a global animated neon/glow background across the entire site and make the sidebar drawer reliably closable via a visible X button with a proper slide-out close animation.

**Planned changes:**
- Apply a site-wide neon/glow animated background layer behind all routes, ensuring it does not block clicks/scrolling and maintains readable contrast for UI text/icons.
- Respect `prefers-reduced-motion` by disabling or significantly reducing background motion while keeping the neon color styling.
- Add a visible, keyboard-accessible close (X) button inside the sidebar drawer that closes the drawer and plays a slide-out animation in the correct direction (matching the opening side).
- Ensure opening/closing the sidebar repeatedly works without console errors.

**User-visible outcome:** Every page shows an animated neon/glow background behind the content, and users can close the sidebar using a clear X button that triggers a smooth slide-out animation.
