import { StyleSheet, Text, View } from "react-native";
export default function About() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>About Page</Text>
      <Text style={styles.text}>This is the about page of the app.</Text>
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
    }
});