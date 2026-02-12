# Specification

## Summary
**Goal:** Build a premium Beemedha honey brand website with consistent organic theming, public product/news content that updates from the backend, and an admin panel for authenticated updates.

**Planned changes:**
- Apply a consistent premium Beemedha visual theme (palette, typography pairing, reusable layout components) across all pages with shared header/footer.
- Implement routing/navigation for: Home, About, Products (listing), Product Detail, Live Updates/News, Certifications & Quality Assurance, Contact, Privacy Policy, Terms & Conditions.
- Build Home page hero with exact tagline and CTAs, plus trust highlights; include generated static visuals.
- Build About page with sections for story/commitment, ethical beekeeping, and sustainable harvesting, plus supportive visuals.
- Add backend models/APIs for Products (incl. categories, images, description, nutritional values, harvest location, benefits, price, availability: In Stock/Limited/Out of Stock, timestamps) and CRUD for admin.
- Build Products listing with category filters (Raw Forest Honey, Organic Wild Honey, Herbal Infused Honey, Honey Comb), product cards, and availability badges driven by backend data.
- Build Product Detail page with required sections plus customer reviews stored/read from backend; include “Add to Cart” placeholder and “Checkout coming soon” messaging.
- Add backend models/APIs for News items (types: harvest announcements, seasonal availability, price updates, limited-time offers) with publish dates and optional product references; CRUD for admin.
- Build News page with list + dates, filtering by update type, and a detail/expanded view.
- Build Certifications & Quality Assurance page with lab testing, certifications, and trust badges; include at least one generated badge/seal image.
- Build Contact page with validated form, WhatsApp link button, email/phone display, and Google Maps embed/link; store submissions in backend and show admin-only listing.
- Implement footer with social links, newsletter signup (validated), and policy links; add readable placeholder legal content pages.
- Create Admin panel restricted to authenticated admins via Internet Identity with allowlist authorization; manage products, news, and view contact submissions.
- Implement “live updates” on Products and News pages using React Query polling/refetch-on-focus and show a visible “Last updated” timestamp; keep polling interval configurable in one place.
- Ensure responsive layouts, fast-loading optimized static images, and SEO basics (titles/meta descriptions, semantic headings, accessible navigation).

**User-visible outcome:** Visitors can browse a premium Beemedha site, view live-updating products and news, read product details (with reviews) and certifications, and contact the brand; admins can sign in with Internet Identity to manage products/news and review contact submissions.
