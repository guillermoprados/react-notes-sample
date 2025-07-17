import { useState } from 'react';
const MIN_PASS_LENGTH = 6;
import { useForm } from '../hooks/useForm';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import { LoadingOverlay } from '../components';

interface RegisterForm {
  email: string;
  password: string;
  name: string;
}

function Register() {
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();
  const { register, isRegistering } = useAuthStore();
  const { formState, onInputChange, onResetForm } = useForm<RegisterForm>({
    email: '',
    password: '',
    name: '',
  });

  const isFormValid =
    formState.email.trim() &&
    formState.password.trim().length >= MIN_PASS_LENGTH &&
    formState.name.trim();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError('');
    }
    onInputChange(e);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      await register(formState.email, formState.password, formState.name);
      navigate('/', { replace: true });
    } catch (error: any) {
      setError('Failed to register. Please try again.');
    }
  };

  return (
    <>
      <LoadingOverlay isLoading={isRegistering} message="Registering..." />
      <div className="h-screen w-screen flex items-center justify-center bg-gray-200 p-0 m-0">
        <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Register
          </h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formState.name}
                onChange={handleInputChange}
                className={`mt-1 block w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                  error
                    ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
                }`}
                placeholder="Enter your name"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email (*)
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
                Password (*)
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
              {formState.password.length > 0 &&
                formState.password.length < MIN_PASS_LENGTH && (
                  <div className="text-xs text-red-500 mt-1">
                    Password must be longer than {MIN_PASS_LENGTH} characters
                  </div>
                )}
            </div>

            {error && <div className="text-red-600 text-sm mt-2">{error}</div>}

            <div className="space-y-3">
              <button
                type="submit"
                disabled={!isFormValid}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-green-600"
              >
                Register
              </button>
              <button
                type="button"
                onClick={onResetForm}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
            </div>
            <div className="text-xs mt-1">(*) required fields</div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Register;
