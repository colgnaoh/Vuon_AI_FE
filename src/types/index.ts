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
  date: string;
  location: string;
  description: string;
  registeredCount: number;
  isRegistered?: boolean;
}
