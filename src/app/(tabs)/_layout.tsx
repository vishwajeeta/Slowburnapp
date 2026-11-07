import { Tabs } from "expo-router";
import { StyleSheet } from "react-native";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: "#FFFFFF", tabBarInactiveTintColor: "#888888", tabBarStyle: { backgroundColor: "#000000" } }}>
      <Tabs.Screen 
        name="index" 
        options={{ title: "Home" }} 
      />
      <Tabs.Screen 
        name="about" 
        options={{ title: "About" }} 
      />
    </Tabs>
  );
}
const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#000000",
  },
});
