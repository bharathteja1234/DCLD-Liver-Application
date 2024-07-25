import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Feather from 'react-native-vector-icons/Feather';

const MedicationScreen = ({ route }) => {
  const { p_id } = route.params;
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
      setMedications(data);
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to fetch medications');
    }
  };

  const handleAddCourse = async () => {
    try {
      const courseNumber = medications.length + 1;
      const startDay = (courseNumber - 1) * 15 + 1;
      const endDay = courseNumber * 15;
      const newCourse = { course: `${courseNumber}`, duration: `${startDay}-${endDay} days` };

      const response = await fetch('http://192.168.180.15/php/medication.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ p_id, ...newCourse }),
      });

      if (!response.ok) {
        throw new Error('Failed to add new course');
      }

      const data = await response.json();
      setMedications([...medications, data]);
      Alert.alert('Success', 'New course added successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to add new course');
    }
  };

  const handleDeleteCourse = async (course) => {
    try {
      const response = await fetch('http://192.168.180.15/php/medication.php', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ p_id, course }),
      });

      if (!response.ok) {
        throw new Error('Failed to delete course');
      }

      setMedications(medications.filter(med => med.course !== course));
      Alert.alert('Success', 'Course deleted successfully');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to delete course');
    }
  };

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
          <View key={index} style={styles.medicationItem}>
            <TouchableOpacity
              onPress={() => navigation.navigate('PrescriptionScreen', { p_id, course: medication.course })}
              style={styles.courseButton}
            >
              <Text>{`Course ${medication.course}`}</Text>
              <Text>{`Duration: ${medication.duration}`}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDeleteCourse(medication.course)}>
              <Feather name="trash-2" size={20} color="black" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
      <TouchableOpacity style={styles.addButton} onPress={handleAddCourse}>
        <Text style={styles.buttonText}>Add New Course</Text>
      </TouchableOpacity>
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
    marginTop: 100,
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  medicationList: {
    width: '80%',
    paddingBottom: 20,
  },
  medicationItem: {
    padding: 10,
    borderWidth: 4,
    marginTop: 10,
    borderColor: '#90c1F9',
    borderRadius: 10,
    marginBottom: 10,
    height: 60,
    width: 300,
    backgroundColor: '#90c1F9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 3, height: 5 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 10,
  },
  courseButton: {
    flex: 1,
    paddingRight: 10,
  },
  addButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    position: 'absolute',
    bottom: 20,
  },
  buttonText: {
    fontSize: 18,
    color: '#ffffff',
  },
});

export default MedicationScreen;
