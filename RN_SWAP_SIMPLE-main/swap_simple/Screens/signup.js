import { StatusBar } from "expo-status-bar";
import { LinearGradient } from 'expo-linear-gradient';
import { Image, Pressable,ActivityIndicator, Alert } from 'react-native';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import {
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  View,
  StyleSheet,
} from "react-native";
// import Toast from "react-native-toast-message";
import Fontisto from "@expo/vector-icons/Fontisto";
import AntDesign from "@expo/vector-icons/AntDesign";
import EvilIcons from "@expo/vector-icons/EvilIcons";
import { useCallback, useEffect, useState } from "react";
import LottieView from "lottie-react-native";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { resetError } from "../redux/user/userSlice";
import OAuth from "../components/OAuth";
const Signup = () => {
  const [isPressedSubmit, setIsPressedSubmit] = useState(false);
  const [isPressedGoogle, setIsPressedGoogle] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  console.log(errorMessage);
  // Function to show alert
  const showErrorAlert = (message) => {
    Alert.alert('Error', message, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      { text: 'OK', onPress: () => console.log('OK Pressed') },
    ]);
  };

  // useFocusEffect(
  //   useCallback(() => {
  //     dispatch(resetError());
  //     Toast.show({
  //       type: "customToast",
  //       text1: "Swap Simple",
  //       text2: "Welcome Back ",
  //       visibilityTime: 1000, // Hide after 1 second
  //     });
  //   }, [dispatch])
  // );

  useEffect(() => {
    if (errorMessage) {
      showErrorAlert(errorMessage);
    }
  }, [errorMessage]);
  
  const handleSignup=async()=>{
    console.log("Hii i am pressed");
    const formData = {
      email,
      password,
      username
    };
    console.log(email);
    console.log(password);
    console.log(username);
    if (!email || !password||!username) {
      return setErrorMessage("Please fill out all fields.");
    }
    console.log(formData);
    try {
      setLoading(true);
      setErrorMessage(null);
      // dispatch(signInStart());
      const res = await fetch("http://10.10.92.56:3000/api/auth/signup", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      
      if (!res.ok || data.success === false) {
        setLoading(false);
        return setErrorMessage(data.message);
      } else {
        // dispatch(signInSuccess(data));
        navigation.navigate("Login");
      }
    } catch (error) {
      setErrorMessage(error.message);
      setLoading(false);
    }

  };

  return (
    <View style={styles.container}>
        {/* <Toast position="top" topOffset={-20} /> */}
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
        <FontAwesome5 name="hand-holding-heart" size={40} color="#10172a" />
          <Text style={styles.headerText}>Welcome !!  </Text>
          <Text style={styles.headerText}>Please Sign In </Text>
        </View>
        <LottieView
          source={require("../assets/welcome.json")} // Your animation JSON file
          style={styles.animation}
          autoPlay
          loop
        />
      </View>

      <KeyboardAvoidingView
        style={styles.innerContainer}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
          {loading && <ActivityIndicator size="large" color="#8A2BE2" />}
        <View style={styles.footer}>
          <View style={styles.inputContainer}>
          <InputField
                icon={<AntDesign name="user" size={24} color="grey" />}
                placeholder="Enter your name"
                value={username}
                onChangeText={(text) => setUsername(text)}
              />
            {/* Email Input */}
            <InputField
              icon={<Fontisto name="email" size={24} color="grey" />}
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />

            {/* Password Input */}
            <InputField
              icon={<EvilIcons name="lock" size={30} color="red" />}
              placeholder="Enter your password"
              secureTextEntry
              value={password}
              onChangeText={(text) => setPassword(text)}
            />
          </View>

          {/* Submit Button */}
         
          <Pressable
            onPressIn={() => setIsPressedSubmit(true)}
            onPressOut={() => setIsPressedSubmit(false)}
            onPress={handleSignup}
            style={[
              styles.buttonContainer,
              isPressedSubmit && styles.pressedButtonContainer,
            ]}
          >
            {!isPressedSubmit ? (
              <LinearGradient
                colors={['#8A2BE2', '#FF1493']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.gradientButton}
              >
                <Text style={styles.buttonText}>SignUp</Text>
              </LinearGradient>
            ) : (
              <Text style={styles.pressedButtonText}>SignUp</Text>
            )}
          </Pressable>

          {/* Continue with Google Button */}
          <OAuth/>
         
        <View className="flex-row justify-between">
        <Pressable
         onPress={() => navigation.navigate("Login")}
          style={{ marginTop: 15 }}
        >
          <Text style={{ textAlign: "center", color: "gray", fontSize: 16 }}>
          Already have an account? Sign In
          </Text>
        </Pressable>
        </View>
             {/* Footer with Social Icons */}
             <View style={styles.footerIconsContainer}>
  <Text style={styles.footerTitle}>Follow Us</Text>
  <View style={styles.iconRow}>
    <AntDesign name="linkedin-square" size={24} color="white" />
    <AntDesign name="facebook-square" size={24} color="white" />
    <AntDesign name="instagram" size={24} color="white" />
    <AntDesign name="github" size={24} color="white" />
  </View>
  <Text style={styles.copyright}>
    &copy; {new Date().getFullYear()} Sangam & Rustam
  </Text>
</View>


        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const InputField = ({
  icon,
  placeholder,
  secureTextEntry = false,
  value,
  onChangeText,
}) => (
  <View style={styles.inputField}>
    {icon}
    <TextInput
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      style={styles.textInput}
      value={value}
      onChangeText={onChangeText}
    />
  </View>
);

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    flex: 1/4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginTop: 50,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerText: {
    color: "black",
    fontSize: 20,
    fontWeight:"bold"
  },
  animation: {
    width: 200,
    height: 200,
  },
  footer: {
    flex: 1,
    backgroundColor: '#10172a',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
    elevation: 0,
    shadowColor: 'red',
    shadowOpacity: 1,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
  
  },
  inputContainer: {
    flexDirection: "column",
    marginVertical: 20,
  },
  inputField: {
    flexDirection: "row",
    alignItems: "center",
    height: 50,
    borderRadius: 18,
    backgroundColor: "#f0f0f0",
    paddingHorizontal: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 3,
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
  },
  buttonContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    marginVertical:5,
  },
  pressedButtonContainer: {
    borderWidth: 0,
    borderColor: '#8A2BE2',
  },
  gradientButton: {
    paddingVertical: 5,
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
    fontSize: 18,
  },
  pressedButtonText: {
    paddingVertical: 5,
    borderRadius: 5,
    textAlign: 'center',
    color: '#8A2BE2',
    fontSize: 18,
    backgroundColor: 'white',
  },
  footerIconsContainer: {
    position: 'absolute',  
    bottom: 0,            
    width: '100%',        
    backgroundColor: '#10172a',  
    paddingVertical: 4,
    paddingHorizontal: 20,
  },
  footerTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 10,
    color: 'white',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  copyright: {
    color: 'white',
    textAlign: 'center',
  },
});

export default Signup

