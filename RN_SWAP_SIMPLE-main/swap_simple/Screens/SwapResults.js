import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  Alert,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useSelector } from "react-redux";
import Ionicons from '@expo/vector-icons/Ionicons';
import CardList from "../components/CardList"; // You can implement this for React Native too
// import CustomAlert from "../components/CustomAlert";

const SwapResults = () => {
  const navigation = useNavigation();
  const route = useRoute();
  //   console.log("Route Let See--->",route);
  const { travel__Id } = useSelector((state) => state.user);
  const { currentUser } = useSelector((state) => state.user);
  const [alertVisible, setAlertVisible] = useState(false);
  const [matchType, setMatchType] = useState("Perfect");
  const [travels, setTravels] = useState([]);
  const [requestMade, setRequestMade] = useState(false);
  const { pnrNumber, result1, result2 } = route.params; // Receive navigation params
  //   console.log({ pnrNumber });
  //   console.log("Res1",result1);
  //   console.log("Res2",result2);

  useEffect(() => {
    setMatchType("Perfect");
    setTravels(result2);
  }, [currentUser]);

  const handlePerfectMatch = () => {
    setMatchType("Perfect");
    setTravels(result2);
  };

  const handlePartiallyMatch = () => {
    setMatchType("Partially");
    setTravels(result1);
  };

  const addRequest = async () => {
    try {
      const res = await fetch(
        `http://10.10.92.56:3000/api/req/${currentUser._id}/${travel__Id}/add_request`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({}),
        }
      );

      const data = await res.json();
      if (data.status === "202" && data.success === "false") {
        Alert.alert(
          "Oops...",
          "You are not allowed for multiple requests for a single PNR number."
        );
        navigation.navigate("Home");
      } else if (data.success === "true") {
        setAlertVisible(true)

        
        Alert.alert(
          "Success",
          "Your request has been successfully pulled in the All Requests section! Please check your email for further updates or visit the Notification section."
        );
        navigation.navigate("AllRequests");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (!travels || result1.length === 0) {
    if (!requestMade) {
      return (
        <View style={{ padding: 20, marginTop: 40 }}>
          <Text style={{ textAlign: "center", fontSize: 28 }}>😭</Text>
          <Text style={{ textAlign: "center", fontSize: 18 ,color:"white" }}>
            No travelers found. Please wait for someone to respond to the
            request.
          </Text>
          <TouchableOpacity
            onPress={() => {
              setRequestMade(true);
              addRequest();
            }}
            style={{ marginTop: 20, alignItems: "center" }}
          >
            <LinearGradient

             colors={["black", "#60A5FA", "#60A5FA", "black"]}

             start={{ x: 0, y: 0 }}
             end={{ x: 1, y: 0 }}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 5,
              }}
            >   
            <View style={{ flexDirection: "row", alignItems: "center" }}>
             <Ionicons name="push" size={24} color="white" />
              <Text style={{ color: "#fff", fontSize: 16 }}>
                Add to Request
              </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      );
    }
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 10 }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <TouchableOpacity onPress={handlePerfectMatch}>
          <LinearGradient
            colors={
              matchType === "Perfect"
                ? ["#00c6ff", "#0072ff", "#800000"]
                : ["grey", "grey", "grey"]
            }
            style={{
              paddingVertical: 10,
              paddingHorizontal: 6,
              borderRadius: 5,
              marginHorizontal: 6,
            }}
          >
            <Text style={{ color: "#fff", fontSize: 10 }}>PERFECT MATCH</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePartiallyMatch}>
          <LinearGradient
            colors={
              matchType === "Partially"
                ? ["#00c6ff", "#0072ff", "#800000"]
                : ["grey", "grey", "grey"]
            }
            style={{
              paddingVertical: 10,
              paddingHorizontal: 6,
              borderRadius: 5,
              marginHorizontal: 6,
            }}
          >
            <Text style={{ color: "white", fontSize: 10 }}>
              PARTIALLY MATCH
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {matchType === "Perfect" && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ textAlign: "center", fontSize: 12, color: "white" }}>
            🕵️‍♂️ You are looking for Perfect Matching 🕵️‍♂️
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "#ffcccc",
              fontWeight: "bold",
            }}
          >
            Boarding and Destination station Matched{" "}
          </Text>
        </View>
      )}
      {matchType === "Partially" && (
        <View style={{ marginTop: 20 }}>
          <Text style={{ textAlign: "center", fontSize: 12, color: "white" }}>
            🕵️‍♂️ You are looking for Partially Matching 🕵️‍♂️
          </Text>
          <Text
            style={{
              textAlign: "center",
              fontSize: 12,
              color: "#ffcccc",
              fontWeight: "bold",
            }}
          >
            Boarding and Destination station{" "}
            <Text style={{ color: "red", fontWeight: "bold" }}>NOT</Text>{" "}
            Matched
          </Text>
        </View>
      )}

      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          flexWrap: "wrap",
          justifyContent: "space-between",
        }}
      >
        {travels.map((travel, index) => (
          <CardList key={index} travel={travel} pnr={pnrNumber} />
        ))}
      </View>
    </ScrollView>
  );
};

export default SwapResults;
