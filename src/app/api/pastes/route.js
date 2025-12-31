import { createPaste } from '@/lib/paste';

export async function POST(request) {
  try {
    const body = await request.json();
    const { content, ttl_seconds, max_views } = body;

    // Validation
    if (!content || typeof content !== 'string' || !content.trim()) {
      return Response.json(
        { error: 'content is required and must be a non-empty string' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    if (ttl_seconds !== undefined) {
      if (!Number.isInteger(ttl_seconds) || ttl_seconds < 1) {
        return Response.json(
          { error: 'ttl_seconds must be an integer ≥ 1' },
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    if (max_views !== undefined) {
      if (!Number.isInteger(max_views) || max_views < 1) {
        return Response.json(
          { error: 'max_views must be an integer ≥ 1' },
          { 
            status: 400,
            headers: { 'Content-Type': 'application/json' }
          }
        );
      }
    }

    const result = await createPaste(
      content, 
      ttl_seconds || null, 
      max_views || null
    );

    return Response.json(result, { 
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Paste creation error:', error);
    return Response.json(
      { error: 'Failed to create paste' },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}