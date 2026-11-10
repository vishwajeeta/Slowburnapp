import * as Notifications from "expo-notifications";
import { useRouter } from "expo-router";
import { useEffect } from "react";


import { Tabs } from "expo-router";
import { Camera, Home, Info, Settings } from "lucide-react-native";

export default function TabsLayout() {
  const router = useRouter();

useEffect(() => {
  const subscription =
    Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;

        if (data?.screen === "/(tabs)") {
          router.push("/(tabs)");
        }
      }
    );

  return () => subscription.remove();
}, [router]);


  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: "#FFFFFF",
        tabBarInactiveTintColor: "#888888",
        tabBarStyle: {
          backgroundColor: "#000000",
          borderTopColor: "#222222",
        },
        headerStyle: {
          backgroundColor: "#000000",
        },
        headerTintColor: "#FFFFFF",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Home color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="camera"
        options={{
          title: "Camera",
          tabBarIcon: ({ color, size }) => (
            <Camera color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, size }) => (
            <Info color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
  name="settings"
  options={{
    title: "Settings",
    tabBarIcon: ({ color, size }) => (
      <Settings color={color} size={size} />
    ),
  }}
/>
    </Tabs>
  );
}
