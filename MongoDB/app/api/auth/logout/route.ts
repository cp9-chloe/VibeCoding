import { NextResponse } from 'next/server';

// POST /api/auth/logout - Log out a user
export async function POST() {
  try {
    // Create response and clear the token cookie
    const response = NextResponse.json({ message: 'Logout successful' }, { status: 200 });

    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
