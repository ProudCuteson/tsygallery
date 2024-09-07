import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPublicRoute = createRouteMatcher(['/','/sign-in(.*)','/sign-up(.*)','/gallery', '/api/webhooks/clerk', '/api/webhooks/stripe'])

export default clerkMiddleware((auth, req) => {
  if (isPublicRoute(req)) return // if it's a public route, do nothing
  auth().protect() // for any other route, require auth
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}