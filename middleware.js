import { NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

export async function middleware(req) {
  const token = req.cookies.get('token')?.value;

  // If no token is found, redirect to login
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }

  try {
    // Verify the token using the `jose` library
    const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET));

    // Attach the payload to the request so you can access it downstream
    req.payload = payload;

    // Proceed with the request
    return NextResponse.next();
  } catch (err) {
    console.error('Token verification failed', err);
    // If verification fails, redirect to login
    const loginUrl = new URL('/login', req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: ['/admin/:path*'], // Protect all routes under /admin
};
