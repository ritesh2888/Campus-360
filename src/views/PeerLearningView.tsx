import React, { useState } from 'react';
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Coins,
  Sparkles,
  Star,
} from 'lucide-react';
import { useCampus } from '../context/CampusContext';
import { PeerTutor } from '../types';

export const PeerLearningView: React.FC = () => {
  const { peerTutors, peerSessions, user, bookPeerSession, completePeerSession, updateProfile } =
    useCampus();

  const [bookingTutor, setBookingTutor] = useState<PeerTutor | null>(null);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [bookingDate, setBookingDate] = useState('Tomorrow');
  const [bookingSlot, setBookingSlot] = useState('04:30 PM - 05:30 PM');
  const [showEarnCreditModal, setShowEarnCreditModal] = useState(false);
  const [teachSubject, setTeachSubject] = useState('Basic Python & Loops');

  const handleBookSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingTutor) return;

    const ok = bookPeerSession(bookingTutor.id, selectedSubject || bookingTutor.subjectsCanTeach[0], bookingDate, bookingSlot);
    if (ok) {
      setBookingTutor(null);
    }
  };

  const handleSimulateTeachHour = () => {
    // Student teaches 1 hour -> earns 1 credit
    updateProfile({ timeCredits: user.timeCredits + 1 });
    setShowEarnCreditModal(false);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold mb-1">
            <Coins className="w-3.5 h-3.5" /> Zero-Cash Peer Skill Barter
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Peer Learning & Time-Credit Bank
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Teach 1 hour to earn 1 credit. Spend 1 credit to learn 1 hour from top seniors and classmates.
          </p>
        </div>

        {/* User Balance Banner & Quick Earn */}
        <div className="flex items-center gap-3">
          <div className="px-4 py-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 text-amber-900 dark:text-amber-200 flex items-center gap-2.5 shadow-2xs">
            <Coins className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <div>
              <div className="text-[10px] uppercase font-bold text-amber-700 dark:text-amber-400">Your Balance</div>
              <div className="text-base font-black font-mono text-slate-900 dark:text-white">{user.timeCredits} Time Credits</div>
            </div>
          </div>

          <button
            onClick={() => setShowEarnCreditModal(true)}
            className="px-3.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-sm shadow-indigo-600/20 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" /> + Earn Credit
          </button>
        </div>
      </div>

      {/* How It Works Banner (PS-02 Requirement) */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-50/70 via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-indigo-950/30 border border-indigo-100 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs shadow-xs">
        <div className="flex items-start gap-2.5">
          <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0 shadow-2xs">
            1
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">Teach 1 Hour (+1 Credit)</span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Help a peer in coding, physics derivations, or CAD.</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0 shadow-2xs">
            2
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">Learn 1 Hour (-1 Credit)</span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Book a 1-on-1 session with senior rankers before Unit Tests.</span>
          </div>
        </div>

        <div className="flex items-start gap-2.5">
          <div className="h-6 w-6 rounded-full bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-bold flex items-center justify-center shrink-0 shadow-2xs">
            3
          </div>
          <div>
            <span className="font-bold text-slate-900 dark:text-white block">Balanced Ecosystem</span>
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Lifecycle: Matched ➔ Booked ➔ Completed.</span>
          </div>
        </div>
      </div>

      {/* Active Bookings & Completed Sessions Table */}
      <div className="rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 p-5 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-base font-bold text-slate-900 dark:text-white">Your Peer Sessions ({peerSessions.length})</h2>
          </div>
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">Time-bank transactions</span>
        </div>

        <div className="space-y-3">
          {peerSessions.map((sess) => (
            <div
              key={sess.id}
              className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{sess.subjectOrSkill}</h4>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      sess.state === 'Completed'
                        ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : sess.state === 'Booked'
                        ? 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        : 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    State: {sess.state}
                  </span>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Tutor: <strong className="text-slate-900 dark:text-white">{sess.tutorName}</strong> • {sess.meetingSpot}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-slate-500 dark:text-slate-400">
                  <span>📅 {sess.date}</span>
                  <span>⏰ {sess.timeSlot}</span>
                  <span className="text-amber-700 dark:text-amber-400 font-mono font-semibold">1 Time Credit</span>
                </div>
              </div>

              {sess.state === 'Booked' && (
                <button
                  onClick={() => completePeerSession(sess.id)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-sm shrink-0"
                >
                  <CheckCircle className="w-4 h-4" /> Mark Session Completed
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Available Tutors Directory */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">Find a Verified Peer Tutor</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {peerTutors.map((tutor) => (
            <div
              key={tutor.id}
              className="p-5 rounded-2xl border border-slate-200/90 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4 hover:border-slate-300 dark:hover:border-slate-700 transition shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-amber-400 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-2xs">
                      {tutor.name.charAt(0)}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{tutor.name}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Class {tutor.division} • Roll: {tutor.rollNo}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/50 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 text-xs font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{tutor.rating}</span>
                    <span className="text-[10px] text-slate-400 font-normal">({tutor.reviewsCount})</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-300 italic">"{tutor.bio}"</p>

                {/* Subjects can teach */}
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                    Can Teach:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {tutor.subjectsCanTeach.map((sub) => (
                      <span
                        key={sub}
                        className="text-[11px] px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800 font-medium"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs text-amber-700 dark:text-amber-400 font-mono font-bold">
                  ⚡ 1 Credit / Hour
                </span>

                <button
                  onClick={() => {
                    setBookingTutor(tutor);
                    setSelectedSubject(tutor.subjectsCanTeach[0]);
                  }}
                  disabled={user.timeCredits < 1}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-semibold transition flex items-center gap-1.5 shadow-2xs"
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  {user.timeCredits < 1 ? 'Needs Credit' : 'Book 1-on-1'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Book Tutor Modal */}
      {bookingTutor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-slate-800 dark:text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-slate-900 dark:text-white text-base">Book 1-on-1 Peer Session</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">With {bookingTutor.name} (Class {bookingTutor.division})</p>
              </div>
              <button onClick={() => setBookingTutor(null)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                ✕
              </button>
            </div>

            <form onSubmit={handleBookSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Subject / Skill to Learn:</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-800"
                >
                  {bookingTutor.subjectsCanTeach.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Date:</label>
                  <input
                    type="text"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Time Slot:</label>
                  <input
                    type="text"
                    value={bookingSlot}
                    onChange={(e) => setBookingSlot(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-mono focus:bg-white dark:focus:bg-slate-800"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-700 dark:text-slate-300 space-y-1">
                <div className="flex justify-between">
                  <span>Session Cost:</span>
                  <span className="font-bold text-amber-700 dark:text-amber-400">1 Time-Credit</span>
                </div>
                <div className="flex justify-between">
                  <span>Your Current Balance:</span>
                  <span className="font-mono text-slate-900 dark:text-white font-bold">{user.timeCredits} Credits</span>
                </div>
                <div className="flex justify-between">
                  <span>Balance After Completion:</span>
                  <span className="font-mono text-emerald-700 dark:text-emerald-400 font-bold">{user.timeCredits - 1} Credits</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition mt-2"
              >
                Confirm Booking (State: Booked)
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Earn Credit Modal (Teach 1 hour) */}
      {showEarnCreditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="max-w-md w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 text-slate-800 dark:text-slate-200 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">Earn Time Credits</h3>
              <button onClick={() => setShowEarnCreditModal(false)} className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-300">
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-600 dark:text-slate-300">
                Log a 1-hour teaching session or workshop you conducted for a classmate:
              </p>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Subject / Skill Taught:</label>
                <input
                  type="text"
                  value={teachSubject}
                  onChange={(e) => setTeachSubject(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800"
                />
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 text-[11px]">
                Upon verification, <strong>+1 Time Credit</strong> will be deposited into your account.
              </div>

              <button
                onClick={handleSimulateTeachHour}
                className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition"
              >
                Deposit +1 Credit to Bank
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
