import type { Opportunity, OpportunityStatus } from '@ai-hunter/types';
import { OpportunityCard } from './OpportunityCard';

interface PipelineColumnProps {
  status: OpportunityStatus;
  label: string;
  opportunities: Opportunity[];
  color: string;
  onStatusChange: (id: string, status: OpportunityStatus) => void;
  onDelete: (id: string) => void;
}

const labelColors: Record<string, string> = {
  discovered: 'bg-gray-500',
  qualified: 'bg-blue-500',
  applied: 'bg-amber-500',
  interviewing: 'bg-purple-500',
  won: 'bg-emerald-500',
  lost: 'bg-red-500',
};

export function PipelineColumn({
  status,
  label,
  opportunities,
  color,
  onStatusChange,
  onDelete,
}: PipelineColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-indigo-50', 'border-indigo-300');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-indigo-50', 'border-indigo-300');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('bg-indigo-50', 'border-indigo-300');
    const id = e.dataTransfer.getData('opportunityId');
    if (id) onStatusChange(id, status);
  };

  return (
    <div
      className="flex-1 min-w-[280px] bg-gray-50 rounded-xl border-2 border-transparent transition-colors"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-200">
        <span className={`w-2.5 h-2.5 rounded-full ${labelColors[status] ?? color}`} />
        <h3 className="font-semibold text-gray-800 text-sm">{label}</h3>
        <span className="ml-auto bg-gray-200 text-gray-600 text-xs font-medium px-2 py-0.5 rounded-full">
          {opportunities.length}
        </span>
      </div>
      <div className="p-3 space-y-3 min-h-[200px]">
        {opportunities.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">Drop opportunities here</p>
        ) : (
          opportunities.map((opp) => (
            <OpportunityCard
              key={opp.id}
              opportunity={opp}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
