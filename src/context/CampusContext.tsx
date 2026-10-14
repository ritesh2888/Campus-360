import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  DEFAULT_USER,
  INITIAL_CAMPUS_EVENTS,
  INITIAL_CHALLENGES,
  INITIAL_LEADERBOARD,
  INITIAL_RIDES,
  INITIAL_SUBJECTS,
  PEER_TUTORS,
} from '../data/mockData';
import { MiniMothService } from '../services/minimoth';
import {
  ActivityNotification,
  AuthSession,
  CampusEvent,
  Challenge,
  Division,
  DivisionLeaderboardEntry,
  PeerSession,
  PeerTutor,
  Ride,
  Subject,
  UserProfile,
} from '../types';

interface CampusContextType {
  // Auth & Profile
  user: UserProfile;
  session: AuthSession | null;
  login: (session: AuthSession) => void;
  logout: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;

  // Academic Planner
  subjects: Subject[];
  targetSGPA: number;
  setTargetSGPA: (val: number) => void;
  updateSubjectInternalMarks: (id: string, newInternal: number) => void;
  resetAcademicPlanner: () => void;

  // Rides
  rides: Ride[];
  createRide: (newRide: Omit<Ride, 'id' | 'requests'>) => void;
  requestSeat: (rideId: string) => boolean;
  confirmSeatRequest: (rideId: string, requestId: string) => void;

  // Challenges & Leaderboard
  challenges: Challenge[];
  leaderboard: DivisionLeaderboardEntry[];
  postChallenge: (ch: Omit<Challenge, 'id' | 'completedByDivisions' | 'submissions'>) => void;
  submitChallengeCompletion: (challengeId: string, notes: string) => void;

  // Peer Learning
  peerTutors: PeerTutor[];
  peerSessions: PeerSession[];
  bookPeerSession: (tutorId: string, subjectOrSkill: string, date: string, timeSlot: string) => boolean;
  completePeerSession: (sessionId: string) => void;

  // Events
  events: CampusEvent[];
  registerEvent: (eventId: string) => void;
  updateEventState: (eventId: string, state: CampusEvent['state']) => void;

  // Theme
  theme: 'light' | 'dark';
  toggleTheme: () => void;

  // Notifications
  notifications: ActivityNotification[];
  markNotificationRead: (id: string) => void;
  addNotification: (title: string, message: string, type: ActivityNotification['type']) => void;
}

const CampusContext = createContext<CampusContextType | undefined>(undefined);

