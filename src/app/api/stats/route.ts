import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import superjson from 'superjson';

import { env } from 'env.mjs';
import { prisma } from 'server/db';

export interface StatsResponse {
  stats: ReturnType<Awaited<typeof getImport>>;
  message: 'ok';
}

const getImport = () =>
  prisma.dataImport.findMany({
    select: {
      lastMessageDate: true,
      firstMessageDate: true,
      createdAt: true,
      author: { select: { email: true } },
      title: true,
      participantDetails: {
        select: {
          kWordAmount: true,
          givedReactions: true,
          messagesAmount: true,
          name: true,
          numberOfWords: true,
          receivedReactions: true,
          xDWordAmount: true
        }
      },
      topParticipants: { select: { name: true, content: true, gifs: true, photos: true, reactions: true } }
    }
  });

export async function GET(request: Request) {
  const token = request.headers.get('authorization')?.split('Bearer ')[1];
  if (!token || token !== env.API_SECRET) {
    return NextResponse.json({ message: ReasonPhrases.UNAUTHORIZED }, { status: StatusCodes.UNAUTHORIZED });
  }
  const stats = await getImport();
  const sortedStats = stats.map((stat) => stat.participantDetails.sort((a, b) => b.messagesAmount - a.messagesAmount));
  return NextResponse.json(superjson.stringify(sortedStats), { status: StatusCodes.OK });
}
