'use client';

import { useState } from 'react';

export default function Home() {
  const [content, setContent] = useState('');
  const [ttlSeconds, setTtlSeconds] = useState('');
  const [maxViews, setMaxViews] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdUrl, setCreatedUrl] = useState(null);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleCreatePaste = async (e) => {
    e.preventDefault();
    setError('');
    setCreatedUrl(null);

    if (!content.trim()) {
      setError('Please enter some content');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        content: content.trim(),
        ...(ttlSeconds && { ttl_seconds: parseInt(ttlSeconds) }),
        ...(maxViews && { max_views: parseInt(maxViews) })
      };

      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errData = await response.json();
        setError(errData.error || 'Failed to create paste');
        setLoading(false);
        return;
      }

      const data = await response.json();
      setCreatedUrl(data.url);
      setContent('');
      setTtlSeconds('');
      setMaxViews('');
    } catch (err) {
      setError('Error creating paste: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const copyUrl = () => {
    navigator.clipboard.writeText(createdUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-8 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-2">Pastebin Lite</h1>
          <p className="text-gray-300 text-lg">Share text securely with optional expiry & view limits</p>
        </div>

        {createdUrl && (
          <div className="mb-8 bg-green-900 bg-opacity-50 border border-green-500 rounded-lg p-6 backdrop-blur-sm">
            <p className="text-green-200 font-semibold mb-3">✓ Paste created successfully!</p>
            <div className="flex gap-2">
              <input
                type="text"
                value={createdUrl}
                readOnly
                className="flex-1 bg-slate-950 text-green-400 px-4 py-2 rounded border border-green-500 font-mono text-sm"
              />
              <button
                onClick={copyUrl}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold transition"
              >
                {copied ? '✓' : 'Copy'}
              </button>
              <a
                href={createdUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded font-semibold transition"
              >
                View
              </a>
            </div>
          </div>
        )}

        <form onSubmit={handleCreatePaste} className="bg-white bg-opacity-10 backdrop-blur-md rounded-lg border border-white border-opacity-20 p-8 space-y-6">
          <div>
            <label className="block text-white font-semibold mb-2">Paste Content *</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full h-64 bg-slate-950 text-white border border-purple-500 rounded-lg p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
              placeholder="Enter your text here..."
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-white font-semibold mb-2">Expiry (seconds)</label>
              <input
                type="number"
                value={ttlSeconds}
                onChange={(e) => setTtlSeconds(e.target.value)}
                min="1"
                className="w-full bg-slate-950 text-white border border-purple-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
                placeholder="e.g., 3600"
                disabled={loading}
              />
              <p className="text-gray-400 text-xs mt-1">Optional: auto-delete after time</p>
            </div>
            <div>
              <label className="block text-white font-semibold mb-2">Max Views</label>
              <input
                type="number"
                value={maxViews}
                onChange={(e) => setMaxViews(e.target.value)}
                min="1"
                className="w-full bg-slate-950 text-white border border-purple-500 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400 placeholder-gray-500"
                placeholder="e.g., 5"
                disabled={loading}
              />
              <p className="text-gray-400 text-xs mt-1">Optional: limit views</p>
            </div>
          </div>

          {error && (
            <div className="bg-red-900 bg-opacity-50 border border-red-500 rounded-lg p-4 text-red-200">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !content.trim()}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-3 rounded-lg transition duration-200"
          >
            {loading ? '⏳ Creating...' : '✨ Create Paste'}
          </button>
        </form>

        <p className="text-center text-gray-400 text-sm mt-8">
          Share privately • Auto-expire • No tracking
        </p>
      </div>
    </div>
  );
}