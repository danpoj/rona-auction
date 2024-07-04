import { fetchTransactions } from '@/actions/transactions';
import { ITEMS_PER_PAGE } from '@/constants';
import { transactionTable } from '@/db/schema';
import { useInfiniteQuery } from '@tanstack/react-query';
import { InferSelectModel } from 'drizzle-orm';

export const useInfiniteTransactions = ({
  initialLists,
}: {
  initialLists: InferSelectModel<typeof transactionTable>[];
}) =>
  useInfiniteQuery({
    queryKey: ['transactions'],
    queryFn: async ({ pageParam }) => {
      const transactions = fetchTransactions({ pageParam });
      return transactions;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < ITEMS_PER_PAGE) {
        return undefined; // No more pages
      }
      return pages.length;
    },

    initialData: {
      pageParams: [0],
      pages: [initialLists],
    },
  });
