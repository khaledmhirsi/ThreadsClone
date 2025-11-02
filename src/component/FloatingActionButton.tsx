import { Pressable, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface FloatingActionButtonProps {
  onPress: () => void;
}

export default function FloatingActionButton({ onPress }: FloatingActionButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      className="absolute bottom-20 right-4 w-14 h-14 bg-blue-500 rounded-full items-center justify-center shadow-lg"
      style={{
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
      }}
    >
      <View className="w-14 h-14 bg-blue-500 rounded-full items-center justify-center">
        <Ionicons name="add" size={28} color="white" />
      </View>
    </Pressable>
  );
}
