import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileUpdateSchema, type ProfileUpdateInput } from '@/schemas/authSchemas';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useUpdateProfile } from '@/hooks/useUserProfile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function PortalProfile() {
  const { user, profile } = useUserAuth();
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProfileUpdateInput>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      fullName: profile?.fullName || '',
      company: profile?.company || '',
      phone: profile?.phone || '',
    },
  });

  const onSubmit = (data: ProfileUpdateInput) => {
    updateProfile.mutate({
      fullName: data.fullName,
      company: data.company || null,
      phone: data.phone || null,
    });
  };

  return (
    <div className="max-w-lg">
      <h1 className="text-2xl font-bold text-foreground mb-2">Profile</h1>
      <p className="text-muted-foreground mb-8">Manage your account information</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label>Email</Label>
          <Input value={user?.email || ''} disabled className="bg-muted" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" {...register('fullName')} />
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="company">Company</Label>
          <Input id="company" {...register('company')} placeholder="Optional" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input id="phone" {...register('phone')} placeholder="Optional" />
        </div>

        <Button type="submit" disabled={updateProfile.isPending}>
          {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
        </Button>
      </form>
    </div>
  );
}
