
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

// Display notifications while the app is open
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

// Request notification permission
export async function requestNotificationPermission() {
  const { status: existingStatus } =
    await Notifications.getPermissionsAsync();

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } =
      await Notifications.requestPermissionsAsync();

    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("workout", {
      name: "Workout Reminders",
      importance: Notifications.AndroidImportance.HIGH,
      sound: "default",
    });
  }

  return true;
}

// Schedule a notification after a specified number of seconds
export async function scheduleWorkoutReminder(seconds: number) {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: "💪 Workout Reminder",
      body: "It's time to get moving! Let's complete today's workout.",
      sound: "default",
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds,
      channelId: "workout",
    },
  });
}

// Cancel all scheduled notifications
export async function cancelAllReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}



export async function scheduleDailyReminder(
  hour: number,
  minute: number
) {
  // Find and cancel any previously scheduled daily workout reminder
  const scheduled =
    await Notifications.getAllScheduledNotificationsAsync();

  for (const notification of scheduled) {
    if (
      notification.content.data?.type === "daily-workout-reminder"
    ) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
    }
  }

  return await Notifications.scheduleNotificationAsync({
    content: {
  title: "💪 Time to Work Out!",
  body: "Your daily fitness session is waiting. Let's get moving!",
  sound: "default",
  data: {
    type: "daily-workout-reminder",
    screen: "/(tabs)",
  },
},
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
      channelId: "workout",
    },
  });
}

export async function cancelDailyReminder() {
  const scheduled =
    await Notifications.getAllScheduledNotificationsAsync();

  for (const notification of scheduled) {
    if (
      notification.content.data?.type === "daily-workout-reminder"
    ) {
      await Notifications.cancelScheduledNotificationAsync(
        notification.identifier
      );
    }
  }
}

export async function isDailyReminderEnabled() {
  const scheduled =
    await Notifications.getAllScheduledNotificationsAsync();

  return scheduled.some(
    notification =>
      notification.content.data?.type === "daily-workout-reminder"
  );
}

export async function sendTestNotification() {
  return await Notifications.scheduleNotificationAsync({
    content: {
      title: "💪 Workout Reminder",
      body: "Your notifications are working perfectly! Keep moving.",
      sound: "default",
      data: { type: "test-reminder" },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 5,
      channelId: "workout",
    },
  });
}
