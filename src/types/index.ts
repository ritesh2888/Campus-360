export type Branch =
  | 'Electronics & Telecommunication Engineering'
  | 'Artificial Intelligence & Data Science'
  | 'Computer Engineering'
  | 'Information Technology'
  | 'Electronics & Computer Science'
  | 'Automation & Robotics';

export type Division =
  | 'D1ADA'
  | 'D1ADB'
  | 'D1EC'
  | 'D2A'
  | 'D2B'
  | 'D2C'
  | 'D3'
  | 'D4A'
  | 'D4B'
  | 'D5A'
  | 'D5B'
  | 'D5C';

export type AcademicYear = 'First Year (FE)' | 'Second Year (SE)' | 'Third Year (TE)' | 'Final Year (BE)';

export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  rollNo: string;
  branch: Branch;
  division: Division;
  year: AcademicYear;
  interests: string[];
  timeCredits: number;
  avatarUrl?: string;
  isVerified: boolean;
}

export interface AuthSession {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
  user: UserProfile;
}

// Academic Planner Types
export interface Subject {
  id: string;
  code: string;
  name: string;
  credits: number;
  internalScored: number; // e.g. out of 40 (UT1 + UT2 + Assignments)
  internalMax: number;   // e.g. 40
  endSemMax: number;     // e.g. 60
  minPassingPercent: number; // e.g. 40% overall (40/100)
  minEndSemPercent: number;  // e.g. 40% in end sem (24/60)
}

export type GradeLetter = 'O' | 'A' | 'B' | 'C' | 'D' | 'P' | 'F';

export interface GradeThreshold {
  grade: GradeLetter;
  points: number;
  minTotalPercent: number; // e.g. O: 80%, A: 75%, B: 70%, C: 60%, D: 50%, P: 40%
  description: string;
}

export interface MarksRequirement {
  grade: GradeLetter;
  points: number;
  minTotalMarks: number;
  marksNeededInEndSem: number;
  isAchievable: boolean;
  statusText: string;
}

export interface SGPATargetResult {
  targetSGPA: number;
  maxPossibleSGPA: number;
  minPossibleSGPA: number;
  isAchievable: boolean;
  recommendedGradeProfile: { subjectCode: string; subjectName: string; requiredGrade: GradeLetter; points: number }[];
  explanation: string;
}

// Ride Sharing Types
export type RideStatus = 'Available' | 'Requested' | 'Confirmed' | 'Completed';

export interface RideRequest {
  id: string;
  rideId: string;
  passengerId: string;
  passengerName: string;
  passengerPhone: string;
  passengerRoll: string;
  status: 'Pending' | 'Confirmed' | 'Rejected';
  timestamp: string;
}

export interface Ride {
  id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  driverRoll: string;
  driverVehicle: string;
  isVerifiedStudent: boolean;
  routeFrom: string;
  routeTo: string;
  departureTime: string;
  availableSeats: number;
  totalSeats: number;
  notes: string;
  fromCoords: [number, number]; // [lat, lng]
  toCoords: [number, number];   // [lat, lng]
  requests: RideRequest[];
}

// Class Challenge Board Types
export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: 'Academics' | 'Campus Life' | 'Sports & Cultural' | 'Cleanliness & Social';
  points: number;
  deadline: string;
  createdByDivision: Division;
  creatorName: string;
  completedByDivisions: Division[];
  submissions: {
    division: Division;
    submittedBy: string;
    proofUrl?: string;
    notes: string;
    verified: boolean;
  }[];
}

export interface DivisionLeaderboardEntry {
  division: Division;
  branch: string;
  totalPoints: number;
  challengesCompleted: number;
  rank: number;
}

// Campus Directory & Location Guide
export interface ContactPerson {
  id: string;
  name: string;
  role: string;
  department: string;
  category: 'Faculty' | 'HOD' | 'Senior Mentor' | 'Lab Staff' | 'Administration' | 'Emergency';
  email: string;
  phone: string;
  cabinOrRoom: string;
  availability: string;
  tags: string[];
}

export interface CampusLocation {
  id: string;
  name: string;
  category: 'Academic' | 'Lab' | 'Facility' | 'Food' | 'Admin' | 'Sports';
  description: string;
  floor: string;
  block: string;
  coords: [number, number]; // [lat, lng]
  timing: string;
  contactPerson?: string;
}

// Peer Learning Time-Credit Economy
export type SessionState = 'Matched' | 'Booked' | 'Completed' | 'Cancelled';

export interface PeerTutor {
  id: string;
  userId: string;
  name: string;
  rollNo: string;
  division: Division;
  subjectsCanTeach: string[];
  skills: string[];
  creditsPerHour: number; // default 1
  rating: number;
  reviewsCount: number;
  bio: string;
}

export interface PeerSession {
  id: string;
  tutorId: string;
  tutorName: string;
  learnerId: string;
  learnerName: string;
  subjectOrSkill: string;
  state: SessionState;
  date: string;
  timeSlot: string;
  creditsTransferred: number;
  meetingSpot: string;
  notes?: string;
}

// Campus Events Types
export type EventState = 'Registration Open' | 'Starting Soon' | 'Live Now' | 'Event Ended';

export interface CampusEvent {
  id: string;
  title: string;
  organizer: string;
  category: 'Tech' | 'Cultural' | 'Workshop' | 'Sports';
  state: EventState;
  date: string;
  time: string;
  venue: string;
  description: string;
  registeredUserIds: string[];
  bannerGradient: string;
}

// Notification & Activity Feed
export interface ActivityNotification {
  id: string;
  title: string;
  message: string;
  type: 'academic' | 'ride' | 'challenge' | 'peer' | 'event' | 'system';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}
