import {
  View,
  FlatList,
  Text,
  SafeAreaView,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useState } from "react";
import TwitterHeader from "@/component/TwitterHeader";
import FloatingActionButton from "@/component/FloatingActionButton";
import ThreadView from "@/component/ThreadView";
import ComposeModal from "@/component/ComposeModal";

import ToastNotification from "@/component/ToastNotification";
import { useApp } from "@/context/AppContext";
import { Post } from "@/types";

export default function HomeScreen() {
  const { posts, toastVisible, toastMessage, toastType } = useApp();
  const [refreshing, setRefreshing] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate a refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleCompose = () => {
    setShowComposeModal(true);
  };

  const handleReplyPress = (post: Post) => {
    // This will be handled by the individual PostListItem components
  };

  // Organize posts with their replies
  const organizedPosts = posts
    .filter((post) => post.parent_id === null)
    .map((mainPost) => {
      const replies = posts.filter((post) => post.parent_id === mainPost.id);
      return {
        ...mainPost,
        threadReplies: replies,
      };
    })
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

  const renderThread = ({
    item,
  }: {
    item: Post & { threadReplies: Post[] };
  }) => (
    <ThreadView
      post={item}
      replies={item.threadReplies}
      onReplyPress={handleReplyPress}
    />
  );

  const renderHeader = () => (
    <View className="px-4 py-3 bg-black border-b border-gray-800/50">
      <Text className="text-white text-lg font-semibold">For You</Text>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Twitter-like Header */}
      <TwitterHeader />

      {/* Posts Feed */}
      <FlatList
        data={organizedPosts}
        renderItem={renderThread}
        keyExtractor={(item) =>
          `thread-${item.id}-${item.threadReplies.length}`
        }
        className="flex-1"
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={renderHeader}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#ffffff"
            titleColor="#ffffff"
          />
        }
        ItemSeparatorComponent={() => (
          <View className="h-2 bg-gray-900/50 border-t border-b border-gray-800/30" />
        )}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListEmptyComponent={() => (
          <View className="py-16 px-8 items-center">
            <Text className="text-white text-xl font-bold mb-2">
              Welcome to Threads!
            </Text>
            <Text className="text-gray-400 text-center leading-5">
              Start by creating your first post or following some users.
            </Text>
          </View>
        )}
        extraData={posts.length}
      />

      {/* Floating Action Button */}
      <FloatingActionButton onPress={handleCompose} />

      {/* Compose Modal */}
      <ComposeModal
        visible={showComposeModal}
        onClose={() => setShowComposeModal(false)}
      />

      {/* Toast Notification */}
      <ToastNotification
        visible={toastVisible}
        message={toastMessage}
        type={toastType}
      />
    </SafeAreaView>
  );
}
