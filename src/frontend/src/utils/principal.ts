import { Principal } from '@dfinity/principal';

export interface PrincipalValidationResult {
  success: boolean;
  principal?: Principal;
  error?: string;
}

/**
 * Validates and parses a principal text string
 * @param principalText - The principal string to validate
 * @returns Validation result with parsed principal or error message
 */
export function validatePrincipal(principalText: string): PrincipalValidationResult {
  if (!principalText || principalText.trim() === '') {
    return {
      success: false,
      error: 'Principal cannot be empty',
    };
  }

  try {
    const principal = Principal.fromText(principalText.trim());
    
    if (principal.isAnonymous()) {
      return {
        success: false,
        error: 'Anonymous principal cannot be added as admin',
      };
    }

    return {
      success: true,
      principal,
    };
  } catch (error) {
    return {
      success: false,
      error: 'Invalid principal format',
    };
  }
}

/**
 * Formats a principal for display (truncated with ellipsis)
 * @param principal - The principal to format
 * @param startChars - Number of characters to show at start (default: 8)
 * @param endChars - Number of characters to show at end (default: 6)
 * @returns Formatted principal string
 */
export function formatPrincipal(principal: Principal | string, startChars = 8, endChars = 6): string {
  const principalText = typeof principal === 'string' ? principal : principal.toString();
  
  if (principalText.length <= startChars + endChars + 3) {
    return principalText;
  }

  return `${principalText.slice(0, startChars)}...${principalText.slice(-endChars)}`;
}
