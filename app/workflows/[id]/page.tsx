import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  return [
    { id: 'regulated-content-management' },
    { id: 'ai-assisted-document-validation' },
  ];
}

interface Workflow {
  id: string;
  title: string;
  description: string;
  industry: string;
  type: string;
  status: 'beta' | 'stable' | 'experimental';
  patterns: string[];
  useCases: string[];
  thumbnail: string;
  longDescription: string;
  benefits: string[];
  technicalDetails: {
    components: string[];
    dataModels: string[];
    integrations: string[];
  };
}

const workflows: Record<string, Workflow> = {
  'regulated-content-management': {
    id: 'regulated-content-management',
    title: 'Regulated Content Management',
    description:
      'End-to-end workflow for creating, reviewing, and approving regulated content with compliance tracking and audit trails.',
    longDescription:
      'A comprehensive workflow designed for highly regulated industries that need to maintain strict control over content creation, review, and approval processes. This workflow implements a multi-stakeholder review system with role-based permissions, version control, annotation capabilities, and complete audit trails for regulatory compliance.',
    industry: 'Life Sciences',
    type: 'Approval & Compliance',
    status: 'stable',
    patterns: ['document-annotation', 'approval-workflow', 'audit-logging'],
    useCases: [
      'Medical device documentation',
      'Pharmaceutical labeling',
      'Clinical trial materials',
      'Regulatory submissions',
    ],
    thumbnail: '📋',
    benefits: [
      'Maintain complete audit trails for regulatory compliance',
      'Role-based access control for multi-stakeholder review',
      'Real-time collaboration with annotation and comments',
      'Automated approval routing and notifications',
      'Version control with change tracking',
      'Export-ready compliance reports',
    ],
    technicalDetails: {
      components: [
        'Document Viewer with Annotation',
        'Approval Workflow Engine',
        'Audit Log Dashboard',
        'User Role Management',
        'Version Control System',
      ],
      dataModels: ['Document', 'Annotation', 'ApprovalRequest', 'AuditLog', 'User', 'Role'],
      integrations: ['SLDS Components', 'Salesforce CRM', 'External Document Storage', 'Email Notifications'],
    },
  },
  'ai-assisted-document-validation': {
    id: 'ai-assisted-document-validation',
    title: 'AI-Assisted Document Validation',
    description:
      'Automated document validation using AI to check structure, content accuracy, compliance requirements, and data consistency.',
    longDescription:
      'An intelligent validation workflow that leverages AI to automatically verify document structure, check content accuracy against defined rules, ensure compliance with regulatory requirements, and identify data inconsistencies. The system provides detailed validation reports with suggested corrections and confidence scores.',
    industry: 'Legal & Finance',
    type: 'Validation & Verification',
    status: 'beta',
    patterns: ['ai-validation', 'schema-checking', 'compliance-rules'],
    useCases: [
      'Contract validation',
      'Financial report verification',
      'Legal document review',
      'Policy compliance checks',
    ],
    thumbnail: '🤖',
    benefits: [
      'Reduce manual review time by 70%',
      'Catch errors and inconsistencies automatically',
      'Ensure compliance with regulatory standards',
      'AI-powered suggestions for corrections',
      'Confidence scores for validation results',
      'Customizable validation rules and schemas',
    ],
    technicalDetails: {
      components: [
        'AI Validation Engine',
        'Schema Validator',
        'Compliance Rules Engine',
        'Validation Report Generator',
        'Error Highlighting UI',
      ],
      dataModels: ['Document', 'ValidationRule', 'ValidationResult', 'ComplianceRequirement', 'ErrorReport'],
      integrations: [
        'Claude AI API',
        'Custom Rule Engine',
        'Document Parser',
        'SLDS Components',
        'Notification Service',
      ],
    },
  },
};

export default async function WorkflowDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const workflow = workflows[id];

  if (!workflow) {
    notFound();
  }

  const statusColors = {
    stable: 'bg-green-100 text-green-700',
    beta: 'bg-blue-100 text-blue-700',
    experimental: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <Link href="/workflows" className="text-sm text-blue-600 hover:text-blue-800 mb-3 inline-block">
            ← Back to Workflows
          </Link>
          <div className="flex items-start gap-6">
            <div className="text-6xl">{workflow.thumbnail}</div>
            <div className="flex-1">
              <div className="flex items-start justify-between mb-3">
                <h1 className="text-4xl font-bold text-gray-900">{workflow.title}</h1>
                <span className={`px-4 py-2 text-sm font-semibold rounded-full ${statusColors[workflow.status]}`}>
                  {workflow.status}
                </span>
              </div>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded">
                  {workflow.industry}
                </span>
                <span className="px-3 py-1 bg-gray-100 text-gray-700 text-sm font-medium rounded">
                  {workflow.type}
                </span>
              </div>
              <p className="text-lg text-gray-700 leading-relaxed">{workflow.description}</p>
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
            <Section title="Overview">
              <p className="text-gray-700 leading-relaxed">{workflow.longDescription}</p>
            </Section>

            {/* Benefits */}
            <Section title="Key Benefits">
              <ul className="space-y-3">
                {workflow.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                      <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </Section>

            {/* Use Cases */}
            <Section title="Use Cases">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {workflow.useCases.map((useCase, index) => (
                  <div key={index} className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-gray-900 font-medium">{useCase}</p>
                  </div>
                ))}
              </div>
            </Section>

            {/* Technical Details */}
            <Section title="Technical Details">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Components</h4>
                  <div className="flex flex-wrap gap-2">
                    {workflow.technicalDetails.components.map((component) => (
                      <span
                        key={component}
                        className="px-3 py-1.5 bg-purple-50 text-purple-700 text-sm font-medium rounded-lg border border-purple-200"
                      >
                        {component}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Data Models</h4>
                  <div className="flex flex-wrap gap-2">
                    {workflow.technicalDetails.dataModels.map((model) => (
                      <span
                        key={model}
                        className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg"
                      >
                        {model}
                      </span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Integrations</h4>
                  <div className="flex flex-wrap gap-2">
                    {workflow.technicalDetails.integrations.map((integration) => (
                      <span
                        key={integration}
                        className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-lg border border-blue-200"
                      >
                        {integration}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Section>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Quick Info</h3>
              <div className="space-y-3 text-sm">
                <InfoRow label="Industry" value={workflow.industry} />
                <InfoRow label="Type" value={workflow.type} />
                <InfoRow label="Status" value={workflow.status} />
                <InfoRow label="Patterns" value={workflow.patterns.length.toString()} />
                <InfoRow label="Use Cases" value={workflow.useCases.length.toString()} />
              </div>
            </div>

            {/* Patterns Used */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Design Patterns</h3>
              <div className="space-y-2">
                {workflow.patterns.map((pattern) => (
                  <div key={pattern} className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">{pattern}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-4">Actions</h3>
              <div className="space-y-3">
                <Link
                  href={`/generate?workflow=${workflow.id}`}
                  className="block w-full px-4 py-3 bg-gray-900 text-white text-center font-semibold rounded-lg hover:bg-gray-800 transition-colors"
                >
                  Build This Workflow
                </Link>
                <button className="w-full px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors">
                  Try Interactive Demo
                </button>
                <button className="w-full px-4 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 transition-colors">
                  Download Spec
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600 font-medium">{label}:</span>
      <span className="text-gray-900 font-semibold">{value}</span>
    </div>
  );
}
