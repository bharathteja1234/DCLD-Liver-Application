import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PatientSearch = () => {
  const navigation = useNavigation();

  const [p_id, setPatientID] = useState('');
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [noDetailsFound, setNoDetailsFound] = useState(false); // New state variable

  const handleEnter = async () => {
    setLoading(true);
    setNoDetailsFound(false); // Reset noDetailsFound state
    try {
      const response = await fetch(`http://192.168.180.15/php/search.php?p_id=${p_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }
      const data = await response.json();
      if (data && Object.keys(data).length > 0) {
        setUserDetails(data);
      } else {
        setNoDetailsFound(true); // Set noDetailsFound to true if data is empty
        console.log('No details found:', noDetailsFound); // Logging noDetailsFound
      }
    } catch (error) {
      console.error(error);
      // Handle error gracefully, show error message to the user, etc.
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://media.istockphoto.com/id/1395436143/vector/concept-of-copywriter.jpg?s=612x612&w=0&k=20&c=bDUeALCsM_x32ks-x2pKvc-cPBYED8zfRbf5TBcnOx8=' }}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Enter Patient ID</Text>
      <TextInput
        style={styles.input}
        placeholder="Patient ID"
        onChangeText={text => setPatientID(text)}
        value={p_id}
      />
      <Button style={styles.buttonText} title="Enter" onPress={handleEnter} disabled={loading} />
      {loading && <ActivityIndicator size="large" color="#007bff" />}
      {noDetailsFound && (
        <Text style={styles.noDetailsFound}>No details found </Text>
      )}
      {userDetails && (
        <View style={styles.userDetailsContainer}>
          <Text style={styles.userDetailsTitle}>Patient Details:</Text>
          <View style={styles.userDetailsItem}>
            <Text style={styles.label}>Name:</Text>
            <Text style={styles.detailText}>{userDetails.name}</Text>
          </View>
          <View style={styles.userDetailsItem}>
            <Text style={styles.label}>Age:</Text>
            <Text style={styles.detailText}>{userDetails.age}</Text>
          </View>
         
          <View style={styles.userDetailsItem}>
            <Text style={styles.label}>Disease:</Text>
            <Text style={styles.detailText}>{userDetails.disease}</Text>
          </View>
          <View style={styles.userDetailsItem}>
            <Text style={styles.label}>Gender:</Text>
            <Text style={styles.detailText}>{userDetails.gender}</Text>
          </View>
          <View style={styles.userDetailsItem}>
            <Text style={styles.label}>Admitted On:</Text>
            <Text style={styles.detailText}>{userDetails.admittedOn}</Text>
          </View>
          <View style={styles.userDetailsItem}>
            <Text style={styles.label}>Discharged On:</Text>
            <Text style={styles.detailText}>{userDetails.dischargeOn}</Text>
          </View>
          <View style={styles.userDetailsItem}>
            <Text style={styles.label}>Contact No.:</Text>
            <Text style={styles.detailText}>{userDetails.contactNo}</Text>
          </View>
          {/* Add more user details as needed */}
          <Button style={styles.buttonText} title="Next" onPress={() => navigation.navigate('EditPatientDetailsScreen', {p_id})} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  userDetailsContainer: {
    marginTop: 20,
    padding: 20,
    borderWidth: 3,
    borderColor: '#ccc',
    borderRadius: 20,
  },
  userDetailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userDetailsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    width:300,
    borderRadius: 10,
  },
  label: {
    fontWeight: 'bold',
    marginRight: 5,
  },
  detailText: {
    flex: 1,
  },
  logo: {
    width: 400,
    height: 200,
    marginBottom: 30,
  },
  noDetailsFound: { // New style for "No details found" message
    fontSize: 16,
    color: 'red',
    marginTop: 20,
  },
  buttonText:{
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  }
});

export default PatientSearch;