import { type Metadata } from 'next';

import { type StatsResponse } from 'app/api/stats/route';
import { localFetch } from 'app/utils/localFetch';

export const metadata: Metadata = {
  title: 'Statystyki'
};

const getStats = async () => {
  try {
    const response = await localFetch<StatsResponse>('/stats', {
      method: 'GET',
      cache: 'force-cache',
      next: { tags: ['stats'] }
    });
    return response;
  } catch (e) {
    //TODO: work with errors
    console.log(e);
    return null;
  }
};

export default async function Stats() {
  const stats = await getStats();

  if (!stats) {
    return <h1>Jeszcze tu nic nie ma</h1>;
  }

  return (
    <>
      <h1>Statystyki</h1>
      <pre>{JSON.stringify(stats, null, 2)}</pre>
    </>
  );
}
