'use client';

import { useState } from 'react';
import type { Opportunity } from '@ai-hunter/types';
import { Card, CardHeader, CardTitle, CardDescription } from './Card';
import { Badge } from './Badge';
import { Button } from './Button';

const sourceColors: Record<string, string> = {
  Upwork: 'bg-green-600',
  LinkedIn: 'bg-blue-600',
  Fiverr: 'bg-green-500',
  Toptal: 'bg-indigo-600',
};

export function ScoutPanel() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());
  const [scoutRun, setScoutRun] = useState(false);

  const runScout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/scout', { method: 'POST' });
      const data = await res.json();
      setOpportunities(data.opportunities);
      setScoutRun(true);
    } finally {
      setLoading(false);
    }
  };

  const addToPipeline = async (opp: Opportunity) => {
    const res = await fetch('/api/opportunities', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(opp),
    });
    if (res.ok) {
      setAdded((prev) => new Set(prev).add(opp.id));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>AI Scout</CardTitle>
            <CardDescription>Automatically discover new freelance opportunities matching your profile.</CardDescription>
          </div>
          <Button onClick={runScout} loading={loading} size="lg">
            {loading ? 'Scouting...' : 'Run AI Scout'}
          </Button>
        </div>
      </CardHeader>

      {!scoutRun && !loading && (
        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 text-center">
          <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <p className="text-sm text-gray-500">
            Run the AI Scout to discover new opportunities
          </p>
        </div>
      )}

      {loading && (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
              <div className="h-3 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="flex gap-2 mb-3">
                <div className="h-5 bg-gray-200 rounded w-14" />
                <div className="h-5 bg-gray-200 rounded w-16" />
                <div className="h-5 bg-gray-200 rounded w-12" />
              </div>
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-20" />
                <div className="h-4 bg-gray-200 rounded w-16" />
              </div>
            </div>
          ))}
        </div>
      )}

      {scoutRun && !loading && opportunities.length === 0 && (
        <div className="bg-gray-50 rounded-lg p-8 border border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            No opportunities found. Try again later.
          </p>
        </div>
      )}

      {opportunities.length > 0 && (
        <div className="space-y-3">
          {opportunities.map((opp) => {
            const isAdded = added.has(opp.id);
            return (
              <div key={opp.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <h4 className="text-sm font-semibold text-gray-900 truncate">{opp.title}</h4>
                    <Badge variant={opp.matchScore > 90 ? 'success' : opp.matchScore > 80 ? 'warning' : 'default'}>
                      {opp.matchScore}% match
                    </Badge>
                  </div>
                  {isAdded ? (
                    <span className="shrink-0 ml-2 text-emerald-600">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </span>
                  ) : (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => addToPipeline(opp)}
                      className="shrink-0 ml-2"
                    >
                      Add to Pipeline
                    </Button>
                  )}
                </div>

                <p className="text-xs text-gray-500 mb-2 line-clamp-1">{opp.description}</p>

                <div className="flex items-center gap-2 mb-2">
                  <span className={`w-4 h-4 rounded text-white text-[10px] font-bold flex items-center justify-center ${sourceColors[opp.source] ?? 'bg-gray-500'}`}>
                    {opp.source[0]}
                  </span>
                  <span className="text-xs font-medium text-gray-600">{opp.source}</span>
                  <span className="text-xs text-gray-300">|</span>
                  <span className="text-xs font-medium text-gray-700">
                    {opp.budget && opp.budget >= 1000
                      ? `$${(opp.budget / 1000).toFixed(0)}k`
                      : `$${opp.budget}/hr`}
                  </span>
                </div>

                <div className="flex gap-1.5 flex-wrap">
                  {opp.skills.map((skill) => (
                    <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
