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
    include: { author: true, participantDetails: true, topParticipants: true }
  });

export async function GET(request: Request) {
  const token = request.headers.get('authorization')?.split('Bearer ')[1];
  if (!token || token !== env.API_SECRET) {
    return NextResponse.json({ message: ReasonPhrases.UNAUTHORIZED }, { status: StatusCodes.UNAUTHORIZED });
  }
  const stats = await getImport();
  return NextResponse.json(superjson.stringify(stats), { status: StatusCodes.OK });
}
