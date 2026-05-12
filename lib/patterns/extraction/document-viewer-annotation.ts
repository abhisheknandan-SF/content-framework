import { DocumentPattern } from '../types';

/**
 * Document Viewer with Annotation Pattern
 *
 * Based on RCM-Collections implementation - supports PDF and HTML document viewing
 * with inline annotations, highlighting, and block selection.
 *
 * Key capabilities:
 * - PDF viewing with EmbedPDF (@embedpdf/snippet)
 * - HTML document viewing with same-origin iframe
 * - Text highlighting annotations
 * - Block/region selection annotations
 * - Annotation panel with comments and status tracking
 * - Real-time overlay rendering
 * - Persistent storage (localStorage)
 */
export const documentViewerAnnotationPattern: DocumentPattern = {
  id: 'document-viewer-annotation',
  name: 'Document Viewer with Annotations',
  category: 'extraction',
  description: 'View PDF and HTML documents with inline annotations, highlighting, block selection, and comment threads',
  longDescription: `
    A comprehensive document viewing and annotation system that supports:

    **PDF Viewing:**
    - Embedded PDF viewer using @embedpdf/snippet
    - SLDS-themed UI matching Salesforce design system
    - Annotation capabilities (text highlight, squares)
    - Zoom controls and page navigation
    - Fallback to browser PDF viewer

    **HTML Viewing:**
    - Same-origin iframe rendering
    - Auto-height adjustment
    - Text selection highlighting
    - Block/region selection
    - Overlay rendering for visual feedback

    **Annotation Features:**
    - Text highlight annotations (select text)
    - Block annotations (click div/section/article)
    - Annotation cards with metadata
    - Comment threads per annotation
    - Status tracking (Pending/Resolved)
    - Link to claims/evidence
    - Anchor marking
    - Real-time sync between viewer and annotation panel

    **Storage:**
    - Persistent localStorage per document
    - Automatic restore on page load
    - Export capabilities

    **Use Cases:**
    - Regulated content review
    - Legal document markup
    - Medical/pharmaceutical content validation
    - Compliance review workflows
    - Content approval processes
  `,
  tags: ['pdf', 'html', 'viewer', 'annotation', 'highlight', 'comments', 'regulated-content'],

  inputs: [
    {
      id: 'document-file',
      name: 'Document File',
      type: 'file',
      required: true,
      description: 'PDF or HTML document to view and annotate',
      validation: {
        mimeTypes: ['application/pdf', 'text/html'],
        maxSize: 50 * 1024 * 1024, // 50MB
      },
    },
    {
      id: 'document-url',
      name: 'Document URL',
      type: 'url',
      required: false,
      description: 'Alternative: URL to document (must be same-origin for HTML)',
    },
    {
      id: 'existing-annotations',
      name: 'Existing Annotations',
      type: 'data',
      required: false,
      description: 'Pre-existing annotations to load',
    },
    {
      id: 'enable-comments',
      name: 'Enable Comments',
      type: 'data',
      required: false,
      description: 'Allow comment threads on annotations',
    },
  ],

  outputs: [
    {
      id: 'annotations',
      name: 'Annotations',
      type: 'structured',
      description: 'All annotations created on the document',
      schema: {
        annotations: [
          {
            id: 'string',
            kind: 'highlight | block',
            text: 'string (for highlights)',
            tagName: 'string (for blocks)',
            textPrefix: 'string (for blocks)',
            snippet: 'string',
            createdAt: 'number (timestamp)',
            createdBy: 'string',
            status: 'pending | resolved',
            comments: [
              {
                id: 'string',
                author: 'string',
                body: 'string',
                createdAt: 'number',
              },
            ],
            linkedClaims: ['string'],
          },
        ],
      },
    },
    {
      id: 'export-data',
      name: 'Export Data',
      type: 'json',
      description: 'Exportable annotation data for sharing or archival',
    },
  ],

  components: [
    {
      id: 'document-viewer-container',
      type: 'container',
      tag: 'div',
      props: {
        class: 'content-record-doc-layout',
      },
      description: 'Main container for document viewer and annotation panel',
    },
    {
      id: 'pdf-embed-host',
      type: 'custom',
      tag: 'div',
      props: {
        class: 'content-record-pdf-host',
      },
      description: 'Host for @embedpdf/snippet component',
    },
    {
      id: 'html-preview-iframe',
      type: 'iframe',
      tag: 'iframe',
      props: {
        sandbox: 'allow-same-origin allow-scripts',
        class: 'content-record-html-preview-frame',
      },
      description: 'Iframe for HTML document rendering',
    },
    {
      id: 'annotation-overlay-stack',
      type: 'container',
      tag: 'div',
      props: {
        class: 'content-record-html-overlay-stack',
      },
      description: 'Overlay divs positioned over HTML annotations',
    },
    {
      id: 'annotation-panel',
      type: 'panel',
      tag: 'lightning-card',
      props: {
        title: 'Annotations',
        class: 'content-record-doc-sidebar',
      },
      description: 'Right sidebar panel showing annotation cards',
    },
    {
      id: 'annotation-card',
      type: 'card',
      tag: 'div',
      props: {
        role: 'article',
        class: 'content-record-annotation-card',
      },
      description: 'Individual annotation card with expand/collapse',
    },
    {
      id: 'annotation-tools',
      type: 'toolbar',
      tag: 'lightning-button-group',
      props: {
        class: 'content-record-annotation-tools',
      },
      description: 'Toolbar with annotation mode buttons (highlight/block)',
    },
    {
      id: 'comment-composer',
      type: 'textarea',
      tag: 'lightning-textarea',
      props: {
        label: 'Add comment',
        placeholder: 'Type your comment...',
      },
      description: 'Comment input within annotation card',
    },
    {
      id: 'scoped-tabs',
      type: 'tabs',
      tag: 'div',
      props: {
        class: 'slds-tabs_scoped',
      },
      description: 'Tabs for Annotations / Work Items / Content Assistant',
    },
    {
      id: 'resize-splitter',
      type: 'splitter',
      tag: 'div',
      props: {
        role: 'separator',
        'aria-orientation': 'vertical',
        class: 'content-record-resize-splitter',
      },
      description: 'Draggable splitter for panel width adjustment',
    },
  ],

  workflow: [
    {
      id: 'init-viewer',
      name: 'Initialize Document Viewer',
      description: 'Determine document type (PDF/HTML) and initialize appropriate viewer',
      action: 'viewer-init',
      component: 'document-viewer-container',
    },
    {
      id: 'mount-pdf',
      name: 'Mount PDF Viewer',
      description: 'If PDF: dynamically import @embedpdf/snippet and mount viewer',
      action: 'pdf-mount',
      dependencies: ['init-viewer'],
      component: 'pdf-embed-host',
    },
    {
      id: 'mount-html',
      name: 'Mount HTML Viewer',
      description: 'If HTML: inject iframe with same-origin URL and annotation bridge script',
      action: 'html-mount',
      dependencies: ['init-viewer'],
      component: 'html-preview-iframe',
    },
    {
      id: 'inject-bridge',
      name: 'Inject Annotation Bridge',
      description: 'Inject IIFE script into HTML iframe for annotation capture',
      action: 'bridge-inject',
      dependencies: ['mount-html'],
    },
    {
      id: 'load-annotations',
      name: 'Load Saved Annotations',
      description: 'Retrieve annotations from localStorage and restore to document',
      action: 'annotations-load',
      dependencies: ['mount-pdf', 'inject-bridge'],
    },
    {
      id: 'enable-tools',
      name: 'Enable Annotation Tools',
      description: 'Activate highlight/block selection modes',
      action: 'tools-enable',
      dependencies: ['load-annotations'],
      component: 'annotation-tools',
    },
    {
      id: 'capture-annotation',
      name: 'Capture Annotation',
      description: 'Listen for text selection or block click events',
      action: 'annotation-capture',
      dependencies: ['enable-tools'],
    },
    {
      id: 'render-annotation',
      name: 'Render Annotation',
      description: 'Apply <mark> for highlights or outline for blocks',
      action: 'annotation-render',
      dependencies: ['capture-annotation'],
    },
    {
      id: 'update-panel',
      name: 'Update Annotation Panel',
      description: 'Add annotation card to sidebar list',
      action: 'panel-update',
      dependencies: ['render-annotation'],
      component: 'annotation-panel',
    },
    {
      id: 'sync-overlays',
      name: 'Sync Overlay Positions',
      description: 'For HTML: position yellow overlay divs over annotations',
      action: 'overlay-sync',
      dependencies: ['render-annotation'],
      component: 'annotation-overlay-stack',
    },
    {
      id: 'persist',
      name: 'Persist Annotations',
      description: 'Save annotations to localStorage',
      action: 'persist',
      dependencies: ['update-panel'],
    },
    {
      id: 'handle-comments',
      name: 'Handle Comment Threads',
      description: 'Add/edit/delete comments on annotation cards',
      action: 'comments',
      component: 'comment-composer',
    },
    {
      id: 'scroll-sync',
      name: 'Scroll Synchronization',
      description: 'Scroll document to annotation when card is clicked',
      action: 'scroll-sync',
      dependencies: ['update-panel'],
    },
  ],

  examples: [
    {
      language: 'typescript',
      description: 'HTML Annotation Bridge IIFE (injected into iframe)',
      code: `
// Injected script for capturing annotations in HTML document
(() => {
  var MODE = 'none'; // 'none' | 'highlight' | 'block'
  var H_MARK = 'rcm-html-mark';
  var C_BLOCK = 'rcm-html-block-outlined';
  var C_HOVER = 'rcm-html-block-hover';

  // Wrap selected text in <mark> tag
  function wrapFirstText(annId, text) {
    // TreeWalker to find text nodes
    var walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_TEXT,
      { acceptNode: (node) => isTextNodeVisible(node) }
    );

    var node;
    while ((node = walker.nextNode())) {
      var idx = node.nodeValue.indexOf(text);
      if (idx >= 0) {
        var range = document.createRange();
        range.setStart(node, idx);
        range.setEnd(node, idx + text.length);

        var mark = document.createElement('mark');
        mark.className = H_MARK;
        mark.setAttribute('data-rcm-ann', String(annId));
        range.surroundContents(mark);
        return;
      }
    }
  }

  // Outline a block element (div, section, etc.)
  function outlineBlock(annId, tagName, textPrefix) {
    var elements = document.getElementsByTagName(tagName);
    for (var i = 0; i < elements.length; i++) {
      var el = elements[i];
      var text = el.textContent.trim();
      if (text.indexOf(textPrefix) === 0) {
        el.classList.add(C_BLOCK);
        el.setAttribute('data-rcm-ann', String(annId));
        return;
      }
    }
  }

  // Listen for text selection (highlight mode)
  document.addEventListener('mouseup', function() {
    if (MODE !== 'highlight') return;

    var sel = window.getSelection();
    if (!sel || !sel.rangeCount) return;

    var range = sel.getRangeAt(0);
    if (range.collapsed) return;

    var text = range.toString().trim();
    if (!text) return;

    var pendingId = 'p' + Date.now();
    var mark = document.createElement('mark');
    mark.className = H_MARK;
    mark.setAttribute('data-rcm-ann', pendingId);

    try {
      range.surroundContents(mark);
      window.parent.postMessage({
        type: 'rcm-html-annotation',
        kind: 'highlight',
        text: text,
        pendingId: pendingId
      }, '*');
    } catch (e) {}
  });

  // Listen for block click (block mode)
  document.addEventListener('click', function(e) {
    if (MODE !== 'block') return;

    var target = findBlockElement(e.target);
    if (!target) return;

    e.preventDefault();
    var textPrefix = target.textContent.trim();

    window.parent.postMessage({
      type: 'rcm-html-annotation',
      kind: 'block',
      tagName: target.tagName,
      textPrefix: textPrefix,
      snippet: textPrefix.substring(0, 200)
    }, '*');
  });

  // Listen for mode changes from parent
  window.addEventListener('message', function(e) {
    if (e.source !== window.parent) return;
    var d = e.data;

    if (d.type === 'rcm-html-set-mode') {
      MODE = d.mode || 'none';
    }

    if (d.type === 'rcm-html-restore' && d.annotations) {
      d.annotations.forEach(function(ann) {
        if (ann.kind === 'highlight') {
          wrapFirstText(ann.id, ann.text);
        } else if (ann.kind === 'block') {
          outlineBlock(ann.id, ann.blockTag, ann.blockTextPrefix);
        }
      });
    }
  });
})();
      `,
    },
    {
      language: 'typescript',
      description: 'LWC Component for Document Viewer with Annotations',
      code: `
import { LightningElement, api, track } from 'lwc';

export default class DocumentViewerAnnotation extends LightningElement {
  @api documentUrl;
  @api documentType; // 'pdf' | 'html'

  @track annotations = [];
  @track selectedAnnotationId = null;
  @track annotateMode = 'none'; // 'none' | 'highlight' | 'block'
  @track annotateActive = false;

  connectedCallback() {
    this.loadAnnotations();
    this.initMessageListener();
  }

  loadAnnotations() {
    const storageKey = \`annotations-\${this.documentId}\`;
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        this.annotations = JSON.parse(saved);
        this.restoreAnnotationsToDocument();
      }
    } catch (e) {}
  }

  saveAnnotations() {
    const storageKey = \`annotations-\${this.documentId}\`;
    try {
      localStorage.setItem(storageKey, JSON.stringify(this.annotations));
    } catch (e) {}
  }

  initMessageListener() {
    window.addEventListener('message', (e) => {
      if (e.data.type === 'rcm-html-annotation') {
        this.handleNewAnnotation(e.data);
      }
      if (e.data.type === 'rcm-html-ann-activate') {
        this.focusAnnotation(e.data.id);
      }
    });
  }

  handleNewAnnotation(data) {
    const annotation = {
      id: \`ann-\${Date.now()}\`,
      kind: data.kind,
      text: data.text,
      tagName: data.tagName,
      textPrefix: data.textPrefix,
      snippet: data.snippet,
      createdAt: Date.now(),
      createdBy: 'Current User',
      status: 'pending',
      comments: []
    };

    this.annotations = [...this.annotations, annotation];
    this.saveAnnotations();

    // Resolve pending ID in iframe
    if (data.pendingId) {
      this.postToFrame({
        type: 'rcm-html-resolve-pending',
        pendingId: data.pendingId,
        id: annotation.id
      });
    }
  }

  handleAnnotateToggle() {
    this.annotateActive = !this.annotateActive;
    if (!this.annotateActive) {
      this.annotateMode = 'none';
    }
    this.postToFrame({
      type: 'rcm-html-set-mode',
      mode: this.annotateMode
    });
  }

  handleHighlightMode() {
    this.annotateActive = true;
    this.annotateMode = 'highlight';
    this.postToFrame({
      type: 'rcm-html-set-mode',
      mode: 'highlight'
    });
  }

  handleBlockMode() {
    this.annotateActive = true;
    this.annotateMode = 'block';
    this.postToFrame({
      type: 'rcm-html-set-mode',
      mode: 'block'
    });
  }

  postToFrame(data) {
    const iframe = this.template.querySelector('iframe');
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(data, window.location.origin);
    }
  }

  restoreAnnotationsToDocument() {
    const payload = this.annotations.map(ann => ({
      id: ann.id,
      kind: ann.kind,
      text: ann.text,
      blockTag: ann.tagName,
      blockTextPrefix: ann.textPrefix
    }));

    this.postToFrame({
      type: 'rcm-html-restore',
      annotations: payload
    });
  }

  handleDeleteAnnotation(event) {
    const id = event.currentTarget.dataset.id;
    this.annotations = this.annotations.filter(a => a.id !== id);
    this.saveAnnotations();
    this.restoreAnnotationsToDocument();
  }

  focusAnnotation(id) {
    this.selectedAnnotationId = id;
    // Scroll card into view
    const card = this.template.querySelector(\`[data-id="\${id}"]\`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }
}
      `,
    },
    {
      language: 'typescript',
      description: 'React Component with EmbedPDF Integration',
      code: `
import React, { useEffect, useRef, useState } from 'react';

interface Annotation {
  id: string;
  kind: 'highlight' | 'block';
  text?: string;
  snippet: string;
  createdAt: number;
}

export default function DocumentViewer({ documentUrl, documentType }: Props) {
  const pdfHostRef = useRef<HTMLDivElement>(null);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [embedPdfViewer, setEmbedPdfViewer] = useState<any>(null);

  useEffect(() => {
    if (documentType === 'pdf' && pdfHostRef.current) {
      initEmbedPdf();
    }
  }, [documentType, documentUrl]);

  async function initEmbedPdf() {
    const EmbedPDF = await import('@embedpdf/snippet');

    const viewer = EmbedPDF.default.init({
      type: 'container',
      target: pdfHostRef.current,
      src: documentUrl,
      theme: {
        preference: 'light',
        light: {
          accent: {
            primary: '#0176d3', // SLDS blue
            primaryHover: '#014486',
          }
        }
      }
    });

    setEmbedPdfViewer(viewer);

    // Set up annotation capability
    const registry = await viewer.registry;
    await registry.pluginsReady();

    const annPlugin = registry.getPlugin('annotation');
    const annCapability = annPlugin?.provides();

    if (annCapability) {
      annCapability.onStateChange((event) => {
        // Handle annotation selection changes
        console.log('Annotation state:', event);
      });
    }
  }

  return (
    <div className="document-viewer-container">
      <div className="viewer-area">
        {documentType === 'pdf' ? (
          <div ref={pdfHostRef} className="pdf-host" />
        ) : (
          <iframe src={documentUrl} className="html-preview" />
        )}
      </div>

      <div className="annotation-panel">
        <h3>Annotations ({annotations.length})</h3>
        {annotations.map((ann) => (
          <AnnotationCard
            key={ann.id}
            annotation={ann}
            onDelete={() => handleDelete(ann.id)}
          />
        ))}
      </div>
    </div>
  );
}
      `,
    },
  ],

  aiPrompt: `
Generate a complete document viewer and annotation system that:

1. **Document Viewing:**
   - Support PDF documents using @embedpdf/snippet library
   - Support HTML documents in same-origin iframe
   - Apply SLDS (Salesforce Lightning Design System) theme
   - Include zoom controls and page navigation

2. **Annotation Capture:**
   - Text highlight mode: user selects text, immediately wrapped in <mark> tag
   - Block selection mode: user clicks div/section/article, outline applied
   - Inject annotation bridge script into HTML iframe via postMessage
   - Capture annotation events and create annotation objects

3. **Annotation Storage:**
   - Store annotations in localStorage keyed by document ID
   - Schema: { id, kind, text, tagName, textPrefix, snippet, createdAt, status, comments }
   - Restore annotations on page load
   - Sync between document and annotation panel

4. **Annotation Panel:**
   - Resizable sidebar with drag splitter
   - Annotation cards with expand/collapse
   - Display: snippet, timestamp, status, comments
   - Click card to scroll document to annotation
   - Support comment threads per annotation

5. **UI Components:**
   - Use SLDS Lightning components (lightning-button, lightning-card, etc.)
   - Annotation toolbar with toggle + mode buttons
   - Scoped tabs for Annotations / Work Items / Assistant
   - Yellow overlay divs positioned over HTML annotations
   - Visual selection state on annotation cards

6. **Advanced Features:**
   - Keyboard shortcuts (toggle, expand, delete)
   - Export annotations as JSON
   - Link annotations to claims/evidence
   - Status workflow (Pending → Resolved)
   - Anchor marking for important annotations

Use LWC (Lightning Web Components) + Vite for the implementation.
Include HTML annotation bridge IIFE for iframe injection.
Follow SLDS design patterns for card, tabs, and panel layouts.
  `,
};
