'use client';

import { useState } from 'react';
// Remove the PasteForm import and put the form here

export default function Home() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    content: '',
    ttl_seconds: '',
    max_views: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const submitData = {
      content: formData.content,
    };
    
    if (formData.ttl_seconds) submitData.ttl_seconds = parseInt(formData.ttl_seconds);
    if (formData.max_views) submitData.max_views = parseInt(formData.max_views);
    
    try {
      const response = await fetch('/api/pastes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(submitData),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to create paste');
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
      <h1>Pastebin Lite</h1>
      <p>Share text quickly and securely with optional expiration</p>
      
      {/* Form directly in the component */}
      <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
            Content *
          </label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            rows="10"
            style={{ 
              width: '100%', 
              padding: '10px', 
              border: '1px solid #ddd',
              borderRadius: '4px',
              fontFamily: 'monospace'
            }}
            required
            disabled={loading}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              TTL (seconds, optional)
            </label>
            <input
              type="number"
              name="ttl_seconds"
              value={formData.ttl_seconds}
              onChange={handleChange}
              min="1"
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
              disabled={loading}
            />
          </div>
          
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '5px' }}>
              Max Views (optional)
            </label>
            <input
              type="number"
              name="max_views"
              value={formData.max_views}
              onChange={handleChange}
              min="1"
              style={{ 
                width: '100%', 
                padding: '8px', 
                border: '1px solid #ddd',
                borderRadius: '4px'
              }}
              disabled={loading}
            />
          </div>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '12px 24px',
            backgroundColor: loading ? '#ccc' : '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Creating...' : 'Create Paste'}
        </button>
      </form>
      
      {/* Rest of your component remains the same */}
      {error && (
        <div style={{ 
          backgroundColor: '#ffebee', 
          color: '#c62828', 
          padding: '15px', 
          borderRadius: '5px',
          marginTop: '20px'
        }}>
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div style={{ 
          backgroundColor: '#e8f5e9', 
          color: '#2e7d32', 
          padding: '15px', 
          borderRadius: '5px',
          marginTop: '20px'
        }}>
          <h3>Paste Created Successfully!</h3>
          <p><strong>ID:</strong> {result.id}</p>
          <p><strong>URL:</strong> <a href={result.url}>{result.url}</a></p>
          <button 
            onClick={() => navigator.clipboard.writeText(result.url)}
            style={{ 
              marginTop: '10px', 
              padding: '8px 16px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Copy URL
          </button>
        </div>
      )}
      
      <div style={{ marginTop: '40px', fontSize: '14px', color: '#666' }}>
        <h3>API Documentation</h3>
        <ul>
          <li><strong>POST /api/pastes</strong> - Create a new paste with optional TTL and max views</li>
          <li><strong>GET /api/pastes/[id]</strong> - Retrieve paste content (JSON)</li>
          <li><strong>GET /p/[id]</strong> - View paste in browser (HTML)</li>
          <li><strong>GET /api/healthz</strong> - Health check endpoint</li>
        </ul>
      </div>
    </div>
  );
}