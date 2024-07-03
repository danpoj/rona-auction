import { fetchTransactions } from '@/actions/transactions';
import { ITEMS_PER_PAGE } from '@/constants';
import { useInfiniteQuery } from '@tanstack/react-query';

export const useInfiniteTransactions = () =>
  useInfiniteQuery({
    queryKey: ['transactions'],
    queryFn: async ({ pageParam }) => {
      const transactions = fetchTransactions({ pageParam });
      return transactions;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < ITEMS_PER_PAGE) {
        return undefined; // No more pages
      }
      return pages.length;
    },
  });
