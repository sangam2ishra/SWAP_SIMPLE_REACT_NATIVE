import React, { useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomAlert = ({ visible, onClose }) => {
    console.log("hii");
  return (
    <Modal
      transparent={true}
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.alertBox}>
          <Text style={styles.alertTitle}>Success</Text>
          <Text style={styles.alertMessage}>
            Your request has been successfully pulled in the All Requests section! 
            Please check your email for further updates or visit the Notification section.
          </Text>

          <TouchableOpacity onPress={onClose} style={styles.okButton}>
            <Text style={styles.okButtonText}>OK</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CustomAlert;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim background
  },
  alertBox: {
    width: 300,
    padding: 20,
    backgroundColor: "black",
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#3B82F6", // Styled title color
  },
  alertMessage: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 20,
    color: "#555", // Styled message color
  },
  okButton: {
    backgroundColor: "#3B82F6", // Button color
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  okButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
