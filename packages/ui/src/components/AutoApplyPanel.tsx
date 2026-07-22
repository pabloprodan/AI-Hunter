'use client';

import { useState } from 'react';
import type { Opportunity } from '@ai-hunter/types';
import { Card, CardHeader, CardTitle, CardDescription } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';

type ApplyResult = {
  id: string;
  title: string;
  success: boolean;
};

export function AutoApplyPanel() {
  const [candidates, setCandidates] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [applying, setApplying] = useState(false);
  const [results, setResults] = useState<ApplyResult[] | null>(null);
  const [checked, setChecked] = useState(false);

  const checkCandidates = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/auto-apply');
      const data = await res.json();
      setCandidates(data.candidates);
      setChecked(true);
    } finally {
      setLoading(false);
    }
  };

  const runAutoApply = async () => {
    setApplying(true);
    setResults(null);
    try {
      const res = await fetch('/api/auto-apply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ auto: true }),
      });
      const data = await res.json();
      setResults(data.results);
      await checkCandidates();
    } finally {
      setApplying(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Auto-Apply Agent</CardTitle>
            <CardDescription>Automatically apply to high-match opportunities.</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={checkCandidates} loading={loading} size="md">
              {loading ? 'Checking...' : 'Refresh'}
            </Button>
            <Button onClick={runAutoApply} loading={applying} size="md" disabled={candidates.length === 0}>
              {applying ? 'Applying...' : 'Auto-Apply'}
            </Button>
          </div>
        </div>
      </CardHeader>

      {results && (
        <div className="mb-4 bg-emerald-50 rounded-lg p-4 border border-emerald-200">
          <p className="text-sm font-medium text-emerald-800">
            Successfully applied to {results.length} opportunity{results.length !== 1 ? 'ies' : 'y'}
          </p>
          <ul className="mt-2 space-y-1">
            {results.map((r) => (
              <li key={r.id} className="text-sm text-emerald-700 flex items-center gap-2">
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {r.title}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!checked && !loading && !results && (
        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">
            Click Refresh to find candidates ready for auto-apply
          </p>
        </div>
      )}

      {checked && !loading && candidates.length === 0 && !results && (
        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            No candidates available for auto-apply
          </p>
        </div>
      )}

      {checked && candidates.length > 0 && !results && (
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Badge variant="info">{candidates.length} candidate{candidates.length > 1 ? 's' : ''} ready</Badge>
          </div>
          <div className="space-y-2">
            {candidates.map((opp) => (
              <div key={opp.id} className="bg-white rounded-lg border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-sm font-semibold text-gray-900">{opp.title}</h4>
                  <Badge variant={opp.matchScore > 90 ? 'success' : 'warning'}>
                    {opp.matchScore}% match
                  </Badge>
                </div>
                <p className="text-xs text-gray-500 mb-1">{opp.clientName} &middot; {opp.source}</p>
                <div className="flex gap-1.5 flex-wrap">
                  {opp.skills.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
