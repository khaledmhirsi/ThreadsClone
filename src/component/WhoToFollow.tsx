import { View, Text, Image, Pressable, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { User } from "@/types";
import { useApp } from "@/context/AppContext";

interface UserSuggestionProps {
  user: User;
  onFollow: (userId: string) => void;
  isFollowing: boolean;
}

function UserSuggestion({ user, onFollow, isFollowing }: UserSuggestionProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3">
      <View className="flex-row items-center flex-1">
        <Image
          source={{ uri: user.image }}
          className="w-10 h-10 rounded-full mr-3"
        />
        <View className="flex-1">
          <Text className="text-white font-semibold text-sm">{user.name}</Text>
          <Text className="text-gray-400 text-xs">@{user.username}</Text>
          <Text className="text-gray-500 text-xs mt-1" numberOfLines={1}>
            {user.bio}
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => onFollow(user.id)}
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
    </View>
  );
}

export default function WhoToFollow() {
  const { users, currentUser, followedUsers, toggleFollow } = useApp();

  const handleFollow = (userId: string) => {
    toggleFollow(userId);
  };

  // Filter out current user and show users not already followed
  const suggestedUsers = users
    .filter((user) => user.id !== currentUser.id)
    .slice(0, 3);

  const renderUser = ({ item }: { item: User }) => (
    <UserSuggestion
      user={item}
      onFollow={handleFollow}
      isFollowing={followedUsers.has(item.id)}
    />
  );

  if (suggestedUsers.length === 0) {
    return null;
  }

  return (
    <View className="bg-gray-900/50 mx-4 mb-4 rounded-xl border border-gray-800">
      <View className="px-4 py-3 border-b border-gray-800">
        <Text className="text-white text-lg font-bold">Who to follow</Text>
      </View>

      <FlatList
        data={suggestedUsers}
        renderItem={renderUser}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
        ItemSeparatorComponent={() => (
          <View className="h-px bg-gray-800 mx-4" />
        )}
      />

      <Pressable className="px-4 py-3 border-t border-gray-800">
        <Text className="text-blue-400 text-sm font-medium">Show more</Text>
      </Pressable>
    </View>
  );
}
