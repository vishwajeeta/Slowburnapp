
import { useState } from "react";
import {
  Button,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { LineChart } from "react-native-gifted-charts";

import { Alert } from "react-native";

import {
  requestNotificationPermission,
  scheduleDailyReminder,
  scheduleWorkoutReminder,
} from "@/utils/notifications";

const GOAL = 20;

const testNotification = async () => {
  const granted = await requestNotificationPermission();

  if (!granted) {
    Alert.alert("Permission required", "Please allow notifications.");
    return;
  }

  await scheduleWorkoutReminder(5);

  Alert.alert("Scheduled!", "Notification will arrive in 5 seconds.");
};

export default function Index() {
  const [history, setHistory] = useState([{ value: 0 }]);
  const [chartContainerWidth, setChartContainerWidth] = useState(0);

  const count = history[history.length - 1].value;
  const progress = Math.min((count / GOAL) * 100, 100);
  const remaining = Math.max(GOAL - count, 0);

  const updateCount = (change: number) => {
    setHistory((previous) => {
      const current = previous[previous.length - 1].value;
      const next = Math.max(0, current + change);

      return [
        ...previous.slice(-29),
        { value: next },
      ];
    });
  };

  const resetWorkout = () => {
    setHistory([{ value: 0 }]);
  };

  const chartWidth = Math.max(200, chartContainerWidth - 44);
  const maxValue = Math.max(
    GOAL,
    Math.ceil(count / 5) * 5
  );

  const enableDailyReminder = async () => {
  const granted = await requestNotificationPermission();

  if (!granted) {
    Alert.alert("Permission required", "Allow notifications first.");
    return;
  }

  await scheduleDailyReminder(19, 0);

  Alert.alert(
    "Reminder enabled!",
    "You'll receive a workout reminder every day at 7:00 PM."
  );
};
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.dashboard}>

        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>YOUR FITNESS JOURNEY</Text>
            <Text style={styles.heading}>Today's Workout</Text>
            <Text style={styles.subtitle}>
              Small steps. Stronger every day.
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Text style={styles.headerEmoji}>💪</Text>
          </View>
        </View>

        {/* Main Workout Card */}
        <View style={styles.mainCard}>
          <View style={styles.cardTop}>
            <View>
              <Text style={styles.cardLabel}>CURRENT EXERCISE</Text>
              <Text style={styles.exerciseName}>Push-ups</Text>
            </View>

            <View style={styles.todayBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.todayText}>TODAY</Text>
            </View>
          </View>

          {/* Counter */}
          <View style={styles.counterSection}>
            <Text style={styles.count}>{count}</Text>
            <Text style={styles.countLabel}>
              Repetitions completed
            </Text>
          </View>

          {/* Progress */}
          <View style={styles.progressHeader}>
            <Text style={styles.progressTitle}>Daily progress</Text>
            <Text style={styles.progressPercent}>
              {progress.toFixed(0)}%
            </Text>
          </View>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                { width: `${progress}%` },
              ]}
            />
          </View>

          <View style={styles.progressFooter}>
            <Text style={styles.progressInfo}>
              {count} of {GOAL} reps
            </Text>
            <Text style={styles.progressInfo}>
              {remaining} remaining
            </Text>
          </View>

          {/* Actions */}
          <View style={styles.actions}>
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.pressed,
              ]}
              onPress={() => updateCount(1)}
            >
              <Text style={styles.addButtonText}>＋</Text>
              <Text style={styles.addButtonText}>Add Rep</Text>
            </Pressable>

            <Pressable
              style={({ pressed }) => [
                styles.undoButton,
                pressed && styles.pressed,
                count === 0 && styles.disabledButton,
              ]}
              disabled={count === 0}
              onPress={() => updateCount(-1)}
            >
              <Text style={styles.undoButtonText}>−</Text>
              <Text style={styles.undoButtonText}>Undo</Text>
            </Pressable>
          </View>

          {count >= GOAL && (
            <View style={styles.successBanner}>
              <Text style={styles.successText}>
                🎉 Amazing! You've achieved your daily goal!
              </Text>
            </View>
          )}
        </View>

        {/* Statistics */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🎯</Text>
            <Text style={styles.statValue}>{GOAL}</Text>
            <Text style={styles.statLabel}>Daily Target</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🔥</Text>
            <Text style={styles.statValue}>{count}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statIcon}>🏁</Text>
            <Text style={styles.statValue}>{remaining}</Text>
            <Text style={styles.statLabel}>Remaining</Text>
          </View>
        </View>

        {/* Graph Card */}
        <View style={styles.graphCard}>
          <View style={styles.graphHeader}>
            <View>
              <Text style={styles.graphTitle}>
                Workout Progress
              </Text>
              <Text style={styles.graphSubtitle}>
                Track your repetitions as you exercise
              </Text>
            </View>

            <View style={styles.graphLegend}>
              <View style={styles.legendDot} />
              <Text style={styles.legendText}>Reps</Text>
            </View>
          </View>

          <View
            style={styles.chartArea}
            onLayout={(event) =>
              setChartContainerWidth(event.nativeEvent.layout.width)
            }
          >
            {chartContainerWidth > 0 && (
              <LineChart
                data={history}
                width={chartWidth}
                height={210}
                maxValue={maxValue}
                noOfSections={4}
                color="#4F46E5"
                thickness={3}
                curved
                areaChart
                startFillColor="#6366F1"
                endFillColor="#FFFFFF"
                startOpacity={0.16}
                endOpacity={0.01}
                hideDataPoints={false}
                dataPointsColor="#4F46E5"
                dataPointsRadius={4}
                initialSpacing={8}
                endSpacing={8}
                adjustToWidth
                rulesColor="#E9EDF5"
                yAxisColor="#E2E8F0"
                xAxisColor="#E2E8F0"
                yAxisThickness={0}
                xAxisThickness={1}
                yAxisTextStyle={{
                  color: "#94A3B8",
                  fontSize: 11,
                }}
                xAxisLabelTextStyle={{
                  color: "#94A3B8",
                  fontSize: 10,
                }}
              />
            )}
          </View>

          <Text style={styles.chartFooter}>
            Each point represents a repetition update.
          </Text>
        </View>

        {/* Reset */}
        <Pressable
          style={({ pressed }) => [
            styles.resetButton,
            pressed && styles.pressed,
          ]}
          onPress={resetWorkout}
        >
          <Text style={styles.resetText}>↻  Reset Workout</Text>
        </Pressable>
