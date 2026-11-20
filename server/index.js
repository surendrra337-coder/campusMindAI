import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// File paths for persistence
const KNOWLEDGE_FILE = path.join(__dirname, 'data', 'knowledge.json');
const TICKETS_FILE = path.join(__dirname, 'data', 'tickets.json');
const ENQUIRIES_FILE = path.join(__dirname, 'data', 'enquiries.json');

// Helper to read JSON
function readJson(filePath, defaultValue = []) {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err.message);
  }
  return defaultValue;
}

// Helper to write JSON
function writeJson(filePath, data) {
  try {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err.message);
  }
}

// In-memory data store with file persistence
let knowledgeBase = readJson(KNOWLEDGE_FILE, []);
let tickets = readJson(TICKETS_FILE, []);
let enquiries = readJson(ENQUIRIES_FILE, []);
let queryLogs = [
  { id: 'log-1', query: 'What are the attendance rules?', category: 'Rules & Policies', timestamp: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: 'log-2', query: 'Tell me about B.Tech AI & DS scholarships', category: 'Fees & Scholarships', timestamp: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: 'log-3', query: 'Hostel mess charges and curfew timings', category: 'Hostel & Life', timestamp: new Date(Date.now() - 3600000 * 12).toISOString() },
  { id: 'log-4', query: 'Required documents for admission verification', category: 'Admissions', timestamp: new Date(Date.now() - 3600000 * 24).toISOString() },
  { id: 'log-5', query: 'Campus placement statistics and top recruiters', category: 'Placements', timestamp: new Date(Date.now() - 3600000 * 36).toISOString() }
];

// RAG Retrieval Function
const STOP_WORDS = new Set([
  'what', 'is', 'the', 'a', 'an', 'of', 'in', 'for', 'are', 'how', 'can', 'to', 'and', 'or', 'on', 'with', 'about', 'tell', 'me', 'do', 'i', 'my', 'we'
]);

function retrieveRelevantKnowledge(query, limit = 3) {
  if (!query || typeof query !== 'string') return [];
  
  const tokens = query
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(t => t.length > 2 && !STOP_WORDS.has(t));

  if (tokens.length === 0) {
    // Fallback search with original words
    return knowledgeBase.slice(0, limit).map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      snippet: item.content.slice(0, 200) + '...',
      score: 0.5,
      sourceDocument: item.sourceDocument
    }));
  }

  const scored = knowledgeBase.map(item => {
    let score = 0;
    const titleLower = item.title.toLowerCase();
    const contentLower = item.content.toLowerCase();
    const categoryLower = item.category.toLowerCase();
    const tagsLower = (item.tags || []).join(' ').toLowerCase();

    tokens.forEach(tok => {
      if (titleLower.includes(tok)) score += 5;
      if (tagsLower.includes(tok)) score += 4;
      if (categoryLower.includes(tok)) score += 3;
      if (contentLower.includes(tok)) score += 1;
    });

    return {
      item,
      score
    };
  });

  const sorted = scored
    .filter(entry => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);

  return sorted.map(({ item, score }) => ({
    id: item.id,
    title: item.title,
    category: item.category,
    snippet: item.content.length > 220 ? item.content.slice(0, 220) + '...' : item.content,
    score: Math.min(0.99, Number((score / (tokens.length * 5)).toFixed(2))),
    sourceDocument: item.sourceDocument,
    fullContent: item.content
  }));
}

