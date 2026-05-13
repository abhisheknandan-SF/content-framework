'use client';

import { useState } from 'react';
import Link from 'next/link';

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
}

const workflows: Workflow[] = [
  {
    id: 'regulated-content-management',
    title: 'Regulated Content Management',
    description:
      'End-to-end workflow for creating, reviewing, and approving regulated content with compliance tracking and audit trails.',
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
  },
  {
    id: 'ai-assisted-document-validation',
    title: 'AI-Assisted Document Validation',
    description:
      'Automated document validation using AI to check structure, content accuracy, compliance requirements, and data consistency.',
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
  },
];

const industries = ['All Industries', 'Life Sciences', 'Legal & Finance', 'Healthcare', 'Manufacturing'];
const workflowTypes = [
  'All Types',
  'Approval & Compliance',
  'Validation & Verification',
  'Data Extraction',
  'Document Generation',
];
const statuses = ['All Statuses', 'stable', 'beta', 'experimental'];

export default function WorkflowsPage() {
  const [selectedIndustry, setSelectedIndustry] = useState('All Industries');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Statuses');

  const filteredWorkflows = workflows.filter((workflow) => {
    const matchesIndustry = selectedIndustry === 'All Industries' || workflow.industry === selectedIndustry;
    const matchesType = selectedType === 'All Types' || workflow.type === selectedType;
    const matchesStatus = selectedStatus === 'All Statuses' || workflow.status === selectedStatus;
    return matchesIndustry && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <Link href="/" className="text-sm text-blue-600 hover:text-blue-800 mb-2 inline-block">
                ← Back to Home
              </Link>
              <h1 className="text-4xl font-bold text-gray-900">Example Workflows</h1>
              <p className="text-lg text-gray-600 mt-2">
                Explore pre-built document workflows ready to customize and deploy
              </p>
            </div>
          </div>

          {/* Filters */}
          <div className="mt-6 bg-gray-50 rounded-xl p-4 border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Industry Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Industry</label>
                <select
                  value={selectedIndustry}
                  onChange={(e) => setSelectedIndustry(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  {industries.map((industry) => (
                    <option key={industry} value={industry}>
                      {industry}
                    </option>
                  ))}
                </select>
              </div>

              {/* Workflow Type Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Workflow Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  {workflowTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              {/* Release Status Filter */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Release Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Filters Summary */}
            {(selectedIndustry !== 'All Industries' ||
              selectedType !== 'All Types' ||
              selectedStatus !== 'All Statuses') && (
              <div className="mt-4 flex items-center gap-2 flex-wrap">
                <span className="text-sm text-gray-600">Active filters:</span>
                {selectedIndustry !== 'All Industries' && (
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full">
                    {selectedIndustry}
                  </span>
                )}
                {selectedType !== 'All Types' && (
                  <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded-full">
                    {selectedType}
                  </span>
                )}
                {selectedStatus !== 'All Statuses' && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                    {selectedStatus}
                  </span>
                )}
                <button
                  onClick={() => {
                    setSelectedIndustry('All Industries');
                    setSelectedType('All Types');
                    setSelectedStatus('All Statuses');
                  }}
                  className="px-3 py-1 text-sm text-gray-600 hover:text-gray-900 underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Workflows Grid */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-gray-900">{filteredWorkflows.length}</span>{' '}
            workflow{filteredWorkflows.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filteredWorkflows.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No workflows found</h3>
            <p className="text-gray-600 mb-4">Try adjusting your filters</p>
            <button
              onClick={() => {
                setSelectedIndustry('All Industries');
                setSelectedType('All Types');
                setSelectedStatus('All Statuses');
              }}
              className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkflows.map((workflow) => (
              <WorkflowCard key={workflow.id} workflow={workflow} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const statusColors = {
    stable: 'bg-green-100 text-green-700',
    beta: 'bg-blue-100 text-blue-700',
    experimental: 'bg-orange-100 text-orange-700',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group overflow-hidden">
      {/* Colored accent bar */}
      <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>

      <div className="p-6">
        {/* Header with icon and title */}
        <div className="flex items-center gap-4 mb-3">
          <div className="text-4xl">{workflow.thumbnail}</div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-1 truncate group-hover:text-blue-600 transition-colors">
              {workflow.title}
            </h3>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">{workflow.industry}</span>
              <span className="text-xs text-gray-300">•</span>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded ${statusColors[workflow.status]}`}>
                {workflow.status}
              </span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{workflow.description}</p>

        {/* Action buttons */}
        <div className="flex gap-2">
          <Link
            href={`/workflows/${workflow.id}/demo`}
            className="flex-1 px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 transition-colors text-center"
          >
            Demo
          </Link>
          <Link
            href={`/workflows/${workflow.id}`}
            className="flex-1 px-4 py-2 bg-white text-gray-900 text-sm font-semibold rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors text-center"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
