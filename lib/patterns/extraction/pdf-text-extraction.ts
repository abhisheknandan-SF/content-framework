import { DocumentPattern } from '../types';

export const pdfTextExtractionPattern: DocumentPattern = {
  id: 'pdf-text-extraction',
  name: 'PDF Text Extraction',
  category: 'extraction',
  description: 'Extract plain text content from PDF documents with formatting preservation',
  longDescription: `
    This pattern handles PDF document text extraction while preserving structure and formatting.
    It supports:
    - Multi-page PDFs
    - Text selection and highlighting
    - Paragraph detection
    - Table of contents generation
    - Metadata extraction (author, creation date, etc.)
  `,
  tags: ['pdf', 'text', 'extraction', 'parsing'],

  inputs: [
    {
      id: 'pdf-file',
      name: 'PDF Document',
      type: 'file',
      required: true,
      description: 'The PDF file to extract text from',
      validation: {
        mimeTypes: ['application/pdf'],
        maxSize: 10 * 1024 * 1024, // 10MB
      },
    },
    {
      id: 'preserve-formatting',
      name: 'Preserve Formatting',
      type: 'data',
      required: false,
      description: 'Whether to preserve text formatting (bold, italic, etc.)',
    },
    {
      id: 'extract-metadata',
      name: 'Extract Metadata',
      type: 'data',
      required: false,
      description: 'Include document metadata in output',
    },
  ],

  outputs: [
    {
      id: 'extracted-text',
      name: 'Extracted Text',
      type: 'text',
      description: 'Plain text extracted from the PDF',
    },
    {
      id: 'structured-content',
      name: 'Structured Content',
      type: 'structured',
      description: 'Text organized by pages and paragraphs',
      schema: {
        pages: [
          {
            pageNumber: 1,
            text: 'string',
            paragraphs: ['string'],
          },
        ],
        metadata: {
          title: 'string',
          author: 'string',
          creationDate: 'string',
          pageCount: 'number',
        },
      },
    },
  ],

  components: [
    {
      id: 'file-upload',
      type: 'file-uploader',
      tag: 'lightning-file-upload',
      props: {
        label: 'Upload PDF',
        accept: '.pdf',
        multiple: false,
      },
      description: 'SLDS file upload component for PDF selection',
    },
    {
      id: 'progress-indicator',
      type: 'progress',
      tag: 'lightning-progress-indicator',
      props: {
        type: 'base',
        currentStep: '1',
      },
      description: 'Shows extraction progress',
    },
    {
      id: 'output-display',
      type: 'textarea',
      tag: 'lightning-textarea',
      props: {
        label: 'Extracted Text',
        readonly: true,
      },
      description: 'Displays the extracted text content',
    },
    {
      id: 'metadata-card',
      type: 'card',
      tag: 'lightning-card',
      props: {
        title: 'Document Metadata',
      },
      description: 'Displays extracted document metadata',
    },
  ],

  workflow: [
    {
      id: 'upload',
      name: 'Upload PDF',
      description: 'User uploads a PDF document',
      action: 'file-upload',
      component: 'file-upload',
    },
    {
      id: 'validate',
      name: 'Validate File',
      description: 'Validate file type and size',
      action: 'validation',
      dependencies: ['upload'],
    },
    {
      id: 'extract',
      name: 'Extract Text',
      description: 'Parse PDF and extract text content',
      action: 'extraction',
      dependencies: ['validate'],
      component: 'progress-indicator',
    },
    {
      id: 'structure',
      name: 'Structure Content',
      description: 'Organize extracted text into pages and paragraphs',
      action: 'structuring',
      dependencies: ['extract'],
    },
    {
      id: 'display',
      name: 'Display Results',
      description: 'Show extracted text and metadata',
      action: 'display',
      dependencies: ['structure'],
      component: 'output-display',
    },
  ],

  examples: [
    {
      language: 'typescript',
      description: 'Basic PDF text extraction',
      code: `
import { extractPdfText } from '@/lib/document/parser';

async function handlePdfUpload(file: File) {
  try {
    const result = await extractPdfText(file, {
      preserveFormatting: true,
      extractMetadata: true,
    });

    console.log('Extracted text:', result.text);
    console.log('Page count:', result.metadata.pageCount);
    console.log('Author:', result.metadata.author);

    return result;
  } catch (error) {
    console.error('Extraction failed:', error);
  }
}
      `,
    },
    {
      language: 'javascript',
      description: 'LWC component implementation',
      code: `
// pdfExtractor.js
import { LightningElement, track } from 'lwc';
import { extractPdfText } from 'c/documentService';

export default class PdfExtractor extends LightningElement {
  @track extractedText = '';
  @track isProcessing = false;

  handleFileChange(event) {
    const file = event.target.files[0];
    this.processPdf(file);
  }

  async processPdf(file) {
    this.isProcessing = true;
    try {
      const result = await extractPdfText(file);
      this.extractedText = result.text;
    } catch (error) {
      this.showError(error.message);
    } finally {
      this.isProcessing = false;
    }
  }
}
      `,
    },
  ],

  aiPrompt: `
Generate a PDF text extraction workflow that:
1. Accepts a PDF file upload
2. Validates the file (type, size)
3. Extracts text content preserving structure
4. Parses metadata (title, author, dates)
5. Organizes content by pages and paragraphs
6. Displays results in a user-friendly format

Use SLDS Lightning components for the UI.
  `,
};