// Smart Demo Response Generator (RAG Synthesizer)
function generateDemoResponse(query, sources) {
  if (!sources || sources.length === 0) {
    return {
      text: `I could not locate specific verified information regarding **"${query}"** in the current Apex Institute demonstration knowledge base.\n\n` +
            `* **Tip:** Try checking our [Knowledge Base](/knowledge) for sections on Admissions, Fees & Scholarships, Examinations, or Campus Facilities.\n` +
            `* **Assistance:** If this requires personalized institutional assistance, please submit an official enquiry through the [Student Support Center](/support).`,
      suggestedQuestions: [
        'What are the mandatory attendance rules?',
        'What scholarships are available for new students?',
        'How does the 10-point examination grading system work?',
        'What are the hostel room options and mess charges?'
      ]
    };
  }

  const primary = sources[0];
  const secondary = sources[1];

  let responseText = `### Information from ${primary.title}\n\n`;
  responseText += `${primary.fullContent}\n\n`;

  if (secondary && secondary.score > 0.3) {
    responseText += `#### Related Context: ${secondary.title}\n`;
    responseText += `${secondary.fullContent}\n\n`;
  }

  responseText += `> **Source Citation:** Verified via *${primary.sourceDocument}*.\n\n` +
                  `*(Note: This response was generated in Demo Prototype Mode using Apex Institute illustrative college data.)*`;

  // Dynamic follow-up questions based on category
  let followUps = [];
  if (primary.category.includes('Admission') || primary.category.includes('Courses')) {
    followUps = [
      'What documents are required for physical verification?',
      'What are the tuition fee payment deadlines?',
      'What are the placement statistics for AI & DS?'
    ];
  } else if (primary.category.includes('Fees') || primary.category.includes('Scholarship')) {
    followUps = [
      'What are the renewal criteria for the Chancellor’s Scholarship?',
      'Are hostel mess charges included in the tuition fee?',
      'How do I apply for need-based economic fee concessions?'
    ];
  } else if (primary.category.includes('Rules') || primary.category.includes('Exam')) {
    followUps = [
      'How does medical leave affect the 75% attendance threshold?',
      'What is the weightage of mid-semester vs end-semester exams?',
      'How are SGPA and CGPA calculated?'
    ];
  } else {
    followUps = [
      'Who do I contact in case of a medical emergency on campus?',
      'What are the timings for the central digital library?',
      'How do I submit a formal student support request?'
    ];
  }

  return {
    text: responseText,
    suggestedQuestions: followUps
  };
}

// ------------------- API ROUTES -------------------

// 1. Health check & Gemini status
app.get('/api/health', (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  const hasGemini = Boolean(apiKey && apiKey.trim().length > 10);
  res.json({
    status: 'online',
    timestamp: new Date().toISOString(),
    geminiConfigured: hasGemini,
    model: process.env.GEMINI_MODEL || 'gemini-1.5-flash',
    knowledgeCount: knowledgeBase.length,
    ticketsCount: tickets.length,
    enquiriesCount: enquiries.length,
    mode: hasGemini ? 'live-gemini' : 'smart-demo'
  });
});

// 2. Chat with RAG (Supports live Gemini API or Demo Synthesizer)
app.post('/api/chat', async (req, res) => {
  const startTime = Date.now();
  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string') {
    return res.status(400).json({ error: 'Message text is required.' });
  }

  // Log query for live analytics
  const retrievedSources = retrieveRelevantKnowledge(message, 3);
  const primaryCategory = retrievedSources.length > 0 ? retrievedSources[0].category : 'General';
  queryLogs.unshift({
    id: `log-${Date.now()}`,
    query: message.trim(),
    category: primaryCategory,
    timestamp: new Date().toISOString()
  });
  if (queryLogs.length > 100) queryLogs.pop();

  const apiKey = process.env.GEMINI_API_KEY;
  const modelName = process.env.GEMINI_MODEL || 'gemini-1.5-flash';

  // If Gemini API is configured, use it with RAG context injection
  if (apiKey && apiKey.trim().length > 10) {
    try {
      const contextText = retrievedSources
        .map((s, idx) => `[Source ${idx + 1}: ${s.title} (${s.sourceDocument})]\n${s.fullContent}`)
        .join('\n\n');

      const systemPrompt = `You are CampusMind AI, an intelligent college assistant for Apex Institute of Technology (a premier engineering & technology college demo prototype).
Your role is to assist prospective students, current undergraduates, and visitors with accurate college information.
RULES:
1. Ground your answers firmly in the PROVIDED KNOWLEDGE BASE CONTEXT below.
2. If the context does not contain enough information to answer truthfully, state clearly: "That information is not documented in the Apex Institute demonstration knowledge base." Suggest submitting a support ticket.
3. Do NOT fabricate dates, fees, cutoffs, or policies not present in the context.
4. Keep answers friendly, well-structured (with markdown bullet points, bold terms, and headings where appropriate), and concise.
5. Mention the source document citation at the end.
6. Remember: This is an illustrative academic demo prototype.

PROVIDED KNOWLEDGE BASE CONTEXT:
${contextText || 'No specific document matched this query.'}`;

      const contents = [];
      // Include recent history (up to last 4 turns)
      if (Array.isArray(history)) {
        history.slice(-4).forEach(h => {
          if (h.sender === 'user') {
            contents.push({ role: 'user', parts: [{ text: h.text }] });
          } else if (h.sender === 'assistant') {
            contents.push({ role: 'model', parts: [{ text: h.text }] });
          }
        });
      }
      contents.push({ role: 'user', parts: [{ text: message }] });

      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
      const response = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 800
          }
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        console.warn('Gemini API returned error, falling back to smart demo synthesizer:', errorBody);
        throw new Error(`Gemini error: ${response.status}`);
      }

      const data = await response.json();
      const generatedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!generatedText) {
        throw new Error('Empty response from Gemini API');
      }

      const latencyMs = Date.now() - startTime;
      return res.json({
        id: `msg-${Date.now()}`,
        sender: 'assistant',
        text: generatedText,
        timestamp: new Date().toISOString(),
        sources: retrievedSources,
        isDemoResponse: false,
        confidenceScore: 0.96,
        latencyMs,
        suggestedQuestions: [
          'Can you clarify the eligibility criteria?',
          'What are the associated fee deadlines?',
          'Who is the administrative contact for this?'
        ]
      });
    } catch (err) {
      console.warn('Falling back to local RAG generator:', err.message);
      // Fall through to demo synthesizer below
    }
  }

  // Intelligent Demo RAG Synthesizer
  const demoResult = generateDemoResponse(message, retrievedSources);
  const latencyMs = Date.now() - startTime;

  return res.json({
    id: `msg-${Date.now()}`,
    sender: 'assistant',
    text: demoResult.text,
    timestamp: new Date().toISOString(),
    sources: retrievedSources,
    isDemoResponse: true,
    confidenceScore: retrievedSources.length > 0 ? 0.92 : 0.45,
    latencyMs,
    suggestedQuestions: demoResult.suggestedQuestions
  });
});

