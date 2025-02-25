import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ScrollView,
} from "react-native";
import LottieView from "lottie-react-native";
import { AntDesign } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useSelector } from "react-redux";

import Entypo from '@expo/vector-icons/Entypo';

import GradientButton from "./GradientButton";
// import { , Text } from 'react-native';




const { width: screenWidth } = Dimensions.get("window");
const animationHeight = screenWidth * (250 / 375);

const SeatSelection = () => {
   const route = useRoute();
   const navigation = useNavigation();
    const { pnrNumber } = route.params; // look to 
    console.log(pnrNumber);
  const [selectedCoaches, setSelectedCoaches] = useState({});
  const [coachInput, setCoachInput] = useState("");
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [suggestedCoaches, setSuggestedCoaches] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const coachSuggestions = {
    A: ["A1", "A2", "A3", "A4", "A5"],
    S: ["S1", "S2", "S3", "S4", "S5", "S6", "S7", "S9", "S10"],
    B: ["B1", "B2", "B3", "B4", "B5"],
  };
  const handleOnClick=async()=>{
    console.log("Hi right here ");
    try{
      const preferenceList = [];
      for (const coach in selectedCoaches) {
        selectedCoaches[coach].forEach((seatNo) => {
          preferenceList.push({ coach, seatNo });
        });
      }

      const res = await fetch(`http://10.10.92.56:3000/api/pnr/${pnrNumber}/swap-seat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selectedCoaches: selectedCoaches,
          preferenceList: preferenceList,
          name: currentUser.username,
        }),
      });
    
      const response = await res.json();
          console.log(response);
          if (response.success) {

            console.log("Succed");
             navigation.navigate('SwapResults', { pnrNumber, result1: response.partiallySwaps, result2: response.perfectSwaps });
          } else {
            console.log("failed");
             navigation.navigate('SwapResults', { pnrNumber, result1: null, result2: null });

         
          }

    }catch(error){
      console.error("Error processing swap request:", error);
    }

  }
   
   

  const handleAddCoachBtnClick = () => {
    if (coachInput && selectedSeats.length > 0) {
      setSelectedCoaches((prevState) => ({
        ...prevState,
        [coachInput]: selectedSeats,
      }));
      setCoachInput("");
      setSelectedSeats([]);
      setSuggestedCoaches([]);
    } else {
      Alert.alert("Please enter coach and select seats.");
    }
  };

  const handleCoachInputChange = (text) => {
    setCoachInput(text);
    setSelectedSeats([]);
    const firstChar = text[0]?.toUpperCase();
    if (coachSuggestions[firstChar]) {
      setSuggestedCoaches(coachSuggestions[firstChar]);
    } else {
      setSuggestedCoaches([]);
    }
  };

  const handleSeatCheckboxChange = (seatNumber) => {
    if (selectedSeats.includes(seatNumber)) {
      setSelectedSeats((prevSeats) =>
        prevSeats.filter((seat) => seat !== seatNumber)
      );
    } else {
      setSelectedSeats((prevSeats) => [...prevSeats, seatNumber]);
    }
  };

  const handleDeleteCoach = (coach) => {
    setSelectedCoaches((prevCoaches) => {
      const updatedCoaches = { ...prevCoaches };
      delete updatedCoaches[coach];
      return updatedCoaches;
    });
  };

  return (
    <FlatList
      clas
      ListHeaderComponent={() => (
        <View className="flex-1 bg-slate-600">
          <LottieView
            source={require("../assets/Animation - 1726545977021.json")}
            style={styles.fullScreenAnimation}
            autoPlay
            loop
          />
          <View>
            <TextInput
              style={styles.input}
              value={coachInput}
              onChangeText={handleCoachInputChange}
              placeholder="Enter coach (e.g., A1)"
              placeholderTextColor="#9CA3AF" // Light gray placeholder color
            />
          </View>

          {suggestedCoaches.length > 0 && (
            <FlatList
              data={suggestedCoaches}
              horizontal
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => setCoachInput(item)}>
                  <Text style={styles.suggestion}>{item}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item}
            />
          )}

          {coachInput && (
            <>
              <TouchableOpacity onPress={() => {}} activeOpacity={1}>
                <LinearGradient
                  // Gradient colors
                  activeOpacity={1}


                  colors={["grey", "grey","grey","#e6e6e6"]}


                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.gradientButton}
                >
                  <Text style={styles.buttonText}>Select Seats(s)</Text>
                </LinearGradient>
              </TouchableOpacity>
              <ScrollView horizontal={true}>
  <View style={styles.gridContainer}>
    {[...Array(10).keys()].map((row) => (
      <View style={styles.rowContainer} key={row}>
        {[...Array(10).keys()].map((col) => {
          const seatNumber = ("0" + (row * 10 + col + 1)).slice(-2);
          return (
            <TouchableOpacity
              key={seatNumber}
              style={[
                styles.seatCheckbox,
                selectedSeats.includes(seatNumber) && styles.selectedSeat,
              ]}
              onPress={() => handleSeatCheckboxChange(seatNumber)}
            >
              <Text style={styles.seatText}>Seat {seatNumber}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    ))}
  </View>
</ScrollView>
            </>
          )}

          {/* <Button title="Add Coach and Seats" onPress={handleAddCoachBtnClick} color="#1e293b"  /> */}
        
        <View  style={styles.AddCoach}>
          <TouchableOpacity onPress={handleAddCoachBtnClick}>
            <LinearGradient
              // Gradient colors

              colors={["#3B82F6","#3B82F6", "#3B82F6","#3B82F9","#60A5FA","#60A5FA","#60A5FA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton1}
            > 
            <View  style={{ flexDirection: "row", alignItems: "center" }} >
            <Entypo name="add-to-list" size={24} color="white" />

            <Text style={[styles.buttonText, { marginLeft: 10 ,marginRight:0}]}>Add Coach and Seats</Text>

            </View>
            

            </LinearGradient>
          </TouchableOpacity>
          </View>

          <Text style={styles.selectedText}>Selected Coach and Seats</Text>
        </View>
      )}
      data={Object.entries(selectedCoaches)}
      renderItem={({ item }) => (
        <View style={styles.coachSeatContainer}>
          <View style={styles.coachSeatHeader}>
            <Text style={styles.coachText}>Coach: {item[0]}</Text>
            <TouchableOpacity onPress={() => handleDeleteCoach(item[0])}>
              <AntDesign name="delete" size={24} color="red" />
            </TouchableOpacity>
          </View>
          <Text style={styles.seatsText}>Seats: {item[1].join(", ")}</Text>
        </View>
      )}
      keyExtractor={(item, index) => index.toString()}
      ListFooterComponent={() => (
        <View style={styles.swapButtonContainer}>
          <TouchableOpacity onPress={handleOnClick}>
            <LinearGradient
              // Gradient colors
              colors={["#3B82F6", "#60A5FA"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradientButton1}
            >
              <Text style={styles.buttonText}>Swap Request</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#1e293b",
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  fullScreenAnimation: {
    width: "100%",
    height: animationHeight,
    marginBottom: 10,
    marginTop: -50,
  },
  gradientButton: {
    padding: 1,
    borderRadius: 0,
    alignItems: "center",
    marginVertical: 10,
  },
  gradientButton1: {
    padding: 10,
    paddingHorizontal:15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  gradientButton2: {
    padding: 1,
    paddingHorizontal:15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  buttonText: {
    color: "#FFFFFF", // White text
    fontWeight: "bold",

    fontSize: 14,

  },

  input: {
    borderWidth: 1,
    borderColor: "#4B5563", // Darker gray
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    backgroundColor: "#374151", // Darker background for input
    color: "#FFFFFF", // White text
    paddingHorizontal: 20,
    marginHorizontal: 10,
  },
  suggestion: {
    backgroundColor: "#4B5563",
    padding: 5,
    borderRadius: 5,
    color: "#F9FAFB", // Light text for suggestions
    marginBottom: 15,
    marginLeft: 20,
  },
  seatCheckbox: {
    borderWidth: 1,
    borderColor: "#9CA3AF",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#374151",
  },
  selectedSeat: {
    backgroundColor: "#801a00",
  },
  seatText: {
    color: "#F9FAFB", // Light text for seat numbers
  },
  selectedText: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white", // Light text for selected coach and seats section
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal:16,
  },
  coachSeatContainer: {
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: "#4B5563",
    borderRadius: 8,
    backgroundColor: "#374151", // Slightly lighter background for coach containers
    marginHorizontal: 10,
  },
  coachSeatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  coachText: {
    fontSize: 10,
    fontWeight: "bold",
    color: "#F9FAFB", // Light text for coach names
  },
  seatsText: {
    marginTop: 5,
    fontSize: 10,
    color: "#F9FAFB", // Light text for seat numbers
  },
  swapButtonContainer: {
    marginTop: 3,
    alignItems: "center",
    border: 2,
    borderRadius: 4,
  },
  swapButtonText: {
    color: "purple",
    fontSize: 18,
    marginTop: 5,
  },
  AddCoach:{
    // marginTop: 30,
    paddingHorizontal:60,
    alignItems: "",
    border: 2,
    borderRadius: 4,
  },
   gridContainer: {
    flexDirection: "row",
  },
  rowContainer: {
    flexDirection: "column",
  },
  seatCheckbox: {
    borderWidth: 1,
    borderColor: "#9CA3AF",
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#374151",
  },
  selectedSeat: {
    backgroundColor: "#801a00",
  },
  seatText: {
    color: "#F9FAFB", // Light text for seat numbers
  },
  
});

export default SeatSelection;
