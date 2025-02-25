import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

const MyButton = ({ onPress, disabled, title }) => {
  const [pressed, setPressed] = useState(false);

  const handlePressIn = () => setPressed(true);
  const handlePressOut = () => setPressed(false);

  return (
    <Pressable
      
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      disabled={disabled}
      onPress={onPress}
      // style={[styles.buttonContainer, pressed ? styles.pressed : null]}
      style={[
        styles.buttonContainer,
        pressed && styles.pressed,
      ]}
    >
      {pressed ? (
        <View style={[styles.outlineContainer, styles.outline]}>
          <Text style={styles.buttonText}>{title}</Text>
        </View>
      ) : (
        <LinearGradient
        colors={['black', '#1e293b', 'red']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>{title}</Text>
        </LinearGradient>
      )}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 5,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 6,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  pressed: {
    borderColor: '#8e2de2',
    borderWidth: 0,
  },
  outlineContainer: {
    paddingVertical: 6,
    paddingHorizontal: 25,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    borderColor: '#8e2de2',
    borderWidth: 0,
  },
});

export default MyButton;
