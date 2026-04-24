import cheerio from 'cheerio';

import { Category } from './types';

export const getCategories = async (): Promise<Array<Category>> => {
  const response = await fetch('/categories/');
  const body = await response.text();
  const $ = cheerio.load(body);

  const categories: Category[] = [];

  const getImageUrl = (src: string | undefined): string => {
    if (!src) return '';
    if (src.startsWith('//')) return src.replace('//', 'https://');
    return src;
  };

  // Parse straight categories from tab1
  $('#tab1 .thumbs-categories a').each((i, element) => {
    categories.push({
      name: $('span.title', element)
        .text()
        .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase())),
      image: getImageUrl($('img', element).attr('src')),
      slug: $(element).attr('href')?.split('/').filter(Boolean).pop() || '',
      orientation: 'straight' as const,
    });
  });

  // Parse gay categories from tab2
  $('#tab2 .thumbs-categories a').each((i, element) => {
    categories.push({
      name: $('span.title', element)
        .text()
        .replace(/\w\S*/g, (w) => w.replace(/^\w/, (c) => c.toUpperCase())),
      image: getImageUrl($('img', element).attr('src')),
      slug: $(element).attr('href')?.split('/').filter(Boolean).pop() || '',
      orientation: 'gay' as const,
    });
  });

  return categories;
};
