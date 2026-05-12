'use client';

import { useState } from 'react';

interface PDFTextExtractionPrototypeProps {
  file: File | null;
}

export default function PDFTextExtractionPrototype({ file }: PDFTextExtractionPrototypeProps) {
  const [extractedText, setExtractedText] = useState<string>('');
  const [isExtracting, setIsExtracting] = useState(false);
  const [progress, setProgress] = useState(0);

  const extractText = async () => {
    if (!file) return;

    setIsExtracting(true);
    setProgress(0);

    // Simulate extraction progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 200);

    // Simulate text extraction
    setTimeout(() => {
      clearInterval(progressInterval);
      setProgress(100);

      const mockExtractedText = `# Extracted Text from ${file.name}

## Document Summary
This is a simulated extraction showing how the pattern would process your PDF document.

## Sample Content

### Introduction
Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.

### Main Content
Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

### Key Points
• Point 1: Important information extracted
• Point 2: Critical data identified
• Point 3: Relevant content captured

### Metadata
- Pages: 5
- Words: 1,234
- Characters: 7,890
- Language: English
- Format: PDF 1.7

### Conclusion
The extraction process successfully identified and structured the document content for further processing.`;

      setExtractedText(mockExtractedText);
      setIsExtracting(false);
    }, 2500);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4">
        <h2 className="text-xl font-bold">PDF Text Extraction Tool</h2>
        <p className="text-sm text-blue-100 mt-1">Extract and structure text content from PDF documents</p>
      </div>

      {/* Main Content */}
      <div className="p-6">
        {/* File Info */}
        {file && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{file.name}</h3>
                <p className="text-sm text-gray-600">
                  {(file.size / 1024).toFixed(2)} KB • {file.type || 'application/pdf'}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Extract Button */}
        {!extractedText && (
          <button
            onClick={extractText}
            disabled={!file || isExtracting}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors mb-6"
          >
            {isExtracting ? 'Extracting Text...' : 'Start Extraction'}
          </button>
        )}

        {/* Progress Bar */}
        {isExtracting && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Processing document</span>
              <span className="text-sm font-medium text-gray-700">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Extracted Text Display */}
        {extractedText && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Extracted Content</h3>
              <div className="flex gap-2">
                <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded hover:bg-gray-200">
                  Copy Text
                </button>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded hover:bg-gray-200">
                  Download
                </button>
                <button className="px-4 py-2 bg-blue-100 text-blue-700 text-sm font-semibold rounded hover:bg-blue-200">
                  Export JSON
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono leading-relaxed">
                {extractedText}
              </pre>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-green-700">100%</div>
                <div className="text-sm text-green-600 mt-1">Success Rate</div>
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-blue-700">1,234</div>
                <div className="text-sm text-blue-600 mt-1">Words Extracted</div>
              </div>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg text-center">
                <div className="text-2xl font-bold text-purple-700">2.3s</div>
                <div className="text-sm text-purple-600 mt-1">Processing Time</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
