
import {
  CameraView,
  useCameraPermissions,
  type CameraType,
} from "expo-camera";
import { Camera, RefreshCw, RotateCcw } from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  const [photo, setPhoto] = useState<string | null>(null);

  const cameraRef = useRef<CameraView>(null);

  if (!permission) return <View style={styles.container} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Camera size={60} color="#FFFFFF" />
        <Text style={styles.permissionText}>
          Camera access is required
        </Text>
        <TouchableOpacity
          style={styles.permissionButton}
          onPress={requestPermission}
        >
          <Text style={styles.permissionButtonText}>
            Allow Camera Access
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    const result = await cameraRef.current?.takePictureAsync({
      quality: 0.8,
    });

    if (result) setPhoto(result.uri);
  };

  return (
    <View style={styles.container}>
      {photo ? (
        <Image
          source={{ uri: photo }}
          style={styles.camera}
          resizeMode="contain"
        />
      ) : (
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
        />
      )}

      <View style={styles.controls}>
        <TouchableOpacity
          onPress={() => setPhoto(null)}
          style={styles.controlButton}
        >
          <RotateCcw color="#FFFFFF" size={26} />
        </TouchableOpacity>

        {!photo && (
          <TouchableOpacity
            style={styles.captureButton}
            onPress={takePhoto}
          >
            <View style={styles.captureInner} />
          </TouchableOpacity>
        )}

        {!photo && (
          <TouchableOpacity
            onPress={() =>
              setFacing(current =>
                current === "back" ? "front" : "back"
              )
            }
            style={styles.controlButton}
          >
            <RefreshCw color="#FFFFFF" size={26} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000000",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  controls: {
    height: 110,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
  },
  controlButton: {
    padding: 15,
  },
  captureButton: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  captureInner: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#FFFFFF",
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  permissionText: {
    color: "#FFFFFF",
    fontSize: 17,
  },
  permissionButton: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingVertical: 13,
    borderRadius: 10,
  },
  permissionButtonText: {
    color: "#000000",
    fontWeight: "600",
  },
});
