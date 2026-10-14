import React from 'react';
import {
  Car,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Trophy,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';

interface MobileBottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenMobileMenu: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenMobileMenu,
}) => {
  const { user } = useCampus();

  const primaryTabs = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard,
      badge: 'Live',
    },
    {
      id: 'academic-planner',
      label: 'Planner',
      icon: GraduationCap,
    },
    {
      id: 'rides',
      label: 'Carpool',
      icon: Car,
    },
    {
      id: 'challenge-board',
      label: 'Rank',
      icon: Trophy,
      badge: user.division,
    },
  ];

  return (
    <nav
      aria-label="Mobile Navigation Bar"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_16px_rgba(0,0,0,0.4)] pb-[max(0.5rem,env(safe-area-inset-bottom))]"
    >
      <div className="grid grid-cols-5 items-center px-1 pt-1.5 pb-0.5">
        {primaryTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition relative group ${
                isActive
                  ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {/* Active Pill Indicator */}
              {isActive && (
                <span className="absolute -top-1 w-8 h-1 rounded-full bg-indigo-600 dark:bg-indigo-500 animate-pulse" />
              )}

              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-150 ${
                    isActive ? 'scale-110 text-indigo-600 dark:text-indigo-400' : 'group-active:scale-95'
                  }`}
                />
                {tab.badge && (
                  <span className="absolute -top-1 -right-2.5 px-1 py-0.2 rounded-full text-[9px] font-bold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800">
                    {tab.badge}
                  </span>
                )}
              </div>

              <span className="text-[11px] leading-tight mt-1 tracking-tight">
                {tab.label}
              </span>
            </button>
          );
        })}

        {/* More / All Modules Drawer Trigger */}
        <button
          onClick={onOpenMobileMenu}
          className={`flex flex-col items-center justify-center py-1 px-1 rounded-xl transition relative group ${
            ['peer-learning', 'campus-guide', 'events', 'profile'].includes(activeTab)
              ? 'text-indigo-600 dark:text-indigo-400 font-semibold'
              : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          {['peer-learning', 'campus-guide', 'events', 'profile'].includes(activeTab) && (
            <span className="absolute -top-1 w-8 h-1 rounded-full bg-indigo-600 dark:bg-indigo-500" />
          )}

          <div className="relative">
            <Menu className="w-5 h-5 group-active:scale-95" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
          </div>

          <span className="text-[11px] leading-tight mt-1 tracking-tight">
            More
          </span>
        </button>
      </div>
    </nav>
  );
};
