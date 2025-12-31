import { fetchAndDecrementPaste } from '@/lib/paste';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    
    // Check for test mode (for automated testing)
    const testMode = process.env.TEST_MODE === '1';
    const testNowMs = request.headers.get('x-test-now-ms');
    const timeOverride = testMode && testNowMs ? testNowMs : null;
    
    const paste = await fetchAndDecrementPaste(id, timeOverride);
    
    if (!paste) {
      return Response.json(
        { error: 'Paste not found or expired' },
        { 
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return Response.json(paste, {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Error fetching paste:', error);
    return Response.json(
      { error: 'Failed to fetch paste' },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}