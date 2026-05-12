'use client';

import { useState, useRef } from 'react';

interface Annotation {
  id: string;
  kind: 'highlight' | 'block';
  text: string;
  snippet: string;
  createdAt: number;
  status: 'pending' | 'resolved';
  comments: { id: string; text: string; author: string; createdAt: number }[];
}

interface DocumentViewerAnnotationPrototypeProps {
  file: File | null;
}

export default function DocumentViewerAnnotationPrototype({ file }: DocumentViewerAnnotationPrototypeProps) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [activeTab, setActiveTab] = useState<'annotations' | 'info'>('annotations');
  const documentRef = useRef<HTMLDivElement>(null);

  const mockDocumentContent = `
    <div style="padding: 40px; max-width: 800px; margin: 0 auto; font-family: Georgia, serif; line-height: 1.8;">
      <h1 style="color: #1a1a1a; margin-bottom: 20px;">Product Requirements Document</h1>

      <section style="margin-bottom: 30px;">
        <h2 style="color: #333; margin-top: 30px;">1. Executive Summary</h2>
        <p>This document outlines the requirements for the new content management system. The system will enable teams to efficiently create, review, and publish content across multiple channels.</p>
      </section>

      <section style="margin-bottom: 30px;">
        <h2 style="color: #333; margin-top: 30px;">2. Key Features</h2>
        <p>The platform must support the following core capabilities:</p>
        <ul style="margin-left: 20px;">
          <li>Document upload and version control</li>
          <li>Real-time collaboration and annotations</li>
          <li>Approval workflows with multi-stakeholder review</li>
          <li>Integration with existing design systems</li>
        </ul>
      </section>

      <section style="margin-bottom: 30px;">
        <h2 style="color: #333; margin-top: 30px;">3. User Stories</h2>
        <p><strong>As a content reviewer</strong>, I want to highlight specific sections of documents and add contextual comments so that authors can understand my feedback precisely.</p>
        <p><strong>As a compliance officer</strong>, I need to mark regulatory requirements within documents and track their resolution status throughout the review process.</p>
      </section>

      <section style="margin-bottom: 30px;">
        <h2 style="color: #333; margin-top: 30px;">4. Technical Requirements</h2>
        <p>The system architecture should be built on modern web standards with support for PDF and HTML document formats. All annotations must be persisted and exportable.</p>
      </section>
    </div>
  `;

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim().length === 0) return;

    const selectedText = selection.toString();
    const newAnnotation: Annotation = {
      id: `ann-${Date.now()}`,
      kind: 'highlight',
      text: selectedText,
      snippet: selectedText.substring(0, 100),
      createdAt: Date.now(),
      status: 'pending',
      comments: [],
    };

    setAnnotations((prev) => [...prev, newAnnotation]);
    selection.removeAllRanges();
  };

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
                  id: `comment-${Date.now()}`,
                  text: newComment,
                  author: 'Current User',
                  createdAt: Date.now(),
                },
              ],
            }
          : ann
      )
    );
    setNewComment('');
  };

  const toggleStatus = (annotationId: string) => {
    setAnnotations((prev) =>
      prev.map((ann) =>
        ann.id === annotationId
          ? { ...ann, status: ann.status === 'pending' ? 'resolved' : 'pending' }
          : ann
      )
    );
  };

  const deleteAnnotation = (annotationId: string) => {
    setAnnotations((prev) => prev.filter((ann) => ann.id !== annotationId));
    if (selectedAnnotation === annotationId) {
      setSelectedAnnotation(null);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-4">
        <h2 className="text-xl font-bold">Document Viewer & Annotation Tool</h2>
        <p className="text-sm text-purple-100 mt-1">
          View documents and create annotations with comments
        </p>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700">
            {file ? file.name : 'Sample Document'}
          </span>
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
            {annotations.length} annotations
          </span>
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50">
            Zoom In
          </button>
          <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded hover:bg-gray-50">
            Zoom Out
          </button>
          <button className="px-3 py-1.5 bg-purple-600 text-white text-sm font-semibold rounded hover:bg-purple-700">
            Export Annotations
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex" style={{ height: '600px' }}>
        {/* Document Viewer */}
        <div className="flex-1 overflow-y-auto bg-gray-100 p-6">
          <div
            ref={documentRef}
            className="bg-white shadow-lg rounded"
            onMouseUp={handleTextSelection}
            dangerouslySetInnerHTML={{ __html: mockDocumentContent }}
            style={{ userSelect: 'text', cursor: 'text' }}
          />
          <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
            💡 <strong>Tip:</strong> Select any text in the document above to create a highlight
            annotation
          </div>
        </div>

        {/* Annotations Panel */}
        <div className="w-96 border-l border-gray-200 flex flex-col bg-white">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('annotations')}
              className={`flex-1 px-4 py-3 text-sm font-semibold ${
                activeTab === 'annotations'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Annotations ({annotations.length})
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 px-4 py-3 text-sm font-semibold ${
                activeTab === 'info'
                  ? 'border-b-2 border-purple-600 text-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Info
            </button>
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {activeTab === 'annotations' ? (
              <div className="space-y-3">
                {annotations.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <svg
                      className="w-16 h-16 mx-auto mb-4 text-gray-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                      />
                    </svg>
                    <p className="text-sm">No annotations yet</p>
                    <p className="text-xs mt-2">Select text to create your first annotation</p>
                  </div>
                ) : (
                  annotations.map((ann) => (
                    <div
                      key={ann.id}
                      className={`border rounded-lg overflow-hidden transition-all ${
                        selectedAnnotation === ann.id
                          ? 'border-purple-500 ring-2 ring-purple-200'
                          : 'border-gray-200'
                      }`}
                    >
                      <div className="p-3 bg-gray-50">
                        <div className="flex items-start justify-between mb-2">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded ${
                              ann.status === 'pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-green-100 text-green-700'
                            }`}
                          >
                            {ann.status}
                          </span>
                          <button
                            onClick={() => deleteAnnotation(ann.id)}
                            className="text-gray-400 hover:text-red-600"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                        <p className="text-sm text-gray-700 italic">"{ann.snippet}"</p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(ann.createdAt).toLocaleString()}
                        </p>
                      </div>

                      {selectedAnnotation === ann.id ? (
                        <div className="p-3 border-t border-gray-200">
                          <div className="space-y-2 mb-3">
                            {ann.comments.map((comment) => (
                              <div key={comment.id} className="p-2 bg-blue-50 rounded text-sm">
                                <div className="font-semibold text-blue-900">{comment.author}</div>
                                <div className="text-gray-700">{comment.text}</div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {new Date(comment.createdAt).toLocaleString()}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="space-y-2">
                            <textarea
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              placeholder="Add a comment..."
                              className="w-full px-3 py-2 border border-gray-300 rounded text-sm resize-none"
                              rows={3}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => addComment(ann.id)}
                                className="flex-1 px-3 py-1.5 bg-purple-600 text-white text-sm font-semibold rounded hover:bg-purple-700"
                              >
                                Add Comment
                              </button>
                              <button
                                onClick={() => toggleStatus(ann.id)}
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-semibold rounded hover:bg-gray-200"
                              >
                                {ann.status === 'pending' ? 'Resolve' : 'Reopen'}
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedAnnotation(ann.id)}
                          className="w-full px-3 py-2 text-sm text-purple-600 hover:bg-purple-50 font-medium"
                        >
                          {ann.comments.length > 0
                            ? `View ${ann.comments.length} comment${ann.comments.length > 1 ? 's' : ''}`
                            : 'Add comment'}
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Document Info</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">File name:</span>
                      <span className="font-medium">{file?.name || 'sample.pdf'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">PDF Document</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">
                        {file ? `${(file.size / 1024).toFixed(2)} KB` : '245 KB'}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Annotation Stats</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="p-3 bg-blue-50 rounded text-center">
                      <div className="text-xl font-bold text-blue-700">{annotations.length}</div>
                      <div className="text-xs text-blue-600">Total</div>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded text-center">
                      <div className="text-xl font-bold text-yellow-700">
                        {annotations.filter((a) => a.status === 'pending').length}
                      </div>
                      <div className="text-xs text-yellow-600">Pending</div>
                    </div>
                    <div className="p-3 bg-green-50 rounded text-center">
                      <div className="text-xl font-bold text-green-700">
                        {annotations.filter((a) => a.status === 'resolved').length}
                      </div>
                      <div className="text-xs text-green-600">Resolved</div>
                    </div>
                    <div className="p-3 bg-purple-50 rounded text-center">
                      <div className="text-xl font-bold text-purple-700">
                        {annotations.reduce((sum, a) => sum + a.comments.length, 0)}
                      </div>
                      <div className="text-xs text-purple-600">Comments</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