<Button
  title="Test Notification"
  onPress={testNotification}
/>
<Button
  title="Enable Daily Workout Reminder"
  onPress={enableDailyReminder}
/>
        <Text style={styles.footer}>
          KEEP MOVING. KEEP GROWING. 💙
        </Text>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#F5F7FC",
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 18,
    paddingVertical: 30,
  },
  dashboard: {
    width: "100%",
    maxWidth: 920,
    alignSelf: "center",
    gap: 20,
  },

  // Header
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "700",
    color: "#6366F1",
    letterSpacing: 1.5,
  },
  heading: {
    fontSize: 27,
    fontWeight: "800",
    color: "#172033",
    marginTop: 7,
  },
  subtitle: {
    fontSize: 14,
    color: "#8490A5",
    marginTop: 5,
  },
  headerIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: "#E8E9FF",
    alignItems: "center",
    justifyContent: "center",
  },
  headerEmoji: {
    fontSize: 27,
  },

  // Main Card
  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
    borderWidth: 1,
    borderColor: "#EDF0F7",
    elevation: 2,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.2,
    color: "#94A3B8",
  },
  exerciseName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E293B",
    marginTop: 5,
  },
  todayBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 5,
    backgroundColor: "#10B981",
  },
  todayText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#059669",
  },
  counterSection: {
    alignItems: "center",
    marginVertical: 25,
  },
  count: {
    fontSize: 76,
    fontWeight: "800",
    color: "#4F46E5",
    lineHeight: 88,
    fontVariant: ["tabular-nums"],
  },
  countLabel: {
    fontSize: 13,
    color: "#94A3B8",
    marginTop: 3,
  },

  // Progress
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  progressTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#475569",
  },
  progressPercent: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4F46E5",
  },
  progressBackground: {
    height: 10,
    backgroundColor: "#EEF0F7",
    borderRadius: 10,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#6366F1",
    borderRadius: 10,
  },
  progressFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 9,
  },
  progressInfo: {
    fontSize: 11,
    color: "#94A3B8",
  },

  // Buttons
  actions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 25,
  },
  addButton: {
    flex: 1,
    minHeight: 49,
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  addButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
  undoButton: {
    flex: 1,
    minHeight: 49,
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  undoButtonText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.75,
  },
  successBanner: {
    backgroundColor: "#ECFDF5",
    borderRadius: 10,
    padding: 12,
    marginTop: 18,
  },
  successText: {
    color: "#047857",
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  // Statistics
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: "#EDF0F7",
  },
  statIcon: {
    fontSize: 20,
    marginBottom: 10,
  },
  statValue: {
    fontSize: 23,
    fontWeight: "800",
    color: "#1E293B",
  },
  statLabel: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 4,
  },

  // Graph
  graphCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 20,
    borderWidth: 1,
    borderColor: "#EDF0F7",
    elevation: 2,
  },
  graphHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
    gap: 8,
  },
  graphTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E293B",
  },
  graphSubtitle: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 5,
  },
  graphLegend: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 5,
    backgroundColor: "#4F46E5",
  },
  legendText: {
    fontSize: 11,
    color: "#64748B",
  },
  chartArea: {
    width: "100%",
    alignItems: "center",
  },
  chartFooter: {
    fontSize: 11,
    color: "#A0AABC",
    marginTop: 12,
  },

  // Footer
  resetButton: {
    alignSelf: "center",
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 12,
    backgroundColor: "#FEECEE",
  },
  resetText: {
    color: "#DC3545",
    fontSize: 13,
    fontWeight: "700",
  },
  footer: {
    textAlign: "center",
    color: "#A0AABC",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    marginTop: 5,
    marginBottom: 15,
  },
});
