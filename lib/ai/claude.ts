import { anthropic } from '@ai-sdk/anthropic';
import { generateText, streamText } from 'ai';
import { DocumentPattern, PrototypeConfig } from '../patterns/types';

const model = anthropic('claude-sonnet-4.6');

export async function generatePrototype(config: PrototypeConfig): Promise<string> {
  const prompt = buildPrototypePrompt(config);

  const { text } = await generateText({
    model,
    prompt,
  });

  return text;
}

export async function streamPrototypeGeneration(config: PrototypeConfig) {
  const prompt = buildPrototypePrompt(config);

  return streamText({
    model,
    prompt,
  });
}

function buildPrototypePrompt(config: PrototypeConfig): string {
  return `You are a document workflow prototype generator. Create a working prototype based on the following requirements:

**Project Name:** ${config.name}
**Description:** ${config.description}

${config.userRequirements ? `**User Requirements:**\n${config.userRequirements}\n` : ''}

${config.patterns.length > 0 ? `**Selected Patterns:**\n${config.patterns.join(', ')}\n` : ''}

${config.customPrompts ? `**Custom Instructions:**\n${config.customPrompts.join('\n')}\n` : ''}

Generate a complete prototype including:

1. **Component Structure** - List of SLDS/Lightning components needed
2. **Workflow Steps** - Step-by-step process flow
3. **Data Model** - Input/output data structures
4. **Code Implementation** - Sample LWC component code
5. **Integration Points** - How components connect
6. **API Endpoints** - Required backend APIs

Format the response as structured JSON with the following schema:
{
  "components": [...],
  "workflow": [...],
  "dataModel": {...},
  "code": {...},
  "apiEndpoints": [...]
}

Focus on using Salesforce Lightning Design System (SLDS) and Lightning Web Components (LWC).`;
}

export async function analyzeDocumentSpec(documentContent: string): Promise<{
  useCase: string;
  requirements: string[];
  suggestedPatterns: string[];
}> {
  const prompt = `Analyze this document specification and extract:
1. The main use case
2. Key requirements
3. Suggested document patterns (extraction, classification, generation, validation, verification)

Document:
${documentContent}

Respond in JSON format:
{
  "useCase": "...",
  "requirements": ["...", "..."],
  "suggestedPatterns": ["...", "..."]
}`;

  const { text } = await generateText({
    model,
    prompt,
  });

  // Parse JSON from response
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    return JSON.parse(jsonMatch[0]);
  }

  throw new Error('Failed to parse document analysis');
}
