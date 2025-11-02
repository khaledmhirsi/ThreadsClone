import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  FlatList,
  Pressable,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import WhoToFollow from "@/component/WhoToFollow";
import PostListItem from "@/component/PostListItem";
import { useApp } from "@/context/AppContext";
import { Post, User } from "@/types";

interface TrendingTopic {
  id: string;
  category: string;
  topic: string;
  posts: string;
}

const trendingTopics: TrendingTopic[] = [
  {
    id: "1",
    category: "Technology",
    topic: "React Native",
    posts: "12.5K posts",
  },
  {
    id: "2",
    category: "Design",
    topic: "UI/UX",
    posts: "8.2K posts",
  },
  {
    id: "3",
    category: "Photography",
    topic: "Sunset Photography",
    posts: "5.7K posts",
  },
  {
    id: "4",
    category: "Fitness",
    topic: "Workout Motivation",
    posts: "15.3K posts",
  },
  {
    id: "5",
    category: "Startup",
    topic: "Seed Funding",
    posts: "3.8K posts",
  },
];

function TrendingItem({ item }: { item: TrendingTopic }) {
  return (
    <Pressable className="px-4 py-3">
      <Text className="text-gray-400 text-xs mb-1">{item.category}</Text>
      <Text className="text-white font-semibold text-base mb-1">
        {item.topic}
      </Text>
      <Text className="text-gray-400 text-xs">{item.posts}</Text>
    </Pressable>
  );
}

function UserSearchResult({
  user,
  onPress,
}: {
  user: User;
  onPress: () => void;
}) {
  const { followedUsers, toggleFollow } = useApp();
  const isFollowing = followedUsers.has(user.id);

  return (
    <Pressable onPress={onPress} className="px-4 py-3 flex-row items-center">
      <View className="w-12 h-12 rounded-full bg-gray-700 mr-3" />
      <View className="flex-1">
        <Text className="text-white font-semibold">{user.name}</Text>
        <Text className="text-gray-400">@{user.username}</Text>
        <Text className="text-gray-500 text-sm" numberOfLines={1}>
          {user.bio}
        </Text>
      </View>
      <Pressable
        onPress={() => toggleFollow(user.id)}
        className={`px-4 py-1.5 rounded-full border ${
          isFollowing
            ? "bg-transparent border-gray-600"
            : "bg-white border-white"
        }`}
      >
        <Text
          className={`text-sm font-medium ${
            isFollowing ? "text-white" : "text-black"
          }`}
        >
          {isFollowing ? "Following" : "Follow"}
        </Text>
      </Pressable>
    </Pressable>
  );
}

