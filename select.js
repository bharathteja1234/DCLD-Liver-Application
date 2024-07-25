import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import DoctorLogin from './doctorlogin.js';
import { NavigationContainer, useNavigation } from '@react-navigation/native';

const RoleSelectionScreen = () => {
  const navigation = useNavigation();
  const [selectedRole, setSelectedRole] = useState(null); // Define selectedRole state
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  if (!isReady) {
    return null; // or loading indicator
  }

  return (
    <View style={styles.container}>
      <Image
        style={styles.image} 
        source={{ uri: 'https://images.squarespace-cdn.com/content/v1/6461137574dccf6fafa0d2b2/b4151b9b-8eb7-445a-b2ca-30c707d5c09b/SMC+logo.png' }}
      />
      <Text style={styles.title}>Select Your Role</Text>
      <TouchableOpacity
        style={[styles.roleButton, selectedRole === 'doctor' && styles.selected]}
        onPress={() => {
          setSelectedRole('doctor'); // Set selected role
          navigation.navigate('DoctorLogin'); // Navigate to DoctorLogin screen
        }}
      >
        <Text style={styles.buttonText}>Doctor</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.roleButton, selectedRole === 'patient' && styles.selected]}
        onPress={() => {
            setSelectedRole('doctor'); // Set selected role
          navigation.navigate('PatientLogin'); 
        }}
      >
        <Text style={styles.buttonText}>Patient</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  roleButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 20,
    marginVertical: 10,
    paddingVertical: 20,
    width: 200,
    alignItems: 'center',
  },
  selected: {
    backgroundColor: '#007bff',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
});

const App = () => {
  return (
    <NavigationContainer>
      <RoleSelectionScreen />
    </NavigationContainer>
  );
};

export default RoleSelectionScreen;
