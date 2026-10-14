import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  CheckCircle2,
  Clock,
  Flame,
  Medal,
  Plus,
  Send,
  Sparkles,
  Trophy,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { Challenge } from '../types';

export const ChallengeBoardView: React.FC = () => {
  const { challenges, leaderboard, user, postChallenge, submitChallengeCompletion } = useCampus();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showPostModal, setShowPostModal] = useState(false);
  const [submittingChallenge, setSubmittingChallenge] = useState<Challenge | null>(null);
  const [proofNotes, setProofNotes] = useState('');

  // Post form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<Challenge['category']>('Academics');
  const [points, setPoints] = useState(300);
  const [deadline, setDeadline] = useState('In 4 Days');

  const categories = ['All', 'Academics', 'Campus Life', 'Sports & Cultural', 'Cleanliness & Social'];

  const filteredChallenges = challenges.filter(
    (c) => selectedCategory === 'All' || c.category === selectedCategory
  );

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    postChallenge({
      title,
      description,
      category,
      points,
      deadline,
      createdByDivision: user.division,
      creatorName: `${user.name} (CR ${user.division})`,
    });
    setShowPostModal(false);
    setTitle('');
    setDescription('');
  };

  const handleCompleteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submittingChallenge) return;

    submitChallengeCompletion(submittingChallenge.id, proofNotes);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.6 },
    });
    setSubmittingChallenge(null);
    setProofNotes('');
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-1">
            <Trophy className="w-3.5 h-3.5" /> First-Year Inter-Division Spirit
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Class Challenge Board & Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Complete collaborative tasks with your division ({user.division}) to earn points and claim #1 on the leaderboard.
          </p>
        </div>

        <button
          onClick={() => setShowPostModal(true)}
          className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-sm shadow-amber-600/20 transition flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Post Class Challenge
        </button>
      </div>

      {/* Live Division Leaderboard Section */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-amber-500" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Live Division Leaderboard (FE 2026-27)</h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Updated in real-time</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {leaderboard.map((entry) => {
            const isMyDiv = entry.division === user.division;

            return (
              <div
                key={entry.division}
                className={`relative p-4 rounded-xl border transition shadow-2xs ${
                  isMyDiv
                    ? 'bg-gradient-to-br from-amber-50/70 via-white to-amber-50/30 dark:from-amber-950/40 dark:via-slate-900 dark:to-amber-950/20 border-amber-300 dark:border-amber-800/80 ring-1 ring-amber-300 dark:ring-amber-800'
                    : 'bg-white dark:bg-slate-800/80 border-slate-200/80 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                {/* Rank Badge */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs ${
                        entry.rank === 1
                          ? 'bg-amber-500 text-white shadow-sm'
                          : entry.rank === 2
                          ? 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200'
                          : entry.rank === 3
                          ? 'bg-amber-700 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {entry.rank === 1 ? <Medal className="w-4 h-4" /> : `#${entry.rank}`}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">Class {entry.division}</span>
                        {isMyDiv && (
                          <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 font-bold">
                            Your Class
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400">{entry.branch}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black font-mono text-amber-700 dark:text-amber-400">
                      {entry.totalPoints}
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">Points</span>
                  </div>
                </div>

                <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                  <span>{entry.challengesCompleted} challenges completed</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-semibold">VESIT Autonomous</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Challenges List */}
      <div className="space-y-4">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredChallenges.map((ch) => {
            const isCompletedByMyDiv = ch.completedByDivisions.includes(user.division);

            return (
              <div
                key={ch.id}
                className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-xs flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <span className="inline-block text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-indigo-700 dark:text-indigo-400 border border-slate-200 dark:border-slate-700">
                        {ch.category}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 dark:text-white">{ch.title}</h3>
                    </div>

                    <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-center shrink-0">
                      <div className="text-sm font-black font-mono">+{ch.points}</div>
                      <span className="text-[9px] uppercase font-bold text-amber-700 dark:text-amber-400">pts</span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{ch.description}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                  <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" /> Deadline: {ch.deadline}
                    </span>
                    <span>Posted by {ch.creatorName}</span>
                  </div>

                  {/* Division Status */}
                  <div className="flex items-center justify-between gap-2 pt-1">
                    <div>
                      {isCompletedByMyDiv ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" /> Completed for {user.division}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          Completed by: {ch.completedByDivisions.join(', ') || 'None yet'}
                        </span>
                      )}
                    </div>

                    {!isCompletedByMyDiv && (
                      <button
                        onClick={() => setSubmittingChallenge(ch)}
                        className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
                      >
                        <Send className="w-3 h-3" /> Submit for {user.division}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Post Challenge Modal */}
      {showPostModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-slate-800 dark:text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Post a New Class Challenge</h3>
              <button onClick={() => setShowPostModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                ✕
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Challenge Title:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 100% Attendance Sprint, Hackathon Team Registrations"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Description & Requirements:</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Detailed criteria to win points..."
                  rows={3}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Category:</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Challenge['category'])}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                  >
                    <option value="Academics">Academics</option>
                    <option value="Campus Life">Campus Life</option>
                    <option value="Sports & Cultural">Sports & Cultural</option>
                    <option value="Cleanliness & Social">Cleanliness & Social</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Points Bounty:</label>
                  <input
                    type="number"
                    min="100"
                    max="1000"
                    step="50"
                    value={points}
                    onChange={(e) => setPoints(parseInt(e.target.value) || 300)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Deadline:</label>
                <input
                  type="text"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  placeholder="e.g. Tomorrow 11:59 PM"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs shadow-sm transition mt-2"
              >
                Publish Challenge to Board
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Submit Task Completion Modal */}
      {submittingChallenge && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-slate-800 dark:text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Submit Proof for {user.division}</h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">Challenge: {submittingChallenge.title}</p>
              </div>
              <button onClick={() => setSubmittingChallenge(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                ✕
              </button>
            </div>

            <form onSubmit={handleCompleteSubmit} className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>
                  Completing this will add <strong>+{submittingChallenge.points} points</strong> to Division {user.division}!
                </span>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Proof Details / Google Drive / Form Link:</label>
                <textarea
                  value={proofNotes}
                  onChange={(e) => setProofNotes(e.target.value)}
                  placeholder="e.g. Completed by 8 classmates, drive link with photo proof or registration receipts..."
                  rows={3}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 focus:bg-white dark:focus:bg-slate-800"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition mt-2 flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" /> Claim Points & Update Leaderboard
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
