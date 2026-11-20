import React, { createContext, useContext, useState, useEffect } from 'react';
import { PageId, KnowledgeItem, SupportTicket, ChatMessage, DepartmentInfo } from '../types';
import { api } from '../services/api';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
  isAdminMode: boolean;
  toggleAdminMode: () => void;
  isDemoMode: boolean;
  geminiConfigured: boolean;
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  
  // Knowledge Base
  knowledge: KnowledgeItem[];
  refreshKnowledge: () => Promise<void>;
  addKnowledgeItem: (item: Omit<KnowledgeItem, 'id' | 'lastUpdated' | 'verified'>) => Promise<void>;
  updateKnowledgeItem: (id: string, updates: Partial<KnowledgeItem>) => Promise<void>;
  deleteKnowledgeItem: (id: string) => Promise<void>;

  // Tickets
  tickets: SupportTicket[];
  refreshTickets: () => Promise<void>;
  createTicket: (data: Omit<SupportTicket, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => Promise<SupportTicket>;
  updateTicketStatus: (id: string, status: SupportTicket['status'], resolutionNotes?: string) => Promise<void>;

  // Chat
  chatMessages: ChatMessage[];
  isChatLoading: boolean;
  sendChatMessage: (text: string) => Promise<void>;
  clearChat: () => void;

  // Departments
  departments: DepartmentInfo[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('landing');
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isAdminMode, setIsAdminMode] = useState<boolean>(false);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);
  const [geminiConfigured, setGeminiConfigured] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Data states
  const [knowledge, setKnowledge] = useState<KnowledgeItem[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [departments] = useState<DepartmentInfo[]>(api.getDepartments());
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  
  // Chat messages with initial greeting
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = localStorage.getItem('campusmind_chat_messages');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'welcome-msg',
        sender: 'assistant',
        text: `### Welcome to CampusMind AI 👋\nI am your intelligent digital campus assistant for Apex Institute of Technology.\n\nI can help you with:\n* **Admissions & Eligibility:** Entrance exams, merit cutoffs, and required documents.\n* **Courses & Curriculum:** B.Tech AI & Data Science, CSE, ECE, labs, and syllabus.\n* **Fees & Scholarships:** Semester payment deadlines and Chancellor's Merit aid.\n* **Rules & Attendance:** 75% attendance policy and exam grading scheme.\n* **Campus & Hostel Life:** AC/Non-AC rooms, mess charges, Wi-Fi, and HPC Supercomputing lab.\n\n*How may I assist you today?*`,
        timestamp: new Date().toISOString(),
        suggestedQuestions: [
          'What are the attendance rules and relaxation policies?',
          'Tell me about B.Tech AI & Data Science intake and fees',
          'What scholarships are available for new applicants?',
          'What are the hostel room options and mess charges?'
        ]
      }
    ];
  });

  // Sync theme with document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
  }, [theme]);

  // Check health and load initial data
  useEffect(() => {
    api.checkHealth().then(health => {
      setGeminiConfigured(health.geminiConfigured);
      setIsDemoMode(!health.geminiConfigured);
    });

    refreshKnowledge();
    refreshTickets();
  }, []);

  // Sync chat messages to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('campusmind_chat_messages', JSON.stringify(chatMessages));
    } catch {}
  }, [chatMessages]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const toggleAdminMode = () => {
    setIsAdminMode(prev => {
      const next = !prev;
      showToast(next ? 'Demo Admin Mode Activated (FAQ & Ticket editing enabled)' : 'Admin Mode Deactivated', 'info');
      return next;
    });
  };

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString().slice(2, 6)}`;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refreshKnowledge = async () => {
    try {
      const items = await api.getKnowledge();
      setKnowledge(items);
    } catch (err) {
      console.error(err);
    }
  };

  const addKnowledgeItem = async (item: Omit<KnowledgeItem, 'id' | 'lastUpdated' | 'verified'>) => {
    const added = await api.addKnowledge(item);
    setKnowledge(prev => [added, ...prev]);
    showToast(`Added knowledge entry: "${added.title}"`, 'success');
  };

  const updateKnowledgeItem = async (id: string, updates: Partial<KnowledgeItem>) => {
    const updated = await api.updateKnowledge(id, updates);
    setKnowledge(prev => prev.map(k => (k.id === id ? updated : k)));
    showToast(`Updated knowledge entry: "${updated.title}"`, 'success');
  };

  const deleteKnowledgeItem = async (id: string) => {
    await api.deleteKnowledge(id);
    setKnowledge(prev => prev.filter(k => k.id !== id));
    showToast(`Knowledge item removed.`, 'info');
  };

  const refreshTickets = async () => {
    try {
      const t = await api.getTickets();
      setTickets(t);
    } catch (err) {
      console.error(err);
    }
  };

  const createTicket = async (data: Omit<SupportTicket, 'id' | 'status' | 'createdAt' | 'updatedAt'>) => {
    const ticket = await api.createTicket(data);
    setTickets(prev => [ticket, ...prev]);
    showToast(`Support ticket ${ticket.id} created successfully!`, 'success');
    return ticket;
  };

  const updateTicketStatus = async (id: string, status: SupportTicket['status'], resolutionNotes?: string) => {
    const updated = await api.updateTicketStatus(id, status, resolutionNotes);
    setTickets(prev => prev.map(t => (t.id === id ? updated : t)));
    showToast(`Ticket ${id} status updated to: ${status}`, 'success');
  };

  const sendChatMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toISOString()
    };

    setChatMessages(prev => [...prev, userMessage]);
    setIsChatLoading(true);

    try {
      const assistantMessage = await api.sendMessage(text, [...chatMessages, userMessage]);
      setChatMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setChatMessages(prev => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: `⚠️ I encountered an issue connecting to the AI service. Please try again.`,
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const clearChat = () => {
    const initialWelcome: ChatMessage = {
      id: `welcome-${Date.now()}`,
      sender: 'assistant',
      text: `### Conversation Cleared 🧹\nHow else can I help you today? Select any suggested query below or type your question.`,
      timestamp: new Date().toISOString(),
      suggestedQuestions: [
        'What are the admission eligibility requirements?',
        'What are the campus placement highlights?',
        'How do I report a hostel maintenance issue?'
      ]
    };
    setChatMessages([initialWelcome]);
    showToast('Chat history cleared', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        theme,
        toggleTheme,
        isAdminMode,
        toggleAdminMode,
        isDemoMode,
        geminiConfigured,
        toasts,
        showToast,
        removeToast,
        knowledge,
        refreshKnowledge,
        addKnowledgeItem,
        updateKnowledgeItem,
        deleteKnowledgeItem,
        tickets,
        refreshTickets,
        createTicket,
        updateTicketStatus,
        chatMessages,
        isChatLoading,
        sendChatMessage,
        clearChat,
        departments
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
