# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Content Framework** is a Next.js application that generates working prototypes of document use cases using AI and a design pattern library. Users can describe their document workflows (extraction, classification, generation, validation, verification) and get functional prototypes built from reusable SLDS-based components.

## Architecture

### Hybrid Tech Stack

1. **Next.js App Router** - Main application framework
   - AI-powered prototype generation
   - Document upload and processing
   - API routes for backend logic
   
2. **SLDS (Salesforce Lightning Design System)** - UI components
   - Located in `slds-kit/` directory
   - LWC (Lightning Web Components) with Vite
   - Embedded in Next.js via iframes or Web Components

3. **Design Pattern Library** - Document workflow patterns
   - Extraction patterns
   - Classification patterns
   - Generation patterns
   - Validation/Verification patterns
   - Located in `lib/patterns/`

### Directory Structure

```
content-framework/
├── app/                          # Next.js App Router
│   ├── (routes)/                 # Page routes
│   │   ├── page.tsx             # Home - describe use case
│   │   ├── upload/              # Upload requirement specs
│   │   ├── generate/            # AI prototype generator
│   │   ├── preview/             # Live prototype preview
│   │   └── patterns/            # Pattern library browser
│   ├── api/                     # API routes
│   │   ├── generate/            # AI prototype generation
│   │   ├── extract/             # Document extraction
│   │   └── validate/            # Pattern validation
│   ├── layout.tsx
│   └── globals.css
│
├── lib/                         # Shared libraries
│   ├── patterns/                # Design Pattern Library
│   │   ├── extraction/
│   │   ├── classification/
│   │   ├── generation/
│   │   ├── validation/
│   │   └── verification/
│   ├── ai/                      # AI SDK integrations
│   │   ├── claude.ts           # Anthropic Claude
│   │   └── prompts.ts          # System prompts
│   ├── document/               # Document processing
│   │   ├── parser.ts           # PDF/DOCX parsing
│   │   └── extractor.ts        # Content extraction
│   └── slds/                   # SLDS integration helpers
│       └── bridge.ts           # Next.js <-> LWC bridge
│
├── components/                  # React components
│   ├── PrototypeBuilder.tsx    # Drag-drop prototype builder
│   ├── PatternSelector.tsx     # Pattern selection UI
│   ├── DocumentUploader.tsx    # File upload with preview
│   ├── AIPromptEditor.tsx      # Manual prompt editing
│   └── PreviewFrame.tsx        # Prototype preview container
│
├── slds-kit/                    # SLDS starter kit (submodule)
│   ├── src/modules/
│   │   ├── ui/                 # Reusable SLDS components
│   │   └── page/               # SLDS page templates
│   └── (LWC + Vite config)
│
└── public/
    └── patterns/               # Pattern documentation

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Opens at http://localhost:3000

# Build for production
npm run build

# Run SLDS kit separately (for component development)
cd slds-kit && npm install && npm run dev
# Opens at http://localhost:3000 (different port if conflict)
```

## Key Technologies

- **Next.js 15+** with App Router and Turbopack
- **Vercel AI SDK** with Anthropic Claude integration
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **SLDS/LWC** for Salesforce-compatible components
- **pdfjs-dist** for PDF parsing
- **mammoth** for DOCX parsing

## Design Pattern Library

Patterns are defined in `lib/patterns/` with the following structure:

- Each pattern is a TypeScript module exporting a `DocumentPattern` object
- Patterns include: inputs, outputs, SLDS components, workflow steps, and code examples
- Patterns are categorized into 5 types: extraction, classification, generation, validation, verification

### Adding a New Pattern

1. Create a new file in the appropriate category folder (e.g., `lib/patterns/extraction/my-pattern.ts`)
2. Define the pattern following the `DocumentPattern` interface
3. Export the pattern object
4. Register it in the pattern registry (to be created)

## AI Integration

The AI integration uses Anthropic's Claude Sonnet 4.6 via the Vercel AI SDK:

- `lib/ai/claude.ts` - Main AI service
- Streaming support for realtime prototype generation
- Document spec analysis for requirement extraction
- Pattern-based prompt construction

## SLDS Integration

The SLDS kit is in the `slds-kit/` directory as a Lightning Web Components + Vite project.

Integration approaches:
1. **Web Components** - Export LWC as standard Web Components for use in Next.js
2. **iFrame Embed** - Run SLDS kit separately and embed via iframe
3. **Code Generation** - AI generates LWC code that can be copy-pasted into SLDS kit

## Workflow

1. User uploads requirement spec document or describes use case manually
2. AI analyzes requirements and suggests relevant patterns
3. User selects patterns and adds custom prompts
4. AI generates complete prototype with:
   - Component structure
   - Workflow steps
   - Data models
   - LWC code
   - API endpoints
5. Preview generated prototype
6. Iterate and refine
