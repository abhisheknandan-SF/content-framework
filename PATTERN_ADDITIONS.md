# Document Viewer & Annotation Pattern

## Overview

Added a comprehensive **Document Viewer with Annotations** pattern to the Content Framework design pattern library, based on analysis of the RCM-Collections repository.

## Source Analysis

**Repository:** `bmikottis/RCM-Collections`
**Technology Stack:**
- Lightning Web Components (LWC) + Vite
- @embedpdf/snippet for PDF viewing
- Salesforce Lightning Design System (SLDS)
- Same-origin iframe for HTML documents

**Key Files Analyzed:**
- `src/modules/main/contentRecordPage/contentRecordPage.js` (2,631 lines)
- `src/modules/main/contentRecordPage/htmlAnnotationBridge.js` (360 lines)

## Pattern Details

### Location
`lib/patterns/extraction/document-viewer-annotation.ts`

### Capabilities

1. **Multi-Format Document Viewing**
   - PDF viewing with embedded @embedpdf/snippet
   - HTML document rendering in same-origin iframe
   - SLDS-themed UI matching Salesforce design system
   - Zoom controls and page navigation
   - Automatic fallback to browser PDF viewer

2. **Annotation System**
   - **Text Highlighting:** Select text to create highlight annotations
   - **Block Selection:** Click div/section/article elements to create block annotations
   - Real-time annotation capture with postMessage bridge
   - Yellow overlay rendering for visual feedback
   - Persistent storage in localStorage per document

3. **Annotation Management**
   - Expandable annotation cards in sidebar panel
   - Comment threads per annotation
   - Status tracking (Pending/Resolved)
   - Link annotations to claims/evidence
   - Anchor marking for important annotations
   - Export annotations as JSON

4. **User Interface**
   - Resizable split-pane layout with drag splitter
   - SLDS Lightning components (buttons, cards, tabs)
   - Scoped tabs: Annotations / Work Items / Content Assistant
   - Scroll synchronization between document and panel
   - Visual selection state on annotation cards
   - Empty state for no annotations

### Technical Implementation

#### HTML Annotation Bridge (IIFE)
Injected script into iframe for capturing user interactions:
```javascript
- Text selection detection (mouseup event)
- Block element hover/click (click event)
- <mark> tag wrapping for highlights
- CSS class application for block outlines
- postMessage communication with parent
- Annotation restoration on load
```

#### Annotation Data Model
```typescript
{
  id: string,
  kind: 'highlight' | 'block',
  text?: string,              // for highlights
  tagName?: string,           // for blocks (DIV, SECTION, etc.)
  textPrefix?: string,        // for blocks (first N chars)
  snippet: string,
  createdAt: number,
  createdBy: string,
  status: 'pending' | 'resolved',
  comments: Comment[],
  linkedClaims: string[]
}
```

#### SLDS Components Used
- `lightning-card` - Annotation cards
- `lightning-button` - Toolbar actions
- `lightning-button-icon` - Icons and menus
- `lightning-textarea` - Comment composer
- `slds-tabs_scoped` - Scoped tabs navigation
- Custom drag splitter - Panel resizing

### Code Examples Included

1. **HTML Annotation Bridge IIFE** (TypeScript)
   - Injected script for iframe
   - Text selection wrapping
   - Block element outlining
   - postMessage event handlers

2. **LWC Component** (TypeScript)
   - Main document viewer component
   - Annotation state management
   - localStorage persistence
   - Message listener setup

3. **React Integration** (TypeScript)
   - @embedpdf/snippet integration
   - React hooks pattern
   - Annotation panel UI

### Integration with Content Framework

The pattern is now part of the extraction patterns registry:
```typescript
import { extractionPatterns } from '@/lib/patterns/extraction';

// Available patterns:
// 1. pdfTextExtractionPattern
// 2. documentViewerAnnotationPattern
```

## Use Cases

1. **Regulated Content Review**
   - Medical/pharmaceutical document validation
   - FDA submission review
   - Clinical trial documentation

2. **Legal Document Markup**
   - Contract review and redlining
   - Legal discovery and evidence marking
   - Compliance documentation

3. **Content Approval Workflows**
   - Marketing material review
   - Editorial content approval
   - Multi-stakeholder review processes

4. **Educational/Training**
   - Course material annotation
   - Student feedback on documents
   - Collaborative document study

## Dependencies

### NPM Packages
```json
{
  "@embedpdf/snippet": "^2.14.1",
  "@salesforce-ux/design-system": "^2.26.2",
  "lightning-base-components": "^1.27.2-alpha",
  "lwc": "8.10.0"
}
```

### Browser Requirements
- Modern browser with ES6 support
- ResizeObserver API
- postMessage API (same-origin)
- localStorage

## AI Generation Prompt

The pattern includes a comprehensive AI prompt template for generating complete implementations:

- Document viewing setup (PDF + HTML)
- Annotation capture logic
- Storage and restoration
- UI component structure
- Advanced features (export, linking, status)

## Files Modified/Created

1. `lib/patterns/extraction/document-viewer-annotation.ts` (NEW)
   - Complete pattern definition with 750+ lines
   - Detailed inputs/outputs schema
   - 10 workflow steps
   - 3 code examples
   - AI generation prompt

2. `lib/patterns/extraction/index.ts` (NEW)
   - Pattern registry for extraction category
   - Centralized exports

3. `rcm-collections/` (CLONED)
   - Reference implementation
   - Source for pattern analysis

## Next Steps

### Recommended Additions

1. **More Extraction Patterns:**
   - Table extraction from documents
   - Form field parsing
   - Image extraction and OCR
   - Metadata extraction

2. **Classification Patterns:**
   - Document type classification
   - Content categorization
   - Sentiment analysis

3. **Validation Patterns:**
   - Schema validation
   - Business rule validation
   - Completeness checks

4. **Integration Patterns:**
   - Export to various formats
   - Integration with CRM systems
   - Webhook notifications

### Implementation Tasks

1. Build the `/generate` page for AI-powered prototype generation
2. Create pattern browser UI at `/patterns`
3. Add pattern selection and combination UI
4. Implement live preview functionality
5. Add user authentication and project saving
6. Create pattern testing framework

## Benefits

✅ **Reusable:** Drop-in pattern for any document workflow app
✅ **Production-Ready:** Based on real-world implementation
✅ **Well-Documented:** Complete with examples and AI prompts
✅ **SLDS-Compatible:** Matches Salesforce design system
✅ **Type-Safe:** Full TypeScript definitions
✅ **Extensible:** Easy to add new annotation types
✅ **Persistent:** localStorage-based annotation storage
✅ **Real-Time:** Instant feedback and synchronization

---

**Pattern ID:** `document-viewer-annotation`
**Category:** Extraction
**Status:** ✅ Complete
**Added:** 2026-05-12
