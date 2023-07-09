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

export interface JsonFile {
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

export interface MostReactedMessages {
  numberOfReactions: number;
  messages: Message[];
}

export interface ParticipantMessageDetails {
  messagesAmount: number;
  givedReactions: number;
  receivedReactions: number;
  numberOfWords: number;
  kWordAmount: number;
  xDWordAmount: number;
}
