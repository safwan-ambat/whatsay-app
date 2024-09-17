
  
  export interface Comment {
    id: string;
    author: string;
    content: string;
    timestamp: string;
  }

  export interface NewsCategory {
    category: string;
    data: NewsItem[];
  }

  export interface ExpandedNewsItemProps {
    items: NewsItem[];
    initialIndex: number;
    isVisible: boolean;
    onClose: () => void;
  }

  export interface NewsItem {
    category?:string;
    id: number;
    title: string;
    text: string;
    image: any;
    // Remove the 'category' property from NewsItem
  }
  
  export interface NewsCategory {
    category: string;
    data: NewsItem[];
  }