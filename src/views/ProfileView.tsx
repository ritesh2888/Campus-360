import React, { useState } from 'react';
import {
  Check,
  CheckCircle2,
  KeyRound,
  LogOut,
  Plus,
  RefreshCw,
  ShieldCheck,
  Tag,
  User,
  X,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { MiniMothService } from '../services/minimoth';
import { AcademicYear, Branch, Division } from '../types';

export const ProfileView: React.FC = () => {
  const { user, session, updateProfile, logout, login } = useCampus();

  const [name, setName] = useState(user.name);
  const [rollNo, setRollNo] = useState(user.rollNo);
  const [year, setYear] = useState<AcademicYear>(user.year || 'First Year (FE)');
  const [division, setDivision] = useState<Division>(user.division);
  const [branch, setBranch] = useState<Branch>(user.branch);
  const [newInterest, setNewInterest] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const academicYears: AcademicYear[] = [
    'First Year (FE)',
    'Second Year (SE)',
    'Third Year (TE)',
    'Final Year (BE)',
  ];

  const branches: Branch[] = [
    'Electronics & Telecommunication Engineering',
    'Artificial Intelligence & Data Science',
    'Computer Engineering',
    'Information Technology',
    'Electronics & Computer Science',
    'Automation & Robotics',
  ];

  const branchDivisions: Record<Branch, { code: Division; label: string }[]> = {
    'Electronics & Telecommunication Engineering': [
      { code: 'D4A', label: 'D4A (EXTC)' },
      { code: 'D4B', label: 'D4B (EXTC)' },
    ],
    'Artificial Intelligence & Data Science': [
      { code: 'D1ADA', label: 'D1ADA (AI & DS)' },
      { code: 'D1ADB', label: 'D1ADB (AI & DS)' },
    ],
    'Computer Engineering': [
      { code: 'D2A', label: 'D2A (CMPN)' },
      { code: 'D2B', label: 'D2B (CMPN)' },
      { code: 'D2C', label: 'D2C (CMPN)' },
    ],
    'Information Technology': [
      { code: 'D5A', label: 'D5A (INFT)' },
      { code: 'D5B', label: 'D5B (INFT)' },
      { code: 'D5C', label: 'D5C (INFT)' },
    ],
    'Electronics & Computer Science': [
      { code: 'D1EC', label: 'D1EC (ECS)' },
    ],
    'Automation & Robotics': [
      { code: 'D3', label: 'D3 (A&R)' },
    ],
  };

  const handleBranchChange = (newBranch: Branch) => {
    setBranch(newBranch);
    const divsForBranch = branchDivisions[newBranch];
    if (divsForBranch && divsForBranch.length > 0) {
      if (!divsForBranch.some((d) => d.code === division)) {
        setDivision(divsForBranch[0].code);
      }
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name,
      rollNo,
      year,
      division,
      branch,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleAddInterest = () => {
    if (!newInterest.trim()) return;
    if (!user.interests.includes(newInterest.trim())) {
      updateProfile({
        interests: [...user.interests, newInterest.trim()],
      });
    }
    setNewInterest('');
  };

  const handleRemoveInterest = (interest: string) => {
    updateProfile({
      interests: user.interests.filter((i) => i !== interest),
    });
  };

  const handleRefreshToken = async () => {
    setRefreshing(true);
    const refreshed = await MiniMothService.refreshToken();
    setRefreshing(false);
    if (refreshed) {
      login(refreshed);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold mb-1">
          <User className="w-3.5 h-3.5" /> First-Year Identity & Credentials
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
          Student Profile & Authentication
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          Manage your personal subject enrollments, division, interests, and active MiniMoth auth tokens.
        </p>
      </div>

      {/* Main Profile Form */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
              {user.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 dark:text-white">{user.name}</h3>
                {session && (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold">
                    <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" /> MiniMoth Verified
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                Roll No. {user.rollNo} • {user.year} • Class {user.division}
              </p>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                {user.branch}
              </p>
            </div>
          </div>

          {savedSuccess && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 text-xs font-semibold animate-pulse border border-emerald-200 dark:border-emerald-800">
              <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Changes Saved!
            </span>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">Full Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">Class Roll Number:</label>
              <input
                type="text"
                value={rollNo}
                onChange={(e) => setRollNo(e.target.value)}
                placeholder="e.g. 62"
                required
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">Academic Year:</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value as AcademicYear)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800"
              >
                {academicYears.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">Branch / Specialization:</label>
              <select
                value={branch}
                onChange={(e) => handleBranchChange(e.target.value as Branch)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800"
              >
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1.5">Division / Section:</label>
              <select
                value={division}
                onChange={(e) => setDivision(e.target.value as Division)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800"
              >
                <optgroup label={`${branch} (Selected Branch)`}>
                  {(branchDivisions[branch] || []).map((d) => (
                    <option key={d.code} value={d.code}>
                      {d.label}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="Other Sem-1 Divisions">
                  {Object.entries(branchDivisions).flatMap(([bName, divs]) =>
                    bName !== branch
                      ? divs.map((d) => (
                          <option key={d.code} value={d.code}>
                            {d.label}
                          </option>
                        ))
                      : []
                  )}
                </optgroup>
              </select>
            </div>
          </div>

          <button
            type="submit"
            className="py-2.5 px-5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition"
          >
            Update Student Profile
          </button>
        </form>

        {/* Interests Section */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <label className="block text-xs font-bold text-slate-900 dark:text-white">
            Interests & Skills (Used for Event & Peer Learning Recommendations):
          </label>

          <div className="flex flex-wrap gap-2">
            {user.interests.map((interest) => (
              <span
                key={interest}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 text-xs shadow-2xs"
              >
                <Tag className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                <span>{interest}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveInterest(interest)}
                  className="text-slate-400 hover:text-rose-600 ml-1"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>

          <div className="flex items-center gap-2 max-w-sm">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="e.g. Cybersecurity, CAD, Debating..."
              className="flex-1 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-xs text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800"
            />
            <button
              type="button"
              onClick={handleAddInterest}
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-xs text-white font-semibold flex items-center gap-1 shadow-2xs"
            >
              <Plus className="w-3 h-3" /> Add
            </button>
          </div>
        </div>
      </div>

      {/* MiniMoth Auth Session Details (PS-02 Core Requirement) */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">
              MiniMoth Sponsor Auth Session Details
            </h2>
          </div>

          {session ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Session Active
            </span>
          ) : (
            <span className="text-xs text-amber-700 dark:text-amber-400 font-semibold">Unauthenticated</span>
          )}
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
          MiniMoth provides serverless phone OTP authentication for Indian developers. Session tokens are validated and renewed below:
        </p>

        {session ? (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-0.5 font-medium">Phone Number:</span>
                <span className="font-mono text-slate-900 dark:text-white font-bold">{session.user.phone}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80">
                <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-0.5 font-medium">Session Expiry:</span>
                <span className="font-mono text-slate-800 dark:text-slate-200 font-semibold">
                  {new Date(session.expiresAt).toLocaleTimeString()} ({Math.max(0, Math.round((session.expiresAt - Date.now()) / 60000))} mins remaining)
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-0.5 font-medium">Bearer Access Token:</span>
              <span className="font-mono text-indigo-700 dark:text-indigo-400 font-semibold break-all text-[11px]">
                {session.accessToken}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs">
              <span className="text-slate-500 dark:text-slate-400 block text-[11px] mb-0.5 font-medium">Refresh Token:</span>
              <span className="font-mono text-slate-700 dark:text-slate-300 break-all text-[11px]">
                {session.refreshToken}
              </span>
            </div>

            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={handleRefreshToken}
                disabled={refreshing}
                className="px-4 py-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
                Test Token Refresh API
              </button>

              <button
                onClick={logout}
                className="px-4 py-2 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 text-xs font-semibold transition flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out from MiniMoth
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center space-y-2">
            <p className="text-xs text-slate-600 dark:text-slate-300">
              No active MiniMoth phone session detected. Sign in with OTP to bind your student credentials.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
