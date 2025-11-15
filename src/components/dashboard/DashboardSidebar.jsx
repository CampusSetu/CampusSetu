import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  MagnifyingGlassIcon,
  ArrowRightOnRectangleIcon,
  ChevronDoubleLeftIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { getDashboardNav } from './navConfig';

const secondaryMenuItems = [
  { title: 'Settings', icon: Cog6ToothIcon, path: '#' },
  { title: 'Get Help', icon: QuestionMarkCircleIcon, path: '#' },
  { title: 'Search', icon: MagnifyingGlassIcon, path: '#' },
];

export default function DashboardSidebar({ collapsed, onToggle, navItems, role }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const roleLabel = role || user?.role || 'student';
  const menuItems = (navItems && navItems.length > 0)
    ? navItems
    : getDashboardNav(roleLabel);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside
      className={clsx(
        'fixed left-0 top-0 z-40 h-screen border-r border-slate-200/80 bg-white transition-all duration-300 ease-in-out',
        collapsed ? 'w-16' : 'w-72'
      )}
    >
      {/* Logo Header */}
      <div className="flex h-16 items-center border-b border-slate-200/80 px-4">
        <Link to="/" className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-500/40 bg-white/90 text-sm font-semibold text-brand-600 shadow-sm">
            C
          </span>
          {!collapsed && (
            <div className="flex-1 leading-tight">
              <p className="font-display text-base font-semibold text-slate-900">CampusSetu</p>
              <p className="text-xs text-slate-500 capitalize">{roleLabel}</p>
            </div>
          )}
        </Link>
        {typeof onToggle === 'function' && (
          <button
            type="button"
            onClick={onToggle}
            aria-label="Toggle sidebar"
            className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50"
          >
            <ChevronDoubleLeftIcon
              className={clsx('h-4 w-4 transition', collapsed && 'rotate-180')}
            />
          </button>
        )}
      </div>

      {/* Main Navigation */}
      <nav className="flex flex-col p-4">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={clsx(
                    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-brand-50 text-brand-700'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  )}
                  title={collapsed ? item.title : undefined}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Secondary Menu */}
        <div className="mt-auto pt-8">
          <ul className="space-y-1">
            {secondaryMenuItems.map((item) => {
              const Icon = item.icon;

              return (
                <li key={item.title}>
                  <a
                    href={item.path}
                    className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-900"
                    title={collapsed ? item.title : undefined}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    {!collapsed && <span>{item.title}</span>}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* User Profile Footer */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200/80 bg-white p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-600 text-sm font-semibold text-white">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          {!collapsed && (
            <>
              <div className="flex-1 overflow-hidden">
                <p className="truncate text-sm font-medium text-slate-900">{user?.name}</p>
                <p className="truncate text-xs text-slate-500">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="flex-shrink-0 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
                title="Logout"
              >
                <ArrowRightOnRectangleIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </aside>
  );
}
