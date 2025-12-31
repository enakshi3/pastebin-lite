export async function GET() {
  try {
    // For in-memory storage, just return ok
    // If using database, add a connection test here
    return Response.json({ ok: true }, { 
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    return Response.json(
      { ok: false, error: 'Health check failed' },
      { 
        status: 503,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
  }
}