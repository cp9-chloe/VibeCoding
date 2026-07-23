import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Settings from '@/models/Settings';
import { getCurrentUserId } from '@/lib/auth';

// GET /api/settings - Get user settings
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 });
    }

    // Find settings for this user, or create default settings
    let settings = await Settings.findOne({ userId });

    if (!settings) {
      settings = await Settings.create({ userId });
    }

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error('Get settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT /api/settings - Update user settings
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();

    const userId = getCurrentUserId(request);
    if (!userId) {
      return NextResponse.json({ error: 'You must be logged in' }, { status: 401 });
    }

    const { theme, fontSize, notifications, language } = await request.json();

    // Find and update settings, or create if they don't exist
    const settings = await Settings.findOneAndUpdate(
      { userId },
      { theme, fontSize, notifications, language },
      { new: true, upsert: true }
    );

    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    console.error('Update settings error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