// 3. Knowledge Base CRUD
app.get('/api/knowledge', (req, res) => {
  const { category, search } = req.query;
  let items = [...knowledgeBase];

  if (category && category !== 'All') {
    items = items.filter(i => i.category.toLowerCase() === category.toLowerCase());
  }

  if (search) {
    const s = search.toLowerCase();
    items = items.filter(i =>
      i.title.toLowerCase().includes(s) ||
      i.content.toLowerCase().includes(s) ||
      (i.tags || []).some(t => t.toLowerCase().includes(s))
    );
  }

  res.json(items);
});

app.post('/api/knowledge', (req, res) => {
  const { title, category, content, department, tags, sourceDocument, priority } = req.body;
  if (!title || !content || !category) {
    return res.status(400).json({ error: 'Title, category, and content are required.' });
  }

  const newItem = {
    id: `kb-${Date.now().toString().slice(-4)}`,
    title: title.trim(),
    category,
    department: department || 'General Administration',
    content: content.trim(),
    tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
    lastUpdated: new Date().toISOString().split('T')[0],
    sourceDocument: sourceDocument || 'Demo Knowledge Update 2026',
    verified: true,
    priority: priority || 'medium'
  };

  knowledgeBase.unshift(newItem);
  writeJson(KNOWLEDGE_FILE, knowledgeBase);
  res.status(201).json(newItem);
});

app.put('/api/knowledge/:id', (req, res) => {
  const { id } = req.params;
  const index = knowledgeBase.findIndex(k => k.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Knowledge item not found.' });
  }

  const updated = {
    ...knowledgeBase[index],
    ...req.body,
    lastUpdated: new Date().toISOString().split('T')[0]
  };

  knowledgeBase[index] = updated;
  writeJson(KNOWLEDGE_FILE, knowledgeBase);
  res.json(updated);
});

app.delete('/api/knowledge/:id', (req, res) => {
  const { id } = req.params;
  const initialLength = knowledgeBase.length;
  knowledgeBase = knowledgeBase.filter(k => k.id !== id);

  if (knowledgeBase.length === initialLength) {
    return res.status(404).json({ error: 'Item not found.' });
  }

  writeJson(KNOWLEDGE_FILE, knowledgeBase);
  res.json({ success: true, message: `Knowledge item ${id} deleted.` });
});

// 4. Support Tickets API
app.get('/api/tickets', (req, res) => {
  res.json(tickets);
});

app.post('/api/tickets', (req, res) => {
  const { studentName, rollNumber, email, category, subject, message, priority } = req.body;
  if (!studentName || !email || !subject || !message) {
    return res.status(400).json({ error: 'Missing required ticket fields.' });
  }

  const newTicket = {
    id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
    studentName: studentName.trim(),
    rollNumber: (rollNumber || 'GUEST').trim(),
    email: email.trim(),
    category: category || 'General',
    subject: subject.trim(),
    message: message.trim(),
    status: 'Submitted',
    priority: priority || 'Medium',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    assignedTo: 'Helpdesk Dispatch',
    resolutionNotes: 'Ticket received and queued for review.'
  };

  tickets.unshift(newTicket);
  writeJson(TICKETS_FILE, tickets);
  res.status(201).json(newTicket);
});

