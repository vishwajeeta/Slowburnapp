import AsyncStorage from "@react-native-async-storage/async-storage";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import {
    Alert,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import {
    cancelDailyReminder,
    isDailyReminderEnabled,
    requestNotificationPermission,
    scheduleDailyReminder,
    sendTestNotification,
} from "@/utils/notifications";

export default function SettingsScreen() {
    const [enabled, setEnabled] = useState(false);
    const [time, setTime] = useState(() => {
        const date = new Date();
        date.setHours(7, 0, 0, 0);
        return date;
    });
    const [showPicker, setShowPicker] = useState(false);

    useEffect(() => {
        isDailyReminderEnabled().then(setEnabled);
    }, []);
    useEffect(() => {
        const loadReminderSettings = async () => {
            try {
                const savedTime = await AsyncStorage.getItem(
                    "workout-reminder-time"
                );

                const reminderEnabled = await isDailyReminderEnabled();

                if (savedTime) {
                    const [hour, minute] = savedTime.split(":").map(Number);

                    const date = new Date();
                    date.setHours(hour, minute, 0, 0);
                    setTime(date);
                }

                setEnabled(reminderEnabled);
            } catch (error) {
                console.error("Failed to load reminder settings:", error);
            }
        };

        loadReminderSettings();
    }, []);



    const toggleReminder = async (value: boolean) => {
        if (value) {
            const granted = await requestNotificationPermission();

            if (!granted) {
                Alert.alert(
                    "Permission Required",
                    "Please allow notifications in your phone settings."
                );
                return;
            }

            await scheduleDailyReminder(
                time.getHours(),
                time.getMinutes()
            );
        } else {
            await cancelDailyReminder();
        }

        setEnabled(value);
        await AsyncStorage.setItem(
            "workout-reminder-enabled",
            String(value)
        );
    };

    const updateTime = async (selectedTime: Date) => {
        setTime(selectedTime);

        const hour = selectedTime.getHours();
        const minute = selectedTime.getMinutes();

        await AsyncStorage.setItem(
            "workout-reminder-time",
            `${hour}:${minute}`
        );

        if (enabled) {
            await scheduleDailyReminder(hour, minute);
        }
    };

    const testReminder = async () => {
  const granted = await requestNotificationPermission();

  if (!granted) {
    Alert.alert(
      "Permission Required",
      "Please enable notifications first."
    );
    return;
  }

  await sendTestNotification();

  Alert.alert(
    "Test Scheduled",
    "You should receive a notification in 5 seconds."
  );
};

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Settings</Text>

            <View style={styles.card}>
                <Text style={styles.title}>Workout Reminders</Text>

                <Text style={styles.description}>
                    Receive a daily notification to stay consistent
                    with your fitness routine.
                </Text>

                <View style={styles.row}>
                    <Text style={styles.label}>Daily Reminder</Text>
                    <Switch
                        value={enabled}
                        onValueChange={toggleReminder}
                    />
                </View>

                <View style={styles.divider} />

                <Text style={styles.label}>Reminder Time</Text>

                <TouchableOpacity
                    style={styles.timeButton}
                    onPress={() => setShowPicker(true)}
                >
                    <Text style={styles.timeText}>
                        {time.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </Text>
                    <Text style={styles.changeText}>Change Time</Text>
                </TouchableOpacity>

                {showPicker && (
                    <DateTimePicker
                        value={time}
                        mode="time"
                        display="default"
                        onChange={(_, selectedTime) => {
                            setShowPicker(false);

                            if (selectedTime) {
                                updateTime(selectedTime);
                            }
                        }}
                    />
                )}

                <Text style={styles.note}>
                    {enabled
                        ? "Your daily reminder is active."
                        : "Your daily reminder is currently disabled."}
                </Text>
                <TouchableOpacity
  style={styles.testButton}
  onPress={testReminder}
>
  <Text style={styles.testButtonText}>
    Send Test Notification
  </Text>
</TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#000000",
        padding: 20,
    },
    heading: {
        color: "#FFFFFF",
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 25,
    },
    card: {
        backgroundColor: "#171717",
        borderRadius: 16,
        padding: 20,
    },
    title: {
        color: "#FFFFFF",
        fontSize: 19,
        fontWeight: "700",
    },
    description: {
        color: "#999999",
        fontSize: 14,
        marginTop: 8,
        lineHeight: 21,
    },
    row: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 25,
    },
    label: {
        color: "#FFFFFF",
        fontSize: 15,
        fontWeight: "600",
    },
    divider: {
        height: 1,
        backgroundColor: "#333333",
        marginVertical: 20,
    },
    timeButton: {
        backgroundColor: "#252525",
        borderRadius: 10,
        padding: 15,
        marginTop: 12,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    timeText: {
        color: "#FFFFFF",
        fontSize: 20,
        fontWeight: "700",
    },
    changeText: {
        color: "#65A5FF",
        fontSize: 14,
    },
    note: {
        color: "#888888",
        fontSize: 12,
        marginTop: 18,
    },
    testButton: {
  backgroundColor: "#2563EB",
  padding: 16,
  borderRadius: 12,
  alignItems: "center",
  marginTop: 20,
},
testButtonText: {
  color: "#FFFFFF",
  fontSize: 15,
  fontWeight: "600",
},
});
