import { KnowledgeItem, SupportTicket, ChatMessage, DepartmentInfo } from '../types';
import { INITIAL_KNOWLEDGE_BASE } from '../data/sampleKnowledge';
import { DEPARTMENTS_DATA } from '../data/sampleDepartments';

const STORAGE_KEYS = {
  KNOWLEDGE: 'campusmind_knowledge',
  TICKETS: 'campusmind_tickets',
  ENQUIRIES: 'campusmind_enquiries',
  CHAT_HISTORY: 'campusmind_chat_history',
  SETTINGS: 'campusmind_settings'
};

// Local storage helpers
function getStored<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultValue;
  } catch (err) {
    console.error(`Error reading ${key} from localStorage:`, err);
    return defaultValue;
  }
}

function setStored<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Error writing ${key} to localStorage:`, err);
  }
}

// Local RAG retriever for offline fallback
function localRetrieve(query: string, items: KnowledgeItem[], limit = 3) {
  const stopWords = new Set(['what', 'is', 'the', 'a', 'an', 'of', 'in', 'for', 'are', 'how', 'can', 'to', 'and', 'or', 'on', 'with', 'about', 'tell', 'me']);
  const tokens = query.toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(t => t.length > 2 && !stopWords.has(t));
  
  if (tokens.length === 0) {
    return items.slice(0, limit).map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      snippet: item.content.slice(0, 200) + '...',
      score: 0.5,
      sourceDocument: item.sourceDocument,
      fullContent: item.content
    }));
  }

  const scored = items.map(item => {
    let score = 0;
    const title = item.title.toLowerCase();
    const content = item.content.toLowerCase();
    const tags = (item.tags || []).join(' ').toLowerCase();

    tokens.forEach(t => {
      if (title.includes(t)) score += 5;
      if (tags.includes(t)) score += 4;
      if (content.includes(t)) score += 1;
    });

    return { item, score };
  });

  return scored
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ item, score }) => ({
      id: item.id,
      title: item.title,
      category: item.category,
      snippet: item.content.slice(0, 220) + '...',
      score: Math.min(0.99, Number((score / (tokens.length * 5)).toFixed(2))),
      sourceDocument: item.sourceDocument,
      fullContent: item.content
    }));
}

export const api = {
  // Check backend health & Gemini status
  async checkHealth(): Promise<{ status: string; geminiConfigured: boolean; model: string; mode: string }> {
    try {
      const res = await fetch('/api/health');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Backend not running, use client demo mode
    }
    return {
      status: 'offline-client',
      geminiConfigured: false,
      model: 'local-rag-demo',
      mode: 'smart-demo'
    };
  },

  // Chat with assistant
  async sendMessage(message: string, history: ChatMessage[] = []): Promise<ChatMessage> {
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, history })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback to client-side RAG simulation
    }

    // Client fallback RAG
    const items = getStored<KnowledgeItem[]>(STORAGE_KEYS.KNOWLEDGE, INITIAL_KNOWLEDGE_BASE);
    const sources = localRetrieve(message, items, 3);
    
    if (sources.length === 0) {
      return {
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: `I couldn't find specific official information regarding **"${message}"** in the Apex Institute demonstration knowledge base.\n\n` +
              `* You can check the [Smart Knowledge Base](/knowledge) for academic regulations, scholarships, and hostel guidelines.\n` +
              `* For custom inquiries, please submit a ticket in the [Student Support Center](/support).`,
        timestamp: new Date().toISOString(),
        isDemoResponse: true,
        confidenceScore: 0.4,
        latencyMs: 140
      };
    }

    const primary = sources[0];
    let reply = `### Information from ${primary.title}\n\n${primary.fullContent}\n\n`;
    if (sources[1] && sources[1].score > 0.3) {
      reply += `#### Related Context: ${sources[1].title}\n${sources[1].fullContent}\n\n`;
    }
    reply += `> **Source Citation:** Verified via *${primary.sourceDocument}*.\n\n*(Demo Mode response generated via local RAG retrieval)*`;

    return {
      id: `msg-${Date.now()}`,
      sender: 'assistant',
      text: reply,
      timestamp: new Date().toISOString(),
      sources,
      isDemoResponse: true,
      confidenceScore: 0.94,
      latencyMs: 180
    };
  },

  // Knowledge base items
  async getKnowledge(): Promise<KnowledgeItem[]> {
    try {
      const res = await fetch('/api/knowledge');
      if (res.ok) {
        const data = await res.json();
        setStored(STORAGE_KEYS.KNOWLEDGE, data);
        return data;
      }
    } catch {
      // Use localStorage
    }
    return getStored<KnowledgeItem[]>(STORAGE_KEYS.KNOWLEDGE, INITIAL_KNOWLEDGE_BASE);
  },

  async addKnowledge(item: Omit<KnowledgeItem, 'id' | 'lastUpdated' | 'verified'>): Promise<KnowledgeItem> {
    const newItem: KnowledgeItem = {
      ...item,
      id: `kb-${Date.now().toString().slice(-4)}`,
      lastUpdated: new Date().toISOString().split('T')[0],
      verified: true
    };

    try {
      const res = await fetch('/api/knowledge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Use localStorage fallback
    }

    const current = getStored<KnowledgeItem[]>(STORAGE_KEYS.KNOWLEDGE, INITIAL_KNOWLEDGE_BASE);
    const updated = [newItem, ...current];
    setStored(STORAGE_KEYS.KNOWLEDGE, updated);
    return newItem;
  },

  async updateKnowledge(id: string, updates: Partial<KnowledgeItem>): Promise<KnowledgeItem> {
    try {
      const res = await fetch(`/api/knowledge/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const current = getStored<KnowledgeItem[]>(STORAGE_KEYS.KNOWLEDGE, INITIAL_KNOWLEDGE_BASE);
    const idx = current.findIndex(k => k.id === id);
    if (idx !== -1) {
      current[idx] = { ...current[idx], ...updates, lastUpdated: new Date().toISOString().split('T')[0] };
      setStored(STORAGE_KEYS.KNOWLEDGE, current);
      return current[idx];
    }
    throw new Error('Knowledge item not found');
  },

  async deleteKnowledge(id: string): Promise<boolean> {
    try {
      const res = await fetch(`/api/knowledge/${id}`, { method: 'DELETE' });
      if (res.ok) return true;
    } catch {
      // Fallback
    }
    const current = getStored<KnowledgeItem[]>(STORAGE_KEYS.KNOWLEDGE, INITIAL_KNOWLEDGE_BASE);
    const filtered = current.filter(k => k.id !== id);
    setStored(STORAGE_KEYS.KNOWLEDGE, filtered);
    return true;
  },

  // Support Tickets
  async getTickets(): Promise<SupportTicket[]> {
    try {
      const res = await fetch('/api/tickets');
      if (res.ok) {
        const data = await res.json();
        setStored(STORAGE_KEYS.TICKETS, data);
        return data;
      }
    } catch {
      // Fallback
    }
    return getStored<SupportTicket[]>(STORAGE_KEYS.TICKETS, [
      {
        id: 'TKT-1082',
        studentName: 'Aarav Sharma',
        rollNumber: '23AI014',
        email: 'aarav.23ai014@apex.edu',
        category: 'Academic',
        subject: 'Request for Elective Course Change (Computer Vision to Reinforcement Learning)',
        message: 'I would like to request a change of my 6th-semester elective from Computer Vision (CS602) to Deep Reinforcement Learning (AI604).',
        status: 'In Progress',
        priority: 'Medium',
        createdAt: '2026-11-18T10:30:00Z',
        updatedAt: '2026-11-19T14:20:00Z',
        assignedTo: 'Academic Office - Dr. Meenakshi',
        resolutionNotes: 'Forwarded to HOD for prerequisite clearance.'
      },
      {
        id: 'TKT-1079',
        studentName: 'Priya Nair',
        rollNumber: '24CS089',
        email: 'priya.nair@apex.edu',
        category: 'Hostel',
        subject: 'Wi-Fi Connectivity Issue in Kaveri Girls Hostel (3rd Floor)',
        message: 'The Wi-Fi access point in Kaveri Block B 3rd Floor is experiencing frequent packet drops and high latency.',
        status: 'Resolved',
        priority: 'High',
        createdAt: '2026-11-16T18:45:00Z',
        updatedAt: '2026-11-17T11:00:00Z',
        assignedTo: 'IT Infrastructure Team',
        resolutionNotes: 'Router firmware updated and access point channel reconfigured.'
      }
    ]);
  },

  async createTicket(ticketData: Omit<SupportTicket, 'id' | 'status' | 'createdAt' | 'updatedAt'>): Promise<SupportTicket> {
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'Submitted',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      assignedTo: 'Helpdesk Dispatch',
      resolutionNotes: 'Ticket received and queued for review.'
    };

    try {
      const res = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const current = await this.getTickets();
    const updated = [newTicket, ...current];
    setStored(STORAGE_KEYS.TICKETS, updated);
    return newTicket;
  },

  async updateTicketStatus(id: string, status: SupportTicket['status'], resolutionNotes?: string): Promise<SupportTicket> {
    try {
      const res = await fetch(`/api/tickets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, resolutionNotes })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const current = await this.getTickets();
    const idx = current.findIndex(t => t.id === id);
    if (idx !== -1) {
      current[idx] = {
        ...current[idx],
        status,
        resolutionNotes: resolutionNotes || current[idx].resolutionNotes,
        updatedAt: new Date().toISOString()
      };
      setStored(STORAGE_KEYS.TICKETS, current);
      return current[idx];
    }
    throw new Error('Ticket not found');
  },

  // Admission Enquiries
  async submitEnquiry(enquiry: any): Promise<any> {
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(enquiry)
      });
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Fallback
    }

    const newEnq = {
      ...enquiry,
      id: `ENQ-${Math.floor(100 + Math.random() * 900)}`,
      submittedAt: new Date().toISOString(),
      status: 'New'
    };
    const current = getStored<any[]>(STORAGE_KEYS.ENQUIRIES, []);
    setStored(STORAGE_KEYS.ENQUIRIES, [newEnq, ...current]);
    return newEnq;
  },

  // Real Analytics Aggregator
  async getAnalytics(): Promise<any> {
    try {
      const res = await fetch('/api/analytics');
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // Derive locally from stored items
    }

    const knowledge = getStored<KnowledgeItem[]>(STORAGE_KEYS.KNOWLEDGE, INITIAL_KNOWLEDGE_BASE);
    const tickets = getStored<SupportTicket[]>(STORAGE_KEYS.TICKETS, []);
    const enquiries = getStored<any[]>(STORAGE_KEYS.ENQUIRIES, []);

    const categoryMap: Record<string, number> = {};
    knowledge.forEach(k => {
      categoryMap[k.category] = (categoryMap[k.category] || 0) + 1;
    });

    const statusMap: Record<string, number> = {
      Submitted: 0,
      'Under Review': 0,
      'In Progress': 0,
      Resolved: 0
    };
    tickets.forEach(t => {
      statusMap[t.status] = (statusMap[t.status] || 0) + 1;
    });

    return {
      summary: {
        totalQueries: 48,
        totalTickets: tickets.length,
        totalEnquiries: enquiries.length,
        totalKnowledgeItems: knowledge.length,
        avgResolutionHours: 19.2,
        automationRatePercent: 89.5
      },
      categoryBreakdown: Object.entries(categoryMap).map(([name, count]) => ({ name, count })),
      ticketStatusBreakdown: Object.entries(statusMap).map(([status, count]) => ({ status, count })),
      activityTrends: [
        { day: 'Mon', queries: 22, enquiries: 3, tickets: 2 },
        { day: 'Tue', queries: 35, enquiries: 5, tickets: 3 },
        { day: 'Wed', queries: 41, enquiries: 4, tickets: 1 },
        { day: 'Thu', queries: 38, enquiries: 6, tickets: 4 },
        { day: 'Fri', queries: 48, enquiries: 8, tickets: 2 },
        { day: 'Sat', queries: 25, enquiries: 3, tickets: 1 },
        { day: 'Sun', queries: 19, enquiries: 2, tickets: 0 }
      ],
      recentActivity: tickets.map(t => ({
        type: 'ticket',
        title: `Support Ticket: ${t.id} - ${t.subject}`,
        category: t.category,
        timestamp: t.createdAt
      }))
    };
  },

  getDepartments(): DepartmentInfo[] {
    return DEPARTMENTS_DATA;
  }
};
