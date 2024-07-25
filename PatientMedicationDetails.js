import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPills } from '@fortawesome/free-solid-svg-icons';

const PrescriptionScreen = ({ route }) => {
  const { p_id, course } = route.params;
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    fetchPrescriptions();
  }, []);

  const fetchPrescriptions = async () => {
    try {
      const response = await fetch(`http://192.168.180.15/php/Prescription.php?p_id=${p_id}&course=${course}`);
      if (!response.ok) {
        throw new Error('Failed to fetch prescriptions');
      }
      const data = await response.json();
      setPrescriptions(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch prescriptions');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Prescription for Course {course}</Text>
      <ScrollView style={styles.prescriptionList}>
        {prescriptions
          .filter(prescription => prescription.medicine || prescription.medicine_duration || prescription.frequency || prescription.guidelines)
          .map((prescription, index) => (
            <View key={index} style={styles.prescriptionItem}>
              <FontAwesomeIcon icon={faPills} size={60} style={styles.icon} />
              <View style={styles.prescriptionTextContainer}>
                <Text style={styles.labelText}>Medicine:</Text>
                <Text style={styles.fetchedText}>{prescription.medicine}</Text>
                <Text style={styles.labelText}>Duration:</Text>
                <Text style={styles.fetchedText}>{prescription.medicine_duration}</Text>
                <Text style={styles.labelText}>Frequency:</Text>
                <Text style={styles.fetchedText}>{prescription.frequency}</Text>
                <Text style={styles.labelText}>Guidelines:</Text>
                <Text style={styles.fetchedText}>{prescription.guidelines}</Text>
              </View>
            </View>
          ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    marginTop: 100,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  prescriptionList: {
    width: '80%',
    flex: 1,
  },
  prescriptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 2,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#90c1F9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
    left: 250,
  },
  prescriptionTextContainer: {
    flex: 1,
  },
  labelText: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 5,
    color:"black",
    left:-60,
  },
  fetchedText: {
    fontSize: 17,
    left:30,
    top:-22,
    color: 'white', // Lighter text color
  },
});

export default PrescriptionScreen;
