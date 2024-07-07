import { fetchAllItems } from '@/actions/items';

export default async function sitemap() {
  const items = await fetchAllItems();

  let itemRoutes = items.map((item) => ({
    url: `https://www.ronaoff.com/item/${item.id}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  let routes = ['', '/liked', '/top', '/new'].map((route) => ({
    url: `https://www.ronaoff.com${route}`,
    lastModified: new Date().toISOString().split('T')[0],
  }));

  return [...routes, ...itemRoutes];
}
