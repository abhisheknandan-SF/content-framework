'use client';

import { useState } from 'react';
import type { DocumentPattern } from '@/lib/patterns/types';

interface PatternSimulatorProps {
  pattern: DocumentPattern;
}

type InputValues = Record<string, File | string | null>;

export default function PatternSimulator({ pattern }: PatternSimulatorProps) {
  const [inputValues, setInputValues] = useState<InputValues>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [outputs, setOutputs] = useState<Record<string, unknown>>({});
  const [showResults, setShowResults] = useState(false);

  const handleInputChange = (inputId: string, value: File | string | null) => {
    setInputValues((prev) => ({ ...prev, [inputId]: value }));
  };

  const handleFileUpload = (inputId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    handleInputChange(inputId, file);
  };

  const validateInputs = () => {
    for (const input of pattern.inputs) {
      if (input.required && !inputValues[input.id]) {
        return false;
      }
    }
    return true;
  };

  const simulateWorkflow = async () => {
    if (!validateInputs()) {
      alert('Please provide all required inputs');
      return;
    }

    setIsProcessing(true);
    setCurrentStep(0);
    setShowResults(false);

    // Simulate workflow step-by-step
    for (let i = 0; i < pattern.workflow.length; i++) {
      setCurrentStep(i);
      // Simulate processing time for each step
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Generate mock outputs based on pattern definition
    const mockOutputs: Record<string, unknown> = {};

    for (const output of pattern.outputs) {
      if (output.type === 'json') {
        mockOutputs[output.id] = {
          message: `Mock ${output.name}`,
          timestamp: new Date().toISOString(),
          schema: output.schema || {},
        };
      } else if ((output as any).type === 'text') {
        mockOutputs[output.id] = `Sample ${output.name}:\n\nThis is simulated output for demonstration purposes.`;
      } else if ((output as any).type === 'array') {
        mockOutputs[output.id] = [
          { id: 1, sample: 'First item' },
          { id: 2, sample: 'Second item' },
          { id: 3, sample: 'Third item' },
        ];
      }
    }

    setOutputs(mockOutputs);
    setIsProcessing(false);
    setShowResults(true);
  };

  const reset = () => {
    setInputValues({});
    setCurrentStep(0);
    setOutputs({});
    setShowResults(false);
    setIsProcessing(false);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8">
        {/* Left Column - Inputs & Controls */}
        <div className="space-y-6">
        {/* Inputs Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Inputs</h2>
          <div className="space-y-4">
            {pattern.inputs.map((input) => (
              <div key={input.id} className="border border-gray-200 rounded-lg p-4">
                <label className="block mb-2">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-gray-900">{input.name}</span>
                    {input.required && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-700 rounded">
                        required
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{input.description}</p>

                  {input.type === 'file' ? (
                    <input
                      type="file"
                      accept={input.validation?.mimeTypes?.join(',')}
                      onChange={(e) => handleFileUpload(input.id, e)}
                      className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                      disabled={isProcessing}
                    />
                  ) : input.type === 'text' ? (
                    <input
                      type="text"
                      value={(inputValues[input.id] as string) || ''}
                      onChange={(e) => handleInputChange(input.id, e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder={`Enter ${input.name.toLowerCase()}`}
                      disabled={isProcessing}
                    />
                  ) : null}

                  {inputValues[input.id] && (
                    <p className="mt-2 text-xs text-green-600">
                      ✓{' '}
                      {input.type === 'file'
                        ? (inputValues[input.id] as File).name
                        : 'Value provided'}
                    </p>
                  )}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Control Buttons */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Actions</h2>
          <div className="space-y-3">
            <button
              onClick={simulateWorkflow}
              disabled={isProcessing || !validateInputs()}
              className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {isProcessing ? 'Processing...' : 'Run Simulation'}
            </button>
            <button
              onClick={reset}
              disabled={isProcessing}
              className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-semibold rounded-lg hover:bg-gray-200 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Right Column - Workflow Progress & Results */}
      <div className="space-y-6">
        {/* Workflow Progress */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Workflow Progress</h2>
          <div className="space-y-3">
            {pattern.workflow.map((step, index) => {
              const isActive = isProcessing && index === currentStep;
              const isCompleted = isProcessing ? index < currentStep : showResults;
              const isPending = isProcessing ? index > currentStep : !showResults;

              return (
                <div
                  key={step.id}
                  className={`flex gap-4 p-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 border-2 border-blue-500'
                      : isCompleted
                      ? 'bg-green-50 border border-green-200'
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      isActive
                        ? 'bg-blue-500 text-white'
                        : isCompleted
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                    }`}
                  >
                    {isCompleted ? '✓' : index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">{step.name}</h4>
                    <p className="text-xs text-gray-600">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Results Section */}
        {showResults && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Results</h2>
            <div className="space-y-4">
              {pattern.outputs.map((output) => (
                <div key={output.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-900">{output.name}</h4>
                    <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded">
                      {output.type}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{output.description}</p>
                  <div className="bg-gray-50 rounded p-3 overflow-x-auto">
                    <pre className="text-xs text-gray-800">
                      {typeof outputs[output.id] === 'object'
                        ? JSON.stringify(outputs[output.id], null, 2)
                        : String(outputs[output.id])}
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This is a simulated demonstration. In a real implementation,
                the pattern would process your actual data through the workflow steps.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
