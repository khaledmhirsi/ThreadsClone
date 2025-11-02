import { View, Text, Animated } from "react-native";
import { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "@/context/AppContext";

interface AIActivityIndicatorProps {
  visible?: boolean;
}

export default function AIActivityIndicator({
  visible = true,
}: AIActivityIndicatorProps) {
  const { aiEnabled } = useApp();
  const [isActive, setIsActive] = useState(false);
  const [activityText, setActivityText] = useState("AI is thinking...");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const activityMessages = [
    "AI is thinking...",
    "Analyzing content...",
    "Generating response...",
    "Crafting reply...",
    "Processing thoughts...",
    "Understanding context...",
  ];

  useEffect(() => {
    if (!aiEnabled || !visible) {
      setIsActive(false);
      return;
    }

    // Simulate AI activity detection
    const activityInterval = setInterval(() => {
      const shouldBeActive = Math.random() < 0.3; // 30% chance of activity
      setIsActive(shouldBeActive);

      if (shouldBeActive) {
        const randomMessage =
          activityMessages[Math.floor(Math.random() * activityMessages.length)];
        setActivityText(randomMessage);
      }
    }, 5000);

    return () => clearInterval(activityInterval);
  }, [aiEnabled, visible]);

  useEffect(() => {
    if (isActive) {
      // Fade in animation
      Animated.sequence([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Pulse animation
      Animated.loop(
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.1,
            duration: 1000,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: true,
          }),
        ]),
      ).start();

      // Rotation animation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(1);
      rotateAnim.setValue(0);
    }
  }, [isActive, fadeAnim, scaleAnim, rotateAnim]);

  if (!aiEnabled || !visible || !isActive) {
    return null;
  }

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={{
        opacity: fadeAnim,
        transform: [{ scale: scaleAnim }],
      }}
      className="absolute top-20 right-4 z-50"
    >
      <View className="bg-blue-500/90 backdrop-blur-sm rounded-full px-3 py-2 flex-row items-center shadow-lg">
        <Animated.View
          style={{
            transform: [{ rotate }],
          }}
        >
          <Ionicons name="hardware-chip" size={16} color="white" />
        </Animated.View>
        <Text className="text-white text-xs font-medium ml-2">
          {activityText}
        </Text>
      </View>
    </Animated.View>
  );
}
