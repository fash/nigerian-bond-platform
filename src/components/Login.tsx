"use client";
import React, { useState, FormEvent } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../components/ui/primitives'; 
import { Button, Input, Label } from '../components/ui/primitives';
import { Lock, LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface LoginProps {
  onSwitchToRegister: () => void;
}

export function Login({ onSwitchToRegister }: LoginProps) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      try {
        login(email);
      } catch (err: any) {
        setError(err.message || "An error occurred");
      } finally {
        setIsLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#008753]/5 via-white to-[#008753]/5 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl border-t-4 border-t-[#008753]">
        <CardHeader className="text-center">
          <div className="mx-auto bg-[#008753]/10 p-3 rounded-full w-fit mb-3">
            <Lock className="size-6 text-[#008753]" />
          </div>
          <CardTitle className="text-2xl text-[#008753]">Welcome Back</CardTitle>
          <CardDescription>Enter your email to access your portfolio</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Email Address</Label>
              <Input 
                type="email" 
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <Button className="w-full bg-[#008753] hover:bg-[#006d42]" disabled={isLoading}>
              {isLoading ? 'Logging in...' : (
                <>
                  <LogIn className="mr-2 size-4" /> Login
                </>
              )}
            </Button>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                Don't have an account?{' '}
                <button 
                  type="button"
                  onClick={onSwitchToRegister}
                  className="text-[#008753] font-medium hover:underline"
                >
                  Register
                </button>
              </p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}