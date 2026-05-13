'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import './rcm-styles.css';

interface Annotation {
  id: string;
  kind: 'highlight' | 'block';
  text: string;
  snippet: string;
  author: string;
  timeAgo: string;
  status: 'Pending' | 'Resolved';
  linkedClaim?: string;
  isAnchor?: boolean;
  comments: Array<{
    id: string;
    text: string;
    author: string;
    timeAgo: string;
  }>;
}

export default function RCMDemo() {
  const documentRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const [currentStage, setCurrentStage] = useState<'draft' | 'review' | 'approval' | 'published'>('review');
  const [activeTab, setActiveTab] = useState<'annotations' | 'workitems' | 'assistant'>('annotations');
  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: '001',
      kind: 'highlight',
      author: 'Brittany Smith',
      timeAgo: '2h ago',
      text: 'new outcome data showing how Immunexis is helping patients regain control faster',
      snippet: '...new outcome data showing how Immunexis is helping patients regain control faster....',
      status: 'Pending',
      linkedClaim: 'CLAIM-2024-001',
      isAnchor: true,
      comments: [
        { id: 'c1', text: 'Verify against Phase III data', author: 'Dr. Chen', timeAgo: '1h ago' },
      ],
    },
  ]);
  const [expandedAnnotation, setExpandedAnnotation] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showSelectionPopup, setShowSelectionPopup] = useState(false);
  const [selectionData, setSelectionData] = useState({ text: '', x: 0, y: 0 });

  const stages = [
    { key: 'draft', label: 'Draft' },
    { key: 'review', label: 'Review' },
    { key: 'approval', label: 'Approval' },
    { key: 'published', label: 'Published' },
  ];

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 240 && newWidth <= 800) {
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length < 3) {
      setShowSelectionPopup(false);
      return;
    }

    const text = selection.toString().trim();
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setSelectionData({
      text,
      x: rect.left + rect.width / 2,
      y: rect.top + window.scrollY - 50,
    });
    setShowSelectionPopup(true);
  };

  const createAnnotation = () => {
    const newAnn: Annotation = {
      id: `ann-${Date.now()}`,
      kind: 'highlight',
      text: selectionData.text,
      snippet: selectionData.text.substring(0, 80) + '...',
      author: 'You',
      timeAgo: 'just now',
      status: 'Pending',
      comments: [],
    };

    setAnnotations((prev) => [newAnn, ...prev]);
    setExpandedAnnotation(newAnn.id);
    setShowSelectionPopup(false);
    window.getSelection()?.removeAllRanges();
  };

  const addComment = (annId: string) => {
    if (!newComment.trim()) return;

    setAnnotations((prev) =>
      prev.map((ann) =>
        ann.id === annId
          ? {
              ...ann,
              comments: [
                ...ann.comments,
                { id: `c-${Date.now()}`, text: newComment, author: 'You', timeAgo: 'just now' },
              ],
            }
          : ann
      )
    );
    setNewComment('');
  };

  const toggleStatus = (annId: string) => {
    setAnnotations((prev) =>
      prev.map((ann) =>
        ann.id === annId ? { ...ann, status: ann.status === 'Pending' ? 'Resolved' : 'Pending' } : ann
      )
    );
  };

  return (
    <div className="rcm-app">
      {/* Selection Popup */}
      {showSelectionPopup && (
        <div
          className="rcm-selection-popup"
          style={{ left: `${selectionData.x}px`, top: `${selectionData.y}px` }}
          onClick={createAnnotation}
        >
          + Create Annotation
        </div>
      )}

      {/* Page Header */}
      <div className="rcm-page-header">
        <Link href="/workflows" className="rcm-back-link">
          ← Back to Workflows
        </Link>
        <div className="rcm-header-row">
          <div className="rcm-header-main">
            <div className="rcm-header-icon">
              <svg width="20" height="20" fill="#0176d3" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
              </svg>
            </div>
            <div className="rcm-header-titles">
              <div className="rcm-eyebrow">Regulated Content</div>
              <h1 className="rcm-title">Cordim Product Label - US Market</h1>
            </div>
          </div>
          <div className="rcm-header-actions">
            <button className="rcm-btn rcm-btn-outline">Follow</button>
            <button className="rcm-btn rcm-btn-outline">Edit</button>
            <button className="rcm-btn rcm-btn-outline">Delete</button>
          </div>
        </div>

        {/* Detail Panel */}
        <div className="rcm-highlight-panel">
          <div className="rcm-field">
            <span className="rcm-label">Content Type</span>
            <span className="rcm-value">Product Label</span>
          </div>
          <div className="rcm-field">
            <span className="rcm-label">Type</span>
            <span className="rcm-value">PDF</span>
          </div>
          <div className="rcm-field">
            <span className="rcm-label">Version</span>
            <span className="rcm-value">2.1</span>
          </div>
          <div className="rcm-field">
            <span className="rcm-label">Status</span>
            <span className="rcm-value">In Review</span>
          </div>
          <div className="rcm-field">
            <span className="rcm-label">Effective Dates</span>
            <span className="rcm-value">Q2 2026</span>
          </div>
        </div>

        {/* Path */}
        <div className="rcm-path-actions">
          <div className="rcm-path-rail">
            {stages.map((stage, idx) => {
              const currentIdx = stages.findIndex((s) => s.key === currentStage);
              const isComplete = idx < currentIdx;
              const isCurrent = stage.key === currentStage;
              return (
                <button
                  key={stage.key}
                  className={`rcm-path-stage ${isComplete ? 'complete' : ''} ${isCurrent ? 'current' : ''}`}
                  onClick={() => setCurrentStage(stage.key as typeof currentStage)}
                >
                  {stage.label}
                </button>
              );
            })}
          </div>
          <button className="rcm-btn rcm-btn-brand">✨ Extract & Match Claims</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="rcm-main-content">
        {/* Document Viewer */}
        <div className="rcm-viewer-container" style={{ width: `calc(100% - ${sidebarWidth}px)` }}>
          <div className="rcm-viewer-toolbar">
            <span className="rcm-toolbar-title">Document Viewer</span>
            <div className="rcm-toolbar-controls">
              <button className="rcm-icon-btn">−</button>
              <button className="rcm-icon-btn">+</button>
              <span className="rcm-page-indicator">Page 1 of 5</span>
            </div>
          </div>
          <div className="rcm-document-scroll">
            <div
              ref={documentRef}
              className="rcm-document-content"
              onMouseUp={handleTextSelection}
            >
              <h1 className="doc-title">CORDIM® (Cordimetrix Hydrochloride)</h1>

              <section className="doc-section">
                <h2 className="doc-heading">INDICATIONS AND USAGE</h2>
                <p className="doc-paragraph">
                  Cordim is indicated for the treatment of arterial hypertension in adults to lower blood pressure.
                  Lowering blood pressure reduces the risk of fatal and nonfatal cardiovascular events, primarily
                  strokes and myocardial infarctions. These benefits have been demonstrated in controlled trials of
                  antihypertensive drugs from various pharmacologic classes.
                </p>
              </section>

              <section className="doc-section">
                <h2 className="doc-heading">DOSAGE AND ADMINISTRATION</h2>
                <p className="doc-paragraph">
                  The recommended starting dose is 5 mg once daily. Depending on the patient's response, the dose may
                  be increased to a maximum of 10 mg once daily. Dose adjustments should be made at intervals of at
                  least 2 weeks based on clinical response and tolerability.
                </p>
                <ul className="doc-list">
                  <li>Initial dose: 5 mg once daily</li>
                  <li>Maximum dose: 10 mg once daily</li>
                  <li>May be taken with or without food</li>
                  <li>Dosage adjustments in special populations may be required</li>
                </ul>
              </section>

              <section className="doc-section">
                <h2 className="doc-heading">CLINICAL PHARMACOLOGY</h2>
                <p className="doc-paragraph">
                  Clinical efficacy was demonstrated in Phase III trials involving over 1,200 patients. Cordim showed
                  statistically significant blood pressure reduction compared to placebo (p &lt; 0.001). The
                  antihypertensive effect was sustained over 24 hours with once-daily dosing, providing consistent
                  blood pressure control throughout the dosing interval.
                </p>
              </section>

              <div className="doc-info-box">
                <p>
                  💡 <strong>Demo Tip:</strong> Select any text in this document to create annotations. Try
                  highlighting different sections to see the annotation workflow in action!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Resizer */}
        <div
          className="rcm-splitter"
          onMouseDown={() => setIsDragging(true)}
        />

        {/* Annotation Panel */}
        <div className="rcm-sidebar" style={{ width: `${sidebarWidth}px` }}>
          {/* Tabs */}
          <div className="rcm-tabs">
            <button
              className={`rcm-tab ${activeTab === 'annotations' ? 'active' : ''}`}
              onClick={() => setActiveTab('annotations')}
            >
              Annotations ({annotations.length})
            </button>
            <button
              className={`rcm-tab ${activeTab === 'workitems' ? 'active' : ''}`}
              onClick={() => setActiveTab('workitems')}
            >
              Work Items
            </button>
            <button
              className={`rcm-tab ${activeTab === 'assistant' ? 'active' : ''}`}
              onClick={() => setActiveTab('assistant')}
            >
              Content Assistant
            </button>
          </div>

          {/* Tab Content */}
          <div className="rcm-tab-content">
            {activeTab === 'annotations' && (
              <div className="rcm-annotations-list">
                {annotations.map((ann) => (
                  <div key={ann.id} className="rcm-annotation-card">
                    <div className="rcm-ann-header">
                      <div className="rcm-ann-meta">
                        <span className={`rcm-status-badge ${ann.status === 'Pending' ? 'pending' : 'resolved'}`}>
                          {ann.status}
                        </span>
                        {ann.isAnchor && <span className="rcm-anchor-badge">⚓</span>}
                        {ann.linkedClaim && <span className="rcm-claim-link">{ann.linkedClaim}</span>}
                      </div>
                      <button className="rcm-expand-btn" onClick={() => setExpandedAnnotation(expandedAnnotation === ann.id ? null : ann.id)}>
                        {expandedAnnotation === ann.id ? '−' : '+'}
                      </button>
                    </div>
                    <p className="rcm-ann-snippet">"{ann.snippet}"</p>
                    <div className="rcm-ann-footer">
                      <span className="rcm-ann-author">{ann.author}</span>
                      <span className="rcm-ann-time">{ann.timeAgo}</span>
                    </div>

                    {expandedAnnotation === ann.id && (
                      <div className="rcm-ann-details">
                        <div className="rcm-comments">
                          {ann.comments.map((comment) => (
                            <div key={comment.id} className="rcm-comment">
                              <div className="rcm-comment-header">
                                <strong>{comment.author}</strong>
                                <span className="rcm-comment-time">{comment.timeAgo}</span>
                              </div>
                              <p className="rcm-comment-text">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                        <textarea
                          className="rcm-comment-input"
                          placeholder="Add a comment..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={3}
                        />
                        <div className="rcm-ann-actions">
                          <button className="rcm-btn rcm-btn-brand rcm-btn-sm" onClick={() => addComment(ann.id)}>
                            Add Comment
                          </button>
                          <button className="rcm-btn rcm-btn-outline rcm-btn-sm" onClick={() => toggleStatus(ann.id)}>
                            Mark {ann.status === 'Pending' ? 'Resolved' : 'Pending'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'workitems' && (
              <div className="rcm-empty-state">
                <div className="rcm-empty-icon">📋</div>
                <p>No work items assigned</p>
              </div>
            )}

            {activeTab === 'assistant' && (
              <div className="rcm-empty-state">
                <div className="rcm-empty-icon">🤖</div>
                <p>Content Assistant</p>
                <p className="rcm-empty-subtitle">AI-powered content analysis coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
