export type ContentCategory = 'Video' | 'Script' | 'Podcast' | 'Article';

export interface AIFeedback {
  deliverySuggestions: string[];
  topicRelevanceFeedback: string;
  audienceFriendlinessSuggestions: string[];
  overallScore: number;
}

export interface CommunityComment {
  id: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  comment: string;
  likes: number;
  dislikes: number;
  isAccepted: boolean;
  createdAt: string;
}

export interface Content {
  id: string;
  title: string;
  description: string;
  category: ContentCategory;
  content: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  thumbnailUrl: string;
  createdAt: string;
  aiFeedback: AIFeedback;
  communityFeedback: CommunityComment[];
}
