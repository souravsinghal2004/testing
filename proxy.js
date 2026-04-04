import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
    "/admin(.*)",
    "/saved-cars(.*)",
    "/reservations(.*)",
    "/recruiter(.*)",
    "/api/recruiter(.*)", // ✅ this ensures auth is attached for API
]);

export default clerkMiddleware(async (auth, req) => {
    const { userId } = await auth();

    if (!userId && isProtectedRoute(req)) {
        const { redirectToSignIn } = await auth();
        return redirectToSignIn();
    }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};