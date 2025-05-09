import { NextRequest } from 'next/server';
import { redirect, RedirectType } from 'next/navigation';
export const runtime = 'edge';

export async function GET(request: NextRequest) {
  // console.log('Redirecting from old URL structure to new URL structure');
  const id = request.url.split('/a/').pop();

  if (!id) {
    return new Response('No record ID provided.', { status: 400 });
  }

  // Use Next.js built-in redirect function for App Router
  redirect(`/instant-splits/${id}`, RedirectType.replace);
}
