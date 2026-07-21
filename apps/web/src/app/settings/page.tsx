'use client';

import { useCallback, useEffect, useState } from 'react';

const ALL_PLATFORMS = ['Upwork', 'LinkedIn', 'Fiverr', 'Toptal', 'Freelancer'];

interface Profile {
  name: string;
  skills: string[];
  hourlyRate: { min: number; max: number };
  platforms: string[];
  keywords: string[];
  excludedKeywords: string[];
}

const DEFAULT_PROFILE: Profile = {
  name: '',
  skills: [],
  hourlyRate: { min: 50, max: 150 },
  platforms: ['Upwork', 'LinkedIn', 'Fiverr', 'Toptal'],
  keywords: [],
  excludedKeywords: [],
};

function TagInput({
  tags,
  onChange,
  placeholder,
}: {
  tags: string[];
  onChange: (tags: string[]) => void;
  placeholder: string;
}) {
  const [input, setInput] = useState('');

  function addTag() {
    const trimmed = input.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed]);
    }
    setInput('');
  }

  return (
    <div className="flex flex-wrap gap-2 p-2 border border-gray-200 rounded-lg bg-white min-h-[42px] focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
      {tags.map((tag) => (
        <span
          key={tag}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-md text-sm font-medium"
        >
          {tag}
          <button
            type="button"
            onClick={() => onChange(tags.filter((t) => t !== tag))}
            className="hover:text-indigo-900"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </span>
      ))}
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            addTag();
          }
        }}
        onBlur={addTag}
        placeholder={tags.length === 0 ? placeholder : ''}
        className="flex-1 min-w-[120px] outline-none text-sm text-gray-700 placeholder-gray-400 bg-transparent"
      />
    </div>
  );
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile>(DEFAULT_PROFILE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/profile')
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }, []);

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      if (res.ok) {
        showToast('Profile saved successfully');
      } else {
        showToast('Failed to save profile');
      }
    } catch {
      showToast('Failed to save profile');
    } finally {
      setSaving(false);
    }
  }

  function togglePlatform(platform: string) {
    setProfile((prev) => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter((p) => p !== platform)
        : [...prev.platforms, platform],
    }));
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg text-sm font-medium animate-fade-in">
          {toast}
        </div>
      )}

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
                item === 'Settings'
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
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">Manage your freelancer profile used for opportunity matching.</p>
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="max-w-2xl space-y-6">
            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Basic Info</h2>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your name"
                />
              </div>
            </section>

            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Skills</h2>
              <TagInput
                tags={profile.skills}
                onChange={(skills) => setProfile({ ...profile, skills })}
                placeholder="Type a skill and press Enter..."
              />
            </section>

            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Hourly Rate ($/hr)</h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="block text-sm text-gray-500 mb-1.5">Minimum</label>
                  <input
                    type="number"
                    value={profile.hourlyRate.min}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        hourlyRate: { ...profile.hourlyRate, min: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <span className="text-gray-300 mt-6">—</span>
                <div className="flex-1">
                  <label className="block text-sm text-gray-500 mb-1.5">Maximum</label>
                  <input
                    type="number"
                    value={profile.hourlyRate.max}
                    onChange={(e) =>
                      setProfile({
                        ...profile,
                        hourlyRate: { ...profile.hourlyRate, max: Number(e.target.value) },
                      })
                    }
                    className="w-full px-3.5 py-2.5 border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
              </div>
            </section>

            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Platforms</h2>
              <div className="space-y-3">
                {ALL_PLATFORMS.map((platform) => (
                  <label
                    key={platform}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                        profile.platforms.includes(platform)
                          ? 'bg-indigo-600 border-indigo-600'
                          : 'border-gray-300 group-hover:border-gray-400'
                      }`}
                    >
                      {profile.platforms.includes(platform) && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      checked={profile.platforms.includes(platform)}
                      onChange={() => togglePlatform(platform)}
                      className="sr-only"
                    />
                    <span className="text-sm text-gray-700">{platform}</span>
                  </label>
                ))}
              </div>
            </section>

            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Keywords</h2>
              <p className="text-sm text-gray-500 mb-3">These keywords help match you to relevant opportunities.</p>
              <TagInput
                tags={profile.keywords}
                onChange={(keywords) => setProfile({ ...profile, keywords })}
                placeholder="Type a keyword and press Enter..."
              />
            </section>

            <section className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Excluded Keywords</h2>
              <p className="text-sm text-gray-500 mb-3">Opportunities containing these keywords will be filtered out.</p>
              <TagInput
                tags={profile.excludedKeywords}
                onChange={(excludedKeywords) => setProfile({ ...profile, excludedKeywords })}
                placeholder="Type a keyword and press Enter..."
              />
            </section>

            <div className="flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
