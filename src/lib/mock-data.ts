import type { Content } from './types';

export const mockUser = {
  name: 'Alex Doe',
  avatarUrl: 'https://i.pravatar.cc/150?u=alexdoe',
};

export const mockContents: Content[] = [
  {
    id: '1',
    title: 'My First Short Film: "The Last Byte"',
    description: 'A story about an old robot discovering music for the first time. This is my directorial debut, looking for feedback on pacing and emotional impact.',
    category: 'Video',
    content: 'Scene 1: An old, rusty robot sits in a dusty workshop. A single sunbeam illuminates a forgotten cassette player. The robot cautiously presses play...',
    author: {
      name: 'Jane Smith',
      avatarUrl: 'https://i.pravatar.cc/150?u=janesmith',
    },
    thumbnailUrl: 'https://placehold.co/600x400.png',
    createdAt: '2 days ago',
    aiFeedback: {
      deliverySuggestions: [
        'The pacing in the first act could be slightly faster to build intrigue.',
        'Consider using more varied camera angles to enhance the robot\'s sense of discovery.',
        'The soundtrack choice is excellent and complements the narrative well.',
      ],
      topicRelevanceFeedback: 'The theme of technology meeting art is timeless and resonates well with a broad audience. It feels fresh and emotionally engaging.',
      audienceFriendlinessSuggestions: [
        'Add subtitles to improve accessibility for all viewers.',
        'The visual storytelling is strong, requiring minimal dialogue, which makes it universally understandable.',
      ],
      overallScore: 0.85,
    },
    communityFeedback: [
      {
        id: 'c1',
        author: { name: 'TechLover22', avatarUrl: 'https://i.pravatar.cc/150?u=techlover' },
        comment: 'Absolutely beautiful! The scene with the sunset made me tear up. The pacing felt perfect to me, really let the moment sink in.',
        likes: 42,
        dislikes: 1,
        isAccepted: true,
        createdAt: '1 day ago',
      },
      {
        id: 'c2',
        author: { name: 'FilmCritique_Pro', avatarUrl: 'https://i.pravatar.cc/150?u=filmpro' },
        comment: 'A promising debut. I agree with the AI about the camera work. A few more dynamic shots would elevate this from good to great. Keep it up!',
        likes: 15,
        dislikes: 0,
        isAccepted: false,
        createdAt: '22 hours ago',
      },
    ],
  },
  {
    id: '2',
    title: 'Podcast Ep. 12: The Future of AI in Creativity',
    description: 'A deep dive into how AI is changing the creative landscape. Special guest Dr. Evelyn Reed. Seeking feedback on audio quality and clarity of arguments.',
    category: 'Podcast',
    content: '(Intro Music) Host: Welcome back to Creative Catalysts. Today, we\'re asking the big question: Is AI a tool, or a threat to artists? We have with us the brilliant Dr. Evelyn Reed...',
    author: {
      name: 'Sam Jones',
      avatarUrl: 'https://i.pravatar.cc/150?u=samjones',
    },
    thumbnailUrl: 'https://placehold.co/600x400.png',
    createdAt: '5 days ago',
    aiFeedback: {
      deliverySuggestions: [
        'Your voice modulation is clear and engaging. The guest\'s audio has a slight echo.',
        'The use of short musical breaks between segments helps maintain listener attention.',
      ],
      topicRelevanceFeedback: 'This is a highly relevant and debated topic. Your balanced approach, presenting both sides of the argument, is a significant strength.',
      audienceFriendlinessSuggestions: [
        'Provide a transcript for accessibility and for listeners who prefer to read.',
        'Define some of the more technical AI terms for a broader audience.',
      ],
      overallScore: 0.92,
    },
    communityFeedback: [
       {
        id: 'c3',
        author: { name: 'AudioPhile', avatarUrl: 'https://i.pravatar.cc/150?u=audiophile' },
        comment: 'Great episode! I noticed the echo on the guest\'s mic too. Maybe try a different mic setup next time? The content was top-notch though!',
        likes: 28,
        dislikes: 0,
        isAccepted: true,
        createdAt: '4 days ago',
      },
    ],
  },
  {
    id: '3',
    title: 'Sci-Fi Script: "Echoes of Jupiter"',
    description: 'First 10 pages of a new sci-fi feature film script. Is the protagonist compelling? Is the dialogue natural?',
    category: 'Script',
    content: 'INT. STARSHIP BRIDGE - NIGHT. Captain Eva Rostova stares at the swirling vortex on the main viewscreen. Her knuckles are white on the console. "Report," she says, her voice steady despite the chaos.',
    author: {
      name: 'Maria Garcia',
      avatarUrl: 'https://i.pravatar.cc/150?u=mariagarcia',
    },
    thumbnailUrl: 'https://placehold.co/600x400.png',
    createdAt: '1 week ago',
    aiFeedback: {
      deliverySuggestions: [
        'The opening scene is visually strong and immediately establishes high stakes.',
        'Protagonist\'s dialogue is sharp and professional, but consider adding a small personal quirk to make her more relatable early on.',
      ],
      topicRelevanceFeedback: 'The "haunted spaceship" trope is popular. Your unique take on it through quantum echoes feels innovative and captures current sci-fi trends.',
      audienceFriendlinessSuggestions: [
        'The use of standard script formatting makes it easy to read and follow.',
        'A short glossary of unique tech terms could be helpful for readers not versed in hard sci-fi.',
      ],
      overallScore: 0.88,
    },
    communityFeedback: [],
  },
];
