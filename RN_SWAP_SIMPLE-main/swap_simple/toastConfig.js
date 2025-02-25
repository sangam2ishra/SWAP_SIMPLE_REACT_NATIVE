import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Toast from 'react-native-toast-message';

// Define a custom toast style
const customToast = ({ text1, text2 }) => (
  <LinearGradient
    colors={['#000000', '#434343',"red"]} // Gradient colors (from black to a dark grey)
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 1 }}
    style={styles.toastContainer}
  >
    <Text style={styles.toastText}>{text1}</Text>
    {text2 ? <Text style={styles.toastSubText}>{text2}</Text> : null}
  </LinearGradient>
);

const styles = StyleSheet.create({
  toastContainer: {
    borderRadius: 10,
    padding: 8,
    alignItems: 'center',
  },
  toastText: {
    color: 'white',
    fontSize: 10,
  },
  toastSubText: {
    color: 'white',
    fontSize: 10,
  },
});

export default customToast;
