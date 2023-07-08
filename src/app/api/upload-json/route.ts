import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { revalidateTag } from 'next/cache';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import superjson from 'superjson';
import utf8 from 'utf8';

import { jsonAddSchema } from 'schemas/jsonAdd';
import { prisma } from 'server/db';

interface Reaction {
  reaction: string;
  actor: string;
}

interface Message {
  sender_name: string;
  timestamp_ms: number;
  content?: string;
  gifs?: { uri: string }[];
  photos?: { uri: string; creation_timestamp: number }[];
  reactions?: Reaction[];
}

interface Participant {
  name: string;
}

interface JsonFile {
  participants: Participant[];
  messages: Message[];
  title: string;
  is_still_participant: boolean;
  thread_path: string;
  magic_words: string;
  image: {
    uri: string;
    creation_timestamp: number;
  };
  joinable_mode: {
    mode: 1;
    link: string;
  };
}

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const session = await supabase.auth.getSession();

    if (!session.data.session?.user.id || !session.data.session.user.user_metadata.confirmed) {
      return NextResponse.json({ message: ReasonPhrases.UNAUTHORIZED }, { status: StatusCodes.UNAUTHORIZED });
    }

    const jsonBody: Record<string, unknown> = {};
    const body = await request.formData();
    const generator = body.entries();
    let result = generator.next();
    while (!result.done) {
      const [key, value] = result.value;
      jsonBody[key] = value instanceof Blob ? value : typeof value === 'string' ? value : superjson.parse(value);
      result = generator.next();
    }
    const parsedBody = jsonAddSchema.safeParse(jsonBody);
    if (!parsedBody.success) {
      return NextResponse.json({ message: ReasonPhrases.BAD_REQUEST }, { status: StatusCodes.BAD_REQUEST });
    }

    const file = parsedBody.data.file;
    const buffer = await file.arrayBuffer();

    interface MostReactedMessages {
      numberOfReactions: number;
      messages: Message[];
    }

    interface ParticipantMessageDetails {
      messagesAmount: number;
      givedReactions: number;
      receivedReactions: number;
      numberOfWords: number;
      kWordAmount: number;
      xDWordAmount: number;
    }

    const mostReactedMessages: MostReactedMessages = {
      numberOfReactions: 0,
      messages: []
    };
    const participantMessageDetails = new Map<string, ParticipantMessageDetails>();

    // try / catch should catch all type issues
    const json = JSON.parse(new TextDecoder('utf-8').decode(buffer)) as JsonFile;
    json.participants.forEach((participant) => {
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
    await prisma.dataImport.create({
      data: {
        firstMessageDate,
        title: parsedBody.data.name,
        lastMessageDate,
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
