import { fetchAllItems } from '@/actions/items';
import { SearchBar } from './search-bar';

export const SearchBarWrapper = async () => {
  const items = await fetchAllItems();

  return <SearchBar items={items} />;
};
