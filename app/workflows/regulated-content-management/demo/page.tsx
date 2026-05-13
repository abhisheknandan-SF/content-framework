'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import './rcm-exact.css';

interface Annotation {
  id: string;
  annCode: string;
  author: string;
  timeAgo: string;
  status: 'Pending' | 'Resolved';
  snippet: string;
  linkedClaimsCount: number;
  commentsCount: number;
  isAnchor: boolean;
  expanded: boolean;
  linkedClaims: Array<{ code: string; text: string }>;
  comments: Array<{ author: string; text: string; timeAgo: string }>;
}

export default function RCMExactDemo() {
  const documentRef = useRef<HTMLDivElement>(null);
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isDragging, setIsDragging] = useState(false);
  const [currentStage, setCurrentStage] = useState(2); // 0=draft, 1=review, 2=approval, 3=published
  const [activeTab, setActiveTab] = useState<'annotations' | 'workitems' | 'assistant'>('annotations');
  const [annotateMode, setAnnotateMode] = useState(false);
  const [annotateToolMode, setAnnotateToolMode] = useState<'highlight' | 'block' | null>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: '001',
      annCode: 'ANN-001',
      author: 'Brittany Smith',
      timeAgo: '2h ago',
      status: 'Pending',
      snippet: 'new outcome data showing how Immunexis is helping patients regain control faster',
      linkedClaimsCount: 1,
      commentsCount: 2,
      isAnchor: true,
      expanded: false,
      linkedClaims: [{ code: 'CLAIM-2024-001', text: 'Clinical efficacy claim' }],
      comments: [
        { author: 'Dr. Sarah Chen', text: 'Verify against Phase III data', timeAgo: '1h ago' },
        { author: 'John Martinez', text: 'Documentation attached', timeAgo: '45m ago' },
      ],
    },
    {
      id: '002',
      annCode: 'ANN-002',
      author: 'Michael Johnson',
      timeAgo: '4h ago',
      status: 'Resolved',
      snippet: 'patients with moderate to severe arterial hypertension',
      linkedClaimsCount: 0,
      commentsCount: 1,
      isAnchor: false,
      expanded: false,
      linkedClaims: [],
      comments: [{ author: 'Emily Wilson', text: 'Approved', timeAgo: '3h ago' }],
    },
  ]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');

  const stages = ['Draft', 'Review', 'Approval', 'Published'];

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

  const toggleAnnotation = (id: string) => {
    setAnnotations((prev) =>
      prev.map((ann) => (ann.id === id ? { ...ann, expanded: !ann.expanded } : ann))
    );
  };

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleAnnotateToggle = () => {
    setAnnotateMode(!annotateMode);
    if (annotateMode) {
      setAnnotateToolMode(null);
    }
  };

  const handleTextSelection = () => {
    if (!annotateMode || annotateToolMode !== 'highlight') return;

    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length < 3) return;

    const text = selection.toString().trim();
    const newAnn: Annotation = {
      id: `${Date.now()}`,
      annCode: `ANN-${String(annotations.length + 1).padStart(3, '0')}`,
      author: 'You',
      timeAgo: 'just now',
      status: 'Pending',
      snippet: text.substring(0, 80),
      linkedClaimsCount: 0,
      commentsCount: 0,
      isAnchor: false,
      expanded: true,
      linkedClaims: [],
      comments: [],
    };

    setAnnotations((prev) => [newAnn, ...prev]);
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
                { author: 'You', text: newComment, timeAgo: 'just now' },
              ],
              commentsCount: ann.commentsCount + 1,
            }
          : ann
      )
    );
    setNewComment('');
  };

  const toggleResolve = (annId: string) => {
    setAnnotations((prev) =>
      prev.map((ann) =>
        ann.id === annId
          ? { ...ann, status: ann.status === 'Pending' ? 'Resolved' : 'Pending' }
          : ann
      )
    );
    setOpenMenuId(null);
  };

  return (
    <div className="rcm-exact-app">
      {/* Page Header */}
      <div className="rcm-page-header-shell">
        <Link href="/workflows" className="rcm-back-link">
          ← Back to Workflows
        </Link>

        <div className="rcm-page-header">
          <div className="rcm-page-header-main">
            <div className="rcm-page-header-icon">
              <svg width="20" height="20" fill="#0176d3" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
              </svg>
            </div>
            <div className="rcm-page-header-titles">
              <p className="rcm-eyebrow">Regulated Content</p>
              <h1 className="rcm-page-title">Cordim Product Label - US Market</h1>
            </div>
          </div>
          <div className="rcm-page-header-actions">
            <button className="rcm-btn-neutral">Follow</button>
            <button className="rcm-btn-neutral">Edit</button>
            <button className="rcm-btn-neutral">Delete</button>
          </div>
        </div>

        {/* Highlight Panel */}
        <ul className="rcm-detail-row">
          <li className="rcm-detail-block">
            <label>Content Type</label>
            <div>Product Label</div>
          </li>
          <li className="rcm-detail-block">
            <label>Type</label>
            <div>PDF</div>
          </li>
          <li className="rcm-detail-block">
            <label>Version</label>
            <div>2.1</div>
          </li>
          <li className="rcm-detail-block">
            <label>Status</label>
            <div>In Review</div>
          </li>
          <li className="rcm-detail-block">
            <label>Effective Dates</label>
            <div>Q2 2026</div>
          </li>
        </ul>

        {/* Path */}
        <div className="rcm-path-actions">
          <div className="rcm-path-rail">
            {stages.map((stage, idx) => (
              <button
                key={idx}
                className={`rcm-path-seg ${idx < currentStage ? 'complete' : ''} ${idx === currentStage ? 'current' : ''}`}
                onClick={() => setCurrentStage(idx)}
              >
                {stage}
              </button>
            ))}
          </div>
          <button className="rcm-btn-brand">
            <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '6px' }}>
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            Extract &amp; Match Claims
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="rcm-article">
        <div className="rcm-doc-layout">
          {/* Document Viewer */}
          <div className="rcm-doc-main" style={{ width: `calc(100% - ${sidebarWidth}px - 8px)` }}>
            {/* Toolbar */}
            <div className="rcm-viewer-toolbar">
              <div className="rcm-toolbar-row">
                <div className="rcm-file-title">
                  <svg width="16" height="16" fill="#5c5c5c" viewBox="0 0 24 24">
                    <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
                  </svg>
                  <span>cordim-label-us.pdf</span>
                </div>
                <div className="rcm-toolbar-actions">
                  <button className="rcm-btn-neutral">Download</button>
                  <button className="rcm-icon-btn">
                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                      <circle cx="12" cy="5" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="12" cy="19" r="2" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Annotate Toolbar */}
              <div className="rcm-html-annotate-row">
                <div className="rcm-annotate-start">
                  <button
                    className={annotateMode ? 'rcm-btn-brand' : 'rcm-btn-neutral'}
                    onClick={handleAnnotateToggle}
                  >
                    Annotate
                  </button>
                  {annotateMode && (
                    <div className="rcm-annotate-tools">
                      <button
                        className={`rcm-tool-btn ${annotateToolMode === 'highlight' ? 'active' : ''}`}
                        onClick={() => setAnnotateToolMode('highlight')}
                        title="Text highlight"
                      >
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M6 14l3 3-6 6h6l6-6-3-3M3.5 12.5l9-9L16 7l-9 9-3.5-3.5z" />
                        </svg>
                      </button>
                      <button
                        className={`rcm-tool-btn ${annotateToolMode === 'block' ? 'active' : ''}`}
                        onClick={() => setAnnotateToolMode('block')}
                        title="Select page element for block"
                      >
                        <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M20 3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM4 19V5h16v14H4z" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
                <p className="rcm-annotate-hint">
                  Text: drag to select. Block: use the page tool—hover a region for a grey preview, then click; yellow shows your saved marks.
                </p>
              </div>

              {/* Paging Row */}
              <div className="rcm-toolbar-row rcm-paging-row">
                <div className="rcm-paging">
                  <button className="rcm-icon-btn">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                  </button>
                  <button className="rcm-icon-btn">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
                    </svg>
                  </button>
                  <span className="rcm-page-indicator">1 of 5</span>
                  <button className="rcm-icon-btn">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                    </svg>
                  </button>
                  <button className="rcm-icon-btn">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
                    </svg>
                  </button>
                </div>
                <div className="rcm-viewer-tools">
                  <button className="rcm-icon-btn">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
                    </svg>
                  </button>
                  <button className="rcm-icon-btn">+</button>
                  <button className="rcm-icon-btn">−</button>
                  <select className="rcm-zoom-combo">
                    <option>100%</option>
                    <option>125%</option>
                    <option>150%</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Document */}
            <div className="rcm-document-preview">
              <div
                ref={documentRef}
                className="rcm-document-content"
                onMouseUp={handleTextSelection}
              >
                <h1 className="doc-title">CORDIM® (Cordimetrix Hydrochloride)</h1>

                <section className="doc-section">
                  <h2 className="doc-heading">INDICATIONS AND USAGE</h2>
                  <p className="doc-text">
                    Cordim is indicated for the treatment of arterial hypertension in adults to lower blood pressure.
                    Lowering blood pressure reduces the risk of fatal and nonfatal cardiovascular events, primarily
                    strokes and myocardial infarctions.
                  </p>
                </section>

                <section className="doc-section">
                  <h2 className="doc-heading">DOSAGE AND ADMINISTRATION</h2>
                  <p className="doc-text">
                    The recommended starting dose is 5 mg once daily. Depending on patient response, the dose may be
                    increased to a maximum of 10 mg once daily.
                  </p>
                </section>

                <section className="doc-section">
                  <h2 className="doc-heading">CLINICAL PHARMACOLOGY</h2>
                  <p className="doc-text">
                    Clinical efficacy was demonstrated in Phase III trials with 1,200+ patients. Cordim showed
                    significant blood pressure reduction compared to placebo (p &lt; 0.001).
                  </p>
                </section>
              </div>
            </div>
          </div>

          {/* Splitter */}
          <div
            className="rcm-splitter"
            onMouseDown={() => setIsDragging(true)}
          />

          {/* Sidebar */}
          <aside className="rcm-doc-sidebar" style={{ width: `${sidebarWidth}px` }}>
            {/* Scoped Tabs */}
            <div className="slds-tabs_scoped">
              <ul className="slds-tabs_scoped__nav" role="tablist">
                <li className={`slds-tabs_scoped__item ${activeTab === 'annotations' ? 'slds-is-active' : ''}`}>
                  <a className="slds-tabs_scoped__link" onClick={() => setActiveTab('annotations')}>
                    Annotations ({annotations.length})
                  </a>
                </li>
                <li className={`slds-tabs_scoped__item ${activeTab === 'workitems' ? 'slds-is-active' : ''}`}>
                  <a className="slds-tabs_scoped__link" onClick={() => setActiveTab('workitems')}>
                    Content Work Items
                  </a>
                </li>
                <li className={`slds-tabs_scoped__item ${activeTab === 'assistant' ? 'slds-is-active' : ''}`}>
                  <a className="slds-tabs_scoped__link" onClick={() => setActiveTab('assistant')}>
                    Content Assistant
                  </a>
                </li>
              </ul>

              <div className="slds-tabs_scoped__content">
                {activeTab === 'annotations' && (
                  <div className="rcm-annotations-panel">
                    <div className="rcm-annotations-list">
                      {annotations.map((ann) => (
                        <div key={ann.id} className="rcm-annotation-card">
                          {/* Header */}
                          <div className="rcm-ann-header">
                            <button className="rcm-ann-chevron" onClick={() => toggleAnnotation(ann.id)}>
                              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24">
                                {ann.expanded ? (
                                  <path d="M7 10l5 5 5-5z" />
                                ) : (
                                  <path d="M10 17l5-5-5-5v10z" />
                                )}
                              </svg>
                            </button>
                            <div className="rcm-ann-title-cluster">
                              <p className="rcm-ann-code">{ann.annCode}</p>
                              {ann.isAnchor && (
                                <span className="rcm-anchor-badge" title="Marked as anchor">⚓</span>
                              )}
                            </div>
                            <div className="rcm-ann-more-wrap">
                              <button className="rcm-ann-more" onClick={() => toggleMenu(ann.id)}>
                                <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                                  <circle cx="12" cy="5" r="2" />
                                  <circle cx="12" cy="12" r="2" />
                                  <circle cx="12" cy="19" r="2" />
                                </svg>
                              </button>
                              {openMenuId === ann.id && (
                                <div className="rcm-ann-dropdown">
                                  <button>Copy link</button>
                                  <button>Edit</button>
                                  <button>Delete</button>
                                  <button onClick={() => toggleResolve(ann.id)}>
                                    {ann.status === 'Resolved' ? 'Unresolve' : 'Resolve'}
                                  </button>
                                  <button>Assign to...</button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Meta */}
                          <div className="rcm-ann-meta">
                            <svg width="12" height="12" fill="#706e6b" viewBox="0 0 24 24">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                            </svg>
                            <a className="rcm-ann-author">{ann.author}</a>
                            <span className="rcm-ann-dot">·</span>
                            <span className="rcm-ann-time">{ann.timeAgo}</span>
                            <span className="rcm-ann-dot">·</span>
                            <span className="rcm-ann-status">{ann.status}</span>
                          </div>

                          {/* Collapsed Badges */}
                          {!ann.expanded && (
                            <div className="rcm-collapsed-badges">
                              {ann.linkedClaimsCount > 0 && (
                                <button className="rcm-figma-badge">
                                  {ann.linkedClaimsCount} linked claim{ann.linkedClaimsCount !== 1 ? 's' : ''}
                                </button>
                              )}
                              {ann.commentsCount > 0 && (
                                <button className="rcm-figma-badge">
                                  {ann.commentsCount} comment{ann.commentsCount !== 1 ? 's' : ''}
                                </button>
                              )}
                            </div>
                          )}

                          {/* Expanded Body */}
                          {ann.expanded && (
                            <div className="rcm-ann-body">
                              <div className="rcm-ann-snippet">
                                <span className="rcm-snippet-quote">&quot;{ann.snippet}&quot;</span>
                              </div>

                              {/* Linked Claims Section */}
                              <div className="rcm-ann-section">
                                <h3 className="rcm-section-heading">
                                  <span>Linked Claims ({ann.linkedClaimsCount})</span>
                                  <a className="rcm-section-link">Link Claim</a>
                                </h3>
                                {ann.linkedClaims.length > 0 && (
                                  <div className="rcm-linked-list">
                                    {ann.linkedClaims.map((lc) => (
                                      <div key={lc.code} className="rcm-linked-item">
                                        <svg width="14" height="14" fill="#0176d3" viewBox="0 0 24 24">
                                          <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                                        </svg>
                                        <a className="rcm-claim-code">{lc.code}</a>
                                        <span className="rcm-claim-text">{lc.text}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Comments Section */}
                              <div className="rcm-ann-section">
                                <h3 className="rcm-section-heading">
                                  <span>Comments ({ann.commentsCount})</span>
                                </h3>
                                <div className="rcm-comments-list">
                                  {ann.comments.map((comment, idx) => (
                                    <div key={idx} className="rcm-comment">
                                      <div className="rcm-comment-header">
                                        <strong>{comment.author}</strong>
                                        <span>{comment.timeAgo}</span>
                                      </div>
                                      <p className="rcm-comment-text">{comment.text}</p>
                                    </div>
                                  ))}
                                </div>
                                <textarea
                                  className="rcm-comment-input"
                                  placeholder="Write a comment..."
                                  value={newComment}
                                  onChange={(e) => setNewComment(e.target.value)}
                                  rows={3}
                                />
                                <button
                                  className="rcm-btn-brand rcm-btn-sm"
                                  onClick={() => addComment(ann.id)}
                                >
                                  Add Comment
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeTab === 'workitems' && (
                  <div className="rcm-empty-state">
                    <img src="/api/placeholder/80/80" alt="" className="rcm-empty-img" />
                    <p>No work items assigned</p>
                  </div>
                )}

                {activeTab === 'assistant' && (
                  <div className="rcm-empty-state">
                    <p>Content Assistant</p>
                    <p className="rcm-empty-subtitle">AI-powered content analysis</p>
                  </div>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
