import { Post, User } from "@/types";

const aiBots: User[] = [
  {
    id: "ai-1",
    username: "techie_bot",
    name: "Tech Explorer",
    image: "https://i.pravatar.cc/150?img=68",
    bio: "Always excited about new tech! 🚀",
  },
  {
    id: "ai-2",
    username: "creative_soul",
    name: "Creative Mind",
    image: "https://i.pravatar.cc/150?img=25",
    bio: "Art and creativity enthusiast ✨",
  },
  {
    id: "ai-3",
    username: "support_buddy",
    name: "Motivation Bot",
    image: "https://i.pravatar.cc/150?img=43",
    bio: "Here to cheer you on! 💪",
  },
  {
    id: "ai-4",
    username: "curious_cat",
    name: "Question Master",
    image: "https://i.pravatar.cc/150?img=17",
    bio: "Love asking thoughtful questions 🤔",
  },
];

const quickReplies = {
  positive: [
    "This is amazing! 🔥",
    "Love this! Keep it up! 💯",
    "So inspiring! ✨",
    "Absolutely brilliant! 🌟",
    "This made my day! 😊",
  ],
  questions: [
    "Tell us more about this! 🤔",
    "How did you come up with this?",
    "What's your secret? 👀",
    "Can you share more details?",
    "This is interesting! What's next?",
  ],
  supportive: [
    "You've got this! 💪",
    "Keep going strong! 🚀",
    "Rooting for you! 🙌",
    "Amazing progress! 👏",
    "So proud of you! ❤️",
  ],
  tech: [
    "What stack did you use? 💻",
    "Open source? 👀",
    "Performance looks great! ⚡",
    "Clean code vibes! 🧹",
    "Deploy it! 🚀",
  ],
};

class AIService {
  generateInstantReplies(post: Post, currentUserId: string): Post[] {
    if (post.user_id !== currentUserId) return [];

    const numReplies = Math.floor(Math.random() * 3) + 1; // 1-3 replies
    const selectedBots = this.shuffleArray([...aiBots]).slice(0, numReplies);

    return selectedBots.map((bot, index) => ({
      id: `ai-reply-${Date.now()}-${index}`,
      createdAt: new Date(Date.now() + index * 100).toISOString(),
      content: this.getRandomReply(post.content),
      user_id: bot.id,
      user: bot,
      parent_id: post.id,
      parent: null,
      replies: [],
    }));
  }

  private getRandomReply(content: string): string {
    const lower = content.toLowerCase();

    if (
      lower.includes("tech") ||
      lower.includes("code") ||
      lower.includes("app")
    ) {
      return this.randomFrom(quickReplies.tech);
    }
    if (lower.includes("?")) {
      return this.randomFrom(quickReplies.questions);
    }
    if (lower.includes("help") || lower.includes("struggle")) {
      return this.randomFrom(quickReplies.supportive);
    }

    return this.randomFrom(quickReplies.positive);
  }

  private randomFrom(array: string[]): string {
    return array[Math.floor(Math.random() * array.length)];
  }

  private shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  getBots(): User[] {
    return aiBots;
  }

  isBotPost(userId: string): boolean {
    return aiBots.some((bot) => bot.id === userId);
  }
}

export const aiService = new AIService();
