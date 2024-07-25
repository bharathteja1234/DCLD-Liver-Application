import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TextInput, Button, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons';

const DoctorProfile = ({ route }) => {
  const { dId } = route.params;
  const [profileData, setProfileData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [localImageUri, setLocalImageUri] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://192.168.180.15/php/doctorprofile.php?d_id=${dId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        console.log('Fetched profile data:', result);

        if (result.status && result.profile) {
          setProfileData(result.profile);
          const imageUrl = result.profile.image;
          console.log('Fetched image URL:', imageUrl);
          setProfileImage(imageUrl);
        } else {
          console.log(result.message);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();

    // Request media library permissions on mount
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    })();
  }, [dId]);

  const handleImagePick = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.status !== 'granted') {
      alert("Permission to access media library is required!");
      return;
    }

    let pickerResult = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!pickerResult.canceled) {
      console.log("Image URI: ", pickerResult.uri);
      setLocalImageUri(pickerResult.uri);
      setProfileImage(pickerResult.uri); // Update profileImage with the new image URI
    } else {
      console.log("Image picking was canceled");
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('http://192.168.180.15/php/doctorprofile.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          d_id: dId,
          doctor_name: profileData.doctor_name,
          speciality: profileData.speciality,
          gender: profileData.gender,
          contactNo: profileData.contactNo,
          image: localImageUri || profileImage,
        }),
      });

      const result = await response.json();
      if (result.status) {
        setIsEditing(false);
        alert("Profile updated successfully!");
      } else {
        console.log(result.message);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Your Profile</Text>
      </View>
      {profileData ? (
        <View style={styles.elevatedContainer}>
          <View style={styles.imageContainer}>
            <TouchableOpacity onPress={isEditing ? handleImagePick : null}>
              <View style={styles.outerCircle}>
                <View style={styles.innerCircle}>
                  <Image
                    source={{ uri: localImageUri || profileImage }}
                    style={styles.profileImage}
                  />
                </View>
              </View>
            </TouchableOpacity>
          </View>
          {isEditing ? (
            <View style={styles.textContainer}>
              <View style={styles.inputContainer}>
                <FontAwesome name="user" size={24} color="black" style={styles.icon} />
                <TextInput
                  style={styles.profileTextInput}
                  value={profileData.doctor_name}
                  onChangeText={(text) => setProfileData({ ...profileData, doctor_name: text })}
                  placeholder="Name"
                />
              </View>
              <View style={styles.inputContainer}>
                <MaterialIcons name="local-hospital" size={24} color="black" style={styles.icon} />
                <TextInput
                  style={styles.profileTextInput}
                  value={profileData.speciality}
                  onChangeText={(text) => setProfileData({ ...profileData, speciality: text })}
                  placeholder="Speciality"
                />
              </View>
              <View style={styles.inputContainer}>
                <FontAwesome name="transgender" size={24} color="black" style={styles.icon} />
                <TextInput
                  style={styles.profileTextInput}
                  value={profileData.gender}
                  onChangeText={(text) => setProfileData({ ...profileData, gender: text })}
                  placeholder="Gender"
                />
              </View>
              <View style={styles.inputContainer}>
                <FontAwesome name="phone" size={24} color="black" style={styles.icon} />
                <TextInput
                  style={styles.profileTextInput}
                  value={profileData.contactNo}
                  onChangeText={(text) => setProfileData({ ...profileData, contactNo: text })}
                  placeholder="Contact No"
                />
              </View>
              <Button title="Save" onPress={handleSave} />
            </View>
          ) : (
            <View style={styles.textContainer}>
              <Text style={styles.profileText}>Doctor ID: {profileData.d_id}</Text>
              <Text style={styles.profileText}>Name: {profileData.doctor_name}</Text>
              <Text style={styles.profileText}>Gender: {profileData.gender}</Text>
              <Text style={styles.profileText}>Contact: {profileData.contactNo}</Text>
              <Text style={styles.profileText}>Speciality: {profileData.speciality}</Text>
            </View>
          )}
          <TouchableOpacity onPress={() => setIsEditing(!isEditing)}>
            <Text style={styles.editButton}>{isEditing ? 'Cancel' : 'Edit Profile'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.profileText}>Loading...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F0',
    padding: 20,
  },
  topBar: {
    width: '110%',
    height: 120,
    marginTop: -20,
    left: -20,
    backgroundColor: '#90c1F9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 150,
    borderRadius: 30,
  },
  topBarTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
    bottom: -20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  elevatedContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  outerCircle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 5,
    borderColor: '#007bff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  innerCircle: {
    width: 230,
    height: 230,
    borderRadius: 115,
    borderWidth: 5,
    borderColor: '#90c1F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 220,
    height: 220,
    borderRadius: 110,
  },
  textContainer: {
    alignItems: 'flex-start',
    width: '100%',
    paddingHorizontal: 20,
  },
  profileText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#333',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  icon: {
    marginRight: 10,
  },
  profileTextInput: {
    fontSize: 18,
    color: '#333',
    flex: 1,
  },
  editButton: {
    fontSize: 18,
    color: '#007bff',
    marginTop: 20,
  },
});

export default DoctorProfile;
