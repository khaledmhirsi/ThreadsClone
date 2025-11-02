import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { User, Post } from "@/types";
import { dummyUsers, dummyPosts } from "@/dummyData";
import { aiService } from "@/services/AIService";

interface AppContextType {
  // Posts
  posts: Post[];
  addPost: (content: string, parentId?: string) => void;
  deletePost: (postId: string) => void;

  // Interactions
  likedPosts: Set<string>;
  retweetedPosts: Set<string>;
  toggleLike: (postId: string) => void;
  toggleRetweet: (postId: string) => void;

  // Users
  users: User[];
  currentUser: User;
  followedUsers: Set<string>;
  toggleFollow: (userId: string) => void;

  // Notifications
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, "id">) => void;
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;

  // AI Settings
  aiEnabled: boolean;
  toggleAI: () => void;

  // Toast Notifications
  toastVisible: boolean;
  toastMessage: string;
  toastType: "success" | "info" | "warning" | "ai";
  showToast: (
    message: string,
    type?: "success" | "info" | "warning" | "ai",
  ) => void;

  // Settings
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

interface Notification {
  id: string;
  type: "like" | "follow" | "reply" | "mention" | "repost";
  userId: string;
  postId?: string;
  message: string;
  timestamp: string;
  read: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(dummyPosts);
  const [users, setUsers] = useState<User[]>(() => [
    ...dummyUsers,
    ...aiService.getBots(),
  ]);

  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());
  const [retweetedPosts, setRetweetedPosts] = useState<Set<string>>(new Set());
  const [followedUsers, setFollowedUsers] = useState<Set<string>>(
    new Set(["2", "3"]),
  );
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [currentTab, setCurrentTab] = useState("index");
  const [aiEnabled, setAiEnabled] = useState(true);

  // Toast state
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<
    "success" | "info" | "warning" | "ai"
  >("info");
  const [toastVisible, setToastVisible] = useState(false);

  const currentUser = dummyUsers[0];

  const addPost = (content: string, parentId?: string) => {
    const newPost: Post = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      content,
      user_id: currentUser.id,
      user: currentUser,
      parent_id: parentId || null,
      parent: null,
      replies: [],
    };

    setPosts((prev) => [newPost, ...prev]);

    // Generate instant AI replies for current user's posts
    if (aiEnabled && !parentId && newPost.user_id === currentUser.id) {
      setTimeout(() => {
        const aiReplies = aiService.generateInstantReplies(
          newPost,
          currentUser.id,
        );

        if (aiReplies.length > 0) {
          setPosts((prev) => [...aiReplies, ...prev]);

          // Show toast for AI engagement
          showToast(
            `${aiReplies.length} people replied to your post! 🎉`,
            "ai",
          );

          // Add notifications for AI replies
          aiReplies.forEach((reply) => {
            addNotification({
              type: "reply",
              userId: reply.user_id,
              postId: newPost.id,
              message: "replied to your post",
              timestamp: new Date().toISOString(),
              read: false,
            });
          });
        }
      }, 200); // Small delay to feel natural
    }

    // Add notification if it's a reply to someone else
    if (parentId) {
      const parentPost = posts.find((p) => p.id === parentId);
      if (parentPost && parentPost.user_id !== currentUser.id) {
        addNotification({
          type: "reply",
          userId: currentUser.id,
          postId: parentPost.id,
          message: "replied to your post",
          timestamp: new Date().toISOString(),
          read: false,
        });
      }
    }
  };

  const deletePost = (postId: string) => {
    setPosts((prev) =>
      prev.filter((post) => post.id !== postId && post.parent_id !== postId),
    );

    showToast("Post deleted successfully", "success");
  };

  const toggleLike = (postId: string) => {
    const newLikedPosts = new Set(likedPosts);
    const post = posts.find((p) => p.id === postId);

    if (newLikedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);

      // Add notification if liking someone else's post
      if (
        post &&
        post.user_id !== currentUser.id &&
        !aiService.isBotPost(post.user_id)
      ) {
        addNotification({
          type: "like",
          userId: currentUser.id,
          postId: postId,
          message: "liked your post",
          timestamp: new Date().toISOString(),
          read: false,
        });
      }
    }

    setLikedPosts(newLikedPosts);
  };

  const toggleRetweet = (postId: string) => {
    const newRetweetedPosts = new Set(retweetedPosts);
    const post = posts.find((p) => p.id === postId);

    if (newRetweetedPosts.has(postId)) {
      newRetweetedPosts.delete(postId);
    } else {
      newRetweetedPosts.add(postId);

      // Add notification if retweeting someone else's post
      if (
        post &&
        post.user_id !== currentUser.id &&
        !aiService.isBotPost(post.user_id)
      ) {
        addNotification({
          type: "repost",
          userId: currentUser.id,
          postId: postId,
          message: "reposted your post",
          timestamp: new Date().toISOString(),
          read: false,
        });
      }
    }

    setRetweetedPosts(newRetweetedPosts);
  };

  const toggleFollow = (userId: string) => {
    const newFollowedUsers = new Set(followedUsers);

    if (newFollowedUsers.has(userId)) {
      newFollowedUsers.delete(userId);
    } else {
      newFollowedUsers.add(userId);

      // Add notification when following someone (except bots)
      if (!aiService.isBotPost(userId)) {
        addNotification({
          type: "follow",
          userId: currentUser.id,
          message: "started following you",
          timestamp: new Date().toISOString(),
          read: false,
        });
      }
    }

    setFollowedUsers(newFollowedUsers);
  };

  const toggleAI = () => {
    setAiEnabled((prev) => !prev);
    showToast(aiEnabled ? "AI replies disabled" : "AI replies enabled", "info");
  };

  const addNotification = (notification: Omit<Notification, "id">) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
    };

    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification,
      ),
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) =>
      prev.map((notification) => ({ ...notification, read: true })),
    );
  };

  const showToast = (
    message: string,
    type: "success" | "info" | "warning" | "ai" = "info",
  ) => {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);

    setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  };

  const value: AppContextType = {
    posts,
    addPost,
    deletePost,
    likedPosts,
    retweetedPosts,
    toggleLike,
    toggleRetweet,
    users,
    currentUser,
    followedUsers,
    toggleFollow,
    notifications,
    addNotification,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    aiEnabled,
    toggleAI,
    toastVisible,
    toastMessage,
    toastType,
    showToast,
    currentTab,
    setCurrentTab,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}
