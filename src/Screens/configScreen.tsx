import { StyleSheet, Text, TextInput, View } from "react-native";
import React, { use } from "react";
import { useGridSize } from "../context/context";
const ConfigScreen = () => {
  const size = useGridSize((state) => state.size);
  const updateSize = useGridSize((state) => state.updateSize);

  const handleChange = (text: string) => {
    const soloNumeros = text.replace(/[^0-9]/g, "");
    updateSize(Number(soloNumeros));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>tamaño del lado del tablero {size}</Text>

      <TextInput
        style={styles.input}
        value={String(size)}
        onChangeText={handleChange}
        keyboardType="numeric"
        placeholder="Escribe un número"
      />
    </View>
  );
};

export default ConfigScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#aaa",
    padding: 10,
    borderRadius: 8,
    fontSize: 16,
  },
});
