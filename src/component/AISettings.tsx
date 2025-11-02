import { View, Text, Modal, Pressable, Switch, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";

interface AISettingsProps {
  visible: boolean;
  onClose: () => void;
}

export default function AISettings({ visible, onClose }: AISettingsProps) {
  const { aiEnabled, toggleAI } = useApp();

  const handleSaveSettings = () => {
    Alert.alert("Settings Saved", "AI settings have been updated!");
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-800">
          <Pressable onPress={onClose}>
            <Text className="text-white text-base">Close</Text>
          </Pressable>

          <Text className="text-white text-lg font-semibold">Bot Settings</Text>

          <Pressable onPress={handleSaveSettings}>
            <Text className="text-blue-400 text-base font-medium">Done</Text>
          </Pressable>
        </View>

        {/* Content */}
        <View className="flex-1 px-4 py-6">
          {/* AI Status Section */}
          <View className="mb-8">
            <View className="flex-row items-center justify-between mb-3">
              <View>
                <Text className="text-white text-lg font-semibold">
                  Instant Bot Replies
                </Text>
                <Text className="text-gray-400 text-sm">
                  {aiEnabled
                    ? "Multiple bots will reply instantly"
                    : "Disabled"}
                </Text>
              </View>
              <Switch
                value={aiEnabled}
                onValueChange={toggleAI}
                trackColor={{ false: "#374151", true: "#3b82f6" }}
                thumbColor={aiEnabled ? "#ffffff" : "#9ca3af"}
              />
            </View>
            <Text className="text-gray-500 text-sm">
              When enabled, 1-3 bots will instantly reply to your posts with
              engaging responses
            </Text>
          </View>

          {/* Bot Info Section */}
          <View className="bg-gray-900/50 border border-gray-800 rounded-xl p-4 mb-6">
            <View className="flex-row items-center mb-3">
              <Ionicons name="hardware-chip" size={20} color="#3b82f6" />
              <Text className="text-white text-base font-semibold ml-2">
                How Bots Work
              </Text>
            </View>

            <View className="space-y-2">
              <Text className="text-gray-300 text-sm">
                • Instantly reply to your posts (within 200ms)
              </Text>
              <Text className="text-gray-300 text-sm">
                • 4 different bot personalities respond
              </Text>
              <Text className="text-gray-300 text-sm">
                • Contextual responses based on your content
              </Text>
              <Text className="text-gray-300 text-sm">
                • Creates engagement and notifications
              </Text>
              <Text className="text-gray-300 text-sm">
                • Only replies to your original posts
              </Text>
            </View>
          </View>

          {/* Bot List */}
          <View className="bg-gray-900/50 border border-gray-800 rounded-xl p-4">
            <Text className="text-white text-base font-semibold mb-3">
              Active Bots
            </Text>

            <View className="space-y-3">
              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-blue-500 rounded-full items-center justify-center mr-3">
                  <Text className="text-white text-xs font-bold">T</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white font-medium">Tech Explorer</Text>
                  <Text className="text-gray-400 text-xs">
                    Loves tech and innovation
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-purple-500 rounded-full items-center justify-center mr-3">
                  <Text className="text-white text-xs font-bold">C</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white font-medium">Creative Mind</Text>
                  <Text className="text-gray-400 text-xs">
                    Art and creativity enthusiast
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-green-500 rounded-full items-center justify-center mr-3">
                  <Text className="text-white text-xs font-bold">M</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white font-medium">Motivation Bot</Text>
                  <Text className="text-gray-400 text-xs">
                    Always supportive and encouraging
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center">
                <View className="w-8 h-8 bg-orange-500 rounded-full items-center justify-center mr-3">
                  <Text className="text-white text-xs font-bold">Q</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-white font-medium">
                    Question Master
                  </Text>
                  <Text className="text-gray-400 text-xs">
                    Asks thoughtful questions
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View className="px-4 py-4 border-t border-gray-800">
          <Text className="text-gray-500 text-xs text-center">
            Bots help create an engaging social experience with instant feedback
          </Text>
        </View>
      </View>
    </Modal>
  );
}
