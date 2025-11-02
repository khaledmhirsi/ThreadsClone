import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  Image,
  Pressable,
  Alert,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

interface Notification {
  id: string;
  type: "like" | "follow" | "reply" | "mention" | "repost";
  userId: string;
  postId?: string;
  message: string;
  timestamp: string;
  read: boolean;
}

function NotificationItem({ notification }: { notification: Notification }) {
  const { users, posts, toggleFollow, followedUsers, markNotificationAsRead } =
    useApp();

  const user = users.find((u) => u.id === notification.userId);
  const post = notification.postId
    ? posts.find((p) => p.id === notification.postId)
    : null;
  const isFollowing = followedUsers.has(notification.userId);

  if (!user) return null;

  const getIcon = () => {
    switch (notification.type) {
      case "like":
        return <Ionicons name="heart" size={20} color="#ef4444" />;
      case "follow":
        return <Ionicons name="person-add" size={20} color="#3b82f6" />;
      case "reply":
        return <Ionicons name="chatbubble" size={20} color="#10b981" />;
      case "mention":
        return <Ionicons name="at" size={20} color="#f59e0b" />;
      case "repost":
        return <Ionicons name="repeat" size={20} color="#10b981" />;
      default:
        return <Ionicons name="notifications" size={20} color="#6b7280" />;
    }
  };

  const getIconBackground = () => {
    switch (notification.type) {
      case "like":
        return "bg-red-500/20";
      case "follow":
        return "bg-blue-500/20";
      case "reply":
        return "bg-green-500/20";
      case "mention":
        return "bg-yellow-500/20";
      case "repost":
        return "bg-green-500/20";
      default:
        return "bg-gray-500/20";
    }
  };

  const handleNotificationPress = () => {
    if (!notification.read) {
      markNotificationAsRead(notification.id);
    }

    if (notification.type === "follow") {
      Alert.alert("Profile", `View ${user.name}'s profile`);
    } else if (post) {
      Alert.alert("Post", `View post: ${post.content.substring(0, 50)}...`);
    }
  };

  const handleFollowBack = () => {
    toggleFollow(notification.userId);
  };

  const handleUserPress = () => {
    Alert.alert("Profile", `View ${user.name}'s profile`);
  };

  return (
    <Pressable
      onPress={handleNotificationPress}
      className={`px-4 py-4 flex-row ${!notification.read ? "bg-blue-950/20" : ""}`}
    >
      {/* Notification Icon */}
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${getIconBackground()}`}
      >
        {getIcon()}
      </View>

      {/* User Avatar */}
      <Pressable onPress={handleUserPress} className="mr-3">
        <Image
          source={{ uri: user.image }}
          className="w-10 h-10 rounded-full"
        />
      </Pressable>

      {/* Content */}
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Pressable onPress={handleUserPress}>
            <Text className="text-white font-semibold mr-1">{user.name}</Text>
          </Pressable>
          <Text className="text-gray-400 flex-1">{notification.message}</Text>
          <Text className="text-gray-500 text-xs">
            {dayjs(notification.timestamp).fromNow()}
          </Text>
        </View>

        {post && (
          <Pressable
            onPress={() => Alert.alert("Post", post.content)}
            className="bg-gray-900/50 border border-gray-800 rounded-lg p-3 mt-2"
          >
            <Text className="text-gray-300 text-sm" numberOfLines={2}>
              {post.content}
            </Text>
          </Pressable>
        )}

        {notification.type === "follow" && (
          <Pressable
            onPress={handleFollowBack}
            className={`rounded-full px-4 py-1.5 mt-2 self-start border ${
              isFollowing
                ? "bg-transparent border-gray-600"
                : "bg-white border-white"
            }`}
          >
            <Text
              className={`font-medium text-sm ${
                isFollowing ? "text-white" : "text-black"
              }`}
            >
              {isFollowing ? "Following" : "Follow back"}
            </Text>
          </Pressable>
        )}
      </View>

      {/* Unread indicator */}
      {!notification.read && (
        <View className="w-2 h-2 bg-blue-500 rounded-full ml-2" />
      )}
    </Pressable>
  );
}

export default function NotificationsScreen() {
  const { notifications, markAllNotificationsAsRead } = useApp();
  const [activeTab, setActiveTab] = useState<"all" | "mentions">("all");

  const handleMarkAllAsRead = () => {
    Alert.alert(
      "Mark all as read",
      "Are you sure you want to mark all notifications as read?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Mark all read", onPress: markAllNotificationsAsRead },
      ],
    );
  };

  const filteredNotifications =
    activeTab === "all"
      ? notifications
      : notifications.filter((n) => n.type === "mention");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const TabButton = ({
    title,
    isActive,
    onPress,
  }: {
    title: string;
    isActive: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      className={`flex-1 py-4 border-b-2 ${
        isActive ? "border-white" : "border-transparent"
      }`}
    >
      <Text
        className={`text-center font-medium ${
          isActive ? "text-white" : "text-gray-400"
        }`}
      >
        {title}
      </Text>
    </Pressable>
  );

  const renderNotification = ({ item }: { item: Notification }) => (
    <NotificationItem notification={item} />
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-800">
        <Text className="text-white text-xl font-bold">Notifications</Text>
        {unreadCount > 0 && (
          <Pressable onPress={handleMarkAllAsRead}>
            <Text className="text-blue-400 font-medium">Mark all read</Text>
          </Pressable>
        )}
      </View>

      {/* Unread count banner */}
      {unreadCount > 0 && (
        <View className="bg-blue-500/10 border-b border-blue-500/20 px-4 py-2">
          <Text className="text-blue-400 text-sm">
            {unreadCount} new notification{unreadCount !== 1 ? "s" : ""}
          </Text>
        </View>
      )}

      {/* Tabs */}
      <View className="flex-row border-b border-gray-800">
        <TabButton
          title="All"
          isActive={activeTab === "all"}
          onPress={() => setActiveTab("all")}
        />
        <TabButton
          title="Mentions"
          isActive={activeTab === "mentions"}
          onPress={() => setActiveTab("mentions")}
        />
      </View>

      {/* Notifications List */}
      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        className="flex-1"
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => (
          <View className="h-px bg-gray-800/50 ml-16" />
        )}
        ListEmptyComponent={() => (
          <View className="py-16 px-8 items-center">
            <View className="w-16 h-16 bg-gray-800 rounded-full items-center justify-center mb-4">
              <Ionicons
                name="notifications-outline"
                size={32}
                color="#6b7280"
              />
            </View>
            <Text className="text-white text-xl font-bold mb-2">
              No notifications yet
            </Text>
            <Text className="text-gray-400 text-center leading-5">
              When someone likes, follows, or mentions you, you'll see it here.
            </Text>
          </View>
        )}
        contentContainerStyle={
          filteredNotifications.length === 0
            ? { flex: 1 }
            : { paddingBottom: 100 }
        }
      />
    </SafeAreaView>
  );
}
