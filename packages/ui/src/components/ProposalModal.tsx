'use client';

import { useState } from 'react';
import type { Opportunity } from '@ai-hunter/types';

interface ProposalResult {
  id: string;
  subject: string;
  body: string;
  opportunityId: string;
  createdAt: string;
}

interface ProposalModalProps {
  opportunity: Opportunity;
  onClose: () => void;
}

export function ProposalModal({ opportunity, onClose }: ProposalModalProps) {
  const [loading, setLoading] = useState(false);
  const [proposal, setProposal] = useState<ProposalResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          opportunityId: opportunity.id,
          opportunity: {
            title: opportunity.title,
            description: opportunity.description,
            clientName: opportunity.clientName,
          },
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error ?? 'Failed to generate proposal');
      }
      const data = await res.json();
      setProposal(data.proposal);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!proposal) return;
    const text = `Subject: ${proposal.subject}\n\n${proposal.body}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl mx-4 max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900 truncate">
            {opportunity.title}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {!proposal && !loading && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <p className="text-sm text-gray-500 mb-4">
                Generate a tailored proposal for this opportunity.
              </p>
              <button
                onClick={generate}
                className="inline-flex items-center px-5 py-2.5 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Generate Proposal
              </button>
            </div>
          )}

          {loading && (
            <div className="space-y-3 py-8">
              <div className="animate-pulse bg-gray-100 rounded-lg h-5 w-3/4" />
              <div className="animate-pulse bg-gray-100 rounded-lg h-4 w-1/2" />
              <div className="animate-pulse bg-gray-100 rounded-lg h-20 w-full" />
              <div className="animate-pulse bg-gray-100 rounded-lg h-4 w-2/3" />
              <div className="animate-pulse bg-gray-100 rounded-lg h-4 w-3/4" />
            </div>
          )}

          {proposal && !loading && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Subject
                </label>
                <p className="text-sm font-medium text-gray-900 bg-gray-50 rounded-lg border border-gray-200 p-3">
                  {proposal.subject}
                </p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
                  Body
                </label>
                <div className="text-sm text-gray-700 bg-gray-50 rounded-lg border border-gray-200 p-3 whitespace-pre-wrap leading-relaxed">
                  {proposal.body}
                </div>
              </div>
            </div>
          )}
        </div>

        {proposal && !loading && (
          <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              {copied ? (
                <>
                  <svg className="w-4 h-4 mr-1.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  Copy to Clipboard
                </>
              )}
            </button>
            <button
              onClick={onClose}
              className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        )}

        {!proposal && !loading && (
          <div className="flex justify-end px-6 py-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium rounded-lg bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
