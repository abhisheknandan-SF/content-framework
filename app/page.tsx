import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-gray-900">Content Framework</h1>
          <p className="text-sm text-gray-600 mt-1">
            AI-powered document workflow prototype generator
          </p>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Build Document Workflows in Minutes
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Generate working prototypes for document extraction, classification, generation,
            validation, and verification using AI and our design pattern library.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/generate"
              className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Building
            </Link>
            <Link
              href="/patterns"
              className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg border-2 border-blue-600 hover:bg-blue-50 transition-colors"
            >
              Browse Patterns
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon="📄"
            title="Upload Requirements"
            description="Upload your requirement specification document or describe your use case"
          />
          <FeatureCard
            icon="🤖"
            title="AI Generation"
            description="AI analyzes your needs and generates a working prototype with SLDS components"
          />
          <FeatureCard
            icon="🎨"
            title="Design Patterns"
            description="Built on proven design patterns for document extraction, validation, and more"
          />
        </div>

        {/* Pattern Categories */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Document Workflow Patterns
          </h3>
          <div className="grid md:grid-cols-5 gap-6">
            <PatternCategory
              name="Extraction"
              description="Extract data from PDFs, forms, and documents"
              href="/patterns/extraction"
              color="blue"
            />
            <PatternCategory
              name="Classification"
              description="Classify and categorize documents automatically"
              href="/patterns/classification"
              color="green"
            />
            <PatternCategory
              name="Generation"
              description="Generate documents from templates and data"
              href="/patterns/generation"
              color="purple"
            />
            <PatternCategory
              name="Validation"
              description="Validate document structure and content"
              href="/patterns/validation"
              color="orange"
            />
            <PatternCategory
              name="Verification"
              description="Verify authenticity and compliance"
              href="/patterns/verification"
              color="red"
            />
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            How It Works
          </h3>
          <div className="grid md:grid-cols-4 gap-6">
            <Step number={1} title="Describe" description="Upload a spec doc or describe your document workflow needs" />
            <Step number={2} title="Customize" description="Select patterns and add custom prompts" />
            <Step number={3} title="Generate" description="AI creates a working prototype with SLDS components" />
            <Step number={4} title="Preview" description="Test and iterate on your prototype" />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center text-gray-600 text-sm">
          <p>Built with Next.js, Vercel AI SDK, and Salesforce Lightning Design System</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className="text-4xl mb-4">{icon}</div>
      <h4 className="text-xl font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

function PatternCategory({ name, description, href, color }: { name: string; description: string; href: string; color: string }) {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 hover:bg-blue-100',
    green: 'bg-green-50 border-green-200 hover:bg-green-100',
    purple: 'bg-purple-50 border-purple-200 hover:bg-purple-100',
    orange: 'bg-orange-50 border-orange-200 hover:bg-orange-100',
    red: 'bg-red-50 border-red-200 hover:bg-red-100',
  };

  return (
    <Link href={href} className={`p-4 rounded-lg border-2 transition-colors ${colorClasses[color as keyof typeof colorClasses]}`}>
      <h5 className="font-semibold text-gray-900 mb-2">{name}</h5>
      <p className="text-sm text-gray-600">{description}</p>
    </Link>
  );
}

function Step({ number, title, description }: { number: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-4">
        {number}
      </div>
      <h5 className="font-semibold text-gray-900 mb-2">{title}</h5>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}
