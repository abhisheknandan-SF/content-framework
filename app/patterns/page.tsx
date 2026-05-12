import Link from 'next/link';
import { extractionPatterns } from '@/lib/patterns/extraction';

export default function PatternsPage() {
  const allPatterns = [...extractionPatterns];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Design Pattern Library</h1>
              <p className="text-sm text-gray-600 mt-1">
                Document workflow patterns for extraction, classification, generation, validation, and verification
              </p>
            </div>
            <Link
              href="/"
              className="px-4 py-2 text-sm font-semibold text-gray-700 hover:text-gray-900"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats */}
        <div className="grid grid-cols-5 gap-4 mb-8">
          <StatCard title="Total Patterns" value={allPatterns.length} color="blue" />
          <StatCard title="Extraction" value="2" color="green" />
          <StatCard title="Classification" value="0" color="purple" />
          <StatCard title="Generation" value="0" color="orange" />
          <StatCard title="Validation" value="0" color="red" />
        </div>

        {/* Pattern List */}
        <div className="bg-white rounded-lg shadow-md">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Extraction Patterns</h2>
            <p className="text-sm text-gray-600 mt-1">
              Extract data from documents, forms, and content
            </p>
          </div>

          <div className="divide-y divide-gray-200">
            {allPatterns.map((pattern) => (
              <Link
                key={pattern.id}
                href={`/patterns/${pattern.id}`}
                className="block px-6 py-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {pattern.name}
                      </h3>
                      <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded">
                        {pattern.category}
                      </span>
                    </div>

                    <p className="text-gray-600 mb-3">
                      {pattern.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {pattern.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-6 text-sm text-gray-500">
                      <span>📥 {pattern.inputs.length} inputs</span>
                      <span>📤 {pattern.outputs.length} outputs</span>
                      <span>🧩 {pattern.components.length} components</span>
                      <span>📋 {pattern.workflow.length} steps</span>
                      <span>💻 {pattern.examples.length} examples</span>
                    </div>
                  </div>

                  <div className="ml-4">
                    <svg
                      className="w-6 h-6 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Coming Soon */}
        <div className="mt-8 grid md:grid-cols-4 gap-6">
          <ComingSoonCard title="Classification" count="0" />
          <ComingSoonCard title="Generation" count="0" />
          <ComingSoonCard title="Validation" count="0" />
          <ComingSoonCard title="Verification" count="0" />
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string; value: string | number; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-900',
    green: 'bg-green-50 border-green-200 text-green-900',
    purple: 'bg-purple-50 border-purple-200 text-purple-900',
    orange: 'bg-orange-50 border-orange-200 text-orange-900',
    red: 'bg-red-50 border-red-200 text-red-900',
  };

  return (
    <div className={`p-4 rounded-lg border-2 ${colorClasses[color as keyof typeof colorClasses]}`}>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm font-medium">{title}</div>
    </div>
  );
}

function ComingSoonCard({ title, count }: { title: string; count: string }) {
  return (
    <div className="p-6 bg-gray-100 rounded-lg border-2 border-gray-300 border-dashed text-center">
      <div className="text-2xl font-bold text-gray-400 mb-1">{count}</div>
      <div className="text-sm font-medium text-gray-500">{title}</div>
      <div className="text-xs text-gray-400 mt-2">Coming Soon</div>
    </div>
  );
}
