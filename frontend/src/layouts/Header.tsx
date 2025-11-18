import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { Menu, Moon, Sun, LogOut, Camera } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export const Header = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme, toggleSidebar } = useUIStore();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-secondary-800 border-b border-secondary-200 dark:border-secondary-700 z-50">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700"
          >
            <Menu size={20} />
          </button>

          <div className="flex items-center space-x-2">
            <Camera className="text-primary-600" size={24} />
            <span className="text-lg font-semibold">SensingCam</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700"
            title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium">{user?.username}</p>
              <p className="text-xs text-secondary-500">{user?.role}</p>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-secondary-100 dark:hover:bg-secondary-700 text-error"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
