import { NavLink } from 'react-router-dom';
import { useUIStore } from '../store/uiStore';
import {
  LayoutDashboard,
  CalendarClock,
  Video,
  BarChart3,
  Camera,
  Settings,
} from 'lucide-react';
import { ROUTES } from '../constants';

const navItems = [
  { to: ROUTES.DASHBOARD, icon: LayoutDashboard, label: 'Dashboard' },
  { to: ROUTES.EVENTS, icon: CalendarClock, label: 'Events' },
  { to: ROUTES.CLIPS, icon: Video, label: 'Clips' },
  { to: ROUTES.ANALYTICS, icon: BarChart3, label: 'Analytics' },
  { to: ROUTES.CAMERA, icon: Camera, label: 'Camera' },
  { to: ROUTES.SETTINGS, icon: Settings, label: 'Settings' },
];

export const Sidebar = () => {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen);

  return (
    <aside
      className={`fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white dark:bg-secondary-800 border-r border-secondary-200 dark:border-secondary-700 transition-transform duration-300 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } w-64 z-40`}
    >
      <nav className="p-4 space-y-2">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400'
                  : 'hover:bg-secondary-100 dark:hover:bg-secondary-700 text-secondary-700 dark:text-secondary-300'
              }`
            }
          >
            <Icon size={20} />
            <span className="font-medium">{label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};
