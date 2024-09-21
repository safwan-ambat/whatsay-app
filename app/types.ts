
  
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
    setIsCommentModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
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

//comment section

export interface User {
  id: string;
  name: string;
  avatar: string;
}

export interface CommentProp {
  id: string;
  author: User;
  content: string;
  timestamp: string;
  likesCount: number;
  repliesCount: number;
  liked: boolean;
}

export interface Reply extends Omit<CommentProp, 'repliesCount'> {
  commentId: string;
}