import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userProfileService } from '@/services/userProfileService';
import type { UserProfileUpdate } from '@/types/userProfile';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useToast } from '@/hooks/use-toast';

const QUERY_KEY = 'userProfile';

export function useUserProfile() {
  const { user } = useUserAuth();

  return useQuery({
    queryKey: [QUERY_KEY, user?.id],
    queryFn: () => (user ? userProfileService.getProfile(user.id) : null),
    enabled: !!user,
  });
}

export function useUpdateProfile() {
  const { user, refreshProfile } = useUserAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: (data: UserProfileUpdate) =>
      user ? userProfileService.updateProfile(user.id, data) : Promise.resolve(null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY] });
      refreshProfile();
      toast({ title: 'Profile updated', description: 'Your profile has been updated.' });
    },
    onError: (error) => {
      toast({ title: 'Error', description: 'Failed to update profile.', variant: 'destructive' });
      console.error('Error updating profile:', error);
    },
  });
}
