import type { Opportunity } from '@ai-hunter/types';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onDelete: (id: string) => void;
}

const sourceIcons: Record<string, string> = {
  Upwork: 'U',
  LinkedIn: 'in',
  Fiverr: 'F',
  Toptal: 'T',
};

const sourceColors: Record<string, string> = {
  Upwork: 'bg-green-600',
  LinkedIn: 'bg-blue-600',
  Fiverr: 'bg-green-500',
  Toptal: 'bg-indigo-600',
};

export function OpportunityCard({ opportunity, onDelete }: OpportunityCardProps) {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('opportunityId', opportunity.id);
    e.currentTarget.classList.add('opacity-50');
  };

  const handleDragEnd = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('opacity-50');
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md hover:border-gray-300 transition-all cursor-grab active:cursor-grabbing"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-gray-900 leading-snug">{opportunity.title}</h4>
        <button
          onClick={() => onDelete(opportunity.id)}
          className="text-gray-300 hover:text-red-500 transition-colors ml-2 shrink-0"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <p className="text-xs text-gray-500 mb-3 line-clamp-2">{opportunity.description}</p>

      <div className="flex items-center gap-2 mb-3 flex-wrap">
        {opportunity.skills.slice(0, 3).map((skill) => (
          <span key={skill} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">
            {skill}
          </span>
        ))}
        {opportunity.skills.length > 3 && (
          <span className="text-xs text-gray-400">+{opportunity.skills.length - 3}</span>
        )}
      </div>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5">
          <span className={`w-4 h-4 rounded text-white text-[10px] font-bold flex items-center justify-center ${sourceColors[opportunity.source] ?? 'bg-gray-500'}`}>
            {sourceIcons[opportunity.source] ?? '?'}
          </span>
          <span className="text-gray-500">{opportunity.clientName ?? opportunity.source}</span>
        </div>
        <div className="flex items-center gap-2">
          {opportunity.budget && (
            <span className="font-medium text-gray-700">
              ${opportunity.budget >= 1000 ? `${(opportunity.budget / 1000).toFixed(0)}k` : opportunity.budget}
            </span>
          )}
          <span className={`font-semibold ${opportunity.matchScore >= 90 ? 'text-emerald-600' : opportunity.matchScore >= 80 ? 'text-amber-600' : 'text-gray-500'}`}>
            {opportunity.matchScore}%
          </span>
        </div>
      </div>
    </div>
  );
}
