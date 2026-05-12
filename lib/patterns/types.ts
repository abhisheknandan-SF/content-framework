/**
 * Design Pattern Types for Content Framework
 */

export type PatternCategory =
  | 'extraction'
  | 'classification'
  | 'generation'
  | 'validation'
  | 'verification';

export interface PatternInput {
  id: string;
  name: string;
  type: 'file' | 'text' | 'url' | 'data';
  required: boolean;
  description: string;
  validation?: {
    mimeTypes?: string[];
    maxSize?: number;
    format?: string;
  };
}

export interface PatternOutput {
  id: string;
  name: string;
  type: 'json' | 'text' | 'file' | 'structured';
  description: string;
  schema?: Record<string, any>;
}

export interface SLDSComponent {
  id: string;
  type: string; // e.g., 'lightning-input', 'lightning-button', 'lightning-datatable'
  tag: string; // LWC tag name
  props: Record<string, any>;
  description: string;
}

export interface WorkflowStep {
  id: string;
  name: string;
  description: string;
  action: string;
  component?: string;
  dependencies?: string[];
}

export interface CodeExample {
  language: string;
  code: string;
  description: string;
}

export interface DocumentPattern {
  id: string;
  name: string;
  category: PatternCategory;
  description: string;
  longDescription?: string;
  tags: string[];
  inputs: PatternInput[];
  outputs: PatternOutput[];
  components: SLDSComponent[];
  workflow: WorkflowStep[];
  examples: CodeExample[];
  aiPrompt?: string; // Optional: AI prompt template for generating this pattern
}

export interface PrototypeConfig {
  name: string;
  description: string;
  patterns: string[]; // Pattern IDs
  customPrompts?: string[];
  userRequirements?: string;
  documentSpec?: File | string;
}
