import type { Content, User } from './types';

// This is a mock database. In a real application, you would connect to a real database.
export const MOCK_USER: User = {
  name: '김현준',
  avatarUrl: 'https://i.pravatar.cc/150?u=hyunjun',
};

export const MOCK_CONTENTS: Content[] = [
    {
    id: '1',
    title: '제 첫 유튜브 영상 스크립트입니다',
    description: 'IT 기술을 쉽게 설명하는 영상의 스크립트 초안입니다. 흐름이나 어려운 용어가 있는지 피드백 부탁드립니다.',
    category: '스크립트',
    content: '1장: 낡고 녹슨 로봇이 먼지 쌓인 작업장에 앉아 있습니다. 한 줄기 햇살이 잊혀진 카세트 플레이어를 비춥니다. 로봇은 조심스럽게 재생 버튼을 누릅니다...',
    author: {
      name: '김민준',
      avatarUrl: 'https://i.pravatar.cc/150?u=minjun',
    },
    thumbnailUrl: 'https://placehold.co/600x400.png',
    createdAt: '2일 전',
    aiFeedback: {
      deliverySuggestions: [
        '첫 부분의 속도감을 조금 더 높여 흥미를 유발하면 좋을 것 같습니다.',
        '로봇의 발견 과정을 강조하기 위해 더 다양한 카메라 각도를 사용하는 것을 고려해보세요.',
        '사운드트랙 선택이 훌륭하며 이야기와 잘 어울립니다.',
      ],
      topicRelevanceFeedback: '기술과 예술의 만남이라는 주제는 시대를 초월하여 폭넓은 공감을 얻을 수 있습니다. 신선하고 감성적으로 다가옵니다.',
      audienceFriendlinessSuggestions: [
        '모든 시청자가 쉽게 접근할 수 있도록 자막을 추가하는 것이 좋습니다.',
        '대화가 거의 필요 없는 강력한 시각적 스토리텔링 덕분에 보편적으로 이해하기 쉽습니다.',
      ],
      overallScore: 0.88,
    },
    communityFeedback: [
      {
        id: 'c1',
        author: { name: '테크러버22', avatarUrl: 'https://i.pravatar.cc/150?u=techlover' },
        comment: '정말 아름다워요! 해질녘 장면에서 눈물이 났습니다. 제게는 속도감이 완벽하게 느껴졌어요. 순간에 깊이 몰입할 수 있었습니다.',
        likes: 88,
        dislikes: 1,
        isAccepted: true,
        createdAt: '1일 전',
      },
      {
        id: 'c2',
        author: { name: '영화평론가_프로', avatarUrl: 'https://i.pravatar.cc/150?u=filmpro' },
        comment: '기대되는 데뷔작이네요. 카메라 워크에 대한 AI 의견에 동의합니다. 좀 더 역동적인 샷 몇 개만 추가하면 좋은 작품에서 훌륭한 작품으로 거듭날 수 있을 거예요. 계속 화이팅!',
        likes: 15,
        dislikes: 0,
        isAccepted: false,
        createdAt: '22시간 전',
      },
    ],
  },
  {
    id: '2',
    title: '요리 채널 기획안',
    description: '10분 안에 만드는 간단한 자취 요리 컨셉의 채널입니다. 채널의 방향성이나 콘텐츠 아이디어에 대한 피드백을 구합니다.',
    category: '채널 기획',
    content: '(인트로 음악) 안녕하세요, 크리에이티브 캐털리스트에 오신 것을 환영합니다. 오늘 우리는 큰 질문을 던져보려 합니다: AI는 예술가에게 도구일까요, 위협일까요? 저희와 함께할 분은 바로 똑똑한 에블린 리드 박사님입니다...',
    author: {
      name: '이서연',
      avatarUrl: 'https://i.pravatar.cc/150?u=seoyeon',
    },
    thumbnailUrl: 'https://placehold.co/600x400.png',
    createdAt: '5일 전',
    aiFeedback: {
      deliverySuggestions: [
        '목소리 톤 조절이 명확하고 매력적입니다. 게스트의 오디오에 약간의 울림이 있습니다.',
        '세그먼트 사이에 짧은 음악을 삽입하여 청취자의 집중력을 유지하는 데 도움이 됩니다.',
      ],
      topicRelevanceFeedback: '이것은 매우 관련성이 높고 논쟁의 여지가 많은 주제입니다. 주장의 양쪽 측면을 모두 제시하는 균형 잡힌 접근 방식이 큰 강점입니다.',
      audienceFriendlinessSuggestions: [
        '접근성을 위해, 그리고 읽기를 선호하는 청취자를 위해 대본을 제공하세요.',
        '더 넓은 청중을 위해 일부 기술적인 AI 용어를 정의해주세요.',
      ],
      overallScore: 0.92,
    },
    communityFeedback: [
       {
        id: 'c3',
        author: { name: '오디오파일', avatarUrl: 'https://i.pravatar.cc/150?u=audiophile' },
        comment: '훌륭한 에피소드였습니다! 저도 게스트 마이크에서 울림을 느꼈어요. 다음에는 다른 마이크 설정을 시도해보시는 건 어떨까요? 내용은 최고였습니다!',
        likes: 152,
        dislikes: 0,
        isAccepted: true,
        createdAt: '4일 전',
      },
    ],
  },
];
