'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import './rcm-demo.css';

interface Annotation {
  id: string;
  text: string;
  author: string;
  timestamp: Date;
  status: 'open' | 'resolved';
  linkedClaim?: string;
  comments: Array<{
    id: string;
    text: string;
    author: string;
    timestamp: Date;
  }>;
}

export default function RCMWorkflowDemo() {
  const documentRef = useRef<HTMLDivElement>(null);
  const [currentStage, setCurrentStage] = useState<'draft' | 'review' | 'approval' | 'published'>('review');
  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: 'ann-1',
      text: 'Cordim is indicated for the treatment of arterial hypertension...',
      author: 'Dr. Sarah Chen',
      timestamp: new Date('2026-05-10T10:30:00'),
      status: 'open',
      linkedClaim: 'CLAIM-2024-001',
      comments: [
        {
          id: 'c1',
          text: 'This claim needs verification against clinical trial data',
          author: 'Dr. Sarah Chen',
          timestamp: new Date('2026-05-10T10:30:00'),
        },
      ],
    },
  ]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'annotations' | 'workitems' | 'assistant'>('annotations');
  const [newComment, setNewComment] = useState('');
  const [showSelectionTooltip, setShowSelectionTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [selectedText, setSelectedText] = useState('');

  const stages = [
    { key: 'draft', label: 'Draft' },
    { key: 'review', label: 'Review' },
    { key: 'approval', label: 'Approval' },
    { key: 'published', label: 'Published' },
  ];

  const addComment = (annotationId: string) => {
    if (!newComment.trim()) return;

    setAnnotations((prev) =>
      prev.map((ann) =>
        ann.id === annotationId
          ? {
              ...ann,
              comments: [
                ...ann.comments,
                {
                  id: `c-${Date.now()}`,
                  text: newComment,
                  author: 'Current User',
                  timestamp: new Date(),
                },
              ],
            }
          : ann
      )
    );
    setNewComment('');
  };

  const toggleAnnotationStatus = (annotationId: string) => {
    setAnnotations((prev) =>
      prev.map((ann) =>
        ann.id === annotationId ? { ...ann, status: ann.status === 'open' ? 'resolved' : 'open' } : ann
      )
    );
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length === 0) {
      setShowSelectionTooltip(false);
      return;
    }

    const text = selection.toString().trim();
    if (text.length < 3) return; // Minimum 3 characters

    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();

    setSelectedText(text);
    setTooltipPosition({
      x: rect.left + rect.width / 2,
      y: rect.top + window.scrollY - 10,
    });
    setShowSelectionTooltip(true);
  };

  const createAnnotation = () => {
    if (!selectedText) return;

    const newAnnotation: Annotation = {
      id: `ann-${Date.now()}`,
      text: selectedText,
      author: 'Current User',
      timestamp: new Date(),
      status: 'open',
      comments: [],
    };

    setAnnotations((prev) => [...prev, newAnnotation]);
    setShowSelectionTooltip(false);
    setSelectedText('');
    setSelectedAnnotation(newAnnotation.id);

    // Clear selection
    window.getSelection()?.removeAllRanges();
  };

  useEffect(() => {
    const handleClickOutside = () => {
      if (!window.getSelection()?.toString()) {
        setShowSelectionTooltip(false);
      }
    };

    document.addEventListener('mouseup', handleTextSelection);
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mouseup', handleTextSelection);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getStageClass = (stageKey: string, index: number) => {
    const currentIndex = stages.findIndex((s) => s.key === currentStage);
    if (stageKey === currentStage) return 'slds-path__stage slds-is-current';
    if (index < currentIndex) return 'slds-path__stage slds-is-complete';
    return 'slds-path__stage slds-is-incomplete';
  };

  return (
    <div className="slds-scope" style={{ minHeight: '100vh', background: '#f3f2f2' }}>
      {/* Selection Tooltip */}
      {showSelectionTooltip && (
        <div
          className="rcm-selection-tooltip"
          style={{ left: `${tooltipPosition.x}px`, top: `${tooltipPosition.y}px` }}
          onClick={createAnnotation}
        >
          + Add Annotation
        </div>
      )}

      {/* SLDS Page Header */}
      <div className="slds-page-header">
        <Link href="/workflows" className="slds-text-link" style={{ display: 'block', marginBottom: '1rem' }}>
          ← Back to Workflows
        </Link>

        {/* Header Row 1: Icon + Title + Actions */}
        <div className="slds-page-header__row">
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{
              width: '3rem',
              height: '3rem',
              background: '#0176d3',
              borderRadius: '0.25rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
            }}>
              <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
              </svg>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#706e6b', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                Regulated Content
              </p>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3e3e3c', margin: 0 }}>
                Cordim Product Label - US Market
              </h1>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="slds-button slds-button_neutral">Follow</button>
            <button className="slds-button slds-button_neutral">Edit</button>
            <button className="slds-button slds-button_neutral">Delete</button>
          </div>
        </div>

        {/* Header Row 2: Detail Fields */}
        <ul className="slds-page-header__detail-row">
          <li className="slds-page-header__detail-block">
            <label>Content Type</label>
            <div>Product Label</div>
          </li>
          <li className="slds-page-header__detail-block">
            <label>Type</label>
            <div>PDF</div>
          </li>
          <li className="slds-page-header__detail-block">
            <label>Version</label>
            <div>2.1</div>
          </li>
          <li className="slds-page-header__detail-block">
            <label>Status</label>
            <div>In Review</div>
          </li>
          <li className="slds-page-header__detail-block">
            <label>Effective Dates</label>
            <div>Q2 2026</div>
          </li>
        </ul>

        {/* Path (Workflow Stages) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ display: 'flex', flex: 1 }}>
            {stages.map((stage, index) => (
              <button
                key={stage.key}
                className={getStageClass(stage.key, index)}
                onClick={() => setCurrentStage(stage.key as typeof currentStage)}
                style={{ flex: 1 }}
              >
                {stage.label}
              </button>
            ))}
          </div>
          <button className="slds-button slds-button_brand">
            ✨ Extract &amp; Match Claims
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'flex', height: 'calc(100vh - 300px)' }}>
        {/* Document Viewer */}
        <div style={{ flex: 1, padding: '1rem', overflow: 'auto' }}>
          <div className="slds-card" style={{ height: '100%' }}>
            <div className="slds-card__header">
              <h2 style={{ fontSize: '1rem', fontWeight: 600, margin: 0 }}>Document Viewer</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button className="slds-button" title="Zoom out">−</button>
                <button className="slds-button" title="Zoom in">+</button>
                <span style={{ fontSize: '0.875rem', color: '#706e6b', padding: '0.5rem' }}>Page 1 of 5</span>
              </div>
            </div>
            <div className="slds-card__body">
              <div
                ref={documentRef}
                className="rcm-document-content"
                style={{
                  maxWidth: '48rem',
                  margin: '0 auto',
                  padding: '2rem',
                  background: 'white',
                  border: '1px solid #dddbda',
                  borderRadius: '0.25rem',
                  minHeight: '800px',
                }}
              >
                <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2rem' }}>
                  CORDIM® (Medication Name)
                </h1>

                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    marginBottom: '1rem',
                    borderBottom: '2px solid #dddbda',
                    paddingBottom: '0.5rem',
                  }}>
                    INDICATIONS AND USAGE
                  </h2>
                  <p style={{ lineHeight: 1.8, color: '#3e3e3c' }}>
                    Cordim is indicated for the treatment of arterial hypertension in adults to lower blood pressure.
                    Lowering blood pressure reduces the risk of fatal and nonfatal cardiovascular events, primarily
                    strokes and myocardial infarctions. Patients should be monitored regularly during treatment.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    marginBottom: '1rem',
                    borderBottom: '2px solid #dddbda',
                    paddingBottom: '0.5rem',
                  }}>
                    DOSAGE AND ADMINISTRATION
                  </h2>
                  <p style={{ lineHeight: 1.8, color: '#3e3e3c', marginBottom: '1rem' }}>
                    The recommended starting dose of Cordim is 5 mg once daily. Depending on the patient's response,
                    the dose may be increased to a maximum of 10 mg once daily. Dose adjustments should be made based
                    on clinical response and patient tolerability.
                  </p>
                  <ul style={{ listStyle: 'disc', marginLeft: '2rem', lineHeight: 1.8, color: '#3e3e3c' }}>
                    <li>Initial dose: 5 mg once daily</li>
                    <li>Maximum dose: 10 mg once daily</li>
                    <li>Adjust dose based on patient response and tolerability</li>
                    <li>May be taken with or without food</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: 600,
                    marginBottom: '1rem',
                    borderBottom: '2px solid #dddbda',
                    paddingBottom: '0.5rem',
                  }}>
                    CLINICAL PHARMACOLOGY
                  </h2>
                  <p style={{ lineHeight: 1.8, color: '#3e3e3c' }}>
                    Clinical efficacy demonstrated in Phase III trials with 1,200+ patients. Cordim showed significant
                    blood pressure reduction compared to placebo (p &lt; 0.001). The antihypertensive effect was
                    sustained over 24 hours with once-daily dosing. Mechanism of action involves selective inhibition
                    of calcium channels in vascular smooth muscle.
                  </p>
                </div>

                <div style={{
                  padding: '1rem',
                  background: '#d8edff',
                  border: '1px solid #0176d3',
                  borderRadius: '0.25rem',
                  marginTop: '2rem',
                }}>
                  <p style={{ fontSize: '0.875rem', color: '#014486', margin: 0 }}>
                    💡 <strong>Demo Tip:</strong> Select any text in this document to create an annotation.
                    Try highlighting different sections to see how annotations work!
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Annotations Panel */}
        <div style={{ width: '24rem', borderLeft: '1px solid #dddbda', background: 'white', display: 'flex', flexDirection: 'column' }}>
          {/* Tabs */}
          <div className="slds-tabs_scoped">
            <ul className="slds-tabs_scoped__nav" role="tablist">
              <li className={`slds-tabs_scoped__item ${activeTab === 'annotations' ? 'slds-is-active' : ''}`} role="presentation">
                <a
                  className="slds-tabs_scoped__link"
                  role="tab"
                  onClick={() => setActiveTab('annotations')}
                >
                  Annotations ({annotations.length})
                </a>
              </li>
              <li className={`slds-tabs_scoped__item ${activeTab === 'workitems' ? 'slds-is-active' : ''}`} role="presentation">
                <a
                  className="slds-tabs_scoped__link"
                  role="tab"
                  onClick={() => setActiveTab('workitems')}
                >
                  Work Items
                </a>
              </li>
              <li className={`slds-tabs_scoped__item ${activeTab === 'assistant' ? 'slds-is-active' : ''}`} role="presentation">
                <a
                  className="slds-tabs_scoped__link"
                  role="tab"
                  onClick={() => setActiveTab('assistant')}
                >
                  AI Assistant
                </a>
              </li>
            </ul>
          </div>

          {/* Tab Content */}
          <div style={{ flex: 1, overflow: 'auto', padding: '1rem' }}>
            {activeTab === 'annotations' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {annotations.map((ann) => (
                  <div key={ann.id} className="slds-card" style={{ borderColor: selectedAnnotation === ann.id ? '#0176d3' : '#dddbda' }}>
                    <div style={{ padding: '0.75rem', background: '#f3f2f2' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                        <span className={`slds-badge ${ann.status === 'open' ? 'slds-badge_warning' : 'slds-badge_success'}`}>
                          {ann.status}
                        </span>
                        {ann.linkedClaim && (
                          <span style={{ fontSize: '0.75rem', color: '#0176d3', fontWeight: 600 }}>
                            {ann.linkedClaim}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.875rem', color: '#3e3e3c', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                        &quot;{ann.text.substring(0, 80)}...&quot;
                      </p>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#706e6b' }}>
                        <span>{ann.author}</span>
                        <span>{ann.timestamp.toLocaleDateString()}</span>
                      </div>
                    </div>

                    {selectedAnnotation === ann.id ? (
                      <div style={{ padding: '0.75rem', borderTop: '1px solid #dddbda' }}>
                        <div style={{ marginBottom: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          {ann.comments.map((comment) => (
                            <div key={comment.id} style={{ padding: '0.5rem', background: '#d8edff', borderRadius: '0.25rem' }}>
                              <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#014486', marginBottom: '0.25rem' }}>
                                {comment.author}
                              </div>
                              <div style={{ fontSize: '0.875rem', color: '#3e3e3c' }}>{comment.text}</div>
                              <div style={{ fontSize: '0.625rem', color: '#706e6b', marginTop: '0.25rem' }}>
                                {comment.timestamp.toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>

                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #dddbda',
                            borderRadius: '0.25rem',
                            fontSize: '0.875rem',
                            resize: 'none',
                            marginBottom: '0.5rem',
                          }}
                          rows={3}
                        />
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={() => addComment(ann.id)}
                            className="slds-button slds-button_brand"
                            style={{ flex: 1 }}
                          >
                            Add Comment
                          </button>
                          <button
                            onClick={() => toggleAnnotationStatus(ann.id)}
                            className="slds-button slds-button_neutral"
                          >
                            {ann.status === 'open' ? 'Resolve' : 'Reopen'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedAnnotation(ann.id)}
                        style={{
                          width: '100%',
                          padding: '0.75rem',
                          border: 'none',
                          background: 'transparent',
                          color: '#0176d3',
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          cursor: 'pointer',
                          borderTop: '1px solid #dddbda',
                        }}
                      >
                        View {ann.comments.length} comment{ann.comments.length !== 1 ? 's' : ''}
                      </button>
                    )}
                  </div>
                ))}

                {annotations.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#706e6b' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💬</div>
                    <p style={{ fontSize: '0.875rem' }}>No annotations yet</p>
                    <p style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Select text to create your first annotation</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'workitems' && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#706e6b' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
                <p style={{ fontSize: '0.875rem' }}>No work items assigned</p>
              </div>
            )}

            {activeTab === 'assistant' && (
              <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#706e6b' }}>
                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤖</div>
                <p style={{ fontSize: '0.875rem' }}>AI Assistant coming soon</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
