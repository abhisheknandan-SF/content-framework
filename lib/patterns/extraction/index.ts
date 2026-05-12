/**
 * Extraction Patterns
 *
 * Document content extraction patterns for various use cases
 */

export { pdfTextExtractionPattern } from './pdf-text-extraction';
export { documentViewerAnnotationPattern } from './document-viewer-annotation';

// Export all extraction patterns as a registry
import { pdfTextExtractionPattern } from './pdf-text-extraction';
import { documentViewerAnnotationPattern } from './document-viewer-annotation';

export const extractionPatterns = [
  pdfTextExtractionPattern,
  documentViewerAnnotationPattern,
];
