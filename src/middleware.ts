import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Ignorer les fichiers statiques, les API, et les pages d'authentification
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/uploads') ||
    pathname.includes('.') ||
    pathname === '/maintenance' ||
    pathname === '/connexion' ||
    pathname === '/inscription' ||
    pathname.startsWith('/api/auth')
  ) {
    return NextResponse.next();
  }

  try {
    // Vérifier le mode maintenance depuis la base de données
    const maintenanceResponse = await fetch(`${request.nextUrl.origin}/api/maintenance/status`);

    if (maintenanceResponse.ok) {
      const { maintenanceMode } = await maintenanceResponse.json();

      if (maintenanceMode) {
        // Vérifier si l'utilisateur est un administrateur
        const token = await getToken({ req: request });

        if (token?.type !== 'admin') {
          // Rediriger vers la page de maintenance si ce n'est pas un admin
          return NextResponse.redirect(new URL('/maintenance', request.url));
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors de la vérification du mode maintenance:', error);
    // En cas d'erreur, continuer normalement
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - uploads (uploaded files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
  ],
};
