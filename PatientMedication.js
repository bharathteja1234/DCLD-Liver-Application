import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { FontAwesomeIcon } from '@fortawesome/react-native-fontawesome';
import { faPrescriptionBottle } from '@fortawesome/free-solid-svg-icons';

const MedicationScreen = ({ route }) => {
  const { p_id } = route.params; // Assuming p_id is passed via navigation params
  const [medications, setMedications] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchMedications();
  }, []);

  const fetchMedications = async () => {
    try {
      const response = await fetch(`http://192.168.180.15/php/medication.php?p_id=${p_id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch medications');
      }
      const data = await response.json();
      setMedications(data); // Assuming data is an array of medications [{ course, duration }, ...]
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch medications');
    }
  };

  // Handling case where medications is undefined or not an array
  if (!medications || !Array.isArray(medications)) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Medication Courses</Text>
      <ScrollView contentContainerStyle={styles.medicationList}>
        {medications.map((medication, index) => (
          <View key={index} style={index % 2 === 0 ? styles.medicationItemLeft : styles.medicationItemRight}>
            <TouchableOpacity
              style={styles.medicationItem}
              onPress={() => navigation.navigate('MedicationDetails', { p_id, course: medication.course })}
            >
              <View style={styles.medicationText}>
                <FontAwesomeIcon icon={faPrescriptionBottle} size={26} style={styles.icon} />
                <Text style={styles.courseText}>{`Course ${medication.course}`}</Text>
              </View>
              <Text style={styles.durationText}>{`Duration: ${medication.duration}`}</Text>
            </TouchableOpacity>
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
    justifyContent: 'flex-start',
    backgroundColor: '#ffffff',
    paddingTop: 20,
  },
  title: {
    marginTop: 60,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  medicationList: {
    width: '100%',
    paddingBottom: 20,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  medicationItem: {
    padding: 10,
    borderWidth: 2,
    borderColor: '#90c1F9',
    borderRadius: 10,
    marginBottom: 10,
    backgroundColor: '#90c1F9',
    shadowColor: 'black',
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 10,
    width: '100%',
  },
  medicationItemLeft: {
    width: '48%',
    marginBottom: 10,
  },
  medicationItemRight: {
    width: '48%',
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  medicationText: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  icon: {
    marginRight: 10,
    top:10,
  },
  courseText: {
    fontSize: 16,
  },
  durationText: {
    fontSize: 14,
    color: '#555',
    left:35,
  },
});

export default MedicationScreen;
