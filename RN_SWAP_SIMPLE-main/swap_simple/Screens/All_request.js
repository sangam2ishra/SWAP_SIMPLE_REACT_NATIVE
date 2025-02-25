
import React, { useCallback, useEffect, useState } from "react";

import {
  View,
  Text,
  TextInput,
  ScrollView,
  Alert,
  Modal,
  Button,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Platform,

  RefreshControl,

} from "react-native";
import { useSelector } from "react-redux";
// import { Button } from "react-native-elements";
import { LinearGradient } from "expo-linear-gradient";
import RNDateTimePicker from '@react-native-community/datetimepicker';

import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';



const All_request = () => {
  const [request, setRequest] = useState([]);
  const [filteredRequest, setFilteredRequest] = useState([]);
  const { currentUser } = useSelector((state) => state.user);
  const [selectedTravelID, setSelectedTravelID] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [selectedPreferences, setSelectedPreferences] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [requestDeleted, setRequestDeleted] = useState(false);
  const [formData, setFormData] = useState({ trainNo: "", dt: "" });
  //   const [selectedDate, setSelectedDate] = useState("");
  const [trainNo, setTrainNo] = useState("");
  const navigation = useNavigation();
  const [openDatePicker, setOpenDatePicker] = useState(false); // control the date picker modal
  const [selectedDate, setSelectedDate] = useState(new Date()); // default date as today's date

  const [refreshing, setRefreshing] = useState(false); // Add refreshing state

    // Fetch data function (can be called on pull-to-refresh or page load)
  const fetchData = async () => {
    if (!currentUser) {
      console.log("If then why so ");
      navigation.navigate('Home'); // Navigate to HomeScreen if no currentUser
      return; // Exit function early to avoid fetching notifications
    }

    try {
      const res = await fetch(
        `http://10.10.92.56:3000/api/req/${currentUser._id}/allReq`
      );
      if (res.ok) {
        const data = await res.json();
        setRequest(data.requests);
        setFilteredRequest(data.requests);
      }
    } catch (error) {
      console.log("Error:", error.message);
    } finally {
      setRefreshing(false); // Stop the refresh spinner
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [currentUser])
  );
  useEffect(() => {
    fetchData();
  }, [currentUser, requestDeleted,navigation]);
   

  const onRefresh = useCallback(() => {
    setRefreshing(true); // Show the refresh control spinner
    fetchData(); // Re-fetch data on pull-to-refresh
  }, [currentUser]);

  console.log(openDatePicker);
    const toogleDatePicker=()=>{
       
        setOpenDatePicker(!openDatePicker);
    };

  const handleChange = (id, value) => {
    setFormData({ ...formData, [id]: value.trim() });
  };
  const reverseDateString = (dateString) => {
    // Example: dateString = '2024-11-27'
    const dateComponents = dateString.split('-'); // ['2024', '11', '27']
    const reversedDate = dateComponents.reverse().join('-'); // '27-11-2024'
    return reversedDate;
  };
  const handleDatepickerChange = ({type},selectedDate) => {
    toogleDatePicker();
    if (type == "set") {
        const formattedDate = selectedDate.toISOString().split("T")[0];
        const reversdate=reverseDateString(formattedDate);
        setFormData({ ...formData, dt: reversdate });
        setSelectedDate(selectedDate);
      }
      toogleDatePicker(); // Toggle only once
  

  };
  const applyFilters = () => {
    const { trainNo, dt } = formData;
    console.log("train No: " + trainNo);
    console.log("Date: " + dt);
    const filtered = request.filter((req) => {
      const matchesTrainNo = trainNo ? req.trainNo.includes(trainNo) : true;
      const matchesDate = dt ? req.dt === dt : true;
      return matchesTrainNo && matchesDate;
    });
    setFilteredRequest(filtered);
  };

  const resetFilters = () => {
    setFormData({ trainNo: "", dt: "" });
    // setSelectedDate("");
    setFilteredRequest(request);
  };

  const handleDeleteUser = async (travelID) => {
    setShowModal(false);
    try {
      const res = await fetch(
        `http://10.10.92.56:3000/api/req/delete/${currentUser._id}/${travelID}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (data.success) {
        setRequestDeleted(!requestDeleted);
        Alert.alert("Request deleted successfully");
      }else{
        Alert.alert("Failed to delete the request");
      }
    } catch (error) {
        Alert.alert("Error", "Something went wrong. Please try again.");
      console.log("error");
    }
  };
  const handleOpenModal = (preferences) => {
    setSelectedPreferences(preferences);
    setOpenModal(true);
  };

  return (
    <View style={styles.container}>
      {request.length === 0 ? (
        <View style={styles.emptyContainer}>

          {/* <Text style={styles.emptyEmoji}>😭</Text> */}
          <MaterialCommunityIcons name="crosshairs-question" size={100} color="white" />
          <Text style={styles.emptyText}> No Request found. </Text>
          <Text style={styles.emptyText}>
             Please wait for SOMEONE FOR THE REQUEST. 😊

          </Text>
          <Text style={styles.emptyText}>Thank you for your patience! </Text>
        </View>
      ) : (


        <ScrollView refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }>

          <LinearGradient
            colors={["grey", "#1e293b", "grey"]}
            style={styles.header}
          >
            <Text style={styles.title}>All Request</Text>
          </LinearGradient>

          <View style={styles.filterContainer}>
  <Text style={styles.filterTitle}>Filter by</Text>
  <View style={styles.filterForm}>
    <View style={styles.rowContainer}>
      <View style={styles.filterItem}>
        <Text style={{ color: "white" }}>Train No</Text>
        <TextInput
          style={styles.input}
          placeholder="Train No"
          onChangeText={(value) => handleChange("trainNo", value)}
          value={formData.trainNo}
        />
      </View>
    
    
     
      <View style={styles.filterItem}>
        <Text style={{ color: "white" }}>Date {formData.dt} </Text>
        <TouchableOpacity onPress={toogleDatePicker}

         onPressOut={toogleDatePicker} >
          <LinearGradient
            colors={["#3B82F6", "#60A5FA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton1}
          >
            <Text style={styles.buttonText}>Pick a Date</Text>
          </LinearGradient>
        </TouchableOpacity>
        {/* <Text style={{ color: "white" }}>{selectedDate.toDateString()}</Text> */}
      </View>
    </View>
    {openDatePicker&&(
         <RNDateTimePicker display="spinner" 
         mode="date"
         value={selectedDate}
         onChange={handleDatepickerChange}
      
      />
     )}
    <View style={styles.buttonRow}>
      <TouchableOpacity onPress={applyFilters} style={styles.buttonFlex}>
        <LinearGradient
          colors={["#3B82F6", "#60A5FA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton2}
        >
          <Text style={styles.buttonText}>Apply</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={resetFilters} style={styles.buttonFlex}>
        <LinearGradient

          colors={["grey", "grey"]}

          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.gradientButton2}
        >
          <Text style={styles.buttonText}>Reset</Text>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  </View>
</View>


          <FlatList
            data={filteredRequest}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ScrollView style={styles.requestItem}>
                <Text style={{ fontWeight: "", color: "#3B82F6" }}>
                  User:{" "}
                  <Text style={{ color: "#000" }}>{item.user.username}</Text>
                </Text>

                <Text style={{ fontWeight: "bold", color: "#3B82F6" }}>
                  Train Name:{" "}
                  <Text style={{ color: "#000" }}>
                    {item.trainID} ({item.trainNo})
                  </Text>
                </Text>

                <Text style={{ fontWeight: "bold", color: "#3B82F6" }}>
                  Boarding Station:{" "}
                  <Text style={{ color: "#000" }}>{item.boardingStation}</Text>
                </Text>

                <Text style={{ fontWeight: "bold", color: "#3B82F6" }}>
                  Destination Station:{" "}
                  <Text style={{ color: "#000" }}>
                    {item.destinationStation}
                  </Text>
                </Text>

                <Text style={{ fontWeight: "bold", color: "#3B82F6" }}>
                  Date: <Text style={{ color: "#000" }}>{item.dt}</Text>
                </Text>

                <Text
                  style={{
                    fontWeight: "bold",
                    color: item.isSwap ? "green" : "red",
                  }}
                >
                  Status:{" "}
                  <Text style={{ color: "#000" }}>
                    {item.isSwap ? "Swapped" : "Not Swapped"}
                  </Text>
                </Text>

                {/* Buttons for "See Preferences" and "Delete Request" */}

                <View style={{flexDirection:'row'}}>

                <View style={styles.swapButtonContainer1}>
                  <TouchableOpacity
                    onPress={() => handleOpenModal(item.preferences)}
                  >
                    <LinearGradient

                      colors={["#3B82F6", "#60A5FA", "#60A5FA"]}

                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.gradientButton2}
                    >
                      <Text style={styles.buttonText}>See Preferences</Text>
                    </LinearGradient>
                  </TouchableOpacity>

                  </View>

                {item.user && item.user.username === currentUser?.username&& (

                  <View style={styles.swapButtonContainer1}>
                    <TouchableOpacity
                      onPress={() => {
                        setShowModal(true);
                        setSelectedTravelID(item.travelID);
                      }}
                    >
                      <LinearGradient

                        colors={["#a33957", "#a33957", "#a33957"]}

                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton2}
                      >
                        <Text style={styles.buttonText}>
                          Delete Your Request
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                )}

                </View>
              </ScrollView>
            )}
          />
         


          {/* Preferences Modal */}
          <Modal
            visible={openModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setOpenModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>Preferences</Text>
                <FlatList
                  data={selectedPreferences}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <View style={styles.preferenceItem}>
                      <Text>Preference No: {index + 1}</Text>
                      <Text>Coach Position: {item.coach}</Text>
                      <Text>Seat No: {item.seatNo}</Text>
                    </View>
                  )}
                />
                <Text style={styles.modalText}>
                  <Text style={{ fontSize: 24 }}>🔁</Text> If you want to swap
                  your seat with this person, follow the{" "}
                  <Text style={{ color: "red" }}>procedure</Text> of the{" "}
                  <Text style={{ color: "red" }}>App</Text>. 🚀
                </Text>
                <TouchableOpacity
                  onPress={() => setOpenModal(false)}
                  style={styles.button1}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </TouchableOpacity>
              </View>

              
            </View>

          </Modal>

          {/* Delete Confirmation Modal */}
          <Modal
            visible={showModal}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowModal(false)}
          >
            <View style={styles.modalContainer}>
              <View style={styles.modalContent}>
                <AntDesign name="questioncircle" size={40} color="#a62d24" />
                <Text style={styles.modalText}>
                  Are you sure you want to delete your request?
                </Text>
                <View style={styles.modalButtons}>
                  <TouchableOpacity
                    onPress={() => handleDeleteUser(selectedTravelID)}
                    style={styles.button}
                  >
                    <Text style={styles.buttonText}>Yes, I'm sure</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setShowModal(false)}
                    style={styles.button1}
                  >
                    <Text style={styles.buttonText}>No, cancel</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </ScrollView>
      )}
    </View>
  );
};

export default All_request;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1e293b",
    paddingHorizontal: 10,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyEmoji: {
    fontSize: 40,
  },
  emptyText: {
    fontSize: 18,
    textAlign: "center",
    marginVertical: 5,
    fontFamily: "sans-serif",

    color:'white',

  },
  header: {
    paddingVertical: 4,
    alignItems: "center",
    borderRadius: 3,
  },
  title: {
    fontSize: 12,
    color: "#fff",
    fontFamily: "serif",
    fontWeight: "bold",
  },
  filterContainer: {
    marginVertical: 0,
  },

  filterTitle: {
    fontSize: 16,
    marginBottom: 10,
    color: "#f5b9b5",
    fontFamily: "serif",
    fontWeight: "bold",
  },
  filterForm: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  filterItem: {
    marginRight: 10,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    backgroundColor: "white",
    borderRadius: 4,
    padding: 5,
    width: 150,
  },
  button: {
    backgroundColor: "#06804b",
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  button1: {
    backgroundColor: "#78020c",
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  buttonText: {

    color: "white",

  },
  requestItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "#e6e6e6",
    marginBottom: 12,
    borderRadius: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",

    // alignItems:''

  },
  modalContent: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 5,
  },
  modalTitle: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: "bold",
  },
  preferenceItem: {
    marginBottom: 5,
  },
  modalText: {
    fontSize: 16,
    marginVertical: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  modalIcon: {
    textAlign: "center",
    marginBottom: 10,
  },
  gradientButton1: {
    paddingHorizontal: 6,
    paddingVertical: 6,
    borderRadius: 4,
    alignItems: "center",
    // marginVertical: 10,
  },
  swapButtonContainer: {
    marginTop: 30,
    alignItems: "center",
    border: 2,
    borderRadius: 2,
    marginHorizontal: 4,
  },
  swapButtonText: {
    color: "purple",
    fontSize: 18,
    marginTop: 5,
  },
  gradientButton2: {
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 4,
    alignItems: "",
    marginVertical: 4,
  },
  swapButtonContainer1: {
    marginTop: 0,
    alignItems: "",
    border: 2,
    borderRadius: 2,
    marginHorizontal: 4,
  },
  swapButtonText1: {
    color: "purple",
    fontSize: 18,
    marginTop: 0,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  buttonRow: {
    flexDirection: 'row',
    marginVertical: 10,
    justifyContent: 'space-between',
  },
  buttonFlex: {
    flex: 1,
    marginHorizontal: 5,
  },
});
