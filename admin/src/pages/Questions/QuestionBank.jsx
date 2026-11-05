/**
 * admin/src/pages/Questions/QuestionBank.jsx
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  HelpCircle,
  Plus,
  CheckCircle2,
  Brain,
  Calculator,
  Code,
  BookA,
  Lightbulb,
  Loader2,
} from 'lucide-react';
import { getQuestionBank } from '../../services/api';
import SearchBar from '../../components/common/SearchBar';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import Notification from '../../components/common/Notification';

const domainIcons = {
  aptitude: Calculator,
  logic: Brain,
  technical: Code,
  verbal: BookA,
  problem_solving: Lightbulb,
};

const QuestionBank = () => {
  const [questions, setQuestions] = useState([]);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [notification, setNotification] = useState(null);

  // New question form state
  const [newQuestion, setNewQuestion] = useState({
    title: '',
    domain: 'aptitude',
    question: '',
    options: ['', '', '', ''],
    correctIndex: 0,
    difficulty: 1.2,
    explanation: '',
    skill: '',
  });

  const notify = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    setIsLoading(true);
    try {
      const res = await getQuestionBank();
      if (res?.success) {
        setQuestions(res.questions || []);
        setDomains(res.domains || ['aptitude', 'logic', 'technical', 'verbal', 'problem_solving']);
      }
    } catch (err) {
      console.error('Failed to load questions', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtered questions
  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchDomain = selectedDomain === 'all' || q.domain === selectedDomain;
      const matchSearch =
        q.question.toLowerCase().includes(search.toLowerCase()) ||
        q.title.toLowerCase().includes(search.toLowerCase()) ||
        (q.skill && q.skill.toLowerCase().includes(search.toLowerCase()));
      return matchDomain && matchSearch;
    });
  }, [questions, selectedDomain, search]);

  const handleAddQuestionSubmit = (e) => {
    e.preventDefault();
    if (!newQuestion.question.trim() || newQuestion.options.some((opt) => !opt.trim())) {
      notify('Please fill out question prompt and all 4 options', 'error');
      return;
    }

    const created = {
      ...newQuestion,
      id: `custom_q_${Date.now()}`,
    };

    setQuestions([created, ...questions]);
    setIsAddModalOpen(false);
    notify('Question added to diagnostic bank.');
    setNewQuestion({
      title: '',
      domain: 'aptitude',
      question: '',
      options: ['', '', '', ''],
      correctIndex: 0,
      difficulty: 1.2,
      explanation: '',
      skill: '',
    });
  };

  if (isLoading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '16px' }}>
        <Loader2 size={36} className="spin" color="var(--primary)" />
        <p style={{ color: 'var(--text-muted)' }}>Loading diagnostic question bank...</p>
      </div>
    );
  }

  return (
    <div className="question-bank-page">
      <Notification notification={notification} onClose={() => setNotification(null)} />

      {/* Header & Controls */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '14px', alignItems: 'center', flexWrap: 'wrap' }}>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search questions by concept or keywords..."
            width="340px"
          />

          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => setSelectedDomain('all')}
              className={`btn btn-sm ${selectedDomain === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            >
              All Domains ({questions.length})
            </button>
            {domains.map((dom) => (
              <button
                key={dom}
                onClick={() => setSelectedDomain(dom)}
                className={`btn btn-sm ${selectedDomain === dom ? 'btn-primary' : 'btn-secondary'}`}
                style={{ textTransform: 'capitalize' }}
              >
                {dom.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>

        <button className="btn btn-primary" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={16} />
          <span>Add Assessment Question</span>
        </button>
      </div>

      {/* Question Cards Grid */}
      {filteredQuestions.length === 0 ? (
        <div className="glass-card" style={{ padding: '60px 20px', textAlign: 'center', color: 'var(--text-dim)' }}>
          <HelpCircle size={40} style={{ margin: '0 auto 12px auto', opacity: 0.5 }} />
          <h3>No questions match your filter</h3>
          <p>Try searching for a different term or domain.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filteredQuestions.map((q, idx) => {
            const Icon = domainIcons[q.domain] || HelpCircle;
            return (
              <div
                key={q.id || idx}
                className="glass-card"
                style={{
                  padding: '22px 24px',
                  borderRadius: 'var(--radius-lg)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '8px',
                        background: 'rgba(99, 102, 241, 0.15)',
                        color: 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={18} />
                    </div>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {q.title}
                      </h4>
                      <div style={{ display: 'flex', gap: '8px', marginTop: '3px' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                          Domain: {q.domain}
                        </span>
                        {q.skill && (
                          <span style={{ fontSize: '0.78rem', color: 'var(--primary)' }}>
                            • Skill: {q.skill}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <Badge variant="neutral" size="sm">
                    Difficulty: {q.difficulty}x
                  </Badge>
                </div>

                {/* Prompt */}
                <p style={{ fontSize: '0.94rem', color: 'var(--text-main)', margin: '14px 0 16px 0', lineHeight: 1.5 }}>
                  {q.question}
                </p>

                {/* Options 4-grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '10px', marginBottom: '16px' }}>
                  {q.options?.map((opt, optIdx) => {
                    const isCorrect = optIdx === q.correctIndex;
                    return (
                      <div
                        key={optIdx}
                        style={{
                          padding: '10px 14px',
                          borderRadius: 'var(--radius-md)',
                          background: isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(255, 255, 255, 0.02)',
                          border: isCorrect ? '1px solid rgba(16, 185, 129, 0.35)' : '1px solid var(--border-subtle)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          color: isCorrect ? '#6ee7b7' : 'var(--text-muted)',
                          fontSize: '0.86rem',
                        }}
                      >
                        <span>{String.fromCharCode(65 + optIdx)}. {opt}</span>
                        {isCorrect && <CheckCircle2 size={15} color="#10b981" />}
                      </div>
                    );
                  })}
                </div>

                {/* Explanation */}
                {q.explanation && (
                  <div
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: 'rgba(255, 255, 255, 0.02)',
                      border: '1px solid rgba(255, 255, 255, 0.05)',
                      fontSize: '0.82rem',
                      color: 'var(--text-dim)',
                    }}
                  >
                    <strong style={{ color: 'var(--text-muted)' }}>Rationale:</strong> {q.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Question Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Diagnostic Item"
        subtitle="Insert a vetted aptitude or technical test question into the evaluation pool"
        maxWidth="650px"
      >
        <form onSubmit={handleAddQuestionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div>
              <label className="form-label">Domain Area</label>
              <select
                className="input-field"
                value={newQuestion.domain}
                onChange={(e) => setNewQuestion({ ...newQuestion, domain: e.target.value })}
              >
                <option value="aptitude">Quantitative Aptitude</option>
                <option value="logic">Logical Reasoning</option>
                <option value="technical">Technical Knowledge</option>
                <option value="verbal">Verbal Ability</option>
                <option value="problem_solving">Problem Solving</option>
              </select>
            </div>
            <div>
              <label className="form-label">Item Title</label>
              <input
                type="text"
                className="input-field"
                required
                placeholder="e.g. Asymptotic Complexity Analysis"
                value={newQuestion.title}
                onChange={(e) => setNewQuestion({ ...newQuestion, title: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Question Text Prompt</label>
            <textarea
              className="input-field"
              rows={3}
              required
              placeholder="What is the worst-case space complexity of Depth First Search in a balanced binary tree?"
              value={newQuestion.question}
              onChange={(e) => setNewQuestion({ ...newQuestion, question: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">4 Multiple-Choice Options</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {newQuestion.options.map((opt, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <input
                    type="radio"
                    name="correctOption"
                    checked={newQuestion.correctIndex === i}
                    onChange={() => setNewQuestion({ ...newQuestion, correctIndex: i })}
                    title="Mark as correct answer"
                  />
                  <input
                    type="text"
                    className="input-field"
                    required
                    placeholder={`Option ${String.fromCharCode(65 + i)}`}
                    value={opt}
                    onChange={(e) => {
                      const updated = [...newQuestion.options];
                      updated[i] = e.target.value;
                      setNewQuestion({ ...newQuestion, options: updated });
                    }}
                  />
                  {newQuestion.correctIndex === i && (
                    <Badge variant="success" size="sm">Correct</Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="form-label">Rationale / Formula Explanation</label>
            <textarea
              className="input-field"
              rows={2}
              placeholder="Explain the step-by-step logic for student feedback after completion..."
              value={newQuestion.explanation}
              onChange={(e) => setNewQuestion({ ...newQuestion, explanation: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Add to Question Bank
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default QuestionBank;

