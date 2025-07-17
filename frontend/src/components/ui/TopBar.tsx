import { useAuthStore } from '../../stores/authStore';

const TopBar = () => {
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const displayName = user?.name || user?.email || 'User';

  return (
    <div className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1"></div>

        <div className="flex-1 text-center">
          <h1 className="text-xl font-semibold text-gray-900">Your Notes</h1>
          <span className="block md:hidden text-sm text-gray-700">
            {displayName}
          </span>
        </div>

        <div className="flex-1 flex items-center justify-end space-x-4">
          <span className="hidden md:block text-sm text-gray-700">
            {displayName}
          </span>
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export { TopBar };
