import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userSignupSchema, type UserSignupInput } from '@/schemas/authSchemas';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function UserSignup() {
  const navigate = useNavigate();
  const { signUp } = useUserAuth();
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserSignupInput>({
    resolver: zodResolver(userSignupSchema),
  });

  const onSubmit = async (data: UserSignupInput) => {
    setError('');
    const result = await signUp(data.email, data.password, data.fullName, {
      company: data.company,
      phone: data.phone,
    });
    if (result.error) {
      setError(result.error);
    } else {
      navigate('/onboarding', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-6">
        <div className="max-w-md mx-auto">
          <h1 className="font-display text-3xl font-bold text-foreground text-center mb-2">
            Create Account
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Create your account to get started with our services
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                {...register('fullName')}
                placeholder="John Doe"
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input
                id="company"
                {...register('company')}
                placeholder="Your company name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Input
                id="phone"
                type="tel"
                {...register('phone')}
                placeholder="+27 12 345 6789"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="At least 6 characters"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                {...register('confirmPassword')}
                placeholder="Confirm your password"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
