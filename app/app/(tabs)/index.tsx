import { useEffect, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";

const API = "http://10.18.50.104:8000/health"; // <-- put your IPv4 here

export default function App() {
  const [status, setStatus] = useState("checking…");
  const [error, setError] = useState("");

  async function check() {
    try {
      setError("");
      const res = await fetch(API);
      const j = await res.json();
      setStatus(j.ok ? "Connected ✅" : "Not OK ❌");
    } catch (e:any) {
      setStatus("Failed ❌");
      setError(String(e?.message || e));
    }
  }

  useEffect(() => { check(); }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Backend status:</Text>
      <Text style={styles.status}>{status}</Text>
      {!!error && <Text style={styles.error}>{error}</Text>}
      <Button title="Retry" onPress={check} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 18, fontWeight: "600" },
  status: { fontSize: 20 },
  error: { color: "tomato", textAlign: "center" },
});