export default function Search() {
  const { posts, users } = useApp();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "users" | "posts">("all");

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Filter results based on search query
  const postResults = posts.filter(
    (post) =>
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.user.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const userResults = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.bio.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const allResults = [...postResults, ...userResults];

  const getFilteredResults = () => {
    switch (activeTab) {
      case "users":
        return userResults;
      case "posts":
        return postResults;
      default:
        return allResults;
    }
  };

  const renderTrendingItem = ({ item }: { item: TrendingTopic }) => (
    <TrendingItem item={item} />
  );

  const renderSearchResult = ({ item }: { item: Post | User }) => {
    if ("content" in item) {
      // It's a post
      return <PostListItem post={item as Post} />;
    } else {
      // It's a user
      return (
        <UserSearchResult
          user={item as User}
          onPress={() => console.log("Navigate to user profile")}
        />
      );
    }
  };

  const TabButton = ({
    title,
    count,
    isActive,
    onPress,
  }: {
    title: string;
    count?: number;
    isActive: boolean;
    onPress: () => void;
  }) => (
    <Pressable
      onPress={onPress}
      className={`flex-1 py-3 border-b-2 ${
        isActive ? "border-white" : "border-transparent"
      }`}
    >
      <Text
        className={`text-center font-medium ${
          isActive ? "text-white" : "text-gray-400"
        }`}
      >
        {title}
        {count !== undefined && count > 0 && ` (${count})`}
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView className="flex-1 bg-black">
      {/* Header */}
      <View className="px-4 py-3 border-b border-gray-800">
        <Text className="text-white text-xl font-bold text-center">Search</Text>
      </View>

      {/* Search Bar */}
      <View className="px-4 py-3 border-b border-gray-800">
        <View className="flex-row items-center bg-gray-900 rounded-full px-4 py-2">
          <Ionicons name="search" size={20} color="#6b7280" />
          <TextInput
            placeholder="Search"
            placeholderTextColor="#6b7280"
            className="flex-1 text-white ml-3"
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchQuery.length > 0 && (
            <Pressable onPress={() => handleSearch("")}>
              <Ionicons name="close-circle" size={20} color="#6b7280" />
            </Pressable>
          )}
        </View>
      </View>

      {/* Content */}
      {searchQuery.length > 0 ? (
        /* Search Results */
        <View className="flex-1">
          {/* Search Tabs */}
          <View className="flex-row border-b border-gray-800">
            <TabButton
              title="All"
              count={allResults.length}
              isActive={activeTab === "all"}
              onPress={() => setActiveTab("all")}
            />
            <TabButton
              title="Users"
              count={userResults.length}
              isActive={activeTab === "users"}
              onPress={() => setActiveTab("users")}
            />
            <TabButton
              title="Posts"
              count={postResults.length}
              isActive={activeTab === "posts"}
              onPress={() => setActiveTab("posts")}
            />
          </View>

          {/* Results List */}
          {getFilteredResults().length > 0 ? (
            <FlatList
              data={getFilteredResults()}
              renderItem={renderSearchResult}
              keyExtractor={(item) =>
                "content" in item ? item.id : item.id + "_user"
              }
              className="flex-1"
              showsVerticalScrollIndicator={false}
              ItemSeparatorComponent={() => (
                <View className="h-px bg-gray-800/50" />
              )}
              contentContainerStyle={{ paddingBottom: 100 }}
            />
          ) : (
            <View className="px-4 py-8 items-center">
              <Ionicons name="search" size={48} color="#374151" />
              <Text className="text-gray-400 text-center mt-4">
                No results found for "{searchQuery}"
              </Text>
              <Text className="text-gray-500 text-center mt-2 text-sm">
                Try searching for something else
              </Text>
            </View>
          )}
        </View>
      ) : (
        /* Explore Content */
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Trending Topics */}
          <View className="bg-gray-900/50 mx-4 mt-4 rounded-xl border border-gray-800">
            <View className="px-4 py-3 border-b border-gray-800">
              <Text className="text-white text-lg font-bold">
                What's happening
              </Text>
            </View>
            <FlatList
              data={trendingTopics}
              renderItem={renderTrendingItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => (
                <View className="h-px bg-gray-800 mx-4" />
              )}
            />
            <Pressable
              className="px-4 py-3 border-t border-gray-800"
              onPress={() => console.log("Show more trending")}
            >
              <Text className="text-blue-400 text-sm font-medium">
                Show more
              </Text>
            </Pressable>
          </View>

          {/* Who to Follow */}
          <WhoToFollow />

          {/* Quick Search Suggestions */}
          <View className="bg-gray-900/50 mx-4 mb-4 rounded-xl border border-gray-800">
            <View className="px-4 py-3 border-b border-gray-800">
              <Text className="text-white text-lg font-bold">
                Popular searches
              </Text>
            </View>
            {["React Native", "Photography", "Startup", "Fitness"].map(
              (suggestion, index) => (
                <Pressable
                  key={index}
                  onPress={() => handleSearch(suggestion)}
                  className="px-4 py-3 flex-row items-center justify-between border-b border-gray-800 last:border-b-0"
                >
                  <View className="flex-row items-center">
                    <Ionicons
                      name="trending-up"
                      size={16}
                      color="#6b7280"
                      style={{ marginRight: 12 }}
                    />
                    <Text className="text-white">{suggestion}</Text>
                  </View>
                  <Ionicons name="chevron-forward" size={16} color="#6b7280" />
                </Pressable>
              ),
            )}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
