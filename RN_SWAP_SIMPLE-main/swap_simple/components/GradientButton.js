import React from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

const GradientButton = ({ onPress, icon, text, isNotConfirmed }) => {
  const gradientColors = isNotConfirmed
    ? ["#ff5c33", "#ff5c33"] // Red gradient for not confirmed
    : ["#60A5FA", "#4d79ff","#3B82F6","#60A5FA"]; // Blue gradient for confirmed

  return (
    <TouchableOpacity onPress={onPress} disabled={isNotConfirmed}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={[styles.gradientButton, isNotConfirmed && { opacity: 0.6 }]} // Adjust opacity if disabled
      >
        <View style={styles.buttonContent}>
         
          <Text style={styles.buttonText}>
            {isNotConfirmed ? 'Ticket Not Confirmed' : text}
          </Text>
          {icon && <View style={{ marginLeft: 10 }}>{icon}</View>}
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradientButton: {
    padding: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF", // White text
    fontWeight: "bold",
    fontSize: 14,
  },
});

export default GradientButton;
