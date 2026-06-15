// Mock uploadthing API - disabled in demo mode
export async function GET(request: Request) {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Uploadthing API not available in demo mode',
    }),
    { status: 503 }
  );
}

export async function POST(request: Request) {
  return new Response(
    JSON.stringify({
      success: false,
      error: 'Uploadthing API not available in demo mode',
    }),
    { status: 503 }
  );
}
