import { AccessToken } from 'livekit-server-sdk';
import { Redis } from '@upstash/redis';
import { NextRequest, NextResponse } from 'next/server';

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(req: NextRequest) {
  try {
    const { roomId, username } = await req.json();

    if (!roomId || !username) {
      return NextResponse.json({ error: 'Missing roomId or username' }, { status: 400 });
    }

    // 1. Check Redis for the current room state
    const redisKey = `room:${roomId}`;
    let roomState = await redis.get<{ participants: number }>(redisKey);

    if (!roomState) {
      // Room doesn't exist, create it (Participant 1 is joining)
      // Room expires in 24 hours to keep the database clean
      await redis.set(redisKey, { participants: 1 }, { ex: 86400 }); 
    } else if (roomState.participants === 1) {
      // Room exists, 1 person is waiting (Participant 2 is joining)
      await redis.set(redisKey, { participants: 2 }, { ex: 86400 });
    } else {
      // Room has 2 or more participants. Lock it down.
      return NextResponse.json(
        { error: 'This room is full or the secure link has expired.' }, 
        { status: 403 }
      );
    }

    // 2. Generate the LiveKit Video Token
    const apiKey = process.env.LIVEKIT_API_KEY;
    const apiSecret = process.env.LIVEKIT_API_SECRET;
    const wsUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

    if (!apiKey || !apiSecret || !wsUrl) {
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 });
    }

    const at = new AccessToken(apiKey, apiSecret, {
      identity: username,
      ttl: '2h', // Token expires in 2 hours
    });

    // Grant permissions to join the specific room and publish video/audio
    at.addGrant({ roomJoin: true, room: roomId, canPublish: true, canSubscribe: true });

    const token = await at.toJwt();

    return NextResponse.json({ token });
    
  } catch (error) {
    console.error("Room API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}