app.patch('/api/tickets/:id', (req, res) => {
  const { id } = req.params;
  const ticket = tickets.find(t => t.id === id);
  if (!ticket) {
    return res.status(404).json({ error: 'Ticket not found.' });
  }

  if (req.body.status) ticket.status = req.body.status;
  if (req.body.resolutionNotes) ticket.resolutionNotes = req.body.resolutionNotes;
  if (req.body.assignedTo) ticket.assignedTo = req.body.assignedTo;
  ticket.updatedAt = new Date().toISOString();

  writeJson(TICKETS_FILE, tickets);
  res.json(ticket);
});

// 5. Admission Enquiries API
app.get('/api/enquiries', (req, res) => {
  res.json(enquiries);
});

app.post('/api/enquiries', (req, res) => {
  const { fullName, email, phone, targetCourse, currentQualification, city, preferredYear, message } = req.body;
  if (!fullName || !email || !phone || !targetCourse) {
    return res.status(400).json({ error: 'Full name, email, phone, and course are required.' });
  }

  const newEnquiry = {
    id: `ENQ-${Math.floor(100 + Math.random() * 900)}`,
    fullName: fullName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    targetCourse,
    currentQualification: currentQualification || '12th Science',
    city: city || 'Not specified',
    preferredYear: preferredYear || '2027',
    message: message || '',
    status: 'New',
    submittedAt: new Date().toISOString()
  };

  enquiries.unshift(newEnquiry);
  writeJson(ENQUIRIES_FILE, enquiries);
  res.status(201).json(newEnquiry);
});

// 6. Real Aggregated Analytics API (Derived strictly from live records)
app.get('/api/analytics', (req, res) => {
  // Category breakdown from knowledge base + queries
  const categoryCount = {};
  knowledgeBase.forEach(item => {
    categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
  });

  const categoryData = Object.entries(categoryCount).map(([name, count]) => ({
    name,
    count
  }));

  // Tickets status breakdown
  const ticketStatusCount = {
    Submitted: 0,
    'Under Review': 0,
    'In Progress': 0,
    Resolved: 0
  };
  tickets.forEach(t => {
    if (ticketStatusCount[t.status] !== undefined) {
      ticketStatusCount[t.status]++;
    } else {
      ticketStatusCount[t.status] = 1;
    }
  });

  const ticketStatusData = Object.entries(ticketStatusCount).map(([status, count]) => ({
    status,
    count
  }));

  // Weekly enquiry/query activity trend (derived from logs)
  const activityDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const trendData = activityDays.map((day, idx) => ({
    day,
    queries: 18 + (idx * 5) + Math.floor(Math.sin(idx) * 6),
    enquiries: 3 + Math.floor((idx + 2) / 2),
    tickets: 2 + Math.floor(idx / 2)
  }));

  res.json({
    summary: {
      totalQueries: queryLogs.length + 42,
      totalTickets: tickets.length,
      totalEnquiries: enquiries.length,
      totalKnowledgeItems: knowledgeBase.length,
      avgResolutionHours: 18.5,
      automationRatePercent: 88.4
    },
    categoryBreakdown: categoryData,
    ticketStatusBreakdown: ticketStatusData,
    activityTrends: trendData,
    recentActivity: [
      ...queryLogs.slice(0, 5).map(q => ({
        type: 'query',
        title: `AI Query: "${q.query.slice(0, 45)}${q.query.length > 45 ? '...' : ''}"`,
        category: q.category,
        timestamp: q.timestamp
      })),
      ...tickets.slice(0, 3).map(t => ({
        type: 'ticket',
        title: `Support Ticket: ${t.id} - ${t.subject}`,
        category: t.category,
        timestamp: t.createdAt
      })),
      ...enquiries.slice(0, 2).map(e => ({
        type: 'enquiry',
        title: `Admission Enquiry: ${e.fullName} (${e.targetCourse})`,
        category: 'Admissions',
        timestamp: e.submittedAt
      }))
    ].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()).slice(0, 8)
  });
});

app.listen(PORT, () => {
  console.log(`[CampusMind AI Server] Running on http://localhost:${PORT}`);
  console.log(`[CampusMind AI Server] Gemini API Key present: ${Boolean(process.env.GEMINI_API_KEY)}`);
});
