import {
  View,
  Text,
  Image,
  Pressable,
  Alert,
  ActionSheetIOS,
  Platform,
} from "react-native";
import { Post } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import ComposeModal from "./ComposeModal";
import { aiService } from "@/services/AIService";

dayjs.extend(relativeTime);

export default function PostListItem({ post }: { post: Post }) {
  const {
    likedPosts,
    retweetedPosts,
    toggleLike,
    toggleRetweet,
    currentUser,
    deletePost,
  } = useApp();

  const [showReplyModal, setShowReplyModal] = useState(false);
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 100));
  const [retweetCount, setRetweetCount] = useState(
    Math.floor(Math.random() * 20),
  );

  const isLiked = likedPosts.has(post.id);
  const isRetweeted = retweetedPosts.has(post.id);
  const isOwnPost = post.user_id === currentUser.id;
  const isAIPost = aiService.isBotPost(post.user_id);

  const handleLike = () => {
    toggleLike(post.id);
    setLikeCount((prev) => (isLiked ? prev - 1 : prev + 1));
  };

  const handleRetweet = () => {
    toggleRetweet(post.id);
    setRetweetCount((prev) => (isRetweeted ? prev - 1 : prev + 1));
  };

  const handleReply = () => {
    setShowReplyModal(true);
  };

  const handleShare = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Copy Link", "Share via..."],
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            Alert.alert("Link Copied", "Post link copied to clipboard");
          } else if (buttonIndex === 2) {
            Alert.alert("Share", "Share functionality would open here");
          }
        },
      );
    } else {
      Alert.alert("Share", "Share functionality would open here");
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Post",
      "This will permanently delete your post and all replies to it.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            deletePost(post.id);
          },
        },
      ],
    );
  };

  const handlePostPress = () => {
    if (isOwnPost) {
      Alert.alert("Post Options", "What would you like to do?", [
        { text: "Cancel", style: "cancel" },
        {
          text: "Edit",
          onPress: () => Alert.alert("Edit", "Edit functionality coming soon"),
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Delete Post",
              "Are you sure you want to delete this post?",
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Delete",
                  style: "destructive",
                  onPress: () => deletePost(post.id),
                },
              ],
            );
          },
        },
      ]);
    }
  };

  const handleUserPress = () => {
    Alert.alert("Profile", `View ${post.user.name}'s profile`);
  };

  return (
    <>
      <Pressable
        onLongPress={handlePostPress}
        className={`px-4 py-3 ${isAIPost ? "bg-blue-950/20 border-l-2 border-blue-500/50" : "bg-black"}`}
        delayLongPress={500}
      >
        <View className="flex-row">
          {/* User Avatar */}
          <Pressable onPress={handleUserPress} className="mr-3">
            <Image
              source={{ uri: post.user.image }}
              className="w-12 h-12 rounded-full"
            />
          </Pressable>

          {/* Content */}
          <View className="flex-1">
            {/* User Info */}
            <Pressable
              onPress={handleUserPress}
              className="flex-row items-center mb-1"
            >
              <Text className="text-white font-bold text-base mr-2">
                {post.user.name}
              </Text>
              <Text className="text-gray-500 text-sm mr-2">
                @{post.user.username}
              </Text>
              <Text className="text-gray-500 text-sm">·</Text>
              <Text className="text-gray-500 text-sm ml-2">
                {dayjs(post.createdAt).fromNow()}
              </Text>
              {isOwnPost && (
                <View className="ml-2">
                  <Ionicons name="person" size={12} color="#3b82f6" />
                </View>
              )}
              {isAIPost && (
                <View className="ml-2 flex-row items-center">
                  <Ionicons name="hardware-chip" size={12} color="#10b981" />
                  <Text className="text-green-400 text-xs ml-1 font-medium">
                    BOT
                  </Text>
                </View>
              )}
            </Pressable>

            {/* Post Content */}
            <Text
              className={`text-base leading-5 mb-3 ${isAIPost ? "text-blue-100" : "text-white"}`}
            >
              {post.content}
            </Text>

            {/* Interaction Buttons */}
            <View className="flex-row justify-between max-w-sm">
              {/* Reply */}
              <Pressable
                className="flex-row items-center"
                onPress={handleReply}
              >
                <View className="p-2 rounded-full active:bg-blue-500/20">
                  <Ionicons
                    name="chatbubble-outline"
                    size={18}
                    color="#6b7280"
                  />
                </View>
                <Text className="text-gray-400 text-sm ml-1">
                  {post.replies.length}
                </Text>
              </Pressable>

              {/* Retweet */}
              <Pressable
                className="flex-row items-center"
                onPress={handleRetweet}
              >
                <View
                  className={`p-2 rounded-full ${isRetweeted ? "active:bg-green-500/20" : "active:bg-gray-500/20"}`}
                >
                  <Ionicons
                    name="repeat"
                    size={18}
                    color={isRetweeted ? "#10b981" : "#6b7280"}
                  />
                </View>
                <Text
                  className={`text-sm ml-1 ${isRetweeted ? "text-green-500" : "text-gray-400"}`}
                >
                  {retweetCount}
                </Text>
              </Pressable>

              {/* Like */}
              <Pressable className="flex-row items-center" onPress={handleLike}>
                <View
                  className={`p-2 rounded-full ${isLiked ? "active:bg-red-500/20" : "active:bg-gray-500/20"}`}
                >
                  <Ionicons
                    name={isLiked ? "heart" : "heart-outline"}
                    size={18}
                    color={isLiked ? "#ef4444" : "#6b7280"}
                  />
                </View>
                <Text
                  className={`text-sm ml-1 ${isLiked ? "text-red-500" : "text-gray-400"}`}
                >
                  {likeCount}
                </Text>
              </Pressable>

              {/* Delete (only for own posts) */}
              {isOwnPost && (
                <Pressable
                  className="flex-row items-center"
                  onPress={handleDelete}
                >
                  <View className="p-2 rounded-full active:bg-red-500/20">
                    <Ionicons name="trash-outline" size={18} color="#ef4444" />
                  </View>
                </Pressable>
              )}

              {/* Share */}
              <Pressable
                className="flex-row items-center"
                onPress={handleShare}
              >
                <View className="p-2 rounded-full active:bg-gray-500/20">
                  <Ionicons name="share-outline" size={18} color="#6b7280" />
                </View>
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>

      {/* Reply Modal */}
      <ComposeModal
        visible={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        replyToPost={post}
      />
    </>
  );
}
