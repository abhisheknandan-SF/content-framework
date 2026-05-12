import Link from 'next/link';
import { notFound } from 'next/navigation';
import { extractionPatterns } from '@/lib/patterns/extraction';

export default async function PatternDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const allPatterns = [...extractionPatterns];
  const pattern = allPatterns.find((p) => p.id === id);

  if (!pattern) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <Link
            href="/patterns"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-2"
          >
            ← Back to Patterns
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{pattern.name}</h1>
                <span className="px-3 py-1 text-sm font-medium bg-blue-100 text-blue-700 rounded-full">
                  {pattern.category}
                </span>
              </div>
              <p className="text-lg text-gray-600">{pattern.description}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            {pattern.longDescription && (
              <Section title="Overview">
                <div className="prose max-w-none">
                  <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                    {pattern.longDescription}
                  </div>
                </div>
              </Section>
            )}

            {/* Tags */}
            <Section title="Tags">
              <div className="flex flex-wrap gap-2">
                {pattern.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </Section>

            {/* Inputs */}
            <Section title="Inputs">
              <div className="space-y-4">
                {pattern.inputs.map((input) => (
                  <div key={input.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{input.name}</h4>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                          {input.type}
                        </span>
                        {input.required && (
                          <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                            required
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">{input.description}</p>
                    {input.validation && (
                      <div className="mt-2 text-xs text-gray-500">
                        {input.validation.mimeTypes && (
                          <div>Accepted: {input.validation.mimeTypes.join(', ')}</div>
                        )}
                        {input.validation.maxSize && (
                          <div>Max size: {(input.validation.maxSize / 1024 / 1024).toFixed(1)}MB</div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            {/* Outputs */}
            <Section title="Outputs">
              <div className="space-y-4">
                {pattern.outputs.map((output) => (
                  <div key={output.id} className="p-4 bg-white border border-gray-200 rounded-lg">
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{output.name}</h4>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded">
                        {output.type}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{output.description}</p>
                    {output.schema && (
                      <details className="mt-2">
                        <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                          View Schema
                        </summary>
                        <pre className="mt-2 p-2 bg-gray-50 rounded text-xs overflow-x-auto">
                          {JSON.stringify(output.schema, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                ))}
              </div>
            </Section>

            {/* Workflow */}
            <Section title="Workflow Steps">
              <div className="space-y-3">
                {pattern.workflow.map((step, index) => (
                  <div key={step.id} className="flex gap-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 pb-4">
                      <h4 className="font-semibold text-gray-900 mb-1">{step.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">{step.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span className="px-2 py-1 bg-gray-100 rounded">Action: {step.action}</span>
                        {step.component && (
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded">
                            Component: {step.component}
                          </span>
                        )}
                        {step.dependencies && step.dependencies.length > 0 && (
                          <span className="text-gray-500">
                            Depends on: {step.dependencies.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            {/* Code Examples */}
            <Section title="Code Examples">
              <div className="space-y-6">
                {pattern.examples.map((example, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                    <div className="bg-gray-800 text-white px-4 py-2 flex items-center justify-between">
                      <span className="text-sm font-medium">{example.description}</span>
                      <span className="px-2 py-1 bg-gray-700 rounded text-xs">{example.language}</span>
                    </div>
                    <pre className="p-4 bg-gray-50 overflow-x-auto text-xs">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                ))}
              </div>
            </Section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3 text-sm">
                <StatRow label="Pattern ID" value={pattern.id} />
                <StatRow label="Category" value={pattern.category} />
                <StatRow label="Inputs" value={pattern.inputs.length} />
                <StatRow label="Outputs" value={pattern.outputs.length} />
                <StatRow label="Components" value={pattern.components.length} />
                <StatRow label="Workflow Steps" value={pattern.workflow.length} />
                <StatRow label="Code Examples" value={pattern.examples.length} />
              </div>
            </div>

            {/* SLDS Components */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">SLDS Components</h3>
              <div className="space-y-2">
                {pattern.components.map((component) => (
                  <div key={component.id} className="text-sm">
                    <div className="font-medium text-gray-900">{component.type}</div>
                    <code className="text-xs text-blue-600">{component.tag}</code>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/patterns/${pattern.id}/simulate`}
                  className="block w-full px-4 py-2 bg-green-600 text-white text-center font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Simulate Pattern
                </Link>
                <Link
                  href={`/generate?pattern=${pattern.id}`}
                  className="block w-full px-4 py-2 bg-blue-600 text-white text-center font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Use This Pattern
                </Link>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                  Export Pattern
                </button>
                <button className="w-full px-4 py-2 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                  View AI Prompt
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">{title}</h2>
      {children}
    </div>
  );
}

function StatRow({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600">{label}:</span>
      <span className="font-semibold text-gray-900">{value}</span>
    </div>
  );
}
