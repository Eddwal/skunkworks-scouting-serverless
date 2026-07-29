import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase/firebase-admin';
import { DecodedIdToken } from 'firebase-admin/auth';

export type AuthenticatedRouteHandler = (
  req: NextRequest,
  token: DecodedIdToken
) => Promise<NextResponse>;

export function withAuth(handler: AuthenticatedRouteHandler) {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get('Authorization');
      if (!authHeader?.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Unauthorized: Missing or invalid token' },
          { status: 401 }
        );
      }

      const tokenString = authHeader.split('Bearer ')[1];
      let decodedToken: DecodedIdToken;
      try {
        decodedToken = await adminAuth.verifyIdToken(tokenString);
      } catch (err: any) {
        return NextResponse.json(
          { error: `Auth verification failed: ${err.message}` },
          { status: 401 }
        );
      }

      return await handler(req, decodedToken);
    } catch (error: any) {
      console.error('API Route Error:', error);
      return NextResponse.json(
        { error: 'Internal server error', details: error.message },
        { status: 500 }
      );
    }
  };
}
