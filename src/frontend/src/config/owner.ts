/**
 * Owner principal configuration for admin management access control.
 * Only this principal can access admin management features.
 */

export const OWNER_PRINCIPAL = 'zq4an-uqz34-isqap-u5moy-4rxll-vz3ff-ndqph-gvmn5-hqe6u-o6j3v-yqe';

/**
 * Check if the given principal string matches the owner principal.
 */
export function isOwnerPrincipal(principalString: string | undefined): boolean {
  if (!principalString) return false;
  return principalString === OWNER_PRINCIPAL;
}
