# Specification

## Summary
**Goal:** Add a Web Owner admin dashboard route gated by Internet Identity + admin checks, and implement admin-only product CRUD with stock, variants, and soft delete.

**Planned changes:**
- Add a dedicated `#/owner` route (or alias to the existing admin dashboard) and set both the H1 and document title to "Web Owner Dashboard".
- Gate the owner/admin dashboard and product management pages using Internet Identity authentication plus `useIsCallerAdmin()`:
  - Show "Login Required" (with a login action) when unauthenticated
  - Show "Access Denied" when authenticated but not admin
- Update the backend product model and CRUD to support: id, name, category, image (single primary image string), price, optional discountPrice, optional variants[], stock quantity, createdAt, and soft delete; enforce admin-only mutations and hide soft-deleted products from public queries.
- Add a Motoko state migration on upgrade to initialize new fields (e.g., default stock, deleted=false) for existing stored products without data loss.
- Revise the admin products UI to a responsive table with columns: Image, Product Name, Category, Price, Discount, Stock, Actions (Edit/Delete), plus an "Add Product" button above the table.
- Implement Add/Edit product via a modal form with validation + loading states; fields include Product Name, Category dropdown (Bee Products, Natural Honey, Raw Honey), JPEG-only image upload, Price, optional Discount Price, Stock Quantity, and optional Variant Options (e.g., 250g/500g/1000g and type variants).
- Replace deletion with a confirmation popup that performs a soft delete through secure admin-only backend calls; show success/error toast notifications on mutations.
- Add optional admin list enhancements: search by product name/text, category filter, total count for filtered results, and a low-stock indicator using a configurable threshold.

**User-visible outcome:** Admin users can sign in with Internet Identity to access the "Web Owner Dashboard" at `#/owner`, manage products in a table-based UI, add/edit products in a validated modal (including stock, optional discounts, and optional variants), and soft-delete products with confirmation; non-admin and unauthenticated users see clear "Access Denied" / "Login Required" states and cannot modify products.
