import { View, Text, Animated } from "react-native";
import { useEffect, useRef } from "react";
import { Ionicons } from "@expo/vector-icons";

interface ToastNotificationProps {
  visible: boolean;
  message: string;
  type?: "success" | "info" | "warning" | "ai";
  duration?: number;
  onHide?: () => void;
}

export default function ToastNotification({
  visible,
  message,
  type = "info",
  duration = 3000,
  onHide,
}: ToastNotificationProps) {
  const translateY = useRef(new Animated.Value(-100)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Show animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto hide after duration
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    } else {
      hideToast();
    }
  }, [visible, duration]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onHide) {
        onHide();
      }
    });
  };

  const getToastStyle = () => {
    switch (type) {
      case "success":
        return {
          backgroundColor: "#10b981",
          borderColor: "#059669",
          iconName: "checkmark-circle" as const,
          iconColor: "#ffffff",
        };
      case "warning":
        return {
          backgroundColor: "#f59e0b",
          borderColor: "#d97706",
          iconName: "warning" as const,
          iconColor: "#ffffff",
        };
      case "ai":
        return {
          backgroundColor: "#3b82f6",
          borderColor: "#2563eb",
          iconName: "hardware-chip" as const,
          iconColor: "#ffffff",
        };
      default:
        return {
          backgroundColor: "#374151",
          borderColor: "#4b5563",
          iconName: "information-circle" as const,
          iconColor: "#ffffff",
        };
    }
  };

  const toastStyle = getToastStyle();

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      style={{
        transform: [{ translateY }],
        opacity,
      }}
      className="absolute top-16 left-4 right-4 z-50"
    >
      <View
        className="rounded-xl px-4 py-3 flex-row items-center shadow-lg"
        style={{
          backgroundColor: toastStyle.backgroundColor,
          borderWidth: 1,
          borderColor: toastStyle.borderColor,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.25,
          shadowRadius: 3.84,
          elevation: 5,
        }}
      >
        <Ionicons
          name={toastStyle.iconName}
          size={20}
          color={toastStyle.iconColor}
        />
        <Text className="text-white font-medium ml-3 flex-1" numberOfLines={2}>
          {message}
        </Text>
      </View>
    </Animated.View>
  );
}
