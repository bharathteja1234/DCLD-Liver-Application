import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ImageBackground } from 'react-native';

const ProfileScreen = ({ route }) => {
  const { p_id } = route.params;
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`http://192.168.180.15/php/p_dashboard.php?p_id=${p_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ p_id }),
        });

        const result = await response.json();
        console.log('Fetched profile data:', result);

        if (result.status) {
          console.log('Full Image URL:', `http://192.168.180.15/php/${result.profile.image}`);
          setProfileData(result.profile);
        } else {
          console.log(result.message);
        }
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [p_id]);

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Profile</Text>
      </View>
      {profileData ? (
        <View style={styles.elevatedContainer}>
          <View style={styles.imageContainer}>
            <View style={styles.outerCircle}>
              <View style={styles.innerCircle}>
                <Image 
                  source={{ uri: `http://192.168.180.15/php/${profileData.image}` }} 
                  style={styles.profileImage} 
                />
              </View>
            </View>
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.profileText}>Patient ID: {profileData.p_id}</Text>
            <Text style={styles.profileText}>Name: {profileData.name}</Text>
            <Text style={styles.profileText}>Age: {profileData.age}</Text>
            <Text style={styles.profileText}>Gender: {profileData.gender}</Text>
            <Text style={styles.profileText}>Contact: {profileData.contactNo}</Text>
          </View>
        </View>
      ) : (
        <Text style={styles.profileText}>Loading...</Text>
      )}
      <ImageBackground 
        source={{ uri: 'https://png.pngtree.com/background/20210711/original/pngtree-nurse-s-day-blue-cartoon-medical-doctor-banner-picture-image_1129257.jpg' }} 
        style={styles.backgroundImage}
      />
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
  backgroundImage: {
    width: '107%',
    height: 200,
    position: 'absolute',
    bottom: 0,
    left: -20,
  },
});

export default ProfileScreen;
