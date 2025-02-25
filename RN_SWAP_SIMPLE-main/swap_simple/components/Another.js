import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert,Dimensions , TouchableOpacity, StyleSheet, FlatList, ScrollView } from "react-native";
import LottieView from 'lottie-react-native'; // Import LottieView for animation
import { AntDesign } from '@expo/vector-icons'; // Vector icon import

const { width: screenWidth } = Dimensions.get('window');
const animationHeight = screenWidth * (250 / 375);
const SeatSelection = () => {
    const [selectedCoaches, setSelectedCoaches] = useState({});
    const [coachInput, setCoachInput] = useState("");
    const [selectedSeats, setSelectedSeats] = useState([]);
    const [suggestedCoaches, setSuggestedCoaches] = useState([]);

    const coachSuggestions = {
        A: ["A1", "A2", "A3", "A4", "A5"],
        S: ["S1", "S2", "S3", "S4", "S5"],
        B: ["B1", "B2", "B3", "B4", "B5"],
    };

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
            ListHeaderComponent={() => (
                <>
                    <LottieView
                        source={require("../assets/Animation - 1726545977021.json")} // Your animation JSON file
                        style={styles.fullScreenAnimation}
                        autoPlay
                        loop
                    />
                    <TextInput
                        style={styles.input}
                        value={coachInput}
                        onChangeText={handleCoachInputChange}
                        placeholder="Enter coach (e.g., A1)"
                    />

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
                            <Button title="Select Seats(s)" onPress={() => {}} />
                            <ScrollView horizontal={true}>
                                <FlatList
                                    data={[...Array(100).keys()]} // seat numbers 01 to 100
                                    numColumns={10}
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
                            </ScrollView>
                        </>
                    )}

                    <Button title="Add Coach and Seats" onPress={handleAddCoachBtnClick} />

                    <Text style={styles.selectedText}>Selected Coach and Seats</Text>
                </>
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
                    <TouchableOpacity>
                        <AntDesign name="swap" size={24} color="purple" />
                        <Text style={styles.swapButtonText}>Swap Request</Text>
                    </TouchableOpacity>
                </View>
            )}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        flexGrow: 1,
    },
    fullScreenAnimation: {
        flex: 0,
        width: "100%",  // Full width
        height: animationHeight,
        marginBottom: 10, // Less margin
        marginTop:-50,

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
    suggestion: {
        backgroundColor: '#ececec',
        padding: 5,
        marginRight: 5,
        borderRadius: 5,
        color: '#333',
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
    coachSeatHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    coachText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    seatsText: {
        marginTop: 5,
        fontSize: 14,
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

export default SeatSelection;
