import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import superjson from 'superjson';
import utf8 from 'utf8';

import { backendJsonAddSchema, fileSchema } from 'schemas/jsonAdd';
import { prisma } from 'server/db';

import { type JsonFile, type MostReactedMessages, type ParticipantMessageDetails } from './types';

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const session = await supabase.auth.getSession();

    if (!session.data.session?.user.id || !session.data.session.user.user_metadata.confirmed) {
      return NextResponse.json({ message: ReasonPhrases.UNAUTHORIZED }, { status: StatusCodes.UNAUTHORIZED });
    }

    const jsonBody: Record<string, unknown> = {};
    const files: File[] = [];

    const body = await request.formData();
    const generator = body.entries();
    let result = generator.next();
    while (!result.done) {
      const [key, value] = result.value;
      if (value instanceof Blob) {
        files.push(value);
      } else {
        jsonBody[key] = typeof value === 'string' ? value : superjson.parse(value);
      }
      result = generator.next();
    }

    const parsedBody = backendJsonAddSchema.safeParse(jsonBody);

    if (!parsedBody.success || files.length === 0) {
      return NextResponse.json({ message: ReasonPhrases.BAD_REQUEST }, { status: StatusCodes.BAD_REQUEST });
    }

    const mostReactedMessages: MostReactedMessages = {
      numberOfReactions: 0,
      messages: []
    };
    const participantMessageDetails = new Map<string, ParticipantMessageDetails>();

    let startDate = new Date();
    let endDate = new Date();

    for (const file of files) {
      const parsedFile = fileSchema.safeParse(file);
      if (!parsedFile.success) {
        return NextResponse.json({ message: ReasonPhrases.BAD_REQUEST }, { status: StatusCodes.BAD_REQUEST });
      }

      const buffer = await file.arrayBuffer();

      // try / catch should catch all type issues
      const json = JSON.parse(new TextDecoder('utf-8').decode(buffer)) as JsonFile;
      json.participants.forEach((participant) => {
        const mappedParticipant = participantMessageDetails.get(utf8.decode(participant.name));
        if (mappedParticipant) return;

        participantMessageDetails.set(utf8.decode(participant.name), {
          givedReactions: 0,
          numberOfWords: 0,
          messagesAmount: 0,
          receivedReactions: 0,
          kWordAmount: 0,
          xDWordAmount: 0
        });
      });

      // for loop is faster than forEach but forEach is more readable
      json.messages.forEach((message) => {
        const author = utf8.decode(message.sender_name);
        const details = participantMessageDetails.get(author);
        if (!details) return;
        details.numberOfWords += message.content?.split(' ').length ?? 0;
        details.messagesAmount += 1;

        const kWordAmount = message.content?.toLowerCase()?.match(/kurwa/gi)?.length ?? 0;
        const xDAmount = message.content?.toLowerCase()?.match(/xd/gi)?.length ?? 0;
        details.xDWordAmount += xDAmount;
        details.kWordAmount += kWordAmount;

        if (message.reactions) {
          details.receivedReactions += message.reactions.length;
          message.reactions.forEach((reaction) => {
            const reactionAuthor = utf8.decode(reaction.actor);
            const reactionDetails = participantMessageDetails.get(reactionAuthor);
            if (!reactionDetails) return;
            reactionDetails.givedReactions += 1;
          });

          if (message.reactions.length < mostReactedMessages.numberOfReactions) return;
          if (message.reactions.length === mostReactedMessages.numberOfReactions) {
            mostReactedMessages.messages.push(message);
          } else {
            mostReactedMessages.numberOfReactions = message.reactions.length;
            mostReactedMessages.messages = [
              { ...message, content: message.content ? utf8.decode(message.content) : undefined }
            ];
          }
        }
      });

      const firstMessageDate = new Date(json.messages.at(-1)?.timestamp_ms ?? 0);
      const lastMessageDate = new Date(json.messages[0]?.timestamp_ms ?? 0);
      if (firstMessageDate < startDate) startDate = firstMessageDate;
      if (lastMessageDate > endDate) endDate = lastMessageDate;
    }
    await prisma.dataImport.create({
      data: {
        firstMessageDate: startDate,
        title: parsedBody.data.name,
        lastMessageDate: endDate,
        authorId: session.data.session.user.id,
        participantDetails: {
          createMany: { data: Array.from(participantMessageDetails, ([name, details]) => ({ ...details, name })) }
        },
        topParticipants: {
          createMany: {
            data: mostReactedMessages.messages.map((message) => ({
              content: message.content,
              reactions: mostReactedMessages.numberOfReactions,
              photos: (message.photos?.length ?? 0) > 0,
              gifs: (message.gifs?.length ?? 0) > 0,
              name: message.sender_name
            }))
          }
        }
      }
    });

    revalidateTag('stats');
    return NextResponse.json({ message: ReasonPhrases.OK }, { status: StatusCodes.OK });
  } catch (e) {
    console.log(e);
    return NextResponse.json(
      { message: ReasonPhrases.INTERNAL_SERVER_ERROR },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}
