import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Button } from 'react-native'; // You can use any button library you prefer
import { LinearGradient } from 'expo-linear-gradient';
// import { HiOutlineArrowRight } from 'react-icons/hi';
import { useNavigation } from "@react-navigation/native";
import Ionicons from '@expo/vector-icons/Ionicons';
import GradientButton from './GradientButton';
const  PnrCard=({travel,type})=> {
  console.log("Inside pnr Card");
  console.log(travel);
  const nonConfirmedStatuses = ['RAC', 'GNWL', 'PQWL'];
  // const nonConfirmedStatuses = ['WL', 'RLWL', 'RAC', 'GNWL', 'PQWL'];
  const navigation = useNavigation();
  // Check if any passenger has a non-confirmed status
  const isNotConfirmed = travel.passengerInfo.some(passenger =>
    nonConfirmedStatuses.includes(passenger.currentCoach)
  );

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.headerText}>PNR : {travel.pnrNo}</Text>

        <LinearGradient

          colors={['grey', 'grey', 'grey',"#404040"]}

          style={styles.gradientBackground}
        >
         <Text style={styles.gradientText}>
            {isNotConfirmed ? 'Your Ticket is Not Confirmed' : 'Your Ticket is Confirmed'}
          </Text>
        </LinearGradient>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Train Name:</Text>
          <Text style={styles.infoValue}>
            {travel.trainInfo.name} ({travel.trainInfo.trainNo})
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Boarding:</Text>
          <Text style={styles.infoValue}>{travel.trainInfo.boarding}</Text>
          <Text style={styles.infoLabel}>Destination:</Text>
          <Text style={styles.infoValue}>{travel.trainInfo.destination}</Text>
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>Date: {travel.trainInfo.dt}</Text>
        </View>

        <LinearGradient

          colors={['grey', 'grey', 'grey',"#404040"]}

          style={styles.passengerInfoContainer}
        >
          <Text style={styles.passengerHeader}>Passenger Info:</Text>
          {travel.passengerInfo.map((passenger, index) => (
            <Text key={index} style={styles.passengerText}>
              Passenger {index + 1}: Coach {passenger.currentCoach}, Berth No.{' '}
              {passenger.currentBerthNo}
            </Text>
          ))}
        </LinearGradient>
<<<<<<< Updated upstream

        <Button
         title={isNotConfirmed ? 'Ticket Not Confirmed' : 'Go For Swap'}

         color={isNotConfirmed ? '#ff5c33' : '#4d79ff'} // Red color for not confirmed

          disabled={isNotConfirmed}
          buttonStyle={styles.swapButton}
          iconRight
          icon={<HiOutlineArrowRight size={24} />}
          onPress={() => navigation.navigate("SeatSelection", { pnrNumber: travel.pnrNo })}
        />
=======
        <GradientButton
        onPress={() => navigation.navigate("SeatSelection", { pnrNumber: travel.pnrNo })}
        icon={<Ionicons name="arrow-forward-circle" size={24} color="white" />}
        text='Go For Swap'
        isNotConfirmed={isNotConfirmed} // Pass the isNotConfirmed prop
      />
>>>>>>> Stashed changes
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: 'white',
    shadowOpacity: 0.5,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 6,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  gradientBackground: {
    padding: 6,
    alignItems: 'center',
    borderRadius: 8,
  },
  gradientText: {
    color: '#fff',
    fontSize: 14,
  },
  infoRow: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  infoLabel: {
    fontSize: 14,
    color: '#333',
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  dateContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  passengerInfoContainer: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    
  },
  passengerHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  passengerText: {
    fontSize: 16,
    marginVertical: 4,
    color: '#fff',
  },
  swapButton: {
    backgroundColor: '#7F00FF',
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
});
export default PnrCard;