import { NativeTabs } from "expo-router/native-tabs";
export default function TabsLayout() {
  return (
    <NativeTabs>
        <NativeTabs.Trigger name="index" >
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
        <NativeTabs.Trigger name="about" >
        <NativeTabs.Trigger.Label>About</NativeTabs.Trigger.Label>
        </NativeTabs.Trigger>
    </NativeTabs>
  );
}