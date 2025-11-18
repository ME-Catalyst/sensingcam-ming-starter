import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Button, Input, Card } from '../../components/ui';
import { ROUTES } from '../../constants';
import toast from 'react-hot-toast';
import { Camera } from 'lucide-react';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isLoading, error, clearError } = useAuthStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await login({ username, password });
      toast.success('Login successful!');
      navigate(ROUTES.DASHBOARD);
    } catch (err) {
      toast.error('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 to-secondary-100 dark:from-secondary-900 dark:to-secondary-800 px-4">
      <Card className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-600 rounded-full mb-4">
            <Camera className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-secondary-900 dark:text-secondary-100">
            SensingCam
          </h1>
          <p className="text-secondary-600 dark:text-secondary-400 mt-2">
            Camera Management System
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <Input
            label="Username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            autoFocus
          />

          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
          />

          {error && (
            <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-error rounded-lg text-error text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-secondary-600 dark:text-secondary-400">
          <p>
            Default credentials: <strong>admin</strong> / <strong>admin123</strong>
          </p>
        </div>
      </Card>
    </div>
  );
};
