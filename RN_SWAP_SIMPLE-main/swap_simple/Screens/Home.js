import { StatusBar } from "expo-status-bar";
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
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import PnrCard from "./components/PnrCard";
import PnrCard from './../components/PnrCard';
import { setTravelID } from "../redux/user/userSlice";

const { width, height } = Dimensions.get("window"); // Get screen dimensions

const Home=()=>{
  const { currentUser } = useSelector((state) => state.user);
  const [pnr, setPnr] = useState('');
  const [success, setSuccess] = useState(false);
  const [travel, setTravel] = useState({});
  const [loading, setLoading] = useState(false);
  const pnrCardRef = useRef();

  const dispatch=useDispatch();

//   const scrollUp=()=>{
//     window.scrollTo({
//         top:420,
//         behavior:"smooth"
//     })
// }

    const handleSubmit=async()=>{
      console.log(pnr);
      setLoading(true);
      try{
      setSuccess(false);
      const res = await fetch(`http://10.10.92.56:3000/api/pnr/${pnr}?userId=${currentUser._id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        console.log("listen---******",data.travel);
       
        setLoading(false);
        setTravel(data.travel);
        console.log(data.travel._id);
        // Scroll to the section where PnrCard is displayed
        dispatch(setTravelID({ travel__Id: data.travel._id }));
        console.log(data.travel._id);
        console.log("Travel before navigate -----");
        console.log(travel);
        setSuccess(true);
        // scrollUp();
       
      } else {
        setLoading(false);
        console.log('Request failed with status:', res.status);
      }
    } catch (error) {
      setLoading(false);
      console.log('Error:', error);
    }

    } ;

  // console.log("User",currentUser);
  // const handlePress = () => {
  //   console.log("Hii i am preeseed");
  //   // navigation.navigate("Notifications");
  // };
  const [pressed, setPressed] = useState(false);

  return (
    <>
    {/* <PnrCard/> */}
  
    <View style={styles.container}>
      <View style={styles.imageContainer}>
   
        {/* Background Image */}
        <ImageBackground
          source={require("../assets/home1.jpg")}
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
                value={pnr}
                onChangeText={(text)=>setPnr(text)}
              />
<<<<<<< Updated upstream
             <Pressable
                onPressIn={() => setPressed(true)}
                onPressOut={() => setPressed(false)}
                onPress={handleSubmit}
                style={[
                  styles.buttonContainer,
                  pressed && styles.pressedButtonContainer,
                ]}
              >
                {!pressed ? (
                  <LinearGradient

                    colors={['grey', 'grey', 'grey']} 


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
=======
                <Pressable
                  onPressIn={() => setPressed(true)}
                  onPressOut={() => setPressed(false)}
                  onPress={currentUser ? handleSubmit : null}
                  style={[
                    styles.buttonContainer,
                    pressed && styles.pressedButtonContainer,
                    { opacity: currentUser ? 1 : 0.5 } // Change opacity based on user state
                  ]}
                >
                  {!pressed ? (
                    <LinearGradient
                      colors={['grey', 'grey', 'grey']}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={styles.gradientButton}
                    >
                      <Text style={styles.buttonText}>
                        {currentUser ? "Know Your PNR Status" : "Please log in"}
                      </Text>
                    </LinearGradient>
                  ) : (
                    <Text style={styles.pressedButtonText}>
                      {currentUser ? "Know Your PNR Status" : "Please log in"}
                    </Text>
                  )}
                </Pressable>
>>>>>>> Stashed changes
            </LinearGradient>
          </LinearGradient>
        </ImageBackground>
      </View>

      {/* Below section for PNR details */}
      <View style={styles.detailsContainer}>
        {/* PNR Details card (implementation pending) */}
        {loading && <ActivityIndicator size="large" color="#8A2BE2" />}
        {success&&(<PnrCard travel={travel} type='PnrConfirm' />)}
        {/* <View style={styles.card}>
          <Button
            onPress={() => navigation.navigate("Notifications")}
            title="Check PNR Status"
            color="#000"
          />
        </View> */}
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

    backgroundColor: "#e6e6e6",

    borderWidth: 1,
    width: "100%",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    textAlign: "center",
    height: 50,

    color:"black",

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

    borderRadius: 4,

    overflow: 'hidden',
    marginVertical:10,
  },
  pressedButtonContainer: {
    borderWidth: 0,
    borderColor: '#8A2BE2',
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

export default Home;
