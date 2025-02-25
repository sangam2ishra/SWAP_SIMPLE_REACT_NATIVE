import { LinearGradient } from "expo-linear-gradient";
import React, { useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Modal,

  StyleSheet,
  Dimensions,
  Alert,
  ActivityIndicator,
} from "react-native";
import Entypo from "@expo/vector-icons/Entypo";
import { useSelector } from "react-redux";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Ionicons from "@expo/vector-icons/Ionicons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useNavigation } from "@react-navigation/native";

const CardList = ({ travel, pnr }) => {
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [swapModal, setSwapModal] = useState(false);
  const { travel__Id } = useSelector((state) => state.user);
  const { currentUser } = useSelector((state) => state.user);

  const travelId = travel._id;
  const navigation = useNavigation();

  const confirm = async () => {
    setShowModal(false);
    setSwapModal(false);
    setLoading(true);
    try {
      const res = await fetch(`http://10.10.92.56:3000/api/pnr/swapRequestNotification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterTravelId: travel__Id,
          accepterTravelId: travelId,
        }),
      });

      const data = await res.json();
      setLoading(false);
      if (data.success === "true") {
        Alert.alert(
          "Swap Request",
          "Your request has been successfully sent! Please check your email or the Notification section for updates.",
          [{ text: "OK", onPress: () => navigation.navigate("Notification") }]
        );
      } else {
        Alert.alert("Error", "Something went wrong! Please try again.");
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong! Please try again.");
    }
  };

  const addRequest = async () => {
    setShowModal(false);
    setSwapModal(false);
    setLoading(true);
    try {
      const res = await fetch(`http://10.10.92.56:3000/api/req/${currentUser._id}/${travel__Id}/add_request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      setLoading(false);

      if (data.status === "202" && data.success === "false") {
        Alert.alert(
          "Request Error",
          "You are not allowed to make multiple requests for the same PNR number.",
          [{ text: "OK", onPress: () => navigation.navigate("/") }]
        );
      } else if (data.success === "true") {
        Alert.alert(
          "Request Successful",
          "Your request has been successfully added to the All Requests section! Please check your email for further updates.",
          [{ text: "OK", onPress: () => navigation.navigate("AllRequests") }]
        );
      }
    } catch (error) {
      setLoading(false);
      Alert.alert("Error", "Something went wrong! Please try again.");
    }
  };


  const handleSwapRequest = () => {
    setShowModal(false);
    setSwapModal(true);
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image
          source={{
            uri: "https://www.pngall.com/wp-content/uploads/12/Avatar-Profile-PNG-Picture.png",
          }}
          style={styles.image}
        />
        <Text style={styles.trainName} numberOfLines={1}>
          Train No: {travel.trainInfo.trainNo}
        </Text>
      </View>
      <Text style={styles.title}>Preferences:</Text>
      {travel.preferences.map((pref, index) => (
        <Text key={index} style={styles.preference} numberOfLines={1}>
          Coach: {pref.coach}, Seat No: {pref.seatNo}
        </Text>
      ))}


      <TouchableOpacity onPress={() => setShowModal(true)} style={styles.viewMoreButton}>

        <Text style={styles.viewMoreText}>View More</Text>
      </TouchableOpacity>

      {/* Modal for displaying full details */}
      <Modal
        visible={showModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Travel Info</Text>
            <Text>Train No: {travel.trainInfo.trainNo}</Text>
            <Text>Boarding Station: {travel.trainInfo.boarding}</Text>
            <Text>Destination Station: {travel.trainInfo.destination}</Text>
            <Text>Travel Date: {travel.trainInfo.dt}</Text>
            <View style={styles.separator} />
            <Text style={styles.modalTitle}>Preferences</Text>
            {travel.preferences.map((pref, index) => (
              <Text key={index}>
                Coach: {pref.coach}, Seat No: {pref.seatNo}
              </Text>
            ))}
            <View style={styles.separator} />
            <Text style={styles.modalTitle}>Passenger Info</Text>
            {travel.passengerInfo.map((passenger, index) => (
              <Text key={index}>
                Passenger {index + 1}: Coach {passenger.currentCoach}, Berth No.{" "}
                {passenger.currentBerthNo}
              </Text>
            ))}

            <View style={styles.swapButtonContainer}>
              <TouchableOpacity onPress={handleSwapRequest}>
                <LinearGradient
                  colors={["#3B82F6", "#60A5FA"]}

                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton1}
                >

                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <MaterialIcons name="swap-horizontal-circle" size={24} color="white" />
                    <Text style={[styles.buttonText1, { marginLeft: 10 }]}>

                      Swap Request
                    </Text>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowModal(false)}>
                <LinearGradient

                  colors={["#595959", "#595959"]}

                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton1}
                >
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <AntDesign name="closecircle" size={20} color="white" />

                    <Text style={[styles.buttonText1, { marginLeft: 10 }]}>Close</Text>

                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal for swap options */}
      <Modal
        visible={swapModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setSwapModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Are you sure for SWAP?</Text>

            <TouchableOpacity onPress={confirm}>
              <LinearGradient
                colors={["black", "#3B82F6", "#60A5FA", "black"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton1}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <FontAwesome5 name="praying-hands" size={24} color="white" />
                  <Text style={[styles.buttonText1, { marginLeft: 10 }]}>Request User</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={addRequest}>
              <LinearGradient
                colors={["black", "green", "green", "black"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton1}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Ionicons name="push" size={24} color="white" />
                  <Text style={[styles.buttonText1, { marginLeft: 10 }]}>Push in Queue</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSwapModal(false)}>
              <LinearGradient
                colors={["black", "grey", "grey", "black"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradientButton1}
              >
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Entypo name="circle-with-cross" size={24} color="white" />
                  <Text style={[styles.buttonText1, { marginLeft: 10 }]}>Close</Text>
                </View>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Loader */}
      {loading && (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )}
    </View>
  );
};

export default CardList;

const { width } = Dimensions.get("window");
const CARD_SIZE = width / 2 - 40;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f0f0f0",
    width: CARD_SIZE,
    height: CARD_SIZE + 40,
    borderRadius: 10,
    margin: 10,
    padding: 15,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 10,
  },
  separator: {
    height: 1, // Height of the line
    backgroundColor: '#ccc', // Light gray color
    marginVertical: 10, // Space above and below the line
    alignSelf: 'stretch', // Make it take the full width
  },
  trainName: {
    fontSize: 12,
    fontWeight: "bold",
    flexShrink: 1, // Ensures text shrinks if it's too long
  },
  title: {
    fontSize: 12,
    fontWeight: "bold",
    marginVertical: 10,
  },
  preference: {
    fontSize: 12,
    flexShrink: 1,
  },
  viewMoreButton: {
    backgroundColor: "#003366",
    padding: 5,
    borderRadius: 5,
    alignSelf: "center",
    marginTop: 10,
    paddingHorizontal:10,
  },
  viewMoreText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize:12,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: width * 0.9,
    maxHeight: "85%",
    // alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  swapButtonContainer: {
    marginTop: 30,
    // alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    border: 20,
    borderRadius: 30,
    padding: 2,
  },
  buttonText: {
    color: "black",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  buttonText1: {
    color: "white",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  gradientButton1: {
    padding: 6,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 4,
  },
  gradientButton2: {
    padding: 6,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 4,
  },

  loader: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },

});
