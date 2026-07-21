'use client';

import { useState } from 'react';

const PLANS = [
  {
    name: 'Starter',
    price: 'Free',
    period: 'forever',
    features: ['50 opportunities/mo', 'Basic pipeline management', 'Email support'],
    cta: 'Get started',
    highlighted: false,
  },
  {
    name: 'Pro',
    price: '$29',
    period: '/mo',
    features: ['Unlimited opportunities', 'AI proposal writer', 'Priority support', 'Advanced analytics'],
    cta: 'Start free trial',
    highlighted: true,
  },
  {
    name: 'Agency',
    price: '$79',
    period: '/mo',
    features: ['Everything in Pro', 'Up to 5 team members', 'API access', 'Custom integrations'],
    cta: 'Contact sales',
    highlighted: false,
  },
];

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      if (res.ok) setStatus('success');
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-lg text-gray-900">AI HUNTER</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-gray-900">Features</a>
            <a href="#pricing" className="hover:text-gray-900">Pricing</a>
          </nav>
          <div className="flex items-center gap-3">
            <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900 px-4 py-2">Sign in</a>
            <a href="/dashboard" className="text-sm bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium transition-colors">
              Get early access
            </a>
          </div>
        </div>
      </header>

      <section className="max-w-7xl mx-auto px-6 pt-24 pb-16 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-indigo-50 rounded-full text-sm text-indigo-700 font-medium mb-8">
          <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          AI-powered freelancer workspace
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 max-w-4xl mx-auto leading-tight">
          Work <span className="text-indigo-600">Smarter</span>.<br />
          Win <span className="text-emerald-500">Faster</span>.
        </h1>
        <p className="mt-6 text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
          AI Hunter discovers opportunities, writes proposals, and manages your pipeline — so you can focus on delivering great work.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <a href="/dashboard" className="bg-indigo-600 text-white px-8 py-3.5 rounded-xl text-base font-semibold hover:bg-indigo-700 transition-colors shadow-sm">
            Start hunting — it&apos;s free
          </a>
          <a href="#pricing" className="border border-gray-300 text-gray-700 px-8 py-3.5 rounded-xl text-base font-medium hover:bg-gray-50 transition-colors">
            See pricing
          </a>
        </div>
        <p className="mt-4 text-sm text-gray-400">No credit card required. 14-day free trial.</p>
      </section>

      <section id="features" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Everything a freelancer needs</h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">
            One workspace to find, win, and deliver work. No more juggling 10 tabs.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              title: 'Discover',
              desc: 'AI scans 50+ platforms and surfaces opportunities matched to your skills and rate.',
              icon: <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
            },
            {
              title: 'Win',
              desc: 'AI writes personalized proposals, follows up automatically, and tracks your pipeline.',
              icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
            },
            {
              title: 'Grow',
              desc: 'Real-time analytics show which clients pay best and where to focus your energy.',
              icon: <path strokeLinecap="round" strokeLinejoin="round" d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />,
            },
          ].map((feature) => (
            <div key={feature.title} className="bg-white rounded-2xl border border-gray-200 p-8 hover:shadow-lg hover:border-gray-300 transition-all">
              <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-5">
                <svg className="w-6 h-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  {feature.icon}
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Simple, transparent pricing</h2>
          <p className="mt-3 text-gray-500 max-w-xl mx-auto">Start free, upgrade when you grow. No hidden fees.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {PLANS.map((plan) => (
            <div key={plan.name} className={`rounded-2xl p-8 border-2 ${plan.highlighted ? 'border-indigo-600 bg-white shadow-lg relative' : 'border-gray-200 bg-white'}`}>
              {plan.highlighted && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-indigo-600 text-white text-xs font-semibold px-4 py-1 rounded-full">
                  Most popular
                </div>
              )}
              <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
              <div className="mt-4 mb-6">
                <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                <span className="text-gray-500 ml-1">{plan.period}</span>
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-gray-600">
                    <svg className="w-4 h-4 text-emerald-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="/dashboard" className={`block text-center px-6 py-3 rounded-xl font-medium transition-colors ${plan.highlighted ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                {plan.cta}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to work smarter?</h2>
          <p className="text-gray-400 max-w-xl mx-auto mb-8">
            {status === 'success' ? 'You\'re on the list! We\'ll be in touch.' : 'Join the waitlist and be the first to access AI Hunter.'}
          </p>
          {status !== 'success' ? (
            <form onSubmit={handleSubmit} className="flex items-center justify-center gap-3 max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                required
                className="flex-1 px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button type="submit" disabled={status === 'loading'} className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors whitespace-nowrap disabled:opacity-50">
                {status === 'loading' ? 'Sending...' : 'Get early access'}
              </button>
            </form>
          ) : null}
          {status === 'error' && (
            <p className="mt-3 text-sm text-red-400">Something went wrong. Try again.</p>
          )}
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-white py-8">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between text-sm text-gray-500">
          <span>&copy; 2026 AI Hunter Labs. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-gray-900">Privacy</a>
            <a href="#" className="hover:text-gray-900">Terms</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
