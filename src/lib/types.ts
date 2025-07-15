export type ContentCategory = '영상' | '스크립트' | '팟캐스트' | '아티클' | '채널 기획';

export interface User {
  name: string;
  avatarUrl: string;
}

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
  author: User;
  thumbnailUrl: string;
  createdAt: string;
  aiFeedback: AIFeedback;
  communityFeedback: CommunityComment[];
}
