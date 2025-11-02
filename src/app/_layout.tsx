import "../../global.css";

import { Slot } from "expo-router";

import { ThemeProvider, DarkTheme } from "@react-navigation/native";
import { AppProvider } from "@/context/AppContext";

const myTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: "white",
    card: "#101010",
  },
};

export default function RootLayout() {
  return (
    <AppProvider>
      <ThemeProvider value={myTheme}>
        <Slot />
      </ThemeProvider>
    </AppProvider>
  );
}
