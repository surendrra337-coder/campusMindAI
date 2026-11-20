export type PageId =
  | 'landing'
  | 'dashboard'
  | 'chat'
  | 'knowledge'
  | 'admission'
  | 'courses'
  | 'support'
  | 'voice'
  | 'analytics'
  | 'about';

export type KnowledgeCategory =
  | 'Admissions'
  | 'Courses & Curriculum'
  | 'Fees & Scholarships'
  | 'Placements'
  | 'Campus & Facilities'
  | 'Examinations'
  | 'Hostel & Life'
  | 'Important Contacts'
  | 'Rules & Policies';

export interface KnowledgeItem {
  id: string;
  title: string;
  category: KnowledgeCategory;
  department?: string;
  content: string;
  tags: string[];
  lastUpdated: string;
  sourceDocument: string;
  verified: boolean;
  priority: 'high' | 'medium' | 'low';
}

export interface RagSource {
  id: string;
  title: string;
  category: string;
  snippet: string;
  score: number;
  sourceDocument: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant' | 'system';
  text: string;
  timestamp: string;
  sources?: RagSource[];
  isDemoResponse?: boolean;
  confidenceScore?: number;
  latencyMs?: number;
  feedback?: 'like' | 'dislike';
  suggestedQuestions?: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

export type TicketCategory =
  | 'Academic'
  | 'Fee & Scholarship'
  | 'Hostel'
  | 'Placement'
  | 'Examinations'
  | 'Technical Support'
  | 'General';

export type TicketStatus = 'Submitted' | 'Under Review' | 'In Progress' | 'Resolved';

export interface SupportTicket {
  id: string;
  studentName: string;
  rollNumber: string;
  email: string;
  category: TicketCategory;
  subject: string;
  message: string;
  status: TicketStatus;
  createdAt: string;
  updatedAt: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  assignedTo?: string;
  resolutionNotes?: string;
}

export interface DepartmentInfo {
  id: string;
  name: string;
  code: string;
  degree: string;
  duration: string;
  intake: number;
  annualFee: number;
  eligibility: string;
  minCutoffPercentile: number;
  description: string;
  hod: {
    name: string;
    designation: string;
    email: string;
    qualification: string;
  };
  keySubjects: string[];
  labs: string[];
  careerProspects: string[];
  avgPackageLPA: number;
  highestPackageLPA: number;
  topRecruiters: string[];
}

export interface Announcement {
  id: string;
  title: string;
  category: 'Notice' | 'Event' | 'Exam' | 'Placement' | 'Scholarship';
  date: string;
  urgent: boolean;
  summary: string;
  linkText?: string;
  targetPage?: PageId;
}

export interface AppSettings {
  demoMode: boolean; // if true, uses smart local RAG generation without external API
  apiKey: string;
  model: string;
  temperature: number;
  soundEnabled: boolean;
  voiceGender: 'male' | 'female';
  speechRate: number;
}
