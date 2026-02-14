import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';
import { createExternalBlobFromFile } from '../utils/externalBlob';
import type { StoreSettings } from '../backend';

interface StoreSettingsFormData {
  phone: string;
  email: string;
  whatsapp: string;
  address: string;
  facebook: string;
  instagram: string;
  twitter: string;
  logoFile?: File | null;
  bgFile?: File | null;
}

export function useAdminStoreSettings() {
  const { actor, isFetching } = useActor();
  const queryClient = useQueryClient();

  const query = useQuery<StoreSettings>({
    queryKey: ['adminStoreSettings'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getStoreSettings();
    },
    enabled: !!actor && !isFetching,
  });

  const mutation = useMutation({
    mutationFn: async (data: StoreSettingsFormData) => {
      if (!actor) throw new Error('Actor not available');

      let logoUrl: string | undefined;
      let bgUrl: string | undefined;

      // Upload logo if provided
      if (data.logoFile) {
        const { directURL } = await createExternalBlobFromFile(
          data.logoFile,
          (percentage) => {
            console.log(`Logo upload: ${percentage}%`);
          }
        );
        logoUrl = directURL;
      }

      // Upload background if provided
      if (data.bgFile) {
        const { directURL } = await createExternalBlobFromFile(
          data.bgFile,
          (percentage) => {
            console.log(`Background upload: ${percentage}%`);
          }
        );
        bgUrl = directURL;
      }

      // Prepare settings object matching backend StoreSettings type
      const settings: StoreSettings = {
        contactDetails: JSON.stringify({
          phone: data.phone,
          email: data.email,
          whatsapp: data.whatsapp,
          address: data.address,
        }),
        mapUrl: query.data?.mapUrl || 'https://maps.app.goo.gl/J6bsG7n3H4yPBrPK9',
        certificationsContent: query.data?.certificationsContent || '',
        certificationsImage: query.data?.certificationsImage,
        aboutContent: query.data?.aboutContent || '',
        backgroundImage: bgUrl || query.data?.backgroundImage,
      };

      // Store social links in aboutContent as JSON for now
      const socialLinks = {
        facebook: data.facebook,
        instagram: data.instagram,
        twitter: data.twitter,
      };
      
      // Merge social links into settings
      settings.aboutContent = JSON.stringify({
        content: query.data?.aboutContent || '',
        social: socialLinks,
      });

      await actor.updateStoreSettings(settings);
      return settings;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['adminStoreSettings'], data);
      // Invalidate customer-facing store settings query
      queryClient.invalidateQueries({ queryKey: ['storeSettings'] });
      toast.success('Settings saved successfully');
    },
    onError: () => {
      toast.error('Failed to save settings');
    },
  });

  // Parse contact details and social links from backend format
  const parseSettings = (settings?: StoreSettings) => {
    if (!settings) return null;

    let contactDetails = {
      phone: '',
      email: '',
      whatsapp: '',
      address: '',
    };

    let socialLinks = {
      facebook: '',
      instagram: '',
      twitter: '',
    };

    try {
      if (settings.contactDetails) {
        contactDetails = JSON.parse(settings.contactDetails);
      }
    } catch (e) {
      console.error('Failed to parse contact details', e);
    }

    try {
      if (settings.aboutContent) {
        const parsed = JSON.parse(settings.aboutContent);
        if (parsed.social) {
          socialLinks = parsed.social;
        }
      }
    } catch (e) {
      console.error('Failed to parse social links', e);
    }

    return {
      ...contactDetails,
      ...socialLinks,
      logoUrl: settings.backgroundImage,
      backgroundUrl: settings.backgroundImage,
    };
  };

  return {
    settings: parseSettings(query.data),
    rawSettings: query.data,
    isLoading: query.isLoading,
    updateSettings: mutation.mutateAsync,
    isUpdating: mutation.isPending,
  };
}
