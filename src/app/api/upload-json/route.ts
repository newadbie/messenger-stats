import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { jsonAddSchema } from 'schemas/jsonAdd';
import superjson from 'superjson';

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });
  const session = await supabase.auth.getSession();

  if (!session.data) {
    return NextResponse.json({ message: ReasonPhrases.UNAUTHORIZED }, { status: StatusCodes.UNAUTHORIZED });
  }

  const jsonBody: Record<string, unknown> = {};
  try {
    const body = await request.formData();
    const generator = body.entries();
    let result = generator.next();
    while (!result.done) {
      const [key, value] = result.value;
      jsonBody[key] = value instanceof Blob ? value : superjson.parse(value.toString());
      result = generator.next();
    }

    const parsedBody = jsonAddSchema.safeParse(jsonBody);
    if (!parsedBody.success) {
      return NextResponse.json({ message: ReasonPhrases.BAD_REQUEST }, { status: StatusCodes.BAD_REQUEST });
    }

    console.log(parsedBody.data.file);
  } catch {
    return NextResponse.json(
      { message: ReasonPhrases.INTERNAL_SERVER_ERROR },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
  return NextResponse.json({ message: ReasonPhrases.OK }, { status: StatusCodes.OK });
}
