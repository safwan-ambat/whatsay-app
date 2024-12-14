

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
  category?: string;
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
  pic: string;
}

export interface ArticleComment {
  article_id: string; // ID of the article associated with the comment
  comment: string; // Content of the comment
  created_at: string; // Date and time the comment was created
  id: string; // Unique identifier for the comment
  likes: string[]; // Array of user IDs who liked the comment
  parent_id: string | null; // Parent comment ID (if it's a reply)
  replies: Comment[]; // Array of replies to the comment
  replies_count: number; // Total number of replies
  updated_at: string; // Date and time the comment was last updated
  user: User; // User who posted the comment
  user_id: string; // User ID of the commenter
}


 export interface ExpandableInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  placeholderTextColor: string;
  replyingTo: any | null;
  onCancelReply: () => void;
}