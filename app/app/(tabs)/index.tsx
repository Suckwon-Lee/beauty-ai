import { CameraView, useCameraPermissions } from "expo-camera";
import * as ImageManipulator from "expo-image-manipulator";
import { useRef, useState } from "react";
import { Alert, Button, Image, StyleSheet, Text, View } from "react-native";

// we'll call this in Day 4 upload
const API = "http://10.18.50.104:8000/upload"; // <-- change this to your PC IP

export default function Index() {
  // ask for camera permission using the hook Expo provides
  const [permission, requestPermission] = useCameraPermissions();

  // local state for camera + photo
  const [cameraReady, setCameraReady] = useState(false);
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // ref to control the camera
  const cameraRef = useRef<any>(null);

  // while permission is loading
  if (!permission) {
    return <Text style={styles.text}>Requesting camera permission…</Text>;
  }

  // if permission is not granted yet
  if (!permission.granted) {
    return (
      <View style={styles.centerScreen}>
        <Text style={styles.text}>We need your permission to use the camera</Text>
        <Button title="Grant permission" onPress={requestPermission} />
      </View>
    );
  }

  // take a photo
  async function takePhoto() {
    if (!cameraRef.current || !cameraReady) {
        console.log("Camera not ready yet");
        return;
    }

    // takePictureAsync() returns { uri, width, height }
    const photo = await cameraRef.current.takePictureAsync({
      quality: 0.7,
      skipProcessing: false,
    });

    setPhotoUri(photo.uri);
  }

  // upload the photo to backend
  async function uploadPhoto() {
    if (!photoUri) return;

    // resize/compress before uploading
    const resized = await ImageManipulator.manipulateAsync(
      photoUri,
      [{ resize: { width: 512 } }],
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    // build multipart/form-data
    const body = new FormData();
    body.append("file", {
      uri: resized.uri,
      name: "photo.jpg",
      type: "image/jpeg",
    } as any);

    try {
      const res = await fetch(API, {
        method: "POST",
        body,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const j = await res.json();
      Alert.alert("Upload result", JSON.stringify(j));
    } catch (err: any) {
      Alert.alert("Upload failed", err?.message || String(err));
    }
  }

  // retake
  function resetPhoto() {
    setPhotoUri(null);
  }

  // if we already took a photo, show preview + upload
  if (photoUri) {
    return (
      <View style={styles.centerScreen}>
        <Image source={{ uri: photoUri }} style={styles.preview} />
        <Button title="Retake" onPress={resetPhoto} />
        <Button title="Upload" onPress={uploadPhoto} />
      </View>
    );
  }

  // otherwise show live camera
  return (
    <View style={styles.fullScreen}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing="front"
        onCameraReady={() => setCameraReady(true)}
      />
      <View style={styles.bottomBar}>
        <Button title="Take Photo" onPress={takePhoto} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: "#000",
  },
  centerScreen: {
    flex: 1,
    backgroundColor: "#000",
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 16,
  },
  bottomBar: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 24,
    backgroundColor: "#000",
  },
  camera: {
    flex: 1,
    width: "100%",
  },
  preview: {
    width: 300,
    height: 400,
    borderRadius: 16,
  },
  text: {
    color: "#fff",
    textAlign: "center",
  },
});
