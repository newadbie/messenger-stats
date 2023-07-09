'use client';
import { format } from 'date-fns';
import { useMemo, useState } from 'react';

import { type StatsResponse } from 'app/api/stats/route';
import CustomSelect, { type CustomSelectOption } from 'app/common/CustomSelect';

interface Props {
  data: StatsResponse['stats'];
}

const StatsTable: React.FC<Props> = ({ data }) => {
  const [selectedData, setSelectedData] = useState(data[0]);
  const [searchAuthor, setSearchWord] = useState('');

  const filteredData = useMemo(() => {
    if (!searchAuthor) return selectedData?.participantDetails;
    return selectedData?.participantDetails.filter((item) => item.name.includes(searchAuthor));
  }, [searchAuthor, selectedData?.participantDetails]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  const dataToSelect = useMemo<CustomSelectOption[]>(
    () => data.map((item, index) => ({ label: item.title, value: `${index}` })),
    [data]
  );

  const handleChangeData = (option: CustomSelectOption) => {
    const index = parseInt(option.value);
    if (!isNaN(index)) return;
    setSelectedData(data[index]);
  };

  const totals = useMemo(
    () =>
      selectedData?.participantDetails.reduce(
        (acc, curr) => {
          return {
            totalMessages: acc.totalMessages + curr.messagesAmount,
            totalWords: acc.totalWords + curr.numberOfWords,
            totalGivedReactions: acc.totalGivedReactions + curr.givedReactions,
            totalReceivedReactions: acc.totalReceivedReactions + curr.receivedReactions,
            totalXDWords: acc.totalXDWords + curr.xDWordAmount,
            totalKWords: acc.totalKWords + curr.kWordAmount
          };
        },
        {
          totalMessages: 0,
          totalWords: 0,
          totalGivedReactions: 0,
          totalReceivedReactions: 0,
          totalXDWords: 0,
          totalKWords: 0
        }
      ),
    [selectedData]
  );

  if (!selectedData) {
    return null;
  }
  const userMeta = selectedData.author.raw_user_meta_data as Record<string, string>;

  return (
    <section className="bg-gray-900">
      <div className="mx-auto">
        <div className="relative w-full bg-gray-800 shadow-md sm:rounded-lg">
          <div className="flex flex-col space-y-2 px-4 pt-4">
            <span>
              <b>Data stworzenia:</b> <time>{format(selectedData.createdAt, 'dd.MM.yyyy, HH:mm')}</time>
            </span>
            <span>
              <b>Stworzone przez:</b> {userMeta?.username}
            </span>
            <span>
              <b>Zakres:</b> {format(selectedData.firstMessageDate, 'dd.MM.yyyy, HH:mm')} -{' '}
              {format(selectedData.lastMessageDate, 'dd.MM.yyyy, HH:mm')}
            </span>
          </div>
          <div className="flex flex-col items-center justify-between space-y-3 p-4 md:flex-row md:space-x-4 md:space-y-0">
            <div className="w-full md:w-1/2">
              <form className="flex items-center">
                <label htmlFor="search" className="sr-only">
                  Wyszukaj autora
                </label>
                <div className="relative w-full">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <svg
                      aria-hidden="true"
                      className="h-5 w-5 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    id="search"
                    className="block w-full rounded-lg border border-gray-600 bg-gray-700 p-2 pl-10 text-sm text-white placeholder-gray-400 focus:border-primary-500 focus:ring-primary-500"
                    placeholder="Wyszukaj autora"
                    onChange={handleSearch}
                  />
                </div>
              </form>
            </div>
            <div className="flex w-full flex-col justify-end space-y-2 md:flex-row md:items-center md:space-x-3 md:space-y-0">
              <CustomSelect
                className="min-w-[200px]"
                defaultOption={dataToSelect[0]}
                onChange={handleChangeData}
                options={dataToSelect}
              />
            </div>
          </div>
          <div className="overflow-x-auto lg:overflow-visible">
            <table className="v relative h-full w-full text-left text-sm text-gray-400">
              <thead className="sticky top-0 bg-gray-700 text-xs uppercase text-gray-400">
                <tr>
                  <th scope="col" className="px-4 py-3">
                    Imię i nazwisko
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Wiadomości
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Liczba słów
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Dane reakcje
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Otrzymane reakcje
                  </th>
                  <th scope="col" className="px-4 py-3">
                    Liczba &quot;XD&quot;
                  </th>
                  <th scope="col" className="px-4 py-3">
                    K-words
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData?.map((participant, index) => (
                  <tr className="border-b border-gray-700" key={index}>
                    <th className="whitespace-nowrap px-4 py-3 font-medium text-white">{participant.name}</th>
                    <td className="px-4 py-4">
                      {participant.messagesAmount} (
                      {((participant.messagesAmount / (totals?.totalMessages ?? 0)) * 100).toFixed(2)}%)
                    </td>
                    <td className="px-4 py-4">
                      {participant.numberOfWords} (
                      {((participant.numberOfWords / (totals?.totalWords ?? 0)) * 100).toFixed(2)}%)
                    </td>
                    <td className="px-4 py-4">
                      {participant.givedReactions} (
                      {((participant.givedReactions / (totals?.totalGivedReactions ?? 0)) * 100).toFixed(2)}%)
                    </td>
                    <td className="px-4 py-4">
                      {participant.receivedReactions} (
                      {((participant.receivedReactions / (totals?.totalReceivedReactions ?? 0)) * 100).toFixed(2)}%)
                    </td>
                    <td className="px-4 py-4">
                      {participant.xDWordAmount} (
                      {((participant.xDWordAmount / (totals?.totalXDWords ?? 0)) * 100).toFixed(2)}%)
                    </td>
                    <td className="px-4 py-4">
                      {participant.kWordAmount} (
                      {((participant.kWordAmount / (totals?.totalKWords ?? 0)) * 100).toFixed(2)}%)
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsTable;
