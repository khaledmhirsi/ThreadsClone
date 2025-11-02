import { View, Text, Pressable, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import AISettings from "./AISettings";

export default function TwitterHeader() {
  const { currentUser, aiEnabled, toggleAI } = useApp();
  const [showBotSettings, setShowBotSettings] = useState(false);

  const handleProfilePress = () => {
    Alert.alert("Profile", `View ${currentUser.name}'s profile`);
  };

  const handleSettingsPress = () => {
    Alert.alert("Settings", "What would you like to do?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Bot Settings",
        onPress: () => setShowBotSettings(true),
      },
      {
        text: "Account Settings",
        onPress: () => Alert.alert("Account", "Account settings coming soon"),
      },
      {
        text: "About",
        onPress: () =>
          Alert.alert("About", "Threads Clone with Instant Bot Replies"),
      },
    ]);
  };

  return (
    <>
      <View className="flex-row items-center justify-between px-4 py-3 bg-black border-b border-gray-800">
        {/* Left side - Profile */}
        <Pressable onPress={handleProfilePress} className="p-2">
          <Ionicons name="person-circle-outline" size={24} color="#9ca3af" />
        </Pressable>

        {/* Center - Logo with Bot Status */}
        <View className="flex-1 items-center">
          <View className="flex-row items-center">
            <Text className="text-white text-xl font-bold">Threads</Text>
            {aiEnabled && (
              <View className="ml-2 px-2 py-1 bg-green-500/20 rounded-full">
                <Text className="text-green-400 text-xs font-medium">
                  BOTS ON
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Right side - Bot Toggle + Settings */}
        <View className="flex-row items-center">
          <Pressable onPress={toggleAI} className="p-2 mr-1">
            <Ionicons
              name="hardware-chip"
              size={20}
              color={aiEnabled ? "#10b981" : "#6b7280"}
            />
          </Pressable>

          <Pressable onPress={handleSettingsPress} className="p-2">
            <Ionicons name="settings-outline" size={24} color="#9ca3af" />
          </Pressable>
        </View>
      </View>

      {/* Bot Settings Modal */}
      <AISettings
        visible={showBotSettings}
        onClose={() => setShowBotSettings(false)}
      />
    </>
  );
}
