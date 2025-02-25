
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Modal,
  StyleSheet,
  Pressable,
} from 'react-native';

const Help = () => {
  const [activeSection, setActiveSection] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const toggleSection = (section) => {
    if (activeSection === section) {
      setActiveSection(null);
    } else {
      setActiveSection(section);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* How to Access Seat Swapping Feature */}
      <TouchableOpacity onPress={() => toggleSection(1)}>
        <View style={styles.header}>
          <Text style={styles.title}>
            How to Access the Seat Swapping Feature? 🔑
          </Text>
        </View>
      </TouchableOpacity>
      {activeSection === 1 && (
        <View style={styles.content}>
          <Text style={styles.text}>
            To access the seat swapping feature, follow these steps:
          </Text>
          <Text style={styles.text}>1. Create an account and log in.</Text>
          <Text style={styles.text}>2. Enter your PNR number.</Text>
          <Text style={styles.text}>
            3. Select your preferences for swapping.
          </Text>
          <Text style={styles.text}>4. Click on "Ask for Swap".</Text>
          <Text style={styles.text}>
            5. You'll see all users seeking swaps.
          </Text>
          <Text style={styles.text}>
            6. If no match, check the "All Requests" section.
          </Text>
          <Text style={styles.text}>
            For further assistance, review the Swapping Feature Guide.
          </Text>
        </View>
      )}

      {/* Privacy Concerns */}
      <TouchableOpacity onPress={() => toggleSection(2)}>
        <View style={styles.header}>
          <Text style={styles.title}>
            Privacy Concerns and Data Security 🔒
          </Text>
        </View>
      </TouchableOpacity>
      {activeSection === 2 && (
        <View style={styles.content}>
          <Text style={styles.text}>
            We take your privacy and data security seriously:
          </Text>
          <Text style={styles.text}>• Your data is securely encrypted.</Text>
          <Text style={styles.text}>
            • We don't share your data without consent.
          </Text>
          <Text style={styles.text}>
            • We adhere to industry-standard security practices.
          </Text>
          <Text style={styles.text}>
            • You have control over your data via account settings.
          </Text>
          <Text style={styles.text}>
            Review our Privacy Policy for more information.
          </Text>
        </View>
      )}

      {/* General Questions */}
      <TouchableOpacity onPress={() => toggleSection(3)}>
        <View style={styles.header}>
          <Text style={styles.title}>General Questions ❓</Text>
        </View>
      </TouchableOpacity>
      {activeSection === 3 && (
        <View style={styles.content}>
          <Text style={styles.text}>
            <Text style={styles.strong}>Q: How can I update my details?</Text>
          </Text>
          <Text style={styles.text}>
            A: Visit the profile section of your account and update your
            information.
          </Text>
        </View>
      )}

      {/* Modal Example */}
      <Pressable onPress={() => setModalVisible(true)}>
        <Text style={styles.modalButton}>Show Privacy Alert</Text>
      </Pressable>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Your data is secure with us. Please review our privacy policy.
            </Text>
            <Pressable
              style={styles.buttonClose}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: '#1e293b',
  },
  header: {
    padding: 10,
    backgroundColor: 'grey',
    marginVertical: 5,
    borderRadius: 5,
    marginHorizontal:8,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color:'white'
  },
  content: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    marginVertical: 5,
    borderRadius: 5,
    marginHorizontal:10,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginVertical: 5,
  },
  strong: {
    fontWeight: 'bold',
  },
  modalButton: {
    padding: 10,
    color: 'white',
    textAlign: 'center',
    marginVertical: 10,
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)',
  
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    // marginVertical: 40,
    marginHorizontal: 20,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default Help;

