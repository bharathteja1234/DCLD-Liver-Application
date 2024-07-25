import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import LogoutNotification from './LogoutNotification'; // Adjust the import path as needed

const DoctorDashboard = ({ navigation, route }) => {
  const { dId } = route.params;
  const [isQuestionnaireVisible, setIsQuestionnaireVisible] = useState(false);
  const [isLogoutNotificationVisible, setIsLogoutNotificationVisible] = useState(false);
  const slideAnimation = new Animated.Value(0);

  const toggleQuestionnaire = () => {
    setIsQuestionnaireVisible(!isQuestionnaireVisible);
    Animated.timing(slideAnimation, {
      toValue: isQuestionnaireVisible ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  const handleAddPatient = () => {
    navigation.navigate('AddPatientDetails');
  };

  const handleViewModifyPatient = (patientId) => {
    navigation.navigate('PatientSearch', { patientId });
  };

  const handleLogout = () => {
    setIsLogoutNotificationVisible(true);
  };

  const handleConfirmLogout = () => {
    setIsLogoutNotificationVisible(false);
    // Handle the actual logout logic here
    navigation.navigate('DoctorLogin');
  };

  const handleCancelLogout = () => {
    setIsLogoutNotificationVisible(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.colorBox} />
      <Animated.Image
        source={{ uri: 'https://mhealthintelligence.com/images/site/features/2016-10-25-interstate-licensure.png' }}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.heading}>Doctor Dashboard</Text>
      <TouchableOpacity
        style={styles.profileIcon}
        onPress={() => {
          console.log('Navigating to profile with dId:', dId);
          navigation.navigate('DoctorProfile', { dId });
        }}
      >
        <Feather name="user" size={30} color="black" />
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddPatient}>
          <Feather name="user-plus" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Add New Patient Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handleViewModifyPatient}>
          <Feather name="edit" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>View/Modify Patient Details</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('QuestionScreen')}>
          <Feather name="clipboard" size={24} color="white" style={styles.buttonIcon} />
          <Text style={styles.buttonText}>Questionnaires</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.notificationIcon} onPress={() => navigation.navigate('DoctorNotification')}>
        <Feather name="bell" size={30} color="black" />
      </TouchableOpacity>
      <View style={styles.iconContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('DoctorDashboard')}>
          <Feather name="home" size={30} color='black' />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('PatientSearch')}>
          <Feather name="search" size={30} color="black" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleLogout}>
          <Feather name="log-out" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <LogoutNotification
        visible={isLogoutNotificationVisible}
        onConfirm={handleConfirmLogout}
        onCancel={handleCancelLogout}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 100,
  },
  colorBox: {
    width: '110%',
    height: 130,
    backgroundColor: '#9FCBFB',
    borderRadius: 35,
    marginBottom: -50,
    top: -100,
  },
  logo: {
    width: 600,
    height: 200,
    marginTop: 20,
    marginBottom: 30,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    top: -360,
  },
  profileIcon: {
    top: -405,
    left: -180,
  },
  buttonContainer: {
    width: '90%',
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#ffff',
    alignItems: 'center',
    marginBottom: 20,
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#007bff',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 10,
  },
  buttonIcon: {
    marginRight: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  notificationIcon: {
    position: 'absolute',
    top: -30,
    right: 30,
  },
  iconContainer: {
    width: '100%',
    padding: 15,
    height: 70,
    borderRadius: 20,
    backgroundColor: '#9FCBFB',
    flexDirection: 'row',
    justifyContent: 'space-around',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 5,
    position: 'absolute',
    bottom: 20,
    marginBottom: 10,
  },
  icon: {
    marginHorizontal: 20,
  },
});

export default DoctorDashboard;
