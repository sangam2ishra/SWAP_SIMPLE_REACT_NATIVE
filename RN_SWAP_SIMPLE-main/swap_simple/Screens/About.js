import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import { LinearGradient } from 'expo-linear-gradient'; // Assuming you're using expo for gradients
import { ToastAndroid } from 'react-native'; // For toast notifications in Android

const About = () => {
  const { theme } = useSelector((state) => state.theme);

  const notify = () => {
    ToastAndroid.show("Wow so easy!", ToastAndroid.SHORT);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.centered}>
        <View style={styles.content}>
          <Text style={[styles.heading, styles.fontSerif]}>
            SWAP-SIMPLE
          </Text>
          <View style={styles.divider} />
          <Text style={styles.subheading}>swap your seat</Text>
          <View style={styles.paragraphContainer}>
            <Text style={styles.paragraph}>
              Welcome to the 🚈 Railway Service 🚈 Project! This innovative initiative was conceived by Rustam Kumar and Sangam Kumar Mishra, two students from IIT Bhuvaneshwar, with invaluable guidance from Professor Srikant Gollapudi and Professor Srinivas Penisetty. We express our heartfelt appreciation for their unwavering support and mentorship throughout this endeavor.
            </Text>
            <Text
              style={[
                styles.paragraph,
                theme === "light" ? styles.textBlack : styles.textWhite
              ]}
            >
              Our project is dedicated to enhancing the travel experience for passengers, especially groups, by offering a unique seat swapping feature. It empowers travelers who find 🕵️‍♂️ themselves dissatisfied with their allocated seats to seamlessly exchange them with others if those seats better suit their preferences. This service is designed with a strong emphasis on public welfare, aiming to address the common inconvenience faced by passengers when assigned random seats. By fostering a sense of community and cooperation, we strive to contribute positively to society's well-being.
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.divider} />
      <Text style={styles.footer}>
        🙏 We urge all users to utilize this service responsibly and ethically, keeping in mind the collective benefit of the community . It is essential to refrain from engaging in any form of malpractice, as all activities within the system are meticulously monitored and traced. Let's join hands to make train travel not only convenient but also enjoyable and inclusive for all passengers!
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1e293b',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    maxWidth: 600,
    padding: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
    color:'white'
  },
  subheading: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
     color:'white'
  },
  paragraphContainer: {
    marginVertical: 10,
     color:'white'
  },
  paragraph: {
    fontSize: 14,
    color: 'gray',
    marginVertical: 10,
    textAlign: 'justify',
    color:'white'
  },
  textBlack: {
    color: 'white',
  },
  textWhite: {
    color: 'white',
  },
  fontSerif: {
    fontFamily: 'serif', // You might need to load a custom font here
  },
  divider: {
    height: 1,
    backgroundColor: 'white',
    marginVertical: 10,
  },
  footer: {
    fontSize: 14,
    color: 'red',
    paddingHorizontal: 20,
    marginTop: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default About;
