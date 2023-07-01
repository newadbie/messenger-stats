'server-only';
import superjson from 'superjson';

import { env } from 'env.mjs';

export const revalidateTag = async (tag: string): Promise<void> => {
  await localFetch('/revalidate-tag', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ tag }),
    cache: 'no-store'
  });
};

export const localFetch = async <T = unknown>(
  url: string,
  init?: RequestInit
): Promise<{ data: T; status: number }> => {
  const { headers, ...config } = init ?? {};

  const validUrl = process.env.NEXT_PUBLIC_VERCEL_URL
    ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}/api${url}`
    : `${env.NEXT_PUBLIC_DOMAIN}/api${url}`;

  const response = await fetch(validUrl, {
    headers: {
      Authorization: `Bearer ${env.API_SECRET}`,
      ...headers
    },
    ...config,
    cache: config.cache ?? 'force-cache'
  });
  if (!response.ok) {
    throw response.status;
  }
  const result = (await response.json()) as string;
  console.log(result);
  const parsedResult = superjson.parse<T>(result);
  return typeof result === 'string'
    ? { data: parsedResult, status: response.status }
    : { data: result, status: response.status };
};
