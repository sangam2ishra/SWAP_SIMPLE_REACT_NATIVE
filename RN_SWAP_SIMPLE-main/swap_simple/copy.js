import { StatusBar } from "expo-status-bar";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import {
  Button,
  ImageBackground,
  TextInput,
  View,
  Dimensions,
  StyleSheet,
  Pressable,
  Text,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import MyButton from "./components/MyButton";
import { useState } from "react";
// import PnrCard from "./components/PnrCard";

const { width, height } = Dimensions.get("window"); // Get screen dimensions

function HomeScreen({ navigation }) {
  const handlePress = () => {
    console.log("Hii i am preeseed");
    // navigation.navigate("Notifications");
  };
  const [pressed, setPressed] = useState(false);

  const isUserLoggedIn = false; 
  return (
    <>
    {/* <PnrCard/> */}
  
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        {/* Background Image */}
        <ImageBackground
          source={require("./assets/home1.jpg")}
          style={styles.image}
          resizeMode="cover"
        >
          {/* Linear Gradient with PNR Input on top of Image */}
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0)']}
            style={styles.overlay}
          >
            <LinearGradient
              colors={['black', 'rgba(0,0,0,0.6)', 'black']} // Gradient from indigo to pink
              start={[0, 0]}
              end={[1, 0]}
              style={styles.inputWrapper}
            >
              <TextInput
                style={styles.input}
                placeholder="PNR input..."
                placeholderTextColor="#000"
              />
              {/* <Button
                onPress={() => navigation.navigate("Notifications")}
                title="Please Log-in"
                color=""
                className="bg-slate-300"
              /> */}
             <Pressable
            onPressIn={() => setPressed(true)}
            onPressOut={() => setPressed(false)}
            onPress={handlePress}
            style={[
              styles.buttonContainer,
              pressed && styles.pressedButtonContainer,
            ]}
          >
            {!pressed ? (
              <LinearGradient
              colors={['grey', 'rgba(0,0,0,0.6)', 'grey']} 
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>Know Your Pnr Status</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.pressedButtonText}>Know Your Pnr Status</Text>
            )}
          </Pressable>
    {/* </View> */}
            </LinearGradient>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Below section for PNR details */}
      <View style={styles.detailsContainer}>
        {/* PNR Details card (implementation pending) */}
        <View style={styles.card}>
          <Button
            onPress={() => navigation.navigate("Notifications")}
            title="Check PNR Status"
            color="#000"
          />
        </View>
      </View>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    height: height * 0.3, // Adjust image height
    width: width, // Full width of the screen
  },
  image: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: '100%',
  },
  inputWrapper: {
    padding: 0,
    borderRadius: 10,
    width: '90%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    borderColor: "#374151",
    backgroundColor: "#374151",
    borderWidth: 1,
    width: "100%",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    textAlign: "center",
    height: 50,
    color:"white",
  },
  detailsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1e293b", // Dark background
  },
  card: {
    backgroundColor: "#4f46e5",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    alignItems: "center",
  },
  buttonContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical:10,
    // paddingHorizontal:6,
  },
  pressedButtonContainer: {
    borderWidth: 0,
    borderColor: '#8A2BE2',
    // paddingHorizontal:6,
  },
  gradientButton: {
    paddingVertical: 0,
    paddingHorizontal:6,
    borderRadius: 0,
    alignItems: 'center',
    shadowColor: 'black',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 4,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
  pressedButtonText: {
    paddingVertical: 0,
    paddingHorizontal:6,
    borderRadius: 0,
    textAlign: 'center',
    color: '#8A2BE2',
    fontSize: 16,
    backgroundColor: 'white',
  },
});

function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Button onPress={() => navigation.goBack()} title="Go back home" />
    </View>
  );
}

const Drawer = createDrawerNavigator();
export default function App() {
  return (
    <NavigationContainer>
      <Drawer.Navigator initialRouteName="Home">
        <Drawer.Screen name="Home" component={HomeScreen} />
        <Drawer.Screen name="Notifications" component={NotificationsScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
}