export const CampusProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('campus360_theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  useEffect(() => {
    localStorage.setItem('campus360_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Auth state
  const [session, setSession] = useState<AuthSession | null>(() => MiniMothService.getSession());
  const [user, setUser] = useState<UserProfile>(() => {
    const s = MiniMothService.getSession();
    if (s && s.user) {
      if (s.user.rollNo === '2024VESIT042' || s.user.name === 'Ritesh Patil') {
        const fixed: UserProfile = {
          ...s.user,
          name: 'Ritesh Yadav',
          rollNo: '62',
          division: 'D4B',
          branch: 'Electronics & Telecommunication Engineering',
        };
        MiniMothService.saveSession({ ...s, user: fixed });
        return fixed;
      }
      return s.user;
    }
    const local = localStorage.getItem('campus360_user_profile');
    if (local) {
      try {
        const parsed = JSON.parse(local);
        if (parsed.rollNo === '2024VESIT042' || parsed.rollNo === '2026VESIT042' || parsed.name === 'Ritesh Patil') {
          return {
            ...parsed,
            name: 'Ritesh Yadav',
            rollNo: '62',
            division: 'D4B',
            branch: 'Electronics & Telecommunication Engineering',
          };
        }
        return parsed;
      } catch {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  // Academic planner state
  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem('campus360_subjects');
    return saved ? JSON.parse(saved) : INITIAL_SUBJECTS;
  });
  const [targetSGPA, setTargetSGPA] = useState<number>(() => {
    const saved = localStorage.getItem('campus360_target_sgpa');
    return saved ? JSON.parse(saved) : 8.5;
  });

  // Rides state
  const [rides, setRides] = useState<Ride[]>(() => {
    const saved = localStorage.getItem('campus360_rides');
    return saved ? JSON.parse(saved) : INITIAL_RIDES;
  });

  // Challenges & Leaderboard
  const [challenges, setChallenges] = useState<Challenge[]>(() => {
    const saved = localStorage.getItem('campus360_challenges');
    return saved ? JSON.parse(saved) : INITIAL_CHALLENGES;
  });
  const [leaderboard, setLeaderboard] = useState<DivisionLeaderboardEntry[]>(() => {
    const saved = localStorage.getItem('campus360_leaderboard');
    return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
  });

  // Peer Learning
  const [peerTutors] = useState<PeerTutor[]>(PEER_TUTORS);
  const [peerSessions, setPeerSessions] = useState<PeerSession[]>(() => {
    const saved = localStorage.getItem('campus360_peer_sessions');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'sess_init_1',
        tutorId: 'tut_1',
        tutorName: 'Aryan Sharma',
        learnerId: 'usr_default_vesit',
        learnerName: 'Ritesh Yadav',
        subjectOrSkill: 'Engineering Mechanics (FBD & Trusses)',
        state: 'Booked',
        date: 'Today',
        timeSlot: '04:00 PM - 05:00 PM',
        creditsTransferred: 1,
        meetingSpot: 'Library Quiet Room 2',
        notes: 'Bring previous year question paper.',
      },
    ];
  });

  // Events
  const [events, setEvents] = useState<CampusEvent[]>(() => {
    const saved = localStorage.getItem('campus360_events');
    return saved ? JSON.parse(saved) : INITIAL_CAMPUS_EVENTS;
  });

  // Notifications
  const [notifications, setNotifications] = useState<ActivityNotification[]>(() => {
    const saved = localStorage.getItem('campus360_notifications');
    if (saved) return JSON.parse(saved);
    return [
      {
        id: 'notif_1',
        title: 'Academic Alert: Mechanics UT2',
        message: 'Your current internal marks in FEC104 put an "O" grade at risk. Check the planner for needed marks.',
        type: 'academic',
        timestamp: '10 mins ago',
        read: false,
      },
      {
        id: 'notif_2',
        title: 'Class Challenge Update',
        message: 'Division D6B is only 70 points behind your class (D6A)! Complete challenges to stay #1.',
        type: 'challenge',
        timestamp: '1 hour ago',
        read: false,
      },
      {
        id: 'notif_3',
        title: 'Carpool Seat Available',
        message: 'Saurabh Kadam posted a ride from Kurla Station for 8:15 AM tomorrow.',
        type: 'ride',
        timestamp: '2 hours ago',
        read: true,
      },
    ];
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('campus360_user_profile', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('campus360_subjects', JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem('campus360_target_sgpa', JSON.stringify(targetSGPA));
  }, [targetSGPA]);

  useEffect(() => {
    localStorage.setItem('campus360_rides', JSON.stringify(rides));
  }, [rides]);

  useEffect(() => {
    localStorage.setItem('campus360_challenges', JSON.stringify(challenges));
  }, [challenges]);

  useEffect(() => {
    localStorage.setItem('campus360_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  useEffect(() => {
    localStorage.setItem('campus360_peer_sessions', JSON.stringify(peerSessions));
  }, [peerSessions]);

  useEffect(() => {
    localStorage.setItem('campus360_events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('campus360_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Actions
  const addNotification = (title: string, message: string, type: ActivityNotification['type']) => {
    const newNotif: ActivityNotification = {
      id: 'notif_' + Date.now(),
      title,
      message,
      type,
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const login = (newSession: AuthSession) => {
    setSession(newSession);
    setUser(newSession.user);
    MiniMothService.saveSession(newSession);
    addNotification('MiniMoth Authenticated', `Welcome back, ${newSession.user.name}! Token session established.`, 'system');
  };

  const logout = () => {
    setSession(null);
    MiniMothService.logout();
    addNotification('Logged Out', 'You have been safely logged out from MiniMoth.', 'system');
  };

  const updateProfile = (profileUpdate: Partial<UserProfile>) => {
    setUser((prev) => {
      const updated = { ...prev, ...profileUpdate };
      if (session) {
        const updatedSession = { ...session, user: updated };
        setSession(updatedSession);
        MiniMothService.saveSession(updatedSession);
      }
      return updated;
    });
  };

  const updateSubjectInternalMarks = (id: string, newInternal: number) => {
    setSubjects((prev) =>
      prev.map((s) => (s.id === id ? { ...s, internalScored: Math.max(0, Math.min(newInternal, s.internalMax)) } : s))
    );
  };

  const resetAcademicPlanner = () => {
    setSubjects(INITIAL_SUBJECTS);
    setTargetSGPA(8.5);
    addNotification('Planner Reset', 'Academic subjects and internal scores restored to curriculum default.', 'academic');
  };

  const createRide = (newRideData: Omit<Ride, 'id' | 'requests'>) => {
    const newRide: Ride = {
      ...newRideData,
      id: 'ride_' + Date.now(),
      requests: [],
    };
    setRides((prev) => [newRide, ...prev]);
    addNotification('Ride Published', `Your route "${newRide.routeFrom} -> ${newRide.routeTo}" is now live!`, 'ride');
  };

  const requestSeat = (rideId: string): boolean => {
    const targetRide = rides.find((r) => r.id === rideId);
    if (!targetRide || targetRide.availableSeats <= 0) return false;

    // Check if user already requested
    const alreadyRequested = targetRide.requests.some((req) => req.passengerId === user.id);
    if (alreadyRequested) return false;

    setRides((prev) =>
      prev.map((r) => {
        if (r.id === rideId) {
          const req = {
            id: 'req_' + Date.now(),
            rideId,
            passengerId: user.id,
            passengerName: user.name,
            passengerPhone: user.phone,
            passengerRoll: user.rollNo,
            status: 'Pending' as const,
            timestamp: 'Just now',
          };
          return {
            ...r,
            requests: [...r.requests, req],
          };
        }
        return r;
      })
    );

    addNotification('Ride Requested', `Seat request sent to ${targetRide.driverName}. Status: Requested`, 'ride');
    return true;
  };

  const confirmSeatRequest = (rideId: string, requestId: string) => {
    setRides((prev) =>
      prev.map((r) => {
        if (r.id === rideId) {
          const updatedRequests = r.requests.map((req) => (req.id === requestId ? { ...req, status: 'Confirmed' as const } : req));
          return {
            ...r,
            availableSeats: Math.max(0, r.availableSeats - 1),
            requests: updatedRequests,
          };
        }
        return r;
      })
    );
    addNotification('Seat Confirmed!', 'Driver confirmed your seat request. Ride is booked!', 'ride');
  };

  const postChallenge = (chData: Omit<Challenge, 'id' | 'completedByDivisions' | 'submissions'>) => {
    const newChallenge: Challenge = {
      ...chData,
      id: 'ch_' + Date.now(),
      completedByDivisions: [],
      submissions: [],
    };
    setChallenges((prev) => [newChallenge, ...prev]);
    addNotification('New Challenge Posted', `"${newChallenge.title}" with ${newChallenge.points} points is now live!`, 'challenge');
  };

  const submitChallengeCompletion = (challengeId: string, notes: string) => {
    const ch = challenges.find((c) => c.id === challengeId);
    if (!ch) return;

    const userDiv = user.division;

    // Update challenge
    setChallenges((prev) =>
      prev.map((c) => {
        if (c.id === challengeId) {
          const submissions = [
            ...c.submissions,
            {
              division: userDiv,
              submittedBy: `${user.name} (${user.rollNo})`,
              proofUrl: 'https://vesit.edu/proofs/' + Date.now(),
              notes,
              verified: true,
            },
          ];
          const completedBy = Array.from(new Set([...c.completedByDivisions, userDiv]));
          return {
            ...c,
            completedByDivisions: completedBy,
            submissions,
          };
        }
        return c;
      })
    );

    // Update leaderboard
    setLeaderboard((prev) => {
      const updated = prev.map((entry) => {
        if (entry.division === userDiv) {
          return {
            ...entry,
            totalPoints: entry.totalPoints + ch.points,
            challengesCompleted: entry.challengesCompleted + 1,
          };
        }
        return entry;
      });

      // Recalculate ranks based on totalPoints descending
      updated.sort((a, b) => b.totalPoints - a.totalPoints);
      return updated.map((entry, idx) => ({ ...entry, rank: idx + 1 }));
    });

    addNotification(
      'Challenge Completed!',
      `+${ch.points} points awarded to division ${userDiv}! Check the updated leaderboard.`,
      'challenge'
    );
  };

  const bookPeerSession = (tutorId: string, subjectOrSkill: string, date: string, timeSlot: string): boolean => {
    if (user.timeCredits < 1) {
      addNotification(
        'Insufficient Time Credits',
        'You need at least 1 Time Credit to book a tutor. Teach a peer for 1 hour to earn a credit!',
        'peer'
      );
      return false;
    }

    const tutor = peerTutors.find((t) => t.id === tutorId);
    if (!tutor) return false;

    const newSession: PeerSession = {
      id: 'sess_' + Date.now(),
      tutorId,
      tutorName: tutor.name,
      learnerId: user.id,
      learnerName: user.name,
      subjectOrSkill,
      state: 'Booked',
      date,
      timeSlot,
      creditsTransferred: 1,
      meetingSpot: 'Library Ground Floor Discussion Cubicle',
      notes: `Mentorship in ${subjectOrSkill}`,
    };

    setPeerSessions((prev) => [newSession, ...prev]);
    addNotification('Session Booked!', `Booked 1-on-1 peer session with ${tutor.name} for ${subjectOrSkill}.`, 'peer');
    return true;
  };

  const completePeerSession = (sessionId: string) => {
    setPeerSessions((prev) =>
      prev.map((s) => (s.id === sessionId ? { ...s, state: 'Completed' as const } : s))
    );

    // Time-credit economy: Deduct 1 credit from student
    setUser((prev) => ({
      ...prev,
      timeCredits: Math.max(0, prev.timeCredits - 1),
    }));

    addNotification(
      'Session Completed',
      'Session marked Completed! 1 Time-Credit transferred to tutor. Your current balance: ' + (user.timeCredits - 1),
      'peer'
    );
  };

  const registerEvent = (eventId: string) => {
    setEvents((prev) =>
      prev.map((ev) => {
        if (ev.id === eventId) {
          const registered = ev.registeredUserIds.includes(user.id);
          const updated = registered
            ? ev.registeredUserIds.filter((id) => id !== user.id)
            : [...ev.registeredUserIds, user.id];
          return { ...ev, registeredUserIds: updated };
        }
        return ev;
      })
    );
    const ev = events.find((e) => e.id === eventId);
    if (ev) {
      const isNowRegistered = !ev.registeredUserIds.includes(user.id);
      addNotification(
        isNowRegistered ? 'Event RSVP Confirmed' : 'Registration Withdrawn',
        `${isNowRegistered ? 'You are registered for' : 'Removed RSVP for'} ${ev.title}`,
        'event'
      );
    }
  };

  const updateEventState = (eventId: string, state: CampusEvent['state']) => {
    setEvents((prev) => prev.map((ev) => (ev.id === eventId ? { ...ev, state } : ev)));
    const ev = events.find((e) => e.id === eventId);
    if (ev) {
      addNotification('Event Status Updated', `"${ev.title}" is now marked as "${state}".`, 'event');
    }
  };

  return (
    <CampusContext.Provider
      value={{
        user,
        session,
        login,
        logout,
        updateProfile,
        subjects,
        targetSGPA,
        setTargetSGPA,
        updateSubjectInternalMarks,
        resetAcademicPlanner,
        rides,
        createRide,
        requestSeat,
        confirmSeatRequest,
        challenges,
        leaderboard,
        postChallenge,
        submitChallengeCompletion,
        peerTutors,
        peerSessions,
        bookPeerSession,
        completePeerSession,
        events,
        registerEvent,
        updateEventState,
        theme,
        toggleTheme,
        notifications,
        markNotificationRead,
        addNotification,
      }}
    >
      {children}
    </CampusContext.Provider>
  );
};

export const useCampus = () => {
  const context = useContext(CampusContext);
  if (!context) {
    throw new Error('useCampus must be used within a CampusProvider');
  }
  return context;
};
