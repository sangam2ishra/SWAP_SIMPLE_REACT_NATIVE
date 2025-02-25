import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, Alert, TouchableOpacity, StyleSheet, FlatList } from "react-native";
import { useNavigation, useRoute } from '@react-navigation/native';
// import { useSelector } from "react-redux";
import { AntDesign } from '@expo/vector-icons'; // Vector icon import


const SeatSelection = () => {
    // const route = useRoute();
    const navigation = useNavigation();
    // const { pnrNumber } = route.params;
    // console.log(pnrNumber);
    const [selectedCoaches, setSelectedCoaches] = useState({});
    const [coachInput, setCoachInput] = useState("");
    const [selectedSeats, setSelectedSeats] = useState([]);
    // const { theme } = useSelector((state) => state.theme);
    // const { currentUser } = useSelector((state) => state.user);

    const handleOnClick = async () => {
        try {
          const preferenceList = [];
          for (const coach in selectedCoaches) {
            selectedCoaches[coach].forEach((seatNo) => {
              preferenceList.push({ coach, seatNo });
            });
          }
    
          const res = await fetch(`/api/pnr/${pnrNumber}/swap-seat`, {
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
            navigation.navigate('SwapResults', { pnrNumber, results1: response.partiallySwaps, result2: response.perfectSwaps });
          } else {
            navigation.navigate('SwapResults', { pnrNumber, results1: null, result2: null });
          }
        } catch (error) {
          console.error("Error processing swap request:", error);
        }
      };

    const handleAddCoachBtnClick = () => {
        if (coachInput && selectedSeats.length > 0) {
          setSelectedCoaches((prevState) => ({
            ...prevState,
            [coachInput]: selectedSeats,
          }));
          setCoachInput("");
          setSelectedSeats([]);
        } else {
          Alert.alert("Please enter coach and select seats.");
        }
      };
    
      const updateSelectedCoachesInput = () => {
        const selectedCoachesArray = [];
        for (const coach in selectedCoaches) {
          selectedCoachesArray.push({ [coach]: selectedCoaches[coach] });
        }
        return JSON.stringify(selectedCoachesArray);
      };
    
      const handleCoachInputChange = (text) => {
        setCoachInput(text);
        setSelectedSeats([]);
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
    

      return (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerText}>Coach and Seat Selection</Text>
          </View>
    
          <TextInput
            style={styles.input}
            value={coachInput}
            onChangeText={handleCoachInputChange}
            placeholder="Enter coach (e.g., A1)"
          />
    
          {coachInput && (
            <>
              <Button title="Select Seats(s)" onPress={() => {}} />
              <FlatList
                data={[...Array(100).keys()]}
                numColumns={5}
                renderItem={({ item }) => {
                  const seatNumber = ("0" + (item + 1)).slice(-2);
                  return (
                    <TouchableOpacity
                      style={[
                        styles.seatCheckbox,
                        selectedSeats.includes(seatNumber) && styles.selectedSeat,
                      ]}
                      onPress={() => handleSeatCheckboxChange(seatNumber)}
                    >
                      <Text>Seat {seatNumber}</Text>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item) => item.toString()}
              />
            </>
          )}
    
          <Button title="Add Coach and Seats" onPress={handleAddCoachBtnClick} />
    
          <Text style={styles.selectedText}>Selected Coach and Seats</Text>
          <FlatList
            data={Object.entries(selectedCoaches)}
            renderItem={({ item }) => (
              <View style={styles.coachSeatContainer}>
                <Text>Coach: {item[0]}</Text>
                <Text>Seats: {item[1].join(", ")}</Text>
              </View>
            )}
            keyExtractor={(item, index) => index.toString()}
          />
    
          <View style={styles.swapButtonContainer}>
            {/* <TouchableOpacity onPress={handleOnClick}
            > */}
            <TouchableOpacity  >
              <AntDesign name="swap" size={24} color="purple" />
              <Text style={styles.swapButtonText}>Swap Request</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      );
    }
    
    const styles = StyleSheet.create({
      container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        flexGrow: 1,
      },
      header: {
        backgroundColor: '#6C63FF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 20,
      },
      headerText: {
        fontSize: 24,
        color: '#fff',
        textAlign: 'center',
        fontWeight: 'bold',
      },
      input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
      },
      seatCheckbox: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        margin: 5,
        borderRadius: 5,
        backgroundColor: '#fff',
      },
      selectedSeat: {
        backgroundColor: '#a29bfe',
      },
      selectedText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
      },
      coachSeatContainer: {
        marginBottom: 15,
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
      },
      swapButtonContainer: {
        marginTop: 30,
        alignItems: 'center',
      },
      swapButtonText: {
        color: 'purple',
        fontSize: 18,
        marginTop: 5,
      },
    });

export default SeatSelection

// const styles = StyleSheet.create({})