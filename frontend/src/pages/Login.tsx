import { useState } from 'react';
import { useForm } from '../hooks/useForm';
import { authApi } from '../services/api';
import LoadingOverlay from '../components/LoadingOverlay';
import { LoginSuccessResponse, LoginErrorResponse } from '../types/api';
import { setAccessToken } from '../utils/auth';
import { useNavigate } from 'react-router-dom';

interface LoginForm {
  email: string;
  password: string;
}

function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { formState, onInputChange, onResetForm } = useForm<LoginForm>({
    email: '',
    password: '',
  });

  const isFormValid = formState.email.trim() && formState.password.trim();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError('');
    }
    onInputChange(e);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError('');

    setIsLoading(true);

    try {
      const response: LoginSuccessResponse = await authApi.login(
        formState.email,
        formState.password
      );

      setAccessToken(response.access_token);

      // Navigate to home page and clear navigation stack
      navigate('/', { replace: true });
    } catch (error: any) {
      console.error('Login failed:', error);

      if (error.response?.data) {
        const errorData: LoginErrorResponse = error.response.data;
        setError(errorData.message || 'Login failed');
      } else {
        setError('Network error. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isLoading} message="Logging in..." />
      <div className="h-screen w-screen flex items-center justify-center bg-gray-200 p-0 m-0">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Sign In
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  error
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formState.password}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  error
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Enter your password"
              />
            </div>

            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-600"
              >
                Login
              </button>

              <button
                type="button"
                onClick={onResetForm}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
