import React, { useState } from 'react';
import {
  AlertTriangle,
  ArrowRight,
  BookOpen,
  Calendar,
  Car,
  Clock,
  Coins,
  GraduationCap,
  MapPin,
  PhoneCall,
  Sparkles,
  Trophy,
  Users,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { AcademicCalculator } from '../utils/academicCalculator';
import { DayOfWeek, getDivisionSchedule } from '../data/timetableData';

interface DashboardViewProps {
  setActiveTab: (tab: string) => void;
  onOpenAuth: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ setActiveTab, onOpenAuth }) => {
  const { user, session, subjects, targetSGPA, rides, leaderboard } = useCampus();

  const [selectedDay, setSelectedDay] = useState<DayOfWeek>(() => {
    const days: DayOfWeek[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
    const dayIdx = new Date().getDay(); // 1 = Mon, 5 = Fri
    if (dayIdx >= 1 && dayIdx <= 5) return days[dayIdx - 1];
    return 'Monday';
  });

  // Academic calculation for recommendations
  const sgpaResult = AcademicCalculator.checkTargetSGPA(subjects, targetSGPA);
  const myDivisionRank = leaderboard.find((l) => l.division === user.division)?.rank || 1;
  const myDivisionPoints = leaderboard.find((l) => l.division === user.division)?.totalPoints || 1250;

  // Find subject with highest risk
  const vulnerableSubject = subjects.find((s) => {
    const highest = AcademicCalculator.getHighestAchievableGrade(s);
    return highest.points < 9; // 'O' or 'A' is locked
  }) || subjects[3]; // default mechanics

  const vulnerableReqs = AcademicCalculator.calculateSubjectMarksRequirements(vulnerableSubject);
  const passReq = vulnerableReqs.find((r) => r.grade === 'P') || vulnerableReqs[vulnerableReqs.length - 1];

  // Dynamic Division Timetable
  const divisionInfo = getDivisionSchedule(user.division);
  const currentLectures = divisionInfo.schedule[selectedDay] || divisionInfo.schedule['Monday'] || [];

  const urgentDeadlines = [
    {
      title: 'PPS Lab Assignment 3: Pointers & Strings',
      course: 'FEC105',
      due: 'Tomorrow, 11:59 PM',
      urgency: 'high',
      tag: 'Submission',
    },
    {
      title: 'Engineering Mechanics Tutorial 2 (Trusses)',
      course: 'FEC104',
      due: 'In 3 Days',
      urgency: 'medium',
      tag: 'Tutorial',
    },
    {
      title: 'Applied Physics Journal Certification',
      course: 'FEC102',
      due: 'Friday, 04:00 PM',
      urgency: 'high',
      tag: 'Lab Journal',
    },
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-50/90 via-white to-violet-50/90 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/40 border border-indigo-100 dark:border-slate-800 p-6 sm:p-8 shadow-xs">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-56 h-56 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" /> First-Year Companion • VESIT Genesis 2.0
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
              Hello, {user.name.split(' ')[0]}! 👋
            </h1>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              Track your day's schedule, ensure your target <strong className="text-slate-900 dark:text-white font-semibold">SGPA {targetSGPA}</strong> is reachable, carpool with campus peers, and boost Division <strong className="text-indigo-600 dark:text-indigo-400 font-semibold">{user.division}</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3 w-full md:w-auto">
            {!session && (
              <button
                onClick={onOpenAuth}
                className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-600/20 transition flex items-center gap-2"
              >
                Connect MiniMoth Session
              </button>
            )}
            <button
              onClick={() => setActiveTab('academic-planner')}
              className="w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs transition flex items-center gap-2"
            >
              <GraduationCap className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Check SGPA Math
            </button>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-6 pt-6 border-t border-slate-200/80 dark:border-slate-800">
          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <GraduationCap className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Target SGPA
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-1 flex items-baseline gap-2">
              <span>{targetSGPA.toFixed(2)}</span>
              <span className={`text-[11px] font-semibold ${sgpaResult.isAchievable ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
                {sgpaResult.isAchievable ? '● Achievable' : '● Capped at ' + sgpaResult.maxPossibleSGPA}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Trophy className="w-3.5 h-3.5 text-amber-500" /> Class {user.division} Rank
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-1 flex items-baseline gap-2">
              <span>#{myDivisionRank}</span>
              <span className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">({myDivisionPoints} pts)</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Coins className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Time-Credit Bank
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-1 flex items-baseline gap-2">
              <span>{user.timeCredits} Hours</span>
              <span className="text-[11px] text-slate-500 dark:text-slate-400 font-normal">Available</span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700/80 shadow-2xs">
            <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" /> Campus Commute
            </div>
            <div className="text-lg font-bold text-slate-900 dark:text-white mt-1 flex items-baseline gap-2">
              <span>{rides.length} Rides</span>
              <span className="text-[11px] text-sky-700 dark:text-sky-400 font-semibold">Active today</span>
            </div>
          </div>
        </div>
      </div>

      {/* Cross-Module Smart Recommendations (Core Hackathon Requirement) */}
      <div className="rounded-2xl bg-gradient-to-br from-amber-50/50 via-white to-slate-50/60 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 border border-amber-200/70 dark:border-slate-800 p-5 shadow-xs">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <h2 className="text-xs font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider">
            Connected Recommendations & Alerts
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Card 1: Academic Planner -> Peer Learning Link */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-amber-200/80 dark:border-amber-900/50 flex items-start gap-3 shadow-2xs">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Academic Alert: {vulnerableSubject.name} ({vulnerableSubject.code})
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Your internal score is <strong className="text-slate-900 dark:text-white">{vulnerableSubject.internalScored}/{vulnerableSubject.internalMax}</strong>. You need <strong className="text-amber-800 dark:text-amber-400 font-semibold">{passReq.marksNeededInEndSem}/{vulnerableSubject.endSemMax}</strong> marks in the End-Sem to secure passing minimum.
              </p>
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => setActiveTab('academic-planner')}
                  className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center gap-1"
                >
                  View Locked Grades <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setActiveTab('peer-learning')}
                  className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 flex items-center gap-1"
                >
                  Find Peer Tutor <Users className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Commute Sharing & Class Challenge */}
          <div className="p-4 rounded-xl bg-white dark:bg-slate-800/90 border border-sky-200/80 dark:border-sky-900/50 flex items-start gap-3 shadow-2xs">
            <div className="p-2 rounded-lg bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 text-sky-600 dark:text-sky-400 shrink-0">
              <Car className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Ride Match: Kurla Station to VESIT (8:15 AM)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Senior Saurabh Kadam is driving via Chembur. 1 seat remaining. Request your ride seat to avoid peak station auto lines!
              </p>
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => setActiveTab('rides')}
                  className="text-xs font-semibold text-sky-700 dark:text-sky-400 hover:text-sky-900 dark:hover:text-sky-300 flex items-center gap-1"
                >
                  Open Commute Map <ArrowRight className="w-3 h-3" />
                </button>
                <button
                  onClick={() => setActiveTab('challenge-board')}
                  className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-900 dark:hover:text-emerald-300 flex items-center gap-1"
                >
                  Boost Division Points <Trophy className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Schedule & Deadlines */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Today's Lectures (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white">
                  Class {user.division} Schedule
                </h2>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  {divisionInfo.group} • {divisionInfo.defaultRoom}
                </p>
              </div>
            </div>

            {/* Day Selector (Mon - Fri) */}
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-full sm:w-auto overflow-x-auto justify-between sm:justify-start">
              {(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as DayOfWeek[]).map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-lg text-xs font-semibold transition text-center whitespace-nowrap ${
                    selectedDay === day
                      ? 'bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-200 shadow-2xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {day.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {currentLectures.length === 0 ? (
              <div className="p-8 text-center rounded-xl border border-dashed border-slate-200 dark:border-slate-800 text-slate-500 text-xs">
                No lectures scheduled for {selectedDay}. Self-study or peer learning session.
              </div>
            ) : (
              currentLectures.map((lec, idx) => (
                <div
                  key={idx}
                  className={`p-4 rounded-xl border transition ${
                    lec.status === 'Live Now'
                      ? 'bg-indigo-50/80 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-800 shadow-xs ring-1 ring-indigo-200 dark:ring-indigo-800'
                      : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 border border-slate-200 dark:border-slate-700">
                          {lec.code}
                        </span>
                        <h4 className="text-sm font-semibold text-slate-900 dark:text-white">{lec.name}</h4>
                        <span
                          className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                            lec.type === 'Lab'
                              ? 'bg-amber-100/70 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                              : lec.type === 'Tutorial'
                              ? 'bg-purple-100/70 dark:bg-purple-950/50 text-purple-800 dark:text-purple-300'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {lec.type}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-3 pt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" /> {lec.room}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-slate-400" /> {lec.faculty}
                        </span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-semibold text-slate-700 dark:text-slate-300">
                        {lec.time}
                      </div>
                      {lec.status && (
                        <span
                          className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            lec.status === 'Live Now'
                              ? 'bg-rose-500 text-white animate-pulse'
                              : lec.status === 'Up Next'
                              ? 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {lec.status}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column: Deadlines & Quick SOS */}
        <div className="space-y-6">
          {/* Urgent Submissions */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-rose-500" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white">Attention Needed</h2>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">3 Pending</span>
            </div>

            <div className="space-y-2.5">
              {urgentDeadlines.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs space-y-2 hover:border-slate-300 dark:hover:border-slate-700 transition"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h5>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        item.urgency === 'high'
                          ? 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                          : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                      }`}
                    >
                      {item.tag}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span>Course: {item.course}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Due: {item.due}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Help SOS Bar */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-2xs p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <PhoneCall className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">"Who Do I Contact?"</h3>
              </div>
              <button
                onClick={() => setActiveTab('campus-guide')}
                className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 font-semibold"
              >
                Directory
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              First-year fast contacts for academic help, emergency SOS, and campus facilities:
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <a
                href="tel:+912261532599"
                className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-rose-700 dark:text-rose-300 font-semibold flex items-center justify-center gap-1.5 transition text-center"
              >
                <PhoneCall className="w-3.5 h-3.5" /> 24/7 VESIT SOS
              </a>
              <button
                onClick={() => setActiveTab('campus-guide')}
                className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold flex items-center justify-center gap-1.5 transition text-center"
              >
                <BookOpen className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" /> Exam Cell & HOD
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
