import {
  View,
  Text,
  SafeAreaView,
  Image,
  Pressable,
  ScrollView,
  FlatList,
  Alert,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import PostListItem from "@/component/PostListItem";
import ComposeModal from "@/component/ComposeModal";
import { useApp } from "@/context/AppContext";
import { Post } from "@/types";

export default function ProfileScreen() {
  const { posts, currentUser, followedUsers, likedPosts } = useApp();
  const [activeTab, setActiveTab] = useState<"posts" | "replies" | "likes">(
    "posts",
  );
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Get user's posts
  const userPosts = posts.filter(
    (post) => post.user_id === currentUser.id && post.parent_id === null,
  );
  const userReplies = posts.filter(
    (post) => post.user_id === currentUser.id && post.parent_id !== null,
  );
  const userLikedPosts = posts.filter((post) => likedPosts.has(post.id));

  // Mock stats
  const stats = {
    posts: userPosts.length,
    following: followedUsers.size,
    followers: Math.floor(Math.random() * 1000) + 100, // Mock followers
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Edit profile functionality", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Edit Bio",
        onPress: () => Alert.alert("Edit Bio", "Bio editing coming soon"),
      },
      {
        text: "Change Avatar",
        onPress: () => Alert.alert("Avatar", "Avatar change coming soon"),
      },
    ]);
  };

  const handleShare = () => {
    Alert.alert("Share Profile", `Share ${currentUser.name}'s profile`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Copy Link",
        onPress: () =>
          Alert.alert("Link Copied", "Profile link copied to clipboard"),
      },
      {
        text: "Share via...",
        onPress: () => Alert.alert("Share", "Share options would open here"),
      },
    ]);
  };

  const handleSettings = () => {
    Alert.alert("Settings", "What would you like to do?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Privacy Settings",
        onPress: () => Alert.alert("Privacy", "Privacy settings coming soon"),
      },
      {
        text: "Account Settings",
        onPress: () => Alert.alert("Account", "Account settings coming soon"),
      },
      {
        text: "Help & Support",
        onPress: () => Alert.alert("Help", "Help & support coming soon"),
      },
    ]);
  };

  const handleFollowing = () => {
    Alert.alert("Following", `You are following ${followedUsers.size} users`);
  };

  const handleFollowers = () => {
    Alert.alert("Followers", `You have ${stats.followers} followers`);
  };

  const handleCreatePost = () => {
    setShowComposeModal(true);
  };

  const renderPost = ({ item }: { item: Post }) => <PostListItem post={item} />;

  const getTabData = () => {
    switch (activeTab) {
      case "posts":
        return userPosts;
      case "replies":
        return userReplies;
      case "likes":
        return userLikedPosts;
      default:
        return userPosts;
    }
  };

  const TabButton = ({
    title,
    count,
    isActive,
    onPress,
  }: {
    title: string;
    count: number;
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
        {title} ({count})
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-800">
        <Pressable onPress={() => Alert.alert("Back", "Navigate back")}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </Pressable>
        <View className="flex-1 items-center">
          <Text className="text-white text-lg font-bold">
            {currentUser.name}
          </Text>
          <Text className="text-gray-400 text-sm">{stats.posts} posts</Text>
        </View>
        <Pressable onPress={handleSettings}>
          <Ionicons name="ellipsis-horizontal" size={24} color="white" />
        </Pressable>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View className="px-4 py-6">
          {/* Avatar and Action Buttons */}
          <View className="flex-row items-start justify-between mb-4">
            <Pressable
              onPress={() => Alert.alert("Avatar", "View full size avatar")}
            >
              <Image
                source={{ uri: currentUser.image }}
                className="w-20 h-20 rounded-full"
              />
            </Pressable>
            <View className="flex-row gap-2">
              <Pressable
                onPress={handleEditProfile}
                className="px-4 py-2 border border-gray-600 rounded-full"
              >
                <Text className="text-white font-medium">Edit profile</Text>
              </Pressable>
              <Pressable
                onPress={handleShare}
                className="px-4 py-2 border border-gray-600 rounded-full"
              >
                <Ionicons name="share-outline" size={16} color="white" />
              </Pressable>
            </View>
          </View>

          {/* User Info */}
          <View className="mb-4">
            <Text className="text-white text-xl font-bold mb-1">
              {currentUser.name}
            </Text>
            <Text className="text-gray-400 mb-3">@{currentUser.username}</Text>
            <Text className="text-white leading-5 mb-3">{currentUser.bio}</Text>

            {/* Join Date */}
            <View className="flex-row items-center mb-3">
              <Ionicons name="calendar-outline" size={16} color="#6b7280" />
              <Text className="text-gray-400 ml-2">Joined May 2024</Text>
            </View>

            {/* Stats */}
            <View className="flex-row">
              <Pressable onPress={handleFollowing} className="mr-6">
                <Text className="text-white">
                  <Text className="font-bold">{stats.following}</Text>
                  <Text className="text-gray-400"> Following</Text>
                </Text>
              </Pressable>
              <Pressable onPress={handleFollowers}>
                <Text className="text-white">
                  <Text className="font-bold">{stats.followers}</Text>
                  <Text className="text-gray-400"> Followers</Text>
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="flex-row gap-3 mb-4">
            <Pressable
              onPress={handleCreatePost}
              className="flex-1 bg-blue-500 py-3 rounded-full items-center"
            >
              <Text className="text-white font-semibold">New Post</Text>
            </Pressable>
            <Pressable
              onPress={() =>
                Alert.alert("Message", "Direct message functionality")
              }
              className="flex-1 border border-gray-600 py-3 rounded-full items-center"
            >
              <Text className="text-white font-semibold">Message</Text>
            </Pressable>
          </View>
        </View>

        {/* Tabs */}
        <View className="flex-row border-b border-gray-800">
          <TabButton
            title="Posts"
            count={userPosts.length}
            isActive={activeTab === "posts"}
            onPress={() => setActiveTab("posts")}
          />
          <TabButton
            title="Replies"
            count={userReplies.length}
            isActive={activeTab === "replies"}
            onPress={() => setActiveTab("replies")}
          />
          <TabButton
            title="Likes"
            count={userLikedPosts.length}
            isActive={activeTab === "likes"}
            onPress={() => setActiveTab("likes")}
          />
        </View>

        {/* Posts List */}
        <View className="flex-1">
          {getTabData().length > 0 ? (
            <FlatList
              data={getTabData()}
              renderItem={renderPost}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => (
                <View className="h-px bg-gray-800/50" />
              )}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          ) : (
            <View className="py-16 px-8 items-center">
              <View className="w-16 h-16 bg-gray-800 rounded-full items-center justify-center mb-4">
                <Ionicons
                  name={
                    activeTab === "posts"
                      ? "document-text-outline"
                      : activeTab === "replies"
                        ? "chatbubble-outline"
                        : "heart-outline"
                  }
                  size={32}
                  color="#6b7280"
                />
              </View>
              <Text className="text-white text-xl font-bold mb-2">
                {activeTab === "posts"
                  ? "No posts yet"
                  : activeTab === "replies"
                    ? "No replies yet"
                    : "No likes yet"}
              </Text>
              <Text className="text-gray-400 text-center leading-5 mb-4">
                {activeTab === "posts"
                  ? "Share your thoughts with the world."
                  : activeTab === "replies"
                    ? "Join the conversation by replying to posts."
                    : "Tap the heart on posts you love."}
              </Text>
              {activeTab === "posts" && (
                <Pressable
                  onPress={handleCreatePost}
                  className="bg-blue-500 px-6 py-3 rounded-full"
                >
                  <Text className="text-white font-semibold">Create Post</Text>
                </Pressable>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Compose Modal */}
      <ComposeModal
        visible={showComposeModal}
        onClose={() => setShowComposeModal(false)}
      />
    </SafeAreaView>
  );
}
