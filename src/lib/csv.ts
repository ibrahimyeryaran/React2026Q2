import type { Item } from '@/types';

/** Builds a CSV string from selected items. Pure function, shared by the server action. */
export function buildCsv(items: Item[]): string {
  const header = 'id,name,description,detailsUrl,height,weight,types';
  const rows = items.map((item) => {
    const types = (item.types ?? []).join(';');
    const desc = `"${item.description.replace(/"/g, '""')}"`;
    const detailsUrl = `https://pokeapi.co/api/v2/pokemon/${item.id}/`;
    return `${item.id},${item.name},${desc},${detailsUrl},${item.height ?? ''},${item.weight ?? ''},${types}`;
  });
  return [header, ...rows].join('\n');
}
