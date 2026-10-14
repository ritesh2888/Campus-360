import React from 'react';
import {
  CalendarDays,
  Car,
  Coins,
  Compass,
  GraduationCap,
  LayoutDashboard,
  ShieldCheck,
  Trophy,
  User,
  X,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isMobileOpen,
  onCloseMobile,
}) => {
  const { user, session } = useCampus();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Daily Dashboard',
      description: "Lectures, deadlines & alerts",
      icon: LayoutDashboard,
      badge: 'Today',
    },
    {
      id: 'academic-planner',
      label: 'Academic Planner',
      description: 'SGPA target & grade locking',
      icon: GraduationCap,
      badge: 'Core',
    },
    {
      id: 'rides',
      label: 'Commute & Carpools',
      description: 'Seat requests & Leaflet map',
      icon: Car,
    },
    {
      id: 'challenge-board',
      label: 'Class Challenges',
      description: 'Inter-division leaderboard',
      icon: Trophy,
      badge: `#${user.division}`,
    },
    {
      id: 'campus-guide',
      label: 'Directory & Guide',
      description: 'Faculty contacts & campus map',
      icon: Compass,
    },
    {
      id: 'peer-learning',
      label: 'Peer Learning Barter',
      description: '1h teach = +1 credit economy',
      icon: Coins,
      badge: `${user.timeCredits} Cr`,
    },
    {
      id: 'events',
      label: 'Campus Events',
      description: 'Live states & student RSVPs',
      icon: CalendarDays,
    },
    {
      id: 'profile',
      label: 'Student Profile',
      description: 'Interests & MiniMoth tokens',
      icon: User,
    },
  ];

  const handleSelect = (id: string) => {
    setActiveTab(id);
    onCloseMobile();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-40 h-[100dvh] md:h-[calc(100vh-4rem)] w-72 shrink-0 border-r border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Top Header on Mobile */}
        <div className="flex md:hidden items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
              <GraduationCap className="w-5 h-5" />
            </div>
            <span className="font-bold text-slate-900 dark:text-white">Campus360 Menu</span>
          </div>
          <button
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Navigation Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition group ${
                  isActive
                    ? 'bg-indigo-50 dark:bg-indigo-600/25 text-indigo-700 dark:text-indigo-200 font-semibold border border-indigo-100 dark:border-indigo-500/40 shadow-2xs'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-5 h-5 transition ${
                      isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400'
                    }`}
                  />
                  <div>
                    <div className="text-sm leading-tight">{item.label}</div>
                    <div
                      className={`text-[11px] leading-tight ${
                        isActive ? 'text-indigo-600/80 dark:text-indigo-300/80 font-normal' : 'text-slate-400 dark:text-slate-500'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                      isActive
                        ? 'bg-indigo-100/80 dark:bg-indigo-500/30 text-indigo-700 dark:text-indigo-200 border border-indigo-200 dark:border-indigo-500/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Profile Widget */}
        <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-900/50">
          <div
            onClick={() => handleSelect('profile')}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-white dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition shadow-2xs"
          >
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-2xs">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-semibold text-slate-900 dark:text-white truncate">{user.name}</span>
                {session && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />}
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {user.year ? `${user.year.match(/\(([^)]+)\)/)?.[1] || 'FE'} • ` : ''}
                {user.division} • {user.branch.includes('Telecommunication') ? 'EXTC' : user.branch.includes('Intelligence') ? 'AI&DS' : user.branch.includes('Robotics') ? 'A&R' : user.branch.includes('Information') ? 'INFT' : user.branch.includes('Computer Science') ? 'ECS' : user.branch.split(' ')[0]}
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
