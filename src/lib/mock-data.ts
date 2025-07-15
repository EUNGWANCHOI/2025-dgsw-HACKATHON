
import type { User, Content } from './types';
import { Timestamp } from 'firebase/firestore';

export const MOCK_USERS: User[] = [
  { name: 'Alice', avatarUrl: 'https://i.pravatar.cc/150?u=alice' },
  { name: 'Bob', avatarUrl: 'https://i.pravatar.cc/150?u=bob' },
];

export const MOCK_CONTENTS: Content[] = [
  {
    id: '1',
    title: '나의 첫 단편 영화 시나리오',
    description: '이번에 처음으로 작성해본 단편 영화 시나리오입니다. SF 장르이며, 인공지능과 인간의 우정을 다루고 있습니다. 전체적인 플롯이나 캐릭터 설정에 대한 피드백 부탁드립니다.',
    category: '스크립트',
    content: 'INT. 연구소 - 밤\n\n벽 한 쪽을 가득 채운 모니터들. 그 앞에 앉아있는 서연(28). 모니터에는 복잡한 코드들이 계속해서 올라간다.\n\n서연\n(혼잣말)\n거의 다 됐어, 조금만 더...',
    author: MOCK_USERS[0],
    thumbnailUrl: 'https://placehold.co/600x400.png',
    createdAt: Timestamp.fromDate(new Date('2024-05-20T10:00:00')),
    aiFeedback: {
      deliverySuggestions: [
        '대화의 리듬감을 더 살리면 좋겠습니다.',
        '지문에서 인물의 감정을 더 구체적으로 묘사해보세요.',
      ],
      topicRelevanceFeedback: 'SF 장르 팬들에게 매우 흥미로울 주제입니다.',
      audienceFriendlinessSuggestions: [
        '전문 용어에 대한 간단한 설명을 추가하면 대중적인 접근성이 높아질 것입니다.',
      ],
      overallScore: 0.85,
    },
    communityFeedback: [
      {
        id: 'c1',
        author: MOCK_USERS[1],
        comment: '플롯이 정말 흥미로워요! 다음 내용이 기대됩니다.',
        likes: 15,
        dislikes: 0,
        isAccepted: true,
        createdAt: Timestamp.fromDate(new Date('2024-05-20T11:30:00')),
      },
    ],
  },
    {
    id: '2',
    title: '새로운 유튜브 채널 기획안',
    description: '요리, 특히 베이킹을 주제로 하는 유튜브 채널을 기획하고 있습니다. 주 시청자 층은 20-30대 직장인입니다. 콘텐츠 포맷이나 채널 컨셉에 대한 의견이 궁금합니다.',
    category: '채널 기획',
    content: '1. 채널명: 오븐 디스트릭트\n2. 컨셉: 퇴근 후 즐기는 간단하고 맛있는 베이킹\n3. 주요 콘텐츠: 노오븐 베이킹, 10분 컷 디저트, 주말 브런치',
    author: { name: 'Charlie', avatarUrl: 'https://i.pravatar.cc/150?u=charlie' },
    thumbnailUrl: 'https://placehold.co/600x400.png',
    createdAt: Timestamp.fromDate(new Date('2024-05-21T14:00:00')),
    communityFeedback: [
       {
        id: 'c2',
        author: MOCK_USERS[0],
        comment: '컨셉이 너무 좋아요! 구독하고 싶네요.',
        likes: 22,
        dislikes: 1,
        isAccepted: false,
        createdAt: Timestamp.fromDate(new Date('2024-05-21T15:00:00')),
      },
    ]
  }
];
