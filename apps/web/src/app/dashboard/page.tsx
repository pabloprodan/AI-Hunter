'use client';

import { useState, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { KanbanBoard, ScoutPanel } from '@ai-hunter/ui';

export default function DashboardPage() {
  const { user, isLoaded } = useUser();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="min-h-screen bg-gray-50" suppressHydrationWarning>
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-bold text-lg text-gray-900">AI HUNTER</span>
        </div>
        <nav className="space-y-1">
          {['Dashboard', 'Opportunities', 'Pipeline', 'Analytics', 'Settings'].map((item) => (
            <a
              key={item}
              href="#"
              className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                item === 'Dashboard'
                  ? 'bg-indigo-50 text-indigo-700'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {item}
            </a>
          ))}
        </nav>
        {mounted && isLoaded && user && (
          <div className="absolute bottom-6 left-6 right-6 pt-4 border-t border-gray-200">
            <p className="text-sm font-medium text-gray-900 truncate">{user.fullName || user.emailAddresses?.[0]?.emailAddress || 'User'}</p>
            <p className="text-xs text-gray-500 truncate">{user.primaryEmailAddress?.emailAddress}</p>
          </div>
        )}
      </aside>

      <main className="ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Pipeline</h1>
          <p className="text-gray-500 mt-1">
            {mounted && isLoaded && user?.firstName
              ? `Welcome back, ${user.firstName}. Drag opportunities between columns to update their status.`
              : 'Drag opportunities between columns to update their status.'}
          </p>
        </header>

        <KanbanBoard />

        <div className="mt-8">
          <ScoutPanel />
        </div>
      </main>
    </div>
  );
}
