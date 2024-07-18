import {
  fetchTransactions,
  fetchTransactionsPerItem,
} from '@/actions/transactions';
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
    queryKey: ['infiniteTransactions'],
    queryFn: async ({ pageParam }) => {
      const transactions = fetchTransactions({ pageParam });
      return transactions;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < ITEMS_PER_PAGE) {
        return undefined;
      }
      return pages.length;
    },

    initialData: {
      pageParams: [0],
      pages: [initialLists],
    },
  });

export const useInfiniteTransactionsPerItem = ({
  id,
  sortType = 'timeDESC',
}: {
  id: number;
  sortType?: 'timeASC' | 'timeDESC' | 'priceASC' | 'priceDESC';
}) => {
  return useInfiniteQuery({
    queryKey: ['infiniteTransactions', 'perItem', id, sortType],
    queryFn: async ({ pageParam }) => {
      const transactions = fetchTransactionsPerItem({
        pageParam,
        id,
        sortType,
      });
      return transactions;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, pages) => {
      if (lastPage.length < ITEMS_PER_PAGE) {
        return undefined;
      }
      return pages.length;
    },
  });
};
