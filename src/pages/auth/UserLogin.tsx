import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { userLoginSchema, type UserLoginInput } from '@/schemas/authSchemas';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

export default function UserLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useUserAuth();
  const [error, setError] = useState('');

  const from = (location.state as any)?.from?.pathname || '/portal';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserLoginInput>({
    resolver: zodResolver(userLoginSchema),
  });

  const onSubmit = async (data: UserLoginInput) => {
    setError('');
    const result = await signIn(data.email, data.password);
    if (result.error) {
      setError(result.error);
    } else {
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-32 pb-20 container mx-auto px-6">
        <div className="max-w-md mx-auto">
          <h1 className="font-display text-3xl font-bold text-foreground text-center mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-center mb-8">
            Sign in to manage your subscriptions
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && (
              <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                {error}
              </div>
            )}

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
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                {...register('password')}
                placeholder="Enter your password"
              />
              {errors.password && (
                <p className="text-sm text-destructive">{errors.password.message}</p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <p className="text-center text-muted-foreground text-sm mt-6">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
