export default function DashboardPage() {
  const stats = [
    { label: 'Active Opportunities', value: '12', change: '+3', trend: 'up' },
    { label: 'Proposals Sent', value: '24', change: '+8', trend: 'up' },
    { label: 'Win Rate', value: '67%', change: '+5%', trend: 'up' },
    { label: 'Revenue (MTD)', value: '$8,450', change: '+$2,100', trend: 'up' },
  ];

  const opportunities = [
    { title: 'Senior React Developer', source: 'Upwork', budget: '$5k-$8k', match: '95%', status: 'interviewing' },
    { title: 'Full Stack Freelancer', source: 'LinkedIn', budget: '$80-100/hr', match: '92%', status: 'applied' },
    { title: 'Next.js E-commerce Build', source: 'Fiverr', budget: '$3k fixed', match: '88%', status: 'discovered' },
    { title: 'AI Chatbot Integration', source: 'Toptal', budget: '$12k-$15k', match: '85%', status: 'qualified' },
  ];

  const statusColors: Record<string, string> = {
    interviewing: 'bg-blue-50 text-blue-700',
    applied: 'bg-amber-50 text-amber-700',
    discovered: 'bg-gray-100 text-gray-700',
    qualified: 'bg-emerald-50 text-emerald-700',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <aside className="fixed left-0 top-0 bottom-0 w-64 bg-white border-r border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span className="font-bold text-lg">AI HUNTER</span>
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
      </aside>

      <main className="ml-64 p-8">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 mt-1">Your freelance business at a glance.</p>
        </header>

        <div className="grid grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-500 mb-1">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <span className="text-sm font-medium text-emerald-600">{stat.change}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Opportunities</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {opportunities.map((opp) => (
              <div key={opp.title} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{opp.title}</h3>
                  <p className="text-sm text-gray-500 mt-0.5">{opp.source} · {opp.budget}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-emerald-600">{opp.match} match</span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusColors[opp.status]}`}>
                    {opp.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Scout</h2>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <p className="text-sm text-gray-600">
              <span className="font-medium text-indigo-600">AI Hunter</span> found 3 new opportunities matching your profile since yesterday.
              <button className="ml-2 text-indigo-600 hover:text-indigo-700 font-medium">Review them →</button>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
