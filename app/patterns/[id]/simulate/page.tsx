import Link from 'next/link';
import { notFound } from 'next/navigation';
import { extractionPatterns } from '@/lib/patterns/extraction';
import PatternSimulator from '@/components/PatternSimulator';

export async function generateStaticParams() {
  return extractionPatterns.map((pattern) => ({
    id: pattern.id,
  }));
}

export default async function SimulatePatternPage({ params }: { params: Promise<{ id: string }> }) {
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
            href={`/patterns/${pattern.id}`}
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-2"
          >
            ← Back to Pattern Details
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">Simulate: {pattern.name}</h1>
                <span className="px-3 py-1 text-sm font-medium bg-green-100 text-green-700 rounded-full">
                  Interactive Demo
                </span>
              </div>
              <p className="text-lg text-gray-600">Test this pattern with your own data</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <PatternSimulator pattern={pattern} />
      </main>
    </div>
  );
}
