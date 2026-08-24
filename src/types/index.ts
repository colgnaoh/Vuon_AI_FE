export type GlobalRole = 'Visitor' | 'Member' | 'LabManager' | 'Admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  globalRole: GlobalRole;
}

export interface UserProfile {
  id: string;
  fullName: string;
  avatarUrl?: string;
  bio?: string;
  skills: string[];
  interests: string[];
  lookingFor?: string;
  globalRole: GlobalRole;
  createdAt?: string;
}

export type IdeaStatus = 'Open' | 'Converted' | 'Closed';

export interface Comment {
  id: string;
  ideaId: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  content: string;
  createdAt: string;
}

export interface Idea {
  id: string;
  title: string;
  summary: string;
  description: string;
  authorId: string;
  authorName: string;
  authorAvatar?: string;
  requiredTech: string[];
  lookingForRoles: string[];
  status: IdeaStatus;
  commentCount: number;
  createdAt: string;
  convertedFromIdeaId?: string;
}

export type ProjectStatus = 'Recruiting' | 'Building' | 'Testing' | 'Completed' | 'Paused';

export interface ProjectMember {
  userId: string;
  fullName: string;
  avatarUrl?: string;
  roleInProject: string;
  status: 'Pending' | 'Active';
  joinedAt: string;
}

export interface Project {
  id: string;
  title: string;
  summary: string;
  description: string;
  leaderId: string;
  leaderName: string;
  leaderAvatar?: string;
  techStack: string[];
  domainCategory: 'AI' | 'Robotics' | 'IoT' | 'Embedded' | 'Software';
  status: ProjectStatus;
  members: ProjectMember[];
  equipmentUsed: string[];
  convertedFromIdeaId?: string;
  createdAt: string;
}

export type EquipmentCategory = 'AI' | 'Robotics' | 'IoT' | 'Embedded' | 'Maker' | 'Vision';
export type EquipmentStatus = 'Available' | 'Borrowed' | 'Maintenance' | 'Reserved';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  description: string;
  specifications?: string;
  status: EquipmentStatus;
  imageUrl?: string;
  location?: string;
}

export type BookingStatus = 'Pending' | 'Active' | 'Returned' | 'ReturnedLate' | 'Cancelled';

export interface Booking {
  id: string;
  equipmentId: string;
  equipmentName: string;
  userId: string;
  userName: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: BookingStatus;
  createdAt: string;
  returnedAt?: string;
}

export interface SystemMetrics {
  totalUsers: number;
  totalIdeas: number;
  activeProjects: number;
  activeBookings: number;
  totalEquipment: number;
}

export interface TechEvent {
  id: string;
  title: string;
  category: 'Workshop' | 'Tech Talk' | 'Hackathon' | 'Build Night' | 'Demo Day';
  speaker: string;
  speakerRole?: string;
  speakerAvatar?: string;
  date: string;
  location: string;
  description: string;
  agenda?: { time: string; topic: string }[];
  registeredCount: number;
  maxParticipants?: number;
  isRegistered?: boolean;
  imageUrl?: string;
}

export interface EventAttendee {
  userId: string;
  fullName: string;
  email?: string;
  avatarUrl?: string;
  registeredAt: string;
  isCheckedIn: boolean;
  checkedInAt?: string;
}

export interface Mentor {
  id: string;
  fullName: string;
  avatarUrl?: string;
  title: string;
  company?: string;
  bio: string;
  expertise: string[];
  lookingForMentees: boolean;
  rating: number;
  totalMentees: number;
  contactEmail?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export type MentorRequestStatus = 'Pending' | 'Approved' | 'Rejected';

export interface MentorRequest {
  id: string;
  mentorId: string;
  mentorName?: string;
  studentId: string;
  studentName: string;
  studentAvatar?: string;
  projectId?: string;
  projectTitle?: string;
  topic: string;
  description: string;
  status: MentorRequestStatus;
  createdAt: string;
}

export interface Lab {
  id: string;
  name: string;
  location: string;
  description: string;
  imageUrl?: string;
  status: 'Open' | 'Maintenance' | 'Full';
  capacity: number;
  activeWorkstations: number;
  equipmentCount: number;
  aiCameraActive: boolean;
  facilities: string[];
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'Booking' | 'Idea' | 'Project' | 'Event' | 'System';
  isRead: boolean;
  createdAt: string;
  linkUrl?: string;
}

export interface AdminBookingApproval {
  id: string;
  equipmentId: string;
  equipmentName: string;
  userId: string;
  userName: string;
  userEmail?: string;
  startDate: string;
  endDate: string;
  purpose: string;
  status: BookingStatus;
  createdAt: string;
}

export interface AdminIdeaApproval {
  id: string;
  title: string;
  summary: string;
  authorName: string;
  authorId: string;
  requiredTech: string[];
  status: IdeaStatus;
  createdAt: string;
}

export interface AdminProjectApproval {
  id: string;
  title: string;
  summary: string;
  leaderName: string;
  leaderId: string;
  techStack: string[];
  domainCategory: string;
  status: ProjectStatus;
  createdAt: string;
}

