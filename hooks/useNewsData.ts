import { useState, useEffect } from 'react';
import { NewsItem } from '@/types';
import { fetchNewsItems } from '@/services/newsApi';

export const useNewsData = (initialId: string) => {
  const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const loadNews = async () => {
      const items = await fetchNewsItems();
      setNewsItems(items);
      const index = items.findIndex(item => item.id.toString() === initialId);
      setCurrentIndex(index !== -1 ? index : 0);
    };
    loadNews();
  }, [initialId]);

  return { newsItems, currentIndex, setCurrentIndex };
};