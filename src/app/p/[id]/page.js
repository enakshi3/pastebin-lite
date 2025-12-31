'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

export default function PasteViewPage() {
  const params = useParams();
  const [paste, setPaste] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPaste() {
      try {
        const response = await fetch(`/api/pastes/${params.id}`);
        if (response.status === 404) {
          throw new Error('Paste not found or expired');
        }
        if (!response.ok) {
          throw new Error('Failed to load paste');
        }
        const data = await response.json();
        setPaste(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    
    if (params.id) {
      fetchPaste();
    }
  }, [params.id]);

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>404 - Paste Not Found</h1>
        <p>The paste you're looking for has expired or doesn't exist.</p>
        <a href="/">Create a new paste</a>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Paste Content</h1>
      <div style={{ 
        backgroundColor: '#f5f5f5', 
        padding: '20px', 
        borderRadius: '5px',
        whiteSpace: 'pre-wrap',
        fontFamily: 'monospace',
        border: '1px solid #ddd'
      }}>
        {paste.content}
      </div>
      <div style={{ marginTop: '20px', color: '#666' }}>
        {paste.remaining_views !== null && (
          <p>Remaining views: {paste.remaining_views}</p>
        )}
        {paste.expires_at && (
          <p>Expires: {new Date(paste.expires_at).toLocaleString()}</p>
        )}
      </div>
      <div style={{ marginTop: '20px' }}>
        <a href="/">Create another paste</a>
      </div>
    </div>
  );
}