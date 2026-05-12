import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="absolute top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
            <span className="text-xl font-bold text-gray-900">Content Framework</span>
          </div>
          <Link
            href="/patterns"
            className="text-gray-600 hover:text-gray-900 font-medium transition-colors"
          >
            Browse Patterns
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main>
        <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
          </div>

          {/* Hero content */}
          <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-full text-sm font-medium text-blue-700 mb-8">
              <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
              AI-Powered Document Workflows
            </div>

            <h1 className="text-6xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Build Document
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Workflows in Minutes
              </span>
            </h1>

            <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto leading-relaxed">
              Generate working prototypes for extraction, classification, and validation using AI and battle-tested design patterns.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/generate"
                className="group px-8 py-4 bg-gray-900 text-white font-semibold rounded-xl hover:bg-gray-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Start Building
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </Link>
              <Link
                href="/workflows"
                className="px-8 py-4 bg-white text-gray-900 font-semibold rounded-xl border-2 border-gray-200 hover:border-gray-300 transition-all"
              >
                View Example Workflows
              </Link>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <FeatureCard
                icon={
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-2xl">
                    ⚡
                  </div>
                }
                title="Lightning Fast"
                description="Generate prototypes in seconds, not weeks"
              />
              <FeatureCard
                icon={
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-2xl">
                    🎨
                  </div>
                }
                title="SLDS Ready"
                description="Built with Salesforce design system"
              />
              <FeatureCard
                icon={
                  <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl flex items-center justify-center text-white text-2xl">
                    🤖
                  </div>
                }
                title="AI Powered"
                description="Smart generation with Claude AI"
              />
            </div>
          </div>
        </section>

        {/* Workflow Categories */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Document Workflow Patterns</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Choose from proven patterns for common document operations
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <PatternCard name="Extraction" icon="📄" color="from-blue-500 to-blue-600" />
              <PatternCard name="Classification" icon="🏷️" color="from-green-500 to-green-600" />
              <PatternCard name="Generation" icon="✨" color="from-purple-500 to-purple-600" />
              <PatternCard name="Validation" icon="✓" color="from-orange-500 to-orange-600" />
              <PatternCard name="Verification" icon="🔍" color="from-pink-500 to-pink-600" />
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Ready to build something amazing?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Start creating document workflows that actually work
            </p>
            <Link
              href="/generate"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              Get Started Free
              <span>→</span>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-500 text-sm">
          Built with Next.js, AI SDK, and Salesforce Lightning Design System
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-gray-100 hover:border-gray-200 transition-all">
      <div className="mb-4">{icon}</div>
      <h4 className="text-lg font-semibold text-gray-900 mb-2">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
}

function PatternCard({ name, icon, color }: { name: string; icon: string; color: string }) {
  return (
    <Link
      href="/patterns"
      className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-gray-200 transition-all hover:shadow-lg transform hover:-translate-y-1"
    >
      <div className={`w-14 h-14 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="font-semibold text-gray-900 text-lg">{name}</h3>
    </Link>
  );
}
