import {
  View,
  Text,
  Modal,
  TextInput,
  Pressable,
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";
import { Post } from "@/types";

interface ComposeModalProps {
  visible: boolean;
  onClose: () => void;
  replyToPost?: Post;
}

export default function ComposeModal({
  visible,
  onClose,
  replyToPost,
}: ComposeModalProps) {
  const { currentUser, addPost } = useApp();
  const [content, setContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);

  const maxLength = 280;
  const remainingChars = maxLength - content.length;

  const handlePost = async () => {
    if (content.trim().length === 0) {
      Alert.alert("Error", "Please write something before posting.");
      return;
    }

    if (content.length > maxLength) {
      Alert.alert("Error", `Post is too long. Maximum ${maxLength} characters allowed.`);
      return;
    }

    setIsPosting(true);

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      addPost(content.trim(), replyToPost?.id);
      setContent("");
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to post. Please try again.");
    } finally {
      setIsPosting(false);
    }
  };

  const handleClose = () => {
    if (content.trim().length > 0) {
      Alert.alert(
        "Discard post?",
        "You have unsaved changes. Are you sure you want to close?",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Discard", style: "destructive", onPress: () => {
            setContent("");
            onClose();
          }},
        ]
      );
    } else {
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1 bg-black"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-800">
          <Pressable onPress={handleClose} disabled={isPosting}>
            <Text className="text-white text-base">Cancel</Text>
          </Pressable>

          <Text className="text-white text-lg font-semibold">
            {replyToPost ? "Reply" : "New Thread"}
          </Text>

          <Pressable
            onPress={handlePost}
            disabled={content.trim().length === 0 || isPosting || remainingChars < 0}
            className={`px-4 py-2 rounded-full ${
              content.trim().length === 0 || isPosting || remainingChars < 0
                ? "bg-blue-500/50"
                : "bg-blue-500"
            }`}
          >
            <Text
              className={`font-semibold ${
                content.trim().length === 0 || isPosting || remainingChars < 0
                  ? "text-white/50"
                  : "text-white"
              }`}
            >
              {isPosting ? "Posting..." : replyToPost ? "Reply" : "Post"}
            </Text>
          </Pressable>
        </View>

        {/* Reply context */}
        {replyToPost && (
          <View className="px-4 py-3 border-b border-gray-800/50">
            <Text className="text-gray-400 text-sm mb-2">Replying to</Text>
            <View className="flex-row">
              <Image
                source={{ uri: replyToPost.user.image }}
                className="w-8 h-8 rounded-full mr-3"
              />
              <View className="flex-1">
                <View className="flex-row items-center mb-1">
                  <Text className="text-white font-semibold text-sm mr-2">
                    {replyToPost.user.name}
                  </Text>
                  <Text className="text-gray-400 text-sm">
                    @{replyToPost.user.username}
                  </Text>
                </View>
                <Text className="text-gray-300 text-sm" numberOfLines={3}>
                  {replyToPost.content}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Compose Area */}
        <View className="flex-1 px-4 py-4">
          <View className="flex-row">
            <Image
              source={{ uri: currentUser.image }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View className="flex-1">
              <TextInput
                value={content}
                onChangeText={setContent}
                placeholder={replyToPost ? "Write your reply..." : "What's happening?"}
                placeholderTextColor="#6b7280"
                className="text-white text-lg leading-6"
                multiline
                autoFocus
                textAlignVertical="top"
                style={{ minHeight: 100 }}
                editable={!isPosting}
              />
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="px-4 py-3 border-t border-gray-800">
          <View className="flex-row items-center justify-between">
            {/* Toolbar */}
            <View className="flex-row items-center gap-4">
              <Pressable disabled={isPosting}>
                <Ionicons name="image-outline" size={24} color="#6b7280" />
              </Pressable>
              <Pressable disabled={isPosting}>
                <Ionicons name="videocam-outline" size={24} color="#6b7280" />
              </Pressable>
              <Pressable disabled={isPosting}>
                <Ionicons name="location-outline" size={24} color="#6b7280" />
              </Pressable>
              <Pressable disabled={isPosting}>
                <Ionicons name="happy-outline" size={24} color="#6b7280" />
              </Pressable>
            </View>

            {/* Character Count */}
            <View className="flex-row items-center">
              <View className="relative mr-3">
                <View className="w-8 h-8 rounded-full border-2 border-gray-600" />
                <View
                  className={`absolute inset-0 rounded-full border-2 ${
                    remainingChars < 0
                      ? "border-red-500"
                      : remainingChars < 20
                      ? "border-yellow-500"
                      : "border-blue-500"
                  }`}
                  style={{
                    transform: [
                      {
                        rotate: `${Math.min((content.length / maxLength) * 360, 360)}deg`,
                      },
                    ],
                  }}
                />
                {remainingChars <= 20 && (
                  <View className="absolute inset-0 items-center justify-center">
                    <Text
                      className={`text-xs font-bold ${
                        remainingChars < 0 ? "text-red-500" : "text-yellow-500"
                      }`}
                    >
                      {remainingChars}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
