'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Annotation {
  id: string;
  type: 'highlight' | 'comment';
  text: string;
  pageNumber: number;
  position: { x: number; y: number };
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
  const [currentStage, setCurrentStage] = useState<'draft' | 'review' | 'approval' | 'published'>('review');
  const [annotations, setAnnotations] = useState<Annotation[]>([
    {
      id: 'ann-1',
      type: 'highlight',
      text: 'Cordim is indicated for the treatment of arterial hypertension...',
      pageNumber: 1,
      position: { x: 100, y: 200 },
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
    {
      id: 'ann-2',
      type: 'comment',
      text: 'Clinical efficacy demonstrated in Phase III trials...',
      pageNumber: 2,
      position: { x: 150, y: 350 },
      author: 'John Martinez',
      timestamp: new Date('2026-05-11T14:15:00'),
      status: 'resolved',
      linkedClaim: 'CLAIM-2024-002',
      comments: [
        {
          id: 'c2',
          text: 'Approved - reference documentation attached',
          author: 'Dr. Emily Wilson',
          timestamp: new Date('2026-05-12T09:00:00'),
        },
      ],
    },
  ]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'annotations' | 'workitems' | 'assistant'>('annotations');
  const [newComment, setNewComment] = useState('');

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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* SLDS Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="px-6 py-4">
          <Link href="/workflows" className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block">
            ← Back to Workflows
          </Link>

          {/* Record Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded flex items-center justify-center text-white">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase tracking-wide mb-1">Regulated Content</p>
                <h1 className="text-2xl font-bold text-gray-900">Cordim Product Label - US Market</h1>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium hover:bg-gray-50">
                Follow
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium hover:bg-gray-50">
                Edit
              </button>
              <button className="px-4 py-2 bg-white border border-gray-300 rounded text-sm font-medium hover:bg-gray-50">
                Delete
              </button>
            </div>
          </div>

          {/* Highlight Panel */}
          <div className="grid grid-cols-5 gap-4 p-4 bg-gray-50 rounded-lg mb-4">
            <div>
              <p className="text-xs text-gray-600 mb-1">Content Type</p>
              <p className="text-sm font-semibold text-gray-900">Product Label</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Type</p>
              <p className="text-sm font-semibold text-gray-900">PDF</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Version</p>
              <p className="text-sm font-semibold text-gray-900">2.1</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Status</p>
              <p className="text-sm font-semibold text-gray-900">In Review</p>
            </div>
            <div>
              <p className="text-xs text-gray-600 mb-1">Effective Dates</p>
              <p className="text-sm font-semibold text-gray-900">Q2 2026</p>
            </div>
          </div>

          {/* Path (Workflow Stages) */}
          <div className="flex items-center justify-between">
            <div className="flex-1 flex items-center gap-1">
              {stages.map((stage, index) => (
                <div key={stage.key} className="flex items-center flex-1">
                  <button
                    onClick={() => setCurrentStage(stage.key as typeof currentStage)}
                    className={`relative flex-1 py-3 px-4 text-sm font-medium transition-colors ${
                      currentStage === stage.key
                        ? 'bg-blue-600 text-white'
                        : index < stages.findIndex((s) => s.key === currentStage)
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                    style={{
                      clipPath:
                        index === 0
                          ? 'polygon(0 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 0 100%)'
                          : index === stages.length - 1
                          ? 'polygon(12px 0, 100% 0, 100% 100%, 12px 100%, 0 50%)'
                          : 'polygon(12px 0, calc(100% - 12px) 0, 100% 50%, calc(100% - 12px) 100%, 12px 100%, 0 50%)',
                    }}
                  >
                    {stage.label}
                  </button>
                  {index < stages.length - 1 && <div className="w-1" />}
                </div>
              ))}
            </div>
            <button className="ml-4 px-4 py-2 bg-blue-600 text-white rounded text-sm font-medium hover:bg-blue-700 flex items-center gap-2">
              <span>✨</span>
              Extract &amp; Match Claims
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex" style={{ height: 'calc(100vh - 280px)' }}>
        {/* PDF Viewer */}
        <div className="flex-1 p-4 overflow-auto">
          <div className="bg-white rounded-lg shadow-lg h-full p-6">
            <div className="mb-4 flex items-center justify-between border-b border-gray-200 pb-3">
              <h2 className="text-lg font-semibold text-gray-900">Document Viewer</h2>
              <div className="flex items-center gap-2">
                <button className="p-2 hover:bg-gray-100 rounded" title="Zoom out">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
                  </svg>
                </button>
                <button className="p-2 hover:bg-gray-100 rounded" title="Zoom in">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v6m3-3H7" />
                  </svg>
                </button>
                <span className="text-sm text-gray-600">Page 1 of 5</span>
              </div>
            </div>

            {/* Mock PDF Document Content */}
            <div className="bg-white border border-gray-300 rounded p-8 shadow-inner min-h-[600px]">
              <div className="max-w-2xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">CORDIM® (Medication Name)</h1>

                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2">
                    INDICATIONS AND USAGE
                  </h2>
                  <p
                    className="text-gray-800 leading-relaxed bg-yellow-50 border-l-4 border-yellow-400 pl-4 py-2"
                    title="Annotation by Dr. Sarah Chen"
                  >
                    Cordim is indicated for the treatment of arterial hypertension in adults to lower blood pressure.
                    Lowering blood pressure reduces the risk of fatal and nonfatal cardiovascular events, primarily
                    strokes and myocardial infarctions.
                  </p>
                </div>

                <div className="mb-8">
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2">
                    DOSAGE AND ADMINISTRATION
                  </h2>
                  <p className="text-gray-800 leading-relaxed mb-4">
                    The recommended starting dose of Cordim is 5 mg once daily. Depending on the patient's response,
                    the dose may be increased to a maximum of 10 mg once daily.
                  </p>
                  <ul className="list-disc list-inside text-gray-800 space-y-2 ml-4">
                    <li>Initial dose: 5 mg once daily</li>
                    <li>Maximum dose: 10 mg once daily</li>
                    <li>Adjust dose based on patient response and tolerability</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-xl font-bold text-gray-900 mb-3 border-b-2 border-gray-300 pb-2">
                    CLINICAL PHARMACOLOGY
                  </h2>
                  <p
                    className="text-gray-800 leading-relaxed bg-green-50 border-l-4 border-green-400 pl-4 py-2"
                    title="Annotation by John Martinez - Resolved"
                  >
                    Clinical efficacy demonstrated in Phase III trials with 1,200+ patients. Cordim showed significant
                    blood pressure reduction compared to placebo (p &lt; 0.001). The antihypertensive effect was
                    sustained over 24 hours with once-daily dosing.
                  </p>
                </div>

                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded">
                  <p className="text-sm text-blue-900">
                    💡 <strong>Demo Note:</strong> Select any text above to create annotations. Highlighted sections
                    show existing annotations (yellow = open, green = resolved).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Annotations Panel */}
        <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            <button
              onClick={() => setActiveTab('annotations')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'annotations'
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annotations ({annotations.length})
            </button>
            <button
              onClick={() => setActiveTab('workitems')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'workitems'
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Work Items
            </button>
            <button
              onClick={() => setActiveTab('assistant')}
              className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
                activeTab === 'assistant'
                  ? 'border-b-2 border-blue-600 text-blue-600 bg-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              AI Assistant
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-auto p-4">
            {activeTab === 'annotations' && (
              <div className="space-y-3">
                {annotations.map((ann) => (
                  <div
                    key={ann.id}
                    className={`border rounded-lg overflow-hidden transition-all ${
                      selectedAnnotation === ann.id ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                    }`}
                  >
                    <div className="p-3 bg-gray-50">
                      <div className="flex items-start justify-between mb-2">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded ${
                            ann.status === 'open'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }`}
                        >
                          {ann.status}
                        </span>
                        {ann.linkedClaim && (
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded font-medium">
                            {ann.linkedClaim}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 italic mb-2">&quot;{ann.text.substring(0, 60)}...&quot;</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{ann.author}</span>
                        <span>Page {ann.pageNumber}</span>
                      </div>
                    </div>

                    {selectedAnnotation === ann.id ? (
                      <div className="p-3 border-t border-gray-200">
                        <div className="space-y-2 mb-3">
                          {ann.comments.map((comment) => (
                            <div key={comment.id} className="p-2 bg-blue-50 rounded text-sm">
                              <div className="font-semibold text-blue-900 text-xs">{comment.author}</div>
                              <div className="text-gray-700">{comment.text}</div>
                              <div className="text-xs text-gray-500 mt-1">
                                {comment.timestamp.toLocaleString()}
                              </div>
                            </div>
                          ))}
                        </div>

                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none mb-2"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => addComment(ann.id)}
                            className="flex-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-semibold rounded hover:bg-blue-700"
                          >
                            Add Comment
                          </button>
                          <button
                            onClick={() => toggleAnnotationStatus(ann.id)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded hover:bg-gray-200"
                          >
                            {ann.status === 'open' ? 'Resolve' : 'Reopen'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedAnnotation(ann.id)}
                        className="w-full px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 font-medium"
                      >
                        View {ann.comments.length} comment{ann.comments.length !== 1 ? 's' : ''}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'workitems' && (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-sm">No work items assigned</p>
              </div>
            )}

            {activeTab === 'assistant' && (
              <div className="text-center py-12 text-gray-500">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <p className="text-sm">AI Assistant coming soon</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
