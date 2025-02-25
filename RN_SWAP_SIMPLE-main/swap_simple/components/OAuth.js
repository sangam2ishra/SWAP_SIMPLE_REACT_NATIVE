import React, { useState } from 'react';
import { Button, Pressable, Text, View, StyleSheet } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { getAuth, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../redux/user/userSlice';
import { app2 } from '../firebase'; // Make sure this points to your Firebase configuration for app2
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';

WebBrowser.maybeCompleteAuthSession();

export default function OAuth() {
    const [isPressedGoogle, setIsPressedGoogle] = useState(false);
    const auth2 = getAuth(app2);
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        clientId: 'YOUR_GOOGLE_CLIENT_ID', // Get this from your Google Cloud console.
    });

    React.useEffect(() => {
        if (response?.type === 'success') {
            const { id_token } = response.params;

            const credential = GoogleAuthProvider.credential(id_token);
            signInWithCredential(auth2, credential)
                .then(async (result) => {
                    const { user } = result;
                    // Now send the user data to your backend server
                    const res = await fetch('http://10.10.92.56:3000/api/auth/google', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            name: user.displayName,
                            email: user.email,
                            googlePhotoUrl: user.photoURL,
                        }),
                    });

                    const data = await res.json();
                    if (res.ok) {
                        dispatch(signInSuccess(data));
                        navigation.navigate('Home'); // Navigate to the home screen after successful sign-in
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }
    }, [response]);

    return (
        <View>
            <Pressable
                onPressIn={() => setIsPressedGoogle(true)}
                onPressOut={() => setIsPressedGoogle(false)}
                disabled={!request}
                onPress={() => {
                    promptAsync();
                }}
                style={[
                    styles.buttonContainer,
                    isPressedGoogle && styles.pressedButtonContainer,
                ]}
            >
                {isPressedGoogle ? (
                    <LinearGradient
                        colors={["#FF69B4", "#FF6347"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.gradientButton}
                    >
                        <Text style={styles.buttonText}>Continue with Google</Text>
                    </LinearGradient>
                ) : (
                    <Text style={styles.pressedButtonText}>Continue with Google</Text>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    buttonContainer: {
        borderRadius: 10,
        overflow: "hidden",
        marginVertical: 10,
    },
    pressedButtonContainer: {
        borderWidth: 0,
        borderColor: "#8A2BE2",
    },
    gradientButton: {
        paddingVertical: 5,
        borderRadius: 10,
        alignItems: "center",
        shadowColor: "black",
        shadowOpacity: 1,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 10,
        elevation: 4,
    },
    buttonText: {
        color: "white",
        fontSize: 18,
    },
    pressedButtonText: {
        paddingVertical: 5,
        borderRadius: 10,
        textAlign: "center",
        color: "#8A2BE2",
        fontSize: 18,
        backgroundColor: "white",
    },
});
