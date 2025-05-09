import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';
export const fetchCache = 'force-no-store';
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  // Get the URL from the search parameters
  const searchParams = request.nextUrl.searchParams;
  const imageUrl = searchParams.get('url');
  const hostName = searchParams.get('hostName');

  if (!imageUrl) {
    return NextResponse.json(
      { error: 'Missing URL parameter' },
      { status: 400 }
    );
  }

  try {
    // Fetch the image from the original URL
    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(
        `Failed to fetch image: ${response.status} ${response.statusText}`
      );
    }

    // Get the image as array buffer
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Get the content type from the original response or default to 'image/png'
    const contentType = response.headers.get('content-type') || 'image/png';

    // Create the response with the image data
    const imageResponse = new NextResponse(buffer);

    // Set the appropriate headers
    imageResponse.headers.set('Content-Type', contentType);
    imageResponse.headers.set(
      'Content-Disposition',
      `attachment; filename="${hostName}-payment-qr-code.png"`
    );

    return imageResponse;
  } catch (error) {
    console.error('Error proxying image:', error);
    return NextResponse.json(
      { error: 'Failed to fetch the image' },
      { status: 500 }
    );
  }
}
