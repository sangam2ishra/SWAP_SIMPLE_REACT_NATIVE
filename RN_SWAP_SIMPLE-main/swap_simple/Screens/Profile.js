import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Modal,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import * as ImagePicker from 'expo-image-picker';
import { storage } from "../firebase"; // Using app2's storage
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateStart, updateSuccess, updateFailure, deleteUserSuccess, deleteUserFailure, signoutSuccess, deleteUserStart } from "../redux/user/userSlice";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";

export default function DashProfile() {
  const { currentUser, error, loading } = useSelector((state) => state.user);
  const [imageFile, setImageFile] = useState(null);
  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [imageFileUploadProgress, setImageFileUploadProgress] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [imageFileUploadError, setImageFileUploadError] = useState(null);
  const [updateUserSuccess, setUpdateUserSuccess] = useState(null);
  const [updateUserError, setUpdateUserError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const dispatch = useDispatch();
  const navigation = useNavigation();
  console.log("urel--",currentUser.profilePicture);
  const handleImageChange = async() => {
    // console.log("Your are there ii a ");
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Permission is required to access the image library');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 1,
  });

  if (!result.canceled) {
    setImageFile(result.assets[0]);
  }
  };

  useEffect(() => {
    if (imageFile) {
      uploadImage();
    }
  }, [imageFile]);

  const uploadImage = async () => {
    setImageFileUploading(true);
    setImageFileUploadError(null);
    const response = await fetch(imageFile.uri);
    const blob = await response.blob();
    
    // Set metadata for the file
    const metadata = {
      contentType: 'image/jpeg', 
      // or 'image/png', depending on the image type
    };
    const fileName = new Date().getTime() + imageFile.fileName;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, blob, metadata);
    //  console.log("filename--",fileName);
    //  console.log("storageRef--",storageRef);
    //  console.log("uploadTask--",uploadTask);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImageFileUploadProgress(progress.toFixed(0));
      },
      (error) => {
        console.log("error",error);
        setImageFileUploadError(
          "Could not upload image (File must be less than 2MB)"
        );
        setImageFileUploadProgress(null);
        setImageFile(null);
        setImageFileUrl(null);
        setImageFileUploading(false);
      },
      () => {

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setFormData({ ...formData, profilePicture: downloadURL });
          setImageFileUploading(false);
        });
      }
    );
  };

  const handleChange = (id, value) => {
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async () => {
    setUpdateUserError(null);
    setUpdateUserSuccess(null);

    if (Object.keys(formData).length === 0) {
      setUpdateUserError("No changes made");
      return;
    }

    if (imageFileUploading) {
      setImageFileUploadError("Please wait for image to upload");
    }

    try {
      dispatch(updateStart());
      const res = await fetch(`http://10.10.92.56:3000/api/user/update/${currentUser._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(updateFailure(data.message));
        setUpdateUserError(data.message);
      } else {
        dispatch(updateSuccess(data));
        setUpdateUserSuccess("User's profile updated successfully");
      }
    } catch (error) {
      dispatch(updateFailure(error.message));
      setUpdateUserError(error.message);
    }
  };
  const handleDeleteUser = async () => {
    setShowModal(false);
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`http://10.10.92.56:3000/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) {
        dispatch(deleteUserFailure(data.message));
      } else {
        dispatch(deleteUserSuccess(data));
        navigation.navigate('Home');
      }
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  };

  const handleSignout = async () => {
    console.log("Sign off");
    try {
      const res = await fetch(`http://10.10.92.56:3000/api/user/signout`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
        navigation.navigate('Home');
        
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text style={styles.title}>Profile</Text> */}
      <TouchableOpacity
        onPress={handleImageChange}
        style={styles.imageContainer}
      >
        {imageFileUploading && <ActivityIndicator size="large" />}
        <Image
          source={{ uri: imageFileUrl ||  currentUser.profilePicture }}
          style={styles.image}
        />
      </TouchableOpacity>
      {imageFileUploadError && (
        <Text style={styles.error}>{imageFileUploadError}</Text>
      )}

      <TextInput
        style={styles.input}
        placeholder="username"
        defaultValue={currentUser.username}
        onChangeText={(value) => handleChange("username", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="email"
        defaultValue={currentUser.email}
        onChangeText={(value) => handleChange("email", value)}
      />
      <TextInput
        style={styles.input}
        placeholder="password"
        secureTextEntry
        onChangeText={(value) => handleChange("password", value)}
      />
    <View style={styles.swapButtonContainer}>
        <TouchableOpacity onPress={handleSubmit} disabled={loading || imageFileUploading}>
          <LinearGradient
            colors={["#3B82F6", "#60A5FA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradientButton1}
          >
            <Text style={styles.swapButtonText}>Update</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      {/* <Button
        title="Update"
        onPress={handleSubmit}
        disabled={loading || imageFileUploading}
      /> */}

      <View style={styles.actions}>
        <Text style={styles.delete} onPress={() => setShowModal(true)}>
          Delete Account
        </Text>
        <Pressable onPress={handleSignout}>
        <Text style={styles.signout} >
          Sign Out
        </Text>
        </Pressable>
      </View>

      {updateUserSuccess && (
        <Text style={styles.success}>{updateUserSuccess}</Text>
      )}
      {updateUserError && <Text style={styles.error}>{updateUserError}</Text>}
      {error && <Text style={styles.error}>{error}</Text>}

      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalText}>
              Are you sure you want to delete your account?
            </Text>
            <View style={styles.modalActions}>
  <TouchableOpacity onPress={handleDeleteUser}>
    <LinearGradient
      colors={["#F87171", "#660033"]}
      style={styles.gradientButtonModal}
    >
      <Text style={styles.buttonText}>Yes, I'm sure</Text>
    </LinearGradient>
  </TouchableOpacity>
  <TouchableOpacity onPress={() => setShowModal(false)}>
    <LinearGradient
      colors={["#60A5FA", "#3B82F6"]}
      style={styles.gradientButtonModal}
    >
      <Text style={styles.buttonText}>Cancel</Text>
    </LinearGradient>
  </TouchableOpacity>
</View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 16, 
    flex: 1, 
    justifyContent: "" 
  },
 
  imageContainer: {
    alignSelf: "",
    width: 100,
    height: 100,
    borderRadius: 50, // This ensures the border and image are round
  borderWidth: 2, // This sets the thickness of the border
  borderColor: "gray",
    overflow: "hidden",
    marginBottom:6,
    // backgroundColor:"red"
  },
  image: { 
    width: "100%",
     height: "100%" 
    },
  input: { 
    borderWidth: 1, 
    padding: 8, 
    marginVertical: 8, 
    borderRadius: 8, 
    backgroundColor:'white'
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  delete: {
     color: "brown", 
     fontWeight: "bold"
     },
  signout: { 
    color: "grey", 
    fontWeight: "bold" 
  },
  success: {
     color: "green", 
     textAlign: "center", 
     marginVertical: 8 },
  error: { 
    color: "red", 
    textAlign: "center",
     marginVertical: 8
     },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: { 
    backgroundColor: "white", 
    padding: 20, borderRadius: 10 
  },
  modalText: { 
    fontSize: 16, 
    marginBottom: 16 
  },
  swapButtonContainer: {
    marginTop: 3,
    alignItems: "center",
  },
  gradientButton1: {
    padding: 1,
    paddingHorizontal:8,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  swapButtonText: {
    color: "white",
    fontSize: 16,
    // marginTop: 5,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "space-between", // Or use "center" or "flex-start" depending on your alignment preference
    marginTop: 1,
  },
  gradientButtonModal: {
    padding: 1,
    paddingHorizontal:4,
    borderRadius: 4,
    alignItems: "center",
    marginHorizontal: 8, // Adds spacing between the buttons
  },
  buttonText: {
    color: "white",
    fontSize: 12,
  },
});
