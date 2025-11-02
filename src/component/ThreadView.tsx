import { View, Text, FlatList, Pressable } from "react-native";
import { useState } from "react";
import { Post } from "@/types";
import PostListItem from "./PostListItem";
import ComposeModal from "./ComposeModal";
import { Ionicons } from "@expo/vector-icons";

interface ThreadViewProps {
  post: Post;
  replies: Post[];
  onReplyPress?: (post: Post) => void;
}

export default function ThreadView({
  post,
  replies,
  onReplyPress,
}: ThreadViewProps) {
  const [showReplies, setShowReplies] = useState(false);
  const [showReplyModal, setShowReplyModal] = useState(false);

  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  const handleReplyToThread = () => {
    setShowReplyModal(true);
  };

  const renderReply = ({ item, index }: { item: Post; index: number }) => (
    <View className="ml-12 relative">
      {/* Thread line */}
      {index < replies.length - 1 && (
        <View className="absolute left-6 top-0 bottom-0 w-px bg-gray-700" />
      )}

      {/* Reply connection line */}
      <View className="absolute left-0 top-6 w-6 h-px bg-gray-700" />

      <PostListItem post={item} />
    </View>
  );

  const renderShowRepliesButton = () => {
    if (replies.length === 0) return null;

    return (
      <Pressable
        onPress={toggleReplies}
        className="ml-16 mb-2 flex-row items-center"
      >
        <View className="flex-row items-center bg-gray-800/50 px-3 py-1 rounded-full">
          <Ionicons
            name={showReplies ? "chevron-up" : "chevron-down"}
            size={16}
            color="#9ca3af"
          />
          <Text className="text-gray-400 text-sm ml-2">
            {showReplies ? "Hide" : "Show"} {replies.length} repl
            {replies.length === 1 ? "y" : "ies"}
          </Text>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="bg-black">
      {/* Main Post */}
      <PostListItem post={post} />

      {/* Show/Hide Replies Button */}
      {renderShowRepliesButton()}

      {/* Replies */}
      {showReplies && replies.length > 0 && (
        <View className="border-l border-gray-700 ml-6">
          <FlatList
            data={replies}
            renderItem={renderReply}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            ItemSeparatorComponent={() => (
              <View className="h-px bg-gray-800/30 ml-12" />
            )}
          />
        </View>
      )}

      {/* Reply to thread button */}
      <Pressable
        onPress={handleReplyToThread}
        className="ml-16 mb-4 flex-row items-center"
      >
        <View className="flex-row items-center bg-blue-500/10 border border-blue-500/30 px-4 py-2 rounded-full">
          <Ionicons name="chatbubble-outline" size={16} color="#3b82f6" />
          <Text className="text-blue-400 text-sm ml-2 font-medium">
            Reply to thread
          </Text>
        </View>
      </Pressable>

      {/* Reply Modal */}
      <ComposeModal
        visible={showReplyModal}
        onClose={() => setShowReplyModal(false)}
        replyToPost={post}
      />
    </View>
  );
}
