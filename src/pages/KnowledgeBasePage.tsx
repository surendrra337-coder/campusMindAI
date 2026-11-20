import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { KnowledgeCategory, KnowledgeItem } from '../types';
import {
  Search,
  BookOpen,
  Plus,
  Trash2,
  Edit3,
  Bot,
  Tag,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  X,
  FileText
} from 'lucide-react';

const CATEGORIES: ('All' | KnowledgeCategory)[] = [
  'All',
  'Admissions',
  'Courses & Curriculum',
  'Fees & Scholarships',
  'Examinations',
  'Rules & Policies',
  'Campus & Facilities',
  'Hostel & Life',
  'Placements',
  'Important Contacts'
];

export const KnowledgeBasePage: React.FC = () => {
  const {
    knowledge,
    addKnowledgeItem,
    updateKnowledgeItem,
    deleteKnowledgeItem,
    isAdminMode,
    setCurrentPage,
    sendChatMessage
  } = useApp();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<'All' | KnowledgeCategory>('All');
  const [expandedId, setExpandedId] = useState<string | null>('kb-001');

  // Modal states for Demo Admin Mode
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<KnowledgeItem | null>(null);
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState<KnowledgeCategory>('Admissions');
  const [formContent, setFormContent] = useState('');
  const [formTags, setFormTags] = useState('');
  const [formDoc, setFormDoc] = useState('');

  // Filtering
  const filteredItems = knowledge.filter(item => {
    const matchesCategory =
      selectedCategory === 'All' || item.category.toLowerCase() === selectedCategory.toLowerCase();
    const s = search.toLowerCase();
    const matchesSearch =
      !search ||
      item.title.toLowerCase().includes(s) ||
      item.content.toLowerCase().includes(s) ||
      (item.tags || []).some(t => t.toLowerCase().includes(s));
    return matchesCategory && matchesSearch;
  });

  const handleOpenAddModal = () => {
    setEditingItem(null);
    setFormTitle('');
    setFormCategory('Admissions');
    setFormContent('');
    setFormTags('');
    setFormDoc('Apex College Bulletin 2026-27');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (item: KnowledgeItem) => {
    setEditingItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormContent(item.content);
    setFormTags((item.tags || []).join(', '));
    setFormDoc(item.sourceDocument);
    setIsModalOpen(true);
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formContent.trim()) return;

    const tagsArray = formTags
      .split(',')
      .map(t => t.trim())
      .filter(Boolean);

    if (editingItem) {
      await updateKnowledgeItem(editingItem.id, {
        title: formTitle.trim(),
        category: formCategory,
        content: formContent.trim(),
        tags: tagsArray,
        sourceDocument: formDoc.trim()
      });
    } else {
      await addKnowledgeItem({
        title: formTitle.trim(),
        category: formCategory,
        content: formContent.trim(),
        tags: tagsArray,
        sourceDocument: formDoc.trim() || 'Manual Entry 2026',
        priority: 'medium',
        department: 'Academic Office'
      });
    }

    setIsModalOpen(false);
  };

  const handleAskInChat = (title: string) => {
    sendChatMessage(`Tell me more about: ${title}`);
    setCurrentPage('chat');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">Smart Knowledge Base</h1>
            <span className="rounded-full bg-blue-500/10 border border-blue-500/30 px-2.5 py-0.5 text-xs font-semibold text-blue-400">
              {filteredItems.length} FAQs
            </span>
          </div>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Official institutional regulations, fee structures, policies, and curriculum summaries.
          </p>
        </div>

        {isAdminMode && (
          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-xs font-semibold text-white shadow-glow-violet hover:bg-violet-500 transition-all self-start md:self-auto"
          >
            <Plus className="h-4 w-4" />
            <span>Add New FAQ Entry</span>
          </button>
        )}
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-4">
        {/* Search input */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search FAQs by keywords (e.g. attendance, 75%, NVIDIA, mess charges, fee deadline)..."
            className="w-full rounded-xl border border-campus-border bg-campus-card pl-11 pr-4 py-3 text-xs sm:text-sm text-white placeholder-slate-400 focus:border-blue-500 focus:outline-none transition-colors shadow-sm"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-glow-sm'
                    : 'border border-campus-border bg-campus-card text-slate-300 hover:bg-campus-hover hover:text-white'
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* FAQ Accordion List */}
      <div className="space-y-3.5">
        {filteredItems.length === 0 ? (
          <div className="rounded-2xl border border-campus-border bg-campus-card p-12 text-center space-y-3">
            <BookOpen className="h-8 w-8 text-slate-500 mx-auto" />
            <h3 className="text-sm font-semibold text-slate-300">No matching FAQs found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              We couldn't find knowledge entries matching "{search}". Try searching for terms like "scholarship", "curfew", "grading", or "internship".
            </p>
            <button
              onClick={() => {
                setSearch('');
                setSelectedCategory('All');
              }}
              className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-500"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          filteredItems.map(item => {
            const isExpanded = expandedId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-2xl border border-campus-border bg-campus-card transition-all duration-200 overflow-hidden shadow-sm"
              >
                {/* Header row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="flex items-center justify-between p-4 sm:p-5 cursor-pointer hover:bg-campus-hover/50 transition-colors"
                >
                  <div className="space-y-1.5 pr-4">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="rounded bg-blue-500/10 border border-blue-500/30 px-2 py-0.5 text-[10px] font-semibold text-blue-400">
                        {item.category}
                      </span>
                      {item.department && (
                        <span className="text-[10px] text-slate-400">
                          {item.department}
                        </span>
                      )}
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        Verified
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-white">
                      {item.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {isAdminMode && (
                      <div
                        className="flex items-center gap-1 mr-2"
                        onClick={e => e.stopPropagation()}
                      >
                        <button
                          onClick={() => handleOpenEditModal(item)}
                          className="rounded p-1.5 text-slate-400 hover:text-white hover:bg-campus-hover transition-colors"
                          title="Edit FAQ"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => deleteKnowledgeItem(item.id)}
                          className="rounded p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                          title="Delete FAQ"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    )}

                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-campus-surface text-slate-400">
                      {isExpanded ? (
                        <ChevronUp className="h-4 w-4 text-blue-400" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Content Body */}
                {isExpanded && (
                  <div className="border-t border-campus-border bg-campus-surface/60 p-4 sm:p-6 space-y-4 text-xs leading-relaxed text-slate-300 animate-in fade-in duration-200">
                    <p className="whitespace-pre-line text-slate-200">{item.content}</p>

                    {/* Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-2">
                        <Tag className="h-3 w-3 text-slate-400 mr-1" />
                        {item.tags.map((tag, idx) => (
                          <span
                            key={idx}
                            className="rounded bg-campus-card px-2 py-0.5 text-[10px] text-slate-400 border border-campus-border"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Metadata & Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-campus-border/60 text-[11px] text-slate-400">
                      <div className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 text-slate-400" />
                        <span>Source: {item.sourceDocument}</span>
                        <span>•</span>
                        <span>Updated: {item.lastUpdated}</span>
                      </div>

                      <button
                        onClick={() => handleAskInChat(item.title)}
                        className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold self-start sm:self-auto"
                      >
                        <Bot className="h-3.5 w-3.5" />
                        <span>Discuss with AI Assistant →</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Admin Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-lg rounded-2xl border border-campus-border bg-campus-card p-6 shadow-glass space-y-4">
            <div className="flex items-center justify-between border-b border-campus-border pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-violet-400" />
                <h3 className="text-base font-bold text-white">
                  {editingItem ? 'Edit Knowledge Item' : 'Add New FAQ Entry'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Title / Question</label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={e => setFormTitle(e.target.value)}
                  placeholder="e.g. Sports Quota Admission Guidelines"
                  className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value as KnowledgeCategory)}
                    className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Source Document</label>
                  <input
                    type="text"
                    value={formDoc}
                    onChange={e => setFormDoc(e.target.value)}
                    placeholder="e.g. Sports Board Ordinance 2026"
                    className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Content / Official Answer</label>
                <textarea
                  required
                  rows={4}
                  value={formContent}
                  onChange={e => setFormContent(e.target.value)}
                  placeholder="Enter detailed verified information..."
                  className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={formTags}
                  onChange={e => setFormTags(e.target.value)}
                  placeholder="e.g. Sports, Trials, Relaxation, Physical"
                  className="w-full rounded-lg border border-campus-border bg-campus-dark px-3 py-2 text-white focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-campus-border">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg px-4 py-2 font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-500 transition-colors shadow-sm"
                >
                  {editingItem ? 'Save Changes' : 'Create FAQ Entry'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
