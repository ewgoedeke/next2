import { type NextRequest, NextResponse } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware/updateSession';

export async function middleware(request: NextRequest) {
  try {
    console.log(`[Middleware] Incoming request: ${request.url}`);

    // Update session using your custom function
    const response = await updateSession(request);

    // If `updateSession` returns null or indicates unauthenticated, redirect to login
    if (!response) {
      console.log(`[Middleware] Unauthenticated request, redirecting to /login`);
      return NextResponse.redirect(new URL('/login', request.url));
    }

    console.log(`[Middleware] Session updated successfully`);
    return response;
  } catch (error) {
    console.error(`[Middleware] Error:`, error);

    // Return a 500 response for middleware errors
    return new Response('An error occurred in middleware.', { status: 500 });
  }
}

export const config = {
  matcher: [
    /*
     * Exclude static assets, image files, and favicons.
     * Include only the paths that require session updates or authentication.
     */
    '/((?!_next/static|_next/image|favicon.ico|public|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
