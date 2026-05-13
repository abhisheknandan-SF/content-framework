'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import './slds-base.css';
import './contentRecordPage.css';

interface Annotation {
  id: string;
  code: string;
  snippetText: string;
  author: string;
  timestamp: string;
  status: string;
  comments: Comment[];
  isExpanded: boolean;
  isSelected: boolean;
  linkedClaims?: LinkedClaim[];
}

interface Comment {
  id: string;
  author: string;
  text: string;
  timestamp: string;
}

interface LinkedClaim {
  id: string;
  code: string;
  text: string;
}

export default function RCMDemoPage() {
  // State management
  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: '1',
      code: 'ANN-001',
      snippetText:
        'The primary endpoint of overall survival was met with statistical significance.',
      author: 'Sarah Chen',
      timestamp: '2 hours ago',
      status: 'Open',
      comments: [
        {
          id: 'c1',
          author: 'Michael Torres',
          text: 'Verify against statistical analysis plan.',
          timestamp: '1 hour ago',
        },
      ],
      isExpanded: false,
      isSelected: false,
      linkedClaims: [
        {
          id: 'cl1',
          code: 'CLM-042',
          text: 'Significantly improves overall survival',
        },
      ],
    },
    {
      id: '2',
      code: 'ANN-002',
      snippetText: 'Treatment-related adverse events were consistent with the known safety profile',
      author: 'David Kumar',
      timestamp: '3 hours ago',
      status: 'In Review',
      comments: [],
      isExpanded: false,
      isSelected: false,
    },
  ]);

  const [activeMainTab, setActiveMainTab] = useState('document');
  const [activeSidebarTab, setActiveSidebarTab] = useState('annotations');
  const [htmlAnnotateActive, setHtmlAnnotateActive] = useState(false);
  const [htmlAnnotateMode, setHtmlAnnotateMode] = useState<'highlight' | 'block' | null>(null);
  const [newCommentText, setNewCommentText] = useState<{ [key: string]: string }>({});
  const [dropdownOpen, setDropdownOpen] = useState<string | null>(null);
  const [sidebarWidth, setSidebarWidth] = useState(400);
  const [isDraggingSplitter, setIsDraggingSplitter] = useState(false);

  const documentRef = useRef<HTMLDivElement>(null);

  // Path steps with proper state handling
  const pathSteps = [
    { stage: 'draft', label: 'Draft' },
    { stage: 'review', label: 'Review' },
    { stage: 'approve', label: 'Approve' },
    { stage: 'archive', label: 'Archive' },
  ];
  const currentStage = 'review';

  const pathStepItems = pathSteps.map((s, i) => {
    const isFirst = i === 0;
    const isLast = i === pathSteps.length - 1;
    const active = currentStage === s.stage;
    const mod = isFirst ? 'content-path-seg_first' : isLast ? 'content-path-seg_last' : 'content-path-seg_middle';

    return {
      key: s.stage,
      label: s.label,
      showRightCap: !isLast,
      segClass: [
        'content-path-seg',
        mod,
        active ? 'content-path-seg_is-active' : ''
      ]
        .filter(Boolean)
        .join(' '),
      ariaCurrent: active ? ('step' as const) : null,
      wrapStyle: { zIndex: pathSteps.length - i },
    };
  });

  // Handlers
  const handleAnnotateToggle = () => {
    setHtmlAnnotateActive(!htmlAnnotateActive);
    if (htmlAnnotateActive) {
      setHtmlAnnotateMode(null);
    }
  };

  const handleAnnotateModeHighlight = () => {
    setHtmlAnnotateMode(htmlAnnotateMode === 'highlight' ? null : 'highlight');
  };

  const handleAnnotateModeBlock = () => {
    setHtmlAnnotateMode(htmlAnnotateMode === 'block' ? null : 'block');
  };

  const handleTextSelection = () => {
    if (!htmlAnnotateActive || htmlAnnotateMode !== 'highlight') return;

    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length === 0) return;

    const selectedText = selection.toString().trim();
    if (selectedText.length < 5) return;

    const newAnnotation: Annotation = {
      id: Date.now().toString(),
      code: `ANN-${String(annotations.length + 1).padStart(3, '0')}`,
      snippetText: selectedText,
      author: 'Current User',
      timestamp: 'Just now',
      status: 'Open',
      comments: [],
      isExpanded: true,
      isSelected: false,
    };

    setAnnotations([...annotations, newAnnotation]);
    selection.removeAllRanges();
  };

  const toggleAnnotationExpand = (id: string) => {
    setAnnotations(
      annotations.map((ann) =>
        ann.id === id ? { ...ann, isExpanded: !ann.isExpanded } : ann
      )
    );
  };

  const selectAnnotation = (id: string) => {
    setAnnotations(
      annotations.map((ann) => ({ ...ann, isSelected: ann.id === id }))
    );
  };

  const addComment = (annotationId: string) => {
    const commentText = newCommentText[annotationId]?.trim();
    if (!commentText) return;

    const newComment: Comment = {
      id: Date.now().toString(),
      author: 'Current User',
      text: commentText,
      timestamp: 'Just now',
    };

    setAnnotations(
      annotations.map((ann) =>
        ann.id === annotationId
          ? { ...ann, comments: [...ann.comments, newComment] }
          : ann
      )
    );

    setNewCommentText({ ...newCommentText, [annotationId]: '' });
  };

  // Splitter resize
  const handleSplitterPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setIsDraggingSplitter(true);
  };

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingSplitter) return;
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 240 && newWidth <= 800) {
        setSidebarWidth(newWidth);
      }
    };

    const handlePointerUp = () => {
      setIsDraggingSplitter(false);
    };

    if (isDraggingSplitter) {
      document.addEventListener('pointermove', handlePointerMove);
      document.addEventListener('pointerup', handlePointerUp);
    }

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [isDraggingSplitter]);

  return (
    <article className="slds-card content-record-page-card">
      <div className="content-record-page-inner">
        {/* Hero: Header + Path */}
        <div className="content-record-hero">
          {/* Page Header Shell */}
          <div className="content-record-page-header-shell">
            <div className="content-record-page-header">
              <div className="content-record-page-header-main">
                <div className="content-record-page-header-icon" aria-hidden="true">
                  <svg className="content-record-header-doc-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5 2h7l3 3v13H5V2z" fillOpacity="0.7" />
                    <path d="M12 2v3h3z" fillOpacity="0.5" />
                  </svg>
                </div>
                <div className="content-record-page-header-titles">
                  <p className="content-record-eyebrow">Clinical Trial Report</p>
                  <h1 className="content-record-page-title">Immunexis Phase III Trial Results</h1>
                </div>
              </div>
              <div className="content-record-page-header-actions" role="group" aria-label="Record actions">
                <Link
                  href="/workflows"
                  className="slds-button slds-button_neutral"
                  style={{ textDecoration: 'none' }}
                >
                  ← Back
                </Link>
                <button className="slds-button slds-button_brand-outline">Follow</button>
                <div className="slds-button-group" role="group">
                  <button className="slds-button slds-button_neutral">Edit</button>
                  <button className="slds-button slds-button_neutral">Delete</button>
                  <button className="slds-button slds-button_neutral">Clone</button>
                </div>
                <button className="slds-button slds-button_icon slds-button_icon-border-filled" title="More actions">
                  <span className="slds-icon_container">⋯</span>
                </button>
              </div>
            </div>
            {/* Highlight Panel */}
            <div className="content-record-highlight-panel" role="group" aria-label="Key fields">
              <div className="content-record-highlight-field">
                <span className="content-record-highlight-label">Content Type</span>
                <span className="content-record-highlight-value">Clinical Trial Report</span>
              </div>
              <div className="content-record-highlight-field">
                <span className="content-record-highlight-label">Type</span>
                <span className="content-record-highlight-value">PDF Document</span>
              </div>
              <div className="content-record-highlight-field">
                <span className="content-record-highlight-label">Version</span>
                <span className="content-record-highlight-value">2.1</span>
              </div>
              <div className="content-record-highlight-field">
                <span className="content-record-highlight-label">Status</span>
                <span className="content-record-highlight-value">In Review</span>
              </div>
              <div className="content-record-highlight-field">
                <span className="content-record-highlight-label">Effective Dates</span>
                <span className="content-record-highlight-value">Jan 2024 - Dec 2026</span>
              </div>
            </div>
          </div>

          {/* Path Actions */}
          <div className="content-record-path-actions">
            <div className="content-record-path-figma">
              <div className="content-record-path-rail" role="group" aria-label="Content workflow stages">
                <div className="content-record-path-stages" role="presentation">
                  {pathStepItems.map((st) => (
                    <div
                      key={st.key}
                      className="content-path-seg-wrap"
                      data-step={st.key}
                      style={st.wrapStyle}
                    >
                      <div className={st.segClass} role="presentation">
                        <div className="content-path-seg__stage">
                          <span className="content-path-seg-label" aria-current={st.ariaCurrent || undefined}>
                            {st.label}
                          </span>
                        </div>
                        {st.showRightCap && (
                          <div className="content-path-seg__end content-path-seg__end_right" aria-hidden="true"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <button className="slds-button slds-button_brand-outline content-record-extract-btn">
                <span className="slds-icon_container" style={{ marginRight: '0.5rem' }}>✨</span>
                Extract & Match Claims
              </button>
              <div className="content-record-send-split slds-button-group" role="group" aria-label="Send for review">
                <button className="slds-button slds-button_neutral content-record-btn-send-review">
                  Send for review
                </button>
                <button
                  className="slds-button slds-button_icon slds-button_icon-border-filled content-record-btn-send-review-chevron"
                  title="More send options"
                >
                  <span className="slds-icon_container">▾</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Article: Main Tabs */}
        <div className="content-record-article">
          <div className="content-record-main-tabset">
            {/* Tab nav */}
            <ul className="slds-tabs_default__nav" role="tablist">
              <li
                className={`slds-tabs_default__item ${activeMainTab === 'document' ? 'slds-is-active' : ''}`}
                role="presentation"
              >
                <a
                  className="slds-tabs_default__link"
                  role="tab"
                  onClick={() => setActiveMainTab('document')}
                  aria-selected={activeMainTab === 'document'}
                >
                  Document
                </a>
              </li>
              <li
                className={`slds-tabs_default__item ${activeMainTab === 'related' ? 'slds-is-active' : ''}`}
                role="presentation"
              >
                <a
                  className="slds-tabs_default__link"
                  role="tab"
                  onClick={() => setActiveMainTab('related')}
                  aria-selected={activeMainTab === 'related'}
                >
                  Related
                </a>
              </li>
              <li
                className={`slds-tabs_default__item ${activeMainTab === 'activity' ? 'slds-is-active' : ''}`}
                role="presentation"
              >
                <a
                  className="slds-tabs_default__link"
                  role="tab"
                  onClick={() => setActiveMainTab('activity')}
                  aria-selected={activeMainTab === 'activity'}
                >
                  Activity
                </a>
              </li>
            </ul>

            {/* Tab panels */}
            {activeMainTab === 'document' && (
              <div className="content-record-tab-panel content-record-tab-panel_document">
                <div className="content-record-doc-layout">
                  {/* Document Main */}
                  <div className="content-record-doc-main">
                    {/* Viewer Toolbar */}
                    <div className="content-record-viewer-toolbar">
                      <div className="content-record-viewer-toolbar-row">
                        <div className="content-record-file-title">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" style={{ opacity: 0.7 }}>
                            <path d="M4 2h5l3 3v9H4V2z" />
                          </svg>
                          <span className="content-record-file-name">immunexis-clinical-trial.pdf</span>
                        </div>
                        <div className="content-record-viewer-toolbar-actions">
                          <button className="slds-button slds-button_neutral">
                            <span className="slds-icon_container" style={{ marginRight: '0.25rem' }}>⬇</span>
                            Download
                          </button>
                          <button className="slds-button slds-button_icon slds-button_icon-border-filled" title="More">
                            <span className="slds-icon_container">⋯</span>
                          </button>
                        </div>
                      </div>

                      {/* HTML Annotate Row */}
                      <div className="content-record-viewer-toolbar-row content-record-html-annotate-row" role="toolbar">
                        <div className="content-record-html-annotate-start">
                          <button
                            className={`slds-button ${htmlAnnotateActive ? 'slds-button_brand' : 'slds-button_neutral'} content-record-html-annotate-action`}
                            onClick={handleAnnotateToggle}
                            title="Turn on Annotate, pick a tool, then select text or click a block"
                          >
                            Annotate
                          </button>
                          {htmlAnnotateActive && (
                            <div className="content-record-html-annotate-tools" role="group" aria-label="Annotation tools">
                              <button
                                className={`slds-button slds-button_icon ${htmlAnnotateMode === 'highlight' ? 'slds-button_icon-brand' : 'slds-button_icon-border-filled'}`}
                                onClick={handleAnnotateModeHighlight}
                                title="Drag to select text"
                              >
                                <span className="slds-icon_container">🖍</span>
                              </button>
                              <button
                                className={`slds-button slds-button_icon ${htmlAnnotateMode === 'block' ? 'slds-button_icon-brand' : 'slds-button_icon-border-filled'}`}
                                onClick={handleAnnotateModeBlock}
                                title="Select page element for block"
                              >
                                <span className="slds-icon_container">▢</span>
                              </button>
                            </div>
                          )}
                        </div>
                        <p className="content-record-html-annotate-hint slds-text-body_small slds-text-color_weak slds-m-left_small">
                          Text: drag to select. Block: use the page tool—hover a region for a grey preview, then click; yellow shows your saved marks.
                        </p>
                      </div>

                      {/* Paging Row */}
                      <div className="content-record-viewer-toolbar-row content-record-viewer-toolbar-row_paging">
                        <div className="content-record-paging">
                          <button className="slds-button slds-button_icon slds-button_icon-border-filled" title="Previous">
                            <span className="slds-icon_container">‹</span>
                          </button>
                          <span className="content-record-page-indicator">Page 1 of 7</span>
                          <button className="slds-button slds-button_icon slds-button_icon-border-filled" title="Next">
                            <span className="slds-icon_container">›</span>
                          </button>
                        </div>
                        <div className="content-record-viewer-tools">
                          <button className="slds-button slds-button_icon slds-button_icon-border-filled" title="Zoom out">
                            <span className="slds-icon_container">−</span>
                          </button>
                          <select className="slds-select content-record-zoom-combo">
                            <option>100%</option>
                            <option>125%</option>
                            <option>150%</option>
                            <option>200%</option>
                          </select>
                          <button className="slds-button slds-button_icon slds-button_icon-border-filled" title="Zoom in">
                            <span className="slds-icon_container">+</span>
                          </button>
                          <button className="slds-button slds-button_icon slds-button_icon-border-filled" title="Fit">
                            <span className="slds-icon_container">⤢</span>
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Document Preview */}
                    <div
                      ref={documentRef}
                      className="content-record-document-preview"
                      onMouseUp={handleTextSelection}
                      style={{
                        cursor: htmlAnnotateActive
                          ? htmlAnnotateMode === 'highlight'
                            ? 'text'
                            : htmlAnnotateMode === 'block'
                              ? 'crosshair'
                              : 'default'
                          : 'default',
                      }}
                    >
                      <iframe
                        src="/documents/immunexis-clinical-trial.pdf"
                        className="content-record-pdf-frame"
                        title="Clinical Trial Document"
                      />
                    </div>
                  </div>

                  {/* Splitter */}
                  <div
                    className="content-record-splitter"
                    role="separator"
                    tabIndex={0}
                    aria-orientation="vertical"
                    aria-label="Resize annotation panel"
                    aria-valuenow={sidebarWidth}
                    aria-valuemin={240}
                    aria-valuemax={800}
                    title="Drag to resize panels"
                    onPointerDown={handleSplitterPointerDown}
                    style={{ cursor: 'col-resize' }}
                  />

                  {/* Sidebar */}
                  <aside className="content-record-doc-sidebar" style={{ width: `${sidebarWidth}px` }} aria-label="Document tools and annotations">
                    <div className="content-record-scoped-shell">
                      <div className="slds-tabs_scoped content-record-scoped-tabs" role="region" aria-label="Document tools">
                        {/* Sidebar tabs nav */}
                        <ul className="slds-tabs_scoped__nav" role="tablist" aria-label="Panel sections">
                          <li
                            className={`slds-tabs_scoped__item ${activeSidebarTab === 'annotations' ? 'slds-is-active' : ''}`}
                            role="presentation"
                            title="Annotations"
                          >
                            <a
                              className="slds-tabs_scoped__link"
                              href="#"
                              role="tab"
                              aria-selected={activeSidebarTab === 'annotations'}
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveSidebarTab('annotations');
                              }}
                            >
                              Annotations ({annotations.length})
                            </a>
                          </li>
                          <li
                            className={`slds-tabs_scoped__item ${activeSidebarTab === 'claims' ? 'slds-is-active' : ''}`}
                            role="presentation"
                            title="Content Work items"
                          >
                            <a
                              className="slds-tabs_scoped__link"
                              href="#"
                              role="tab"
                              aria-selected={activeSidebarTab === 'claims'}
                              onClick={(e) => {
                                e.preventDefault();
                                setActiveSidebarTab('claims');
                              }}
                            >
                              Claims
                            </a>
                          </li>
                        </ul>

                        {/* Sidebar content */}
                        <div className="content-record-scoped-panels">
                          {activeSidebarTab === 'annotations' && (
                            <div className="content-record-annotations-panel">
                              {annotations.length === 0 ? (
                                <div className="content-record-annotations-empty">
                                  <div className="content-record-annotations-empty-illustration">
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                                  </div>
                                  <h3 className="content-record-annotations-empty-title">No annotations yet</h3>
                                  <p className="content-record-annotations-empty-body slds-text-body_small">Click "Annotate" to add your first annotation</p>
                                </div>
                              ) : (
                                <ul className="content-record-annotations-list">
                                  {annotations.map((ann) => (
                                    <li
                                      key={ann.id}
                                      className={`content-record-annotation-card ${ann.isExpanded ? 'content-record-annotation-card_is-expanded' : ''} ${ann.isSelected ? 'content-record-annotation-card_is-selected' : ''}`}
                                      onClick={() => selectAnnotation(ann.id)}
                                    >
                                      {/* Header */}
                                      <div className="content-record-annotation-header">
                                        <button
                                          className="content-record-annotation-chevron"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleAnnotationExpand(ann.id);
                                          }}
                                          aria-label={ann.isExpanded ? 'Collapse' : 'Expand'}
                                        >
                                          <span className="content-record-annotation-chevron-icon">
                                            {ann.isExpanded ? '▼' : '▶'}
                                          </span>
                                        </button>
                                        <div className="content-record-annotation-title-cluster">
                                          <p className="content-record-annotation-ann-code">{ann.code}</p>
                                          <img
                                            src="data:image/svg+xml,%3Csvg width='14' height='14' viewBox='0 0 14 14' fill='%235c5c5c' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M7 2L9 7L7 12L5 7L7 2Z'/%3E%3C/svg%3E"
                                            alt="anchor"
                                            className="content-record-annotation-anchor-badge__img"
                                          />
                                        </div>
                                        <div className="content-record-annotation-more-wrap">
                                          <button
                                            className="content-record-annotation-more"
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              setDropdownOpen(dropdownOpen === ann.id ? null : ann.id);
                                            }}
                                            aria-label="More actions"
                                          >
                                            <span className="content-record-annotation-more-icon">⋯</span>
                                          </button>
                                          {dropdownOpen === ann.id && (
                                            <div className="content-record-annotation-dropdown">
                                              <button className="content-record-annotation-menu-item">Edit</button>
                                              <button className="content-record-annotation-menu-item">Delete</button>
                                              <button className="content-record-annotation-menu-item">Share</button>
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      {/* Meta */}
                                      <div className="content-record-annotation-meta">
                                        <a href="#" className="content-record-annotation-author" onClick={(e) => e.preventDefault()}>
                                          {ann.author}
                                        </a>
                                        <span className="content-record-annotation-dot">•</span>
                                        <span className="content-record-annotation-time">{ann.timestamp}</span>
                                        <span className="content-record-annotation-dot">•</span>
                                        <span className="content-record-annotation-status-text">{ann.status}</span>
                                      </div>

                                      {/* Collapsed badges */}
                                      {!ann.isExpanded && (
                                        <div className="content-record-annotation-collapsed-badges">
                                          {ann.comments.length > 0 && (
                                            <span className="content-record-annotation-figma-badge">
                                              💬 {ann.comments.length}
                                            </span>
                                          )}
                                          {ann.linkedClaims && ann.linkedClaims.length > 0 && (
                                            <span className="content-record-annotation-figma-badge">
                                              🔗 {ann.linkedClaims.length}
                                            </span>
                                          )}
                                        </div>
                                      )}

                                      {/* Expanded body */}
                                      {ann.isExpanded && (
                                        <div className="content-record-annotation-body">
                                          {/* Snippet */}
                                          <div className="content-record-annotation-snippet">
                                            <p className="content-record-annotation-snippet-quote">"{ann.snippetText}"</p>
                                          </div>

                                          {/* Linked Claims */}
                                          {ann.linkedClaims && ann.linkedClaims.length > 0 && (
                                            <div className="content-record-annotation-expandable-slot">
                                              <div className="content-record-annotation-section-shell content-record-annotation-section-shell_open">
                                                <div className="content-record-annotation-section-bar">
                                                  <div className="content-record-annotation-section-heading">
                                                    <span className="content-record-annotation-section-heading-text">
                                                      Linked Claims ({ann.linkedClaims.length})
                                                    </span>
                                                  </div>
                                                  <a href="#" className="content-record-annotation-section-link content-record-annotation-section-link_bar" onClick={(e) => e.preventDefault()}>
                                                    View all
                                                  </a>
                                                </div>
                                                <div className="content-record-annotation-section-panel">
                                                  <div className="content-record-annotation-linked-list">
                                                    {ann.linkedClaims.map((claim) => (
                                                      <div key={claim.id} className="content-record-annotation-linked-row">
                                                        <a href="#" className="content-record-annotation-linked-code" onClick={(e) => e.preventDefault()}>
                                                          {claim.code}
                                                        </a>
                                                        <span className="content-record-annotation-linked-spacer">{claim.text}</span>
                                                      </div>
                                                    ))}
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )}

                                          {/* Comments */}
                                          <div className="content-record-annotation-expandable-slot">
                                            <div className="content-record-annotation-section-shell content-record-annotation-section-shell_open">
                                              <div className="content-record-annotation-section-bar">
                                                <div className="content-record-annotation-section-heading">
                                                  <span className="content-record-annotation-section-heading-text">
                                                    Comments ({ann.comments.length})
                                                  </span>
                                                </div>
                                              </div>
                                              <div className="content-record-annotation-section-panel">
                                                {ann.comments.length > 0 && (
                                                  <div className="content-record-annotation-comments-list">
                                                    {ann.comments.map((comment) => (
                                                      <div key={comment.id} className="content-record-annotation-comment">
                                                        <div className="content-record-annotation-comment-hdr">
                                                          <div className="content-record-annotation-comment-avatar content-record-annotation-comment-avatar_brand">
                                                            <span style={{ fontSize: '0.5rem', color: 'white' }}>👤</span>
                                                          </div>
                                                          <a href="#" className="content-record-annotation-author content-record-annotation-author_comment" onClick={(e) => e.preventDefault()}>
                                                            {comment.author}
                                                          </a>
                                                          <span className="content-record-annotation-dot">•</span>
                                                          <span className="content-record-annotation-time">{comment.timestamp}</span>
                                                        </div>
                                                        <p className="content-record-annotation-comment-body">{comment.text}</p>
                                                        <div className="content-record-annotation-comment-divider" />
                                                      </div>
                                                    ))}
                                                  </div>
                                                )}
                                                <div className="content-record-annotation-composer">
                                                  <textarea
                                                    className="slds-textarea content-record-annotation-composer-field"
                                                    placeholder="Add a comment..."
                                                    rows={3}
                                                    value={newCommentText[ann.id] || ''}
                                                    onChange={(e) =>
                                                      setNewCommentText({
                                                        ...newCommentText,
                                                        [ann.id]: e.target.value,
                                                      })
                                                    }
                                                    onClick={(e) => e.stopPropagation()}
                                                  />
                                                  <div className="content-record-annotation-composer-actions">
                                                    <button
                                                      className="slds-button slds-button_brand"
                                                      onClick={(e) => {
                                                        e.stopPropagation();
                                                        addComment(ann.id);
                                                      }}
                                                    >
                                                      Post
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}

                          {activeSidebarTab === 'claims' && (
                            <div className="content-record-annotations-empty">
                              <div className="content-record-annotations-empty-illustration">
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔗</div>
                              </div>
                              <h3 className="content-record-annotations-empty-title">No claims extracted yet</h3>
                              <p className="content-record-annotations-empty-body slds-text-body_small">
                                Click "Extract & Match Claims" to begin
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            )}

            {activeMainTab === 'related' && (
              <div className="content-record-tab-panel" style={{ padding: '1rem' }}>
                <h3 className="content-record-related-title">Related Records</h3>
                <p className="content-record-empty">No related records</p>
              </div>
            )}

            {activeMainTab === 'activity' && (
              <div className="content-record-tab-panel" style={{ padding: '1rem' }}>
                <h3 className="content-record-related-title">Activity Timeline</h3>
                <p className="content-record-empty">No recent activity</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
