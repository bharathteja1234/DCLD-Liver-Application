import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const Sidebar = () => {
  const [profileDetails, setProfileDetails] = useState(null);

  useEffect(() => {
    fetchProfileDetails();
  }, []);

  const fetchProfileDetails = async () => {
    try {
      const response = await fetch('http://192.168.233.15/php/p_dashboard.php');
      const data = await response.json();
      if (data.success) {
        setProfileDetails(data.profile);
      } else {
        console.error('Failed to fetch profile details:', data.message);
      }
    } catch (error) {
      console.error('Error fetching profile details:', error);
    }
  };

  return (
    <View style={styles.container}>
      {profileDetails ? (
        <>
          <Text style={styles.heading}>Profile Details</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.value}>{profileDetails.name}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.value}>{profileDetails.age}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.value}>{profileDetails.gender}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Contact No:</Text>
            <Text style={styles.value}>{profileDetails.contactNo}</Text>
          </View>
          <View style={styles.detailsContainer}>
            <Text style={styles.label}>Image:</Text>
            <Image source={{ uri: profileDetails.image }} style={styles.image} resizeMode="cover" />
          </View>
        </>
      ) : (
        <Text>Loading profile details...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
    paddingTop: 50,
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  detailsContainer: {
    marginBottom: 10,
  },
  label: {
    fontWeight: 'bold',
  },
  value: {
    marginLeft: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 5,
  },
});

export default Sidebar;
