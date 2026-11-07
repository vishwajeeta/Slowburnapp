import { Link } from "expo-router";
import { useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
export default function Index() {
  const [count, setCount] = useState(0);
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hello world!</Text>
      <Text style={styles.text}>Count: {count}</Text>
      <View style={styles.button_container}>
      <Button  title="Increase" onPress={() => setCount(count + 1)} />
      <Button  title="Decrease" onPress={() => setCount(count - 1)} />
        </View>
      <Link href="/about" style={styles.button}>
        <Text style={styles.text}>Go to About</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#000000",
  },
  text: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  button: {
    marginTop: 10,
  },
  button_container: 
   { marginTop: 20, width: 200, flexDirection: "row", justifyContent: "space-between" }
});
