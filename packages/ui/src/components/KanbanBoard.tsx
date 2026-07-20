'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Opportunity, OpportunityStatus, PipelineMetrics } from '@ai-hunter/types';
import { PipelineColumn } from './PipelineColumn';

const COLUMNS: { status: OpportunityStatus; label: string; color: string }[] = [
  { status: 'discovered', label: 'Discovered', color: '#6b7280' },
  { status: 'qualified', label: 'Qualified', color: '#3b82f6' },
  { status: 'applied', label: 'Applied', color: '#f59e0b' },
  { status: 'interviewing', label: 'Interviewing', color: '#8b5cf6' },
  { status: 'won', label: 'Won', color: '#10b981' },
  { status: 'lost', label: 'Lost', color: '#ef4444' },
];

export function KanbanBoard() {
  const [grouped, setGrouped] = useState<Record<OpportunityStatus, Opportunity[]> | null>(null);
  const [metrics, setMetrics] = useState<PipelineMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch('/api/pipeline');
      const data = await res.json();
      setGrouped(data.grouped);
      setMetrics(data.metrics);
    } catch (err) {
      console.error('Failed to fetch pipeline:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleStatusChange = async (id: string, newStatus: OpportunityStatus) => {
    await fetch(`/api/opportunities/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchData();
  };

  const handleDelete = async (id: string) => {
    await fetch(`/api/opportunities/${id}`, { method: 'DELETE' });
    fetchData();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div>
      {metrics && (
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Total</p>
            <p className="text-xl font-bold text-gray-900">{metrics.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Won</p>
            <p className="text-xl font-bold text-emerald-600">{metrics.won}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Conversion</p>
            <p className="text-xl font-bold text-gray-900">{metrics.conversionRate}%</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-xs text-gray-500 mb-1">Avg Deal</p>
            <p className="text-xl font-bold text-gray-900">${metrics.averageDealSize.toLocaleString()}</p>
          </div>
        </div>
      )}

      <div className="flex gap-4 overflow-x-auto pb-4">
        {COLUMNS.map((col) => (
          <PipelineColumn
            key={col.status}
            status={col.status}
            label={col.label}
            opportunities={grouped?.[col.status] ?? []}
            color={col.color}
            onStatusChange={handleStatusChange}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
