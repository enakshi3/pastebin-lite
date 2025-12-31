// src/lib/paste.js
import { v4 as uuidv4 } from 'uuid';

// For demo - using in-memory storage
const pastes = new Map();

export async function createPaste(content, ttl_seconds = null, max_views = null) {
  const id = uuidv4().replace(/-/g, '').substring(0, 8);
  
  const now = Date.now();
  const expires_at = ttl_seconds ? now + (ttl_seconds * 1000) : null;
  
  const paste = {
    id,
    content,
    created_at: now,
    views: 0,
    max_views,
    expires_at,
    ttl_seconds
  };
  
  pastes.set(id, paste);
  
  // Use environment variable for base URL or fallback to localhost
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  return {
    id,
    url: `${baseUrl}/p/${id}`
  };
}

export async function fetchAndDecrementPaste(id, timeOverride = null) {
  const paste = pastes.get(id);
  if (!paste) return null;
  
  const now = timeOverride ? parseInt(timeOverride) : Date.now();
  
  // Check TTL expiration
  if (paste.expires_at && now > paste.expires_at) {
    pastes.delete(id);
    return null;
  }
  
  // Check max views expiration
  if (paste.max_views !== null && paste.views >= paste.max_views) {
    pastes.delete(id);
    return null;
  }
  
  // Increment view count
  paste.views += 1;
  
  // Calculate remaining views
  const remaining_views = paste.max_views !== null 
    ? Math.max(0, paste.max_views - paste.views)
    : null;
  
  return {
    content: paste.content,
    remaining_views,
    expires_at: paste.expires_at ? new Date(paste.expires_at).toISOString() : null
  };
}