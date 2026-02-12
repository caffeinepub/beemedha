import { useEffect } from 'react';

export function usePageMeta(title: string, description?: string) {
  useEffect(() => {
    // Special case for Web Owner Dashboard - use exact title without suffix
    if (title === 'Web Owner Dashboard') {
      document.title = title;
    } else {
      document.title = `${title} | Beemedha`;
    }
    
    if (description) {
      let metaDescription = document.querySelector('meta[name="description"]');
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', description);
    }
  }, [title, description]);
}
